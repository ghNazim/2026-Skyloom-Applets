const App = () => {
  const { useState } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [navText, setNavText] = useState("");
  const [compareIndex, setCompareIndex] = useState(0);
  const [foundAnswers, setFoundAnswers] = useState([]);
  const [calculateKey, setCalculateKey] = useState(0);
  const [nextButtonText, setNextButtonText] = useState(null);
  const [comprehendKey, setComprehendKey] = useState(0);

  const handleStart = () => {
    playSound("click");
    setCurrentStep(1);
    setIsNextDisabled(true);
    setNavText(APP_DATA.comprehend.navStep1Start);
  };

  const handleContinue = () => {
    playSound("click");
    setCurrentStep(5);
    setIsNextDisabled(true);
    setNavText(APP_DATA.calculate.navActive);
  };

  const handleAnimationDone = (step) => {
    setIsNextDisabled(false);
    if (step === 1) setNavText(APP_DATA.comprehend.navStep1Done);
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
      } else if (currentStep === 2) {
        setComprehendKey(function (p) { return p + 1; });
        setCurrentStep(1);
        setIsNextDisabled(true);
        setNavText(APP_DATA.comprehend.navStep1Start);
      } else if (currentStep === 3) {
        setComprehendKey(function (p) { return p + 1; });
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
        setCalculateKey(function (p) { return p + 1; });
        setIsNextDisabled(true);
        setNavText(APP_DATA.calculate.navActive);
        setNextButtonText(null);
      }
      return;
    }

    if (direction === "next" && !isNextDisabled) {
      playSound("click");

      if (currentStep === 1) {
        setCurrentStep(2);
        setIsNextDisabled(true);
        setNavText(APP_DATA.comprehend.navStep2Start);
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
          setNavText(APP_DATA.calculateSummary.navText);
          setIsNextDisabled(false);
          setNextButtonText(APP_DATA.calculateSummary.startOverText);
        } else {
          setCalculateKey(function (prev) {
            return prev + 1;
          });
          setIsNextDisabled(true);
          setNavText(calcData.navActive);
        }
      } else if (currentStep === 6) {
        setCurrentStep(0);
        setFoundAnswers([]);
        setCompareIndex(0);
        setCalculateKey(0);
        setNextButtonText(null);
        setIsNextDisabled(true);
        setNavText("");
        setComprehendKey(0);
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
            })
          ),
          React.createElement(
            "p",
            { className: "tap-start-text" },
            intro.tapStartText
          ),
          React.createElement(Button, {
            text: intro.buttonText,
            onClick: handleStart,
            className: "challenge-intro-btn",
          })
        )
      )
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
        React.createElement(CompareSummary, { onContinue: handleContinue })
      )
    );
  }

  // Steps 1-3, 5-6: MainCanvas + Navigation
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
        onNavChange: function (text) { setNavText(text); },
      })
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
      })
    )
  );
};
