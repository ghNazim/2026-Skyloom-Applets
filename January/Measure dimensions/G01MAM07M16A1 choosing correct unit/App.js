const BidirectionalArrow = ({ vertical }) => {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = "";
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    svg.setAttribute("class", "bidirectional-arrow-svg");
    if (vertical) {
      svg.setAttribute("viewBox", "0 0 30 100");
      const g = createBiDirectionalArrow(15, 8, 15, 92, {
        color: "#e74c3c",
        width: 4,
        headSize: 10,
      });
      svg.appendChild(g);
    } else {
      svg.setAttribute("viewBox", "0 0 100 20");
      const g = createBiDirectionalArrow(5, 10, 95, 10, {
        color: "#e74c3c",
        width: 4,
        headSize: 15,
      });
      svg.appendChild(g);
    }
    ref.current.appendChild(svg);
  }, [vertical]);
  return React.createElement("div", {
    ref,
    className: "bidirectional-arrow-wrap",
  });
};

const App = () => {
  const { useState, useCallback, useEffect, useRef } = React;
  const ce = React.createElement;

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedObject, setSelectedObject] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [completedObjects, setCompletedObjects] = useState([]);

  const [step2Feedback, setStep2Feedback] = useState(null);

  const [placedCount, setPlacedCount] = useState(0);
  const [step3Feedback, setStep3Feedback] = useState(null);

  const [step4Answer, setStep4Answer] = useState(null);
  const [step4Feedback, setStep4Feedback] = useState(null);
  const [showCountDivs, setShowCountDivs] = useState(false);
  const [countDivsVisible, setCountDivsVisible] = useState(0);
  const [numpadDisabled, setNumpadDisabled] = useState(false);

  const placedUnitsContainerRef = useRef(null);
  const prevPlacedCountRef = useRef(0);
  const objectImageRef = useRef(null);
  const [objectImageHeight, setObjectImageHeight] = useState(0);
  const fullscreenButtonRef = useRef(null);
  const nextButtonRef = useRef(null);

  const [fullscreenNudgePosition, setFullscreenNudgePosition] = useState(null);
  const [nextButtonNudgePosition, setNextButtonNudgePosition] = useState(null);
  const [extraUnitNudgePosition, setExtraUnitNudgePosition] = useState(null);

  const objData = selectedObject
    ? OBJECTS.find((o) => o.key === selectedObject)
    : null;
  const correctCount = objData ? objData.correctCount : 0;
  const correctUnitData = objData
    ? objData.units[objData.correctUnitIndex]
    : null;
  const isHeight = objData ? objData.measureType === "height" : false;
  const maxPlaceable = correctCount + 1;

  const objectName = selectedObject ? APP_DATA.objectNames[selectedObject] : "";
  const unitName = selectedUnit ? APP_DATA.unitNames[selectedUnit] : "";
  const unitPlural = selectedUnit ? APP_DATA.unitPlurals[selectedUnit] : "";
  const measureWord = objData ? APP_DATA.measureWords[objData.measureType] : "";
  const MeasureWord = objData
    ? APP_DATA.measureWordsCapital[objData.measureType]
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
      measure: measureWord,
      Measure: MeasureWord,
    };
    if (extra) Object.assign(reps, extra);
    Object.keys(reps).forEach((key) => {
      result = result.split("{{" + key + "}}").join(reps[key]);
    });
    return result;
  };

  // Measure object image height for vertical layout
  useEffect(() => {
    if (!isHeight || currentStep < 2 || currentStep > 4) {
      setObjectImageHeight(0);
      return;
    }
    const img = objectImageRef.current;
    if (!img) return;
    const measure = () => {
      if (objectImageRef.current)
        setObjectImageHeight(objectImageRef.current.offsetHeight);
    };
    if (img.complete) measure();
    img.addEventListener("load", measure);
    window.addEventListener("resize", measure);
    return () => {
      img.removeEventListener("load", measure);
      window.removeEventListener("resize", measure);
    };
  }, [isHeight, selectedObject, currentStep]);

  // Animate last placed unit when adding in step 3
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
      { scale: 0.88, opacity: 0.6, transformOrigin: "center center" },
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

  useEffect(() => {
    if (!showCountDivs) setCountDivsVisible(0);
  }, [showCountDivs]);

  // Nudge: fullscreen button (step 0 and 5)
  useEffect(() => {
    if (currentStep !== 0 && currentStep !== 5) {
      setFullscreenNudgePosition(null);
      return;
    }
    const el = fullscreenButtonRef.current;
    if (!el) {
      setFullscreenNudgePosition(null);
      return;
    }
    const update = () => {
      if (fullscreenButtonRef.current)
        setFullscreenNudgePosition(fullscreenButtonRef.current.getBoundingClientRect());
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [currentStep]);

  // Nudge: next button when enabled (step 2, 3, 4)
  useEffect(() => {
    const nextEnabled =
      (currentStep === 2 && step2Feedback === "correct") ||
      (currentStep === 3 && step3Feedback === "correct") ||
      (currentStep === 4 && step4Feedback === "correct");
    if (!nextEnabled) {
      setNextButtonNudgePosition(null);
      return;
    }
    const el = nextButtonRef.current;
    if (!el) {
      setNextButtonNudgePosition(null);
      return;
    }
    const update = () => {
      if (nextButtonRef.current)
        setNextButtonNudgePosition(nextButtonRef.current.getBoundingClientRect());
    };
    const t = setTimeout(update, 50);
    window.addEventListener("resize", update);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", update);
    };
  }, [currentStep, step2Feedback, step3Feedback, step4Feedback]);

  // Nudge: extra unit to remove in step 3 when count > correct
  useEffect(() => {
    if (currentStep !== 3 || step3Feedback !== "more") {
      setExtraUnitNudgePosition(null);
      return;
    }
    const container = placedUnitsContainerRef.current;
    if (!container) {
      setExtraUnitNudgePosition(null);
      return;
    }
    const update = () => {
      const extra = container.querySelector(".placed-unit.extra");
      if (extra) setExtraUnitNudgePosition(extra.getBoundingClientRect());
      else setExtraUnitNudgePosition(null);
    };
    const t = setTimeout(update, 100);
    window.addEventListener("resize", update);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", update);
    };
  }, [currentStep, step3Feedback, placedCount]);

  const getCharacterImage = () => {
    if (currentStep === 2) {
      if (step2Feedback === "wrong") return "charsad.png";
      if (step2Feedback === "correct") return "charhappy.png";
      return "chardefault.png";
    }
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
    setCurrentStep(1);
  };

  const handleStartOver = () => {
    playSound("click");
    setCurrentStep(0);
    setSelectedObject(null);
    setSelectedUnit(null);
    setCompletedObjects([]);
    setStep2Feedback(null);
    setPlacedCount(0);
    setStep3Feedback(null);
    setStep4Answer(null);
    setStep4Feedback(null);
    setShowCountDivs(false);
    setNumpadDisabled(false);
  };

  const handleObjectSelected = (objectKey) => {
    playSound("click");
    setSelectedObject(objectKey);
    setSelectedUnit(null);
    setStep2Feedback(null);
    setCurrentStep(2);
  };

  const handleUnitSelection = (unitKey) => {
    if (step2Feedback === "correct") return;
    playSound("click");
    const obj = OBJECTS.find((o) => o.key === selectedObject);
    const correctUnit = obj.units[obj.correctUnitIndex];
    if (unitKey === correctUnit.key) {
      playSound("correct");
      setSelectedUnit(unitKey);
      setStep2Feedback("correct");
    } else {
      playSound("wrong");
      setSelectedUnit(unitKey);
      setStep2Feedback("wrong");
    }
  };

  const handlePlaceUnit = () => {
    if (placedCount >= maxPlaceable) return;
    if (step3Feedback === "correct") return;
    playSound("click");
    if (step3Feedback) setStep3Feedback(null);
    setPlacedCount((prev) => prev + 1);
  };

  const handleRemoveExtra = () => {
    if (placedCount <= correctCount) return;
    playSound("click");
    const nextCount = placedCount - 1;
    setPlacedCount(nextCount);
    if (nextCount === correctCount) setStep3Feedback(null);
  };

  const handleCheck = () => {
    if (placedCount === 0) return;
    if (step3Feedback === "correct") return;
    if (placedCount < correctCount) {
      playSound("wrong");
      setStep3Feedback("fewer");
    } else if (placedCount > correctCount) {
      playSound("wrong");
      setStep3Feedback("more");
    } else {
      playSound("correct");
      setStep3Feedback("correct");
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

  const goToStep4CorrectOf = (objKey) => {
    const obj = OBJECTS.find((o) => o.key === objKey);
    const correctUnit = obj.units[obj.correctUnitIndex];
    setSelectedObject(objKey);
    setSelectedUnit(correctUnit.key);
    setPlacedCount(obj.correctCount);
    setStep2Feedback("correct");
    setStep3Feedback("correct");
    setStep4Answer(String(obj.correctCount));
    setStep4Feedback("correct");
    setShowCountDivs(true);
    setCountDivsVisible(obj.correctCount);
    setNumpadDisabled(true);
    setCurrentStep(4);
  };

  const handlePrev = () => {
    playSound("click");
    if (currentStep === 1) {
      if (completedObjects.length === 0) return;
      const prevObj = completedObjects[completedObjects.length - 1];
      setCompletedObjects(completedObjects.slice(0, -1));
      goToStep4CorrectOf(prevObj);
    } else if (currentStep === 2) {
      setSelectedObject(null);
      setSelectedUnit(null);
      setStep2Feedback(null);
      setCurrentStep(1);
    } else if (currentStep === 3) {
      setPlacedCount(0);
      setStep3Feedback(null);
      setSelectedUnit(null);
      setStep2Feedback(null);
      setCurrentStep(2);
    } else if (currentStep === 4) {
      if (step4Feedback === "correct" && completedObjects.length > 0) {
        const prevObj = completedObjects[completedObjects.length - 1];
        setCompletedObjects(completedObjects.slice(0, -1));
        goToStep4CorrectOf(prevObj);
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
      setCompletedObjects(completedObjects.slice(0, -1));
      goToStep4CorrectOf(prevObj);
    }
  };

  const handleNext = () => {
    playSound("click");
    if (currentStep === 2 && step2Feedback === "correct") {
      setPlacedCount(0);
      prevPlacedCountRef.current = 0;
      setStep3Feedback(null);
      setCurrentStep(3);
    } else if (currentStep === 3 && step3Feedback === "correct") {
      setStep4Answer("");
      setStep4Feedback(null);
      setShowCountDivs(false);
      setNumpadDisabled(false);
      setCurrentStep(4);
    } else if (currentStep === 4 && step4Feedback === "correct") {
      const newCompleted = completedObjects.concat(selectedObject);
      setCompletedObjects(newCompleted);
      if (newCompleted.length >= OBJECTS.length) {
        setCurrentStep(5);
      } else {
        setSelectedObject(null);
        setSelectedUnit(null);
        setPlacedCount(0);
        setStep2Feedback(null);
        setStep3Feedback(null);
        setStep4Answer("");
        setStep4Feedback(null);
        setShowCountDivs(false);
        setNumpadDisabled(false);
        setCurrentStep(1);
      }
    }
  };

  // ===== HELPERS FOR RENDERING =====

  const buildObjectArea = (options) => {
    const opts = options || {};
    const showPlacedUnits = opts.showPlacedUnits || false;
    const placedItems = opts.placedItems || [];
    const questionDiv = opts.questionDiv || null;
    const feedbackImageSrc = opts.feedbackImageSrc || null;
    const obj = OBJECTS.find((o) => o.key === selectedObject);
    if (!obj) return null;

    const containerOpacity = showPlacedUnits ? 1 : 0;
    const objKeyClass = obj.key ? obj.key.toLowerCase() : "";
    const measureImageClass =
      "measure-object-image" + (feedbackImageSrc ? " less-opaque" : "");
    const feedbackImageDiv =
      feedbackImageSrc &&
      ce(
        "div",
        { className: "feedback-image " + objKeyClass },
        ce("img", { src: feedbackImageSrc, alt: "" }),
      );

    if (obj.measureType === "height") {
      const vertStyle = {
        opacity: containerOpacity,
        height: objectImageHeight ? objectImageHeight + "px" : "100%",
      };
      return ce(
        "div",
        { className: "object-column" },
        questionDiv,
        feedbackImageDiv,
        ce(
          "div",
          { className: "measure-area-height" },
          ce("img", {
            ref: objectImageRef,
            src: "assets/" + obj.image,
            className: measureImageClass,
            style: {
              width: obj.imageWidth,
              flexShrink: 0,
              minWidth: obj.imageWidth,
            },
          }),
          ce(
            "div",
            {
              ref: showPlacedUnits ? placedUnitsContainerRef : undefined,
              className:
                "placed-units-container vertical " +
                (objKeyClass ? objKeyClass : ""),
              style: vertStyle,
            },
            showPlacedUnits ? placedItems : null,
          ),
        ),
      );
    }

    return ce(
      "div",
      { className: "object-column" },
      questionDiv,
      feedbackImageDiv,
      ce("img", {
        src: "assets/" + obj.image,
        className: measureImageClass,
        style: {
          width: obj.imageWidth,
          flexShrink: 0,
          minWidth: obj.imageWidth,
        },
      }),
      ce(
        "div",
        {
          ref: showPlacedUnits ? placedUnitsContainerRef : undefined,
          className:
            "placed-units-container " + (objKeyClass ? objKeyClass : ""),
          style: { opacity: containerOpacity, width: obj.imageWidth },
        },
        showPlacedUnits ? placedItems : null,
      ),
    );
  };

  const buildPlacedItems = (opts) => {
    const forStep4 = opts && opts.forStep4;
    const unitImg = correctUnitData ? correctUnitData.image : "";
    const items = [];
    const count = forStep4 ? correctCount : placedCount;

    for (let i = 0; i < count; i++) {
      const isExtra = !forStep4 && i >= correctCount;
      const showPulse = isExtra && step3Feedback === "more";
      const sizeStyle = isHeight
        ? { height: 100 / correctCount + "%", flexShrink: 0 }
        : { width: 100 / correctCount + "%", flexShrink: 0 };

      items.push(
        ce(
          "div",
          {
            key: (forStep4 ? "pu4-" : "pu-") + i,
            className:
              "placed-unit" +
              (showPulse ? " red-pulse" : "") +
              (isExtra ? " extra" : ""),
            style: sizeStyle,
            onClick: isExtra ? handleRemoveExtra : undefined,
          },
          ce("img", { src: "assets/" + unitImg, alt: unitName }),
          forStep4 &&
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

    if (!forStep4 && step3Feedback === "fewer") {
      for (let i = placedCount; i < correctCount; i++) {
        const sizeStyle = isHeight
          ? { height: 100 / correctCount + "%", flexShrink: 0 }
          : { width: 100 / correctCount + "%", flexShrink: 0 };
        items.push(
          ce(
            "div",
            {
              key: "ar-" + i,
              className: "arrow-placeholder",
              style: sizeStyle,
            },
            ce(BidirectionalArrow, { vertical: isHeight }),
          ),
        );
      }
    }

    return items;
  };

  // ===== STEP 0: FULLSCREEN START =====
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
      ce(Nudge, {
        show: !!fullscreenNudgePosition,
        position: fullscreenNudgePosition,
      }),
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
          buttonRef: fullscreenButtonRef,
        }),
      ),
      ce(Nudge, {
        show: !!fullscreenNudgePosition,
        position: fullscreenNudgePosition,
      }),
    );
  }

  // ===== STEP 1: SPINNING WHEEL =====
  if (currentStep === 1) {
    return ce(
      "div",
      { className: "applet-container" },
      ce(
        "div",
        { className: "with-character-layout" },
        ce(CharacterPanel, {
          characterImage: getCharacterImage(),
          characterText:
            completedObjects.length > 0
              ? APP_DATA.step1.characterText2
              : APP_DATA.step1.characterText,
        }),
        ce(
          ContentPanel,
          { step: 1 },
          ce(SpinningWheel, {
            objects: OBJECTS,
            disabledObjects: completedObjects,
            onSelect: handleObjectSelected,
          }),
        ),
      ),
      ce(Navigation, {
        onNav: (dir) => {
          if (dir === "prev") handlePrev();
        },
        isPrevDisabled: completedObjects.length === 0,
        isNextDisabled: true,
        navText: APP_DATA.step1.navText,
        nextButtonRef: nextButtonRef,
      }),
    );
  }

  // ===== STEP 2: SELECT CORRECT UNIT =====
  if (currentStep === 2) {
    const obj = OBJECTS.find((o) => o.key === selectedObject);
    const units = obj.units;

    const unitIndex = selectedUnit
      ? units.findIndex((u) => u.key === selectedUnit)
      : -1;
    const feedbackImageSrc =
      selectedUnit && unitIndex >= 0
        ? "assets/" +
          APP_DATA.objectNames[selectedObject] +
          (unitIndex + 1) +
          ".svg"
        : null;

    let feedbackText = null;
    let feedbackClass = "";
    if (step2Feedback === "correct") {
      feedbackText = APP_DATA.step2Feedback[selectedObject].correct;
      feedbackClass = "correct";
    } else if (step2Feedback === "wrong") {
      feedbackText = APP_DATA.step2Feedback[selectedObject].wrong;
      feedbackClass = "wrong";
    }

    const navText =
      step2Feedback === "correct"
        ? APP_DATA.step2.navCorrect
        : t(APP_DATA.step2.navText);

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
            ce("div", { className: "step-top-row" }, APP_DATA.step2.topText),
            ce(
              "div",
              { className: "step-main-row" },
              buildObjectArea({ feedbackImageSrc }),
              ce(
                "div",
                { className: "unit-column step2-units" },
                units.map((unit, idx) =>
                  ce(
                    "div",
                    {
                      key: unit.key,
                      className:
                        "unit-item" +
                        (step2Feedback === "correct" &&
                        unit.key === selectedUnit
                          ? " selected-unit"
                          : "") +
                        (step2Feedback === "correct" &&
                        unit.key !== selectedUnit
                          ? " disabled-unit"
                          : ""),
                      onClick: () => handleUnitSelection(unit.key),
                    },
                    ce("img", {
                      src: "assets/" + unit.image,
                      alt: APP_DATA.unitLabels[unit.key],
                    }),
                    ce(
                      "div",
                      { className: "unit-label" },
                      ce(
                        idx === 0 ? "y" : "bl",
                        null,
                        APP_DATA.unitLabels[unit.key],
                      ),
                    ),
                  ),
                ),
                ce(
                  "div",
                  { className: "step2-feedback-wrap" },
                  ce(
                    "div",
                    {
                      className:
                        "feedback-box step2-feedback-box " +
                        feedbackClass +
                        (feedbackText ? " show" : ""),
                    },
                    feedbackText || "\u00A0",
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
          if (dir === "next") handleNext();
        },
        isPrevDisabled: false,
        isNextDisabled: step2Feedback !== "correct",
        navText: navText,
        nextButtonRef: nextButtonRef,
      }),
      ce(Nudge, {
        show: step2Feedback === "correct" && !!nextButtonNudgePosition,
        position: nextButtonNudgePosition,
      }),
    );
  }

  // ===== STEP 3: PLACE UNITS =====
  if (currentStep === 3) {
    const unitData = correctUnitData;
    const hasExtras = placedCount > correctCount;

    let navText;
    if (step3Feedback === "correct") {
      navText = APP_DATA.step3.navTextCorrect;
    } else if (hasExtras) {
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

    const canPlace = step3Feedback !== "correct" && placedCount < maxPlaceable;
    const placedItems = buildPlacedItems();

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
              buildObjectArea({ showPlacedUnits: true, placedItems }),
              ce(
                "div",
                { className: "unit-column step3-unit" },
                ce(
                  "div",
                  {
                    className: "unit-item-source",
                    onClick: canPlace ? handlePlaceUnit : undefined,
                    style: {
                      cursor: canPlace ? "pointer" : "default",
                      opacity: canPlace ? 1 : 0.5,
                    },
                  },
                  ce("img", {
                    src: "assets/" + unitData.image,
                    alt: unitName,
                  }),
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
        isNextDisabled: step3Feedback !== "correct",
        navText: navText,
        nextButtonRef: nextButtonRef,
      }),
      ce(Nudge, {
        show:
          (step3Feedback === "more" && !!extraUnitNudgePosition) ||
          (step3Feedback === "correct" && !!nextButtonNudgePosition),
        position:
          step3Feedback === "more"
            ? extraUnitNudgePosition
            : nextButtonNudgePosition,
      }),
    );
  }

  // ===== STEP 4: IDENTIFY MEASUREMENT =====
  if (currentStep === 4) {
    const unitData = correctUnitData;
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

    const placedItems = buildPlacedItems({ forStep4: true });

    const questionDiv = ce(
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
    );

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
              buildObjectArea({
                showPlacedUnits: true,
                placedItems,
                questionDiv,
              }),
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
        isNextDisabled: step4Feedback !== "correct",
        navText: navText,
        nextButtonRef: nextButtonRef,
      }),
      ce(Nudge, {
        show: step4Feedback === "correct" && !!nextButtonNudgePosition,
        position: nextButtonNudgePosition,
      }),
    );
  }

  return null;
};
