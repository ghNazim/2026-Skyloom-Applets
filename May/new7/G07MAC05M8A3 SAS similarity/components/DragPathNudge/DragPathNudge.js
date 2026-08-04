const DragPathNudge = ({ show, svgRef, fromPt, toPt }) => {
  const { useRef, useEffect, useState, useCallback } = React;
  const imgRef = useRef(null);
  const tweenRef = useRef(null);

  const svgPointToScreen = useCallback(
    (pt) => {
      const svg = svgRef && svgRef.current;
      if (!svg || !pt) return null;
      const svgPt = svg.createSVGPoint();
      svgPt.x = pt.x;
      svgPt.y = pt.y;
      const ctm = svg.getScreenCTM();
      if (!ctm) return null;
      const screen = svgPt.matrixTransform(ctm);
      return { x: screen.x, y: screen.y };
    },
    [svgRef],
  );

  const [positions, setPositions] = useState(null);

  const updatePositions = useCallback(() => {
    if (!show || !fromPt || !toPt) {
      setPositions(null);
      return;
    }
    const from = svgPointToScreen(fromPt);
    const to = svgPointToScreen(toPt);
    if (from && to) setPositions({ from, to });
  }, [show, fromPt, toPt, svgPointToScreen]);

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
