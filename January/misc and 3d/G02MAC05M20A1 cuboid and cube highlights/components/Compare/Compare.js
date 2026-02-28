const CuboidFigure = () => {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!ref.current || !window.THREE) return;
    const THREE = window.THREE;
    const scene = new THREE.Scene();
    const width = ref.current.clientWidth;
    const height = ref.current.clientHeight;
    const aspect = width / height;
    const frustumSize = 3;
    const camera = new THREE.OrthographicCamera(
      (frustumSize * aspect) / -2,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      frustumSize / -2,
      0.1,
      1000
    );
    camera.position.set(3.5, 3.5, 5);
    camera.lookAt(0, 0.5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    ref.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(4, 6, 5);
    scene.add(directionalLight);

    const geom = new THREE.BoxGeometry(2, 1, 1);
    const mat = new THREE.MeshStandardMaterial({
      color: 0xdb681c,
      transparent: true,
      opacity: 0.5,
      roughness: 1,
      metalness: 0,
    });
    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.y = 0.5;
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(geom),
      new THREE.LineBasicMaterial({ color: 0xffffff })
    );
    mesh.add(edges);
    scene.add(mesh);

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!ref.current) return;
      const w = ref.current.clientWidth;
      const h = ref.current.clientHeight;
      const asp = w / h;
      camera.left = (frustumSize * asp) / -2;
      camera.right = (frustumSize * asp) / 2;
      camera.top = frustumSize / 2;
      camera.bottom = frustumSize / -2;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      if (ref.current && ref.current.contains(renderer.domElement)) {
        ref.current.removeChild(renderer.domElement);
      }
    };
  }, []);
  return React.createElement("div", {
    ref: ref,
    className: "compare-figure",
    style: { width: "100%", height: "100%", minHeight: 120 },
  });
};

const CubeFigure = () => {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!ref.current || !window.THREE) return;
    const THREE = window.THREE;
    const scene = new THREE.Scene();
    const width = ref.current.clientWidth;
    const height = ref.current.clientHeight;
    const aspect = width / height;
    const frustumSize = 3;
    const camera = new THREE.OrthographicCamera(
      (frustumSize * aspect) / -2,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      frustumSize / -2,
      0.1,
      1000
    );
    camera.position.set(3.5, 3.5, 5);
    camera.lookAt(0, 0.5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    ref.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(4, 6, 5);
    scene.add(directionalLight);

    const geom = new THREE.BoxGeometry(1, 1, 1);
    const mat = new THREE.MeshStandardMaterial({
      color: 0xf7c11f,
      transparent: true,
      opacity: 0.5,
      roughness: 1,
      metalness: 0,
    });
    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.y = 0.5;
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(geom),
      new THREE.LineBasicMaterial({ color: 0xffffff })
    );
    mesh.add(edges);
    scene.add(mesh);

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!ref.current) return;
      const w = ref.current.clientWidth;
      const h = ref.current.clientHeight;
      const asp = w / h;
      camera.left = (frustumSize * asp) / -2;
      camera.right = (frustumSize * asp) / 2;
      camera.top = frustumSize / 2;
      camera.bottom = frustumSize / -2;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      if (ref.current && ref.current.contains(renderer.domElement)) {
        ref.current.removeChild(renderer.domElement);
      }
    };
  }, []);
  return React.createElement("div", {
    ref: ref,
    className: "compare-figure",
    style: { width: "100%", height: "100%", minHeight: 120 },
  });
};

const Compare = ({ cuboidData, cubeData }) => {

  const Card = ({ title, features, Figure }) =>
    React.createElement(
      "div",
      { className: "compare-card" },
      React.createElement("div", { className: "compare-card-figure" }, React.createElement(Figure)),
      React.createElement("h3", { className: "compare-card-title" }, title),
      React.createElement(
        "div",
        { className: "compare-card-features" },
        features.map((f, i) =>
          React.createElement("div", { key: i, className: "compare-feature-item" }, f)
        )
      )
    );

  return React.createElement(
    "div",
    { className: "compare-container" },
    React.createElement(Card, {
      title: cuboidData.title,
      features: cuboidData.features,
      Figure: CuboidFigure,
    }),
    React.createElement(Card, {
      title: cubeData.title,
      features: cubeData.features,
      Figure: CubeFigure,
    })
  );
};
