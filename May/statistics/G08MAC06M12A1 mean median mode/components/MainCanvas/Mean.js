const Mean = (props) => {
  const { step, onSetNextEnabled, onUpdateNavText, onUpdateQuestionText } = props;
  const { useEffect, useRef, useState } = React;
  const e = React.createElement;

  const sortedDataset = APP_DATA.sortedDataset;
  const step8 = APP_DATA.steps[8];
  const step9 = APP_DATA.steps[9];
  const dd = APP_DATA.meanDragDrop;
  const labels = dd.labels;

  const [filledZones, setFilledZones] = useState({});
  const [availableDraggables, setAvailableDraggables] = useState(dd.draggables.map(function (d) { return d.id; }));
  const [shakeZone, setShakeZone] = useState(null);
  const [ddComplete, setDdComplete] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredZone, setHoveredZone] = useState(null);
  const [ghostSize, setGhostSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef(null);

  const [activeField, setActiveField] = useState(null);
  const [sumInput, setSumInput] = useState("");
  const [countInput, setCountInput] = useState("");
  const [meanInput, setMeanInput] = useState("");
  const [sumDone, setSumDone] = useState(false);
  const [countDone, setCountDone] = useState(false);
  const [meanDone, setMeanDone] = useState(false);
  const [sumWrongCount, setSumWrongCount] = useState(0);
  const [countWrongCount, setCountWrongCount] = useState(0);
  const [meanWrongCount, setMeanWrongCount] = useState(0);
  const [boxState, setBoxState] = useState(null);
  const [showResultBox, setShowResultBox] = useState(false);
  const [showNumpad, setShowNumpad] = useState(false);
  const [countBadgeCount, setCountBadgeCount] = useState(0);
  const [isCountAnimating, setIsCountAnimating] = useState(false);
  const [glowField, setGlowField] = useState(null);
  const [showFractionNudges, setShowFractionNudges] = useState(true);
  const numBoxRef = useRef(null);
  const denomBoxRef = useRef(null);

  function resetDragDrop() {
    setFilledZones({});
    setAvailableDraggables(dd.draggables.map(function (d) { return d.id; }));
    setShakeZone(null);
    setDdComplete(false);
    setDraggedItem(null);
    setIsDragging(false);
    setHoveredZone(null);
    setGhostSize({ width: 0, height: 0 });
  }

  function resetStep9() {
    setActiveField(null);
    setSumInput("");
    setCountInput("");
    setMeanInput("");
    setSumDone(false);
    setCountDone(false);
    setMeanDone(false);
    setSumWrongCount(0);
    setCountWrongCount(0);
    setMeanWrongCount(0);
    setBoxState(null);
    setShowResultBox(false);
    setGlowField(null);
    setShowNumpad(false);
    setCountBadgeCount(0);
    setIsCountAnimating(false);
  }

  useEffect(function () {
    if (step === 8) {
      onSetNextEnabled(false);
      onUpdateQuestionText(step8.questionText);
      onUpdateNavText(step8.navText);
      resetDragDrop();
    }
    if (step === 9) {
      onSetNextEnabled(false);
      onUpdateQuestionText(step9.questionText);
      onUpdateNavText(step9.navText);
      resetStep9();
      setShowFractionNudges(true);
    }
  }, [step]);

  useEffect(function () {
    if (step !== 8) return;
    const zones = ["left", "num", "denom"];
    const allFilled = zones.every(function (z) { return filledZones[z]; });
    if (allFilled && !ddComplete) {
      setDdComplete(true);
      if (typeof playSound === "function") playSound("correct");
      onUpdateQuestionText(step8.completeQuestion);
      onUpdateNavText(step8.completeNav);
      onSetNextEnabled(true);
    }
  }, [filledZones, ddComplete, step]);

  useEffect(function () {
    if (step !== 9 || !sumDone || !countDone || showResultBox) return;
    const timer = setTimeout(function () {
      setShowResultBox(true);
      setCountBadgeCount(0);
      setActiveField("mean");
      setShowNumpad(true);
      onUpdateQuestionText(step9.meanQuestion);
      onUpdateNavText(step9.meanNav);
    }, 1000);
    return function () { clearTimeout(timer); };
  }, [sumDone, countDone, showResultBox, step]);

  useEffect(function () {
    if (!isDragging) return undefined;
    function onMove(event) {
      setDragPosition({ x: event.clientX, y: event.clientY });
      const zones = containerRef.current ? containerRef.current.querySelectorAll(".mean-dd-zone") : [];
      let nextHover = null;
      zones.forEach(function (zone) {
        const rect = zone.getBoundingClientRect();
        if (
          event.clientX >= rect.left && event.clientX <= rect.right &&
          event.clientY >= rect.top && event.clientY <= rect.bottom
        ) {
          const zoneId = zone.dataset.zoneid;
          if (!filledZones[zoneId]) nextHover = zoneId;
        }
      });
      setHoveredZone(nextHover);
    }
    function onUp(event) {
      if (!draggedItem) return;
      const zones = containerRef.current ? containerRef.current.querySelectorAll(".mean-dd-zone") : [];
      let droppedOn = null;
      zones.forEach(function (zone) {
        const rect = zone.getBoundingClientRect();
        if (
          event.clientX >= rect.left && event.clientX <= rect.right &&
          event.clientY >= rect.top && event.clientY <= rect.bottom
        ) {
          droppedOn = zone.dataset.zoneid;
        }
      });
      if (droppedOn) processDrop(draggedItem, droppedOn);
      setDraggedItem(null);
      setIsDragging(false);
      setHoveredZone(null);
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return function () {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [isDragging, draggedItem, filledZones]);

  function getDraggable(id) {
    return dd.draggables.find(function (d) { return d.id === id; });
  }

  function getDraggableDisplayText(id) {
    const item = getDraggable(id);
    if (!item) return "";
    return item.text.split("\n");
  }

  function processDrop(draggableId, zoneId) {
    if (!draggableId || filledZones[zoneId]) return;
    const isCorrect = dd.zoneMap[zoneId] === draggableId;
    if (isCorrect) {
      if (typeof playSound === "function") playSound("correct");
      setFilledZones(function (prev) {
        const next = {};
        Object.keys(prev).forEach(function (k) { next[k] = prev[k]; });
        next[zoneId] = draggableId;
        return next;
      });
      setAvailableDraggables(function (prev) {
        return prev.filter(function (id) { return id !== draggableId; });
      });
    } else {
      if (typeof playSound === "function") playSound("wrong");
      setShakeZone(zoneId);
      setTimeout(function () { setShakeZone(null); }, 600);
    }
  }

  function handleDragPointerDown(event, draggableId) {
    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();
    setDraggedItem(draggableId);
    setIsDragging(true);
    setDragPosition({ x: event.clientX, y: event.clientY });
    setGhostSize({ width: rect.width, height: rect.height });
    if (typeof playSound === "function") playSound("click");
  }

  function renderDraggableText(lines) {
    if (typeof lines === "string") lines = lines.split("\n");
    const parts = [];
    lines.forEach(function (line, i) {
      if (i > 0) parts.push(e("br", { key: "br-" + i }));
      parts.push(line);
    });
    return parts;
  }

  function renderDataSortRow() {
    const showPlus = step === 9 && activeField === "num" && !sumDone;
    const slots = [];
    sortedDataset.forEach(function (value, index) {
      if (index > 0 && showPlus) {
        slots.push(e("span", { className: "sort-plus-sign", key: "plus-" + index }, "+"));
      }
      const showBadge = step === 9 && countBadgeCount > index && activeField === "denom";
      slots.push(e("div", {
        className: "sort-slot filled" + (showBadge ? " sort-has-badge" : ""),
        key: "sort-slot-" + index,
      },
        showBadge ? e("span", { className: "mean-count-badge" }, index + 1) : null,
        value
      ));
    });
    return e("div", { className: "sort-row hide-commas" },
      e("div", { className: "sort-slots" }, slots)
    );
  }

  function navForOtherField(completedField) {
    if (completedField === "num" && !countDone) return step9.sumCompleteNav;
    if (completedField === "denom" && !sumDone) return step9.countCompleteNav;
    return null;
  }

  function renderDropZone(zoneId) {
    const isFilled = !!filledZones[zoneId];
    const isShaking = shakeZone === zoneId;
    const isHovered = hoveredZone === zoneId && !isFilled && draggedItem;
    let className = "mean-dd-zone";
    if (isFilled) className += " correct";
    if (isShaking) className += " shake wrong";
    if (isHovered) className += " hovered";
    if (zoneId === "num" || zoneId === "denom") className += " fraction-zone";
    const content = isFilled
      ? renderDraggableText(getDraggable(filledZones[zoneId]).text)
      : step8.dropPlaceholder;
    return e("span", {
      key: zoneId,
      className: className,
      "data-zoneid": zoneId,
    }, content);
  }

  function renderDragDropPanel() {
    const ghost = isDragging && draggedItem ? e("div", {
      className: "mean-dd-draggable mean-dd-ghost",
      style: {
        left: dragPosition.x,
        top: dragPosition.y,
        width: ghostSize.width,
        height: ghostSize.height,
      },
    }, renderDraggableText(getDraggable(draggedItem).text)) : null;

    return e("div", { className: "mean-dd-panel" },
      e("div", { className: "mean-dd-left" },
        e("div", { className: "mean-dd-formula" },
          renderDropZone("left"),
          e("span", { className: "mean-dd-equals" }, "="),
          e("div", { className: "mean-dd-fraction" },
            renderDropZone("num"),
            e("div", { className: "mean-dd-bar" }),
            renderDropZone("denom")
          ),
          e("div", { className: "mean-calc-result formula-reserved" },
            e("span", { className: "mean-dd-equals" }, "="),
            e("span", { className: "mean-dd-zone mean-result-box" }, "\u00A0")
          )
        )
      ),
      e("div", { className: "mean-dd-right" },
        dd.draggables.map(function (item) {
          if (!availableDraggables.includes(item.id)) return null;
          return e("button", {
            type: "button",
            key: "drag-" + item.id,
            className: "mean-dd-draggable" + (draggedItem === item.id ? " dragging" : ""),
            onPointerDown: function (ev) { handleDragPointerDown(ev, item.id); },
          }, renderDraggableText(item.text));
        })
      ),
      ghost
    );
  }

  function getBoxDisplay(field) {
    if (field === "num") {
      if (sumDone) return String(step9.sumAnswer);
      if (sumInput) return sumInput;
      return labels.sum;
    }
    if (field === "denom") {
      if (countDone) return String(step9.countAnswer);
      if (countInput) return countInput;
      return labels.count;
    }
    if (field === "mean") {
      if (meanDone) return step9.meanAnswer;
      if (meanInput) return meanInput;
      return "\u00A0";
    }
    return labels.mean;
  }

  function handleFieldClick(field) {
    if (step !== 9 || isCountAnimating) return;
    if (field === "num" && sumDone) return;
    if (field === "denom" && countDone) return;

    if (field === "num" || field === "denom") {
      setShowFractionNudges(false);
    }

    setCountBadgeCount(0);

    if (field === "num") {
      setActiveField("num");
      setShowNumpad(true);
      setBoxState(null);
      onUpdateQuestionText(step9.sumQuestion);
      onUpdateNavText(step9.sumNav);
      if (typeof playSound === "function") playSound("click");
    } else if (field === "denom") {
      setActiveField("denom");
      setShowNumpad(true);
      setBoxState(null);
      onUpdateQuestionText(step9.countQuestion);
      onUpdateNavText(step9.countNav);
      if (typeof playSound === "function") playSound("click");
    }
  }

  function runCountBadgeAnimation(onComplete) {
    setIsCountAnimating(true);
    setShowNumpad(false);
    setCountBadgeCount(0);
    let i = 0;
    function next() {
      if (i >= sortedDataset.length) {
        setIsCountAnimating(false);
        onComplete();
        return;
      }
      setCountBadgeCount(i + 1);
      if (typeof playSound === "function") playSound("tick");
      i += 1;
      setTimeout(next, 380);
    }
    next();
  }

  function playRevealAttention(field) {
    setTimeout(function () {
      setGlowField(field);
      if (typeof playSound === "function") playSound("tick");
      setTimeout(function () { setGlowField(null); }, 900);
    }, 80);
  }

  function applySumComplete() {
    setSumDone(true);
    setSumInput("");
    setBoxState(null);
    onUpdateQuestionText(step9.sumCompleteQuestion);
    const otherNav = navForOtherField("num");
    if (otherNav) onUpdateNavText(otherNav);
    setActiveField(null);
    setShowNumpad(false);
  }

  function revealSumWithAttention() {
    applySumComplete();
    playRevealAttention("num");
  }

  function applyCountComplete() {
    setCountDone(true);
    setCountInput("");
    setBoxState(null);
    setCountBadgeCount(0);
    onUpdateQuestionText(step9.countCompleteQuestion);
    const otherNav = navForOtherField("denom");
    if (otherNav) onUpdateNavText(otherNav);
    setActiveField(null);
    setShowNumpad(false);
  }

  function revealCountWithAttention() {
    applyCountComplete();
    playRevealAttention("denom");
  }

  function handleWrong(field) {
    setBoxState("wrong");
    if (typeof playSound === "function") playSound("wrong");
    if (field === "num") {
      const nextWrong = sumWrongCount + 1;
      setSumWrongCount(nextWrong);
      if (nextWrong >= 2) {
        setTimeout(revealSumWithAttention, 1500);
      } else {
        setTimeout(function () {
          setBoxState(null);
          setSumInput("");
        }, 700);
      }
    } else if (field === "denom") {
      const nextWrong = countWrongCount + 1;
      setCountWrongCount(nextWrong);
      if (nextWrong >= 2) {
        setTimeout(function () {
          runCountBadgeAnimation(revealCountWithAttention);
        }, 1500);
      } else {
        setTimeout(function () {
          setBoxState(null);
          setCountInput("");
        }, 700);
      }
    } else if (field === "mean") {
      const nextWrong = meanWrongCount + 1;
      setMeanWrongCount(nextWrong);
      setTimeout(function () {
        setBoxState(null);
        setMeanInput("");
      }, 700);
    }
  }

  function handleSubmit() {
    if (activeField === "num" && !sumDone) {
      if (Number(sumInput) === step9.sumAnswer) {
        setBoxState("correct");
        if (typeof playSound === "function") playSound("correct");
        setTimeout(function () {
          setBoxState(null);
          setShowNumpad(false);
          applySumComplete();
        }, 500);
      } else {
        handleWrong("num");
      }
      return;
    }
    if (activeField === "denom" && !countDone) {
      if (Number(countInput) === step9.countAnswer) {
        setBoxState("correct");
        if (typeof playSound === "function") playSound("correct");
        setTimeout(function () {
          setBoxState(null);
          setShowNumpad(false);
          runCountBadgeAnimation(applyCountComplete);
        }, 500);
      } else {
        handleWrong("denom");
      }
      return;
    }
    if (activeField === "mean" && !meanDone) {
      if (meanInput === step9.meanAnswer) {
        setBoxState("correct");
        if (typeof playSound === "function") playSound("correct");
        setMeanDone(true);
        setShowNumpad(false);
        onUpdateQuestionText(step9.completeQuestion);
        onUpdateNavText(step9.completeNav);
        onSetNextEnabled(true);
      } else {
        handleWrong("mean");
      }
    }
  }

  function handleNumpadKey(key) {
    if (typeof playSound === "function") playSound("click");
    setBoxState(null);
    if (key === "backspace") {
      if (activeField === "num") setSumInput(function (p) { return p.slice(0, -1); });
      if (activeField === "denom") setCountInput(function (p) { return p.slice(0, -1); });
      if (activeField === "mean") setMeanInput(function (p) { return p.slice(0, -1); });
      return;
    }
    if (key === ".") {
      if (activeField === "mean" && meanInput.indexOf(".") < 0) {
        setMeanInput(function (p) { return p.length < 3 ? (p || "0") + "." : p; });
      }
      return;
    }
    const digit = String(key);
    if (activeField === "num") {
      setSumInput(function (p) { return p.length >= 3 ? p : p + digit; });
    } else if (activeField === "denom") {
      setCountInput(function (p) { return p.length >= 2 ? p : p + digit; });
    } else if (activeField === "mean") {
      setMeanInput(function (p) {
        if (p.length >= 3) return p;
        if (digit === "." && p.indexOf(".") >= 0) return p;
        return p + digit;
      });
    }
  }

  function renderStep9FractionBox(field) {
    const isActive = activeField === field;
    const isDone = field === "num" ? sumDone : countDone;
    const hasInput = field === "num" ? !!sumInput : !!countInput;
    const isLabel = !isDone && !hasInput;
    const isClickable = (field === "num" && !sumDone && !isCountAnimating) ||
      (field === "denom" && !countDone && !isCountAnimating);

    const classes = [
      "mean-dd-zone",
      "fraction-zone",
      !isDone && !isActive ? "correct" : "",
      isDone ? "step9-answered" : "",
      isClickable ? "step9-clickable" : "",
      isActive ? "step9-active" : "",
      isActive && isLabel ? "step9-label-pending" : "",
      isLabel ? "" : "step9-has-value",
      glowField === field ? "reveal-attention" : "",
      isActive && boxState === "wrong" ? "wrong shake" : "",
      isActive && boxState === "correct" ? "step9-correct-flash" : "",
    ].join(" ");

    let content = getBoxDisplay(field);
    if (isLabel) {
      content = renderDraggableText(getDraggable(field === "num" ? "sum" : "count").text);
    }

    return e("button", {
      type: "button",
      key: "box-" + field,
      ref: field === "num" ? numBoxRef : denomBoxRef,
      className: classes,
      disabled: !isClickable,
      onClick: function () { handleFieldClick(field); },
    }, content);
  }

  function renderStep9FractionNudges() {
    if (step !== 9 || !showFractionNudges) return null;
    if (activeField) return null;
    return e(React.Fragment, null,
      e(Nudge, { targetRef: numBoxRef, show: !sumDone }),
      e(Nudge, { targetRef: denomBoxRef, show: !countDone })
    );
  }

  function renderStep9MeanBox() {
    const isActive = activeField === "mean";
    const classes = [
      "mean-dd-zone",
      "mean-result-box",
      isActive ? "step9-active" : "",
      isActive && !meanInput && !meanDone ? "step9-label-pending" : "",
      meanInput || meanDone ? "step9-has-value" : "",
      meanDone || boxState === "correct" ? "step9-mean-correct" : "",
      isActive && boxState === "wrong" ? "wrong shake" : "",
      glowField === "mean" ? "reveal-attention" : "",
    ].join(" ");

    return e("span", {
      className: classes,
    }, getBoxDisplay("mean"));
  }

  function renderNumpadKey(key, options) {
    const opts = options || {};
    if (key === "backspace") {
      return e("button", {
        type: "button",
        key: "bs",
        className: "mean-np-key backspace",
        onClick: function () { handleNumpadKey("backspace"); },
      }, "⌫");
    }
    if (key === "submit") {
      return e("button", {
        type: "button",
        key: "submit",
        className: "mean-np-key submit" + (opts.tall ? " submit-tall" : ""),
        disabled: !opts.hasInput,
        onClick: handleSubmit,
      }, "✓");
    }
    return e("button", {
      type: "button",
      key: "k-" + key,
      className: "mean-np-key",
      onClick: function () { handleNumpadKey(key); },
    }, key);
  }

  function renderNumpad() {
    const withDecimal = activeField === "mean";
    const currentInput = activeField === "num" ? sumInput : activeField === "denom" ? countInput : meanInput;
    const inputOpts = { hasInput: !!currentInput };

    if (withDecimal) {
      return e("div", {
        className: "mean-numpad-wrap " + (showNumpad ? "visible" : ""),
      },
        e("div", { className: "mean-numpad-grid with-decimal" },
          [1, 2, 3, 4, 5, "backspace"].map(function (k) { return renderNumpadKey(k); }),
          [6, 7, 8, 9, 0, "."].map(function (k) { return renderNumpadKey(k); }),
          renderNumpadKey("submit", { tall: true, hasInput: !!currentInput })
        )
      );
    }

    return e("div", {
      className: "mean-numpad-wrap " + (showNumpad ? "visible" : ""),
    },
      e("div", { className: "mean-numpad-grid standard" },
        [1, 2, 3, 4, 5, "backspace"].map(function (k) { return renderNumpadKey(k); }),
        [6, 7, 8, 9, 0, "submit"].map(function (k) {
          return k === "submit"
            ? renderNumpadKey("submit", inputOpts)
            : renderNumpadKey(k);
        })
      )
    );
  }

  function renderCalcPanel() {
    return e("div", { className: "mean-dd-panel mean-step9-panel" },
      e("div", { className: "mean-dd-left" },
        e("div", { className: "mean-dd-formula" },
          e("span", { className: "mean-dd-zone correct" },
            renderDraggableText(getDraggable("mean").text)
          ),
          e("span", { className: "mean-dd-equals" }, "="),
          e("div", { className: "mean-dd-fraction" },
            renderStep9FractionBox("num"),
            e("div", { className: "mean-dd-bar" }),
            renderStep9FractionBox("denom")
          ),
          e("div", {
            className: "mean-calc-result " + (showResultBox ? "visible" : ""),
          },
            e("span", { className: "mean-dd-equals" }, "="),
            renderStep9MeanBox()
          )
        )
      ),
      renderNumpad()
    );
  }

  if (step === 8) {
    return e("div", { className: "main-canvas-container mean-canvas", ref: containerRef },
      e("div", { className: "mean-row sort-section expanded" }, renderDataSortRow()),
      e("div", { className: "mean-row data-section collapsed" }),
      e("div", { className: "mean-row mean-panel-row" }, renderDragDropPanel())
    );
  }

  if (step === 9) {
    return e("div", { className: "main-canvas-container mean-canvas", ref: containerRef },
      e("div", { className: "mean-row sort-section expanded" }, renderDataSortRow()),
      e("div", { className: "mean-row data-section collapsed" }),
      e("div", { className: "mean-row mean-panel-row" }, renderCalcPanel()),
      renderStep9FractionNudges()
    );
  }

  return null;
};
