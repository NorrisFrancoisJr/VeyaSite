import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

const vertexShader = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform sampler2D tDiffuse;
uniform sampler2D tDisp;
uniform float dispFactor;
uniform float effectFactor;
varying vec2 vUv;

void main() {
    vec2 uv = vUv;
    vec4 disp = texture2D(tDisp, uv);
    
    // Liquid warp calculation
    vec2 distortedPosition = vec2(uv.x, uv.y + dispFactor * (disp.r * effectFactor));
    
    vec4 _texture = texture2D(tDiffuse, distortedPosition);
    vec4 _texture2 = vec4(0.1, 0.1, 0.1, 1.0); // subtle dark mix
    
    // final output
    vec4 finalTexture = mix(_texture, _texture2, dispFactor * 0.15);
    gl_FragColor = finalTexture;
}
`;

export default function DistortionImage({ src, alt, className }) {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    const sceneInfo = useRef({});
    const [isHovered, setIsHovered] = useState(false);
    const [isIntersecting, setIsIntersecting] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    // Initial IntersectionObserver to lazy-load the WebGL renderer
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsIntersecting(true);
                    observer.disconnect(); // only need to trigger origin initialization once
                }
            },
            { rootMargin: '300px' } // Pre-load slightly before entering viewport
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isIntersecting || !containerRef.current || !canvasRef.current) return;

        const container = containerRef.current;
        const canvas = canvasRef.current;
        let animationId;

        const scene = new THREE.Scene();

        const camera = new THREE.OrthographicCamera(
            container.offsetWidth / -2, container.offsetWidth / 2,
            container.offsetHeight / 2, container.offsetHeight / -2,
            1, 1000
        );
        camera.position.z = 1;

        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true
        });
        renderer.setSize(container.offsetWidth, container.offsetHeight);

        const loader = new THREE.TextureLoader();

        loader.load(src, (texture) => {
            const imgAspect = texture.image.width / texture.image.height;
            const containerAspect = container.offsetWidth / container.offsetHeight;
            let a1 = 1, a2 = 1;

            if (containerAspect > imgAspect) {
                a1 = containerAspect / imgAspect;
            } else {
                a2 = imgAspect / containerAspect;
            }

            texture.matrixAutoUpdate = false;
            // Center and cover
            texture.matrix.setUvTransform(0, 0, a1, a2, 0, 0.5, 0.5);

            // Generate synthetic displacement map
            const size = 512;
            const dispCanvas = document.createElement('canvas');
            dispCanvas.width = size;
            dispCanvas.height = size;
            const ctx = dispCanvas.getContext('2d');
            const grd = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
            grd.addColorStop(0, "white");
            grd.addColorStop(1, "black");
            ctx.fillStyle = grd;
            ctx.fillRect(0, 0, size, size);
            const dispTexture = new THREE.CanvasTexture(dispCanvas);
            dispTexture.wrapS = dispTexture.wrapT = THREE.RepeatWrapping;

            const material = new THREE.ShaderMaterial({
                uniforms: {
                    tDiffuse: { value: texture },
                    tDisp: { value: dispTexture },
                    dispFactor: { value: 0.0 },
                    effectFactor: { value: 0.25 }
                },
                vertexShader,
                fragmentShader,
                transparent: true,
                opacity: 1.0
            });

            const geometry = new THREE.PlaneGeometry(container.offsetWidth, container.offsetHeight, 1, 1);
            const mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);
            sceneInfo.current = { mesh, renderer, scene, camera, material, texture, dispTexture, geometry };

            const render = () => {
                renderer.render(scene, camera);
                animationId = requestAnimationFrame(render);
            };
            render();
            setIsLoaded(true);
        });

        const handleResize = () => {
            if (!sceneInfo.current.renderer) return;
            renderer.setSize(container.offsetWidth, container.offsetHeight);
            camera.left = container.offsetWidth / -2;
            camera.right = container.offsetWidth / 2;
            camera.top = container.offsetHeight / 2;
            camera.bottom = container.offsetHeight / -2;
            camera.updateProjectionMatrix();

            // Update mesh size
            if (sceneInfo.current.mesh) {
                scene.remove(sceneInfo.current.mesh);
                sceneInfo.current.geometry.dispose();

                const newGeo = new THREE.PlaneGeometry(container.offsetWidth, container.offsetHeight, 1, 1);
                sceneInfo.current.geometry = newGeo;

                const newMesh = new THREE.Mesh(newGeo, sceneInfo.current.material);
                scene.add(newMesh);
                sceneInfo.current.mesh = newMesh;
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (animationId) cancelAnimationFrame(animationId);
            const info = sceneInfo.current;
            if (info.renderer) info.renderer.dispose();
            if (info.geometry) info.geometry.dispose();
            if (info.material) info.material.dispose();
            if (info.texture) info.texture.dispose();
            if (info.dispTexture) info.dispTexture.dispose();
        };
    }, [src]);

    useEffect(() => {
        if (!sceneInfo.current.material) return;

        gsap.to(sceneInfo.current.material.uniforms.dispFactor, {
            value: isHovered ? 1 : 0,
            duration: 1.2,
            ease: 'power4.out',
        });

        gsap.to(canvasRef.current, {
            scale: isHovered ? 1.05 : 1,
            duration: 1.2,
            ease: 'power3.out'
        });

    }, [isHovered]);

    return (
        <div
            ref={containerRef}
            className={`relative overflow-hidden ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Fallback image before WebGL initializes */}
            <img
                src={src}
                alt={alt || "Project Image"}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${isLoaded ? 'opacity-0' : 'opacity-100'}`}
            />

            {/* WebGL Canvas */}
            <canvas
                ref={canvasRef}
                className={`absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            />

            <div className={`absolute inset-0 bg-deepGreen/20 transition-opacity duration-1000 pointer-events-none ${isHovered ? 'opacity-50' : 'opacity-0'}`}></div>
        </div>
    );
}
