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
};
