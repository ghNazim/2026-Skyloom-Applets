const MainCanvas = (props) => {
  const { step, experiment: expProp, initialStage, onSetNextEnabled, onUpdateNavText } = props;
  const { useState, useEffect, useRef, useCallback } = React;
  const e = React.createElement;

  var experiment = expProp || 1;
  var cfg = EXPERIMENT_CONFIG[experiment] || EXPERIMENT_CONFIG[1];
  var outcomesA = cfg.outcomesA;
  var outcomesB = cfg.outcomesB;
  var ALL_SAMPLE_PAIRS = cfg.samplePairs;
  var STEP2_VALUES = cfg.step2Draggables;
  var STEP3_VALUES = cfg.step3Choices;
  var STEP3_ANSWER = cfg.nSAnswer;
  var ZONE_A = outcomesA.map(function (_, i) { return "a" + i; });
  var ZONE_B = outcomesB.map(function (_, i) { return "b" + i; });
  var sampleCount = ALL_SAMPLE_PAIRS.length;
  var isWide = sampleCount > 6;
  var isExtraWide = sampleCount > 8;
  var equationStackClass =
    "lm-equation-stack" + (experiment === 3 ? " low-shift" : "");

  function formatOutcomeLabel(value) {
    if (typeof current_language !== "undefined" && current_language === "id") {
      if (value === "H") return "A";
      if (value === "T") return "G";
    }
    return String(value);
  }

  function getStepData(stepNum) {
    return APP_DATA.experiments[experiment].steps[stepNum];
  }

  var makeFalseArray = function (n) {
    var arr = [];
    for (var i = 0; i < n; i++) arr.push(false);
    return arr;
  };
  var makeTrueArray = function (n) {
    var arr = [];
    for (var i = 0; i < n; i++) arr.push(true);
    return arr;
  };
  var makeNullArray = function (n) {
    var arr = [];
    for (var i = 0; i < n; i++) arr.push(null);
    return arr;
  };

  const emptyZones = function () {
    var obj = {};
    for (var i = 0; i < ZONE_A.length; i++) obj[ZONE_A[i]] = null;
    for (var j = 0; j < ZONE_B.length; j++) obj[ZONE_B[j]] = null;
    return obj;
  };

  const filledZones = function () {
    var obj = {};
    for (var i = 0; i < outcomesA.length; i++) obj["a" + i] = outcomesA[i];
    for (var j = 0; j < outcomesB.length; j++) obj["b" + j] = outcomesB[j];
    return obj;
  };

  const allCorrectZoneStatus = function () {
    var obj = {};
    for (var i = 0; i < ZONE_A.length; i++) obj[ZONE_A[i]] = "correct";
    for (var j = 0; j < ZONE_B.length; j++) obj[ZONE_B[j]] = "correct";
    return obj;
  };

  const getEventCorrectSet = function (stepNum) {
    var stepData = getStepData(stepNum);
    var set = {};
    if (!stepData || !stepData.correctAnswers) return set;
    for (var i = 0; i < stepData.correctAnswers.length; i++) {
      set[stepData.correctAnswers[i]] = true;
    }
    return set;
  };

  const [zoneValues, setZoneValues] = useState(emptyZones);
  const [zoneStatus, setZoneStatus] = useState({});
  const [nSValue, setNSValue] = useState(null);
  const [nSStatus, setNSStatus] = useState("idle");
  const [feedbackStatus, setFeedbackStatus] = useState(null);
  const [isShaking, setIsShaking] = useState(false);
  const [dragState, setDragState] = useState(null);
  const [hoveredZoneId, setHoveredZoneId] = useState(null);
  const [hiddenValue, setHiddenValue] = useState(null);
  const [locked, setLocked] = useState(false);

  /* step 4 */
  const [sampleVisible, setSampleVisible] = useState(function () { return makeFalseArray(sampleCount); });
  const [samplePairs, setSamplePairs] = useState(function () { return makeNullArray(sampleCount); });
  const [sampleRevealed, setSampleRevealed] = useState(function () { return makeFalseArray(sampleCount); });
  const [clickableA, setClickableA] = useState(null);
  const [pairingBusy, setPairingBusy] = useState(false);
  const [step4Complete, setStep4Complete] = useState(false);

  /* step 5 */
  const [selectedOutcomes, setSelectedOutcomes] = useState({});
  const [step5Submitted, setStep5Submitted] = useState(false);
  const [step5Result, setStep5Result] = useState(null);
  const [step5BoxStatus, setStep5BoxStatus] = useState({});
  const [step5Transitioning, setStep5Transitioning] = useState(false);
  const [step5TitleReady, setStep5TitleReady] = useState(false);

  const dragRef = useRef(null);
  const zoneValuesRef = useRef(zoneValues);
  const zoneStatusRef = useRef({});
  const nSStatusRef = useRef("idle");
  const lockedRef = useRef(false);
  const shakeTimerRef = useRef(null);
  const restoreTimerRef = useRef(null);
  const containerRef = useRef(null);
  const overlayRef = useRef(null);
  const aChipRefs = useRef([]);
  const bChipRefs = useRef([]);
  const sampleBoxRefs = useRef([]);
  const samplePartRefs = useRef([]);
  const pairingBusyRef = useRef(false);
  const clickableARef = useRef(null);
  const clickableChipTargetRef = useRef(null);
  const step4TimersRef = useRef([]);
  const activeTweensRef = useRef([]);

  useEffect(
    function () {
      zoneValuesRef.current = zoneValues;
    },
    [zoneValues],
  );

  useEffect(
    function () {
      zoneStatusRef.current = zoneStatus;
    },
    [zoneStatus],
  );

  useEffect(
    function () {
      nSStatusRef.current = nSStatus;
    },
    [nSStatus],
  );

  useEffect(
    function () {
      lockedRef.current = locked;
    },
    [locked],
  );

  useEffect(
    function () {
      pairingBusyRef.current = pairingBusy;
    },
    [pairingBusy],
  );

  useEffect(
    function () {
      clickableARef.current = clickableA;
      if (clickableA === null || clickableA === undefined) {
        clickableChipTargetRef.current = null;
      } else {
        clickableChipTargetRef.current = aChipRefs.current[clickableA] || null;
      }
    },
    [clickableA],
  );

  const clearShakeTimer = function () {
    if (shakeTimerRef.current) {
      clearTimeout(shakeTimerRef.current);
      shakeTimerRef.current = null;
    }
  };

  const clearRestoreTimer = function () {
    if (restoreTimerRef.current) {
      clearTimeout(restoreTimerRef.current);
      restoreTimerRef.current = null;
    }
  };

  const clearStep4Timers = function () {
    step4TimersRef.current.forEach(function (id) {
      clearTimeout(id);
    });
    step4TimersRef.current = [];
    activeTweensRef.current.forEach(function (tw) {
      if (tw && typeof tw.kill === "function") tw.kill();
    });
    activeTweensRef.current = [];
    if (overlayRef.current) overlayRef.current.innerHTML = "";
  };

  const addStep4Timer = function (fn, delay) {
    var id = setTimeout(fn, delay);
    step4TimersRef.current.push(id);
    return id;
  };

  const restoreDraggableAfterDelay = function () {
    clearRestoreTimer();
    restoreTimerRef.current = setTimeout(function () {
      setHiddenValue(null);
      restoreTimerRef.current = null;
    }, 500);
  };

  const applyStepFinalState = useCallback(
    function (stepNum) {
      clearShakeTimer();
      clearRestoreTimer();
      clearStep4Timers();
      setDragState(null);
      setHoveredZoneId(null);
      setHiddenValue(null);
      dragRef.current = null;
      setLocked(false);
      lockedRef.current = false;

      if (stepNum === 1) {
        setZoneValues(emptyZones());
        setZoneStatus({});
        setNSValue(null);
        setNSStatus("idle");
        setFeedbackStatus(null);
        setIsShaking(false);
        setSampleVisible(makeFalseArray(sampleCount));
        setSamplePairs(makeNullArray(sampleCount));
        setSampleRevealed(makeFalseArray(sampleCount));
        setClickableA(null);
        setPairingBusy(false);
        setStep4Complete(false);
        onSetNextEnabled(true);
        return;
      }

      if (stepNum === 2) {
        setZoneValues(filledZones());
        setZoneStatus(allCorrectZoneStatus());
        setNSValue(null);
        setNSStatus("idle");
        setFeedbackStatus(null);
        setIsShaking(false);
        setLocked(true);
        lockedRef.current = true;
        onUpdateNavText(getStepData(2).navDone);
        onSetNextEnabled(true);
        return;
      }

      if (stepNum === 3) {
        setZoneValues(filledZones());
        setZoneStatus({});
        setNSValue(STEP3_ANSWER);
        setNSStatus("correct");
        setFeedbackStatus("correct");
        setIsShaking(false);
        setLocked(true);
        lockedRef.current = true;
        onUpdateNavText(getStepData(3).navDone);
        onSetNextEnabled(true);
        return;
      }

      if (stepNum === 4) {
        setSampleVisible(makeTrueArray(sampleCount));
        setSamplePairs(ALL_SAMPLE_PAIRS.slice());
        setSampleRevealed(makeTrueArray(sampleCount));
        setClickableA(null);
        setPairingBusy(false);
        setStep4Complete(true);
        onUpdateNavText(getStepData(4).navDone);
        onSetNextEnabled(true);
        return;
      }

      if (stepNum === 5 || stepNum === 6) {
        var correctSet = getEventCorrectSet(stepNum);
        var selected = {};
        var statusMap = {};
        for (var ci in correctSet) {
          selected[ci] = true;
          statusMap[ci] = "correct";
        }
        setSampleVisible(makeTrueArray(sampleCount));
        setSamplePairs(ALL_SAMPLE_PAIRS.slice());
        setSampleRevealed(makeTrueArray(sampleCount));
        setSelectedOutcomes(selected);
        setStep5BoxStatus(statusMap);
        setStep5Submitted(true);
        setStep5Result("correct");
        setStep5Transitioning(false);
        setStep5TitleReady(true);
        onUpdateNavText(getStepData(stepNum).navDone);
        onSetNextEnabled(true);
      }
    },
    [onSetNextEnabled, onUpdateNavText],
  );

  useEffect(
    function () {
      clearShakeTimer();
      clearRestoreTimer();
      clearStep4Timers();
      setDragState(null);
      setHoveredZoneId(null);
      setHiddenValue(null);
      dragRef.current = null;

      if (initialStage === "final") {
        applyStepFinalState(step);
        return;
      }

      setLocked(false);
      lockedRef.current = false;
      setZoneValues(emptyZones());
      setZoneStatus({});
      setNSValue(null);
      setNSStatus("idle");
      setFeedbackStatus(null);
      setIsShaking(false);
      setSampleVisible(makeFalseArray(sampleCount));
      setSamplePairs(makeNullArray(sampleCount));
      setSampleRevealed(makeFalseArray(sampleCount));
      setClickableA(null);
      setPairingBusy(false);
      setStep4Complete(false);
      setSelectedOutcomes({});
      setStep5Submitted(false);
      setStep5Result(null);
      setStep5BoxStatus({});
      setStep5Transitioning(false);
      setStep5TitleReady(false);

      if (step === 1) {
        setTimeout(function () {
          onSetNextEnabled(true);
        }, 0);
      } else if (step === 2) {
        setTimeout(function () {
          onUpdateNavText(getStepData(2).navText);
          onSetNextEnabled(false);
        }, 0);
      } else if (step === 3) {
        setZoneValues(filledZones());
        setTimeout(function () {
          onUpdateNavText(getStepData(3).navText);
          onSetNextEnabled(false);
        }, 0);
      } else if (step === 4) {
        setPairingBusy(true);
        pairingBusyRef.current = true;
        setTimeout(function () {
          onUpdateNavText(getStepData(4).navText);
          onSetNextEnabled(false);
        }, 0);

        var staggerDelay = 120;
        for (var i = 0; i < sampleCount; i++) {
          (function (idx) {
            addStep4Timer(
              function () {
                setSampleVisible(function (prev) {
                  var next = prev.slice();
                  next[idx] = true;
                  return next;
                });
                if (idx === sampleCount - 1) {
                  addStep4Timer(function () {
                    setClickableA(0);
                    clickableARef.current = 0;
                    setPairingBusy(false);
                    pairingBusyRef.current = false;
                  }, 200);
                }
              },
              200 + idx * staggerDelay,
            );
          })(i);
        }
      } else if (step === 5) {
        setSampleVisible(makeTrueArray(sampleCount));
        setSamplePairs(ALL_SAMPLE_PAIRS.slice());
        setSampleRevealed(makeTrueArray(sampleCount));
        setStep5Transitioning(true);
        setStep5TitleReady(false);
        setTimeout(function () {
          onUpdateNavText(getStepData(5).navText);
          onSetNextEnabled(false);
        }, 0);
        addStep4Timer(function () {
          setStep5TitleReady(true);
        }, 120);
        addStep4Timer(function () {
          setStep5Transitioning(false);
        }, 700);
      } else if (step === 6) {
        setSampleVisible(makeTrueArray(sampleCount));
        setSamplePairs(ALL_SAMPLE_PAIRS.slice());
        setSampleRevealed(makeTrueArray(sampleCount));
        setStep5Transitioning(false);
        setStep5TitleReady(true);
        setTimeout(function () {
          onUpdateNavText(getStepData(6).navText);
          onSetNextEnabled(false);
        }, 0);
      }

      return function () {
        clearShakeTimer();
        clearRestoreTimer();
        clearStep4Timers();
      };
    },
    [
      step,
      initialStage,
      applyStepFinalState,
      onSetNextEnabled,
      onUpdateNavText,
    ],
  );

  const getClientPoint = function (evt) {
    if (evt.touches && evt.touches.length) {
      return { x: evt.touches[0].clientX, y: evt.touches[0].clientY };
    }
    if (evt.changedTouches && evt.changedTouches.length) {
      return {
        x: evt.changedTouches[0].clientX,
        y: evt.changedTouches[0].clientY,
      };
    }
    return { x: evt.clientX, y: evt.clientY };
  };

  const findDropZoneAtPoint = function (x, y, selector) {
    var zones = document.querySelectorAll(selector);
    for (var i = 0; i < zones.length; i++) {
      var rect = zones[i].getBoundingClientRect();
      if (
        x >= rect.left &&
        x <= rect.right &&
        y >= rect.top &&
        y <= rect.bottom
      ) {
        return zones[i];
      }
    }
    return null;
  };

  const isZoneFilledCorrect = function (zoneId, values) {
    var val = values[zoneId];
    if (val === null || val === undefined) return false;
    if (ZONE_A.indexOf(zoneId) >= 0) {
      return outcomesA.indexOf(val) >= 0;
    }
    if (ZONE_B.indexOf(zoneId) >= 0) {
      return outcomesB.indexOf(val) >= 0;
    }
    return false;
  };

  const checkStep2Complete = function (values) {
    for (var i = 0; i < ZONE_A.length; i++) {
      if (!isZoneFilledCorrect(ZONE_A[i], values)) return false;
    }
    for (var j = 0; j < ZONE_B.length; j++) {
      if (!isZoneFilledCorrect(ZONE_B[j], values)) return false;
    }
    var aSet = {};
    for (var ai = 0; ai < ZONE_A.length; ai++) {
      aSet[values[ZONE_A[ai]]] = true;
    }
    if (Object.keys(aSet).length !== outcomesA.length) return false;
    var bSet = {};
    for (var bi = 0; bi < ZONE_B.length; bi++) {
      bSet[values[ZONE_B[bi]]] = true;
    }
    return Object.keys(bSet).length === outcomesB.length;
  };

  const evaluateStep2Drop = function (zoneId, value) {
    if (ZONE_A.indexOf(zoneId) >= 0) {
      if (outcomesA.indexOf(value) < 0) return false;
      var current = zoneValuesRef.current;
      for (var i = 0; i < ZONE_A.length; i++) {
        var id = ZONE_A[i];
        if (id !== zoneId && current[id] === value) return false;
      }
      return true;
    }
    if (ZONE_B.indexOf(zoneId) >= 0) {
      if (outcomesB.indexOf(value) < 0) return false;
      var currentB = zoneValuesRef.current;
      for (var j = 0; j < ZONE_B.length; j++) {
        var bid = ZONE_B[j];
        if (bid !== zoneId && currentB[bid] === value) return false;
      }
      return true;
    }
    return false;
  };

  const handleDragStart = function (value, evt, context) {
    if (lockedRef.current) return;
    if (dragRef.current) return;
    evt.preventDefault();
    var point = getClientPoint(evt);
    var nextDrag = {
      value: value,
      context: context,
      x: point.x,
      y: point.y,
    };
    dragRef.current = nextDrag;
    setHiddenValue(value);
    setDragState(nextDrag);
    try {
      if (evt.currentTarget && evt.pointerId != null) {
        evt.currentTarget.setPointerCapture(evt.pointerId);
      }
    } catch (err) {
      /* ignore */
    }
  };

  const handleDragMove = useCallback(function (evt) {
    if (!dragRef.current) return;
    evt.preventDefault();
    var point = getClientPoint(evt);
    var updated = {
      value: dragRef.current.value,
      context: dragRef.current.context,
      x: point.x,
      y: point.y,
    };
    dragRef.current = updated;
    setDragState(updated);

    var hoverId = null;
    if (updated.context === "step2") {
      var zoneEl = findDropZoneAtPoint(point.x, point.y, ".lm-drop-zone");
      if (zoneEl) {
        var zoneId = zoneEl.getAttribute("data-zone-id");
        if (zoneId && zoneStatusRef.current[zoneId] !== "correct") {
          hoverId = zoneId;
        }
      }
    } else if (updated.context === "step3") {
      var nsZone = findDropZoneAtPoint(point.x, point.y, ".lm-ns-drop");
      if (nsZone && nSStatusRef.current !== "correct") {
        hoverId = "ns";
      }
    }
    setHoveredZoneId(hoverId);
  }, []);

  const finishStep2Drop = function (zoneId, value) {
    var isCorrect = evaluateStep2Drop(zoneId, value);
    setZoneValues(function (prev) {
      var next = Object.assign({}, prev);
      next[zoneId] = value;
      zoneValuesRef.current = next;
      return next;
    });

    if (isCorrect) {
      if (typeof playSound === "function") playSound("correct");
      setZoneStatus(function (prev) {
        var next = Object.assign({}, prev);
        next[zoneId] = "correct";
        zoneStatusRef.current = next;
        return next;
      });
      setDragState(null);
      setHoveredZoneId(null);
      dragRef.current = null;
      restoreDraggableAfterDelay();

      var preview = Object.assign({}, zoneValuesRef.current);
      preview[zoneId] = value;
      zoneValuesRef.current = preview;
      if (checkStep2Complete(preview)) {
        setLocked(true);
        lockedRef.current = true;
        onUpdateNavText(getStepData(2).navDone);
        onSetNextEnabled(true);
      }
      return;
    }

    if (typeof playSound === "function") playSound("wrong");
    clearRestoreTimer();
    setZoneStatus(function (prev) {
      var next = Object.assign({}, prev);
      next[zoneId] = "wrong";
      zoneStatusRef.current = next;
      return next;
    });
    setIsShaking(true);
    setLocked(true);
    lockedRef.current = true;
    setDragState(null);
    setHoveredZoneId(null);
    dragRef.current = null;
    setHiddenValue(value);

    clearShakeTimer();
    shakeTimerRef.current = setTimeout(function () {
      setZoneValues(function (prev) {
        var next = Object.assign({}, prev);
        next[zoneId] = null;
        zoneValuesRef.current = next;
        return next;
      });
      setZoneStatus(function (prev) {
        var next = Object.assign({}, prev);
        delete next[zoneId];
        zoneStatusRef.current = next;
        return next;
      });
      setIsShaking(false);
      setHiddenValue(null);
      setLocked(false);
      lockedRef.current = false;
      shakeTimerRef.current = null;
    }, 500);
  };

  const finishStep3Drop = function (value) {
    setNSValue(value);

    if (value === STEP3_ANSWER) {
      if (typeof playSound === "function") playSound("correct");
      setNSStatus("correct");
      nSStatusRef.current = "correct";
      setFeedbackStatus("correct");
      setIsShaking(false);
      setLocked(true);
      lockedRef.current = true;
      setDragState(null);
      setHoveredZoneId(null);
      dragRef.current = null;
      restoreDraggableAfterDelay();
      onUpdateNavText(getStepData(3).navDone);
      onSetNextEnabled(true);
      return;
    }

    if (typeof playSound === "function") playSound("wrong");
    clearRestoreTimer();
    setNSStatus("wrong");
    nSStatusRef.current = "wrong";
    setFeedbackStatus("wrong");
    setIsShaking(true);
    setLocked(true);
    lockedRef.current = true;
    setDragState(null);
    setHoveredZoneId(null);
    dragRef.current = null;
    setHiddenValue(value);

    clearShakeTimer();
    shakeTimerRef.current = setTimeout(function () {
      setNSValue(null);
      setNSStatus("idle");
      nSStatusRef.current = "idle";
      setIsShaking(false);
      setHiddenValue(null);
      setLocked(false);
      lockedRef.current = false;
      shakeTimerRef.current = null;
    }, 500);
  };

  const handleDragEnd = useCallback(
    function (evt) {
      if (!dragRef.current) return;
      evt.preventDefault();
      var point = getClientPoint(evt);
      var current = dragRef.current;
      var value = current.value;
      var context = current.context;

      setHoveredZoneId(null);

      if (context === "step2") {
        var zoneEl = findDropZoneAtPoint(point.x, point.y, ".lm-drop-zone");
        if (!zoneEl) {
          setDragState(null);
          setHiddenValue(null);
          dragRef.current = null;
          return;
        }
        var zoneId = zoneEl.getAttribute("data-zone-id");
        if (!zoneId) {
          setDragState(null);
          setHiddenValue(null);
          dragRef.current = null;
          return;
        }
        if (zoneStatusRef.current[zoneId] === "correct") {
          setDragState(null);
          setHiddenValue(null);
          dragRef.current = null;
          return;
        }
        finishStep2Drop(zoneId, value);
        return;
      }

      if (context === "step3") {
        var nsZone = findDropZoneAtPoint(point.x, point.y, ".lm-ns-drop");
        if (!nsZone) {
          setDragState(null);
          setHiddenValue(null);
          dragRef.current = null;
          return;
        }
        if (nSStatusRef.current === "correct") {
          setDragState(null);
          setHiddenValue(null);
          dragRef.current = null;
          return;
        }
        finishStep3Drop(value);
      }
    },
    [onSetNextEnabled, onUpdateNavText],
  );

  useEffect(
    function () {
      if (!dragState) return undefined;
      var onMove = function (evt) {
        handleDragMove(evt);
      };
      var onEnd = function (evt) {
        handleDragEnd(evt);
      };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onEnd);
      window.addEventListener("pointercancel", onEnd);
      window.addEventListener("touchmove", onMove, { passive: false });
      window.addEventListener("touchend", onEnd);
      window.addEventListener("touchcancel", onEnd);
      return function () {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onEnd);
        window.removeEventListener("pointercancel", onEnd);
        window.removeEventListener("touchmove", onMove);
        window.removeEventListener("touchend", onEnd);
        window.removeEventListener("touchcancel", onEnd);
      };
    },
    [dragState, handleDragMove, handleDragEnd],
  );

  const renderDropZone = function (zoneId, theme) {
    var value = zoneValues[zoneId];
    var status = zoneStatus[zoneId] || "idle";
    var className = "lm-drop-zone theme-" + theme;
    if (status === "correct") className += " is-correct";
    if (status === "wrong") className += " is-wrong";
    if (status === "wrong" && isShaking) className += " shake";
    if (hoveredZoneId === zoneId) className += " is-hovered";
    if (value !== null && value !== undefined) className += " is-filled";

    return e(
      "div",
      {
        key: zoneId,
        className: className,
        "data-zone-id": zoneId,
      },
      value !== null && value !== undefined ? formatOutcomeLabel(value) : null,
    );
  };

  const renderSampleRow = function (label, zoneIds, theme, visible) {
    var nodes = [];
    nodes.push(
      e(
        "span",
        { key: "label", className: "lm-sample-label theme-" + theme },
        label,
      ),
    );
    nodes.push(e("span", { key: "eq", className: "lm-eq" }, " = "));
    nodes.push(e("span", { key: "ob", className: "lm-brace" }, "{"));
    for (var i = 0; i < zoneIds.length; i++) {
      if (i > 0) {
        nodes.push(e("span", { key: "c-" + i, className: "lm-comma" }, ","));
      }
      nodes.push(renderDropZone(zoneIds[i], theme));
    }
    nodes.push(e("span", { key: "cb", className: "lm-brace" }, "}"));

    return e(
      "div",
      {
        className:
          "lm-sample-row" +
          (visible ? " is-visible" : "") +
          (zoneIds.length > 3 ? " is-compact" : ""),
      },
      nodes,
    );
  };

  const renderDraggable = function (value, context, keyPrefix) {
    var isHidden = hiddenValue === value;
    return e(
      "div",
      {
        key: keyPrefix + "-" + value,
        className: "lm-draggable" + (isHidden ? " is-source-hidden" : ""),
        onPointerDown: function (evt) {
          handleDragStart(value, evt, context);
        },
      },
      formatOutcomeLabel(value),
    );
  };

  const renderDragGhost = function () {
    if (!dragState) return null;
    return e(
      "div",
      {
        className: "lm-draggable lm-drag-ghost",
        style: {
          position: "fixed",
          left: dragState.x + "px",
          top: dragState.y + "px",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 9999,
        },
      },
      formatOutcomeLabel(dragState.value),
    );
  };

  const renderStep1or2 = function () {
    var stepData = getStepData(step === 1 ? 1 : 2);
    var step1Data = getStepData(1);
    var step2Data = getStepData(2);
    var showInfo = step === 1;
    var samplesVisible = step === 2;
    var showFooterText = step === 1;
    var showDraggables = step === 2;

    return e(
      React.Fragment,
      null,
      e("div", { className: "lm-title-row" }, stepData.title),
      e(
        "div",
        { className: "lm-visual-row steps-1-2" },
        e(
          "div",
          { className: "lm-spinner-col" },
          e(
            "div",
            { className: "lm-spinner-stage" },
            showInfo
              ? e("div", {
                  className: "lm-info-text lm-info-left",
                  dangerouslySetInnerHTML: {
                    __html: step1Data.spinnerAInfo,
                  },
                })
              : null,
            e("img", {
              className: "lm-spinner-img",
              src: cfg.leftImage,
              alt: "Spinner A",
              draggable: false,
            }),
          ),
          renderSampleRow(
            step2Data.spinnerALabel,
            ZONE_A,
            "a",
            samplesVisible,
          ),
        ),
        e(
          "div",
          { className: "lm-spinner-col" },
          e(
            "div",
            { className: "lm-spinner-stage" },
            e("img", {
              className: "lm-spinner-img",
              src: cfg.rightImage,
              alt: "Spinner B",
              draggable: false,
            }),
            showInfo
              ? e("div", {
                  className: "lm-info-text lm-info-right",
                  dangerouslySetInnerHTML: {
                    __html: step1Data.spinnerBInfo,
                  },
                })
              : null,
          ),
          renderSampleRow(
            step2Data.spinnerBLabel,
            ZONE_B,
            "b",
            samplesVisible,
          ),
        ),
      ),
      e(
        "div",
        { className: "lm-footer-row" },
        showFooterText
          ? e(
              "div",
              { className: "lm-footer-text" },
              step1Data.footerText,
            )
          : null,
        showDraggables
          ? e(
              "div",
              { className: "lm-draggables-row" },
              STEP2_VALUES.map(function (val) {
                return renderDraggable(val, "step2", "s2");
              }),
            )
          : null,
      ),
    );
  };

  const renderFilledChip = function (value, theme, options) {
    var opts = options || {};
    var className = "lm-filled-chip theme-" + theme;
    if (opts.clickable) className += " is-clickable";
    if (opts.extraClass) className += " " + opts.extraClass;
    return e(
      "span",
      {
        className: className,
        ref: opts.ref,
        onClick: opts.onClick,
      },
      formatOutcomeLabel(value),
    );
  };

  const getElementCenter = function (el) {
    if (!el || !containerRef.current) return { x: 0, y: 0 };
    var er = el.getBoundingClientRect();
    var cr = containerRef.current.getBoundingClientRect();
    return {
      x: er.left - cr.left + er.width / 2,
      y: er.top - cr.top + er.height / 2,
    };
  };

  const createFlyClone = function (text, themeClass, pos) {
    var d = document.createElement("div");
    d.className = "lm-fly-clone theme-" + themeClass;
    d.textContent = text;
    d.style.left = pos.x + "px";
    d.style.top = pos.y + "px";
    overlayRef.current.appendChild(d);
    return d;
  };

  const createFlyComma = function (pos) {
    var d = document.createElement("div");
    d.className = "lm-fly-clone lm-fly-comma";
    d.textContent = ",";
    d.style.left = pos.x + "px";
    d.style.top = pos.y + "px";
    d.style.opacity = "0";
    overlayRef.current.appendChild(d);
    return d;
  };

  const animateOnePair = function (aIndex, bIndex, sampleIndex, onDone) {
    var aVal = outcomesA[aIndex];
    var bVal = outcomesB[bIndex];

    setSamplePairs(function (prev) {
      var next = prev.slice();
      next[sampleIndex] = { a: aVal, b: bVal };
      return next;
    });
    setSampleRevealed(function (prev) {
      var next = prev.slice();
      next[sampleIndex] = false;
      return next;
    });

    addStep4Timer(function () {
      var aChip = aChipRefs.current[aIndex];
      var bChip = bChipRefs.current[bIndex];
      var parts = samplePartRefs.current[sampleIndex];
      if (
        !aChip ||
        !bChip ||
        !parts ||
        !parts.a ||
        !parts.b ||
        !parts.comma ||
        !overlayRef.current
      ) {
        if (typeof onDone === "function") onDone();
        return;
      }

      var aStart = getElementCenter(aChip);
      var bCenter = getElementCenter(bChip);
      var vw = window.innerWidth / 100;
      var meetB = { x: bCenter.x, y: bCenter.y };
      var meetA = { x: bCenter.x - 2 * vw, y: bCenter.y };
      var meetComma = { x: (meetA.x + meetB.x) / 2, y: bCenter.y };

      var cloneA = createFlyClone(formatOutcomeLabel(aVal), "a", aStart);
      var tw1 = gsap.to(cloneA, {
        left: meetA.x,
        top: meetA.y,
        duration: 0.55,
        ease: "power2.inOut",
        onComplete: function () {
          var cloneB = createFlyClone(formatOutcomeLabel(bVal), "b", meetB);
          gsap.set(cloneB, { opacity: 0 });
          var comma = createFlyComma(meetComma);

          var tw2 = gsap.timeline({
            onComplete: function () {
              var destA = getElementCenter(parts.a);
              var destC = getElementCenter(parts.comma);
              var destB = getElementCenter(parts.b);

              var tw3 = gsap.timeline({
                onComplete: function () {
                  setSampleRevealed(function (prev) {
                    var next = prev.slice();
                    next[sampleIndex] = true;
                    return next;
                  });
                  if (cloneA.parentNode) cloneA.parentNode.removeChild(cloneA);
                  if (cloneB.parentNode) cloneB.parentNode.removeChild(cloneB);
                  if (comma.parentNode) comma.parentNode.removeChild(comma);
                  if (typeof playSound === "function") playSound("correct");
                  if (typeof onDone === "function") onDone();
                },
              });
              tw3.to(
                cloneA,
                {
                  left: destA.x,
                  top: destA.y,
                  duration: 0.55,
                  ease: "power2.inOut",
                },
                0,
              );
              tw3.to(
                comma,
                {
                  left: destC.x,
                  top: destC.y,
                  duration: 0.55,
                  ease: "power2.inOut",
                },
                0,
              );
              tw3.to(
                cloneB,
                {
                  left: destB.x,
                  top: destB.y,
                  duration: 0.55,
                  ease: "power2.inOut",
                },
                0,
              );
              activeTweensRef.current.push(tw3);
            },
          });

          tw2.to(cloneB, { opacity: 1, duration: 0.25, ease: "power2.out" }, 0);
          tw2.to(
            comma,
            { opacity: 1, duration: 0.2, ease: "power1.out" },
            0.05,
          );
          tw2.to({}, { duration: 0.2 });
          activeTweensRef.current.push(tw2);
        },
      });
      activeTweensRef.current.push(tw1);
    }, 80);
  };

  const finishAChipPairing = function (aIndex) {
    if (aIndex < outcomesA.length - 1) {
      var nextA = aIndex + 1;
      setClickableA(nextA);
      clickableARef.current = nextA;
      setPairingBusy(false);
      pairingBusyRef.current = false;
      var step4Data = getStepData(4);
      var navKey = nextA === 1 ? "navSecond" : (nextA === 2 ? "navThird" : "navSecond");
      onUpdateNavText(step4Data[navKey] || step4Data.navSecond);
      return;
    }

    setClickableA(null);
    clickableARef.current = null;
    setPairingBusy(false);
    pairingBusyRef.current = false;
    setStep4Complete(true);
    onUpdateNavText(getStepData(4).navDone);
    onSetNextEnabled(true);
  };

  const handleAChipClick = function (aIndex) {
    if (step !== 4) return;
    if (pairingBusyRef.current) return;
    if (clickableARef.current !== aIndex) return;
    if (typeof playSound === "function") playSound("click");

    setPairingBusy(true);
    pairingBusyRef.current = true;
    setClickableA(null);
    clickableARef.current = null;

    function runPairSequence(ai, bIndex) {
      if (bIndex >= outcomesB.length) { finishAChipPairing(ai); return; }
      var sampleIndex = ai * outcomesB.length + bIndex;
      animateOnePair(ai, bIndex, sampleIndex, function () {
        if (bIndex + 1 >= outcomesB.length) finishAChipPairing(ai);
        else addStep4Timer(function () { runPairSequence(ai, bIndex + 1); }, 1000);
      });
    }
    runPairSequence(aIndex, 0);
  };

  const renderEquationRow = function (options) {
    return e(
      "div",
      { className: "lm-eq-row theme-" + options.theme },
      e("div", { className: "lm-eq-lhs" }, options.lhs),
      e("div", { className: "lm-eq-equal" }, "="),
      e(
        "div",
        {
          className:
            "lm-eq-rhs" + (options.manyChips ? " is-many" : ""),
        },
        options.rhs,
      ),
    );
  };

  const renderChipList = function (outcomes, theme, chipOptions) {
    var nodes = [];
    for (var i = 0; i < outcomes.length; i++) {
      if (i > 0) nodes.push(e("span", { key: "comma-" + theme + "-" + i, className: "lm-comma" }, ","));
      var opts = chipOptions ? chipOptions(outcomes[i], i) : undefined;
      nodes.push(e(React.Fragment, { key: "chip-" + theme + "-" + i }, renderFilledChip(outcomes[i], theme, opts)));
    }
    return nodes;
  };

  const renderStep3 = function () {
    var stepData = getStepData(3);
    var nsClass = "lm-ns-drop";
    if (nSStatus === "correct") nsClass += " is-correct";
    if (nSStatus === "wrong") nsClass += " is-wrong";
    if (nSStatus === "wrong" && isShaking) nsClass += " shake";
    if (hoveredZoneId === "ns") nsClass += " is-hovered";
    if (nSValue !== null) nsClass += " is-filled";

    var feedbackClass = "lm-feedback-box";
    if (feedbackStatus === "correct") feedbackClass += " is-correct";
    if (feedbackStatus === "wrong") feedbackClass += " is-wrong";

    var aChipNodes = renderChipList(outcomesA, "a");
    var bChipNodes = renderChipList(outcomesB, "b");

    return e(
      React.Fragment,
      null,
      e("div", { className: "lm-title-row" }, stepData.title),
      e(
        "div",
        { className: "lm-visual-row step-3" },
        e(
          "div",
          { className: equationStackClass },
          renderEquationRow({
            theme: "a",
            lhs: e(
              "span",
              { className: "lm-sample-label theme-a" },
              stepData.spinnerALabel,
            ),
            rhs: e(
              React.Fragment,
              null,
              e("span", { className: "lm-brace" }, "{"),
              aChipNodes,
              e("span", { className: "lm-brace" }, "}"),
              e("span", { className: "lm-implies" }, " \u21D2 "),
              e("span", { className: "lm-count theme-a" }, stepData.nAEquals),
            ),
          }),
          renderEquationRow({
            theme: "b",
            manyChips: outcomesB.length >= 6,
            lhs: e(
              "span",
              { className: "lm-sample-label theme-b" },
              stepData.spinnerBLabel,
            ),
            rhs: e(
              React.Fragment,
              null,
              e("span", { className: "lm-brace" }, "{"),
              bChipNodes,
              e("span", { className: "lm-brace" }, "}"),
              e("span", { className: "lm-implies" }, " \u21D2 "),
              e("span", { className: "lm-count theme-b" }, stepData.nBEquals),
            ),
          }),
          e(
            "div",
            { className: "lm-eq-row theme-s lm-ns-row" },
            e(
              "div",
              { className: "lm-eq-lhs" },
              e(
                "span",
                { className: "lm-sample-label theme-s" },
                stepData.nSLabel,
              ),
            ),
            e("div", { className: "lm-eq-equal theme-s" }, "="),
            e(
              "div",
              { className: "lm-eq-rhs lm-ns-rhs" },
              e(
                "div",
                { className: nsClass, "data-zone-id": "ns" },
                nSValue !== null ? String(nSValue) : null,
              ),
              feedbackStatus
                ? e("div", {
                    className: feedbackClass,
                    dangerouslySetInnerHTML: { __html: stepData.feedbackHtml },
                  })
                : null,
            ),
          ),
        ),
      ),
      e(
        "div",
        { className: "lm-footer-row" },
        e(
          "div",
          { className: "lm-draggables-row" },
          STEP3_VALUES.map(function (val) {
            return renderDraggable(val, "step3", "s3");
          }),
        ),
      ),
    );
  };

  const renderStep4 = function () {
    var stepData = getStepData(4);
    var step3Data = getStepData(3);

    var renderSampleBox = function (idx) {
      var pair = samplePairs[idx];
      var revealed = sampleRevealed[idx];
      var visible = sampleVisible[idx];
      var className =
        "lm-sample-box" +
        (visible ? " is-visible" : "") +
        (pair && revealed ? " is-filled" : "");

      return e(
        "div",
        {
          key: "ss-" + idx,
          className: className,
          ref: function (el) {
            sampleBoxRefs.current[idx] = el;
          },
        },
        pair
          ? e(
              "span",
              {
                className: "lm-sample-pair" + (revealed ? " is-revealed" : ""),
              },
              e(
                "span",
                {
                  className: "lm-pair-a",
                  ref: function (el) {
                    if (!samplePartRefs.current[idx])
                      samplePartRefs.current[idx] = {};
                    samplePartRefs.current[idx].a = el;
                  },
                },
                formatOutcomeLabel(pair.a),
              ),
              e(
                "span",
                {
                  className: "lm-pair-comma",
                  ref: function (el) {
                    if (!samplePartRefs.current[idx])
                      samplePartRefs.current[idx] = {};
                    samplePartRefs.current[idx].comma = el;
                  },
                },
                ",",
              ),
              e(
                "span",
                {
                  className: "lm-pair-b",
                  ref: function (el) {
                    if (!samplePartRefs.current[idx])
                      samplePartRefs.current[idx] = {};
                    samplePartRefs.current[idx].b = el;
                  },
                },
                formatOutcomeLabel(pair.b),
              ),
            )
          : e("span", { className: "lm-sample-placeholder" }, String(idx + 1)),
      );
    };

    var aChipNodes = renderChipList(outcomesA, "a", function (val, i) {
      return {
        clickable: clickableA === i,
        ref: function (el) {
          aChipRefs.current[i] = el;
          if (clickableA === i) clickableChipTargetRef.current = el;
        },
        onClick: function () {
          handleAChipClick(i);
        },
      };
    });

    var bChipNodes = renderChipList(outcomesB, "b", function (val, i) {
      return {
        ref: function (el) {
          bChipRefs.current[i] = el;
        },
      };
    });

    var sampleBoxNodes = [];
    for (var si = 0; si < sampleCount; si++) {
      if (si > 0) sampleBoxNodes.push(e("span", { key: "sc-" + si, className: "lm-comma" }, ","));
      sampleBoxNodes.push(renderSampleBox(si));
    }

    return e(
      React.Fragment,
      null,
      e("div", { className: "lm-title-row" }, stepData.title),
      e(
        "div",
        { className: "lm-visual-row step-4" },
        e(
          "div",
          { className: equationStackClass + " step-4-stack" },
          renderEquationRow({
            theme: "a",
            lhs: e(
              "span",
              { className: "lm-sample-label theme-a" },
              stepData.spinnerALabel,
            ),
            rhs: e(
              React.Fragment,
              null,
              e("span", { className: "lm-brace" }, "{"),
              aChipNodes,
              e("span", { className: "lm-brace" }, "}"),
              e("span", { className: "lm-implies lm-keep-space-hidden" }, " \u21D2 "),
              e(
                "span",
                { className: "lm-count theme-a lm-keep-space-hidden" },
                step3Data.nAEquals
              )
            ),
          }),
          renderEquationRow({
            theme: "b",
            manyChips: outcomesB.length >= 6,
            lhs: e(
              "span",
              { className: "lm-sample-label theme-b" },
              stepData.spinnerBLabel,
            ),
            rhs: e(
              React.Fragment,
              null,
              e("span", { className: "lm-brace" }, "{"),
              bChipNodes,
              e("span", { className: "lm-brace" }, "}"),
              e("span", { className: "lm-implies lm-keep-space-hidden" }, " \u21D2 "),
              e(
                "span",
                { className: "lm-count theme-b lm-keep-space-hidden" },
                step3Data.nBEquals
              )
            ),
          }),
        ),
        e(
          "div",
          { className: "lm-ss-row is-centered" + (isWide ? " is-wide" : "") + (isExtraWide ? " is-extra-wide" : "") },
          e("span", { className: "lm-sample-label theme-s-white" }, stepData.sampleSpaceLabel),
          e("span", { className: "lm-eq" }, " = "),
          e("span", { className: "lm-brace" }, "{"),
          sampleBoxNodes,
          e("span", { className: "lm-brace" }, "}")
        )
      ),
      e(
        "div",
        { className: "lm-footer-row" },
        step4Complete
          ? e(
              "div",
              { className: "lm-footer-complete" },
              stepData.completedFooter,
            )
          : null,
      ),
      e("div", { className: "lm-anim-overlay", ref: overlayRef }),
      e(Nudge, {
        key: "step4-chip-nudge-" + String(clickableA),
        targetRef: clickableChipTargetRef,
        active: clickableA !== null && clickableA !== undefined,
        src: "assets/tap.gif",
        imageWidth: "5.5vw",
      }),
    );
  };

  const getSelectedCount = function () {
    var count = 0;
    for (var k in selectedOutcomes) {
      if (selectedOutcomes[k]) count++;
    }
    return count;
  };

  const handleOutcomeToggle = function (idx) {
    if (step !== 5 && step !== 6) return;
    if (step5Submitted && step5Result === "correct") return;
    if (step5Submitted && step5Result === "wrong") return;
    if (typeof playSound === "function") playSound("click");
    setSelectedOutcomes(function (prev) {
      var next = Object.assign({}, prev);
      if (next[idx]) delete next[idx];
      else next[idx] = true;
      return next;
    });
  };

  const handleStep5Submit = function () {
    if (step5Submitted && step5Result === "correct") return;
    var stepData = getStepData(step);
    var correctSet = getEventCorrectSet(step);

    var status = {};
    var allCorrectSelected = true;
    var noExtras = true;

    for (var i = 0; i < ALL_SAMPLE_PAIRS.length; i++) {
      var isCorrect = !!correctSet[i];
      var isSelected = !!selectedOutcomes[i];
      if (isSelected && isCorrect) status[i] = "correct";
      else if (isSelected && !isCorrect) {
        status[i] = "wrong";
        noExtras = false;
      }
      if (isCorrect && !isSelected) allCorrectSelected = false;
    }

    var isAllCorrect = allCorrectSelected && noExtras;
    setStep5BoxStatus(status);
    setStep5Submitted(true);
    setStep5Result(isAllCorrect ? "correct" : "wrong");

    if (isAllCorrect) {
      if (typeof playSound === "function") playSound("correct");
      onUpdateNavText(stepData.navDone);
      onSetNextEnabled(true);
    } else {
      if (typeof playSound === "function") playSound("wrong");
      onUpdateNavText(stepData.navReset);
      onSetNextEnabled(false);
    }
  };

  const handleStep5Reset = function () {
    if (typeof playSound === "function") playSound("click");
    var correctSet = getEventCorrectSet(step);
    var kept = {};
    for (var i = 0; i < ALL_SAMPLE_PAIRS.length; i++) {
      if (selectedOutcomes[i] && correctSet[i]) kept[i] = true;
    }
    setSelectedOutcomes(kept);
    setStep5BoxStatus({});
    setStep5Submitted(false);
    setStep5Result(null);
    onUpdateNavText(getStepData(step).navText);
    onSetNextEnabled(false);
  };

  const renderStep5SampleBox = function (idx) {
    var pair = ALL_SAMPLE_PAIRS[idx];
    var selected = !!selectedOutcomes[idx];
    var status = step5BoxStatus[idx];
    var className = "lm-sample-box is-visible is-filled is-interactive";
    if (selected && !status) className += " is-selected";
    if (status === "correct") className += " is-correct";
    if (status === "wrong") className += " is-wrong";

    return e(
      "div",
      {
        key: "s5-" + idx,
        className: className,
        onClick: function () {
          handleOutcomeToggle(idx);
        },
      },
      e(
        "span",
        { className: "lm-sample-pair is-revealed" },
        e("span", { className: "lm-pair-a" }, formatOutcomeLabel(pair.a)),
        e("span", { className: "lm-pair-comma" }, ","),
        e("span", { className: "lm-pair-b" }, formatOutcomeLabel(pair.b))
      )
    );
  };

  const renderStep5 = function () {
    var stepData = getStepData(step);
    var step3Data = getStepData(3);
    var step4Data = getStepData(4);
    var count = getSelectedCount();
    var neClass = "lm-ne-box";
    if (step5Result === "correct") neClass += " is-correct";
    if (step5Result === "wrong") neClass += " is-wrong";

    var feedbackClass = "lm-event-feedback";
    if (step5Result === "correct") feedbackClass += " is-correct is-visible";
    else if (step5Result === "wrong") feedbackClass += " is-wrong is-visible";

    var showLegacy = step === 5 && step5Transitioning && initialStage !== "final";
    var titleReady = step5TitleReady || initialStage === "final";

    var legacyAChips = renderChipList(outcomesA, "a");
    var legacyBChips = renderChipList(outcomesB, "b");

    var sampleBoxNodes = [];
    for (var si = 0; si < sampleCount; si++) {
      if (si > 0) sampleBoxNodes.push(e("span", { key: "s5c-" + si, className: "lm-comma" }, ","));
      sampleBoxNodes.push(renderStep5SampleBox(si));
    }

    return e(
      React.Fragment,
      null,
      e("div", {
        className:
          "lm-event-title-box" + (titleReady ? " is-ready" : " is-entering"),
        dangerouslySetInnerHTML: { __html: stepData.eventTitleHtml },
      }),
      e(
        "div",
        {
          className:
            "lm-visual-row step-5" + (showLegacy ? " is-transitioning" : " is-ready"),
        },
        showLegacy
          ? e(
              "div",
              { className: equationStackClass + " step-4-stack lm-legacy-fade" },
              renderEquationRow({
                theme: "a",
                lhs: e("span", { className: "lm-sample-label theme-a" }, step4Data.spinnerALabel),
                rhs: e(
                  React.Fragment,
                  null,
                  e("span", { className: "lm-brace" }, "{"),
                  legacyAChips,
                  e("span", { className: "lm-brace" }, "}"),
                  e("span", { className: "lm-implies lm-keep-space-hidden" }, " \u21D2 "),
                  e("span", { className: "lm-count theme-a lm-keep-space-hidden" }, step3Data.nAEquals)
                ),
              }),
              renderEquationRow({
                theme: "b",
                manyChips: outcomesB.length >= 6,
                lhs: e("span", { className: "lm-sample-label theme-b" }, step4Data.spinnerBLabel),
                rhs: e(
                  React.Fragment,
                  null,
                  e("span", { className: "lm-brace" }, "{"),
                  legacyBChips,
                  e("span", { className: "lm-brace" }, "}"),
                  e("span", { className: "lm-implies lm-keep-space-hidden" }, " \u21D2 "),
                  e("span", { className: "lm-count theme-b lm-keep-space-hidden" }, step3Data.nBEquals)
                ),
              })
            )
          : null,
        e(
          "div",
          { className: "lm-ss-row is-centered" + (isWide ? " is-wide" : "") + (isExtraWide ? " is-extra-wide" : "") },
          e("span", { className: "lm-sample-label theme-s-white" }, stepData.sampleSpaceLabel),
          e("span", { className: "lm-eq" }, " = "),
          e("span", { className: "lm-brace" }, "{"),
          sampleBoxNodes,
          e("span", { className: "lm-brace" }, "}")
        ),
        e(
          "div",
          { className: "lm-ne-row" + (titleReady ? " is-ready" : " is-entering") },
          e("span", { className: "lm-ne-label" }, stepData.nELabel),
          e("span", { className: "lm-eq theme-ne" }, " = "),
          e("div", { className: neClass }, String(count))
        ),
        e(
          "div",
          { className: feedbackClass },
          step5Result === "correct"
            ? stepData.feedbackCorrect
            : step5Result === "wrong"
              ? stepData.feedbackWrong
              : ""
        )
      ),
      e(
        "div",
        { className: "lm-footer-row" },
        step5Result === "correct"
          ? null
          : e(
              "button",
              {
                className:
                  "btn lm-action-btn" +
                  (step5Result === "wrong" ? " is-reset" : ""),
                onClick:
                  step5Result === "wrong" ? handleStep5Reset : handleStep5Submit,
              },
              step5Result === "wrong" ? stepData.resetText : stepData.submitText
            )
      )
    );
  };

  return e(
    "div",
    { className: "main-canvas-container listing-method", ref: containerRef },
    step === 1 || step === 2 ? renderStep1or2() : null,
    step === 3 ? renderStep3() : null,
    step === 4 ? renderStep4() : null,
    step === 5 || step === 6 ? renderStep5() : null,
    renderDragGhost(),
  );
};
