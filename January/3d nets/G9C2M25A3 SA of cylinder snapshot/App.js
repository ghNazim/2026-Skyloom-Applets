const App = () => {
  const { useState, useRef } = React;

  // ---- Core state ----
  const [selectedButton, setSelectedButton] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [questionText, setQuestionText] = useState(APP_DATA.initial.q);
  const [unfoldValue, setUnfoldValue] = useState(0);

  // ---- Visual flags for CylinderVisual ----
  const [showHeightArrow, setShowHeightArrow] = useState(false);
  const [showWidthArrow, setShowWidthArrow] = useState(false);
  const [showLateralLabel, setShowLateralLabel] = useState(false);
  const [showCurvedAreaLabel, setShowCurvedAreaLabel] = useState(false);
  const [showBaseLabel, setShowBaseLabel] = useState(false);
  const [showBaseAreaLabel, setShowBaseAreaLabel] = useState(false);
  const [dehighlightBases, setDehighlightBases] = useState(false);
  const [dehighlightSurface, setDehighlightSurface] = useState(false);

  // ---- Formula rows: [{ parts: string[], color: string }] ----
  const [formulaRows, setFormulaRows] = useState([]);

  // ---- Text boxes ----
  const [lateralTextChars, setLateralTextChars] = useState(0);
  const [totalTextChars, setTotalTextChars] = useState(0);
  const [showLateralText, setShowLateralText] = useState(false);
  const [showTotalText, setShowTotalText] = useState(false);

  // ---- Refs for animation guard ----
  const timelineRef = useRef(null);
  const isAnimatingRef = useRef(false);
  const selectedButtonRef = useRef(null);

  // ==================================================================
  // RESET: fold immediately, clear all visual state
  // ==================================================================
  const resetAll = () => {
    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }
    setUnfoldValue(0);
    setShowHeightArrow(false);
    setShowWidthArrow(false);
    setShowLateralLabel(false);
    setShowCurvedAreaLabel(false);
    setShowBaseLabel(false);
    setShowBaseAreaLabel(false);
    setDehighlightBases(false);
    setDehighlightSurface(false);
    setFormulaRows([]);
    setLateralTextChars(0);
    setTotalTextChars(0);
    setShowLateralText(false);
    setShowTotalText(false);
    setQuestionText(APP_DATA.initial.q);
  };

  // ==================================================================
  // HELPER: Add formula parts to gsap timeline (0.7s per part)
  // ==================================================================
  const addFormulaParts = (tl, parts, color) => {
    parts.forEach((part, i) => {
      if (i > 0) tl.to({}, { duration: 0.7 });
      tl.call(() => {
        setFormulaRows((prev) => {
          const rows = prev.map((r) => ({ ...r, parts: [...r.parts] }));
          if (i === 0) {
            rows.push({ parts: [part], color });
          } else if (rows.length > 0) {
            rows[rows.length - 1].parts.push(part);
          }
          return rows;
        });
      });
    });
  };

  // ==================================================================
  // HELPER: Add character-by-character text to timeline (30ms per char)
  // ==================================================================
  const addCharByChar = (tl, setChars, setShow, textLength) => {
    tl.call(() => setShow(true));
    for (let i = 1; i <= textLength; i++) {
      tl.to({}, { duration: 0.03 });
      tl.call(() => setChars(i));
    }
  };

  // ==================================================================
  // LATERAL SURFACE AREA ANIMATION
  // ==================================================================
  const runLateralAnimation = () => {
    const tl = gsap.timeline({
      onComplete: () => {
        isAnimatingRef.current = false;
        setIsAnimating(false);
      },
    });
    timelineRef.current = tl;

    const unfoldObj = { value: 0 };

    // ---- Step 1: Unfold + labels + dehighlight bases ----
    tl.call(() =>
      setQuestionText(APP_DATA.questionTexts.lateral.unfold)
    );

    tl.to(unfoldObj, {
      value: 1,
      duration: 2,
      ease: "power2.inOut",
      onUpdate: () => setUnfoldValue(unfoldObj.value),
    });

    // Wait 1s after unfold
    tl.to({}, { duration: 1 });

    // After unfold: show dimension labels, dehighlight bases
    tl.call(() => {
      setShowHeightArrow(true);
      setShowWidthArrow(true);
      setShowLateralLabel(true);
      setShowCurvedAreaLabel(true);
      setDehighlightBases(true);
    });

    // Wait 1s
    tl.to({}, { duration: 1 });

    // ---- Step 2: Formula parts (color = curved surface color) ----
    const lateralParts = [
      "LSA  = ",
      " 1 ",
      " \u00D7 ",
      " h ",
      " \u00D7 ",
      " 2\u03C0r ",
      " =  2\u03C0rh",
    ];
    addFormulaParts(tl, lateralParts, "#fab868");

    // Wait 1s
    tl.to({}, { duration: 1 });

    // ---- Step 3: Textbox character by character ----
    addCharByChar(
      tl,
      setLateralTextChars,
      setShowLateralText,
      APP_DATA.textboxes.lateral.length
    );
  };

  // ==================================================================
  // TOTAL SURFACE AREA ANIMATION
  // ==================================================================
  const runTotalAnimation = () => {
    const tl = gsap.timeline({
      onComplete: () => {
        isAnimatingRef.current = false;
        setIsAnimating(false);
      },
    });
    timelineRef.current = tl;

    const unfoldObj = { value: 0 };

    // ---- Step 1: Unfold + base labels + dehighlight surface ----
    tl.call(() =>
      setQuestionText(APP_DATA.questionTexts.total.unfold)
    );

    tl.to(unfoldObj, {
      value: 1,
      duration: 2,
      ease: "power2.inOut",
      onUpdate: () => setUnfoldValue(unfoldObj.value),
    });

    // Wait 1s after unfold
    tl.to({}, { duration: 1 });

    // After unfold: show base labels, dehighlight curved surface
    tl.call(() => {
      setShowBaseLabel(true);
      setShowBaseAreaLabel(true);
      setDehighlightSurface(true);
    });

    // Wait 1s
    tl.to({}, { duration: 1 });

    // ---- Step 2: BA formula (color = base/flap color) ----
    tl.call(() =>
      setQuestionText(APP_DATA.questionTexts.total.baseArea)
    );

    const baParts = [
      "Base Area (BA)  = ",
      " 2 ",
      " \u00D7 ",
      " \u03C0r\u00B2 ",
      " =  2\u03C0r\u00B2",
    ];
    addFormulaParts(tl, baParts, "#f87171");

    // Wait 1s
    tl.to({}, { duration: 1 });

    // ---- Step 3: Switch to LSA view ----
    tl.call(() => {
      setQuestionText(APP_DATA.questionTexts.total.lsa);
      // Hide base labels
      setShowBaseLabel(false);
      setShowBaseAreaLabel(false);
      setDehighlightSurface(false);
      // Show lateral labels + dehighlight bases
      setDehighlightBases(true);
      setShowHeightArrow(true);
      setShowWidthArrow(true);
      setShowLateralLabel(true);
      setShowCurvedAreaLabel(true);
    });

    // Wait 1s
    tl.to({}, { duration: 1 });

    // ---- Step 4: LSA formula (color = curved surface color) ----
    const lsaParts = [
      "LSA  = ",
      " 1 ",
      " \u00D7 ",
      " h ",
      " \u00D7 ",
      " 2\u03C0r ",
      " =  2\u03C0rh",
    ];
    addFormulaParts(tl, lsaParts, "#fab868");

    // Wait 1s
    tl.to({}, { duration: 1 });

    // ---- Step 5: Highlight all surfaces + show all labels ----
    tl.call(() => {
      setQuestionText(APP_DATA.questionTexts.total.tsa);
      // Full opacity on everything
      setDehighlightBases(false);
      setDehighlightSurface(false);
      // Show base labels back (lateral labels already visible)
      setShowBaseLabel(true);
      setShowBaseAreaLabel(true);
    });

    // Wait 1s
    tl.to({}, { duration: 1 });

    // ---- Step 6: Replace formulas with TSA ----
    tl.call(() => setFormulaRows([]));
    tl.to({}, { duration: 1 });

    const tsa1Parts = ["TSA  = ", " LSA ", " + ", " BA"];
    addFormulaParts(tl, tsa1Parts, "#ffffff");

    tl.to({}, { duration: 1 });

    const tsa2Parts = [
      "TSA  = ",
      " 2\u03C0rh ",
      " + ",
      " 2\u03C0r\u00B2 ",
      " =  2\u03C0r ( h + r )",
    ];
    addFormulaParts(tl, tsa2Parts, "#ffffff");

    // Wait 1s
    tl.to({}, { duration: 1 });

    // ---- Step 7: Textbox character by character ----
    addCharByChar(
      tl,
      setTotalTextChars,
      setShowTotalText,
      APP_DATA.textboxes.total.length
    );
  };

  // ==================================================================
  // BUTTON HANDLERS
  // ==================================================================
  const handleLateralClick = () => {
    if (isAnimatingRef.current || selectedButtonRef.current === "lateral")
      return;
    if (typeof playSound === "function") playSound("click");

    resetAll();
    selectedButtonRef.current = "lateral";
    setSelectedButton("lateral");
    isAnimatingRef.current = true;
    setIsAnimating(true);

    // Delay to ensure React applies reset state before animation starts
    setTimeout(() => runLateralAnimation(), 50);
  };

  const handleTotalClick = () => {
    if (isAnimatingRef.current || selectedButtonRef.current === "total")
      return;
    if (typeof playSound === "function") playSound("click");

    resetAll();
    selectedButtonRef.current = "total";
    setSelectedButton("total");
    isAnimatingRef.current = true;
    setIsAnimating(true);

    setTimeout(() => runTotalAnimation(), 50);
  };

  // ==================================================================
  // RENDER
  // ==================================================================
  return React.createElement(
    "div",
    { className: "applet-container" },

    // Question Panel
    React.createElement(QuestionPanel, { text: questionText }),

    // Main Content
    React.createElement(
      "div",
      { className: "app-main-content" },
      React.createElement(MainCanvas, {
        selectedButton,
        isAnimating,
        onLateralClick: handleLateralClick,
        onTotalClick: handleTotalClick,
        unfoldValue,
        showHeightArrow,
        showWidthArrow,
        showLateralLabel,
        showCurvedAreaLabel,
        showBaseLabel,
        showBaseAreaLabel,
        dehighlightBases,
        dehighlightSurface,
        formulaRows,
        showLateralText,
        lateralTextChars,
        showTotalText,
        totalTextChars,
      })
    ),

    // Navigation (text only)
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        navText: APP_DATA.initial.n,
      })
    )
  );
};
