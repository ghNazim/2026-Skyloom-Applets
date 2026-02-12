import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/**
 * Sphere Slicer Application
 * Updates:
 * - Uses true Hemisphere Geometry as requested.
 * - Added circular caps to make the hemispheres look solid.
 * - Improved animation logic for both horizontal and vertical slicing.
 */
const App = () => {
  const containerRef = useRef(null);
  
  // Refs for Three.js objects
  const groupRef = useRef(new THREE.Group());
  const half1Ref = useRef(new THREE.Group());
  const half2Ref = useRef(new THREE.Group());
  const bladeRef = useRef(null);
  const rGroupRef = useRef(null);
  const controlsRef = useRef(null);

  const sliceState = useRef({ active: false, type: null, progress: 0 });
  const [isSlicing, setIsSlicing] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // --- Initialization ---
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f1d);
    scene.fog = new THREE.Fog(0x0a0f1d, 5, 25);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(6, 4, 10);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);

    // --- Orbit Controls ---
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;

    // --- Lighting ---
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.0);
    keyLight.position.set(5, 10, 5);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0x00d2ff, 0.6);
    fillLight.position.set(-5, 2, 2);
    scene.add(fillLight);

    // --- Environment ---
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(50, 50),
      new THREE.MeshPhongMaterial({ color: 0x111625, shininess: 0 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -4;
    floor.receiveShadow = true;
    scene.add(floor);
    scene.add(new THREE.GridHelper(50, 50, 0x222d4a, 0x161c2e).clone().translateY(-3.99));

    // --- Geometry Construction ---
    const radius = 2;
    const segments = 64;

    // Materials
    const sphereMat = new THREE.MeshStandardMaterial({ color: 0x00d2ff, roughness: 0.4, metalness: 0.2 });
    const capMat = new THREE.MeshStandardMaterial({ color: 0x00aacc, roughness: 0.2, metalness: 0.1 });

    // Hemisphere 1 (Top)
    const geo1 = new THREE.SphereGeometry(radius, segments, segments, 0, Math.PI * 2, 0, Math.PI / 2);
    const mesh1 = new THREE.Mesh(geo1, sphereMat);
    const cap1 = new THREE.Mesh(new THREE.CircleGeometry(radius, segments), capMat);
    cap1.rotation.x = Math.PI / 2;
    
    half1Ref.current.add(mesh1, cap1);
    half1Ref.current.castShadow = true;
    
    // Hemisphere 2 (Bottom)
    const geo2 = new THREE.SphereGeometry(radius, segments, segments, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
    const mesh2 = new THREE.Mesh(geo2, sphereMat);
    const cap2 = new THREE.Mesh(new THREE.CircleGeometry(radius, segments), capMat);
    cap2.rotation.x = -Math.PI / 2;
    
    half2Ref.current.add(mesh2, cap2);
    half2Ref.current.castShadow = true;

    // Root Group for rotation
    scene.add(groupRef.current);
    groupRef.current.add(half1Ref.current, half2Ref.current);

    // --- The Blade ---
    const blade = new THREE.Mesh(
      new THREE.PlaneGeometry(6, 6),
      new THREE.MeshBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0, side: THREE.DoubleSide })
    );
    blade.visible = false;
    bladeRef.current = blade;
    scene.add(blade);

    // --- Radius Helper ---
    const rGroup = new THREE.Group();
    rGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0), new THREE.Vector3(radius,0,0)]), new THREE.LineBasicMaterial({color: 0xffffff})));
    rGroup.add(new THREE.Mesh(new THREE.SphereGeometry(0.05), new THREE.MeshBasicMaterial({color: 0xffffff})));
    rGroup.position.set(0, 0, 0.1);
    rGroupRef.current = rGroup;
    scene.add(rGroup);

    // --- Animation Loop ---
    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      controls.update();

      if (sliceState.current.active) {
        sliceState.current.progress += 0.01;
        const p = sliceState.current.progress;

        if (p < 0.3) {
          // Phase 1: Blade Wiggle
          blade.visible = true;
          blade.material.opacity = Math.min(p * 3, 0.5);
          blade.position.x = Math.sin(p * 150) * 0.15;
        } 
        else if (p >= 0.3 && p < 1.2) {
          // Phase 2: Separation
          const separation = (p - 0.3) * 1.5;
          half1Ref.current.position.y = separation;
          half2Ref.current.position.y = -separation;

          blade.material.opacity = Math.max(0.5 - (p - 0.3) * 1.2, 0);
          rGroup.visible = false;
        } 
        else if (p >= 1.8) {
          sliceState.current.active = false;
          setIsSlicing(false);
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      if (containerRef.current) containerRef.current.innerHTML = '';
    };
  }, []);

  const handleSlice = (type) => {
    if (isSlicing) return;
    setIsSlicing(true);
    
    // Reset state
    half1Ref.current.position.set(0, 0, 0);
    half2Ref.current.position.set(0, 0, 0);
    rGroupRef.current.visible = true;
    bladeRef.current.position.set(0, 0, 0);

    if (type === 'horizontal') {
      groupRef.current.rotation.set(0, 0, 0);
      bladeRef.current.rotation.set(Math.PI / 2, 0, 0);
    } else {
      // For vertical, rotate the whole group 90 degrees on Z
      groupRef.current.rotation.set(0, 0, Math.PI / 2);
      bladeRef.current.rotation.set(0, Math.PI / 2, 0);
    }

    sliceState.current = { active: true, type, progress: 0 };
  };

  return (
    <div className="flex flex-col w-full h-screen bg-[#050a1a] text-white font-sans overflow-hidden">
      <div className="p-4 flex justify-between items-center border-b border-slate-800 bg-slate-900/80 backdrop-blur-md z-10">
        <h1 className="text-lg font-bold tracking-tight text-cyan-400">Sphere Geometry Analysis</h1>
        <div className="text-[10px] text-slate-400 font-mono hidden sm:block uppercase tracking-widest">Orbit Mode Active</div>
      </div>

      <div ref={containerRef} className="flex-grow relative overflow-hidden" />

      <div className="p-6 bg-slate-900 border-t border-slate-800 flex flex-col items-center gap-4 z-10 shadow-2xl">
        <div className="flex gap-4">
          <button
            onClick={() => handleSlice('horizontal')}
            disabled={isSlicing}
            className={`px-8 py-3 rounded-xl font-medium transition-all transform active:scale-95 flex items-center gap-2 border border-white/5 shadow-lg ${
              isSlicing ? 'bg-slate-800 text-slate-500' : 'bg-cyan-600 hover:bg-cyan-500 shadow-cyan-900/20'
            }`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18"/><path d="m3 12 4-4"/><path d="m3 12 4 4"/><path d="m21 12-4-4"/><path d="m21 12-4 4"/></svg>
            Slice Horizontally
          </button>

          <button
            onClick={() => handleSlice('vertical')}
            disabled={isSlicing}
            className={`px-8 py-3 rounded-xl font-medium transition-all transform active:scale-95 flex items-center gap-2 border border-white/5 shadow-lg ${
              isSlicing ? 'bg-slate-800 text-slate-500' : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20'
            }`}
          >
            <svg className="rotate-90" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18"/><path d="m3 12 4-4"/><path d="m3 12 4 4"/><path d="m21 12-4-4"/><path d="m21 12-4 4"/></svg>
            Slice Vertically
          </button>
        </div>
        
        <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-bold">
          {isSlicing ? 'Processing Separation...' : 'Ready for Analysis'}
        </p>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        canvas { display: block; outline: none; }
        button:disabled { cursor: not-allowed; }
      `}} />
    </div>
  );
};

export default App;