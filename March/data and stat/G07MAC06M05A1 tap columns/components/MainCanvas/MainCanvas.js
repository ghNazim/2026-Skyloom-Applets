/** Terminal UI when revisiting a question already solved (read-only). */
function buildSolvedQuestionSnapshot(qData, xData) {
  const cell = (status) => ({
    status,
    fillAnim: false,
    mutedCorrect: false,
  });
  if (qData.multiSelect) {
    return {
      columnStates: xData.map((_, i) =>
        cell(qData.correctColumns.indexOf(i + 1) !== -1 ? "correct" : "default")
      ),
      feedbackText: qData.correctFeedback,
      feedbackType: "correct",
      answered: true,
      correctColumnsFound: qData.correctColumns.slice(),
      correctCount: qData.correctColumns.length,
      showSummation: !!qData.summationText,
      showLabel: !!qData.correctLabel,
      pulsatingX: null,
      fillCompareAttemptIndex: 0,
    };
  }
  if (qData.visualType === "fillCompare") {
    const ci = qData.correctColumns[0] - 1;
    return {
      columnStates: xData.map((_, i) =>
        cell(i === ci ? "correct" : "wrong")
      ),
      feedbackText: qData.correctFeedback,
      feedbackType: "correct",
      answered: true,
      correctColumnsFound: [],
      correctCount: 0,
      showSummation: false,
      showLabel: !!qData.correctLabel,
      pulsatingX: null,
      fillCompareAttemptIndex: 0,
    };
  }
  const ci = qData.correctColumns[0] - 1;
  return {
    columnStates: xData.map((_, i) => cell(i === ci ? "correct" : "default")),
    feedbackText: qData.correctFeedback,
    feedbackType: "correct",
    answered: true,
    correctColumnsFound: [],
    correctCount: 0,
    showSummation: false,
    showLabel: !!qData.correctLabel,
    pulsatingX: null,
    fillCompareAttemptIndex: 0,
  };
}

const MainCanvas = (props) => {
  const {
    step,
    questionIndex,
    onSetNextEnabled,
    onUpdateNavText,
    isStartScreen,
    isQuestionSolved = false,
    onQuestionSolved = () => {},
  } = props;
  const { useState, useEffect, useRef, useCallback } = React;

  const qData = APP_DATA.questions[questionIndex];
  const xData = APP_DATA.xData;
  const yData = APP_DATA.yData;
  const maxY = Math.max(...yData);

  const solvedSnap =
    !isStartScreen && isQuestionSolved
      ? buildSolvedQuestionSnapshot(qData, xData)
      : null;

  const [columnStates, setColumnStates] = useState(() =>
    solvedSnap
      ? solvedSnap.columnStates
      : xData.map(() => ({ status: "default", fillAnim: false, mutedCorrect: false }))
  );
  const [feedbackText, setFeedbackText] = useState(() =>
    solvedSnap ? solvedSnap.feedbackText : ""
  );
  const [feedbackType, setFeedbackType] = useState(() =>
    solvedSnap ? solvedSnap.feedbackType : "none"
  );
  const [correctCount, setCorrectCount] = useState(() =>
    solvedSnap ? solvedSnap.correctCount : 0
  );
  const [answered, setAnswered] = useState(() =>
    solvedSnap ? solvedSnap.answered : false
  );
  const [correctColumnsFound, setCorrectColumnsFound] = useState(() =>
    solvedSnap ? solvedSnap.correctColumnsFound : []
  );
  const [showSummation, setShowSummation] = useState(() =>
    solvedSnap ? solvedSnap.showSummation : false
  );
  const [showLabel, setShowLabel] = useState(() =>
    solvedSnap ? solvedSnap.showLabel : false
  );
  const [pulsatingX, setPulsatingX] = useState(() =>
    solvedSnap ? solvedSnap.pulsatingX : null
  );
  /** Q2/Q3 fillCompare: bottom-up fill only on first tap; later taps snap colors. */
  const [fillCompareAttemptIndex, setFillCompareAttemptIndex] = useState(() =>
    solvedSnap ? solvedSnap.fillCompareAttemptIndex : 0
  );

  const readOnlySolved = !isStartScreen && isQuestionSolved;

  const isMulti = qData.multiSelect;
  const totalCorrect = qData.correctColumns.length;
  const isLastQuestion = questionIndex === APP_DATA.questions.length - 1;

  const resetColumns = useCallback(() => {
    setColumnStates(
      xData.map(() => ({ status: "default", fillAnim: false, mutedCorrect: false }))
    );
  }, []);

  const handleColumnClick = (colIndex) => {
    if (isStartScreen || readOnlySolved) return;
    // colIndex is 0-based, correctColumns are 1-based
    const colNumber = colIndex + 1;

    if (answered && !isMulti) return;
    if (isMulti && correctColumnsFound.indexOf(colNumber) !== -1) return;

    const isCorrect = qData.correctColumns.indexOf(colNumber) !== -1;

    if (isCorrect) {
      if (typeof playSound === "function") playSound("correct");

      if (isMulti) {
        const newFound = correctColumnsFound.concat([colNumber]);
        setCorrectColumnsFound(newFound);

        // Rebuild multi-select visual state from correct picks only.
        // This clears any previous wrong marks as soon as user gets one correct.
        setColumnStates(
          xData.map((_, i) => ({
            status: newFound.indexOf(i + 1) !== -1 ? "correct" : "default",
            fillAnim: false,
            mutedCorrect: false,
          }))
        );

        setPulsatingX(null);

        if (newFound.length < totalCorrect) {
          // Partial correct
          const partialMsg =
            qData.partialFeedbacks[newFound.length - 1] ||
            qData.partialFeedbacks[qData.partialFeedbacks.length - 1];
          setFeedbackText(partialMsg);
          setFeedbackType("partial");
          setCorrectCount(newFound.length);
        } else {
          // All correct
          setFeedbackText(qData.correctFeedback);
          setFeedbackType("correct");
          setAnswered(true);
          setCorrectCount(newFound.length);
          onSetNextEnabled(true);
          onUpdateNavText(
            isLastQuestion ? APP_DATA.steps[1].navLast : APP_DATA.steps[1].navTextDone
          );

          if (qData.summationText) {
            setShowSummation(true);
          }
          onQuestionSolved(questionIndex);
        }
      } else {
        // Single select correct
        // Clear any wrong marks first
        const newStates = xData.map(() => ({
          status: "default",
          fillAnim: false,
          mutedCorrect: false,
        }));

        if (qData.visualType === "fillCompare") {
          const useFillAnim = fillCompareAttemptIndex === 0;
          xData.forEach((_, i) => {
            if (i === colIndex) {
              newStates[i] = {
                status: "correct",
                fillAnim: useFillAnim,
                mutedCorrect: false,
              };
            } else {
              newStates[i] = {
                status: "wrong",
                fillAnim: useFillAnim,
                mutedCorrect: false,
              };
            }
          });
        } else {
          newStates[colIndex] = {
            status: "correct",
            fillAnim: false,
            mutedCorrect: false,
          };
        }

        setColumnStates(newStates);
        if (qData.visualType === "fillCompare") {
          setFillCompareAttemptIndex((n) => n + 1);
        }
        setFeedbackText(qData.correctFeedback);
        setFeedbackType("correct");
        setAnswered(true);
        setPulsatingX(null);
        onSetNextEnabled(true);
        onUpdateNavText(
          isLastQuestion ? APP_DATA.steps[1].navLast : APP_DATA.steps[1].navTextDone
        );

        if (qData.correctLabel) {
          setShowLabel(true);
        }
        onQuestionSolved(questionIndex);
      }
    } else {
      // Wrong answer
      if (typeof playSound === "function") playSound("wrong");

      if (isMulti && qData.visualType === "pulsateX") {
        if (correctColumnsFound.length > 0) {
          // Keep partial progress; dim confirmed corrects until next correct tap
          setColumnStates(
            xData.map((_, i) => {
              const n = i + 1;
              if (correctColumnsFound.indexOf(n) !== -1) {
                return { status: "correct", fillAnim: false, mutedCorrect: true };
              }
              if (i === colIndex) {
                return { status: "wrong", fillAnim: false, mutedCorrect: false };
              }
              return { status: "default", fillAnim: false, mutedCorrect: false };
            })
          );
          setPulsatingX(colIndex);
        } else {
          setCorrectColumnsFound([]);
          setCorrectCount(0);
          resetColumns();

          setTimeout(() => {
            setColumnStates((prev) => {
              const next = xData.map(() => ({
                status: "default",
                fillAnim: false,
                mutedCorrect: false,
              }));
              next[colIndex] = { status: "wrong", fillAnim: false, mutedCorrect: false };
              return next;
            });
            setPulsatingX(colIndex);
          }, 50);
        }
      } else if (qData.visualType === "pulsateX") {
        setColumnStates((prev) => {
          const next = prev.slice();
          next[colIndex] = { status: "wrong", fillAnim: false, mutedCorrect: false };
          return next;
        });
        setPulsatingX(colIndex);
      } else if (qData.visualType === "fillCompare") {
        // Mark wrong column red, others greyish
        const useFillAnim = fillCompareAttemptIndex === 0;
        const newStates = xData.map((_, i) => {
          if (i === colIndex) {
            return { status: "wrong", fillAnim: useFillAnim, mutedCorrect: false };
          }
          return { status: "dimmed", fillAnim: useFillAnim, mutedCorrect: false };
        });
        setColumnStates(newStates);
        setPulsatingX(null);
        setFillCompareAttemptIndex((n) => n + 1);
      } else {
        // simple - just mark wrong
        if (isMulti) {
          if (correctColumnsFound.length > 0) {
            setColumnStates(
              xData.map((_, i) => {
                const n = i + 1;
                if (correctColumnsFound.indexOf(n) !== -1) {
                  return { status: "correct", fillAnim: false, mutedCorrect: true };
                }
                if (i === colIndex) {
                  return { status: "wrong", fillAnim: false, mutedCorrect: false };
                }
                return { status: "default", fillAnim: false, mutedCorrect: false };
              })
            );
          } else {
            setCorrectColumnsFound([]);
            setCorrectCount(0);
            const newStates = xData.map(() => ({
              status: "default",
              fillAnim: false,
              mutedCorrect: false,
            }));
            newStates[colIndex] = { status: "wrong", fillAnim: false, mutedCorrect: false };
            setColumnStates(newStates);
          }
        } else {
          setColumnStates((prev) => {
            const next = prev.slice();
            next[colIndex] = { status: "wrong", fillAnim: false, mutedCorrect: false };
            return next;
          });
        }
        setPulsatingX(null);
      }

      setFeedbackText(qData.wrongFeedback);
      setFeedbackType("wrong");
    }
  };

  // Create cross SVG element
  const createCrossSVG = (size, color) => {
    return React.createElement(
      "svg",
      {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        style: { display: "block" },
      },
      React.createElement("line", {
        x1: "3",
        y1: "3",
        x2: "21",
        y2: "21",
        stroke: color,
        strokeWidth: "3.5",
        strokeLinecap: "round",
      }),
      React.createElement("line", {
        x1: "21",
        y1: "3",
        x2: "3",
        y2: "21",
        stroke: color,
        strokeWidth: "3.5",
        strokeLinecap: "round",
      })
    );
  };

  // Render a single column of frequency marks
  const renderColumn = (colIndex) => {
    const colNumber = colIndex + 1;
    const count = yData[colIndex];
    const state = columnStates[colIndex];

    const isCorrectCol =
      answered &&
      qData.correctColumns.indexOf(colNumber) !== -1 &&
      !isMulti &&
      qData.correctLabel;

    const crossColor =
      state.status === "correct"
        ? "#4ade80"
        : state.status === "wrong"
          ? "#ff6b6b"
          // : state.status === "dimmed"
          //   ? "rgba(180,190,210,0.45)"
            : "#4ade80";

    const bgClass =
      state.status === "correct"
        ? "column-bg-correct"
        : state.status === "wrong"
          ? "column-bg-wrong"
          : state.status === "dimmed"
            ? "column-bg-dimmed"
            : "";

    const fillAnimClass = state.fillAnim ? " fill-anim" : "";

    // Build marks array (bottom to top)
    const marks = [];
    for (let i = 0; i < count; i++) {
      marks.push(
        React.createElement(
          "div",
          {
            className: "cross-mark",
            key: "mark-" + i,
          },
          createCrossSVG("2.8vw", crossColor)
        )
      );
    }

    const labelEl =
      isCorrectCol && showLabel
        ? React.createElement(
            "div",
            { className: "column-label-box" },
            React.createElement(
              "span",
              { className: "column-label-text" },
              qData.correctLabel
            ),
            React.createElement("div", { className: "column-label-line" })
          )
        : null;

    return React.createElement(
      "div",
      {
        className:
          "graph-column" +
          (state.status !== "default" ? " " + state.status : "") +
          (state.mutedCorrect ? " correct-muted" : ""),
        key: "col-" + colIndex,
        onClick: () => handleColumnClick(colIndex),
      },
      labelEl,
      React.createElement(
        "div",
        {
          className: "column-marks-container" + (bgClass ? " " + bgClass : "") + fillAnimClass,
        },
        marks
      ),
      React.createElement(
        "div",
        { className: "column-tick" }
      ),
      React.createElement(
        "div",
        {
          className:
            "column-x-label" + (pulsatingX === colIndex ? " pulsate" : ""),
        },
        colNumber
      )
    );
  };

  // Render summation box with connector lines for q4
  const renderSummationOverlay = () => {
    if (!showSummation || !qData.summationText) return null;

    const minCol = Math.min(...qData.correctColumns);
    const maxCol = Math.max(...qData.correctColumns);
    const leftPct = ((minCol - 0.5) / xData.length) * 100;
    const widthPct = ((maxCol - minCol) / xData.length) * 100;
    const centerColPct = (((minCol + maxCol) / 2) - 0.5) / xData.length * 100;

    const maxSelectedMarks = Math.max(...qData.correctColumns.map(c => yData[c-1]));
    const bottomPos = 4.7 + (maxSelectedMarks * 3.35) + 1.5;

    return React.createElement(
      "div",
      { 
        className: "summation-top-overlay",
        style: { bottom: `${bottomPos}vw` }
      },
      React.createElement(
        "div",
        { className: "summation-box-wrapper", style: { left: `${centerColPct}%` } },
        React.createElement("div", { className: "summation-box" }, qData.summationText),
        React.createElement("div", { className: "summation-stem" })
      ),
      React.createElement("div", {
        className: "summation-horizontal-bar",
        style: {
          left: `${leftPct}%`,
          width: `${widthPct}%`
        }
      }),
      xData.map((_, i) => {
        const colNumber = i + 1;
        const isTarget = qData.correctColumns.indexOf(colNumber) !== -1;
        if (!isTarget) return null;

        const marks = yData[i];
        const colHeight = 4.7 + (marks * 3.35);
        const stemHeight = bottomPos - colHeight;

        return React.createElement("div", {
          className: "summation-drop-line",
          key: "drop-" + i,
          style: {
            left: `${((colNumber - 0.5) / xData.length) * 100}%`,
            height: `${stemHeight}vw`
          }
        });
      })
    );
  };

  return React.createElement(
    "div",
    { className: "main-canvas-container" + (isStartScreen ? " start-screen" : "") },
    // Feedback row
    !isStartScreen && React.createElement(
      "div",
      { className: "feedback-row" },
      React.createElement("div", {
        className:
          "feedback-banner " +
          (feedbackType === "correct"
            ? "feedback-correct"
            : feedbackType === "wrong"
              ? "feedback-wrong"
              : feedbackType === "partial"
                ? "feedback-partial"
                : "feedback-none"),
        dangerouslySetInnerHTML: { __html: feedbackText || "&nbsp;" },
      })
    ),
    // Visual row
    React.createElement(
      "div",
      { className: "visual-row" },
      // Graph title
      React.createElement(
        "div",
        { className: "graph-title" },
        APP_DATA.graphTitle
      ),
      // Graph area
      React.createElement(
        "div",
        { className: "graph-area" },
        // Columns
        React.createElement(
          "div",
          { className: "graph-columns-row" },
          renderSummationOverlay(),
          xData.map((_, i) => renderColumn(i))
        ),
        // Number line
        React.createElement(
          "div",
          { className: "number-line" },
          React.createElement("div", { className: "number-line-arrow-left" }),
          React.createElement("div", { className: "number-line-bar" }),
          React.createElement("div", { className: "number-line-arrow-right" })
        )
      ),
      // X axis label
      React.createElement(
        "div",
        { className: "x-axis-label" },
        React.createElement(
          "span",
          { className: "x-axis-label-text" },
          APP_DATA.xAxisLabel
        )
      )
    )
  );
};
