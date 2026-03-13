// Vertical bidirectional arrow (up-down) for the "fewer units" feedback
const VIEWBOX_HEIGHT = 100;
const DESIRED_HEAD_PX = 12;
const MAX_HEAD_VIEWBOX = 28;

const BidirectionalArrow = () => {
  const ref = React.useRef(null);
  const [headSize, setHeadSize] = React.useState(15);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const updateHeadSize = () => {
      const height = el.clientHeight || 1;
      const size = Math.min(
        (DESIRED_HEAD_PX * VIEWBOX_HEIGHT) / height,
        MAX_HEAD_VIEWBOX
      );
      setHeadSize(size);
    };
    updateHeadSize();
    const ro = new ResizeObserver(updateHeadSize);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  React.useEffect(() => {
    if (!ref.current) return;
    const wrap = ref.current;
    wrap.innerHTML = "";
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 20 " + VIEWBOX_HEIGHT);
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    svg.setAttribute("class", "bidirectional-arrow-svg");
    const g = createBiDirectionalArrow(10, 5, 10, 95, {
      color: "#e74c3c",
      width: 2,
      headSize,
    });
    svg.appendChild(g);
    wrap.appendChild(svg);
  }, [headSize]);

  return React.createElement("div", {
    ref,
    className: "bidirectional-arrow-wrap",
  });
};

const App = () => {
  const { useState, useCallback, useEffect } = React;
  const ce = React.createElement;

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedObject, setSelectedObject] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [completedObjects, setCompletedObjects] = useState([]);
  const [usedUnits, setUsedUnits] = useState([]);

  const [placedCount, setPlacedCount] = useState(0);
  const [step3Feedback, setStep3Feedback] = useState(null);
  const [step3CheckedMore, setStep3CheckedMore] = useState(false);

  const [step4Answer, setStep4Answer] = useState(null);
  const [step4Feedback, setStep4Feedback] = useState(null);
  const [showCountDivs, setShowCountDivs] = useState(false);
  const [countDivsVisible, setCountDivsVisible] = useState(0);
  const [numpadDisabled, setNumpadDisabled] = useState(false);
  const placedUnitsContainerRef = React.useRef(null);
  const prevPlacedCountRef = React.useRef(0);

  // Nudge refs/state
  const startButtonRef = React.useRef(null);
  const unitSourceRef = React.useRef(null);

  const [startNudgePos, setStartNudgePos] = useState(null);
  const [nextNudgePos, setNextNudgePos] = useState(null);
  const [wheelNudgePos, setWheelNudgePos] = useState(null);
  const [unitSourceNudgePos, setUnitSourceNudgePos] = useState(null);
  const [removeExtraNudgePos, setRemoveExtraNudgePos] = useState(null);

  const [showStartNudge, setShowStartNudge] = useState(true);
  const [showNextNudge, setShowNextNudge] = useState(false);
  const [showWheelNudge, setShowWheelNudge] = useState(true);
  const [showUnitSourceNudge, setShowUnitSourceNudge] = useState(true);
  const [showRemoveExtraNudge, setShowRemoveExtraNudge] = useState(true);

  const getRect = (el) => {
    if (!el || typeof el.getBoundingClientRect !== "function") return null;
    const r = el.getBoundingClientRect();
    return { left: r.left, top: r.top, width: r.width, height: r.height };
  };

  const getCorrectCount = useCallback(() => {
    if (!selectedObject || !selectedUnit) return 0;
    const objData = MEASUREMENT_DATA.find((d) => d.object === selectedObject);
    return objData ? objData[selectedUnit] : 0;
  }, [selectedObject, selectedUnit]);

  const getCorrectCountFor = (objKey, unitKey) => {
    const objData = MEASUREMENT_DATA.find((d) => d.object === objKey);
    return objData ? objData[unitKey] : 0;
  };

  const correctCount = getCorrectCount();
  const maxPlaceable = correctCount + 1;

  const objectName = selectedObject ? APP_DATA.objectNames[selectedObject] : "";
  const unitName = selectedUnit ? APP_DATA.unitNames[selectedUnit] : "";
  const unitPlural = selectedUnit ? APP_DATA.unitPlurals[selectedUnit] : "";
  const selectedObjectClass = selectedObject
    ? String(selectedObject).toLowerCase().replace(/\\s+/g, "-")
    : "";

  const t = (template, extra) => {
    if (!template) return "";
    let result = template;
    const reps = {
      object: objectName,
      unit: unitName,
      units: unitPlural,
      Units: unitPlural
        ? unitPlural.charAt(0).toUpperCase() + unitPlural.slice(1)
        : "",
      count: String(correctCount),
    };
    if (extra) Object.assign(reps, extra);
    Object.keys(reps).forEach((key) => {
      result = result.split("{{" + key + "}}").join(reps[key]);
    });
    return result;
  };

  // Animate last placed unit when adding in step 3 (appears at the top of the stack)
  useEffect(() => {
    if (currentStep !== 3) return;
    const added = placedCount > prevPlacedCountRef.current;
    prevPlacedCountRef.current = placedCount;
    if (!added) return;
    const container = placedUnitsContainerRef.current;
    if (!container) return;
    const lastChild = container.lastElementChild;
    if (!lastChild) return;
    gsap.fromTo(
      lastChild,
      {
        scale: 0.88,
        opacity: 0.6,
        transformOrigin: "center center",
      },
      {
        scale: 1,
        opacity: 1,
        duration: 0.28,
        ease: "sine.out",
        overwrite: true,
      },
    );
  }, [currentStep, placedCount]);

  // Stagger count divs in step 4
  useEffect(() => {
    if (currentStep !== 4 || !showCountDivs) return;
    if (countDivsVisible >= correctCount) return;
    const timer = setTimeout(() => {
      playSound("tick");
      setCountDivsVisible((prev) => prev + 1);
    }, 100);
    return () => clearTimeout(timer);
  }, [currentStep, showCountDivs, countDivsVisible, correctCount]);

  // Reset countDivsVisible when hiding
  useEffect(() => {
    if (!showCountDivs) setCountDivsVisible(0);
  }, [showCountDivs]);

  const getCharacterImage = () => {
    if (currentStep === 4) {
      if (step4Feedback === "wrong") return "charsad.png";
      if (step4Feedback === "correct") return "charhappy.png";
      return "chardefault.png";
    }
    if (step3Feedback === "fewer" || step3Feedback === "more")
      return "charsad.png";
    if (step3Feedback === "correct") return "charhappy.png";
    return "chardefault.png";
  };

  // ===== HANDLERS =====

  const handleStart = () => {
    playSound("click");
    setShowStartNudge(false);
    setCurrentStep(1);
  };

  const handleStartOver = () => {
    playSound("click");
    setCurrentStep(0);
    setSelectedObject(null);
    setSelectedUnit(null);
    setCompletedObjects([]);
    setUsedUnits([]);
    setPlacedCount(0);
    setStep3Feedback(null);
    setStep3CheckedMore(false);
    setStep4Answer(null);
    setStep4Feedback(null);
    setShowCountDivs(false);
    setNumpadDisabled(false);
    setShowStartNudge(true);
  };

  const handleObjectSelected = (objectKey) => {
    playSound("click");
    setSelectedObject(objectKey);
    const availableUnits = UNITS.filter((u) => !usedUnits.includes(u.key));
    if (availableUnits.length === 1) {
      setSelectedUnit(availableUnits[0].key);
      setPlacedCount(0);
      setStep3Feedback(null);
      setCurrentStep(3);
    } else {
      setCurrentStep(2);
    }
  };

  const handleUnitSelected = (unitKey) => {
    playSound("click");
    setSelectedUnit(unitKey);
    setPlacedCount(0);
    setStep3Feedback(null);
    setStep3CheckedMore(false);
    setCurrentStep(3);
  };

  const handlePlaceUnit = () => {
    if (placedCount >= maxPlaceable) return;
    if (step3Feedback === "correct") return;
    playSound("click");
    setShowUnitSourceNudge(false);
    if (step3Feedback) {
      setStep3Feedback(null);
    }
    setPlacedCount((prev) => prev + 1);
  };

  const handleRemoveExtra = () => {
    if (placedCount <= correctCount) return;
    playSound("click");
    setShowRemoveExtraNudge(false);
    const nextCount = placedCount - 1;
    setPlacedCount(nextCount);
    if (nextCount === correctCount) {
      setStep3Feedback(null);
      setStep3CheckedMore(false);
    }
  };

  const handleCheck = () => {
    if (placedCount === 0) return;
    if (step3Feedback === "correct") return;
    if (placedCount < correctCount) {
      playSound("wrong");
      setStep3Feedback("fewer");
      setStep3CheckedMore(false);
      setShowUnitSourceNudge(true); // nudge on unit source when red arrows show (add more)
    } else if (placedCount > correctCount) {
      playSound("wrong");
      setStep3Feedback("more");
      setStep3CheckedMore(true);
      setShowRemoveExtraNudge(true);
    } else {
      playSound("correct");
      setStep3Feedback("correct");
      setStep3CheckedMore(false);
    }
  };

  const handleNumpadClick = (num) => {
    if (numpadDisabled) return;
    if (step4Feedback === "wrong") {
      setStep4Feedback(null);
      setStep4Answer(num);
      return;
    }
    setStep4Answer((prev) => {
      const next = (prev === "?" ? "" : prev) + num;
      return next.length <= 2 ? next : prev;
    });
  };

  const handleNumpadClear = () => {
    if (numpadDisabled) return;
    setStep4Answer("");
    setStep4Feedback(null);
  };

  const handleNumpadSubmit = () => {
    if (numpadDisabled) return;
    const val = parseInt(step4Answer, 10);
    setCountDivsVisible(0);
    setShowCountDivs(true);
    if (val === correctCount) {
      playSound("correct");
      setStep4Feedback("correct");
      setNumpadDisabled(true);
    } else {
      playSound("wrong");
      setStep4Feedback("wrong");
    }
  };

  const goToStep4CorrectOf = (objKey, unitKey) => {
    const cnt = getCorrectCountFor(objKey, unitKey);
    setSelectedObject(objKey);
    setSelectedUnit(unitKey);
    setPlacedCount(cnt);
    setStep3Feedback("correct");
    setStep4Answer(String(cnt));
    setStep4Feedback("correct");
    setShowCountDivs(true);
    setCountDivsVisible(cnt);
    setNumpadDisabled(true);
    setCurrentStep(4);
  };

  const handlePrev = () => {
    playSound("click");
    if (currentStep === 1) {
      if (completedObjects.length === 0) return;
      const prevObj = completedObjects[completedObjects.length - 1];
      const prevUnit = usedUnits[usedUnits.length - 1];
      setCompletedObjects(completedObjects.slice(0, -1));
      setUsedUnits(usedUnits.slice(0, -1));
      goToStep4CorrectOf(prevObj, prevUnit);
    } else if (currentStep === 2) {
      setSelectedObject(null);
      setSelectedUnit(null);
      setCurrentStep(1);
    } else if (currentStep === 3) {
      setPlacedCount(0);
      setStep3Feedback(null);
      setSelectedUnit(null);
      setCurrentStep(2);
    } else if (currentStep === 4) {
      if (step4Feedback === "correct" && completedObjects.length > 0) {
        const prevObj = completedObjects[completedObjects.length - 1];
        const prevUnit = usedUnits[usedUnits.length - 1];
        setCompletedObjects(completedObjects.slice(0, -1));
        setUsedUnits(usedUnits.slice(0, -1));
        goToStep4CorrectOf(prevObj, prevUnit);
      } else {
        setStep4Answer("");
        setStep4Feedback(null);
        setShowCountDivs(false);
        setCountDivsVisible(0);
        setNumpadDisabled(false);
        setPlacedCount(0);
        setStep3Feedback(null);
        setCurrentStep(3);
      }
    } else if (currentStep === 5) {
      const prevObj = completedObjects[completedObjects.length - 1];
      const prevUnit = usedUnits[usedUnits.length - 1];
      setCompletedObjects(completedObjects.slice(0, -1));
      setUsedUnits(usedUnits.slice(0, -1));
      goToStep4CorrectOf(prevObj, prevUnit);
    }
  };

  const handleNext = () => {
    playSound("click");
    setShowNextNudge(false);
    if (currentStep === 3 && step3Feedback === "correct") {
      setStep4Answer("");
      setStep4Feedback(null);
      setShowCountDivs(false);
      setNumpadDisabled(false);
      setCurrentStep(4);
    } else if (currentStep === 4 && step4Feedback === "correct") {
      const newCompleted = completedObjects.concat(selectedObject);
      const newUsed = usedUnits.concat(selectedUnit);
      setCompletedObjects(newCompleted);
      setUsedUnits(newUsed);
      if (newCompleted.length >= OBJECTS.length) {
        setCurrentStep(5);
      } else {
        setSelectedObject(null);
        setSelectedUnit(null);
        setPlacedCount(0);
        setStep3Feedback(null);
        setStep3CheckedMore(false);
        setStep4Answer("");
        setStep4Feedback(null);
        setShowCountDivs(false);
        setNumpadDisabled(false);
        setCurrentStep(1);
      }
    }
  };

  // Reset per-step nudge defaults
  useEffect(() => {
    setShowNextNudge(false);
    setNextNudgePos(null);
    setRemoveExtraNudgePos(null);
    if (currentStep === 0) {
      setShowStartNudge(true);
    }
    if (currentStep === 1) {
      setShowWheelNudge(true);
    }
    if (currentStep === 3) {
      setShowUnitSourceNudge(true);
      setShowRemoveExtraNudge(true);
    }
  }, [currentStep]);

  // Start fullscreen nudge position
  useEffect(() => {
    if (currentStep !== 0 || !showStartNudge) return;
    const update = () => setStartNudgePos(getRect(startButtonRef.current));
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [currentStep, showStartNudge]);

  // Wheel nudge position (step 1)
  useEffect(() => {
    if (currentStep !== 1 || !showWheelNudge) return;
    const update = () => {
      const el = document.querySelector(".wheel-outer");
      setWheelNudgePos(getRect(el));
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [currentStep, showWheelNudge]);

  // Unit source nudge position (step 3)
  useEffect(() => {
    if (currentStep !== 3 || !showUnitSourceNudge) return;
    const update = () => setUnitSourceNudgePos(getRect(unitSourceRef.current));
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [currentStep, showUnitSourceNudge]);

  // Next button nudge position (steps 3 & 4 when enabled)
  useEffect(() => {
    if (!showNextNudge) return;
    const update = () => {
      const el = document.getElementById("next-button");
      setNextNudgePos(getRect(el));
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [showNextNudge]);

  // Show next-button nudge whenever Next becomes enabled (step 3 & 4)
  useEffect(() => {
    if (currentStep === 3 && step3Feedback === "correct") {
      setShowNextNudge(true);
    }
    if (currentStep === 4 && step4Feedback === "correct") {
      setShowNextNudge(true);
    }
  }, [currentStep, step3Feedback, step4Feedback]);

  // Extra-remove nudge target (only after check says "more")
  useEffect(() => {
    if (currentStep !== 3) return;
    const hasExtras = placedCount > correctCount;
    if (!showRemoveExtraNudge) return;
    if (!(step3CheckedMore && step3Feedback === "more" && hasExtras)) return;
    const update = () => {
      const el =
        document.querySelector(".placed-unit.extra.red-pulse") ||
        document.querySelector(".placed-unit.extra");
      setRemoveExtraNudgePos(getRect(el));
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [
    currentStep,
    showRemoveExtraNudge,
    step3CheckedMore,
    step3Feedback,
    placedCount,
    correctCount,
  ]);

  // ===== STEP 0: FULLSCREEN START =====
  if (currentStep === 0) {
    return ce(
      "div",
      { className: "applet-container" },
      ce(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        ce(Nudge, { show: showStartNudge, position: startNudgePos }),
        ce(Fullscreen, {
          heading: APP_DATA.start.heading,
          text: APP_DATA.start.text,
          buttonText: APP_DATA.start.buttonText,
          onButtonClick: handleStart,
          buttonRef: startButtonRef,
        }),
      ),
    );
  }

  // ===== STEP 5: FULLSCREEN END =====
  if (currentStep === 5) {
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
        }),
      ),
    );
  }

  // ===== STEP 1: SPINNING WHEEL =====
  if (currentStep === 1) {
    const characterTextStep1 =
      completedObjects.length > 0 && APP_DATA.step1.characterText2
        ? APP_DATA.step1.characterText2
        : APP_DATA.step1.characterText;
    return ce(
      "div",
      { className: "applet-container" },
      ce(
        "div",
        { className: "with-character-layout" },
        ce(CharacterPanel, {
          characterImage: getCharacterImage(),
          characterText: characterTextStep1,
        }),
        ce(
          ContentPanel,
          { step: 1 },
          ce(
            "div",
            {
              style: {
                position: "relative",
                flex: 1,
                minHeight: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              },
            },
            ce(Nudge, {
              show: showWheelNudge,
              position: wheelNudgePos,
              centerOnTarget: true,
            }),
            ce(SpinningWheel, {
              objects: OBJECTS,
              disabledObjects: completedObjects,
              onSelect: handleObjectSelected,
              onUserSpin: () => setShowWheelNudge(false),
            }),
          ),
        ),
      ),
      ce(Navigation, {
        onNav: (dir) => {
          if (dir === "prev") handlePrev();
        },
        isPrevDisabled: completedObjects.length === 0,
        isNextDisabled: true,
        navText: APP_DATA.step1.navText,
      }),
    );
  }

  // ===== STEP 2: SELECT UNIT =====
  if (currentStep === 2) {
    const availableUnits = UNITS.filter((u) => !usedUnits.includes(u.key));
    const objData = OBJECTS.find((o) => o.key === selectedObject);

    return ce(
      "div",
      { className: "applet-container" },
      ce(
        "div",
        { className: "with-character-layout" },
        ce(CharacterPanel, {
          characterImage: getCharacterImage(),
          characterText: t(APP_DATA.step2.characterText),
        }),
        ce(
          ContentPanel,
          null,
          ce(
            "div",
            { className: "step-content" },
            ce("div", { className: "step-top-row" }, t(APP_DATA.step2.topText)),
            ce(
              "div",
              { className: "step-main-row" },
              ce(
                "div",
                { className: "object-column" },
                ce(
                  "div",
                  { className: "object-image-area" },
                  ce("img", {
                    src: "assets/" + objData.image,
                    className: "measure-object-image" + (objData.key === "Table" ? " table" : ""),
                    alt: objectName,
                  }),
                  ce("div", { className: "placed-units-container " + selectedObjectClass }),
                ),
              ),
              ce(
                "div",
                { className: "unit-column step2-units" },
                availableUnits.map((unit) =>
                  ce(
                    "div",
                    {
                      key: unit.key,
                      className: "unit-item",
                      onClick: () => handleUnitSelected(unit.key),
                    },
                    ce("img", {
                      src: "assets/" + unit.image,
                      style: { height: unit.heightPercent + "%" },
                      alt: APP_DATA.unitNames[unit.key],
                    }),
                  ),
                ),
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
        navText: t(APP_DATA.step2.navText),
      }),
    );
  }

  // ===== STEP 3: PLACE UNITS =====
  if (currentStep === 3) {
    const objData = OBJECTS.find((o) => o.key === selectedObject);
    const unitData = UNITS.find((u) => u.key === selectedUnit);
    const hasExtras = placedCount > correctCount;

    let navText;
    if (step3Feedback === "correct") {
      navText = t(APP_DATA.step3.navTextCorrect);
    } else if (step3CheckedMore && step3Feedback === "more" && hasExtras) {
      navText = t(APP_DATA.step3.navTextRemoveExtra);
    } else {
      navText = t(APP_DATA.step3.navText);
    }

    let feedbackText = null;
    let feedbackClass = "";
    if (step3Feedback === "fewer") {
      feedbackText = t(APP_DATA.step3.wrongFewer);
      feedbackClass = "wrong";
    } else if (step3Feedback === "more") {
      feedbackText = t(APP_DATA.step3.wrongMore);
      feedbackClass = "wrong";
    } else if (step3Feedback === "correct") {
      feedbackText = t(APP_DATA.step3.correct);
      feedbackClass = "correct";
    }

    const isNextEnabled = step3Feedback === "correct";
    const canPlace = step3Feedback !== "correct" && placedCount < maxPlaceable;

    // Build placed items — stacked bottom-to-top via flex-direction: column-reverse on container
    const placedItems = [];
    for (let i = 0; i < placedCount; i++) {
      const isExtra = i >= correctCount;
      const showPulse = isExtra && step3Feedback === "more";
      placedItems.push(
        ce(
          "div",
          {
            key: "pu-" + i,
            className:
              "placed-unit" +
              (showPulse ? " red-pulse" : "") +
              (isExtra ? " extra" : ""),
            style: { height: 100 / correctCount + "%", flexShrink: 0 },
            onClick: isExtra ? handleRemoveExtra : undefined,
          },
          ce("img", { src: "assets/" + unitData.image, alt: unitName }),
        ),
      );
    }

    // Arrow placeholders for missing units (appear above placed items)
    if (step3Feedback === "fewer") {
      for (let i = placedCount; i < correctCount; i++) {
        placedItems.push(
          ce(
            "div",
            {
              key: "ar-" + i,
              className: "arrow-placeholder",
              style: { height: 100 / correctCount + "%", flexShrink: 0 },
            },
            ce(BidirectionalArrow),
          ),
        );
      }
    }

    return ce(
      "div",
      { className: "applet-container" },
      ce(
        "div",
        { className: "with-character-layout" },
        ce(CharacterPanel, {
          characterImage: getCharacterImage(),
          characterText: t(APP_DATA.step3.characterText),
        }),
        ce(
          ContentPanel,
          null,
          ce(
            "div",
            { className: "step-content" },
            ce("div", { className: "step-top-row" }, t(APP_DATA.step3.topText)),
            ce(
              "div",
              { className: "step-main-row" },
              ce(
                "div",
                { className: "object-column" },
                ce(
                  "div",
                  { className: "object-image-area" },
                  ce("img", {
                    src: "assets/" + objData.image,
                    className: "measure-object-image" + (objData.key === "Table" ? " table" : ""),
                    alt: objectName,
                  }),
                  ce(
                    "div",
                    {
                      ref: placedUnitsContainerRef,
                      className: "placed-units-container " + selectedObjectClass,
                    },
                    placedItems,
                  ),
                ),
              ),
              ce(
                "div",
                { className: "unit-column step3-unit" },
                ce(Nudge, {
                  show:
                    showUnitSourceNudge &&
                    canPlace &&
                    !(step3CheckedMore && step3Feedback === "more" && hasExtras),
                  position: unitSourceNudgePos,
                }),
                ce(Nudge, {
                  show:
                    showRemoveExtraNudge &&
                    step3CheckedMore &&
                    step3Feedback === "more" &&
                    hasExtras,
                  position: removeExtraNudgePos,
                }),
                ce(
                  "div",
                  {
                    className: "unit-item-source",
                    ref: unitSourceRef,
                    onClick: canPlace ? handlePlaceUnit : undefined,
                    style: {
                      cursor: canPlace ? "pointer" : "default",
                      opacity: canPlace ? 1 : 0.5,
                    },
                  },
                  ce("img", { src: "assets/" + unitData.image, alt: unitName }),
                ),
                ce(
                  "button",
                  {
                    className: "check-btn",
                    onClick: handleCheck,
                    disabled: step3Feedback === "correct" || placedCount === 0,
                  },
                  APP_DATA.step3.check,
                ),
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
      ),
      ce(Navigation, {
        onNav: (dir) => {
          if (dir === "prev") handlePrev();
          if (dir === "next") handleNext();
        },
        isPrevDisabled: false,
        isNextDisabled: !isNextEnabled,
        navText: navText,
      }),
      ce(Nudge, { show: showNextNudge && isNextEnabled, position: nextNudgePos }),
    );
  }

  // ===== STEP 4: IDENTIFY HEIGHT =====
  if (currentStep === 4) {
    const objData = OBJECTS.find((o) => o.key === selectedObject);
    const unitData = UNITS.find((u) => u.key === selectedUnit);

    const questionRaw = t(APP_DATA.step4.questionText);
    const questionParts = questionRaw.split("{{input}}");

    let inputBoxClass = "input-box";
    if (step4Feedback === "correct") inputBoxClass += " correct";
    else if (step4Feedback === "wrong") inputBoxClass += " wrong";

    let feedbackText = null;
    let feedbackClass = "";
    if (step4Feedback === "correct") {
      feedbackText = APP_DATA.step4.correctFeedback;
      feedbackClass = "correct";
    } else if (step4Feedback === "wrong") {
      feedbackText = t(APP_DATA.step4.wrongFeedback);
      feedbackClass = "wrong";
    }

    const isLastObject = completedObjects.length === OBJECTS.length - 1;
    let navText;
    if (step4Feedback === "correct") {
      navText = isLastObject
        ? APP_DATA.step4.navCorrectLast
        : APP_DATA.step4.navCorrect;
    } else {
      navText = APP_DATA.step4.navText;
    }

    const isNextEnabled = step4Feedback === "correct";

    const placedItems = [];
    for (let i = 0; i < correctCount; i++) {
      placedItems.push(
        ce(
          "div",
          {
            key: "pu4-" + i,
            className: "placed-unit",
            style: { height: 100 / correctCount + "%", flexShrink: 0 },
          },
          ce("img", { src: "assets/" + unitData.image, alt: unitName }),
          showCountDivs &&
            i < countDivsVisible &&
            ce(
              "div",
              {
                className:
                  "count-div" +
                  (step4Feedback === "correct" ? " count-correct" : ""),
              },
              i + 1,
            ),
        ),
      );
    }

    return ce(
      "div",
      { className: "applet-container" },
      ce(
        "div",
        { className: "with-character-layout" },
        ce(CharacterPanel, {
          characterImage: getCharacterImage(),
          characterText: t(APP_DATA.step4.characterText),
        }),
        ce(
          ContentPanel,
          null,
          ce(
            "div",
            { className: "step-content" },
            ce("div", { className: "step-top-row" }, t(APP_DATA.step4.topText)),
            ce(
              "div",
              { className: "step-main-row" },
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
                    step4Answer === "" || step4Answer === "?" || !step4Answer
                      ? "?"
                      : step4Answer,
                  ),
                  questionParts[1],
                ),
                ce(
                  "div",
                  { className: "object-image-area" },
                  ce("img", {
                    src: "assets/" + objData.image,
                    className: "measure-object-image" + (objData.key === "Table" ? " table" : ""),
                    alt: objectName,
                  }),
                  ce(
                    "div",
                    { className: "placed-units-container " + selectedObjectClass },
                    placedItems,
                  ),
                ),
              ),
              ce(
                "div",
                { className: "unit-column step4-unit" },
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
      ),
      ce(Navigation, {
        onNav: (dir) => {
          if (dir === "prev") handlePrev();
          if (dir === "next") handleNext();
        },
        isPrevDisabled: false,
        isNextDisabled: !isNextEnabled,
        navText: navText,
      }),
      ce(Nudge, { show: showNextNudge && isNextEnabled, position: nextNudgePos }),
    );
  }

  return null;
};
