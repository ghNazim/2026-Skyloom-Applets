const Median = (props) => {
  const {
    step,
    initialStage,
    showNudges,
    onSetNextEnabled,
    onUpdateNavText,
    onUpdateQuestionText,
    onGoToStep,
  } = props;
  const { useEffect, useRef, useState } = React;
  const e = React.createElement;
  const dataset = APP_DATA.dataset;
  const sortedDataset = APP_DATA.sortedDataset;
  const step2 = APP_DATA.steps[2];
  const step3 = APP_DATA.steps[3];
  const step4 = APP_DATA.steps[4];
  const step5 = APP_DATA.steps[5];
  const step6 = APP_DATA.steps[6];
  const step7 = APP_DATA.steps[7];
  const middleLeft = sortedDataset.length / 2 - 1;
  const middleRight = sortedDataset.length / 2;
  const calcCorrectAnswer = (sortedDataset[middleLeft] + sortedDataset[middleRight]) / step7.denominator;

  const [order, setOrder] = useState(step2.initialOrder.slice());
  const [lockedRows, setLockedRows] = useState({});
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [ghostSize, setGhostSize] = useState({ width: 0, height: 0 });
  const [showVerticalDragNudge, setShowVerticalDragNudge] = useState(true);
  const [isStepOneReady, setIsStepOneReady] = useState(false);
  const [sortFilled, setSortFilled] = useState([]);
  const [usedIndexes, setUsedIndexes] = useState({});
  const [activeSlot, setActiveSlot] = useState(0);
  const [cueVisible, setCueVisible] = useState(true);
  const [settlingSlots, setSettlingSlots] = useState({});
  const [wrongSource, setWrongSource] = useState(null);
  const [flyingValue, setFlyingValue] = useState(null);
  const [eliminateLeft, setEliminateLeft] = useState(0);
  const [eliminateRight, setEliminateRight] = useState(sortedDataset.length - 1);
  const [eliminatedSlots, setEliminatedSlots] = useState({});
  const [wrongEliminateSlots, setWrongEliminateSlots] = useState({});
  const [isEliminationDone, setIsEliminationDone] = useState(false);
  const [mcqChoice, setMcqChoice] = useState(null);
  const [mcqFeedback, setMcqFeedback] = useState(null);
  const [numeratorLeft, setNumeratorLeft] = useState(null);
  const [numeratorRight, setNumeratorRight] = useState(null);
  const [showCalcPlus, setShowCalcPlus] = useState(false);
  const [showCalcDenom, setShowCalcDenom] = useState(false);
  const [showCalcEquals, setShowCalcEquals] = useState(false);
  const [showNumpad, setShowNumpad] = useState(false);
  const [flyingCalc, setFlyingCalc] = useState(null);
  const [dimmedMiddleSlots, setDimmedMiddleSlots] = useState({});
  const [calcInput, setCalcInput] = useState("");
  const [calcBoxState, setCalcBoxState] = useState(null);
  const containerRef = useRef(null);
  const sourceRefs = useRef([]);
  const slotRefs = useRef([]);
  const optionRefs = useRef([]);
  const numLeftTargetRef = useRef(null);
  const numRightTargetRef = useRef(null);
  const stepClickNudgeRef = useRef(null);
  const verticalDragNudgeRef = useRef(null);
  const dragAnchorXRef = useRef(0);
  const rowStrideRef = useRef(0);
  const optionHeightRef = useRef(0);
  const [stepClickNudgeDismissed, setStepClickNudgeDismissed] = useState(false);
  const [showDataTeeter, setShowDataTeeter] = useState(true);
  const [showEliminateTeeter, setShowEliminateTeeter] = useState(true);
  const dataInactivityTimerRef = useRef(null);
  const eliminateInactivityTimerRef = useRef(null);

  function resetDataTeeterOnInteraction() {
    setShowDataTeeter(false);
    if (dataInactivityTimerRef.current) clearTimeout(dataInactivityTimerRef.current);
    dataInactivityTimerRef.current = setTimeout(function () {
      setShowDataTeeter(true);
    }, 7000);
  }

  function resetEliminateTeeterOnInteraction() {
    setShowEliminateTeeter(false);
    if (eliminateInactivityTimerRef.current) clearTimeout(eliminateInactivityTimerRef.current);
    eliminateInactivityTimerRef.current = setTimeout(function () {
      setShowEliminateTeeter(true);
    }, 7000);
  }

  function restartEliminateTeeterImmediately() {
    if (eliminateInactivityTimerRef.current) clearTimeout(eliminateInactivityTimerRef.current);
    setShowEliminateTeeter(true);
  }

  function resetCalcState() {
    setNumeratorLeft(null);
    setNumeratorRight(null);
    setShowCalcPlus(false);
    setShowCalcDenom(false);
    setShowCalcEquals(false);
    setShowNumpad(false);
    setFlyingCalc(null);
    setDimmedMiddleSlots({});
    setCalcInput("");
    setCalcBoxState(null);
  }

  function buildEliminatedThroughMiddle() {
    const nextEliminated = {};
    sortedDataset.forEach(function (_, index) {
      if (index < middleLeft || index > middleRight) nextEliminated[index] = true;
    });
    return nextEliminated;
  }

  function restoreFinalStage() {
    if (step === 2) {
      setOrder(step2.correctOrder.slice());
      setLockedRows({});
      setIsStepOneReady(true);
      setShowVerticalDragNudge(false);
      onUpdateQuestionText(step2.completeQuestion);
      onUpdateNavText(step2.completeNav);
      onSetNextEnabled(true);
      return;
    }
    if (step === 3) {
      setSortFilled(sortedDataset.slice());
      const allUsed = {};
      dataset.forEach(function (_, index) { allUsed[index] = true; });
      setUsedIndexes(allUsed);
      setActiveSlot(sortedDataset.length);
      setCueVisible(false);
      setSettlingSlots({});
      setWrongSource(null);
      setFlyingValue(null);
      setShowDataTeeter(false);
      onUpdateQuestionText(step4.questionText);
      onUpdateNavText(step4.navText);
      onSetNextEnabled(true);
      return;
    }
    if (step === 4) {
      setIsStepOneReady(true);
      setSortFilled(sortedDataset.slice());
      onUpdateQuestionText(step4.questionText);
      onUpdateNavText(step4.navText);
      onSetNextEnabled(true);
      return;
    }
    if (step === 5) {
      setEliminateLeft(middleLeft);
      setEliminateRight(middleRight);
      setEliminatedSlots(buildEliminatedThroughMiddle());
      setWrongEliminateSlots({});
      setIsEliminationDone(true);
      setShowEliminateTeeter(false);
      onUpdateQuestionText(step5.completeQuestion);
      onUpdateNavText(step5.completeNav);
      onSetNextEnabled(true);
      return;
    }
    if (step === 6) {
      setEliminateLeft(middleLeft);
      setEliminateRight(middleRight);
      setEliminatedSlots(buildEliminatedThroughMiddle());
      setMcqChoice(step6.correctIndex);
      setMcqFeedback({ type: "correct", text: step6.correctFeedback });
      onUpdateQuestionText(step6.questionText);
      onUpdateNavText(step6.completeNav);
      onSetNextEnabled(true);
      return;
    }
    if (step === 7) {
      setEliminatedSlots(buildEliminatedThroughMiddle());
      setNumeratorLeft(sortedDataset[middleLeft]);
      setNumeratorRight(sortedDataset[middleRight]);
      setShowCalcPlus(true);
      setShowCalcDenom(true);
      setShowCalcEquals(true);
      setShowNumpad(false);
      setFlyingCalc(null);
      const nextDimmed = {};
      nextDimmed[middleLeft] = true;
      nextDimmed[middleRight] = true;
      setDimmedMiddleSlots(nextDimmed);
      setCalcInput(String(calcCorrectAnswer));
      setCalcBoxState("correct");
      onUpdateQuestionText(step7.completeQuestion);
      onUpdateNavText(step7.completeNav);
      onSetNextEnabled(true);
    }
  }

  useEffect(function () {
    if (initialStage === "final") {
      restoreFinalStage();
      return;
    }
    if (step === 2) {
      onSetNextEnabled(false);
      onUpdateQuestionText(APP_DATA.steps[2].questionText);
      onUpdateNavText(APP_DATA.steps[2].navText);
      setShowVerticalDragNudge(true);
    }
    if (step === 3) {
      onSetNextEnabled(false);
      onUpdateQuestionText(APP_DATA.steps[3].questionText);
      onUpdateNavText(APP_DATA.steps[3].navText);
      setSortFilled([]);
      setUsedIndexes({});
      setActiveSlot(0);
      setCueVisible(true);
      setSettlingSlots({});
      setWrongSource(null);
      setFlyingValue(null);
      setShowDataTeeter(true);
      if (dataInactivityTimerRef.current) clearTimeout(dataInactivityTimerRef.current);
    }
    if (step === 4) {
      onSetNextEnabled(false);
      onUpdateQuestionText(APP_DATA.steps[4].questionText);
      onUpdateNavText(APP_DATA.steps[4].navText);
      setIsStepOneReady(true);
    }
    if (step === 5) {
      onSetNextEnabled(false);
      onUpdateQuestionText(step5.questionText);
      onUpdateNavText(step5.navText);
      setEliminateLeft(0);
      setEliminateRight(sortedDataset.length - 1);
      setEliminatedSlots({});
      setWrongEliminateSlots({});
      setIsEliminationDone(false);
      setShowEliminateTeeter(true);
      if (eliminateInactivityTimerRef.current) clearTimeout(eliminateInactivityTimerRef.current);
    }
    if (step === 6) {
      onSetNextEnabled(false);
      onUpdateQuestionText(step6.questionText);
      onUpdateNavText(step6.navText);
      const nextEliminated = {};
      sortedDataset.forEach(function (_, index) {
        if (index < middleLeft || index > middleRight) nextEliminated[index] = true;
      });
      setEliminateLeft(middleLeft);
      setEliminateRight(middleRight);
      setEliminatedSlots(nextEliminated);
      setMcqChoice(null);
      setMcqFeedback(null);
    }
    if (step === 7) {
      onSetNextEnabled(false);
      onUpdateQuestionText(step7.questionText);
      resetCalcState();
      setEliminatedSlots(buildEliminatedThroughMiddle());
    }
  }, [step, initialStage]);

  useEffect(function () {
    setStepClickNudgeDismissed(false);
  }, [step]);

  useEffect(function () {
    if (step === 2 && isStepOneReady) {
      setStepClickNudgeDismissed(false);
    }
  }, [step, isStepOneReady]);

  useEffect(function () {
    if (step === 5 && isEliminationDone) {
      setStepClickNudgeDismissed(false);
    }
  }, [step, isEliminationDone]);

  useEffect(function () {
    return function () {
      if (dataInactivityTimerRef.current) clearTimeout(dataInactivityTimerRef.current);
      if (eliminateInactivityTimerRef.current) clearTimeout(eliminateInactivityTimerRef.current);
    };
  }, []);

  useEffect(function () {
    if (step !== 7 || initialStage === "final") return undefined;

    const timers = [];

    function flyValue(slotIndex, targetRef, onLand) {
      const fromNode = slotRefs.current[slotIndex];
      const toNode = targetRef.current;
      if (!fromNode || !toNode) return;
      const from = relCenter(fromNode);
      const to = relCenter(toNode);
      setFlyingCalc({
        value: sortedDataset[slotIndex],
        from: from,
        to: to,
        slotIndex: slotIndex,
      });
      timers.push(setTimeout(function () {
        setFlyingCalc(null);
        onLand();
        setDimmedMiddleSlots(function (prev) {
          const next = {};
          Object.keys(prev).forEach(function (key) { next[key] = prev[key]; });
          next[slotIndex] = true;
          return next;
        });
      }, 680));
    }

    timers.push(setTimeout(function () {
      flyValue(middleLeft, numLeftTargetRef, function () {
        setNumeratorLeft(sortedDataset[middleLeft]);
        timers.push(setTimeout(function () {
          flyValue(middleRight, numRightTargetRef, function () {
            setNumeratorRight(sortedDataset[middleRight]);
            timers.push(setTimeout(function () {
              setShowCalcPlus(true);
              setShowCalcDenom(true);
              timers.push(setTimeout(function () {
                setShowCalcEquals(true);
                setShowNumpad(true);
                onUpdateNavText(step7.navText);
              }, 450));
            }, 350));
          });
        }, 200));
      });
    }, 500));

    return function () {
      timers.forEach(function (timer) { clearTimeout(timer); });
    };
  }, [step]);

  function getPreviewOrder() {
    if (draggedIndex === null || hoverIndex === null || draggedIndex === hoverIndex) return order;
    const next = order.slice();
    const temp = next[draggedIndex];
    next[draggedIndex] = next[hoverIndex];
    next[hoverIndex] = temp;
    return next;
  }

  function getRowFromPointerY(pointerY) {
    const firstNode = optionRefs.current[0];
    if (!firstNode || !rowStrideRef.current) return null;
    const container = firstNode.parentElement;
    if (!container) return null;
    const relativeY = pointerY - container.getBoundingClientRect().top;
    const row = Math.floor(relativeY / rowStrideRef.current);
    if (row < 0 || row >= order.length) return null;
    return row;
  }

  function handlePointerDown(event, index) {
    if (lockedRows[index]) return;
    event.preventDefault();
    setShowVerticalDragNudge(false);
    const rect = event.currentTarget.getBoundingClientRect();
    const gapPx = window.innerWidth * 0.0135;
    dragAnchorXRef.current = event.clientX;
    setDraggedIndex(index);
    setHoverIndex(index);
    setDragOffset({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
    setDragPosition({ x: event.clientX, y: event.clientY });
    setGhostSize({ width: rect.width, height: rect.height });
    optionHeightRef.current = rect.height;
    rowStrideRef.current = rect.height + gapPx;
    if (typeof playSound === "function") playSound("click");
  }

  useEffect(function () {
    if (draggedIndex === null) return undefined;

    function onMove(event) {
      setDragPosition({ x: dragAnchorXRef.current, y: event.clientY });
      const nextHover = getRowFromPointerY(event.clientY);
      if (nextHover !== null && !lockedRows[nextHover]) {
        setHoverIndex(nextHover);
      }
    }

    function onUp() {
      const preview = getPreviewOrder();
      const nextLocked = {};
      let newlyLocked = false;
      Object.keys(lockedRows).forEach(function (key) { nextLocked[key] = lockedRows[key]; });

      preview.forEach(function (id, index) {
        if (id === step2.correctOrder[index]) {
          if (!lockedRows[index]) newlyLocked = true;
          nextLocked[index] = true;
        }
      });

      const wasComplete = step2.correctOrder.every(function (id, index) {
        return preview[index] === id && nextLocked[index];
      });

      setOrder(preview);
      setLockedRows(nextLocked);
      setDraggedIndex(null);
      setHoverIndex(null);

      if (wasComplete) {
        if (typeof playSound === "function") playSound("congrats");
        onUpdateQuestionText(step2.completeQuestion);
        onUpdateNavText(step2.completeNav);
        setTimeout(function () {
          setIsStepOneReady(true);
          setLockedRows({});
        }, 1200);
      } else if (newlyLocked && typeof playSound === "function") {
        playSound("correct");
      }
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return function () {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [draggedIndex, hoverIndex, order, lockedRows]);

  function relCenter(node) {
    const container = containerRef.current;
    if (!node || !container) return { x: 0, y: 0 };
    const cRect = container.getBoundingClientRect();
    const rect = node.getBoundingClientRect();
    return {
      x: rect.left - cRect.left + rect.width / 2,
      y: rect.top - cRect.top + rect.height / 2,
    };
  }

  function handleSortClick(value, index) {
    if (usedIndexes[index] || flyingValue || !cueVisible) return;
    resetDataTeeterOnInteraction();
    const expected = sortedDataset[activeSlot];
    if (value !== expected) {
      setWrongSource(index);
      if (typeof playSound === "function") playSound("wrong");
      setTimeout(function () { setWrongSource(null); }, 600);
      return;
    }

    const from = relCenter(sourceRefs.current[index]);
    const to = relCenter(slotRefs.current[activeSlot]);
    const filledSlot = activeSlot;
    setCueVisible(false);
    setFlyingValue({ value: value, from: from, to: to });
    if (typeof playSound === "function") playSound("correct");

    setTimeout(function () {
      setFlyingValue(null);
      setSortFilled(function (prev) {
        const next = prev.slice();
        next[filledSlot] = value;
        return next;
      });
      setSettlingSlots(function (prev) {
        const next = {};
        Object.keys(prev).forEach(function (key) { next[key] = prev[key]; });
        next[filledSlot] = true;
        return next;
      });
      setUsedIndexes(function (prev) {
        const next = {};
        Object.keys(prev).forEach(function (key) { next[key] = prev[key]; });
        next[index] = true;
        return next;
      });

      const nextSlot = filledSlot + 1;
      if (nextSlot >= sortedDataset.length) {
        if (typeof playSound === "function") playSound("congrats");
        setTimeout(function () { onGoToStep(4); }, 1200);
      } else {
        setTimeout(function () {
          setActiveSlot(nextSlot);
          setCueVisible(true);
        }, 300);
      }
      setTimeout(function () {
        setSettlingSlots(function (prev) {
          const next = {};
          Object.keys(prev).forEach(function (key) {
            if (String(key) !== String(filledSlot)) next[key] = prev[key];
          });
          return next;
        });
      }, 900);
    }, 650);
  }

  function handleEliminateClick(index) {
    if (isEliminationDone || eliminatedSlots[index]) return;

    const isEndpoint = index === eliminateLeft || index === eliminateRight;
    if (!isEndpoint) {
      resetEliminateTeeterOnInteraction();
      const pairIndex = sortedDataset.length - 1 - index;
      const wrongs = {};
      wrongs[index] = true;
      if (!eliminatedSlots[pairIndex]) wrongs[pairIndex] = true;
      setWrongEliminateSlots(wrongs);
      if (typeof playSound === "function") playSound("wrong");
      setTimeout(function () { setWrongEliminateSlots({}); }, 650);
      return;
    }

    const nextEliminated = {};
    Object.keys(eliminatedSlots).forEach(function (key) { nextEliminated[key] = eliminatedSlots[key]; });
    nextEliminated[eliminateLeft] = true;
    nextEliminated[eliminateRight] = true;

    const nextLeft = eliminateLeft + 1;
    const nextRight = eliminateRight - 1;

    setEliminatedSlots(nextEliminated);
    setEliminateLeft(nextLeft);
    setEliminateRight(nextRight);
    if (typeof playSound === "function") playSound("correct");

    if (nextRight - nextLeft + 1 <= 2) {
      setIsEliminationDone(true);
      onUpdateQuestionText(step5.completeQuestion);
      onUpdateNavText(step5.completeNav);
    } else {
      onUpdateNavText(step5.ongoingNav);
      restartEliminateTeeterImmediately();
    }
  }

  function handleMcqClick(index) {
    if (mcqChoice === step6.correctIndex) return;

    setMcqChoice(index);
    if (index === step6.correctIndex) {
      setMcqFeedback({ type: "correct", text: step6.correctFeedback });
      if (typeof playSound === "function") playSound("correct");
      onUpdateNavText(step6.completeNav);
      onSetNextEnabled(true);
    } else {
      setMcqFeedback({ type: "wrong", text: step6.wrongFeedback });
      if (typeof playSound === "function") playSound("wrong");
    }
  }

  function handleNumpadDigit(digit) {
    if (calcBoxState === "correct") return;
    if (typeof playSound === "function") playSound("click");
    setCalcBoxState(null);
    setCalcInput(function (prev) {
      if (prev.length >= 2) return prev;
      return prev + String(digit);
    });
  }

  function handleNumpadBackspace() {
    if (calcBoxState === "correct") return;
    if (typeof playSound === "function") playSound("click");
    setCalcBoxState(null);
    setCalcInput(function (prev) { return prev.slice(0, -1); });
  }

  function handleCalcSubmit() {
    if (calcBoxState === "correct" || !calcInput) return;
    if (Number(calcInput) === calcCorrectAnswer) {
      setCalcBoxState("correct");
      if (typeof playSound === "function") playSound("correct");
      onUpdateQuestionText(step7.completeQuestion);
      onUpdateNavText(step7.completeNav);
      onSetNextEnabled(true);
    } else {
      setCalcBoxState("wrong");
      if (typeof playSound === "function") playSound("wrong");
      setTimeout(function () {
        setCalcBoxState(null);
        setCalcInput("");
      }, 700);
    }
  }

  function renderDataRow(options) {
    const opts = options || {};
    const items = [];
    dataset.forEach(function (value, index) {
      const isUsed = !!usedIndexes[index];
      const isClickable = opts.clickable && !isUsed;
      items.push(e("button", {
        type: "button",
        key: "median-source-" + index,
        ref: function (node) { sourceRefs.current[index] = node; },
        className: [
          "mean-data-value",
          "median-value-cell",
          isClickable ? "clickable" : "",
          isClickable && showNudges && showDataTeeter ? "teeter" : "",
          isUsed ? "used" : "",
          wrongSource === index ? "wrong" : "",
        ].join(" "),
        disabled: !isClickable,
        onClick: function () { handleSortClick(value, index); },
      }, value));
      if (index < dataset.length - 1) {
        items.push(e("span", {
          className: "median-value-comma",
          key: "data-comma-" + index,
        }, ","));
      }
    });
    return e("div", {
      className: "mean-data-row median-values-row " + (opts.compact ? "compact" : ""),
    }, items);
  }

  function renderStepClickNudge() {
    if (!showNudges) return null;
    const showNudge = (step === 2 && isStepOneReady) ||
      step === 4 ||
      (step === 5 && isEliminationDone);
    if (!showNudge || stepClickNudgeDismissed) return null;
    return e(Nudge, { targetRef: stepClickNudgeRef, show: true });
  }

  function renderSteps(options) {
    const opts = options || {};
    const previewOrder = getPreviewOrder();
    const previewRowById = {};
    previewOrder.forEach(function (id, rowIndex) {
      previewRowById[id] = rowIndex;
    });

    return e("div", { className: "mean-steps-panel " + (opts.visible === false ? "collapsed" : "") },
      e("div", { className: "mean-step-labels" },
        step2.stepLabels.map(function (label, index) {
          const isLabelCorrect = !!lockedRows[index];
          return e("div", {
            className: "mean-step-label" + (isLabelCorrect ? " correct-label" : ""),
            key: "label-" + index,
          }, label);
        })
      ),
      e("div", { className: "mean-step-options" + (draggedIndex !== null ? " is-dragging" : "") },
        order.map(function (id, index) {
          const previewRow = previewRowById[id];
          const slideDelta = draggedIndex !== null ? previewRow - index : 0;
          const isLocked = !!lockedRows[index] || (opts.highlightStep === index);
          const isReady = opts.highlightStep === index;
          const isDraggingThis = draggedIndex !== null && index === draggedIndex;
          const slideStyle = slideDelta !== 0 && rowStrideRef.current
            ? { transform: "translateY(" + (slideDelta * rowStrideRef.current) + "px)" }
            : null;

          return e("button", {
            type: "button",
            key: "option-" + id,
            ref: function (node) {
              optionRefs.current[index] = node;
              if (opts.clickableStep === index) stepClickNudgeRef.current = node;
              if (index === 1) verticalDragNudgeRef.current = node;
            },
            className: [
              "mean-step-option" + (current_language === "id" ? " id" : ""),
              isLocked ? "correct" : "",
              isReady ? "ready" : "",
              isDraggingThis ? "dragging-hidden" : "",
            ].join(" "),
            style: slideStyle,
            disabled: opts.clickableStep !== index && (lockedRows[index] || opts.noDrag),
            onPointerDown: opts.noDrag ? undefined : function (event) { handlePointerDown(event, index); },
            onClick: opts.clickableStep === index ? function () {
              setStepClickNudgeDismissed(true);
              if (typeof playSound === "function") playSound("click");
              onGoToStep(opts.clickToStep);
            } : undefined,
          }, step2.options[id]);
        }),
        draggedIndex !== null && hoverIndex !== null && !lockedRows[hoverIndex] && rowStrideRef.current
          ? e("div", {
            className: "mean-step-drop-placeholder",
            key: "drop-placeholder",
            style: {
              top: hoverIndex * rowStrideRef.current + "px",
              height: optionHeightRef.current + "px",
            },
          })
          : null
      )
    );
  }

  function renderSortRow(options) {
    const opts = options || {};
    return e("div", { className: "sort-row " + (opts.hideCommas ? "hide-commas" : "") },
      e("div", { className: "sort-label sort-smallest" }, step3.smallest),
      e("div", { className: "sort-label sort-largest" }, step3.largest),
      e("div", { className: "sort-slots median-values-row" },
        (function () {
          const items = [];
          sortedDataset.forEach(function (value, index) {
            const isFilled = opts.final || sortFilled[index] !== undefined;
            const showCue = cueVisible && activeSlot === index && !isFilled;
            const isRemoved = !!eliminatedSlots[index];
            const isEliminateClickable = !!opts.eliminate && !isRemoved && !isEliminationDone;
            const isWrongEliminate = !!wrongEliminateSlots[index];
            const isMiddle = index === middleLeft || index === middleRight;
            const isDimmed = !!dimmedMiddleSlots[index];
            const displayValue = isFilled
              ? (sortFilled[index] !== undefined ? sortFilled[index] : sortedDataset[index])
              : "";
            const isEndpoint = index === eliminateLeft || index === eliminateRight;
            items.push(e("div", {
              className: [
                "sort-slot",
                "median-value-cell",
                showCue ? "active" : "",
                isFilled ? "filled" : "",
                settlingSlots[index] ? "settling" : "",
                isEliminateClickable ? "eliminate-clickable" : "",
                isEliminateClickable && isEndpoint && showNudges && showEliminateTeeter ? "teeter" : "",
                isRemoved ? "eliminated" : "",
                isWrongEliminate ? "wrong-eliminate" : "",
                opts.highlightMiddle && isMiddle ? "middle-highlight" : "",
                isDimmed ? "calc-source-dimmed" : "",
              ].join(" "),
              key: "sort-slot-" + index,
              ref: function (node) { slotRefs.current[index] = node; },
              onClick: isEliminateClickable ? function () { handleEliminateClick(index); } : undefined,
            },
              displayValue,
              showCue ? e("div", { className: "slot-arrow" }) : null
            ));
            if (index < sortedDataset.length - 1) {
              items.push(e("span", {
                className: "median-value-comma",
                key: "sort-comma-" + index,
              }, ","));
            }
          });
          return items;
        })()
      )
    );
  }

  function renderMcqRow() {
    return e("div", { className: "median-mcq-panel" },
      e("div", { className: "median-mcq-options" },
        step6.options.map(function (option, index) {
          const isSelected = mcqChoice === index;
          const isCorrect = isSelected && index === step6.correctIndex;
          const isWrong = isSelected && index !== step6.correctIndex;
          return e("button", {
            type: "button",
            key: "median-option-" + index,
            className: [
              "median-mcq-option",
              isCorrect ? "correct" : "",
              isWrong ? "wrong-choice" : "",
            ].join(" "),
            disabled: mcqChoice === step6.correctIndex,
            onClick: function () { handleMcqClick(index); },
          }, option);
        })
      ),
      mcqFeedback ? e("div", { className: "median-feedback " + mcqFeedback.type }, mcqFeedback.text) : null
    );
  }

  function renderNumpadKey(key) {
    if (key === "backspace") {
      return e("button", {
        type: "button",
        key: "numpad-backspace",
        className: "median-numpad-key backspace",
        disabled: calcBoxState === "correct",
        onClick: handleNumpadBackspace,
      }, "⌫");
    }
    if (key === "submit") {
      return e("button", {
        type: "button",
        key: "numpad-submit",
        className: "median-numpad-key submit",
        disabled: calcBoxState === "correct" || !calcInput,
        onClick: handleCalcSubmit,
      }, "✓");
    }
    return e("button", {
      type: "button",
      key: "numpad-" + key,
      className: "median-numpad-key",
      disabled: calcBoxState === "correct",
      onClick: function () { handleNumpadDigit(key); },
    }, key);
  }

  function renderMedianCalculation() {
    return e("div", { className: "median-calculation-panel" },
      e("div", { className: "median-calc-top" },
        e("span", { className: "median-calc-label" }, "Median ="),
        e("div", { className: "median-fraction" },
          e("div", { className: "median-fraction-num" },
            numeratorLeft !== null
              ? e("span", { className: "frac-digit visible" }, numeratorLeft)
              : e("span", { className: "frac-digit frac-target", ref: numLeftTargetRef }),
            e("span", { className: "frac-plus " + (showCalcPlus ? "visible" : "") }, "+"),
            numeratorRight !== null
              ? e("span", { className: "frac-digit visible" }, numeratorRight)
              : e("span", { className: "frac-digit frac-target", ref: numRightTargetRef })
          ),
          e("div", { className: "median-fraction-bar" }),
          e("div", { className: "median-fraction-denom" },
            e("span", { className: "frac-digit " + (showCalcDenom ? "visible" : "") }, step7.denominator)
          )
        ),
        e("div", {
          className: "median-calc-result " + (showCalcEquals ? "visible" : ""),
        },
          e("span", { className: "median-calc-equals-sign" }, "="),
          e("span", {
            className: [
              "median-answer-box",
              calcBoxState === "wrong" ? "wrong" : "",
              calcBoxState === "correct" ? "correct" : "",
            ].join(" "),
          }, calcInput || "\u00A0")
        )
      ),
      e("div", {
        className: "median-calc-bottom " + (showNumpad ? "visible" : ""),
      },
        e("div", { className: "median-numpad-row" },
          [1, 2, 3, 4, 5, "backspace"].map(renderNumpadKey)
        ),
        e("div", { className: "median-numpad-row" },
          [6, 7, 8, 9, 0, "submit"].map(renderNumpadKey)
        )
      )
    );
  }

  const ghost = draggedIndex !== null ? e("div", {
    className: "mean-drag-ghost" + (current_language === "id" ? " id" : ""),
    style: {
      left: dragPosition.x - dragOffset.x,
      top: dragPosition.y - dragOffset.y,
      width: ghostSize.width,
      height: ghostSize.height,
    },
  }, step2.options[order[draggedIndex]]) : null;

  function renderVerticalDragNudge() {
    if (!showNudges || step !== 2 || !showVerticalDragNudge || isStepOneReady) return null;
    return e(Nudge, {
      targetRef: verticalDragNudgeRef,
      show: true,
      asset: "assets/verticalDrag.gif",
      transform: "translate(-20%, -40%)",
      verticalDrag: true,
    });
  }

  const flying = flyingValue ? e("div", {
    className: "flying-sort-value",
    style: {
      "--from-x": flyingValue.from.x + "px",
      "--from-y": flyingValue.from.y + "px",
      "--to-x": flyingValue.to.x + "px",
      "--to-y": flyingValue.to.y + "px",
    },
  }, flyingValue.value) : null;

  const flyingCalcEl = flyingCalc ? e("div", {
    className: "flying-calc-value",
    style: {
      "--from-x": flyingCalc.from.x + "px",
      "--from-y": flyingCalc.from.y + "px",
      "--to-x": flyingCalc.to.x + "px",
      "--to-y": flyingCalc.to.y + "px",
    },
  }, flyingCalc.value) : null;

  if (step === 3) {
    return e("div", { className: "main-canvas-container mean-canvas", ref: containerRef },
      e("div", { className: "mean-row sort-section expanded" }, renderSortRow()),
      e("div", { className: "mean-row data-section" }, renderDataRow({ clickable: true })),
      flying
    );
  }

  if (step === 4) {
    return e("div", { className: "main-canvas-container mean-canvas", ref: containerRef },
      e("div", { className: "mean-row sort-section expanded" }, renderSortRow({ final: true, hideCommas: true })),
      e("div", { className: "mean-row data-section collapsed" }),
      renderSteps({ noDrag: true, highlightStep: 1, clickableStep: 1, clickToStep: 5 }),
      renderStepClickNudge()
    );
  }

  if (step === 5) {
    return e("div", { className: "main-canvas-container mean-canvas", ref: containerRef },
      e("div", { className: "mean-row sort-section expanded" }, renderSortRow({ final: true, hideCommas: true, eliminate: true })),
      e("div", { className: "mean-row data-section collapsed" }),
      isEliminationDone ? renderSteps({ noDrag: true, highlightStep: 2, clickableStep: 2, clickToStep: 6 }) : null,
      renderStepClickNudge()
    );
  }

  if (step === 6) {
    return e("div", { className: "main-canvas-container mean-canvas", ref: containerRef },
      e("div", { className: "mean-row sort-section expanded" }, renderSortRow({ final: true, hideCommas: true })),
      e("div", { className: "mean-row data-section collapsed" }),
      renderMcqRow()
    );
  }

  if (step === 7) {
    return e("div", { className: "main-canvas-container mean-canvas", ref: containerRef },
      e("div", { className: "mean-row sort-section expanded" }, renderSortRow({ final: true, hideCommas: true, highlightMiddle: true })),
      e("div", { className: "mean-row data-section collapsed" }),
      renderMedianCalculation(),
      flyingCalcEl
    );
  }

  return e("div", { className: "main-canvas-container mean-canvas", ref: containerRef },
    e("div", { className: "mean-row data-section" }, renderDataRow({ compact: true })),
    renderSteps({ highlightStep: isStepOneReady ? 0 : null, clickableStep: isStepOneReady ? 0 : null, clickToStep: 3, noDrag: isStepOneReady }),
    ghost,
    renderVerticalDragNudge(),
    renderStepClickNudge()
  );
};
