const ACTIVE_ATTR     = 'data-people-collection-content-active';
const ACTIVE_SELECTOR = `[${ACTIVE_ATTR}]`;
const TAB_SELECTOR    = '[data-people-collection-content-tab]';
const PANE_SELECTOR   = '[data-people-collection-content-pane]';

function mayViewTransition(cb) {
	document.startViewTransition && window.matchMedia('(prefers-reduced-motion: no-preference)').matches
		? document.startViewTransition(cb)
		: cb();
}

function getActivePane( root ) {
	return root.querySelector(PANE_SELECTOR + ACTIVE_SELECTOR);
}

function getActiveTab( root ) {
	return root.querySelector(TAB_SELECTOR + ACTIVE_SELECTOR);
}

function findPaneById(root, id) {
	return root.querySelector('#' + id);
}

function handleLinkClick(root, e) {
	e.preventDefault();
	const link = e.target.closest('a');
	if (link) setActive(root, link);
}

function initTabbedContent( root ) {
	const tabs = root.querySelectorAll(TAB_SELECTOR);
	if (!tabs.length) return;

	tabs.forEach((tab) => {
		const link = tab.querySelector('a');
		if (link) {
			link.addEventListener('click', (e) => handleLinkClick(root, e));
		}
	});
}

function setActive(root, link) {
	const tab = link.closest(TAB_SELECTOR);
	if (!tab || tab.hasAttribute(ACTIVE_ATTR)) return;
	const targetId = link.href.split('#')[1];

	mayViewTransition(() => {
		const targetPane  = findPaneById(root, targetId);
		const currentPane = getActivePane(root);

		const currentTab  = getActiveTab(root);

		if (currentTab) {
			currentTab.removeAttribute(ACTIVE_ATTR);
		}
		tab.setAttribute(ACTIVE_ATTR, '');

		if (currentPane) {
			currentPane.removeAttribute(ACTIVE_ATTR);
			currentPane.setAttribute('hidden', '');
		}

		if (targetPane) {
			targetPane.setAttribute(ACTIVE_ATTR, '');
			targetPane.removeAttribute('hidden');
		}

		if (currentPane) {
			root.dispatchEvent(
				new CustomEvent('toggle', {
					detail: { item: currentPane, action: 'deactivate' },
				})
			);
		}
		if (targetPane) {
			root.dispatchEvent(
				new CustomEvent('toggle', {
					detail: { item: targetPane, action: 'activate' },
				})
			);
		}
	});
}

document.addEventListener('DOMContentLoaded', () => {
	document.querySelectorAll('.sphc-people-collection').forEach( (root) => initTabbedContent(root) );
});
