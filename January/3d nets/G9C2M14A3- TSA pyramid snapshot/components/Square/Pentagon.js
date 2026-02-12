const PentagonPrism = ({
  unfoldValue,
  currentNet,
  highlightFace = null,
  faceAreaLabels = {},
  step = 1,
  pulsateLabels = null,
  animationStep = 0,
}) => {
  const mountRef = React.useRef(null);
  const svgRef = React.useRef(null);
  const stateRef = React.useRef({}).current;
  const pulsateAnimationRef = React.useRef(null);

  // Constants and config for pentagonal prism (scoped inside component)
  const ROOT_WIDTH = 4;
  const ROOT_HEIGHT = 6;

  // Constants for regular pentagon
  // Central angle of pentagon: 360° / 5 = 72°
  const CENTRAL_ANGLE = (2 * Math.PI) / 5; // 72° in radians
  // Interior angle: 180° - 72° = 108°
  const INTERIOR_ANGLE = Math.PI - CENTRAL_ANGLE; // 108° in radians

  // For a regular pentagon with side length s:
  // apothem (distance from center to midpoint of side) = s / (2 * tan(36°))
  // radius (distance from center to vertex) = s / (2 * sin(36°))
  const PENTAGON_SIDE = ROOT_WIDTH;
  const TAN_36 = Math.tan(Math.PI / 5); // tan(36°)
  const SIN_36 = Math.sin(Math.PI / 5); // sin(36°)
  const APOTHEM = PENTAGON_SIDE / (2 * TAN_36);
  const RADIUS = PENTAGON_SIDE / (2 * SIN_36);
  const INITIAL_CAMERA_POSITION = { x: 1, y: 5, z: 10 };

  const config = {
    root: {
      width: ROOT_WIDTH,
      height: ROOT_HEIGHT,
      position: [0, 0, 0],
      rotation: [0, 0, 0],
    },
    rectangles: [
      {
        name: "rightFront",
        parent: "root",
        width: ROOT_WIDTH,
        height: ROOT_HEIGHT,
        pivotPosition: [ROOT_WIDTH / 2, 0, 0],
        meshOffset: [ROOT_WIDTH / 2, 0, 0],
        initialRotation: [0, -CENTRAL_ANGLE, 0],
      },
      {
        name: "rightBack",
        parent: "rightFront",
        width: ROOT_WIDTH,
        height: ROOT_HEIGHT,
        pivotPosition: [ROOT_WIDTH / 2, 0, 0],
        meshOffset: [ROOT_WIDTH / 2, 0, 0],
        initialRotation: [0, -CENTRAL_ANGLE, 0],
      },
      {
        name: "leftFront",
        parent: "root",
        width: ROOT_WIDTH,
        height: ROOT_HEIGHT,
        pivotPosition: [-ROOT_WIDTH / 2, 0, 0],
        meshOffset: [-ROOT_WIDTH / 2, 0, 0],
        initialRotation: [0, CENTRAL_ANGLE, 0],
      },
      {
        name: "leftBack",
        parent: "leftFront",
        width: ROOT_WIDTH,
        height: ROOT_HEIGHT,
        pivotPosition: [-ROOT_WIDTH / 2, 0, 0],
        meshOffset: [-ROOT_WIDTH / 2, 0, 0],
        initialRotation: [0, CENTRAL_ANGLE, 0],
      },
    ],
    pentagons: [
      {
        name: "top",
        sideLength: ROOT_WIDTH,
        // Position adjusted: when rotated to horizontal, pentagon lies in XZ plane at y = ROOT_HEIGHT/2
        // The pentagon center should align with where rotated rectangles form the pentagon center
        position: [0, ROOT_HEIGHT / 2, 0],
        rotation: {
          // Rotate around z first to orient the pentagon, then rotate around x to make it horizontal
          // With one edge horizontal in the shape, we need 0° or 36° rotation around z
          z: 0, // Start with 0, may need adjustment
          x: {
            initial: Math.PI / 2,
            final: 0,
          },
        },
      },
      {
        name: "bottom",
        sideLength: ROOT_WIDTH,
        position: [0, -ROOT_HEIGHT / 2, 0],
        rotation: {
          z: 0,
          x: {
            initial: Math.PI / 2,
            final: Math.PI,
          },
        },
      },
    ],
  };

  React.useEffect(() => {
    const currentMount = mountRef.current;
    const scene = new THREE.Scene();

    // Orthographic Camera Setup
    const aspect = currentMount.clientWidth / currentMount.clientHeight;
    const frustumSize = 20;
    const camera = new THREE.OrthographicCamera(
      (frustumSize * aspect) / -2,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      frustumSize / -2,
      0.1,
      1000
    );
    camera.position.set(
      INITIAL_CAMERA_POSITION.x,
      INITIAL_CAMERA_POSITION.y,
      INITIAL_CAMERA_POSITION.z
    );
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.enableDamping = false;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableRotate = false;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // Different colors for lateral faces with 0.2 opacity
    const leftFrontMaterial = new THREE.MeshStandardMaterial({
      color: 0xff6b6b, // Light red
      side: THREE.DoubleSide,
      opacity: 0.2,
      transparent: true,
    });
    const rootMaterial = new THREE.MeshStandardMaterial({
      color: 0x818cf8, // Purplish blue
      side: THREE.DoubleSide,
      opacity: 0.2,
      transparent: true,
    });
    const rightFrontMaterial = new THREE.MeshStandardMaterial({
      color: 0x4ade80, // Light green
      side: THREE.DoubleSide,
      opacity: 0.2,
      transparent: true,
    });
    const leftBackMaterial = new THREE.MeshStandardMaterial({
      color: 0xfbbf24, // Amber
      side: THREE.DoubleSide,
      opacity: 0.2,
      transparent: true,
    });
    const rightBackMaterial = new THREE.MeshStandardMaterial({
      color: 0xec4899, // Pink
      side: THREE.DoubleSide,
      opacity: 0.2,
      transparent: true,
    });

    const topPentagonMaterial = new THREE.MeshStandardMaterial({
      color: 0x4a7bc8, // Lighter blue
      side: THREE.DoubleSide,
    });
    const bottomPentagonMaterial = new THREE.MeshStandardMaterial({
      color: 0x4a7bc8, // Lighter blue
      side: THREE.DoubleSide,
    });

    const edgeMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      linewidth: 2,
    });

    // Create separate edge material for bottom pentagon with thicker linewidth
    const bottomEdgeMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      linewidth: 4, // Increased stroke width for bottom base
    });

    // Create root rectangle
    const rootGeometry = new THREE.PlaneGeometry(
      config.root.width,
      config.root.height
    );
    const rootRectangle = new THREE.Mesh(rootGeometry, rootMaterial);
    scene.add(rootRectangle);
    rootRectangle.position.fromArray(config.root.position);
    rootRectangle.rotation.fromArray(config.root.rotation);

    const rootEdges = new THREE.EdgesGeometry(rootGeometry);
    const rootLine = new THREE.LineSegments(rootEdges, edgeMaterial);
    rootRectangle.add(rootLine);

    const meshes = { root: rootRectangle };
    const pivots = {};

    // Helper function to create regular pentagon shape
    // Creates a pentagon with one edge horizontal at the bottom (y=0)
    const createPentagonShape = (sideLength) => {
      const shape = new THREE.Shape();

      // For a regular pentagon with side length s
      const halfAngle = Math.PI / 5; // 36 degrees
      const radius = sideLength / (2 * Math.sin(halfAngle));
      const apothem = sideLength / (2 * Math.tan(halfAngle));

      // Calculate vertices: create pentagon with one edge horizontal at the bottom
      // Starting angle: -90° - 36° = -126° (left vertex of bottom edge)
      const startAngle = -Math.PI / 2 - halfAngle;

      for (let i = 0; i <= 5; i++) {
        const angle = startAngle + i * CENTRAL_ANGLE;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius + apothem; // Shift up so bottom edge is at y=0
        if (i === 0) {
          shape.moveTo(x, y);
        } else {
          shape.lineTo(x, y);
        }
      }

      return shape;
    };

    // Helper function to create perpendicular tick marks at midpoints of pentagon sides
    // These marks indicate that all sides are equal
    const createEqualSideMarks = (sideLength) => {
      const marksGroup = new THREE.Group();
      const markLength = sideLength * 0.15; // Length of the tick mark (15% of side length)

      // For a regular pentagon with side length s
      const halfAngle = Math.PI / 5; // 36 degrees
      const radius = sideLength / (2 * Math.sin(halfAngle));
      const apothem = sideLength / (2 * Math.tan(halfAngle));
      const startAngle = -Math.PI / 2 - halfAngle;

      // Create vertices array
      const vertices = [];
      for (let i = 0; i <= 5; i++) {
        const angle = startAngle + i * CENTRAL_ANGLE;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius + apothem;
        vertices.push(new THREE.Vector2(x, y));
      }

      // Create a tick mark material
      const tickMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        linewidth: 2,
      });

      // For each side (5 sides), create a perpendicular tick mark at the midpoint
      for (let i = 0; i < 5; i++) {
        const start = vertices[i];
        const end = vertices[i + 1];

        // Calculate midpoint
        const midpoint = new THREE.Vector2(
          (start.x + end.x) / 2,
          (start.y + end.y) / 2
        );

        // Calculate direction vector of the side
        const sideDir = new THREE.Vector2(end.x - start.x, end.y - start.y);
        sideDir.normalize();

        // Perpendicular direction (rotate 90 degrees)
        const perpDir = new THREE.Vector2(-sideDir.y, sideDir.x);

        // Calculate start and end points of the tick mark
        const tickStart = new THREE.Vector2(
          midpoint.x - perpDir.x * (markLength / 2),
          midpoint.y - perpDir.y * (markLength / 2)
        );
        const tickEnd = new THREE.Vector2(
          midpoint.x + perpDir.x * (markLength / 2),
          midpoint.y + perpDir.y * (markLength / 2)
        );

        // Create the tick mark line
        const tickGeometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(tickStart.x, tickStart.y, 0),
          new THREE.Vector3(tickEnd.x, tickEnd.y, 0),
        ]);
        const tickLine = new THREE.Line(tickGeometry, tickMaterial);

        marksGroup.add(tickLine);
      }

      return marksGroup;
    };

    // Create pentagons
    const pentagonMeshes = {};
    const pentagonEdgeLines = {}; // Store edge line segments for later manipulation
    config.pentagons.forEach((pentagonConfig) => {
      const pentagonShape = createPentagonShape(pentagonConfig.sideLength);
      const pentagonGeometry = new THREE.ShapeGeometry(pentagonShape);

      // Use separate materials for top and bottom
      const material =
        pentagonConfig.name === "top"
          ? topPentagonMaterial
          : bottomPentagonMaterial;
      const pentagonMesh = new THREE.Mesh(pentagonGeometry, material);

      // Position relative to root rectangle: root is at (0,0,0) in scene
      // Pentagon needs to be at y = ±ROOT_HEIGHT/2 relative to root
      // When rotated to horizontal (x rotation = 3π/2 or -π/2), the pentagon lies in XZ plane
      // The bottom edge of the pentagon shape (at local y=0) will align with root's top edge (at world z=0)
      const yPos =
        pentagonConfig.name === "top" ? ROOT_HEIGHT / 2 : -ROOT_HEIGHT / 2;
      pentagonMesh.position.set(0, yPos, 0);
      pentagonMesh.rotation.z = pentagonConfig.rotation.z;
      pentagonMesh.rotation.x = pentagonConfig.rotation.x.initial;

      // Add as child of root rectangle so it's positioned and rotated with root
      rootRectangle.add(pentagonMesh);

      const pentagonEdges = new THREE.EdgesGeometry(pentagonGeometry);
      // Use separate edge material for bottom pentagon
      const edgeMat =
        pentagonConfig.name === "bottom" ? bottomEdgeMaterial : edgeMaterial;
      const pentagonLine = new THREE.LineSegments(pentagonEdges, edgeMat);
      pentagonMesh.add(pentagonLine);

      // Add equal side marks (perpendicular ticks) only to the bottom pentagon
      if (pentagonConfig.name === "bottom") {
        const equalMarks = createEqualSideMarks(pentagonConfig.sideLength);
        pentagonMesh.add(equalMarks);
      }

      // Create apothem line for bottom pentagon (will be shown/hidden based on step)
      if (pentagonConfig.name === "bottom") {
        const apothemLineGroup = new THREE.Group();

        // Calculate apothem and vertices for pentagon
        const sideLength = pentagonConfig.sideLength;
        const halfAngle = Math.PI / 5; // 36 degrees
        const radius = sideLength / (2 * Math.sin(halfAngle));
        const apothem = sideLength / (2 * Math.tan(halfAngle));
        const startAngle = -Math.PI / 2 - halfAngle;

        // Get vertices of the pentagon
        const vertices = [];
        for (let i = 0; i <= 5; i++) {
          const angle = startAngle + i * CENTRAL_ANGLE;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius + apothem;
          vertices.push(new THREE.Vector2(x, y));
        }

        // Apothem goes from center (0, apothem) to midpoint of right front side
        // Right front side is between vertices[2] and vertices[3] (clockwise next from right side)
        const rightFrontMidpoint = new THREE.Vector2(
          (vertices[2].x + vertices[3].x) / 2,
          (vertices[2].y + vertices[3].y) / 2
        );

        // Center of pentagon is at (0, apothem) in local coordinates
        const pentagonCenter = new THREE.Vector2(0, apothem);

        // Create apothem line - positioned significantly above surface to be visible above highlight
        // When pentagon rotates around X by Math.PI, Z becomes -Z in world space
        // So we use negative z in local coordinates to get positive z in world space (visible from above)
        const apothemZ = -0.01; // Negative z in local becomes positive z in world when rotated
        const apothemLineGeometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(pentagonCenter.x, pentagonCenter.y, apothemZ),
          new THREE.Vector3(
            rightFrontMidpoint.x,
            rightFrontMidpoint.y,
            apothemZ
          ),
        ]);

        const apothemLineMaterial = new THREE.LineBasicMaterial({
          color: 0x000000, // Black
          linewidth: 4, // Thicker line for better visibility
          depthTest: true, // Enable depth test for proper rendering
          depthWrite: true, // Write to depth buffer
        });

        const apothemLine = new THREE.Line(
          apothemLineGeometry,
          apothemLineMaterial
        );
        apothemLine.visible = true; // Always visible
        apothemLine.renderOrder = 1000; // Render on top
        apothemLineGroup.add(apothemLine);

        // Create right angle mark at the point where apothem touches the side
        const markSize = 0.8; // Size of the square mark
        const squareShape = new THREE.Shape();

        // Calculate direction vectors
        // Side direction: from vertices[2] to vertices[3]
        const sideDir = new THREE.Vector2(
          vertices[3].x - vertices[2].x,
          vertices[3].y - vertices[2].y
        );
        sideDir.normalize();

        // Apothem direction: from midpoint to center (inward)
        const apothemDir = new THREE.Vector2(
          pentagonCenter.x - rightFrontMidpoint.x,
          pentagonCenter.y - rightFrontMidpoint.y
        );
        apothemDir.normalize();

        // Create square at the midpoint, with edges along side and apothem directions
        // Square corner is at the midpoint
        const cornerX = rightFrontMidpoint.x;
        const cornerY = rightFrontMidpoint.y;

        // Square vertices: corner, corner + sideDir*markSize, corner + sideDir*markSize + apothemDir*markSize, corner + apothemDir*markSize
        squareShape.moveTo(cornerX, cornerY);
        squareShape.lineTo(
          cornerX + sideDir.x * markSize,
          cornerY + sideDir.y * markSize
        );
        squareShape.lineTo(
          cornerX + sideDir.x * markSize + apothemDir.x * markSize,
          cornerY + sideDir.y * markSize + apothemDir.y * markSize
        );
        squareShape.lineTo(
          cornerX + apothemDir.x * markSize,
          cornerY + apothemDir.y * markSize
        );
        squareShape.lineTo(cornerX, cornerY);

        const squareGeometry = new THREE.ShapeGeometry(squareShape);
        const squareMaterial = new THREE.MeshBasicMaterial({
          color: 0xbbbbbb, // Gray color like in triangle/trapezoid
          side: THREE.DoubleSide,
        });
        const squareMesh = new THREE.Mesh(squareGeometry, squareMaterial);
        squareMesh.position.z = apothemZ;
        squareMesh.renderOrder = 1001; // Render on top of apothem line

        // Create a second copy positioned slightly offset for visibility when rotated
        const squareMeshBack = new THREE.Mesh(squareGeometry, squareMaterial);
        squareMeshBack.position.z = apothemZ - 0.001;
        squareMeshBack.renderOrder = 1001;

        apothemLineGroup.add(squareMesh);
        apothemLineGroup.add(squareMeshBack);

        pentagonMesh.add(apothemLineGroup);

        // Store reference to apothem line and midpoint positions (in 3D space relative to pentagon)
        stateRef.apothemLine = apothemLine;
        stateRef.apothemLineGroup = apothemLineGroup;
        stateRef.apothemCenter = new THREE.Vector3(
          pentagonCenter.x,
          pentagonCenter.y,
          apothemZ
        );
        stateRef.apothemMidpoint = new THREE.Vector3(
          rightFrontMidpoint.x,
          rightFrontMidpoint.y,
          apothemZ
        );
        stateRef.apothemLabelPos = new THREE.Vector3(
          (pentagonCenter.x + rightFrontMidpoint.x) / 2 + 0.6,
          (pentagonCenter.y + rightFrontMidpoint.y) / 2 - 0.5,
          apothemZ
        );
      }

      pentagonMeshes[pentagonConfig.name] = pentagonMesh;
      pentagonEdgeLines[pentagonConfig.name] = pentagonLine; // Store reference to edge line
    });

    // Create child rectangles with different materials
    const materialMap = {
      leftFront: leftFrontMaterial,
      root: rootMaterial,
      rightFront: rightFrontMaterial,
      leftBack: leftBackMaterial,
      rightBack: rightBackMaterial,
    };

    config.rectangles.forEach((rectConfig) => {
      const rectGeometry = new THREE.PlaneGeometry(
        rectConfig.width,
        rectConfig.height
      );
      const rectMaterial = materialMap[rectConfig.name] || rootMaterial;
      const rectMesh = new THREE.Mesh(rectGeometry, rectMaterial);

      const rectEdges = new THREE.EdgesGeometry(rectGeometry);
      const rectLine = new THREE.LineSegments(rectEdges, edgeMaterial);
      rectMesh.add(rectLine);

      const pivot = new THREE.Group();
      pivot.position.fromArray(rectConfig.pivotPosition);
      pivot.rotation.fromArray(rectConfig.initialRotation);

      pivot.add(rectMesh);
      rectMesh.position.fromArray(rectConfig.meshOffset);

      if (rectConfig.parent === "root") {
        rootRectangle.add(pivot);
      } else {
        meshes[rectConfig.parent].add(pivot);
      }

      meshes[rectConfig.name] = rectMesh;
      pivots[rectConfig.name] = {
        pivot: pivot,
        initialRotation: rectConfig.initialRotation,
      };
    });

    // Store references
    stateRef.renderer = renderer;
    stateRef.scene = scene;
    stateRef.camera = camera;
    stateRef.meshes = meshes;
    stateRef.controls = controls;
    stateRef.pivots = pivots;
    stateRef.pentagonMeshes = pentagonMeshes;
    stateRef.pentagonConfigs = config.pentagons;
    stateRef.pentagonEdgeLines = pentagonEdgeLines; // Store edge line references
    stateRef.materialMap = {
      leftFront: leftFrontMaterial,
      root: rootMaterial,
      rightFront: rightFrontMaterial,
      leftBack: leftBackMaterial,
      rightBack: rightBackMaterial,
      top: topPentagonMaterial,
      bottom: bottomPentagonMaterial,
    };
    stateRef.faceBaseColors = {
      leftFront: 0xff6b6b,
      root: 0x818cf8,
      rightFront: 0x4ade80,
      leftBack: 0xfbbf24,
      rightBack: 0xec4899,
      top: 0x4a7bc8, // Lighter blue
      bottom: 0x4a7bc8, // Lighter blue
    };
    stateRef.unfoldValue = unfoldValue;
    stateRef.frustumSize = frustumSize;
    stateRef.faceAreaLabels = faceAreaLabels;
    stateRef.step = step;
    stateRef.pulsateLabels = pulsateLabels;

    // Function to project 3D to 2D
    const project3DTo2D = (vector3) => {
      const vector = new THREE.Vector3(vector3.x, vector3.y, vector3.z);
      vector.project(camera);
      const x = ((vector.x + 1) / 2) * currentMount.clientWidth;
      const y = ((-vector.y + 1) / 2) * currentMount.clientHeight;
      return { x, y };
    };

    // Function to update SVG labels
    const updateLabels = (currentUnfoldValue) => {
      if (!svgRef.current || !stateRef.camera) return;

      const svg = svgRef.current;
      const svgWidth = currentMount.clientWidth;
      const svgHeight = currentMount.clientHeight;
      svg.setAttribute("width", svgWidth);
      svg.setAttribute("height", svgHeight);
      svg.setAttribute("viewBox", `0 0 ${svgWidth} ${svgHeight}`);

      svg.innerHTML = "";

      // Helper to create text label
      const createTextLabel = (
        position3D,
        labelText,
        italic = true,
        offset = { x: 0, y: 0 },
        shouldPulsate = false,
        fontSize = "1.8vw",
        color = "#ffffff"
      ) => {
        const screenPos = project3DTo2D(position3D);
        const text = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text"
        );
        text.setAttribute("x", screenPos.x + offset.x);
        text.setAttribute("y", screenPos.y + offset.y);
        text.setAttribute("fill", color);
        text.setAttribute("font-size", fontSize);
        text.setAttribute("font-weight", "bold");
        text.setAttribute("font-style", italic ? "italic" : "normal");
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("dominant-baseline", "middle");
        text.textContent = labelText;

        // Mark for pulsation if needed (will be animated via JavaScript transform scale)
        if (shouldPulsate) {
          // Wrap text in a group for transform animation
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

          // Reset text position since it's now in a group
          text.setAttribute("x", 0);
          text.setAttribute("y", 0);

          group.appendChild(text);
          svg.appendChild(group);
          return; // Early return since we've already appended
        }

        svg.appendChild(text);
      };

      const isUnfolded = currentUnfoldValue >= 0.999;
      const isFolded = currentUnfoldValue < 0.01; // Show labels only when fully folded or fully unfolded

      // Constants used throughout updateLabels
      const h = ROOT_HEIGHT; // 6
      const faceWidth = ROOT_WIDTH; // 4

      // Side labels - show only when fully folded or fully unfolded (not during animation)
      if (isFolded || isUnfolded) {
        // For pentagon, all 5 lateral faces are labeled "a" (all sides equal)
        // And length label l
        let posA1, posA2, posA3, posA4, posA5, posL;
        let posA; // Single "a" position for folded state

        if (isUnfolded) {
          // Unfolded positions - labels along the bottom of the net (all labeled "a")
          posA1 = new THREE.Vector3(-faceWidth * 2, -h / 2 + 0.9, 0);
          posA2 = new THREE.Vector3(-faceWidth * 1, -h / 2 + 0.9, 0);
          posA3 = new THREE.Vector3(0, -h / 2 + 0.9, 0);
          posA4 = new THREE.Vector3(faceWidth * 1, -h / 2 + 0.9, 0);
          posA5 = new THREE.Vector3(faceWidth * 2, -h / 2 + 0.9, 0);
          // Label "l" at the side
          posL = new THREE.Vector3(faceWidth * 2.5 + 0.5, 0, 0);
        } else {
          // Folded positions - show only one "a" label since all sides are equal
          posA = new THREE.Vector3(-faceWidth / 2 + 0.1, -h / 2, faceWidth / 2); // Center position
          posL = new THREE.Vector3(faceWidth * 1 + 0.5, 0, 0);
        }

        // Create side labels with pulsation support
        const currentPulsateLabels = stateRef.pulsateLabels || [];

        if (isUnfolded) {
          // Unfolded: show all 5 "a" labels
          createTextLabel(
            posA1,
            "a",
            true,
            { x: 0, y: 0 },
            currentPulsateLabels.includes("a")
          );
          createTextLabel(
            posA2,
            "a",
            true,
            { x: 0, y: 0 },
            currentPulsateLabels.includes("a")
          );
          createTextLabel(
            posA3,
            "a",
            true,
            { x: 0, y: 0 },
            currentPulsateLabels.includes("a")
          );
          createTextLabel(
            posA4,
            "a",
            true,
            { x: 0, y: 0 },
            currentPulsateLabels.includes("a")
          );
          createTextLabel(
            posA5,
            "a",
            true,
            { x: 0, y: 0 },
            currentPulsateLabels.includes("a")
          );
        } else {
          // Folded: show only one "a" label since all sides are equal
          createTextLabel(
            posA,
            "a",
            true,
            { x: 0, y: 0 },
            currentPulsateLabels.includes("a")
          );
        }

        // Label "l" is shown in both folded and unfolded states
        createTextLabel(
          posL,
          "l",
          true,
          { x: 0, y: 0 },
          currentPulsateLabels.includes("l")
        );

        // Show apothem label "h" - always visible since apothem line is always visible
        // Works in both folded and unfolded states
        if (
          stateRef.apothemLine &&
          stateRef.apothemLine.visible &&
          stateRef.apothemLabelPos
        ) {
          // The apothem label position is in local pentagon coordinates
          // We need to get the world position by transforming through the pentagon's matrix
          const bottomPentagon = stateRef.pentagonMeshes["bottom"];
          if (bottomPentagon) {
            // Create a world position vector
            const worldApothemLabelPos = new THREE.Vector3();
            worldApothemLabelPos.copy(stateRef.apothemLabelPos);
            // Apply the pentagon's world transformation
            bottomPentagon.updateMatrixWorld();
            worldApothemLabelPos.applyMatrix4(bottomPentagon.matrixWorld);

            createTextLabel(
              worldApothemLabelPos,
              "h",
              true,
              { x: 0, y: 0 },
              false,
              "1.8vw",
              "#000000"
            );
          }
        }
      }

      // Area labels on faces - only show when unfolded
      if (isUnfolded) {
        const currentStep = stateRef.step || 1;
        const currentFaceAreaLabels = stateRef.faceAreaLabels || {};

        // Show Base 1, Base 2, and pentagon edge labels in step 1
        if (currentStep === 1) {
          const base1 = new THREE.Vector3(0, -h / 2 - faceWidth / 2, 0);
          const base2 = new THREE.Vector3(0, h / 2 + faceWidth / 2, 0);

          createTextLabel(
            base1,
            APP_DATA.controlPanelTexts.base1,
            true,
            { x: 0, y: 0 },
            false,
            "1.5vw"
          );
          createTextLabel(
            base2,
            APP_DATA.controlPanelTexts.base2,
            true,
            { x: 0, y: 0 },
            false,
            "1.5vw"
          );
        }

        // Show "a" label near the midpoint of one side of the bottom pentagon
        // Calculate the position of the midpoint of the bottom edge of the pentagon
        // The pentagon is created with one edge horizontal at the bottom
        // For a regular pentagon with side length = ROOT_WIDTH (4)
        const pentagonSideLength = ROOT_WIDTH;
        const halfAngle = Math.PI / 5; // 36 degrees
        const radius = pentagonSideLength / (2 * Math.sin(halfAngle));
        const apothem = pentagonSideLength / (2 * Math.tan(halfAngle));

        // The bottom edge is horizontal, so its midpoint in local pentagon coordinates
        // is at (0, 0) since the pentagon is centered at origin with bottom edge at y=0
        // When unfolded, the bottom pentagon is at y = -h/2 and rotated to lie in XZ plane
        // The midpoint of the bottom edge in world space would be at the pentagon's center
        // Position it slightly outside the pentagon edge (toward the outside)
        const bottomPentagonALabelPos = new THREE.Vector3(
          -faceWidth,
          -h / 2 - apothem / 2 - 0.5, // Slightly below the pentagon center
          0
        );

        const currentPulsateLabels = stateRef.pulsateLabels || [];
        createTextLabel(
          bottomPentagonALabelPos,
          "a",
          true,
          { x: 0, y: 0 },
          currentPulsateLabels.includes("a")
        );

        // Lateral face labels: show numbers (1, 2, 3, 4, 5) in step 2, or area answers when answered
        const lateralFaces = [
          {
            name: "leftBack",
            pos: new THREE.Vector3(-faceWidth * 2, 0, 0),
            number: "1",
          },
          {
            name: "leftFront",
            pos: new THREE.Vector3(-faceWidth * 1, 0, 0),
            number: "2",
          },
          { name: "root", pos: new THREE.Vector3(0, 0, 0), number: "3" },
          {
            name: "rightFront",
            pos: new THREE.Vector3(faceWidth * 1, 0, 0),
            number: "4",
          },
          {
            name: "rightBack",
            pos: new THREE.Vector3(faceWidth * 2, 0, 0),
            number: "5",
          },
        ];

        lateralFaces.forEach((face) => {
          // If face has been answered, show the area answer, otherwise show number in step 2+
          if (currentFaceAreaLabels[face.name]) {
            // Face has been answered, show the area answer
            createTextLabel(face.pos, currentFaceAreaLabels[face.name], {
              x: 0,
              y: 0,
            });
          } else if (currentStep >= 2) {
            // Step 2 or later, show number label
            createTextLabel(face.pos, face.number, false, { x: 0, y: 0 });
          }
        });

        // Base face labels (top and bottom) - only show when answered
        Object.keys(currentFaceAreaLabels).forEach((faceName) => {
          if (faceName === "top" || faceName === "bottom") {
            const label = currentFaceAreaLabels[faceName];
            let centerPos = null;

            if (faceName === "top") {
              // Top face
              centerPos = new THREE.Vector3(0, h / 2 + faceWidth / 2, 0);
            } else if (faceName === "bottom") {
              // Bottom face
              centerPos = new THREE.Vector3(0, -h / 2 - faceWidth / 2, 0);
            }

            if (centerPos) {
              createTextLabel(
                centerPos,
                label,
                true,
                { x: 0, y: 0 },
                false,
                "1.5vw"
              );
            }
          }
        });
      }
    };

    stateRef.updateLabels = updateLabels;
    updateLabels(unfoldValue);

    // Pulsation animation function using SVG transform scale
    const animatePulsation = () => {
      if (!svgRef.current) return;
      const svg = svgRef.current;
      const pulsateGroups = svg.querySelectorAll('g[data-pulsate="true"]');

      if (pulsateGroups.length > 0) {
        const time = Date.now() * 0.003; // Slow animation
        const scale = 1 + Math.sin(time) * 0.5; // Scale between 1 and 1.5

        pulsateGroups.forEach((group) => {
          // Get the original translate values from data attributes
          const translateX = group.getAttribute("data-translate-x") || "0";
          const translateY = group.getAttribute("data-translate-y") || "0";

          // Apply both translate and scale transform
          group.setAttribute(
            "transform",
            `translate(${translateX}, ${translateY}) scale(${scale})`
          );
        });
      }

      pulsateAnimationRef.current = requestAnimationFrame(animatePulsation);
    };

    // Start pulsation animation if there are labels to pulsate
    if (pulsateLabels && pulsateLabels.length > 0) {
      animatePulsation();
    }

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
      if (stateRef.updateLabels) {
        stateRef.updateLabels(stateRef.unfoldValue);
      }
    };
    animate();

    const handleResize = () => {
      const aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.left = (frustumSize * aspect) / -2;
      camera.right = (frustumSize * aspect) / 2;
      camera.top = frustumSize / 2;
      camera.bottom = frustumSize / -2;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
      if (stateRef.updateLabels) {
        stateRef.updateLabels(stateRef.unfoldValue);
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (pulsateAnimationRef.current) {
        cancelAnimationFrame(pulsateAnimationRef.current);
      }
      controls.dispose();
      currentMount.removeChild(renderer.domElement);
    };
  }, []);

  // Update rectangle rotations
  React.useEffect(() => {
    if (!stateRef.pivots) return;
    const { pivots } = stateRef;

    Object.keys(pivots).forEach((rectName) => {
      const { pivot, initialRotation } = pivots[rectName];
      const targetRotation = [0, 0, 0];
      const currentRotation = [
        THREE.MathUtils.lerp(
          initialRotation[0],
          targetRotation[0],
          unfoldValue
        ),
        THREE.MathUtils.lerp(
          initialRotation[1],
          targetRotation[1],
          unfoldValue
        ),
        THREE.MathUtils.lerp(
          initialRotation[2],
          targetRotation[2],
          unfoldValue
        ),
      ];
      pivot.rotation.set(
        currentRotation[0],
        currentRotation[1],
        currentRotation[2]
      );
    });
    stateRef.unfoldValue = unfoldValue;
  }, [unfoldValue]);

  // Update pentagon rotations
  React.useEffect(() => {
    if (!stateRef.pentagonMeshes || !stateRef.pentagonConfigs) return;
    const { pentagonMeshes, pentagonConfigs } = stateRef;

    pentagonConfigs.forEach((pentagonConfig) => {
      const pentagonMesh = pentagonMeshes[pentagonConfig.name];
      if (!pentagonMesh) return;
      const currentRotationX = THREE.MathUtils.lerp(
        pentagonConfig.rotation.x.initial,
        pentagonConfig.rotation.x.final,
        unfoldValue
      );
      pentagonMesh.rotation.x = currentRotationX;
    });
  }, [unfoldValue]);

  // Update camera y position during unfold animation
  React.useEffect(() => {
    if (!stateRef.camera) return;

    // Interpolate camera y position from 5 (initial) to 0 (final) based on unfoldValue
    const initialY = INITIAL_CAMERA_POSITION.y; // 5
    const initialX = INITIAL_CAMERA_POSITION.x;
    const finalY = 0;
    const finalX = 0;
    const currentY = THREE.MathUtils.lerp(initialY, finalY, unfoldValue);
    const currentX = THREE.MathUtils.lerp(initialX, finalX, unfoldValue);

    stateRef.camera.position.y = currentY;
    stateRef.camera.position.x = currentX;
    stateRef.camera.lookAt(0, 0, 0);
  }, [unfoldValue]);

  // Apothem line is always visible and rotates with the bottom base
  React.useEffect(() => {
    if (stateRef.apothemLine) {
      // Always show the apothem line (it's a child of the bottom pentagon, so it rotates with it)
      stateRef.apothemLine.visible = true;

      // Update labels when needed
      if (stateRef.updateLabels) {
        stateRef.updateLabels(stateRef.unfoldValue);
      }
    }
  }, [step, highlightFace, unfoldValue, faceAreaLabels]);

  // Handle face highlighting
  React.useEffect(() => {
    if (!stateRef.materialMap || !stateRef.faceBaseColors) return;

    // Reset all faces to base colors and opacity
    Object.keys(stateRef.materialMap).forEach((faceName) => {
      const material = stateRef.materialMap[faceName];
      const baseColor = stateRef.faceBaseColors[faceName];
      material.color.setHex(baseColor);
      material.emissive.setHex(0x000000);
      material.emissiveIntensity = 0;

      // Set opacity: 0.2 for lateral faces, 1.0 for base faces
      if (
        faceName === "leftFront" ||
        faceName === "root" ||
        faceName === "rightFront" ||
        faceName === "leftBack" ||
        faceName === "rightBack"
      ) {
        material.opacity = 0.2;
        material.transparent = true;
      } else {
        material.opacity = 1.0;
        material.transparent = false;
      }
    });

    // Highlight the specified face
    if (highlightFace) {
      // In step 5, if highlighting bottom or top, highlight both bases
      if (
        step === 5 &&
        (highlightFace === "bottom" || highlightFace === "top")
      ) {
        // Highlight both bases
        const bottomMaterial = stateRef.materialMap["bottom"];
        const topMaterial = stateRef.materialMap["top"];
        if (bottomMaterial) {
          bottomMaterial.color.setHex(0xcc5500);
          bottomMaterial.emissive.setHex(0x331100);
          bottomMaterial.emissiveIntensity = 0.3;
          bottomMaterial.opacity = 1.0;
          bottomMaterial.transparent = true;
        }
        if (topMaterial) {
          topMaterial.color.setHex(0xcc5500);
          topMaterial.emissive.setHex(0x331100);
          topMaterial.emissiveIntensity = 0.3;
          topMaterial.opacity = 1.0;
          topMaterial.transparent = true;
        }
      } else if (stateRef.materialMap[highlightFace]) {
        // Normal highlighting for other faces
        const material = stateRef.materialMap[highlightFace];
        material.color.setHex(0xcc5500); // Darker orange for better text visibility
        material.emissive.setHex(0x331100);
        material.emissiveIntensity = 0.3;
        // Set opacity to 1 when highlighted
        material.opacity = 1.0;
        material.transparent = true;
      }
    }
  }, [highlightFace, step]);

  // Handle bottom base perimeter highlighting when step 4, animationStep 2
  React.useEffect(() => {
    if (!stateRef.pentagonEdgeLines) return;

    const bottomEdgeLine = stateRef.pentagonEdgeLines["bottom"];
    if (!bottomEdgeLine) return;

    const edgeMaterial = bottomEdgeLine.material;

    // When step === 4 and animationStep === 2, highlight bottom base perimeter in yellow
    if (step === 4 && animationStep === 2) {
      edgeMaterial.color.setHex(0xffff00); // Yellow
    } else {
      edgeMaterial.color.setHex(0xffffff); // White (default)
    }
  }, [step, animationStep]);

  // Update step and pulsateLabels when they change
  React.useEffect(() => {
    stateRef.step = step;
    stateRef.pulsateLabels = pulsateLabels;
    if (stateRef.updateLabels) {
      stateRef.updateLabels(stateRef.unfoldValue);
    }

    // Start or stop pulsation animation
    if (pulsateLabels && pulsateLabels.length > 0) {
      const animatePulsation = () => {
        if (!svgRef.current) return;
        const svg = svgRef.current;
        const pulsateGroups = svg.querySelectorAll('g[data-pulsate="true"]');

        if (pulsateGroups.length > 0) {
          const time = Date.now() * 0.005;
          const scale = 1 + Math.sin(time) * 0.2; // Scale between 1 and 1.2

          pulsateGroups.forEach((group) => {
            // Get the original translate values from data attributes
            const translateX = group.getAttribute("data-translate-x") || "0";
            const translateY = group.getAttribute("data-translate-y") || "0";

            // Apply scale transform (scale from center)
            group.setAttribute(
              "transform",
              `translate(${translateX}, ${translateY}) scale(${scale})`
            );
          });
        }

        pulsateAnimationRef.current = requestAnimationFrame(animatePulsation);
      };

      if (!pulsateAnimationRef.current) {
        animatePulsation();
      }
    } else {
      // Stop pulsation animation
      if (pulsateAnimationRef.current) {
        cancelAnimationFrame(pulsateAnimationRef.current);
        pulsateAnimationRef.current = null;
      }
    }
  }, [step, unfoldValue, pulsateLabels]);

  // Update labels when faceAreaLabels change
  React.useEffect(() => {
    if (stateRef.faceAreaLabels !== undefined) {
      stateRef.faceAreaLabels = faceAreaLabels;
      if (stateRef.updateLabels) {
        stateRef.updateLabels(stateRef.unfoldValue);
      }
    }
  }, [faceAreaLabels, unfoldValue]);

  return React.createElement(
    "div",
    {
      ref: mountRef,
      className: "container-wrapper",
      style: { position: "relative", width: "100%", height: "100%" },
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
