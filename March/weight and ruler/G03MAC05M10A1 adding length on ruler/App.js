const App = () => {
  const { useState, useMemo, useRef, useEffect, useCallback } = React;
  const ce = React.createElement;

  const SCREENS = [
    { kind: "start" },
    { kind: "align", activity: "glue" },
    { kind: "answer", activity: "glue" },
    { kind: "align", activity: "pencil" },
    { kind: "answer", activity: "pencil" },
    { kind: "align", activity: "total" },
    { kind: "answer", activity: "total" },
    { kind: "totalVisualize", activity: "total" },
    { kind: "end" },
  ];

  // Updated ruler SVG (15 cm scale): width 308.04, left gap 8.7, right gap 13.8.
  const RULER_SVG_WIDTH = 308.04;
  const CM_UNIT_SVG = 19.0;
  const RULER_LEFT_GAP = 8.7;
  const RULER_WIDTH_PERCENT = 90;
  const RULER_LEFT_GAP_RATIO = RULER_LEFT_GAP / RULER_SVG_WIDTH;
  const CM_WIDTH_RATIO = CM_UNIT_SVG / RULER_SVG_WIDTH;
  const SNAP_THRESHOLD_PX = 10;

  const [screenIndex, setScreenIndex] = useState(0);
  const [dragFeedbackStatus, setDragFeedbackStatus] = useState(null); // "correct" | "wrong" | null
  const [answerFeedbackStatus, setAnswerFeedbackStatus] = useState(null); // "correct" | "wrong" | null
  const [answerValue, setAnswerValue] = useState("");
  const [answerShake, setAnswerShake] = useState(false);
  /** Answer step: ruler slides down 4vw after submit (wrong / first-time correct). */
  const [answerRulerShifted, setAnswerRulerShifted] = useState(false);
  /** How many 1 cm bracket segments are visible (step animation). */
  const [bracketVisibleCount, setBracketVisibleCount] = useState(0);
  /** Bracket + label color after feedback animation. */
  const [bracketTone, setBracketTone] = useState(null); // "wrong" | "correct" | null
  /** True after user submits a wrong answer on this answer screen (skips ruler drop next time). */
  const [answerHadWrongAttempt, setAnswerHadWrongAttempt] = useState(false);
  /** Blocks numpad while ruler/bracket sequence runs. */
  const [answerMeasureAnimating, setAnswerMeasureAnimating] = useState(false);

  const [rulerLocked, setRulerLocked] = useState(false);
  const [rulerDragging, setRulerDragging] = useState(false);
  const [rulerPos, setRulerPos] = useState({ x: 0, y: 0 });

  const dragStartRef = useRef(null);
  const visualAreaRef = useRef(null);
  const firstObjectRef = useRef(null);
  const rulerRef = useRef(null);
  const nextButtonRef = useRef(null);
  const wrongAnswerTimeoutRef = useRef(null);
  const bracketAnimTimerRef = useRef(null);
  const measureSeqTimeoutRef = useRef(null);

  const vwToPx = useCallback((vw) => (window.innerWidth * vw) / 100, []);

  const currentScreen = SCREENS[screenIndex];
  const isTotalVisualizeScreen = currentScreen.kind === "totalVisualize";
  const activityData = currentScreen.activity
    ? APP_DATA.activities[currentScreen.activity]
    : null;

  const getObjectParts = useCallback((activityKey) => {
    if (activityKey === "total") {
      return [
        {
          key: "glue",
          className: "glue",
          lengthCm: APP_DATA.activities.glue.lengthCm,
        },
        {
          key: "pencil",
          className: "pencil",
          lengthCm: APP_DATA.activities.pencil.lengthCm,
        },
      ];
    }

    const single = APP_DATA.activities[activityKey];
    return [
      {
        key: activityKey,
        className: single.objectClass,
        lengthCm: single.lengthCm,
      },
    ];
  }, []);

  const objectParts = useMemo(() => {
    if (!activityData) return [];
    return getObjectParts(currentScreen.activity);
  }, [activityData, currentScreen.activity, getObjectParts]);

  const getCmWidthPx = useCallback(() => {
    if (!visualAreaRef.current) return 0;
    const visualWidth = visualAreaRef.current.getBoundingClientRect().width;
    const rulerWidthPx = visualWidth * (RULER_WIDTH_PERCENT / 100);
    return rulerWidthPx * CM_WIDTH_RATIO;
  }, [CM_WIDTH_RATIO]);

  const getTotalObjectWidthPx = useCallback(
    (parts) => {
      const cmWidthPx = getCmWidthPx();
      return parts.reduce((sum, part) => sum + part.lengthCm * cmWidthPx, 0);
    },
    [getCmWidthPx],
  );

  const isAlignScreen = currentScreen.kind === "align";
  const isAnswerScreen = currentScreen.kind === "answer";

  useEffect(() => {
    if (isAlignScreen) {
      setDragFeedbackStatus(null);
      setAnswerFeedbackStatus(null);
      setAnswerValue("");
      setAnswerShake(false);
      setRulerLocked(false);
      setRulerDragging(false);
      setRulerPos({ x: 0, y: 0 });
    }
  }, [isAlignScreen, screenIndex]);

  useEffect(() => {
    if (isAnswerScreen) {
      setAnswerFeedbackStatus(null);
      setAnswerValue("");
      setAnswerShake(false);
      setDragFeedbackStatus(null);
      setRulerLocked(true);
      setAnswerRulerShifted(false);
      setBracketVisibleCount(0);
      setBracketTone(null);
      setAnswerHadWrongAttempt(false);
      setAnswerMeasureAnimating(false);
    }
  }, [isAnswerScreen, screenIndex]);

  useEffect(() => {
    return () => {
      if (wrongAnswerTimeoutRef.current) {
        clearTimeout(wrongAnswerTimeoutRef.current);
      }
      if (bracketAnimTimerRef.current) {
        clearInterval(bracketAnimTimerRef.current);
      }
      if (measureSeqTimeoutRef.current) {
        clearTimeout(measureSeqTimeoutRef.current);
      }
    };
  }, []);

  const getRulerLeftGapPx = useCallback(() => {
    if (rulerRef.current) {
      return (
        rulerRef.current.getBoundingClientRect().width * RULER_LEFT_GAP_RATIO
      );
    }
    if (visualAreaRef.current) {
      const visualWidth = visualAreaRef.current.getBoundingClientRect().width;
      return visualWidth * (RULER_WIDTH_PERCENT / 100) * RULER_LEFT_GAP_RATIO;
    }
    return 0;
  }, [RULER_LEFT_GAP_RATIO]);

  const getRulerStyle = useCallback(() => {
    if (!visualAreaRef.current || !firstObjectRef.current) {
      return { left: "1vw", bottom: "1vw" };
    }

    if (isAnswerScreen || isTotalVisualizeScreen) {
      const visualRect = visualAreaRef.current.getBoundingClientRect();
      const objectRect = firstObjectRef.current.getBoundingClientRect();
      const leftPx = objectRect.left - visualRect.left - getRulerLeftGapPx();
      const topPx = objectRect.bottom - visualRect.top;
      return {
        left: leftPx + "px",
        top: topPx + "px",
        transform: answerRulerShifted ? "translateY(4vw)" : "translateY(0)",
        transition: "transform 0.5s ease",
      };
    }

    const hasMoved = rulerPos.x !== 0 || rulerPos.y !== 0;
    if (hasMoved) {
      return { left: rulerPos.x + "px", top: rulerPos.y + "px" };
    }
    return { left: "1vw", bottom: "1vw" };
  }, [
    answerRulerShifted,
    getRulerLeftGapPx,
    isAnswerScreen,
    isTotalVisualizeScreen,
    rulerPos,
  ]);

  const validateRulerPlacement = useCallback(() => {
    if (!visualAreaRef.current || !firstObjectRef.current || !rulerRef.current)
      return;

    const objectRect = firstObjectRef.current.getBoundingClientRect();
    const rulerRect = rulerRef.current.getBoundingClientRect();
    const zeroMarkX = rulerRect.left + getRulerLeftGapPx();
    const targetX = objectRect.left;
    const targetY = objectRect.bottom;

    const diffX = Math.abs(zeroMarkX - targetX);
    const diffY = Math.abs(rulerRect.top - targetY);

    if (diffX <= SNAP_THRESHOLD_PX && diffY <= SNAP_THRESHOLD_PX) {
      playSound("correct");
      setDragFeedbackStatus("correct");
      setRulerLocked(true);
    } else {
      playSound("wrong");
      setDragFeedbackStatus("wrong");
    }
  }, [getRulerLeftGapPx]);

  const handleDragStart = useCallback(
    (e) => {
      if (!isAlignScreen || rulerLocked) return;

      const point = e.touches ? e.touches[0] : e;
      if (dragFeedbackStatus === "wrong") {
        setDragFeedbackStatus(null);
      }

      const rulerRect = rulerRef.current.getBoundingClientRect();
      dragStartRef.current = {
        startX: point.clientX,
        startY: point.clientY,
        startLeft: rulerRect.left,
        startTop: rulerRect.top,
      };
      setRulerDragging(true);
    },
    [dragFeedbackStatus, isAlignScreen, rulerLocked],
  );

  const handleDragMove = useCallback(
    (e) => {
      if (
        !rulerDragging ||
        !dragStartRef.current ||
        !visualAreaRef.current ||
        !rulerRef.current
      )
        return;
      if (e.cancelable) e.preventDefault();

      const point = e.touches ? e.touches[0] : e;
      const visualRect = visualAreaRef.current.getBoundingClientRect();
      const rulerRect = rulerRef.current.getBoundingClientRect();
      const objectRect = firstObjectRef.current.getBoundingClientRect();

      const dx = point.clientX - dragStartRef.current.startX;
      const dy = point.clientY - dragStartRef.current.startY;

      let newLeft = dragStartRef.current.startLeft + dx - visualRect.left;
      let newTop = dragStartRef.current.startTop + dy - visualRect.top;

      const maxLeft = visualRect.width - rulerRect.width;
      if (newLeft < 0) newLeft = 0;
      if (newLeft > maxLeft) newLeft = maxLeft;

      const minTop = objectRect.bottom - visualRect.top;
      const maxTop = visualRect.height - rulerRect.height;
      if (newTop < minTop) newTop = minTop;
      if (newTop > maxTop) newTop = maxTop;

      const leftGapPx = getRulerLeftGapPx();
      const zeroMarkRelative = newLeft + leftGapPx;
      const targetX = objectRect.left - visualRect.left;
      if (Math.abs(zeroMarkRelative - targetX) <= SNAP_THRESHOLD_PX) {
        newLeft = targetX - leftGapPx;
      }

      if (Math.abs(newTop - minTop) <= SNAP_THRESHOLD_PX) {
        newTop = minTop;
      }

      setRulerPos({ x: newLeft, y: newTop });
    },
    [getRulerLeftGapPx, rulerDragging],
  );

  const handleDragEnd = useCallback(() => {
    if (!rulerDragging) return;
    setRulerDragging(false);
    dragStartRef.current = null;
    validateRulerPlacement();
  }, [rulerDragging, validateRulerPlacement]);

  useEffect(() => {
    if (!rulerDragging) return;

    const moveHandler = (e) => handleDragMove(e);
    const upHandler = () => handleDragEnd();

    window.addEventListener("mousemove", moveHandler);
    window.addEventListener("mouseup", upHandler);
    window.addEventListener("touchmove", moveHandler, { passive: false });
    window.addEventListener("touchend", upHandler);

    return () => {
      window.removeEventListener("mousemove", moveHandler);
      window.removeEventListener("mouseup", upHandler);
      window.removeEventListener("touchmove", moveHandler);
      window.removeEventListener("touchend", upHandler);
    };
  }, [handleDragEnd, handleDragMove, rulerDragging]);

  const clearBracketAnimation = useCallback(() => {
    if (bracketAnimTimerRef.current) {
      clearInterval(bracketAnimTimerRef.current);
      bracketAnimTimerRef.current = null;
    }
    if (measureSeqTimeoutRef.current) {
      clearTimeout(measureSeqTimeoutRef.current);
      measureSeqTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isTotalVisualizeScreen) return;
    clearBracketAnimation();
    setAnswerRulerShifted(false);
    setBracketVisibleCount(0);
    setBracketTone(null);
    setAnswerMeasureAnimating(false);
  }, [isTotalVisualizeScreen, screenIndex, clearBracketAnimation]);

  const beginBracketSequence = useCallback(
    (targetCm, tone) => {
      clearBracketAnimation();
      setBracketTone(tone);
      setBracketVisibleCount(0);
      let step = 0;
      bracketAnimTimerRef.current = setInterval(() => {
        step += 1;
        if (step > targetCm) {
          clearInterval(bracketAnimTimerRef.current);
          bracketAnimTimerRef.current = null;
          setAnswerMeasureAnimating(false);
          return;
        }
        playSound("tick");
        setBracketVisibleCount(step);
      }, 220);
    },
    [clearBracketAnimation],
  );

  const appendDigit = (digit) => {
    if (
      !isAnswerScreen ||
      answerFeedbackStatus === "correct" ||
      answerShake ||
      answerMeasureAnimating
    )
      return;
    if (answerFeedbackStatus === "wrong") {
      setAnswerFeedbackStatus(null);
      setAnswerValue(digit);
      return;
    }
    setAnswerValue((prev) => {
      if (prev.length >= 2) return digit;
      return prev + digit;
    });
  };

  const clearDigit = () => {
    if (
      !isAnswerScreen ||
      answerFeedbackStatus === "correct" ||
      answerShake ||
      answerMeasureAnimating
    )
      return;
    if (answerFeedbackStatus === "wrong") {
      setAnswerFeedbackStatus(null);
      setAnswerValue("");
      return;
    }
    setAnswerValue((prev) => prev.slice(0, -1));
  };

  const runWrongMeasureAnimation = (targetCm) => {
    clearBracketAnimation();
    setAnswerMeasureAnimating(true);
    const skipRulerDrop = answerRulerShifted;

    if (skipRulerDrop) {
      measureSeqTimeoutRef.current = setTimeout(() => {
        measureSeqTimeoutRef.current = null;
        beginBracketSequence(targetCm, "wrong");
      }, 50);
      return;
    }

    measureSeqTimeoutRef.current = setTimeout(() => {
      measureSeqTimeoutRef.current = null;
      setAnswerRulerShifted(true);
      measureSeqTimeoutRef.current = setTimeout(() => {
        measureSeqTimeoutRef.current = null;
        beginBracketSequence(targetCm, "wrong");
      }, 520);
    }, 500);
  };

  const runCorrectMeasureAnimation = (targetCm) => {
    clearBracketAnimation();
    setAnswerMeasureAnimating(true);
    const skipRulerDrop = answerRulerShifted;

    if (skipRulerDrop) {
      measureSeqTimeoutRef.current = setTimeout(() => {
        measureSeqTimeoutRef.current = null;
        beginBracketSequence(targetCm, "correct");
      }, 50);
      return;
    }

    measureSeqTimeoutRef.current = setTimeout(() => {
      measureSeqTimeoutRef.current = null;
      setAnswerRulerShifted(true);
      measureSeqTimeoutRef.current = setTimeout(() => {
        measureSeqTimeoutRef.current = null;
        beginBracketSequence(targetCm, "correct");
      }, 520);
    }, 0);
  };

  const submitAnswer = () => {
    if (!isAnswerScreen || answerShake || answerMeasureAnimating) return;
    if (answerFeedbackStatus === "wrong") {
      setAnswerFeedbackStatus(null);
      setAnswerValue("");
      return;
    }
    if (!activityData || !answerValue) return;

    const value = parseInt(answerValue, 10);
    const targetLen = activityData.lengthCm;

    if (value === targetLen) {
      playSound("correct");
      if (
        answerHadWrongAttempt &&
        answerRulerShifted &&
        bracketVisibleCount >= targetLen
      ) {
        setBracketTone("correct");
        setAnswerFeedbackStatus("correct");
        return;
      }
      setAnswerFeedbackStatus("correct");
      runCorrectMeasureAnimation(targetLen);
    } else {
      playSound("wrong");
      setAnswerFeedbackStatus("wrong");
      setAnswerHadWrongAttempt(true);
      setAnswerShake(true);
      if (wrongAnswerTimeoutRef.current) {
        clearTimeout(wrongAnswerTimeoutRef.current);
      }
      wrongAnswerTimeoutRef.current = setTimeout(() => {
        setAnswerShake(false);
        wrongAnswerTimeoutRef.current = null;
      }, 500);
      runWrongMeasureAnimation(targetLen);
    }
  };

  const isNextDisabled = () => {
    if (currentScreen.kind === "align") return dragFeedbackStatus !== "correct";
    if (currentScreen.kind === "totalVisualize") return false;
    if (currentScreen.kind === "answer") {
      if (answerFeedbackStatus !== "correct") return true;
      /* Correct: allow Next only after ruler + bracket animation has finished */
      if (answerMeasureAnimating) return true;
      /* Total measurement: Next opens only after "Visualize addition" step */
      if (currentScreen.activity === "total") return true;
      return false;
    }
    return true;
  };

  const getNavText = () => {
    if (!activityData) return "";
    if (currentScreen.kind === "totalVisualize") {
      return activityData.navStep2Correct;
    }
    if (currentScreen.kind === "align") {
      return dragFeedbackStatus === "correct"
        ? activityData.navStep1Correct
        : activityData.navStep1;
    }
    if (
      currentScreen.kind === "answer" &&
      currentScreen.activity === "total" &&
      answerFeedbackStatus === "correct"
    ) {
      if (answerMeasureAnimating) return "";
      return activityData.navStepBeforeVisualize;
    }
    return answerFeedbackStatus === "correct"
      ? activityData.navStep2Correct
      : activityData.navStep2;
  };

  const getCharacterText = () => {
    if (!activityData) return "";
    if (currentScreen.kind === "totalVisualize") {
      return activityData.characterTotalVisualize;
    }
    return currentScreen.kind === "align"
      ? activityData.characterStep1
      : activityData.characterStep2;
  };

  const getFeedbackText = () => {
    if (!activityData) return "";
    if (isTotalVisualizeScreen) return "";
    if (isAlignScreen) {
      if (dragFeedbackStatus === "wrong")
        return activityData.feedbackStep1Wrong;
      if (dragFeedbackStatus === "correct")
        return activityData.feedbackStep1Correct;
      return "";
    }
    if (answerFeedbackStatus === "wrong")
      return activityData.feedbackStep2Wrong;
    if (answerFeedbackStatus === "correct")
      return activityData.feedbackStep2Correct;
    return "";
  };

  const getFeedbackClass = () => {
    if (isTotalVisualizeScreen) return "";
    if (isAlignScreen) return dragFeedbackStatus || "";
    return answerFeedbackStatus || "";
  };

  const getCharacterImage = () => {
    const status = isAlignScreen
      ? dragFeedbackStatus
      : isAnswerScreen
        ? answerFeedbackStatus
        : null;

    if (isTotalVisualizeScreen) return "charhappy.png";
    if (status === "wrong") return "charsad.png";
    if (status === "correct") return "charhappy.png";
    return "chardefault.png";
  };

  const handleVisualizeAddition = useCallback(() => {
    playSound("click");
    clearBracketAnimation();
    setAnswerRulerShifted(false);
    setBracketVisibleCount(0);
    setBracketTone(null);
    setAnswerMeasureAnimating(false);
    setScreenIndex((prev) => prev + 1);
  }, [clearBracketAnimation]);

  const getAdditionEquationText = useCallback(() => {
    const a = APP_DATA.activities.glue.lengthCm;
    const b = APP_DATA.activities.pencil.lengthCm;
    const sum = APP_DATA.activities.total.lengthCm;
    return APP_DATA.activities.total.additionEquation
      .replace("{{a}}", String(a))
      .replace("{{b}}", String(b))
      .replace("{{sum}}", String(sum));
  }, []);

  const handleNavigation = (dir) => {
    playSound("click");
    if (dir === "prev") {
      if (screenIndex <= 1) return;
      setScreenIndex((prev) => prev - 1);
      return;
    }
    if (dir === "next" && !isNextDisabled()) {
      setScreenIndex((prev) => prev + 1);
    }
  };

  const handleStart = () => {
    playSound("click");
    setScreenIndex(1);
  };

  const handleStartOver = () => {
    playSound("click");
    clearBracketAnimation();
    setScreenIndex(0);
    setDragFeedbackStatus(null);
    setAnswerFeedbackStatus(null);
    setAnswerValue("");
    setAnswerShake(false);
    setAnswerRulerShifted(false);
    setBracketVisibleCount(0);
    setBracketTone(null);
    setAnswerHadWrongAttempt(false);
    setAnswerMeasureAnimating(false);
    setRulerLocked(false);
    setRulerDragging(false);
    setRulerPos({ x: 0, y: 0 });
  };

  useEffect(() => {
    if (!isAnswerScreen) {
      clearBracketAnimation();
    }
  }, [isAnswerScreen, clearBracketAnimation]);

  /**
   * Edge guides: align steps hide some lines until the next step (see user flow).
   * both | left (left only) | none (glue-only-left on total step for pencil).
   */
  const getMeasureEdgesClass = (idx) => {
    if (isAnswerScreen || isTotalVisualizeScreen) return "measure-edges--both";
    if (!isAlignScreen) return "measure-edges--both";
    if (currentScreen.activity === "total") {
      if (idx === 0) return "measure-edges--left";
      return "measure-edges--none";
    }
    if (
      currentScreen.activity === "glue" ||
      currentScreen.activity === "pencil"
    ) {
      return "measure-edges--left";
    }
    return "measure-edges--both";
  };

  const renderObjects = () => {
    const cmWidthPx = getCmWidthPx();
    const totalWidth = getTotalObjectWidthPx(objectParts);
    return ce(
      "div",
      {
        className: "object-track",
        style: { width: totalWidth + "px" },
      },
      objectParts.map((part, idx) =>
        ce(
          "div",
          {
            key: part.key,
            ref: idx === 0 ? firstObjectRef : null,
            className:
              "measure-object " +
              part.className +
              " " +
              getMeasureEdgesClass(idx),
            style: { width: part.lengthCm * cmWidthPx + "px" },
          },
          ce("span", {
            className: "measure-edge-line measure-edge-line--left",
            "aria-hidden": true,
          }),
          ce("span", {
            className: "measure-edge-line measure-edge-line--right",
            "aria-hidden": true,
          }),
          ce("img", {
            src: "assets/" + part.className + ".png",
            alt: part.className,
          }),
        ),
      ),
    );
  };

  /** Align stages: placeholder same size as ruler; hides when placed correctly. */
  const renderBlankRulerPlaceholder = () => {
    const show = isAlignScreen && dragFeedbackStatus !== "correct";
    if (!show) return null;
    return ce("div", {
      className: "blank-ruler-placeholder",
      "aria-hidden": true,
    });
  };

  const renderAnswerRow = () => {
    const rawLabel =
      currentScreen.activity === "total"
        ? APP_DATA.labels.totalLength
        : APP_DATA.labels.lengthOf.replace("{{name}}", activityData.name);

    let boxClass = "input-box";
    if (isTotalVisualizeScreen || answerFeedbackStatus === "correct")
      boxClass += " correct";
    if (!isTotalVisualizeScreen && answerFeedbackStatus === "wrong")
      boxClass += " wrong";
    if (!isTotalVisualizeScreen && answerShake) boxClass += " shake";

    return ce(
      "div",
      { className: "answer-row" },
      ce("span", null, rawLabel),
      ce("span", { className: boxClass }, answerValue || ""),
      ce("span", null, APP_DATA.labels.cm),
    );
  };

  const renderAnswerRowArea = () => {
    const showVisualizeBtn =
      isAnswerScreen &&
      currentScreen.activity === "total" &&
      answerFeedbackStatus === "correct" &&
      !answerMeasureAnimating;
    const showAdditionEquation = isTotalVisualizeScreen;

    return ce(
      "div",
      { className: "answer-row-area" },
      ce(
        "div",
        { className: "answer-row-inner" },
        showVisualizeBtn
          ? ce(
              "button",
              {
                type: "button",
                className: "visualize-addition-btn",
                onClick: handleVisualizeAddition,
              },
              APP_DATA.activities.total.visualizeAdditionButton,
            )
          : null,
        showAdditionEquation
          ? ce(
              "div",
              { className: "total-addition-equation" },
              getAdditionEquationText(),
            )
          : null,
        renderAnswerRow(),
      ),
    );
  };

  const renderTotalCorrectStaticBrackets = () => {
    const glueCm = APP_DATA.activities.glue.lengthCm;
    const pencilCm = APP_DATA.activities.pencil.lengthCm;
    const totalCm = activityData.lengthCm;
    const label = (n) => n + " " + APP_DATA.labels.cm;

    return ce(
      "div",
      { className: "total-static-brackets-layer", "aria-hidden": true },
      ce(
        "div",
        { className: "total-static-brackets-inner" },
        ce(
          "div",
          {
            className:
              "total-static-bracket-row total-static-bracket-row--outer",
          },
          ce(
            "div",
            { className: "total-static-bracket is-correct-static" },
            ce(
              "div",
              { className: "measure-cm-bracket-label" },
              label(totalCm),
            ),
            ce("div", { className: "measure-cm-bracket-draw" }),
          ),
        ),
        ce(
          "div",
          {
            className:
              "total-static-bracket-row total-static-bracket-row--split",
          },
          ce(
            "div",
            {
              className: "total-static-bracket is-correct-static",
              style: { flex: glueCm, minWidth: 0 },
            },
            ce("div", { className: "measure-cm-bracket-label" }, label(glueCm)),
            ce("div", { className: "measure-cm-bracket-draw" }),
          ),
          ce(
            "div",
            {
              className: "total-static-bracket is-correct-static",
              style: { flex: pencilCm, minWidth: 0 },
            },
            ce(
              "div",
              { className: "measure-cm-bracket-label" },
              label(pencilCm),
            ),
            ce("div", { className: "measure-cm-bracket-draw" }),
          ),
        ),
      ),
    );
  };

  const renderMeasureBrackets = () => {
    if (isTotalVisualizeScreen) return null;
    if (
      !isAnswerScreen ||
      !activityData ||
      !answerRulerShifted ||
      !bracketTone ||
      bracketVisibleCount < 1 ||
      !visualAreaRef.current ||
      !firstObjectRef.current
    ) {
      return null;
    }

    const visualRect = visualAreaRef.current.getBoundingClientRect();
    const objectRect = firstObjectRef.current.getBoundingClientRect();
    const rulerRect = rulerRef.current.getBoundingClientRect();
    const leftPx = rulerRect.left - visualRect.left;
    const topPx = objectRect.bottom - visualRect.top;
    const rulerW = rulerRect.width;
    const gapH = vwToPx(4);
    const cmW = rulerW * CM_WIDTH_RATIO;
    const leftGapPx = rulerW * RULER_LEFT_GAP_RATIO;

    const segments = [];
    for (let i = 1; i <= bracketVisibleCount; i += 1) {
      segments.push(
        ce(
          "div",
          {
            key: "bracket-" + i,
            className:
              "measure-cm-bracket " +
              (bracketTone === "correct" ? "is-correct" : "is-wrong"),
            style: {
              left: leftGapPx + (i - 1) * cmW,
              width: cmW,
            },
          },
          ce(
            "div",
            { className: "measure-cm-bracket-label" },
            i + " " + APP_DATA.labels.cm,
          ),
          ce("div", { className: "measure-cm-bracket-draw" }),
        ),
      );
    }

    return ce(
      "div",
      {
        className: "measure-bracket-layer",
        style: {
          left: leftPx,
          top: topPx,
          width: rulerW,
          height: gapH,
        },
      },
      segments,
    );
  };

  if (currentScreen.kind === "start") {
    return ce(
      "div",
      { className: "applet-container" },
      ce(
        "div",
        { className: "app-main-content" },
        ce(Fullscreen, {
          heading: APP_DATA.start.heading,
          text: APP_DATA.start.text,
          buttonText: APP_DATA.start.buttonText,
          onButtonClick: handleStart,
        }),
      ),
    );
  }

  if (currentScreen.kind === "end") {
    return ce(
      "div",
      { className: "applet-container" },
      ce(
        "div",
        { className: "app-main-content" },
        ce(Fullscreen, {
          heading: APP_DATA.end.heading,
          text: APP_DATA.end.text,
          buttonText: APP_DATA.end.buttonText,
          onButtonClick: handleStartOver,
        }),
      ),
    );
  }

  const rulerStyle = getRulerStyle();
  const feedbackText = getFeedbackText();
  const usePreAlignRuler = isAlignScreen && dragFeedbackStatus !== "correct";
  const rulerImageSrc = usePreAlignRuler
    ? "assets/ruler0.svg"
    : "assets/ruler.svg";

  return ce(
    "div",
    { className: "applet-container" },
    ce(
      "div",
      { className: "with-character-layout" },
      ce(CharacterPanel, {
        characterImage: getCharacterImage(),
        characterText: getCharacterText(),
      }),
      ce(
        ContentPanel,
        null,
        ce(
          "div",
          { className: "two-column-content" },
          ce(
            "div",
            { className: "visual-column", ref: visualAreaRef },
            isAnswerScreen || isTotalVisualizeScreen
              ? renderAnswerRowArea()
              : null,
            ce(
              "div",
              { className: "object-measure-wrap" },
              isTotalVisualizeScreen ? renderTotalCorrectStaticBrackets() : null,
              renderObjects(),
            ),
            renderBlankRulerPlaceholder(),
            isAnswerScreen || isTotalVisualizeScreen
              ? renderMeasureBrackets()
              : null,
            ce(
              "div",
              {
                ref: rulerRef,
                className:
                  "ruler-container" +
                  (isAnswerScreen || isTotalVisualizeScreen
                    ? " answer-ruler"
                    : "") +
                  (rulerLocked ? " locked" : "") +
                  (rulerDragging ? " dragging" : ""),
                style: Object.assign(
                  {
                    width: RULER_WIDTH_PERCENT + "%",
                    position: "absolute",
                  },
                  rulerStyle,
                ),
                onMouseDown:
                  rulerLocked || isAnswerScreen || isTotalVisualizeScreen
                    ? undefined
                    : handleDragStart,
                onTouchStart:
                  rulerLocked || isAnswerScreen || isTotalVisualizeScreen
                    ? undefined
                    : handleDragStart,
              },
              ce("img", {
                src: rulerImageSrc,
                className: "ruler-img",
                alt: "Ruler",
                draggable: false,
              }),
            ),
          ),
          ce(
            "div",
            { className: "input-column" },
            ce(
              "div",
              {
                className:
                  "feedback-panel " +
                  getFeedbackClass() +
                  (feedbackText ? " show" : ""),
              },
              feedbackText,
            ),
            ce(
              "div",
              { className: "numpad-panel" },
              isAnswerScreen
                ? ce(Numpad, {
                    disabled:
                      answerFeedbackStatus === "correct" ||
                      answerShake ||
                      answerMeasureAnimating,
                    onNumberClick: appendDigit,
                    onClear: clearDigit,
                    onSubmit: submitAnswer,
                    playClickOnSubmit: false,
                  })
                : null,
            ),
          ),
        ),
      ),
    ),
    ce(Navigation, {
      onNav: handleNavigation,
      isPrevDisabled: screenIndex <= 1,
      isNextDisabled: isNextDisabled(),
      navText: getNavText(),
      nextButtonRef: nextButtonRef,
    }),
  );
};
