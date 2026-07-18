const Mean = (props) => {
  const { step, initialStage, showNudges, onSetNextEnabled, onUpdateNavText, onUpdateQuestionText } = props;
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
  const [wrongPreview, setWrongPreview] = useState(null);
  const [hiddenSourceId, setHiddenSourceId] = useState(null);
  const [ddComplete, setDdComplete] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredZone, setHoveredZone] = useState(null);
  const [ghostSize, setGhostSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef(null);
  const sortSlotRefs = useRef([]);
  const sumSpanRefs = useRef([]);
  const lastCountBadgeRef = useRef(null);
  const numBoxRef = useRef(null);
  const denomBoxRef = useRef(null);
  const meanBoxRef = useRef(null);

  const [sumDone, setSumDone] = useState(false);
  const [countDone, setCountDone] = useState(false);
  const [meanDone, setMeanDone] = useState(false);
  const [showResultBox, setShowResultBox] = useState(false);
  const [countBadgeCount, setCountBadgeCount] = useState(0);
  const [isCountAnimating, setIsCountAnimating] = useState(false);
  const [glowField, setGlowField] = useState(null);
  const [showFractionNudges, setShowFractionNudges] = useState(true);
  const [activeField, setActiveField] = useState(null);
  const [sumAnimActive, setSumAnimActive] = useState(false);
  const [revealedSumTokens, setRevealedSumTokens] = useState({});
  const [sumShowAnswer, setSumShowAnswer] = useState(false);
  const [sumBlinking, setSumBlinking] = useState(false);
  const [isSumAnimating, setIsSumAnimating] = useState(false);
  const [denomAnimActive, setDenomAnimActive] = useState(false);
  const [denomBlinking, setDenomBlinking] = useState(false);
  const [flyingClones, setFlyingClones] = useState([]);
  const [flyingCountClone, setFlyingCountClone] = useState(null);

  function resetDragDrop() {
    setFilledZones({});
    setAvailableDraggables(dd.draggables.map(function (d) { return d.id; }));
    setShakeZone(null);
    setWrongPreview(null);
    setHiddenSourceId(null);
    setDdComplete(false);
    setDraggedItem(null);
    setIsDragging(false);
    setHoveredZone(null);
    setGhostSize({ width: 0, height: 0 });
  }

  function resetStep9() {
    setActiveField(null);
    setSumDone(false);
    setCountDone(false);
    setMeanDone(false);
    setShowResultBox(false);
    setGlowField(null);
    setCountBadgeCount(0);
    setIsCountAnimating(false);
    setSumAnimActive(false);
    setRevealedSumTokens({});
    setSumShowAnswer(false);
    setSumBlinking(false);
    setIsSumAnimating(false);
    setDenomAnimActive(false);
    setDenomBlinking(false);
    setFlyingClones([]);
    setFlyingCountClone(null);
    sumSpanRefs.current = [];
    sortSlotRefs.current = [];
    lastCountBadgeRef.current = null;
  }

  function restoreStep8Final() {
    setFilledZones({ left: "mean", num: "sum", denom: "count" });
    setAvailableDraggables([]);
    setDdComplete(true);
    onUpdateQuestionText(step8.completeQuestion);
    onUpdateNavText(step8.completeNav);
    onSetNextEnabled(true);
  }

  function restoreStep9Final() {
    resetStep9();
    setSumDone(true);
    setCountDone(true);
    setMeanDone(true);
    setSumShowAnswer(true);
    setShowResultBox(true);
    setShowFractionNudges(false);
    onUpdateQuestionText(step9.completeQuestion);
    onUpdateNavText(step9.completeNav);
    onSetNextEnabled(true);
  }

  useEffect(function () {
    if (step === 8) {
      if (initialStage === "final") {
        restoreStep8Final();
        return;
      }
      onSetNextEnabled(false);
      onUpdateQuestionText(step8.questionText);
      onUpdateNavText(step8.navText);
      resetDragDrop();
    }
    if (step === 9) {
      if (initialStage === "final") {
        restoreStep9Final();
        return;
      }
      onSetNextEnabled(false);
      onUpdateQuestionText(step9.questionText);
      onUpdateNavText(step9.navText);
      resetStep9();
      setShowFractionNudges(true);
    }
  }, [step, initialStage]);

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
    if (step !== 9 || initialStage === "final" || !sumDone || !countDone || showResultBox) return;
    const timer = setTimeout(function () {
      setShowResultBox(true);
      setCountBadgeCount(0);
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
          if (!filledZones[zoneId] && !(wrongPreview && wrongPreview.zoneId === zoneId)) {
            nextHover = zoneId;
          }
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
      if (droppedOn) {
        processDrop(draggedItem, droppedOn);
      } else {
        setHiddenSourceId(null);
      }
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
  }, [isDragging, draggedItem, filledZones, wrongPreview]);

  function getDraggable(id) {
    return dd.draggables.find(function (d) { return d.id === id; });
  }

  function getDraggableDisplayText(id) {
    const item = getDraggable(id);
    if (!item) return "";
    return item.text.split("\n");
  }

  function processDrop(draggableId, zoneId) {
    if (!draggableId || filledZones[zoneId] || wrongPreview) return;
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
      setHiddenSourceId(draggableId);
      setWrongPreview({ zoneId: zoneId, draggableId: draggableId });
      setShakeZone(zoneId);
      setTimeout(function () {
        setWrongPreview(null);
        setShakeZone(null);
        setHiddenSourceId(null);
      }, 650);
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
    const slots = [];
    sortedDataset.forEach(function (value, index) {
      const showBadge = step === 9 && countBadgeCount > index &&
        (isCountAnimating || activeField === "denom");
      const isLastBadge = showBadge && index === sortedDataset.length - 1 &&
        countBadgeCount === sortedDataset.length;
      slots.push(e("div", {
        className: "sort-slot filled" + (showBadge ? " sort-has-badge" : ""),
        key: "sort-slot-" + index,
        ref: function (node) { sortSlotRefs.current[index] = node; },
      },
        showBadge ? e("span", {
          className: "mean-count-badge",
          ref: isLastBadge ? function (node) { lastCountBadgeRef.current = node; } : null,
        }, index + 1) : null,
        value
      ));
    });
    return e("div", { className: "sort-row hide-commas" },
      e("div", { className: "sort-slots" }, slots)
    );
  }

  function renderDropZone(zoneId) {
    const isFilled = !!filledZones[zoneId];
    const isWrongPreview = wrongPreview && wrongPreview.zoneId === zoneId;
    const isShaking = shakeZone === zoneId;
    const isHovered = hoveredZone === zoneId && !isFilled && !isWrongPreview && draggedItem;
    let className = "mean-dd-zone";
    if (isFilled) className += " correct";
    if (isWrongPreview) className += " wrong shake wrong-preview";
    else if (isShaking) className += " shake";
    if (isHovered) className += " hovered";
    if (!isFilled && !isWrongPreview) className += " dd-empty";
    if (zoneId === "num" || zoneId === "denom") className += " fraction-zone";
    let content = step8.dropPlaceholder;
    if (isFilled) {
      content = renderDraggableText(getDraggable(filledZones[zoneId]).text);
    } else if (isWrongPreview) {
      content = renderDraggableText(getDraggable(wrongPreview.draggableId).text);
    }
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
            className: "mean-dd-draggable" + (draggedItem === item.id && isDragging ? " dragging" : "") + (hiddenSourceId === item.id ? " source-hidden" : ""),
            onPointerDown: function (ev) { handleDragPointerDown(ev, item.id); },
          }, renderDraggableText(item.text));
        })
      ),
      ghost
    );
  }

  function buildSumTokens() {
    const tokens = [];
    sortedDataset.forEach(function (value, index) {
      if (index > 0) {
        tokens.push({ type: "plus", id: "plus-" + index, text: "+" });
      }
      tokens.push({
        type: "digit",
        id: "digit-" + index,
        text: String(value),
        sortSlot: index,
        dataIndex: index,
      });
    });
    return tokens;
  }

  function getFlyMetrics(node) {
    const container = containerRef.current;
    if (!node || !container) return { x: 0, y: 0, fontSize: 16 };
    const cRect = container.getBoundingClientRect();
    const rect = node.getBoundingClientRect();
    const style = window.getComputedStyle(node);
    return {
      x: rect.left - cRect.left + rect.width / 2,
      y: rect.top - cRect.top + rect.height / 2,
      fontSize: parseFloat(style.fontSize) || rect.height * 0.65,
    };
  }

  function renderSumToken(token) {
    const isVisible = !!revealedSumTokens[token.id];
    return e("span", {
      key: token.id,
      ref: token.type === "digit"
        ? function (node) { sumSpanRefs.current[token.dataIndex] = node; }
        : null,
      className: [
        "step9-sum-token",
        token.type === "plus" ? "plus" : "digit",
        isVisible ? "visible" : "",
      ].join(" "),
    }, token.text);
  }

  function renderSumExpression() {
    const tokens = buildSumTokens();
    let digitSeen = 0;
    let splitIndex = tokens.length;
    const halfDigits = Math.floor(sortedDataset.length / 2);
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].type === "digit") {
        digitSeen += 1;
        if (digitSeen === halfDigits) {
          splitIndex = i + 1;
          break;
        }
      }
    }
    return e("span", { className: "step9-sum-expression" },
      e("span", { className: "step9-sum-line" }, tokens.slice(0, splitIndex).map(renderSumToken)),
      e("span", { className: "step9-sum-line" }, tokens.slice(splitIndex).map(renderSumToken))
    );
  }

  function flyDigitToNumerator(token, flyDuration, onComplete) {
    const fromNode = sortSlotRefs.current[token.sortSlot];
    const toNode = sumSpanRefs.current[token.dataIndex];
    if (!fromNode || !toNode) {
      onComplete();
      return;
    }
    const from = getFlyMetrics(fromNode);
    const to = getFlyMetrics(toNode);
    const cloneKey = "fly-" + token.id;
    setFlyingClones(function (prev) {
      return prev.concat([{
        key: cloneKey,
        value: token.text,
        from: from,
        to: to,
        durationMs: flyDuration,
      }]);
    });
    if (typeof playSound === "function") playSound("tick");
    setTimeout(function () {
      setFlyingClones(function (prev) {
        return prev.filter(function (c) { return c.key !== cloneKey; });
      });
      setRevealedSumTokens(function (prev) {
        const next = {};
        Object.keys(prev).forEach(function (k) { next[k] = prev[k]; });
        next[token.id] = true;
        if (token.dataIndex > 0) next["plus-" + token.dataIndex] = true;
        return next;
      });
      onComplete();
    }, flyDuration);
  }

  function runSumAnimation() {
    setIsSumAnimating(true);
    setSumAnimActive(true);
    setActiveField("num");
    setRevealedSumTokens({});
    setSumShowAnswer(false);
    onUpdateQuestionText(step9.sumQuestion);
    onUpdateNavText("");
    if (typeof playSound === "function") playSound("click");

    const digitTokens = buildSumTokens().filter(function (t) { return t.type === "digit"; });
    const totalFlyBudget = 3000;
    const initialDelay = 200;
    const flyDuration = Math.max(
      400,
      Math.floor((totalFlyBudget - initialDelay) / digitTokens.length) * 2
    );
    let index = 0;

    function flyNext() {
      if (index >= digitTokens.length) {
        onUpdateNavText("");
        setTimeout(function () {
          setSumBlinking(true);
          if (typeof playSound === "function") playSound("correct");
          setTimeout(function () {
            setSumShowAnswer(true);
            setSumBlinking(false);
            setSumDone(true);
            setSumAnimActive(false);
            setIsSumAnimating(false);
            setActiveField(null);
            onUpdateQuestionText(step9.sumCompleteQuestion);
            onUpdateNavText(countDone ? step9.countCompleteNav : step9.sumCompleteNav);
          }, 650);
        }, 1000);
        return;
      }
      flyDigitToNumerator(digitTokens[index], flyDuration, function () {
        index += 1;
        flyNext();
      });
    }

    setTimeout(flyNext, 200);
  }

  function flyCountToDenominator() {
    onUpdateNavText("");
    const fromNode = lastCountBadgeRef.current;
    const toNode = denomBoxRef.current;
    if (!fromNode || !toNode) {
      finishDenomAnimation();
      return;
    }
    const from = getFlyMetrics(fromNode);
    const to = getFlyMetrics(toNode);
    setFlyingCountClone({
      key: "fly-count-" + Date.now(),
      value: String(step9.countAnswer),
      from: from,
      to: to,
    });
    setTimeout(function () {
      setCountDone(true);
      setDenomBlinking(true);
      if (typeof playSound === "function") playSound("correct");
      requestAnimationFrame(function () {
        setFlyingCountClone(null);
      });
      setTimeout(finishDenomAnimation, 650);
    }, 580);
  }

  function finishDenomAnimation() {
    setDenomAnimActive(false);
    setDenomBlinking(false);
    setIsCountAnimating(false);
    setActiveField(null);
    setCountBadgeCount(0);
    onUpdateQuestionText(step9.countCompleteQuestion);
    onUpdateNavText(sumDone ? step9.countCompleteNav : step9.countCompleteNavAlt);
  }

  function getBoxDisplay(field) {
    if (field === "num") {
      if (sumDone || sumShowAnswer) return String(step9.sumAnswer);
      return null;
    }
    if (field === "denom") {
      if (countDone) return String(step9.countAnswer);
      return null;
    }
    return labels.mean;
  }

  function handleFieldClick(field) {
    if (step !== 9 || isCountAnimating || isSumAnimating) return;
    if (field === "num" && (sumDone || sumAnimActive)) return;
    if (field === "denom" && (countDone || denomAnimActive)) return;

    if (field === "num" || field === "denom") {
      setShowFractionNudges(false);
    }

    if (field === "num") {
      runSumAnimation();
      return;
    }

    if (field === "denom") {
      setDenomAnimActive(true);
      setActiveField("denom");
      setCountBadgeCount(0);
      onUpdateQuestionText(step9.countQuestion);
      onUpdateNavText("");
      if (typeof playSound === "function") playSound("click");
      runCountBadgeAnimation(function () {
        setTimeout(flyCountToDenominator, 500);
      });
    }
  }

  function runCountBadgeAnimation(onComplete) {
    setIsCountAnimating(true);
    setCountBadgeCount(0);
    let i = 0;
    function next() {
      if (i >= sortedDataset.length) {
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

  function handleMeanReveal() {
    if (meanDone || !showResultBox) return;
    if (typeof playSound === "function") playSound("click");
    onUpdateNavText("");
    setMeanDone(true);
    setTimeout(function () {
      if (typeof playSound === "function") playSound("correct");
      onUpdateQuestionText(step9.completeQuestion);
      onUpdateNavText(step9.completeNav);
      onSetNextEnabled(true);
    }, 600);
  }

  function renderStep9FractionBox(field) {
    const isDone = field === "num" ? sumDone : countDone;
    const isAnimating = field === "num"
      ? (sumAnimActive || isSumAnimating)
      : (denomAnimActive || isCountAnimating);
    const isClickable = field === "num"
      ? (!sumDone && !isSumAnimating && !sumAnimActive)
      : (!countDone && !isCountAnimating && !denomAnimActive);
    const isClicked = field === "num" ? sumAnimActive : denomAnimActive;
    const isBlinking = field === "num" ? sumBlinking : denomBlinking;
    const showExpression = field === "num" && sumAnimActive && !sumShowAnswer && !sumDone;
    const showAnswer = field === "num"
      ? (sumShowAnswer || sumDone)
      : countDone;

    const showFilled = isDone || showAnswer;
    const classes = [
      "mean-dd-zone",
      "fraction-zone",
      isClickable && !isClicked && !showFilled ? "correct step9-clickable" : "",
      (isClicked || isAnimating) && !showFilled ? "step9-clicked correct" : "",
      showFilled ? "step9-static step9-filled step9-has-value" : "",
      !isClickable && !showFilled && !isClicked && !isAnimating ? "step9-static" : "",
      isBlinking ? "step9-blink" : "",
    ].join(" ");

    let content = null;
    if (showAnswer) {
      content = getBoxDisplay(field);
    } else if (showExpression) {
      content = renderSumExpression();
    } else if (isClickable && !isClicked) {
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
    if (!showNudges || step !== 9 || !showFractionNudges || activeField || isSumAnimating || isCountAnimating) return null;
    return e(React.Fragment, null,
      e(Nudge, { targetRef: numBoxRef, show: !sumDone && !isSumAnimating }),
      e(Nudge, { targetRef: denomBoxRef, show: !countDone && !isCountAnimating })
    );
  }

  function renderStep9MeanBox() {
    return e("div", {
      className: "mean-flip-card" + (meanDone ? " flipped" : ""),
      ref: meanBoxRef,
    },
      e("div", { className: "mean-flip-card-inner" },
        e("button", {
          type: "button",
          className: "mean-flip-front",
          disabled: meanDone,
          onClick: handleMeanReveal,
        }, step9.revealLabel),
        e("div", { className: "mean-flip-back" }, step9.meanAnswer)
      )
    );
  }

  function renderStep9MeanNudge() {
    if (!showNudges || step !== 9 || !showResultBox || meanDone) return null;
    return e(Nudge, { targetRef: meanBoxRef, show: true });
  }

  function renderFlyingClones() {
    const clones = flyingClones.map(function (clone) {
      return e("div", {
        className: "flying-step9-clone",
        key: clone.key,
        style: {
          "--from-x": clone.from.x + "px",
          "--from-y": clone.from.y + "px",
          "--to-x": clone.to.x + "px",
          "--to-y": clone.to.y + "px",
          "--from-font-size": clone.from.fontSize + "px",
          "--to-font-size": clone.to.fontSize + "px",
          "--fly-duration": ((clone.durationMs || 580) / 1000) + "s",
        },
      }, clone.value);
    });
    if (flyingCountClone) {
      clones.push(e("div", {
        className: "flying-step9-clone",
        key: flyingCountClone.key,
        style: {
          "--from-x": flyingCountClone.from.x + "px",
          "--from-y": flyingCountClone.from.y + "px",
          "--to-x": flyingCountClone.to.x + "px",
          "--to-y": flyingCountClone.to.y + "px",
          "--from-font-size": flyingCountClone.from.fontSize + "px",
          "--to-font-size": flyingCountClone.to.fontSize + "px",
        },
      }, flyingCountClone.value));
    }
    if (!clones.length) return null;
    return e("div", { className: "step9-flying-layer" }, clones);
  }

  function renderCalcPanel() {
    return e("div", { className: "mean-dd-panel mean-step9-panel" },
      e("div", { className: "mean-dd-left" },
        e("div", { className: "mean-dd-formula" },
          e("span", { className: "mean-dd-zone step9-static" },
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
      )
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
      renderFlyingClones(),
      renderStep9FractionNudges(),
      renderStep9MeanNudge()
    );
  }

  return null;
};
