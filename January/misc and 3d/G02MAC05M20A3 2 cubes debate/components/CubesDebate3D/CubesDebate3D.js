const CubesDebate3D = React.forwardRef(({ onAnimationComplete, onLabelPositionsUpdate }, ref) => {
  const { useRef, useEffect, useImperativeHandle } = React;
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const leftCubeRef = useRef(null);
  const rightCubeRef = useRef(null);
  const animationIdRef = useRef(null);
  const leftPosRef = useRef(-1.5);
  const rightPosRef = useRef(1.5);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const THREE = window.THREE;
    const OrbitControls = window.THREE?.OrbitControls || window.OrbitControls;
    if (!THREE || !OrbitControls) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = null;
    scene.fog = null;
    sceneRef.current = scene;

    // Use orthographic camera
    const aspect = width / height;
    const viewSize = 1;
    const camera = new THREE.OrthographicCamera(
      -viewSize * aspect, // left
      viewSize * aspect,  // right
      viewSize,           // top
      -viewSize,          // bottom
      0.1,                // near
      1000                // far
    );
    camera.position.set(1, 2, 5);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;
    cameraRef.current.userData.viewSize = viewSize; // Store viewSize for resize

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);

    const purpleMaterial = new THREE.MeshStandardMaterial({
      color: 0x9c27b0,
      transparent: true,
      opacity: 1,
      metalness: 0.3,
      roughness: 0.7,
    });
    const edgeMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.4,
    });

    // Left cube
    const leftCubeGeom = new THREE.BoxGeometry(1, 1, 1);
    const leftEdgeGeom = new THREE.EdgesGeometry(leftCubeGeom);
    const leftMat = purpleMaterial.clone();
    const leftMesh = new THREE.Mesh(leftCubeGeom, leftMat);
    leftMesh.position.set(leftPosRef.current, 0, 0);
    const leftEdges = new THREE.LineSegments(leftEdgeGeom, edgeMaterial.clone());
    leftMesh.add(leftEdges);
    scene.add(leftMesh);
    leftCubeRef.current = leftMesh;

    // Right cube
    const rightCubeGeom = new THREE.BoxGeometry(1, 1, 1);
    const rightEdgeGeom = new THREE.EdgesGeometry(rightCubeGeom);
    const rightMat = purpleMaterial.clone();
    const rightMesh = new THREE.Mesh(rightCubeGeom, rightMat);
    rightMesh.position.set(rightPosRef.current, 0, 0);
    const rightEdges = new THREE.LineSegments(rightEdgeGeom, edgeMaterial.clone());
    rightMesh.add(rightEdges);
    scene.add(rightMesh);
    rightCubeRef.current = rightMesh;

    // Function to update label positions based on cube positions
    const updateLabelPositions = () => {
      if (!leftCubeRef.current || !rightCubeRef.current || !camera || !renderer) return;
      
      // Get bottom center of each cube (cube center is at y=0, bottom is at y=-0.5)
      const leftBottom = new THREE.Vector3(leftPosRef.current, -0.5, 0);
      const rightBottom = new THREE.Vector3(rightPosRef.current, -0.5, 0);
      
      // Project to normalized device coordinates (-1 to 1)
      leftBottom.project(camera);
      rightBottom.project(camera);
      
      // Convert to screen percentage (0 to 100)
      const leftPercent = (leftBottom.x * 0.5 + 0.5) * 100;
      const rightPercent = (rightBottom.x * 0.5 + 0.5) * 100;
      
      if (onLabelPositionsUpdate) {
        onLabelPositionsUpdate({ 
          left: leftPercent, 
          right: rightPercent,
          left3D: leftPosRef.current,
          right3D: rightPosRef.current
        });
      }
    };

    // Store animation function
    container.animateCubes = (shouldJoin, callback) => {
      const targetLeft = shouldJoin ? -0.5 : -1.5;
      const targetRight = shouldJoin ? 0.5 : 1.5;
      
      if (window.gsap) {
        const leftObj = { x: leftPosRef.current };
        const rightObj = { x: rightPosRef.current };
        
        window.gsap.to(leftObj, {
          x: targetLeft,
          duration: 1,
          ease: "power2.inOut",
          onUpdate: () => {
            leftPosRef.current = leftObj.x;
            if (leftCubeRef.current) {
              leftCubeRef.current.position.x = leftObj.x;
            }
            updateLabelPositions();
          }
        });
        
        window.gsap.to(rightObj, {
          x: targetRight,
          duration: 1,
          ease: "power2.inOut",
          onUpdate: () => {
            rightPosRef.current = rightObj.x;
            if (rightCubeRef.current) {
              rightCubeRef.current.position.x = rightObj.x;
            }
            updateLabelPositions();
          },
          onComplete: () => {
            leftPosRef.current = targetLeft;
            rightPosRef.current = targetRight;
            updateLabelPositions();
            if (callback) callback();
            if (onAnimationComplete) onAnimationComplete();
          }
        });
      } else {
        // Fallback if GSAP not available
        leftPosRef.current = targetLeft;
        rightPosRef.current = targetRight;
        if (leftCubeRef.current) leftCubeRef.current.position.x = targetLeft;
        if (rightCubeRef.current) rightCubeRef.current.position.x = targetRight;
        updateLabelPositions();
        if (callback) callback();
        if (onAnimationComplete) onAnimationComplete();
      }
    };

    // Initial label position update
    updateLabelPositions();

    function animate() {
      animationIdRef.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
      // Update label positions every frame to track cube movement
      updateLabelPositions();
    }
    animate();

    function onResize() {
      const w = container.clientWidth;
      const h = container.clientHeight;
      const aspect = w / h;
      const viewSize = camera.userData.viewSize || 5;
      camera.left = -viewSize * aspect;
      camera.right = viewSize * aspect;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
      if (leftCubeRef.current) {
        if (leftCubeRef.current.material) leftCubeRef.current.material.dispose();
        leftCubeRef.current.children.forEach((child) => {
          if (child.material) child.material.dispose();
        });
      }
      if (rightCubeRef.current) {
        if (rightCubeRef.current.material) rightCubeRef.current.material.dispose();
        rightCubeRef.current.children.forEach((child) => {
          if (child.material) child.material.dispose();
        });
      }
      leftCubeGeom.dispose();
      rightCubeGeom.dispose();
      leftEdgeGeom.dispose();
      rightEdgeGeom.dispose();
      purpleMaterial.dispose();
      edgeMaterial.dispose();
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  // Expose container ref to parent
  useImperativeHandle(ref, () => containerRef.current, []);

  return React.createElement("div", {
    ref: containerRef,
    className: "cubes-debate-3d",
    style: { width: "100%", height: "100%", position: "relative" },
  });
});
