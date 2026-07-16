const getMainCanvasSnapshot = (step) => {
  const base = {
    showPinkPoint: false,
    showPinkLabel: false,
    showHorizontalLine: false,
    showVerticalLine: false,
    showLabelA: false,
    showLabelB: false,
    imageLabelMode: "hidden",
    showYellowPoint: false,
    showHypotenuseArrow: false,
    arrowLineDrawing: false,
    arrowGrowProgress: 0,
    arrowHeadVisible: false,
    arrowGlow: false,
    formulaSlotsVisible: false,
    showEquationPrompt: false,
    equationPromptFading: false,
    showFormulaBox: false,
    formulaRevealed: {},
    formulaWords: {},
    formulaMorph: {},
    morphWidths: {},
    formulaTwoLine: false,
    formulaThreeLine: false,
    formulaLine1Grey: false,
    formulaLine1Shifted: false,
    formulaLine2Grey: false,
    formulaLine2Shifted: false,
    formulaLine2: {},
    formulaLine3: {},
    highlightTopTerm: null,
    highlightLine2Term: null,
    formulaLine1Hidden: false,
    formulaLine2Hidden: false,
    svgDimmed: false,
    blinkTranslationLines: false,
    highlightPPrimeLabel: false,
    blinkPPrimeLabel: false,
    highlightPLabel: false,
    blinkPLabel: false,
    step4FormulaDone: false,
    step5FormulaDone: false,
    step6FormulaDone: false,
    hideSidePreimage: false,
    hideSideTranslation: false,
    hideSideImage: false,
    flyClones: [],
    localAnimating: false,
  };

  if (step >= 2) {
    base.showPinkPoint = true;
    base.showPinkLabel = true;
    base.hideSidePreimage = true;
  }

  if (step >= 3) {
    base.showHorizontalLine = true;
    base.showVerticalLine = true;
    base.showLabelA = true;
    base.showLabelB = true;
    base.hideSideTranslation = true;
  }

  if (step >= 4) {
    base.imageLabelMode = "formula";
    base.showYellowPoint = true;
    base.showHypotenuseArrow = true;
    base.arrowLineDrawing = true;
    base.arrowGrowProgress = 1;
    base.arrowHeadVisible = true;
    base.arrowGlow = true;
    base.formulaSlotsVisible = true;
    base.hideSideImage = true;
  }

  if (step === 4) {
    base.showEquationPrompt = true;
  }

  if (step >= 5) {
    base.showFormulaBox = true;
    base.formulaRevealed = {
      image: true,
      equals: true,
      preimage: true,
      plus: true,
      translation: true,
    };
    base.formulaWords = {
      image: true,
      preimage: true,
      translation: true,
    };
    base.formulaMorph = {
      image: "done",
      preimage: "done",
      translation: "done",
    };
    base.step4FormulaDone = true;
  }

  if (step >= 6) {
    base.formulaTwoLine = true;
    base.formulaLine1Grey = true;
    base.formulaLine1Shifted = true;
    base.formulaLine1Hidden = true;
    base.formulaLine2 = {
      translation: true,
      equals: true,
      image: true,
      minus: true,
      preimage: true,
    };
    base.step5FormulaDone = true;
  }

  return base;
};

const MainCanvas = (props) => {
  const { useState, useRef, useEffect, useCallback } = React;
  const { step, onAnimatingChange, onStepComplete, onStep6Complete } = props;
  const snapshot = getMainCanvasSnapshot(step);

  const [showPinkPoint, setShowPinkPoint] = useState(snapshot.showPinkPoint);
  const [showPinkLabel, setShowPinkLabel] = useState(snapshot.showPinkLabel);
  const [showHorizontalLine, setShowHorizontalLine] = useState(snapshot.showHorizontalLine);
  const [showVerticalLine, setShowVerticalLine] = useState(snapshot.showVerticalLine);
  const [showLabelA, setShowLabelA] = useState(snapshot.showLabelA);
  const [showLabelB, setShowLabelB] = useState(snapshot.showLabelB);
  const [imageLabelMode, setImageLabelMode] = useState(snapshot.imageLabelMode);
  const [showYellowPoint, setShowYellowPoint] = useState(snapshot.showYellowPoint);
  const [showHypotenuseArrow, setShowHypotenuseArrow] = useState(snapshot.showHypotenuseArrow);
  const [arrowLineDrawing, setArrowLineDrawing] = useState(snapshot.arrowLineDrawing);
  const [arrowGrowProgress, setArrowGrowProgress] = useState(snapshot.arrowGrowProgress);
  const [arrowHeadVisible, setArrowHeadVisible] = useState(snapshot.arrowHeadVisible);
  const [arrowGlow, setArrowGlow] = useState(snapshot.arrowGlow);
  const [formulaSlotsVisible, setFormulaSlotsVisible] = useState(snapshot.formulaSlotsVisible);

  const [showEquationPrompt, setShowEquationPrompt] = useState(snapshot.showEquationPrompt);
  const [equationPromptFading, setEquationPromptFading] = useState(snapshot.equationPromptFading);
  const [showFormulaBox, setShowFormulaBox] = useState(snapshot.showFormulaBox);
  const [formulaRevealed, setFormulaRevealed] = useState(snapshot.formulaRevealed);
  const [formulaWords, setFormulaWords] = useState(snapshot.formulaWords);
  const [formulaMorph, setFormulaMorph] = useState(snapshot.formulaMorph);
  const [morphWidths, setMorphWidths] = useState(snapshot.morphWidths);
  const [formulaTwoLine, setFormulaTwoLine] = useState(snapshot.formulaTwoLine);
  const [formulaThreeLine, setFormulaThreeLine] = useState(snapshot.formulaThreeLine);
  const [formulaLine1Grey, setFormulaLine1Grey] = useState(snapshot.formulaLine1Grey);
  const [formulaLine1Shifted, setFormulaLine1Shifted] = useState(snapshot.formulaLine1Shifted);
  const [formulaLine2Grey, setFormulaLine2Grey] = useState(snapshot.formulaLine2Grey);
  const [formulaLine2Shifted, setFormulaLine2Shifted] = useState(snapshot.formulaLine2Shifted);
  const [formulaLine2, setFormulaLine2] = useState(snapshot.formulaLine2);
  const [formulaLine3, setFormulaLine3] = useState(snapshot.formulaLine3);
  const [highlightTopTerm, setHighlightTopTerm] = useState(snapshot.highlightTopTerm);
  const [highlightLine2Term, setHighlightLine2Term] = useState(snapshot.highlightLine2Term);
  const [formulaLine1Hidden, setFormulaLine1Hidden] = useState(snapshot.formulaLine1Hidden);
  const [formulaLine2Hidden, setFormulaLine2Hidden] = useState(snapshot.formulaLine2Hidden);
  const [svgDimmed, setSvgDimmed] = useState(snapshot.svgDimmed);
  const [blinkTranslationLines, setBlinkTranslationLines] = useState(snapshot.blinkTranslationLines);
  const [highlightPPrimeLabel, setHighlightPPrimeLabel] = useState(snapshot.highlightPPrimeLabel);
  const [blinkPPrimeLabel, setBlinkPPrimeLabel] = useState(snapshot.blinkPPrimeLabel);
  const [highlightPLabel, setHighlightPLabel] = useState(snapshot.highlightPLabel);
  const [blinkPLabel, setBlinkPLabel] = useState(snapshot.blinkPLabel);
  const [step4FormulaDone, setStep4FormulaDone] = useState(snapshot.step4FormulaDone);
  const [step5FormulaDone, setStep5FormulaDone] = useState(snapshot.step5FormulaDone);
  const [step6FormulaDone, setStep6FormulaDone] = useState(snapshot.step6FormulaDone);

  const [hideSidePreimage, setHideSidePreimage] = useState(snapshot.hideSidePreimage);
  const [hideSideTranslation, setHideSideTranslation] = useState(snapshot.hideSideTranslation);
  const [hideSideImage, setHideSideImage] = useState(snapshot.hideSideImage);
  const [flyClones, setFlyClones] = useState(snapshot.flyClones);
  const [localAnimating, setLocalAnimating] = useState(snapshot.localAnimating);

  const preimageTextRef = useRef(null);
  const translationTextRef = useRef(null);
  const imageTextRef = useRef(null);
  const pLabelRef = useRef(null);
  const pPrimeLabelRef = useRef(null);
  const labelARef = useRef(null);
  const labelBRef = useRef(null);
  const pLabelFlyTargetRef = useRef(null);
  const pPrimeFlyTargetRef = useRef(null);
  const labelAFlyTargetRef = useRef(null);
  const labelBFlyTargetRef = useRef(null);
  const pPrimeSlotXRef = useRef(null);
  const pPrimeSlotYRef = useRef(null);
  const pPrimeSlotARef = useRef(null);
  const pPrimeSlotBRef = useRef(null);
  const pPrimeSlotPlus1Ref = useRef(null);
  const pPrimeSlotPlus2Ref = useRef(null);
  const pPrimeCoordsRef = useRef(null);
  const pCoordsRef = useRef(null);
  const slotImageCoordsRef = useRef(null);
  const slotEqualsRef = useRef(null);
  const slotPreimageCoordsRef = useRef(null);
  const slotPlusRef = useRef(null);
  const slotOpenParenRef = useRef(null);
  const slotARef = useRef(null);
  const slotCommaRef = useRef(null);
  const slotBRef = useRef(null);
  const slotCloseParenRef = useRef(null);
  const slotImageWordRef = useRef(null);
  const slotPreimageWordRef = useRef(null);
  const slotTranslationWordRef = useRef(null);
  const slotTransMorphRef = useRef(null);
  const line2TranslationRef = useRef(null);
  const line2EqualsRef = useRef(null);
  const line2ImageRef = useRef(null);
  const line2PreimageRef = useRef(null);
  const line3PreimageRef = useRef(null);
  const line3EqualsRef = useRef(null);
  const line3ImageRef = useRef(null);
  const line3TranslationRef = useRef(null);
  const animLockRef = useRef(false);

  const FLY_DURATION = 1000;
  const STEP_DELAY = 700;
  const MORPH_FADE_OUT = 550;
  const MORPH_RESIZE = 800;
  const MORPH_FADE_IN = 550;
  const MORPH_BETWEEN = 600;
  const STEP5_HIGHLIGHT_PAUSE = 1000;
  const STEP5_FLY_DURATION = 1200;
  const STEP5_TERM_PAUSE = 700;
  const STEP5_LINE1_EXIT = 650;

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const ARROW_GROW_DURATION = 1000;

  const animateArrowGrow = useCallback(() => {
    return new Promise((resolve) => {
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - start) / ARROW_GROW_DURATION);
        const eased = 1 - Math.pow(1 - t, 3);
        setArrowGrowProgress(eased);
        if (t < 1) {
          requestAnimationFrame(tick);
        } else {
          setArrowGrowProgress(1);
          resolve();
        }
      };
      setArrowGrowProgress(0);
      requestAnimationFrame(tick);
    });
  }, []);

  const buildImageCoordsClone = () => {
    const lbl = APP_DATA.svgLabels;
    return React.createElement(
      "span",
      null,
      React.createElement("span", { className: "color-blue" }, lbl.openParen),
      React.createElement("span", { className: "color-pink math-var" }, lbl.x),
      React.createElement("span", { className: "color-white" }, lbl.plus),
      React.createElement("span", { className: "color-yellow" }, lbl.a),
      React.createElement("span", { className: "color-blue" }, lbl.comma + "\u00A0"),
      React.createElement("span", { className: "color-pink math-var" }, lbl.y),
      React.createElement("span", { className: "color-white" }, lbl.plus),
      React.createElement("span", { className: "color-yellow" }, lbl.b),
      React.createElement("span", { className: "color-blue" }, lbl.closeParen),
    );
  };

  const buildPreimageCoordsClone = () => {
    const lbl = APP_DATA.svgLabels;
    return React.createElement(
      "span",
      null,
      React.createElement("span", { className: "color-pink" }, lbl.openParen),
      React.createElement("span", { className: "color-pink math-var" }, lbl.x),
      React.createElement("span", { className: "color-pink" }, lbl.comma + "\u00A0"),
      React.createElement("span", { className: "color-pink math-var" }, lbl.y),
      React.createElement("span", { className: "color-pink" }, lbl.closeParen),
    );
  };

  const buildPreimageSideText = () =>
    React.createElement(
      React.Fragment,
      null,
      React.createElement("span", null, "P ("),
      React.createElement("span", { className: "math-var" }, APP_DATA.svgLabels.x),
      React.createElement("span", null, ",\u00A0"),
      React.createElement("span", { className: "math-var" }, APP_DATA.svgLabels.y),
      React.createElement("span", null, ")"),
    );

  const morphWord = useCallback(
    async (key, wordRef) => {
      setFormulaMorph((m) => ({ ...m, [key]: "fadeOut" }));
      await delay(MORPH_FADE_OUT);

      const wordEl = wordRef.current;
      if (wordEl) {
        const w = wordEl.getBoundingClientRect().width;
        setMorphWidths((prev) => ({ ...prev, [key]: w }));
      }

      setFormulaMorph((m) => ({ ...m, [key]: "resize" }));
      setFormulaRevealed((r) => ({ ...r, [key]: false }));
      await delay(MORPH_RESIZE);

      setFormulaWords((w) => ({ ...w, [key]: true }));
      setFormulaMorph((m) => ({ ...m, [key]: "fadeIn" }));
      await delay(MORPH_FADE_IN);

      setFormulaMorph((m) => ({ ...m, [key]: "done" }));
      await delay(MORPH_BETWEEN);
    },
    [MORPH_FADE_OUT, MORPH_RESIZE, MORPH_FADE_IN, MORPH_BETWEEN],
  );

  const setAnimating = useCallback(
    (val) => {
      setLocalAnimating(val);
      if (typeof onAnimatingChange === "function") onAnimatingChange(val);
    },
    [onAnimatingChange],
  );

  const getCharEl = (containerRef, char) => {
    if (!containerRef || !containerRef.current) return null;
    return containerRef.current.querySelector('[data-char="' + char + '"]');
  };

  const isSvgElement = (el) =>
    !!(el && (el.ownerSVGElement || (el.closest && el.closest("svg"))));

  const flyClone = useCallback((sourceEl, targetEl, content, duration) => {
    const flyMs = duration != null ? duration : FLY_DURATION;
    return new Promise((resolve) => {
      if (!sourceEl || !targetEl) {
        resolve();
        return;
      }

      const src = sourceEl.getBoundingClientRect();
      const tgt = targetEl.getBoundingClientRect();
      if (!src.width && !src.height) {
        resolve();
        return;
      }

      const computed = window.getComputedStyle(sourceEl);
      const fromSvg = isSvgElement(sourceEl);
      const fontSize = fromSvg
        ? Math.max(src.height, 12) + "px"
        : computed.fontSize;

      const startX = src.left + src.width / 2;
      const startY = src.top + src.height / 2;
      const dx = tgt.left + tgt.width / 2 - startX;
      const dy = tgt.top + tgt.height / 2 - startY;
      const id = "fly-" + Date.now() + "-" + Math.random();

      const clone = {
        id: id,
        content: content,
        startX: startX,
        startY: startY,
        dx: dx,
        dy: dy,
        animating: false,
        fontSize: fontSize,
        fontWeight: computed.fontWeight || "600",
        flyDuration: flyMs,
      };

      setFlyClones((prev) => [...prev, clone]);

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
      }, flyMs);
    });
  }, []);

  const handleStep4Formula = useCallback(async () => {
    animLockRef.current = true;
    setAnimating(true);
    setEquationPromptFading(true);
    await delay(450);
    setShowEquationPrompt(false);
    setShowFormulaBox(true);
    await delay(STEP_DELAY);

    await flyClone(
      pPrimeCoordsRef.current,
      slotImageCoordsRef.current,
      buildImageCoordsClone(),
    );
    setFormulaRevealed((b) => ({ ...b, image: true }));
    await delay(STEP_DELAY);

    setFormulaRevealed((b) => ({ ...b, equals: true }));
    await delay(STEP_DELAY);

    await flyClone(
      pCoordsRef.current,
      slotPreimageCoordsRef.current,
      buildPreimageCoordsClone(),
    );
    setFormulaRevealed((b) => ({ ...b, preimage: true }));
    await delay(STEP_DELAY);

    setFormulaRevealed((b) => ({ ...b, plus: true }));
    await delay(STEP_DELAY);

    await Promise.all([
      flyClone(
        labelARef.current,
        slotARef.current,
        React.createElement("span", { className: "color-yellow" }, "a"),
      ),
      flyClone(
        labelBRef.current,
        slotBRef.current,
        React.createElement("span", { className: "color-yellow" }, "b"),
      ),
    ]);
    setFormulaRevealed((b) => ({ ...b, translation: true }));
    await delay(STEP_DELAY);

    await morphWord("image", slotImageWordRef);
    await morphWord("preimage", slotPreimageWordRef);
    await morphWord("translation", slotTranslationWordRef);

    setStep4FormulaDone(true);
    await delay(1000);
    setAnimating(false);
    animLockRef.current = false;
    if (typeof onStepComplete === "function") onStepComplete(4);
  }, [setAnimating, flyClone, morphWord, onStepComplete]);

  const handleStep5Formula = useCallback(async () => {
    animLockRef.current = true;
    setAnimating(true);
    setFormulaTwoLine(true);
    setFormulaLine1Shifted(true);
    setFormulaLine1Grey(true);
    setSvgDimmed(true);
    await delay(STEP_DELAY);

    setHighlightTopTerm("translation");
    setBlinkTranslationLines(true);
    await delay(STEP5_HIGHLIGHT_PAUSE);

    await flyClone(
      slotTranslationWordRef.current,
      line2TranslationRef.current,
      React.createElement(
        "span",
        { className: "color-yellow" },
        APP_DATA.formula.translation,
      ),
      STEP5_FLY_DURATION,
    );
    setFormulaLine2((l) => ({ ...l, translation: true, equals: true }));
    setBlinkTranslationLines(false);
    setHighlightTopTerm(null);
    await delay(STEP5_TERM_PAUSE);

    setHighlightTopTerm("image");
    setHighlightPPrimeLabel(true);
    setBlinkPPrimeLabel(true);
    await delay(STEP5_HIGHLIGHT_PAUSE);

    await flyClone(
      slotImageWordRef.current,
      line2ImageRef.current,
      React.createElement(
        "span",
        { className: "color-blue" },
        APP_DATA.formula.imageCoordinates,
      ),
      STEP5_FLY_DURATION,
    );
    setFormulaLine2((l) => ({ ...l, image: true, minus: true }));
    setBlinkPPrimeLabel(false);
    setHighlightPPrimeLabel(false);
    setHighlightTopTerm(null);
    await delay(STEP5_TERM_PAUSE);

    setHighlightTopTerm("preimage");
    setHighlightPLabel(true);
    setBlinkPLabel(true);
    await delay(STEP5_HIGHLIGHT_PAUSE);

    await flyClone(
      slotPreimageWordRef.current,
      line2PreimageRef.current,
      React.createElement(
        "span",
        { className: "color-pink" },
        APP_DATA.formula.preimageCoordinates,
      ),
      STEP5_FLY_DURATION,
    );
    setFormulaLine2((l) => ({ ...l, preimage: true }));
    setBlinkPLabel(false);
    setHighlightPLabel(false);
    setHighlightTopTerm(null);
    await delay(STEP5_TERM_PAUSE);

    setFormulaLine1Hidden(true);
    await delay(STEP5_LINE1_EXIT);
    setSvgDimmed(false);

    setStep5FormulaDone(true);
    setAnimating(false);
    animLockRef.current = false;
    await delay(500);
    if (typeof onStepComplete === "function") onStepComplete(5);
  }, [setAnimating, flyClone, onStepComplete]);

  const handleStep6Formula = useCallback(async () => {
    animLockRef.current = true;
    setAnimating(true);
    setFormulaThreeLine(true);
    setFormulaLine2Grey(true);
    setFormulaLine2Shifted(true);
    setSvgDimmed(true);
    await delay(STEP_DELAY);

    setHighlightLine2Term("preimage");
    setHighlightPLabel(true);
    setBlinkPLabel(true);
    await delay(STEP5_HIGHLIGHT_PAUSE);

    await flyClone(
      line2PreimageRef.current,
      line3PreimageRef.current,
      React.createElement(
        "span",
        { className: "color-pink" },
        APP_DATA.formula.preimageCoordinates,
      ),
      STEP5_FLY_DURATION,
    );
    setFormulaLine3((l) => ({ ...l, preimage: true, equals: true }));
    setBlinkPLabel(false);
    setHighlightPLabel(false);
    setHighlightLine2Term(null);
    await delay(STEP5_TERM_PAUSE);

    setHighlightLine2Term("image");
    setHighlightPPrimeLabel(true);
    setBlinkPPrimeLabel(true);
    await delay(STEP5_HIGHLIGHT_PAUSE);

    await flyClone(
      line2ImageRef.current,
      line3ImageRef.current,
      React.createElement(
        "span",
        { className: "color-blue" },
        APP_DATA.formula.imageCoordinates,
      ),
      STEP5_FLY_DURATION,
    );
    setFormulaLine3((l) => ({ ...l, image: true, minus: true }));
    setBlinkPPrimeLabel(false);
    setHighlightPPrimeLabel(false);
    setHighlightLine2Term(null);
    await delay(STEP5_TERM_PAUSE);

    setHighlightLine2Term("translation");
    setBlinkTranslationLines(true);
    await delay(STEP5_HIGHLIGHT_PAUSE);

    await flyClone(
      line2TranslationRef.current,
      line3TranslationRef.current,
      React.createElement(
        "span",
        { className: "color-yellow" },
        APP_DATA.formula.translation,
      ),
      STEP5_FLY_DURATION,
    );
    setFormulaLine3((l) => ({ ...l, translation: true }));
    setBlinkTranslationLines(false);
    setHighlightLine2Term(null);
    await delay(STEP5_TERM_PAUSE);

    setFormulaLine2Hidden(true);
    await delay(STEP5_LINE1_EXIT);
    setSvgDimmed(false);

    setStep6FormulaDone(true);
    setAnimating(false);
    animLockRef.current = false;
    if (typeof onStep6Complete === "function") onStep6Complete();
  }, [setAnimating, flyClone, onStep6Complete]);

  const handlePreimageClick = useCallback(async () => {
    if (animLockRef.current || localAnimating) return;

    if (step === 6) {
      if (step6FormulaDone) return;
      if (typeof playSound === "function") playSound("click");
      await handleStep6Formula();
      return;
    }

    if (step !== 1) return;
    if (typeof playSound === "function") playSound("click");
    animLockRef.current = true;
    setAnimating(true);
    setHideSidePreimage(true);

    await flyClone(
      preimageTextRef.current,
      pLabelFlyTargetRef.current,
      React.createElement("span", { className: "color-pink" }, buildPreimageSideText()),
    );

    setShowPinkPoint(true);
    setShowPinkLabel(true);
    await delay(500);
    setAnimating(false);
    animLockRef.current = false;
    if (typeof onStepComplete === "function") onStepComplete(1);
  }, [step, localAnimating, setAnimating, flyClone, onStepComplete, handleStep6Formula, step6FormulaDone]);

  const handleTranslationClick = useCallback(async () => {
    if (animLockRef.current || localAnimating) return;

    if (step === 5) {
      if (typeof playSound === "function") playSound("click");
      await handleStep5Formula();
      return;
    }

    if (step !== 2) return;
    if (typeof playSound === "function") playSound("click");
    animLockRef.current = true;
    setAnimating(true);
    setHideSideTranslation(true);

    const srcA = translationTextRef.current
      ? translationTextRef.current.querySelector('[data-char="a"]')
      : null;
    const srcB = translationTextRef.current
      ? translationTextRef.current.querySelector('[data-char="b"]')
      : null;

    const flyA = flyClone(
      srcA,
      labelAFlyTargetRef.current,
      React.createElement("span", { className: "color-yellow" }, "a"),
    ).then(() => {
      setShowHorizontalLine(true);
      setShowLabelA(true);
    });

    const flyB = flyClone(
      srcB,
      labelBFlyTargetRef.current,
      React.createElement("span", { className: "color-yellow" }, "b"),
    ).then(() => {
      setShowVerticalLine(true);
      setShowLabelB(true);
    });

    await Promise.all([flyA, flyB]);
    await delay(500);
    setAnimating(false);
    animLockRef.current = false;
    if (typeof onStepComplete === "function") onStepComplete(2);
  }, [step, localAnimating, setAnimating, flyClone, onStepComplete, handleStep5Formula]);

  const handleImageClick = useCallback(async () => {
    if (localAnimating || animLockRef.current) return;
    if (typeof playSound === "function") playSound("click");

    if (step === 4) {
      if (step4FormulaDone || animLockRef.current) return;
      if (typeof playSound === "function") playSound("click");
      await handleStep4Formula();
      return;
    }

    if (step !== 3) return;

    animLockRef.current = true;
    setAnimating(true);
    setHideSideImage(true);

    await flyClone(
      imageTextRef.current,
      pPrimeFlyTargetRef.current,
      React.createElement(
        "span",
        { className: "color-blue" },
        APP_DATA.sideText.imagePlaceholder,
      ),
    );

    setImageLabelMode("placeholder");
    await delay(400);

    setImageLabelMode("formula");
    await delay(150);

    const srcX = getCharEl(pLabelRef, "x");
    const srcY = getCharEl(pLabelRef, "y");
    const srcA = labelARef.current;
    const srcB = labelBRef.current;

    await delay(50);

    await Promise.all([
      flyClone(
        srcX,
        pPrimeSlotXRef.current,
        React.createElement("span", { className: "color-pink math-var" }, "x"),
      ),
      flyClone(
        srcY,
        pPrimeSlotYRef.current,
        React.createElement("span", { className: "color-pink math-var" }, "y"),
      ),
      flyClone(
        srcA,
        pPrimeSlotARef.current,
        React.createElement("span", { className: "color-yellow" }, "a"),
      ),
      flyClone(
        srcB,
        pPrimeSlotBRef.current,
        React.createElement("span", { className: "color-yellow" }, "b"),
      ),
    ]);

    setFormulaSlotsVisible(true);
    await delay(300);

    setShowHypotenuseArrow(true);
    setShowYellowPoint(true);
    await delay(80);
    setArrowLineDrawing(true);
    setArrowGrowProgress(0);
    await delay(50);
    await animateArrowGrow();
    setArrowHeadVisible(true);
    await delay(300);
    setArrowGlow(true);
    await delay(500);

    setAnimating(false);
    animLockRef.current = false;
    if (typeof onStepComplete === "function") onStepComplete(3);
  }, [step, localAnimating, setAnimating, flyClone, onStepComplete, animateArrowGrow, handleStep4Formula, step4FormulaDone]);

  const translationDone = showHorizontalLine && showVerticalLine;

  const getButtonState = (btnIndex) => {
    const disabled =
      (step === 1 && btnIndex > 1) ||
      (step === 2 && btnIndex > 2) ||
      (step === 3 && btnIndex > 3) ||
      (step === 5 && btnIndex !== 2) ||
      (step === 6 && btnIndex !== 1) ||
      localAnimating;

    let active = false;
    let done = false;

    if (step === 1 && btnIndex === 1 && !localAnimating) active = !showPinkLabel;
    if (step === 2 && btnIndex === 2 && !localAnimating) active = !translationDone;
    if (step === 3 && btnIndex === 3 && !localAnimating) active = imageLabelMode === "hidden";
    if (step === 4 && btnIndex === 3 && !localAnimating && !step4FormulaDone)
      active = true;
    if (step === 5 && btnIndex === 2 && !localAnimating && !step5FormulaDone)
      active = true;
    if (step === 6 && btnIndex === 1 && !localAnimating && !step6FormulaDone)
      active = true;

    if (btnIndex === 1 && showPinkLabel && step !== 6) done = step >= 2;
    if (btnIndex === 2 && translationDone) done = step >= 3 && step < 5;
    if (step === 4 && btnIndex < 3) done = true;
    if (step === 5 && btnIndex === 3) done = true;
    if (step === 5 && btnIndex === 1) done = true;
    if (step === 5 && btnIndex === 2 && step5FormulaDone) done = true;
    if (step >= 6 && btnIndex === 2) done = true;
    if (step >= 6 && btnIndex === 3) done = true;
    if (step === 6 && btnIndex === 1 && step6FormulaDone) done = true;

    return { disabled, active, done };
  };

  const renderFlyClones = () =>
    flyClones.map((clone) =>
      React.createElement(
        "div",
        {
          key: clone.id,
          className: "fly-clone-overlay",
          style: {
            left: clone.startX + "px",
            top: clone.startY + "px",
            fontSize: clone.fontSize,
            fontWeight: clone.fontWeight,
            transition:
              "transform " +
              (clone.flyDuration || FLY_DURATION) +
              "ms cubic-bezier(0.4, 0, 0.2, 1)",
            transform: clone.animating
              ? "translate(calc(-50% + " +
                clone.dx +
                "px), calc(-50% + " +
                clone.dy +
                "px))"
              : "translate(-50%, -50%)",
          },
        },
        clone.content,
      ),
    );

  const renderSideText = (type, text, colorClass, hidden, btnState) => {
    const classes =
      "step-side-text " +
      colorClass +
      (btnState.disabled ? " disabled" : "") +
      (hidden ? " hidden" : "");

    const inner =
      type === "translation"
        ? React.createElement(
            React.Fragment,
            null,
            React.createElement("span", null, "("),
            React.createElement("span", { "data-char": "a" }, "a"),
            React.createElement("span", null, ", "),
            React.createElement("span", { "data-char": "b" }, "b"),
            React.createElement("span", null, ")"),
          )
        : type === "preimage"
          ? buildPreimageSideText()
        : text;

    return React.createElement(
      "span",
      {
        ref:
          type === "preimage"
            ? preimageTextRef
            : type === "translation"
              ? translationTextRef
              : imageTextRef,
        className: classes,
      },
      inner,
    );
  };

  const btn1 = getButtonState(1);
  const btn2 = getButtonState(2);
  const btn3 = getButtonState(3);

  useEffect(() => {
    if (pPrimeSlotPlus1Ref.current && formulaSlotsVisible) {
      pPrimeSlotPlus1Ref.current.classList.remove("slot-hidden");
      pPrimeSlotPlus1Ref.current.classList.add("slot-visible");
    }
    if (pPrimeSlotPlus2Ref.current && formulaSlotsVisible) {
      pPrimeSlotPlus2Ref.current.classList.remove("slot-hidden");
      pPrimeSlotPlus2Ref.current.classList.add("slot-visible");
    }
    [pPrimeSlotXRef, pPrimeSlotYRef, pPrimeSlotARef, pPrimeSlotBRef].forEach((ref) => {
      if (ref.current && formulaSlotsVisible) {
        ref.current.classList.remove("slot-hidden");
        ref.current.classList.add("slot-visible");
      }
    });
  }, [formulaSlotsVisible, imageLabelMode]);

  return React.createElement(
    "div",
    { className: "main-canvas-container" },
    step === 4 && showEquationPrompt
      ? React.createElement(
          "p",
          {
            className:
              "equation-prompt" + (equationPromptFading ? " fade-out" : ""),
          },
          APP_DATA.equationPrompt,
        )
      : null,
    React.createElement(FormulaBox, {
      visible: showFormulaBox,
      twoLine: formulaTwoLine,
      threeLine: formulaThreeLine,
      line1Grey: formulaLine1Grey,
      line1Shifted: formulaLine1Shifted,
      line2Grey: formulaLine2Grey,
      line2Shifted: formulaLine2Shifted,
      revealed: formulaRevealed,
      words: formulaWords,
      morph: formulaMorph,
      morphWidths: morphWidths,
      line2: formulaLine2,
      line3: formulaLine3,
      highlightTopTerm: highlightTopTerm,
      highlightLine2Term: highlightLine2Term,
      line1Hidden: formulaLine1Hidden,
      line2Hidden: formulaLine2Hidden,
      slotImageCoordsRef: slotImageCoordsRef,
      slotEqualsRef: slotEqualsRef,
      slotPreimageCoordsRef: slotPreimageCoordsRef,
      slotPlusRef: slotPlusRef,
      slotOpenParenRef: slotOpenParenRef,
      slotARef: slotARef,
      slotCommaRef: slotCommaRef,
      slotBRef: slotBRef,
      slotCloseParenRef: slotCloseParenRef,
      slotImageWordRef: slotImageWordRef,
      slotPreimageWordRef: slotPreimageWordRef,
      slotTranslationWordRef: slotTranslationWordRef,
      slotTransMorphRef: slotTransMorphRef,
      line2TranslationRef: line2TranslationRef,
      line2EqualsRef: line2EqualsRef,
      line2ImageRef: line2ImageRef,
      line2PreimageRef: line2PreimageRef,
      line3PreimageRef: line3PreimageRef,
      line3EqualsRef: line3EqualsRef,
      line3ImageRef: line3ImageRef,
      line3TranslationRef: line3TranslationRef,
    }),
    React.createElement(
      "div",
      { className: "main-canvas-left" },
      React.createElement(
        "div",
        { className: "step-button-row" },
        React.createElement(
          "button",
          {
            className:
              "step-btn" +
              (btn1.active ? " active" : "") +
              (btn1.done ? " done" : ""),
            disabled: btn1.disabled || btn1.done,
            id: "btn-preimage",
            onClick: handlePreimageClick,
          },
          APP_DATA.buttons.preimage,
        ),
        renderSideText(
          "preimage",
          APP_DATA.sideText.preimage,
          "color-pink",
          hideSidePreimage,
          btn1,
        ),
      ),
      React.createElement(
        "div",
        { className: "step-button-row" },
        React.createElement(
          "button",
          {
            className:
              "step-btn" +
              (btn2.active ? " active" : "") +
              (btn2.done ? " done" : ""),
            disabled: btn2.disabled || btn2.done,
            id: "btn-translation",
            onClick: handleTranslationClick,
          },
          APP_DATA.buttons.translation,
        ),
        renderSideText(
          "translation",
          APP_DATA.sideText.translation,
          "color-yellow",
          hideSideTranslation,
          btn2,
        ),
      ),
      React.createElement(
        "div",
        { className: "step-button-row" },
        React.createElement(
          "button",
          {
            className:
              "step-btn" +
              (btn3.active ? " active" : "") +
              (btn3.done ? " done" : ""),
            disabled: btn3.disabled || (btn3.done && step !== 4) || step === 5 || step >= 6,
            id: "btn-image",
            onClick: handleImageClick,
          },
          APP_DATA.buttons.image,
        ),
        renderSideText(
          "image",
          APP_DATA.sideText.imagePlaceholder,
          "color-blue",
          hideSideImage,
          btn3,
        ),
      ),
    ),
    React.createElement(
      "div",
      { className: "main-canvas-right" },
      React.createElement(TranslationDiagram, {
        showPinkPoint: showPinkPoint,
        showPinkLabel: showPinkLabel,
        showHorizontalLine: showHorizontalLine,
        showVerticalLine: showVerticalLine,
        showLabelA: showLabelA,
        showLabelB: showLabelB,
        imageLabelMode: imageLabelMode,
        showYellowPoint: showYellowPoint,
        showHypotenuseArrow: showHypotenuseArrow,
        arrowLineDrawing: arrowLineDrawing,
        arrowGrowProgress: arrowGrowProgress,
        arrowHeadVisible: arrowHeadVisible,
        arrowGlow: arrowGlow,
        svgDimmed: svgDimmed,
        highlightPPrimeLabel: highlightPPrimeLabel,
        highlightPLabel: highlightPLabel,
        blinkTranslationLines: blinkTranslationLines,
        blinkPPrimeLabel: blinkPPrimeLabel,
        blinkPLabel: blinkPLabel,
        pPrimeCoordsRef: pPrimeCoordsRef,
        pCoordsRef: pCoordsRef,
        pLabelRef: pLabelRef,
        pPrimeLabelRef: pPrimeLabelRef,
        labelARef: labelARef,
        labelBRef: labelBRef,
        pLabelFlyTargetRef: pLabelFlyTargetRef,
        pPrimeFlyTargetRef: pPrimeFlyTargetRef,
        labelAFlyTargetRef: labelAFlyTargetRef,
        labelBFlyTargetRef: labelBFlyTargetRef,
        pPrimeSlotXRef: pPrimeSlotXRef,
        pPrimeSlotYRef: pPrimeSlotYRef,
        pPrimeSlotARef: pPrimeSlotARef,
        pPrimeSlotBRef: pPrimeSlotBRef,
        pPrimeSlotPlus1Ref: pPrimeSlotPlus1Ref,
        pPrimeSlotPlus2Ref: pPrimeSlotPlus2Ref,
      }),
    ),
    renderFlyClones(),
  );
};
