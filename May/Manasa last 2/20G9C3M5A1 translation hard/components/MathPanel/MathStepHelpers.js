const createInitialMathState = (mp) => ({
  equationVisible: false,
  equationCollapsed: false,
  line1Visible: false,
  line2Visible: false,
  line2Text: mp.line2X,
  equationParts: {
    left: "x",
    showPlus: true,
    middle: "y",
    right: "2",
  },
  highlightVar: null,
  equationClickable: false,
  objectTitleVisible: false,
  objectRowHidden: false,
  objectPoints: [
    {
      id: "math-object-0",
      visible: false,
      mode: "coords",
      text: mp.objectCoord0,
      clickable: false,
      instant: false,
    },
    {
      id: "math-object-1",
      visible: false,
      mode: "coords",
      text: mp.objectCoord1,
      clickable: false,
      instant: false,
    },
  ],
  line3Visible: false,
  line3Hidden: false,
  line3PrefixVisible: false,
  line3VectorVisible: false,
  line3VectorInstant: false,
  imageTitleVisible: false,
  imagePoints: [
    {
      id: "math-image-0",
      visible: false,
      mode: "empty",
      instant: false,
    },
    {
      id: "math-image-1",
      visible: false,
      mode: "empty",
      instant: false,
    },
  ],
  formulaVisible: false,
  formulaVarsYellow: false,
  formulaClickable: false,
  formulaGlow: false,
  formulaComplete: false,
  simplifyStep: -1,
  simplifyAnimPhase: "idle",
  step7Phase: "initial",
  step8Phase: "initial",
  step9Phase: "initial",
  activeCardId: null,
  exploredCardIds: [],
  contentHighlightId: null,
});

const MathStepHelpers = {
  createFlyClone: (sourceEl, targetEl, options, setFlyClones) => {
    return new Promise((resolve) => {
      if (!sourceEl || !targetEl) {
        resolve();
        return;
      }
      const id = "fly-" + Date.now() + "-" + Math.random();
      const src = sourceEl.getBoundingClientRect();
      const tgt = targetEl.getBoundingClientRect();
      const dx = tgt.left + tgt.width / 2 - (src.left + src.width / 2);
      const dy = tgt.top + tgt.height / 2 - (src.top + src.height / 2);

      setFlyClones((prev) =>
        prev.concat([
          {
            id: id,
            text: options.text || sourceEl.textContent.trim(),
            startX: src.left + src.width / 2,
            startY: src.top + src.height / 2,
            dx: dx,
            dy: dy,
            animating: false,
            colorClass: options.colorClass || "",
          },
        ]),
      );

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setFlyClones((prev) =>
            prev.map((c) => (c.id === id ? { ...c, animating: true } : c)),
          );
        });
      });

      setTimeout(() => {
        setFlyClones((prev) => prev.filter((c) => c.id !== id));
        resolve();
      }, 780);
    });
  },

  createFlyClonesParallel: (items, setFlyClones) => {
    return new Promise((resolve) => {
      const valid = items.filter((item) => item.sourceEl && item.targetEl);
      if (valid.length === 0) {
        resolve();
        return;
      }

      const newClones = valid.map((item, idx) => {
        const id = "fly-" + Date.now() + "-" + idx + "-" + Math.random();
        const src = item.sourceEl.getBoundingClientRect();
        const tgt = item.targetEl.getBoundingClientRect();
        const dx = tgt.left + tgt.width / 2 - (src.left + src.width / 2);
        const dy = tgt.top + tgt.height / 2 - (src.top + src.height / 2);
        const options = item.options || {};

        return {
          id: id,
          text: options.text || item.sourceEl.textContent.trim(),
          startX: src.left + src.width / 2,
          startY: src.top + src.height / 2,
          dx: dx,
          dy: dy,
          animating: false,
          colorClass: options.colorClass || "",
        };
      });

      const cloneIds = newClones.map((c) => c.id);

      setFlyClones((prev) => prev.concat(newClones));

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setFlyClones((prev) =>
            prev.map((c) =>
              cloneIds.indexOf(c.id) !== -1 ? { ...c, animating: true } : c,
            ),
          );
        });
      });

      setTimeout(() => {
        setFlyClones((prev) =>
          prev.filter((c) => cloneIds.indexOf(c.id) === -1),
        );
        resolve();
      }, 780);
    });
  },

  flyFromCenter: (text, targetEl, options, setFlyClones) => {
    return new Promise((resolve) => {
      if (!targetEl) {
        resolve();
        return;
      }
      const id = "fly-" + Date.now() + "-" + Math.random();
      const tgt = targetEl.getBoundingClientRect();
      const startX = window.innerWidth / 2;
      const startY = window.innerHeight * 0.12;
      const dx = tgt.left + tgt.width / 2 - startX;
      const dy = tgt.top + tgt.height / 2 - startY;

      setFlyClones((prev) =>
        prev.concat([
          {
            id: id,
            text: text,
            startX: startX,
            startY: startY,
            dx: dx,
            dy: dy,
            animating: false,
            colorClass: options.colorClass || "",
          },
        ]),
      );

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setFlyClones((prev) =>
            prev.map((c) => (c.id === id ? { ...c, animating: true } : c)),
          );
        });
      });

      setTimeout(() => {
        setFlyClones((prev) => prev.filter((c) => c.id !== id));
        resolve();
      }, 780);
    });
  },

  createElementFlyClonesParallel: (items, setFlyClones) => {
    return new Promise((resolve) => {
      const valid = items.filter((item) => item.sourceEl && item.targetEl);
      if (valid.length === 0) {
        resolve();
        return;
      }

      const newClones = valid.map((item, idx) => {
        const id = "fly-el-" + Date.now() + "-" + idx + "-" + Math.random();
        const src = item.sourceEl.getBoundingClientRect();
        const tgt = item.targetEl.getBoundingClientRect();
        const options = item.options || {};
        const computed = window.getComputedStyle(item.sourceEl);
        const isTitle = options.kind === "title";

        return {
          id: id,
          mode: isTitle ? "text" : "element",
          text:
            options.text != null
              ? options.text
              : item.sourceEl.textContent.trim(),
          startX: isTitle ? src.left + src.width / 2 : src.left,
          startY: isTitle ? src.top + src.height / 2 : src.top,
          width: src.width,
          height: src.height,
          targetWidth: tgt.width,
          targetHeight: tgt.height,
          dx: isTitle
            ? tgt.left + tgt.width / 2 - (src.left + src.width / 2)
            : tgt.left - src.left,
          dy: isTitle
            ? tgt.top + tgt.height / 2 - (src.top + src.height / 2)
            : tgt.top - src.top,
          backgroundColor: computed.backgroundColor,
          border: computed.border,
          borderRadius: computed.borderRadius,
          color: computed.color,
          fontSize: computed.fontSize,
          fontWeight: computed.fontWeight,
          textAlign: computed.textAlign,
          animating: false,
          colorClass: options.colorClass || "",
        };
      });

      const cloneIds = newClones.map((c) => c.id);

      setFlyClones((prev) => prev.concat(newClones));

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setFlyClones((prev) =>
            prev.map((c) =>
              cloneIds.indexOf(c.id) !== -1 ? { ...c, animating: true } : c,
            ),
          );
        });
      });

      setTimeout(() => {
        setFlyClones((prev) =>
          prev.filter((c) => cloneIds.indexOf(c.id) === -1),
        );
        resolve();
      }, 820);
    });
  },

  runPanelElementTransfer: (items, options) => {
    const duration = options.duration != null ? options.duration : 900;
    const holdMs = options.holdMs != null ? options.holdMs : 1000;
    const easing = "cubic-bezier(0.4, 0, 0.2, 1)";
    const transitionProps =
      "left " +
      duration +
      "ms " +
      easing +
      ", top " +
      duration +
      "ms " +
      easing +
      ", width " +
      duration +
      "ms " +
      easing +
      ", height " +
      duration +
      "ms " +
      easing +
      ", font-size " +
      duration +
      "ms " +
      easing +
      ", color " +
      duration +
      "ms " +
      easing +
      ", background-color " +
      duration +
      "ms " +
      easing +
      ", border-color " +
      duration +
      "ms " +
      easing +
      ", border-width " +
      duration +
      "ms " +
      easing +
      ", padding " +
      duration +
      "ms " +
      easing;

    const getTextStyleEl = (rootEl, kind) => {
      if (kind === "formula") {
        return (
          rootEl.querySelector(".math-formula-eq-inner") ||
          rootEl.querySelector(".math-formula-eq") ||
          rootEl
        );
      }
      return rootEl;
    };

    return new Promise((resolve) => {
      const valid = items.filter((item) => item.sourceEl && item.targetEl);
      if (valid.length === 0) {
        resolve();
        return;
      }

      const clones = valid.map((item) => {
        const sourceEl = item.sourceEl;
        const targetEl = item.targetEl;
        const src = sourceEl.getBoundingClientRect();
        const srcStyle = window.getComputedStyle(sourceEl);
        const opts = item.options || {};
        const isTitle = opts.kind === "title";
        const textStyleEl = getTextStyleEl(sourceEl, opts.kind);
        const textStyle = window.getComputedStyle(textStyleEl);

        const el = document.createElement("div");
        el.className = "fly-clone-imperative";
        el.textContent =
          opts.text != null ? opts.text : sourceEl.textContent.trim();

        el.style.position = "fixed";
        el.style.left = src.left + "px";
        el.style.top = src.top + "px";
        el.style.width = src.width + "px";
        el.style.height = src.height + "px";
        el.style.zIndex = "10001";
        el.style.margin = "0";
        el.style.boxSizing = "border-box";
        el.style.pointerEvents = "none";
        el.style.overflow = "hidden";
        el.style.transition = "none";
        el.style.transform = "none";
        el.style.display = isTitle ? "block" : "flex";
        el.style.alignItems = "center";
        el.style.justifyContent = "center";
        el.style.textAlign = "center";
        el.style.whiteSpace = isTitle ? "normal" : "nowrap";
        el.style.padding = srcStyle.padding;
        el.style.backgroundColor = isTitle
          ? "transparent"
          : srcStyle.backgroundColor;
        el.style.border = isTitle ? "none" : srcStyle.border;
        el.style.borderRadius = srcStyle.borderRadius;
        el.style.color =
          opts.kind === "formula" ? textStyle.color : srcStyle.color;
        el.style.fontSize =
          opts.kind === "formula" ? textStyle.fontSize : srcStyle.fontSize;
        el.style.fontWeight =
          opts.kind === "formula" ? textStyle.fontWeight : srcStyle.fontWeight;
        el.style.fontFamily =
          opts.kind === "formula" ? textStyle.fontFamily : srcStyle.fontFamily;
        el.style.lineHeight =
          opts.kind === "formula" ? textStyle.lineHeight : srcStyle.lineHeight;
        el.style.letterSpacing = srcStyle.letterSpacing;
        el.style.boxShadow = isTitle ? "none" : srcStyle.boxShadow;

        document.body.appendChild(el);

        return {
          el,
          sourceEl,
          targetEl,
          prevVisibility: sourceEl.style.visibility,
          opts,
        };
      });

      clones.forEach((clone) => {
        clone.sourceEl.style.visibility = "hidden";
      });

      if (typeof options.onClonesPlaced === "function") {
        options.onClonesPlaced();
      }

      setTimeout(() => {
        clones.forEach((clone) => {
          const tgt = clone.targetEl.getBoundingClientRect();
          const tgtStyle = window.getComputedStyle(clone.targetEl);
          const tgtTextStyle = window.getComputedStyle(
            getTextStyleEl(clone.targetEl, clone.opts.kind),
          );
          const el = clone.el;

          el.style.transition = transitionProps;
          void el.offsetWidth;

          el.style.left = tgt.left + "px";
          el.style.top = tgt.top + "px";
          el.style.width = tgt.width + "px";
          el.style.height = tgt.height + "px";
          el.style.fontSize =
            clone.opts.kind === "formula"
              ? tgtTextStyle.fontSize
              : tgtStyle.fontSize;
          el.style.padding = tgtStyle.padding;

          if (clone.opts.kind === "formula") {
            el.style.backgroundColor = tgtStyle.backgroundColor;
            el.style.border = tgtStyle.border;
            el.style.color = tgtTextStyle.color;
            el.style.fontWeight = tgtTextStyle.fontWeight;
            el.style.fontFamily = tgtTextStyle.fontFamily;
            el.style.boxShadow = tgtStyle.boxShadow;
          }
        });

        setTimeout(() => {
          clones.forEach((clone) => {
            if (clone.el.parentNode) {
              clone.el.parentNode.removeChild(clone.el);
            }
            clone.sourceEl.style.visibility = clone.prevVisibility;
          });
          resolve();
        }, duration + 60);
      }, holdMs);
    });
  },
};
