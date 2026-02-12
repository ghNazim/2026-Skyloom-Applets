// =============================================================================
// SphereStill Visual Component - Static sphere + rectangle side by side
// Used in steps 5-6 (MCQ and equation steps)
// =============================================================================

const SphereStill = () => {
  const { useEffect, useRef } = React;
  const mountRef = useRef(null);
  const svgRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current.querySelector("#container");
    if (!container) return;

    const sR = 1.2 * 1.15; // sphere radius (15% increase, ~1.38, for side-by-side)
    const sH = 2 * sR; // sphere height / diameter
    const aspectRatio = container.clientWidth / container.clientHeight;
    const d = 6.5; // wider view to fit increased spacing between sphere and rectangle

    // ---- Scene ----
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
      -d * aspectRatio,
      d * aspectRatio,
      d + 0.5,
      -d + 0.5,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // ---- Lights ----
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(40, 7, 5);
    scene.add(directionalLight);

    camera.position.set(0, sH * 0.5, sR * 6);
    camera.lookAt(0, 0, 0);

    // ---- Materials ----
    const surfaceColor = 0x42a5f5;
    const surfaceMaterial = new THREE.MeshStandardMaterial({
      color: surfaceColor,
      side: THREE.DoubleSide,
    });

    // =============================================
    // LEFT: Sphere (no grid lines)
    // =============================================
    const sphereOffset = -5.5; // increased distance from center so "2r" label doesn't overlap arrow
    const sphereGeo = new THREE.SphereGeometry(sR, 64, 64);
    const sphere = new THREE.Mesh(sphereGeo, surfaceMaterial.clone());
    sphere.position.x = sphereOffset;
    scene.add(sphere);

    // =============================================
    // RIGHT: Rectangle (no grid lines)
    // =============================================
    const rectW = 2 * Math.PI * sR;
    const rectH = sH;
    const rectOffset = 5.5; // increased distance from center for clearer spacing
    const planeGeo = new THREE.PlaneGeometry(rectW, rectH);
    const rect = new THREE.Mesh(planeGeo, surfaceMaterial.clone());
    rect.position.set(rectOffset, 0, 0);
    scene.add(rect);

    // ==========================================================================
    // SVG LABELS
    // ==========================================================================
    const project3DTo2D = (vector3) => {
      const vector = new THREE.Vector3(vector3.x, vector3.y, vector3.z);
      vector.project(camera);
      return {
        x: ((vector.x + 1) / 2) * container.clientWidth,
        y: ((-vector.y + 1) / 2) * container.clientHeight,
      };
    };

    const updateLabels = () => {
      if (!svgRef.current) return;
      const svg = svgRef.current;
      const svgW = container.clientWidth;
      const svgH = container.clientHeight;
      svg.setAttribute("width", svgW);
      svg.setAttribute("height", svgH);
      svg.setAttribute("viewBox", `0 0 ${svgW} ${svgH}`);
      svg.innerHTML = "";

      // Defs
      const defs = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "defs"
      );
      const mkMarker = (id, refX, pts, fill) => {
        const m = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "marker"
        );
        m.setAttribute("id", id);
        m.setAttribute("markerWidth", "4");
        m.setAttribute("markerHeight", "4");
        m.setAttribute("refX", String(refX));
        m.setAttribute("refY", "2");
        m.setAttribute("orient", "auto");
        const p = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "polygon"
        );
        p.setAttribute("points", pts);
        p.setAttribute("fill", fill);
        m.appendChild(p);
        return m;
      };
      defs.appendChild(
        mkMarker("arr-end-w", 3.5, "0 0, 4 2, 0 4", "#ffffff")
      );
      defs.appendChild(
        mkMarker("arr-start-w", 0.5, "4 0, 0 2, 4 4", "#ffffff")
      );
      defs.appendChild(
        mkMarker("arr-end-b", 3.5, "0 0, 4 2, 0 4", "#60a5fa")
      );
      defs.appendChild(
        mkMarker("arr-start-b", 0.5, "4 0, 0 2, 4 4", "#60a5fa")
      );
      // Light pink (width) and yellow (height) markers
      defs.appendChild(
        mkMarker("arr-end-pink", 3.5, "0 0, 4 2, 0 4", "#FFB6C1")
      );
      defs.appendChild(
        mkMarker("arr-start-pink", 0.5, "4 0, 0 2, 4 4", "#FFB6C1")
      );
      defs.appendChild(
        mkMarker("arr-end-y", 3.5, "0 0, 4 2, 0 4", "#FFD700")
      );
      defs.appendChild(
        mkMarker("arr-start-y", 0.5, "4 0, 0 2, 4 4", "#FFD700")
      );
      // Gray arrow for the connecting arrow
      defs.appendChild(
        mkMarker("arr-end-g", 3.5, "0 0, 4 2, 0 4", "#9ca3af")
      );
      svg.appendChild(defs);

      // Helper: bidirectional arrow
      const biArrow = (s3D, e3D, label, opts = {}) => {
        const {
          offset = 0,
          color = "#ffffff",
          strokeWidth = 1.5,
          dashed = true,
          fontSize = "1.6vw",
          labelOffset = { x: 0, y: 0 },
          labelColor = null,
          markerSuffix = "w",
        } = opts;
        const sPos = project3DTo2D(s3D);
        const ePos = project3DTo2D(e3D);
        const dx = ePos.x - sPos.x;
        const dy = ePos.y - sPos.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        if (len === 0) return;
        const px = (-dy / len) * offset;
        const py = (dx / len) * offset;
        const sx = sPos.x + px,
          sy = sPos.y + py;
        const ex = ePos.x + px,
          ey = ePos.y + py;

        const line = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "line"
        );
        line.setAttribute("x1", sx);
        line.setAttribute("y1", sy);
        line.setAttribute("x2", ex);
        line.setAttribute("y2", ey);
        line.setAttribute("stroke", color);
        line.setAttribute("stroke-width", strokeWidth);
        if (dashed) line.setAttribute("stroke-dasharray", "6,3");
        line.setAttribute(
          "marker-start",
          `url(#arr-start-${markerSuffix})`
        );
        line.setAttribute("marker-end", `url(#arr-end-${markerSuffix})`);
        svg.appendChild(line);

        if (label) {
          const text = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
          );
          text.setAttribute(
            "x",
            (sx + ex) / 2 + px * 1.5 + labelOffset.x
          );
          text.setAttribute(
            "y",
            (sy + ey) / 2 + py * 1.5 + labelOffset.y
          );
          text.setAttribute("fill", labelColor || color);
          text.setAttribute("font-size", fontSize);
          text.setAttribute("font-weight", "bold");
          text.setAttribute("text-anchor", "middle");
          text.setAttribute("dominant-baseline", "middle");
          text.textContent = label;
          svg.appendChild(text);
        }
      };

      // Helper: dashed line
      const dashedLine = (
        s3D,
        e3D,
        color = "#ffffff",
        strokeWidth = 1.5
      ) => {
        const sPos = project3DTo2D(s3D);
        const ePos = project3DTo2D(e3D);
        const line = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "line"
        );
        line.setAttribute("x1", sPos.x);
        line.setAttribute("y1", sPos.y);
        line.setAttribute("x2", ePos.x);
        line.setAttribute("y2", ePos.y);
        line.setAttribute("stroke", color);
        line.setAttribute("stroke-width", strokeWidth);
        line.setAttribute("stroke-dasharray", "6,4");
        svg.appendChild(line);
      };

      // Helper: text label
      const textLabel = (pos3D, txt, opts = {}) => {
        const {
          color = "#ffffff",
          fontSize = "1.6vw",
          fontWeight = "bold",
          fontStyle = "italic",
          offset = { x: 0, y: 0 },
        } = opts;
        const sp = project3DTo2D(pos3D);
        const te = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text"
        );
        te.setAttribute("x", sp.x + offset.x);
        te.setAttribute("y", sp.y + offset.y);
        te.setAttribute("fill", color);
        te.setAttribute("font-size", fontSize);
        te.setAttribute("font-weight", fontWeight);
        te.setAttribute("font-style", fontStyle);
        te.setAttribute("text-anchor", "middle");
        te.setAttribute("dominant-baseline", "middle");
        te.textContent = txt;
        svg.appendChild(te);
      };

      // Helper: solid line
      const solidLine = (s3D, e3D, color = "#ffffff", strokeWidth = 2) => {
        const sPos = project3DTo2D(s3D);
        const ePos = project3DTo2D(e3D);
        const line = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "line"
        );
        line.setAttribute("x1", sPos.x);
        line.setAttribute("y1", sPos.y);
        line.setAttribute("x2", ePos.x);
        line.setAttribute("y2", ePos.y);
        line.setAttribute("stroke", color);
        line.setAttribute("stroke-width", strokeWidth);
        svg.appendChild(line);
      };

      // ==============================
      // SPHERE LABELS (left side)
      // ==============================
      // Radius line above sphere (white)
      dashedLine(
        new THREE.Vector3(sphereOffset, sR + 0.2, 0),
        new THREE.Vector3(sphereOffset + sR, sR + 0.2, 0),
        "#ffffff",
        1.5
      );
      textLabel(
        new THREE.Vector3(sphereOffset + sR / 2, sR + 0.2, 0),
        "r",
        { offset: { x: 0, y: -14 }, color: "#ffffff" }
      );

      // Height arrow on right of sphere (yellow)
      biArrow(
        new THREE.Vector3(sphereOffset + sR + 0.4, -sR, 0),
        new THREE.Vector3(sphereOffset + sR + 0.4, sR, 0),
        "2r",
        {
          color: "#FFD700",
          dashed: true,
          labelOffset: { x: 18, y: 0 },
          labelColor: "#FFD700",
          markerSuffix: "y",
        }
      );

      // ==============================
      // CONNECTING ARROW (middle) - starts well right of sphere "2r" label
      // ==============================
      const arrowStart = project3DTo2D(
        new THREE.Vector3(sphereOffset + sR + 1.8, 0, 0)
      );
      const arrowEnd = project3DTo2D(
        new THREE.Vector3(rectOffset - rectW / 2 - 0.5, 0, 0)
      );
      const arrowLine = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );
      arrowLine.setAttribute("x1", arrowStart.x);
      arrowLine.setAttribute("y1", arrowStart.y);
      arrowLine.setAttribute("x2", arrowEnd.x);
      arrowLine.setAttribute("y2", arrowEnd.y);
      arrowLine.setAttribute("stroke", "#9ca3af");
      arrowLine.setAttribute("stroke-width", "3");
      arrowLine.setAttribute("marker-end", "url(#arr-end-g)");
      svg.appendChild(arrowLine);

      // ==============================
      // RECTANGLE LABELS (right side) - width/line light pink, height yellow
      // Top edge (circumference) highlighted in light pink
      // ==============================
      // Highlight top edge of rectangle (circumference)
      solidLine(
        new THREE.Vector3(rectOffset - rectW / 2, rectH / 2, 0),
        new THREE.Vector3(rectOffset + rectW / 2, rectH / 2, 0),
        "#FFB6C1",
        3
      );
      // Width arrow above rectangle (light pink)
      biArrow(
        new THREE.Vector3(rectOffset - rectW / 2 + 0.1, rectH / 2 + 0.3, 0),
        new THREE.Vector3(rectOffset + rectW / 2 - 0.1, rectH / 2 + 0.3, 0),
        "2πr",
        {
          color: "#FFB6C1",
          dashed: true,
          fontSize: "1.5vw",
          labelOffset: { x: 0, y: -14 },
          labelColor: "#FFB6C1",
          markerSuffix: "pink",
        }
      );

      // Height arrow on right of rectangle (yellow)
      biArrow(
        new THREE.Vector3(rectOffset + rectW / 2 + 0.4, -rectH / 2, 0),
        new THREE.Vector3(rectOffset + rectW / 2 + 0.4, rectH / 2, 0),
        "2r",
        {
          color: "#FFD700",
          dashed: true,
          labelOffset: { x: 18, y: 0 },
          labelColor: "#FFD700",
          markerSuffix: "y",
        }
      );
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
      sphereGeo.dispose();
      planeGeo.dispose();
    };
  }, []);

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
