// =_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=
// 1. CONSTANTS for a Square Pyramid
// =_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=
const SQUARE_BASE_LENGTH = 4;
const SQUARE_PYRAMID_HEIGHT = 4;

const HALF_BASE = SQUARE_BASE_LENGTH / 2;
const FOLD_ANGLE_SQ = Math.PI - Math.atan(SQUARE_PYRAMID_HEIGHT / HALF_BASE);
const SLANT_HEIGHT = Math.sqrt(
  HALF_BASE * HALF_BASE + SQUARE_PYRAMID_HEIGHT * SQUARE_PYRAMID_HEIGHT
);

const SQ_INITIAL_CAMERA_POSITION = { x: 2, y: 3, z: 10 };
const SQ_TOP_CAMERA_POSITION = { x: 0, y: 10, z: 1 };
const SQ_CAMERA_ANIMATION_DURATION = 1.2;

const DEEP_BLUE = 0x1e3a8a;
const MEDIUM_BLUE = 0x3b82f6;
const FACE_COLOR = 0x1a9cb0; // Teal/cyan for all faces
const BASE_COLOR = 0x1a9cb0; // Same teal for base
const HIGHLIGHT_COLOR = 0xffdd00; // Yellow for highlight animation

const faceDefinitions = [
  {
    name: "front",
    pivot: new THREE.Vector3(0, 0, HALF_BASE),
    animationAxis: "x",
    animationDirection: 1,
    vertices: [
      [-HALF_BASE, 0, 0],
      [HALF_BASE, 0, 0],
      [0, SQUARE_PYRAMID_HEIGHT, -HALF_BASE],
    ],
    color: FACE_COLOR,
    edge: "bottom", // which base edge this face is attached to
  },
  {
    name: "back",
    pivot: new THREE.Vector3(0, 0, -HALF_BASE),
    animationAxis: "x",
    animationDirection: -1,
    vertices: [
      [HALF_BASE, 0, 0],
      [-HALF_BASE, 0, 0],
      [0, SQUARE_PYRAMID_HEIGHT, HALF_BASE],
    ],
    color: FACE_COLOR,
    edge: "top",
  },
  {
    name: "left",
    pivot: new THREE.Vector3(-HALF_BASE, 0, 0),
    animationAxis: "z",
    animationDirection: 1,
    vertices: [
      [0, 0, -HALF_BASE],
      [0, 0, HALF_BASE],
      [HALF_BASE, SQUARE_PYRAMID_HEIGHT, 0],
    ],
    color: FACE_COLOR,
    edge: "left",
  },
  {
    name: "right",
    pivot: new THREE.Vector3(HALF_BASE, 0, 0),
    animationAxis: "z",
    animationDirection: -1,
    vertices: [
      [0, 0, HALF_BASE],
      [0, 0, -HALF_BASE],
      [-HALF_BASE, SQUARE_PYRAMID_HEIGHT, 0],
    ],
    color: FACE_COLOR,
    edge: "right",
  },
];

// Edge midpoints on the base square (world coords when unfolded at y=0)
const BASE_EDGE_MIDPOINTS = {
  top: new THREE.Vector3(0, 0, -HALF_BASE),
  bottom: new THREE.Vector3(0, 0, HALF_BASE),
  left: new THREE.Vector3(-HALF_BASE, 0, 0),
  right: new THREE.Vector3(HALF_BASE, 0, 0),
};

// Mapping: edge name -> face name
const EDGE_TO_FACE = { top: "back", bottom: "front", left: "left", right: "right" };

// Triangle apex positions when fully unfolded
const APEX_POSITIONS = {
  front: new THREE.Vector3(0, 0, HALF_BASE + SLANT_HEIGHT),
  back: new THREE.Vector3(0, 0, -(HALF_BASE + SLANT_HEIGHT)),
  left: new THREE.Vector3(-(HALF_BASE + SLANT_HEIGHT), 0, 0),
  right: new THREE.Vector3(HALF_BASE + SLANT_HEIGHT, 0, 0),
};

// Triangle centroids when unfolded (for area labels)
const TRIANGLE_CENTROIDS = {
  front: new THREE.Vector3(0, 0, HALF_BASE + SLANT_HEIGHT / 3),
  back: new THREE.Vector3(0, 0, -(HALF_BASE + SLANT_HEIGHT / 3)),
  left: new THREE.Vector3(-(HALF_BASE + SLANT_HEIGHT / 3), 0, 0),
  right: new THREE.Vector3(HALF_BASE + SLANT_HEIGHT / 3, 0, 0),
};

// ---- Step 1 FOLDED state only: tweak these for "a", "l" and height line ----
// 3D positions (world coords when pyramid is folded): change x,y,z to move in 3D.
const FOLDED_A_POS = new THREE.Vector3(0, 0, HALF_BASE);           // "a" label: front edge mid of base
const FOLDED_LINE_START = new THREE.Vector3(HALF_BASE, 0, 0);       // height line: right base edge mid
const FOLDED_LINE_END = new THREE.Vector3(0, SQUARE_PYRAMID_HEIGHT, 0); // height line: apex
// "l" is drawn at midpoint of line; or set a custom 3D position with FOLDED_L_USE_MIDPOINT = false
const FOLDED_L_USE_MIDPOINT = true;  // if false, uses FOLDED_L_POS below
const FOLDED_L_POS = new THREE.Vector3(HALF_BASE / 2, SQUARE_PYRAMID_HEIGHT / 2, 0);
// Screen offset in pixels (added after 3D→2D): nudge "a" and "l" without changing 3D
const FOLDED_A_OFFSET = { x: 0, y: 7 };
const FOLDED_L_OFFSET = { x: 6, y: 0 };
const FOLDED_FONT_SIZE = "1.8vw";  // label font size

const createFaceGeometry = (verts) => {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array([...verts[0], ...verts[1], ...verts[2]]);
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.computeVertexNormals();
  return geometry;
};

// =_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=
// 2. COMPONENT
// =_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=
const SquarePyramid = ({
  unfoldValue,
  skipCameraAnimation,
  labelMode = "none", // "none" | "side" | "area"
  baseFillTransparent = false,
  blinkFace = null, // unused when dehighlightFacesFor set
  dehighlightFacesFor = null, // "left" = other three faces opacity 0.3 (step 3)
  dehighlightTrianglesForBase = false, // step 6: all triangles opacity 0.3
  triangleAreaLabelsInSideMode = false, // step 4: triangles show area labels only
  showFoldedStateLabels = false, // step 1 folded: show "a", "l" and line on right
  showFoldedLabelsVisible = false, // only show folded labels after highlight ends (hide until then)
  pulsateLabels = null,
  baseHighlight = false,
  highlightAnimationTrigger = null, // "lateral" = 4 faces only, "total" = 5 faces
  onHighlightAnimationComplete,
}) => {
  const mountRef = React.useRef(null);
  const svgRef = React.useRef(null);
  const stateRef = React.useRef({}).current;
  const pulsateAnimationRef = React.useRef(null);
  const ranLateralRef = React.useRef(false);
  const ranTotalRef = React.useRef(false);
  const onHighlightAnimationCompleteRef = React.useRef(onHighlightAnimationComplete);
  onHighlightAnimationCompleteRef.current = onHighlightAnimationComplete;

  // ---- Update face rotations ----
  const updateFaceRotations = React.useCallback((facePivots, t) => {
    if (!facePivots) return;
    const angle = t * FOLD_ANGLE_SQ;
    facePivots.forEach(({ pivot, animationAxis, animationDirection }) => {
      pivot.rotation[animationAxis] = angle * animationDirection;
    });
  }, []);

  // =====================================================================
  // MOUNT EFFECT: Create 3D scene
  // =====================================================================
  React.useEffect(() => {
    stateRef.cancelled = false;
    const currentMount = mountRef.current;
    const scene = new THREE.Scene();

    const aspect = currentMount.clientWidth / currentMount.clientHeight;
    const frustumSize = 16;
    const camera = new THREE.OrthographicCamera(
      (frustumSize * aspect) / -2,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      frustumSize / -2,
      0.1,
      1000
    );

    // Set initial camera based on unfoldValue
    const initPos =
      unfoldValue >= 0.999
        ? SQ_TOP_CAMERA_POSITION
        : SQ_INITIAL_CAMERA_POSITION;
    camera.position.set(initPos.x, initPos.y, initPos.z);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(-2, 4, 5);
    scene.add(directionalLight);

    // ---- Pyramid group (for Y/X rotation in highlight animation) ----
    const pyramidGroup = new THREE.Group();
    scene.add(pyramidGroup);

    // ---- Base square ----
    const baseGeometry = new THREE.PlaneGeometry(
      SQUARE_BASE_LENGTH,
      SQUARE_BASE_LENGTH
    );
    const baseMaterial = new THREE.MeshStandardMaterial({
      color: BASE_COLOR,
      side: THREE.DoubleSide,
    });
    const baseMesh = new THREE.Mesh(baseGeometry, baseMaterial);
    baseMesh.rotation.x = -Math.PI / 2;
    pyramidGroup.add(baseMesh);

    const edgeMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      linewidth: 2,
    });

    const baseEdges = new THREE.EdgesGeometry(baseGeometry);
    const baseEdgesLines = new THREE.LineSegments(baseEdges, edgeMaterial);
    baseMesh.add(baseEdgesLines);

    // ---- Triangular faces ----
    const facePivots = faceDefinitions.map((def) => {
      const geometry = createFaceGeometry(def.vertices);
      const material = new THREE.MeshStandardMaterial({
        color: def.color,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(geometry, material);

      const faceEdges = new THREE.EdgesGeometry(geometry);
      const faceEdgesLines = new THREE.LineSegments(faceEdges, edgeMaterial);
      mesh.add(faceEdgesLines);

      const pivot = new THREE.Group();
      pivot.position.copy(def.pivot);
      pivot.add(mesh);
      pyramidGroup.add(pivot);

      return {
        pivot,
        animationAxis: def.animationAxis,
        animationDirection: def.animationDirection,
        mesh,
        material,
        name: def.name,
        edge: def.edge,
      };
    });

    // ---- Store refs ----
    stateRef.renderer = renderer;
    stateRef.scene = scene;
    stateRef.camera = camera;
    stateRef.pyramidGroup = pyramidGroup;
    stateRef.isCameraTop = unfoldValue >= 0.999;
    stateRef.cameraTween = null;
    stateRef.frustumSize = frustumSize;
    stateRef.facePivots = facePivots;
    stateRef.unfoldValue = unfoldValue;
    stateRef.baseMesh = baseMesh;
    stateRef.baseMaterial = baseMaterial;
    stateRef.labelMode = labelMode;
    stateRef.pulsateLabels = pulsateLabels;
    stateRef.triangleAreaLabelsInSideMode = triangleAreaLabelsInSideMode;
    stateRef.showFoldedStateLabels = showFoldedStateLabels;
    stateRef.showFoldedLabelsVisible = showFoldedLabelsVisible;

    // ---- Project 3D → 2D ----
    const project3DTo2D = (vector3) => {
      const vector = new THREE.Vector3(vector3.x, vector3.y, vector3.z);
      vector.project(camera);
      const x = ((vector.x + 1) / 2) * currentMount.clientWidth;
      const y = ((-vector.y + 1) / 2) * currentMount.clientHeight;
      return { x, y };
    };

    // ==================================================================
    // SVG LABEL UPDATE FUNCTION
    // ==================================================================
    const updateLabels = (currentUnfoldValue) => {
      if (!svgRef.current || !stateRef.camera) return;

      const svg = svgRef.current;
      const svgWidth = currentMount.clientWidth;
      const svgHeight = currentMount.clientHeight;
      svg.setAttribute("width", svgWidth);
      svg.setAttribute("height", svgHeight);
      svg.setAttribute("viewBox", `0 0 ${svgWidth} ${svgHeight}`);
      svg.innerHTML = "";

      const isUnfolded = currentUnfoldValue >= 0.999;
      const currentLabelMode = stateRef.labelMode || "none";
      const currentPulsateLabels = stateRef.pulsateLabels || [];
      const showFolded =
        stateRef.showFoldedStateLabels &&
        currentUnfoldValue < 0.01 &&
        stateRef.showFoldedLabelsVisible;

      // ---- Step 1 FOLDED state only: "a", "l" and height line (right triangle) ----
      // All positions/offsets use constants at top of file: FOLDED_A_POS, FOLDED_L_OFFSET, etc.
      if (showFolded) {
        const createTextLabelFolded = (pos3D, text, color, italic, offsetPx) => {
          const screenPos = project3DTo2D(pos3D);
          const ox = (offsetPx && offsetPx.x) || 0;
          const oy = (offsetPx && offsetPx.y) || 0;
          const textEl = document.createElementNS("http://www.w3.org/2000/svg", "text");
          textEl.setAttribute("x", screenPos.x + ox);
          textEl.setAttribute("y", screenPos.y + oy);
          textEl.setAttribute("fill", color);
          textEl.setAttribute("font-size", FOLDED_FONT_SIZE);
          textEl.setAttribute("font-weight", "bold");
          textEl.setAttribute("font-style", italic ? "italic" : "normal");
          textEl.setAttribute("text-anchor", "middle");
          textEl.setAttribute("dominant-baseline", "middle");
          textEl.textContent = text;
          svg.appendChild(textEl);
        };
        const createDashedLineFolded = (start3D, end3D) => {
          const start = project3DTo2D(start3D);
          const end = project3DTo2D(end3D);
          const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
          line.setAttribute("x1", start.x);
          line.setAttribute("y1", start.y);
          line.setAttribute("x2", end.x);
          line.setAttribute("y2", end.y);
          line.setAttribute("stroke", "#FFD700");
          line.setAttribute("stroke-width", "2.5");
          line.setAttribute("stroke-dasharray", "8,4");
          svg.appendChild(line);
        };
        const lPosFolded = FOLDED_L_USE_MIDPOINT
          ? new THREE.Vector3(
              (FOLDED_LINE_START.x + FOLDED_LINE_END.x) / 2,
              (FOLDED_LINE_START.y + FOLDED_LINE_END.y) / 2,
              (FOLDED_LINE_START.z + FOLDED_LINE_END.z) / 2
            )
          : FOLDED_L_POS.clone();
        createTextLabelFolded(FOLDED_A_POS, "a", "#ffffff", true, FOLDED_A_OFFSET);
        createDashedLineFolded(FOLDED_LINE_START, FOLDED_LINE_END);
        createTextLabelFolded(lPosFolded, "l", "#FFD700", true, FOLDED_L_OFFSET);
        return;
      }

      if (!isUnfolded || !stateRef.isCameraTop || currentLabelMode === "none") {
        stateRef.deferredLabelRefreshScheduled = false;
        return;
      }

      // After layout changes (e.g. Unfold button removed), first draw can use stale dimensions.
      // Schedule one extra refresh so labels land in the correct place.
      if (!stateRef.deferredLabelRefreshScheduled) {
        stateRef.deferredLabelRefreshScheduled = true;
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (
              !stateRef.cancelled &&
              stateRef.updateLabels &&
              stateRef.camera
            ) {
              stateRef.updateLabels(stateRef.unfoldValue);
            }
          });
        });
      }

      // ---- Helper: create text label ----
      const createTextLabel = (pos3D, text, options = {}) => {
        const {
          color = "#ffffff",
          fontSize = "1.8vw",
          italic = true,
          bold = true,
          offset = { x: 0, y: 0 },
          pulsate = false,
        } = options;

        const screenPos = project3DTo2D(pos3D);
        const textEl = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text"
        );
        textEl.setAttribute("x", screenPos.x + offset.x);
        textEl.setAttribute("y", screenPos.y + offset.y);
        textEl.setAttribute("fill", color);
        textEl.setAttribute("font-size", fontSize);
        textEl.setAttribute("font-weight", bold ? "bold" : "normal");
        textEl.setAttribute("font-style", italic ? "italic" : "normal");
        textEl.setAttribute("text-anchor", "middle");
        textEl.setAttribute("dominant-baseline", "middle");
        textEl.textContent = text;

        if (pulsate) {
          const group = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "g"
          );
          group.setAttribute("data-pulsate", "true");
          const translateX = screenPos.x + offset.x;
          const translateY = screenPos.y + offset.y;
          group.setAttribute("data-translate-x", translateX.toString());
          group.setAttribute("data-translate-y", translateY.toString());
          group.setAttribute(
            "transform",
            `translate(${translateX}, ${translateY})`
          );
          textEl.setAttribute("x", 0);
          textEl.setAttribute("y", 0);
          group.appendChild(textEl);
          svg.appendChild(group);
          return;
        }

        svg.appendChild(textEl);
      };

      // ---- Helper: create dashed line ----
      const createDashedLine = (
        start3D,
        end3D,
        color = "#FFD700",
        dashArray = "8,4",
        strokeWidth = "2.5"
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
        line.setAttribute("stroke-dasharray", dashArray);
        svg.appendChild(line);
      };

      // ==================================================================
      // SIDE LABEL MODE (Step 1 unfolded, Step 2–6)
      // Tweak positioning: aLabelOffset (3D), lOffset (screen px), fontSize
      // ==================================================================
      if (currentLabelMode === "side") {
        const trianglesAsAreaOnly = stateRef.triangleAreaLabelsInSideMode;

        // "a" labels: move inward/outward from base edges (3D units)
        const aLabelOffset = 0.4;
        const aPositions = {
          top: new THREE.Vector3(0, 0, -HALF_BASE + aLabelOffset),
          bottom: new THREE.Vector3(0, 0, HALF_BASE - aLabelOffset),
          left: new THREE.Vector3(-HALF_BASE + aLabelOffset, 0, 0),
          right: new THREE.Vector3(HALF_BASE - aLabelOffset, 0, 0),
        };

        Object.keys(aPositions).forEach((edgeName) => {
          const shouldPulsate = currentPulsateLabels.includes(
            `a-${edgeName}`
          );
          createTextLabel(aPositions[edgeName], "a", {
            color: "#ffffff",
            fontSize: "1.8vw",
            italic: true,
            bold: true,
            pulsate: shouldPulsate,
          });
        });

        if (trianglesAsAreaOnly) {
          // Step 4: triangle area labels only (no "l", no height lines)
          Object.values(TRIANGLE_CENTROIDS).forEach((centroid) => {
            createTextLabel(centroid, "½ × a × l", {
              color: "#ffffff",
              fontSize: "1.5vw",
              italic: true,
              bold: true,
            });
          });
        } else {
          // Height lines (yellow dashed) and "l" labels for each triangle
          Object.keys(BASE_EDGE_MIDPOINTS).forEach((edgeName) => {
            const faceName = EDGE_TO_FACE[edgeName];
            const edgeMid = BASE_EDGE_MIDPOINTS[edgeName];
            const apex = APEX_POSITIONS[faceName];

            createDashedLine(edgeMid, apex, "#FFD700", "8,4", "2.5");

            // "l" at midpoint of height line; lOffset = screen offset (px) to avoid overlap
            const lPos = new THREE.Vector3(
              (edgeMid.x + apex.x) / 2,
              0,
              (edgeMid.z + apex.z) / 2
            );
            let lOffset = { x: 0, y: 0 };
            if (edgeName === "top" || edgeName === "bottom") {
              lOffset = { x: 14, y: 0 };
            } else {
              lOffset = { x: 0, y: -14 };
            }

            const shouldPulsateL = currentPulsateLabels.includes(
              `l-${edgeName}`
            );
            createTextLabel(lPos, "l", {
              color: "#FFD700",
              fontSize: "1.8vw",
              italic: true,
              bold: true,
              offset: lOffset,
              pulsate: shouldPulsateL,
            });
          });
        }
      }

      // ==================================================================
      // AREA LABEL MODE
      // ==================================================================
      if (currentLabelMode === "area") {
        // "a²" at center of base square
        createTextLabel(new THREE.Vector3(0, 0, 0), "a²", {
          color: "#ffffff",
          fontSize: "2.8vw",
          italic: false,
          bold: true,
        });

        // "½ × a × l" at centroid of each triangle
        Object.values(TRIANGLE_CENTROIDS).forEach((centroid) => {
          createTextLabel(centroid, "½ × a × l", {
            color: "#ffffff",
            fontSize: "1.5vw",
            italic: true,
            bold: true,
          });
        });
      }
    };

    stateRef.updateLabels = updateLabels;
    updateLabels(unfoldValue);

    // ---- Animation loop ----
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
      if (stateRef.updateLabels) {
        stateRef.updateLabels(stateRef.unfoldValue);
      }
    };
    animate();

    updateFaceRotations(facePivots, unfoldValue);

    // ---- Resize handler: keep camera, renderer and labels in sync with container size ----
    const handleResize = () => {
      const w = currentMount.clientWidth;
      const h = currentMount.clientHeight;
      if (w === 0 || h === 0) return;
      const newAspect = w / h;
      camera.left = (frustumSize * newAspect) / -2;
      camera.right = (frustumSize * newAspect) / 2;
      camera.top = frustumSize / 2;
      camera.bottom = frustumSize / -2;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      if (stateRef.updateLabels) {
        stateRef.updateLabels(stateRef.unfoldValue);
      }
    };

    // ResizeObserver: fixes labels shifting when layout changes (e.g. Unfold button removed)
    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            handleResize();
          })
        : null;
    if (resizeObserver && currentMount) {
      resizeObserver.observe(currentMount);
    }
    window.addEventListener("resize", handleResize);

    return () => {
      stateRef.cancelled = true;
      if (resizeObserver && currentMount) {
        resizeObserver.unobserve(currentMount);
      }
      window.removeEventListener("resize", handleResize);
      if (stateRef.cameraTween) {
        stateRef.cameraTween.kill();
        stateRef.cameraTween = null;
      }
      if (stateRef.blinkTween) {
        stateRef.blinkTween.kill();
        stateRef.blinkTween = null;
      }
      if (pulsateAnimationRef.current) {
        cancelAnimationFrame(pulsateAnimationRef.current);
        pulsateAnimationRef.current = null;
      }
      currentMount.removeChild(renderer.domElement);
    };
  }, [updateFaceRotations]);

  // =====================================================================
  // UNFOLD EFFECT: Update face rotations; reset pyramid group rotation when folded
  // =====================================================================
  React.useEffect(() => {
    updateFaceRotations(stateRef.facePivots, unfoldValue);
    stateRef.unfoldValue = unfoldValue;
    if (unfoldValue < 0.01 && stateRef.pyramidGroup) {
      stateRef.pyramidGroup.rotation.x = 0;
      stateRef.pyramidGroup.rotation.y = 0;
    }
    if (stateRef.updateLabels) {
      stateRef.updateLabels(unfoldValue);
    }
  }, [unfoldValue, updateFaceRotations]);

  // =====================================================================
  // CAMERA EFFECT
  // =====================================================================
  React.useEffect(() => {
    if (!stateRef.camera) return;
    // Start camera transition early during unfold (threshold 0.01)
    const shouldGoTop = unfoldValue >= 0.01;

    if (shouldGoTop === stateRef.isCameraTop) return;

    if (stateRef.cameraTween) {
      stateRef.cameraTween.kill();
      stateRef.cameraTween = null;
    }

    const target = shouldGoTop
      ? SQ_TOP_CAMERA_POSITION
      : SQ_INITIAL_CAMERA_POSITION;

    if (skipCameraAnimation) {
      stateRef.camera.position.set(target.x, target.y, target.z);
      stateRef.camera.lookAt(0, 0, 0);
      stateRef.isCameraTop = shouldGoTop;
    } else if (typeof gsap !== "undefined") {
      stateRef.cameraTween = gsap.to(stateRef.camera.position, {
        x: target.x,
        y: target.y,
        z: target.z,
        duration: SQ_CAMERA_ANIMATION_DURATION,
        ease: "power2.inOut",
        onUpdate: () => {
          stateRef.camera.lookAt(0, 0, 0);
        },
        onComplete: () => {
          stateRef.isCameraTop = shouldGoTop;
          stateRef.cameraTween = null;
        },
      });
    } else {
      stateRef.camera.position.set(target.x, target.y, target.z);
      stateRef.camera.lookAt(0, 0, 0);
      stateRef.isCameraTop = shouldGoTop;
    }
  }, [unfoldValue, skipCameraAnimation]);

  // =====================================================================
  // LABEL MODE / STEP OPTIONS EFFECT
  // =====================================================================
  React.useEffect(() => {
    stateRef.labelMode = labelMode;
    stateRef.triangleAreaLabelsInSideMode = triangleAreaLabelsInSideMode;
    stateRef.showFoldedStateLabels = showFoldedStateLabels;
    stateRef.showFoldedLabelsVisible = showFoldedLabelsVisible;
    if (stateRef.updateLabels) stateRef.updateLabels(stateRef.unfoldValue);
  }, [labelMode, triangleAreaLabelsInSideMode, showFoldedStateLabels, showFoldedLabelsVisible]);

  // =====================================================================
  // DEHIGHLIGHT FACES (step 3: highlight left by dehighlighting others)
  // =====================================================================
  React.useEffect(() => {
    if (!stateRef.facePivots) return;
    if (stateRef.blinkTween) {
      stateRef.blinkTween.kill();
      stateRef.blinkTween = null;
    }
    stateRef.facePivots.forEach((fp) => {
      fp.material.transparent = false;
      fp.material.opacity = 1;
    });
    if (dehighlightFacesFor) {
      stateRef.facePivots.forEach((fp) => {
        const isHighlighted = fp.name === dehighlightFacesFor;
        fp.material.transparent = !isHighlighted;
        fp.material.opacity = isHighlighted ? 1 : 0.3;
      });
    }
  }, [dehighlightFacesFor]);

  // =====================================================================
  // DEHIGHLIGHT TRIANGLES FOR BASE (step 6)
  // =====================================================================
  React.useEffect(() => {
    if (!stateRef.facePivots) return;
    stateRef.facePivots.forEach((fp) => {
      fp.material.transparent = dehighlightTrianglesForBase;
      fp.material.opacity = dehighlightTrianglesForBase ? 0.3 : 1;
    });
  }, [dehighlightTrianglesForBase]);

  // =====================================================================
  // BASE TRANSPARENCY EFFECT
  // =====================================================================
  React.useEffect(() => {
    if (!stateRef.baseMaterial) return;
    if (baseFillTransparent) {
      stateRef.baseMaterial.transparent = true;
      stateRef.baseMaterial.opacity = 0;
    } else {
      stateRef.baseMaterial.transparent = false;
      stateRef.baseMaterial.opacity = 1;
      stateRef.baseMaterial.color.setHex(BASE_COLOR);
      stateRef.baseMaterial.emissive.setHex(0x000000);
      stateRef.baseMaterial.emissiveIntensity = 0;
    }
  }, [baseFillTransparent]);

  // =====================================================================
  // BASE HIGHLIGHT EFFECT
  // =====================================================================
  React.useEffect(() => {
    if (!stateRef.baseMaterial) return;
    if (baseHighlight && !baseFillTransparent) {
      stateRef.baseMaterial.color.setHex(0x2596be);
      stateRef.baseMaterial.emissive.setHex(0x0d4f6e);
      stateRef.baseMaterial.emissiveIntensity = 0.4;
    } else if (!baseFillTransparent) {
      stateRef.baseMaterial.color.setHex(BASE_COLOR);
      stateRef.baseMaterial.emissive.setHex(0x000000);
      stateRef.baseMaterial.emissiveIntensity = 0;
    }
  }, [baseHighlight, baseFillTransparent]);

  // =====================================================================
  // BLINK FACE EFFECT
  // =====================================================================
  React.useEffect(() => {
    // Kill existing blink
    if (stateRef.blinkTween) {
      stateRef.blinkTween.kill();
      stateRef.blinkTween = null;
    }

    // Reset all face opacities
    if (stateRef.facePivots) {
      stateRef.facePivots.forEach((fp) => {
        fp.material.transparent = false;
        fp.material.opacity = 1;
      });
    }

    if (blinkFace && stateRef.facePivots && typeof gsap !== "undefined") {
      const fp = stateRef.facePivots.find((f) => f.name === blinkFace);
      if (fp) {
        fp.material.transparent = true;
        fp.material.opacity = 1;
        stateRef.blinkTween = gsap.to(fp.material, {
          opacity: 0.4,
          duration: 0.8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    }
  }, [blinkFace]);

  // =====================================================================
  // HIGHLIGHT ANIMATION: rotate pyramid, highlight faces one by one (lateral = 4 faces, total = 5)
  // =====================================================================
  React.useEffect(() => {
    const trigger = highlightAnimationTrigger;
    if (!trigger || !stateRef.facePivots || !stateRef.pyramidGroup) return;
    if (trigger === "lateral" && ranLateralRef.current) return;
    if (trigger === "total" && ranTotalRef.current) return;

    const includeBase = trigger === "total";
    if (trigger === "lateral") ranLateralRef.current = true;
    if (trigger === "total") ranTotalRef.current = true;

    const highlightFace = (name) => {
      const fp = stateRef.facePivots.find((f) => f.name === name);
      if (fp) fp.material.color.setHex(HIGHLIGHT_COLOR);
    };
    const dehighlightFace = (name) => {
      const fp = stateRef.facePivots.find((f) => f.name === name);
      if (fp) fp.material.color.setHex(FACE_COLOR);
    };
    const highlightBase = () => {
      if (stateRef.baseMaterial) stateRef.baseMaterial.color.setHex(HIGHLIGHT_COLOR);
    };
    const dehighlightBase = () => {
      if (stateRef.baseMaterial) stateRef.baseMaterial.color.setHex(BASE_COLOR);
    };

    const rot = stateRef.pyramidGroup.rotation;
    const D = 0.5;
    const HOLD = 1;
    const faceOrder = ["right", "back", "left", "front"];
    const angles = [-Math.PI / 2, -Math.PI, (-3 * Math.PI) / 2, -2 * Math.PI];

    if (typeof gsap === "undefined") {
      const cb = onHighlightAnimationCompleteRef.current;
      if (cb) cb(trigger);
      return;
    }

    const cb = onHighlightAnimationCompleteRef.current;
    const tl = gsap.timeline({
      onComplete: () => {
        if (includeBase) dehighlightBase();
        if (cb) cb(trigger);
      },
    });

    tl.set(rot, { y: 0, x: 0 });
    for (let i = 0; i < faceOrder.length; i++) {
      tl.to(rot, { y: angles[i], duration: D, ease: "power2.inOut" });
      tl.call(() => highlightFace(faceOrder[i]));
      tl.to({}, { duration: HOLD });
      tl.call(() => dehighlightFace(faceOrder[i]));
    }
    if (includeBase) {
      tl.to(rot, { x: -Math.PI / 2, duration: D, ease: "power2.inOut" });
      tl.call(highlightBase);
      tl.to({}, { duration: HOLD });
      tl.call(dehighlightBase);
      tl.to(rot, { x: 0, duration: D, ease: "power2.inOut" });
    } else {
      tl.set(rot, { y: 0 });
    }
  }, [highlightAnimationTrigger]);

  // =====================================================================
  // PULSATE LABELS EFFECT
  // =====================================================================
  React.useEffect(() => {
    stateRef.pulsateLabels = pulsateLabels;

    // Stop existing pulsation
    if (pulsateAnimationRef.current) {
      cancelAnimationFrame(pulsateAnimationRef.current);
      pulsateAnimationRef.current = null;
    }

    // Start pulsation animation if needed
    if (pulsateLabels && pulsateLabels.length > 0) {
      const animatePulsation = () => {
        if (!svgRef.current) return;
        const groups = svgRef.current.querySelectorAll(
          '[data-pulsate="true"]'
        );
        if (groups.length > 0) {
          const time = Date.now() * 0.005;
          const scale = 1 + Math.sin(time) * 0.3;
          groups.forEach((group) => {
            const tx = group.getAttribute("data-translate-x") || "0";
            const ty = group.getAttribute("data-translate-y") || "0";
            group.setAttribute(
              "transform",
              `translate(${tx}, ${ty}) scale(${scale})`
            );
          });
        }
        pulsateAnimationRef.current = requestAnimationFrame(animatePulsation);
      };
      animatePulsation();
    }

    // Trigger label redraw to apply pulsate attributes
    if (stateRef.updateLabels) stateRef.updateLabels(stateRef.unfoldValue);
  }, [pulsateLabels]);

  // =====================================================================
  // RENDER
  // =====================================================================
  return React.createElement(
    "div",
    {
      ref: mountRef,
      className: "container-wrapper",
      style: { position: "relative" },
    },
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
