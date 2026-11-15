import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const vertexShader = `
uniform float uTime;
uniform float uScrollSpeed;
attribute vec3 instancePosition;
attribute vec3 instanceColor;
varying vec3 vColor;

void main() {
    vColor = instanceColor;
    
    vec3 pos = position; 
    
    // Extreme Z-stretching based on scroll speed to create the "light speed lines" effect
    float stretch = 1.0 + uScrollSpeed * 100.0;
    pos.z *= stretch; 
    
    // Base travel speed + scroll boost
    float baseSpeed = 10.0;
    float zTravel = uTime * baseSpeed + uScrollSpeed * 200.0;
    
    vec3 offset = instancePosition;
    offset.z += zTravel;
    
    // Seamless looping mechanics
    // Span from -120 to +20 (range 140)
    offset.z = mod(offset.z + 120.0, 140.0) - 120.0;
    
    vec4 mvPosition = modelViewMatrix * vec4(pos + offset, 1.0);
    gl_Position = projectionMatrix * mvPosition;
}
`;

const fragmentShader = `
varying vec3 vColor;

void main() {
    // Restored high brightness (0.95 alpha) since the star density is much lower now
    gl_FragColor = vec4(vColor, 0.95);
}
`;

export default function ThreeDScene() {
    const mountRef = useRef(null);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        const scene = new THREE.Scene();
        // Dark space background to blend distant stars
        scene.fog = new THREE.FogExp2(0x060608, 0.025);

        const camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.z = 15;

        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            powerPreference: "high-performance"
        });

        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);
        mount.appendChild(renderer.domElement);

        const starCount = 400; // Extremely minimal, super-clean density
        
        // Use InstancedBufferGeometry safely across all Three.js versions
        const geometry = new THREE.InstancedBufferGeometry();
        
        // Use a Capsule geometry so it has rounded, smooth curves instead of sharp cuboid edges
        const baseGeometry = new THREE.CapsuleGeometry(0.02, 0.8, 3, 6);
        // Capsules default to pointing up (Y-axis), so we rotate it to point forward (Z-axis)
        baseGeometry.rotateX(Math.PI / 2);
        
        geometry.index = baseGeometry.index;
        geometry.setAttribute('position', baseGeometry.getAttribute('position'));
        geometry.setAttribute('normal', baseGeometry.getAttribute('normal'));
        
        const instancePositions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);
        
        // Pure white color palette for all stars
        const colorWhite = new THREE.Color('#ffffff');
        
        for (let i = 0; i < starCount; i++) {
            // Wide radial distribution so you fly through the tunnel
            instancePositions[i*3] = (Math.random() - 0.5) * 80;
            instancePositions[i*3+1] = (Math.random() - 0.5) * 80;
            instancePositions[i*3+2] = (Math.random() - 0.5) * 140 - 20;
            
            colors[i*3] = colorWhite.r;
            colors[i*3+1] = colorWhite.g;
            colors[i*3+2] = colorWhite.b;
        }
        
        geometry.setAttribute('instancePosition', new THREE.InstancedBufferAttribute(instancePositions, 3));
        geometry.setAttribute('instanceColor', new THREE.InstancedBufferAttribute(colors, 3));
        
        const uniforms = {
            uTime: { value: 0 },
            uScrollSpeed: { value: 0 }
        };

        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms,
            transparent: true,
            blending: THREE.AdditiveBlending, // Restored Additive Blending for the glow effect
            depthWrite: false
        });

        const stars = new THREE.Mesh(geometry, material);
        // CRITICAL: Disable frustum culling since vertex shader moves vertices far outside the bounding box
        stars.frustumCulled = false;
        scene.add(stars);

        const clock = new THREE.Clock();
        let animationFrameId;

        // Smooth scroll velocity tracking
        let lastScrollY = window.scrollY;
        let targetScrollSpeed = 0;

        function onScroll() {
            const currentScrollY = window.scrollY;
            const deltaY = Math.abs(currentScrollY - lastScrollY);
            // Cap target speed to prevent geometric tearing
            targetScrollSpeed = Math.min(targetScrollSpeed + deltaY * 0.05, 4.0);
            lastScrollY = currentScrollY;
        }

        window.addEventListener('scroll', onScroll, { passive: true });

        // Mouse tracking for subtle parallax
        const targetMouse = new THREE.Vector2(0, 0);
        let currentMouse = new THREE.Vector2(0, 0);
        
        function onMouseMove(event) {
            targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            targetMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        }
        window.addEventListener('mousemove', onMouseMove, { passive: true });

        function animate() {
            const time = clock.getElapsedTime();
            
            // Mouse Parallax easing
            currentMouse.x += (targetMouse.x - currentMouse.x) * 0.05;
            currentMouse.y += (targetMouse.y - currentMouse.y) * 0.05;
            
            // Rotate the entire starfield slightly based on mouse
            stars.rotation.x = currentMouse.y * 0.1;
            stars.rotation.y = currentMouse.x * 0.1;
            
            // Speed easing
            uniforms.uScrollSpeed.value += (targetScrollSpeed - uniforms.uScrollSpeed.value) * 0.05;
            targetScrollSpeed *= 0.95; // Decay
            
            // Dynamic FOV for warp effect
            camera.fov = 60 + uniforms.uScrollSpeed.value * 12;
            camera.updateProjectionMatrix();
            
            uniforms.uTime.value = time;

            renderer.render(scene, camera);
            animationFrameId = requestAnimationFrame(animate);
        }

        animate();

        function handleResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);

            geometry.dispose();
            material.dispose();
            renderer.dispose();

            if (renderer.domElement.parentNode === mount) {
                mount.removeChild(renderer.domElement);
            }
        };
    }, []);

    return <div ref={mountRef} className="three-background" style={{ background: '#060608' }} />;
}