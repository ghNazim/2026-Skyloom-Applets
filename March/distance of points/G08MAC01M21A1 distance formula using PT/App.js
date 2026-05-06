function practiceHypDistLabel(dx, dy) {
  const n = dx * dx + dy * dy;
  const r = Math.sqrt(n);
  var u =
    APP_DATA.practiceCopy && APP_DATA.practiceCopy.unitsWord
      ? APP_DATA.practiceCopy.unitsWord
      : "units";
  if (Math.abs(r - Math.round(r)) < 1e-6) return Math.round(r) + " " + u;
  return "\u221A" + n + " " + u;
}

function replacePracticeTemplate(str, dx, dy, distLabel) {
  if (!str) return "";
  return str
    .replace(/\{\{DX\}\}/g, String(dx))
    .replace(/\{\{DY\}\}/g, String(dy))
    .replace(/\{\{DIST\}\}/g, distLabel);
}

const App = () => {
  const { useState, useMemo, useEffect } = React;

  const [currentStep, setCurrentStep] = useState(0);

  const [s1YellowAxis, setS1YellowAxis] = useState(false);
  const [s1BlueAxis, setS1BlueAxis] = useState(false);
  const [s1Horizontal, setS1Horizontal] = useState(false);

  const [s2YellowAxis, setS2YellowAxis] = useState(false);
  const [s2BlueAxis, setS2BlueAxis] = useState(false);
  const [s2VerticalExpr, setS2VerticalExpr] = useState(false);
  const [s2SlideDone, setS2SlideDone] = useState(false);

  const [s3TriangleFill, setS3TriangleFill] = useState(false);
  const [s3RightTriangle, setS3RightTriangle] = useState(false);

  /**
   * Step 4 sub-phase progression:
   * 0 = animation playing (grid slides left, calc div fades in, expression builds)
   * 1 = expression d = sqrt(3² + 4²) fully built → "Tap the expression to solve it"
   * 2 = 3² clicked → line 2 shows d = sqrt(9 + __)
   * 3 = 4² clicked → line 2 shows d = sqrt(9 + 16)
   * 4 = + clicked → line 3 shows d = sqrt(25)
   * 5 = 25 clicked → line 4 shows d = 5 (next enabled, nav = "Tap » to conclude")
   */
  const [s4Phase, setS4Phase] = useState(0);

  /** Step 5: "5" flies from calc line to hypotenuse label */
  const [s5AnimDone, setS5AnimDone] = useState(false);

  /** Steps 6–7: practice problems (cycles through APP_DATA.practiceQuestions) */
  const [practiceQuestionIndex, setPracticeQuestionIndex] = useState(0);
  const [s7HorizDone, setS7HorizDone] = useState(false);
  const [s7VertDone, setS7VertDone] = useState(false);
  const [s7HypDone, setS7HypDone] = useState(false);
  const [s7XyAnimDone, setS7XyAnimDone] = useState(false);

  const [questionNudgeRects, setQuestionNudgeRects] = useState([]);
  const [nextNudgePos, setNextNudgePos] = useState(null);

  const resetStepStates = () => {
    setS1YellowAxis(false);
    setS1BlueAxis(false);
    setS1Horizontal(false);
    setS2YellowAxis(false);
    setS2BlueAxis(false);
    setS2VerticalExpr(false);
    setS2SlideDone(false);
    setS3TriangleFill(false);
    setS3RightTriangle(false);
    setS4Phase(0);
    setS5AnimDone(false);
  };

  /** Practice step 7 reveal flags — clear when advancing to next problem (step 6), not when entering step 7 (avoids one-frame flash). */
  const resetPracticeQuestionProgress = () => {
    setS7HorizDone(false);
    setS7VertDone(false);
    setS7HypDone(false);
    setS7XyAnimDone(false);
  };

  const resetEverything = () => {
    setCurrentStep(0);
    resetStepStates();
    setPracticeQuestionIndex(0);
    resetPracticeQuestionProgress();
  };

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(1);
    resetStepStates();
    setPracticeQuestionIndex(0);
    resetPracticeQuestionProgress();
  };

  const handleStartOver = () => {
    if (typeof playSound === "function") playSound("click");
    resetEverything();
  };

  const step1BothAxisDone = s1YellowAxis && s1BlueAxis;

  const practiceQuestion = useMemo(() => {
    const qs = APP_DATA.practiceQuestions;
    if (!qs || !qs.length) return null;
    return qs[practiceQuestionIndex % qs.length];
  }, [practiceQuestionIndex]);

  const navText = useMemo(() => {
    if (currentStep === 1) {
      const s = APP_DATA.steps[1];
      if (s1Horizontal) return s.navTextDone;
      if (step1BothAxisDone) return s.navTextBetweenHorizontal;
      return s.navTextInitial;
    }
    if (currentStep === 2) {
      const s = APP_DATA.steps[2];
      if (s2SlideDone) return s.navTextDone;
      if (s2YellowAxis && s2BlueAxis) return s.navTextBetweenVertical;
      return s.navTextInitial;
    }
    if (currentStep === 3) {
      const s = APP_DATA.steps[3];
      if (s3RightTriangle) return s.navTextHypotenuse;
      if (s3TriangleFill) return s.navTextTriangle;
      return s.navTextInitial;
    }
    if (currentStep === 4) {
      const s = APP_DATA.steps[4];
      if (s4Phase >= 5) return s.navTextConclude;
      if (s4Phase === 4) return s.navTextTapToSimplify;
      if (s4Phase === 3) return s.navTextTapPlus;
      if (s4Phase >= 1 && s4Phase <= 2) return s.navTextTapExpression;
      return s.navTextInitial;
    }
    if (currentStep === 5) {
      const s = APP_DATA.steps[5];
      if (s5AnimDone) return s.navText;
      return s.navTextInitial;
    }
    if (currentStep === 6) {
      return "&nbsp;";
    }
    if (currentStep === 7 && practiceQuestion) {
      const pc = APP_DATA.practiceCopy;
      if (practiceQuestion.qtype === "xy") {
        if (s7XyAnimDone) {
          const qs = APP_DATA.practiceQuestions;
          const isLast =
            qs && qs.length &&
            practiceQuestionIndex === qs.length - 1;
          return isLast && pc.navLast ? pc.navLast : pc.tapNext;
        }
        if (s7HypDone) return "&nbsp;";
        return pc.tapQ;
      }
      if (s7HypDone) return pc.tapNext;
      return pc.tapQ;
    }
    return "";
  }, [
    currentStep,
    step1BothAxisDone,
    s1Horizontal,
    s2YellowAxis,
    s2BlueAxis,
    s2SlideDone,
    s3TriangleFill,
    s3RightTriangle,
    s4Phase,
    s5AnimDone,
    practiceQuestion,
    s7HypDone,
    s7XyAnimDone,
    practiceQuestionIndex,
  ]);

  const questionText = useMemo(() => {
    if (currentStep === 1) {
      const s = APP_DATA.steps[1];
      if (s1Horizontal) return s.questionTextDone;
      if (step1BothAxisDone) return s.questionTextBetweenHorizontal;
      return s.questionTextInitial;
    }
    if (currentStep === 2) {
      const s = APP_DATA.steps[2];
      if (s2SlideDone) return s.questionTextDone;
      if (s2YellowAxis && s2BlueAxis) return s.questionTextBetweenVertical;
      return s.questionTextInitial;
    }
    if (currentStep === 3) {
      const s = APP_DATA.steps[3];
      if (s3RightTriangle) return s.questionTextHypotenuse;
      if (s3TriangleFill) return s.questionTextTriangle;
      return s.questionTextInitial;
    }
    if (currentStep === 4) {
      return APP_DATA.steps[4].questionText;
    }
    if (currentStep === 5) {
      return APP_DATA.steps[5].questionText;
    }
    if (currentStep === 6) {
      return "&nbsp;";
    }
    if (currentStep === 7 && practiceQuestion) {
      const pc = APP_DATA.practiceCopy;
      const { x1, y1, x2, y2 } = practiceQuestion;
      const dx = Math.abs(x2 - x1);
      const dy = Math.abs(y2 - y1);
      const distStr = practiceHypDistLabel(dx, dy);
      if (practiceQuestion.qtype === "xy") {
        if (!s7HorizDone)
          return pc.shoutHorizontalXy || pc.shoutHorizontal;
        if (!s7VertDone) return pc.xyAfterHorizontal;
        if (!s7HypDone) return pc.xyAfterVertical;
        if (!s7XyAnimDone)
          return pc.xyAwaitHypAnim || pc.xyAfterVertical;
        var fd = pc.finalDistanceXy || "";
        var form =
          typeof sqrtXyDistanceFormula === "function"
            ? sqrtXyDistanceFormula()
            : "";
        return fd.replace(/\{\{FORMULA\}\}/g, form);
      }
      if (!s7HorizDone) return pc.shoutHorizontal;
      if (!s7VertDone)
        return replacePracticeTemplate(pc.afterHorizontal, dx, dy, distStr);
      if (!s7HypDone)
        return replacePracticeTemplate(pc.afterVertical, dx, dy, distStr);
      return replacePracticeTemplate(pc.finalDistance, dx, dy, distStr);
    }
    return "";
  }, [
    currentStep,
    step1BothAxisDone,
    s1Horizontal,
    s2YellowAxis,
    s2BlueAxis,
    s2SlideDone,
    s3TriangleFill,
    s3RightTriangle,
    s4Phase,
    s5AnimDone,
    practiceQuestion,
    s7HorizDone,
    s7VertDone,
    s7HypDone,
    s7XyAnimDone,
  ]);

  const isNextDisabled =
    (currentStep === 1 && !s1Horizontal) ||
    (currentStep === 2 && !s2SlideDone) ||
    currentStep === 3 ||
    (currentStep === 4 && s4Phase < 5) ||
    (currentStep === 5 && !s5AnimDone) ||
    currentStep === 6 ||
    (currentStep === 7 && (
      practiceQuestion && practiceQuestion.qtype === "xy" ? !s7XyAnimDone : !s7HypDone
    ));

  const isPrevDisabled = currentStep <= 1;

  useEffect(() => {
    const updateNudges = () => {
      let rects = [];
      if (currentStep === 3) {
        const step3El = document.querySelector(".step3-nudge-target");
        rects = step3El ? [step3El.getBoundingClientRect()] : [];
      } else if (currentStep === 4) {
        const s4El = document.querySelector(".s4-clickable-nudge");
        rects = s4El ? [s4El.getBoundingClientRect()] : [];
      } else {
        const els = document.querySelectorAll(".q-box-clickable");
        rects = els.length
          ? Array.from(els).map((el) => el.getBoundingClientRect())
          : [];
      }
      setQuestionNudgeRects(rects);

      const nextBtn = document.getElementById("next-button");
      const showNextNudge =
        !!nextBtn && !isNextDisabled && currentStep !== 0 && currentStep !== 6;
      setNextNudgePos(showNextNudge ? nextBtn.getBoundingClientRect() : null);
    };

    const timeoutId = setTimeout(updateNudges, 0);
    window.addEventListener("resize", updateNudges);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", updateNudges);
    };
  }, [
    currentStep,
    isNextDisabled,
    s1YellowAxis,
    s1BlueAxis,
    s1Horizontal,
    s2YellowAxis,
    s2BlueAxis,
    s2VerticalExpr,
    s2SlideDone,
    s3TriangleFill,
    s3RightTriangle,
    s4Phase,
    s5AnimDone,
    s7HorizDone,
    s7VertDone,
    s7HypDone,
    s7XyAnimDone,
    questionText,
    navText,
  ]);

  const handleNext = () => {
    if (typeof playSound === "function") playSound("click");
    setNextNudgePos(null);
    if (isNextDisabled) return;
    if (currentStep === 1) {
      setCurrentStep(2);
      setS2YellowAxis(false);
      setS2BlueAxis(false);
      setS2VerticalExpr(false);
      setS2SlideDone(false);
    } else if (currentStep === 2) {
      setCurrentStep(3);
      setS3TriangleFill(false);
      setS3RightTriangle(false);
    } else if (currentStep === 4) {
      /* Step 4 done → step 5: animate 5 to hypotenuse */
      setCurrentStep(5);
      setS5AnimDone(false);
    } else if (currentStep === 5) {
      setCurrentStep(6);
      setPracticeQuestionIndex(0);
      resetPracticeQuestionProgress();
    } else if (currentStep === 7) {
      if (practiceQuestion && practiceQuestion.qtype === "xy") {
        setCurrentStep(8);
      } else {
        const len = APP_DATA.practiceQuestions.length;
        resetPracticeQuestionProgress();
        setCurrentStep(6);
        setPracticeQuestionIndex((i) => (len ? (i + 1) % len : 0));
      }
    }
  };

  const handlePrev = () => {
    if (typeof playSound === "function") playSound("click");
    if (currentStep === 2) {
      setCurrentStep(1);
      setS2YellowAxis(false);
      setS2BlueAxis(false);
      setS2VerticalExpr(false);
      setS2SlideDone(false);
      return;
    }
    if (currentStep === 3) {
      setCurrentStep(2);
      setS3TriangleFill(false);
      setS3RightTriangle(false);
      setS2YellowAxis(false);
      setS2BlueAxis(false);
      setS2VerticalExpr(false);
      setS2SlideDone(false);
    }
    if (currentStep === 4) {
      setCurrentStep(3);
      setS4Phase(0);
      setS3TriangleFill(false);
      setS3RightTriangle(false);
    }
    if (currentStep === 5) {
      setCurrentStep(4);
      setS5AnimDone(false);
      return;
    }
    if (currentStep === 7) {
      setCurrentStep(6);
      return;
    }
    if (currentStep === 6) {
      setCurrentStep(5);
      setS5AnimDone(false);
    }
  };

  /** "d" click at end of step 3 → step 4 */
  const handleDClick = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(4);
    setS4Phase(0);
  };

  if (currentStep === 0) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        React.createElement(Fullscreen, {
          heading: APP_DATA.start.heading,
          text: APP_DATA.start.text,
          buttonText: APP_DATA.start.buttonText,
          onButtonClick: handleStart,
        }),
      ),
    );
  }

  if (currentStep === 8) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        React.createElement(Fullscreen, {
          heading: APP_DATA.final.heading,
          text: APP_DATA.final.text,
          buttonText: APP_DATA.final.buttonText,
          onButtonClick: handleStartOver,
          isFinal: true,
          imageSrc: APP_DATA.final.imageSrc,
        }),
      ),
    );
  }

  return React.createElement(
    "div",
    { className: "applet-container" },
    React.createElement(QuestionPanel, {
      text: questionText,
      className: currentStep === 6 ? "question-panel--reserved" : "",
    }),
    React.createElement(
      "div",
      { className: "app-main-content" },
      React.createElement(MainCanvas, {
        step: currentStep,
        s1YellowAxis,
        s1BlueAxis,
        s1Horizontal,
        onS1YellowAxis: () => setS1YellowAxis(true),
        onS1BlueAxis: () => setS1BlueAxis(true),
        onS1Horizontal: () => setS1Horizontal(true),
        s2YellowAxis,
        s2BlueAxis,
        s2VerticalExpr,
        onS2YellowAxis: () => setS2YellowAxis(true),
        onS2BlueAxis: () => setS2BlueAxis(true),
        onS2VerticalExpr: () => setS2VerticalExpr(true),
        onS2SlideDone: () => setS2SlideDone(true),
        s3TriangleFill,
        s3RightTriangle,
        onS3TriangleFill: () => setS3TriangleFill(true),
        onS3RightTriangle: () => setS3RightTriangle(true),
        onQuestionMarkClick: () => setQuestionNudgeRects([]),
        onDClick: handleDClick,
        s4Phase,
        onS4PhaseAdvance: (p) => setS4Phase(p),
        s5AnimDone,
        onS5AnimDone: () => setS5AnimDone(true),
        practiceQuestion,
        s7HorizDone,
        s7VertDone,
        s7HypDone,
        onS7HorizReveal: () => setS7HorizDone(true),
        onS7VertReveal: () => setS7VertDone(true),
        onS7HypReveal: () => setS7HypDone(true),
        s7XyAnimDone,
        onS7XyAnimDone: () => setS7XyAnimDone(true),
        onPracticeContinue: () => setCurrentStep(7),
      }),
    ),
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: (dir) =>
          dir === "next" ? handleNext() : dir === "prev" ? handlePrev() : null,
        isNextDisabled,
        isPrevDisabled,
        navText: handleComma(navText),
        className:
          currentStep === 6
            ? "navigation--buttons-hidden navigation--reserved"
            : "",
      }),
    ),
    questionNudgeRects.map((rect, idx) =>
      React.createElement(Nudge, {
        key: "q-nudge-" + idx,
        show: true,
        position: rect,
      }),
    ),
    React.createElement(Nudge, {
      show: !!nextNudgePos,
      position: nextNudgePos,
    }),
  );
};
