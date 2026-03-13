const App = () => {
  const { useState, useEffect, useRef } = React;
  const ce = React.createElement;

  const LONG_STICK_COUNT = 7;
  const SHORT_STICK_COUNT = 5;

  const [currentStep, setCurrentStep] = useState(0);
  const [longStickPlaced, setLongStickPlaced] = useState(false);
  const [shortStickPlaced, setShortStickPlaced] = useState(false);
  const [numpadAnswer, setNumpadAnswer] = useState("");
  const [numpadFeedback, setNumpadFeedback] = useState(null);
  const [numpadDisabled, setNumpadDisabled] = useState(false);
  const [showCountDivs, setShowCountDivs] = useState(false);
  const [countDivsVisible, setCountDivsVisible] = useState(0);
  const [compareResult, setCompareResult] = useState(null);
  const [compareAnswered, setCompareAnswered] = useState(false);
  const [quizQuestionIndex, setQuizQuestionIndex] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState(null);

  const placedUnitsRef = useRef(null);
  const animatingRef = useRef(false);
  const fullscreenButtonRef = useRef(null);
  const handspanRef = useRef(null);
  const nextButtonRef = useRef(null);
  const [nudgeState, setNudgeState] = React.useState({
    show: false,
    position: null,
  });

  const getCharacterImage = () => {
    if (currentStep === 2 || currentStep === 4) {
      if (numpadFeedback === "wrong") return "charsad.png";
      if (numpadFeedback === "correct") return "charhappy.png";
    }
    if (currentStep === 5) {
      if (compareResult === "wrong") return "charsad.png";
      if (compareAnswered) return "charhappy.png";
    }
    if (currentStep === 7) {
      if (quizFeedback === "wrong") return "charsad.png";
      if (quizFeedback === "correct") return "charhappy.png";
    }
    return "chardefault.png";
  };

  // Animate stagger for step 1 (long stick)
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

  // Animate stagger for step 3 (short stick)
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

  // Stagger count divs in steps 2 and 4
  useEffect(() => {
    if ((currentStep !== 2 && currentStep !== 4) || !showCountDivs) return;
    const correctCount =
      currentStep === 2 ? LONG_STICK_COUNT : SHORT_STICK_COUNT;
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
    if (currentStep === 0) {
      show = true;
      targetRef = fullscreenButtonRef;
    } else if ((currentStep === 1 && !longStickPlaced) || (currentStep === 3 && !shortStickPlaced)) {
      show = true;
      targetRef = handspanRef;
    } else {
      const nextEnabled =
        (currentStep === 2 && numpadFeedback === "correct") ||
        (currentStep === 4 && numpadFeedback === "correct") ||
        (currentStep === 5 && compareAnswered) ||
        currentStep === 6 ||
        (currentStep === 7 && quizFeedback === "correct");
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
        position: { left: rect.left, top: rect.top, width: rect.width, height: rect.height },
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
    const correctAns =
      currentStep === 2 ? LONG_STICK_COUNT : SHORT_STICK_COUNT;
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
    const q = APP_DATA.questions[quizQuestionIndex];
    if (q.correctAnswer === "left") {
      playSound("correct");
      setQuizFeedback("correct");
    } else {
      playSound("wrong");
      setQuizFeedback("wrong");
    }
  };

  const handleQuizRightClick = () => {
    if (quizFeedback === "correct") return;
    const q = APP_DATA.questions[quizQuestionIndex];
    if (q.correctAnswer === "right") {
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
    setNumpadAnswer("");
    setNumpadFeedback(null);
    setNumpadDisabled(false);
    setShowCountDivs(false);
    setCountDivsVisible(0);
    setCompareResult(null);
    setCompareAnswered(false);
    setQuizQuestionIndex(0);
    setQuizFeedback(null);
  };

  const handleNext = () => {
    playSound("click");
    if (currentStep === 2 && numpadFeedback === "correct") {
      setNumpadAnswer("");
      setNumpadFeedback(null);
      setNumpadDisabled(false);
      setShowCountDivs(false);
      setCurrentStep(3);
    } else if (currentStep === 4 && numpadFeedback === "correct") {
      setShowCountDivs(false);
      setCurrentStep(5);
    } else if (currentStep === 5 && compareAnswered) {
      setCurrentStep(6);
    } else if (currentStep === 6) {
      setQuizQuestionIndex(0);
      setQuizFeedback(null);
      setCurrentStep(7);
    } else if (currentStep === 7 && quizFeedback === "correct") {
      const isLast =
        quizQuestionIndex >= APP_DATA.questions.length - 1;
      if (isLast) {
        setCurrentStep(8);
      } else {
        setQuizQuestionIndex((prev) => prev + 1);
        setQuizFeedback(null);
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
      setNumpadAnswer("");
      setNumpadFeedback(null);
      setNumpadDisabled(false);
      setShowCountDivs(false);
      setCurrentStep(3);
    } else if (currentStep === 5) {
      setNumpadAnswer(String(SHORT_STICK_COUNT));
      setNumpadFeedback("correct");
      setNumpadDisabled(true);
      setShowCountDivs(true);
      setCountDivsVisible(SHORT_STICK_COUNT);
      setCompareResult(null);
      setCompareAnswered(false);
      setCurrentStep(4);
    } else if (currentStep === 6) {
      setCompareResult("correct");
      setCompareAnswered(true);
      setCurrentStep(5);
    } else if (currentStep === 7) {
      if (quizQuestionIndex === 0) {
        setQuizFeedback(null);
        setCurrentStep(6);
      } else {
        setQuizQuestionIndex((prev) => prev - 1);
        setQuizFeedback(null);
      }
    }
  };

  // ===== RENDER HELPERS =====

  const renderPlacedUnits = (
    count,
    withRef,
    isShort,
    initialHidden,
    countDivsOpts,
  ) => {
    const items = [];
    const baseStyle = { height: 100 / count + "%" };
    const hiddenStyle = initialHidden
      ? { opacity: 0, transform: "scale(0)", transformOrigin: "center center" }
      : {};
    const showCountDivs = countDivsOpts && countDivsOpts.show;
    const countDivsVisible = countDivsOpts ? countDivsOpts.visible : 0;
    const countDivsCorrect = countDivsOpts && countDivsOpts.correct;
    for (let i = 0; i < count; i++) {
      const unitChildren = [
        ce("img", { src: "assets/handspan.png", alt: "hand span" }),
      ];
      if (showCountDivs && i < countDivsVisible) {
        unitChildren.push(
          ce(
            "div",
            {
              key: "cd-" + i,
              className:
                "count-div" + (countDivsCorrect ? " count-correct" : ""),
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
      className: "placed-units-container" + (isShort ? " short" : ""),
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

  // ===== STEP 7: OPTIONS QUIZ =====
  if (currentStep === 7) {
    const q = APP_DATA.questions[quizQuestionIndex];
    const qNum = quizQuestionIndex + 1;
    let ct = q.characterText;
    if (quizFeedback === "wrong") {
      ct =
        q.wrongFeedback === "taller"
          ? APP_DATA.step7.wrongFeedbackTaller
          : APP_DATA.step7.wrongFeedbackShorter;
    } else if (quizFeedback === "correct") {
      ct = APP_DATA.step7.correctFeedback;
    }
    const isLast = quizQuestionIndex >= APP_DATA.questions.length - 1;
    const navText = quizFeedback === "correct"
      ? isLast
        ? APP_DATA.step7.navCorrectLast
        : APP_DATA.step7.navCorrect
      : APP_DATA.step7.navText;

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
              questionIndex: quizQuestionIndex,
              correctAnswer: q.correctAnswer,
              feedback: quizFeedback,
              leftImg: "q" + qNum + "l.svg",
              rightImg: "q" + qNum + "r.svg",
              onLeftClick: handleQuizLeftClick,
              onRightClick: handleQuizRightClick,
              labelTaller: APP_DATA.step7.labelTaller,
              labelShorter: APP_DATA.step7.labelShorter,
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
    ));
  }

  // ===== STEP 8: FULLSCREEN START OVER =====
  if (currentStep === 8) {
    return renderWithNudge(
      ce(
        "div",
        { className: "applet-container" },
        ce(
          "div",
          { className: "app-main-content", style: { position: "relative" } },
          ce(Fullscreen, {
            heading: APP_DATA.step8.heading,
            text: APP_DATA.step8.text,
            buttonText: APP_DATA.step8.buttonText,
            onButtonClick: handleStartOver,
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
                  longStickPlaced &&
                    renderPlacedUnits(LONG_STICK_COUNT, true, false, true),
                  ce("img", {
                    src: "assets/longstick.png",
                    className: "measure-object-image",
                    alt: "stick",
                  }),
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
                    onClick: !longStickPlaced ? handlePlaceHandspans : undefined,
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
    ));
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
                  renderPlacedUnits(LONG_STICK_COUNT, false, false, false, {
                    show: showCountDivs,
                    visible: countDivsVisible,
                    correct: numpadFeedback === "correct",
                  }),
                  ce("img", {
                    src: "assets/longstick.png",
                    className: "measure-object-image",
                    alt: "stick",
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
      )
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
                  shortStickPlaced &&
                    renderPlacedUnits(SHORT_STICK_COUNT, true, true, true),
                  ce("img", {
                    src: "assets/shortstick.png",
                    className: "measure-object-image short-stick",
                    alt: "stick",
                  }),
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
                renderPlacedUnits(SHORT_STICK_COUNT, false, true, false, {
                  show: showCountDivs,
                  visible: countDivsVisible,
                  correct: numpadFeedback === "correct",
                }),
                ce("img", {
                  src: "assets/shortstick.png",
                  className: "measure-object-image short-stick",
                  alt: "stick",
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
    ));
  }

  // ===== STEP 5: COMPARE STICKS =====
  if (currentStep === 5) {
    const ct = compareAnswered
      ? APP_DATA.step5.ctCorrect
      : APP_DATA.step5.characterText;
    const navText = compareAnswered
      ? APP_DATA.step5.navCorrect
      : APP_DATA.step5.navText;
    const labelA = compareAnswered
      ? APP_DATA.step5.labelTaller
      : APP_DATA.step5.labelA;
    const labelB = compareAnswered
      ? APP_DATA.step5.labelShorter
      : APP_DATA.step5.labelB;

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
              mode: "compare",
              labelA: labelA,
              labelB: labelB,
              clickable: !compareAnswered,
              onClickA: handleClickStickA,
              onClickB: handleClickStickB,
              stickAClass: compareResult === "correct" ? "correct" : "",
              stickBClass: compareResult === "wrong" ? "wrong" : "",
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

  // ===== STEP 6: ARROWS COMPARISON =====
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
            ce(CompareStick, {
              mode: "arrows",
              labelA: APP_DATA.step6.labelTaller,
              labelB: APP_DATA.step6.labelShorter,
              clickable: false,
              stickAClass: "",
              stickBClass: "",
              arrowLabelLong: APP_DATA.step6.arrowLabelLong,
              arrowLabelShort: APP_DATA.step6.arrowLabelShort,
            }),
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

  return null;
};
