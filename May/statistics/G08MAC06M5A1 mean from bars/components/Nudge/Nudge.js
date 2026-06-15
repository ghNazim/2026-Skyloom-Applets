/**
 * Nudge — tap hint overlay on a target element (portal to body).
 * Props: targetRef, active, onDismiss (optional), src (optional)
 */
const Nudge = ({
  targetRef,
  active,
  onDismiss,
  src = "assets/tap.gif",
  small = false,
}) => {
  const { useState, useEffect, createElement: e } = React;

  const [visible, setVisible] = useState(false);
  const [layout, setLayout] = useState(null);

  useEffect(() => {
    if (!active) {
      setVisible(false);
      setLayout(null);
      return;
    }
    setVisible(true);
  }, [active]);

  useEffect(() => {
    if (!active || !visible) return;

    let el = null;
    let rafId = 0;
    let resizeObserver = null;

    const updateLayout = () => {
      const node = targetRef && targetRef.current;
      if (!node) return;

      const rect = node.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) return;

      setLayout({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
    };

    const onTargetClick = () => {
      setVisible(false);
      if (onDismiss) onDismiss();
    };

    const attach = () => {
      el = targetRef && targetRef.current;
      if (!el) {
        rafId = requestAnimationFrame(attach);
        return;
      }

      updateLayout();
      rafId = requestAnimationFrame(updateLayout);
      window.addEventListener("resize", updateLayout);
      window.addEventListener("scroll", updateLayout, true);
      el.addEventListener("click", onTargetClick);

      if (typeof ResizeObserver !== "undefined") {
        resizeObserver = new ResizeObserver(updateLayout);
        resizeObserver.observe(el);
      }
    };

    attach();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", updateLayout);
      window.removeEventListener("scroll", updateLayout, true);
      if (el) el.removeEventListener("click", onTargetClick);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [active, visible, targetRef, onDismiss]);

  if (!visible || !layout) return null;

  return ReactDOM.createPortal(
    e(
      "div",
      {
        className: "nudge-overlay",
        style: {
          top: `${layout.top}px`,
          left: `${layout.left}px`,
          width: `${layout.width}px`,
          height: `${layout.height}px`,
        },
      },
      e("img", {
        className: "nudge-tap-img" + (small ? " small" : ""),
        src,
        alt: "",
        draggable: false,
      }),
    ),
    document.body,
  );
};
