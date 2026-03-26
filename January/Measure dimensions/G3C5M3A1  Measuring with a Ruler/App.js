const App = () => {
  const { useState, useCallback, useEffect, useRef } = React;
  const ce = React.createElement;

  // Steps: 0=start, 1=spinning wheel, 2=place ruler, 3=identify length, 4=end
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedObject, setSelectedObject] = useState(null);
  const [completedObjects, setCompletedObjects] = useState([]);

  // Step 2 state
  const [rulerPos, setRulerPos] = useState({ x: 0, y: 0 });
  const [rulerDragging, setRulerDragging] = useState(false);
  const [rulerLocked, setRulerLocked] = useState(false);
  const [step2Feedback, setStep2Feedback] = useState(null); // null, "correct", "wrong"

  // Step 3 state
  const [cmAnswer, setCmAnswer] = useState("");
  const [mmAnswer, setMmAnswer] = useState("");
  const [activeInput, setActiveInput] = useState("cm"); // "cm" or "mm"
  const [cmCorrect, setCmCorrect] = useState(false);
  const [mmCorrect, setMmCorrect] = useState(false);
  const [inputShake, setInputShake] = useState(null); // "cm" or "mm" or null

  // Nudge
  const [step1WheelNudgeDismissed, setStep1WheelNudgeDismissed] = useState(false);
  const [nudgePosition, setNudgePosition] = useState(null);
  const fullscreenButtonRef = useRef(null);
  const nextButtonRef = useRef(null);
  const contentPanelRef = useRef(null);

  // Refs for ruler drag
  const mainRowRef = useRef(null);
  const objectContainerRef = useRef(null);
  const rulerContainerRef = useRef(null);
  const dragStartRef = useRef(null);

  const CM_TO_VW = 3.5;
  // Ruler SVG: leftGap = 8.7px, cmUnit = 19.0px, svgWidth = 404.04px
  const RULER_SVG_WIDTH = 404.04;
  const RULER_LEFT_GAP = 8.7;
  const CM_UNIT_PX = 19.0; // gap + mark width
  const RULER_TOTAL_CM = 20;
  // Ruler width in vw
  const RULER_WIDTH_VW = (RULER_SVG_WIDTH / CM_UNIT_PX) * CM_TO_VW;
  // Left gap in vw
  const LEFT_GAP_VW = (RULER_LEFT_GAP / CM_UNIT_PX) * CM_TO_VW;

  // Snap threshold in px
  const SNAP_THRESHOLD = 8;

  const getObjData = useCallback(() => {
    return selectedObject ? OBJECTS.find(o => o.key === selectedObject) : null;
  }, [selectedObject]);

  const objectName = selectedObject ? APP_DATA.objectNames[selectedObject] : "";

  const t = (template) => {
    if (!template) return "";
    let result = template;
    result = result.split("{{object}}").join(objectName);
    return result;
  };

  const getCharacterImage = () => {
    if (currentStep === 2) {
      if (step2Feedback === "wrong") return "charsad.png";
      if (step2Feedback === "correct") return "charhappy.png";
    }
    if (currentStep === 3) {
      if (cmCorrect && mmCorrect) return "charhappy.png";
    }
    return "chardefault.png";
  };

  // ===== Nudge positioning =====
  useEffect(() => {
    const updatePos = () => {
      if (currentStep === 0 && fullscreenButtonRef.current) {
        const r = fullscreenButtonRef.current.getBoundingClientRect();
        setNudgePosition({ left: r.left, top: r.top, width: r.width, height: r.height });
        return;
      }
      if (currentStep === 1 && !step1WheelNudgeDismissed && contentPanelRef.current) {
        const r = contentPanelRef.current.getBoundingClientRect();
        setNudgePosition({
          left: r.left + r.width / 2 - 24,
          top: r.top + r.height / 2 - 24,
          width: 48,
          height: 48,
        });
        return;
      }
      // Next button nudge
      const nextEnabled = (currentStep === 2 && step2Feedback === "correct") ||
        (currentStep === 3 && cmCorrect && mmCorrect);
      if (nextEnabled && nextButtonRef.current) {
        const r = nextButtonRef.current.getBoundingClientRect();
        setNudgePosition({ left: r.left, top: r.top, width: r.width, height: r.height });
        return;
      }
      setNudgePosition(null);
    };
    const id = requestAnimationFrame(() => updatePos());
    return () => cancelAnimationFrame(id);
  }, [currentStep, step1WheelNudgeDismissed, step2Feedback, cmCorrect, mmCorrect]);

  // ===== Reset ruler position when entering step 2 =====
  useEffect(() => {
    if (currentStep === 2) {
      // Calculate initial position: 2vw from bottom, 1vw from left of mainRow
      // We'll set via vw, converted in the render
      setRulerPos({ x: 0, y: 0 }); // Will be set via CSS initially
      setRulerLocked(false);
      setStep2Feedback(null);
    }
  }, [currentStep, selectedObject]);

  // ===== Reset step 3 state =====
  useEffect(() => {
    if (currentStep === 3) {
      setCmAnswer("");
      setMmAnswer("");
      setActiveInput("cm");
      setCmCorrect(false);
      setMmCorrect(false);
      setInputShake(null);
    }
  }, [currentStep, selectedObject]);

  // Clear input shake after animation
  useEffect(() => {
    if (inputShake) {
      const t = setTimeout(() => {
        if (inputShake === "cm") setCmAnswer("");
        if (inputShake === "mm") setMmAnswer("");
        setInputShake(null);
      }, 500);
      return () => clearTimeout(t);
    }
  }, [inputShake]);



  // ===== HANDLERS =====

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
    setStep1WheelNudgeDismissed(false);
  };

  const handleObjectSelected = (objectKey) => {
    playSound("click");
    setSelectedObject(objectKey);
    setCurrentStep(2);
  };

  // ===== RULER DRAG LOGIC =====
  const vwToPx = (vw) => window.innerWidth * vw / 100;
  const pxToVw = (px) => px / window.innerWidth * 100;

  const getSnapPoints = useCallback(() => {
    // Generate snap points: each cm marking position (0 through 20)
    // Position of mark N from ruler's left edge in vw = LEFT_GAP_VW + N * CM_TO_VW
    const points = [];
    points.push(0); // Extreme left edge of the physical ruler
    for (let n = 0; n <= RULER_TOTAL_CM; n++) {
      points.push(LEFT_GAP_VW + n * CM_TO_VW);
    }
    return points;
  }, []);

  const handleRulerCheck = useCallback(() => {
    if (rulerLocked) return;
    if (!objectContainerRef.current || !rulerContainerRef.current || !mainRowRef.current) return;

    const mainRect = mainRowRef.current.getBoundingClientRect();
    const objRect = objectContainerRef.current.getBoundingClientRect();
    const rulerRect = rulerContainerRef.current.getBoundingClientRect();

    // The zero mark position on the ruler (in page px)
    const zeroMarkPageX = rulerRect.left + vwToPx(LEFT_GAP_VW);

    // Target: left border of object container
    const targetX = objRect.left;

    const diffX = Math.abs(zeroMarkPageX - targetX);
    const diffY = Math.abs(rulerRect.top - objRect.bottom);

    // Consider it correct if both X and Y gaps are within threshold (0.5vw).
    if (diffX < vwToPx(0.5) && diffY < vwToPx(0.5)) {
      playSound("correct");
      setStep2Feedback("correct");
      setRulerLocked(true);
    } else {
      playSound("wrong");
      setStep2Feedback("wrong");
    }
  }, [rulerLocked]);

  // Drag handlers
  const handleDragStart = useCallback((e) => {
    if (rulerLocked) return;
    
    // Prevent default only if cancelable (fixes passive event listener warning)
    if (e.cancelable) {
      e.preventDefault();
    } else if (e.nativeEvent && e.nativeEvent.cancelable) {
      e.nativeEvent.preventDefault();
    }
    
    const touch = e.touches ? e.touches[0] : e;
    const rulerEl = rulerContainerRef.current;
    if (!rulerEl) return;

    // If user moves after wrong feedback, hide it
    if (step2Feedback === "wrong") {
      setStep2Feedback(null);
    }

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

    // Snap: ruler's top edge to object container bottom
    const objRect = objEl.getBoundingClientRect();
    const localOriginY = mainRect.top;
    const objBottomLocal = objRect.bottom - localOriginY;
    const rulerHeight = rulerEl.getBoundingClientRect().height;

    // Minimum Y clamping: Do not allow the ruler to cross above the object container's bottom edge
    if (newTop < objBottomLocal) {
      newTop = objBottomLocal;
    }

    // Snap Y: ruler top to object bottom
    if (Math.abs(newTop - objBottomLocal) < SNAP_THRESHOLD) {
      newTop = objBottomLocal;
    }

    // Snap X: any cm marking to object left edge
    const objLeftRelative = objRect.left - mainRect.left;
    const snapPoints = getSnapPoints();
    const rulerWidthPx = rulerEl.getBoundingClientRect().width;
    const rulerWidthVw = RULER_WIDTH_VW;

    for (const markVw of snapPoints) {
      // Mark position in px relative to ruler left
      const markPxFromRulerLeft = (markVw / rulerWidthVw) * rulerWidthPx;
      // Mark position relative to main div
      const markAbsX = newLeft + markPxFromRulerLeft;

      if (Math.abs(markAbsX - objLeftRelative) < SNAP_THRESHOLD) {
        newLeft = objLeftRelative - markPxFromRulerLeft;
        break;
      }
    }

    setRulerPos({ x: newLeft, y: newTop });
  }, [rulerDragging, rulerLocked, getSnapPoints]);

  const handleDragEnd = useCallback(() => {
    setRulerDragging(false);
    dragStartRef.current = null;
  }, []);

  // Attach move/end to window
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

  // ===== STEP 3 NUMPAD HANDLERS =====
  const handleNumpadDigit = (digit) => {
    if (activeInput === "cm" && cmCorrect) return;
    if (activeInput === "mm" && mmCorrect) return;

    playSound("click");

    if (activeInput === "cm") {
      // Max 2 digits for cm
      if (cmAnswer.length >= 2) {
        setCmAnswer(String(digit));
      } else {
        setCmAnswer(prev => prev + digit);
      }
    } else {
      // Max 1 digit for mm
      setMmAnswer(String(digit));
    }
  };

  const handleStep3Check = () => {
    const objData = getObjData();
    if (!objData) return;

    if (activeInput === "cm") {
      const val = parseInt(cmAnswer, 10);
      if (val === objData.cm) {
        playSound("correct");
        setCmCorrect(true);
        setActiveInput("mm");
      } else {
        playSound("wrong");
        setInputShake("cm");
      }
    } else if (activeInput === "mm") {
      const val = parseInt(mmAnswer, 10);
      if (val === objData.mm) {
        playSound("correct");
        setMmCorrect(true);
      } else {
        playSound("wrong");
        setInputShake("mm");
      }
    }
  };

  // ===== NAVIGATION =====
  const handlePrev = () => {
    playSound("click");
    if (currentStep === 1) {
      if (completedObjects.length === 0) return;
      // Go back to step 3 of previous object
      const prevObj = completedObjects[completedObjects.length - 1];
      setCompletedObjects(completedObjects.slice(0, -1));
      setSelectedObject(prevObj);
      setCurrentStep(3);
    } else if (currentStep === 2) {
      setSelectedObject(null);
      setCurrentStep(1);
    } else if (currentStep === 3) {
      setCurrentStep(2);
    }
  };

  const handleNext = () => {
    playSound("click");
    if (currentStep === 2 && step2Feedback === "correct") {
      setCurrentStep(3);
    } else if (currentStep === 3 && cmCorrect && mmCorrect) {
      const newCompleted = completedObjects.concat(selectedObject);
      setCompletedObjects(newCompleted);
      if (newCompleted.length >= OBJECTS.length) {
        setCurrentStep(4);
      } else {
        setStep1WheelNudgeDismissed(false);
        setSelectedObject(null);
        setCurrentStep(1);
      }
    }
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
        ce(Nudge, {
          show: !!nudgePosition,
          position: nudgePosition,
        })
      )
    );
  }

  // ===== STEP 4: FULLSCREEN END =====
  if (currentStep === 4) {
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
          characterText: completedObjects.length > 0
            ? APP_DATA.step1.characterText2
            : APP_DATA.step1.characterText,
        }),
        ce(
          ContentPanel,
          { step: 1, contentRef: contentPanelRef },
          ce(SpinningWheel, {
            objects: OBJECTS,
            disabledObjects: completedObjects,
            onSelect: handleObjectSelected,
            onWheelClick: () => setStep1WheelNudgeDismissed(true),
          })
        )
      ),
      ce(Navigation, {
        onNav: (dir) => {
          if (dir === "prev") handlePrev();
        },
        isPrevDisabled: completedObjects.length === 0,
        isNextDisabled: true,
        navText: APP_DATA.step1.navText,
      }),
      ce(Nudge, {
        show: !!nudgePosition,
        position: nudgePosition,
        gifClassName: !step1WheelNudgeDismissed ? "step1" : "",
      })
    );
  }

  // ===== STEP 2: PLACE RULER =====
  if (currentStep === 2) {
    const objData = getObjData();
    const objWidthVw = objData.widthCm * CM_TO_VW;

    let navText;
    if (step2Feedback === "correct") {
      navText = t(APP_DATA.step2.navTextCorrect);
    } else {
      navText = t(APP_DATA.step2.navText);
    }

    let feedbackText = null;
    let feedbackClass = "";
    if (step2Feedback === "correct") {
      feedbackText = APP_DATA.step2.correctFeedback;
      feedbackClass = "correct";
    } else if (step2Feedback === "wrong") {
      feedbackText = APP_DATA.step2.wrongFeedback;
      feedbackClass = "wrong";
    }

    const isNextEnabled = step2Feedback === "correct";

    // Object container: positioned 3vw from left, 7vw from top
    // Width depends on object: widthCm * 3.5vw
    // Height: ~7vw
    // Left and right borders, image touches edges (no padding)

    // Ruler container: contains ruler.svg exactly, no padding
    // Width = RULER_WIDTH_VW
    // Draggable
    // Initial position: 2vw from bottom, 1vw from left

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
              {
                ref: mainRowRef,
                className: "step-main-row ruler-main-row",
              },
              // Object container
              ce(
                "div",
                {
                  ref: objectContainerRef,
                  className: "object-container",
                  style: {
                    width: objWidthVw + "vw",
                    height: "9vw",
                    left: "3vw",
                    top: "10vw",
                  },
                },
                ce("img", {
                  src: "assets/" + objData.image,
                  className: "object-container-img",
                  alt: objectName,
                })
              ),
              // Ruler container (draggable)
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
            // Check row
            ce(
              "div",
              { className: "check-row" },
              ce(
                "div",
                {
                  className: "feedback-box " + feedbackClass + (feedbackText ? " show" : ""),
                },
                feedbackText || ""
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
        isNextDisabled: !isNextEnabled,
        navText: navText,
        nextButtonRef: nextButtonRef,
      }),
      ce(Nudge, {
        show: !!nudgePosition,
        position: nudgePosition,
      })
    );
  }

  // ===== STEP 3: IDENTIFY LENGTH =====
  if (currentStep === 3) {
    const objData = getObjData();
    const objWidthVw = objData.widthCm * CM_TO_VW;

    const isLastObject = completedObjects.length === OBJECTS.length - 1;
    let navText;
    if (cmCorrect && mmCorrect) {
      navText = isLastObject
        ? APP_DATA.step3.navTextCorrectLast
        : APP_DATA.step3.navTextCorrect;
    } else {
      navText = APP_DATA.step3.navText;
    }

    const isNextEnabled = cmCorrect && mmCorrect;

    // Build cm input class
    let cmInputClass = "measure-input-box cm-box";
    if (cmCorrect) cmInputClass += " correct";
    if (inputShake === "cm") cmInputClass += " shake";
    if (activeInput === "cm" && !cmCorrect) cmInputClass += " active";

    // Build mm input class
    let mmInputClass = "measure-input-box mm-box";
    if (mmCorrect) mmInputClass += " correct";
    if (inputShake === "mm") mmInputClass += " shake";
    if (activeInput === "mm" && !mmCorrect) mmInputClass += " active";

    // Calculate ruler position to show 0 at object left edge
    // Maintained seamlessly via the recorded rulerPos state from Step 2
    const objContainerTop = 10; // vw

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
              // Measurement display (position absolute, centered)
              ce(
                "div",
                { className: "measurement-display" },
                ce("span", { className: cmInputClass, onClick: () => { if (!cmCorrect) setActiveInput("cm"); } },
                  cmAnswer || ""
                ),
                ce("span", { className: "measure-cm-text" }, " cm "),
                ce("span", { className: "measure-and" }, "and"),
                " ",
                ce("span", { className: mmInputClass, onClick: () => { if (cmCorrect && !mmCorrect) setActiveInput("mm"); } },
                  mmAnswer || ""
                ),
                ce("span", { className: "measure-mm-text" }, " mm")
              ),
              // Object container (same position as step 2 but locked ruler below)
              ce(
                "div",
                {
                  className: "object-container",
                  style: {
                    width: objWidthVw + "vw",
                    height: "9vw",
                    left: "3vw",
                    top: objContainerTop + "vw",
                  },
                },
                ce("img", {
                  src: "assets/" + objData.image,
                  className: "object-container-img",
                  alt: objectName,
                })
              ),
              // Ruler (locked, positioned seamlessly using Step 2 captured coordinates)
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
            // Check row with numpad buttons
            ce(
              "div",
              { className: "check-row numpad-check-row" },
              ce(
                "div",
                { className: "numpad-row" },
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(n =>
                  ce("button", {
                    key: "np-" + n,
                    className: "numpad-inline-btn",
                    onClick: () => handleNumpadDigit(String(n)),
                    disabled: cmCorrect && mmCorrect,
                  }, String(n))
                )
              ),
              ce(
                "button",
                {
                  className: "check-btn",
                  onClick: handleStep3Check,
                  disabled: cmCorrect && mmCorrect || (activeInput === "cm" ? cmAnswer === "" : mmAnswer === ""),
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
        isNextDisabled: !isNextEnabled,
        navText: navText,
        nextButtonRef: nextButtonRef,
      }),
      ce(Nudge, {
        show: !!nudgePosition,
        position: nudgePosition,
      })
    );
  }

  return null;
};
