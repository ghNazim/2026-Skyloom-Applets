const MainCanvas = (props) => {
  const {
    step,
    restoreStep2Revealed,
    restoreStep4Revealed,
    onSetNextEnabled,
    onUpdateTexts,
    onAdvanceStep,
    onRevealRuler,
    onDismissPencilNudge,
    onDismissEraserNudge,
    onDismissMagNudge,
    onDismissS11Nudge,
    onS11NudgeReposition,
    onDismissS13Pencil,
    onDismissS14Pencil,
    onDismissS15Eraser,
    onDismissS16Eraser,
  } = props;
  const { useState, useEffect, useRef, useCallback } = React;

  const canvasRef = useRef(null);
  const pencilRef = useRef(null);
  const firstSlotRef = useRef(null);
  const [handEraserVisible, setHandEraserVisible] = useState(true);
  const [erasersBelowVisible, setErasersBelowVisible] = useState([]);
  const [clonePosition, setClonePosition] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [answerRevealed, setAnswerRevealed] = useState(false);
  const [eraserCountTopVisible, setEraserCountTopVisible] = useState(false);
  const [countLabelsVisible, setCountLabelsVisible] = useState([]);

  // Step 5 state
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [visualFeedback, setVisualFeedback] = useState(null); // 0, 1, 2 or null

  const isFarhan = step === 1 || step === 2;
  const isAisha = step === 3 || step === 4;
  const eraserCount = isFarhan ? 3 : 4;
  const eraserSizeVw = isFarhan ? 9 : 27 / 4;
  const characterImg = isFarhan ? "assets/farhan.png" : "assets/aisha.png";
  const eraserImg = isFarhan ? "assets/eraser1.png" : "assets/eraser2.png";

  const stepData =
    step === 1
      ? APP_DATA.step1Farhan
      : step === 2
        ? APP_DATA.step2Farhan
        : step === 3
          ? APP_DATA.step3Aisha
          : APP_DATA.step4Aisha;

  useEffect(() => {
    if (step === 1 || step === 3) {
      setHandEraserVisible(true);
      setErasersBelowVisible(Array(eraserCount).fill(false));
      setClonePosition(null);
      setAnimating(false);
      setAnswerRevealed(false);
      setEraserCountTopVisible(false);
      setCountLabelsVisible([]);
    } else if (step === 2 || step === 4) {
      setHandEraserVisible(false);
      setErasersBelowVisible(Array(eraserCount).fill(true));
      setClonePosition(null);
      setAnimating(false);
      const restored =
        (step === 2 && restoreStep2Revealed) ||
        (step === 4 && restoreStep4Revealed);
      setAnswerRevealed(!!restored);
      setEraserCountTopVisible(!!restored);
      setCountLabelsVisible(restored ? Array(eraserCount).fill(true) : []);
    }
  }, [step, eraserCount, restoreStep2Revealed, restoreStep4Revealed]);

  // Reset step 5 state
  useEffect(() => {
    if (step === 5) {
      setSelectedOption(null);
      setIsCorrect(false);
      setShowFeedback(false);
      setFeedbackText("");
      setVisualFeedback(null);
    }
  }, [step]);

  const handleHandEraserClick = useCallback(() => {
    if (step !== 1 && step !== 3) return;
    if (animating) return;
    if (onDismissEraserNudge) onDismissEraserNudge();
    setAnimating(true);
    if (typeof playSound === "function") playSound("click");

    const canvas = canvasRef.current;
    const handEraserEl = document.getElementById(
      step === 1 ? "hand-eraser" : "hand-eraser-aisha",
    );
    if (!canvas || !handEraserEl) {
      setHandEraserVisible(false);
      setErasersBelowVisible(Array(eraserCount).fill(true));
      setAnimating(false);
      setTimeout(() => onAdvanceStep(), 400);
      return;
    }

    const rect = handEraserEl.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();
    const startX = rect.left - canvasRect.left + rect.width / 2;
    const startY = rect.top - canvasRect.top + rect.height / 2;

    setHandEraserVisible(false);
    setClonePosition({ x: startX, y: startY });

    requestAnimationFrame(() => {
      const cloneEl = document.getElementById("eraser-clone");
      const slotEl = firstSlotRef.current;
      if (!cloneEl || typeof gsap === "undefined") {
        setErasersBelowVisible(Array(eraserCount).fill(true));
        setClonePosition(null);
        setAnimating(false);
        setTimeout(() => onAdvanceStep(), 400);
        return;
      }
      let targetX = startX;
      let targetY = startY + 80;
      if (slotEl) {
        const slotRect = slotEl.getBoundingClientRect();
        targetX = slotRect.left - canvasRect.left + slotRect.width / 2;
        targetY = slotRect.top - canvasRect.top + slotRect.height / 2;
      }
      gsap.to(cloneEl, {
        x: targetX - startX,
        y: targetY - startY,
        duration: 0.6,
        ease: "power2.inOut",
        onComplete: () => {
          setClonePosition(null);
          setErasersBelowVisible([true, false, false].slice(0, eraserCount));
          let shown = 1;
          const showNext = () => {
            if (shown >= eraserCount) {
              setAnimating(false);
              setTimeout(() => onAdvanceStep(), 300);
              return;
            }
            setTimeout(() => {
              setErasersBelowVisible((prev) => {
                const next = [...prev];
                next[shown] = true;
                return next;
              });
              shown++;
              showNext();
            }, 350);
          };
          setTimeout(showNext, 200);
        },
      });
    });
  }, [
    step,
    eraserCount,
    eraserSizeVw,
    animating,
    onDismissEraserNudge,
    onAdvanceStep,
  ]);

  const handlePencilClick = useCallback(() => {
    if (step !== 2 && step !== 4) return;
    if (answerRevealed) return;
    if (onDismissPencilNudge) onDismissPencilNudge();
    if (typeof playSound === "function") playSound("click");
    setAnswerRevealed(true);

    setEraserCountTopVisible(true);
    const countEl = document.getElementById("eraser-count-top");
    if (countEl && typeof gsap !== "undefined") {
      gsap.to(countEl, {
        opacity: 0.2,
        duration: 0.25,
        yoyo: true,
        repeat: 4,
        onComplete: () => {
          gsap.set(countEl, { opacity: 1 });
        },
      });
    }

    const labels = Array(eraserCount)
      .fill(0)
      .map((_, i) => i);
    if (typeof gsap !== "undefined") {
      labels.forEach((i) => {
        gsap.delayedCall(i * 0.25, () => {
          setCountLabelsVisible((prev) => {
            const next = [...prev];
            next[i] = true;
            return next;
          });
          if (typeof playSound === "function") playSound("tick");
        });
      });
    } else {
      setCountLabelsVisible(labels.map(() => true));
      if (typeof playSound === "function") playSound("tick");
    }

    const blinkDuration = countEl ? 0.25 * 2 * 5 : 0;
    const staggerDuration = (eraserCount - 1) * 0.25 + 0.4;
    const totalDelay = (blinkDuration + staggerDuration) * 1000;
    setTimeout(() => {
      onUpdateTexts(stepData.qAfter, stepData.nAfter);
      onSetNextEnabled(true);
    }, totalDelay);
  }, [
    step,
    eraserCount,
    stepData,
    answerRevealed,
    onDismissPencilNudge,
    onUpdateTexts,
    onSetNextEnabled,
  ]);

  // Step 5: MCQ option click handler
  const handleStep5OptionClick = useCallback(
    (option) => {
      if (isCorrect) return; // already answered correctly
      const step5Data = APP_DATA.step5;
      const optionIndex = step5Data.options.indexOf(option);
      const correct = optionIndex === step5Data.correctIndex;

      setSelectedOption(option);
      setIsCorrect(correct);
      setShowFeedback(true);
      setFeedbackText(step5Data.feedbacks[optionIndex] || "");

      // Clear previous visual feedback animations
      clearVisualFeedbackAnimations();
      setVisualFeedback(optionIndex);

      if (correct) {
        if (typeof playSound === "function") playSound("correct");
        setTimeout(() => {
          onSetNextEnabled(true);
          onUpdateTexts(undefined, step5Data.nAfter);
        }, 1000);
      } else {
        if (typeof playSound === "function") playSound("wrong");
      }
    },
    [isCorrect, onSetNextEnabled, onUpdateTexts],
  );

  // Clean up visual feedback GSAP animations
  const clearVisualFeedbackAnimations = useCallback(() => {
    // Kill any running visual feedback animations
    gsap.killTweensOf(".s5-dashed-line");
    gsap.killTweensOf(".s5-pencil-clone");
    gsap.killTweensOf(".s5-eraser-compare-clone");
    // Hide dashed lines
    document.querySelectorAll(".s5-dashed-line").forEach((line) => {
      line.style.display = "none";
      line.style.opacity = "0";
    });
    // Remove cloned elements
    document.querySelectorAll(".s5-pencil-clone").forEach((el) => el.remove());
    document
      .querySelectorAll(".s5-eraser-compare-clone")
      .forEach((el) => el.remove());
  }, []);

  // Visual feedback effects for step 5
  useEffect(() => {
    if (step !== 5 || visualFeedback === null) return;

    const cleanup = () => {
      clearVisualFeedbackAnimations();
    };

    if (visualFeedback === 0) {
      // Option 0: show blinking dashed lines around pencil areas
      const lines = document.querySelectorAll(".s5-dashed-line");
      lines.forEach((line) => {
        line.style.display = "block";
        gsap.fromTo(
          line,
          { opacity: 0 },
          { opacity: 1, duration: 0.5, yoyo: true, repeat: -1 },
        );
      });
    } else if (visualFeedback === 1) {
      // Option 1: clone pencils and animate them to same position in the middle
      const farhanPencil = document.getElementById("s5-farhan-pencil");
      const aishaPencil = document.getElementById("s5-aisha-pencil");
      const farhanCol = document.getElementById("s5-farhan-col");
      const aishaCol = document.getElementById("s5-aisha-col");
      const canvas = canvasRef.current;
      if (farhanPencil && aishaPencil && canvas && farhanCol && aishaCol) {
        const canvasRect = canvas.getBoundingClientRect();
        const farhanColRect = farhanCol.getBoundingClientRect();
        const aishaColRect = aishaCol.getBoundingClientRect();
        // Center point between Farhan and Aisha columns
        const gapCenterX =
          (farhanColRect.right -
            canvasRect.left +
            aishaColRect.left -
            canvasRect.left) /
          2;
        const midY = canvasRect.height / 2;

        // Clone Farhan's pencil
        const fClone = farhanPencil.cloneNode(true);
        fClone.className = "s5-pencil-clone";
        fClone.style.position = "absolute";
        fClone.style.zIndex = "50";
        fClone.style.opacity = "0.5";
        const fRect = farhanPencil.getBoundingClientRect();
        fClone.style.left = fRect.left - canvasRect.left + "px";
        fClone.style.top = fRect.top - canvasRect.top + "px";
        fClone.style.width = fRect.width + "px";
        fClone.style.transform = "none";
        canvas.appendChild(fClone);

        // Clone Aisha's pencil
        const aClone = aishaPencil.cloneNode(true);
        aClone.className = "s5-pencil-clone";
        aClone.style.position = "absolute";
        aClone.style.zIndex = "50";
        aClone.style.opacity = "0.5";
        const aRect = aishaPencil.getBoundingClientRect();
        aClone.style.left = aRect.left - canvasRect.left + "px";
        aClone.style.top = aRect.top - canvasRect.top + "px";
        aClone.style.width = aRect.width + "px";
        aClone.style.transform = "none";
        canvas.appendChild(aClone);

        // Animate both to the exact same position (overlapping) in the center
        const targetX = gapCenterX - fRect.width / 2;
        const targetY = midY;
        gsap.to(fClone, {
          left: targetX,
          top: targetY,
          duration: 0.8,
          ease: "power2.inOut",
        });
        gsap.to(aClone, {
          left: targetX,
          top: targetY,
          duration: 0.8,
          ease: "power2.inOut",
        });
      }
    } else if (visualFeedback === 2) {
      // Option 2 (correct): clone first eraser from each and animate to center, left-aligned
      const farhanEraser = document.querySelector(
        "#s5-farhan-col .s5-eraser-slot img",
      );
      const aishaEraser = document.querySelector(
        "#s5-aisha-col .s5-eraser-slot img",
      );
      const farhanCol = document.getElementById("s5-farhan-col");
      const aishaCol = document.getElementById("s5-aisha-col");
      const canvas = canvasRef.current;
      if (farhanEraser && aishaEraser && canvas && farhanCol && aishaCol) {
        const canvasRect = canvas.getBoundingClientRect();
        const farhanColRect = farhanCol.getBoundingClientRect();
        const aishaColRect = aishaCol.getBoundingClientRect();
        // Center point between Farhan and Aisha columns
        const gapCenterX =
          (farhanColRect.right -
            canvasRect.left +
            aishaColRect.left -
            canvasRect.left) /
          2;
        const midY = canvasRect.height / 2;

        // Clone Farhan's eraser
        const fClone = farhanEraser.cloneNode(true);
        fClone.className = "s5-eraser-compare-clone";
        fClone.style.position = "absolute";
        fClone.style.zIndex = "50";
        fClone.style.opacity = "0.5";
        const fRect = farhanEraser.getBoundingClientRect();
        fClone.style.left = fRect.left - canvasRect.left + "px";
        fClone.style.top = fRect.top - canvasRect.top + "px";
        fClone.style.width = fRect.width + "px";
        fClone.style.height = fRect.height + "px";
        canvas.appendChild(fClone);

        // Clone Aisha's eraser
        const aClone = aishaEraser.cloneNode(true);
        aClone.className = "s5-eraser-compare-clone";
        aClone.style.position = "absolute";
        aClone.style.zIndex = "50";
        aClone.style.opacity = "0.5";
        const aRect = aishaEraser.getBoundingClientRect();
        aClone.style.left = aRect.left - canvasRect.left + "px";
        aClone.style.top = aRect.top - canvasRect.top + "px";
        aClone.style.width = aRect.width + "px";
        aClone.style.height = aRect.height + "px";
        canvas.appendChild(aClone);

        // Animate both to center, stacked vertically, LEFT-EDGE ALIGNED
        const targetLeft = gapCenterX - Math.max(fRect.width, aRect.width) / 2;
        gsap.to(fClone, {
          left: targetLeft,
          top: midY - fRect.height - 5,
          duration: 0.8,
          ease: "power2.inOut",
        });
        gsap.to(aClone, {
          left: targetLeft,
          top: midY + 5,
          duration: 0.8,
          ease: "power2.inOut",
        });
      }
    }

    return cleanup;
  }, [step, visualFeedback, clearVisualFeedbackAnimations]);

  // ---- STEP 9 state ----
  const [s9SelectedCm, setS9SelectedCm] = useState(1);
  const [s9HasTapped, setS9HasTapped] = useState(false);
  const [s9ClickedCmSet, setS9ClickedCmSet] = useState(() => new Set());

  // Reset step 9 state
  useEffect(() => {
    if (step === 9) {
      setS9SelectedCm(1);
      setS9HasTapped(false);
      setS9ClickedCmSet(new Set());
    }
  }, [step]);

  const handleS9CircleClick = useCallback(
    (n) => {
      if (typeof playSound === "function") playSound("click");
      setS9SelectedCm(n);
      setS9ClickedCmSet((prev) => {
        if (prev.has(n)) return prev;
        const next = new Set(prev);
        next.add(n);
        return next;
      });
      if (!s9HasTapped) {
        setS9HasTapped(true);
        onUpdateTexts(undefined, APP_DATA.step9.nAfterTap);
        onSetNextEnabled(true);
      }
      // Update question text
      const step9Data = APP_DATA.step9;
      const qText =
        n === 1
          ? step9Data.qTemplate1
          : step9Data.qTemplate.replace(/\{\{n\}\}/g, n);
      onUpdateTexts(qText, undefined);
    },
    [s9HasTapped, onUpdateTexts, onSetNextEnabled],
  );

  // ---- STEP 10 state ----
  const [s10IsZoomed, setS10IsZoomed] = useState(false);
  const [s10ShowMmCircles, setS10ShowMmCircles] = useState(false);

  useEffect(() => {
    if (step === 10) {
      setS10IsZoomed(false);
      setS10ShowMmCircles(false);
    }
  }, [step]);

  const handleS10MagClick = useCallback(() => {
    if (s10IsZoomed) return;
    if (typeof playSound === "function") playSound("click");
    if (onDismissMagNudge) onDismissMagNudge();

    setS10IsZoomed(true);

    setTimeout(() => {
      setS10ShowMmCircles(true);
      const step10Data = APP_DATA.step10;
      onUpdateTexts(step10Data.qAfter, step10Data.nAfter);
      onSetNextEnabled(true);
    }, 1200); // Wait for transition
  }, [s10IsZoomed, onDismissMagNudge, onUpdateTexts, onSetNextEnabled]);

  // ---- STEP 11 state ----
  const [s11MaxMmClicked, setS11MaxMmClicked] = useState(1);
  const [s11ShowCircle, setS11ShowCircle] = useState(true);

  useEffect(() => {
    if (step === 11) {
      setS11MaxMmClicked(1);
      setS11ShowCircle(true);
    }
  }, [step]);

  // Notify parent to reposition nudge when the clickable circle appears or moves
  useEffect(() => {
    if (step === 11 && s11MaxMmClicked < 10 && s11ShowCircle) {
      onS11NudgeReposition?.();
    }
  }, [step, s11MaxMmClicked, s11ShowCircle, onS11NudgeReposition]);

  const handleS11CircleClick = useCallback(() => {
    if (typeof playSound === "function") playSound("click");

    if (s11MaxMmClicked < 10 && s11ShowCircle) {
      const nextMm = s11MaxMmClicked + 1;
      setS11MaxMmClicked(nextMm);
      setS11ShowCircle(false);

      const step11Data = APP_DATA.step11;
      if (nextMm === 10) {
        onUpdateTexts(step11Data.qFinal, step11Data.nFinal);
        onSetNextEnabled(true);
      } else {
        onUpdateTexts(step11Data.q[nextMm], step11Data.n);
        setTimeout(() => {
          setS11ShowCircle(true);
        }, 600);
      }
    }
  }, [s11MaxMmClicked, s11ShowCircle, onUpdateTexts, onSetNextEnabled]);

  // ---- STEP 12 state ----
  const [s12CurrentMm, setS12CurrentMm] = useState(0);
  const [s12HasDragged, setS12HasDragged] = useState(false);
  const s12RulerRef = useRef(null);

  useEffect(() => {
    if (step === 12) {
      setS12CurrentMm(0);
      setS12HasDragged(false);
    }
  }, [step]);

  const handleS12PointerDown = useCallback((e) => {
    e.target.setPointerCapture(e.pointerId);
  }, []);

  const handleS12PointerMove = useCallback(
    (e) => {
      if (!e.target.hasPointerCapture(e.pointerId)) return;
      if (!s12RulerRef.current) return;

      const rect = s12RulerRef.current.getBoundingClientRect();
      const clientX = e.clientX;
      const xPercent = (clientX - rect.left) / rect.width;

      // SVG physical dimensions mapping to current relative screen coordinates
      const SVG_WIDTH = 405;
      const CM_0_CENTER = 8.95;
      const CM_STEP = 19;
      const MM_STEP = CM_STEP / 10;

      const svgX = xPercent * SVG_WIDTH;
      let mm = Math.round((svgX - CM_0_CENTER) / MM_STEP);
      if (mm < 0) mm = 0;
      if (mm > 150) mm = 150; // Ruler has markings from 0 to 150 mm

      setS12CurrentMm((prev) => {
        if (prev !== mm && typeof playSound === "function") {
          playSound("tick");
        }
        return mm;
      });

      if (!s12HasDragged && mm > 0) {
        setS12HasDragged(true);
        onUpdateTexts(undefined, APP_DATA.step12.nAfterTap);
        onSetNextEnabled(true);
      }
    },
    [s12HasDragged, onUpdateTexts, onSetNextEnabled],
  );

  const handleS12PointerUp = useCallback((e) => {
    e.target.releasePointerCapture(e.pointerId);
  }, []);

  // ---- STEP 13 & 14 logic ----
  const [s14Placed, setS14Placed] = useState(false);
  const [s14AnimDone, setS14AnimDone] = useState(false);
  const [s14MeasurementRevealed, setS14MeasurementRevealed] = useState(false);

  // ---- STEP 15 & 16 logic ----
  const [s16Placed, setS16Placed] = useState(false);
  const [s16AnimDone, setS16AnimDone] = useState(false);
  const [s16MeasurementRevealed, setS16MeasurementRevealed] = useState(false);

  useEffect(() => {
    if (step === 13) {
      setS14Placed(false);
      setS14AnimDone(false);
      setS14MeasurementRevealed(false);
    }
    
    if (step === 14) {
      setS14Placed(false);
      setS14AnimDone(false);
      setS14MeasurementRevealed(false);

      // Instantly start moving downward when step 14 triggers
      const t1 = setTimeout(() => {
        setS14Placed(true);
      }, 100);

      // Calculate time for CSS transition to confidently rest the pencil 
      const t2 = setTimeout(() => {
        setS14AnimDone(true);
        // Trigger App.js to re-evalute Nudge placement finding the newly available #s14-pencil id
        setTimeout(() => window.dispatchEvent(new Event("resize")), 50);
      }, 1200);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
    
    // Eraser equivalents
    if (step === 15) {
      setS16Placed(false);
      setS16AnimDone(false);
      setS16MeasurementRevealed(false);
    }
    
    if (step === 16) {
      setS16Placed(false);
      setS16AnimDone(false);
      setS16MeasurementRevealed(false);

      const t1 = setTimeout(() => {
        setS16Placed(true);
      }, 100);

      const t2 = setTimeout(() => {
        setS16AnimDone(true);
        setTimeout(() => window.dispatchEvent(new Event("resize")), 50);
      }, 1200);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [step]);

  const handleS13PencilClick = useCallback(() => {
    if (typeof playSound === "function") playSound("click");
    if (onDismissS13Pencil) onDismissS13Pencil();
    onAdvanceStep(14);
  }, [onDismissS13Pencil, onAdvanceStep]);

  const handleS14PencilClick = useCallback(() => {
    if (!s14AnimDone) return;
    if (typeof playSound === "function") playSound("click");
    if (onDismissS14Pencil) onDismissS14Pencil();
    
    setS14MeasurementRevealed(true);
    onUpdateTexts(APP_DATA.step14.qFinal, APP_DATA.step14.nFinal);
    onSetNextEnabled(true);
  }, [s14AnimDone, onDismissS14Pencil, onUpdateTexts, onSetNextEnabled]);

  const handleS15EraserClick = useCallback(() => {
    if (typeof playSound === "function") playSound("click");
    if (onDismissS15Eraser) onDismissS15Eraser();
    onAdvanceStep(16);
  }, [onDismissS15Eraser, onAdvanceStep]);

  const handleS16EraserClick = useCallback(() => {
    if (!s16AnimDone) return;
    if (typeof playSound === "function") playSound("click");
    if (onDismissS16Eraser) onDismissS16Eraser();
    
    setS16MeasurementRevealed(true);
    onUpdateTexts(APP_DATA.step16.qFinal, APP_DATA.step16.nFinal);
    onSetNextEnabled(true);
  }, [s16AnimDone, onDismissS16Eraser, onUpdateTexts, onSetNextEnabled]);

  // ---- STEP 7: "Tool to measure" button only ----
  if (step === 7) {
    return React.createElement(
      "div",
      {
        className: "main-canvas-container measure-main-canvas s7-container",
        ref: canvasRef,
      },
      React.createElement("button", {
        type: "button",
        id: "s7-tool-button",
        className: "s7-tool-button",
        onClick: onRevealRuler,
        children: APP_DATA.step7.buttonText,
      }),
    );
  }

  // ---- STEP 8: ruler image + label ----
  if (step === 8) {
    return React.createElement(
      "div",
      {
        className: "main-canvas-container measure-main-canvas s8-container",
        ref: canvasRef,
      },
      React.createElement(
        "div",
        { className: "s8-ruler-wrap" },
        React.createElement("div", { className: "s8-ruler-label" }, APP_DATA.step8.rulerLabel),
        React.createElement("img", {
          src: "assets/ruler.svg",
          alt: "",
          className: "s8-ruler-img",
        }),
      ),
    );
  }

  // ---- STEP 9: ruler with clickable circles + dashed lines ----
  if (step === 9) {
    // Ruler SVG dimensions for positioning
    const SVG_WIDTH = 405;
    const CM_0_CENTER = 8.95; // center of 0 cm marking in SVG px
    const CM_STEP = 19; // px per cm in SVG

    // Compute percentage positions for markings (relative to the ruler img width)
    const cmPosPercent = (n) => ((CM_0_CENTER + n * CM_STEP) / SVG_WIDTH) * 100;

    // Build clickable circles (1 to 15)
    const circles = Array.from({ length: 15 }, (_, i) => {
      const n = i + 1;
      const leftPct = cmPosPercent(n);
      const isActive = s9SelectedCm === n;
      const shouldPulse = !isActive && !s9ClickedCmSet.has(n);
      return React.createElement("div", {
        key: n,
        className:
          "s9-cm-circle" +
          (isActive ? " s9-cm-circle-active" : "") +
          (shouldPulse ? " pulse-highlight" : ""),
        style: { left: leftPct + "%" },
        onClick: () => handleS9CircleClick(n),
        children: null,
      });
    });

    // Dashed line at 0
    const dashedLine0 = React.createElement("div", {
      className: "s9-dashed-line s9-dashed-line-0",
      style: { left: cmPosPercent(0) + "%" },
    });

    // Dashed line at selected cm
    const dashedLineN = React.createElement("div", {
      className: "s9-dashed-line s9-dashed-line-n",
      style: { left: cmPosPercent(s9SelectedCm) + "%" },
    });

    // Arrow between the two dashed lines
    const arrowLeft = cmPosPercent(0);
    const arrowRight = cmPosPercent(s9SelectedCm);
    const arrowDiv = React.createElement("div", {
      className: "s9-arrow-line",
      style: {
        left: arrowLeft + "%",
        width: arrowRight - arrowLeft + "%",
      },
    });

    // Label above the arrow
    const labelDiv = React.createElement(
      "div",
      {
        className: "s9-distance-label",
        style: {
          left: arrowLeft + "%",
          width: arrowRight - arrowLeft + "%",
        },
      },
      s9SelectedCm + " " + APP_DATA.step9.unitCm,
    );

    return React.createElement(
      "div",
      {
        className: "main-canvas-container measure-main-canvas s9-container",
        ref: canvasRef,
      },
      // Annotation layer (dashed lines, arrow, label) - above ruler
      React.createElement(
        "div",
        { className: "s9-annotation-layer" },
        dashedLine0,
        dashedLineN,
        arrowDiv,
        labelDiv,
      ),
      // Ruler image
      React.createElement("img", {
        src: "assets/ruler.svg",
        alt: "",
        className: "s9-ruler-img",
      }),
      // Circles row below ruler
      React.createElement("div", { className: "s9-circles-row" }, circles),
    );
  }

  // ---- STEP 10: Mag glass and zooming ruler ----
  if (step === 10) {
    const SVG_WIDTH = 405;
    const CM_0_CENTER = 8.95;
    const CM_STEP = 19;
    const MM_STEP = CM_STEP / 10;

    // percentage position for MM within the ruler width (placed between marks)
    const mmPosPercent = (n) =>
      ((CM_0_CENTER + (n - 0.5) * MM_STEP) / SVG_WIDTH) * 100;

    const mmCircles = Array.from({ length: 10 }, (_, i) => {
      const n = i + 1;
      const leftPct = mmPosPercent(n);
      return React.createElement("div", {
        key: n,
        className: "s10-mm-circle",
        style: {
          left: leftPct + "%",
          animationDelay: i * 0.05 + "s", // Stagger the pop-in
        },
        children: n,
      });
    });

    return React.createElement(
      "div",
      {
        className: "main-canvas-container measure-main-canvas s10-container",
        ref: canvasRef,
      },
      React.createElement(
        "div",
        {
          className: "s10-ruler-wrap" + (s10IsZoomed ? " s10-zoomed" : ""),
        },
        React.createElement("img", {
          src: "assets/ruler.svg",
          alt: "",
          className: "s10-ruler-img",
        }),
        s10ShowMmCircles &&
          React.createElement("div", { className: "s10-mm-layer" }, mmCircles),
      ),
      !s10IsZoomed &&
        React.createElement("img", {
          id: "mag-glass",
          src: "assets/mag.png",
          alt: APP_DATA.step10.zoomAlt,
          className: "s10-mag-glass",
          onClick: handleS10MagClick,
        }),
    );
  }

  // ---- STEP 11: Measuring millimeter by millimeter ----
  if (step === 11) {
    const SVG_WIDTH = 405;
    const CM_0_CENTER = 8.95;
    const CM_STEP = 19;
    const MM_STEP = CM_STEP / 10;

    // percentage position exactly on the mm marking
    const mmPosPercent = (n) => ((CM_0_CENTER + n * MM_STEP) / SVG_WIDTH) * 100;

    // Dashed line at 0
    const dashedLine0 = React.createElement("div", {
      className: "s11-dashed-line s11-dashed-line-0",
      style: { left: mmPosPercent(0) + "%" },
    });

    // Dashed line at the current maximum clicked mm
    const dashedLineN = React.createElement("div", {
      className: "s11-dashed-line s11-dashed-line-n",
      style: { left: mmPosPercent(s11MaxMmClicked) + "%" },
    });

    // Arrow line bridging 0 and maximum clicked mm
    const arrowLeft = mmPosPercent(0);
    const arrowRight = mmPosPercent(s11MaxMmClicked);
    const arrowDiv = React.createElement("div", {
      className: "s11-arrow-line",
      style: {
        left: arrowLeft + "%",
        width: arrowRight - arrowLeft + "%",
      },
    });

    // "n mm" label above arrow
    const labelDiv = React.createElement(
      "div",
      {
        className: "s11-distance-label",
        style: {
          left: arrowLeft + "%",
          width: arrowRight - arrowLeft + "%",
        },
      },
      s11MaxMmClicked + " " + APP_DATA.step11.unitMm,
    );

    // The single clickable dashed circle that prompts user to advance
    let nextCircle = null;
    if (s11MaxMmClicked < 10 && s11ShowCircle) {
      const targetMm = s11MaxMmClicked + 1;
      nextCircle = React.createElement("div", {
        id: "s11-clickable-circle",
        className: "s11-clickable-circle",
        style: { left: mmPosPercent(targetMm) + "%" },
        onClick: handleS11CircleClick,
      });
    }

    // When qFinal appears (last line clicked), show 1 cm line above the mm line with circle markers
    let cmLineBlock = null;
    if (s11MaxMmClicked === 10) {
      const cmLineLeft = mmPosPercent(0);
      const cmLineRight = mmPosPercent(10);
      cmLineBlock = React.createElement(
        "div",
        { className: "s11-cm-line-block" },
        React.createElement("div", {
          className: "s11-cm-line",
          style: {
            left: cmLineLeft + "%",
            width: cmLineRight - cmLineLeft + "%",
          },
        }),
        React.createElement("div", {
          className: "s11-cm-marker",
          style: { left: cmLineLeft + "%" },
        }),
        React.createElement("div", {
          className: "s11-cm-marker",
          style: { left: cmLineRight + "%" },
        }),
        React.createElement("div", {
          className: "s11-cm-label",
          style: {
            left: cmLineLeft + "%",
            width: cmLineRight - cmLineLeft + "%",
          },
        }, APP_DATA.step11.cm1Label),
      );
    }

    return React.createElement(
      "div",
      {
        className: "main-canvas-container measure-main-canvas s11-container",
        ref: canvasRef,
      },
      React.createElement(
        "div",
        { className: "s11-ruler-wrap" },
        React.createElement("img", {
          src: "assets/ruler.svg",
          alt: "",
          className: "s11-ruler-img",
        }),
        React.createElement(
          "div",
          { className: "s11-annotation-layer" },
          cmLineBlock,
          dashedLine0,
          dashedLineN,
          arrowDiv,
          labelDiv,
          nextCircle,
        ),
      ),
    );
  }

  // ---- STEP 12: Exploring cm and mm dynamically ----
  if (step === 12) {
    const SVG_WIDTH = 405;
    const CM_0_CENTER = 8.95;
    const CM_STEP = 19;
    const MM_STEP = CM_STEP / 10;
    const mmPosPercent = (n) => ((CM_0_CENTER + n * MM_STEP) / SVG_WIDTH) * 100;

    const cmVal = Math.floor(s12CurrentMm / 10);
    const mmVal = s12CurrentMm % 10;

    const lineLeft = mmPosPercent(0);
    const lineWidth = mmPosPercent(s12CurrentMm) - lineLeft;

    return React.createElement(
      "div",
      {
        className: "main-canvas-container measure-main-canvas s12-container",
        ref: canvasRef,
      },
      // Floating Dynamic CM / MM readout Box
      React.createElement(
        "div",
        { className: "s12-mes-text" },
        React.createElement("div", { className: "s12-box-cm" }, cmVal),
        React.createElement("span", { className: "s12-label-cm" }, APP_DATA.step12.labelCm),
        React.createElement("span", { className: "s12-label-and" }, APP_DATA.step12.labelAnd),
        React.createElement("div", { className: "s12-box-mm" }, mmVal),
        React.createElement("span", { className: "s12-label-mm" }, APP_DATA.step12.labelMm),
      ),
      // Fixed 130% Ruler Wrapper
      React.createElement(
        "div",
        { className: "s12-ruler-wrap" },
        React.createElement("img", {
          src: "assets/ruler.svg",
          alt: "",
          className: "s12-ruler-img",
          ref: s12RulerRef,
          draggable: false,
        }),
        React.createElement(
          "div",
          { className: "s12-annotation-layer" },
          // The horizontal marker connecting 0 to Draggable Dot
          React.createElement("div", {
            className: "s12-horiz-line",
            style: { left: lineLeft + "%", width: lineWidth + "%" },
          }),
          // Permanent 0 position green dot
          React.createElement("div", {
            className: "s12-zero-dot",
            style: { left: mmPosPercent(0) + "%" },
          }),
          // Vertical dotted dashed line dropping down slider
          React.createElement("div", {
            className: "s12-vert-dash",
            style: { left: mmPosPercent(s12CurrentMm) + "%" },
          }),
          // Drag Interaction Slider Dot Target
          React.createElement("div", {
            className: "s12-slider-dot",
            style: { left: mmPosPercent(s12CurrentMm) + "%" },
            onPointerDown: handleS12PointerDown,
            onPointerMove: handleS12PointerMove,
            onPointerUp: handleS12PointerUp,
            onPointerCancel: handleS12PointerUp,
          }),
        ),
      ),
    );
  }

  // ---- STEP 13, 14, 15, 16: Measuring with the ruler ----
  if (step === 13 || step === 14 || step === 15 || step === 16) {
    const SVG_WIDTH = 405;
    const CM_0_CENTER = 8.95;
    const CM_STEP = 19;
    
    const isPencil = step === 13 || step === 14;
    const isAnimStep = step === 14 || step === 16;
    
    const mmLength = isPencil ? 135 : 45;
    const imagePaddingOffsetLeft = isPencil ? 0.5 : 0; 
    const offsetWidthFactor = isPencil ? 135 : 45; // Added slight matching tweak to bounds
    const cmBox = isPencil ? "13" : "4";
    const mmBox = "5"; // Shared

    // Step 14 / 16 target calculations relative to container bounds
    const rulerLeftVw = 1;
    const rulerWidthVw = 130;
    
    // Tool width relative to container width
    const toolWidthVw = rulerWidthVw * ((offsetWidthFactor * (CM_STEP / 10)) / SVG_WIDTH); 
    
    // Left edge alignment exactly over the 0 hash mark mapping
    const targetLeftVw = rulerLeftVw + rulerWidthVw * (CM_0_CENTER / SVG_WIDTH) - imagePaddingOffsetLeft;

    const isPlaced = isPencil ? s14Placed : s16Placed;
    const measurementRevealed = isPencil ? s14MeasurementRevealed : s16MeasurementRevealed;
    const animDone = isPencil ? s14AnimDone : s16AnimDone;
    const clickHandlerInitial = isPencil ? handleS13PencilClick : handleS15EraserClick;
    const clickHandlerFinal = isPencil ? handleS14PencilClick : handleS16EraserClick;
    const imgSrc = isPencil ? "assets/pencil.png" : "assets/eraser1.png";
    const imgId = isAnimStep && animDone && !measurementRevealed ? (step === 14 ? "s14-pencil" : "s16-eraser") : (step === 13 ? "s13-pencil" : step === 15 ? "s15-eraser" : undefined);

    const activeTopCalc = isPencil ? "calc(100% - 30vw)" : "calc(100% - 34vw)"; // Eraser rests slightly lower because thickness

    const toolStyle = {
      width: toolWidthVw + "vw",
      top: isAnimStep && isPlaced ? activeTopCalc : "2vw",
      left: isAnimStep && isPlaced ? targetLeftVw + "vw" : "50%",
      transform: isAnimStep && isPlaced ? "translateX(0)" : "translateX(-50%)",
      pointerEvents: "auto",
    };

    return React.createElement(
      "div",
      { className: "main-canvas-container measure-main-canvas s13-14-container", ref: canvasRef },
      
      isAnimStep && measurementRevealed && React.createElement(
        "div",
        { className: "s12-mes-text s14-mes-text-override" },
        React.createElement("div", { className: "s12-box-cm" }, cmBox),
        React.createElement("span", { className: "s12-label-cm" }, APP_DATA.step12.labelCm),
        React.createElement("span", { className: "s12-label-and" }, APP_DATA.step12.labelAnd),
        React.createElement("div", { className: "s12-box-mm" }, mmBox),
        React.createElement("span", { className: "s12-label-mm" }, APP_DATA.step12.labelMm)
      ),

      React.createElement(
        "div",
        { className: "s13-14-ruler-wrap" },
        React.createElement("img", {
          src: "assets/ruler.svg",
          alt: "",
          className: "s13-14-ruler-img",
          draggable: false
        }),
        
        isAnimStep && isPlaced && React.createElement(
          "div",
          { className: "s14-dashed-lines" },
          React.createElement("div", {
            className: "s14-dashed-line",
            // Relative back to ruler % bounds inside ruler-wrap
            style: { left: (CM_0_CENTER / SVG_WIDTH) * 100 + "%" } 
          }),
          React.createElement("div", {
            className: "s14-dashed-line",
            style: { left: ((CM_0_CENTER + mmLength * (CM_STEP / 10)) / SVG_WIDTH) * 100 + "%" }
          })
        )
      ),

      React.createElement("img", {
        src: imgSrc,
        id: imgId,
        className: "s13-14-pencil" + ((isAnimStep && animDone && !measurementRevealed) || step === 13 || step === 15 ? " measure-pencil-clickable" : ""),
        style: toolStyle,
        onClick: isAnimStep ? clickHandlerFinal : clickHandlerInitial,
        draggable: false
      })
    );
  }

  // ---- STEP 6: compare image ----
  if (step === 6) {
    return React.createElement(
      "div",
      {
        className: "main-canvas-container measure-main-canvas",
        ref: canvasRef,
      },
      React.createElement("img", {
        src: "assets/compare.png",
        alt: "",
        className: "s6-compare-img",
      }),
    );
  }

  // ---- STEP 5: 3-column layout ----
  if (step === 5) {
    const step5Data = APP_DATA.step5;
    const pencilWidth = "100%";

    // Build Farhan column
    const farhanCol = React.createElement(
      "div",
      { className: "s5-column s5-farhan-col", id: "s5-farhan-col" },
      // Eraser count label top
      React.createElement("div", {
        className: "s5-eraser-count-top s5-eraser-count-farhan",
        dangerouslySetInnerHTML: { __html: step5Data.farhanLabel },
      }),
      // Pencil + erasers container
      React.createElement(
        "div",
        { className: "s5-measure-area" },
        // Dashed lines (for option 0 feedback)
        React.createElement("div", {
          className: "s5-dashed-line s5-dashed-left",
        }),
        React.createElement("div", {
          className: "s5-dashed-line s5-dashed-right",
        }),
        // Pencil
        React.createElement("img", {
          id: "s5-farhan-pencil",
          src: "assets/pencil.png",
          alt: "",
          className: "s5-pencil",
        }),
        // Erasers row (3 erasers)
        React.createElement(
          "div",
          { className: "s5-erasers-row s5-erasers-row-3" },
          Array.from({ length: 3 }, (_, i) =>
            React.createElement(
              "div",
              { key: i, className: "s5-eraser-slot" },
              React.createElement("img", {
                src: "assets/eraser1.png",
                alt: "",
              }),
            ),
          ),
        ),
      ),
      // Character
      React.createElement("img", {
        src: "assets/farhanStand.png",
        alt: "",
        className: "s5-character",
      }),
    );

    // Build Aisha column
    const aishaCol = React.createElement(
      "div",
      { className: "s5-column s5-aisha-col", id: "s5-aisha-col" },
      // Eraser count label top
      React.createElement("div", {
        className: "s5-eraser-count-top s5-eraser-count-aisha",
        dangerouslySetInnerHTML: { __html: step5Data.aishaLabel },
      }),
      // Pencil + erasers container
      React.createElement(
        "div",
        { className: "s5-measure-area" },
        // Dashed lines (for option 0 feedback)
        React.createElement("div", {
          className: "s5-dashed-line s5-dashed-left",
        }),
        React.createElement("div", {
          className: "s5-dashed-line s5-dashed-right",
        }),
        // Pencil
        React.createElement("img", {
          id: "s5-aisha-pencil",
          src: "assets/pencil.png",
          alt: "",
          className: "s5-pencil",
        }),
        // Erasers row (4 erasers)
        React.createElement(
          "div",
          { className: "s5-erasers-row s5-erasers-row-4" },
          Array.from({ length: 4 }, (_, i) =>
            React.createElement(
              "div",
              { key: i, className: "s5-eraser-slot" },
              React.createElement("img", {
                src: "assets/eraser2.png",
                alt: "",
              }),
            ),
          ),
        ),
      ),
      // Character
      React.createElement("img", {
        src: "assets/aishaStand.png",
        alt: "",
        className: "s5-character",
      }),
    );

    // MCQ panel
    const mcqCol = React.createElement(
      "div",
      { className: "s5-mcq-col" },
      React.createElement(MCQPanel, {
        mcqData: {
          options: step5Data.options,
          feedbacks: step5Data.feedbacks,
        },
        selectedOption: selectedOption,
        isCorrect: isCorrect,
        showFeedback: showFeedback,
        feedbackOverride: feedbackText,
        onOptionClick: handleStep5OptionClick,
      }),
    );

    return React.createElement(
      "div",
      {
        className: "main-canvas-container measure-main-canvas s5-container",
        ref: canvasRef,
      },
      farhanCol,
      aishaCol,
      mcqCol,
    );
  }

  // Steps 1-4 (existing)
  if (step !== 1 && step !== 2 && step !== 3 && step !== 4) {
    return React.createElement("div", {
      className: "main-canvas-container measure-main-canvas",
      ref: canvasRef,
    });
  }

  const pencilClickable = (step === 2 || step === 4) && !answerRevealed;
  const handEraserClass =
    "measure-hand-eraser " +
    (isFarhan ? "measure-hand-eraser-farhan" : "measure-hand-eraser-aisha");
  const cloneClass =
    "measure-eraser-clone " +
    (isFarhan ? "measure-eraser-clone-farhan" : "measure-eraser-clone-aisha");
  const erasersRowClass =
    "measure-erasers-row " +
    (eraserCount === 3 ? "measure-erasers-row-3" : "measure-erasers-row-4");

  return React.createElement(
    "div",
    {
      className: "main-canvas-container measure-main-canvas",
      ref: canvasRef,
    },
    React.createElement(
      "div",
      { className: "measure-canvas-inner" },
      React.createElement("img", {
        ref: pencilRef,
        id: "measure-pencil",
        src: "assets/pencil.png",
        alt: "",
        className:
          "measure-pencil" +
          (pencilClickable ? " measure-pencil-clickable" : ""),
        onClick: pencilClickable ? handlePencilClick : undefined,
      }),
    ),
    eraserCountTopVisible &&
      React.createElement("div", {
        id: "eraser-count-top",
        className:
          "measure-eraser-count-top" +
          (step === 4 ? " measure-eraser-count-top-aisha" : ""),
        dangerouslySetInnerHTML: { __html: stepData.eraserCountTop },
      }),
    React.createElement("img", {
      src: characterImg,
      alt: "",
      className: "measure-character",
    }),
    handEraserVisible &&
      React.createElement("img", {
        id: step === 1 ? "hand-eraser" : "hand-eraser-aisha",
        src: eraserImg,
        alt: "",
        className: handEraserClass,
        onClick: handleHandEraserClick,
      }),
    clonePosition !== null &&
      React.createElement("img", {
        id: "eraser-clone",
        src: eraserImg,
        alt: "",
        className: cloneClass,
        style: {
          left: clonePosition.x,
          top: clonePosition.y,
        },
      }),
    React.createElement(
      "div",
      { className: erasersRowClass },
      Array.from({ length: eraserCount }, (_, i) =>
        React.createElement(
          "div",
          {
            key: i,
            ref: i === 0 ? firstSlotRef : undefined,
            className: "measure-eraser-slot",
            style: {
              opacity: erasersBelowVisible[i] ? 1 : 0,
              visibility: erasersBelowVisible[i] ? "visible" : "hidden",
            },
          },
          erasersBelowVisible[i] &&
            React.createElement("img", {
              src: eraserImg,
              alt: "",
            }),
          (step === 2 || step === 4) &&
            countLabelsVisible[i] &&
            React.createElement(
              "div",
              { className: "measure-count-label" },
              i + 1,
            ),
        ),
      ),
    ),
  );
};
