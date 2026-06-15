const MainCanvas = (props) => {
  const { step, initialStage, onSetNextEnabled, onUpdateNavText, onUpdateQuestionText } = props;
  const { useState, useEffect, useRef, useCallback } = React;
  const e = React.createElement;

  /* ───── constants ───── */
  const tableData = APP_DATA.tableData;
  const sortedData = APP_DATA.sortedData;
  const ordinalLabels = APP_DATA.ordinalLabels;

  const cumulativeFreqs = [];
  var cumSum = 0;
  for (var ci = 0; ci < tableData.length; ci++) {
    cumSum += tableData[ci].frequency;
    cumulativeFreqs.push(cumSum);
  }

  var boxGroups = [];
  var boxIdx = 0;
  for (var gi = 0; gi < tableData.length; gi++) {
    var grp = [];
    for (var gj = 0; gj < tableData[gi].frequency; gj++) grp.push(boxIdx++);
    boxGroups.push(grp);
  }

  /* ───── state ───── */
  const [showCFColumn, setShowCFColumn] = useState(false);
  const [showRightColumn, setShowRightColumn] = useState(false);
  const [cfValues, setCfValues] = useState([null, null, null, null, null]);
  const [activeRowIndex, setActiveRowIndex] = useState(0);
  const [highlightedUpTo, setHighlightedUpTo] = useState(-1);
  const [orangeLabels, setOrangeLabels] = useState({});
  const [arrowBoxIndex, setArrowBoxIndex] = useState(-1);
  const [textSectionHtml, setTextSectionHtml] = useState("");
  const [dataSectionHtml, setDataSectionHtml] = useState("");
  const [showTextSection, setShowTextSection] = useState(false);
  const [showDataSection, setShowDataSection] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showBottomRow, setShowBottomRow] = useState(false);
  const [selectedBoxIndex, setSelectedBoxIndex] = useState(0);

  /* ───── refs ───── */
  const containerRef = useRef(null);
  const freqCellRefs = useRef([]);
  const cfCellRefs = useRef([]);
  const boxRefs = useRef([]);
  const labelRefs = useRef([]);
  const overlayRef = useRef(null);
  const arrowRef = useRef(null);
  const arrowPulseRef = useRef(null);
  const boxesContainerRef = useRef(null);
  const dragPointerRef = useRef(null);
  const isDraggingRef = useRef(false);
  const isAnimatingRef = useRef(false);
  const activeRowRef = useRef(0);
  const selectedBoxRef = useRef(0);

  var PANEL_FADE_MS = 400;
  var PAUSE_BEFORE_RIGHT_TEXT = 600;
  var PAUSE_BEFORE_BOTTOM_HIGHLIGHT = 500;
  var BOX_HIGHLIGHT_INTERVAL = 350;
  var BOX_HIGHLIGHT_SETTLE = 500;
  var FLY_TO_LABEL_DURATION = 1.2;

  /* ───── helpers ───── */
  function getRowIndexForBox(boxIndex) {
    var val = sortedData[boxIndex];
    for (var ri = 0; ri < tableData.length; ri++) {
      if (tableData[ri].value === val) return ri;
    }
    return 0;
  }

  function updateQuestionForBox(boxIndex) {
    var rowIdx = getRowIndexForBox(boxIndex);
    onUpdateQuestionText(APP_DATA.steps[4].positionQuestions[rowIdx]);
  }

  function positionDragPointer(boxIndex) {
    var box = boxRefs.current[boxIndex];
    var container = boxesContainerRef.current;
    var pointer = dragPointerRef.current;
    if (!box || !container || !pointer) return;
    var boxRect = box.getBoundingClientRect();
    var cRect = container.getBoundingClientRect();
    var vw = window.innerWidth / 100;
    pointer.style.left = (boxRect.left - cRect.left + boxRect.width / 2) + "px";
    pointer.style.top = (boxRect.bottom - cRect.top + 0.2 * vw) + "px";
  }

  function showRightPanel(rowIndex, onComplete) {
    var step2 = APP_DATA.steps[2];
    var newText = rowIndex === 0 ? step2.textSectionFirst : step2.textSectionNext;
    var newData = step2.dataSections[rowIndex];

    if (rowIndex === 0) {
      setTextSectionHtml(newText);
      setDataSectionHtml(newData);
      setShowTextSection(false);
      setShowDataSection(false);
      requestAnimationFrame(function () {
        setShowTextSection(true);
        setShowDataSection(true);
        setTimeout(onComplete, PANEL_FADE_MS);
      });
      return;
    }

    var updatesLeft = rowIndex === 1 ? 2 : 1;
    var updatesDone = 0;

    function finishUpdate() {
      updatesDone++;
      if (updatesDone >= updatesLeft) {
        setTimeout(onComplete, PANEL_FADE_MS);
      }
    }

    if (rowIndex === 1) {
      setShowTextSection(false);
      setTimeout(function () {
        setTextSectionHtml(step2.textSectionNext);
        setShowTextSection(true);
        finishUpdate();
      }, PANEL_FADE_MS);
    }

    setShowDataSection(false);
    setTimeout(function () {
      setDataSectionHtml(newData);
      setShowDataSection(true);
      finishUpdate();
    }, PANEL_FADE_MS);
  }
  function relPos(el) {
    var cr = containerRef.current;
    if (!el || !cr) return { x: 0, y: 0 };
    var er = el.getBoundingClientRect();
    var cRect = cr.getBoundingClientRect();
    return {
      x: er.left - cRect.left + er.width / 2,
      y: er.top - cRect.top + er.height / 2,
    };
  }

  function createClone(text, pos, cls) {
    var d = document.createElement("div");
    d.className = "flying-number" + (cls ? " " + cls : "");
    d.textContent = text;
    d.style.cssText =
      "position:absolute;left:" + pos.x + "px;top:" + pos.y +
      "px;transform:translate(-50%,-50%);z-index:110;";
    overlayRef.current.appendChild(d);
    return d;
  }

  function clearOverlay() {
    if (overlayRef.current) overlayRef.current.innerHTML = "";
  }

  function clearOverlay() {
    if (overlayRef.current) overlayRef.current.innerHTML = "";
  }

  function applyStepFinalState(stepNum) {
    if (stepNum === 1) {
      setShowCFColumn(false);
      setShowRightColumn(false);
      setShowBottomRow(false);
      setCfValues([null, null, null, null, null]);
      setActiveRowIndex(0);
      activeRowRef.current = 0;
      setHighlightedUpTo(-1);
      setOrangeLabels({});
      setArrowBoxIndex(-1);
      setTextSectionHtml("");
      setDataSectionHtml("");
      setShowTextSection(false);
      setShowDataSection(false);
      setIsAnimating(false);
      isAnimatingRef.current = false;
      clearOverlay();
      if (arrowPulseRef.current) { arrowPulseRef.current.kill(); arrowPulseRef.current = null; }
      onSetNextEnabled(true);
      return;
    }

    if (stepNum === 2) {
      var lastRow = tableData.length - 1;
      setShowCFColumn(true);
      setShowRightColumn(true);
      setShowBottomRow(true);
      setCfValues(cumulativeFreqs.slice());
      setActiveRowIndex(lastRow);
      activeRowRef.current = lastRow;
      setHighlightedUpTo(sortedData.length - 1);
      var cfOranges = {};
      for (var oi = 0; oi < cumulativeFreqs.length; oi++) {
        cfOranges[cumulativeFreqs[oi] - 1] = true;
      }
      setOrangeLabels(cfOranges);
      setArrowBoxIndex(cumulativeFreqs[lastRow] - 1);
      setTextSectionHtml(APP_DATA.steps[2].textSectionNext);
      setDataSectionHtml(APP_DATA.steps[2].dataSections[lastRow]);
      setShowTextSection(true);
      setShowDataSection(true);
      setIsAnimating(false);
      isAnimatingRef.current = false;
      clearOverlay();
      onUpdateQuestionText(APP_DATA.steps[2].questionTextDone);
      onUpdateNavText(APP_DATA.steps[2].navTextDone);
      onSetNextEnabled(true);
      return;
    }

    if (stepNum === 3) {
      setShowCFColumn(true);
      setShowRightColumn(false);
      setShowTextSection(false);
      setShowDataSection(false);
      setCfValues(cumulativeFreqs.slice());
      setHighlightedUpTo(sortedData.length - 1);
      var step3Oranges = {};
      for (var si = 0; si < cumulativeFreqs.length; si++) {
        step3Oranges[cumulativeFreqs[si] - 1] = true;
      }
      setOrangeLabels(step3Oranges);
      setArrowBoxIndex(-1);
      setShowBottomRow(true);
      if (arrowPulseRef.current) { arrowPulseRef.current.kill(); arrowPulseRef.current = null; }
      onSetNextEnabled(true);
      return;
    }

    if (stepNum === 4) {
      setShowCFColumn(true);
      setShowRightColumn(false);
      setShowTextSection(false);
      setShowDataSection(false);
      setCfValues(cumulativeFreqs.slice());
      setHighlightedUpTo(-1);
      setOrangeLabels({});
      setArrowBoxIndex(-1);
      setSelectedBoxIndex(0);
      selectedBoxRef.current = 0;
      setShowBottomRow(true);
      isDraggingRef.current = false;
      if (arrowPulseRef.current) { arrowPulseRef.current.kill(); arrowPulseRef.current = null; }
      onUpdateQuestionText(APP_DATA.steps[4].positionQuestions[0]);
      onSetNextEnabled(true);
    }
  }

  /* ───── step init ───── */
  useEffect(function () {
    if (initialStage === "final") {
      applyStepFinalState(step);
      return;
    }

    if (step === 1) {
      setShowCFColumn(false);
      setShowRightColumn(false);
      setShowBottomRow(false);
      setCfValues([null, null, null, null, null]);
      setActiveRowIndex(0);
      activeRowRef.current = 0;
      setHighlightedUpTo(-1);
      setOrangeLabels({});
      setArrowBoxIndex(-1);
      setTextSectionHtml("");
      setDataSectionHtml("");
      setShowTextSection(false);
      setShowDataSection(false);
      setIsAnimating(false);
      isAnimatingRef.current = false;
      clearOverlay();
      if (arrowPulseRef.current) { arrowPulseRef.current.kill(); arrowPulseRef.current = null; }
      setTimeout(function () {
        onSetNextEnabled(true);
      }, 0);
    }
    if (step === 2) {
      setCfValues([null, null, null, null, null]);
      setActiveRowIndex(0);
      activeRowRef.current = 0;
      setHighlightedUpTo(-1);
      setOrangeLabels({});
      setArrowBoxIndex(-1);
      setTextSectionHtml("");
      setDataSectionHtml("");
      setShowTextSection(false);
      setShowDataSection(false);
      setIsAnimating(false);
      isAnimatingRef.current = false;
      clearOverlay();

      setTimeout(function () {
        onUpdateQuestionText(APP_DATA.steps[2].questionTextInitial);
        onUpdateNavText(APP_DATA.steps[2].navTextInitial);
        onSetNextEnabled(false);
      }, 0);

      setTimeout(function () {
        setShowCFColumn(true);
        setShowBottomRow(true);
      }, 100);
      setTimeout(function () {
        setShowRightColumn(true);
      }, 500);
    }
    if (step === 3) {
      setShowCFColumn(true);
      setShowRightColumn(false);
      setShowTextSection(false);
      setShowDataSection(false);
      setCfValues(cumulativeFreqs.slice());
      setHighlightedUpTo(sortedData.length - 1);
      var cfOranges = {};
      for (var oi = 0; oi < cumulativeFreqs.length; oi++) {
        cfOranges[cumulativeFreqs[oi] - 1] = true;
      }
      setOrangeLabels(cfOranges);
      setArrowBoxIndex(-1);
      setShowBottomRow(true);
      if (arrowPulseRef.current) { arrowPulseRef.current.kill(); arrowPulseRef.current = null; }
      onSetNextEnabled(true);
    }
    if (step === 4) {
      setShowCFColumn(true);
      setShowRightColumn(false);
      setShowTextSection(false);
      setShowDataSection(false);
      setCfValues(cumulativeFreqs.slice());
      setHighlightedUpTo(-1);
      setOrangeLabels({});
      setArrowBoxIndex(-1);
      setSelectedBoxIndex(0);
      selectedBoxRef.current = 0;
      setShowBottomRow(true);
      isDraggingRef.current = false;
      if (arrowPulseRef.current) { arrowPulseRef.current.kill(); arrowPulseRef.current = null; }
      setTimeout(function () {
        onUpdateQuestionText(APP_DATA.steps[4].positionQuestions[0]);
        onSetNextEnabled(true);
      }, 0);
    }
  }, [step, initialStage]);

  /* ───── arrow positioning ───── */
  useEffect(function () {
    if (arrowBoxIndex < 0 || !arrowRef.current) return;
    var box = boxRefs.current[arrowBoxIndex];
    if (!box) return;
    var container = box.parentElement;
    if (!container) return;

    var boxRect = box.getBoundingClientRect();
    var cRect = container.getBoundingClientRect();
    var vw = window.innerWidth / 100;
    var targetLeft = boxRect.left - cRect.left + boxRect.width / 2;
    var targetTop = boxRect.bottom - cRect.top + 0.35 * vw;

    if (arrowPulseRef.current) { arrowPulseRef.current.kill(); arrowPulseRef.current = null; }
    gsap.set(arrowRef.current, { y: 0, bottom: "auto" });

    gsap.to(arrowRef.current, {
      left: targetLeft,
      top: targetTop,
      opacity: 1,
      duration: 0.4,
      ease: "power2.out",
      onComplete: function () {
        arrowPulseRef.current = gsap.to(arrowRef.current, {
          y: -0.1 * vw,
          duration: 0.4,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
      },
    });
  }, [arrowBoxIndex, highlightedUpTo]);

  /* ───── drag pointer (step 4) ───── */
  useEffect(function () {
    if (step !== 4) return;
    requestAnimationFrame(function () {
      positionDragPointer(selectedBoxIndex);
    });
  }, [step, selectedBoxIndex]);

  useEffect(function () {
    if (step !== 4) return;
    var pointer = dragPointerRef.current;
    var container = boxesContainerRef.current;
    if (!pointer || !container) return;

    function getClientX(e) {
      if (e.touches && e.touches.length) return e.touches[0].clientX;
      if (e.changedTouches && e.changedTouches.length) return e.changedTouches[0].clientX;
      return e.clientX;
    }

    function getNearestBoxIndex(clientX) {
      var cRect = container.getBoundingClientRect();
      var x = clientX - cRect.left;
      var nearest = 0;
      var minDist = Infinity;
      for (var i = 0; i < sortedData.length; i++) {
        var box = boxRefs.current[i];
        if (!box) continue;
        var rect = box.getBoundingClientRect();
        var center = rect.left - cRect.left + rect.width / 2;
        var dist = Math.abs(x - center);
        if (dist < minDist) {
          minDist = dist;
          nearest = i;
        }
      }
      return nearest;
    }

    function selectBox(boxIndex, playSoundOnChange) {
      positionDragPointer(boxIndex);
      if (boxIndex === selectedBoxRef.current) return;
      if (playSoundOnChange && typeof playSound === "function") playSound("click");
      selectedBoxRef.current = boxIndex;
      setSelectedBoxIndex(boxIndex);
      updateQuestionForBox(boxIndex);
    }

    function onStart(e) {
      e.preventDefault();
      isDraggingRef.current = true;
      pointer.classList.add("dragging");
      selectBox(getNearestBoxIndex(getClientX(e)), false);
    }

    function onMove(e) {
      if (!isDraggingRef.current) return;
      e.preventDefault();
      selectBox(getNearestBoxIndex(getClientX(e)), true);
    }

    function onEnd(e) {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      pointer.classList.remove("dragging");
      selectBox(getNearestBoxIndex(getClientX(e)), false);
    }

    pointer.addEventListener("mousedown", onStart);
    pointer.addEventListener("touchstart", onStart, { passive: false });
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onEnd);
    document.addEventListener("touchmove", onMove, { passive: false });
    document.addEventListener("touchend", onEnd);

    return function () {
      pointer.removeEventListener("mousedown", onStart);
      pointer.removeEventListener("touchstart", onStart);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onEnd);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onEnd);
    };
  }, [step]);

  /* ───── click handler ───── */
  function handleCFCellClick(rowIndex) {
    if (isAnimatingRef.current) return;
    if (rowIndex !== activeRowRef.current) return;
    if (typeof playSound === "function") playSound("click");
    setIsAnimating(true);
    isAnimatingRef.current = true;
    onUpdateNavText("");

    if (rowIndex === 0) {
      animateFirstRow();
    } else {
      animateSubsequentRow(rowIndex);
    }
  }

  /* ───── first-row animation ───── */
  function animateFirstRow() {
    var freqCell = freqCellRefs.current[0];
    var cfCell = cfCellRefs.current[0];
    if (!freqCell || !cfCell) return;

    var from = relPos(freqCell);
    var to = relPos(cfCell);
    var clone = createClone(tableData[0].frequency, from);

    var tl = gsap.timeline();

    tl.to(clone, {
      left: to.x, top: to.y,
      duration: 0.6, ease: "power2.inOut",
    });
    tl.call(function () {
      clone.remove();
      setCfValues(function (prev) { var n = prev.slice(); n[0] = cumulativeFreqs[0]; return n; });
      if (typeof playSound === "function") playSound("tick");
    });
    tl.call(function () {
      showRightPanel(0, function () {
        setTimeout(function () {
          animateBottomRowFill(0);
        }, PAUSE_BEFORE_BOTTOM_HIGHLIGHT);
      });
    }, null, "+=" + (PAUSE_BEFORE_RIGHT_TEXT / 1000));
  }

  /* ───── subsequent-row animation ───── */
  function animateSubsequentRow(rowIndex) {
    var prevCFCell = cfCellRefs.current[rowIndex - 1];
    var freqCell = freqCellRefs.current[rowIndex];
    var targetCFCell = cfCellRefs.current[rowIndex];
    if (!prevCFCell || !freqCell || !targetCFCell) return;

    var pPos = relPos(prevCFCell);
    var fPos = relPos(freqCell);
    var tPos = relPos(targetCFCell);
    var midX = (pPos.x + fPos.x) / 2;
    var midY = (pPos.y + fPos.y) / 2;

    var dx = pPos.x - fPos.x;
    var dy = pPos.y - fPos.y;
    var dist = Math.sqrt(dx * dx + dy * dy);

    /* SVG bounding rectangle */
    var svgNS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(svgNS, "svg");
    svg.style.cssText = "position:absolute;left:0;top:0;width:100%;height:100%;z-index:50;pointer-events:none;overflow:visible;";
    overlayRef.current.appendChild(svg);

    var cellH = prevCFCell.getBoundingClientRect().height * 0.55;
    var cellW = prevCFCell.getBoundingClientRect().width * 0.15;
    var cos = dx / dist, sin = dy / dist;
    var perpX = -sin * cellH, perpY = cos * cellH;

    var fStart = { x: fPos.x - cos * cellW, y: fPos.y - sin * cellW };
    var pEnd   = { x: pPos.x + cos * cellW, y: pPos.y + sin * cellW };

    var pts = [
      [fStart.x - perpX, fStart.y - perpY],
      [pEnd.x - perpX, pEnd.y - perpY],
      [pEnd.x + perpX, pEnd.y + perpY],
      [fStart.x + perpX, fStart.y + perpY],
    ];
    var polygon = document.createElementNS(svgNS, "polygon");
    polygon.setAttribute("points", pts.map(function (p) { return p.join(","); }).join(" "));
    polygon.setAttribute("fill", "none");
    polygon.setAttribute("stroke", "rgba(255,255,255,1)");
    polygon.setAttribute("fill", "rgba(255,255,255,0.25)");
    polygon.setAttribute("stroke-width", "2");
    polygon.setAttribute("stroke-dasharray", "6,4");
    svg.appendChild(polygon);

    /* + sign */
    var plus = document.createElement("div");
    plus.className = "plus-sign";
    plus.textContent = "+";
    plus.style.cssText = "position:absolute;left:" + midX + "px;top:" + midY +
      "px;transform:translate(-50%,-50%);z-index:51;font-size:2.5vw;font-weight:bold;color:white;";
    overlayRef.current.appendChild(plus);

    gsap.fromTo([svg, plus], { opacity: 0 }, { opacity: 1, duration: 0.35 });

    /* glow phase */
    setTimeout(function () {
      prevCFCell.classList.add("glow-yellow");
      freqCell.classList.add("glow-yellow");
      plus.style.color = "#ffff00";
      plus.style.textShadow = "0 0 .5vw #ffff00,0 0 1vw rgba(255,255,0,.5)";

      setTimeout(function () {
        prevCFCell.classList.remove("glow-yellow");
        freqCell.classList.remove("glow-yellow");
        plus.style.color = "white";
        plus.style.textShadow = "none";

        /* sum appears & flies */
        var sum = cumulativeFreqs[rowIndex];
        var sumClone = createClone(sum, { x: midX, y: midY });
        sumClone.style.opacity = "0";

        var tl2 = gsap.timeline();
        tl2.to(sumClone, { opacity: 1, duration: 0.25 });
        tl2.to(sumClone, {
          left: tPos.x, top: tPos.y,
          duration: 0.6, ease: "power2.inOut",
        });
        tl2.call(function () {
          sumClone.remove();
          setCfValues(function (prev) { var n = prev.slice(); n[rowIndex] = sum; return n; });
          if (typeof playSound === "function") playSound("tick");

          gsap.to([svg, plus], {
            opacity: 0, duration: 0.3,
            onComplete: function () { svg.remove(); plus.remove(); },
          });

          setTimeout(function () {
            showRightPanel(rowIndex, function () {
              setTimeout(function () {
                animateBottomRowFill(rowIndex);
              }, PAUSE_BEFORE_BOTTOM_HIGHLIGHT);
            });
          }, PAUSE_BEFORE_RIGHT_TEXT);
        });
      }, 500);
    }, 400);
  }

  /* ───── bottom-row fill animation ───── */
  function flyCfToLabel(rowIndex, lastBoxIndex, cfValue) {
    var cfCell = cfCellRefs.current[rowIndex];
    var labelEl = labelRefs.current[lastBoxIndex];
    if (!cfCell || !labelEl) {
      finishRowAnimation(rowIndex);
      return;
    }

    var from = relPos(cfCell);
    var to = relPos(labelEl);
    var clone = createClone(cfValue, from, "table-cell-size");

    gsap.to(clone, {
      left: to.x,
      top: to.y,
      duration: FLY_TO_LABEL_DURATION,
      ease: "power2.inOut",
      onComplete: function () {
        clone.remove();
        setOrangeLabels(function (prev) {
          var n = {};
          for (var k in prev) n[k] = prev[k];
          n[lastBoxIndex] = true;
          return n;
        });
        setArrowBoxIndex(lastBoxIndex);
        if (typeof playSound === "function") playSound("tick");
        finishRowAnimation(rowIndex);
      },
    });
  }

  function animateBottomRowFill(rowIndex) {
    var cfValue = cumulativeFreqs[rowIndex];
    var lastBoxIndex = cfValue - 1;
    var startIndex = rowIndex === 0 ? 0 : cumulativeFreqs[rowIndex - 1];
    var current = startIndex;

    function highlightNext() {
      if (current > lastBoxIndex) {
        flyCfToLabel(rowIndex, lastBoxIndex, cfValue);
        return;
      }

      setHighlightedUpTo(current);
      current++;

      if (current > lastBoxIndex) {
        setTimeout(function () {
          flyCfToLabel(rowIndex, lastBoxIndex, cfValue);
        }, BOX_HIGHLIGHT_SETTLE);
      } else {
        setTimeout(highlightNext, BOX_HIGHLIGHT_INTERVAL);
      }
    }

    highlightNext();
  }

  /* ───── finish row ───── */
  function finishRowAnimation(rowIndex) {
    setIsAnimating(false);
    isAnimatingRef.current = false;

    if (rowIndex >= tableData.length - 1) {
      onUpdateQuestionText(APP_DATA.steps[2].questionTextDone);
      onUpdateNavText(APP_DATA.steps[2].navTextDone);
      onSetNextEnabled(true);
    } else {
      if (rowIndex === 0) {
        onUpdateQuestionText(APP_DATA.steps[2].questionTextOngoing);
      }
      var nextRow = rowIndex + 1;
      setActiveRowIndex(nextRow);
      activeRowRef.current = nextRow;
      onUpdateNavText(APP_DATA.steps[2].navTextOngoing);
    }
  }

  /* ───── render: table ───── */
  function renderTable() {
    var showCF = (step === 2 && showCFColumn) || step === 3 || step === 4;
    var highlightedTableRow = step === 4 ? getRowIndexForBox(selectedBoxIndex) : -1;

    var headerRow = e("div", { className: "table-row header-row" },
      e("div", {
        className: "table-cell header-cell data-header",
        dangerouslySetInnerHTML: { __html: APP_DATA.tableHeaders.data },
      }),
      e("div", {
        className: "table-cell header-cell freq-header",
        dangerouslySetInnerHTML: { __html: APP_DATA.tableHeaders.frequency },
      }),
      e("div", {
        className: "table-cell header-cell cf-header" + (showCF ? " visible" : ""),
        dangerouslySetInnerHTML: { __html: APP_DATA.tableHeaders.cumulativeFrequency },
      })
    );

    var dataRows = tableData.map(function (row, i) {
      var isFilled = step === 3 || step === 4 || cfValues[i] !== null;
      var isActive = step === 2 && i === activeRowIndex && !isFilled && !isAnimating;
      var rowClass = "table-row";
      if (step === 4) {
        rowClass += i === highlightedTableRow ? " row-highlighted" : " row-dimmed";
      }

      var cfCellClass = "table-cell cf-cell" +
        (showCF ? " visible" : "") +
        (isActive ? " active" : "") +
        (isFilled ? " filled" : "");
      if (step === 4 && i === highlightedTableRow) {
        cfCellClass += " cf-highlight-blink";
      }

      return e("div", { className: rowClass, key: "tr-" + i },
        e("div", { className: "table-cell data-cell data-cell-" + i }, row.value),
        e("div", {
          className: "table-cell freq-cell freq-cell-" + i,
          ref: function (el) { freqCellRefs.current[i] = el; },
        }, row.frequency),
        e("div", {
          className: cfCellClass,
          ref: function (el) { cfCellRefs.current[i] = el; },
          onClick: step === 2 ? function () { handleCFCellClick(i); } : undefined,
        }, isFilled ? (step === 3 || step === 4 ? cumulativeFreqs[i] : cfValues[i]) : "?")
      );
    });

    return e("div", { className: "freq-table" }, headerRow, dataRows);
  }

  function handleBoxSelect(boxIndex) {
    if (step !== 4 || isDraggingRef.current) return;
    if (boxIndex === selectedBoxRef.current) return;
    if (typeof playSound === "function") playSound("click");
    selectedBoxRef.current = boxIndex;
    setSelectedBoxIndex(boxIndex);
    updateQuestionForBox(boxIndex);
  }

  /* ───── render: bottom row (step 2 & 3) ───── */
  function renderStep2BottomRow() {
    var boxes = sortedData.map(function (val, i) {
      var isH = i <= highlightedUpTo;
      var isOrange = !!orangeLabels[i];

      return e("div", {
        className: "data-box" + (isH ? " highlighted val-" + val : " dehighlighted"),
        key: "box-" + i,
        ref: function (el) { boxRefs.current[i] = el; },
      },
        e("div", {
          className: "box-label" + (isH ? " visible" : "") + (isOrange ? " orange" : "") + (current_language === "id" ? " id" : ""),
          ref: function (el) { labelRefs.current[i] = el; },
          dangerouslySetInnerHTML: { __html: ordinalLabels[i] },
        }),
        e("span", { className: "box-value" }, val)
      );
    });

    return e("div", {
      className: "data-boxes-container" + (showBottomRow ? " visible" : ""),
      ref: boxesContainerRef,
    },
      boxes,
      step === 2 && arrowBoxIndex >= 0 ?
        e("div", { className: "box-arrow", ref: arrowRef },
          e("svg", {
            viewBox: "0 0 40 48",
            xmlns: "http://www.w3.org/2000/svg",
            "aria-hidden": "true",
          },
            e("path", {
              d: "M20 0 L40 22 L28 22 L28 48 L12 48 L12 22 L0 22 Z",
              fill: "#c4922f",
            })
          )
        ) : null
    );
  }

  /* ───── render: bottom row (step 4 – drag) ───── */
  function renderStep4BottomRow() {
    var boxes = sortedData.map(function (val, i) {
      var isSelected = i === selectedBoxIndex;

      return e("div", {
        className: "data-box step4-default" + (isSelected ? " step4-selected" : ""),
        key: "box-" + i,
        ref: function (el) { boxRefs.current[i] = el; },
        onClick: function () { handleBoxSelect(i); },
      },
        e("div", {
          className: "box-label always-visible" + (isSelected ? " orange" : "") + (current_language === "id" ? " id" : ""),
          ref: function (el) { labelRefs.current[i] = el; },
          dangerouslySetInnerHTML: { __html: ordinalLabels[i] },
        }),
        e("span", { className: "box-value" }, val)
      );
    });

    return e("div", {
      className: "data-boxes-container step4-mode visible",
      ref: boxesContainerRef,
    },
      boxes,
      e("div", { className: "drag-pointer", ref: dragPointerRef })
    );
  }

  /* ───── render: right column ───── */
  function renderRightColumn() {
    return e("div", { className: "right-column" + (showRightColumn ? " visible" : "") },
      e("div", { className: "info-text-box" },
        e("div", {
          className: "info-text-section" + (showTextSection ? " visible" : ""),
          dangerouslySetInnerHTML: { __html: textSectionHtml },
        }),
        e("div", {
          className: "info-data-section" + (showDataSection ? " visible" : ""),
          dangerouslySetInnerHTML: { __html: dataSectionHtml },
        })
      )
    );
  }

  /* ───── main render ───── */
  return e("div", { className: "main-canvas-container", ref: containerRef },
    e("div", { className: "visual-row" },
      e("div", { className: "left-column" }, renderTable()),
      renderRightColumn()
    ),
    e("div", {
      className: "bottom-row" + ((step === 2 && showBottomRow) || step === 3 || step === 4 ? " has-content" : ""),
    },
      step === 4 ? renderStep4BottomRow() :
      (step === 2 || step === 3) ? renderStep2BottomRow() : null
    ),
    e("div", { className: "animation-overlay", ref: overlayRef })
  );
};
