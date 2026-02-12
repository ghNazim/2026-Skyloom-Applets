// =============================================================================
// Hemisphere Visual Component for Intro to Hemisphere Applet
// =============================================================================

const HEMI_RADIUS = 3;
const HEMI_SEGMENTS = 128;

const HemisphereVisual = ({ action, labelMode, onAnimationComplete }) => {
  const { useEffect, useRef } = React;
  const mountRef = useRef(null);
  const svgRef = useRef(null);
  const threeRef = useRef({});
  const prevActionKeyRef = useRef(null);
  const timelineRef = useRef(null);
  const onAnimCompleteRef = useRef(onAnimationComplete);

  // Always keep the callback ref up to date
  useEffect(() => {
    onAnimCompleteRef.current = onAnimationComplete;
  });

  // =====================================================================
  // MOUNT EFFECT: Create Three.js scene, materials, animation loop
  // =====================================================================
  useEffect(() => {
    const container = mountRef.current.querySelector("#container");
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;
    const aspect = width / height;
    const d = 5;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
      -d * aspect,
      d * aspect,
      d,
      -d,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
    dirLight.position.set(5, 8, 10);
    scene.add(dirLight);
    const backLight = new THREE.DirectionalLight(0xffffff, 0.3);
    backLight.position.set(-3, -2, -5);
    scene.add(backLight);

    // Camera
    camera.position.set(4, 3, 8);
    camera.lookAt(0, 0, 0);

    const r = HEMI_RADIUS;
    const seg = HEMI_SEGMENTS;

    // ---- Materials (same color for sphere and cap; rough so labels are visible, no seam) ----
    const sphereColor = 0x42a5f5;
    const sphereMat = new THREE.MeshStandardMaterial({
      color: sphereColor,
      roughness: 0.75,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });
    const capMat = new THREE.MeshStandardMaterial({
      color: sphereColor,
      roughness: 0.75,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });
    // No cap edge lines - avoids visible joining line when sphere is whole (same as sample.js)

    // ---- Root group (for rotation when switching slice type) ----
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // ---- Hemisphere 1 (Top: theta 0 to π/2) ----
    const half1Group = new THREE.Group();
    const geo1 = new THREE.SphereGeometry(
      r, seg, seg, 0, Math.PI * 2, 0, Math.PI / 2
    );
    const mesh1 = new THREE.Mesh(geo1, sphereMat);
    const cap1Geo = new THREE.CircleGeometry(r, seg);
    const cap1 = new THREE.Mesh(cap1Geo, capMat);
    cap1.rotation.x = Math.PI / 2;
    half1Group.add(mesh1, cap1);

    // ---- Hemisphere 2 (Bottom: theta π/2 to π) ----
    const half2Group = new THREE.Group();
    const geo2 = new THREE.SphereGeometry(
      r, seg, seg, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2
    );
    const mesh2 = new THREE.Mesh(geo2, sphereMat);
    const cap2Geo = new THREE.CircleGeometry(r, seg);
    const cap2 = new THREE.Mesh(cap2Geo, capMat);
    cap2.rotation.x = -Math.PI / 2;
    half2Group.add(mesh2, cap2);

    rootGroup.add(half1Group, half2Group);

    // ---- Blade (slicing plane) ----
    const bladeSize = r * 3;
    const bladeMat = new THREE.MeshBasicMaterial({
      color: 0xfdd835,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const blade = new THREE.Mesh(
      new THREE.PlaneGeometry(bladeSize, bladeSize),
      bladeMat
    );
    blade.visible = false;
    scene.add(blade);

    // ---- Store refs ----
    threeRef.current = {
      scene,
      camera,
      renderer,
      container,
      rootGroup,
      half1Group,
      half2Group,
      blade,
      bladeMat,
      labelMode: "initial",
      currentSliceType: null,
      separation: 0,
    };

    // ==================================================================
    // PROJECT 3D → 2D
    // ==================================================================
    const project3DTo2D = (vector3) => {
      const vector = new THREE.Vector3(vector3.x, vector3.y, vector3.z);
      vector.project(camera);
      const x = ((vector.x + 1) / 2) * container.clientWidth;
      const y = ((-vector.y + 1) / 2) * container.clientHeight;
      return { x, y };
    };

    // ==================================================================
    // SVG LABEL UPDATE (called every frame)
    // ==================================================================
    const updateLabels = () => {
      const svg = svgRef.current;
      if (!svg) return;

      const svgWidth = container.clientWidth;
      const svgHeight = container.clientHeight;
      svg.setAttribute("width", svgWidth);
      svg.setAttribute("height", svgHeight);
      svg.setAttribute("viewBox", "0 0 " + svgWidth + " " + svgHeight);
      svg.innerHTML = "";

      const state = threeRef.current;
      const mode = state.labelMode;

      // ---- SVG Defs: arrow markers ----
      const defs = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "defs"
      );
      const createMarker = (id, refX, points, fill) => {
        const marker = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "marker"
        );
        marker.setAttribute("id", id);
        marker.setAttribute("markerWidth", "4");
        marker.setAttribute("markerHeight", "4");
        marker.setAttribute("refX", String(refX));
        marker.setAttribute("refY", "2");
        marker.setAttribute("orient", "auto");
        const poly = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "polygon"
        );
        poly.setAttribute("points", points);
        poly.setAttribute("fill", fill);
        marker.appendChild(poly);
        return marker;
      };
      defs.appendChild(
        createMarker("arr-end-w", 3.5, "0 0, 4 2, 0 4", "#ffffff")
      );
      defs.appendChild(
        createMarker("arr-start-w", 0.5, "4 0, 0 2, 4 4", "#ffffff")
      );
      defs.appendChild(
        createMarker("arr-end-y", 3.5, "0 0, 4 2, 0 4", "#FFD700")
      );
      defs.appendChild(
        createMarker("arr-start-y", 0.5, "4 0, 0 2, 4 4", "#FFD700")
      );
      svg.appendChild(defs);

      // ---- Helper: solid line ----
      const drawSolidLine = (
        start3D,
        end3D,
        color = "#ffffff",
        strokeWidth = 2
      ) => {
        const start = project3DTo2D(start3D);
        const end = project3DTo2D(end3D);
        const line = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "line"
        );
        line.setAttribute("x1", start.x);
        line.setAttribute("y1", start.y);
        line.setAttribute("x2", end.x);
        line.setAttribute("y2", end.y);
        line.setAttribute("stroke", color);
        line.setAttribute("stroke-width", strokeWidth);
        svg.appendChild(line);
      };

      // ---- Helper: dashed line ----
      const drawDashedLine = (
        start3D,
        end3D,
        color = "#ffffff",
        strokeWidth = 1.5
      ) => {
        const start = project3DTo2D(start3D);
        const end = project3DTo2D(end3D);
        const line = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "line"
        );
        line.setAttribute("x1", start.x);
        line.setAttribute("y1", start.y);
        line.setAttribute("x2", end.x);
        line.setAttribute("y2", end.y);
        line.setAttribute("stroke", color);
        line.setAttribute("stroke-width", strokeWidth);
        line.setAttribute("stroke-dasharray", "6,4");
        svg.appendChild(line);
      };

      // ---- Helper: dot ----
      const drawDot = (pos3D, radius = 3, color = "#ffffff") => {
        const pos = project3DTo2D(pos3D);
        const circle = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "circle"
        );
        circle.setAttribute("cx", pos.x);
        circle.setAttribute("cy", pos.y);
        circle.setAttribute("r", radius);
        circle.setAttribute("fill", color);
        svg.appendChild(circle);
      };

      // ---- Helper: text label ----
      const drawLabel = (pos3D, text, opts = {}) => {
        const {
          color = "#ffffff",
          fontSize = "1.8vw",
          fontWeight = "bold",
          fontStyle = "italic",
          offset = { x: 0, y: 0 },
        } = opts;
        const screenPos = project3DTo2D(pos3D);
        const textEl = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text"
        );
        textEl.setAttribute("x", screenPos.x + offset.x);
        textEl.setAttribute("y", screenPos.y + offset.y);
        textEl.setAttribute("fill", color);
        textEl.setAttribute("font-size", fontSize);
        textEl.setAttribute("font-weight", fontWeight);
        textEl.setAttribute("font-style", fontStyle);
        textEl.setAttribute("text-anchor", "middle");
        textEl.setAttribute("dominant-baseline", "middle");
        textEl.textContent = text;
        svg.appendChild(textEl);
      };

      // ---- Helper: bidirectional arrow ----
      const drawBidirectionalArrow = (start3D, end3D, label, opts = {}) => {
        const {
          color = "#ffffff",
          strokeWidth = 1.5,
          dashed = true,
          fontSize = "1.8vw",
          labelOffset = { x: 0, y: 0 },
          markerSuffix = "w",
        } = opts;
        const start = project3DTo2D(start3D);
        const end = project3DTo2D(end3D);
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        if (len === 0) return;

        const line = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "line"
        );
        line.setAttribute("x1", start.x);
        line.setAttribute("y1", start.y);
        line.setAttribute("x2", end.x);
        line.setAttribute("y2", end.y);
        line.setAttribute("stroke", color);
        line.setAttribute("stroke-width", strokeWidth);
        if (dashed) line.setAttribute("stroke-dasharray", "6,3");
        line.setAttribute("marker-start", `url(#arr-start-${markerSuffix})`);
        line.setAttribute("marker-end", `url(#arr-end-${markerSuffix})`);
        svg.appendChild(line);

        if (label) {
          const text = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
          );
          const midX = (start.x + end.x) / 2;
          const midY = (start.y + end.y) / 2;
          text.setAttribute("x", midX + labelOffset.x);
          text.setAttribute("y", midY + labelOffset.y);
          text.setAttribute("fill", color);
          text.setAttribute("font-size", fontSize);
          text.setAttribute("font-weight", "bold");
          text.setAttribute("font-style", "italic");
          text.setAttribute("text-anchor", "middle");
          text.setAttribute("dominant-baseline", "middle");
          text.textContent = label;
          svg.appendChild(text);
        }
      };

      // ==============================================================
      // INITIAL LABELS: sphere with r line and 2r height arrow
      // ==============================================================
      if (mode === "initial") {
        // Radius line from center to right edge (along X at equator)
        drawSolidLine(
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(r, 0, 0),
          "#ffffff",
          2
        );
        drawDot(new THREE.Vector3(0, 0, 0), 3);
        drawDot(new THREE.Vector3(r, 0, 0), 3);
        drawLabel(new THREE.Vector3(r / 2, 0, 0), "r", {
          offset: { x: 0, y: -16 },
        });

        // Height bidirectional arrow (offset to the right of sphere, yellow)
        drawBidirectionalArrow(
          new THREE.Vector3(r + 0.8, -r, 0),
          new THREE.Vector3(r + 0.8, r, 0),
          "2r",
          { labelOffset: { x: 22, y: 0 }, color: "#FFD700", markerSuffix: "y" }
        );
      }

      // ==============================================================
      // HEMISPHERE LABELS: r on each hemisphere after slicing
      // ==============================================================
      else if (mode === "hemispheres") {
        const sep = state.separation;
        const sliceType = state.currentSliceType;

        if (sliceType === "horizontal") {
          // Top hemisphere: radius line from center to edge
          drawSolidLine(
            new THREE.Vector3(0, sep, 0),
            new THREE.Vector3(r, sep, 0),
            "#ffffff",
            2
          );
          drawDot(new THREE.Vector3(0, sep, 0), 3);
          drawDot(new THREE.Vector3(r, sep, 0), 3);
          drawLabel(new THREE.Vector3(r / 2, sep, 0), "r", {
            offset: { x: 0, y: -16 },
          });

          // Bottom hemisphere: radius line from center to edge
          drawSolidLine(
            new THREE.Vector3(0, -sep, 0),
            new THREE.Vector3(r, -sep, 0),
            "#ffffff",
            2
          );
          drawDot(new THREE.Vector3(0, -sep, 0), 3);
          drawDot(new THREE.Vector3(r, -sep, 0), 3);
          drawLabel(new THREE.Vector3(r / 2, -sep, 0), "r", {
            offset: { x: 0, y: 16 },
          });
        } else if (sliceType === "vertical") {
          // Left hemisphere (world: -sep, 0, 0)
          // Radius goes upward from center of flat face
          drawSolidLine(
            new THREE.Vector3(-sep, 0, 0),
            new THREE.Vector3(-sep, r, 0),
            "#ffffff",
            2
          );
          drawDot(new THREE.Vector3(-sep, 0, 0), 3);
          drawDot(new THREE.Vector3(-sep, r, 0), 3);
          drawLabel(new THREE.Vector3(-sep, r / 2, 0), "r", {
            offset: { x: -16, y: 0 },
          });

          // Right hemisphere (world: sep, 0, 0)
          drawSolidLine(
            new THREE.Vector3(sep, 0, 0),
            new THREE.Vector3(sep, r, 0),
            "#ffffff",
            2
          );
          drawDot(new THREE.Vector3(sep, 0, 0), 3);
          drawDot(new THREE.Vector3(sep, r, 0), 3);
          drawLabel(new THREE.Vector3(sep, r / 2, 0), "r", {
            offset: { x: 16, y: 0 },
          });
        }
      }
    };

    threeRef.current.updateLabels = updateLabels;

    // ---- Animation loop ----
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
      updateLabels();
    };
    animate();

    // ---- Resize handler ----
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;
      const a = w / h;
      camera.left = -d * a;
      camera.right = d * a;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(handleResize)
        : null;
    if (resizeObserver) resizeObserver.observe(container);
    window.addEventListener("resize", handleResize);

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
      if (resizeObserver) resizeObserver.unobserve(container);
      window.removeEventListener("resize", handleResize);
      container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  // =====================================================================
  // LABEL MODE SYNC
  // =====================================================================
  useEffect(() => {
    threeRef.current.labelMode = labelMode;
  }, [labelMode]);

  // =====================================================================
  // ACTION EFFECT: Handle slice commands
  // =====================================================================
  useEffect(() => {
    if (!action) return;
    if (action.key === prevActionKeyRef.current) return;
    prevActionKeyRef.current = action.key;

    const { rootGroup, half1Group, half2Group, blade } = threeRef.current;
    if (!rootGroup) return;

    // Kill previous timeline
    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }

    const r = HEMI_RADIUS;
    const separation = r * 0.6;

    const tl = gsap.timeline();
    timelineRef.current = tl;

    // If there was a previous separation, reset first
    const currentSep = Math.abs(half1Group.position.y);
    if (currentSep > 0.01) {
      tl.to(half1Group.position, {
        y: 0,
        duration: 0.6,
        ease: "power2.inOut",
      });
      tl.to(
        half2Group.position,
        { y: 0, duration: 0.6, ease: "power2.inOut" },
        "<"
      );
      tl.to({}, { duration: 0.3 });
    }

    // Set rotation based on slice type
    tl.call(() => {
      rootGroup.rotation.set(
        0,
        0,
        action.type === "vertical" ? Math.PI / 2 : 0
      );
    });

    if (action.type === "horizontal") {
      // Blade: horizontal plane (parallel to XZ), enters from left
      tl.call(() => {
        blade.rotation.set(Math.PI / 2, 0, 0);
        blade.position.set(-8, 0, 0);
        blade.material.opacity = 0;
        blade.visible = true;
      });
      tl.to(blade.material, { opacity: 0.5, duration: 0.3 });
      tl.to(
        blade.position,
        { x: 0, duration: 1.2, ease: "power2.inOut" },
        "<0.1"
      );
      // Wiggle blade at sphere (cutting effect, like sample.js)
      tl.to(
        blade.position,
        { x: 0.15, duration: 0.06, ease: "sine.inOut", yoyo: true, repeat: 3 }
      );
      tl.to({}, { duration: 0.2 });
      tl.to(blade.material, { opacity: 0, duration: 0.5 });
      tl.to(
        half1Group.position,
        { y: separation, duration: 1.0, ease: "power2.out" },
        "-=0.3"
      );
      tl.to(
        half2Group.position,
        { y: -separation, duration: 1.0, ease: "power2.out" },
        "<"
      );
      tl.call(() => {
        blade.visible = false;
        threeRef.current.currentSliceType = "horizontal";
        threeRef.current.separation = separation;
        if (onAnimCompleteRef.current) onAnimCompleteRef.current();
      });
    } else if (action.type === "vertical") {
      // Blade: vertical plane (parallel to YZ), enters from top
      tl.call(() => {
        blade.rotation.set(0, Math.PI / 2, 0);
        blade.position.set(0, 8, 0);
        blade.material.opacity = 0;
        blade.visible = true;
      });
      tl.to(blade.material, { opacity: 0.5, duration: 0.3 });
      tl.to(
        blade.position,
        { y: 0, duration: 1.2, ease: "power2.inOut" },
        "<0.1"
      );
      // Wiggle blade at sphere (cutting effect, like sample.js)
      tl.to(
        blade.position,
        { y: 0.15, duration: 0.06, ease: "sine.inOut", yoyo: true, repeat: 3 }
      );
      tl.to({}, { duration: 0.2 });
      tl.to(blade.material, { opacity: 0, duration: 0.5 });
      tl.to(
        half1Group.position,
        { y: separation, duration: 1.0, ease: "power2.out" },
        "-=0.3"
      );
      tl.to(
        half2Group.position,
        { y: -separation, duration: 1.0, ease: "power2.out" },
        "<"
      );
      tl.call(() => {
        blade.visible = false;
        threeRef.current.currentSliceType = "vertical";
        threeRef.current.separation = separation;
        if (onAnimCompleteRef.current) onAnimCompleteRef.current();
      });
    }
  }, [action]);

  // =====================================================================
  // RENDER
  // =====================================================================
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
