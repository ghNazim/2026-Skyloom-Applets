/**
 * TablePanel: title, ratio table (AE/ED/DA) with arrow on right column, and numpad (2x6).
 * Flow: 0 = user fills arrow label (2), 1 = hide numpad 1s, 2 = highlight ED fill 2√3, 3 = highlight AE fill 2, 4 = done.
 */
const TablePanel = ({
  title,
  tableConfig,
  onUpdateNav,
  onUpdateImage,
  onEnableNext,
}) => {
  const { useState, useEffect, useRef } = React;

  const initialRows = [
    ["1", "√3", "2"],
    ["", "", "4"],
  ];

  const [phase, setPhase] = useState(0);
  const [arrowLabelValue, setArrowLabelValue] = useState("");
  const [arrowLabelCorrect, setArrowLabelCorrect] = useState(false);
  const [arrowLabelIncorrect, setArrowLabelIncorrect] = useState(false);
  const [arrowLabelNeutral, setArrowLabelNeutral] = useState(false);
  const [tableRows, setTableRows] = useState(initialRows);
  const [highlightedColumn, setHighlightedColumn] = useState(2);
  const timersRef = useRef([]);

  const showNumpad = phase === 0;
  const correctAnswer = tableConfig.arrowCorrectAnswer || "2";
  const maxLength = tableConfig.arrowMaxLength != null ? tableConfig.arrowMaxLength : 1;

  const clearTimers = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  };

  useEffect(() => {
    return () => clearTimers();
  }, []);

  const handleNumberClick = (num) => {
    if (phase !== 0 || arrowLabelCorrect) return;
    setArrowLabelIncorrect(false);
    setArrowLabelValue((prev) => (prev.length < maxLength ? prev + num : prev));
  };

  const handleClear = () => {
    setArrowLabelValue("");
    setArrowLabelIncorrect(false);
  };

  const handleSubmit = () => {
    if (phase !== 0 || arrowLabelCorrect) return;
    if (arrowLabelValue === correctAnswer) {
      setArrowLabelCorrect(true);
      if (window.playSound) window.playSound("correct");
      timersRef.current.push(
        setTimeout(() => {
          setPhase(1);
          if (onUpdateNav) onUpdateNav("");
        }, 500)
      );
    } else {
      setArrowLabelIncorrect(true);
      if (window.playSound) window.playSound("wrong");
      setTimeout(() => {
        setArrowLabelIncorrect(false);
        setArrowLabelValue("");
      }, 500);
    }
  };

  // Phase 1: after 1s move to phase 2, highlight ED column (play "click")
  useEffect(() => {
    if (phase !== 1) return;
    setHighlightedColumn(null);
    const t = setTimeout(() => {
      if (window.playSound) window.playSound("click");
      setArrowLabelCorrect(false);
      setArrowLabelNeutral(true);
      setPhase(2);
      setHighlightedColumn(1);
    }, 1000);
    timersRef.current.push(t);
    return () => clearTimeout(t);
  }, [phase]);

  // Phase 2: after 0.5s fill ED with 2√3 (play "tick"), switch image, after 1s go to phase 3 (play "click")
  useEffect(() => {
    if (phase !== 2) return;
    const t1 = setTimeout(() => {
      if (window.playSound) window.playSound("tick");
      setTableRows((prev) => {
        const next = prev.map((row, r) =>
          r === 1 ? row.map((cell, c) => (c === 1 ? "2√3" : cell)) : row
        );
        return next;
      });
      if (onUpdateImage && tableConfig.imageAfterED) onUpdateImage(tableConfig.imageAfterED);
    }, 500);
    const t2 = setTimeout(() => {
      if (window.playSound) window.playSound("click");
      setPhase(3);
      setHighlightedColumn(0);
    }, 1500);
    timersRef.current.push(t1, t2);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [phase]);

  // Phase 3: after 0.5s fill AE with 2 (play "tick"), switch image, after 1s enable next and nav
  useEffect(() => {
    if (phase !== 3) return;
    const t1 = setTimeout(() => {
      if (window.playSound) window.playSound("tick");
      setTableRows((prev) => {
        const next = prev.map((row, r) =>
          r === 1 ? row.map((cell, c) => (c === 0 ? "2" : cell)) : row
        );
        return next;
      });
      if (onUpdateImage && tableConfig.imageAfterAE) onUpdateImage(tableConfig.imageAfterAE);
    }, 500);
    const t2 = setTimeout(() => {
      setPhase(4);
      setHighlightedColumn(null);
      if (onEnableNext) onEnableNext();
      if (onUpdateNav && tableConfig.navFinal) onUpdateNav(tableConfig.navFinal);
    }, 1500);
    timersRef.current.push(t1, t2);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [phase]);

  const displayArrowLabel = arrowLabelCorrect ? correctAnswer : arrowLabelValue;

  return React.createElement(
    "div",
    { className: "table-panel" },
    title && React.createElement("h3", { className: "table-panel-title" }, title),
    React.createElement(
      "div",
      { className: "table-panel-table-wrap" },
      React.createElement(Table, {
        headers: tableConfig.headers || ["AE", "ED", "DA"],
        rows: tableRows,
        highlightedColumn: highlightedColumn,
        cellUpdate: null,
        showQuestionMarks: false,
        showArrow: true,
        arrowLabel: displayArrowLabel,
        isArrowLabelCorrect: arrowLabelCorrect,
        isArrowLabelIncorrect: arrowLabelIncorrect,
        isArrowLabelNeutral: arrowLabelNeutral,
        questionMarkCellCorrect: false,
        isTableComplete: phase === 4,
        arrowColumnIndex: 2,
        columnColorVariant: "ratio",
      })
    ),
    showNumpad &&
      React.createElement(Numpad, {
        layout: "2x6",
        disabled: false,
        onNumberClick: handleNumberClick,
        onClear: handleClear,
        onSubmit: handleSubmit,
      })
  );
};
