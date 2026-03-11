const SpinningWheel = ({ objects, disabledObjects, onSelect }) => {
  const { useState, useRef, useEffect } = React;
  const [spinning, setSpinning] = useState(false);
  const [phase, setPhase] = useState("idle");
  const [selectedTarget, setSelectedTarget] = useState(null);
  const wheelRef = useRef(null);
  const wrapperRef = useRef(null);
  const wheelOuterRef = useRef(null);
  const selectedImageRef = useRef(null);
  const overlayRef = useRef(null);
  const currentRotationRef = useRef(0);
  const exitHandledRef = useRef(false);

  const sectionAngle = 360 / objects.length;

  useEffect(() => {
    if (phase === "highlight" && selectedTarget) {
      const t = setTimeout(() => setPhase("exit"), 500);
      return () => clearTimeout(t);
    }
  }, [phase, selectedTarget]);

  useEffect(() => {
    if (phase !== "exit" || !selectedTarget) return;
    if (exitHandledRef.current) return;
    exitHandledRef.current = true;

    const runExitAnimation = () => {
      const cloneImg = overlayRef.current;
      const sourceImg = selectedImageRef.current;
      const outer = wheelOuterRef.current;
      if (!cloneImg || !sourceImg || !outer) {
        onSelect(selectedTarget.key);
        return;
      }

      const sourceRect = sourceImg.getBoundingClientRect();
      const outerRect = outer.getBoundingClientRect();
      const left = sourceRect.left - outerRect.left;
      const top = sourceRect.top - outerRect.top;
      const width = sourceRect.width;
      const height = sourceRect.height;
      const effectiveRotation = selectedTarget.rotation % 360;

      gsap.set(cloneImg, {
        position: "absolute",
        left: left,
        top: top,
        width: width,
        height: height,
        opacity: 1,
        scale: 1,
        rotation: effectiveRotation,
        transformOrigin: "center center",
      });

      const rimEl = outer?.querySelector(".spinner-rim-outer-gold");
      if (rimEl) gsap.to(rimEl, { opacity: 0, duration: 0.3 });
      if (wrapperRef.current) {
        gsap.to(wrapperRef.current, { opacity: 0, duration: 0.3 });
      }

      const centerX = outerRect.width / 2;
      const centerY = outerRect.height / 2;
      const scaleFactor = selectedTarget.wheelScaleFactor ?? 2.6;

      gsap.to(cloneImg, {
        left: centerX,
        top: centerY,
        xPercent: -50,
        yPercent: -50,
        scale: scaleFactor,
        rotation: 0,
        duration: 0.5,
        ease: "power2.out",
        onComplete: () => onSelect(selectedTarget.key),
      });
    };

    requestAnimationFrame(() => requestAnimationFrame(runExitAnimation));
  }, [phase, selectedTarget, onSelect]);

  const handleSpin = () => {
    if (spinning || phase !== "idle") return;
    playSound("click");

    const available = objects.filter((o) => !disabledObjects.includes(o.key));
    if (available.length === 0) return;

    const target = available[Math.floor(Math.random() * available.length)];
    const targetIndex = objects.findIndex((o) => o.key === target.key);

    setSpinning(true);

    const targetBaseAngle =
      180 - (targetIndex * sectionAngle + sectionAngle / 2);
    const normalizedTarget = ((targetBaseAngle % 360) + 360) % 360;
    const currentRot = currentRotationRef.current;
    const minAngle = currentRot + 5 * 360;
    const finalAngle =
      normalizedTarget + Math.ceil((minAngle - normalizedTarget) / 360) * 360;

    gsap.to(wheelRef.current, {
      rotation: finalAngle,
      duration: 3 + Math.random() * 0.5,
      ease: "power3.out",
      onComplete: () => {
        currentRotationRef.current = finalAngle;
        setSpinning(false);
        playSound("correct");
        setSelectedTarget({
          ...target,
          index: targetIndex,
          rotation: finalAngle,
        });
        setPhase("highlight");
      },
    });
  };

  const generateBackground = () => {
    const highlightIndex =
      phase === "highlight" && selectedTarget ? selectedTarget.index : -1;
    const stops = objects
      .map((obj, i) => {
        let color = disabledObjects.includes(obj.key) ? "#888888" : "#f8c9a8";
        if (i === highlightIndex) color = "#e8b830";
        return (
          color +
          " " +
          i * sectionAngle +
          "deg " +
          (i + 1) * sectionAngle +
          "deg"
        );
      })
      .join(", ");
    return "conic-gradient(" + stops + ")";
  };

  const getContentPosition = (index) => {
    const angleDeg = index * sectionAngle + sectionAngle / 2;
    const angleRad = (angleDeg * Math.PI) / 180;
    const distance = 33;
    const x = 50 + distance * Math.sin(angleRad);
    const y = 50 - distance * Math.cos(angleRad);
    return { left: x + "%", top: y + "%" };
  };

  const ce = React.createElement;

  const dividerLines = objects.map((_, i) =>
    ce("div", {
      key: "line-" + i,
      className: "wheel-line",
      style: { transform: "rotate(" + i * sectionAngle + "deg)" },
    }),
  );

  const sectionItems = objects.map((obj, i) => {
    const pos = getContentPosition(i);
    const isDisabled = disabledObjects.includes(obj.key);
    const isSelected = selectedTarget && selectedTarget.key === obj.key;
    const label = APP_DATA.wheelLabels[obj.key];
    return ce(
      "div",
      {
        key: obj.key,
        className: "wheel-item" + (isDisabled ? " disabled" : ""),
        style: { left: pos.left, top: pos.top },
      },
      ce("span", { className: "wheel-item-label" }, label),
      ce("img", {
        ref: isSelected ? selectedImageRef : undefined,
        src: "assets/" + obj.image,
        alt: label,
        className: "wheel-item-image",
      }),
    );
  });

  const canClick = phase === "idle" && !spinning;

  const goldenDots = 24;

  return ce(
    "div",
    {
      ref: wheelOuterRef,
      className: "wheel-outer",
      onClick: canClick ? handleSpin : undefined,
      style: { cursor: canClick ? "pointer" : "default" },
    },
    ce(
      "div",
      { className: "spinner-rim-outer-gold" },
      ce(
        "div",
        { className: "spinner-rim-thick-blue" },
        Array.from({ length: goldenDots }).map((_, i) =>
          ce("div", {
            key: "dot-" + i,
            className: "spinner-golden-dot",
            style: {
              transform: `rotate(${(i * 360) / goldenDots}deg)  translateY(calc(-1 * var(--spinner-dot-offset)))`,
            },
          }),
        ),
        ce(
          "div",
          { className: "spinner-rim-inner-gold" },
          ce(
            "div",
            { ref: wrapperRef, className: "wheel-wrapper" },
            ce(
              "div",
              {
                ref: wheelRef,
                className: "wheel-inner",
                style: { background: generateBackground() },
              },
              dividerLines.concat(sectionItems),
            ),
          ),
          ce("div", { className: "wheel-center-knob" }),
          ce("div", { className: "wheel-pointer" }),
        ),
      ),
    ),
    phase === "exit" &&
      selectedTarget &&
      ce(
        "div",
        { className: "wheel-selected-overlay" },
        ce("img", {
          ref: overlayRef,
          src: "assets/" + selectedTarget.image,
          alt: APP_DATA.wheelLabels[selectedTarget.key],
          className: "wheel-selected-image",
        }),
      ),
  );
};
