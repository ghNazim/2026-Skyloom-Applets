var MainCanvas = function (props) {
  var step = props.step;
  var onSetNextEnabled = props.onSetNextEnabled;
  var onUpdateNavText = props.onUpdateNavText;
  var onUpdateQuestionText = props.onUpdateQuestionText;
  var useState = React.useState;
  var useEffect = React.useEffect;
  var useRef = React.useRef;
  var e = React.createElement;

  var S1 = APP_DATA.steps[1];
  var S2 = APP_DATA.steps[2];
  var dataset = APP_DATA.dataset;
  var sortedDataset = APP_DATA.sortedDataset;
  var sortMapping = APP_DATA.sortMapping;
  var N = dataset.length;

  var _order = useState(S1.initialOrder.slice());
  var order = _order[0];
  var setOrder = _order[1];
  var _lockedRows = useState({});
  var lockedRows = _lockedRows[0];
  var setLockedRows = _lockedRows[1];
  var _draggedIndex = useState(null);
  var draggedIndex = _draggedIndex[0];
  var setDraggedIndex = _draggedIndex[1];
  var _hoverIndex = useState(null);
  var hoverIndex = _hoverIndex[0];
  var setHoverIndex = _hoverIndex[1];
  var _dragPosition = useState({ x: 0, y: 0 });
  var dragPosition = _dragPosition[0];
  var setDragPosition = _dragPosition[1];
  var _dragOffset = useState({ x: 0, y: 0 });
  var dragOffset = _dragOffset[0];
  var setDragOffset = _dragOffset[1];
  var _ghostSize = useState({ width: 0, height: 0 });
  var ghostSize = _ghostSize[0];
  var setGhostSize = _ghostSize[1];

  var _phase = useState("arrange");
  var phase = _phase[0];
  var setPhase = _phase[1];
  var _showStepPanel = useState(true);
  var showStepPanel = _showStepPanel[0];
  var setShowStepPanel = _showStepPanel[1];
  var _actionVisible = useState(false);
  var actionVisible = _actionVisible[0];
  var setActionVisible = _actionVisible[1];
  var _activeAction = useState(null);
  var activeAction = _activeAction[0];
  var setActiveAction = _activeAction[1];
  var _inProgressAction = useState(null);
  var inProgressAction = _inProgressAction[0];
  var setInProgressAction = _inProgressAction[1];
  var _exploredActions = useState({});
  var exploredActions = _exploredActions[0];
  var setExploredActions = _exploredActions[1];
  var _displayData = useState(dataset.slice());
  var displayData = _displayData[0];
  var setDisplayData = _displayData[1];
  var _showData = useState(false);
  var showData = _showData[0];
  var setShowData = _showData[1];
  var _showSortLabels = useState(false);
  var showSortLabels = _showSortLabels[0];
  var setShowSortLabels = _showSortLabels[1];
  var _countByIndex = useState({});
  var countByIndex = _countByIndex[0];
  var setCountByIndex = _countByIndex[1];
  var _countBoxValue = useState("");
  var countBoxValue = _countBoxValue[0];
  var setCountBoxValue = _countBoxValue[1];
  var _showCountRow = useState(false);
  var showCountRow = _showCountRow[0];
  var setShowCountRow = _showCountRow[1];
  var _countComplete = useState(false);
  var countComplete = _countComplete[0];
  var setCountComplete = _countComplete[1];
  var _showUpdown = useState(false);
  var showUpdown = _showUpdown[0];
  var setShowUpdown = _showUpdown[1];
  var _badgeMode = useState("normal");
  var badgeMode = _badgeMode[0];
  var setBadgeMode = _badgeMode[1];

  var containerRef = useRef(null);
  var overlayRef = useRef(null);
  var optionRefs = useRef([]);
  var optionRefById = useRef({});
  var actionRefs = useRef([]);
  var circleRefs = useRef([]);
  var rowStrideRef = useRef(0);
  var optionHeightRef = useRef(0);
  var dragAnchorXRef = useRef(0);
  var idleTimerRef = useRef(null);
  var animationTimerRef = useRef(null);

  function clearTimer(ref) {
    if (ref.current) clearTimeout(ref.current);
    ref.current = null;
  }

  function copyObject(obj) {
    var next = {};
    Object.keys(obj || {}).forEach(function (key) {
      next[key] = obj[key];
    });
    return next;
  }

  function renderMarkup(text) {
    return { __html: text };
  }

  function relativeRect(node) {
    var root = containerRef.current;
    if (!node || !root) return { left: 0, top: 0, width: 0, height: 0 };
    var rootRect = root.getBoundingClientRect();
    var rect = node.getBoundingClientRect();
    return {
      left: rect.left - rootRect.left,
      top: rect.top - rootRect.top,
      width: rect.width,
      height: rect.height,
    };
  }

  function clearOverlay() {
    if (overlayRef.current) overlayRef.current.innerHTML = "";
  }

  function resetPracticeState() {
    setPhase("intro");
    setShowStepPanel(true);
    setActionVisible(false);
    setActiveAction(null);
    setInProgressAction(null);
    setExploredActions({});
    setDisplayData(dataset.slice());
    setShowData(false);
    setShowSortLabels(false);
    setCountByIndex({});
    setCountBoxValue("");
    setShowCountRow(false);
    setCountComplete(false);
    setShowUpdown(false);
    setBadgeMode("normal");
    clearOverlay();
    clearTimer(idleTimerRef);
    clearTimer(animationTimerRef);
  }

  useEffect(function () {
    if (step === 1) {
      setOrder(S1.initialOrder.slice());
      setLockedRows({});
      setDraggedIndex(null);
      setHoverIndex(null);
      setPhase("arrange");
      setShowStepPanel(true);
      setActionVisible(false);
      setShowData(false);
      setShowCountRow(false);
      clearOverlay();
      onSetNextEnabled(false);
      onUpdateQuestionText(S1.questionText);
      onUpdateNavText(S1.navText);
    }
    if (step === 2) {
      resetPracticeState();
      onSetNextEnabled(false);
      onUpdateQuestionText(S2.questionText);
      onUpdateNavText(S2.navText);
      animationTimerRef.current = setTimeout(function () {
        animateOptionsToActionButtons();
      }, 180);
    }
    return function () {
      clearTimer(idleTimerRef);
      clearTimer(animationTimerRef);
    };
  }, [step]);

  function getPreviewOrder() {
    if (draggedIndex === null || hoverIndex === null || draggedIndex === hoverIndex) {
      return order;
    }
    var next = order.slice();
    var temp = next[draggedIndex];
    next[draggedIndex] = next[hoverIndex];
    next[hoverIndex] = temp;
    return next;
  }

  function getRowFromPointerY(pointerY) {
    var firstNode = optionRefs.current[0];
    if (!firstNode || !rowStrideRef.current) return null;
    var parent = firstNode.parentElement;
    if (!parent) return null;
    var relativeY = pointerY - parent.getBoundingClientRect().top;
    var row = Math.floor(relativeY / rowStrideRef.current);
    if (row < 0 || row >= order.length) return null;
    return row;
  }

  function handlePointerDown(event, index) {
    if (step !== 1 || lockedRows[index]) return;
    event.preventDefault();
    var rect = event.currentTarget.getBoundingClientRect();
    var gapPx = window.innerWidth * 0.0135;
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
      var nextHover = getRowFromPointerY(event.clientY);
      if (nextHover !== null && !lockedRows[nextHover]) setHoverIndex(nextHover);
    }

    function onUp() {
      var preview = getPreviewOrder();
      var nextLocked = {};
      var newlyLocked = false;
      Object.keys(lockedRows).forEach(function (key) {
        nextLocked[key] = lockedRows[key];
      });

      preview.forEach(function (id, index) {
        if (id === S1.correctOrder[index]) {
          if (!lockedRows[index]) newlyLocked = true;
          nextLocked[index] = true;
        }
      });

      var complete = S1.correctOrder.every(function (id, index) {
        return preview[index] === id;
      });

      setOrder(preview);
      setLockedRows(nextLocked);
      setDraggedIndex(null);
      setHoverIndex(null);

      if (complete) {
        if (typeof playSound === "function") playSound("congrats");
        onUpdateQuestionText(S1.completeQuestion);
        onUpdateNavText(S1.completeNav);
        onSetNextEnabled(true);
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

  function makeFlyTextClone(sourceNode, targetNode, html, className) {
    var from = relativeRect(sourceNode);
    var to = relativeRect(targetNode);
    var clone = document.createElement("div");
    clone.className = className;
    clone.innerHTML = html;
    clone.style.left = from.left + "px";
    clone.style.top = from.top + "px";
    clone.style.width = from.width + "px";
    clone.style.height = from.height + "px";
    overlayRef.current.appendChild(clone);
    return { node: clone, to: to };
  }

  function animateOptionsToActionButtons() {
    if (step !== 2 || !overlayRef.current) return;
    var clones = [];
    S1.correctOrder.forEach(function (id, index) {
      var sourceNode = optionRefById.current[id];
      var targetNode = actionRefs.current[index];
      if (sourceNode && targetNode) {
        clones.push(makeFlyTextClone(sourceNode, targetNode, S1.options[id], "step-text-clone"));
      }
    });

    setShowStepPanel(false);

    if (!clones.length || typeof gsap !== "object") {
      setActionVisible(true);
      setShowData(true);
      setActiveAction(0);
      setPhase("sortReady");
      onUpdateNavText(S2.sortReadyNav);
      return;
    }

    var tl = gsap.timeline({
      onComplete: function () {
        clones.forEach(function (clone) {
          clone.node.remove();
        });
        setActionVisible(true);
        setShowData(true);
        setActiveAction(0);
        setPhase("sortReady");
        onUpdateNavText(S2.sortReadyNav);
      },
    });

    clones.forEach(function (clone) {
      tl.to(
        clone.node,
        {
          left: clone.to.left,
          top: clone.to.top,
          width: clone.to.width,
          height: clone.to.height,
          duration: 0.86,
          ease: "power2.inOut",
        },
        0,
      );
    });
  }

  function animateSortData() {
    var circles = circleRefs.current;
    if (!overlayRef.current || !circles[0]) {
      setDisplayData(sortedDataset.slice());
      finishSortData();
      return;
    }

    var positions = [];
    for (var i = 0; i < N; i++) positions.push(relativeRect(circles[i]));

    var clones = [];
    for (var j = 0; j < N; j++) {
      var clone = document.createElement("div");
      clone.className = "median-num-circle sort-clone";
      clone.textContent = dataset[j];
      clone.style.left = positions[j].left + "px";
      clone.style.top = positions[j].top + "px";
      clone.style.width = positions[j].width + "px";
      clone.style.height = positions[j].height + "px";
      overlayRef.current.appendChild(clone);
      clones.push(clone);
      if (circles[j]) circles[j].style.visibility = "hidden";
    }

    if (typeof gsap !== "object") {
      clones.forEach(function (clone) { clone.remove(); });
      setDisplayData(sortedDataset.slice());
      finishSortData();
      return;
    }

    var tl = gsap.timeline({
      onComplete: function () {
        setDisplayData(sortedDataset.slice());
        requestAnimationFrame(function () {
          clones.forEach(function (clone) { clone.remove(); });
          circleRefs.current.forEach(function (circle) {
            if (circle) circle.style.visibility = "";
          });
          finishSortData();
        });
      },
    });

    clones.forEach(function (clone, index) {
      var target = positions[sortMapping[index]];
      tl.to(
        clone,
        {
          left: target.left,
          top: target.top,
          duration: 0.9,
          ease: "power2.inOut",
        },
        0.03 * index,
      );
    });
  }

  function finishSortData() {
    setShowSortLabels(true);
    setInProgressAction(null);
    setExploredActions({ 0: true });
    setActiveAction(1);
    setPhase("countReady");
    onUpdateQuestionText(S2.sortedQuestion);
    onUpdateNavText(S2.sortedNav);
    if (typeof playSound === "function") playSound("tick");
  }

  function beginSorting() {
    if (phase !== "sortReady") return;
    if (typeof playSound === "function") playSound("click");
    setActiveAction(null);
    setInProgressAction(0);
    setPhase("sorting");
    onUpdateQuestionText(S2.sortingQuestion);
    onUpdateNavText(S2.sortingNav);
    animationTimerRef.current = setTimeout(animateSortData, 100);
  }

  function beginCounting() {
    if (phase !== "countReady") return;
    if (typeof playSound === "function") playSound("click");
    setActiveAction(null);
    setInProgressAction(1);
    setPhase("counting");
    setShowCountRow(true);
    setCountByIndex({});
    setCountBoxValue("");
    setCountComplete(false);
    setBadgeMode("normal");
    setShowUpdown(true);
    onUpdateQuestionText(S2.countQuestion);
    onUpdateNavText(S2.countNav);
  }

  function scheduleCountHint() {
    clearTimer(idleTimerRef);
    idleTimerRef.current = setTimeout(function () {
      setShowUpdown(true);
    }, 5000);
  }

  function completeCounting(nextCounts) {
    clearTimer(idleTimerRef);
    setCountComplete(true);
    setBadgeMode("shrinking");
    setTimeout(function () {
      var sequential = {};
      for (var i = 0; i < N; i++) sequential[i] = i + 1;
      setCountByIndex(sequential);
      setBadgeMode("stagger");
      setTimeout(function () {
        setInProgressAction(null);
        setExploredActions({ 0: true, 1: true });
        setActiveAction(2);
        setPhase("middleReady");
        onUpdateQuestionText(S2.countCompleteQuestion);
        onUpdateNavText(S2.countCompleteNav);
        if (typeof playSound === "function") playSound("congrats");
      }, 980);
    }, 330);
  }

  function handleCircleClick(index) {
    if (phase !== "counting" || countByIndex[index]) return;
    var nextCount = Object.keys(countByIndex).length + 1;
    var nextCounts = copyObject(countByIndex);
    nextCounts[index] = nextCount;
    setCountByIndex(nextCounts);
    setCountBoxValue(String(nextCount));
    setShowUpdown(false);
    if (typeof playSound === "function") playSound("tick");
    if (nextCount >= N) {
      completeCounting(nextCounts);
    } else {
      scheduleCountHint();
    }
  }

  function handleActionClick(index) {
    if (index === 0) beginSorting();
    if (index === 1) beginCounting();
    if (index === 2 && phase === "middleReady" && typeof playSound === "function") {
      playSound("click");
    }
  }

  function renderStepsPanel() {
    var previewOrder = getPreviewOrder();
    var previewRowById = {};
    previewOrder.forEach(function (id, rowIndex) {
      previewRowById[id] = rowIndex;
    });

    return e(
      "div",
      { className: "median-steps-panel" + (!showStepPanel ? " is-hidden" : "") },
      e(
        "div",
        { className: "median-step-labels" },
        S1.stepLabels.map(function (label, index) {
          return e(
            "div",
            {
              className:
                "median-step-label" + (lockedRows[index] ? " correct-label" : ""),
              key: "step-label-" + index,
            },
            label,
          );
        }),
      ),
      e(
        "div",
        { className: "median-step-options" + (draggedIndex !== null ? " is-dragging" : "") },
        order.map(function (id, index) {
          var previewRow = previewRowById[id];
          var slideDelta = draggedIndex !== null ? previewRow - index : 0;
          var isDraggingThis = draggedIndex !== null && index === draggedIndex;
          var style =
            slideDelta !== 0 && rowStrideRef.current
              ? { transform: "translateY(" + slideDelta * rowStrideRef.current + "px)" }
              : null;

          return e("button", {
            type: "button",
            key: "step-option-" + id,
            ref: function (node) {
              optionRefs.current[index] = node;
              if (node) optionRefById.current[id] = node;
            },
            className: [
              "median-step-option",
              current_language === "id" ? "id" : "",
              lockedRows[index] ? "correct" : "",
              isDraggingThis ? "dragging-hidden" : "",
            ].join(" "),
            style: style,
            disabled: step !== 1 || lockedRows[index],
            onPointerDown: function (event) {
              handlePointerDown(event, index);
            },
            dangerouslySetInnerHTML: renderMarkup(S1.options[id]),
          });
        }),
        draggedIndex !== null && hoverIndex !== null && !lockedRows[hoverIndex] && rowStrideRef.current
          ? e("div", {
            className: "median-step-drop-placeholder",
            style: {
              top: hoverIndex * rowStrideRef.current + "px",
              height: optionHeightRef.current + "px",
            },
          })
          : null,
      ),
    );
  }

  function renderActionButtons() {
    return e(
      "div",
      { className: "median-action-row" },
      S2.actionButtons.map(function (label, index) {
        var cls = "median-action-button";
        if (actionVisible) cls += " is-visible";
        if (activeAction === index) cls += " active";
        if (inProgressAction === index) cls += " in-progress";
        if (exploredActions[index]) cls += " explored";
        if (activeAction !== index && inProgressAction !== index && !exploredActions[index]) cls += " inactive";
        var disabled = activeAction !== index;
        return e(
          "button",
          {
            type: "button",
            key: "action-" + index,
            ref: function (node) {
              actionRefs.current[index] = node;
            },
            className: cls,
            disabled: disabled,
            onClick: function () {
              handleActionClick(index);
            },
            dangerouslySetInnerHTML: renderMarkup(label),
          },
        );
      }),
      activeAction !== null
        ? e(Nudge, { targetRef: actionRefs.current[activeAction] ? { current: actionRefs.current[activeAction] } : actionRefs, show: true })
        : null,
    );
  }

  function renderDataRow() {
    if (!showData) return null;
    return e(
      "div",
      { className: "median-data-wrap" },
      showSortLabels
        ? e("div", { className: "sort-label sort-smallest" }, S2.smallest)
        : null,
      showSortLabels
        ? e("div", { className: "sort-label sort-largest" }, S2.largest)
        : null,
      e(
        "div",
        { className: "median-data-row" },
        displayData.map(function (value, index) {
          var counted = countByIndex[index];
          var clickable = phase === "counting" && !counted;
          var cls = "median-num-circle";
          if (clickable && showUpdown) cls += " updown";
          if (counted) cls += " counted";
          return e(
            "button",
            {
              type: "button",
              key: "num-" + index + "-" + value,
              className: cls,
              ref: function (node) {
                circleRefs.current[index] = node;
              },
              disabled: !clickable,
              onClick: function () {
                handleCircleClick(index);
              },
            },
            counted
              ? e(
                "span",
                {
                  className: "median-count-badge " + badgeMode,
                  style: badgeMode === "stagger" ? { animationDelay: index * 0.08 + "s" } : null,
                },
                counted,
              )
              : null,
            e("span", { className: "median-num-value" }, value),
          );
        }),
      ),
    );
  }

  function renderCountRow() {
    if (!showCountRow) return null;
    return e(
      "div",
      { className: "median-count-panel" },
      e(
        "div",
        { className: "median-count-expression" },
        e("span", { className: "median-count-symbol" }, S2.countSymbol + " ="),
        e("span", { className: "median-count-box" + (countComplete ? " complete" : "") }, countBoxValue),
      ),
    );
  }

  var ghost = draggedIndex !== null
    ? e("div", {
      className: "median-drag-ghost" + (current_language === "id" ? " id" : ""),
      style: {
        left: dragPosition.x - dragOffset.x,
        top: dragPosition.y - dragOffset.y,
        width: ghostSize.width,
        height: ghostSize.height,
      },
      dangerouslySetInnerHTML: renderMarkup(S1.options[order[draggedIndex]]),
    })
    : null;

  return e(
    "div",
    {
      className: "main-canvas-container median-practice-canvas phase-" + phase,
      ref: containerRef,
    },
    e(
      "div",
      { className: "median-visual-row" },
      showStepPanel ? renderStepsPanel() : null,
      renderDataRow(),
      renderCountRow(),
    ),
    renderActionButtons(),
    ghost,
    e("div", { className: "median-animation-overlay", ref: overlayRef }),
  );
};
