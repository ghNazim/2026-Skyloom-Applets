const App = () => {
  const { useState, useEffect, useCallback, useRef } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [dynamicNavText, setDynamicNavText] = useState(null);
  const [resetKey, setResetKey] = useState(0);
  const [routeExplored, setRouteExplored] = useState({
    split2: false,
    split3: false,
  });

  const nextOverrideRef = useRef(null);

  const handleRestart = useCallback(() => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(0);
    setIsNextDisabled(true);
    setDynamicNavText(null);
    setRouteExplored({ split2: false, split3: false });
    setResetKey(function (prev) {
      return prev + 1;
    });
    nextOverrideRef.current = null;
  }, []);

  useEffect(() => {
    setDynamicNavText(null);
  }, [currentStep]);

  const handleNext = () => {
    if (typeof playSound === "function") playSound("click");
    if (nextOverrideRef.current) {
      nextOverrideRef.current();
      return;
    }
    if (currentStep < 6) {
      setCurrentStep(function (prev) {
        return prev + 1;
      });
    }
  };

  const handlePrev = () => {
    if (typeof playSound === "function") playSound("click");
    if (currentStep > 1) {
      nextOverrideRef.current = null;
      setResetKey(function (prev) {
        return prev + 1;
      });
      setCurrentStep(function (prev) {
        return prev - 1;
      });
    }
  };

  const setNextEnabled = useCallback(function (enabled) {
    setIsNextDisabled(!enabled);
  }, []);

  const updateNavText = useCallback(function (nav) {
    if (nav !== undefined) setDynamicNavText(nav);
  }, []);

  const advanceStep = useCallback(function () {
    nextOverrideRef.current = null;
    setCurrentStep(function (prev) {
      return prev + 1;
    });
  }, []);

  const finishStep5Route = useCallback(function (split) {
    nextOverrideRef.current = null;
    setRouteExplored(function (prev) {
      var next = {
        split2: prev.split2 || split === "split2",
        split3: prev.split3 || split === "split3",
      };
      var bothDone = next.split2 && next.split3;
      setCurrentStep(bothDone ? 6 : 3);
      return next;
    });
  }, []);

  const registerNextOverride = useCallback(function (fn) {
    nextOverrideRef.current = fn;
  }, []);

  const getNavText = () => {
    if (dynamicNavText !== null) return dynamicNavText;
    if (currentStep === 1) return APP_DATA.step1.navText;
    if (currentStep === 2) return APP_DATA.step2.navText;
    if (currentStep === 3) return APP_DATA.step3.navText;
    return "";
  };

  // Step 0: Fullscreen start
  if (currentStep === 0) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(Fullscreen, {
        heading: APP_DATA.fullscreenStart.heading,
        text: APP_DATA.fullscreenStart.text,
        buttonText: APP_DATA.fullscreenStart.button,
        onButtonClick: function () {
          if (typeof playSound === "function") playSound("click");
          setCurrentStep(1);
        },
      })
    );
  }

  // Step 6: Fullscreen end
  if (currentStep === 6) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(Fullscreen, {
        heading: APP_DATA.fullscreenEnd.heading,
        text: APP_DATA.fullscreenEnd.text,
        buttonText: APP_DATA.fullscreenEnd.button,
        onButtonClick: handleRestart,
      })
    );
  }

  // Steps 1-5: Main layout
  var elements = [];

  if (currentStep === 1) {
    elements.push(
      React.createElement(QuestionPanel, {
        key: "qp",
        text: APP_DATA.step1.questionText,
        step: currentStep,
      })
    );
  }

  elements.push(
    React.createElement(
      "div",
      { key: "main", className: "app-main-content" },
      React.createElement(MainCanvas, {
        key: resetKey,
        step: currentStep,
        exploredSplit2: routeExplored.split2,
        exploredSplit3: routeExplored.split3,
        onSetNextEnabled: setNextEnabled,
        onUpdateNavText: updateNavText,
        onAdvanceStep: advanceStep,
        onFinishStep5Route: finishStep5Route,
        registerNextOverride: registerNextOverride,
      })
    )
  );

  elements.push(
    React.createElement(
      "div",
      { key: "lower", className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: function (dir) {
          return dir === "next"
            ? handleNext()
            : dir === "prev"
            ? handlePrev()
            : null;
        },
        isNextDisabled: isNextDisabled,
        isPrevDisabled: currentStep <= 1,
        navText: getNavText(),
      })
    )
  );

  return React.createElement("div", { className: "applet-container" }, elements);
};
