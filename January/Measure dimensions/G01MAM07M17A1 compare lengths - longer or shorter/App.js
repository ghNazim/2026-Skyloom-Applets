const App = () => {
  const { useState, useEffect, useRef } = React;
  const ce = React.createElement;

  const LONG_STICK_COUNT = 5;
  const SHORT_STICK_COUNT = 4;
  const BOARD_COUNT = 10;
  const CUPBOARD_COUNT = 7;

  const [currentStep, setCurrentStep] = useState(0);
  const [longStickPlaced, setLongStickPlaced] = useState(false);
  const [shortStickPlaced, setShortStickPlaced] = useState(false);
  const [boardPlaced, setBoardPlaced] = useState(false);
  const [cupboardPlaced, setCupboardPlaced] = useState(false);
  const [numpadAnswer, setNumpadAnswer] = useState("");
  const [numpadFeedback, setNumpadFeedback] = useState(null);
  const [numpadDisabled, setNumpadDisabled] = useState(false);
  const [showCountDivs, setShowCountDivs] = useState(false);
  const [countDivsVisible, setCountDivsVisible] = useState(0);
  const [compareResult, setCompareResult] = useState(null);
  const [compareAnswered, setCompareAnswered] = useState(false);
  const [compareSubstep, setCompareSubstep] = useState(1);
  const [quizFeedback, setQuizFeedback] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);

  const placedUnitsRef = useRef(null);
  const animatingRef = useRef(false);
  const fullscreenButtonRef = useRef(null);
  const handspanRef = useRef(null);
  const nextButtonRef = useRef(null);
  const [nudgeState, setNudgeState] = React.useState({
    show: false,
    position: null,
  });

  // Helper to get the correct handspan count for current numpad step
  const getCorrectCount = () => {
    if (currentStep === 2) return LONG_STICK_COUNT;
    if (currentStep === 4) return SHORT_STICK_COUNT;
    if (currentStep === 8) return BOARD_COUNT;
    if (currentStep === 10) return CUPBOARD_COUNT;
    return 0;
  };

  const getCharacterImage = () => {
    if (currentStep === 2 || currentStep === 4 || currentStep === 8 || currentStep === 10) {
      if (numpadFeedback === "wrong") return "charsad.png";
      if (numpadFeedback === "correct") return "charhappy.png";
    }
    if (currentStep === 5) {
      if (compareResult === "wrong") return "charsad.png";
      if (compareAnswered) return "charhappy.png";
    }
    if (currentStep === 11 || currentStep === 13) {
      if (quizFeedback === "wrong") return "charsad.png";
      if (quizFeedback === "correct") return "charhappy.png";
    }
    return "chardefault.png";
  };

  // Animate stagger for step 1 (long stick) - horizontal left to right
  useEffect(() => {
    if (currentStep !== 1 || !longStickPlaced || animatingRef.current) return;
    const rafId = requestAnimationFrame(() => {
      const container = placedUnitsRef.current;
      if (!container || container.children.length === 0) return;
      animatingRef.current = true;
      gsap.fromTo(
        container.children,
        { scale: 0, opacity: 0, transformOrigin: "center center" },
        {
          scale: 1,
          opacity: 1,
          duration: 0.25,
          stagger: 0.12,
          ease: "back.out(1.7)",
          onComplete: () => {
            animatingRef.current = false;
            setTimeout(() => {
              setCurrentStep(2);
            }, 600);
          },
        },
      );
    });
    return () => cancelAnimationFrame(rafId);
  }, [currentStep, longStickPlaced]);

  // Animate stagger for step 3 (short stick) - horizontal left to right
  useEffect(() => {
    if (currentStep !== 3 || !shortStickPlaced || animatingRef.current) return;
    const rafId = requestAnimationFrame(() => {
      const container = placedUnitsRef.current;
      if (!container || container.children.length === 0) return;
      animatingRef.current = true;
      gsap.fromTo(
        container.children,
        { scale: 0, opacity: 0, transformOrigin: "center center" },
        {
          scale: 1,
          opacity: 1,
          duration: 0.25,
          stagger: 0.12,
          ease: "back.out(1.7)",
          onComplete: () => {
            animatingRef.current = false;
            setTimeout(() => {
              setCurrentStep(4);
            }, 600);
          },
        },
      );
    });
    return () => cancelAnimationFrame(rafId);
  }, [currentStep, shortStickPlaced]);

  // Animate stagger for step 7 (board)
  useEffect(() => {
    if (currentStep !== 7 || !boardPlaced || animatingRef.current) return;
    const rafId = requestAnimationFrame(() => {
      const container = placedUnitsRef.current;
      if (!container || container.children.length === 0) return;
      animatingRef.current = true;
      gsap.fromTo(
        container.children,
        { scale: 0, opacity: 0, transformOrigin: "center center" },
        {
          scale: 1,
          opacity: 1,
          duration: 0.25,
          stagger: 0.12,
          ease: "back.out(1.7)",
          onComplete: () => {
            animatingRef.current = false;
            setTimeout(() => {
              setCurrentStep(8);
            }, 600);
          },
        },
      );
    });
    return () => cancelAnimationFrame(rafId);
  }, [currentStep, boardPlaced]);

  // Animate stagger for step 9 (cupboard)
  useEffect(() => {
    if (currentStep !== 9 || !cupboardPlaced || animatingRef.current) return;
    const rafId = requestAnimationFrame(() => {
      const container = placedUnitsRef.current;
      if (!container || container.children.length === 0) return;
      animatingRef.current = true;
      gsap.fromTo(
        container.children,
        { scale: 0, opacity: 0, transformOrigin: "center center" },
        {
          scale: 1,
          opacity: 1,
          duration: 0.25,
          stagger: 0.12,
          ease: "back.out(1.7)",
          onComplete: () => {
            animatingRef.current = false;
            setTimeout(() => {
              setCurrentStep(10);
            }, 600);
          },
        },
      );
    });
    return () => cancelAnimationFrame(rafId);
  }, [currentStep, cupboardPlaced]);

  // Stagger count divs in numpad steps (2, 4, 8, 10)
  useEffect(() => {
    if (![2, 4, 8, 10].includes(currentStep) || !showCountDivs) return;
    const correctCount = getCorrectCount();
    if (countDivsVisible >= correctCount) return;
    const timer = setTimeout(() => {
      playSound("tick");
      setCountDivsVisible((prev) => prev + 1);
    }, 100);
    return () => clearTimeout(timer);
  }, [currentStep, showCountDivs, countDivsVisible]);

  // Reset countDivsVisible when hiding
  useEffect(() => {
    if (!showCountDivs) setCountDivsVisible(0);
  }, [showCountDivs]);

  // Nudge position update
  useEffect(() => {
    let show = false;
    let targetRef = null;
    if (currentStep === 0 || currentStep === 12 || currentStep === 14) {
      show = true;
      targetRef = fullscreenButtonRef;
    } else if (
      (currentStep === 1 && !longStickPlaced) ||
      (currentStep === 3 && !shortStickPlaced) ||
      (currentStep === 7 && !boardPlaced) ||
      (currentStep === 9 && !cupboardPlaced)
    ) {
      show = true;
      targetRef = handspanRef;
    } else {
      const nextEnabled =
        (currentStep === 2 && numpadFeedback === "correct") ||
        (currentStep === 4 && numpadFeedback === "correct") ||
        (currentStep === 5 && compareAnswered) ||
        currentStep === 6 ||
        (currentStep === 8 && numpadFeedback === "correct") ||
        (currentStep === 10 && numpadFeedback === "correct") ||
        (currentStep === 11 && quizFeedback === "correct") ||
        (currentStep === 13 && quizFeedback === "correct");
      if (nextEnabled) {
        show = true;
        targetRef = nextButtonRef;
      }
    }
    if (!show) {
      setNudgeState({ show: false, position: null });
      return;
    }
    const tick = () => {
      const el = targetRef && targetRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setNudgeState({
        show: true,
        position: {
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
        },
      });
    };
    const id = requestAnimationFrame(tick);
    const onResize = () => requestAnimationFrame(tick);
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", onResize);
    };
  }, [
    currentStep,
    longStickPlaced,
    shortStickPlaced,
    boardPlaced,
    cupboardPlaced,
    numpadFeedback,
    compareAnswered,
    quizFeedback,
  ]);

  // ===== HANDLERS =====

  const handleStart = () => {
    playSound("click");
    setCurrentStep(1);
  };

  const handlePlaceHandspans = () => {
    if (animatingRef.current) return;
    if (currentStep === 1 && !longStickPlaced) {
      playSound("click");
      setLongStickPlaced(true);
    } else if (currentStep === 3 && !shortStickPlaced) {
      playSound("click");
      setShortStickPlaced(true);
    } else if (currentStep === 7 && !boardPlaced) {
      playSound("click");
      setBoardPlaced(true);
    } else if (currentStep === 9 && !cupboardPlaced) {
      playSound("click");
      setCupboardPlaced(true);
    }
  };

  const handleNumpadClick = (num) => {
    if (numpadDisabled) return;
    if (numpadFeedback === "wrong") {
      setNumpadFeedback(null);
      setNumpadAnswer(num);
      setShowCountDivs(false);
      return;
    }
    setNumpadAnswer((prev) => {
      const next = (prev === "" || prev === "?" ? "" : prev) + num;
      return next.length <= 2 ? next : prev;
    });
  };

  const handleNumpadClear = () => {
    if (numpadDisabled) return;
    setNumpadAnswer("");
    setNumpadFeedback(null);
    setShowCountDivs(false);
  };

  const handleNumpadSubmit = () => {
    if (numpadDisabled) return;
    if (!numpadAnswer || numpadAnswer === "?" || numpadAnswer === "") return;
    const val = parseInt(numpadAnswer, 10);
    const correctAns = getCorrectCount();
    setCountDivsVisible(0);
    setShowCountDivs(true);
    if (val === correctAns) {
      playSound("correct");
      setNumpadFeedback("correct");
      setNumpadDisabled(true);
    } else {
      playSound("wrong");
      setNumpadFeedback("wrong");
    }
  };

  const handleClickStickA = () => {
    if (compareAnswered || compareResult) return;
    playSound("correct");
    setCompareResult("correct");
    setTimeout(() => {
      setCompareAnswered(true);
    }, 500);
  };

  const handleClickStickB = () => {
    if (compareAnswered || compareResult) return;
    playSound("wrong");
    setCompareResult("wrong");
    setTimeout(() => {
      setCompareResult(null);
    }, 500);
  };

  const handleQuizLeftClick = () => {
    if (quizFeedback === "correct") return;
    const correctAns = currentStep === 13 ? APP_DATA.step13.questions[questionIndex].correctAnswer : APP_DATA.step11.correctAnswer;
    if (correctAns === "left") {
      playSound("correct");
      setQuizFeedback("correct");
    } else {
      playSound("wrong");
      setQuizFeedback("wrong");
    }
  };

  const handleQuizRightClick = () => {
    if (quizFeedback === "correct") return;
    const correctAns = currentStep === 13 ? APP_DATA.step13.questions[questionIndex].correctAnswer : APP_DATA.step11.correctAnswer;
    if (correctAns === "right") {
      playSound("correct");
      setQuizFeedback("correct");
    } else {
      playSound("wrong");
      setQuizFeedback("wrong");
    }
  };

  const handleStartOver = () => {
    playSound("click");
    setCurrentStep(0);
    setLongStickPlaced(false);
    setShortStickPlaced(false);
    setBoardPlaced(false);
    setCupboardPlaced(false);
    setNumpadAnswer("");
    setNumpadFeedback(null);
    setNumpadDisabled(false);
    setShowCountDivs(false);
    setCountDivsVisible(0);
    setCompareResult(null);
    setCompareAnswered(false);
    setCompareSubstep(1);
    setQuizFeedback(null);
    setQuestionIndex(0);
  };

  const resetNumpad = () => {
    setNumpadAnswer("");
    setNumpadFeedback(null);
    setNumpadDisabled(false);
    setShowCountDivs(false);
    setCountDivsVisible(0);
  };

  const handleNext = () => {
    playSound("click");
    if (currentStep === 2 && numpadFeedback === "correct") {
      resetNumpad();
      setCurrentStep(3);
    } else if (currentStep === 4 && numpadFeedback === "correct") {
      resetNumpad();
      setCurrentStep(5);
    } else if (currentStep === 5 && compareAnswered) {
      if (compareSubstep === 1) {
        setCompareSubstep(2);
      } else {
        setCurrentStep(6);
      }
    } else if (currentStep === 6) {
      setCurrentStep(7);
    } else if (currentStep === 8 && numpadFeedback === "correct") {
      resetNumpad();
      setCurrentStep(9);
    } else if (currentStep === 10 && numpadFeedback === "correct") {
      resetNumpad();
      setCurrentStep(11);
    } else if (currentStep === 11 && quizFeedback === "correct") {
      setCurrentStep(12);
    } else if (currentStep === 12) {
      setQuizFeedback(null);
      setQuestionIndex(0);
      setCurrentStep(13);
    } else if (currentStep === 13 && quizFeedback === "correct") {
      if (questionIndex < APP_DATA.step13.questions.length - 1) {
        setQuestionIndex((prev) => prev + 1);
        setQuizFeedback(null);
      } else {
        setCurrentStep(14);
      }
    }
  };

  const handlePrev = () => {
    playSound("click");
    if (currentStep === 3) {
      setNumpadAnswer(String(LONG_STICK_COUNT));
      setNumpadFeedback("correct");
      setNumpadDisabled(true);
      setShowCountDivs(true);
      setCountDivsVisible(LONG_STICK_COUNT);
      setCurrentStep(2);
    } else if (currentStep === 4) {
      setShortStickPlaced(false);
      resetNumpad();
      setCurrentStep(3);
    } else if (currentStep === 5) {
      setNumpadAnswer(String(SHORT_STICK_COUNT));
      setNumpadFeedback("correct");
      setNumpadDisabled(true);
      setShowCountDivs(true);
      setCountDivsVisible(SHORT_STICK_COUNT);
      setCompareResult(null);
      setCompareAnswered(false);
      setCompareSubstep(1);
      setCurrentStep(4);
    } else if (currentStep === 6) {
      setCompareResult("correct");
      setCompareAnswered(true);
      setCompareSubstep(2);
      setCurrentStep(5);
    } else if (currentStep === 7) {
      setCurrentStep(6);
    } else if (currentStep === 8) {
      setBoardPlaced(false);
      resetNumpad();
      setCurrentStep(7);
    } else if (currentStep === 9) {
      setNumpadAnswer(String(BOARD_COUNT));
      setNumpadFeedback("correct");
      setNumpadDisabled(true);
      setShowCountDivs(true);
      setCountDivsVisible(BOARD_COUNT);
      setCurrentStep(8);
    } else if (currentStep === 10) {
      setCupboardPlaced(false);
      resetNumpad();
      setCurrentStep(9);
    } else if (currentStep === 11) {
      setNumpadAnswer(String(CUPBOARD_COUNT));
      setNumpadFeedback("correct");
      setNumpadDisabled(true);
      setShowCountDivs(true);
      setCountDivsVisible(CUPBOARD_COUNT);
      setQuizFeedback(null);
      setCurrentStep(10);
    } else if (currentStep === 12) {
      setQuizFeedback("correct");
      setCurrentStep(11);
    } else if (currentStep === 13) {
      if (questionIndex > 0) {
        setQuestionIndex((prev) => prev - 1);
        setQuizFeedback("correct");
      } else {
        setCurrentStep(12);
      }
    } else if (currentStep === 14) {
      setQuizFeedback("correct");
      setCurrentStep(13);
    }
  };

  // ===== RENDER HELPERS =====

  const renderPlacedUnits = (
    count,
    withRef,
    extraClass,
    initialHidden,
    countDivsOpts,
  ) => {
    const items = [];
    const baseStyle = { width: 100 / count + "%" };
    const hiddenStyle = initialHidden
      ? { opacity: 0, transform: "scale(0)", transformOrigin: "center center" }
      : {};
    const showCD = countDivsOpts && countDivsOpts.show;
    const cdVisible = countDivsOpts ? countDivsOpts.visible : 0;
    const cdCorrect = countDivsOpts && countDivsOpts.correct;
    for (let i = 0; i < count; i++) {
      const unitChildren = [
        ce("img", { src: "assets/handspan.png", alt: "hand span" }),
      ];
      if (showCD && i < cdVisible) {
        unitChildren.push(
          ce(
            "div",
            {
              key: "cd-" + i,
              className:
                "count-div" + (cdCorrect ? " count-correct" : ""),
            },
            i + 1,
          ),
        );
      }
      items.push(
        ce(
          "div",
          {
            key: "pu-" + i,
            className: "placed-unit",
            style: { ...baseStyle, ...hiddenStyle },
          },
          ...unitChildren,
        ),
      );
    }
    const props = {
      className: "placed-units-container" + (extraClass ? " " + extraClass : ""),
    };
    if (withRef) props.ref = placedUnitsRef;
    return ce("div", props, items);
  };

  const renderWithNudge = (content) =>
    ce(
      React.Fragment,
      null,
      content,
      ce(Nudge, {
        show: nudgeState.show,
        position: nudgeState.position,
      }),
    );

  // ===== STEP 0: FULLSCREEN START =====
  if (currentStep === 0) {
    return renderWithNudge(
      ce(
        "div",
        { className: "applet-container" },
        ce(
          "div",
          { className: "app-main-content", style: { position: "relative" } },
          ce(Fullscreen, {
            heading: APP_DATA.start.heading,
            text: APP_DATA.start.text,
            buttonText: APP_DATA.start.buttonText,
            onButtonClick: handleStart,
            buttonRef: fullscreenButtonRef,
          }),
        ),
      ),
    );
  }

  // ===== STEP 12: FULLSCREEN SUMMARY =====
  if (currentStep === 12) {
    return renderWithNudge(
      ce(
        "div",
        { className: "applet-container" },
        ce(
          "div",
          { className: "app-main-content", style: { position: "relative" } },
          ce(Fullscreen, {
            heading: APP_DATA.step12.heading,
            text: APP_DATA.step12.text,
            buttonText: APP_DATA.step12.buttonText,
            onButtonClick: handleNext,
            buttonRef: fullscreenButtonRef,
          }),
        ),
      ),
    );
  }

  // ===== STEP 1: PLACE HANDSPANS ON LONG STICK =====
  if (currentStep === 1) {
    return renderWithNudge(
      ce(
        "div",
        { className: "applet-container" },
        ce(
          "div",
          { className: "with-character-layout" },
          ce(CharacterPanel, {
            characterImage: getCharacterImage(),
            characterText: APP_DATA.step1.characterText,
          }),
          ce(
            ContentPanel,
            null,
            ce(
              "div",
              { className: "step-content" },
              ce(
                "div",
                { className: "object-column" },
                ce(
                  "div",
                  { className: "object-image-area" },
                  ce("img", {
                    src: "assets/longstick.png",
                    className: "measure-object-image",
                    alt: "stick",
                  }),
                  longStickPlaced &&
                    renderPlacedUnits(LONG_STICK_COUNT, true, "", true),
                ),
              ),
              ce(
                "div",
                { className: "unit-column unit-source-column" },
                ce(
                  "div",
                  {
                    ref: handspanRef,
                    className:
                      "unit-item-source" + (longStickPlaced ? " disabled" : ""),
                    onClick: !longStickPlaced
                      ? handlePlaceHandspans
                      : undefined,
                    style: {
                      cursor: longStickPlaced ? "default" : "pointer",
                      opacity: longStickPlaced ? 0.5 : 1,
                    },
                  },
                  ce("img", { src: "assets/handspan.png", alt: "hand span" }),
                ),
                ce(
                  "div",
                  { className: "unit-label" },
                  APP_DATA.step1.unitLabel,
                ),
              ),
            ),
          ),
        ),
        ce(Navigation, {
          onNav: () => {},
          isPrevDisabled: true,
          isNextDisabled: true,
          navText: APP_DATA.step1.navText,
        }),
      ),
    );
  }

  // ===== STEP 2: NUMPAD FOR LONG STICK =====
  if (currentStep === 2) {
    const questionParts = APP_DATA.step2.questionText.split("{{input}}");
    let inputBoxClass = "input-box";
    if (numpadFeedback === "correct") inputBoxClass += " correct";
    else if (numpadFeedback === "wrong") inputBoxClass += " wrong";

    let feedbackText = null;
    let feedbackClass = "";
    if (numpadFeedback === "correct") {
      feedbackText = APP_DATA.step2.correctFeedback;
      feedbackClass = "correct";
    } else if (numpadFeedback === "wrong") {
      feedbackText = APP_DATA.step2.wrongFeedback;
      feedbackClass = "wrong";
    }

    const navText =
      numpadFeedback === "correct"
        ? APP_DATA.step2.navCorrect
        : APP_DATA.step2.navText;

    return renderWithNudge(
      ce(
        "div",
        { className: "applet-container" },
        ce(
          "div",
          { className: "with-character-layout" },
          ce(CharacterPanel, {
            characterImage: getCharacterImage(),
            characterText: APP_DATA.step2.characterText,
          }),
          ce(
            ContentPanel,
            null,
            ce(
              "div",
              { className: "step-content" },
              ce(
                "div",
                { className: "object-column" },
                ce(
                  "div",
                  { className: "question-div" },
                  questionParts[0],
                  ce(
                    "span",
                    { className: inputBoxClass },
                    !numpadAnswer || numpadAnswer === "" ? "?" : numpadAnswer,
                  ),
                  questionParts[1],
                ),
                ce(
                  "div",
                  { className: "object-image-area" },
                  ce("img", {
                    src: "assets/longstick.png",
                    className: "measure-object-image",
                    alt: "stick",
                  }),
                  renderPlacedUnits(LONG_STICK_COUNT, false, "", false, {
                    show: showCountDivs,
                    visible: countDivsVisible,
                    correct: numpadFeedback === "correct",
                  }),
                ),
              ),
              ce(
                "div",
                { className: "unit-column numpad-column" },
                ce(Numpad, {
                  disabled: numpadDisabled,
                  onNumberClick: handleNumpadClick,
                  onClear: handleNumpadClear,
                  onSubmit: handleNumpadSubmit,
                  playClickOnSubmit: false,
                }),
                ce(
                  "div",
                  {
                    className:
                      "feedback-box " +
                      feedbackClass +
                      (feedbackText ? " show" : ""),
                  },
                  feedbackText || "",
                ),
              ),
            ),
          ),
        ),
        ce(Navigation, {
          onNav: (dir) => {
            if (dir === "next") handleNext();
          },
          isPrevDisabled: true,
          isNextDisabled: numpadFeedback !== "correct",
          navText: navText,
          nextButtonRef: nextButtonRef,
        }),
      ),
    );
  }

  // ===== STEP 3: PLACE HANDSPANS ON SHORT STICK =====
  if (currentStep === 3) {
    return renderWithNudge(
      ce(
        "div",
        { className: "applet-container" },
        ce(
          "div",
          { className: "with-character-layout" },
          ce(CharacterPanel, {
            characterImage: getCharacterImage(),
            characterText: APP_DATA.step3.characterText,
          }),
          ce(
            ContentPanel,
            null,
            ce(
              "div",
              { className: "step-content" },
              ce(
                "div",
                { className: "object-column" },
                ce(
                  "div",
                  { className: "object-image-area" },
                  ce("img", {
                    src: "assets/shortstick.png",
                    className: "measure-object-image short-stick",
                    alt: "stick",
                  }),
                  shortStickPlaced &&
                    renderPlacedUnits(SHORT_STICK_COUNT, true, "short", true),
                ),
              ),
              ce(
                "div",
                { className: "unit-column unit-source-column" },
                ce(
                  "div",
                  {
                    ref: handspanRef,
                    className:
                      "unit-item-source" +
                      (shortStickPlaced ? " disabled" : ""),
                    onClick: !shortStickPlaced
                      ? handlePlaceHandspans
                      : undefined,
                    style: {
                      cursor: shortStickPlaced ? "default" : "pointer",
                      opacity: shortStickPlaced ? 0.5 : 1,
                    },
                  },
                  ce("img", { src: "assets/handspan.png", alt: "hand span" }),
                ),
                ce(
                  "div",
                  { className: "unit-label" },
                  APP_DATA.step3.unitLabel,
                ),
              ),
            ),
          ),
        ),
        ce(Navigation, {
          onNav: (dir) => {
            if (dir === "prev") handlePrev();
          },
          isPrevDisabled: false,
          isNextDisabled: true,
          navText: APP_DATA.step3.navText,
          nextButtonRef: nextButtonRef,
        }),
      ),
    );
  }

  // ===== STEP 4: NUMPAD FOR SHORT STICK =====
  if (currentStep === 4) {
    const questionParts = APP_DATA.step4.questionText.split("{{input}}");
    let inputBoxClass = "input-box";
    if (numpadFeedback === "correct") inputBoxClass += " correct";
    else if (numpadFeedback === "wrong") inputBoxClass += " wrong";

    let feedbackText = null;
    let feedbackClass = "";
    if (numpadFeedback === "correct") {
      feedbackText = APP_DATA.step4.correctFeedback;
      feedbackClass = "correct";
    } else if (numpadFeedback === "wrong") {
      feedbackText = APP_DATA.step4.wrongFeedback;
      feedbackClass = "wrong";
    }

    const navText =
      numpadFeedback === "correct"
        ? APP_DATA.step4.navCorrect
        : APP_DATA.step4.navText;

    return renderWithNudge(
      ce(
        "div",
        { className: "applet-container" },
        ce(
          "div",
          { className: "with-character-layout" },
          ce(CharacterPanel, {
            characterImage: getCharacterImage(),
            characterText: APP_DATA.step4.characterText,
          }),
          ce(
            ContentPanel,
            null,
            ce(
              "div",
              { className: "step-content" },
              ce(
                "div",
                { className: "object-column" },
                ce(
                  "div",
                  { className: "question-div" },
                  questionParts[0],
                  ce(
                    "span",
                    { className: inputBoxClass },
                    !numpadAnswer || numpadAnswer === "" ? "?" : numpadAnswer,
                  ),
                  questionParts[1],
                ),
                ce(
                  "div",
                  { className: "object-image-area" },
                  ce("img", {
                    src: "assets/shortstick.png",
                    className: "measure-object-image short-stick",
                    alt: "stick",
                  }),
                  renderPlacedUnits(SHORT_STICK_COUNT, false, "short", false, {
                    show: showCountDivs,
                    visible: countDivsVisible,
                    correct: numpadFeedback === "correct",
                  }),
                ),
              ),
              ce(
                "div",
                { className: "unit-column numpad-column" },
                ce(Numpad, {
                  disabled: numpadDisabled,
                  onNumberClick: handleNumpadClick,
                  onClear: handleNumpadClear,
                  onSubmit: handleNumpadSubmit,
                  playClickOnSubmit: false,
                }),
                ce(
                  "div",
                  {
                    className:
                      "feedback-box " +
                      feedbackClass +
                      (feedbackText ? " show" : ""),
                  },
                  feedbackText || "",
                ),
              ),
            ),
          ),
        ),
        ce(Navigation, {
          onNav: (dir) => {
            if (dir === "prev") handlePrev();
            if (dir === "next") handleNext();
          },
          isPrevDisabled: false,
          isNextDisabled: numpadFeedback !== "correct",
          navText: navText,
          nextButtonRef: nextButtonRef,
        }),
      ),
    );
  }

  // ===== STEP 5: COMPARE STICKS =====
  if (currentStep === 5) {
    let ct = APP_DATA.step5.characterText;
    if (compareAnswered && compareSubstep === 1) ct = APP_DATA.step5.ctCorrect;
    else if (compareAnswered && compareSubstep === 2) ct = APP_DATA.step5.ctCorrect2;

    let navText = APP_DATA.step5.navText;
    if (compareAnswered && compareSubstep === 1) navText = APP_DATA.step5.navCorrect;
    else if (compareAnswered && compareSubstep === 2) navText = APP_DATA.step5.navCorrect2;

    const labelA = APP_DATA.step5.labelA;
    const labelB = APP_DATA.step5.labelB;
    const absLabelA = compareAnswered ? APP_DATA.step5.labelLonger : null;
    const absLabelB = compareAnswered ? APP_DATA.step5.labelShorter : null;

    return renderWithNudge(
      ce(
        "div",
        { className: "applet-container" },
        ce(
          "div",
          { className: "with-character-layout" },
          ce(CharacterPanel, {
            characterImage: getCharacterImage(),
            characterText: ct,
          }),
          ce(
            ContentPanel,
            null,
            ce(CompareStick, {
              mode: (compareAnswered && compareSubstep === 2) ? "arrows" : "compare",
              labelA: labelA,
              labelB: labelB,
              absLabelA: absLabelA,
              absLabelB: absLabelB,
              clickable: !compareAnswered,
              onClickA: handleClickStickA,
              onClickB: handleClickStickB,
              stickAClass: compareResult === "correct" ? "correct" : "",
              stickBClass: compareResult === "wrong" ? "wrong" : "",
              arrowLabelLong: APP_DATA.step5.arrowLabelLong,
              arrowLabelShort: APP_DATA.step5.arrowLabelShort,
            }),
          ),
        ),
        ce(Navigation, {
          onNav: (dir) => {
            if (dir === "prev") handlePrev();
            if (dir === "next") handleNext();
          },
          isPrevDisabled: false,
          isNextDisabled: !compareAnswered,
          navText: navText,
          nextButtonRef: nextButtonRef,
        }),
      ),
    );
  }

  // ===== STEP 6: CLASSROOM IMAGE =====
  if (currentStep === 6) {
    return renderWithNudge(
      ce(
        "div",
        { className: "applet-container" },
        ce(
          "div",
          { className: "with-character-layout" },
          ce(CharacterPanel, {
            characterImage: getCharacterImage(),
            characterText: APP_DATA.step6.characterText,
          }),
          ce(
            ContentPanel,
            null,
            ce(
              "div",
              { className: "full-image-6" },
              ce("img", {
                src: "assets/classroom.png",
                alt: "classroom",
              }),
            ),
          ),
        ),
        ce(Navigation, {
          onNav: (dir) => {
            if (dir === "prev") handlePrev();
            if (dir === "next") handleNext();
          },
          isPrevDisabled: false,
          isNextDisabled: false,
          navText: APP_DATA.step6.navText,
          nextButtonRef: nextButtonRef,
        }),
      ),
    );
  }

  // ===== STEP 7: PLACE HANDSPANS ON BOARD =====
  if (currentStep === 7) {
    return renderWithNudge(
      ce(
        "div",
        { className: "applet-container" },
        ce(
          "div",
          { className: "with-character-layout" },
          ce(CharacterPanel, {
            characterImage: getCharacterImage(),
            characterText: APP_DATA.step7.characterText,
          }),
          ce(
            ContentPanel,
            null,
            ce(
              "div",
              { className: "step-content" },
              ce(
                "div",
                { className: "object-column" },
                ce(
                  "div",
                  { className: "object-image-area" },
                  ce("img", {
                    src: "assets/board.png",
                    className: "measure-object-image",
                    alt: "board",
                  }),
                  boardPlaced &&
                    renderPlacedUnits(BOARD_COUNT, true, "", true),
                ),
              ),
              ce(
                "div",
                { className: "unit-column unit-source-column" },
                ce(
                  "div",
                  {
                    ref: handspanRef,
                    className:
                      "unit-item-source" + (boardPlaced ? " disabled" : ""),
                    onClick: !boardPlaced
                      ? handlePlaceHandspans
                      : undefined,
                    style: {
                      cursor: boardPlaced ? "default" : "pointer",
                      opacity: boardPlaced ? 0.5 : 1,
                    },
                  },
                  ce("img", { src: "assets/handspan.png", alt: "hand span" }),
                ),
                ce(
                  "div",
                  { className: "unit-label" },
                  APP_DATA.step7.unitLabel,
                ),
              ),
            ),
          ),
        ),
        ce(Navigation, {
          onNav: (dir) => {
            if (dir === "prev") handlePrev();
          },
          isPrevDisabled: false,
          isNextDisabled: true,
          navText: APP_DATA.step7.navText,
        }),
      ),
    );
  }

  // ===== STEP 8: NUMPAD FOR BOARD =====
  if (currentStep === 8) {
    const questionParts = APP_DATA.step8.questionText.split("{{input}}");
    let inputBoxClass = "input-box";
    if (numpadFeedback === "correct") inputBoxClass += " correct";
    else if (numpadFeedback === "wrong") inputBoxClass += " wrong";

    let feedbackText = null;
    let feedbackClass = "";
    if (numpadFeedback === "correct") {
      feedbackText = APP_DATA.step8.correctFeedback;
      feedbackClass = "correct";
    } else if (numpadFeedback === "wrong") {
      feedbackText = APP_DATA.step8.wrongFeedback;
      feedbackClass = "wrong";
    }

    const navText =
      numpadFeedback === "correct"
        ? APP_DATA.step8.navCorrect
        : APP_DATA.step8.navText;

    return renderWithNudge(
      ce(
        "div",
        { className: "applet-container" },
        ce(
          "div",
          { className: "with-character-layout" },
          ce(CharacterPanel, {
            characterImage: getCharacterImage(),
            characterText: APP_DATA.step8.characterText,
          }),
          ce(
            ContentPanel,
            null,
            ce(
              "div",
              { className: "step-content" },
              ce(
                "div",
                { className: "object-column" },
                ce(
                  "div",
                  { className: "question-div" },
                  questionParts[0],
                  ce(
                    "span",
                    { className: inputBoxClass },
                    !numpadAnswer || numpadAnswer === "" ? "?" : numpadAnswer,
                  ),
                  questionParts[1],
                ),
                ce(
                  "div",
                  { className: "object-image-area" },
                  ce("img", {
                    src: "assets/board.png",
                    className: "measure-object-image",
                    alt: "board",
                  }),
                  renderPlacedUnits(BOARD_COUNT, false, "", false, {
                    show: showCountDivs,
                    visible: countDivsVisible,
                    correct: numpadFeedback === "correct",
                  }),
                ),
              ),
              ce(
                "div",
                { className: "unit-column numpad-column" },
                ce(Numpad, {
                  disabled: numpadDisabled,
                  onNumberClick: handleNumpadClick,
                  onClear: handleNumpadClear,
                  onSubmit: handleNumpadSubmit,
                  playClickOnSubmit: false,
                }),
                ce(
                  "div",
                  {
                    className:
                      "feedback-box " +
                      feedbackClass +
                      (feedbackText ? " show" : ""),
                  },
                  feedbackText || "",
                ),
              ),
            ),
          ),
        ),
        ce(Navigation, {
          onNav: (dir) => {
            if (dir === "prev") handlePrev();
            if (dir === "next") handleNext();
          },
          isPrevDisabled: false,
          isNextDisabled: numpadFeedback !== "correct",
          navText: navText,
          nextButtonRef: nextButtonRef,
        }),
      ),
    );
  }

  // ===== STEP 9: PLACE HANDSPANS ON CUPBOARD =====
  if (currentStep === 9) {
    return renderWithNudge(
      ce(
        "div",
        { className: "applet-container" },
        ce(
          "div",
          { className: "with-character-layout" },
          ce(CharacterPanel, {
            characterImage: getCharacterImage(),
            characterText: APP_DATA.step9.characterText,
          }),
          ce(
            ContentPanel,
            null,
            ce(
              "div",
              { className: "step-content" },
              ce(
                "div",
                { className: "object-column" },
                ce(
                  "div",
                  { className: "object-image-area" },
                  ce("img", {
                    src: "assets/cupboard.png",
                    className: "measure-object-image cupboard-img",
                    alt: "cupboard",
                  }),
                  cupboardPlaced &&
                    renderPlacedUnits(CUPBOARD_COUNT, true, "cupboard", true),
                ),
              ),
              ce(
                "div",
                { className: "unit-column unit-source-column" },
                ce(
                  "div",
                  {
                    ref: handspanRef,
                    className:
                      "unit-item-source" +
                      (cupboardPlaced ? " disabled" : ""),
                    onClick: !cupboardPlaced
                      ? handlePlaceHandspans
                      : undefined,
                    style: {
                      cursor: cupboardPlaced ? "default" : "pointer",
                      opacity: cupboardPlaced ? 0.5 : 1,
                    },
                  },
                  ce("img", { src: "assets/handspan.png", alt: "hand span" }),
                ),
                ce(
                  "div",
                  { className: "unit-label" },
                  APP_DATA.step9.unitLabel,
                ),
              ),
            ),
          ),
        ),
        ce(Navigation, {
          onNav: (dir) => {
            if (dir === "prev") handlePrev();
          },
          isPrevDisabled: false,
          isNextDisabled: true,
          navText: APP_DATA.step9.navText,
          nextButtonRef: nextButtonRef,
        }),
      ),
    );
  }

  // ===== STEP 10: NUMPAD FOR CUPBOARD =====
  if (currentStep === 10) {
    const questionParts = APP_DATA.step10.questionText.split("{{input}}");
    let inputBoxClass = "input-box";
    if (numpadFeedback === "correct") inputBoxClass += " correct";
    else if (numpadFeedback === "wrong") inputBoxClass += " wrong";

    let feedbackText = null;
    let feedbackClass = "";
    if (numpadFeedback === "correct") {
      feedbackText = APP_DATA.step10.correctFeedback;
      feedbackClass = "correct";
    } else if (numpadFeedback === "wrong") {
      feedbackText = APP_DATA.step10.wrongFeedback;
      feedbackClass = "wrong";
    }

    const navText =
      numpadFeedback === "correct"
        ? APP_DATA.step10.navCorrect
        : APP_DATA.step10.navText;

    return renderWithNudge(
      ce(
        "div",
        { className: "applet-container" },
        ce(
          "div",
          { className: "with-character-layout" },
          ce(CharacterPanel, {
            characterImage: getCharacterImage(),
            characterText: APP_DATA.step10.characterText,
          }),
          ce(
            ContentPanel,
            null,
            ce(
              "div",
              { className: "step-content" },
              ce(
                "div",
                { className: "object-column" },
                ce(
                  "div",
                  { className: "question-div" },
                  questionParts[0],
                  ce(
                    "span",
                    { className: inputBoxClass },
                    !numpadAnswer || numpadAnswer === "" ? "?" : numpadAnswer,
                  ),
                  questionParts[1],
                ),
                ce(
                  "div",
                  { className: "object-image-area" },
                  ce("img", {
                    src: "assets/cupboard.png",
                    className: "measure-object-image cupboard-img",
                    alt: "cupboard",
                  }),
                  renderPlacedUnits(CUPBOARD_COUNT, false, "cupboard", false, {
                    show: showCountDivs,
                    visible: countDivsVisible,
                    correct: numpadFeedback === "correct",
                  }),
                ),
              ),
              ce(
                "div",
                { className: "unit-column numpad-column" },
                ce(Numpad, {
                  disabled: numpadDisabled,
                  onNumberClick: handleNumpadClick,
                  onClear: handleNumpadClear,
                  onSubmit: handleNumpadSubmit,
                  playClickOnSubmit: false,
                }),
                ce(
                  "div",
                  {
                    className:
                      "feedback-box " +
                      feedbackClass +
                      (feedbackText ? " show" : ""),
                  },
                  feedbackText || "",
                ),
              ),
            ),
          ),
        ),
        ce(Navigation, {
          onNav: (dir) => {
            if (dir === "prev") handlePrev();
            if (dir === "next") handleNext();
          },
          isPrevDisabled: false,
          isNextDisabled: numpadFeedback !== "correct",
          navText: navText,
          nextButtonRef: nextButtonRef,
        }),
      ),
    );
  }

  // ===== STEP 11: OPTIONS QUIZ =====
  if (currentStep === 11) {
    let ct = APP_DATA.step11.characterText;
    if (quizFeedback === "wrong") {
      ct = APP_DATA.step11.wrongFeedback;
    } else if (quizFeedback === "correct") {
      ct = APP_DATA.step11.correctFeedback;
    }

    const navText =
      quizFeedback === "correct"
        ? APP_DATA.step11.navCorrect
        : APP_DATA.step11.navText;

    return renderWithNudge(
      ce(
        "div",
        { className: "applet-container" },
        ce(
          "div",
          { className: "with-character-layout" },
          ce(CharacterPanel, {
            characterImage: getCharacterImage(),
            characterText: ct,
          }),
          ce(
            ContentPanel,
            null,
            ce(OptionsQuiz, {
              questionIndex: 0,
              correctAnswer: APP_DATA.step11.correctAnswer,
              feedback: quizFeedback,
              leftImg: "q0l.svg",
              rightImg: "q0r.svg",
              onLeftClick: handleQuizLeftClick,
              onRightClick: handleQuizRightClick,
              labelTaller: APP_DATA.step11.labelLonger,
              labelShorter: APP_DATA.step11.labelShorter,
              leftSubText: APP_DATA.step11.leftSubText,
              rightSubText: APP_DATA.step11.rightSubText,
            }),
          ),
        ),
        ce(Navigation, {
          onNav: (dir) => {
            if (dir === "prev") handlePrev();
            if (dir === "next") handleNext();
          },
          isPrevDisabled: false,
          isNextDisabled: quizFeedback !== "correct",
          navText: navText,
          nextButtonRef: nextButtonRef,
        }),
      ),
    );
  }

  // ===== STEP 13: OPTIONS QUIZ ARRAY =====
  if (currentStep === 13) {
    const qData = APP_DATA.step13.questions[questionIndex];
    let ct = qData.characterText;
    if (quizFeedback === "wrong") {
      ct = qData.wrongFeedback;
    } else if (quizFeedback === "correct") {
      ct = qData.correctFeedback;
    }

    let navText = APP_DATA.step13.navText;
    if (quizFeedback === "correct") {
      if (questionIndex === APP_DATA.step13.questions.length - 1) {
        navText = APP_DATA.step13.navCorrectLast;
      } else {
        navText = APP_DATA.step13.navCorrect;
      }
    }

    const qNum = questionIndex + 1;
    const leftImg = `q${qNum}l.svg`;
    const rightImg = `q${qNum}r.svg`;

    return renderWithNudge(
      ce(
        "div",
        { className: "applet-container" },
        ce(
          "div",
          { className: "with-character-layout" },
          ce(CharacterPanel, {
            characterImage: getCharacterImage(),
            characterText: ct,
          }),
          ce(
            ContentPanel,
            null,
            ce(OptionsQuiz, {
              questionIndex: questionIndex,
              correctAnswer: qData.correctAnswer,
              feedback: quizFeedback,
              leftImg: leftImg,
              rightImg: rightImg,
              onLeftClick: handleQuizLeftClick,
              onRightClick: handleQuizRightClick,
              labelTaller: APP_DATA.step13.labelLonger,
              labelShorter: APP_DATA.step13.labelShorter,
            }),
          ),
        ),
        ce(Navigation, {
          onNav: (dir) => {
            if (dir === "prev") handlePrev();
            if (dir === "next") handleNext();
          },
          isPrevDisabled: false,
          isNextDisabled: quizFeedback !== "correct",
          navText: navText,
          nextButtonRef: nextButtonRef,
        }),
      ),
    );
  }

  // ===== STEP 14: FULLSCREEN START OVER =====
  if (currentStep === 14) {
    return renderWithNudge(
      ce(
        "div",
        { className: "applet-container" },
        ce(
          "div",
          { className: "app-main-content", style: { position: "relative" } },
          ce(Fullscreen, {
            heading: APP_DATA.step14.heading,
            text: APP_DATA.step14.text,
            buttonText: APP_DATA.step14.buttonText,
            onButtonClick: handleStartOver,
            buttonRef: fullscreenButtonRef,
          }),
        ),
      ),
    );
  }

  return null;
};
