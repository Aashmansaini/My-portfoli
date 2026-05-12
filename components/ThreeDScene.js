import { useEffect, useRef } from 'react';
import * as THREE from 'three';

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function lerp(start, end, progress) {
    return start + (end - start) * progress;
}

function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

export default function ThreeDScene() {
    const mountRef = useRef(null);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(
            46,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        camera.position.z = 10;

        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
        });

        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);
        mount.appendChild(renderer.domElement);

        const network = new THREE.Group();
        scene.add(network);

        const NODE_COLOR = new THREE.Color(0xe8a0bf);
        const LINE_COLOR = new THREE.Color(0xc48aaa);

        const totalNodeCount = 190;
        const initialNodeCount = 46;
        const maxLines = 900;

        const baseNodes = [];
        const liveNodes = [];

        // Per-node repulsion offsets — start at zero, decay each frame
        const repulsion = [];

        for (let i = 0; i < totalNodeCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const verticalSpread = (Math.random() - 0.5) * 8.2;

            const revealRatio = i / totalNodeCount;
            const baseRadius = lerp(1.6, 6.2, revealRatio);
            const radius = baseRadius + Math.random() * 1.6;

            const distortion =
                1 +
                Math.sin(angle * 2.1) * 0.24 +
                Math.cos(verticalSpread * 0.45) * 0.12;

            const x = Math.cos(angle) * radius * distortion;
            const y = verticalSpread * lerp(0.55, 1.1, revealRatio);
            const z = Math.sin(angle) * radius * 0.68;

            const base = new THREE.Vector3(x, y, z);

            baseNodes.push({
                base,
                phase: Math.random() * Math.PI * 2,
                drift: 0.04 + Math.random() * 0.12,
                speed: 0.14 + Math.random() * 0.32,
                revealAt: revealRatio,
            });

            liveNodes.push(base.clone());
            repulsion.push(new THREE.Vector3(0, 0, 0));
        }

        const pointPositions = new Float32Array(totalNodeCount * 3);

        const pointsGeometry = new THREE.BufferGeometry();
        pointsGeometry.setAttribute(
            'position',
            new THREE.BufferAttribute(pointPositions, 3)
        );

        const pointsMaterial = new THREE.PointsMaterial({
            color: NODE_COLOR,
            size: 0.07,
            transparent: true,
            opacity: 0.96,
            depthWrite: false,
        });

        const points = new THREE.Points(pointsGeometry, pointsMaterial);
        network.add(points);

        const linePositions = new Float32Array(maxLines * 2 * 3);

        const linesGeometry = new THREE.BufferGeometry();
        linesGeometry.setAttribute(
            'position',
            new THREE.BufferAttribute(linePositions, 3)
        );

        const linesMaterial = new THREE.LineBasicMaterial({
            color: LINE_COLOR,
            transparent: true,
            opacity: 0.32,
            depthWrite: false,
        });

        const lines = new THREE.LineSegments(linesGeometry, linesMaterial);
        network.add(lines);

        const glowLinePositions = new Float32Array(maxLines * 2 * 3);

        const glowLinesGeometry = new THREE.BufferGeometry();
        glowLinesGeometry.setAttribute(
            'position',
            new THREE.BufferAttribute(glowLinePositions, 3)
        );

        const glowLinesMaterial = new THREE.LineBasicMaterial({
            color: 0xf5d0e0,
            transparent: true,
            opacity: 0.1,
            depthWrite: false,
        });

        const glowLines = new THREE.LineSegments(
            glowLinesGeometry,
            glowLinesMaterial
        );

        network.add(glowLines);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xe8a0bf, 1.2, 24);
        pointLight.position.set(2, 2, 9);
        scene.add(pointLight);

        const clock = new THREE.Clock();
        let animationFrameId;
        let smoothScrollProgress = 0;

        // Mouse position in NDC (-1 to +1). Starts off-screen so no repulsion on load.
        const mouseNDC = new THREE.Vector2(-99, -99);

        // Reusable projected vector — avoids allocations in the hot loop
        const projected = new THREE.Vector3();

        // Interaction constants — tuned for "barely there" feel
        const INFLUENCE_RADIUS = 0.28; // NDC units (~14% of half-screen)
        const MAX_PUSH = 0.32;         // world-space units, very gentle
        const DECAY = 0.95;            // how fast nodes spring back (higher = lazier)

        function onMouseMove(event) {
            mouseNDC.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouseNDC.y = -(event.clientY / window.innerHeight) * 2 + 1;
        }

        function onMouseLeave() {
            // Park mouse far off-screen so repulsion quietly fades
            mouseNDC.set(-99, -99);
        }

        window.addEventListener('mousemove', onMouseMove, { passive: true });
        window.addEventListener('mouseleave', onMouseLeave, { passive: true });

        function getScrollProgress() {
            const scrollTop = window.scrollY || window.pageYOffset;
            const maxScroll =
                document.documentElement.scrollHeight - window.innerHeight;
            if (maxScroll <= 0) return 0;
            return clamp(scrollTop / maxScroll, 0, 1);
        }

        function animate() {
            const time = clock.getElapsedTime();

            const rawScrollProgress = getScrollProgress();
            smoothScrollProgress +=
                (rawScrollProgress - smoothScrollProgress) * 0.045;

            const growth = easeOutCubic(smoothScrollProgress);

            const activeNodeCount = Math.floor(
                lerp(initialNodeCount, totalNodeCount, growth)
            );

            const connectionDistance = lerp(1.35, 2.15, growth);
            const maxConnectionsPerNode = Math.floor(lerp(3, 7, growth));

            const breathing = 1 + Math.sin(time * 0.22) * 0.025;
            const scrollExpansion = lerp(0.88, 1.24, growth);

            for (let i = 0; i < totalNodeCount; i++) {
                const node = baseNodes[i];
                const isActive = i < activeNodeCount;

                const driftX = Math.sin(time * node.speed + node.phase) * node.drift;
                const driftY = Math.cos(time * node.speed * 0.75 + node.phase) * node.drift;
                const driftZ = Math.sin(time * node.speed * 0.52 + node.phase) * node.drift;

                // Base animated position (unchanged from original)
                liveNodes[i]
                    .copy(node.base)
                    .multiplyScalar(breathing * scrollExpansion)
                    .add(new THREE.Vector3(driftX, driftY, driftZ));

                if (isActive) {
                    // Project node to NDC to measure screen-space distance to cursor
                    projected.copy(liveNodes[i]).project(camera);

                    const dx = projected.x - mouseNDC.x;
                    const dy = projected.y - mouseNDC.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < INFLUENCE_RADIUS && dist > 0.001) {
                        // Smooth quadratic falloff — strong at center, zero at edge
                        const t = 1 - dist / INFLUENCE_RADIUS;
                        const strength = t * t * MAX_PUSH;

                        // Push direction away from cursor
                        const nx = dx / dist;
                        const ny = dy / dist;

                        // Lerp toward target push instead of adding directly —
                        // 0.06 factor means the repulsion builds over ~16 frames (lazy feel)
                        repulsion[i].x += (nx * strength - repulsion[i].x) * 0.06;
                        repulsion[i].y += (ny * strength - repulsion[i].y) * 0.06;
                    }

                    // Decay repulsion toward zero every frame
                    repulsion[i].multiplyScalar(DECAY);

                    // Clamp maximum displacement so it never looks broken
                    const repLen = repulsion[i].length();
                    if (repLen > MAX_PUSH) {
                        repulsion[i].multiplyScalar(MAX_PUSH / repLen);
                    }

                    // Final position = animated base + repulsion offset
                    const fx = liveNodes[i].x + repulsion[i].x;
                    const fy = liveNodes[i].y + repulsion[i].y;
                    const fz = liveNodes[i].z + repulsion[i].z;

                    pointPositions[i * 3]     = fx;
                    pointPositions[i * 3 + 1] = fy;
                    pointPositions[i * 3 + 2] = fz;

                    // Write back so lines follow displaced positions
                    liveNodes[i].set(fx, fy, fz);
                } else {
                    repulsion[i].set(0, 0, 0);
                    pointPositions[i * 3]     = 9999;
                    pointPositions[i * 3 + 1] = 9999;
                    pointPositions[i * 3 + 2] = 9999;
                }
            }

            pointsGeometry.attributes.position.needsUpdate = true;
            pointsGeometry.setDrawRange(0, activeNodeCount);

            let lineIndex = 0;
            const connectionCounts = new Array(totalNodeCount).fill(0);

            for (let i = 0; i < activeNodeCount; i++) {
                for (let j = i + 1; j < activeNodeCount; j++) {
                    if (lineIndex >= maxLines) break;
                    if (connectionCounts[i] >= maxConnectionsPerNode) continue;
                    if (connectionCounts[j] >= maxConnectionsPerNode) continue;

                    const distance = liveNodes[i].distanceTo(liveNodes[j]);

                    if (distance < connectionDistance) {
                        const idx = lineIndex * 6;

                        linePositions[idx]     = liveNodes[i].x;
                        linePositions[idx + 1] = liveNodes[i].y;
                        linePositions[idx + 2] = liveNodes[i].z;
                        linePositions[idx + 3] = liveNodes[j].x;
                        linePositions[idx + 4] = liveNodes[j].y;
                        linePositions[idx + 5] = liveNodes[j].z;

                        glowLinePositions[idx]     = liveNodes[i].x;
                        glowLinePositions[idx + 1] = liveNodes[i].y;
                        glowLinePositions[idx + 2] = liveNodes[i].z;
                        glowLinePositions[idx + 3] = liveNodes[j].x;
                        glowLinePositions[idx + 4] = liveNodes[j].y;
                        glowLinePositions[idx + 5] = liveNodes[j].z;

                        connectionCounts[i]++;
                        connectionCounts[j]++;
                        lineIndex++;
                    }
                }
            }

            linesGeometry.setDrawRange(0, lineIndex * 2);
            linesGeometry.attributes.position.needsUpdate = true;

            glowLinesGeometry.setDrawRange(0, lineIndex * 2);
            glowLinesGeometry.attributes.position.needsUpdate = true;

            // Organic rotation — completely unchanged from original
            network.rotation.y = time * 0.025 + growth * 0.18;
            network.rotation.x = Math.sin(time * 0.1) * 0.055;
            network.rotation.z = Math.sin(time * 0.08) * 0.025;

            network.position.x = lerp(0.2, -0.35, growth);
            network.position.y = Math.sin(time * 0.16) * 0.08;

            pointsMaterial.opacity = lerp(0.82, 0.98, growth);
            linesMaterial.opacity = lerp(0.2, 0.36, growth);
            glowLinesMaterial.opacity = lerp(0.05, 0.12, growth);

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
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseleave', onMouseLeave);
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);

            pointsGeometry.dispose();
            pointsMaterial.dispose();
            linesGeometry.dispose();
            linesMaterial.dispose();
            glowLinesGeometry.dispose();
            glowLinesMaterial.dispose();
            renderer.dispose();

            if (renderer.domElement.parentNode === mount) {
                mount.removeChild(renderer.domElement);
            }
        };
    }, []);

    return <div ref={mountRef} className="three-background" />;
}