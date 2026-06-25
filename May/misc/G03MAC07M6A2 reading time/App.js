const App = () => {
  const { useState, useEffect, useRef } = React;
  const e = React.createElement;

  const questions = APP_DATA.questions;
  const totalQuestions = questions.length;

  const [currentStep, setCurrentStep] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);

  const [step4Done, setStep4Done] = useState(false);
  const [mcqSelected, setMcqSelected] = useState(null);
  const [mcqCorrect, setMcqCorrect] = useState(null);
  const [step5Done, setStep5Done] = useState(false);

  const [numpadValue, setNumpadValue] = useState("");
  const [numpadStatus, setNumpadStatus] = useState("");
  const [step6Done, setStep6Done] = useState(false);
  const [step7Done, setStep7Done] = useState(false);
  const [step8Done, setStep8Done] = useState(false);

  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackType, setFeedbackType] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [charImage, setCharImage] = useState("normal.png");
  const [numpadDisabled, setNumpadDisabled] = useState(false);

  const wrongTimerRef = useRef(null);
  const numCircleTargetRef = useRef(null);
  const [nudgePosition, setNudgePosition] = useState(null);

  const q = questions[questionIndex];
  const isLastQuestion = questionIndex >= totalQuestions - 1;

  const resetInteractiveState = () => {
    setStep4Done(false);
    setMcqSelected(null);
    setMcqCorrect(null);
    setStep5Done(false);
    setNumpadValue("");
    setNumpadStatus("");
    setStep6Done(false);
    setStep7Done(false);
    setStep8Done(false);
    setFeedbackText("");
    setFeedbackType("");
    setShowFeedback(false);
    setCharImage("normal.png");
    setNumpadDisabled(false);
  };

  const resetAll = () => {
    playSound("click");
    setCurrentStep(0);
    setQuestionIndex(0);
    resetInteractiveState();
  };

  const restoreQuestionStep8Done = (question) => {
    setStep4Done(true);
    setStep5Done(true);
    setMcqSelected(question.mcq.options[question.mcq.correctIndex]);
    setMcqCorrect(true);
    setStep6Done(true);
    setStep7Done(true);
    setStep8Done(true);
    setNumpadValue(String(question.numpad.step8.answer));
    setNumpadStatus("correct");
    setNumpadDisabled(true);
    setFeedbackText("");
    setFeedbackType("");
    setShowFeedback(false);
    setCharImage("normal.png");
  };

  const clearFeedback = () => {
    setFeedbackText("");
    setFeedbackType("");
    setShowFeedback(false);
    setCharImage("normal.png");
  };

  const doWrongFeedback = (text) => {
    setFeedbackText(text);
    setFeedbackType("incorrect");
    setShowFeedback(true);
    setCharImage("sad.png");
    playSound("wrong");
  };

  const doCorrectFeedback = (text) => {
    setFeedbackText(text);
    setFeedbackType("correct");
    setShowFeedback(true);
    setCharImage("happy.png");
    playSound("correct");
  };

  const clearNumpadProgress = () => {
    setNumpadValue("");
    setNumpadStatus("");
    clearFeedback();
    setNumpadDisabled(false);
  };

  const clearFromStep5 = () => {
    setMcqSelected(null);
    setMcqCorrect(null);
    setStep5Done(false);
    clearNumpadProgress();
    setStep6Done(false);
    setStep7Done(false);
    setStep8Done(false);
  };

  const clearFromStep6 = () => {
    clearNumpadProgress();
    setStep6Done(false);
    setStep7Done(false);
    setStep8Done(false);
  };

  const clearFromStep7 = () => {
    clearNumpadProgress();
    setStep7Done(false);
    setStep8Done(false);
  };

  const clearFromStep8 = () => {
    clearNumpadProgress();
    setStep8Done(false);
  };

  const handleNumCircleClick = (num) => {
    if (currentStep !== 4 || step4Done) return;
    if (num === q.crossedNumber) {
      playSound("correct");
      setStep4Done(true);
      setTimeout(() => {
        setCurrentStep(5);
        clearFeedback();
      }, 400);
    } else {
      playSound("wrong");
    }
  };

  const handleMcqClick = (option) => {
    if (step5Done) return;
    const correctOp = q.mcq.options[q.mcq.correctIndex];
    const isCorrect = option === correctOp;
    setMcqSelected(option);
    setMcqCorrect(isCorrect);
    if (isCorrect) {
      doCorrectFeedback(q.mcq.correctFeedback);
      setStep5Done(true);
    } else {
      doWrongFeedback(q.mcq.wrongFeedback);
    }
  };

  const getNumpadConfig = () => {
    if (currentStep === 6) return q.numpad.step6;
    if (currentStep === 7) return q.numpad.step7;
    if (currentStep === 8) return q.numpad.step8;
    return null;
  };

  const handleNumberClick = (num) => {
    if (showFeedback) clearFeedback();
    if (numpadValue.length >= 2) return;
    setNumpadValue(numpadValue + num);
  };

  const handleClear = () => {
    if (showFeedback) clearFeedback();
    setNumpadValue(numpadValue.slice(0, -1));
  };

  const handleNumpadSubmit = () => {
    const cfg = getNumpadConfig();
    if (!cfg || numpadValue === "") return;

    const val = parseInt(numpadValue, 10);
    if (val === cfg.answer) {
      setNumpadStatus("correct");
      doCorrectFeedback(cfg.correctFeedback);
      setNumpadValue(String(cfg.answer));
      setNumpadDisabled(true);
      if (currentStep === 6) setStep6Done(true);
      else if (currentStep === 7) setStep7Done(true);
      else if (currentStep === 8) setStep8Done(true);
    } else {
      setNumpadStatus("wrong");
      doWrongFeedback(cfg.wrongFeedback);
      if (wrongTimerRef.current) clearTimeout(wrongTimerRef.current);
      wrongTimerRef.current = setTimeout(() => {
        setNumpadStatus("");
        setNumpadValue("");
      }, 500);
    }
  };

  const handleNext = () => {
    playSound("click");
    if (currentStep === 0) setCurrentStep(1);
    else if (currentStep === 1) setCurrentStep(2);
    else if (currentStep === 2) {
      resetInteractiveState();
      setCurrentStep(3);
    } else if (currentStep === 3) setCurrentStep(4);
    else if (currentStep === 5) {
      clearNumpadProgress();
      setCurrentStep(6);
    } else if (currentStep === 6) {
      clearNumpadProgress();
      setCurrentStep(7);
    } else if (currentStep === 7) {
      clearNumpadProgress();
      setCurrentStep(8);
    } else if (currentStep === 8) {
      if (!step8Done) return;
      if (isLastQuestion) {
        setCurrentStep(9);
      } else {
        setQuestionIndex(questionIndex + 1);
        resetInteractiveState();
        setCurrentStep(4);
      }
    }
  };

  const handlePrev = () => {
    playSound("click");
    if (wrongTimerRef.current) {
      clearTimeout(wrongTimerRef.current);
      wrongTimerRef.current = null;
    }
    if (currentStep <= 1) return;

    if (currentStep === 2) {
      setCurrentStep(1);
      return;
    }
    if (currentStep === 3) {
      setCurrentStep(2);
      return;
    }
    if (currentStep === 4) {
      if (questionIndex > 0) {
        const prevIdx = questionIndex - 1;
        setQuestionIndex(prevIdx);
        restoreQuestionStep8Done(questions[prevIdx]);
        setCurrentStep(8);
        return;
      }
      setStep4Done(false);
      clearFeedback();
      setCharImage("normal.png");
      setCurrentStep(3);
      return;
    }
    if (currentStep === 5) {
      clearFromStep5();
      setStep4Done(true);
      setCurrentStep(4);
      return;
    }
    if (currentStep === 6) {
      clearFromStep6();
      setStep5Done(true);
      setMcqSelected(q.mcq.options[q.mcq.correctIndex]);
      setMcqCorrect(true);
      setCurrentStep(5);
      return;
    }
    if (currentStep === 7) {
      clearFromStep7();
      setStep6Done(true);
      setNumpadValue(String(q.numpad.step6.answer));
      setNumpadStatus("correct");
      setNumpadDisabled(true);
      setCurrentStep(6);
      return;
    }
    if (currentStep === 8) {
      clearFromStep8();
      setStep7Done(true);
      setNumpadValue(String(q.numpad.step7.answer));
      setNumpadStatus("correct");
      setNumpadDisabled(true);
      setCurrentStep(7);
    }
  };

  useEffect(() => {
    return () => {
      if (wrongTimerRef.current) clearTimeout(wrongTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (currentStep !== 4 || step4Done) {
      setNudgePosition(null);
      return;
    }

    const updateNudgePosition = () => {
      const el = numCircleTargetRef.current;
      if (!el) {
        setNudgePosition(null);
        return;
      }
      const r = el.getBoundingClientRect();
      setNudgePosition({ left: r.left, top: r.top, width: r.width, height: r.height });
    };

    updateNudgePosition();
    const layoutTimer = setTimeout(updateNudgePosition, 100);
    window.addEventListener("resize", updateNudgePosition);
    return () => {
      clearTimeout(layoutTimer);
      window.removeEventListener("resize", updateNudgePosition);
    };
  }, [currentStep, step4Done, questionIndex]);

  let navText = APP_DATA.common.tapNextToContinue;
  let nextDisabled = false;

  if (currentStep === 2) navText = APP_DATA.common.tapNextExplore;
  else if (currentStep === 4) {
    navText = APP_DATA.common.tapNumberCrossed;
    nextDisabled = true;
  } else if (currentStep === 5) {
    navText = APP_DATA.common.tapCorrectOption;
    nextDisabled = !step5Done;
    if (step5Done) navText = q.nav.tapNextReadAt;
  } else if (currentStep === 6) {
    navText = APP_DATA.common.tapNumpadToFill;
    nextDisabled = !step6Done;
    if (step6Done) navText = APP_DATA.common.tapNextCountRemaining;
  } else if (currentStep === 7) {
    navText = APP_DATA.common.tapNumpadToFill;
    nextDisabled = !step7Done;
    if (step7Done) navText = APP_DATA.common.tapNextAddUp;
  } else if (currentStep === 8) {
    navText = APP_DATA.common.tapNumpadToFill;
    nextDisabled = !step8Done;
    if (step8Done) {
      navText = isLastQuestion
        ? APP_DATA.common.tapNextConclude
        : APP_DATA.common.tapNextAnother;
    }
  }

  let characterText = "";
  let characterImage = currentStep === 4 ? "normal.png" : charImage;

  if (currentStep === 3) characterText = q.steps[3].characterText;
  else if (currentStep === 4) characterText = q.steps[4].characterText;
  else if (currentStep === 5) characterText = q.steps[5].characterText;
  else if (currentStep === 6) characterText = q.steps[6].characterText;
  else if (currentStep === 7) characterText = q.steps[7].characterText;
  else if (currentStep === 8) {
    characterText = step8Done
      ? q.steps.step8done.characterText
      : q.steps[8].characterText;
  }

  const getClockProps = () => {
    const base = { time: q.time };
    const yellowSector = { start: 0, end: q.minutesAtCrossed, radius: 42 };
    const pinkSector = {
      start: q.minutesAtCrossed,
      end: q.totalMinutes,
      radius: 42,
      color: "rgba(255, 105, 180, 0.5)",
    };
    const fullSector = { start: 0, end: q.totalMinutes, radius: 42 };

    if (currentStep <= 4) {
      return {
        ...base,
        showCircles: 1,
        sector: null,
        extraSectors: [],
        showNumCircles: currentStep === 4,
        onNumCircleClick: handleNumCircleClick,
      };
    }

    if (currentStep === 5) {
      return {
        ...base,
        showCircles: 1,
        sector: yellowSector,
        extraSectors: [],
        showNumCircles: false,
      };
    }

    if (currentStep === 6) {
      return {
        ...base,
        showCircles: step6Done ? q.showCirclesCount : 1,
        sector: yellowSector,
        extraSectors: step6Done ? [pinkSector] : [],
        showNumCircles: false,
      };
    }

    if (currentStep === 7) {
      return {
        ...base,
        showCircles: q.showCirclesCount,
        sector: yellowSector,
        extraSectors: [pinkSector],
        showNumCircles: false,
      };
    }

    if (currentStep === 8) {
      return {
        ...base,
        showCircles: q.showCirclesCount,
        sector: fullSector,
        extraSectors: [],
        showNumCircles: false,
      };
    }

    return base;
  };

  const renderNumberBox = (value, status) => {
    let cls = "number-box math-num-box";
    if (status === "correct") cls += " correct";
    else if (status === "wrong") cls += " wrong";
    else cls += " active";
    if (value !== "") cls += " filled";
    return e("div", { className: cls }, value);
  };

  const renderMathRow = () => {
    const cfg = getNumpadConfig();
    if (!cfg) return null;

    if (currentStep === 6) {
      return e(
        "div",
        { className: "math-row" },
        e("span", { className: "math-text" }, cfg.mathPrefix),
        renderNumberBox(numpadValue, numpadStatus)
      );
    }

    if (currentStep === 7) {
      return e(
        "div",
        { className: "math-row" },
        renderNumberBox(numpadValue, numpadStatus),
        e("span", { className: "math-text" }, cfg.mathSuffix)
      );
    }

    if (currentStep === 8) {
      return e(
        "div",
        { className: "math-row math-row-wrap" },
        e("span", { className: "math-text" }, cfg.mathPrefix),
        renderNumberBox(numpadValue, numpadStatus),
        e("span", { className: "math-text" }, cfg.mathSuffix)
      );
    }

    return null;
  };

  const renderFeedbackBox = () => {
    let cls = "feedback-box";
    if (showFeedback) cls += " visible";
    if (feedbackType) cls += " " + feedbackType;
    return e("div", { className: cls }, feedbackText);
  };

  if (currentStep === 0) {
    return e(
      "div",
      { className: "applet-container" },
      e(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        e(Fullscreen, {
          heading: APP_DATA.start.heading,
          text: APP_DATA.start.text,
          buttonText: APP_DATA.start.buttonText,
          onButtonClick: handleNext,
        })
      )
    );
  }

  if (currentStep === 9) {
    return e(
      "div",
      { className: "applet-container" },
      e(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        e(Fullscreen, {
          heading: APP_DATA.summary.heading,
          text: APP_DATA.summary.text,
          buttonText: APP_DATA.summary.buttonText,
          onButtonClick: resetAll,
        })
      )
    );
  }

  if (currentStep === 1 || currentStep === 2) {
    const splashStep = currentStep;
    const image =
      splashStep === 1 ? APP_DATA.splash.step1Image : APP_DATA.splash.step2Image;

    return e(
      "div",
      { className: "applet-container" },
      e(Splash, {
        heading: APP_DATA.splash.heading,
        image: image,
        text: APP_DATA.splashSteps[splashStep].text,
        step: splashStep,
      }),
      e(Navigation, {
        onNav: (dir) => (dir === "next" ? handleNext() : handlePrev()),
        isNextDisabled: false,
        isPrevDisabled: currentStep === 1,
        navText: navText,
      })
    );
  }

  let rightContent = null;

  if (currentStep === 5) {
    rightContent = e(
      "div",
      { className: "right-panel-content" },
      renderFeedbackBox(),
      e(MCQPanel, {
        mcqData: {
          options: q.mcq.options,
        },
        selectedOption: mcqSelected,
        isCorrect: mcqCorrect,
        onOptionClick: handleMcqClick,
        showFeedback: false,
      })
    );
  } else if (currentStep >= 6 && currentStep <= 8) {
    rightContent = e(
      "div",
      { className: "right-panel-content" },
      renderFeedbackBox(),
      renderMathRow(),
      e(Numpad, {
        disabled: numpadDisabled,
        onNumberClick: handleNumberClick,
        onClear: handleClear,
        onSubmit: handleNumpadSubmit,
      })
    );
  }

  const leftCls = "content-left-column clock-col";
  const rightCls = "content-right-column" + (!rightContent ? " empty-col" : "");

  return e(
    React.Fragment,
    null,
    e(
      "div",
      { className: "applet-container" },
      e(
        "div",
        { className: "with-character-layout" },
        e(CharacterPanel, { characterImage: characterImage, characterText: characterText }),
        e(
          "div",
          { className: "content-columns" },
          e(
            "div",
            { className: leftCls },
            e(Clock, {
              ...getClockProps(),
              numCircleRefs:
                currentStep === 4 ? { [q.crossedNumber]: numCircleTargetRef } : null,
            })
          ),
          e("div", { className: rightCls }, rightContent)
        )
      ),
      e(Navigation, {
        onNav: (dir) => (dir === "next" ? handleNext() : handlePrev()),
        isNextDisabled: nextDisabled,
        isPrevDisabled: currentStep === 1,
        navText: navText,
      })
    ),
    e(Nudge, {
      show: currentStep === 4 && !step4Done,
      position: nudgePosition,
    })
  );
};
