const MainCanvas = (props) => {
  const {
    step,
    startAtFinal,
    onSetNextEnabled,
    onUpdateNavText,
    onUpdateQuestionText,
  } = props;
  const { useState, useEffect, useRef, useCallback } = React;
  const e = React.createElement;

  // ---------- STATE ----------
  const [phase, setPhase] = useState("initial");
  const [numpadVisible, setNumpadVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [boxState, setBoxState] = useState("default");
  const [nBoxState, setNBoxState] = useState("var");
  const [nValue, setNValue] = useState(null);
  const [activeVarIndex, setActiveVarIndex] = useState(null);
  const [filledVars, setFilledVars] = useState([null, null, null, null, null]);
  const [barValueBoxes, setBarValueBoxes] = useState([null, null, null, null, null]);
  const [highlightBarIndex, setHighlightBarIndex] = useState(null);
  const [lowOpacityAll, setLowOpacityAll] = useState(false);
  const [highlightXLabels, setHighlightXLabels] = useState(false);
  const [feedbackText, setFeedbackText] = useState(null);
  const [wrongLineY, setWrongLineY] = useState(null);
  const [showCorrectLine, setShowCorrectLine] = useState(false);
  const [revealPhase, setRevealPhase] = useState("none");
  const [flyAnimating, setFlyAnimating] = useState(false);
  const [sumRevealText, setSumRevealText] = useState("");
  const [meanRevealStage, setMeanRevealStage] = useState("");
  const [revealBlinking, setRevealBlinking] = useState(false);
  const [varNudgesDismissed, setVarNudgesDismissed] = useState(false);
  const [animNavHidden, setAnimNavHidden] = useState(false);
  const [lastCorrectIndex, setLastCorrectIndex] = useState(null);
  const [meanGraphPhase, setMeanGraphPhase] = useState("hidden");
  const [meanDrawProgress, setMeanDrawProgress] = useState(0);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [dayAnswer, setDayAnswer] = useState(null);
  const [reasonAnswer, setReasonAnswer] = useState(null);
  const [dropdownWrongKey, setDropdownWrongKey] = useState(null);

  const animTimerRef = useRef(null);
  const meanDrawTweenRef = useRef(null);
  const meanResultRef = useRef(null);
  const meanLabelRef = useRef(null);
  const dayDropdownRef = useRef(null);
  const reasonDropdownRef = useRef(null);
  const nVarRef = useRef(null);
  const varRef0 = useRef(null);
  const varRef1 = useRef(null);
  const varRef2 = useRef(null);
  const varRef3 = useRef(null);
  const varRef4 = useRef(null);
  const varRefList = [varRef0, varRef1, varRef2, varRef3, varRef4];
  const sumNumRefs = useRef([null, null, null, null, null]);
  const revealSumRef = useRef(null);
  const revealMeanRef = useRef(null);
  const eq2FractionRef = useRef(null);
  const step3Data = APP_DATA.steps[3];
  const step2Data = APP_DATA.steps[2];
  const step4Data = APP_DATA.steps[4];
  const step5Data = APP_DATA.steps[5];
  const step6Data = APP_DATA.steps[6];
  const answers = step3Data.answers;
  const days = step3Data.days;

  function renderXBar() {
    return e(
      "span",
      { className: "x-bar-char" },
      e("span", { className: "x-bar-line" }),
      "x"
    );
  }

  function flyFractionToTarget(sourceEl, targetEl, onDone) {
    if (!sourceEl || !targetEl) {
      if (onDone) onDone();
      return;
    }
    var sRect = sourceEl.getBoundingClientRect();
    var tRect = targetEl.getBoundingClientRect();
    var clone = sourceEl.cloneNode(true);
    clone.className = (clone.className + " fly-fraction-clone").trim();
    document.body.appendChild(clone);

    var rowStyle = window.getComputedStyle(sourceEl.closest(".formula-row") || sourceEl.parentElement);
    clone.style.fontSize = rowStyle.fontSize;

    gsap.set(clone, {
      position: "fixed",
      left: sRect.left,
      top: sRect.top,
      width: sRect.width,
      height: sRect.height,
      margin: 0,
      zIndex: 10060,
      boxSizing: "border-box",
    });
    gsap.to(clone, {
      left: tRect.left + tRect.width / 2,
      top: tRect.top + tRect.height / 2,
      xPercent: -50,
      yPercent: -50,
      duration: 0.6,
      ease: "power2.inOut",
      onComplete: function () {
        if (clone.parentNode) clone.parentNode.removeChild(clone);
        if (onDone) onDone();
      },
    });
  }

  function flyDigitToTarget(sourceEl, targetEl, value, onDone) {
    if (!sourceEl || !targetEl) {
      if (onDone) onDone();
      return;
    }
    var sRect = sourceEl.getBoundingClientRect();
    var tRect = targetEl.getBoundingClientRect();
    var clone = document.createElement("span");
    clone.className = "fly-num-clone";
    clone.textContent = String(value);
    document.body.appendChild(clone);
    clone.style.fontSize = window.getComputedStyle(sourceEl).fontSize;
    clone.style.fontWeight = "700";
    clone.style.color = "#ffffff";
    gsap.set(clone, {
      position: "fixed",
      left: sRect.left + sRect.width / 2,
      top: sRect.top + sRect.height / 2,
      xPercent: -50,
      yPercent: -50,
      zIndex: 10060,
    });
    gsap.to(clone, {
      left: tRect.left + tRect.width / 2,
      top: tRect.top + tRect.height / 2,
      duration: 0.55,
      ease: "power2.inOut",
      onComplete: function () {
        if (clone.parentNode) clone.parentNode.removeChild(clone);
        if (onDone) onDone();
      },
    });
  }

  function setVarBoxRef(idx) {
    return function (el) {
      varRefList[idx].current = el;
    };
  }

  function setSumNumRef(idx) {
    return function (el) {
      sumNumRefs.current[idx] = el;
    };
  }

  // ---------- STEP FINAL STATE (prev navigation / catch-up) ----------
  function applyStepFinalState(stepNum) {
    setNumpadVisible(false);
    setInputValue("");
    setBoxState("default");
    setHighlightBarIndex(null);
    setLowOpacityAll(false);
    setHighlightXLabels(false);
    setFeedbackText(null);
    setWrongLineY(null);
    setShowCorrectLine(false);
    setFlyAnimating(false);
    setAnimNavHidden(false);
    setVarNudgesDismissed(true);
    setSumRevealText("32");
    setMeanRevealStage("result");
    setRevealBlinking(false);

    var finalContent = getStepFinalContent(stepNum);
    onUpdateQuestionText(finalContent.questionText);
    onUpdateNavText(finalContent.navText);

    if (stepNum === 1) {
      onSetNextEnabled(true);
    } else if (stepNum === 2) {
      setNBoxState("filled");
      setNValue(5);
      setPhase("done");
      onSetNextEnabled(true);
    } else if (stepNum === 3) {
      setFilledVars([4, 5, 6, 7, 10]);
      setBarValueBoxes([4, 5, 6, 7, 10]);
      setActiveVarIndex(null);
      setPhase("allFilled");
      onSetNextEnabled(true);
    } else if (stepNum === 4) {
      setRevealPhase("done");
      onSetNextEnabled(true);
    } else if (stepNum === 5) {
      setMeanGraphPhase("complete");
      setMeanDrawProgress(1);
      onSetNextEnabled(true);
    } else if (stepNum === 6) {
      setOpenDropdownId(null);
      setDayAnswer(step6Data.correctDay);
      setReasonAnswer(step6Data.correctReason);
      setDropdownWrongKey(null);
      onSetNextEnabled(true);
    }
  }

  function applyStepInitialState(stepNum) {
    setNumpadVisible(false);
    setInputValue("");
    setBoxState("default");
    setHighlightBarIndex(null);
    setLowOpacityAll(false);
    setHighlightXLabels(false);
    setFeedbackText(null);
    setWrongLineY(null);
    setShowCorrectLine(false);
    setFlyAnimating(false);
    setAnimNavHidden(false);
    setVarNudgesDismissed(false);
    setSumRevealText("");
    setMeanRevealStage("");
    setRevealBlinking(false);
    setOpenDropdownId(null);
    setDropdownWrongKey(null);

    if (stepNum === 1) {
      onSetNextEnabled(true);
    } else if (stepNum === 2) {
      setNBoxState("var");
      setNValue(null);
      setPhase("initial");
      onSetNextEnabled(false);
    } else if (stepNum === 3) {
      setFilledVars([null, null, null, null, null]);
      setBarValueBoxes([null, null, null, null, null]);
      setActiveVarIndex(null);
      setPhase("initial");
      onSetNextEnabled(false);
    } else if (stepNum === 4) {
      setRevealPhase("none");
      onSetNextEnabled(false);
    } else if (stepNum === 5) {
      setMeanGraphPhase("hidden");
      setMeanDrawProgress(0);
      onSetNextEnabled(false);
    } else if (stepNum === 6) {
      setDayAnswer(null);
      setReasonAnswer(null);
      onSetNextEnabled(false);
    }
  }

  // ---------- STEP INIT ----------
  useEffect(function () {
    if (startAtFinal) {
      applyStepFinalState(step);
      return;
    }
    applyStepInitialState(step);
  }, [step, startAtFinal]);

  // ---------- STEP 5: MEAN LINE ANIMATION ----------
  useEffect(function () {
    if (step !== 5 || startAtFinal) return;

    setMeanGraphPhase("hidden");
    setMeanDrawProgress(0);
    setAnimNavHidden(true);
    onUpdateNavText(" ");
    onSetNextEnabled(false);

    var startTimer = setTimeout(function () {
      var sourceEl = meanResultRef.current;
      var targetEl = meanLabelRef.current;

      setMeanGraphPhase("flying");
      flyDigitToTarget(sourceEl, targetEl, "6.4", function () {
        setMeanGraphPhase("drawing");
        setMeanDrawProgress(0);

        if (meanDrawTweenRef.current) meanDrawTweenRef.current.kill();
        var tweenState = { p: 0 };
        meanDrawTweenRef.current = gsap.to(tweenState, {
          p: 1,
          duration: 0.75,
          ease: "power2.out",
          onUpdate: function () {
            setMeanDrawProgress(tweenState.p);
          },
          onComplete: function () {
            setMeanGraphPhase("complete");
            setMeanDrawProgress(1);
            setAnimNavHidden(false);
            onUpdateNavText(step5Data.navText);
            onSetNextEnabled(true);
          },
        });
      });
    }, 500);

    return function () {
      clearTimeout(startTimer);
      if (meanDrawTweenRef.current) meanDrawTweenRef.current.kill();
    };
  }, [step, startAtFinal]);

  // ---------- NUMPAD HANDLERS ----------
  function handleNumberClick(num) {
    if (boxState === "wrong") {
      setBoxState("default");
      setInputValue(num);
    } else {
      setInputValue(function (prev) {
        return prev + num;
      });
    }
  }

  function handleClear() {
    setInputValue("");
  }

  function handleSubmit() {
    if (!inputValue) return;
    var val = parseFloat(inputValue);

    if (step === 2) {
      checkNAnswer(val);
    } else if (step === 3 && activeVarIndex !== null) {
      checkVarAnswer(val, activeVarIndex);
    }
  }

  // ---------- STEP 2: CHECK N ----------
  function checkNAnswer(val) {
    if (val === step2Data.correctAnswer) {
      playSound("correct");
      setBoxState("correct");
      setHighlightXLabels(false);
      setLowOpacityAll(false);
      setFeedbackText(null);
      setNumpadVisible(false);

      setTimeout(function () {
        setNBoxState("filled");
        setNValue(5);
        setBoxState("default");
        setPhase("done");
        onUpdateQuestionText(step2Data.questionAfterCorrect);
        onUpdateNavText(step2Data.navAfterCorrect);
        onSetNextEnabled(true);
      }, 1200);
    } else {
      playSound("wrong");
      setBoxState("wrong");
      setLowOpacityAll(true);
      setHighlightXLabels(true);
      setFeedbackText(step2Data.feedbackWrong);
    }
  }

  // ---------- STEP 3: CHECK VAR ----------
  function checkVarAnswer(val, idx) {
    var correctVal = answers[idx];
    if (val === correctVal) {
      playSound("correct");
      setBoxState("correct");
      setWrongLineY(null);
      setFeedbackText(null);
      setShowCorrectLine(true);
      setNumpadVisible(false);

      setTimeout(function () {
        setBoxState("default");
        setShowCorrectLine(false);

        var newFilled = filledVars.slice();
        newFilled[idx] = correctVal;
        setFilledVars(newFilled);

        var newBoxes = barValueBoxes.slice();
        newBoxes[idx] = correctVal;
        setBarValueBoxes(newBoxes);

        setHighlightBarIndex(null);
        setLowOpacityAll(false);
        setActiveVarIndex(null);
        setLastCorrectIndex(idx);

        var allDone = newFilled.every(function (v) {
          return v !== null;
        });

        if (allDone) {
          setPhase("allFilled");
          onUpdateQuestionText(step3Data.questionAllFilled);
          onUpdateNavText(step3Data.navAllFilled);
          onSetNextEnabled(true);
        } else {
          var qText = step3Data.questionAfterOneCorrect
            .replace("INDEX", String(idx + 1))
            .replace("VALUE", String(correctVal));
          onUpdateQuestionText(qText);
          onUpdateNavText(step3Data.navAfterOneCorrect);
          setPhase("waitingClick");
        }
      }, 1200);
    } else {
      playSound("wrong");
      setBoxState("wrong");
      setWrongLineY(val);
      var dayName = days[idx];
      setFeedbackText(step3Data.feedbackWrong.replace("DAY", dayName));
    }
  }

  // ---------- STEP 2: TAP N ----------
  function handleTapN() {
    if (phase !== "initial" || nBoxState !== "var") return;
    setNBoxState("empty");
    setNumpadVisible(true);
    setInputValue("");
    setBoxState("default");
    setPhase("solving");
    onUpdateNavText(step2Data.navTextAfterTap);
  }
  function handleTapVar(idx) {
    if (filledVars[idx] !== null) return;
    if (boxState === "correct") return;
    if (activeVarIndex !== null && boxState === "wrong") return;
    if (flyAnimating) return;

    setVarNudgesDismissed(true);
    setActiveVarIndex(idx);
    setInputValue("");
    setBoxState("default");
    setNumpadVisible(true);
    setHighlightBarIndex(idx);
    setLowOpacityAll(true);
    setWrongLineY(null);
    setFeedbackText(null);
    setShowCorrectLine(false);

    var dayName = days[idx];
    var qText = step3Data.questionOnTap
      .replace("INDEX", String(idx + 1))
      .replace("DAY", dayName);
    onUpdateQuestionText(qText);
    var nText = step3Data.navTextAfterTap.replace("INDEX", String(idx + 1));
    onUpdateNavText(nText);
    setPhase("solvingVar");
  }

  // ---------- STEP 4: REVEAL SUM ----------
  function handleRevealSum() {
    if (flyAnimating) return;
    setFlyAnimating(true);
    setRevealPhase("sum-animating");
    setAnimNavHidden(true);
    onUpdateNavText(" ");

    var values = [4, 5, 6, 7, 10];
    var runningSum = 0;
    var idx = 0;

    function processNext() {
      if (idx >= values.length) {
        setTimeout(function () {
          setFlyAnimating(false);
          setRevealPhase("sum-done");
          setSumRevealText("32");
          setAnimNavHidden(false);
          onUpdateQuestionText(step4Data.questionAfterSum);
          onUpdateNavText(step4Data.navAfterSum);
        }, 1000);
        return;
      }

      var val = values[idx];
      var sourceEl = sumNumRefs.current[idx];
      var targetEl = revealSumRef.current;

      flyDigitToTarget(sourceEl, targetEl, val, function () {
        if (idx === 0) {
          runningSum = val;
          setSumRevealText(String(val));
          idx++;
          setTimeout(processNext, 400);
        } else {
          setSumRevealText(runningSum + " + " + val);
          setRevealBlinking(true);
          setTimeout(function () {
            runningSum += val;
            setSumRevealText(String(runningSum));
            setRevealBlinking(false);
            idx++;
            setTimeout(processNext, 400);
          }, 500);
        }
      });
    }

    setTimeout(processNext, 300);
  }

  // ---------- STEP 4: REVEAL MEAN ----------
  function handleRevealMean() {
    if (flyAnimating) return;
    setFlyAnimating(true);
    setRevealPhase("mean-animating");
    setMeanRevealStage("");
    setAnimNavHidden(true);
    onUpdateNavText(" ");

    setTimeout(function () {
      var fractionEl = eq2FractionRef.current;
      var targetEl = revealMeanRef.current;

      flyFractionToTarget(fractionEl, targetEl, function () {
        setMeanRevealStage("fraction");
        setRevealBlinking(true);
        setTimeout(function () {
          setMeanRevealStage("result");
          setRevealBlinking(false);
          setTimeout(function () {
            setFlyAnimating(false);
            setRevealPhase("done");
            setAnimNavHidden(false);
            onUpdateQuestionText(step4Data.questionFinal);
            onUpdateNavText(step4Data.navFinal);
            onSetNextEnabled(true);
          }, 1000);
        }, 700);
      });
    }, 150);
  }

  // ---------- RENDER FORMULA (step 1) ----------
  function renderFormulaStep1() {
    return e(
      "div",
      { className: "formula-container" },
      e(
        "div",
        { className: "formula-row" },
        e("span", { className: "var-box mean-box" }, renderXBar()),
        e("span", { className: "formula-equals" }, "="),
        e(
          "div",
          { className: "fraction" },
          e(
            "div",
            { className: "fraction-num" },
            e("span", { className: "var-box" }, e("span", null, "x", e("sub", null, "1"))),
            e("span", { className: "formula-op" }, "+"),
            e("span", { className: "var-box" }, e("span", null, "x", e("sub", null, "2"))),
            e("span", { className: "formula-op" }, "+"),
            e("span", { className: "var-box" }, e("span", null, "x", e("sub", null, "3"))),
            e("span", { className: "formula-op" }, "+"),
            e("span", { className: "formula-dots" }, "..."),
            e("span", { className: "formula-op" }, "+"),
            e("span", { className: "var-box" }, e("span", null, "x", e("sub", null, "n")))
          ),
          e("div", { className: "fraction-line" }),
          e(
            "div",
            { className: "fraction-den" },
            e("span", { className: "var-box" }, "n")
          )
        )
      )
    );
  }

  // ---------- RENDER FORMULA (step 2) ----------
  function renderFormulaStep2() {
    var nContent;
    if (nBoxState === "var") {
      nContent = e(
        "span",
        {
          ref: nVarRef,
          className: "var-box var-box-clickable",
          onClick: handleTapN,
        },
        "n"
      );
    } else if (nBoxState === "empty") {
      var emptyClass = "empty-box";
      if (boxState === "wrong") emptyClass += " empty-box-wrong shake";
      else if (boxState === "correct") emptyClass += " empty-box-correct";
      nContent = e(
        "span",
        { className: emptyClass },
        inputValue || "?"
      );
    } else {
      nContent = e("span", { className: "var-filled" }, "5");
    }

    return e(
      "div",
      { className: "formula-container" },
      e(
        "div",
        { className: "formula-row" },
        e("span", { className: "var-box mean-box" }, renderXBar()),
        e("span", { className: "formula-equals" }, "="),
        e(
          "div",
          { className: "fraction" },
          e(
            "div",
            { className: "fraction-num" },
            e("span", { className: "var-box" }, e("span", null, "x", e("sub", null, "1"))),
            e("span", { className: "formula-op" }, "+"),
            e("span", { className: "var-box" }, e("span", null, "x", e("sub", null, "2"))),
            e("span", { className: "formula-op" }, "+"),
            e("span", { className: "var-box" }, e("span", null, "x", e("sub", null, "3"))),
            e("span", { className: "formula-op" }, "+"),
            e("span", { className: "formula-dots" }, "..."),
            e("span", { className: "formula-op" }, "+"),
            e("span", { className: "var-box" }, e("span", null, "x", e("sub", null, "n")))
          ),
          e("div", { className: "fraction-line" }),
          e("div", { className: "fraction-den" }, nContent)
        )
      )
    );
  }

  // ---------- RENDER FORMULA (step 3) ----------
  function renderFormulaStep3() {
    var numItems = [];
    for (var i = 0; i < 5; i++) {
      if (i > 0) numItems.push(e("span", { key: "op" + i, className: "formula-op" }, "+"));

      if (filledVars[i] !== null) {
        numItems.push(
          e("span", { key: "v" + i, className: "var-filled-num" }, String(filledVars[i]))
        );
      } else if (activeVarIndex === i) {
        var emptyClass = "empty-box";
        if (boxState === "wrong") emptyClass += " empty-box-wrong shake";
        else if (boxState === "correct") emptyClass += " empty-box-correct";
        numItems.push(
          e("span", { key: "v" + i, className: emptyClass }, inputValue || "?")
        );
      } else {
        numItems.push(
          e(
            "span",
            {
              key: "v" + i,
              ref: setVarBoxRef(i),
              className: "var-box var-box-clickable",
              onClick: function (idx) {
                return function () { handleTapVar(idx); };
              }(i),
            },
            e("span", null, "x", e("sub", null, String(i + 1)))
          )
        );
      }
    }

    return e(
      "div",
      { className: "formula-container" },
      e(
        "div",
        { className: "formula-row" },
        e("span", { className: "var-box mean-box" }, renderXBar()),
        e("span", { className: "formula-equals" }, "="),
        e(
          "div",
          { className: "fraction" },
          e("div", { className: "fraction-num" }, numItems),
          e("div", { className: "fraction-line" }),
          e("div", { className: "fraction-den" }, e("span", { className: "var-filled" }, "5"))
        )
      )
    );
  }

  // ---------- RENDER FORMULA (step 4) ----------
  function renderFormulaStep4() {
    var sumValues = [4, 5, 6, 7, 10];
    var sumAnimating = revealPhase === "sum-animating";
    var meanFlying =
      revealPhase === "mean-animating" && meanRevealStage === "";
    var eq1DehClass =
      sumAnimating || meanFlying ? " formula-dehighlight" : "";
    var eqPrefixDehClass = meanFlying ? " formula-dehighlight" : "";

    var eq1NumChildren = [];
    sumValues.forEach(function (val, i) {
      if (i > 0) eq1NumChildren.push(e("span", { key: "op" + i, className: "formula-op" }, " + "));
      eq1NumChildren.push(
        e(
          "span",
          {
            key: "num" + i,
            ref: setSumNumRef(i),
            className: "sum-num-source" + (sumAnimating ? " sum-num-highlight" : ""),
          },
          String(val)
        )
      );
    });

    var eq1Num = e("span", { className: "fraction-num-inner" }, eq1NumChildren);

    var eq1 = e(
      "div",
      { className: "formula-row equation-row eq1-row" + (sumAnimating ? " eq1-sum-animating" : "") },
      e("span", { className: "var-box mean-box" + eq1DehClass }, renderXBar()),
      e("span", { className: "formula-equals" + eq1DehClass }, "="),
      e(
        "div",
        { className: "fraction" },
        e("div", { className: "fraction-num" + (meanFlying ? eq1DehClass : "") }, eq1Num),
        e("div", { className: "fraction-line" + eq1DehClass }),
        e("div", { className: "fraction-den" + eq1DehClass }, "5")
      )
    );

    var eq2 = null;
    if (revealPhase === "none" || revealPhase === "sum-animating") {
      var revealContent;
      if (revealPhase === "sum-animating") {
        revealContent = e(
          "span",
          {
            ref: revealSumRef,
            className: "reveal-target" + (revealBlinking ? " glow-blink" : ""),
          },
          sumRevealText || ""
        );
      } else {
        revealContent = e(
          "span",
          {
            ref: revealSumRef,
            className: "reveal-box",
            onClick: handleRevealSum,
          },
          step4Data.revealText
        );
      }

      eq2 = e(
        "div",
        { className: "formula-row equation-row eq2-row" },
        e("span", { className: "var-box mean-box" + (sumAnimating ? " formula-dehighlight" : "") }, renderXBar()),
        e("span", { className: "formula-equals" + (sumAnimating ? " formula-dehighlight" : "") }, "="),
        e(
          "div",
          { className: "fraction" },
          e("div", { className: "fraction-num" }, revealContent),
          e("div", { className: "fraction-line" + (sumAnimating ? " formula-dehighlight" : "") }),
          e("div", { className: "fraction-den" + (sumAnimating ? " formula-dehighlight" : "") }, "5")
        )
      );
    } else if (revealPhase === "sum-done" || revealPhase === "mean-animating") {
      eq2 = e(
        "div",
        { className: "formula-row equation-row eq2-row" },
        e("span", { className: "var-box mean-box" + eqPrefixDehClass }, renderXBar()),
        e("span", { className: "formula-equals" + eqPrefixDehClass }, "="),
        e(
          "div",
          { ref: eq2FractionRef, className: "fraction" },
          e(
            "div",
            { className: "fraction-num" },
            e("span", { className: "var-filled-num" }, "32")
          ),
          e("div", { className: "fraction-line" }),
          e(
            "div",
            { className: "fraction-den" },
            e("span", { className: "var-filled-num" }, "5")
          )
        )
      );
    }

    var eq3 = null;
    if (revealPhase === "sum-done") {
      eq3 = e(
        "div",
        { className: "formula-row equation-row eq3-row" },
        e("span", { className: "var-box mean-box" }, renderXBar()),
        e("span", { className: "formula-equals" }, "="),
        e(
          "span",
          {
            ref: revealMeanRef,
            className: "reveal-box",
            onClick: handleRevealMean,
          },
          step4Data.revealText
        )
      );
    } else if (revealPhase === "mean-animating") {
      if (meanRevealStage === "result") {
        eq3 = e(
          "div",
          { className: "formula-row equation-row eq3-row" },
          e("span", { className: "var-box mean-box" }, renderXBar()),
          e("span", { className: "formula-equals" }, "="),
          e("span", { className: "mean-result" }, "6.4")
        );
      } else if (meanRevealStage === "fraction") {
        eq3 = e(
          "div",
          { className: "formula-row equation-row eq3-row" },
          e("span", { className: "var-box mean-box" }, renderXBar()),
          e("span", { className: "formula-equals" }, "="),
          e(
            "div",
            {
              className:
                "fraction" + (revealBlinking ? " glow-blink" : ""),
            },
            e(
              "div",
              { className: "fraction-num" },
              e("span", { className: "var-filled-num" }, "32")
            ),
            e("div", { className: "fraction-line" }),
            e(
              "div",
              { className: "fraction-den" },
              e("span", { className: "var-filled-num" }, "5")
            )
          )
        );
      } else {
        eq3 = e(
          "div",
          { className: "formula-row equation-row eq3-row" },
          e("span", { className: "var-box mean-box" + eqPrefixDehClass }, renderXBar()),
          e("span", { className: "formula-equals" + eqPrefixDehClass }, "="),
          e("span", {
            ref: revealMeanRef,
            className:
              "reveal-target reveal-target-fraction" + eqPrefixDehClass,
          })
        );
      }
    } else if (revealPhase === "done") {
      eq2 = e(
        "div",
        { className: "formula-row equation-row eq2-row" },
        e("span", { className: "var-box mean-box" }, renderXBar()),
        e("span", { className: "formula-equals" }, "="),
        e(
          "div",
          { className: "fraction" },
          e("div", { className: "fraction-num" }, e("span", { className: "var-filled-num" }, "32")),
          e("div", { className: "fraction-line" }),
          e("div", { className: "fraction-den" }, "5")
        )
      );
      eq3 = e(
        "div",
        { className: "formula-row equation-row eq3-row" },
        e("span", { className: "var-box mean-box" }, renderXBar()),
        e("span", { className: "formula-equals" }, "="),
        e("span", { className: "mean-result" }, "6.4")
      );
    }

    return e(
      "div",
      { className: "formula-container formula-step4" },
      eq1,
      eq2,
      eq3
    );
  }

  // ---------- STEP 6: DROPDOWNS ----------
  function markDropdownWrong(key) {
    setDropdownWrongKey(key);
    if (typeof playSound === "function") playSound("wrong");
    setTimeout(function () {
      setDropdownWrongKey(null);
    }, 650);
  }

  function checkDropdownsComplete(nextDay, nextReason) {
    if (
      nextDay === step6Data.correctDay &&
      nextReason === step6Data.correctReason
    ) {
      onUpdateNavText(step6Data.navComplete);
      onSetNextEnabled(true);
    }
  }

  function handleDaySelect(value) {
    if (value !== step6Data.correctDay) {
      markDropdownWrong("day-" + value);
      return;
    }
    if (typeof playSound === "function") playSound("correct");
    setDayAnswer(value);
    setOpenDropdownId(null);
    checkDropdownsComplete(value, reasonAnswer);
  }

  function handleReasonSelect(value) {
    if (value !== step6Data.correctReason) {
      markDropdownWrong("reason-" + value);
      return;
    }
    if (typeof playSound === "function") playSound("correct");
    setReasonAnswer(value);
    setOpenDropdownId(null);
    checkDropdownsComplete(dayAnswer, value);
  }

  function toggleDropdown(id) {
    if (typeof playSound === "function") playSound("click");
    setOpenDropdownId(function (prev) {
      return prev === id ? null : id;
    });
  }

  // ---------- RENDER FORMULA COMPLETE (step 4 done / step 5) ----------
  function renderFormulaComplete(useMeanFlyRef) {
    var sumValues = [4, 5, 6, 7, 10];
    var eq1NumChildren = [];
    sumValues.forEach(function (val, i) {
      if (i > 0) {
        eq1NumChildren.push(
          e("span", { key: "op" + i, className: "formula-op" }, " + ")
        );
      }
      eq1NumChildren.push(
        e("span", { key: "num" + i, className: "sum-num-source" }, String(val))
      );
    });

    return e(
      "div",
      { className: "formula-container formula-step4" },
      e(
        "div",
        { className: "formula-row equation-row eq1-row" },
        e("span", { className: "var-box mean-box" }, renderXBar()),
        e("span", { className: "formula-equals" }, "="),
        e(
          "div",
          { className: "fraction" },
          e(
            "div",
            { className: "fraction-num" },
            e("span", { className: "fraction-num-inner" }, eq1NumChildren)
          ),
          e("div", { className: "fraction-line" }),
          e("div", { className: "fraction-den" }, "5")
        )
      ),
      e(
        "div",
        { className: "formula-row equation-row eq2-row" },
        e("span", { className: "var-box mean-box" }, renderXBar()),
        e("span", { className: "formula-equals" }, "="),
        e(
          "div",
          { className: "fraction" },
          e(
            "div",
            { className: "fraction-num" },
            e("span", { className: "var-filled-num" }, "32")
          ),
          e("div", { className: "fraction-line" }),
          e("div", { className: "fraction-den" }, "5")
        )
      ),
      e(
        "div",
        { className: "formula-row equation-row eq3-row" },
        e("span", { className: "var-box mean-box" }, renderXBar()),
        e("span", { className: "formula-equals" }, "="),
        e(
          "span",
          {
            ref: useMeanFlyRef ? meanResultRef : null,
            className: "mean-result",
          },
          "6.4"
        )
      )
    );
  }

  // ---------- RENDER STEP 5 PANEL ----------
  function renderStep5Panel() {
    return e(
      "div",
      { className: "calc-panel step5-panel" },
      e(
        "div",
        { className: "calc-formula-area" },
        renderFormulaComplete(true)
      )
    );
  }

  // ---------- RENDER STEP 6 PANEL ----------
  function renderStep6Panel() {
    return e(
      "div",
      { className: "calc-panel step6-panel" },
      e(
        "div",
        { className: "dropdown-panel" },
        e(
          "div",
          { className: "dropdown-row" },
          e(Dropdown, {
            id: "day",
            theme: "pink",
            placeholder: step6Data.dayPlaceholder,
            value: dayAnswer,
            options: step6Data.dayOptions,
            locked: dayAnswer === step6Data.correctDay,
            isOpen: openDropdownId === "day",
            wrongKey: dropdownWrongKey,
            buttonRef: dayDropdownRef,
            onToggle: toggleDropdown,
            onSelect: handleDaySelect,
          }),
          e(Dropdown, {
            id: "reason",
            theme: "blue",
            placeholder: step6Data.reasonPlaceholder,
            value: reasonAnswer,
            options: step6Data.reasonOptions,
            locked: reasonAnswer === step6Data.correctReason,
            isOpen: openDropdownId === "reason",
            wrongKey: dropdownWrongKey,
            buttonRef: reasonDropdownRef,
            onToggle: toggleDropdown,
            onSelect: handleReasonSelect,
          })
        )
      )
    );
  }

  function renderNudges() {
    var nudges = [];

    if (step === 2 && phase === "initial" && nBoxState === "var" && !startAtFinal) {
      nudges.push(
        e(Nudge, { key: "nudge-n", targetRef: nVarRef, active: true, small: true })
      );
    }

    if (
      step === 3 &&
      !varNudgesDismissed &&
      !startAtFinal &&
      phase === "initial"
    ) {
      for (var i = 0; i < 5; i++) {
        if (filledVars[i] === null) {
          nudges.push(
            e(Nudge, {
              key: "nudge-var-" + i,
              targetRef: varRefList[i],
              active: true,
              small: true,
            })
          );
        }
      }
    }

    if (step === 4 && revealPhase === "none" && !flyAnimating && !startAtFinal) {
      nudges.push(
        e(Nudge, { key: "nudge-reveal-sum", targetRef: revealSumRef, active: true })
      );
    }

    if (step === 4 && revealPhase === "sum-done" && !flyAnimating && !startAtFinal) {
      nudges.push(
        e(Nudge, { key: "nudge-reveal-mean", targetRef: revealMeanRef, active: true })
      );
    }

    return nudges;
  }

  // ---------- RENDER CALC PANEL ----------
  function renderCalcPanel() {
    if (step === 5) return renderStep5Panel();
    if (step === 6) return renderStep6Panel();

    var formulaEl = null;
    if (step === 1) formulaEl = renderFormulaStep1();
    else if (step === 2) formulaEl = renderFormulaStep2();
    else if (step === 3) formulaEl = renderFormulaStep3();
    else if (step === 4) formulaEl = renderFormulaStep4();

    var numpadEl = null;
    if (numpadVisible && (step === 2 || step === 3)) {
      numpadEl = e(
        "div",
        { className: "calc-numpad-wrap" },
        e(Numpad, {
          onNumberClick: handleNumberClick,
          onClear: handleClear,
          onSubmit: handleSubmit,
          disabled: boxState === "correct",
        })
      );
    }

    return e(
      "div",
      { className: "calc-panel" },
      e("div", { className: "calc-formula-area" }, formulaEl),
      numpadEl
    );
  }

  // ---------- BAR GRAPH PROPS ----------
  var graphProps = {
    highlightBarIndex: (step === 3 && activeVarIndex !== null) ? activeVarIndex : null,
    lowOpacityAll: lowOpacityAll,
    highlightXLabels: highlightXLabels,
    feedbackText: feedbackText,
    barValueBoxes: null,
    wrongLineY: wrongLineY,
    showCorrectLine: showCorrectLine,
    meanValue: null,
    meanLineVisible: false,
    meanDrawProgress: 0,
    meanLabelRef: meanLabelRef,
  };

  if (step === 3) {
    graphProps.barValueBoxes = barValueBoxes;
  } else if (step === 4) {
    graphProps.barValueBoxes = [4, 5, 6, 7, 10];
  } else if (step >= 5) {
    graphProps.barValueBoxes = [4, 5, 6, 7, 10];
    graphProps.meanValue = step4Data.meanResult;
    if (step === 5) {
      graphProps.meanLineVisible =
        meanGraphPhase === "drawing" || meanGraphPhase === "complete";
      graphProps.meanDrawProgress = meanDrawProgress;
    } else {
      graphProps.meanLineVisible = true;
      graphProps.meanDrawProgress = 1;
    }
  }

  return e(
    "div",
    { className: "main-canvas-container" },
    e(
      "div",
      { className: "canvas-columns" },
      e(
        "div",
        { className: "canvas-col canvas-col-left" },
        e(BarGraph, graphProps)
      ),
      e(
        "div",
        { className: "canvas-col canvas-col-right" },
        renderCalcPanel()
      )
    ),
    renderNudges()
  );
};
