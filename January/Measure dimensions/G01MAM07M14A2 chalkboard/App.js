const HorizontalArrow = ({ color = "#f0c030", blink = false }) => {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = "";
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 200 20");
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    svg.style.width = "100%";
    svg.style.height = "100%";
    const g = createBiDirectionalArrow(3, 10, 197, 10, {
      color,
      width: 3,
      headSize: 8,
    });
    svg.appendChild(g);
    ref.current.appendChild(svg);
  }, [color]);
  return React.createElement("div", {
    ref,
    className: "arrow-wrap horizontal-arrow" + (blink ? " arrow-blink" : ""),
  });
};

const VerticalArrow = ({ color = "#00ffff", blink = false }) => {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = "";
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 20 200");
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    svg.style.width = "100%";
    svg.style.height = "100%";
    const g = createBiDirectionalArrow(10, 6, 10, 194, {
      color,
      width: 3,
      headSize: 14,
    });
    svg.appendChild(g);
    ref.current.appendChild(svg);
  }, [color]);
  return React.createElement("div", {
    ref,
    className: "arrow-wrap vertical-arrow" + (blink ? " arrow-blink" : ""),
  });
};

const App = () => {
  const { useState, useEffect, useLayoutEffect, useRef } = React;
  const ce = React.createElement;

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedLengthUnit, setSelectedLengthUnit] = useState(null);
  const [selectedHeightUnit, setSelectedHeightUnit] = useState(null);
  const [lengthPlaced, setLengthPlaced] = useState(false);
  const [heightPlaced, setHeightPlaced] = useState(false);
  const [countedLength, setCountedLength] = useState(0);
  const [countedHeight, setCountedHeight] = useState(0);

  const hPlacedRef = useRef(null);
  const vPlacedRef = useRef(null);
  const fullscreenButtonRef = useRef(null);
  const nextButtonRef = useRef(null);
  const actionButtonRef = useRef(null);
  const sourceUnitRef = useRef(null);
  const clickableUnitRef = useRef(null);
  const [nudgePosition, setNudgePosition] = useState(null);

  const lengthCount = selectedLengthUnit
    ? BOARD_DATA.length[selectedLengthUnit]
    : 0;
  const heightCount = selectedHeightUnit
    ? BOARD_DATA.height[selectedHeightUnit]
    : 0;
  const lengthCountDone =
    countedLength >= lengthCount && lengthCount > 0;
  const heightCountDone =
    countedHeight >= heightCount && heightCount > 0;

  const capitalize = (s) =>
    s ? s.charAt(0).toUpperCase() + s.slice(1) : "";

  const t = (template, reps = {}) => {
    if (!template) return "";
    let result = template;
    Object.keys(reps).forEach((key) => {
      result = result.split("{{" + key + "}}").join(reps[key]);
    });
    return result;
  };

  const lengthReps = () => {
    const name = selectedLengthUnit
      ? APP_DATA.unitNames[selectedLengthUnit]
      : "";
    const plural = selectedLengthUnit
      ? APP_DATA.unitPlurals[selectedLengthUnit]
      : "";
    return {
      unit: name,
      units: plural,
      Units: capitalize(plural),
      count: String(lengthCount),
    };
  };

  const heightReps = () => {
    const name = selectedHeightUnit
      ? APP_DATA.unitNames[selectedHeightUnit]
      : "";
    const plural = selectedHeightUnit
      ? APP_DATA.unitPlurals[selectedHeightUnit]
      : "";
    return {
      unit: name,
      units: plural,
      Units: capitalize(plural),
      count: String(heightCount),
    };
  };

  // ===== ANIMATIONS =====

  useLayoutEffect(() => {
    if (currentStep !== 3 || !lengthPlaced || !hPlacedRef.current) return;
    const items = hPlacedRef.current.querySelectorAll(".placed-unit");
    gsap.set(items, { scale: 0, opacity: 0 });
  }, [currentStep, lengthPlaced]);

  useEffect(() => {
    if (currentStep !== 3 || !lengthPlaced || !hPlacedRef.current) return;
    const items = hPlacedRef.current.querySelectorAll(".placed-unit");
    if (items.length === 0) return;
    const staggerDelay = 0.06;
    items.forEach((_, i) => {
      setTimeout(() => playSound("tick"), i * staggerDelay * 1000);
    });
    gsap.to(items, {
      scale: 1,
      opacity: 1,
      duration: 0.25,
      stagger: staggerDelay,
      ease: "back.out(1.7)",
      onComplete: () => setTimeout(() => setCurrentStep(4), 400),
    });
  }, [currentStep, lengthPlaced]);

  useLayoutEffect(() => {
    if (currentStep !== 8 || !heightPlaced || !vPlacedRef.current) return;
    const items = vPlacedRef.current.querySelectorAll(".placed-unit");
    gsap.set(items, { scale: 0, opacity: 0 });
  }, [currentStep, heightPlaced]);

  useEffect(() => {
    if (currentStep !== 8 || !heightPlaced || !vPlacedRef.current) return;
    const items = vPlacedRef.current.querySelectorAll(".placed-unit");
    if (items.length === 0) return;
    const staggerDelay = 0.06;
    items.forEach((_, i) => {
      setTimeout(() => playSound("tick"), i * staggerDelay * 1000);
    });
    gsap.to(items, {
      scale: 1,
      opacity: 1,
      duration: 0.25,
      stagger: staggerDelay,
      ease: "back.out(1.7)",
      onComplete: () => setTimeout(() => setCurrentStep(9), 400),
    });
  }, [currentStep, heightPlaced]);

  // ===== HANDLERS =====

  const handleStart = () => {
    playSound("click");
    setCurrentStep(1);
  };

  const handleStartOver = () => {
    playSound("click");
    setCurrentStep(0);
    setSelectedLengthUnit(null);
    setSelectedHeightUnit(null);
    setLengthPlaced(false);
    setHeightPlaced(false);
    setCountedLength(0);
    setCountedHeight(0);
  };

  const handleActionButton = () => {
    playSound("click");
    setCurrentStep(2);
  };

  const handleSelectLengthUnit = (key) => {
    playSound("click");
    setSelectedLengthUnit(key);
    setCurrentStep(3);
  };

  const handleSelectHeightUnit = (key) => {
    playSound("click");
    setSelectedHeightUnit(key);
    setCurrentStep(8);
  };

  const handlePlaceLength = () => {
    if (lengthPlaced) return;
    playSound("click");
    setLengthPlaced(true);
  };

  const handlePlaceHeight = () => {
    if (heightPlaced) return;
    playSound("click");
    setHeightPlaced(true);
  };

  const handleCountLength = (index) => {
    if (index !== countedLength) return;
    playSound("tick");
    setCountedLength((prev) => prev + 1);
  };

  const handleCountHeight = (index) => {
    if (index !== countedHeight) return;
    playSound("tick");
    setCountedHeight((prev) => prev + 1);
  };

  const handleNext = () => {
    playSound("click");
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevious = () => {
    playSound("click");
    const prevStep = currentStep - 1;
    setCurrentStep(prevStep);
    // Reset all states that get set at or after the step we're going to
    if (prevStep <= 1) {
      setSelectedLengthUnit(null);
      setLengthPlaced(false);
      setCountedLength(0);
      setSelectedHeightUnit(null);
      setHeightPlaced(false);
      setCountedHeight(0);
    } else if (prevStep <= 2) {
      setLengthPlaced(false);
      setCountedLength(0);
      setSelectedHeightUnit(null);
      setHeightPlaced(false);
      setCountedHeight(0);
    } else if (prevStep <= 3) {
      setLengthPlaced(false);
      setCountedLength(0);
      setSelectedHeightUnit(null);
      setHeightPlaced(false);
      setCountedHeight(0);
    } else if (prevStep <= 5) {
      setCountedLength(0);
      setSelectedHeightUnit(null);
      setHeightPlaced(false);
      setCountedHeight(0);
    } else if (prevStep <= 7) {
      setSelectedHeightUnit(null);
      setHeightPlaced(false);
      setCountedHeight(0);
    } else if (prevStep <= 8) {
      setHeightPlaced(false);
      setCountedHeight(0);
    } else if (prevStep <= 10) {
      setCountedHeight(0);
    }
  };

  // ===== TEXT HELPERS =====

  const getCharacterText = () => {
    const lr = lengthReps();
    const hr = heightReps();
    switch (currentStep) {
      case 1:
        return APP_DATA.step1.characterText;
      case 2:
        return APP_DATA.step2.characterText;
      case 3:
        return t(APP_DATA.step3.characterText, lr);
      case 4:
        return lengthCountDone
          ? t(APP_DATA.step4.characterTextDone, lr)
          : t(APP_DATA.step4.characterText, lr);
      case 5:
        return t(APP_DATA.step5.characterText, lr);
      case 6:
        return APP_DATA.step6.characterText;
      case 7:
        return APP_DATA.step7.characterText;
      case 8:
        return t(APP_DATA.step8.characterText, hr);
      case 9:
        return heightCountDone
          ? t(APP_DATA.step9.characterTextDone, hr)
          : t(APP_DATA.step9.characterText, hr);
      case 10:
        return t(APP_DATA.step10.characterText, hr);
      case 11:
        return APP_DATA.step11.characterText;
      default:
        return "";
    }
  };

  const getNavText = () => {
    const lr = lengthReps();
    const hr = heightReps();
    switch (currentStep) {
      case 1:
        return APP_DATA.step1.navText;
      case 2:
        return APP_DATA.step2.navText;
      case 3:
        return t(APP_DATA.step3.navText, lr);
      case 4:
        return lengthCountDone
          ? APP_DATA.step4.navTextDone
          : t(APP_DATA.step4.navText, lr);
      case 5:
        return APP_DATA.step5.navText;
      case 6:
        return APP_DATA.step6.navText;
      case 7:
        return APP_DATA.step7.navText;
      case 8:
        return t(APP_DATA.step8.navText, hr);
      case 9:
        return heightCountDone
          ? APP_DATA.step9.navTextDone
          : t(APP_DATA.step9.navText, hr);
      case 10:
        return APP_DATA.step10.navText;
      case 11:
        return APP_DATA.step11.navText;
      default:
        return "";
    }
  };

  const isNextDisabled = () => {
    if ([1, 2, 3, 7, 8].includes(currentStep)) return true;
    if (currentStep === 4) return !lengthCountDone;
    if (currentStep === 9) return !heightCountDone;
    return false;
  };

  const showNudgeOnFullscreen = currentStep === 0 || currentStep === 12;
  const showNudgeOnActionButton = currentStep === 1;
  const showNudgeOnNext =
    [4, 5, 6, 9, 10, 11].includes(currentStep) &&
    !isNextDisabled() &&
    (currentStep !== 4 || lengthCountDone) &&
    (currentStep !== 9 || heightCountDone);
  const showNudgeOnSourceUnit =
    (currentStep === 3 && !lengthPlaced) ||
    (currentStep === 8 && !heightPlaced);
  const showNudgeOnClickableUnit =
    (currentStep === 4 && !lengthCountDone) ||
    (currentStep === 9 && !heightCountDone);

  useEffect(() => {
    const updateNudge = () => {
      let el = null;
      if (showNudgeOnFullscreen) el = fullscreenButtonRef.current;
      else if (showNudgeOnActionButton) el = actionButtonRef.current;
      else if (showNudgeOnSourceUnit) el = sourceUnitRef.current;
      else if (showNudgeOnNext) el = nextButtonRef.current;
      else if (showNudgeOnClickableUnit) el = clickableUnitRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        setNudgePosition({ left: rect.left, top: rect.top, width: rect.width, height: rect.height });
      } else {
        setNudgePosition(null);
      }
    };
    const t = setTimeout(updateNudge, 50);
    return () => clearTimeout(t);
  }, [
    currentStep,
    lengthCountDone,
    heightCountDone,
    lengthPlaced,
    heightPlaced,
    countedLength,
    countedHeight,
    showNudgeOnFullscreen,
    showNudgeOnActionButton,
    showNudgeOnSourceUnit,
    showNudgeOnNext,
    showNudgeOnClickableUnit,
  ]);

  // ===== STEP 0: START =====
  if (currentStep === 0) {
    return ce(
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
      ce(Nudge, { show: !!nudgePosition, position: nudgePosition }),
    );
  }

  // ===== STEP 12: END =====
  if (currentStep === 12) {
    return ce(
      "div",
      { className: "applet-container" },
      ce(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        ce(Fullscreen, {
          heading: APP_DATA.end.heading,
          text: APP_DATA.end.text,
          buttonText: APP_DATA.end.buttonText,
          onButtonClick: handleStartOver,
          buttonRef: fullscreenButtonRef,
        }),
      ),
      ce(Nudge, { show: !!nudgePosition, position: nudgePosition }),
    );
  }

  // ===== STEPS 1-11: MAIN LAYOUT =====

  const showUnitCol = currentStep >= 2 && currentStep <= 10;
  const objColClass = "object-column" + (showUnitCol ? "" : " full");

  const showHContainer =
    (currentStep >= 2 && currentStep <= 5) || currentStep === 11;
  const showHArrow = currentStep === 2 || currentStep === 11;
  const showHUnits = lengthPlaced && currentStep >= 3 && currentStep <= 5;

  const showVContainer =
    (currentStep >= 6 && currentStep <= 10) || currentStep === 11;
  const showVArrow = currentStep === 6 || currentStep === 11;
  const showVUnits = heightPlaced && currentStep >= 8 && currentStep <= 10;

  const showLengthCounts = currentStep >= 4 && currentStep <= 5;
  const showHeightCounts = currentStep >= 9 && currentStep <= 10;

  // Question heading
  let questionHtml = null;
  if (currentStep === 4 && lengthCountDone) {
    questionHtml = t(APP_DATA.step4.questionText, lengthReps());
  } else if (currentStep === 5) {
    questionHtml = t(APP_DATA.step5.questionText, lengthReps());
  } else if (currentStep === 9 && heightCountDone) {
    questionHtml = t(APP_DATA.step9.questionText, heightReps());
  } else if (currentStep === 10) {
    questionHtml = t(APP_DATA.step10.questionText, heightReps());
  } else if (currentStep === 11) {
    questionHtml = APP_DATA.step11.questionText;
  }

  // ===== BUILD HORIZONTAL ITEMS =====
  const buildHorizontalItems = () => {
    if (!showHUnits) return [];
    const unitData = HORIZONTAL_UNITS.find(
      (u) => u.key === selectedLengthUnit,
    );
    if (!unitData) return [];
    const items = [];
    for (let i = 0; i < lengthCount; i++) {
      const isCounted = i < countedLength;
      const isClickable =
        currentStep === 4 && !lengthCountDone && i === countedLength;
      items.push(
        ce(
          "div",
          {
            key: "hpu-" + i,
            ref: isClickable ? clickableUnitRef : undefined,
            className: "placed-unit" + (isClickable ? " clickable" : ""),
            style: { width: 100 / lengthCount + "%" },
            onClick: isClickable
              ? () => handleCountLength(i)
              : undefined,
          },
          ce("img", { src: "assets/" + unitData.image, alt: "" }),
          showLengthCounts &&
            isCounted &&
            ce("div", {
              className:
                "count-div length-count" +
                (i === lengthCount - 1 ? " big" : "") +
                (currentStep === 4 && i === lengthCount - 1 ? " count-pulsate" : ""),
            }, i + 1),
        ),
      );
    }
    return items;
  };

  // ===== BUILD VERTICAL ITEMS =====
  const buildVerticalItems = () => {
    if (!showVUnits) return [];
    const unitData = VERTICAL_UNITS.find(
      (u) => u.key === selectedHeightUnit,
    );
    if (!unitData) return [];
    const items = [];
    for (let i = 0; i < heightCount; i++) {
      const isCounted = i < countedHeight;
      const isClickable =
        currentStep === 9 && !heightCountDone && i === countedHeight;
      items.push(
        ce(
          "div",
          {
            key: "vpu-" + i,
            ref: isClickable ? clickableUnitRef : undefined,
            className: "placed-unit" + (isClickable ? " clickable" : ""),
            onClick: isClickable
              ? () => handleCountHeight(i)
              : undefined,
          },
          ce("img", {
            src: "assets/" + unitData.image,
            alt: "",
            style: { height: "100%", width: "auto" },
          }),
          showHeightCounts &&
            isCounted &&
            ce("div", {
              className:
                "count-div height-count" +
                (i === heightCount - 1 ? " big" : "") +
                (currentStep === 9 && i === heightCount - 1 ? " count-pulsate" : ""),
            }, i + 1),
        ),
      );
    }
    return items;
  };

  // ===== RENDER HORIZONTAL CONTAINER =====
  const renderHContainer = () => {
    if (!showHContainer) return null;
    const hItems = buildHorizontalItems();
    return ce(
      "div",
      {
        ref: hPlacedRef,
        className: "placed-units-container horizontal",
      },
      showHArrow && ce(HorizontalArrow, {
        blink: currentStep === 2,
      }),
      ...hItems,
    );
  };

  // ===== RENDER VERTICAL MEASUREMENT =====
  const renderVMeasurement = () => {
    if (!showVContainer) return null;
    const vItems = buildVerticalItems();
    const children = [
      ce(
        "div",
        {
          ref: vPlacedRef,
          className: "placed-units-container vertical",
          key: "vc",
        },
        showVArrow && ce(VerticalArrow, {
          blink: currentStep === 6,
        }),
        ...vItems,
      ),
    ];
    if (currentStep === 11) {
      children.push(
        ce("div", {
          key: "hlabel",
          className: "measurement-label height-label",
          dangerouslySetInnerHTML: {
            __html: t(APP_DATA.step11.heightLabel, {
              count: String(heightCount),
              units: APP_DATA.unitPlurals[selectedHeightUnit] || "",
            }),
          },
        }),
      );
    }
    return ce(
      "div",
      { className: "vertical-measurement" },
      ...children,
    );
  };

  // ===== RENDER UNIT COLUMN =====
  const renderUnitColumn = () => {
    if (!showUnitCol) return null;

    if (currentStep === 2) {
      return ce(
        "div",
        { className: "unit-column step2-units" },
        HORIZONTAL_UNITS.map((unit) =>
          ce(
            "div",
            {
              key: unit.key,
              className: "unit-item horizontal-unit-item",
              style: { width: unit.width || "auto" },
              onClick: () => handleSelectLengthUnit(unit.key),
            },
            ce("img", {
              src: "assets/" + unit.image,
              alt: APP_DATA.unitNames[unit.key],
            }),
          ),
        ),
      );
    }

    if (currentStep >= 3 && currentStep <= 5) {
      const unitData = HORIZONTAL_UNITS.find(
        (u) => u.key === selectedLengthUnit,
      );
      if (!unitData) return ce("div", { className: "unit-column" });
      const isClickable = currentStep === 3 && !lengthPlaced;
      return ce(
        "div",
        { className: "unit-column" },
        ce(
          "div",
          {
            ref: isClickable ? sourceUnitRef : undefined,
            className:
              "unit-item horizontal-unit-item" + (isClickable ? " source-clickable" : ""),
            onClick: isClickable ? handlePlaceLength : undefined,
            style: { cursor: isClickable ? "pointer" : "default", width: unitData.width || "auto" },
          },
          ce("img", { src: "assets/" + unitData.image, alt: "" }),
        ),
      );
    }

    if (currentStep === 6) {
      return ce("div", { className: "unit-column" });
    }

    if (currentStep === 7) {
      return ce(
        "div",
        { className: "unit-column step2-units" },
        VERTICAL_UNITS.map((unit) =>
          ce(
            "div",
            {
              key: unit.key,
              className: "unit-item vertical-unit-item",
              onClick: () => handleSelectHeightUnit(unit.key),
            },
            ce("img", {
              src: "assets/" + unit.image,
              alt: APP_DATA.unitNames[unit.key],
              style: { height: unit.height, width: "auto" },
            }),
          ),
        ),
      );
    }

    if (currentStep >= 8 && currentStep <= 10) {
      const unitData = VERTICAL_UNITS.find(
        (u) => u.key === selectedHeightUnit,
      );
      if (!unitData) return ce("div", { className: "unit-column" });
      const isClickable = currentStep === 8 && !heightPlaced;
      return ce(
        "div",
        { className: "unit-column" },
        ce(
          "div",
          {
            ref: isClickable ? sourceUnitRef : undefined,
            className:
              "unit-item" + (isClickable ? " source-clickable" : ""),
            onClick: isClickable ? handlePlaceHeight : undefined,
            style: { cursor: isClickable ? "pointer" : "default" },
          },
          ce("img", {
            src: "assets/" + unitData.image,
            alt: "",
            style: { height: unitData.height, width: "auto" },
          }),
        ),
      );
    }

    return null;
  };

  // ===== MAIN RENDER =====
  const boardAreaChildren = [
    ce("img", {
      src: "assets/board.png",
      className: "measure-object-image",
      alt: "board",
      key: "board",
    }),
  ];

  if (showVContainer) {
    boardAreaChildren.push(
      React.cloneElement(renderVMeasurement(), { key: "vmeas" }),
    );
  }

  if (showHContainer) {
    boardAreaChildren.push(
      React.cloneElement(renderHContainer(), { key: "hcont" }),
    );
  }

  if (currentStep === 11) {
    boardAreaChildren.push(
      ce("div", {
        key: "llabel",
        className: "measurement-label length-label",
        dangerouslySetInnerHTML: {
          __html: t(APP_DATA.step11.lengthLabel, {
            count: String(lengthCount),
            units: APP_DATA.unitPlurals[selectedLengthUnit] || "",
          }),
        },
      }),
    );
  }

  return ce(
    "div",
    { className: "applet-container" },
    ce(
      "div",
      { className: "with-character-layout" },
      ce(CharacterPanel, {
        characterImage: "chardefault.png",
        characterText: getCharacterText(),
      }),
      ce(
        ContentPanel,
        null,
        ce(
          "div",
          { className: "step-content" },
          ce(
            "div",
            { className: "step-main-row" },
            ce(
              "div",
              { className: objColClass },
              questionHtml &&
                ce("div", {
                  className:
                    "question-heading" +
                    ([5, 10].includes(currentStep) ? " glow-text" : ""),
                  dangerouslySetInnerHTML: { __html: questionHtml },
                }),
              ce("div", {
                className: "board-area" + (showVContainer ? " with-vertical" : ""),
              }, ...boardAreaChildren),
              currentStep === 1 &&
                ce(
                  "button",
                  {
                    ref: actionButtonRef,
                    className: "action-button pulsate",
                    onClick: handleActionButton,
                  },
                  APP_DATA.step1.actionButton,
                ),
            ),
            renderUnitColumn(),
          ),
        ),
      ),
    ),
    ce(Navigation, {
      onNav: (dir) => {
        if (dir === "next") handleNext();
        if (dir === "prev") handlePrevious();
      },
      isPrevDisabled: false,
      isNextDisabled: isNextDisabled(),
      navText: getNavText(),
      nextButtonRef: nextButtonRef,
    }),
    ce(Nudge, { show: !!nudgePosition, position: nudgePosition }),
  );
};
