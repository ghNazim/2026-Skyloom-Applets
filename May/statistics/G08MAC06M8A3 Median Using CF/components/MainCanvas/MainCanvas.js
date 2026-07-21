const MainCanvas = (props) => {
  const { step, initialStage, onSetNextEnabled, onUpdateNavText, onUpdateQuestionText, onAutoAdvance, tableDirection, onSetTableDirection } = props;
  const { useState, useEffect, useRef, useCallback } = React;
  const e = React.createElement;

  const gridValues = APP_DATA.gridValues;
  const tableData = APP_DATA.tableData;
  const dataOptions = APP_DATA.dataOptions;
  const frequencyOptions = APP_DATA.frequencyOptions;
  const prompts = APP_DATA.prompts;
  const FORMULA_HINT_HALF_HEIGHT_SCALE = 0.42;

  const blankRows = tableData.map(function () {
    return { value: null, frequency: null };
  });

  const [rows, setRows] = useState(blankRows);
  const [direction, setDirection] = useState(null);
  const [activeRow, setActiveRow] = useState(0);
  const [activeField, setActiveField] = useState("data");
  const [dropdown, setDropdown] = useState(null);
  const [step2NudgeDismissed, setStep2NudgeDismissed] = useState(false);
  const [step2NudgeReady, setStep2NudgeReady] = useState(false);
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
  const [cfLayoutActive, setCfLayoutActive] = useState(step >= 4);
  const [cfActionVisible, setCfActionVisible] = useState(step >= 4);
  const [step4Mode, setStep4Mode] = useState("count");
  const [nInput, setNInput] = useState("");
  const [nError, setNError] = useState(false);
  const [nComplete, setNComplete] = useState(false);
  const [step4FeedbackHtml, setStep4FeedbackHtml] = useState("");
  const [showTotalHint, setShowTotalHint] = useState(false);
  const [wrongFormulaId, setWrongFormulaId] = useState(null);
  const [selectedFormulaId, setSelectedFormulaId] = useState(null);
  const [formulaTransferDone, setFormulaTransferDone] = useState(false);
  const [flyingFormulaClone, setFlyingFormulaClone] = useState(null);
  const [formulaStage, setFormulaStage] = useState("n");
  const [formulaBoxVisible, setFormulaBoxVisible] = useState(false);
  const [formulaFading, setFormulaFading] = useState(false);
  const [flyingNClone, setFlyingNClone] = useState(null);
  const [medianEntryVisible, setMedianEntryVisible] = useState(false);
  const [medianInput, setMedianInput] = useState("");
  const [medianError, setMedianError] = useState(false);
  const [medianCorrect, setMedianCorrect] = useState(false);
  const [showRangeColumn, setShowRangeColumn] = useState(false);
  const [rangeVisibleCount, setRangeVisibleCount] = useState(0);
  const [finalSettled, setFinalSettled] = useState(false);
  const [finalArrow, setFinalArrow] = useState(null);

  const tableWrapRef = useRef(null);
  const finalWrapRef = useRef(null);
  const finalMedianCellRef = useRef(null);
  const finalMedianLabelRef = useRef(null);
  const actionPanelRef = useRef(null);
  const nAnswerRef = useRef(null);
  const formulaNRef = useRef(null);
  const step4ActionRef = useRef(null);
  const step4MedianPositionRef = useRef(null);
  const formulaOptionRefs = useRef({});
  const activeStep2CellRef = useRef(null);
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

  function getActiveDirection() {
    return direction || tableDirection || "asc";
  }

  function getRowsForDirection(dir) {
    return getOrderedRows(dir).map(function (row) {
      return { value: row.value, frequency: row.frequency };
    });
  }

  function getCumulativeValuesForDirection(dir) {
    var total = 0;
    return getOrderedRows(dir).map(function (row) {
      total += row.frequency;
      return total;
    });
  }

  function getTotalFrequency() {
    var cumulativeValues = getCumulativeValuesForDirection(getActiveDirection());
    return cumulativeValues[cumulativeValues.length - 1];
  }

  function getExpectedRow(rowIndex) {
    return getOrderedRows(getActiveDirection())[rowIndex];
  }

  function getOrderedFilledRows() {
    return getRowsForDirection(getActiveDirection());
  }

  function getOrderedCumulativeValues() {
    return getCumulativeValuesForDirection(getActiveDirection());
  }

  function fillTableForDirection(dir, includeCumulative) {
    setDirection(dir);
    setRows(getRowsForDirection(dir));
    setCfValues(includeCumulative ? getCumulativeValuesForDirection(dir) : tableData.map(function () { return null; }));
  }

  function getOrdinalHtml(value) {
    if (current_language === "id") return "ke-" + value;
    var mod100 = value % 100;
    var suffix = "th";
    if (mod100 < 11 || mod100 > 13) {
      if (value % 10 === 1) suffix = "st";
      if (value % 10 === 2) suffix = "nd";
      if (value % 10 === 3) suffix = "rd";
    }
    return value + "<sup>" + suffix + "</sup>";
  }

  function getPositionRangeHtml(index) {
    var cumulativeValues = getOrderedCumulativeValues();
    var start = index === 0 ? 1 : cumulativeValues[index - 1] + 1;
    var end = cumulativeValues[index];
    return getOrdinalHtml(start) + " - " + getOrdinalHtml(end);
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
    setStep2NudgeDismissed(true);
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
        var feedbackTemplate = getActiveDirection() === "desc" ? APP_DATA.feedback.nextLargest : APP_DATA.feedback.nextSmallest;
        markWrong(value, replaceValue(feedbackTemplate, previousValue));
      }
      return;
    }

    var nextDirection = direction;
    if (activeRow === 0) {
      nextDirection = value === dataOptions[0] ? "asc" : "desc";
      setDirection(nextDirection);
      if (onSetTableDirection) onSetTableDirection(nextDirection);
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
    if (cfErrorRow === activeCfRow) {
      setCfErrorRow(null);
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
    setCfInput("");
  }

  function handleNumpadSubmit() {
    if (step !== 3 || activeCfRow >= tableData.length) return;
    var orderedRows = getOrderedRows(getActiveDirection());
    var cumulativeValues = getOrderedCumulativeValues();
    var answer = cumulativeValues[activeCfRow];
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
    onUpdateNavText(replaceValue(APP_DATA.steps[3].navTextDynamic, orderedRows[nextRow].value));
  }

  function handleFlatNumpadNumber(num) {
    if (step !== 4 || step4Mode !== "count" || nComplete) return;
    play("click");
    if (nError) {
      setNError(false);
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
    setNInput("");
  }

  function handleFlatNumpadSubmit() {
    if (step !== 4 || step4Mode !== "count" || nComplete) return;
    var answer = getTotalFrequency();
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
    setFormulaTransferDone(false);
    setStep4FeedbackHtml("");
    setTimeout(function () {
      startFormulaChoiceClone(option.id);
    }, 40);
    setTimeout(function () {
      setFormulaTransferDone(true);
      setFlyingFormulaClone(null);
    }, 780);
    setTimeout(function () {
      if (onAutoAdvance) onAutoAdvance();
    }, 1120);
  }

  function startFormulaChoiceClone(optionId) {
    if (!step4ActionRef.current || !step4MedianPositionRef.current) return;
    var source = formulaOptionRefs.current[optionId];
    if (!source) return;

    var panelRect = step4ActionRef.current.getBoundingClientRect();
    var fromRect = source.getBoundingClientRect();
    var toRect = step4MedianPositionRef.current.getBoundingClientRect();
    var startLeft = fromRect.left - panelRect.left + fromRect.width / 2;
    var startTop = fromRect.top - panelRect.top + fromRect.height / 2;
    var endLeft = toRect.left - panelRect.left + toRect.width / 2;
    var endTop = toRect.top - panelRect.top + toRect.height / 2;

    setFlyingFormulaClone({
      optionId: optionId,
      left: startLeft,
      top: startTop,
      tx: endLeft - startLeft,
      ty: endTop - startTop,
      active: false,
    });
    setTimeout(function () {
      setFlyingFormulaClone(function (prev) {
        if (!prev) return prev;
        var next = {};
        for (var key in prev) next[key] = prev[key];
        next.active = true;
        return next;
      });
    }, 40);
  }

  function startFlyingNClone() {
    if (!actionPanelRef.current || !nAnswerRef.current || !formulaNRef.current) return;
    var panelRect = actionPanelRef.current.getBoundingClientRect();
    var fromRect = nAnswerRef.current.getBoundingClientRect();
    var toRect = formulaNRef.current.getBoundingClientRect();
    var startLeft = fromRect.left - panelRect.left + fromRect.width / 2;
    var startTop = fromRect.top - panelRect.top + fromRect.height / 2;
    var endLeft = toRect.left - panelRect.left + toRect.width / 2;
    var endTop = toRect.top - panelRect.top + toRect.height / 2;
    var fromFontSize = parseFloat(window.getComputedStyle(nAnswerRef.current).fontSize) || fromRect.height;
    var toFontSize = parseFloat(window.getComputedStyle(formulaNRef.current).fontSize) || fromFontSize;

    setFlyingNClone({
      left: startLeft,
      top: startTop,
      tx: endLeft - startLeft,
      ty: endTop - startTop,
      scale: Math.max(0.1, toFontSize / fromFontSize),
      active: false,
    });
    setTimeout(function () {
      setFlyingNClone(function (prev) {
        if (!prev) return prev;
        var next = {};
        for (var key in prev) next[key] = prev[key];
        next.active = true;
        return next;
      });
    }, 40);
  }

  function fadeFormulaTo(stage) {
    setFormulaFading(true);
    setTimeout(function () {
      setFormulaStage(stage);
      setFormulaFading(false);
    }, 320);
  }

  function handleMedianNumpadNumber(num) {
    if (step !== 5 || !medianEntryVisible || medianCorrect) return;
    play("click");
    if (medianError) {
      setMedianError(false);
      setMedianInput(num);
      return;
    }
    setMedianInput(function (prev) {
      if (prev.length >= 2) return prev;
      return prev + num;
    });
  }

  function handleMedianNumpadClear() {
    if (step !== 5 || !medianEntryVisible || medianCorrect) return;
    play("click");
    setMedianError(false);
    setMedianInput("");
  }

  function showPositionRangeHint() {
    setShowRangeColumn(true);
    setRangeVisibleCount(0);
    for (var i = 0; i < tableData.length; i++) {
      (function (idx) {
        setTimeout(function () {
          setRangeVisibleCount(function (prev) { return Math.max(prev, idx + 1); });
        }, idx * 170);
      })(i);
    }
  }

  function handleMedianNumpadSubmit() {
    if (step !== 5 || !medianEntryVisible || medianCorrect) return;
    var value = parseInt(medianInput, 10);
    if (value !== 15) {
      play("wrong");
      setMedianError(true);
      onUpdateNavText(APP_DATA.steps[5].navTextRetry);
      showPositionRangeHint();
      return;
    }

    play("correct");
    setMedianInput("15");
    setMedianError(false);
    setMedianCorrect(true);
    onUpdateQuestionText(APP_DATA.steps[5].questionTextDone);
    onUpdateNavText(APP_DATA.steps[5].navTextDone);
    onSetNextEnabled(true);
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
    var halfHeight = fRect.height * FORMULA_HINT_HALF_HEIGHT_SCALE;
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

  const updateFinalArrow = useCallback(function () {
    var wrap = finalWrapRef.current;
    var cell = finalMedianCellRef.current;
    var label = finalMedianLabelRef.current;
    if (!wrap || !cell || !label) return;

    var wrapRect = wrap.getBoundingClientRect();
    var cellRect = cell.getBoundingClientRect();
    var labelRect = label.getBoundingClientRect();

    var startX = cellRect.left - wrapRect.left;
    var startY = cellRect.top - wrapRect.top + cellRect.height / 2;
    var endX = labelRect.left - wrapRect.left;
    var endY = labelRect.top - wrapRect.top + labelRect.height / 2;
    var elbowX = Math.min(startX - cellRect.width * 0.48, endX - labelRect.width * 0.42);
    var strokeWidth = Math.max(3, cellRect.height * 0.08);
    var headLength = Math.max(12, cellRect.height * 0.45);
    var headHalfHeight = Math.max(6, cellRect.height * 0.2);

    setFinalArrow({
      viewWidth: Math.max(1, wrapRect.width),
      viewHeight: Math.max(1, wrapRect.height),
      path: "M " + startX + " " + startY + " H " + elbowX + " V " + endY + " H " + endX,
      strokeWidth: strokeWidth,
      headLength: headLength,
      headHalfHeight: headHalfHeight,
    });
  }, []);

  useEffect(function () {
    updateFormulaOverlay();
    window.addEventListener("resize", updateFormulaOverlay);
    return function () {
      window.removeEventListener("resize", updateFormulaOverlay);
    };
  }, [updateFormulaOverlay]);

  useEffect(function () {
    var savedDirection = tableDirection || "asc";
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
        fillTableForDirection(savedDirection, false);
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
        fillTableForDirection(savedDirection, true);
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
        fillTableForDirection(savedDirection, true);
        setActiveCfRow(tableData.length);
        setStep4Mode("formula");
        setNInput(String(getTotalFrequency()));
        setNError(false);
        setNComplete(true);
        setStep4FeedbackHtml("");
        setShowTotalHint(false);
        setWrongFormulaId(null);
        setSelectedFormulaId("odd");
        setFormulaTransferDone(true);
        setFlyingFormulaClone(null);
        onUpdateQuestionText(APP_DATA.steps[4].questionTextFormula);
        onUpdateNavText(APP_DATA.steps[4].navTextFormula);
        onSetNextEnabled(true);
      }
      if (step === 5) {
        setRightRevealed(true);
        setCfLayoutActive(true);
        setCfActionVisible(true);
        fillTableForDirection(savedDirection, true);
        setActiveCfRow(tableData.length);
        setNInput(String(getTotalFrequency()));
        setNComplete(true);
        setFormulaStage("13");
        setFormulaBoxVisible(true);
        setFormulaFading(false);
        setFlyingNClone(null);
        setMedianEntryVisible(true);
        setMedianInput("15");
        setMedianError(false);
        setMedianCorrect(true);
        setShowRangeColumn(true);
        setRangeVisibleCount(tableData.length);
        onUpdateQuestionText(APP_DATA.steps[5].questionTextDone);
        onUpdateNavText(APP_DATA.steps[5].navTextDone);
        onSetNextEnabled(true);
      }
      if (step === 6) {
        fillTableForDirection(savedDirection, true);
        setActiveCfRow(tableData.length);
        setShowRangeColumn(false);
        setRangeVisibleCount(0);
        setFinalSettled(true);
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
      fillTableForDirection(savedDirection, false);
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
        onUpdateNavText(replaceValue(APP_DATA.steps[3].navTextDynamic, getOrderedRows(savedDirection)[0].value));
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
      fillTableForDirection(savedDirection, true);
      setDropdown(null);
      setFeedbackHtml("");
      setFocusedGridValue(null);
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
      setFormulaTransferDone(false);
      setFlyingFormulaClone(null);
      setTimeout(function () {
        onUpdateQuestionText(APP_DATA.steps[4].questionText);
        onUpdateNavText(APP_DATA.steps[4].navText);
        onSetNextEnabled(false);
      }, 0);
    }

    if (step === 5) {
      setRightRevealed(true);
      setCfLayoutActive(true);
      setCfActionVisible(true);
      fillTableForDirection(savedDirection, true);
      setDropdown(null);
      setFeedbackHtml("");
      setFocusedGridValue(null);
      setActiveCfRow(tableData.length);
      setCfInput("");
      setCfFeedbackHtml("");
      setCfErrorRow(null);
      setShowFormulaOverlay(false);
      setFormulaOverlay(null);
      setStep4Mode("formula");
      setNInput(String(getTotalFrequency()));
      setNError(false);
      setNComplete(true);
      setStep4FeedbackHtml("");
      setShowTotalHint(false);
      setWrongFormulaId(null);
      setSelectedFormulaId("odd");
      setFormulaTransferDone(true);
      setFlyingFormulaClone(null);
      setFormulaStage("n");
      setFormulaBoxVisible(false);
      setFormulaFading(false);
      setFlyingNClone(null);
      setMedianEntryVisible(false);
      setMedianInput("");
      setMedianError(false);
      setMedianCorrect(false);
      setShowRangeColumn(false);
      setRangeVisibleCount(0);
      setTimeout(function () {
        onUpdateQuestionText(APP_DATA.steps[5].questionText);
        onUpdateNavText(APP_DATA.steps[5].navText);
        onSetNextEnabled(false);
      }, 0);
      setTimeout(function () { setFormulaBoxVisible(true); }, 80);
      setTimeout(function () { startFlyingNClone(); }, 1180);
      setTimeout(function () {
        setFlyingNClone(null);
        setFormulaStage("25");
      }, 1980);
      setTimeout(function () { fadeFormulaTo("26"); }, 2980);
      setTimeout(function () { fadeFormulaTo("13"); }, 4300);
      setTimeout(function () {
        setMedianEntryVisible(true);
        onUpdateQuestionText(APP_DATA.steps[5].questionTextMedian);
        onUpdateNavText(APP_DATA.steps[5].navTextMedian);
      }, 5550);
    }

    if (step === 6) {
      setFinalSettled(false);
      setFinalArrow(null);
      fillTableForDirection(savedDirection, true);
      setActiveCfRow(tableData.length);
      setShowRangeColumn(false);
      setRangeVisibleCount(0);
      setTimeout(function () {
        onUpdateQuestionText(APP_DATA.steps[6].questionText);
        onUpdateNavText("");
        onSetNextEnabled(false);
      }, 0);
      setTimeout(function () {
        setFinalSettled(true);
      }, 80);
    }
  }, [step, initialStage]);

  useEffect(function () {
    if (step !== 6) return;
    var timeouts = [
      setTimeout(updateFinalArrow, 0),
      setTimeout(updateFinalArrow, 120),
      setTimeout(updateFinalArrow, 720),
    ];
    window.addEventListener("resize", updateFinalArrow);
    return function () {
      for (var i = 0; i < timeouts.length; i++) clearTimeout(timeouts[i]);
      window.removeEventListener("resize", updateFinalArrow);
    };
  }, [step, finalSettled, updateFinalArrow]);

  useEffect(function () {
    setStep2NudgeDismissed(false);
    setStep2NudgeReady(false);

    if (step !== 2 || activeRow >= tableData.length) return;

    var timeoutId = setTimeout(function () {
      setStep2NudgeReady(true);
    }, 1000);

    return function () {
      clearTimeout(timeoutId);
    };
  }, [step, activeRow, activeField]);

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
      if (step !== 2) return getOrderedRows(getActiveDirection())[rowIndex].value;
      if (step === 2 && activeRow === rowIndex && activeField === "data") {
        return dropdown && dropdown.type === "data" ? prompts.inProgress : prompts.chooseDataPoint;
      }
      return "";
    }

    if (rows[rowIndex].frequency !== null) return rows[rowIndex].frequency;
    if (step !== 2) return getOrderedRows(getActiveDirection())[rowIndex].frequency;
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
    var showRange = step === 5 && showRangeColumn;
    var totalHintOuterDim = step === 4 && showTotalHint;
    activeStep2CellRef.current = null;
    return e("div", { className: "table-wrap", ref: tableWrapRef },
      e("div", { className: "median-table" + (showCf ? " with-cf" : "") + (showRange ? " with-range" : "") },
        e("div", { className: "median-table-row header-row" },
          e("div", {
            className: "median-table-cell header-cell" +
              (totalHintOuterDim ? " total-hint-outer-dim" : ""),
            dangerouslySetInnerHTML: { __html: APP_DATA.tableHeaders.data },
          }),
          e("div", {
            className: "median-table-cell header-cell" +
              (totalHintOuterDim ? " total-hint-outer-dim" : ""),
            dangerouslySetInnerHTML: { __html: APP_DATA.tableHeaders.frequency },
          }),
          showCf ? e("div", {
            className: "median-table-cell header-cell cf-header",
            dangerouslySetInnerHTML: { __html: APP_DATA.tableHeaders.cumulativeFrequency },
          }) : null,
          showRange ? e("div", {
            className: "median-table-cell header-cell range-header range-visible",
            dangerouslySetInnerHTML: { __html: APP_DATA.steps[5].positionRangeHeader },
          }) : null
        ),
        tableData.map(function (row, index) {
          var rowForDisplay = step === 2 ? rows[index] : (rows[index].value !== null ? rows[index] : getOrderedFilledRows()[index]);
          var dataActive = step === 2 && activeRow === index && activeField === "data" && rows[index].value === null;
          var freqActive = step === 2 && activeRow === index && activeField === "freq" && rows[index].frequency === null;
          var cfActive = step === 3 && activeCfRow === index;
          var cfFilled = cfValues[index] !== null;
          var cfDisplay = cfActive ? (cfInput || prompts.unknown) : (cfFilled ? cfValues[index] : prompts.unknown);
          var totalHintLast = step === 4 && showTotalHint && index === tableData.length - 1;
          var totalHintDim = step === 4 && showTotalHint && index !== tableData.length - 1;
          var formulaHintSource = showFormulaOverlay && (index === activeCfRow || index === activeCfRow - 1);
          var medianRangeHint = showRange && rowForDisplay && rowForDisplay.value === 15;

          return e("div", { className: "median-table-row", key: "row-" + index },
            e("button", {
              type: "button",
              className: "median-table-cell data-cell" +
                (dataActive ? " active selectable" : "") +
                (totalHintOuterDim ? " total-hint-outer-dim" : "") +
                (dropdown && dropdown.type === "data" && dropdown.rowIndex === index ? " dropdown-open" : ""),
              onClick: function () { openDropdown("data", index); },
              disabled: !dataActive,
              ref: function (el) {
                dataCellRefs.current[index] = el;
                if (dataActive) activeStep2CellRef.current = el;
              },
            }, getCellText(index, "data")),
            e("button", {
              type: "button",
              className: "median-table-cell freq-cell" +
                (freqActive ? " active selectable" : "") +
                (totalHintOuterDim ? " total-hint-outer-dim" : "") +
                (formulaHintSource && index === activeCfRow ? " formula-hint-source" : "") +
                (dropdown && dropdown.type === "freq" && dropdown.rowIndex === index ? " dropdown-open" : ""),
              onClick: function () { openDropdown("freq", index); },
              disabled: !freqActive,
              ref: function (el) {
                freqCellRefs.current[index] = el;
                if (freqActive) activeStep2CellRef.current = el;
              },
            }, getCellText(index, "freq")),
            showCf ? e("div", {
              className: "median-table-cell cf-cell" +
                (!cfFilled && !cfActive ? " waiting" : "") +
                (cfActive ? " active" : "") +
                (cfFilled ? " filled" : "") +
                (cfErrorRow === index ? " wrong" : "") +
                (formulaHintSource && index === activeCfRow - 1 ? " formula-hint-source" : "") +
                (totalHintDim ? " total-hint-dim" : "") +
                (totalHintLast ? " total-hint-last" : ""),
              ref: function (el) { cfCellRefs.current[index] = el; },
            }, cfDisplay) : null,
            showRange ? e("div", {
              className: "median-table-cell range-cell" +
                (rangeVisibleCount > index ? " range-visible" : "") +
                (medianRangeHint ? " median-range-highlight" : ""),
              dangerouslySetInnerHTML: { __html: getPositionRangeHtml(index) },
            }) : null
          );
        })
      ),
      step === 2 ? e(Nudge, {
        targetRef: activeStep2CellRef,
        active: step2NudgeReady && !step2NudgeDismissed && activeRow < tableData.length,
        onDismiss: function () { setStep2NudgeDismissed(true); },
      }) : null,
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
    if (step === 5) return renderStep5ActionColumn();
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

  function renderOrdinalFormula(children) {
    if (current_language === "id") {
      return e("span", { className: "formula-core" },
        e("span", { className: "formula-prefix" }, "ke-"),
        children
      );
    }

    return e("span", { className: "formula-core" },
      children,
      e("sup", { className: "formula-sup" }, "th")
    );
  }

  function renderFormulaCore(id) {
    if (id === "odd") {
      return renderOrdinalFormula([
        e("span", { className: "paren" }, "("),
        renderFraction("n+1", "2"),
        e("span", { className: "paren" }, ")")
      ]);
    }

    return renderOrdinalFormula([
      e("span", { className: "paren" }, "("),
      renderFraction("n", "2"),
      e("span", { className: "paren" }, ")")
    ]);
  }

  function renderMedianFormulaCore() {
    if (formulaStage === "13") {
      return renderOrdinalFormula([
        e("span", { className: "paren" }, "("),
        e("span", null, "13"),
        e("span", { className: "paren" }, ")")
      ]);
    }

    if (formulaStage === "26") {
      return renderOrdinalFormula([
        e("span", { className: "paren" }, "("),
        renderFraction("26", "1"),
        e("span", { className: "paren" }, ")")
      ]);
    }

    var numerator = formulaStage === "25" ?
      e("span", null, "25+1") :
      e("span", null,
        e("span", { ref: formulaNRef }, "n"),
        "+1"
      );

    return renderOrdinalFormula([
      e("span", { className: "paren" }, "("),
      renderFraction(numerator, "2"),
      e("span", { className: "paren" }, ")")
    ]);
  }

  function renderFlatNumpad(onNumber, onClear, onSubmit, disabled) {
    var handleNumber = onNumber || handleFlatNumpadNumber;
    var handleClear = onClear || handleFlatNumpadClear;
    var handleSubmit = onSubmit || handleFlatNumpadSubmit;
    var isDisabled = !!disabled;
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
            if (button.type === "num") handleNumber(button.label);
            if (button.type === "clear") handleClear();
            if (button.type === "submit") handleSubmit();
          },
          disabled: isDisabled,
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
            (selectedFormulaId === option.id ? " correct" : "") +
            (selectedFormulaId ? " transferring" : ""),
          onClick: function () { handleFormulaChoice(option); },
          disabled: !!selectedFormulaId,
          ref: function (el) { formulaOptionRefs.current[option.id] = el; },
        },
          renderFormulaCore(option.id),
          e("span", { className: "formula-suffix" }, option.suffix)
        );
      })
    );
  }

  function getFormulaOptionSuffix(optionId) {
    var options = APP_DATA.steps[4].options;
    for (var i = 0; i < options.length; i++) {
      if (options[i].id === optionId) return options[i].suffix;
    }
    return "";
  }

  function renderStep4ActionColumn() {
    return e("div", { className: "step4-action-column", ref: step4ActionRef },
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
            ref: nAnswerRef,
          }, nInput || prompts.inProgress)
        )
      ),
      e("div", { className: "step4-feedback-row" },
        step4Mode === "formula" && selectedFormulaId ?
          e("div", {
            className: "formula-option step4-transfer-target" +
              (formulaTransferDone ? " transfer-done" : " transfer-pending"),
            ref: step4MedianPositionRef,
          },
            renderFormulaCore(selectedFormulaId),
            e("span", { className: "formula-suffix" }, getFormulaOptionSuffix(selectedFormulaId))
          ) :
          (step4FeedbackHtml ? e("div", {
            className: "feedback-card step4-feedback-card",
            dangerouslySetInnerHTML: { __html: step4FeedbackHtml },
          }) : null)
      ),
      e("div", { className: "step4-control-row" },
        step4Mode === "count" ? renderFlatNumpad() : renderFormulaOptions()
      ),
      flyingFormulaClone ? e("div", {
        className: "flying-formula-clone" + (flyingFormulaClone.active ? " active" : ""),
        style: {
          left: flyingFormulaClone.left + "px",
          top: flyingFormulaClone.top + "px",
          "--formula-fly-x": flyingFormulaClone.tx + "px",
          "--formula-fly-y": flyingFormulaClone.ty + "px",
        },
      },
        renderFormulaCore(flyingFormulaClone.optionId),
        e("span", { className: "formula-suffix" }, getFormulaOptionSuffix(flyingFormulaClone.optionId))
      ) : null
    );
  }

  function renderStep5ActionColumn() {
    return e("div", { className: "step4-action-column step5-action-column", ref: actionPanelRef },
      e("div", { className: "step4-math-row" },
        e("div", { className: "n-equation" },
          e("span", {
            className: "n-label",
            dangerouslySetInnerHTML: { __html: APP_DATA.steps[4].nLabel },
          }),
          e("div", {
            className: "n-answer-box filled",
            ref: nAnswerRef,
          }, nInput || "25")
        )
      ),
      e("div", { className: "step5-median-position-row" },
        e("div", { className: "middle-position-label step5-position-label" }, APP_DATA.steps[5].medianPosition),
        e("div", {
          className: "formula-option median-position-box" +
            (formulaBoxVisible ? " slide-in" : "") +
            (formulaFading ? " fading" : ""),
        },
          renderMedianFormulaCore(),
          e("span", { className: "formula-suffix" }, APP_DATA.steps[4].options[0].suffix)
        )
      ),
      medianEntryVisible ? e("div", { className: "step5-median-entry-row" },
        e("div", { className: "median-equation" },
          e("span", { className: "median-label" }, APP_DATA.steps[5].medianLabel),
          e("div", {
            className: "median-answer-box" +
              (medianError ? " wrong" : "") +
              (medianCorrect ? " correct" : ""),
          }, medianInput || prompts.inProgress)
        )
      ) : null,
      medianEntryVisible ? e("div", { className: "step5-numpad-row" },
        renderFlatNumpad(handleMedianNumpadNumber, handleMedianNumpadClear, handleMedianNumpadSubmit, medianCorrect)
      ) : null,
      flyingNClone ? e("div", {
        className: "flying-n-clone" + (flyingNClone.active ? " active" : ""),
        style: {
          left: flyingNClone.left + "px",
          top: flyingNClone.top + "px",
          "--fly-x": flyingNClone.tx + "px",
          "--fly-y": flyingNClone.ty + "px",
          "--fly-scale": flyingNClone.scale,
        },
      }, "25") : null
    );
  }

  function renderFinalTable() {
    var finalRows = getOrderedRows(getActiveDirection());
    var finalCumulativeValues = getOrderedCumulativeValues();
    return e("div", { className: "final-table-wrap", ref: finalWrapRef },
      e("div", { className: "median-table final-table with-cf" },
        e("div", { className: "median-table-row header-row" },
          e("div", {
            className: "median-table-cell header-cell",
            dangerouslySetInnerHTML: { __html: APP_DATA.tableHeaders.data },
          }),
          e("div", {
            className: "median-table-cell header-cell",
            dangerouslySetInnerHTML: { __html: APP_DATA.tableHeaders.frequency },
          }),
          e("div", {
            className: "median-table-cell header-cell cf-header",
            dangerouslySetInnerHTML: { __html: APP_DATA.tableHeaders.cumulativeFrequency },
          })
        ),
        finalRows.map(function (row, index) {
          var isMedianRow = row.value === 15;
          return e("div", { className: "median-table-row", key: "final-row-" + index },
            e("div", {
              className: "median-table-cell data-cell" + (isMedianRow ? " final-median-cell" : ""),
              ref: isMedianRow ? finalMedianCellRef : undefined,
            }, row.value),
            e("div", { className: "median-table-cell freq-cell" }, row.frequency),
            e("div", { className: "median-table-cell cf-cell filled" }, finalCumulativeValues[index])
          );
        })
      ),
      finalArrow ? e("svg", {
        className: "final-median-arrow",
        width: finalArrow.viewWidth,
        height: finalArrow.viewHeight,
      },
        e("defs", null,
          e("marker", {
            id: "final-median-arrowhead",
            viewBox: "0 -" + finalArrow.headHalfHeight + " " + finalArrow.headLength + " " + (finalArrow.headHalfHeight * 2),
            refX: finalArrow.headLength,
            refY: "0",
            markerWidth: finalArrow.headLength,
            markerHeight: finalArrow.headHalfHeight * 2,
            markerUnits: "userSpaceOnUse",
            orient: "auto",
            overflow: "visible",
          },
            e("path", {
              d: "M 0 -" + finalArrow.headHalfHeight + " L " + finalArrow.headLength + " 0 L 0 " + finalArrow.headHalfHeight + " Z",
              fill: "#ffa51f",
            })
          )
        ),
        e("path", {
          className: "final-median-arrow-line",
          d: finalArrow.path,
          fill: "none",
          strokeWidth: finalArrow.strokeWidth,
          markerEnd: "url(#final-median-arrowhead)",
        })
      ) : null,
      e("div", { className: "final-median-label", ref: finalMedianLabelRef }, APP_DATA.final.medianLabel)
    );
  }

  function renderFinalStage() {
    return e("div", { className: "final-stage" + (finalSettled ? " settled" : " entering") },
      e("div", { className: "final-table-column" }, renderFinalTable()),
      e("div", {
        className: "final-text-column",
        dangerouslySetInnerHTML: { __html: APP_DATA.final.text },
      })
    );
  }

  var isCfStage = step === 3 || step === 4 || step === 5;
  var showRight = step >= 2;

  if (step === 6) {
    return e("div", { className: "main-canvas-container final-canvas-container" },
      renderFinalStage()
    );
  }

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
