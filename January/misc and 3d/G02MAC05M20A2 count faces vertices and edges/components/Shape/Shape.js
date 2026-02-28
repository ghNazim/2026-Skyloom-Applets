const Shape = ({ dims }) => {
  const { useRef, useEffect } = React;
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current || !window.THREE) return;

    const THREE = window.THREE;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const [w, h, d] = dims;
    const maxDim = Math.max(w, h, d);
    const frustumSize = maxDim + 3;
    const centerY = h / 2;

    const scene = new THREE.Scene();
    const aspect = width / height;

    const camera = new THREE.OrthographicCamera(
      (frustumSize * aspect) / -2,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      frustumSize / -2,
      0.1,
      1000
    );
    camera.position.set(maxDim * 1.5 + 1, maxDim * 1.5 + 1, maxDim * 2 + 1);
    camera.lookAt(0, centerY, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(0x000000, 1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(4, 6, 5);
    scene.add(directionalLight);

    const geom = new THREE.BoxGeometry(w, h, d);
    const mat = new THREE.MeshStandardMaterial({
      color: 0xf97316,
      transparent: true,
      opacity: 0.6,
      roughness: 1,
      metalness: 0,
    });
    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.y = centerY;

    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(geom),
      new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 })
    );
    mesh.add(edges);
    scene.add(mesh);

    let controls = null;
    if (THREE.OrbitControls) {
      controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.target.set(0, centerY, 0);
    }

    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (controls) controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!container) return;
      const cw = container.clientWidth;
      const ch = container.clientHeight;
      if (cw === 0 || ch === 0) return;
      const asp = cw / ch;
      camera.left = (frustumSize * asp) / -2;
      camera.right = (frustumSize * asp) / 2;
      camera.top = frustumSize / 2;
      camera.bottom = frustumSize / -2;
      camera.updateProjectionMatrix();
      renderer.setSize(cw, ch);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      if (controls) controls.dispose();
      renderer.dispose();
    };
  }, [dims[0], dims[1], dims[2]]);

  return React.createElement("div", {
    ref: mountRef,
    className: "shape-3d-canvas",
  });
};
