import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const App = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const stackGroup = useRef(new THREE.Group());
  const highlightGroup = useRef(new THREE.Group());
  const labelGroup = useRef(new THREE.Group());
  const cuboidRef = useRef(null);
  
  const [sliderVal, setSliderVal] = useState(0);
  const [isDoneStacking, setIsDoneStacking] = useState(false);
  const [count, setCount] = useState(0);
  const [activeLabel, setActiveLabel] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [controlsLoaded, setControlsLoaded] = useState(false);
  
  const STACK_COUNT = 20;
  const BOX_DIM = { w: 2, h: 1, d: 1 };
  const PRIMARY_COLOR = 0xf97316; 
  const HIGHLIGHT_FACE_COLOR = 0x86efac; 

  // Ideal Initial Camera State
  const INITIAL_CAMERA_POS = { x: 3.5, y: 3.5, z: 5 };
  const INITIAL_TARGET = { x: 0, y: 0.5, z: 0 };

  // Load OrbitControls Script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js';
    script.async = true;
    script.onload = () => setControlsLoaded(true);
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const width = 500;
    const height = 500;
    const aspect = width / height;
    const frustumSize = 3; 
    
    const camera = new THREE.OrthographicCamera(
      frustumSize * aspect / -2, 
      frustumSize * aspect / 2, 
      frustumSize / 2, 
      frustumSize / -2, 
      0.1, 
      1000
    );
    
    camera.position.set(INITIAL_CAMERA_POS.x, INITIAL_CAMERA_POS.y, INITIAL_CAMERA_POS.z);
    camera.lookAt(INITIAL_TARGET.x, INITIAL_TARGET.y, INITIAL_TARGET.z);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(5, 10, 5);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
    fillLight.position.set(-5, 2, 2);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xffffff, 0.6);
    rimLight.position.set(0, 5, -5);
    scene.add(rimLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    scene.add(stackGroup.current);
    scene.add(highlightGroup.current);
    scene.add(labelGroup.current);

    let controls;
    if (window.THREE.OrbitControls) {
      controls = new window.THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.target.set(INITIAL_TARGET.x, INITIAL_TARGET.y, INITIAL_TARGET.z);
      controlsRef.current = controls;
    }

    const animate = () => {
      requestAnimationFrame(animate);
      if (controlsRef.current) controlsRef.current.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
      if (controlsRef.current) controlsRef.current.dispose();
    };
  }, [controlsLoaded]);

  // Smooth Camera Reset Helper
  const smoothResetCamera = () => {
    return new Promise((resolve) => {
      const camera = cameraRef.current;
      const controls = controlsRef.current;
      if (!camera || !controls) return resolve();

      const duration = 800; // ms
      const startPos = camera.position.clone();
      const startTarget = controls.target.clone();
      const startTime = performance.now();

      const animateCamera = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function: easeInOutCubic
        const ease = progress < 0.5 
          ? 4 * progress * progress * progress 
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        camera.position.x = startPos.x + (INITIAL_CAMERA_POS.x - startPos.x) * ease;
        camera.position.y = startPos.y + (INITIAL_CAMERA_POS.y - startPos.y) * ease;
        camera.position.z = startPos.z + (INITIAL_CAMERA_POS.z - startPos.z) * ease;

        controls.target.x = startTarget.x + (INITIAL_TARGET.x - startTarget.x) * ease;
        controls.target.y = startTarget.y + (INITIAL_TARGET.y - startTarget.y) * ease;
        controls.target.z = startTarget.z + (INITIAL_TARGET.z - startTarget.z) * ease;

        if (progress < 1) {
          requestAnimationFrame(animateCamera);
        } else {
          resolve();
        }
      };

      requestAnimationFrame(animateCamera);
    });
  };

  useEffect(() => {
    if (isDoneStacking) return;
    
    while(stackGroup.current.children.length > 0) {
      stackGroup.current.remove(stackGroup.current.children[0]);
    }

    const currentPlates = Math.floor((sliderVal / 100) * STACK_COUNT);
    const geometry = new THREE.PlaneGeometry(BOX_DIM.w, BOX_DIM.d);
    geometry.rotateX(-Math.PI / 2);

    for (let i = 0; i <= currentPlates; i++) {
      const material = new THREE.MeshStandardMaterial({ 
        color: PRIMARY_COLOR, 
        side: THREE.DoubleSide, 
        transparent: true, 
        opacity: 0.8,
        roughness: 0.4,
        metalness: 0.1
      });
      const plate = new THREE.Mesh(geometry, material);
      plate.position.y = (i / STACK_COUNT) * BOX_DIM.h; 
      stackGroup.current.add(plate);
    }
  }, [sliderVal, isDoneStacking]);

  const handleSliderRelease = () => {
    if (sliderVal >= 95) {
      setIsDoneStacking(true);
      setSliderVal(100);
      sceneRef.current.remove(stackGroup.current);
      
      const geom = new THREE.BoxGeometry(BOX_DIM.w, BOX_DIM.h, BOX_DIM.d);
      const mat = new THREE.MeshStandardMaterial({ 
        color: PRIMARY_COLOR, 
        transparent: true, 
        opacity: 0.5,
        roughness: 0.2,
        metalness: 0.1
      });
      const cuboid = new THREE.Mesh(geom, mat);
      cuboid.position.y = BOX_DIM.h / 2;
      
      const edgesGeom = new THREE.EdgesGeometry(geom);
      const lineMat = new THREE.LineBasicMaterial({ color: 0x92400e, linewidth: 2 });
      const line = new THREE.LineSegments(edgesGeom, lineMat);
      cuboid.add(line);

      cuboidRef.current = cuboid;
      sceneRef.current.add(cuboid);
    } else {
      setSliderVal(0);
    }
  };

  const createTextLabel = (text, position) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 128;
    canvas.height = 128;
    context.fillStyle = 'rgba(255, 255, 255, 0.95)';
    context.beginPath();
    context.arc(64, 64, 50, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = '#0f172a';
    context.font = 'bold 64px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, 64, 64);
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture, depthTest: false });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(0.35, 0.35, 1);
    sprite.position.copy(position);
    sprite.renderOrder = 999;
    return sprite;
  };

  const clearHighlights = () => {
    while(highlightGroup.current.children.length > 0) {
      highlightGroup.current.remove(highlightGroup.current.children[0]);
    }
    while(labelGroup.current.children.length > 0) {
      labelGroup.current.remove(labelGroup.current.children[0]);
    }
    setCount(0);
  };

  // Generalized Highlighting Wrapper to handle Camera Reset and Locking
  const startHighlightAction = async (actionFn) => {
    if (isProcessing) return;
    setIsProcessing(true);
    
    // Disable OrbitControls
    if (controlsRef.current) controlsRef.current.enabled = false;
    
    // Smoothly return to initial angle
    await smoothResetCamera();
    
    // Perform the actual highlight logic
    await actionFn();
    
    // Re-enable OrbitControls
    if (controlsRef.current) controlsRef.current.enabled = true;
    setIsProcessing(false);
  };

  const highlightFaces = async () => {
    setActiveLabel("Faces");
    clearHighlights();
    for (let i = 0; i < 6; i++) {
      clearHighlights();
      let faceGeom;
      if (i < 2) faceGeom = new THREE.PlaneGeometry(BOX_DIM.d, BOX_DIM.h);
      else if (i < 4) faceGeom = new THREE.PlaneGeometry(BOX_DIM.w, BOX_DIM.d);
      else faceGeom = new THREE.PlaneGeometry(BOX_DIM.w, BOX_DIM.h);
      const faceMat = new THREE.MeshBasicMaterial({ color: HIGHLIGHT_FACE_COLOR, side: THREE.DoubleSide, transparent: true, opacity: 0.9 });
      const face = new THREE.Mesh(faceGeom, faceMat);
      const hw = BOX_DIM.w / 2, hh = BOX_DIM.h / 2, hd = BOX_DIM.d / 2;
      if (i === 0) { face.position.set(hw, hh, 0); face.rotation.y = Math.PI/2; } 
      if (i === 1) { face.position.set(-hw, hh, 0); face.rotation.y = -Math.PI/2; } 
      if (i === 2) { face.position.set(0, BOX_DIM.h, 0); face.rotation.x = -Math.PI/2; } 
      if (i === 3) { face.position.set(0, 0, 0); face.rotation.x = Math.PI/2; } 
      if (i === 4) { face.position.set(0, hh, hd); } 
      if (i === 5) { face.position.set(0, hh, -hd); } 
      face.position.multiplyScalar(1.002);
      highlightGroup.current.add(face);
      setCount(i + 1);
      await new Promise(r => setTimeout(r, 1000));
    }
    clearHighlights();
    setActiveLabel("");
  };

  const highlightEdges = async () => {
    setActiveLabel("Edges");
    clearHighlights();
    const hw = BOX_DIM.w / 2, hh = BOX_DIM.h, hd = BOX_DIM.d / 2;
    const edgeCoords = [
      [[hw, 0, hd], [-hw, 0, hd]], [[hw, 0, -hd], [-hw, 0, -hd]], [[hw, 0, hd], [hw, 0, -hd]], [[-hw, 0, hd], [-hw, 0, -hd]],
      [[hw, hh, hd], [-hw, hh, hd]], [[hw, hh, -hd], [-hw, hh, -hd]], [[hw, hh, hd], [hw, hh, -hd]], [[-hw, hh, hd], [-hw, hh, -hd]],
      [[hw, 0, hd], [hw, hh, hd]], [[-hw, 0, hd], [-hw, hh, hd]], [[hw, 0, -hd], [hw, hh, -hd]], [[-hw, 0, -hd], [-hw, hh, -hd]]
    ];
    for (let i = 0; i < edgeCoords.length; i++) {
      const start = new THREE.Vector3(...edgeCoords[i][0]);
      const end = new THREE.Vector3(...edgeCoords[i][1]);
      const distance = start.distanceTo(end);
      const edge = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, distance, 12), new THREE.MeshBasicMaterial({ color: 0x22c55e }));
      const midPoint = start.clone().lerp(end, 0.5);
      edge.position.copy(midPoint);
      edge.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), end.clone().sub(start).normalize());
      highlightGroup.current.add(edge);
      labelGroup.current.add(createTextLabel((i + 1).toString(), midPoint));
      setCount(i + 1);
      await new Promise(r => setTimeout(r, 600));
    }
  };

  const highlightVertices = async () => {
    setActiveLabel("Vertices");
    clearHighlights();
    const hw = BOX_DIM.w / 2, hh = BOX_DIM.h, hd = BOX_DIM.d / 2;
    const verts = [[hw, 0, hd], [-hw, 0, hd], [hw, 0, -hd], [-hw, 0, -hd], [hw, hh, hd], [-hw, hh, hd], [hw, hh, -hd], [-hw, hh, -hd]];
    for (let i = 0; i < verts.length; i++) {
      const pos = new THREE.Vector3(...verts[i]);
      const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
      sphere.position.copy(pos);
      highlightGroup.current.add(sphere);
      labelGroup.current.add(createTextLabel((i + 1).toString(), pos));
      setCount(i + 1);
      await new Promise(r => setTimeout(r, 600));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#020617] p-4 font-sans text-slate-100">
      <div className="bg-[#000000] rounded-2xl shadow-2xl overflow-hidden flex flex-col items-center border border-slate-800 w-full max-w-[550px]">
        <div className="p-4 w-full bg-[#000000] border-b border-slate-900 flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-tight uppercase text-orange-500 italic">3D Cuboid Explorer</h1>
          {count > 0 && (
            <div className="px-4 py-1.5 bg-slate-900 text-orange-400 rounded-full text-sm font-black border border-orange-500/50">
              {activeLabel}: {count}
            </div>
          )}
        </div>

        <div 
          ref={mountRef} 
          className={`w-[500px] h-[500px] bg-transparent ${isProcessing ? 'cursor-wait' : 'cursor-grab active:cursor-grabbing'}`}
        />
        
        <div className="w-full p-8 bg-[#000000] border-t border-slate-900">
          {!isDoneStacking ? (
            <div className="space-y-6">
              <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                <span>Start</span>
                <span>Final Shape</span>
              </div>
              <input 
                type="range" min="0" max="100" value={sliderVal} 
                onChange={(e) => setSliderVal(parseInt(e.target.value))}
                onMouseUp={handleSliderRelease} onTouchEnd={handleSliderRelease}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-3 gap-3">
                {['Faces', 'Edges', 'Vertices'].map((label) => (
                  <button 
                    key={label} disabled={isProcessing}
                    onClick={() => {
                      if(label === 'Faces') startHighlightAction(highlightFaces);
                      if(label === 'Edges') startHighlightAction(highlightEdges);
                      if(label === 'Vertices') startHighlightAction(highlightVertices);
                    }}
                    className={`py-4 px-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                      isProcessing 
                        ? 'bg-slate-950 text-slate-800 border border-slate-900' 
                        : 'bg-slate-950 hover:bg-slate-900 text-slate-300 border border-slate-800 active:scale-95 shadow-inner'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="flex flex-col items-center gap-2">
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">
                  {isProcessing ? "Animation in progress... Camera Locked" : "Drag to Rotate • Scroll to Zoom"}
                </p>
                <button onClick={() => window.location.reload()} className="text-[10px] text-slate-600 hover:text-orange-500 font-black uppercase tracking-[0.2em]">Reset Scene</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;