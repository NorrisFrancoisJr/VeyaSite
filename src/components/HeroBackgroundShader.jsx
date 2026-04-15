import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const vertexShader = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;
varying vec2 vUv;

// Noise function
float hash(vec2 p) { return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x)))); }
float noise(vec2 x) {
    vec2 i = floor(x);
    vec2 f = fract(x);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
    vec2 st = gl_FragCoord.xy / uResolution.xy;
    st.x *= uResolution.x / uResolution.y;

    // Movement driven by time and mouse
    vec2 movement = vec2(uTime * 0.02, uTime * 0.015) + (uMouse * 0.05);

    // Fractal noise for liquid effect
    float n = noise(st * 2.0 + movement);
    n += 0.5 * noise(st * 4.0 - movement * 1.5);
    n += 0.25 * noise(st * 8.0 + movement * 2.0);
    n = n / 1.75; // Normalize

    // Base color: Volcanic Charcoal (#1A1A1A or similar dark grey)
    vec3 color1 = vec3(0.15, 0.15, 0.14); // Darkest
    vec3 color2 = vec3(0.20, 0.19, 0.18); // Slightly lighter
    vec3 color3 = vec3(0.10, 0.10, 0.09); // Almost black
    vec3 accent = vec3(0.25, 0.23, 0.20); // Subtle seaBronze influence

    // Mix colors based on noise
    vec3 finalColor = mix(color1, color2, smoothstep(0.2, 0.8, n));
    finalColor = mix(finalColor, color3, smoothstep(0.6, 1.0, n));
    finalColor = mix(finalColor, accent, smoothstep(0.85, 1.0, n) * 0.3); // add slight highlight at peaks

    gl_FragColor = vec4(finalColor, 1.0);
}
`;

export default function HeroBackgroundShader() {
    const mountRef = useRef(null);

    useEffect(() => {
        if (!mountRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();
        
        // Camera setup
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        
        // Renderer setup
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        mountRef.current.appendChild(renderer.domElement);

        // Uniforms
        const uniforms = {
            uTime: { value: 0 },
            uMouse: { value: new THREE.Vector2(0, 0) },
            uResolution: { value: new THREE.Vector2() }
        };

        // Geometry & Material
        const geometry = new THREE.PlaneGeometry(2, 2);
        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms,
            transparent: true,
            depthWrite: false,
            depthTest: false
        });

        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        // Resize handler
        const handleResize = () => {
            if (!mountRef.current) return;
            const width = mountRef.current.clientWidth;
            const height = mountRef.current.clientHeight;
            renderer.setSize(width, height);
            uniforms.uResolution.value.set(width, height);
        };
        handleResize(); // Initial sizing
        window.addEventListener('resize', handleResize);

        // Mouse move handler
        let targetMouseX = 0;
        let targetMouseY = 0;
        const handleMouseMove = (e) => {
            targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
            targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        };
        window.addEventListener('mousemove', handleMouseMove);

        // Animation Loop
        const clock = new THREE.Clock();
        let animationFrameId;

        const render = () => {
            const elapsedTime = clock.getElapsedTime();
            uniforms.uTime.value = elapsedTime;

            // Lerp mouse
            uniforms.uMouse.value.x += (targetMouseX - uniforms.uMouse.value.x) * 0.05;
            uniforms.uMouse.value.y += (targetMouseY - uniforms.uMouse.value.y) * 0.05;

            renderer.render(scene, camera);
            animationFrameId = requestAnimationFrame(render);
        };
        render();

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
            
            geometry.dispose();
            material.dispose();
            renderer.dispose();
            
            if (mountRef.current && renderer.domElement) {
                mountRef.current.removeChild(renderer.domElement);
            }
        };
    }, []);

    return <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none w-full h-full object-cover" />;
}
