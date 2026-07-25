var MainCanvas = function (props) {
  var step = props.step;
  var challengeIndex = props.challengeIndex || 0;
  var onSetNextEnabled = props.onSetNextEnabled;
  var onUpdateNavText = props.onUpdateNavText;
  var onUpdateQuestionText = props.onUpdateQuestionText;
  var onSetAnimating = props.onSetAnimating;
  var useState = React.useState;
  var useEffect = React.useEffect;
  var useRef = React.useRef;
  var e = React.createElement;

  var S1 = APP_DATA.steps[1];
  var baseStep2 = APP_DATA.steps[2];
  var challenge = APP_DATA.challenges && APP_DATA.challenges[challengeIndex]
    ? APP_DATA.challenges[challengeIndex]
    : APP_DATA;
  var S2 = {};
  Object.keys(baseStep2).forEach(function (key) {
    S2[key] = baseStep2[key];
  });
  Object.keys(challenge.texts || {}).forEach(function (key) {
    S2[key] = challenge.texts[key];
  });
  if (challenge.medianAnswer) S2.medianAnswer = challenge.medianAnswer;
  var dataset = challenge.dataset || APP_DATA.dataset;
  var sortedDataset = challenge.sortedDataset || APP_DATA.sortedDataset;
  var sortMapping = challenge.sortMapping || APP_DATA.sortMapping;
  var middleCorrectOption = challenge.middleCorrectOption !== undefined ? challenge.middleCorrectOption : 1;
  var middlePositions = challenge.middlePositions || [5, 6];
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
  var _showStepDragNudge = useState(true);
  var showStepDragNudge = _showStepDragNudge[0];
  var setShowStepDragNudge = _showStepDragNudge[1];

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
  var _bottomParentExpanded = useState(false);
  var bottomParentExpanded = _bottomParentExpanded[0];
  var setBottomParentExpanded = _bottomParentExpanded[1];
  var _countComplete = useState(false);
  var countComplete = _countComplete[0];
  var setCountComplete = _countComplete[1];
  var _showUpdown = useState(false);
  var showUpdown = _showUpdown[0];
  var setShowUpdown = _showUpdown[1];
  var _badgeMode = useState("normal");
  var badgeMode = _badgeMode[0];
  var setBadgeMode = _badgeMode[1];
  var _showMiddlePanel = useState(false);
  var showMiddlePanel = _showMiddlePanel[0];
  var setShowMiddlePanel = _showMiddlePanel[1];
  var _middleChoice = useState(null);
  var middleChoice = _middleChoice[0];
  var setMiddleChoice = _middleChoice[1];
  var _middleChoiceState = useState(null);
  var middleChoiceState = _middleChoiceState[0];
  var setMiddleChoiceState = _middleChoiceState[1];
  var _showCorrectOnly = useState(false);
  var showCorrectOnly = _showCorrectOnly[0];
  var setShowCorrectOnly = _showCorrectOnly[1];
  var _expressionStage = useState(0);
  var expressionStage = _expressionStage[0];
  var setExpressionStage = _expressionStage[1];
  var _selectedPositions = useState({});
  var selectedPositions = _selectedPositions[0];
  var setSelectedPositions = _selectedPositions[1];
  var _positionFeedback = useState({});
  var positionFeedback = _positionFeedback[0];
  var setPositionFeedback = _positionFeedback[1];
  var _showPositionUpdown = useState(false);
  var showPositionUpdown = _showPositionUpdown[0];
  var setShowPositionUpdown = _showPositionUpdown[1];
  var _showMedianPanel = useState(false);
  var showMedianPanel = _showMedianPanel[0];
  var setShowMedianPanel = _showMedianPanel[1];
  var _medianInput = useState("");
  var medianInput = _medianInput[0];
  var setMedianInput = _medianInput[1];
  var _medianAnswerState = useState(null);
  var medianAnswerState = _medianAnswerState[0];
  var setMedianAnswerState = _medianAnswerState[1];
  var _medianFreshAfterWrong = useState(false);
  var medianFreshAfterWrong = _medianFreshAfterWrong[0];
  var setMedianFreshAfterWrong = _medianFreshAfterWrong[1];

  var containerRef = useRef(null);
  var overlayRef = useRef(null);
  var optionRefs = useRef([]);
  var stepDragNudgeRef = useRef(null);
  var optionRefById = useRef({});
  var actionRefs = useRef([]);
  var circleRefs = useRef([]);
  var countBoxRef = useRef(null);
  var expressionNRef = useRef(null);
  var rowStrideRef = useRef(0);
  var optionHeightRef = useRef(0);
  var dragAnchorXRef = useRef(0);
  var idleTimerRef = useRef(null);
  var animationTimerRef = useRef(null);
  var animDepthRef = useRef(0);

  function pushAnimating() {
    animDepthRef.current += 1;
    if (animDepthRef.current === 1 && onSetAnimating) onSetAnimating(true);
  }

  function popAnimating() {
    animDepthRef.current = Math.max(0, animDepthRef.current - 1);
    if (animDepthRef.current === 0 && onSetAnimating) onSetAnimating(false);
  }

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
    return { __html: formatDisplayText(text) };
  }

  function ordinalSuffix(num) {
    var mod100 = num % 100;
    if (mod100 >= 11 && mod100 <= 13) return "th";
    if (num % 10 === 1) return "st";
    if (num % 10 === 2) return "nd";
    if (num % 10 === 3) return "rd";
    return "th";
  }

  function ordinalHtml(num) {
    if (current_language === "id") {
      return "ke-" + String(num);
    }
    return String(num) + "<sup>" + ordinalSuffix(num) + "</sup>";
  }

  function fillPositionText(text, position, nextPosition) {
    return text
      .replace(/\{position\}/g, ordinalHtml(position))
      .replace(/\{nextPosition\}/g, ordinalHtml(nextPosition));
  }

  function renderFractionExpression(kind) {
    var numerator = kind === "odd" ? e(React.Fragment, null, e("mi", null, "n"), "+1") : e("mi", null, "n");
    var fraction = e(
      "span",
      { className: "middle-fraction-wrap" },
      e("span", { className: "middle-paren" }, "("),
      e(
        "span",
        { className: "middle-fraction" },
        e("span", { className: "middle-frac-num" }, numerator),
        e("span", { className: "middle-frac-bar" }),
        e("span", { className: "middle-frac-den" }, "2"),
      ),
      e("span", { className: "middle-paren" }, ")"),
    );
    if (current_language === "id") {
      return e(React.Fragment, null, "ke-", fraction);
    }
    return e(React.Fragment, null, fraction, e("sup", null, "th"));
  }

  function renderMiddleOptionContent(index) {
    if (index === 0) {
      return e(
        React.Fragment,
        null,
        renderFractionExpression("odd"),
        e("span", { className: "middle-option-text" }, " " + S2.valueText),
      );
    }
    return e(
      React.Fragment,
      null,
      renderFractionExpression("even"),
      e("span", { className: "middle-option-text" }, " " + S2.nextValueText),
    );
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
    setBottomParentExpanded(false);
    setCountComplete(false);
    setShowUpdown(false);
    setBadgeMode("normal");
    setShowMiddlePanel(false);
    setMiddleChoice(null);
    setMiddleChoiceState(null);
    setShowCorrectOnly(false);
    setExpressionStage(0);
    setSelectedPositions({});
    setPositionFeedback({});
    setShowPositionUpdown(false);
    setShowMedianPanel(false);
    setMedianInput("");
    setMedianAnswerState(null);
    setMedianFreshAfterWrong(false);
    clearOverlay();
    clearTimer(idleTimerRef);
    clearTimer(animationTimerRef);
    animDepthRef.current = 0;
    if (onSetAnimating) onSetAnimating(false);
  }

  useEffect(function () {
    if (step === 1) {
      setOrder(S1.initialOrder.slice());
      setLockedRows({});
      setDraggedIndex(null);
      setHoverIndex(null);
      setShowStepDragNudge(true);
      setPhase("arrange");
      setShowStepPanel(true);
      setActionVisible(false);
      setShowData(false);
      setShowCountRow(false);
      setShowMiddlePanel(false);
      setSelectedPositions({});
      setPositionFeedback({});
      setShowMedianPanel(false);
      setMedianInput("");
      setMedianAnswerState(null);
      setMedianFreshAfterWrong(false);
      clearOverlay();
      onSetNextEnabled(false);
      onUpdateQuestionText(S1.questionText);
      onUpdateNavText(S1.navText);
    }
    if (step === 2) {
      resetPracticeState();
      onSetNextEnabled(false);
      onUpdateQuestionText(S2.questionText);
      onUpdateNavText(challengeIndex > 0 ? S2.sortReadyNav : S2.navText);
      if (challengeIndex > 0) {
        setShowStepPanel(false);
        setActionVisible(true);
        setShowData(true);
        setActiveAction(0);
        setPhase("sortReady");
        return undefined;
      }
      pushAnimating();
      animationTimerRef.current = setTimeout(function () {
        animateOptionsToActionButtons();
      }, 180);
    }
    return function () {
      clearTimer(idleTimerRef);
      clearTimer(animationTimerRef);
      animDepthRef.current = 0;
      if (onSetAnimating) onSetAnimating(false);
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
    setShowStepDragNudge(false);
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
      popAnimating();
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
        popAnimating();
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
    popAnimating();
  }

  function beginSorting() {
    if (phase !== "sortReady") return;
    if (typeof playSound === "function") playSound("click");
    setActiveAction(null);
    setInProgressAction(0);
    setPhase("sorting");
    onUpdateQuestionText(S2.sortingQuestion);
    onUpdateNavText(S2.sortingNav);
    pushAnimating();
    animationTimerRef.current = setTimeout(animateSortData, 100);
  }

  function beginCounting() {
    if (phase !== "countReady") return;
    if (typeof playSound === "function") playSound("click");
    setActiveAction(null);
    setInProgressAction(1);
    setPhase("counting");
    setShowCountRow(true);
    setBottomParentExpanded(false);
    setCountByIndex({});
    setCountBoxValue("");
    setCountComplete(false);
    setBadgeMode("normal");
    setShowUpdown(true);
    onUpdateQuestionText(S2.countQuestion);
    onUpdateNavText(S2.countNav);
    pushAnimating();
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        setBottomParentExpanded(true);
      });
    });
    animationTimerRef.current = setTimeout(function () {
      popAnimating();
    }, 480);
  }

  function scheduleCountHint() {
    clearTimer(idleTimerRef);
    idleTimerRef.current = setTimeout(function () {
      setShowUpdown(true);
    }, 5000);
  }

  function finishCountingStep() {
    clearTimer(idleTimerRef);
    setCountComplete(true);
    setInProgressAction(null);
    setExploredActions({ 0: true, 1: true });
    setActiveAction(2);
    setPhase("middleReady");
    onUpdateQuestionText(S2.countCompleteQuestion);
    onUpdateNavText(S2.countCompleteNav);
    if (typeof playSound === "function") playSound("congrats");
  }

  function reorderCountBadges() {
    clearTimer(idleTimerRef);
    setShowUpdown(false);
    setPhase("countReordering");
    pushAnimating();
    setBadgeMode("shrinking");
    animationTimerRef.current = setTimeout(function () {
      var orderedCounts = {};
      for (var i = 0; i < N; i++) orderedCounts[i] = i + 1;
      setCountByIndex(orderedCounts);
      setCountBoxValue(String(N));
      setBadgeMode("stagger");
      var staggerDuration = 280 + (N - 1) * 80 + 120;
      animationTimerRef.current = setTimeout(function () {
        setBadgeMode("normal");
        setPhase("counting");
        finishCountingStep();
        popAnimating();
      }, staggerDuration);
    }, 300);
  }

  function beginMiddlePosition() {
    if (phase !== "middleReady") return;
    if (typeof playSound === "function") playSound("click");
    setActiveAction(null);
    setInProgressAction(2);
    setPhase("middleIntro");
    onUpdateQuestionText(S2.middleQuestion);
    onUpdateNavText(S2.middleInitialNav);
    setBadgeMode("shrinking");
    setShowUpdown(false);
    clearTimer(idleTimerRef);
    pushAnimating();
    animationTimerRef.current = setTimeout(function () {
      setCountByIndex({});
      setShowMiddlePanel(true);
      setMiddleChoice(null);
      setMiddleChoiceState(null);
      setShowCorrectOnly(false);
      setExpressionStage(0);
      setPhase("middleMcq");
      onUpdateNavText(S2.middleChoiceNav);
      popAnimating();
    }, 360);
  }

  function handleMiddleChoice(index) {
    if (phase !== "middleMcq" || middleChoiceState === "correct") return;
    setMiddleChoice(index);
    if (index !== middleCorrectOption) {
      setMiddleChoiceState("wrong");
      onUpdateQuestionText(S2.wrongMiddleQuestion);
      if (typeof playSound === "function") playSound("wrong");
      setTimeout(function () {
        setMiddleChoice(null);
        setMiddleChoiceState(null);
      }, 520);
      return;
    }

    setMiddleChoiceState("correct");
    if (typeof playSound === "function") playSound("correct");
    pushAnimating();
    setTimeout(function () {
      setShowCorrectOnly(true);
      onUpdateQuestionText(S2.correctMiddleQuestion);
      onUpdateNavText("");
      setTimeout(function () {
        animateCountIntoExpression();
      }, 620);
    }, 700);
  }

  function animateCountIntoExpression() {
    var fromNode = countBoxRef.current;
    var toNode = expressionNRef.current;
    if (!fromNode || !toNode || !overlayRef.current || typeof gsap !== "object") {
      setExpressionStage(1);
      simplifyMiddleExpression();
      return;
    }

    var from = relativeRect(fromNode);
    var to = relativeRect(toNode);
    var clone = document.createElement("div");
    clone.className = "middle-count-clone";
    clone.textContent = String(N);
    clone.style.left = from.left + "px";
    clone.style.top = from.top + "px";
    clone.style.width = from.width + "px";
    clone.style.height = from.height + "px";
    overlayRef.current.appendChild(clone);

    gsap.to(clone, {
      left: to.left,
      top: to.top,
      width: to.width,
      height: to.height,
      duration: 0.72,
      ease: "power2.inOut",
      onComplete: function () {
        clone.remove();
        setExpressionStage(1);
        setTimeout(simplifyMiddleExpression, 1000);
      },
    });
  }

  function simplifyMiddleExpression() {
    setExpressionStage(2);
    setTimeout(function () {
      setExpressionStage(3);
      setTimeout(function () {
        setExpressionStage(4);
        setPhase("selectMiddle");
        setShowPositionUpdown(true);
        onUpdateQuestionText(S2.simplifiedMiddleQuestion);
        onUpdateNavText(S2.selectMiddleNav);
        popAnimating();
      }, 1000);
    }, 1000);
  }

  function schedulePositionHint() {
    clearTimer(idleTimerRef);
    idleTimerRef.current = setTimeout(function () {
      setShowPositionUpdown(true);
    }, 5000);
  }

  function areAllMiddlePositionsSelected(nextSelected) {
    return middlePositions.every(function (position) {
      return !!nextSelected[position - 1];
    });
  }

  function getNextMiddlePosition(nextSelected) {
    for (var i = 0; i < middlePositions.length; i++) {
      if (!nextSelected[middlePositions[i] - 1]) return middlePositions[i];
    }
    return null;
  }

  function handleMiddleCircleClick(index) {
    if (phase !== "selectMiddle") return;
    if (selectedPositions[index]) return;

    var position = index + 1;
    var isCorrect = middlePositions.indexOf(position) >= 0;
    setShowPositionUpdown(false);

    if (!isCorrect) {
      setPositionFeedback(function (prev) {
        var next = copyObject(prev);
        next[index] = "wrong";
        return next;
      });
      if (typeof playSound === "function") playSound("wrong");
      schedulePositionHint();
      return;
    }

    var nextSelected = copyObject(selectedPositions);
    nextSelected[index] = true;
    setSelectedPositions(nextSelected);
    setPositionFeedback(function (prev) {
      var next = copyObject(prev);
      Object.keys(nextSelected).forEach(function (key) {
        if (nextSelected[key]) next[key] = "correct";
      });
      return next;
    });
    if (typeof playSound === "function") playSound("correct");

    if (areAllMiddlePositionsSelected(nextSelected)) {
      clearTimer(idleTimerRef);
      setPositionFeedback(function (prev) {
        var next = copyObject(prev);
        Object.keys(nextSelected).forEach(function (key) {
          if (nextSelected[key]) next[key] = "correct";
        });
        return next;
      });
      setPhase("finalStepReady");
      setActiveAction(3);
      setInProgressAction(null);
      setExploredActions({ 0: true, 1: true, 2: true });
      onUpdateQuestionText(S2.foundBothQuestion);
      onUpdateNavText(S2.foundBothNav);
      return;
    }

    var found = position;
    var next = getNextMiddlePosition(nextSelected);
    onUpdateQuestionText(fillPositionText(S2.foundFirstQuestion, found, next));
    onUpdateNavText(fillPositionText(S2.foundFirstNav, found, next));
    schedulePositionHint();
  }

  function beginMedianEntry() {
    if (phase !== "finalStepReady") return;
    if (typeof playSound === "function") playSound("click");
    setPhase("medianEntry");
    setActiveAction(null);
    setInProgressAction(3);
    setShowMedianPanel(true);
    setMedianInput("");
    setMedianAnswerState(null);
    setMedianFreshAfterWrong(false);
    setPositionFeedback(function (prev) {
      var next = copyObject(prev);
      Object.keys(next).forEach(function (key) {
        if (next[key] === "wrong") delete next[key];
      });
      return next;
    });
    onUpdateQuestionText(S2.medianQuestion);
    onUpdateNavText(S2.medianNav);
    onSetNextEnabled(false);
  }

  function handleMedianDigit(key) {
    if (phase === "medianDone") return;
    if (typeof playSound === "function") playSound("click");
    setMedianAnswerState(null);
    setMedianInput(function (prev) {
      var base = medianFreshAfterWrong ? "" : prev;
      var decimalKey = key === "," ? "." : key;
      if (decimalKey === "." && base.indexOf(".") >= 0) return base;
      if (base.length >= 3) return base;
      if (decimalKey === "." && base === "") return "0.";
      return (base + String(decimalKey)).slice(0, 3);
    });
    setMedianFreshAfterWrong(false);
  }

  function handleMedianClear() {
    if (phase === "medianDone") return;
    if (typeof playSound === "function") playSound("click");
    setMedianInput("");
    setMedianAnswerState(null);
    setMedianFreshAfterWrong(false);
  }

  function handleMedianSubmit() {
    if (phase === "medianDone" || !medianInput) return;
    if (Number(medianInput) === Number(S2.medianAnswer)) {
      setMedianInput(String(S2.medianAnswer));
      setMedianAnswerState("correct");
      setMedianFreshAfterWrong(false);
      setPhase("medianDone");
      setInProgressAction(null);
      setExploredActions({ 0: true, 1: true, 2: true, 3: true });
      onUpdateQuestionText(S2.medianCorrectQuestion);
      onUpdateNavText(S2.medianCorrectNav);
      onSetNextEnabled(true);
      if (typeof playSound === "function") playSound("correct");
      return;
    }

    setMedianAnswerState("wrong");
    setMedianFreshAfterWrong(true);
    onUpdateQuestionText(S2.medianWrongQuestion);
    onUpdateNavText(S2.medianWrongNav);
    if (typeof playSound === "function") playSound("wrong");
  }

  function handleCircleClick(index) {
    if (phase === "selectMiddle") {
      handleMiddleCircleClick(index);
      return;
    }
    if (phase !== "counting" || countByIndex[index]) return;
    var nextCount = Object.keys(countByIndex).length + 1;
    var nextCounts = copyObject(countByIndex);
    nextCounts[index] = nextCount;
    setCountByIndex(nextCounts);
    setCountBoxValue(String(nextCount));
    setShowUpdown(false);
    if (typeof playSound === "function") playSound("tick");
    if (nextCount >= N) {
      reorderCountBadges();
    } else {
      scheduleCountHint();
    }
  }

  function getOrderedCounts() {
    var orderedCounts = {};
    for (var i = 0; i < N; i++) orderedCounts[i] = i + 1;
    return orderedCounts;
  }

  function getMiddleCompletedSelection() {
    var selected = {};
    var feedback = {};
    middlePositions.forEach(function (position) {
      selected[position - 1] = true;
      feedback[position - 1] = "correct";
    });
    return { selected: selected, feedback: feedback };
  }

  function resetLaterActionState(fromActionIndex) {
    if (fromActionIndex <= 0) {
      setShowCountRow(false);
      setBottomParentExpanded(false);
      setCountByIndex({});
      setCountBoxValue("");
      setCountComplete(false);
      setShowUpdown(false);
      setBadgeMode("normal");
    }
    if (fromActionIndex <= 1) {
      setShowMiddlePanel(false);
      setMiddleChoice(null);
      setMiddleChoiceState(null);
      setShowCorrectOnly(false);
      setExpressionStage(0);
      setSelectedPositions({});
      setPositionFeedback({});
      setShowPositionUpdown(false);
    }
    if (fromActionIndex <= 2) {
      setShowMedianPanel(false);
      setMedianInput("");
      setMedianAnswerState(null);
      setMedianFreshAfterWrong(false);
    }
  }

  function restoreCompletedSnapshot(actionIndex) {
    clearTimer(idleTimerRef);
    clearTimer(animationTimerRef);
    clearOverlay();
    animDepthRef.current = 0;
    if (onSetAnimating) onSetAnimating(false);

    setShowStepPanel(false);
    setActionVisible(true);
    setShowData(true);
    setDisplayData(sortedDataset.slice());
    setShowSortLabels(true);
    setInProgressAction(null);
    onSetNextEnabled(false);

    if (actionIndex === 0) {
      resetLaterActionState(0);
      setPhase("countReady");
      setActiveAction(1);
      setExploredActions({ 0: true });
      onUpdateQuestionText(S2.sortedQuestion);
      onUpdateNavText(S2.sortedNav);
      return;
    }

    if (actionIndex === 1) {
      resetLaterActionState(1);
      setPhase("middleReady");
      setActiveAction(2);
      setExploredActions({ 0: true, 1: true });
      setShowCountRow(true);
      setBottomParentExpanded(true);
      setCountByIndex(getOrderedCounts());
      setCountBoxValue(String(N));
      setCountComplete(true);
      setBadgeMode("normal");
      onUpdateQuestionText(S2.countCompleteQuestion);
      onUpdateNavText(S2.countCompleteNav);
      return;
    }

    if (actionIndex === 2) {
      var middleState = getMiddleCompletedSelection();
      resetLaterActionState(2);
      setPhase("finalStepReady");
      setActiveAction(3);
      setExploredActions({ 0: true, 1: true, 2: true });
      setShowCountRow(true);
      setBottomParentExpanded(true);
      setCountByIndex({});
      setCountBoxValue(String(N));
      setCountComplete(true);
      setShowMiddlePanel(true);
      setMiddleChoice(middleCorrectOption);
      setMiddleChoiceState("correct");
      setShowCorrectOnly(true);
      setExpressionStage(4);
      setSelectedPositions(middleState.selected);
      setPositionFeedback(middleState.feedback);
      onUpdateQuestionText(S2.foundBothQuestion);
      onUpdateNavText(S2.foundBothNav);
    }
  }

  function getPracticeLevel() {
    if (phase === "medianDone" || phase === "medianEntry") return 3;
    if (
      phase === "finalStepReady" ||
      inProgressAction === 2 ||
      showMiddlePanel ||
      phase === "middleIntro" ||
      phase === "middleMcq" ||
      phase === "selectMiddle"
    ) return 2;
    if (phase === "middleReady") return 1;
    if (inProgressAction === 1 || phase === "counting" || phase === "countReordering") return 1;
    if (phase === "countReady") return 0;
    if (inProgressAction === 0 || phase === "sorting") return 0;
    return -1;
  }

  function handlePracticePrev() {
    if (animDepthRef.current > 0) return true;
    var level = getPracticeLevel();
    if (level <= 0) return false;
    restoreCompletedSnapshot(level - 1);
    return true;
  }

  useEffect(function () {
    if (!props.onRegisterPracticePrev) return undefined;
    if (step !== 2) {
      props.onRegisterPracticePrev(null);
      return undefined;
    }
    props.onRegisterPracticePrev(handlePracticePrev);
    return function () {
      props.onRegisterPracticePrev(null);
    };
  }, [
    step,
    phase,
    inProgressAction,
    showMiddlePanel,
    showMedianPanel,
    showCountRow,
    exploredActions,
  ]);

  function handleActionClick(index) {
    if (index === 0) beginSorting();
    if (index === 1) beginCounting();
    if (index === 2) beginMiddlePosition();
    if (index === 3) beginMedianEntry();
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
              if (index === 1) stepDragNudgeRef.current = node;
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
        step === 1
          ? e(Nudge, { targetRef: stepDragNudgeRef, show: showStepDragNudge && draggedIndex === null, type: "drag", variant: "step-drag" })
          : null,
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
        ? e(Nudge, { targetRef: actionRefs.current[activeAction] ? { current: actionRefs.current[activeAction] } : actionRefs, show: true, variant: "step-button" })
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
          var positionState = positionFeedback[index];
          var isMiddleSelected = !!selectedPositions[index];
          var visiblePositionState = positionState === "wrong"
            ? "wrong"
            : (positionState === "correct" || isMiddleSelected ? "correct" : null);
          var clickable =
            (phase === "counting" && !counted) ||
            (phase === "selectMiddle" && !isMiddleSelected);
          var cls = "median-num-circle";
          if (clickable && showUpdown) cls += " updown";
          if (phase === "selectMiddle" && clickable && showPositionUpdown) cls += " updown";
          if (counted) cls += " counted";
          if (positionState === "wrong") cls += " position-wrong";
          if (positionState === "correct") cls += " position-correct";
          if (
            (phase === "finalStepReady" || phase === "medianEntry" || phase === "medianDone") &&
            !isMiddleSelected
          ) cls += " dimmed-final";
          if (isMiddleSelected) cls += " position-correct";
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
            visiblePositionState
              ? e("span", {
                className:
                  "position-label " +
                  (visiblePositionState === "wrong" ? "wrong" : visiblePositionState === "correct" ? "correct" : "neutral"),
                dangerouslySetInnerHTML: renderMarkup(ordinalHtml(index + 1)),
              })
              : null,
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

  function renderMiddleExpression() {
    if (expressionStage === 2) {
      if (middleCorrectOption === 0) {
        var oddFraction = e(
          React.Fragment,
          null,
          e("span", { className: "middle-paren" }, "("),
          e(
            "span",
            { className: "middle-fraction" },
            e("span", { className: "middle-frac-num" }, "10"),
            e("span", { className: "middle-frac-bar" }),
            e("span", { className: "middle-frac-den" }, "2"),
          ),
          e("span", { className: "middle-paren" }, ")"),
        );
        return e(
          "span",
          { className: "middle-simplified-expression fading" },
          current_language === "id" ? e(React.Fragment, null, "ke-", oddFraction) : e(React.Fragment, null, oddFraction, e("sup", null, "th")),
          e("span", { className: "middle-option-text" }, " " + S2.valueText),
        );
      }
      return e("span", {
        className: "middle-simplified-expression fading",
        dangerouslySetInnerHTML: renderMarkup(S2.simplifiedExpressions[1]),
      });
    }
    if (expressionStage >= 3) {
      return e("span", {
        className: "middle-simplified-expression",
        dangerouslySetInnerHTML: renderMarkup(S2.simplifiedExpressions[2]),
      });
    }
    if (middleCorrectOption === 0) {
      var oddExprFraction = e(
        React.Fragment,
        null,
        e("span", { className: "middle-paren" }, "("),
        e(
          "span",
          { className: "middle-fraction" },
          e(
            "span",
            { className: "middle-frac-num" },
            e("span", {
              className: "middle-expression-n",
              ref: expressionNRef,
            }, expressionStage >= 1 ? String(N) : e("mi", null, "n")),
            "+1",
          ),
          e("span", { className: "middle-frac-bar" }),
          e("span", { className: "middle-frac-den" }, "2"),
        ),
        e("span", { className: "middle-paren" }, ")"),
      );
      return e(
        "span",
        { className: "middle-correct-expression" },
        current_language === "id"
          ? e(React.Fragment, null, "ke-", oddExprFraction)
          : e(React.Fragment, null, oddExprFraction, e("sup", null, "th")),
        e("span", { className: "middle-option-text" }, " " + S2.valueText),
      );
    }
    var evenFraction = e(
      React.Fragment,
      null,
      e("span", { className: "middle-paren" }, "("),
      e(
        "span",
        { className: "middle-fraction" },
        e("span", {
          className: "middle-frac-num",
          ref: expressionNRef,
        }, expressionStage >= 1 ? String(N) : e("mi", null, "n")),
        e("span", { className: "middle-frac-bar" }),
        e("span", { className: "middle-frac-den" }, "2"),
      ),
      e("span", { className: "middle-paren" }, ")"),
    );
    return e(
      "span",
      { className: "middle-correct-expression" },
      current_language === "id" ? e(React.Fragment, null, "ke-", evenFraction) : e(React.Fragment, null, evenFraction, e("sup", null, "th")),
      e("span", { className: "middle-option-text" }, " " + S2.nextValueText),
    );
  }

  function renderMiddlePanel() {
    if (!showMiddlePanel) return null;
    return e(
      "div",
      { className: "middle-position" },
      e("div", { className: "middle-title" }, S2.middlePositionTitle),
      e(
        "div",
        {
          className:
            "middle-options" +
            (showCorrectOnly ? " correct-only" : "") +
            (expressionStage > 0 ? " simplifying" : ""),
        },
        [0, 1].map(function (index) {
          if (showCorrectOnly && index !== middleCorrectOption) {
            return e("button", {
              type: "button",
              key: "middle-option-" + index,
              className: "middle-option removed",
              disabled: true,
              "aria-hidden": true,
            });
          }
          var cls = "middle-option";
          if (middleChoice === index && middleChoiceState === "wrong") cls += " wrong";
          if (middleChoice === index && middleChoiceState === "correct") cls += " correct";
          if (showCorrectOnly && index === middleCorrectOption) cls += " kept";
          return e(
            "button",
            {
              type: "button",
              key: "middle-option-" + index,
              className: cls,
              disabled: phase !== "middleMcq" || middleChoiceState === "correct" || showCorrectOnly,
              onClick: function () {
                handleMiddleChoice(index);
              },
            },
            showCorrectOnly && index === middleCorrectOption ? renderMiddleExpression() : renderMiddleOptionContent(index),
          );
        }),
      ),
    );
  }

  function renderNumpadKey(key) {
    if (key === "submit") {
      return e("button", {
        type: "button",
        key: "median-submit",
        className: "median-numpad-key submit",
        disabled: phase === "medianDone" || !medianInput,
        onClick: handleMedianSubmit,
      }, "\u2713");
    }
    if (key === "clear") {
      return e(
        "button",
        {
          type: "button",
          key: "median-clear",
          className: "median-numpad-key clear",
          disabled: phase === "medianDone",
          onClick: handleMedianClear,
        },
        "\u232b",
      );
    }
    return e("button", {
      type: "button",
      key: "median-key-" + key,
      className: "median-numpad-key",
      disabled: phase === "medianDone",
      onClick: function () {
        handleMedianDigit(key);
      },
    }, key);
  }

  function renderMedianPanel() {
    if (!showMedianPanel) return null;
    var displayedMedianInput = current_language === "id" ? medianInput.replace(".", ",") : medianInput;
    var answerContent = displayedMedianInput || "\u00A0";
    if (current_language === "id" && displayedMedianInput.indexOf(",") >= 0) {
      answerContent = displayedMedianInput.split("").map(function (char, index) {
        return char === ","
          ? e("span", { className: "median-answer-comma", key: "answer-char-" + index }, char)
          : e("span", { key: "answer-char-" + index }, char);
      });
    }
    return e(
      "div",
      { className: "median-value" },
      e(
        "div",
        { className: "median-answer-row" },
        e("span", { className: "median-answer-label" }, S2.medianLabel),
        e("span", {
          className:
            "median-answer-box" +
            (medianAnswerState === "wrong" ? " wrong" : "") +
            (medianAnswerState === "correct" ? " correct" : ""),
        }, answerContent),
      ),
      phase !== "medianDone"
        ? e(
          "div",
          { className: "median-numpad" },
          ["1", "2", "3", "4", "5", current_language === "id" ? "," : ".", "6", "7", "8", "9", "0", "clear", "submit"].map(renderNumpadKey),
        )
        : null,
    );
  }

  function renderBottomParent() {
    if (!showCountRow) return null;
    return e(
      "div",
      {
        className:
          "bottom-parent" +
          (bottomParentExpanded ? " is-expanded" : "") +
          (showMiddlePanel ? " has-middle" : "") +
          (showMedianPanel ? " has-median" : ""),
      },
      e(
        "div",
        { className: "median-count-panel" + (showMiddlePanel ? " compact" : "") },
        e(
          "div",
          { className: "median-count-expression" },
          e("span", { className: "median-count-symbol" }, S2.countSymbol + " ="),
          e("span", {
            className: "median-count-box" + (countComplete ? " complete" : ""),
            ref: countBoxRef,
          }, countBoxValue),
        ),
      ),
      renderMiddlePanel(),
      renderMedianPanel(),
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
      { className: "median-visual-row" + (bottomParentExpanded ? " has-expanded-bottom" : "") },
      showStepPanel ? renderStepsPanel() : null,
      renderDataRow(),
      renderBottomParent(),
    ),
    renderActionButtons(),
    ghost,
    e("div", { className: "median-animation-overlay", ref: overlayRef }),
  );
};
