// =============================================================================
// Sphere Visual Component for Surface Area of Sphere Applet
// Steps 1-4: sphere -> morph to cylinder -> unfold to rectangle
// =============================================================================

const SPHERE_RADIUS = 1.5 * 1.1; // 1.65 (10% increase)
const SPHERE_HEIGHT = 2 * SPHERE_RADIUS; // 2r

const getShapeDataSphere = (s, r) => {
  const halfPerimeter = Math.PI * r;
  const length = halfPerimeter * s;
  const l = halfPerimeter - length;
  const angle = l / r;
  return { angle, length };
};

const SphereVisual = ({ step, onAnimationComplete }) => {
  const r = SPHERE_RADIUS;
  const h = SPHERE_HEIGHT;
  const { useEffect, useRef } = React;
  const mountRef = useRef(null);
  const svgRef = useRef(null);
  const threeRef = useRef({});

  // ==========================================================================
  // MOUNT EFFECT: Create scene, materials, meshes, animation loop
  // ==========================================================================
  useEffect(() => {
    const container = mountRef.current.querySelector("#container");
    if (!container) return;
    const aspectRatio = container.clientWidth / container.clientHeight;
    const d = 4.5;

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

    camera.position.set(0, h * 0.8, r * 4);
    camera.lookAt(0, 0, 0);

    // ---- Materials ----
    const surfaceColor = 0xfab868;
    const surfaceMaterial = new THREE.MeshStandardMaterial({
      color: surfaceColor,
      side: THREE.DoubleSide,
    });

    // =============================================
    // 1. TRUE SPHERE (visible in steps 1-2) - no grid lines
    // =============================================
    const sphereGeo = new THREE.SphereGeometry(r, 64, 64);
    const trueSphere = new THREE.Mesh(sphereGeo, surfaceMaterial.clone());
    scene.add(trueSphere);

    // =============================================
    // 2. MORPH MESH (hidden initially, for step 3)
    // =============================================
    const cylGeo = new THREE.CylinderGeometry(r, r, h, 64, 64, true);
    const posAttr = cylGeo.attributes.position;
    const vCount = posAttr.count;
    const spherePositions = new Float32Array(vCount * 3);
    for (let i = 0; i < vCount; i++) {
      const vx = posAttr.getX(i);
      const vy = posAttr.getY(i);
      const vz = posAttr.getZ(i);
      const angle = Math.atan2(vz, vx);
      const normalizedY = vy / (h / 2);
      const phi = Math.asin(Math.max(-1, Math.min(1, normalizedY)));
      const currentHR = r * Math.cos(phi);
      spherePositions[i * 3] = Math.cos(angle) * currentHR;
      spherePositions[i * 3 + 1] = vy;
      spherePositions[i * 3 + 2] = Math.sin(angle) * currentHR;
    }
    cylGeo.morphAttributes.position = [
      new THREE.Float32BufferAttribute(spherePositions, 3),
    ];
    const morphMat = surfaceMaterial.clone();
    morphMat.morphTargets = true;
    const morphMesh = new THREE.Mesh(cylGeo, morphMat);
    morphMesh.morphTargetInfluences = [1]; // starts as sphere shape
    morphMesh.visible = false;
    scene.add(morphMesh);

    // =============================================
    // 3. CURVED SURFACE (for step 4 unfold)
    // =============================================
    let surfaceGroup = null;
    const rebuildSurface = (s) => {
      if (surfaceGroup) {
        surfaceGroup.traverse((child) => {
          if (child.geometry) child.geometry.dispose();
        });
        scene.remove(surfaceGroup);
      }
      const data = getShapeDataSphere(s, r);
      surfaceGroup = new THREE.Group();

      const planeGeo = new THREE.PlaneGeometry(2 * data.length, h);
      const plane = new THREE.Mesh(planeGeo, surfaceMaterial.clone());
      plane.material.side = THREE.DoubleSide;
      plane.position.z = -r;
      surfaceGroup.add(plane);

      if (data.angle > 0.01) {
        const cGeoR = new THREE.CylinderGeometry(
          r,
          r,
          h,
          32,
          1,
          true,
          Math.PI,
          -data.angle
        );
        const cGeoL = new THREE.CylinderGeometry(
          r,
          r,
          h,
          32,
          1,
          true,
          Math.PI,
          data.angle
        );
        const cMeshR = new THREE.Mesh(cGeoR, surfaceMaterial.clone());
        cMeshR.material.side = THREE.DoubleSide;
        const cMeshL = new THREE.Mesh(cGeoL, surfaceMaterial.clone());
        cMeshL.material.side = THREE.DoubleSide;
        cMeshR.position.x = data.length;
        cMeshL.position.x = -data.length;
        surfaceGroup.add(cMeshR);
        surfaceGroup.add(cMeshL);
      }

      scene.add(surfaceGroup);
      threeRef.current.surfaceGroup = surfaceGroup;
    };

    // ---- Store refs ----
    threeRef.current = {
      scene,
      camera,
      renderer,
      container,
      trueSphere,
      morphMesh,
      surfaceGroup: null,
      surfaceMaterial,
      rebuildSurface,
      currentStep: null,
      morphInfluence: 1,
      unfoldProgress: 0,
    };

    // ==========================================================================
    // SVG LABEL HELPERS
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
      if (!svgRef.current || !camera) return;
      const svg = svgRef.current;
      const svgW = container.clientWidth;
      const svgH = container.clientHeight;
      svg.setAttribute("width", svgW);
      svg.setAttribute("height", svgH);
      svg.setAttribute("viewBox", `0 0 ${svgW} ${svgH}`);
      svg.innerHTML = "";

      const state = threeRef.current;
      const cs = state.currentStep;

      // ---- Defs ----
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
      // Sky blue (width) and yellow (height) markers
      defs.appendChild(
        mkMarker("arr-end-sky", 3.5, "0 0, 4 2, 0 4", "#87CEEB")
      );
      defs.appendChild(
        mkMarker("arr-start-sky", 0.5, "4 0, 0 2, 4 4", "#87CEEB")
      );
      defs.appendChild(
        mkMarker("arr-end-y", 3.5, "0 0, 4 2, 0 4", "#FFD700")
      );
      defs.appendChild(
        mkMarker("arr-start-y", 0.5, "4 0, 0 2, 4 4", "#FFD700")
      );
      svg.appendChild(defs);

      // ---- Helper: bidirectional arrow ----
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

      // ---- Helper: solid line ----
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

      // ---- Helper: draw 3D circle as SVG path (e.g. top base of cylinder in xz-plane at y) ----
      const circlePath3D = (centerY, radius, color = "#87CEEB", strokeWidth = 3) => {
        const segments = 64;
        const points = [];
        for (let i = 0; i <= segments; i++) {
          const t = (i / segments) * Math.PI * 2;
          const pt = new THREE.Vector3(radius * Math.cos(t), centerY, radius * Math.sin(t));
          points.push(project3DTo2D(pt));
        }
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        const d = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(" ");
        path.setAttribute("d", d);
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", color);
        path.setAttribute("stroke-width", strokeWidth);
        svg.appendChild(path);
      };

      // ---- Helper: dashed line ----
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

      // ---- Helper: text label ----
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

      const rectHalfW = Math.PI * r;

      // ==============================================================
      // STEP 2: Sphere labels (r above, 2r on right)
      // ==============================================================
      if (cs === 2) {
        // Radius dashed line above sphere
        dashedLine(
          new THREE.Vector3(0, r + 0.3, 0),
          new THREE.Vector3(r, r + 0.3, 0),
          "#60a5fa",
          1.5
        );
        textLabel(new THREE.Vector3(r / 2, r + 0.3, 0), "r", {
          offset: { x: 0, y: -14 },
          color: "#60a5fa",
        });

        // Height bidirectional arrow on right (yellow)
        biArrow(
          new THREE.Vector3(r + 0.6, -r, 0),
          new THREE.Vector3(r + 0.6, r, 0),
          "2r",
          {
            color: "#FFD700",
            dashed: true,
            labelOffset: { x: 20, y: 0 },
            labelColor: "#FFD700",
            markerSuffix: "y",
          }
        );
      }

      // ==============================================================
      // STEP 3: Cylinder labels (r on top, 2r on right) after morph
      // Circumference of top circular base + "2πr" label left of it
      // ==============================================================
      if (cs === 3 && state.morphInfluence <= 0.01) {
        // Highlight circumference of top circular base
        circlePath3D(h / 2, r, "#87CEEB", 3);
        // Label 2πr to the left of the top circular base
        textLabel(new THREE.Vector3(-r - 0.6, h / 2, 0), "2πr", {
          color: "#87CEEB",
          fontSize: "1.5vw",
          offset: { x: -10, y: 0 },
        });

        // Radius line on top circle
        solidLine(
          new THREE.Vector3(0, h / 2, 0),
          new THREE.Vector3(r, h / 2, 0),
          "#60a5fa",
          2
        );
        textLabel(new THREE.Vector3(r / 2, h / 2, 0), "r", {
          offset: { x: 0, y: -8 },
          color: "#60a8ff",
        });

        // Height arrow on right (yellow)
        biArrow(
          new THREE.Vector3(r + 0.6, -h / 2, 0),
          new THREE.Vector3(r + 0.6, h / 2, 0),
          "2r",
          {
            color: "#FFD700",
            dashed: true,
            labelOffset: { x: 20, y: 0 },
            labelColor: "#FFD700",
            markerSuffix: "y",
          }
        );
      }

      // ==============================================================
      // STEP 4: Rectangle labels (2πr above, 2r right) after unfold
      // Top edge = circumference attached to curved surface; no extra 2πr label (width label suffices)
      // ==============================================================
      if (cs === 4 && state.unfoldProgress >= 0.99) {
        // Highlight top edge of rectangle (same circumference, now unfolded)
        solidLine(
          new THREE.Vector3(-rectHalfW, h / 2, -r),
          new THREE.Vector3(rectHalfW, h / 2, -r),
          "#87CEEB",
          3
        );

        // Width arrow above rectangle (sky blue)
        biArrow(
          new THREE.Vector3(-rectHalfW + 0.15, h / 2 + 0.4, -r),
          new THREE.Vector3(rectHalfW - 0.15, h / 2 + 0.4, -r),
          "2πr",
          {
            color: "#87CEEB",
            dashed: true,
            fontSize: "1.5vw",
            labelOffset: { x: 0, y: -14 },
            labelColor: "#87CEEB",
            markerSuffix: "sky",
          }
        );

        // Height arrow on right (yellow)
        biArrow(
          new THREE.Vector3(rectHalfW + 0.5, -h / 2, -r),
          new THREE.Vector3(rectHalfW + 0.5, h / 2, -r),
          "2r",
          {
            color: "#FFD700",
            dashed: true,
            labelOffset: { x: 20, y: 0 },
            labelColor: "#FFD700",
            markerSuffix: "y",
          }
        );
      }
    };

    threeRef.current.updateLabels = updateLabels;

    // ---- Animation loop ----
    const animId = { value: null };
    const animate = () => {
      animId.value = requestAnimationFrame(animate);
      renderer.render(scene, camera);
      updateLabels();
    };
    animate();

    // ---- Resize handler ----
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
      cylGeo.dispose();
    };
  }, []);

  // ==========================================================================
  // STEP CHANGE EFFECT: trigger animations based on step
  // ==========================================================================
  useEffect(() => {
    const state = threeRef.current;
    if (!state.scene) return;

    state.currentStep = step;
    const { trueSphere, morphMesh, rebuildSurface } = state;
    let tween = null;

    // ---- Steps 1 & 2: show true sphere ----
    if (step === 1 || step === 2) {
      trueSphere.visible = true;
      morphMesh.visible = false;
      if (state.surfaceGroup) {
        state.surfaceGroup.visible = false;
      }
      state.morphInfluence = 1;
      state.unfoldProgress = 0;
    }

    // ---- Step 3: morph sphere → cylinder ----
    if (step === 3) {
      trueSphere.visible = false;
      morphMesh.visible = true;
      morphMesh.morphTargetInfluences[0] = 1;
      state.morphInfluence = 1;
      if (state.surfaceGroup) {
        state.surfaceGroup.visible = false;
      }

      const obj = { influence: 1 };
      tween = gsap.to(obj, {
        influence: 0,
        duration: 2,
        ease: "power2.inOut",
        onUpdate: () => {
          morphMesh.morphTargetInfluences[0] = obj.influence;
          state.morphInfluence = obj.influence;
        },
        onComplete: () => {
          state.morphInfluence = 0;
          if (onAnimationComplete) onAnimationComplete();
        },
      });
    }

    // ---- Step 4: unfold cylinder → rectangle ----
    if (step === 4) {
      trueSphere.visible = false;
      morphMesh.visible = false;
      state.unfoldProgress = 0;
      rebuildSurface(0);

      const obj = { value: 0 };
      tween = gsap.to(obj, {
        value: 1,
        duration: 2,
        ease: "power2.inOut",
        onUpdate: () => {
          state.unfoldProgress = obj.value;
          rebuildSurface(obj.value);
        },
        onComplete: () => {
          state.unfoldProgress = 1;
          if (onAnimationComplete) onAnimationComplete();
        },
      });
    }

    return () => {
      if (tween) tween.kill();
    };
  }, [step]);

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
