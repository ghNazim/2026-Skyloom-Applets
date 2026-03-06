// Place Values up to 1 Million / MainCanvas.js

const MainCanvas = ({
  activeStep,
  animating,
  setAnimating,
  completedSteps,
  onButtonClick,
  onAnimationComplete,
}) => {
  const { useState, useEffect, useRef, useCallback } = React;

  const [phase, setPhase] = useState("idle");
  // phase: "idle" | "initial" | "fill" | "textChange" | "cloneAnim" | "bottomAppear" | "tableAppear" | "done"

  const [visibleTableEntries, setVisibleTableEntries] = useState([]);
  const topVisualRef = useRef(null);
  const bottomVisualRef = useRef(null);
  const prevStepRef = useRef(-1);
  const animTimelineRef = useRef(null);

  const steps = APP_DATA.steps;

  // Determine which button is enabled
  const getEnabledButton = () => {
    if (animating) return -1;
    if (completedSteps.length === 0) return 0;
    const maxCompleted = Math.max(...completedSteps);
    if (maxCompleted >= steps.length - 1) return -1; // all done
    return maxCompleted + 1;
  };

  const enabledButton = getEnabledButton();

  // When activeStep changes, start the animation sequence
  useEffect(() => {
    if (activeStep < 0 || activeStep >= steps.length) return;
    if (prevStepRef.current === activeStep) return;
    prevStepRef.current = activeStep;

    // Start animation
    setAnimating(true);
    setPhase("initial");

    // Run the full sequence
    runSequence(activeStep);
  }, [activeStep]);

  const runSequence = async (stepIdx) => {
    const step = steps[stepIdx];

    // Phase: initial - show single image with text (opacity animation)
    setPhase("initial");
    await delay(1200);

    // Phase: fill - fill top visual with 10 images one by one + change text
    setPhase("fill");
    // Play tick sound with each image appearing (0.15s apart)
    for (let i = 0; i < 10; i++) {
      setTimeout(() => playSound("tick"), i * 150);
    }
    await delay(2200); // time for all 10 images to appear

    // Phase: textChange
    setPhase("textChange");
    await delay(600);

    // Phase: cloneAnim - prepare bottom image, create divisions, animate clones
    setPhase("cloneAnim");
    await delay(400); // let DOM render bottom image at 0 opacity

    await runCloneAnimation(stepIdx);

    // Phase: bottomAppear
    setPhase("bottomAppear");
    await delay(800);

    // Phase: tableAppear
    setPhase("tableAppear");
    setVisibleTableEntries((prev) => {
      if (!prev.includes(stepIdx)) return [...prev, stepIdx];
      return prev;
    });
    // playSound("tick");
    await delay(600);

    // Done
    setPhase("done");
    onAnimationComplete(stepIdx);
  };

  const runCloneAnimation = async (stepIdx) => {
    const step = steps[stepIdx];
    const topEl = topVisualRef.current;
    const bottomEl = bottomVisualRef.current;
    if (!topEl || !bottomEl) return;

    // Get all top images
    const topImages = topEl.querySelectorAll(".top-anim-img");
    if (topImages.length === 0) return;

    // Get the bottom image element (hidden at 0 opacity)
    const bottomImg = bottomEl.querySelector(".bottom-target-img");
    if (!bottomImg) return;

    const bottomRect = bottomImg.getBoundingClientRect();

    // Calculate division positions based on type
    const divisions = calculateDivisions(step, bottomRect);

    // Create clones and animate
    const clones = [];

    topImages.forEach((img, i) => {
      const rect = img.getBoundingClientRect();
      const clone = img.cloneNode(true);
      clone.style.position = "fixed";
      clone.style.left = rect.left + "px";
      clone.style.top = rect.top + "px";
      clone.style.width = rect.width + "px";
      clone.style.height = rect.height + "px";
      clone.style.margin = "0";
      clone.style.zIndex = "1000";
      clone.style.pointerEvents = "none";
      clone.style.transition = "none";
      clone.style.objectFit = "cover";
      clone.classList.add("clone-flying");
      document.body.appendChild(clone);
      clones.push({
        clone,
        sourceRect: rect,
        divIndex: i < divisions.length ? i : divisions.length - 1,
      });
    });

    // Animate all clones simultaneously to their divisions
    await new Promise((resolve) => {
      const tl = gsap.timeline({ onComplete: resolve });
      const isStep5 = stepIdx === 4;
      const n = Math.max(1, divisions.length - 1);

      clones.forEach(({ clone, sourceRect, divIndex }) => {
        const div = divisions[Math.min(divIndex, divisions.length - 1)];

        let targetLeft = div.x;
        let targetTop = div.y;
        let targetWidth = div.w;
        let targetHeight = div.h;
        let xshift = 0;

        if (isStep5 && divisions.length >= 2) {
          // Step 5 only: first clone 80% height, last 100%, middle gradual
          // top: first 10% below (centered), last 0
          const t = divIndex / n; // 0 for first, 1 for last
          const heightScale = 0.8 + 0.2 * t;
          const topOffset = div.h * 0.1 * (1 - t);
          xshift = div.w * t * 2;
          const paddingLeft = div.w;
          targetWidth = div.w * heightScale;
          targetHeight = div.h * heightScale;
          targetLeft = paddingLeft + div.x + (div.w - targetWidth) / 2 - xshift;
          targetTop = div.y + topOffset;
        }

        tl.to(
          clone,
          {
            duration: 1.2,
            left: targetLeft + "px",
            top: targetTop + "px",
            width: targetWidth + "px",
            height: targetHeight + "px",
            ease: "power2.inOut",
          },
          0,
        );
      });
    });

    // Remove clones and show bottom image
    clones.forEach((c) => c.clone.remove());

    // Make bottom image fully visible
    if (bottomImg) {
      bottomImg.style.opacity = "1";
      playSound("correct");
    }
  };

  const calculateDivisions = (step, containerRect) => {
    const type = step.bottomDivisionType;
    const count = step.bottomDivisionCount;

    if (type === "column") {
      // Vertical sections within the container (column image, 10 sections stacked)
      // total height = 10 * squareW + 9 * gap
      // squareW = containerRect.width (each section is square-ish)
      const w = containerRect.width;
      const totalH = containerRect.height;
      const squareH = w; // each division is roughly square
      const gap = (totalH - count * squareH) / (count - 1 || 1);

      return Array.from({ length: count }, (_, i) => ({
        x: containerRect.left,
        y: containerRect.top + i * (squareH + gap),
        w: w,
        h: squareH,
      }));
    }

    if (type === "row") {
      // Horizontal sections (columns side by side, no gap)
      // Each division is 1/count of the total width, full height
      const h = containerRect.height;
      const totalW = containerRect.width;
      const sectionW = totalW / count;

      return Array.from({ length: count }, (_, i) => ({
        x: containerRect.left + i * sectionW,
        y: containerRect.top,
        w: sectionW,
        h: h,
      }));
    }

    if (type === "single") {
      // 10 square divisions, positioned absolute: size×size each
      // left = baseLeft + padding + i * shiftX, top = baseTop + padding + i * shiftY
      const vw = window.innerWidth / 100;
      const size = (step.size || 15);
      const width = (step.width || size) * vw;
      const height = (step.height || size) * vw;
      const paddingX = (step.paddingX || 4) * vw;
      const paddingY = (step.paddingY || 1) * vw;
      const shiftX = (step.shiftX || 0.4) * vw;
      const shiftY = (step.shiftY || 0.4) * vw;
      const divCount = step.bottomDivisionCount || 10;

      return Array.from({ length: divCount }, (_, i) => ({
        x: containerRect.left + paddingX - i * shiftX,
        y: containerRect.top + paddingY + i * shiftY,
        w: width,
        h: height,
      }));
    }

    // Fallback
    return [
      {
        x: containerRect.left,
        y: containerRect.top,
        w: containerRect.width,
        h: containerRect.height,
      },
    ];
  };

  const delay = (ms) => new Promise((r) => setTimeout(r, ms));

  // ══════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════

  const currentStep =
    activeStep >= 0 && activeStep < steps.length ? steps[activeStep] : null;

  // When step changes, use "initial" immediately so we don't flash 10 images before showing 1
  const stepJustChanged =
    activeStep >= 0 && activeStep < steps.length && prevStepRef.current !== activeStep;
  const effectivePhase = stepJustChanged ? "initial" : phase;

  // Buttons Column
  const renderButtonsColumn = () => {
    return React.createElement(
      "div",
      { className: "buttons-column" },
      APP_DATA.buttons.map((btnText, i) =>
        React.createElement(
          "button",
          {
            key: i,
            className: `pv-button pv-btn-${i} ${enabledButton === i ? "enabled" : "disabled"} ${completedSteps.includes(i) ? "completed" : ""}`,
            disabled: enabledButton !== i,
            onClick: () => onButtonClick(i),
          },
          btnText,
        ),
      ),
    );
  };

  // Table Column
  const renderTableColumn = () => {
    return React.createElement(
      "div",
      { className: "table-column" },
      APP_DATA.tableEntries.map((entry, i) =>
        React.createElement(
          "div",
          {
            key: i,
            className: `table-entry ${visibleTableEntries.includes(i) ? "visible" : ""}`,
          },
          entry,
        ),
      ),
    );
  };

  // Visual Column
  const renderVisualColumn = () => {
    if (!currentStep) {
      return React.createElement(
        "div",
        { className: "visual-column" },
        React.createElement(
          "div",
          { className: "visual-top-row" },
          React.createElement("div", {
            className: "top-visual",
            ref: topVisualRef,
          }),
          React.createElement("div", { className: "top-text" }),
        ),
        React.createElement(
          "div",
          { className: "visual-bottom-row" },
          React.createElement("div", { className: "bottom-text" }),
          React.createElement("div", {
            className: "bottom-visual",
            ref: bottomVisualRef,
          }),
        ),
      );
    }

    return React.createElement(
      "div",
      { className: "visual-column" },
      // Top Row (60%)
      React.createElement(
        "div",
        { className: "visual-top-row" },
        // Top Visual (75%)
        React.createElement(
          "div",
          { className: "top-visual", ref: topVisualRef },
          renderTopVisualContent(),
        ),
        // Top Text (25%)
        React.createElement(
          "div",
          { className: "top-text" },
          renderTopTextContent(),
        ),
      ),
      // Bottom Row (40%)
      React.createElement(
        "div",
        { className: "visual-bottom-row" },
        // Bottom Text (50%)
        React.createElement(
          "div",
          { className: "bottom-text" },
          renderBottomTextContent(),
        ),
        // Bottom Visual (50%)
        React.createElement(
          "div",
          { className: "bottom-visual", ref: bottomVisualRef },
          renderBottomVisualContent(),
        ),
      ),
    );
  };

  const renderTopVisualContent = () => {
    if (!currentStep) return null;

    if (effectivePhase === "initial") {
      // Show single initial image (clean top, then pop in)
      const isColumn =
        currentStep.initialImage === "ten.png" ||
        currentStep.initialImage === "tenThousand.png";
      const style = {};
      if (currentStep.topImageWidth) style.width = currentStep.topImageWidth;
      if (currentStep.topImageHeight) style.height = currentStep.topImageHeight;
      if (isColumn) {
        style.height = currentStep.topImageHeight || "8vw";
      } else {
        style.width = currentStep.topImageWidth || "5vw";
      }
      style.objectFit = "contain";

      return React.createElement("img", {
        src: `assets/${currentStep.initialImage}`,
        className: "initial-single-img fade-in-anim",
        style: style,
      });
    }

    if (
      effectivePhase === "fill" ||
      effectivePhase === "textChange" ||
      effectivePhase === "cloneAnim" ||
      effectivePhase === "bottomAppear" ||
      effectivePhase === "tableAppear" ||
      effectivePhase === "done"
    ) {
      // Show 10 images with staggered animation
      const imgs = [];
      const layout = currentStep.topLayout;
      const rows = currentStep.topRows;
      const perRow = currentStep.topPerRow;
      const isSingle = currentStep.bottomDivisionType === "single";

      for (let i = 0; i < currentStep.topCount; i++) {
        const isColumn =
          currentStep.initialImage === "ten.png" ||
          currentStep.initialImage === "tenThousand.png";
        const style = {
          animationDelay: effectivePhase === "fill" ? `${i * 0.15}s` : "0s",
        };

        if (isColumn) {
          style.height = currentStep.topImageHeight || "8vw";
          style.width = "auto";
        } else {
          style.width = currentStep.topImageWidth || "5vw";
          style.height = "auto";
        }
        style.objectFit = "contain";

        imgs.push(
          React.createElement("img", {
            key: i,
            src: `assets/${currentStep.initialImage}`,
            className: `top-anim-img ${effectivePhase === "fill" ? "appear-one-by-one" : ""}`,
            style: style,
          }),
        );
      }

      if (layout === "grid") {
        // 2 rows, 5 per row
        const rowEls = [];
        for (let r = 0; r < rows; r++) {
          const rowImgs = imgs.slice(r * perRow, (r + 1) * perRow);
          rowEls.push(
            React.createElement(
              "div",
              { key: r, className: "top-images-row" + (isSingle ? " large-gap" : "") },
              ...rowImgs,
            ),
          );
        }
        return React.createElement(
          "div",
          { className: "top-images-grid" + (isSingle ? " large-gap-parent" : "") },
          ...rowEls,
        );
      }

      // single row
      return React.createElement(
        "div",
        { className: "top-images-row" },
        ...imgs,
      );
    }

    return null;
  };

  const renderTopTextContent = () => {
    if (!currentStep) return null;

    if (effectivePhase === "initial") {
      return React.createElement(
        "span",
        { className: "pv-text fade-in-anim" },
        currentStep.initialText,
      );
    }

    if (
      effectivePhase === "fill" ||
      effectivePhase === "textChange" ||
      effectivePhase === "cloneAnim" ||
      effectivePhase === "bottomAppear" ||
      effectivePhase === "tableAppear" ||
      effectivePhase === "done"
    ) {
      return React.createElement(
        "span",
        { className: "pv-text fade-in-anim" },
        currentStep.topText,
      );
    }

    return null;
  };

  const renderBottomTextContent = () => {
    if (!currentStep) return null;

    if (
      effectivePhase === "bottomAppear" ||
      effectivePhase === "tableAppear" ||
      effectivePhase === "done"
    ) {
      return React.createElement(
        "span",
        { className: "pv-text fade-in-anim" },
        currentStep.bottomText,
      );
    }

    return null;
  };

  const renderBottomVisualContent = () => {
    if (!currentStep) return null;

    if (
      effectivePhase === "cloneAnim" ||
      effectivePhase === "bottomAppear" ||
      effectivePhase === "tableAppear" ||
      effectivePhase === "done"
    ) {
      const isVisible = effectivePhase !== "cloneAnim"; // start hidden, become visible after clone anim
      return React.createElement("img", {
        src: `assets/${currentStep.bottomImage}`,
        className: "bottom-target-img",
        style: {
          opacity: isVisible ? 1 : 0,
          maxWidth: "100%",
          maxHeight: "100%",
          objectFit: "contain",
          transition: "none",
        },
      });
    }

    return null;
  };

  return React.createElement(
    "div",
    { className: "main-canvas-pv" },
    renderButtonsColumn(),
    renderTableColumn(),
    renderVisualColumn(),
  );
};
