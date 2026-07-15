const SliderDragNudge = ({ show, fromPct, toPct }) => {
  const { useRef, useEffect } = React;
  const ref = useRef(null);
  const tweenRef = useRef(null);

  useEffect(() => {
    if (tweenRef.current) {
      tweenRef.current.kill();
      tweenRef.current = null;
    }
    if (
      !show ||
      fromPct == null ||
      toPct == null ||
      Math.abs(fromPct - toPct) < 0.3
    ) {
      return undefined;
    }

    const el = ref.current;
    if (!el) return undefined;

    gsap.set(el, { left: fromPct + "%" });
    tweenRef.current = gsap.to(el, {
      left: toPct + "%",
      duration: 1.5,
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
  }, [show, fromPct, toPct]);

  if (
    !show ||
    fromPct == null ||
    toPct == null ||
    Math.abs(fromPct - toPct) < 0.3
  ) {
    return null;
  }

  return React.createElement("img", {
    ref: ref,
    src: "assets/tab.png",
    alt: "",
    className: "slider-drag-nudge",
    style: { left: fromPct + "%" },
  });
};
