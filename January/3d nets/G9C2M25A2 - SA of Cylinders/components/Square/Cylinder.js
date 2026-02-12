// =============================================================================
// Cylinder Visual Component for Surface Area of Cylinder Applet
// =============================================================================

const T = {
  parameters: {
    surfaceColor: 0xfab868, // warm peach for curved surface
    baseColor: 0xf87171, // salmon/coral for circular bases
    surfaceOpacity: 1,
    highlightColor: 0xffff00, // skyblue for highlight animation
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
  showFoldedLabels = false,
  showUnfoldedLabels = false,
  showCircumferenceLabels = false,
  showSurfaceWidthLabel = false,
  showRectBorders = true,
  dehighlightBases = false,
  highlightTopOnly = false,
  blinkSurfaceEdges = false,
  highlightPhase = null, // 'top' | 'bottom' | 'curved' when highlighting before unfold
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

    // ---- Create materials (once, reused across geometry updates) ----
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
      showFoldedLabels,
      showUnfoldedLabels,
      showCircumferenceLabels,
      showSurfaceWidthLabel,
      showRectBorders,
      blinkSurfaceEdges,
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
      const isFullyFolded = currentUnfoldValue <= 0.001;

      // ---- SVG Defs: arrow markers ----
      const defs = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "defs"
      );

      // White arrow markers
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
        createMarker("arr-end-b", 3.5, "0 0, 4 2, 0 4", "#60a5fa")
      );
      defs.appendChild(
        createMarker("arr-start-b", 0.5, "4 0, 0 2, 4 4", "#60a5fa")
      );
      // Yellow/gold markers for blink
      defs.appendChild(
        createMarker("arr-end-y", 3.5, "0 0, 4 2, 0 4", "#fbbf24")
      );
      defs.appendChild(
        createMarker("arr-start-y", 0.5, "4 0, 0 2, 4 4", "#fbbf24")
      );
      svg.appendChild(defs);

      // ---- Helper: bidirectional arrow (dotted, thin) ----
      const createBidirectionalArrow = (start3D, end3D, label, opts = {}) => {
        const {
          offset = 0,
          color = "#ffffff",
          strokeWidth = 1.5,
          dashed = true,
          fontSize = "1.6vw",
          labelOffset = { x: 0, y: 0 },
          labelColor = null,
          markerSuffix = "w", // "w" white, "b" blue, "y" yellow
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

      // ---- Helper: single-direction arrow ----
      const createSingleArrow = (start3D, end3D, label, opts = {}) => {
        const {
          color = "#60a5fa",
          strokeWidth = 1.5,
          dashed = false,
          fontSize = "1.5vw",
          labelOffset = { x: 0, y: 0 },
          labelColor = null,
          markerSuffix = "b",
        } = opts;

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
        if (dashed) line.setAttribute("stroke-dasharray", "6,3");
        line.setAttribute("marker-end", `url(#arr-end-${markerSuffix})`);
        svg.appendChild(line);

        if (label) {
          const text = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
          );
          text.setAttribute("x", start.x + labelOffset.x);
          text.setAttribute("y", start.y + labelOffset.y);
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

      // ---- Helper: dashed line ----
      const createDashedLine = (
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
      const rectHalfW = Math.PI * r; // half-width of fully unrolled rectangle
      const circleTopY = h / 2 + r; // top circle center Y when unfolded
      const circleBotY = -(h / 2 + r); // bottom circle center Y when unfolded

      // ==============================================================
      // FOLDED STATE LABELS
      // ==============================================================
      if (isFullyFolded && state.showFoldedLabels) {
        // Height line (dashed, center bottom to center top)
        createDashedLine(
          new THREE.Vector3(0, -h / 2, 0),
          new THREE.Vector3(0, h / 2, 0),
          "#ffffff",
          1.5
        );
        createLabel(new THREE.Vector3(0, 0, 0), "h", {
          offset: { x: 12, y: 0 },
          fontStyle: "italic",
        });

        // Top radius line (solid, center to right edge of top cap)
        createSolidLine(
          new THREE.Vector3(0, h / 2, 0),
          new THREE.Vector3(r, h / 2, 0),
          "#ffffff",
          2
        );
        createLabel(new THREE.Vector3(r / 2, h / 2, 0), "r", {
          offset: { x: 0, y: -12 },
          fontStyle: "italic",
        });

        // Bottom radius line (solid)
        createSolidLine(
          new THREE.Vector3(0, -h / 2, 0),
          new THREE.Vector3(r, -h / 2, 0),
          "#ffffff",
          2
        );
        createLabel(new THREE.Vector3(r / 2, -h / 2, 0), "r", {
          offset: { x: 0, y: 12 },
          fontStyle: "italic",
        });
      }

      // ==============================================================
      // RECTANGLE BORDERS (blue top/bottom, white left/right)
      // ==============================================================
      if (isFullyUnfolded && state.showRectBorders) {
        // Top border (blue)
        createSolidLine(
          new THREE.Vector3(-rectHalfW, h / 2, -r),
          new THREE.Vector3(rectHalfW, h / 2, -r),
          "#3b82f6",
          2.5
        );
        // Bottom border (blue)
        createSolidLine(
          new THREE.Vector3(-rectHalfW, -h / 2, -r),
          new THREE.Vector3(rectHalfW, -h / 2, -r),
          "#3b82f6",
          2.5
        );
        // Left border (white)
        createSolidLine(
          new THREE.Vector3(-rectHalfW, -h / 2, -r),
          new THREE.Vector3(-rectHalfW, h / 2, -r),
          "#ffffff",
          2.5
        );
        // Right border (white)
        createSolidLine(
          new THREE.Vector3(rectHalfW, -h / 2, -r),
          new THREE.Vector3(rectHalfW, h / 2, -r),
          "#ffffff",
          2.5
        );
      }

      // ==============================================================
      // UNFOLDED STATE LABELS (h arrow, r lines)
      // ==============================================================
      if (isFullyUnfolded && state.showUnfoldedLabels) {
        // Blink state for surface edge arrows
        const blink = state.blinkSurfaceEdges;
        const blinkPhase = blink ? Math.sin(Date.now() * 0.006) > 0 : false;
        const dimColor = blinkPhase ? "#fbbf24" : "#ffffff";
        const dimSuffix = blinkPhase ? "y" : "w";

        // Height arrow (bidirectional, dotted, right side of rectangle)
        createBidirectionalArrow(
          new THREE.Vector3(rectHalfW + 0.4, -h / 2, -r),
          new THREE.Vector3(rectHalfW + 0.4, h / 2, -r),
          "h",
          {
            color: dimColor,
            dashed: true,
            strokeWidth: 1.5,
            labelOffset: { x: 15, y: 0 },
            labelColor: dimColor,
            markerSuffix: dimSuffix,
          }
        );

        // Top radius line (solid, center to right edge of circle)
        createSolidLine(
          new THREE.Vector3(0, circleTopY, -r),
          new THREE.Vector3(r, circleTopY, -r),
          "#ffffff",
          2
        );
        createLabel(new THREE.Vector3(r / 2, circleTopY, -r), "r", {
          offset: { x: 0, y: -12 },
          fontStyle: "italic",
        });

        // Bottom radius line (solid)
        createSolidLine(
          new THREE.Vector3(0, circleBotY, -r),
          new THREE.Vector3(r, circleBotY, -r),
          "#ffffff",
          2
        );
        createLabel(new THREE.Vector3(r / 2, circleBotY, -r), "r", {
          offset: { x: 0, y: 12 },
          fontStyle: "italic",
        });
      }

      // ==============================================================
      // CIRCUMFERENCE LABELS (step 2: 2πr on circles)
      // ==============================================================
      if (isFullyUnfolded && state.showCircumferenceLabels) {
        // Arrow pointing to top circle from left
        createSingleArrow(
          new THREE.Vector3(-r - 1.5, circleTopY, -r),
          new THREE.Vector3(-r - 0.1, circleTopY, -r),
          "2πr",
          {
            color: "#60a5fa",
            strokeWidth: 1.5,
            dashed: false,
            fontSize: "1.5vw",
            labelOffset: { x: -18, y: 0 },
            labelColor: "#60a5fa",
            markerSuffix: "b",
          }
        );

        // Arrow pointing to bottom circle from left
        createSingleArrow(
          new THREE.Vector3(-r - 1.5, circleBotY, -r),
          new THREE.Vector3(-r - 0.1, circleBotY, -r),
          "2πr",
          {
            color: "#60a5fa",
            strokeWidth: 1.5,
            dashed: false,
            fontSize: "1.5vw",
            labelOffset: { x: -18, y: 0 },
            labelColor: "#60a5fa",
            markerSuffix: "b",
          }
        );
      }

      // ==============================================================
      // SURFACE WIDTH LABEL (step 3+: 2πr on rectangle)
      // ==============================================================
      if (isFullyUnfolded && state.showSurfaceWidthLabel) {
        const blink = state.blinkSurfaceEdges;
        const blinkPhase = blink ? Math.sin(Date.now() * 0.006) > 0 : false;
        const dimColor = blinkPhase ? "#fbbf24" : "#ffffff";
        const dimSuffix = blinkPhase ? "y" : "w";

        // Bidirectional arrow below top edge of rectangle
        createBidirectionalArrow(
          new THREE.Vector3(-rectHalfW + 0.15, h / 2 - 0.2, -r),
          new THREE.Vector3(rectHalfW - 0.15, h / 2 - 0.2, -r),
          "2πr",
          {
            color: dimColor,
            dashed: true,
            strokeWidth: 1.5,
            fontSize: "1.5vw",
            labelOffset: { x: 0, y: 14 },
            labelColor: dimColor,
            markerSuffix: dimSuffix,
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

      // Blue borders on circles
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

      // No edge geometry on rectangle - SVG handles colored borders

      const curvedSurfaceGeoRight = new THREE.CylinderGeometry(
        r,
        r,
        h,
        32,
        1,
        true,
        Math.PI,
        -data.angle
      );
      const curvedSurfaceGeoLeft = new THREE.CylinderGeometry(
        r,
        r,
        h,
        32,
        1,
        true,
        Math.PI,
        data.angle
      );

      const curvedSurfaceRight = new THREE.Mesh(
        curvedSurfaceGeoRight,
        surfaceMaterial
      );
      const curvedSurfaceLeft = new THREE.Mesh(
        curvedSurfaceGeoLeft,
        surfaceMaterial
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
  // PROP SYNC EFFECT: keep stateRef in sync with latest props
  // =====================================================================
  useEffect(() => {
    threeRef.current.unfoldValue = unfoldValue;
    threeRef.current.showFoldedLabels = showFoldedLabels;
    threeRef.current.showUnfoldedLabels = showUnfoldedLabels;
    threeRef.current.showCircumferenceLabels = showCircumferenceLabels;
    threeRef.current.showSurfaceWidthLabel = showSurfaceWidthLabel;
    threeRef.current.showRectBorders = showRectBorders;
    threeRef.current.blinkSurfaceEdges = blinkSurfaceEdges;
  }, [
    unfoldValue,
    showFoldedLabels,
    showUnfoldedLabels,
    showCircumferenceLabels,
    showSurfaceWidthLabel,
    showRectBorders,
    blinkSurfaceEdges,
  ]);

  // =====================================================================
  // HIGHLIGHT ANIMATION (step 1: top -> bottom -> curved before unfold)
  // =====================================================================
  useEffect(() => {
    const { topBaseMaterial, bottomBaseMaterial, surfaceMaterial } =
      threeRef.current;
    if (!topBaseMaterial || !bottomBaseMaterial || !surfaceMaterial) return;

    const baseColor = T.parameters.baseColor;
    const surfaceColor = T.parameters.surfaceColor;
    const highlightColor = T.parameters.highlightColor;

    if (highlightPhase === "top") {
      topBaseMaterial.color.setHex(highlightColor);
      bottomBaseMaterial.color.setHex(baseColor);
      surfaceMaterial.color.setHex(surfaceColor);
    } else if (highlightPhase === "bottom") {
      topBaseMaterial.color.setHex(baseColor);
      bottomBaseMaterial.color.setHex(highlightColor);
      surfaceMaterial.color.setHex(surfaceColor);
    } else if (highlightPhase === "curved") {
      topBaseMaterial.color.setHex(baseColor);
      bottomBaseMaterial.color.setHex(baseColor);
      surfaceMaterial.color.setHex(highlightColor);
    } else {
      topBaseMaterial.color.setHex(baseColor);
      bottomBaseMaterial.color.setHex(baseColor);
      surfaceMaterial.color.setHex(surfaceColor);
    }
  }, [highlightPhase]);

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

    if (highlightPhase) {
      // During highlight animation: highlighted face stays full opacity, the other two at 0.15
      const dehighlightOpacity = 0.15;
      if (highlightPhase === "top") {
        bottomBaseMaterial.transparent = true;
        bottomBaseMaterial.opacity = dehighlightOpacity;
        surfaceMaterial.transparent = true;
        surfaceMaterial.opacity = dehighlightOpacity;
      } else if (highlightPhase === "bottom") {
        topBaseMaterial.transparent = true;
        topBaseMaterial.opacity = dehighlightOpacity;
        surfaceMaterial.transparent = true;
        surfaceMaterial.opacity = dehighlightOpacity;
      } else if (highlightPhase === "curved") {
        topBaseMaterial.transparent = true;
        topBaseMaterial.opacity = dehighlightOpacity;
        bottomBaseMaterial.transparent = true;
        bottomBaseMaterial.opacity = dehighlightOpacity;
      }
    } else if (highlightTopOnly) {
      // Step 6: only top base at full opacity, rest at 0.3
      bottomBaseMaterial.transparent = true;
      bottomBaseMaterial.opacity = 0.1;
      surfaceMaterial.transparent = true;
      surfaceMaterial.opacity = 0.1;
    } else if (dehighlightBases) {
      // Step 4: both bases at 0.3 opacity
      topBaseMaterial.transparent = true;
      topBaseMaterial.opacity = 0.1;
      bottomBaseMaterial.transparent = true;
      bottomBaseMaterial.opacity = 0.1;
    }
  }, [dehighlightBases, highlightTopOnly, highlightPhase]);

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
