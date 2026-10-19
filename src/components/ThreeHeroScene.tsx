"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useTheme } from "./ThemeProvider";

export function ThreeHeroScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webGLSupported, setWebGLSupported] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // WebGL Availability Check
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) {
        setWebGLSupported(false);
        return;
      }
    } catch {
      setWebGLSupported(false);
      return;
    }

    // Three.js Scene Setup
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // Color definitions based on theme
    const isDark = theme === "dark";
    const coreColor = isDark ? 0xc4b5fd : 0x9d87e8; // Pastel lavender
    const ringColor = isDark ? 0xa9d9f0 : 0x5ba8c2; // Pastel blue
    const particleColor = isDark ? 0xf0bdd3 : 0xd97e9e; // Pastel pink

    // 1. Central Trust Core (Icosahedron Wireframe + Inner Translucent Sphere)
    const coreGroup = new THREE.Group();

    const icosaGeometry = new THREE.IcosahedronGeometry(1.4, 1);
    const icosaMaterial = new THREE.MeshStandardMaterial({
      color: coreColor,
      wireframe: true,
      roughness: 0.2,
      metalness: 0.8,
      emissive: coreColor,
      emissiveIntensity: 0.35,
    });
    const icosaMesh = new THREE.Mesh(icosaGeometry, icosaMaterial);
    coreGroup.add(icosaMesh);

    const innerSphereGeo = new THREE.SphereGeometry(0.85, 32, 32);
    const innerSphereMat = new THREE.MeshStandardMaterial({
      color: ringColor,
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 0.75,
    });
    const innerSphere = new THREE.Mesh(innerSphereGeo, innerSphereMat);
    coreGroup.add(innerSphere);

    // 2. Holographic Scanning Rings
    const ringGeo1 = new THREE.TorusGeometry(2.1, 0.02, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({ color: ringColor, transparent: true, opacity: 0.6 });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;

    const ringGeo2 = new THREE.TorusGeometry(2.4, 0.015, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({ color: coreColor, transparent: true, opacity: 0.5 });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI / 4;

    coreGroup.add(ring1);
    coreGroup.add(ring2);

    scene.add(coreGroup);

    // 3. Ambient Particle Constellation (Lightweight: 120 particles)
    const particleCount = 120;
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 12;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.04,
      color: particleColor,
      transparent: true,
      opacity: 0.7,
    });
    const particleMesh = new THREE.Points(particleGeo, particleMat);
    scene.add(particleMesh);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, isDark ? 0.8 : 1.2);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(coreColor, isDark ? 2.5 : 2, 20);
    pointLight1.position.set(4, 5, 4);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(ringColor, isDark ? 2.0 : 1.5, 20);
    pointLight2.position.set(-4, -4, 3);
    scene.add(pointLight2);

    // Mouse Parallax Interaction
    let targetX = 0;
    let targetY = 0;
    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      targetX = x * 0.8;
      targetY = y * 0.8;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener("resize", handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Core rotation and gentle floating levitation
      coreGroup.rotation.y = elapsedTime * 0.35;
      coreGroup.rotation.x = Math.sin(elapsedTime * 0.5) * 0.15;
      coreGroup.position.y = Math.sin(elapsedTime * 1.2) * 0.15;

      // Scanning rings counter-rotation
      ring1.rotation.z = elapsedTime * 0.5;
      ring2.rotation.x = elapsedTime * 0.3;

      // Particle gentle drift
      particleMesh.rotation.y = elapsedTime * 0.05;

      // Smooth mouse parallax damping
      camera.position.x += (targetX - camera.position.x) * 0.05;
      camera.position.y += (-targetY - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [theme]);

  if (!webGLSupported) {
    // Elegant fallback if WebGL is disabled
    return (
      <div className="w-full h-full flex items-center justify-center relative">
        <div className="w-64 h-64 rounded-full border-2 border-dashed border-[var(--accent-lavender)] animate-spin flex items-center justify-center p-8"
          style={{ animationDuration: "20s" }}
        >
          <div className="w-48 h-48 rounded-full bg-gradient-to-tr from-[var(--accent-lavender)] to-[var(--accent-blue)] opacity-30 blur-xl" />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className="w-full h-full min-h-[380px] md:min-h-[460px] relative pointer-events-none"
      aria-label="Interactive 3D Trust Hologram"
    />
  );
}
