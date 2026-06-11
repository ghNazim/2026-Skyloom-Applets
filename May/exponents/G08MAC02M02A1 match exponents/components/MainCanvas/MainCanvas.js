const MainCanvas = (props) => {
  const { step, onRestart, onUpdateNavText } = props;
  const { useState, useRef } = React;

  const leftItems = APP_DATA.matching.leftItems;
  const rightItems = APP_DATA.matching.rightItems;
  const TOTAL_PAIRS = leftItems.length;

  const ROW_HEIGHT = 7;
  const ROW_GAP = 1.2;

  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [wrongPair, setWrongPair] = useState(null);
  const [feedbackType, setFeedbackType] = useState(null);
  const [sparklingPair, setSparklingPair] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showHintNudge, setShowHintNudge] = useState(false);
  const [showHintForwardNudge, setShowHintForwardNudge] = useState(false);

  const hasShownHintNudgeRef = useRef(false);
  const hasShownForwardNudgeRef = useRef(false);

  const isLeftMatched = (id) => matchedPairs.some((p) => p.leftId === id);
  const isRightMatched = (id) => matchedPairs.some((p) => p.rightId === id);

  const getLeftDisplayOrder = () => {
    const order = [];
    matchedPairs.forEach((p) => order.push(p.leftId));
    leftItems.forEach((item) => {
      if (!isLeftMatched(item.id)) order.push(item.id);
    });
    return order;
  };

  const getRightDisplayOrder = () => {
    const order = [];
    matchedPairs.forEach((p) => order.push(p.rightId));
    rightItems.forEach((item) => {
      if (!isRightMatched(item.id)) order.push(item.id);
    });
    return order;
  };

  const getTopPosition = (itemId, column) => {
    const order =
      column === "left" ? getLeftDisplayOrder() : getRightDisplayOrder();
    const posIndex = order.indexOf(itemId);
    return posIndex * (ROW_HEIGHT + ROW_GAP);
  };

  const handleLeftClick = (id) => {
    if (isAnimating) return;
    if (isLeftMatched(id)) return;
    if (typeof playSound === "function") playSound("click");

    if (wrongPair) {
      setWrongPair(null);
      setFeedbackType(null);
    }
    if (feedbackType === "correct") {
      setFeedbackType(null);
    }

    if (selectedLeft === id) {
      setSelectedLeft(null);
      return;
    }

    if (selectedRight !== null) {
      attemptMatch(id, selectedRight);
    } else {
      setSelectedLeft(id);
    }
  };

  const handleRightClick = (id) => {
    if (isAnimating) return;
    if (isRightMatched(id)) return;
    if (typeof playSound === "function") playSound("click");

    if (wrongPair) {
      setWrongPair(null);
      setFeedbackType(null);
    }
    if (feedbackType === "correct") {
      setFeedbackType(null);
    }

    if (selectedRight === id) {
      setSelectedRight(null);
      return;
    }

    if (selectedLeft !== null) {
      attemptMatch(selectedLeft, id);
    } else {
      setSelectedRight(id);
    }
  };

  const attemptMatch = (leftId, rightId) => {
    const leftItem = leftItems.find((i) => i.id === leftId);
    const rightItem = rightItems.find((i) => i.id === rightId);

    if (leftItem.pairId === rightItem.pairId) {
      if (typeof playSound === "function") playSound("correct");
      setSelectedLeft(null);
      setSelectedRight(null);
      setSparklingPair({ leftId: leftId, rightId: rightId });
      setIsAnimating(true);

      var isLastPair = matchedPairs.length + 1 === TOTAL_PAIRS;

      if (!isLastPair) {
        setFeedbackType("correct");
      }

      setTimeout(function () {
        setSparklingPair(null);
        setIsAnimating(false);
        setMatchedPairs(function (prev) {
          return [].concat(prev, [{ leftId: leftId, rightId: rightId }]);
        });

        if (isLastPair) {
          setTimeout(function () {
            setFeedbackType("allDone");
            if (typeof confettiBurst === "function") confettiBurst();
            if (onUpdateNavText) onUpdateNavText(APP_DATA.steps[1].navAllDone);
          }, 600);
        }
      }, 600);
    } else {
      if (typeof playSound === "function") playSound("wrong");
      setSelectedLeft(null);
      setSelectedRight(null);
      setFeedbackType("wrong");
      setWrongPair({ leftId: leftId, rightId: rightId });

      if (!hasShownHintNudgeRef.current) {
        setShowHintNudge(true);
        hasShownHintNudgeRef.current = true;
      }
    }
  };

  const getLeftRowClass = (id) => {
    var cls = "match-row left-row";
    if (isLeftMatched(id) || (sparklingPair && sparklingPair.leftId === id))
      cls += " correct";
    else if (wrongPair && wrongPair.leftId === id) cls += " wrong";
    else if (selectedLeft === id) cls += " selected";
    if (sparklingPair && sparklingPair.leftId === id) cls += " sparkle";
    return cls;
  };

  const getRightRowClass = (id) => {
    var cls = "match-row right-row";
    if (isRightMatched(id) || (sparklingPair && sparklingPair.rightId === id))
      cls += " correct";
    else if (wrongPair && wrongPair.rightId === id) cls += " wrong";
    else if (selectedRight === id) cls += " selected";
    if (sparklingPair && sparklingPair.rightId === id) cls += " sparkle";
    return cls;
  };

  const renderLeftColumn = () => {
    return React.createElement(
      "div",
      { className: "left-column" },
      leftItems.map((item) => {
        var top = getTopPosition(item.id, "left");
        return React.createElement(
          "div",
          {
            key: "left-" + item.id,
            className: getLeftRowClass(item.id),
            style: { top: top + "vw" },
            onClick: function () {
              handleLeftClick(item.id);
            },
          },
          React.createElement("span", null, item.text)
        );
      })
    );
  };

  const renderRightColumn = () => {
    return React.createElement(
      "div",
      { className: "right-column" },
      rightItems.map((item) => {
        var top = getTopPosition(item.id, "right");
        return React.createElement(
          "div",
          {
            key: "right-" + item.id,
            className: getRightRowClass(item.id),
            style: { top: top + "vw" },
            onClick: function () {
              handleRightClick(item.id);
            },
          },
          React.createElement(
            "span",
            { className: "exp-notation" },
            React.createElement("span", { className: "exp-base" }, item.base),
            React.createElement("span", { className: "exp-sup" }, item.exponent)
          )
        );
      })
    );
  };

  const renderMiddleColumn = () => {
    if (!feedbackType) {
      return React.createElement("div", { className: "middle-column" });
    }

    var feedbackText = "";
    var feedbackClass = "feedback-box";

    if (feedbackType === "correct") {
      feedbackText = APP_DATA.feedback.correct;
      feedbackClass += " feedback-correct";
    } else if (feedbackType === "wrong") {
      feedbackText = APP_DATA.feedback.wrong;
      feedbackClass += " feedback-wrong";
    } else if (feedbackType === "allDone") {
      feedbackText = APP_DATA.feedback.allDone;
      feedbackClass += " feedback-correct";
    }

    return React.createElement(
      "div",
      { className: "middle-column" },
      React.createElement("div", { className: feedbackClass }, feedbackText),
      feedbackType === "wrong" &&
        React.createElement(
          "div",
          { className: "nudge-wrapper" },
          React.createElement(Button, {
            text: APP_DATA.hint.hint,
            className: "canvas-action-btn",
            onClick: function () {
              if (typeof playSound === "function") playSound("click");
              setShowHintNudge(false);
              setShowHint(true);
              if (!hasShownForwardNudgeRef.current) {
                setShowHintForwardNudge(true);
              }
            },
          }),
          showHintNudge && React.createElement(Nudge)
        ),
      feedbackType === "allDone" &&
        React.createElement(Button, {
          text: APP_DATA.startOver,
          className: "canvas-action-btn",
          onClick: onRestart,
        })
    );
  };

  return React.createElement(
    "div",
    { className: "main-canvas-container" },
    React.createElement(
      "div",
      { className: "canvas-three-col" },
      renderLeftColumn(),
      renderMiddleColumn(),
      renderRightColumn()
    ),
    showHint &&
      React.createElement(Hint, {
        base: APP_DATA.matching.hintExample.base,
        exponent: APP_DATA.matching.hintExample.exponent,
        baseLabel: APP_DATA.hint.base,
        exponentLabel: APP_DATA.hint.exponent,
        closeText: APP_DATA.hint.close,
        showForwardNudge: showHintForwardNudge,
        onDismissForwardNudge: function () {
          setShowHintForwardNudge(false);
          hasShownForwardNudgeRef.current = true;
        },
        onClose: function () {
          if (typeof playSound === "function") playSound("click");
          setShowHintForwardNudge(false);
          hasShownForwardNudgeRef.current = true;
          setShowHint(false);
        },
      })
  );
};
