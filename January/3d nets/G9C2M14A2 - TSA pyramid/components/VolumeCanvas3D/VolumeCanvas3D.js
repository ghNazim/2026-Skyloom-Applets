const VolumeCanvas3D = ({ positions, questionKey }) => {
  const { useRef, useState, useEffect } = React;
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const cubesGroupRef = useRef(null);
  const meshesRef = useRef([]);
  const spritesRef = useRef([]);
  const raycasterRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationIdRef = useRef(null);
  const numberedSetRef = useRef(new Set());
  const [, setNumberedTick] = useState(0);

  // Reset numbered state when question changes
  useEffect(() => {
    numberedSetRef.current = new Set();
    setNumberedTick((t) => t + 1);
  }, [questionKey]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !positions || positions.length === 0) return;

    const THREE = window.THREE;
    const OrbitControls = window.THREE?.OrbitControls || window.OrbitControls;
    if (!THREE || !OrbitControls) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = null;
    scene.fog = null;
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    const center = positions.reduce(
      (acc, p) => [acc[0] + p[0], acc[1] + p[1], acc[2] + p[2]],
      [0, 0, 0]
    );
    center[0] /= positions.length;
    center[1] /= positions.length;
    center[2] /= positions.length;
    // Fixed distance so every question shows cubes at the same apparent size
    const fixedDistance = 6;
    camera.position.set(
      center[0] + fixedDistance * 0.7,
      center[1] + fixedDistance * 0.7,
      center[2] + fixedDistance * 0.7
    );
    camera.lookAt(center[0], center[1], center[2]);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(center[0], center[1], center[2]);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);

    const blueMaterial = new THREE.MeshStandardMaterial({
      color: 0x0066ff,
      transparent: true,
      opacity: 0.8,
      metalness: 0.3,
      roughness: 0.7,
    });
    const edgeMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.4,
    });

    const cubesGroup = new THREE.Group();
    const meshes = [];
    const geometriesToDispose = [];
    positions.forEach((pos, i) => {
      const cubeGeom = new THREE.BoxGeometry(1, 1, 1);
      const edgeGeom = new THREE.EdgesGeometry(cubeGeom);
      geometriesToDispose.push(cubeGeom, edgeGeom);
      const mat = blueMaterial.clone();
      const mesh = new THREE.Mesh(cubeGeom, mat);
      mesh.position.set(pos[0], pos[1], pos[2]);
      mesh.userData.index = i;
      mesh.userData.position = [...pos];
      const edges = new THREE.LineSegments(edgeGeom, edgeMaterial.clone());
      mesh.add(edges);
      cubesGroup.add(mesh);
      meshes.push(mesh);
    });
    scene.add(cubesGroup);
    cubesGroupRef.current = cubesGroup;
    meshesRef.current = meshes;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    raycasterRef.current = raycaster;
    mouseRef.current = mouse;

    function createNumberTexture(num) {
      const size = 256;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, size, size);
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 8;
      ctx.font = "bold 120px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.strokeText(String(num), size / 2, size / 2);
      ctx.fillStyle = "#ffffff";
      ctx.fillText(String(num), size / 2, size / 2);
      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    }

    function addNumberSprite(num, worldPos) {
      const texture = createNumberTexture(num);
      const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: 0.6,
        alphaTest: 0.01,
        depthTest: false,
        depthWrite: false,
      });
      const sprite = new THREE.Sprite(material);
      sprite.position.copy(worldPos);
      sprite.position.y += 0.01;
      sprite.scale.set(1.2, 1.2, 1);
      sprite.renderOrder = 999;
      scene.add(sprite);
      spritesRef.current.push(sprite);
    }

    function onPointerDown(event) {
      const rect = container.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      // Only raycast against cube meshes (not edge lines) so hit.object is always the correct mesh
      const intersects = raycaster.intersectObjects(cubesGroup.children, false);
      if (intersects.length === 0) return;
      const mesh = intersects[0].object;
      const index = mesh.userData.index;
      if (numberedSetRef.current.has(index)) return;
      numberedSetRef.current.add(index);
      const nextNumber = numberedSetRef.current.size;
      mesh.material.color.setHex(0xffff00);
      mesh.material.emissive.setHex(0x333300);
      const pos = mesh.userData.position;
      const worldPos = new THREE.Vector3(pos[0], pos[1], pos[2]);
      addNumberSprite(nextNumber, worldPos);
    }

    container.addEventListener("pointerdown", onPointerDown);

    function animate() {
      animationIdRef.current = requestAnimationFrame(animate);
      spritesRef.current.forEach((s) => s.lookAt(camera.position));
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    function onResize() {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      container.removeEventListener("pointerdown", onPointerDown);
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
      spritesRef.current.forEach((s) => {
        if (s.material.map) s.material.map.dispose();
        s.material.dispose();
      });
      spritesRef.current = [];
      meshes.forEach((m) => {
        if (m.material) m.material.dispose();
        m.children.forEach((child) => {
          if (child.material) child.material.dispose();
        });
      });
      geometriesToDispose.forEach((g) => g.dispose());
      blueMaterial.dispose();
      edgeMaterial.dispose();
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, [positions, questionKey]);

  return React.createElement("div", {
    ref: containerRef,
    className: "volume-canvas-3d",
    style: { width: "100%", height: "100%", minHeight: 200 },
  });
};
