const ShapeCanvas3D = React.forwardRef(
  ({ shapeType, sliderVal, isDoneStacking, cubeTapped, onBackFaceAnimationComplete }, ref) => {
    const { useRef, useState, useEffect, useImperativeHandle } = React;
    const mountRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const controlsRef = useRef(null);
    const stackGroup = useRef(null);
    const highlightGroup = useRef(null);
    const labelGroup = useRef(null);
    const shapeMeshRef = useRef(null);
    const backFaceRef = useRef(null);
    const backFaceAnimatedRef = useRef(false);
    const isCube = shapeType === "cube";
    const [isProcessing, setIsProcessing] = useState(false);

    const STACK_COUNT = 20;
    const BOX_DIM = isCube ? { w: 1, h: 1, d: 1 } : { w: 2, h: 1, d: 1 };
    const PRIMARY_COLOR = isCube ? 0xf7c11f : 0xdb681c;
    const EDGE_COLOR = 0xffffff;
    const HIGHLIGHT_FACE_COLOR = 0x86efac;

    const INITIAL_CAMERA_POS = { x: 3.5, y: 3.5, z: 5 };
    const INITIAL_TARGET = { x: 0, y: 0.5, z: 0 };

    useEffect(() => {
      if (!mountRef.current || !window.THREE) return;

      const THREE = window.THREE;
      stackGroup.current = new THREE.Group();
      highlightGroup.current = new THREE.Group();
      labelGroup.current = new THREE.Group();

      const scene = new THREE.Scene();
      sceneRef.current = scene;

      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      const aspect = width / height;
      const frustumSize = 3;

      const camera = new THREE.OrthographicCamera(
        (frustumSize * aspect) / -2,
        (frustumSize * aspect) / 2,
        frustumSize / 2,
        frustumSize / -2,
        0.1,
        1000,
      );
      camera.position.set(
        INITIAL_CAMERA_POS.x,
        INITIAL_CAMERA_POS.y,
        INITIAL_CAMERA_POS.z,
      );
      camera.lookAt(INITIAL_TARGET.x, INITIAL_TARGET.y, INITIAL_TARGET.z);
      cameraRef.current = camera;

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      mountRef.current.appendChild(renderer.domElement);

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
      directionalLight.position.set(4, 6, 5);
      scene.add(directionalLight);

      scene.add(stackGroup.current);
      scene.add(highlightGroup.current);
      scene.add(labelGroup.current);

      let controls;
      if (window.THREE.OrbitControls) {
        controls = new window.THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.target.set(
          INITIAL_TARGET.x,
          INITIAL_TARGET.y,
          INITIAL_TARGET.z,
        );
        controlsRef.current = controls;
      }

      const animate = () => {
        requestAnimationFrame(animate);
        if (controlsRef.current) controlsRef.current.update();
        renderer.render(scene, camera);
      };
      animate();

      const onResize = () => {
        if (!mountRef.current) return;
        const w = mountRef.current.clientWidth;
        const h = mountRef.current.clientHeight;
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
        if (
          mountRef.current &&
          mountRef.current.contains(renderer.domElement)
        ) {
          mountRef.current.removeChild(renderer.domElement);
        }
        if (controlsRef.current) controlsRef.current.dispose();
      };
    }, [shapeType]);

    const smoothResetCamera = () => {
      return new Promise((resolve) => {
        const camera = cameraRef.current;
        const controls = controlsRef.current;
        if (!camera || !controls) return resolve();

        const duration = 800;
        const startPos = camera.position.clone();
        const startTarget = controls.target.clone();
        const startTime = performance.now();

        const animateCamera = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const ease =
            progress < 0.5
              ? 4 * progress * progress * progress
              : 1 - Math.pow(-2 * progress + 2, 3) / 2;

          camera.position.x =
            startPos.x + (INITIAL_CAMERA_POS.x - startPos.x) * ease;
          camera.position.y =
            startPos.y + (INITIAL_CAMERA_POS.y - startPos.y) * ease;
          camera.position.z =
            startPos.z + (INITIAL_CAMERA_POS.z - startPos.z) * ease;

          controls.target.x =
            startTarget.x + (INITIAL_TARGET.x - startTarget.x) * ease;
          controls.target.y =
            startTarget.y + (INITIAL_TARGET.y - startTarget.y) * ease;
          controls.target.z =
            startTarget.z + (INITIAL_TARGET.z - startTarget.z) * ease;

          if (progress < 1) {
            requestAnimationFrame(animateCamera);
          } else {
            resolve();
          }
        };

        requestAnimationFrame(animateCamera);
      });
    };

    const hexToCss = (hex) => {
      const h = Math.max(0, Math.min(0xffffff, hex));
      return "#" + h.toString(16).padStart(6, "0");
    };

    const createTextLabel = (text, position, isVertex = false) => {
      const THREE = window.THREE;
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = 128;
      canvas.height = 128;
      const center = 64;
      const radius = 50;
      if (isVertex) {
        context.fillStyle = hexToCss(PRIMARY_COLOR);
        context.beginPath();
        context.arc(center, center, radius - 4, 0, Math.PI * 2);
        context.fill();
        context.strokeStyle = "#ffffff";
        context.lineWidth = 6;
        context.beginPath();
        context.arc(center, center, radius - 4, 0, Math.PI * 2);
        context.stroke();
        context.fillStyle = "#ffffff";
      } else {
        context.fillStyle = "rgba(255, 255, 255, 0.95)";
        context.beginPath();
        context.arc(center, center, radius, 0, Math.PI * 2);
        context.fill();
        context.fillStyle = "#0f172a";
      }
      context.font = "bold 64px Arial";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(text, center, center);
      const texture = new THREE.CanvasTexture(canvas);
      const spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
        depthTest: false,
      });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(0.35, 0.35, 1);
      sprite.position.copy(position);
      sprite.renderOrder = 999;
      return sprite;
    };

    const clearHighlights = () => {
      if (!highlightGroup.current || !labelGroup.current) return;
      while (highlightGroup.current.children.length > 0) {
        highlightGroup.current.remove(highlightGroup.current.children[0]);
      }
      while (labelGroup.current.children.length > 0) {
        labelGroup.current.remove(labelGroup.current.children[0]);
      }
    };

    const highlightFaces = async () => {
      if (!sceneRef.current || !shapeMeshRef.current) return;
      clearHighlights();
      setIsProcessing(true);
      if (controlsRef.current) controlsRef.current.enabled = false;
      await smoothResetCamera();

      const hw = BOX_DIM.w / 2;
      const hh = BOX_DIM.h / 2;
      const hd = BOX_DIM.d / 2;

      for (let i = 0; i < 6; i++) {
        clearHighlights();
        let faceGeom;
        if (i < 2)
          faceGeom = new window.THREE.PlaneGeometry(BOX_DIM.d, BOX_DIM.h);
        else if (i < 4)
          faceGeom = new window.THREE.PlaneGeometry(BOX_DIM.w, BOX_DIM.d);
        else faceGeom = new window.THREE.PlaneGeometry(BOX_DIM.w, BOX_DIM.h);
        const faceMat = new window.THREE.MeshBasicMaterial({
          color: HIGHLIGHT_FACE_COLOR,
          side: window.THREE.DoubleSide,
          transparent: true,
          opacity: 0.9,
        });
        const face = new window.THREE.Mesh(faceGeom, faceMat);
        if (i === 0) {
          face.position.set(hw, hh, 0);
          face.rotation.y = Math.PI / 2;
        }
        if (i === 1) {
          face.position.set(-hw, hh, 0);
          face.rotation.y = -Math.PI / 2;
        }
        if (i === 2) {
          face.position.set(0, BOX_DIM.h, 0);
          face.rotation.x = -Math.PI / 2;
        }
        if (i === 3) {
          face.position.set(0, 0, 0);
          face.rotation.x = Math.PI / 2;
        }
        if (i === 4) face.position.set(0, hh, hd);
        if (i === 5) face.position.set(0, hh, -hd);
        face.position.multiplyScalar(1.002);
        highlightGroup.current.add(face);
        if (typeof playSound === "function") playSound("click");
        await new Promise((r) => setTimeout(r, 1000));
      }
      clearHighlights();
      if (controlsRef.current) controlsRef.current.enabled = true;
      setIsProcessing(false);
    };

    const highlightEdges = async () => {
      if (!sceneRef.current || !shapeMeshRef.current) return;
      clearHighlights();
      setIsProcessing(true);
      if (controlsRef.current) controlsRef.current.enabled = false;
      await smoothResetCamera();

      const THREE = window.THREE;
      const hw = BOX_DIM.w / 2;
      const hh = BOX_DIM.h;
      const hd = BOX_DIM.d / 2;
      const edgeCoords = [
        [
          [hw, 0, hd],
          [-hw, 0, hd],
        ],
        [
          [hw, 0, -hd],
          [-hw, 0, -hd],
        ],
        [
          [hw, 0, hd],
          [hw, 0, -hd],
        ],
        [
          [-hw, 0, hd],
          [-hw, 0, -hd],
        ],
        [
          [hw, hh, hd],
          [-hw, hh, hd],
        ],
        [
          [hw, hh, -hd],
          [-hw, hh, -hd],
        ],
        [
          [hw, hh, hd],
          [hw, hh, -hd],
        ],
        [
          [-hw, hh, hd],
          [-hw, hh, -hd],
        ],
        [
          [hw, 0, hd],
          [hw, hh, hd],
        ],
        [
          [-hw, 0, hd],
          [-hw, hh, hd],
        ],
        [
          [hw, 0, -hd],
          [hw, hh, -hd],
        ],
        [
          [-hw, 0, -hd],
          [-hw, hh, -hd],
        ],
      ];

      for (let i = 0; i < edgeCoords.length; i++) {
        const start = new THREE.Vector3(...edgeCoords[i][0]);
        const end = new THREE.Vector3(...edgeCoords[i][1]);
        const distance = start.distanceTo(end);
        const edge = new THREE.Mesh(
          new THREE.CylinderGeometry(0.04, 0.04, distance, 12),
          new THREE.MeshBasicMaterial({ color: 0x22c55e }),
        );
        const midPoint = start.clone().lerp(end, 0.5);
        edge.position.copy(midPoint);
        edge.quaternion.setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          end.clone().sub(start).normalize(),
        );
        highlightGroup.current.add(edge);
        labelGroup.current.add(createTextLabel((i + 1).toString(), midPoint));
        if (typeof playSound === "function") playSound("click");
        await new Promise((r) => setTimeout(r, 600));
      }

      if (controlsRef.current) controlsRef.current.enabled = true;
      setIsProcessing(false);
    };

    const highlightVertices = async () => {
      if (!sceneRef.current || !shapeMeshRef.current) return;
      clearHighlights();
      setIsProcessing(true);
      if (controlsRef.current) controlsRef.current.enabled = false;
      await smoothResetCamera();

      const THREE = window.THREE;
      const hw = BOX_DIM.w / 2;
      const hh = BOX_DIM.h;
      const hd = BOX_DIM.d / 2;
      const verts = [
        [hw, 0, hd],
        [-hw, 0, hd],
        [hw, 0, -hd],
        [-hw, 0, -hd],
        [hw, hh, hd],
        [-hw, hh, hd],
        [hw, hh, -hd],
        [-hw, hh, -hd],
      ];

      for (let i = 0; i < verts.length; i++) {
        const pos = new THREE.Vector3(...verts[i]);
        const sphere = new THREE.Mesh(
          new THREE.SphereGeometry(0.1, 16, 16),
          new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
        );
        sphere.position.copy(pos);
        highlightGroup.current.add(sphere);
        labelGroup.current.add(createTextLabel((i + 1).toString(), pos, true));
        if (typeof playSound === "function") playSound("click");
        await new Promise((r) => setTimeout(r, 600));
      }

      if (controlsRef.current) controlsRef.current.enabled = true;
      setIsProcessing(false);
    };

    const performCuboidAffirm = () => {
      return new Promise((resolve) => {
        const mesh = shapeMeshRef.current;
        if (!mesh || typeof gsap === "undefined") return resolve();

        gsap.to(mesh.scale, {
          x: 1.05,
          y: 1.05,
          z: 1.05,
          duration: 0.15,
          ease: "power2.out",
          onComplete: () => {
            gsap.to(mesh.scale, {
              x: 0.95,
              y: 0.95,
              z: 0.95,
              duration: 0.15,
              ease: "power2.in",
              onComplete: () => {
                gsap.to(mesh.scale, {
                  x: 1,
                  y: 1,
                  z: 1,
                  duration: 0.15,
                  ease: "power2.out",
                  onComplete: resolve,
                });
              },
            });
          },
        });
      });
    };

    useImperativeHandle(
      ref,
      () => ({
        performAction: async (action) => {
          if (action === "cuboid-affirm" || action === "cube-affirm") {
            if (typeof playSound === "function") playSound("click");
            await performCuboidAffirm();
          } else if (action === "faces") {
            await highlightFaces();
          } else if (action === "vertices") {
            await highlightVertices();
          } else if (action === "edges") {
            await highlightEdges();
          }
        },
        isProcessing: () => isProcessing,
      }),
      [isProcessing, shapeType],
    );

    useEffect(() => {
      if (!sceneRef.current || !stackGroup.current || !window.THREE) return;

      const THREE = window.THREE;

      while (stackGroup.current.children.length > 0) {
        stackGroup.current.remove(stackGroup.current.children[0]);
      }

      if (shapeMeshRef.current) {
        sceneRef.current.remove(shapeMeshRef.current);
        shapeMeshRef.current = null;
      }

      if (isDoneStacking) {
        const geom = new THREE.BoxGeometry(BOX_DIM.w, BOX_DIM.h, BOX_DIM.d);
        const mat = new THREE.MeshStandardMaterial({
          color: PRIMARY_COLOR,
          transparent: true,
          opacity: 0.7,
          roughness: 1,
          metalness: 0,
        });
        const mesh = new THREE.Mesh(geom, mat);
        mesh.position.y = BOX_DIM.h / 2;

        const edgesGeom = new THREE.EdgesGeometry(geom);
        const lineMat = new THREE.LineBasicMaterial({
          color: EDGE_COLOR,
          linewidth: 2,
        });
        const line = new THREE.LineSegments(edgesGeom, lineMat);
        mesh.add(line);

        shapeMeshRef.current = mesh;
        sceneRef.current.add(mesh);
      } else {
        const currentPlates = Math.floor((sliderVal / 100) * STACK_COUNT);
        const geometry = new THREE.PlaneGeometry(BOX_DIM.w, BOX_DIM.d);
        geometry.rotateX(-Math.PI / 2);

        for (let i = 0; i <= currentPlates; i++) {
          const material = new THREE.MeshStandardMaterial({
            color: PRIMARY_COLOR,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.7,
            roughness: 1,
            metalness: 0,
          });
          const plate = new THREE.Mesh(geometry, material);
          plate.position.y = (i / STACK_COUNT) * BOX_DIM.h;
          const edgesGeom = new THREE.EdgesGeometry(geometry);
          const lineMat = new THREE.LineBasicMaterial({ color: EDGE_COLOR });
          const line = new THREE.LineSegments(edgesGeom, lineMat);
          plate.add(line);
          stackGroup.current.add(plate);
        }

        if (isCube && cubeTapped) {
          const backFaceGeom = new THREE.PlaneGeometry(BOX_DIM.w, BOX_DIM.h);
          backFaceGeom.translate(0, BOX_DIM.h / 2, 0);
          const backFaceMat = new THREE.MeshStandardMaterial({
            color: PRIMARY_COLOR,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.7,
            roughness: 1,
            metalness: 0,
          });
          const backFace = new THREE.Mesh(backFaceGeom, backFaceMat);
          backFace.position.set(0, 0, -BOX_DIM.d / 2);
          const shouldAnimate = !backFaceAnimatedRef.current;
          if (shouldAnimate) {
            backFace.rotation.x = Math.PI / 2;
          } else {
            backFace.rotation.x = 0;
          }
          const backEdgesGeom = new THREE.EdgesGeometry(backFaceGeom);
          const backLineMat = new THREE.LineBasicMaterial({
            color: EDGE_COLOR,
          });
          const backLine = new THREE.LineSegments(backEdgesGeom, backLineMat);
          backFace.add(backLine);
          stackGroup.current.add(backFace);
          backFaceRef.current = backFace;

          if (shouldAnimate && typeof gsap !== "undefined") {
            gsap.to(backFace.rotation, {
              x: 0,
              duration: 0.6,
              ease: "power2.out",
              onComplete: () => {
                backFaceAnimatedRef.current = true;
                backFaceRef.current = null;
                if (typeof onBackFaceAnimationComplete === "function") {
                  onBackFaceAnimationComplete();
                }
              },
            });
          } else if (shouldAnimate) {
            backFace.rotation.x = 0;
            backFaceAnimatedRef.current = true;
            if (typeof onBackFaceAnimationComplete === "function") {
              onBackFaceAnimationComplete();
            }
          }
        } else {
          backFaceRef.current = null;
          backFaceAnimatedRef.current = false;
        }
      }
    }, [sliderVal, isDoneStacking, shapeType, cubeTapped]);

    return React.createElement("div", {
      ref: mountRef,
      className: `shape-canvas-3d ${isProcessing ? "cursor-wait" : "cursor-grab"}`,
      style: { width: "100%", height: "100%", minHeight: 200 },
    });
  },
);
