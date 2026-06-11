const Nudge = ({
  targetRef,
  position,
  visible = true,
  size = "5vw",
  offsetX = 0,
  offsetY = 0,
  anchorX = 0.8,
  anchorY = 0.65,
}) => {
  const { useState, useEffect, useLayoutEffect, useCallback } = React;

  const [coords, setCoords] = useState(null);

  const updatePosition = useCallback(() => {
    if (position) {
      setCoords(position);
      return true;
    }
    const el = targetRef && targetRef.current;
    if (!el) {
      return false;
    }
    const rect = el.getBoundingClientRect();
    if (rect.width < 1 && rect.height < 1) {
      return false;
    }
    setCoords({
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    });
    return true;
  }, [targetRef, position]);

  useLayoutEffect(() => {
    if (!visible) {
      setCoords(null);
      return;
    }

    let cancelled = false;
    let rafId = 0;

    const measure = () => {
      if (!cancelled) {
        updatePosition();
      }
    };

    measure();
    rafId = requestAnimationFrame(() => {
      measure();
      requestAnimationFrame(measure);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
    };
  }, [visible, updatePosition]);

  useEffect(() => {
    if (!visible) return;

    const onResize = () => updatePosition();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);

    let observer = null;
    const el = targetRef && targetRef.current;
    if (el && typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(onResize);
      observer.observe(el);
    }

    let attempts = 0;
    const pollId = setInterval(() => {
      attempts += 1;
      if (updatePosition() || attempts > 40) {
        clearInterval(pollId);
      }
    }, 50);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
      if (observer) observer.disconnect();
      clearInterval(pollId);
    };
  }, [visible, targetRef, position, updatePosition]);

  if (!visible || !coords) return null;

  const w = coords.width != null ? coords.width : 0;
  const h = coords.height != null ? coords.height : 0;
  const pointX = coords.left + w * anchorX + offsetX;
  const pointY = coords.top + h * anchorY + offsetY;

  const nudgeEl = React.createElement(
    "div",
    {
      className: "nudge-overlay",
      style: {
        left: pointX + "px",
        top: pointY + "px",
        width: size,
        height: size,
        transform: "translate(-50%, -50%)",
      },
    },
    React.createElement("img", {
      src: "assets/tap.gif",
      alt: "",
      draggable: false,
    }),
  );

  if (typeof ReactDOM !== "undefined" && ReactDOM.createPortal) {
    return ReactDOM.createPortal(nudgeEl, document.body);
  }

  return nudgeEl;
};
