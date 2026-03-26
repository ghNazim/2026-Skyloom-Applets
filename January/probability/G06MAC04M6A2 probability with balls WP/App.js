const App = () => {
  const { useState, useRef, useEffect } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [showNudge, setShowNudge] = useState(true);
  const startButtonRef = useRef(null);
  const continueButtonRef = useRef(null);
  const nextButtonRef = useRef(null);

  useEffect(() => {
    var showOnStep =
      currentStep === 0 ||
      currentStep === 4 ||
      ((currentStep === 1 ||
        currentStep === 2 ||
        currentStep === 3 ||
        currentStep === 5 ||
        currentStep === 6 ||
        currentStep === 7) &&
        !isNextDisabled);
    if (showOnStep) setShowNudge(true);
  }, [currentStep, isNextDisabled]);
  const [navText, setNavText] = useState("");
  const [compareIndex, setCompareIndex] = useState(0);
  const [foundAnswers, setFoundAnswers] = useState([]);
  const [calculateKey, setCalculateKey] = useState(0);
  const [nextButtonText, setNextButtonText] = useState(null);
  const [comprehendKey, setComprehendKey] = useState(0);
  // Step 1 internal parts (to avoid changing global step numbers)
  // 0: run part1, 1: wait for Next, 2: run part2, 3: done (Next goes to step 2)
  const [comprehendStep1Part, setComprehendStep1Part] = useState(0);

  const handleStart = () => {
    setShowNudge(false);
    playSound("click");
    setCurrentStep(1);
    setIsNextDisabled(true);
    setNavText(APP_DATA.comprehend.navStep1Start);
    setComprehendStep1Part(0);
  };

  const handleContinue = () => {
    setShowNudge(false);
    playSound("click");
    setCurrentStep(5);
    setIsNextDisabled(true);
    setNavText(APP_DATA.calculate.navActive);
  };

  const handleAnimationDone = (step) => {
    setIsNextDisabled(false);
    if (step === "comprehend_step1_part1") {
      setComprehendStep1Part(1);
      setNavText(APP_DATA.comprehend.navStep1Continue);
      return;
    }
    if (step === "comprehend_step1_part2") {
      setComprehendStep1Part(3);
      setNavText(APP_DATA.comprehend.navStep1Done);
      return;
    }
    if (step === 2) setNavText(APP_DATA.comprehend.navStep2Done);
  };

  const handleCompareCorrect = () => {
    setIsNextDisabled(false);
    var data = APP_DATA.compare;
    if (compareIndex < data.compareData.length - 1) {
      setNavText(data.navCorrect);
    } else {
      setNavText(data.navLast);
    }
  };

  const handleCalculateCorrect = (answer) => {
    var newLength = foundAnswers.length + 1;
    setFoundAnswers(function (prev) {
      return prev.concat([answer]);
    });
    setIsNextDisabled(false);
    var calcData = APP_DATA.calculate;
    if (newLength >= calcData.validAnswers.length) {
      setNavText(calcData.navAllFound);
    } else {
      setNavText(calcData.navCorrect);
    }
  };

  const handleNav = (direction) => {
    if (direction === "prev") {
      playSound("click");

      if (currentStep === 1) {
        setCurrentStep(0);
        setComprehendStep1Part(0);
      } else if (currentStep === 2) {
        setComprehendKey(function (p) {
          return p + 1;
        });
        setCurrentStep(1);
        setIsNextDisabled(true);
        setNavText(APP_DATA.comprehend.navStep1Start);
        setComprehendStep1Part(0);
      } else if (currentStep === 3) {
        setComprehendKey(function (p) {
          return p + 1;
        });
        setCurrentStep(2);
        setIsNextDisabled(true);
        setNavText(APP_DATA.comprehend.navStep2Start);
        setCompareIndex(0);
      } else if (currentStep === 5) {
        setCurrentStep(4);
        setFoundAnswers([]);
        setCalculateKey(0);
      } else if (currentStep === 6) {
        setCurrentStep(5);
        setFoundAnswers([]);
        setCalculateKey(function (p) {
          return p + 1;
        });
        setIsNextDisabled(true);
        setNavText(APP_DATA.calculate.navActive);
      } else if (currentStep === 7) {
        setCurrentStep(6);
        setNavText(APP_DATA.allEstimates.navText);
        setIsNextDisabled(false);
        setNextButtonText(null);
      }
      return;
    }

    if (direction === "next" && !isNextDisabled) {
      setShowNudge(false);
      playSound("click");

      if (currentStep === 1) {
        if (comprehendStep1Part === 1) {
          // Run step1 part2 animation within the same step number
          setComprehendStep1Part(2);
          setIsNextDisabled(true);
        } else if (comprehendStep1Part >= 3) {
          setCurrentStep(2);
          setIsNextDisabled(true);
          setNavText(APP_DATA.comprehend.navStep2Start);
        }
      } else if (currentStep === 2) {
        setCurrentStep(3);
        setIsNextDisabled(true);
        setNavText(APP_DATA.compare.navActive);
        setCompareIndex(0);
      } else if (currentStep === 3) {
        var cmpData = APP_DATA.compare;
        if (compareIndex < cmpData.compareData.length - 1) {
          setCompareIndex(compareIndex + 1);
          setIsNextDisabled(true);
          setNavText(cmpData.navActive);
        } else {
          setCurrentStep(4);
        }
      } else if (currentStep === 5) {
        var calcData = APP_DATA.calculate;
        if (foundAnswers.length >= calcData.validAnswers.length) {
          setCurrentStep(6);
          setNavText(APP_DATA.allEstimates.navText);
          setIsNextDisabled(false);
        } else {
          setCalculateKey(function (prev) {
            return prev + 1;
          });
          setIsNextDisabled(true);
          setNavText(calcData.navActive);
        }
      } else if (currentStep === 6) {
        setCurrentStep(7);
        setNavText(APP_DATA.calculateSummary.navText);
        setIsNextDisabled(false);
        setNextButtonText(APP_DATA.calculateSummary.startOverText);
      } else if (currentStep === 7) {
        setCurrentStep(0);
        setFoundAnswers([]);
        setCompareIndex(0);
        setCalculateKey(0);
        setNextButtonText(null);
        setIsNextDisabled(true);
        setNavText("");
        setComprehendKey(0);
        setComprehendStep1Part(0);
      }
    }
  };

  // Step 0: Challenge Intro
  if (currentStep === 0) {
    var intro = APP_DATA.challengeIntro;
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content" },
        React.createElement(
          "div",
          { className: "fullscreen-panel challenge-intro" },
          React.createElement("p", { className: "heading" }, intro.heading),
          React.createElement("p", {
            className: "fullscreen-content",
            dangerouslySetInnerHTML: { __html: intro.questionText },
          }),
          React.createElement(
            "div",
            { className: "challenge-intro-scale" },
            React.createElement(Scale, {
              allVisible: true,
              customImages: APP_DATA.scaleImages,
            }),
          ),
          React.createElement(
            "p",
            { className: "tap-start-text" },
            intro.tapStartText,
          ),
          React.createElement(Button, {
            ref: startButtonRef,
            text: intro.buttonText,
            onClick: handleStart,
            className: "challenge-intro-btn",
          }),
        ),
      ),
      React.createElement(Nudge, {
        show: showNudge,
        targetRef: startButtonRef,
      }),
    );
  }

  // Step 4: Compare Summary
  if (currentStep === 4) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content" },
        React.createElement(CompareSummary, {
          onContinue: handleContinue,
          buttonRef: continueButtonRef,
        }),
      ),
      React.createElement(Nudge, {
        show: showNudge,
        targetRef: continueButtonRef,
      }),
    );
  }

  // Steps 1-3, 5-7: MainCanvas + Navigation
  return React.createElement(
    "div",
    { className: "applet-container" },

    React.createElement(
      "div",
      { className: "app-main-content" },
      React.createElement(MainCanvas, {
        step: currentStep,
        onAnimationDone: handleAnimationDone,
        compareIndex: compareIndex,
        onCompareCorrect: handleCompareCorrect,
        calculateKey: calculateKey,
        foundAnswers: foundAnswers,
        onCalculateCorrect: handleCalculateCorrect,
        comprehendKey: comprehendKey,
        comprehendStep1Part: comprehendStep1Part,
        onNavChange: setNavText,
      }),
    ),

    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: handleNav,
        isNextDisabled: isNextDisabled,
        isPrevDisabled: false,
        navText: navText,
        nextButtonText: nextButtonText,
        nextButtonRef: nextButtonRef,
      }),
    ),
    !isNextDisabled &&
      React.createElement(Nudge, {
        show: showNudge,
        targetRef: nextButtonRef,
      }),
  );
};
