const MainCanvas = (props) => {
  const { step, initialStage, onSetNextEnabled, onUpdateNavText, onUpdateQuestionText } = props;
  const { useState, useEffect, useRef, useCallback } = React;
  const e = React.createElement;

  const gridValues = APP_DATA.gridValues;
  const tableData = APP_DATA.tableData;
  const dataOptions = APP_DATA.dataOptions;
  const frequencyOptions = APP_DATA.frequencyOptions;
  const prompts = APP_DATA.prompts;

  const blankRows = tableData.map(function () {
    return { value: null, frequency: null };
  });

  const [rows, setRows] = useState(blankRows);
  const [direction, setDirection] = useState(null);
  const [activeRow, setActiveRow] = useState(0);
  const [activeField, setActiveField] = useState("data");
  const [dropdown, setDropdown] = useState(null);
  const [wrongChoice, setWrongChoice] = useState(null);
  const [feedbackHtml, setFeedbackHtml] = useState("");
  const [focusedGridValue, setFocusedGridValue] = useState(null);
  const [cfValues, setCfValues] = useState(tableData.map(function () { return null; }));
  const [cfInput, setCfInput] = useState("");
  const [activeCfRow, setActiveCfRow] = useState(0);
  const [cfFeedbackHtml, setCfFeedbackHtml] = useState("");
  const [cfErrorRow, setCfErrorRow] = useState(null);
  const [showFormulaOverlay, setShowFormulaOverlay] = useState(false);
  const [formulaOverlay, setFormulaOverlay] = useState(null);
  const [rightRevealed, setRightRevealed] = useState(step >= 3);
  const [cfLayoutActive, setCfLayoutActive] = useState(step === 4);
  const [cfActionVisible, setCfActionVisible] = useState(step === 4);
  const [step4Mode, setStep4Mode] = useState("count");
  const [nInput, setNInput] = useState("");
  const [nError, setNError] = useState(false);
  const [nComplete, setNComplete] = useState(false);
  const [step4FeedbackHtml, setStep4FeedbackHtml] = useState("");
  const [showTotalHint, setShowTotalHint] = useState(false);
  const [wrongFormulaId, setWrongFormulaId] = useState(null);
  const [selectedFormulaId, setSelectedFormulaId] = useState(null);

  const tableWrapRef = useRef(null);
  const dataCellRefs = useRef([]);
  const freqCellRefs = useRef([]);
  const cfCellRefs = useRef([]);

  function cloneBlankRows() {
    return tableData.map(function () {
      return { value: null, frequency: null };
    });
  }

  function replaceValue(template, value) {
    return template.replace("<value>", value);
  }

  function getOrderedRows(dir) {
    var copy = tableData.slice();
    if (dir === "desc") copy.reverse();
    return copy;
  }

  function getExpectedRow(rowIndex) {
    return getOrderedRows(direction || "asc")[rowIndex];
  }

  function play(name) {
    if (typeof playSound === "function") playSound(name);
  }

  function setStep2TextForData(rowIndex) {
    onUpdateQuestionText(rowIndex === 0 ? APP_DATA.steps[2].questionText : APP_DATA.steps[2].questionTextOngoing);
    onUpdateNavText(rowIndex === 0 ? APP_DATA.steps[2].navText : APP_DATA.steps[2].navChooseData);
  }

  function setStep2TextForFrequency(value) {
    onUpdateQuestionText(APP_DATA.steps[2].questionTextOngoing);
    onUpdateNavText(replaceValue(APP_DATA.steps[2].navChooseFrequency, value));
  }

  function completeFrequencyTable(nextRows) {
    setDropdown(null);
    setFeedbackHtml("");
    setFocusedGridValue(null);
    onUpdateQuestionText(APP_DATA.steps[2].questionTextDone);
    onUpdateNavText(APP_DATA.steps[2].navTextDone);
    onSetNextEnabled(true);
    setRows(nextRows);
  }

  function openDropdown(type, rowIndex) {
    if (step !== 2) return;
    if (rowIndex !== activeRow || type !== activeField) return;
    play("click");
    setWrongChoice(null);
    setDropdown({ type: type, rowIndex: rowIndex });
    if (type === "freq") {
      setFocusedGridValue(rows[rowIndex].value);
    }
  }

  function markWrong(choice, message) {
    play("wrong");
    setWrongChoice(choice);
    if (message) setFeedbackHtml(message);
    setTimeout(function () {
      setWrongChoice(null);
    }, 500);
  }

  function handleDataOption(value) {
    var expectedValues;
    if (activeRow === 0) {
      expectedValues = [dataOptions[0], dataOptions[dataOptions.length - 1]];
    } else {
      expectedValues = [getExpectedRow(activeRow).value];
    }

    if (expectedValues.indexOf(value) === -1) {
      if (activeRow === 0) {
        markWrong(value, APP_DATA.feedback.orderReminder);
      } else {
        var previousValue = rows[activeRow - 1].value;
        var feedbackTemplate = direction === "desc" ? APP_DATA.feedback.nextLargest : APP_DATA.feedback.nextSmallest;
        markWrong(value, replaceValue(feedbackTemplate, previousValue));
      }
      return;
    }

    var nextDirection = direction;
    if (activeRow === 0) {
      nextDirection = value === dataOptions[0] ? "asc" : "desc";
      setDirection(nextDirection);
    }

    var nextRows = rows.slice();
    nextRows[activeRow] = {
      value: value,
      frequency: null,
    };

    play("correct");
    setRows(nextRows);
    setDropdown(null);
    setFeedbackHtml("");
    setFocusedGridValue(null);
    setActiveField("freq");
    setStep2TextForFrequency(value);
  }

  function handleFrequencyOption(value) {
    var expected = getExpectedRow(activeRow).frequency;
    if (value !== expected) {
      markWrong(value, "");
      return;
    }

    var nextRows = rows.slice();
    nextRows[activeRow] = {
      value: nextRows[activeRow].value,
      frequency: value,
    };

    play("correct");
    setDropdown(null);
    setFeedbackHtml("");
    setFocusedGridValue(null);

    if (activeRow >= tableData.length - 1) {
      completeFrequencyTable(nextRows);
      return;
    }

    var nextRow = activeRow + 1;
    setRows(nextRows);
    setActiveRow(nextRow);
    setActiveField("data");
    setStep2TextForData(nextRow);
  }

  function handleDropdownSelect(value) {
    if (!dropdown) return;
    if (dropdown.type === "data") handleDataOption(value);
    if (dropdown.type === "freq") handleFrequencyOption(value);
  }

  function handleNumpadNumber(num) {
    if (step !== 3 || activeCfRow >= tableData.length) return;
    if (cfErrorRow === activeCfRow || cfFeedbackHtml) {
      setCfErrorRow(null);
      setCfFeedbackHtml("");
      setCfInput(num);
      return;
    }

    setCfInput(function (prev) {
      if (prev.length >= 2) return prev;
      return prev + num;
    });
  }

  function handleNumpadClear() {
    if (step !== 3) return;
    play("click");
    setCfErrorRow(null);
    setCfFeedbackHtml("");
    setCfInput("");
  }

  function handleNumpadSubmit() {
    if (step !== 3 || activeCfRow >= tableData.length) return;
    var answer = tableData[activeCfRow].cumulativeFrequency;
    var value = parseInt(cfInput, 10);

    if (value !== answer) {
      play("wrong");
      setCfErrorRow(activeCfRow);
      setCfFeedbackHtml(activeCfRow === 0 ? APP_DATA.feedback.firstCf : APP_DATA.feedback.nextCf);
      if (activeCfRow > 0) setShowFormulaOverlay(true);
      return;
    }

    play("correct");
    var next = cfValues.slice();
    next[activeCfRow] = answer;
    setCfValues(next);
    setCfInput("");
    setCfErrorRow(null);
    setCfFeedbackHtml("");
    setShowFormulaOverlay(false);
    setFormulaOverlay(null);

    if (activeCfRow >= tableData.length - 1) {
      setActiveCfRow(tableData.length);
      onUpdateQuestionText(APP_DATA.steps[3].questionTextDone);
      onUpdateNavText(APP_DATA.steps[3].navTextDone);
      onSetNextEnabled(true);
      return;
    }

    var nextRow = activeCfRow + 1;
    setActiveCfRow(nextRow);
    onUpdateQuestionText(APP_DATA.steps[3].questionTextOngoing);
    onUpdateNavText(replaceValue(APP_DATA.steps[3].navTextDynamic, tableData[nextRow].value));
  }

  function handleFlatNumpadNumber(num) {
    if (step !== 4 || step4Mode !== "count" || nComplete) return;
    play("click");
    if (nError || step4FeedbackHtml) {
      setNError(false);
      setStep4FeedbackHtml("");
      setNInput(num);
      return;
    }

    setNInput(function (prev) {
      if (prev.length >= 2) return prev;
      return prev + num;
    });
  }

  function handleFlatNumpadClear() {
    if (step !== 4 || step4Mode !== "count" || nComplete) return;
    play("click");
    setNError(false);
    setStep4FeedbackHtml("");
    setNInput("");
  }

  function handleFlatNumpadSubmit() {
    if (step !== 4 || step4Mode !== "count" || nComplete) return;
    var answer = tableData[tableData.length - 1].cumulativeFrequency;
    var value = parseInt(nInput, 10);

    if (value !== answer) {
      play("wrong");
      setNError(true);
      setShowTotalHint(true);
      setStep4FeedbackHtml(APP_DATA.feedback.totalCount);
      return;
    }

    play("correct");
    setNInput(String(answer));
    setNError(false);
    setNComplete(true);
    setShowTotalHint(false);
    setStep4FeedbackHtml("");
    setStep4Mode("formula");
    onUpdateQuestionText(APP_DATA.steps[4].questionTextFormula);
    onUpdateNavText(APP_DATA.steps[4].navTextFormula);
  }

  function handleFormulaChoice(option) {
    if (step !== 4 || step4Mode !== "formula" || selectedFormulaId) return;

    if (!option.correct) {
      play("wrong");
      setWrongFormulaId(option.id);
      setStep4FeedbackHtml(APP_DATA.feedback.oddFormula);
      setTimeout(function () {
        setWrongFormulaId(null);
      }, 500);
      return;
    }

    play("correct");
    setSelectedFormulaId(option.id);
    setStep4FeedbackHtml("");
    onSetNextEnabled(false);
  }

  const updateFormulaOverlay = useCallback(function () {
    if (!showFormulaOverlay || activeCfRow <= 0 || !tableWrapRef.current) {
      setFormulaOverlay(null);
      return;
    }

    var freqCell = freqCellRefs.current[activeCfRow];
    var prevCfCell = cfCellRefs.current[activeCfRow - 1];
    var wrap = tableWrapRef.current;
    if (!freqCell || !prevCfCell || !wrap) return;

    var wrapRect = wrap.getBoundingClientRect();
    var fRect = freqCell.getBoundingClientRect();
    var cRect = prevCfCell.getBoundingClientRect();
    var fPos = {
      x: fRect.left - wrapRect.left + fRect.width / 2,
      y: fRect.top - wrapRect.top + fRect.height / 2,
    };
    var cPos = {
      x: cRect.left - wrapRect.left + cRect.width / 2,
      y: cRect.top - wrapRect.top + cRect.height / 2,
    };
    var dx = cPos.x - fPos.x;
    var dy = cPos.y - fPos.y;
    var dist = Math.max(1, Math.sqrt(dx * dx + dy * dy));
    var cos = dx / dist;
    var sin = dy / dist;
    var halfHeight = fRect.height * 0.72;
    var extension = fRect.width * 0.18;
    var perpX = -sin * halfHeight;
    var perpY = cos * halfHeight;
    var start = { x: fPos.x - cos * extension, y: fPos.y - sin * extension };
    var end = { x: cPos.x + cos * extension, y: cPos.y + sin * extension };
    var points = [
      [start.x - perpX, start.y - perpY],
      [end.x - perpX, end.y - perpY],
      [end.x + perpX, end.y + perpY],
      [start.x + perpX, start.y + perpY],
    ];

    setFormulaOverlay({
      points: points.map(function (point) { return point.join(","); }).join(" "),
      plusLeft: (fPos.x + cPos.x) / 2,
      plusTop: (fPos.y + cPos.y) / 2,
    });
  }, [showFormulaOverlay, activeCfRow]);

  useEffect(function () {
    updateFormulaOverlay();
    window.addEventListener("resize", updateFormulaOverlay);
    return function () {
      window.removeEventListener("resize", updateFormulaOverlay);
    };
  }, [updateFormulaOverlay]);

  useEffect(function () {
    if (initialStage === "final") {
      if (step === 1) {
        setRightRevealed(false);
        setCfLayoutActive(false);
        setCfActionVisible(false);
        onSetNextEnabled(true);
      }
      if (step === 2) {
        setRightRevealed(true);
        setCfLayoutActive(false);
        setCfActionVisible(false);
        setRows(tableData.map(function (row) {
          return { value: row.value, frequency: row.frequency };
        }));
        setDirection("asc");
        setActiveRow(tableData.length);
        setActiveField("data");
        setDropdown(null);
        setFeedbackHtml("");
        onUpdateQuestionText(APP_DATA.steps[2].questionTextDone);
        onUpdateNavText(APP_DATA.steps[2].navTextDone);
        onSetNextEnabled(true);
      }
      if (step === 3) {
        setRightRevealed(true);
        setCfLayoutActive(true);
        setCfActionVisible(true);
        setRows(tableData.map(function (row) {
          return { value: row.value, frequency: row.frequency };
        }));
        setCfValues(tableData.map(function (row) { return row.cumulativeFrequency; }));
        setActiveCfRow(tableData.length);
        setCfInput("");
        setCfFeedbackHtml("");
        setShowFormulaOverlay(false);
        onUpdateQuestionText(APP_DATA.steps[3].questionTextDone);
        onUpdateNavText(APP_DATA.steps[3].navTextDone);
        onSetNextEnabled(true);
      }
      if (step === 4) {
        setRightRevealed(true);
        setCfLayoutActive(true);
        setCfActionVisible(true);
        setRows(tableData.map(function (row) {
          return { value: row.value, frequency: row.frequency };
        }));
        setCfValues(tableData.map(function (row) { return row.cumulativeFrequency; }));
        setActiveCfRow(tableData.length);
        setStep4Mode("formula");
        setNInput(String(tableData[tableData.length - 1].cumulativeFrequency));
        setNError(false);
        setNComplete(true);
        setStep4FeedbackHtml("");
        setShowTotalHint(false);
        setWrongFormulaId(null);
        setSelectedFormulaId("odd");
        onUpdateQuestionText(APP_DATA.steps[4].questionTextFormula);
        onUpdateNavText(APP_DATA.steps[4].navTextFormula);
        onSetNextEnabled(false);
      }
      return;
    }

    if (step === 1) {
      setRightRevealed(false);
      setCfLayoutActive(false);
      setCfActionVisible(false);
      setRows(cloneBlankRows());
      setDirection(null);
      setActiveRow(0);
      setActiveField("data");
      setDropdown(null);
      setFeedbackHtml("");
      setFocusedGridValue(null);
      setCfValues(tableData.map(function () { return null; }));
      setActiveCfRow(0);
      setCfInput("");
      setCfFeedbackHtml("");
      setShowFormulaOverlay(false);
      setFormulaOverlay(null);
      setTimeout(function () {
        onSetNextEnabled(true);
      }, 0);
    }

    if (step === 2) {
      setRightRevealed(false);
      setCfLayoutActive(false);
      setCfActionVisible(false);
      setRows(cloneBlankRows());
      setDirection(null);
      setActiveRow(0);
      setActiveField("data");
      setDropdown(null);
      setFeedbackHtml("");
      setFocusedGridValue(null);
      setCfValues(tableData.map(function () { return null; }));
      setActiveCfRow(0);
      setCfInput("");
      setCfFeedbackHtml("");
      setShowFormulaOverlay(false);
      setFormulaOverlay(null);
      setTimeout(function () {
        onUpdateQuestionText(APP_DATA.steps[2].questionText);
        onUpdateNavText(APP_DATA.steps[2].navText);
        onSetNextEnabled(false);
      }, 0);
      setTimeout(function () {
        setRightRevealed(true);
      }, 60);
    }

    if (step === 3) {
      setRightRevealed(true);
      setCfLayoutActive(false);
      setCfActionVisible(false);
      setRows(tableData.map(function (row) {
        return { value: row.value, frequency: row.frequency };
      }));
      setDirection("asc");
      setDropdown(null);
      setFeedbackHtml("");
      setFocusedGridValue(null);
      setCfValues(tableData.map(function () { return null; }));
      setActiveCfRow(0);
      setCfInput("");
      setCfFeedbackHtml("");
      setCfErrorRow(null);
      setShowFormulaOverlay(false);
      setFormulaOverlay(null);
      setTimeout(function () {
        onUpdateQuestionText(APP_DATA.steps[3].questionText);
        onUpdateNavText(APP_DATA.steps[3].navText);
        onSetNextEnabled(false);
      }, 0);
      setTimeout(function () {
        setCfLayoutActive(true);
      }, 80);
      setTimeout(function () {
        setCfActionVisible(true);
      }, 720);
    }

    if (step === 4) {
      setRightRevealed(true);
      setCfLayoutActive(true);
      setCfActionVisible(true);
      setRows(tableData.map(function (row) {
        return { value: row.value, frequency: row.frequency };
      }));
      setDirection("asc");
      setDropdown(null);
      setFeedbackHtml("");
      setFocusedGridValue(null);
      setCfValues(tableData.map(function (row) { return row.cumulativeFrequency; }));
      setActiveCfRow(tableData.length);
      setCfInput("");
      setCfFeedbackHtml("");
      setCfErrorRow(null);
      setShowFormulaOverlay(false);
      setFormulaOverlay(null);
      setStep4Mode("count");
      setNInput("");
      setNError(false);
      setNComplete(false);
      setStep4FeedbackHtml("");
      setShowTotalHint(false);
      setWrongFormulaId(null);
      setSelectedFormulaId(null);
      setTimeout(function () {
        onUpdateQuestionText(APP_DATA.steps[4].questionText);
        onUpdateNavText(APP_DATA.steps[4].navText);
        onSetNextEnabled(false);
      }, 0);
    }
  }, [step, initialStage]);

  function renderGrid() {
    return e("div", { className: "raw-grid", "aria-label": "Dataset values" },
      gridValues.map(function (value, index) {
        var dimmed = focusedGridValue !== null && value !== focusedGridValue;
        var highlighted = focusedGridValue !== null && value === focusedGridValue;
        return e("div", {
          className: "raw-number-box" + (dimmed ? " dimmed" : "") + (highlighted ? " focused" : ""),
          key: "grid-" + index,
        }, value);
      })
    );
  }

  function getCellText(rowIndex, field) {
    if (field === "data") {
      if (rows[rowIndex].value !== null) return rows[rowIndex].value;
      if (step === 2 && activeRow === rowIndex && activeField === "data") {
        return dropdown && dropdown.type === "data" ? prompts.inProgress : prompts.chooseDataPoint;
      }
      return "";
    }

    if (rows[rowIndex].frequency !== null) return rows[rowIndex].frequency;
    if (step === 2 && activeRow === rowIndex && activeField === "freq") {
      return dropdown && dropdown.type === "freq" ? prompts.inProgress : prompts.chooseFrequency;
    }
    return "";
  }

  function renderDropdown() {
    if (!dropdown || step !== 2) return null;
    var usedDataValues = rows.slice(0, activeRow).map(function (row) { return row.value; });
    var options = dropdown.type === "data" ?
      dataOptions.filter(function (option) { return usedDataValues.indexOf(option) === -1; }) :
      frequencyOptions;
    var dropdownStyle = {};

    if (dropdown.type === "data") {
      var activeDataCell = dataCellRefs.current[dropdown.rowIndex];
      var tableWrap = tableWrapRef.current;
      if (activeDataCell && tableWrap) {
        var cellRect = activeDataCell.getBoundingClientRect();
        var wrapRect = tableWrap.getBoundingClientRect();
        dropdownStyle.left = (cellRect.right - wrapRect.left + cellRect.width * 0.08) + "px";
        dropdownStyle.top = (cellRect.top - wrapRect.top) + "px";
      }
    }

    return e("div", {
      className: "choice-dropdown " + dropdown.type + "-dropdown",
      style: dropdownStyle,
    },
      options.map(function (option) {
        return e("button", {
          type: "button",
          key: dropdown.type + "-" + option,
          className: "choice-option" + (wrongChoice === option ? " wrong shake" : ""),
          onClick: function () { handleDropdownSelect(option); },
        }, option);
      })
    );
  }

  function renderFrequencyTable(showCf) {
    return e("div", { className: "table-wrap", ref: tableWrapRef },
      e("div", { className: "median-table" + (showCf ? " with-cf" : "") },
        e("div", { className: "median-table-row header-row" },
          e("div", {
            className: "median-table-cell header-cell",
            dangerouslySetInnerHTML: { __html: APP_DATA.tableHeaders.data },
          }),
          e("div", {
            className: "median-table-cell header-cell",
            dangerouslySetInnerHTML: { __html: APP_DATA.tableHeaders.frequency },
          }),
          showCf ? e("div", {
            className: "median-table-cell header-cell cf-header",
            dangerouslySetInnerHTML: { __html: APP_DATA.tableHeaders.cumulativeFrequency },
          }) : null
        ),
        tableData.map(function (row, index) {
          var dataActive = step === 2 && activeRow === index && activeField === "data" && rows[index].value === null;
          var freqActive = step === 2 && activeRow === index && activeField === "freq" && rows[index].frequency === null;
          var cfActive = step === 3 && activeCfRow === index;
          var cfFilled = cfValues[index] !== null;
          var cfDisplay = cfActive ? (cfInput || prompts.unknown) : (cfFilled ? cfValues[index] : prompts.unknown);
          var totalHintLast = step === 4 && showTotalHint && index === tableData.length - 1;
          var totalHintDim = step === 4 && showTotalHint && index !== tableData.length - 1;

          return e("div", { className: "median-table-row", key: "row-" + index },
            e("button", {
              type: "button",
              className: "median-table-cell data-cell" +
                (dataActive ? " active selectable" : "") +
                (dropdown && dropdown.type === "data" && dropdown.rowIndex === index ? " dropdown-open" : ""),
              onClick: function () { openDropdown("data", index); },
              disabled: !dataActive,
              ref: function (el) { dataCellRefs.current[index] = el; },
            }, getCellText(index, "data")),
            e("button", {
              type: "button",
              className: "median-table-cell freq-cell" +
                (freqActive ? " active selectable" : "") +
                (dropdown && dropdown.type === "freq" && dropdown.rowIndex === index ? " dropdown-open" : ""),
              onClick: function () { openDropdown("freq", index); },
              disabled: !freqActive,
              ref: function (el) { freqCellRefs.current[index] = el; },
            }, getCellText(index, "freq")),
            showCf ? e("div", {
              className: "median-table-cell cf-cell" +
                (!cfFilled && !cfActive ? " waiting" : "") +
                (cfActive ? " active" : "") +
                (cfFilled ? " filled" : "") +
                (cfErrorRow === index ? " wrong" : "") +
                (totalHintDim ? " total-hint-dim" : "") +
                (totalHintLast ? " total-hint-last" : ""),
              ref: function (el) { cfCellRefs.current[index] = el; },
            }, cfDisplay) : null
          );
        })
      ),
      renderDropdown(),
      formulaOverlay ? e("svg", {
        className: "formula-overlay",
        viewBox: "0 0 " + (tableWrapRef.current ? tableWrapRef.current.offsetWidth : 100) + " " + (tableWrapRef.current ? tableWrapRef.current.offsetHeight : 100),
      },
        e("polygon", { points: formulaOverlay.points })
      ) : null,
      formulaOverlay ? e("div", {
        className: "formula-plus",
        style: { left: formulaOverlay.plusLeft + "px", top: formulaOverlay.plusTop + "px" },
      }, "+") : null
    );
  }

  function renderFeedbackRow() {
    return e("div", { className: "feedback-row" + (cfLayoutActive ? " collapsed" : "") },
      feedbackHtml ? e("div", {
        className: "feedback-card",
        dangerouslySetInnerHTML: { __html: feedbackHtml },
      }) : null
    );
  }

  function renderActionColumn() {
    if (step === 4) return renderStep4ActionColumn();

    return e("div", { className: "cf-action-column" },
      e("div", { className: "cf-feedback-space" },
        cfFeedbackHtml ? e("div", {
          className: "feedback-card cf-feedback-card",
          dangerouslySetInnerHTML: { __html: cfFeedbackHtml },
        }) : null
      ),
      e(Numpad, {
        disabled: activeCfRow >= tableData.length,
        onNumberClick: handleNumpadNumber,
        onClear: handleNumpadClear,
        onSubmit: handleNumpadSubmit,
      })
    );
  }

  function renderFraction(numerator, denominator) {
    return e("span", { className: "stacked-fraction" },
      e("span", { className: "fraction-top" }, numerator),
      e("span", { className: "fraction-bar" }),
      e("span", { className: "fraction-bottom" }, denominator)
    );
  }

  function renderFormulaCore(id) {
    if (id === "odd") {
      return e("span", { className: "formula-core" },
        e("span", { className: "paren" }, "("),
        renderFraction("n+1", "2"),
        e("span", { className: "paren" }, ")"),
        e("sup", { className: "formula-sup" }, "th")
      );
    }

    return e("span", { className: "formula-core" },
      e("span", { className: "paren" }, "("),
      renderFraction("n", "2"),
      e("span", { className: "paren" }, ")"),
      e("sup", { className: "formula-sup" }, "th")
    );
  }

  function renderFlatNumpad() {
    var buttons = [
      { label: "1", type: "num" },
      { label: "2", type: "num" },
      { label: "3", type: "num" },
      { label: "4", type: "num" },
      { label: "5", type: "num" },
      { label: "\u232b", type: "clear" },
      { label: "6", type: "num" },
      { label: "7", type: "num" },
      { label: "8", type: "num" },
      { label: "9", type: "num" },
      { label: "0", type: "num" },
      { label: "\u2713", type: "submit" },
    ];

    return e("div", { className: "flat-numpad" },
      buttons.map(function (button, index) {
        return e("button", {
          type: "button",
          key: "flat-" + index,
          className: "flat-numpad-button " + button.type,
          onClick: function () {
            if (button.type === "num") handleFlatNumpadNumber(button.label);
            if (button.type === "clear") handleFlatNumpadClear();
            if (button.type === "submit") handleFlatNumpadSubmit();
          },
          disabled: nComplete,
        }, button.label);
      })
    );
  }

  function renderFormulaOptions() {
    return e("div", { className: "formula-options" },
      APP_DATA.steps[4].options.map(function (option) {
        return e("button", {
          type: "button",
          key: "formula-" + option.id,
          className: "formula-option" +
            (wrongFormulaId === option.id ? " wrong shake" : "") +
            (selectedFormulaId === option.id ? " correct" : ""),
          onClick: function () { handleFormulaChoice(option); },
          disabled: !!selectedFormulaId,
        },
          renderFormulaCore(option.id),
          e("span", { className: "formula-suffix" }, option.suffix)
        );
      })
    );
  }

  function renderStep4ActionColumn() {
    return e("div", { className: "step4-action-column" },
      e("div", { className: "step4-math-row" },
        e("div", { className: "n-equation" },
          e("span", {
            className: "n-label",
            dangerouslySetInnerHTML: { __html: APP_DATA.steps[4].nLabel },
          }),
          e("div", {
            className: "n-answer-box" +
              (!nComplete ? " active" : "") +
              (nError ? " wrong" : "") +
              (nComplete ? " filled" : ""),
          }, nInput || prompts.inProgress)
        )
      ),
      e("div", { className: "step4-feedback-row" },
        step4Mode === "formula" && selectedFormulaId ?
          e("div", { className: "middle-position-label" }, APP_DATA.steps[4].middlePosition) :
          (step4FeedbackHtml ? e("div", {
            className: "feedback-card step4-feedback-card",
            dangerouslySetInnerHTML: { __html: step4FeedbackHtml },
          }) : null)
      ),
      e("div", { className: "step4-control-row" },
        step4Mode === "count" ? renderFlatNumpad() : renderFormulaOptions()
      )
    );
  }

  var isCfStage = step === 3 || step === 4;
  var showRight = step >= 2;

  return e("div", { className: "main-canvas-container" + (isCfStage ? " cf-stage" : "") },
    e("div", { className: "visual-row" },
      e("div", { className: "left-visual-column" + (cfLayoutActive ? " hidden" : "") },
        renderGrid()
      ),
      e("div", { className: "right-visual-column" + (showRight && rightRevealed ? " visible" : "") + (cfLayoutActive ? " cf-table-column" : "") },
        showRight ? renderFrequencyTable(isCfStage) : null
      ),
      isCfStage ? e("div", {
        className: "cf-action-shell" +
          (cfLayoutActive ? " expanded" : "") +
          (cfActionVisible ? " visible" : ""),
      }, renderActionColumn()) : null
    ),
    renderFeedbackRow()
  );
};
