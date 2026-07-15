const Overlay = ({
  operationName,
  isRigid,
  headingBefore,
  headingAfter,
  leftHeading,
  rightHeading,
  footerText,
  leftItems,
  rightItems,
  onClose,
  onAnimComplete,
  showHeading,
  showFooter,
  allowClose,
  leftHeaderClickable,
  rightHeaderClickable,
  onLeftHeaderClick,
  onRightHeaderClick,
}) => {
  const { useState, useEffect, useRef } = React;

  const [animDone, setAnimDone] = useState(false);
  const [flyStyle, setFlyStyle] = useState(null);
  const headingOpRef = useRef(null);
  const targetSlotRef = useRef(null);
  const flyingRef = useRef(null);
  const hasFlownRef = useRef(false);
  const onAnimCompleteRef = useRef(onAnimComplete);
  const gsapTweenRef = useRef(null);
  const overlayContainerRef = useRef(null);
  const leftHeaderRef = useRef(null);
  const rightHeaderRef = useRef(null);

  onAnimCompleteRef.current = onAnimComplete;

  const getCenter = (rect) => ({
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  });

  const targetItems = isRigid ? leftItems : rightItems;
  const alreadyInTargetList = targetItems.includes(operationName);
  const showTargetSlot = !alreadyInTargetList;

  useEffect(() => {
    return () => {
      if (gsapTweenRef.current) gsapTweenRef.current.kill();
    };
  }, []);

  useEffect(() => {
    if (!showHeading) {
      setAnimDone(true);
      setFlyStyle(null);
      return;
    }

    if (hasFlownRef.current) return;

    setAnimDone(false);
    setFlyStyle(null);

    const timer = setTimeout(() => {
      if (hasFlownRef.current) return;

      const sourceEl = headingOpRef.current;
      const targetEl = targetSlotRef.current;

      if (!sourceEl || !targetEl) {
        hasFlownRef.current = true;
        setAnimDone(true);
        if (onAnimCompleteRef.current) onAnimCompleteRef.current();
        return;
      }

      const sourceCenter = getCenter(sourceEl.getBoundingClientRect());
      const targetCenter = getCenter(targetEl.getBoundingClientRect());

      setFlyStyle({
        left: sourceCenter.x,
        top: sourceCenter.y,
        fontSize: window.getComputedStyle(sourceEl).fontSize,
        targetLeft: targetCenter.x,
        targetTop: targetCenter.y,
      });
    }, 400);

    return () => clearTimeout(timer);
  }, [operationName, showHeading]);

  useEffect(() => {
    if (
      !showHeading ||
      !flyStyle ||
      !flyingRef.current ||
      typeof gsap === "undefined" ||
      hasFlownRef.current
    )
      return;

    if (gsapTweenRef.current) gsapTweenRef.current.kill();

    gsapTweenRef.current = gsap.to(flyingRef.current, {
      left: flyStyle.targetLeft,
      top: flyStyle.targetTop,
      fontSize: "2vw",
      duration: 0.7,
      ease: "power2.inOut",
      onComplete: () => {
        hasFlownRef.current = true;
        setFlyStyle(null);
        setAnimDone(true);
        if (onAnimCompleteRef.current) onAnimCompleteRef.current();
      },
    });
  }, [flyStyle, showHeading]);

  const targetSide = isRigid ? "left" : "right";
  const canClose = allowClose && animDone;
  const footerVisible = showFooter && animDone;

  const renderTargetSlot = () =>
    React.createElement(
      "div",
      {
        ref: targetSlotRef,
        className: "overlay-box-slot overlay-box-item",
        style: animDone ? {} : { visibility: "hidden" },
      },
      operationName
    );

  const renderHeader = (text, clickable, onClick, headerRef) =>
    React.createElement(
      "div",
      {
        ref: headerRef,
        className:
          "overlay-box-header" +
          (clickable ? " overlay-box-header-clickable" : ""),
        onClick: clickable ? onClick : undefined,
      },
      text
    );

  return React.createElement(
    "div",
    {
      ref: overlayContainerRef,
      className:
        "overlay-backdrop" + (canClose ? " overlay-backdrop-closable" : ""),
      onClick: canClose ? onClose : undefined,
    },
    showHeading &&
      React.createElement(
        "div",
        { className: "overlay-heading-row" },
        headingBefore,
        React.createElement(
          "span",
          {
            ref: headingOpRef,
            className: "overlay-op-name",
          },
          operationName
        ),
        headingAfter
      ),
    React.createElement(
      "div",
      { className: "overlay-boxes-row" },
      React.createElement(
        "div",
        { className: "overlay-box" },
        renderHeader(leftHeading, leftHeaderClickable, onLeftHeaderClick, leftHeaderRef),
        React.createElement(
          "div",
          { className: "overlay-box-content" },
          leftItems.map((item, i) =>
            React.createElement(
              "div",
              { key: "left-" + i, className: "overlay-box-item" },
              item
            )
          ),
          targetSide === "left" && showTargetSlot && renderTargetSlot()
        )
      ),
      React.createElement(
        "div",
        { className: "overlay-box" },
        renderHeader(rightHeading, rightHeaderClickable, onRightHeaderClick, rightHeaderRef),
        React.createElement(
          "div",
          { className: "overlay-box-content" },
          rightItems.map((item, i) =>
            React.createElement(
              "div",
              { key: "right-" + i, className: "overlay-box-item" },
              item
            )
          ),
          targetSide === "right" && showTargetSlot && renderTargetSlot()
        )
      )
    ),
    React.createElement(
      "div",
      {
        className:
          "overlay-footer-row" + (footerVisible ? "" : " is-hidden"),
      },
      footerText
    ),
    flyStyle &&
      showHeading &&
      React.createElement(
        "div",
        {
          ref: flyingRef,
          className: "overlay-flying-op",
          style: {
            left: flyStyle.left,
            top: flyStyle.top,
            fontSize: flyStyle.fontSize,
          },
        },
        operationName
      ),
    leftHeaderClickable &&
      React.createElement(NudgeAtTarget, {
        targetRef: leftHeaderRef,
        active: true,
        containerRef: overlayContainerRef,
        className: "nudge-overlay",
      }),
    rightHeaderClickable &&
      React.createElement(NudgeAtTarget, {
        targetRef: rightHeaderRef,
        active: true,
        containerRef: overlayContainerRef,
        className: "nudge-overlay",
      })
  );
};
