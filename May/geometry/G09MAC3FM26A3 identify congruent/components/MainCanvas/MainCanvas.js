const MainCanvas = (props) => {
  const { useState, useCallback, useEffect, useRef } = React;
  const {
    questionIndex,
    onQuestionComplete,
    onSelectionChange,
    onRegisterNudgeTarget,
    onHideNudge,
  } = props;

  const [selectedIds, setSelectedIds] = useState([]);
  const [checkResult, setCheckResult] = useState(null);
  const [hasChecked, setHasChecked] = useState(false);
  const [hasCheckedOnce, setHasCheckedOnce] = useState(false);

  const svgRef = useRef(null);
  const question = SVG_QUESTIONS[questionIndex];

  const resetQuestionState = useCallback(() => {
    setSelectedIds([]);
    setCheckResult(null);
    setHasChecked(false);
    setHasCheckedOnce(false);
    if (typeof onSelectionChange === "function") onSelectionChange(false);
    if (typeof onQuestionComplete === "function") onQuestionComplete(false);
  }, [onSelectionChange, onQuestionComplete]);

  useEffect(() => {
    resetQuestionState();
  }, [questionIndex, resetQuestionState]);

  const handleShapeClick = useCallback(
    (shapeId) => {
      if (hasChecked && checkResult === "correct") return;

      if (typeof playSound === "function") playSound("click");

      setSelectedIds((prev) => {
        let next;
        if (prev.includes(shapeId)) {
          next = prev.filter((id) => id !== shapeId);
        } else if (prev.length >= 2) {
          next = [prev[1], shapeId];
        } else {
          next = [...prev, shapeId];
        }

        if (typeof onSelectionChange === "function") {
          onSelectionChange(next.length >= 2);
        }

        return next;
      });

      if (hasChecked) {
        setCheckResult(null);
        setHasChecked(false);
        if (typeof onQuestionComplete === "function") onQuestionComplete(false);
      }
    },
    [hasChecked, checkResult, onSelectionChange, onQuestionComplete],
  );

  const handleCheck = () => {
    if (selectedIds.length < 2) return;
    if (typeof playSound === "function") playSound("click");

    const result = evaluateSelection(selectedIds, questionIndex);
    setCheckResult(result);
    setHasChecked(true);
    setHasCheckedOnce(true);

    if (typeof onRegisterNudgeTarget === "function") onRegisterNudgeTarget(null);
    if (typeof onHideNudge === "function") onHideNudge();

    if (result === "correct") {
      if (typeof playSound === "function") playSound("correct");
      if (typeof onQuestionComplete === "function") onQuestionComplete(true);
    } else if (typeof playSound === "function") {
      playSound("wrong");
    }
  };

  useEffect(() => {
    const updateNudge = () => {
      if (selectedIds.length >= 2 && !hasCheckedOnce) {
        const btn = document.getElementById("check-button");
        if (btn && typeof onRegisterNudgeTarget === "function") {
          onRegisterNudgeTarget(btn.getBoundingClientRect());
        }
        return;
      }
      if (typeof onRegisterNudgeTarget === "function") {
        onRegisterNudgeTarget(null);
      }
    };

    const tid = setTimeout(updateNudge, 100);
    window.addEventListener("resize", updateNudge);
    return () => {
      clearTimeout(tid);
      window.removeEventListener("resize", updateNudge);
    };
  }, [selectedIds, hasCheckedOnce, onRegisterNudgeTarget]);

  useEffect(() => {
    const svgRoot = svgRef.current;
    if (!svgRoot) return;
    svgRoot.innerHTML = question.innerMarkup;
    ensureSelectionGlowFilter(svgRoot);
  }, [questionIndex, question.innerMarkup]);

  useEffect(() => {
    const svgRoot = svgRef.current;
    if (!svgRoot) return undefined;

    ensureSelectionGlowFilter(svgRoot);

    const shapeMap = {};
    question.shapes.forEach((shape) => {
      shapeMap[shape.id] = shape;
    });

    question.shapes.forEach((shape) => {
      const el = svgRoot.getElementById(shape.id);
      if (!el) return;

      el.style.cursor = "pointer";
      el.onclick = () => handleShapeClick(shape.id);

      const isSelected = selectedIds.includes(shape.id);
      let strokeColor = "#ffffff";
      let strokeWidth = 5;
      let labelColor = "#ffffff";
      let showGlow = false;

      if (hasChecked && isSelected) {
        if (checkResult === "correct") {
          strokeColor = "#4ade80";
          strokeWidth = 7;
          labelColor = "#4ade80";
        } else if (checkResult === "angle_match" || checkResult === "no_match") {
          strokeColor = "#ff6b8a";
          strokeWidth = 7;
          labelColor = "#ff6b8a";
        } else if (checkResult === "side_match") {
          strokeColor = "#ffffff";
          strokeWidth = 5;
          labelColor = "#ffffff";
        }
      } else if (isSelected) {
        strokeColor = "#ffd700";
        strokeWidth = 10;
        showGlow = true;
      }

      applyShapeStroke(el, strokeColor, strokeWidth);
      applyShapeSelectionGlow(el, showGlow);
      setLabelColor(svgRoot, shape.labelIds, labelColor);
    });

    renderShapeNameLabels(svgRoot, question.shapes);
    renderPermanentAngles(
      svgRoot,
      question.permanentAngles,
      hasChecked,
      checkResult,
      selectedIds,
    );

    let overlayG = svgRoot.querySelector("#angle-markers-overlay");
    if (!overlayG) {
      overlayG = document.createElementNS("http://www.w3.org/2000/svg", "g");
      overlayG.setAttribute("id", "angle-markers-overlay");
      overlayG.setAttribute("pointer-events", "none");
      svgRoot.appendChild(overlayG);
    }

    while (overlayG.firstChild) {
      overlayG.removeChild(overlayG.firstChild);
    }

    const showAngles =
      hasChecked &&
      (checkResult === "side_match" ||
        checkResult === "no_match" ||
        checkResult === "angle_match");

    if (showAngles) {
      const markerColor =
        checkResult === "angle_match" ? "#ffffff" : "#ff6b8a";

      selectedIds.forEach((shapeId) => {
        const shapeMeta = shapeMap[shapeId];
        const shapeEl = svgRoot.getElementById(shapeId);
        if (!shapeMeta || !shapeEl) return;

        const points = getShapeCornerPoints(shapeEl, svgRoot);
        const markers = getCornerMarkers(points, markerColor, 36);

        markers.forEach((marker, idx) => {
          const pathEl = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path",
          );
          pathEl.setAttribute("d", marker.d);
          pathEl.setAttribute("fill", marker.fill);
          pathEl.setAttribute("data-shape", shapeId);
          pathEl.setAttribute("data-index", String(idx));
          overlayG.appendChild(pathEl);
        });
      });
    }

    return () => {
      question.shapes.forEach((shape) => {
        const el = svgRoot.getElementById(shape.id);
        if (el) el.onclick = null;
      });
    };
  }, [
    question,
    selectedIds,
    hasChecked,
    checkResult,
    handleShapeClick,
    questionIndex,
  ]);

  const renderFeedback = () => {
    if (!hasChecked || !checkResult) return null;

    const feedbackMap = {
      correct: APP_DATA.feedback.correct,
      side_match: APP_DATA.feedback.sideMatch,
      angle_match: APP_DATA.feedback.angleMatch,
      no_match: APP_DATA.feedback.noMatch,
    };

    const isCorrect = checkResult === "correct";

    return React.createElement("div", {
      className:
        "feedback-box" +
        (isCorrect ? " feedback-box--correct" : " feedback-box--wrong"),
      dangerouslySetInnerHTML: { __html: feedbackMap[checkResult] },
    });
  };

  const checkDisabled =
    selectedIds.length < 2 || (hasChecked && checkResult === "correct");

  return React.createElement(
    "div",
    { className: "main-canvas-container" },
    React.createElement(
      "div",
      { className: "main-canvas-left" },
      React.createElement("svg", {
        ref: svgRef,
        className: "diagrams-svg",
        viewBox: question.viewBox,
        preserveAspectRatio: "xMidYMid meet",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
      }),
    ),
    React.createElement(
      "div",
      { className: "main-canvas-right" },
      React.createElement(
        "div",
        { className: "feedback-area" },
        renderFeedback(),
      ),
      React.createElement(
        "button",
        {
          id: "check-button",
          className: "btn check-btn",
          onClick: handleCheck,
          disabled: checkDisabled,
        },
        APP_DATA.checkButton,
      ),
    ),
  );
};
