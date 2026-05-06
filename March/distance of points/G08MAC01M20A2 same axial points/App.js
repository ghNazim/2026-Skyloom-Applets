const App = () => {
  const { useState, useMemo, useEffect } = React;
  const [currentStep, setCurrentStep] = useState(0);
  const [step1Phase, setStep1Phase] = useState("initial");
  const [step2Phase, setStep2Phase] = useState("initial");
  const [step3Phase, setStep3Phase] = useState("initial");
  const [step4QuestionIndex, setStep4QuestionIndex] = useState(0);
  const [step4Revealed, setStep4Revealed] = useState([false, false]);
  const [step5Revealed, setStep5Revealed] = useState(false);
  const [step7Phase, setStep7Phase] = useState("initial");
  const [step8Phase, setStep8Phase] = useState("initial");
  const [step9Phase, setStep9Phase] = useState("initial");
  const [step10QuestionIndex, setStep10QuestionIndex] = useState(0);
  const [step10Revealed, setStep10Revealed] = useState([false, false]);
  const [step11Revealed, setStep11Revealed] = useState(false);
  const [questionNudgePos, setQuestionNudgePos] = useState(null);
  const [nextNudgePos, setNextNudgePos] = useState(null);

  const resetEverything = () => {
    setCurrentStep(0);
    setStep1Phase("initial");
    setStep2Phase("initial");
    setStep3Phase("initial");
    setStep4QuestionIndex(0);
    setStep4Revealed([false, false]);
    setStep5Revealed(false);
    setStep7Phase("initial");
    setStep8Phase("initial");
    setStep9Phase("initial");
    setStep10QuestionIndex(0);
    setStep10Revealed([false, false]);
    setStep11Revealed(false);
  };

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(1);
    setStep1Phase("initial");
    setStep2Phase("initial");
    setStep3Phase("initial");
    setStep4QuestionIndex(0);
    setStep4Revealed([false, false]);
    setStep5Revealed(false);
    setStep7Phase("initial");
    setStep8Phase("initial");
    setStep9Phase("initial");
    setStep10QuestionIndex(0);
    setStep10Revealed([false, false]);
    setStep11Revealed(false);
  };

  const handleStartOver = () => {
    if (typeof playSound === "function") playSound("click");
    resetEverything();
  };

  const navText = useMemo(() => {
    if (currentStep === 1) {
      const s1 = APP_DATA.steps[1];
      if (step1Phase === "done") return s1.navTextDone;
      if (step1Phase === "choose") return s1.navTextAfterReveal;
      return s1.navTextInitial;
    }
    if (currentStep === 2) {
      const s2 = APP_DATA.steps[2];
      return step2Phase === "done" ? s2.navTextDone : s2.navTextInitial;
    }
    if (currentStep === 3) {
      const s3 = APP_DATA.steps[3];
      return step3Phase === "done" ? s3.navTextDone : s3.navTextInitial;
    }
    if (currentStep === 4) {
      const s4 = APP_DATA.steps[4];
      return step4Revealed[step4QuestionIndex]
        ? s4.questions[step4QuestionIndex].navTextDone
        : s4.navTextInitial;
    }
    if (currentStep === 5) {
      const s5 = APP_DATA.steps[5];
      return step5Revealed ? s5.navTextDone : s5.navTextInitial;
    }
    if (currentStep === 6) {
      return APP_DATA.steps[6].navText;
    }
    if (currentStep === 7) {
      const s7 = APP_DATA.steps[7];
      if (step7Phase === "done") return s7.navTextDone;
      if (step7Phase === "choose") return s7.navTextAfterReveal;
      return s7.navTextInitial;
    }
    if (currentStep === 8) {
      const s8 = APP_DATA.steps[8];
      return step8Phase === "done" ? s8.navTextDone : s8.navTextInitial;
    }
    if (currentStep === 9) {
      const s9 = APP_DATA.steps[9];
      return step9Phase === "done" ? s9.navTextDone : s9.navTextInitial;
    }
    if (currentStep === 10) {
      const s10 = APP_DATA.steps[10];
      return step10Revealed[step10QuestionIndex]
        ? s10.questions[step10QuestionIndex].navTextDone
        : s10.navTextInitial;
    }
    if (currentStep === 11) {
      const s11 = APP_DATA.steps[11];
      return step11Revealed ? s11.navTextDone : s11.navTextInitial;
    }
    if (currentStep === 12) {
      return APP_DATA.steps[12].navText;
    }
    return "";
  }, [currentStep, step1Phase, step2Phase, step3Phase, step4QuestionIndex, step4Revealed, step5Revealed, step7Phase, step8Phase, step9Phase, step10QuestionIndex, step10Revealed, step11Revealed]);

  const questionText = useMemo(() => {
    if (currentStep === 1) {
      const s1 = APP_DATA.steps[1];
      if (step1Phase === "done") return s1.questionTextDone;
      if (step1Phase === "choose") return s1.questionTextAfterReveal;
      return s1.questionTextInitial;
    }
    if (currentStep === 2) {
      const s2 = APP_DATA.steps[2];
      return step2Phase === "done" ? s2.questionTextDone : s2.questionTextInitial;
    }
    if (currentStep === 3) {
      const s3 = APP_DATA.steps[3];
      return step3Phase === "done" ? s3.questionTextDone : s3.questionTextInitial;
    }
    if (currentStep === 4) {
      const s4 = APP_DATA.steps[4];
      const q = s4.questions[step4QuestionIndex];
      const template = step4Revealed[step4QuestionIndex]
        ? s4.questionTextDone
        : s4.questionTextInitial;
      return template
        .replace(/{x2}/g, String(q.p2[0]))
        .replace(/{x1}/g, String(q.p1[0]))
        .replace(/{y}/g, String(q.p1[1]))
        .replace("{d}", String(q.p2[0] - q.p1[0]));
    }
    if (currentStep === 5) {
      const s5 = APP_DATA.steps[5];
      return step5Revealed ? s5.questionTextDone : s5.questionTextInitial;
    }
    if (currentStep === 6) {
      return APP_DATA.steps[6].questionText;
    }
    if (currentStep === 7) {
      const s7 = APP_DATA.steps[7];
      if (step7Phase === "done") return s7.questionTextDone;
      if (step7Phase === "choose") return s7.questionTextAfterReveal;
      return s7.questionTextInitial;
    }
    if (currentStep === 8) {
      const s8 = APP_DATA.steps[8];
      return step8Phase === "done" ? s8.questionTextDone : s8.questionTextInitial;
    }
    if (currentStep === 9) {
      const s9 = APP_DATA.steps[9];
      return step9Phase === "done" ? s9.questionTextDone : s9.questionTextInitial;
    }
    if (currentStep === 10) {
      const s10 = APP_DATA.steps[10];
      const q = s10.questions[step10QuestionIndex];
      const template = step10Revealed[step10QuestionIndex]
        ? s10.questionTextDone
        : s10.questionTextInitial;
      return template
        .replace(/{x}/g, String(q.p1[0]))
        .replace(/{y2}/g, String(q.p2[1]))
        .replace(/{y1}/g, String(q.p1[1]))
        .replace("{d}", String(q.p2[1] - q.p1[1]));
    }
    if (currentStep === 11) {
      const s11 = APP_DATA.steps[11];
      return step11Revealed ? s11.questionTextDone : s11.questionTextInitial;
    }
    if (currentStep === 12) {
      return APP_DATA.steps[12].questionText;
    }
    return "";
  }, [currentStep, step1Phase, step2Phase, step3Phase, step4QuestionIndex, step4Revealed, step5Revealed, step7Phase, step8Phase, step9Phase, step10QuestionIndex, step10Revealed, step11Revealed]);

  const isNextDisabled =
    (currentStep === 1 && step1Phase !== "done") ||
    (currentStep === 2 && step2Phase !== "done") ||
    (currentStep === 3 && step3Phase !== "done") ||
    (currentStep === 4 && !step4Revealed[step4QuestionIndex]) ||
    (currentStep === 5 && !step5Revealed) ||
    (currentStep === 7 && step7Phase !== "done") ||
    (currentStep === 8 && step8Phase !== "done") ||
    (currentStep === 9 && step9Phase !== "done") ||
    (currentStep === 10 && !step10Revealed[step10QuestionIndex]) ||
    (currentStep === 11 && !step11Revealed);

  const isPrevDisabled = currentStep <= 1;

  useEffect(() => {
    const updateNudges = () => {
      const qTarget = document.querySelector(".q-box-clickable");
      setQuestionNudgePos(qTarget ? qTarget.getBoundingClientRect() : null);

      const nextBtn = document.getElementById("next-button");
      const showNextNudge =
        !!nextBtn &&
        !isNextDisabled &&
        currentStep !== 0 &&
        currentStep !== 13;
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
    step1Phase,
    step2Phase,
    step3Phase,
    step4QuestionIndex,
    step4Revealed,
    step5Revealed,
    step7Phase,
    step8Phase,
    step9Phase,
    step10QuestionIndex,
    step10Revealed,
    step11Revealed,
  ]);

  const handleNext = () => {
    if (typeof playSound === "function") playSound("click");
    setNextNudgePos(null);
    if (isNextDisabled) return;
    if (currentStep === 1) setCurrentStep(2);
    else if (currentStep === 2) setCurrentStep(3);
    else if (currentStep === 3) setCurrentStep(4);
    else if (currentStep === 4) {
      if (step4QuestionIndex < APP_DATA.steps[4].questions.length - 1) {
        setStep4QuestionIndex((prev) => prev + 1);
      } else {
        setCurrentStep(5);
      }
    } else if (currentStep === 5) {
      setCurrentStep(6);
    } else if (currentStep === 6) {
      setCurrentStep(7);
    } else if (currentStep === 7) {
      setCurrentStep(8);
    } else if (currentStep === 8) {
      setCurrentStep(9);
    } else if (currentStep === 9) {
      setCurrentStep(10);
    } else if (currentStep === 10) {
      if (step10QuestionIndex < APP_DATA.steps[10].questions.length - 1) {
        setStep10QuestionIndex((prev) => prev + 1);
      } else {
        setCurrentStep(11);
      }
    } else if (currentStep === 11) {
      setCurrentStep(12);
    } else if (currentStep === 12) {
      setCurrentStep(13);
    }
  };

  const handlePrev = () => {
    if (typeof playSound === "function") playSound("click");
    if (currentStep === 4) {
      if (step4QuestionIndex > 0) setStep4QuestionIndex((prev) => prev - 1);
      else setCurrentStep(3);
      return;
    }
    if (currentStep === 5) {
      setCurrentStep(4);
      setStep4QuestionIndex(APP_DATA.steps[4].questions.length - 1);
      return;
    }
    if (currentStep === 6) {
      setCurrentStep(5);
      return;
    }
    if (currentStep === 7) {
      setCurrentStep(6);
      return;
    }
    if (currentStep === 8) {
      setCurrentStep(7);
      return;
    }
    if (currentStep === 9) {
      setCurrentStep(8);
      return;
    }
    if (currentStep === 10) {
      if (step10QuestionIndex > 0) setStep10QuestionIndex((prev) => prev - 1);
      else setCurrentStep(9);
      return;
    }
    if (currentStep === 11) {
      setCurrentStep(10);
      setStep10QuestionIndex(APP_DATA.steps[10].questions.length - 1);
      return;
    }
    if (currentStep === 12) {
      setCurrentStep(11);
      return;
    }
    if (currentStep > 1 && currentStep <= 3) setCurrentStep((prev) => prev - 1);
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

  if (currentStep === 13) {
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
          isFinal: !!APP_DATA.final.imageSrc,
          imageSrc: APP_DATA.final.imageSrc || undefined,
        }),
      ),
    );
  }

  return React.createElement(
    "div",
    { className: "applet-container" },
    React.createElement(QuestionPanel, {
      text: questionText,
      step: currentStep,
    }),
    React.createElement(
      "div",
      { className: "app-main-content" },
      React.createElement(MainCanvas, {
        step: currentStep,
        step1Phase: step1Phase,
        step2Phase: step2Phase,
        step3Phase: step3Phase,
        step4Question: APP_DATA.steps[4].questions[step4QuestionIndex],
        step4Revealed: step4Revealed[step4QuestionIndex],
        step5Revealed: step5Revealed,
        step7Phase: step7Phase,
        step8Phase: step8Phase,
        step9Phase: step9Phase,
        step10Question: APP_DATA.steps[10].questions[step10QuestionIndex],
        step10Revealed: step10Revealed[step10QuestionIndex],
        step11Revealed: step11Revealed,
        onQuestionMarkClick: () => setQuestionNudgePos(null),
        onStep1RevealStart: () => setStep1Phase("revealing"),
        onStep1RevealDone: () => setStep1Phase("choose"),
        onStep1Correct: () => setStep1Phase("done"),
        onStep2RevealStart: () => setStep2Phase("revealing"),
        onStep2RevealDone: () => setStep2Phase("done"),
        onStep3RevealDone: () => setStep3Phase("done"),
        onStep4RevealDone: () =>
          setStep4Revealed((prev) => {
            const next = prev.slice();
            next[step4QuestionIndex] = true;
            return next;
          }),
        onStep5RevealDone: () => setStep5Revealed(true),
        onStep7RevealStart: () => setStep7Phase("revealing"),
        onStep7RevealDone: () => setStep7Phase("choose"),
        onStep7Correct: () => setStep7Phase("done"),
        onStep8RevealStart: () => setStep8Phase("revealing"),
        onStep8RevealDone: () => setStep8Phase("done"),
        onStep9RevealDone: () => setStep9Phase("done"),
        onStep10RevealDone: () =>
          setStep10Revealed((prev) => {
            const next = prev.slice();
            next[step10QuestionIndex] = true;
            return next;
          }),
        onStep11RevealDone: () => setStep11Revealed(true),
      }),
    ),
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: (dir) =>
          dir === "next" ? handleNext() : dir === "prev" ? handlePrev() : null,
        isNextDisabled: isNextDisabled,
        isPrevDisabled: isPrevDisabled,
        navText: navText,
      }),
    ),
    React.createElement(Nudge, {
      show: !!questionNudgePos,
      position: questionNudgePos,
    }),
    React.createElement(Nudge, {
      show: !!nextNudgePos,
      position: nextNudgePos,
    }),
  );
};
