const App = () => {
  const { useState, useEffect, useCallback, useRef, useMemo } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [step1IntroDone, setStep1IntroDone] = useState(false);
  const [step7Tapped, setStep7Tapped] = useState(false);
  const [step7PlayingK, setStep7PlayingK] = useState(false);
  const [showReplayE, setShowReplayE] = useState(false);
  const [showReplayF, setShowReplayF] = useState(false);
  const [nudgePositions, setNudgePositions] = useState([]);

  const lottieRef = useRef(null);
  const step1IntroStartedRef = useRef(false);
  const [lottieReadyTick, setLottieReadyTick] = useState(0);

  const playScene = useCallback((sceneIndex, onComplete) => {
    const controller = lottieRef.current;
    if (!controller) return false;
    setIsAnimating(true);
    controller.playToMarker(sceneIndex, () => {
      setIsAnimating(false);
      if (typeof onComplete === "function") onComplete();
    });
    return true;
  }, []);

  const playScenes = useCallback((sceneIndices, onComplete) => {
    const controller = lottieRef.current;
    if (!controller || !sceneIndices.length) return false;
    setIsAnimating(true);
    controller.playMarkersSequentially(sceneIndices, () => {
      setIsAnimating(false);
      if (typeof onComplete === "function") onComplete();
    });
    return true;
  }, []);

  const handleLottieReady = useCallback((controller) => {
    lottieRef.current = controller;
    setLottieReadyTick((tick) => tick + 1);
  }, []);

  const resetActivity = useCallback(() => {
    if (lottieRef.current) {
      lottieRef.current.cancelAnimation();
      lottieRef.current.goToMarker(SCENE.A);
    }
    setIsAnimating(false);
    setStep1IntroDone(false);
    step1IntroStartedRef.current = false;
    setStep7Tapped(false);
    setStep7PlayingK(false);
    setShowReplayE(false);
    setShowReplayF(false);
    setCurrentStep(0);
  }, []);

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    setStep1IntroDone(false);
    step1IntroStartedRef.current = false;
    setIsAnimating(true);
    setCurrentStep(1);
  };

  const handleStartOver = () => {
    if (typeof playSound === "function") playSound("click");
    resetActivity();
  };

  useEffect(() => {
    if (currentStep !== 1 || !lottieRef.current || step1IntroStartedRef.current) {
      return;
    }
    step1IntroStartedRef.current = true;
    lottieRef.current.goToMarker(SCENE.A);
    setIsAnimating(true);
    lottieRef.current.playToMarker(SCENE.B, () => {
      setIsAnimating(false);
      setStep1IntroDone(true);
    });
  }, [currentStep, step1IntroDone, lottieReadyTick]);

  useEffect(() => {
    if (currentStep === 5) {
      setShowReplayE(true);
    }
    if (currentStep === 6) {
      setShowReplayF(true);
    }
  }, [currentStep]);

  const handleReflect = () => {
    if (currentStep !== 1 || isAnimating || !step1IntroDone) return;
    if (typeof playSound === "function") playSound("click");
    playScene(SCENE.C, () => setCurrentStep(2));
  };

  const handleNext = () => {
    if (typeof playSound === "function") playSound("click");
    if (isAnimating) return;

    if (currentStep === 2) {
      playScene(SCENE.D, () => setCurrentStep(3));
      return;
    }
    if (currentStep === 3) {
      setCurrentStep(4);
      return;
    }
    if (currentStep === 6) {
      setShowReplayF(false);
      playScene(SCENE.G, () => setCurrentStep(7));
      return;
    }
    if (currentStep === 7 && step7Tapped) {
      setStep7PlayingK(true);
      playScene(SCENE.K, () => {
        setStep7PlayingK(false);
        setCurrentStep(8);
      });
      return;
    }
    if (currentStep === 8) {
      setCurrentStep(9);
    }
  };

  const handleCheck = () => {
    if (currentStep !== 4 || isAnimating) return;
    if (typeof playSound === "function") playSound("click");
    playScene(SCENE.E, () => {
      setShowReplayE(true);
      setCurrentStep(5);
    });
  };

  const handleReveal = () => {
    if (currentStep !== 5 || isAnimating) return;
    if (typeof playSound === "function") playSound("click");
    setShowReplayE(false);
    playScene(SCENE.F, () => setCurrentStep(6));
  };

  const handleReplayE = () => {
    if (!showReplayE || isAnimating) return;
    if (typeof playSound === "function") playSound("click");
    playScene(SCENE.E);
  };

  const handleReplayF = () => {
    if (!showReplayF || isAnimating) return;
    if (typeof playSound === "function") playSound("click");
    playScene(SCENE.F);
  };

  const handleLeftPanelTap = () => {
    if (currentStep !== 7 || isAnimating || step7Tapped) return;
    if (typeof playSound === "function") playSound("click");
    playScenes([SCENE.H, SCENE.I, SCENE.J], () => setStep7Tapped(true));
  };

  const contentVisible =
    !isAnimating && !(currentStep === 1 && !step1IntroDone);
  const showPartialDuringAnim =
    isAnimating && currentStep === 7 && step7PlayingK;
  const actionButtonVisible =
    contentVisible && (currentStep !== 1 || step1IntroDone);

  const rightTextHtml = useMemo(() => {
    if (currentStep === 1) return APP_DATA.steps[1].text;
    if (currentStep === 2) return APP_DATA.steps[2].text;
    if (currentStep === 3) return APP_DATA.steps[3].text;
    if (currentStep === 4) return APP_DATA.steps[4].text;
    if (currentStep === 5) return APP_DATA.steps[5].text;
    if (currentStep === 6) return APP_DATA.steps[6].text;
    if (currentStep === 7) {
      if (step7PlayingK) return APP_DATA.steps[7].textDuringK;
      if (step7Tapped) return APP_DATA.steps[7].textAfterTap;
      return APP_DATA.steps[7].textBeforeTap;
    }
    if (currentStep === 8) return APP_DATA.steps[8].text;
    return "";
  }, [currentStep, step7Tapped, step7PlayingK]);

  const partialTextHtml =
    currentStep === 7 ? APP_DATA.steps[7].textDuringK : "";

  const navText = useMemo(() => {
    if (currentStep === 1) return handleComma(APP_DATA.steps[1].navText);
    if (currentStep === 2) return handleComma(APP_DATA.steps[2].navText);
    if (currentStep === 3) return handleComma(APP_DATA.steps[3].navText);
    if (currentStep === 4) return handleComma(APP_DATA.steps[4].navText);
    if (currentStep === 5) return handleComma(APP_DATA.steps[5].navText);
    if (currentStep === 6) return handleComma(APP_DATA.steps[6].navText);
    if (currentStep === 7) {
      if (step7Tapped) return handleComma(APP_DATA.steps[7].navTextAfterTap);
      return handleComma(APP_DATA.steps[7].navTextBeforeTap);
    }
    if (currentStep === 8) return handleComma(APP_DATA.steps[8].navText);
    return "";
  }, [currentStep, step7Tapped]);

  const isNextDisabled = useMemo(() => {
    if (isAnimating) return true;
    if (currentStep === 1) return true;
    if (currentStep === 2) return false;
    if (currentStep === 3) return false;
    if (currentStep === 4) return true;
    if (currentStep === 5) return true;
    if (currentStep === 6) return false;
    if (currentStep === 7) return !step7Tapped;
    if (currentStep === 8) return false;
    return true;
  }, [currentStep, isAnimating, step7Tapped]);

  const actionButton = useMemo(() => {
    if (currentStep === 1) {
      return React.createElement(Button, {
        text: APP_DATA.steps[1].buttonReflect,
        onClick: handleReflect,
        className: "fullscreen-button",
        id: "reflect-button",
        disabled: !step1IntroDone || isAnimating,
      });
    }
    if (currentStep === 4) {
      return React.createElement(Button, {
        text: APP_DATA.steps[4].buttonCheck,
        onClick: handleCheck,
        className: "fullscreen-button",
        id: "check-button",
        disabled: isAnimating,
      });
    }
    if (currentStep === 5) {
      return React.createElement(Button, {
        text: APP_DATA.steps[5].buttonReveal,
        onClick: handleReveal,
        className: "fullscreen-button",
        id: "reveal-button",
        disabled: isAnimating,
      });
    }
    return null;
  }, [
    currentStep,
    step1IntroDone,
    isAnimating,
    handleReflect,
    handleCheck,
    handleReveal,
  ]);

  const showReplay =
    (currentStep === 5 && showReplayE) || (currentStep === 6 && showReplayF);

  const onReplay =
    currentStep === 5
      ? handleReplayE
      : currentStep === 6
        ? handleReplayF
        : undefined;

  const leftPanelClickable = currentStep === 7 && !step7Tapped && !isAnimating;

  const lottiePanel = React.createElement(LottiePanel, {
    onReady: handleLottieReady,
    onLeftPanelClick: handleLeftPanelTap,
    leftPanelClickable: leftPanelClickable,
    showReplay: showReplay,
    onReplay: onReplay,
  });

  useEffect(() => {
    const updateNudges = () => {
      const positions = [];
      const addNudgeFor = (id) => {
        const el = document.getElementById(id);
        if (el && !el.disabled) {
          positions.push(el.getBoundingClientRect());
        }
      };

      if (currentStep === 0) {
        addNudgeFor("start-button");
      } else if (currentStep === 9) {
        addNudgeFor("start-over-button");
      } else if (!isAnimating) {
        if (currentStep === 1 && step1IntroDone) {
          addNudgeFor("reflect-button");
        } else if (currentStep === 2) {
          addNudgeFor("next-button");
        } else if (currentStep === 3) {
          addNudgeFor("next-button");
        } else if (currentStep === 4) {
          addNudgeFor("check-button");
        } else if (currentStep === 5) {
          addNudgeFor("reveal-button");
        } else if (currentStep === 6) {
          addNudgeFor("next-button");
        } else if (currentStep === 7) {
          if (step7Tapped) {
            addNudgeFor("next-button");
          } else {
            const panel = document.getElementById("lottie-visual-panel");
            if (panel) positions.push(panel.getBoundingClientRect());
          }
        } else if (currentStep === 8) {
          addNudgeFor("next-button");
        }
      }

      setNudgePositions(positions);
    };

    const timeoutId = setTimeout(updateNudges, 50);
    window.addEventListener("resize", updateNudges);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", updateNudges);
    };
  }, [currentStep, isAnimating, step1IntroDone, step7Tapped]);

  const renderNudges = () =>
    nudgePositions.map((position, index) =>
      React.createElement(Nudge, {
        key: index,
        show: true,
        position: position,
      }),
    );

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
          buttonId: "start-button",
          imageSrc: "assets/start.png",
          textLeft: true,
        }),
      ),
      renderNudges(),
    );
  }

  if (currentStep === 9) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        React.createElement(Fullscreen, {
          heading: APP_DATA.finish.heading,
          text: APP_DATA.finish.text,
          buttonText: APP_DATA.finish.buttonText,
          onButtonClick: handleStartOver,
          buttonId: "start-over-button",
        }),
      ),
      renderNudges(),
    );
  }

  const navVisible = contentVisible && !showPartialDuringAnim;

  return React.createElement(
    "div",
    { className: "applet-container" },
    React.createElement(
      "div",
      { className: "app-main-content" },
      React.createElement(ReflectionCanvas, {
        leftPanel: lottiePanel,
        textHtml: rightTextHtml,
        actionButton: actionButton,
        actionButtonVisible: actionButtonVisible,
        contentVisible: contentVisible,
        showPartialDuringAnim: showPartialDuringAnim,
        partialTextHtml: partialTextHtml,
        showStep3Overlays: currentStep === 3,
        step3LineLabel: APP_DATA.steps[3].lineLabel,
      }),
    ),
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: (dir) => (dir === "next" ? handleNext() : null),
        isNextDisabled: isNextDisabled,
        isPrevDisabled: true,
        navText: navText,
        navVisible: navVisible,
      }),
    ),
    renderNudges(),
  );
};
