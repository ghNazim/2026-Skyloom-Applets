// =============================================================================
// HemisphereStill Visual Component - Static hemisphere with radius label
// Used in steps 9-16 (curved & total surface area exploration)
// =============================================================================

const HemisphereStill = ({ highlightBase = false }) => {
  const { useEffect, useRef } = React;
  const mountRef = useRef(null);
  const svgRef = useRef(null);
  const threeRef = useRef({});

  useEffect(() => {
    const container = mountRef.current.querySelector("#container");
    if (!container) return;

    const r = 2.2; // hemisphere radius
    const aspectRatio = container.clientWidth / container.clientHeight;
    const d = 5;

    // ---- Scene ----
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
      -d * aspectRatio,
      d * aspectRatio,
      d,
      -d,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // ---- Lights ----
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
    dirLight.position.set(5, 8, 10);
    scene.add(dirLight);
    const backLight = new THREE.DirectionalLight(0xffffff, 0.3);
    backLight.position.set(-3, -2, -5);
    scene.add(backLight);

    // Camera position - slightly above and looking down
    camera.position.set(4, 3, 8);
    camera.lookAt(0, -0.5, 0);

    // ---- Materials ----
    const sphereColor = 0x00b8d4; // Teal/cyan color matching the image
    const capColor = 0xffa07a; // Salmon/peach color for the flat top

    const sphereMat = new THREE.MeshStandardMaterial({
      color: sphereColor,
      roughness: 0.6,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });

    const capMat = new THREE.MeshStandardMaterial({
      color: capColor,
      roughness: 0.5,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });

    // ---- Hemisphere (bottom half: theta pi/2 to pi) ----
    const hemiGeo = new THREE.SphereGeometry(
      r, 128, 64, 0, Math.PI * 2, 0, Math.PI / 2
    );
    const hemiMesh = new THREE.Mesh(hemiGeo, sphereMat);
    // Rotate so the flat side faces up
    hemiMesh.rotation.x = Math.PI;
    scene.add(hemiMesh);

    // ---- Circular cap (flat top) ----
    const capGeo = new THREE.CircleGeometry(r, 128);
    const capMesh = new THREE.Mesh(capGeo, capMat);
    capMesh.rotation.x = -Math.PI / 2;
    capMesh.position.y = 0;
    scene.add(capMesh);

    // Store refs for highlight updates
    threeRef.current = {
      scene, camera, renderer, container,
      sphereMat, capMat, hemiMesh, capMesh, r,
    };

    // ==================================================================
    // SVG LABELS
    // ==================================================================
    const project3DTo2D = (vector3) => {
      const vector = new THREE.Vector3(vector3.x, vector3.y, vector3.z);
      vector.project(camera);
      return {
        x: ((vector.x + 1) / 2) * container.clientWidth,
        y: ((-vector.y + 1) / 2) * container.clientHeight,
      };
    };

    const updateLabels = () => {
      const svg = svgRef.current;
      if (!svg) return;

      const svgW = container.clientWidth;
      const svgH = container.clientHeight;
      svg.setAttribute("width", svgW);
      svg.setAttribute("height", svgH);
      svg.setAttribute("viewBox", `0 0 ${svgW} ${svgH}`);
      svg.innerHTML = "";

      // ---- Radius line from center to edge at cap level ----
      const center = project3DTo2D(new THREE.Vector3(0, 0, 0));
      const edge = project3DTo2D(new THREE.Vector3(r, 0, 0));

      // Solid line for radius
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", center.x);
      line.setAttribute("y1", center.y);
      line.setAttribute("x2", edge.x);
      line.setAttribute("y2", edge.y);
      line.setAttribute("stroke", "#ffffff");
      line.setAttribute("stroke-width", 2.5);
      svg.appendChild(line);

      // Center dot
      const dot1 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      dot1.setAttribute("cx", center.x);
      dot1.setAttribute("cy", center.y);
      dot1.setAttribute("r", 4);
      dot1.setAttribute("fill", "#ffffff");
      svg.appendChild(dot1);

      // Edge dot
      const dot2 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      dot2.setAttribute("cx", edge.x);
      dot2.setAttribute("cy", edge.y);
      dot2.setAttribute("r", 4);
      dot2.setAttribute("fill", "#ffffff");
      svg.appendChild(dot2);

      // "r" label above radius line
      const midX = (center.x + edge.x) / 2;
      const midY = (center.y + edge.y) / 2;
      const textEl = document.createElementNS("http://www.w3.org/2000/svg", "text");
      textEl.setAttribute("x", midX);
      textEl.setAttribute("y", midY - 14);
      textEl.setAttribute("fill", "#ffffff");
      textEl.setAttribute("font-size", "2vw");
      textEl.setAttribute("font-weight", "bold");
      textEl.setAttribute("font-style", "italic");
      textEl.setAttribute("text-anchor", "middle");
      textEl.setAttribute("dominant-baseline", "middle");
      textEl.textContent = "r";
      svg.appendChild(textEl);
    };

    updateLabels();

    // ---- Animation loop ----
    const animId = { value: null };
    const animate = () => {
      animId.value = requestAnimationFrame(animate);
      renderer.render(scene, camera);
      updateLabels();
    };
    animate();

    // ---- Resize ----
    const handleResize = () => {
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      if (!nw || !nh) return;
      const na = nw / nh;
      camera.left = -d * na;
      camera.right = d * na;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(handleResize)
        : null;
    if (ro) ro.observe(container);
    window.addEventListener("resize", handleResize);

    return () => {
      if (ro) ro.unobserve(container);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId.value);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      hemiGeo.dispose();
      capGeo.dispose();
    };
  }, []);

  // =====================================================================
  // HIGHLIGHT BASE EFFECT
  // - When highlightBase is true: circular cap highlighted, curved surface dehighlighted
  // - When false: both at full opacity
  // =====================================================================
  useEffect(() => {
    const { sphereMat, capMat } = threeRef.current;
    if (!sphereMat || !capMat) return;

    if (highlightBase) {
      // Dehighlight curved surface
      sphereMat.transparent = true;
      sphereMat.opacity = 0.2;
      // Highlight cap
      capMat.transparent = false;
      capMat.opacity = 1;
    } else {
      // Reset both to full
      sphereMat.transparent = false;
      sphereMat.opacity = 1;
      capMat.transparent = false;
      capMat.opacity = 1;
    }
  }, [highlightBase]);

  // ==========================================================================
  // RENDER
  // ==========================================================================
  return React.createElement(
    "div",
    {
      ref: mountRef,
      id: "container-wrapper",
      style: { width: "100%", height: "100%", position: "relative" },
    },
    React.createElement("div", { id: "container" }),
    React.createElement("svg", {
      ref: svgRef,
      style: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 10,
      },
    })
  );
};
