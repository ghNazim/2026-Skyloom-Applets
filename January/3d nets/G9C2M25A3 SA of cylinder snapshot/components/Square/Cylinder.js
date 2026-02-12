// =============================================================================
// Cylinder Visual Component for Surface Area of Cylinder Applet
// =============================================================================

const T = {
  parameters: {
    surfaceColor: 0xfab868, // warm peach for curved surface
    baseColor: 0xf87171, // salmon/coral for circular bases
    surfaceOpacity: 1,
  },
};

const getShapeData = (s, r) => {
  const halfPerimeter = Math.PI * r;
  const length = halfPerimeter * s;
  const l = halfPerimeter - length;
  const angle = l / r;
  return { angle, length };
};

const CYL_RADIUS = 1.5;
const CYL_HEIGHT = 2;

const CylinderVisual = ({
  unfoldValue,
  showRectBorders = true,
  showHeightArrow = false,
  showWidthArrow = false,
  showLateralLabel = false,
  showCurvedAreaLabel = false,
  showBaseLabel = false,
  showBaseAreaLabel = false,
  dehighlightBases = false,
  dehighlightSurface = false,
}) => {
  const radius = CYL_RADIUS;
  const height = CYL_HEIGHT;
  let unwrap = unfoldValue * 2;
  const { useEffect, useRef } = React;
  const mountRef = useRef(null);
  const svgRef = useRef(null);
  const threeRef = useRef({});

  // =====================================================================
  // MOUNT EFFECT: Create scene, materials, helpers, animation loop
  // =====================================================================
  useEffect(() => {
    const container = mountRef.current.querySelector("#container");
    if (!container) return;
    const aspectRatio = container.clientWidth / container.clientHeight;
    const d = 4;

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

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(40, 7, 5);
    scene.add(directionalLight);

    camera.position.set(0, height * 1, radius * 4);
    camera.lookAt(0, 0, 0);

    // ---- Create materials ----
    const topBaseMaterial = new THREE.MeshStandardMaterial({
      color: T.parameters.baseColor,
      side: THREE.DoubleSide,
    });
    const bottomBaseMaterial = new THREE.MeshStandardMaterial({
      color: T.parameters.baseColor,
      side: THREE.DoubleSide,
    });
    const surfaceMaterial = new THREE.MeshStandardMaterial({
      color: T.parameters.surfaceColor,
      transparent: true,
      opacity: T.parameters.surfaceOpacity,
      side: THREE.DoubleSide,
    });
    const circleEdgeMaterial = new THREE.LineBasicMaterial({
      color: 0x3b82f6,
      linewidth: 2,
    });

    // Store in ref
    threeRef.current = {
      scene,
      camera,
      renderer,
      container,
      topBaseMaterial,
      bottomBaseMaterial,
      surfaceMaterial,
      circleEdgeMaterial,
      unfoldValue,
      showRectBorders,
      showHeightArrow,
      showWidthArrow,
      showLateralLabel,
      showCurvedAreaLabel,
      showBaseLabel,
      showBaseAreaLabel,
      dehighlightSurface,
    };

    // ---- Project 3D → 2D ----
    const project3DTo2D = (vector3) => {
      const vector = new THREE.Vector3(vector3.x, vector3.y, vector3.z);
      vector.project(camera);
      const x = ((vector.x + 1) / 2) * container.clientWidth;
      const y = ((-vector.y + 1) / 2) * container.clientHeight;
      return { x, y };
    };

    // ==================================================================
    // SVG LABEL UPDATE FUNCTION (called every frame)
    // ==================================================================
    const updateLabels = (currentUnfoldValue) => {
      if (!svgRef.current || !camera) return;

      const svg = svgRef.current;
      const svgWidth = container.clientWidth;
      const svgHeight = container.clientHeight;
      svg.setAttribute("width", svgWidth);
      svg.setAttribute("height", svgHeight);
      svg.setAttribute("viewBox", `0 0 ${svgWidth} ${svgHeight}`);
      svg.innerHTML = "";

      const state = threeRef.current;
      const isFullyUnfolded = currentUnfoldValue >= 0.999;

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
      svg.appendChild(defs);

      // ---- Helper: bidirectional arrow ----
      const createBidirectionalArrow = (start3D, end3D, label, opts = {}) => {
        const {
          offset = 0,
          color = "#ffffff",
          strokeWidth = 1.5,
          dashed = true,
          fontSize = "1.6vw",
          labelOffset = { x: 0, y: 0 },
          labelColor = null,
        } = opts;

        const start = project3DTo2D(start3D);
        const end = project3DTo2D(end3D);
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        if (len === 0) return;
        const perpX = (-dy / len) * offset;
        const perpY = (dx / len) * offset;

        const sx = start.x + perpX;
        const sy = start.y + perpY;
        const ex = end.x + perpX;
        const ey = end.y + perpY;

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
        line.setAttribute("marker-start", "url(#arr-start-w)");
        line.setAttribute("marker-end", "url(#arr-end-w)");
        svg.appendChild(line);

        if (label) {
          const text = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
          );
          const midX = (sx + ex) / 2;
          const midY = (sy + ey) / 2;
          text.setAttribute("x", midX + perpX * 1.5 + labelOffset.x);
          text.setAttribute("y", midY + perpY * 1.5 + labelOffset.y);
          text.setAttribute("fill", labelColor || color);
          text.setAttribute("font-size", fontSize);
          text.setAttribute("font-weight", "bold");
          text.setAttribute("text-anchor", "middle");
          text.setAttribute("dominant-baseline", "middle");
          text.textContent = label;
          svg.appendChild(text);
        }
      };

      // ---- Helper: solid line ----
      const createSolidLine = (
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

      // ---- Helper: text label ----
      const createLabel = (pos3D, text, opts = {}) => {
        const {
          color = "#ffffff",
          fontSize = "1.6vw",
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

      const r = radius;
      const h = height;
      const rectHalfW = Math.PI * r;
      const circleTopY = h / 2 + r;
      const circleBotY = -(h / 2 + r);

      // ==============================================================
      // RECTANGLE BORDERS (blue top/bottom, white left/right)
      // ==============================================================
      if (isFullyUnfolded && state.showRectBorders) {
        createSolidLine(
          new THREE.Vector3(-rectHalfW, h / 2, -r),
          new THREE.Vector3(rectHalfW, h / 2, -r),
          "#3b82f6",
          2.5
        );
        createSolidLine(
          new THREE.Vector3(-rectHalfW, -h / 2, -r),
          new THREE.Vector3(rectHalfW, -h / 2, -r),
          "#3b82f6",
          2.5
        );
        createSolidLine(
          new THREE.Vector3(-rectHalfW, -h / 2, -r),
          new THREE.Vector3(-rectHalfW, h / 2, -r),
          "#ffffff",
          2.5
        );
        createSolidLine(
          new THREE.Vector3(rectHalfW, -h / 2, -r),
          new THREE.Vector3(rectHalfW, h / 2, -r),
          "#ffffff",
          2.5
        );
      }

      // ==============================================================
      // HEIGHT ARROW (h - bidirectional, right side of rectangle)
      // ==============================================================
      if (isFullyUnfolded && state.showHeightArrow) {
        createBidirectionalArrow(
          new THREE.Vector3(rectHalfW + 0.4, -h / 2, -r),
          new THREE.Vector3(rectHalfW + 0.4, h / 2, -r),
          "h",
          {
            color: "#ffffff",
            dashed: true,
            strokeWidth: 1.5,
            labelOffset: { x: 15, y: 0 },
          }
        );
      }

      // ==============================================================
      // WIDTH ARROW (2πr - bidirectional, top of rectangle)
      // ==============================================================
      if (isFullyUnfolded && state.showWidthArrow) {
        createBidirectionalArrow(
          new THREE.Vector3(-rectHalfW + 0.15, h / 2 - 0.2, -r),
          new THREE.Vector3(rectHalfW - 0.15, h / 2 - 0.2, -r),
          "2\u03C0r",
          {
            color: "#ffffff",
            dashed: true,
            strokeWidth: 1.5,
            fontSize: "1.5vw",
            labelOffset: { x: 0, y: 14 },
          }
        );
      }

      // ==============================================================
      // LATERAL LABEL ("Lateral" on left of curved surface)
      // ==============================================================
      if (isFullyUnfolded && state.showLateralLabel) {
        createLabel(new THREE.Vector3(-rectHalfW, 0, -r), "Lateral", {
          color: "#ffffff",
          fontSize: "1.3vw",
          fontStyle: "normal",
          offset: { x: -35, y: 0 },
        });
      }

      // ==============================================================
      // CURVED AREA LABEL ("A = 2πrh" - below center to avoid 2πr overlap)
      // ==============================================================
      if (isFullyUnfolded && state.showCurvedAreaLabel) {
        createLabel(new THREE.Vector3(0, 0, -r), "A = 2\u03C0rh", {
          color: "#ffffff",
          fontSize: "2.7vw",
          fontStyle: "normal",
          offset: { x: 0, y: 15 },
        });
      }

      // ==============================================================
      // BASE LABEL ("Base" on left of each flap)
      // ==============================================================
      if (isFullyUnfolded && state.showBaseLabel) {
        createLabel(new THREE.Vector3(-r, circleTopY, -r), "Base", {
          color: "#ffffff",
          fontSize: "1.3vw",
          fontStyle: "normal",
          offset: { x: -35, y: 0 },
        });
        createLabel(new THREE.Vector3(-r, circleBotY, -r), "Base", {
          color: "#ffffff",
          fontSize: "1.3vw",
          fontStyle: "normal",
          offset: { x: -35, y: 0 },
        });
      }

      // ==============================================================
      // BASE AREA LABEL ("A = πr²" on each flap)
      // ==============================================================
      if (isFullyUnfolded && state.showBaseAreaLabel) {
        createLabel(
          new THREE.Vector3(0, circleTopY, -r),
          "A = \u03C0r\u00B2",
          {
            color: "#ffffff",
            fontSize: "2.52vw",
            fontStyle: "normal",
          }
        );
        createLabel(
          new THREE.Vector3(0, circleBotY, -r),
          "A = \u03C0r\u00B2",
          {
            color: "#ffffff",
            fontSize: "2.52vw",
            fontStyle: "normal",
          }
        );
      }
    };

    threeRef.current.updateLabels = updateLabels;
    updateLabels(unfoldValue);

    // ---- Animation loop ----
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
      if (threeRef.current.updateLabels) {
        threeRef.current.updateLabels(threeRef.current.unfoldValue);
      }
    };
    animate();

    // ---- Resize handler ----
    const handleResize = () => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      if (!newWidth || !newHeight) return;
      const newAspectRatio = newWidth / newHeight;
      camera.left = -d * newAspectRatio;
      camera.right = d * newAspectRatio;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(handleResize)
        : null;
    if (resizeObserver) resizeObserver.observe(container);
    window.addEventListener("resize", handleResize);

    return () => {
      if (resizeObserver) resizeObserver.unobserve(container);
      window.removeEventListener("resize", handleResize);
      container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  // =====================================================================
  // GEOMETRY UPDATE EFFECT
  // =====================================================================
  useEffect(() => {
    const {
      scene,
      camera,
      renderer,
      topBaseMaterial,
      bottomBaseMaterial,
      surfaceMaterial,
      circleEdgeMaterial,
    } = threeRef.current;
    if (!scene) return;

    const disposeGroup = (group) => {
      if (!group) return;
      group.traverse((child) => {
        if (child.isMesh && child.geometry) child.geometry.dispose();
        if (child.isLine && child.geometry) child.geometry.dispose();
      });
      scene.remove(group);
    };

    const createFlaps = (r, h, p) => {
      const flapGeo = new THREE.CircleGeometry(r, 128);

      const topBase = new THREE.Mesh(flapGeo, topBaseMaterial);
      topBase.rotation.x = Math.PI / 2;
      topBase.position.set(0, 0, r);

      const bottomBase = new THREE.Mesh(flapGeo.clone(), bottomBaseMaterial);
      bottomBase.rotation.x = -Math.PI / 2;
      bottomBase.position.set(0, 0, r);

      const topEdges = new THREE.EdgesGeometry(flapGeo);
      topBase.add(new THREE.LineSegments(topEdges, circleEdgeMaterial));
      const bottomEdges = new THREE.EdgesGeometry(flapGeo);
      bottomBase.add(new THREE.LineSegments(bottomEdges, circleEdgeMaterial));

      const topPivot = new THREE.Group();
      topPivot.position.set(0, h / 2, -r);
      const bottomPivot = new THREE.Group();
      bottomPivot.position.set(0, -h / 2, -r);

      topPivot.add(topBase);
      bottomPivot.add(bottomBase);
      scene.add(topPivot);
      scene.add(bottomPivot);

      topPivot.rotation.x = (-p * Math.PI) / 2;
      bottomPivot.rotation.x = (p * Math.PI) / 2;

      threeRef.current.topBase = topBase;
      threeRef.current.bottomBase = bottomBase;

      return [topPivot, bottomPivot];
    };

    const createSurface = (r, h, s) => {
      const data = getShapeData(s, r);
      const group = new THREE.Group();

      const planeGeo = new THREE.PlaneGeometry(2 * data.length, h);
      const plane = new THREE.Mesh(planeGeo, surfaceMaterial);
      plane.position.z = -r;
      group.add(plane);

      const curvedSurfaceGeoRight = new THREE.CylinderGeometry(
        r, r, h, 32, 1, true, Math.PI, -data.angle
      );
      const curvedSurfaceGeoLeft = new THREE.CylinderGeometry(
        r, r, h, 32, 1, true, Math.PI, data.angle
      );

      const curvedSurfaceRight = new THREE.Mesh(
        curvedSurfaceGeoRight, surfaceMaterial
      );
      const curvedSurfaceLeft = new THREE.Mesh(
        curvedSurfaceGeoLeft, surfaceMaterial
      );

      curvedSurfaceRight.position.x = data.length;
      curvedSurfaceLeft.position.x = -data.length;

      group.add(curvedSurfaceRight);
      group.add(curvedSurfaceLeft);
      scene.add(group);

      threeRef.current.rectangle = plane;
      return group;
    };

    // Dispose old geometry
    const { surface, flaps } = threeRef.current;
    disposeGroup(surface);
    if (flaps) {
      disposeGroup(flaps[0]);
      disposeGroup(flaps[1]);
    }

    let p = Math.min(1, unwrap);
    let s = Math.max(0, unwrap - 1);

    const newFlaps = createFlaps(radius, height, p);
    const newSurface = createSurface(radius, height, s);

    threeRef.current.flaps = newFlaps;
    threeRef.current.surface = newSurface;

    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);

    if (threeRef.current.updateLabels) {
      threeRef.current.updateLabels(unfoldValue);
    }
  }, [radius, height, unwrap, unfoldValue]);

  // =====================================================================
  // PROP SYNC EFFECT
  // =====================================================================
  useEffect(() => {
    threeRef.current.unfoldValue = unfoldValue;
    threeRef.current.showRectBorders = showRectBorders;
    threeRef.current.showHeightArrow = showHeightArrow;
    threeRef.current.showWidthArrow = showWidthArrow;
    threeRef.current.showLateralLabel = showLateralLabel;
    threeRef.current.showCurvedAreaLabel = showCurvedAreaLabel;
    threeRef.current.showBaseLabel = showBaseLabel;
    threeRef.current.showBaseAreaLabel = showBaseAreaLabel;
    threeRef.current.dehighlightSurface = dehighlightSurface;
  }, [
    unfoldValue,
    showRectBorders,
    showHeightArrow,
    showWidthArrow,
    showLateralLabel,
    showCurvedAreaLabel,
    showBaseLabel,
    showBaseAreaLabel,
    dehighlightSurface,
  ]);

  // =====================================================================
  // DEHIGHLIGHT / HIGHLIGHT EFFECT
  // =====================================================================
  useEffect(() => {
    const { topBaseMaterial, bottomBaseMaterial, surfaceMaterial } =
      threeRef.current;
    if (!topBaseMaterial || !bottomBaseMaterial || !surfaceMaterial) return;

    // Reset all to full opacity
    topBaseMaterial.transparent = false;
    topBaseMaterial.opacity = 1;
    bottomBaseMaterial.transparent = false;
    bottomBaseMaterial.opacity = 1;
    surfaceMaterial.transparent = false;
    surfaceMaterial.opacity = 1;

    if (dehighlightSurface) {
      surfaceMaterial.transparent = true;
      surfaceMaterial.opacity = 0.2;
    }

    if (dehighlightBases) {
      topBaseMaterial.transparent = true;
      topBaseMaterial.opacity = 0.2;
      bottomBaseMaterial.transparent = true;
      bottomBaseMaterial.opacity = 0.2;
    }
  }, [dehighlightBases, dehighlightSurface]);

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
