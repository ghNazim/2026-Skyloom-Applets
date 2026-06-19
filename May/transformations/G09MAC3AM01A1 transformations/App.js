const App = () => {
  const { useState, useEffect, useCallback, useRef } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [activeTransform, setActiveTransform] = useState(null);
  const [navTextVisible, setNavTextVisible] = useState(false);
  const [buttonsClickable, setButtonsClickable] = useState(false);
  const [dynamicQuestionText, setDynamicQuestionText] = useState(null);
  const [moveFlowComplete, setMoveFlowComplete] = useState(false);
  const [rotateFlowComplete, setRotateFlowComplete] = useState(false);
  const [rotateActive, setRotateActive] = useState(false);
  const [rotateFromStep1, setRotateFromStep1] = useState(false);
  const [zoomActive, setZoomActive] = useState(false);
  const [zoomFromStep1, setZoomFromStep1] = useState(false);
  const [zoomFlowComplete, setZoomFlowComplete] = useState(false);
  const [mirrorActive, setMirrorActive] = useState(false);
  const [mirrorFromStep1, setMirrorFromStep1] = useState(false);
  const [mirrorFlowComplete, setMirrorFlowComplete] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [nudgeTarget, setNudgeTarget] = useState("start");

  const appletRef = useRef(null);
  const startBtnRef = useRef(null);
  const moveBtnRef = useRef(null);
  const greyNudgeAnchorRef = useRef(null);
  const blueBoxRef = useRef(null);
  const rotatePaperAnchorRef = useRef(null);
  const rotateRevealBtnRef = useRef(null);
  const rotateBlueBoxRef = useRef(null);
  const zoomPaperAnchorRef = useRef(null);
  const zoomRevealBtnRef = useRef(null);
  const zoomBlueBoxRef = useRef(null);
  const mirrorReflectorRef = useRef(null);
  const mirrorLineRef = useRef(null);
  const mirrorRevealBtnRef = useRef(null);
  const mirrorBlueBoxRef = useRef(null);

  const nudgeRef =
    nudgeTarget === "start"
      ? startBtnRef
      : nudgeTarget === "move"
        ? moveBtnRef
        : nudgeTarget === "grey"
          ? greyNudgeAnchorRef
          : nudgeTarget === "blue"
            ? rotateActive
              ? rotateBlueBoxRef
              : zoomActive
                ? zoomBlueBoxRef
                : mirrorActive
                  ? mirrorBlueBoxRef
                  : blueBoxRef
            : nudgeTarget === "rotatePaper"
              ? rotatePaperAnchorRef
              : nudgeTarget === "rotateReveal"
                ? rotateRevealBtnRef
                : nudgeTarget === "zoomPaper"
                  ? zoomPaperAnchorRef
                  : nudgeTarget === "zoomReveal"
                    ? zoomRevealBtnRef
                    : nudgeTarget === "mirrorReflector"
                      ? mirrorReflectorRef
                      : nudgeTarget === "mirrorLine"
                        ? mirrorLineRef
                        : nudgeTarget === "mirrorReveal"
                          ? mirrorRevealBtnRef
                          : null;

  const nudgePosition = useNudgePosition(
    nudgeRef,
    !!nudgeTarget,
    appletRef
  );

  const dismissNudge = useCallback(function () {
    setNudgeTarget(null);
  }, []);

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    dismissNudge();
    setCurrentStep(1);
  };

  const handleRestart = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(0);
    setActiveTransform(null);
    setNavTextVisible(false);
    setButtonsClickable(false);
    setDynamicQuestionText(null);
    setMoveFlowComplete(false);
    setRotateFlowComplete(false);
    setRotateActive(false);
    setRotateFromStep1(false);
    setZoomActive(false);
    setZoomFromStep1(false);
    setZoomFlowComplete(false);
    setMirrorActive(false);
    setMirrorFromStep1(false);
    setMirrorFlowComplete(false);
    setNudgeTarget("start");
    setResetKey(function (k) {
      return k + 1;
    });
  };

  const handleTransformClick = (transformId) => {
    if (typeof playSound === "function") playSound("click");
    if (transformId === "move") {
      dismissNudge();
      setRotateActive(false);
      setZoomActive(false);
      setMirrorActive(false);
      setActiveTransform("move");
      setNavTextVisible(false);
      setButtonsClickable(false);
      setDynamicQuestionText(null);
      setMoveFlowComplete(false);
      setRotateFlowComplete(false);
      setCurrentStep(2);
    } else if (transformId === "rotate") {
      dismissNudge();
      setActiveTransform("rotate");
      setNavTextVisible(false);
      setButtonsClickable(false);
      setDynamicQuestionText(null);
      setRotateFlowComplete(false);
      setZoomActive(false);
      setMirrorActive(false);
      setRotateFromStep1(currentStep === 1);
      setRotateActive(true);
    } else if (transformId === "zoom") {
      dismissNudge();
      setActiveTransform("zoom");
      setNavTextVisible(false);
      setButtonsClickable(false);
      setDynamicQuestionText(null);
      setZoomFlowComplete(false);
      setRotateActive(false);
      setMirrorActive(false);
      setZoomFromStep1(currentStep === 1);
      setZoomActive(true);
    } else if (transformId === "mirror") {
      dismissNudge();
      setActiveTransform("mirror");
      setNavTextVisible(false);
      setButtonsClickable(false);
      setDynamicQuestionText(null);
      setRotateActive(false);
      setZoomActive(false);
      setMirrorFromStep1(currentStep === 1);
      setMirrorActive(true);
    }
  };

  const handleSnapComplete = () => {
    setDynamicQuestionText(null);
    setCurrentStep(3);
  };

  const handleUpdateQuestion = useCallback((text) => {
    setDynamicQuestionText(text);
  }, []);

  const handleMoveFlowComplete = useCallback(() => {
    setMoveFlowComplete(true);
    setActiveTransform(null);
    setNavTextVisible(true);
    setButtonsClickable(true);
  }, []);

  const handleRotateFlowComplete = useCallback(() => {
    setRotateFlowComplete(true);
    setActiveTransform(null);
    setNavTextVisible(true);
    setButtonsClickable(true);
  }, []);

  const handleZoomFlowComplete = useCallback(() => {
    setZoomFlowComplete(true);
    setActiveTransform(null);
    setNavTextVisible(true);
    setButtonsClickable(true);
  }, []);

  const handleMirrorFlowComplete = useCallback(() => {
    setMirrorFlowComplete(true);
    setActiveTransform(null);
    setNavTextVisible(true);
    setButtonsClickable(true);
  }, []);

  useEffect(function () {
    if (currentStep === 0) {
      setNudgeTarget("start");
    }
  }, [currentStep]);

  useEffect(function () {
    if (currentStep === 1 && !rotateActive && !zoomActive && !mirrorActive) {
      setNavTextVisible(false);
      setButtonsClickable(false);
      setDynamicQuestionText(null);
      setNudgeTarget(null);
      var timer = setTimeout(function () {
        setNavTextVisible(true);
        setButtonsClickable(true);
        setNudgeTarget("move");
      }, 1000);
      return function () {
        clearTimeout(timer);
      };
    }
  }, [currentStep, rotateActive, zoomActive, mirrorActive]);

  const getQuestionText = () => {
    if (dynamicQuestionText !== null) return dynamicQuestionText;
    if (rotateActive || zoomActive || mirrorActive) {
      return dynamicQuestionText || "";
    }
    var stepData = APP_DATA.steps[currentStep];
    return stepData ? stepData.questionText : "";
  };

  const getNavText = () => {
    if (
      (rotateActive && !rotateFlowComplete) ||
      (zoomActive && !zoomFlowComplete) ||
      (mirrorActive && !mirrorFlowComplete)
    ) {
      return "";
    }
    if (
      rotateFlowComplete ||
      moveFlowComplete ||
      zoomFlowComplete ||
      mirrorFlowComplete
    ) {
      return APP_DATA.steps[3].navText;
    }
    var stepData = APP_DATA.steps[currentStep];
    return stepData ? stepData.navText : "";
  };

  const getExploredButtons = () => {
    var list = [];
    if (moveFlowComplete) list.push("move");
    if (rotateFlowComplete) list.push("rotate");
    if (zoomFlowComplete) list.push("zoom");
    if (mirrorFlowComplete) list.push("mirror");
    return list;
  };

  const allTransformsExplored =
    moveFlowComplete &&
    rotateFlowComplete &&
    zoomFlowComplete &&
    mirrorFlowComplete;

  const navChoiceVisible =
    navTextVisible &&
    ((!rotateActive || rotateFlowComplete) &&
      (!zoomActive || zoomFlowComplete) &&
      (!mirrorActive || mirrorFlowComplete));

  const getClickableButtons = () => {
    if (rotateActive && !rotateFlowComplete) return [];
    if (zoomActive && !zoomFlowComplete) return [];
    if (mirrorActive && !mirrorFlowComplete) return [];
    if (allTransformsExplored) {
      return ["move", "rotate", "zoom", "mirror"];
    }
    if (mirrorFlowComplete) {
      return ["move", "rotate", "zoom"];
    }
    if (zoomFlowComplete) {
      return ["move", "rotate", "mirror"];
    }
    if (rotateFlowComplete) {
      return ["move", "zoom", "mirror"];
    }
    if (moveFlowComplete) {
      return ["rotate", "zoom", "mirror"];
    }
    if (currentStep === 1 && buttonsClickable) {
      return ["move", "rotate", "zoom", "mirror"];
    }
    return [];
  };

  var nudgeElement =
    nudgeTarget && nudgePosition
      ? React.createElement(Nudge, {
          visible: true,
          top: nudgePosition.top,
          left: nudgePosition.left,
        })
      : null;

  if (currentStep === 0) {
    return React.createElement(
      "div",
      { className: "applet-container", ref: appletRef },
      React.createElement(
        "div",
        { className: "app-main-content app-main-content--fullscreen" },
        React.createElement(Fullscreen, {
          heading: APP_DATA.start.heading,
          text: APP_DATA.start.text,
          buttonText: APP_DATA.start.buttonText,
          onButtonClick: handleStart,
          buttonRef: startBtnRef,
        })
      ),
      nudgeElement
    );
  }

  return React.createElement(
    "div",
    { className: "applet-container", ref: appletRef },
    React.createElement(QuestionPanel, {
      text: getQuestionText(),
      step: currentStep,
    }),
    React.createElement(
      "div",
      { className: "app-main-content" },
      rotateActive
        ? React.createElement(RotateCanvas, {
            key: "rotate-" + resetKey,
            fromStep1: rotateFromStep1,
            onUpdateQuestion: handleUpdateQuestion,
            onNudgeTarget: setNudgeTarget,
            onNudgeDismiss: dismissNudge,
            revealBtnRef: rotateRevealBtnRef,
            paperAnchorRef: rotatePaperAnchorRef,
            blueBoxRef: rotateBlueBoxRef,
            onRotateFlowComplete: handleRotateFlowComplete,
          })
        : zoomActive
          ? React.createElement(ZoomCanvas, {
              key: "zoom-" + resetKey,
              fromStep1: zoomFromStep1,
              onUpdateQuestion: handleUpdateQuestion,
              onNudgeTarget: setNudgeTarget,
              onNudgeDismiss: dismissNudge,
              revealBtnRef: zoomRevealBtnRef,
              paperAnchorRef: zoomPaperAnchorRef,
              blueBoxRef: zoomBlueBoxRef,
              onZoomFlowComplete: handleZoomFlowComplete,
            })
          : mirrorActive
            ? React.createElement(MirrorCanvas, {
                key: "mirror-" + resetKey,
                fromStep1: mirrorFromStep1,
                onUpdateQuestion: handleUpdateQuestion,
                onNudgeTarget: setNudgeTarget,
                onNudgeDismiss: dismissNudge,
                reflectorRef: mirrorReflectorRef,
                mirrorLineRef: mirrorLineRef,
                revealBtnRef: mirrorRevealBtnRef,
                blueBoxRef: mirrorBlueBoxRef,
                onMirrorFlowComplete: handleMirrorFlowComplete,
              })
            : React.createElement(MainCanvas, {
            key: resetKey,
            step: currentStep,
            onSnapComplete: handleSnapComplete,
            onUpdateQuestion: handleUpdateQuestion,
            onMoveFlowComplete: handleMoveFlowComplete,
            onNudgeTarget: setNudgeTarget,
            onNudgeDismiss: dismissNudge,
            greyNudgeAnchorRef: greyNudgeAnchorRef,
            blueBoxRef: blueBoxRef,
          })
    ),
    React.createElement(Navigation, {
      activeButton: activeTransform,
      clickableButtons: getClickableButtons(),
      exploredButtons: getExploredButtons(),
      showExploredImages: navChoiceVisible,
      navText: getNavText(),
      navTextVisible: navChoiceVisible,
      showStartOver: allTransformsExplored && navChoiceVisible,
      startOverText: APP_DATA.navigation.startOver,
      onButtonClick: handleTransformClick,
      onStartOver: handleRestart,
      moveBtnRef: moveBtnRef,
    }),
    nudgeElement
  );
};
