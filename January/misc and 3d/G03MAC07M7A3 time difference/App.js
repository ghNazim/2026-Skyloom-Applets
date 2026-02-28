const App = () => {
  const { useState, useEffect, useRef, useCallback } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [tappedStartTime, setTappedStartTime] = useState(false);
  const [tappedEndTime, setTappedEndTime] = useState(false);
  const [tappedDuration, setTappedDuration] = useState(false);
  const [showNudge, setShowNudge] = useState(true);

  const startTimeRef = useRef(null);
  const endTimeRef = useRef(null);
  const durationLabelRef = useRef(null);
  const [nudgePosition, setNudgePosition] = useState(null);
  const nudgeTimerRef = useRef(null);

  const handleStart = () => {
    playSound("click");
    setCurrentStep(1);
  };

  const handleNext = () => {
    playSound("click");
    setCurrentStep(prev => {
      if (prev === 1) return 3;
      return prev + 1;
    });
  };

  const handlePrev = () => {
    playSound("click");
    setCurrentStep(prev => {
      if (prev === 3) return 1;
      return Math.max(0, prev - 1);
    });
  };

  const handleStartOver = () => {
    playSound("click");
    setCurrentStep(0);
    setTappedStartTime(false);
    setTappedEndTime(false);
    setTappedDuration(false);
    setShowNudge(true);
  };

  const handleStartTimeClick = () => {
    if (tappedStartTime) return;
    playSound("click");
    setTappedStartTime(true);
    setShowNudge(false);
    setNudgePosition(null);
    if (nudgeTimerRef.current) clearTimeout(nudgeTimerRef.current);
    nudgeTimerRef.current = setTimeout(() => setShowNudge(true), 2000);
  };

  const handleEndTimeClick = () => {
    if (!tappedStartTime || tappedEndTime) return;
    playSound("click");
    setTappedEndTime(true);
    setShowNudge(false);
    setNudgePosition(null);
    if (nudgeTimerRef.current) clearTimeout(nudgeTimerRef.current);
    nudgeTimerRef.current = setTimeout(() => setShowNudge(true), 2000);
  };

  const handleDurationClick = () => {
    if (!tappedStartTime || !tappedEndTime || tappedDuration) return;
    playSound("click");
    setTappedDuration(true);
    setShowNudge(false);
    setNudgePosition(null);
    if (nudgeTimerRef.current) clearTimeout(nudgeTimerRef.current);
  };

  // Determine which element gets the nudge
  const getNudgeTarget = useCallback(() => {
    if (currentStep !== 1 || !showNudge) return null;
    if (!tappedStartTime) return startTimeRef.current;
    if (tappedStartTime && !tappedEndTime) return endTimeRef.current;
    if (tappedStartTime && tappedEndTime && !tappedDuration) return durationLabelRef.current;
    return null;
  }, [currentStep, showNudge, tappedStartTime, tappedEndTime, tappedDuration]);

  useEffect(() => {
    const el = getNudgeTarget();
    if (!el) {
      setNudgePosition(null);
      return;
    }
    const update = () => {
      const r = el.getBoundingClientRect();
      setNudgePosition({ left: r.left, top: r.top, width: r.width, height: r.height });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [getNudgeTarget]);

  useEffect(() => {
    return () => { if (nudgeTimerRef.current) clearTimeout(nudgeTimerRef.current); };
  }, []);

  const d = APP_DATA.step1;
  const grey = "#888";

  // Step 1: Determine state
  const canClickStartTime = currentStep === 1 && !tappedStartTime;
  const canClickEndTime = currentStep === 1 && tappedStartTime && !tappedEndTime;
  const canClickDuration = currentStep === 1 && tappedStartTime && tappedEndTime && !tappedDuration;
  const canNextStep1 = tappedStartTime && tappedEndTime && tappedDuration;

  // Step 1: colors and callout
  const startTimeColorStep1 = (tappedEndTime || tappedDuration) ? grey : "#00FFFF";
  const endTimeColorStep1 = (tappedStartTime && !tappedEndTime) || tappedDuration ? grey : "#FF9900";
  const durationColorStep1 = tappedStartTime && !tappedDuration ? grey : "white";

  let navTextStep1 = d.nav.tapStartTime;
  if (tappedStartTime && !tappedEndTime) navTextStep1 = d.nav.tapEndTime;
  else if (tappedEndTime && !tappedDuration) navTextStep1 = d.nav.tapDuration;
  else if (canNextStep1) navTextStep1 = APP_DATA.common.tapNextToContinue;

  let activeCallout = null;
  if (currentStep === 1 && tappedStartTime && !tappedEndTime) {
    activeCallout = { position: { left: 28, top: 18 }, bgColor: "#00FFFFAA", tailPlacement: "below", text: d.callouts.startTime };
  } else if (currentStep === 1 && tappedEndTime && !tappedDuration) {
    activeCallout = { position: { left: 72, top: 18 }, bgColor: "#FF9900AA", tailPlacement: "below", text: d.callouts.endTime };
  } else if (currentStep === 1 && tappedDuration) {
    activeCallout = { position: { left: 50, top: 68 }, bgColor: "#CCCC00AA", tailPlacement: "above", text: d.callouts.duration };
  }

  // Step 0: Fullscreen
  if (currentStep === 0) {
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(
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
          })
        )
      )
    );
  }

  // Step 7: Fullscreen summary
  const step7Data = APP_DATA.steps[7];
  if (currentStep === 7 && step7Data && step7Data.layout === "fullscreen") {
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(
        "div",
        { className: "applet-container" },
        React.createElement(
          "div",
          { className: "app-main-content", style: { position: "relative" } },
          React.createElement(Fullscreen, {
            heading: step7Data.heading,
            formulasHtml: step7Data.formulasAll,
            image: step7Data.image,
            buttonText: step7Data.buttonText,
            onButtonClick: handleStartOver,
          })
        )
      )
    );
  }

  // Steps 1, 3-6: With character + timeline
  const stepData = APP_DATA.steps[currentStep];
  if (stepData && stepData.layout === "with-character-timeline") {
    const isStep1 = currentStep === 1;
    const startTimeColor = isStep1 ? startTimeColorStep1 : "#00FFFF";
    const endTimeColor = isStep1 ? endTimeColorStep1 : "#FF9900";
    const durationColor = isStep1 ? durationColorStep1 : "white";

    let formulaHtml = null;
    let arrowImage = null;
    let glowStartTime = false;
    let glowEndTime = false;
    let glowDuration = false;
    let showDifferenceText = false;

    if (currentStep === 4) {
      formulaHtml = d.formulas.startTime;
      arrowImage = "rtl.png";
      glowStartTime = true;
    } else if (currentStep === 5) {
      formulaHtml = d.formulas.endTime;
      arrowImage = "ltr.png";
      glowEndTime = true;
    } else if (currentStep === 6) {
      formulaHtml = d.formulas.duration;
      glowDuration = true;
      showDifferenceText = true;
    }

    const navText = isStep1 ? navTextStep1 : stepData.navText;
    const nextDisabled = isStep1 ? !canNextStep1 : false;

    const handleNav = (dir) => {
      if (dir === "prev") handlePrev();
      else handleNext();
    };

    const nudgeVisible = !!nudgePosition && showNudge && isStep1 && !canNextStep1;

    return React.createElement(
      React.Fragment,
      null,
      React.createElement(
        "div",
        { className: "applet-container" },
        React.createElement(
          "div",
          { className: "with-character-layout duration-step-main" },
          React.createElement(CharacterPanel, {
            characterImage: stepData.characterImage,
            characterText: stepData.characterText,
          }),
          React.createElement(ContentPanel, {
            timelineMode: true,
            mainVisualLeft: React.createElement(TimelineContent, {
              labels: d.labels,
              startTimeColor,
              endTimeColor,
              durationColor,
              onClickStartTime: canClickStartTime ? handleStartTimeClick : undefined,
              onClickEndTime: canClickEndTime ? handleEndTimeClick : undefined,
              onClickDuration: canClickDuration ? handleDurationClick : undefined,
              activeCallout: isStep1 ? activeCallout : null,
              nudgeTargetRef: startTimeRef,
              endTimeRef,
              durationRef: durationLabelRef,
              formulaHtml,
              arrowImage,
              glowStartTime,
              glowEndTime,
              glowDuration,
              showDifferenceText,
              differenceText: currentStep === 6 ? stepData.differenceText : undefined,
            }),
            mainVisualRight: null,
          })
        ),
        React.createElement(Navigation, {
          onNav: handleNav,
          isNextDisabled: nextDisabled,
          isPrevDisabled: currentStep <= 1,
          navText,
        })
      ),
      React.createElement(Nudge, { show: nudgeVisible, position: nudgePosition })
    );
  }

  return null;
};
