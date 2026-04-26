import { mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const defaultUrl = 'http://127.0.0.1:5173/proposal-template';
const defaultOutput = resolve(root, 'proposals/sabifi-river-resort-digital-growth-content-proposal.pdf');

const url = process.argv[2] || defaultUrl;
const outputPath = resolve(root, process.argv[3] || defaultOutput);
const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const debuggingPort = 9231;
const profilePath = resolve(root, `.tmp/chrome-proposal-export-${process.pid}-${Date.now()}`);

let messageId = 0;

async function wait(ms) {
    return new Promise((resolveWait) => setTimeout(resolveWait, ms));
}

async function waitForJsonEndpoint(endpoint, attempts = 80) {
    let lastError;

    for (let index = 0; index < attempts; index += 1) {
        try {
            const response = await fetch(endpoint);
            if (response.ok) {
                return response.json();
            }
        } catch (error) {
            lastError = error;
        }

        await wait(125);
    }

    throw lastError || new Error(`Timed out waiting for ${endpoint}`);
}

function connectToCdp(webSocketDebuggerUrl) {
    const socket = new WebSocket(webSocketDebuggerUrl);
    const pending = new Map();

    socket.addEventListener('message', (event) => {
        const payload = JSON.parse(event.data);
        if (!payload.id || !pending.has(payload.id)) {
            return;
        }

        const { resolve: resolvePending, reject } = pending.get(payload.id);
        pending.delete(payload.id);

        if (payload.error) {
            reject(new Error(payload.error.message));
            return;
        }

        resolvePending(payload.result);
    });

    return new Promise((resolveConnect, rejectConnect) => {
        socket.addEventListener('open', () => {
            resolveConnect({
                send(method, params = {}) {
                    messageId += 1;
                    const id = messageId;
                    socket.send(JSON.stringify({ id, method, params }));

                    return new Promise((resolveSend, rejectSend) => {
                        pending.set(id, { resolve: resolveSend, reject: rejectSend });
                    });
                },
                close() {
                    socket.close();
                },
            });
        });

        socket.addEventListener('error', rejectConnect, { once: true });
    });
}

async function main() {
    await rm(profilePath, { force: true, recursive: true });
    await mkdir(profilePath, { recursive: true });
    await mkdir(dirname(outputPath), { recursive: true });

    const chrome = spawn(chromePath, [
        '--headless',
        '--disable-gpu',
        '--no-sandbox',
        `--remote-debugging-port=${debuggingPort}`,
        `--user-data-dir=${profilePath}`,
        '--hide-scrollbars',
        '--no-first-run',
        '--no-default-browser-check',
        url,
    ], {
        stdio: ['ignore', 'ignore', 'pipe'],
    });

    let stderr = '';
    chrome.stderr.on('data', (chunk) => {
        stderr += chunk.toString();
    });

    try {
        const targets = await waitForJsonEndpoint(`http://127.0.0.1:${debuggingPort}/json/list`);
        const page = targets.find((target) => target.type === 'page') || targets[0];

        if (!page?.webSocketDebuggerUrl) {
            throw new Error('Could not find a Chrome page target for PDF export.');
        }

        const cdp = await connectToCdp(page.webSocketDebuggerUrl);
        await cdp.send('Page.enable');
        await cdp.send('Runtime.enable');
        await cdp.send('Emulation.setEmulatedMedia', { media: 'print' });
        await cdp.send('Page.bringToFront');
        await cdp.send('Page.navigate', { url });
        await cdp.send('Runtime.evaluate', {
            expression: `
                new Promise((resolve) => {
                    if (document.readyState === 'complete') {
                        resolve(true);
                        return;
                    }
                    window.addEventListener('load', () => resolve(true), { once: true });
                })
            `,
            awaitPromise: true,
        });
        await cdp.send('Runtime.evaluate', {
            expression: 'document.fonts ? document.fonts.ready.then(() => true) : true',
            awaitPromise: true,
        });
        await cdp.send('Runtime.evaluate', {
            expression: 'new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))',
            awaitPromise: true,
        });

        if (process.env.PROPOSAL_DEBUG_PRINT === '1') {
            const metrics = await cdp.send('Runtime.evaluate', {
                expression: `JSON.stringify({
                    pageCount: document.querySelectorAll('.proposal-page').length,
                    scrollHeight: document.documentElement.scrollHeight,
                    bodyScrollHeight: document.body.scrollHeight,
                    templateHeight: document.querySelector('.proposal-template')?.getBoundingClientRect().height,
                    pageHeights: Array.from(document.querySelectorAll('.proposal-page')).map((page) => page.getBoundingClientRect().height),
                    bodyDisplay: getComputedStyle(document.body).display
                })`,
            });

            console.log(metrics.result.value);
        }

        const pdf = await cdp.send('Page.printToPDF', {
            displayHeaderFooter: false,
            landscape: false,
            marginBottom: 0,
            marginLeft: 0,
            marginRight: 0,
            marginTop: 0,
            paperHeight: 8.5,
            paperWidth: 11,
            preferCSSPageSize: true,
            printBackground: true,
            scale: 1,
        });

        await writeFile(outputPath, Buffer.from(pdf.data, 'base64'));
        cdp.close();
    } finally {
        chrome.kill('SIGTERM');
        setTimeout(() => {
            rm(profilePath, { force: true, recursive: true }).catch(() => {});
        }, 500);
    }

    console.log(`Exported ${outputPath}`);
    if (stderr.trim()) {
        console.warn(stderr.trim());
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
