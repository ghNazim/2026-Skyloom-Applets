const DragPathNudge = ({
  show,
  svgRef,
  fromGrid,
  toGrid,
  originX,
  originY,
  unit,
}) => {
  const { useRef, useEffect, useState, useCallback } = React;
  const imgRef = useRef(null);
  const tweenRef = useRef(null);

  const gridToScreen = useCallback(
    (gx, gy) => {
      const svg = svgRef && svgRef.current;
      if (!svg || gx == null || gy == null) return null;
      const pt = svg.createSVGPoint();
      pt.x = originX + gx * unit;
      pt.y = originY - gy * unit;
      const ctm = svg.getScreenCTM();
      if (!ctm) return null;
      const screen = pt.matrixTransform(ctm);
      return { x: screen.x, y: screen.y };
    },
    [svgRef, originX, originY, unit],
  );

  const [positions, setPositions] = useState(null);

  const updatePositions = useCallback(() => {
    if (!show || !fromGrid || !toGrid) {
      setPositions(null);
      return;
    }
    const from = gridToScreen(fromGrid.x, fromGrid.y);
    const to = gridToScreen(toGrid.x, toGrid.y);
    if (from && to) setPositions({ from: from, to: to });
  }, [show, fromGrid, toGrid, gridToScreen]);

  useEffect(() => {
    updatePositions();
    window.addEventListener("resize", updatePositions);
    return () => window.removeEventListener("resize", updatePositions);
  }, [updatePositions]);

  useEffect(() => {
    if (tweenRef.current) {
      tweenRef.current.kill();
      tweenRef.current = null;
    }
    const el = imgRef.current;
    if (!show || !positions || !el || typeof gsap === "undefined") return undefined;

    gsap.set(el, {
      left: positions.from.x,
      top: positions.from.y,
    });
    tweenRef.current = gsap.to(el, {
      left: positions.to.x,
      top: positions.to.y,
      duration: 1.2,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1,
    });

    return () => {
      if (tweenRef.current) {
        tweenRef.current.kill();
        tweenRef.current = null;
      }
    };
  }, [show, positions]);

  if (!show || !positions) return null;

  return React.createElement("img", {
    ref: imgRef,
    src: "assets/tap.png",
    alt: "",
    className: "drag-path-nudge",
    style: {
      position: "fixed",
      transform: "translate(-50%, -50%)",
      pointerEvents: "none",
      zIndex: 1000,
    },
  });
};
