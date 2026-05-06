const App = () => {
  const { useState, useCallback, useEffect, useRef } = React;
  const ce = React.createElement;

  const MEASURE_OBJECT_KEYS = ["Spoon", "Crayon"];
  const OBJECT_MAP = OBJECTS.reduce((acc, obj) => {
    acc[obj.key] = obj;
    return acc;
  }, {});

  // Steps: 0=start, 1=object select, 2=place ruler, 3=answer length, 4=longer check, 5=explain, 6=end
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedObject, setSelectedObject] = useState(null);
  const [completedObjects, setCompletedObjects] = useState([]);

  // Step 2 state
  const [rulerPos, setRulerPos] = useState({ x: 0, y: 0 });
  const [rulerDragging, setRulerDragging] = useState(false);
  const [rulerLocked, setRulerLocked] = useState(false);
  const [step2Feedback, setStep2Feedback] = useState(null); // null, "correct", "wrong"

  // Step 3 state (cm only)
  const [cmAnswer, setCmAnswer] = useState("");
  const [cmCorrect, setCmCorrect] = useState(false);
  const [inputShake, setInputShake] = useState(null); // "cm" or null

  // Step 4 state
  const [step4CorrectObject, setStep4CorrectObject] = useState(null);
  const [step4WrongObject, setStep4WrongObject] = useState(null);

  // Nudge
  const [nudgePosition, setNudgePosition] = useState(null);
  const fullscreenButtonRef = useRef(null);
  const nextButtonRef = useRef(null);

  // Refs for ruler drag
  const mainRowRef = useRef(null);
  const objectContainerRef = useRef(null);
  const rulerContainerRef = useRef(null);
  const dragStartRef = useRef(null);

  const CM_TO_VW = RULER_CONFIG.cmToVw;
  const RULER_TOTAL_CM = RULER_CONFIG.totalCmSpaces;
  const RULER_SVG_WIDTH = RULER_CONFIG.svgWidth;
  const RULER_LEFT_GAP = RULER_CONFIG.leftGap;
  const CM_UNIT_PX = RULER_CONFIG.cmGap + RULER_CONFIG.cmMarkWidth;
  const RULER_WIDTH_VW = (RULER_SVG_WIDTH / CM_UNIT_PX) * CM_TO_VW;
  const LEFT_GAP_VW = (RULER_LEFT_GAP / CM_UNIT_PX) * CM_TO_VW;
  const SNAP_THRESHOLD = 8;

  const getObjData = useCallback(() => {
    return selectedObject ? OBJECT_MAP[selectedObject] : null;
  }, [selectedObject]);

  const objectName = selectedObject ? APP_DATA.objectNames[selectedObject] : "";
  const remainingObjectKey = MEASURE_OBJECT_KEYS.find((key) => !completedObjects.includes(key));

  const t = (template) => {
    if (!template) return "";
    return template.split("{{object}}").join(objectName);
  };

  const replaceObjectName = (template, objectKey) => {
    if (!template) return "";
    if (!objectKey) return template;
    const name = APP_DATA.objectNames[objectKey] || "";
    return template.split("{{object}}").join(name);
  };

  const getCharacterImage = () => {
    if (currentStep === 2) {
      if (step2Feedback === "wrong") return "charsad.png";
      if (step2Feedback === "correct") return "charhappy.png";
    }
    if (currentStep === 3 && cmCorrect) return "charhappy.png";
    if (currentStep === 4 && step4CorrectObject === "Spoon") return "charhappy.png";
    return "chardefault.png";
  };

  useEffect(() => {
    const updatePos = () => {
      if (currentStep === 0 && fullscreenButtonRef.current) {
        const r = fullscreenButtonRef.current.getBoundingClientRect();
        setNudgePosition({ left: r.left, top: r.top, width: r.width, height: r.height });
        return;
      }
      const nextEnabled =
        (currentStep === 1 && !!selectedObject) ||
        (currentStep === 2 && step2Feedback === "correct") ||
        (currentStep === 3 && cmCorrect) ||
        (currentStep === 4 && step4CorrectObject === "Spoon") ||
        currentStep === 5;
      if (nextEnabled && nextButtonRef.current) {
        const r = nextButtonRef.current.getBoundingClientRect();
        setNudgePosition({ left: r.left, top: r.top, width: r.width, height: r.height });
        return;
      }
      setNudgePosition(null);
    };
    const id = requestAnimationFrame(updatePos);
    return () => cancelAnimationFrame(id);
  }, [currentStep, selectedObject, step2Feedback, cmCorrect, step4CorrectObject]);

  useEffect(() => {
    if (currentStep === 2) {
      setRulerPos({ x: 0, y: 0 });
      setRulerLocked(false);
      setStep2Feedback(null);
    }
  }, [currentStep, selectedObject]);

  useEffect(() => {
    if (currentStep === 3) {
      setCmAnswer("");
      setCmCorrect(false);
      setInputShake(null);
    }
  }, [currentStep, selectedObject]);

  useEffect(() => {
    if (currentStep === 4) {
      setStep4CorrectObject(null);
      setStep4WrongObject(null);
    }
  }, [currentStep]);

  useEffect(() => {
    if (!inputShake) return;
    const timer = setTimeout(() => {
      setCmAnswer("");
      setInputShake(null);
    }, 500);
    return () => clearTimeout(timer);
  }, [inputShake]);

  useEffect(() => {
    if (!step4WrongObject) return;
    const timer = setTimeout(() => setStep4WrongObject(null), 600);
    return () => clearTimeout(timer);
  }, [step4WrongObject]);

  const handleStart = () => {
    playSound("click");
    setCurrentStep(1);
  };

  const handleStartOver = () => {
    playSound("click");
    setCurrentStep(0);
    setSelectedObject(null);
    setCompletedObjects([]);
    setRulerLocked(false);
    setStep2Feedback(null);
    setCmAnswer("");
    setCmCorrect(false);
    setStep4CorrectObject(null);
    setStep4WrongObject(null);
  };

  const handleObjectSelected = (objectKey) => {
    if (completedObjects.includes(objectKey)) return;
    playSound("click");
    setSelectedObject(objectKey);
  };

  // ===== RULER DRAG LOGIC =====
  const vwToPx = (vw) => window.innerWidth * vw / 100;

  const getSnapPoints = useCallback(() => {
    const points = [0];
    for (let n = 0; n <= RULER_TOTAL_CM; n++) {
      points.push(LEFT_GAP_VW + n * CM_TO_VW);
    }
    return points;
  }, [RULER_TOTAL_CM, LEFT_GAP_VW, CM_TO_VW]);

  const handleRulerCheck = useCallback(() => {
    if (rulerLocked) return;
    if (!objectContainerRef.current || !rulerContainerRef.current) return;

    const objRect = objectContainerRef.current.getBoundingClientRect();
    const rulerRect = rulerContainerRef.current.getBoundingClientRect();
    const zeroMarkPageX = rulerRect.left + vwToPx(LEFT_GAP_VW);
    const targetX = objRect.left;
    const diffX = Math.abs(zeroMarkPageX - targetX);
    const diffY = Math.abs(rulerRect.top - objRect.bottom);

    if (diffX < vwToPx(0.5) && diffY < vwToPx(0.5)) {
      playSound("correct");
      setStep2Feedback("correct");
      setRulerLocked(true);
    } else {
      playSound("wrong");
      setStep2Feedback("wrong");
    }
  }, [rulerLocked, LEFT_GAP_VW]);

  const handleDragStart = useCallback((e) => {
    if (rulerLocked) return;
    if (e.cancelable) e.preventDefault();

    const touch = e.touches ? e.touches[0] : e;
    const rulerEl = rulerContainerRef.current;
    if (!rulerEl) return;

    if (step2Feedback === "wrong") setStep2Feedback(null);

    const rect = rulerEl.getBoundingClientRect();
    dragStartRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      startLeft: rect.left,
      startTop: rect.top,
    };
    setRulerDragging(true);
  }, [rulerLocked, step2Feedback]);

  const handleDragMove = useCallback((e) => {
    if (!rulerDragging || !dragStartRef.current || rulerLocked) return;
    e.preventDefault();

    const touch = e.touches ? e.touches[0] : e;
    const mainEl = mainRowRef.current;
    const rulerEl = rulerContainerRef.current;
    const objEl = objectContainerRef.current;
    if (!mainEl || !rulerEl || !objEl) return;

    const mainRect = mainEl.getBoundingClientRect();
    const dx = touch.clientX - dragStartRef.current.startX;
    const dy = touch.clientY - dragStartRef.current.startY;

    let newLeft = dragStartRef.current.startLeft + dx - mainRect.left;
    let newTop = dragStartRef.current.startTop + dy - mainRect.top;

    const objRect = objEl.getBoundingClientRect();
    const objBottomLocal = objRect.bottom - mainRect.top;
    if (newTop < objBottomLocal) newTop = objBottomLocal;
    if (Math.abs(newTop - objBottomLocal) < SNAP_THRESHOLD) newTop = objBottomLocal;

    const objLeftRelative = objRect.left - mainRect.left;
    const snapPoints = getSnapPoints();
    const rulerWidthPx = rulerEl.getBoundingClientRect().width;

    for (const markVw of snapPoints) {
      const markPxFromRulerLeft = (markVw / RULER_WIDTH_VW) * rulerWidthPx;
      const markAbsX = newLeft + markPxFromRulerLeft;
      if (Math.abs(markAbsX - objLeftRelative) < SNAP_THRESHOLD) {
        newLeft = objLeftRelative - markPxFromRulerLeft;
        break;
      }
    }

    setRulerPos({ x: newLeft, y: newTop });
  }, [rulerDragging, rulerLocked, getSnapPoints, RULER_WIDTH_VW]);

  const handleDragEnd = useCallback(() => {
    setRulerDragging(false);
    dragStartRef.current = null;
  }, []);

  useEffect(() => {
    if (!rulerDragging) return;
    const moveHandler = (e) => handleDragMove(e);
    const endHandler = () => handleDragEnd();

    window.addEventListener("mousemove", moveHandler);
    window.addEventListener("mouseup", endHandler);
    window.addEventListener("touchmove", moveHandler, { passive: false });
    window.addEventListener("touchend", endHandler);

    return () => {
      window.removeEventListener("mousemove", moveHandler);
      window.removeEventListener("mouseup", endHandler);
      window.removeEventListener("touchmove", moveHandler);
      window.removeEventListener("touchend", endHandler);
    };
  }, [rulerDragging, handleDragMove, handleDragEnd]);

  const handleNumpadDigit = (digit) => {
    if (cmCorrect) return;
    playSound("click");
    setCmAnswer((prev) => prev.length >= 2 ? String(digit) : prev + digit);
  };

  const handleStep3Check = () => {
    const objData = getObjData();
    if (!objData) return;
    const val = parseInt(cmAnswer, 10);
    if (val === objData.cm) {
      playSound("correct");
      setCmCorrect(true);
    } else {
      playSound("wrong");
      setInputShake("cm");
    }
  };

  const handleStep4Choice = (objectKey) => {
    if (step4CorrectObject === "Spoon") return;
    if (objectKey === "Spoon") {
      playSound("correct");
      setStep4CorrectObject(objectKey);
      setStep4WrongObject(null);
      return;
    }
    playSound("wrong");
    setStep4WrongObject(objectKey);
  };

  const handlePrev = () => {
    playSound("click");
    if (currentStep === 2) {
      setCurrentStep(1);
      return;
    }
    if (currentStep === 3) {
      setCurrentStep(2);
      return;
    }
    if (currentStep === 5) {
      setCurrentStep(4);
    }
  };

  const resetStep3Inputs = () => {
    setCmAnswer("");
    setCmCorrect(false);
    setInputShake(null);
  };

  const handleNext = () => {
    playSound("click");

    if (currentStep === 1 && selectedObject) {
      resetStep3Inputs();
      setCurrentStep(2);
      return;
    }

    if (currentStep === 2 && step2Feedback === "correct") {
      resetStep3Inputs();
      setCurrentStep(3);
      return;
    }

    if (currentStep === 3 && cmCorrect) {
      const newCompleted = completedObjects.includes(selectedObject)
        ? completedObjects
        : completedObjects.concat(selectedObject);
      setCompletedObjects(newCompleted);
      resetStep3Inputs();

      if (newCompleted.length >= MEASURE_OBJECT_KEYS.length) {
        setCurrentStep(4);
      } else {
        setSelectedObject(null);
        setCurrentStep(1);
      }
      return;
    }

    if (currentStep === 4 && step4CorrectObject === "Spoon") {
      setCurrentStep(5);
      return;
    }

    if (currentStep === 5) {
      setCurrentStep(6);
    }
  };

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
        ce(Nudge, { show: !!nudgePosition, position: nudgePosition })
      )
    );
  }

  if (currentStep === 6) {
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
        })
      )
    );
  }

  if (currentStep === 1) {
    const isSecondVisit = completedObjects.length === 1 && !!remainingObjectKey;
    const navText = selectedObject
      ? APP_DATA.step1.navTextSelected.split("{{object}}").join(APP_DATA.objectNames[selectedObject])
      : isSecondVisit
        ? replaceObjectName(APP_DATA.step1.navTextSecond, remainingObjectKey)
        : APP_DATA.step1.navText;
    const characterText = isSecondVisit
      ? replaceObjectName(APP_DATA.step1.characterTextSecond, remainingObjectKey)
      : APP_DATA.step1.characterText;

    return ce(
      "div",
      { className: "applet-container" },
      ce(
        "div",
        { className: "with-character-layout" },
        ce(CharacterPanel, {
          characterImage: getCharacterImage(),
          characterText: characterText,
        }),
        ce(
          ContentPanel,
          { step: 1 },
          ce(
            "div",
            { className: "step-main-row object-select-main-row" },
            ce(
              "div",
              { className: "object-select-list" },
              MEASURE_OBJECT_KEYS.map((key) => {
                const obj = OBJECT_MAP[key];
                const isDisabled = completedObjects.includes(key);
                const isSelected = selectedObject === key;
                const widthScale = key === "Spoon" ? 1 : 0.75;
                const showMeasuredBracket = isSecondVisit && completedObjects.includes(key);
                const className = [
                  "object-select-item",
                  isSelected ? "selected" : "",
                  isDisabled ? "disabled" : "",
                ].join(" ").trim();
                return ce(
                  "div",
                  {
                    key: "select-wrap-" + key,
                    className:
                      "object-select-row" +
                      (key === "Crayon" ? " object-select-row--crayon" : " object-select-row--spoon"),
                    style: {
                      width: widthScale * 100 + "%",
                      alignSelf: key === "Spoon" ? "stretch" : "center",
                    },
                  },
                  showMeasuredBracket &&
                    ce(
                      "div",
                      { className: "measured-bracket" },
                      ce("div", { className: "measured-bracket-label" }, obj.cm + " cm"),
                      ce("div", { className: "measured-bracket-arms" })
                    ),
                  ce(
                    "button",
                    {
                      className: className,
                      onClick: () => handleObjectSelected(key),
                      disabled: isDisabled,
                    },
                    ce("img", {
                      src: "assets/" + obj.image,
                      alt: APP_DATA.objectNames[key],
                      className: "object-select-image",
                    })
                  )
                );
              })
            )
          )
        )
      ),
      ce(Navigation, {
        onNav: (dir) => {
          if (dir === "next") handleNext();
        },
        isPrevDisabled: true,
        isNextDisabled: !selectedObject,
        navText,
        nextButtonRef,
      }),
      ce(Nudge, { show: !!nudgePosition, position: nudgePosition })
    );
  }

  if (currentStep === 2) {
    const objData = getObjData();
    const objWidthVw = objData.widthCm * CM_TO_VW;
    const navText = step2Feedback === "correct" ? t(APP_DATA.step2.navTextCorrect) : t(APP_DATA.step2.navText);

    let feedbackText = "";
    let feedbackClass = "";
    if (step2Feedback === "correct") {
      feedbackText = APP_DATA.step2.correctFeedback;
      feedbackClass = "correct";
    } else if (step2Feedback === "wrong") {
      feedbackText = APP_DATA.step2.wrongFeedback;
      feedbackClass = "wrong";
    }

    const hasRulerMoved = rulerPos.x !== 0 || rulerPos.y !== 0;
    const rulerStyle = hasRulerMoved ? {
      position: "absolute",
      left: rulerPos.x + "px",
      top: rulerPos.y + "px",
      width: RULER_WIDTH_VW + "vw",
      cursor: rulerLocked ? "default" : "grab",
      zIndex: 10,
      touchAction: "none",
      userSelect: "none",
    } : {
      position: "absolute",
      left: "1vw",
      bottom: "2vw",
      width: RULER_WIDTH_VW + "vw",
      cursor: rulerLocked ? "default" : "grab",
      zIndex: 10,
      touchAction: "none",
      userSelect: "none",
    };

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
            { className: "step-content ruler-step" },
            ce("div", { className: "step-top-row" }, t(APP_DATA.step2.topText)),
            ce(
              "div",
              { ref: mainRowRef, className: "step-main-row ruler-main-row" },
              ce(
                "div",
                {
                  ref: objectContainerRef,
                  className: "object-container",
                  style: { width: objWidthVw + "vw", height: "9vw", left: "3vw", top: "10vw" },
                },
                ce("img", {
                  src: "assets/" + objData.image,
                  className: "object-container-img",
                  alt: objectName,
                })
              ),
              ce(
                "div",
                {
                  ref: rulerContainerRef,
                  className: "ruler-container" + (rulerDragging ? " dragging" : ""),
                  style: rulerStyle,
                  onMouseDown: rulerLocked ? undefined : handleDragStart,
                  onTouchStart: rulerLocked ? undefined : handleDragStart,
                },
                ce("img", {
                  src: "assets/ruler.svg",
                  className: "ruler-img",
                  alt: "Ruler",
                  draggable: false,
                })
              )
            ),
            ce(
              "div",
              { className: "check-row" },
              ce(
                "div",
                { className: "feedback-box " + feedbackClass + (feedbackText ? " show" : "") },
                feedbackText
              ),
              ce(
                "button",
                {
                  className: "check-btn",
                  onClick: handleRulerCheck,
                  disabled: rulerLocked,
                },
                APP_DATA.step2.check
              )
            )
          )
        )
      ),
      ce(Navigation, {
        onNav: (dir) => {
          if (dir === "prev") handlePrev();
          if (dir === "next") handleNext();
        },
        isPrevDisabled: false,
        isNextDisabled: step2Feedback !== "correct",
        navText,
        nextButtonRef,
      }),
      ce(Nudge, { show: !!nudgePosition, position: nudgePosition })
    );
  }

  if (currentStep === 3) {
    const objData = getObjData();
    const objWidthVw = objData.widthCm * CM_TO_VW;
    const navText = cmCorrect ? APP_DATA.step3.navTextCorrect : APP_DATA.step3.navText;

    let cmInputClass = "measure-input-box cm-box";
    if (cmCorrect) cmInputClass += " correct";
    if (inputShake === "cm") cmInputClass += " shake";
    if (!cmCorrect) cmInputClass += " active";

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
            { className: "step-content ruler-step" },
            ce("div", { className: "step-top-row" }, t(APP_DATA.step3.topText)),
            ce(
              "div",
              { className: "step-main-row ruler-main-row" },
              ce(
                "div",
                {
                  className: "measurement-display single-input measurement-display--object-centered",
                  style: {
                    "--md-center-x": "calc(3vw + " + objWidthVw / 2 + "vw)",
                  },
                },
                ce("span", { className: cmInputClass }, cmAnswer || ""),
                ce("span", { className: "measure-cm-text" }, "cm")
              ),
              ce(
                "div",
                {
                  className: "object-container",
                  style: { width: objWidthVw + "vw", height: "9vw", left: "3vw", top: "10vw" },
                },
                ce("img", {
                  src: "assets/" + objData.image,
                  className: "object-container-img",
                  alt: objectName,
                })
              ),
              ce(
                "div",
                {
                  className: "ruler-container locked",
                  style: {
                    position: "absolute",
                    left: rulerPos.x + "px",
                    top: rulerPos.y + "px",
                    width: RULER_WIDTH_VW + "vw",
                    cursor: "default",
                    zIndex: 10,
                  },
                },
                ce("img", {
                  src: "assets/ruler.svg",
                  className: "ruler-img",
                  alt: "Ruler",
                  draggable: false,
                })
              )
            ),
            ce(
              "div",
              { className: "check-row numpad-check-row" },
              ce(
                "div",
                { className: "numpad-row" },
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => ce(
                  "button",
                  {
                    key: "np-" + n,
                    className: "numpad-inline-btn",
                    onClick: () => handleNumpadDigit(String(n)),
                    disabled: cmCorrect,
                  },
                  String(n)
                ))
              ),
              ce(
                "button",
                {
                  className: "check-btn",
                  onClick: handleStep3Check,
                  disabled: cmCorrect || cmAnswer === "",
                },
                APP_DATA.step2.check
              )
            )
          )
        )
      ),
      ce(Navigation, {
        onNav: (dir) => {
          if (dir === "prev") handlePrev();
          if (dir === "next") handleNext();
        },
        isPrevDisabled: false,
        isNextDisabled: !cmCorrect,
        navText,
        nextButtonRef,
      }),
      ce(Nudge, { show: !!nudgePosition, position: nudgePosition })
    );
  }

  if (currentStep === 4 || currentStep === 5) {
    const navText =
      currentStep === 4
        ? (step4CorrectObject === "Spoon" ? APP_DATA.step4.navTextCorrect : APP_DATA.step4.navText)
        : APP_DATA.step5.navText;
    const isNextEnabled = currentStep === 4 ? step4CorrectObject === "Spoon" : true;
    const charText = currentStep === 4
      ? (step4CorrectObject === "Spoon" ? APP_DATA.step4.characterTextCorrect : APP_DATA.step4.characterText)
      : APP_DATA.step5.characterText;

    const compareListClass =
      "object-select-list compare-like-step1" +
      (currentStep === 5 ? " compare-step5-list" : "");

    return ce(
      "div",
      { className: "applet-container" },
      ce(
        "div",
        { className: "with-character-layout" },
        ce(CharacterPanel, {
          characterImage: getCharacterImage(),
          characterText: charText,
          useHtmlText: true,
        }),
        ce(
          ContentPanel,
          { step: 1 },
          ce(
            "div",
            { className: "step-main-row object-select-main-row" },
            ce(
              "div",
              { className: compareListClass },
              MEASURE_OBJECT_KEYS.map((key) => {
                const obj = OBJECT_MAP[key];
                const widthScale = key === "Spoon" ? 1 : 0.75;
                const rowClass =
                  "object-select-row" +
                  (key === "Crayon" ? " object-select-row--crayon" : " object-select-row--spoon");

                const bracketBlock = ce(
                  "div",
                  { className: "measured-bracket" },
                  ce("div", { className: "measured-bracket-label" }, obj.cm + " cm"),
                  ce("div", { className: "measured-bracket-arms" })
                );

                if (currentStep === 4) {
                  const itemClass = [
                    "object-select-item",
                    "compare-step4-item",
                    step4CorrectObject === "Spoon" && key === "Spoon" ? "step4-item-correct" : "",
                    step4WrongObject === key ? "wrong" : "",
                  ]
                    .join(" ")
                    .trim();
                  return ce(
                    "div",
                    {
                      key: "compare4-" + key,
                      className: rowClass,
                      style: {
                        width: widthScale * 100 + "%",
                        alignSelf: key === "Spoon" ? "stretch" : "center",
                      },
                    },
                    bracketBlock,
                    ce(
                      "button",
                      {
                        type: "button",
                        className: itemClass,
                        onClick: () => handleStep4Choice(key),
                        disabled: step4CorrectObject === "Spoon",
                      },
                      ce("img", {
                        src: "assets/" + obj.image,
                        alt: APP_DATA.objectNames[key],
                        className: "object-select-image",
                      })
                    )
                  );
                }

                const step5VariantClass =
                  key === "Spoon" ? "step5-compare-row--longer" : "step5-compare-row--shorter";
                return ce(
                  "div",
                  {
                    key: "compare5-" + key,
                    className: "step5-compare-row " + step5VariantClass,
                  },
                  ce("div", { className: "step5-name-label" }, APP_DATA.step4.names[key]),
                  ce(
                    "div",
                    {
                      className: rowClass,
                      style: {
                        width: widthScale * 100 + "%",
                        alignSelf: key === "Spoon" ? "stretch" : "center",
                      },
                    },
                    bracketBlock,
                    ce(
                      "div",
                      { className: "object-select-item object-select-item--static compare-step5-item" },
                      ce("img", {
                        src: "assets/" + obj.image,
                        alt: APP_DATA.objectNames[key],
                        className: "object-select-image",
                      })
                    )
                  ),
                  ce("div", { className: "step5-length-label" }, APP_DATA.step5.lengths[key])
                );
              })
            )
          )
        )
      ),
      ce(Navigation, {
        onNav: (dir) => {
          if (dir === "prev") handlePrev();
          if (dir === "next") handleNext();
        },
        isPrevDisabled: currentStep === 4,
        isNextDisabled: !isNextEnabled,
        navText,
        nextButtonRef,
      }),
      ce(Nudge, { show: !!nudgePosition, position: nudgePosition })
    );
  }

  return null;
};
