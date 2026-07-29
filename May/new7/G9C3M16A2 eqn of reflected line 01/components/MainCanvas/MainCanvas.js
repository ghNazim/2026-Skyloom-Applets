var ce = React.createElement;

var SUBST_PHASES = [
  "initial",
  "x_box",
  "x_fly",
  "x_sub",
  "x_dblneg_out",
  "x_dblneg_in",
  "x_unbox",
  "x_purple",
  "x_simplify_out",
  "x_simplify_in",
  "x_purpleoff",
  "y_box",
  "y_fly",
  "y_sub",
  "y_unbox",
  "y_purple",
  "y_simplify_out",
  "y_simplify_in",
  "y_purpleoff",
  "right_change",
  "done",
];

function phaseIndex(name) {
  return SUBST_PHASES.indexOf(name);
}

var MainCanvas = function (props) {
  var useState = React.useState;
  var useEffect = React.useEffect;
  var useLayoutEffect = React.useLayoutEffect;
  var useRef = React.useRef;
  var useCallback = React.useCallback;

  var currentStep = props.currentStep;

  // Fly clone state (shared)
  var _fc = useState([]);
  var flyClones = _fc[0];
  var setFlyClones = _fc[1];

  // ══════════════════════════════════════════════════
  //  STEP 1: MCQ Phase
  // ══════════════════════════════════════════════════

  var _hp = useState([]);
  var hintPaths = _hp[0];
  var setHintPaths = _hp[1];
  var _hlp = useState({ top: null, bot: null });
  var hintLabelPositions = _hlp[0];
  var setHintLabelPositions = _hlp[1];

  var optionRefs = useRef({ rule: {}, coordA: {}, coordB: {}, simplify: {} });
  var formulaPanelRef = useRef(null);
  var formulaAnswerRef = useRef(null);
  var coordAAnswerRef = useRef(null);
  var coordBAnswerRef = useRef(null);
  var noChangeRef = useRef(null);
  var signChangeRef = useRef(null);
  var formulaXLeftRef = useRef(null);
  var formulaXRightRef = useRef(null);
  var formulaYLeftRef = useRef(null);
  var formulaYRightRef = useRef(null);

  // ══════════════════════════════════════════════════
  //  STEP 2: Substitution
  // ══════════════════════════════════════════════════

  var _sp = useState(0);
  var substPhaseIdx = _sp[0];
  var setSubstPhaseIdx = _sp[1];
  var substPhase = SUBST_PHASES[substPhaseIdx] || "initial";

  var coordAXRef = useRef(null);
  var coordAYRef = useRef(null);
  var coordBXRef = useRef(null);
  var coordBYRef = useRef(null);
  var fX1NumRef = useRef(null);
  var fX1DenRef = useRef(null);
  var fX2DenRef = useRef(null);
  var fY1NumRef = useRef(null);
  var fY1DenRef = useRef(null);
  var fY2DenRef = useRef(null);
  var xDenGroupRef = useRef(null);
  var yDenGroupRef = useRef(null);

  // ══════════════════════════════════════════════════
  //  STEP 4: Reflection graph
  // ══════════════════════════════════════════════════

  var _s4p = useState(-1);
  var step4Phase = _s4p[0];
  var setStep4Phase = _s4p[1];
  var step4DoneCalledRef = useRef(false);

  useEffect(
    function () {
      if (currentStep !== 4) {
        setStep4Phase(-1);
        step4DoneCalledRef.current = false;
        return;
      }

      if (step4Phase === -1) {
        setStep4Phase(0);
        return;
      }

      if (step4Phase >= 8) {
        if (!step4DoneCalledRef.current) {
          step4DoneCalledRef.current = true;
          if (props.onStep4AnimDone) props.onStep4AnimDone();
        }
        return;
      }

      var timer = setTimeout(function () {
        setStep4Phase(function (phase) {
          return phase + 1;
        });
      }, 750);

      return function () {
        clearTimeout(timer);
      };
    },
    [currentStep, step4Phase],
  );

  // ── Step 1 fly animation ──

  var animateOptionToTarget = useCallback(function (
    group,
    index,
    targetRef,
    onDone,
  ) {
    var sourceEl =
      optionRefs.current[group] && optionRefs.current[group][index];
    var targetEl = targetRef && targetRef.current;
    if (!sourceEl || !targetEl) {
      if (typeof onDone === "function") onDone();
      return;
    }
    var sourceRect = sourceEl.getBoundingClientRect();
    var targetRect = targetEl.getBoundingClientRect();
    var html = sourceEl.innerHTML.trim();
    var dx =
      targetRect.left +
      targetRect.width / 2 -
      (sourceRect.left + sourceRect.width / 2);
    var dy =
      targetRect.top +
      targetRect.height / 2 -
      (sourceRect.top + sourceRect.height / 2);
    setFlyClones([
      {
        id: Date.now(),
        html: html,
        left: sourceRect.left + sourceRect.width / 2,
        top: sourceRect.top + sourceRect.height / 2,
        dx: dx,
        dy: dy,
        active: false,
      },
    ]);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        setFlyClones(function (c) {
          return c.map(function (cl) {
            return Object.assign({}, cl, { active: true });
          });
        });
      });
    });
    setTimeout(function () {
      setFlyClones([]);
      if (typeof onDone === "function") onDone();
    }, 900);
  }, []);

  useEffect(
    function () {
      if (currentStep !== 1) return;
      if (props.ruleStatus === "animating") {
        animateOptionToTarget(
          "rule",
          APP_DATA.ruleCorrectIndex,
          formulaAnswerRef,
          props.onRuleAnimDone,
        );
      }
    },
    [currentStep, props.ruleStatus],
  );

  useEffect(
    function () {
      if (currentStep !== 1) return;
      if (props.coordAStatus === "animating") {
        animateOptionToTarget(
          "coordA",
          APP_DATA.coordCorrectIndexA,
          coordAAnswerRef,
          props.onCoordAAnimDone,
        );
      }
    },
    [currentStep, props.coordAStatus],
  );

  useEffect(
    function () {
      if (currentStep !== 1) return;
      if (props.coordBStatus === "animating") {
        animateOptionToTarget(
          "coordB",
          APP_DATA.coordCorrectIndexB,
          coordBAnswerRef,
          props.onCoordBAnimDone,
        );
      }
    },
    [currentStep, props.coordBStatus],
  );

  // ── Step 1 hint connector paths ──

  var showHints = props.showCoordFeedback && props.mcqPhase >= 2;
  var showConnectorHints = showHints && APP_DATA.hints.type === "connectors";
  var showHintLabels =
    showHints &&
    (APP_DATA.hints.type === "connectors" || APP_DATA.hints.type === "labels");

  useLayoutEffect(
    function () {
      if (!showConnectorHints || !formulaPanelRef.current) {
        setHintPaths([]);
        setHintLabelPositions({ top: null, bot: null });
        return;
      }
      var updatePaths = function () {
        var panelRect = formulaPanelRef.current.getBoundingClientRect();
        var rectFor = function (ref) {
          if (!ref.current) return null;
          var r = ref.current.getBoundingClientRect();
          return {
            left: r.left - panelRect.left,
            right: r.right - panelRect.left,
            top: r.top - panelRect.top,
            bottom: r.bottom - panelRect.top,
            width: r.width,
            height: r.height,
            centerX: r.left - panelRect.left + r.width / 2,
            centerY: r.top - panelRect.top + r.height / 2,
          };
        };
        var topLabel = rectFor(noChangeRef);
        var botLabel = rectFor(signChangeRef);
        var xLeft = rectFor(formulaXLeftRef);
        var xRight = rectFor(formulaXRightRef);
        var yLeft = rectFor(formulaYLeftRef);
        var yRight = rectFor(formulaYRightRef);
        var labelGap = panelRect.width * 0.012;
        var paths = [];
        if (topLabel && yLeft && yRight) {
          var cx = (yLeft.centerX + yRight.centerX) / 2;
          var hw = topLabel.width / 2;
          var ty = topLabel.centerY;
          var by = yLeft.top;
          paths.push({
            key: "y-l",
            color: "orange",
            d:
              "M " +
              (cx - hw - labelGap) +
              " " +
              ty +
              " H " +
              yLeft.centerX +
              " V " +
              by,
          });
          paths.push({
            key: "y-r",
            color: "orange",
            d:
              "M " +
              (cx + hw + labelGap) +
              " " +
              ty +
              " H " +
              yRight.centerX +
              " V " +
              by,
          });
        }
        if (botLabel && xLeft && xRight) {
          var cx2 = (xLeft.centerX + xRight.centerX) / 2;
          var hw2 = botLabel.width / 2;
          var by2 = botLabel.centerY;
          var ty2 = xLeft.bottom;
          paths.push({
            key: "x-l",
            color: "purple",
            d:
              "M " +
              (cx2 - hw2 - labelGap) +
              " " +
              by2 +
              " H " +
              xLeft.centerX +
              " V " +
              ty2,
          });
          paths.push({
            key: "x-r",
            color: "purple",
            d:
              "M " +
              (cx2 + hw2 + labelGap) +
              " " +
              by2 +
              " H " +
              xRight.centerX +
              " V " +
              ty2,
          });
        }
        setHintLabelPositions({
          top:
            topLabel && yLeft && yRight
              ? (yLeft.centerX + yRight.centerX) / 2
              : null,
          bot:
            botLabel && xLeft && xRight
              ? (xLeft.centerX + xRight.centerX) / 2
              : null,
        });
        setHintPaths(paths);
      };
      updatePaths();
      window.addEventListener("resize", updatePaths);
      return function () {
        window.removeEventListener("resize", updatePaths);
      };
    },
    [showConnectorHints, props.mcqPhase],
  );

  // ══════════════════════════════════════════════════
  //  STEP 2: Substitution animation driver
  // ══════════════════════════════════════════════════

  useEffect(
    function () {
      if (currentStep !== 2) {
        setSubstPhaseIdx(0);
        return;
      }
    },
    [currentStep],
  );

  useEffect(
    function () {
      if (currentStep !== 2 || !props.substAnimStarted) return;
      if (substPhaseIdx === 0) setSubstPhaseIdx(1);
    },
    [currentStep, props.substAnimStarted],
  );

  useEffect(
    function () {
      if (currentStep !== 2) return;
      var phase = SUBST_PHASES[substPhaseIdx];
      if (!phase || phase === "initial" || phase === "done") return;

      var ANIM = 800;
      var PAUSE = 500;
      var FLY = 1300;
      var SIMPLIFY_ANIM = 650;
      var UNBOX_ANIM = 600;
      var timers = [];

      function schedule(fn, delay) {
        timers.push(setTimeout(fn, delay));
      }

      function advance() {
        setSubstPhaseIdx(function (i) {
          var next = i + 1;
          if (!APP_DATA.subst.xUseDblNeg) {
            while (
              next < SUBST_PHASES.length &&
              (SUBST_PHASES[next] === "x_dblneg_out" ||
                SUBST_PHASES[next] === "x_dblneg_in")
            ) {
              next++;
            }
          }
          return next;
        });
      }

      if (phase === "x_box") {
        schedule(advance, ANIM + PAUSE);
      } else if (phase === "x_fly") {
        doFly("x");
        schedule(advance, FLY + 50);
      } else if (phase === "x_sub") {
        schedule(advance, PAUSE);
      } else if (phase === "x_dblneg_out") {
        schedule(advance, SIMPLIFY_ANIM);
      } else if (phase === "x_dblneg_in") {
        schedule(advance, SIMPLIFY_ANIM + PAUSE);
      } else if (phase === "x_unbox") {
        schedule(advance, UNBOX_ANIM);
      } else if (phase === "x_purple") {
        schedule(advance, ANIM + PAUSE);
      } else if (phase === "x_simplify_out") {
        schedule(advance, SIMPLIFY_ANIM);
      } else if (phase === "x_simplify_in") {
        schedule(advance, SIMPLIFY_ANIM + PAUSE);
      } else if (phase === "x_purpleoff") {
        schedule(advance, UNBOX_ANIM);
      } else if (phase === "y_box") {
        schedule(advance, ANIM + PAUSE);
      } else if (phase === "y_fly") {
        doFly("y");
        schedule(advance, FLY + 50);
      } else if (phase === "y_sub") {
        schedule(advance, PAUSE);
      } else if (phase === "y_unbox") {
        schedule(advance, UNBOX_ANIM);
      } else if (phase === "y_purple") {
        schedule(advance, ANIM + PAUSE);
      } else if (phase === "y_simplify_out") {
        schedule(advance, SIMPLIFY_ANIM);
      } else if (phase === "y_simplify_in") {
        schedule(advance, SIMPLIFY_ANIM + PAUSE);
      } else if (phase === "y_purpleoff") {
        schedule(advance, UNBOX_ANIM);
      } else if (phase === "right_change") {
        schedule(advance, ANIM);
      }

      return function () {
        timers.forEach(clearTimeout);
      };
    },
    [substPhaseIdx, currentStep],
  );

  useEffect(
    function () {
      if (SUBST_PHASES[substPhaseIdx] === "done" && props.onSubstAnimDone) {
        props.onSubstAnimDone();
      }
    },
    [substPhaseIdx],
  );

  // Notify step 2 ready after coords are visible
  useEffect(
    function () {
      if (currentStep === 2 && props.step2CoordsVisible && props.onStep2Ready) {
        var t = setTimeout(function () {
          props.onStep2Ready();
        }, 400);
        return function () {
          clearTimeout(t);
        };
      }
    },
    [currentStep, props.step2CoordsVisible],
  );

  function doFly(axis) {
    var clones = [];
    function makeClone(srcRef, tgtRef, text) {
      if (!srcRef.current || !tgtRef.current) return;
      var s = srcRef.current.getBoundingClientRect();
      var t = tgtRef.current.getBoundingClientRect();
      clones.push({
        id: Date.now() + text + Math.random(),
        html: text,
        left: s.left + s.width / 2,
        top: s.top + s.height / 2,
        dx: t.left + t.width / 2 - (s.left + s.width / 2),
        dy: t.top + t.height / 2 - (s.top + s.height / 2),
        active: false,
      });
    }

    if (axis === "x") {
      makeClone(coordAXRef, fX1NumRef, APP_DATA.imageAX);
      makeClone(coordAXRef, fX1DenRef, APP_DATA.imageAX);
      makeClone(coordBXRef, fX2DenRef, APP_DATA.imageBX);
    } else {
      makeClone(coordAYRef, fY1NumRef, APP_DATA.imageAY);
      makeClone(coordAYRef, fY1DenRef, APP_DATA.imageAY);
      makeClone(coordBYRef, fY2DenRef, APP_DATA.imageBY);
    }

    setFlyClones(clones);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        setFlyClones(function (c) {
          return c.map(function (cl) {
            return Object.assign({}, cl, { active: true });
          });
        });
      });
    });
    setTimeout(function () {
      setFlyClones([]);
    }, 1300);
  }

  // ══════════════════════════════════════════════════
  //  RENDER HELPERS
  // ══════════════════════════════════════════════════

  function renderVariableToken(variable, ref, colorClass) {
    return ce(
      "span",
      {
        ref: ref,
        className:
          "math-var" +
          (showConnectorHints && currentStep === 1 ? " " + colorClass : ""),
      },
      variable,
    );
  }

  function renderRulePart(part) {
    var ref = part.variable === "x" ? formulaXRightRef : formulaYRightRef;
    var cc = part.variable === "x" ? "x-token" : "y-token";
    return ce(
      React.Fragment,
      null,
      part.prefix || "",
      renderVariableToken(part.variable, ref, cc),
      part.suffix || "",
    );
  }

  // ══════════════════════════════════════════════════
  //  STEP 1 RENDER
  // ══════════════════════════════════════════════════

  function renderStep1() {
    var ruleRevealed =
      props.ruleStatus === "hold" || props.ruleStatus === "correct";
    var answerRowOpen = ruleRevealed;
    var coordPhaseActive = props.mcqPhase >= 2;
    var coordASolved = props.coordAStatus === "correct";
    var coordBSolved = props.coordBStatus === "correct";

    var rowTitle = coordPhaseActive
      ? APP_DATA.ruleLabel
      : APP_DATA.rulePromptFull;

    // Options
    var group, options, selectedIndex, status, correctIndex, onSelect;
    if (props.mcqPhase === 1) {
      group = "rule";
      options = APP_DATA.ruleOptions;
      selectedIndex = props.ruleSelected;
      status = props.ruleStatus;
      correctIndex = APP_DATA.ruleCorrectIndex;
      onSelect = props.onRuleSelect;
    } else if (props.mcqPhase === 2) {
      group = "coordA";
      options = APP_DATA.coordOptionsA;
      selectedIndex = props.coordASelected;
      status = props.coordAStatus;
      correctIndex = APP_DATA.coordCorrectIndexA;
      onSelect = props.onCoordASelect;
    } else {
      group = "coordB";
      options = APP_DATA.coordOptionsB;
      selectedIndex = props.coordBSelected;
      status = props.coordBStatus;
      correctIndex = APP_DATA.coordCorrectIndexB;
      onSelect = props.onCoordBSelect;
    }
    var disabled =
      status === "animating" ||
      status === "hold" ||
      status === "correct" ||
      (props.mcqPhase === 1 && status === "wrong");

    // Symbolic formula
    var symbolicFormula = ce(
      "div",
      { className: "formula-expression" },
      ce(
        "span",
        { className: "formula-coordinate" },
        "(",
        renderVariableToken("x", formulaXLeftRef, "x-token"),
        ", ",
        renderVariableToken("y", formulaYLeftRef, "y-token"),
        ")",
      ),
      ce("span", { className: "formula-arrow" }, "\u2192"),
      ce(
        "span",
        { className: "formula-answer-slot", ref: formulaAnswerRef },
        ce(
          "span",
          {
            className:
              "formula-coordinate formula-rhs" +
              (ruleRevealed ? " is-visible" : ""),
          },
          "(",
          renderRulePart(APP_DATA.rule.first),
          ", ",
          renderRulePart(APP_DATA.rule.second),
          ")",
        ),
        !ruleRevealed ? ce("span", { className: "jump-question" }, "?") : null,
      ),
    );

    // Coordinate expressions in answer row
    var coordExprA = ce(
      "div",
      {
        className:
          "coordinate-expression" +
          (props.mcqPhase === 3 &&
          !coordBSolved &&
          props.coordBStatus !== "animating"
            ? " dimmed"
            : ""),
      },
      ce("span", { className: "formula-coordinate" }, APP_DATA.pointA),
      ce("span", { className: "formula-arrow" }, "\u2192"),
      ce(
        "span",
        { className: "formula-answer-slot", ref: coordAAnswerRef },
        ce(
          "span",
          {
            className:
              "formula-coordinate formula-rhs" +
              (coordASolved ? " is-visible" : ""),
            id: "coord-a-answer",
          },
          APP_DATA.imageA,
        ),
        !coordASolved
          ? ce(
              "span",
              { className: "coord-question-overlay" },
              ce("span", { className: "coord-static" }, "A\u2032( "),
              ce(
                "span",
                {
                  className:
                    "coord-q-mark" + (props.mcqPhase === 3 ? " no-jump" : ""),
                },
                "?",
              ),
              ce("span", { className: "coord-static" }, " , "),
              ce(
                "span",
                {
                  className:
                    "coord-q-mark" + (props.mcqPhase === 3 ? " no-jump" : ""),
                },
                "?",
              ),
              ce("span", { className: "coord-static" }, " )"),
            )
          : null,
      ),
    );

    var coordExprB = ce(
      "div",
      {
        className:
          "coordinate-expression" + (props.mcqPhase === 2 ? " dimmed" : ""),
      },
      ce("span", { className: "formula-coordinate" }, APP_DATA.pointB),
      ce("span", { className: "formula-arrow" }, "\u2192"),
      ce(
        "span",
        { className: "formula-answer-slot", ref: coordBAnswerRef },
        ce(
          "span",
          {
            className:
              "formula-coordinate formula-rhs" +
              (coordBSolved ? " is-visible" : ""),
            id: "coord-b-answer",
          },
          APP_DATA.imageB,
        ),
        !coordBSolved
          ? ce(
              "span",
              { className: "coord-question-overlay" },
              ce("span", { className: "coord-static" }, "B\u2032( "),
              ce(
                "span",
                {
                  className:
                    "coord-q-mark" + (props.mcqPhase === 2 ? " no-jump" : ""),
                },
                "?",
              ),
              ce("span", { className: "coord-static" }, " , "),
              ce(
                "span",
                {
                  className:
                    "coord-q-mark" + (props.mcqPhase === 2 ? " no-jump" : ""),
                },
                "?",
              ),
              ce("span", { className: "coord-static" }, " )"),
            )
          : null,
      ),
    );

    // Render options
    var optionButtons = options.map(function (opt, idx) {
      var isSelected = selectedIndex === idx;
      var isCorrect =
        isSelected &&
        idx === correctIndex &&
        (status === "animating" || status === "hold" || status === "correct");
      var isWrong =
        isSelected &&
        idx !== correctIndex &&
        (status === "wrong" ||
          status === "animating" ||
          status === "hold" ||
          status === "correct");
      var cls = "reflection-option";
      if (isCorrect) cls += " is-correct";
      if (isWrong) cls += " is-wrong";
      return ce("button", {
        key: group + "-" + idx,
        className: cls,
        disabled: disabled,
        ref: function (el) {
          optionRefs.current[group][idx] = el;
        },
        onClick: function () {
          onSelect(idx);
        },
        dangerouslySetInnerHTML: { __html: formatMathVariables(opt) },
      });
    });

    // Feedback
    var feedbackEl = null;
    if (coordPhaseActive) {
      if (props.showCoordFeedback) {
        feedbackEl = ce("div", {
          className: "reflection-feedback",
          dangerouslySetInnerHTML: {
            __html: APP_DATA.feedback.coordinateWrong,
          },
        });
      } else {
        feedbackEl = ce("div", { className: "feedback-spacer" });
      }
    }

    return ce(
      React.Fragment,
      null,
      ce(
        "div",
        { className: "main-canvas-container" },
        ce(
          "div",
          { className: "reflection-left-column" },
          ce(
            "div",
            {
              className:
                "reflection-rows" + (answerRowOpen ? " answer-open" : ""),
            },
            ce(
              "section",
              { className: "reflection-row formula-row", ref: formulaPanelRef },
              showConnectorHints
                ? ce(
                    "svg",
                    { className: "hint-paths" },
                    hintPaths.map(function (p) {
                      return ce("path", {
                        key: p.key,
                        className: "hint-path " + p.color,
                        d: p.d,
                        vectorEffect: "non-scaling-stroke",
                      });
                    }),
                  )
                : null,
              ce("div", {
                className: "row-title",
                dangerouslySetInnerHTML: { __html: rowTitle },
              }),
              showHintLabels
                ? ce(
                    "div",
                    {
                      className: "x-hint",
                      ref: noChangeRef,
                      style:
                        showConnectorHints && hintLabelPositions.top !== null
                          ? { left: hintLabelPositions.top + "px" }
                          : null,
                    },
                    APP_DATA.hints.y,
                  )
                : null,
              symbolicFormula,
              showHintLabels
                ? ce(
                    "div",
                    {
                      className: "y-hint",
                      ref: signChangeRef,
                      style:
                        showConnectorHints && hintLabelPositions.bot !== null
                          ? { left: hintLabelPositions.bot + "px" }
                          : null,
                    },
                    APP_DATA.hints.x,
                  )
                : null,
            ),
            ce(
              "section",
              { className: "reflection-row answer-row" },
              ce(
                "div",
                { className: "answer-row-inner" },
                ce(
                  "div",
                  { className: "row-title answer-title" },
                  APP_DATA.coordPrompt,
                ),
                ce(
                  "div",
                  { className: "coord-expressions-wrapper" },
                  coordExprA,
                  coordExprB,
                ),
              ),
            ),
          ),
        ),
        ce(
          "aside",
          { className: "reflection-right-column" },
          feedbackEl,
          ce("div", { className: "reflection-options" }, optionButtons),
        ),
      ),
      renderFlyClones(),
    );
  }

  // ══════════════════════════════════════════════════
  //  STEP 2 RENDER
  // ══════════════════════════════════════════════════

  function renderStep2() {
    var p = substPhaseIdx;

    var xDblNegOut = p === phaseIndex("x_dblneg_out");
    var xNegFixed = p >= phaseIndex("x_dblneg_in");
    var xSubbed = p >= phaseIndex("x_sub");
    var xUnboxing = p === phaseIndex("x_unbox");
    var xUnboxed = p > phaseIndex("x_unbox");
    var xDenSimpOut = p === phaseIndex("x_simplify_out");
    var xDenSimp = p >= phaseIndex("x_simplify_in");
    var xBoxed = p >= phaseIndex("x_box") && !xUnboxed;
    var xPurpleClearing = p === phaseIndex("x_purpleoff");
    var xPurple =
      p >= phaseIndex("x_purple") &&
      (p < phaseIndex("x_purpleoff") || xPurpleClearing);

    var ySubbed = p >= phaseIndex("y_sub");
    var yUnboxing = p === phaseIndex("y_unbox");
    var yUnboxed = p > phaseIndex("y_unbox");
    var yDenSimpOut = p === phaseIndex("y_simplify_out");
    var yDenSimp = p >= phaseIndex("y_simplify_in");
    var yBoxed = p >= phaseIndex("y_box") && !yUnboxed;
    var yPurpleClearing = p === phaseIndex("y_purpleoff");
    var yPurple =
      p >= phaseIndex("y_purple") &&
      (p < phaseIndex("y_purpleoff") || yPurpleClearing);

    var rightChanged = p >= phaseIndex("right_change");

    function fadeCls(isOut, isIn) {
      if (isOut) return " tpf-fade-out";
      if (isIn) return " tpf-fade-in";
      return "";
    }

    function renderDblNegOp(isOut, isIn, fixed) {
      return ce(
        React.Fragment,
        null,
        !fixed
          ? ce(
              "span",
              { className: "tpf-op" + (isOut ? " tpf-fade-out" : "") },
              " \u2212 ",
            )
          : null,
        fixed || isIn
          ? ce(
              "span",
              { className: "tpf-op" + (isIn ? " tpf-fade-in" : "") },
              " + ",
            )
          : null,
      );
    }

    function renderDblNegVal(boxClsStr, isOut, fixed, val, clearing) {
      return ce(
        "span",
        { className: boxClsStr + (clearing ? " tpf-box-clearing" : "") },
        !fixed
          ? ce(
              "span",
              { className: "tpf-val-sign" + (isOut ? " tpf-fade-out" : "") },
              "\u2212",
            )
          : null,
        val,
      );
    }

    function boxedSpan(cls, clearing, children) {
      return ce(
        "span",
        { className: cls + (clearing ? " tpf-box-clearing" : "") },
        children,
      );
    }

    // ── Coordinate row ──
    var coordsVisible = props.step2CoordsVisible;

    function boxCls(isBlue, isBrown, clearing) {
      var cls = "";
      if (isBlue) cls += " tpf-box-blue";
      if (isBrown) cls += " tpf-box-brown";
      if (clearing) cls += " tpf-box-clearing";
      return cls;
    }

    var coordRow = ce(
      "div",
      {
        className:
          "step2-coord-values" + (coordsVisible ? "" : " hidden-content"),
      },
      ce(
        "span",
        { id: "step2-coord-a", className: "step2-coord-group" },
        ce(
          "span",
          { className: "step2-coord-label" },
          APP_DATA.step2.coordTextA,
        ),
        ce(
          "span",
          {
            ref: coordAXRef,
            className: "step2-coord-val" + boxCls(xBoxed, false, xUnboxing),
          },
          APP_DATA.imageAX,
        ),
        ce("span", null, ", "),
        ce(
          "span",
          {
            ref: coordAYRef,
            className: "step2-coord-val" + boxCls(yBoxed, false, yUnboxing),
          },
          APP_DATA.imageAY,
        ),
        ce("span", null, ")"),
      ),
      ce("span", null, APP_DATA.step2.coordAnd),
      ce(
        "span",
        { id: "step2-coord-b", className: "step2-coord-group" },
        ce(
          "span",
          { className: "step2-coord-label" },
          APP_DATA.step2.coordTextB,
        ),
        ce(
          "span",
          {
            ref: coordBXRef,
            className: "step2-coord-val" + boxCls(false, xBoxed, xUnboxing),
          },
          APP_DATA.imageBX,
        ),
        ce("span", null, ", "),
        ce(
          "span",
          {
            ref: coordBYRef,
            className: "step2-coord-val" + boxCls(false, yBoxed, yUnboxing),
          },
          APP_DATA.imageBY,
        ),
        ce("span", null, ")"),
      ),
    );

    // ── Two-point form fraction rendering ──
    var S = APP_DATA.subst;

    function sub(text) {
      return ce("sub", null, text);
    }
    function mvar(text) {
      return ce("span", { className: "math-var" }, text);
    }

    // Left numerator: x - x₁
    var leftNum;
    if (xSubbed || xDblNegOut || xNegFixed) {
      if (S.xNumSubUsesDblNeg) {
        var numOut = xDblNegOut;
        var numIn = p === phaseIndex("x_dblneg_in");
        leftNum = ce(
          "div",
          { className: "tpf-num" },
          mvar("x"),
          renderDblNegOp(numOut, numIn, xNegFixed),
          renderDblNegVal(
            xBoxed ? "tpf-box-blue" : "",
            numOut,
            xNegFixed,
            S.xNumSubResult,
            xUnboxing,
          ),
        );
      } else {
        leftNum = ce(
          "div",
          { className: "tpf-num" },
          mvar("x"),
          ce("span", { className: "tpf-op" }, " \u2212 "),
          boxedSpan(
            xBoxed ? "tpf-box-blue" : "",
            xUnboxing,
            S.xNumSub,
          ),
        );
      }
    } else {
      leftNum = ce(
        "div",
        { className: "tpf-num" },
        mvar("x"),
        ce("span", { className: "tpf-op" }, " \u2212 "),
        ce(
          "span",
          {
            ref: fX1NumRef,
            className: "tpf-subscript" + boxCls(xBoxed, false, xUnboxing),
          },
          mvar("x"),
          sub("1"),
        ),
      );
    }

    // Left denominator: x₂ - x₁
    var leftDen;
    if (xDenSimp) {
      leftDen = ce(
        "div",
        {
          className:
            "tpf-den tpf-simp-target" +
            (xPurple ? " tpf-purple-box" : "") +
            (xPurpleClearing ? " tpf-box-clearing" : "") +
            fadeCls(false, p === phaseIndex("x_simplify_in")),
        },
        ce("span", null, S.xDenResult),
      );
    } else if (xSubbed || xDblNegOut || xNegFixed || xDenSimpOut) {
      if (S.xDenUsesDblNeg) {
        var denOut = xDblNegOut;
        var denIn = p === phaseIndex("x_dblneg_in");
        leftDen = ce(
          "div",
          {
            className:
              "tpf-den" +
              (xPurple ? " tpf-purple-box" : "") +
              (xPurpleClearing ? " tpf-box-clearing" : "") +
              fadeCls(xDenSimpOut, false),
            ref: xDenSimpOut ? null : xDenGroupRef,
          },
          boxedSpan(xBoxed ? "tpf-box-brown" : "", xUnboxing, S.xDenVal2),
          renderDblNegOp(denOut, denIn, xNegFixed),
          renderDblNegVal(
            xBoxed ? "tpf-box-blue" : "",
            denOut,
            xNegFixed,
            S.xDenVal1,
            xUnboxing,
          ),
        );
      } else {
        leftDen = ce(
          "div",
          {
            className:
              "tpf-den" +
              (xPurple ? " tpf-purple-box" : "") +
              (xPurpleClearing ? " tpf-box-clearing" : "") +
              fadeCls(xDenSimpOut, false),
            ref: xDenGroupRef,
          },
          boxedSpan(xBoxed ? "tpf-box-brown" : "", xUnboxing, S.xDenVal2),
          ce("span", { className: "tpf-op" }, " \u2212 "),
          boxedSpan(xBoxed ? "tpf-box-blue" : "", xUnboxing, S.xDenVal1),
        );
      }
    } else {
      leftDen = ce(
        "div",
        { className: "tpf-den" },
        ce(
          "span",
          {
            ref: fX2DenRef,
            className: "tpf-subscript" + boxCls(false, xBoxed, xUnboxing),
          },
          mvar("x"),
          sub("2"),
        ),
        ce("span", { className: "tpf-op" }, " \u2212 "),
        ce(
          "span",
          {
            ref: fX1DenRef,
            className: "tpf-subscript" + boxCls(xBoxed, false, xUnboxing),
          },
          mvar("x"),
          sub("1"),
        ),
      );
    }

    // Right numerator: y - y₁
    var rightNum;
    if (ySubbed) {
      rightNum = ce(
        "div",
        { className: "tpf-num" },
        mvar("y"),
        ce("span", { className: "tpf-op" }, " \u2212 "),
        boxedSpan(yBoxed ? "tpf-box-blue" : "", yUnboxing, S.yNumSub),
      );
    } else {
      rightNum = ce(
        "div",
        { className: "tpf-num" },
        mvar("y"),
        ce("span", { className: "tpf-op" }, " \u2212 "),
        ce(
          "span",
          {
            ref: fY1NumRef,
            className: "tpf-subscript" + boxCls(yBoxed, false, yUnboxing),
          },
          mvar("y"),
          sub("1"),
        ),
      );
    }

    // Right denominator: y₂ - y₁
    var rightDen;
    if (yDenSimp) {
      rightDen = ce(
        "div",
        {
          className:
            "tpf-den tpf-simp-target" +
            (yPurple ? " tpf-purple-box" : "") +
            (yPurpleClearing ? " tpf-box-clearing" : "") +
            fadeCls(false, p === phaseIndex("y_simplify_in")),
        },
        ce("span", null, S.yDenResult),
      );
    } else if (ySubbed || yDenSimpOut) {
      rightDen = ce(
        "div",
        {
          className:
            "tpf-den" +
            (yPurple ? " tpf-purple-box" : "") +
            (yPurpleClearing ? " tpf-box-clearing" : "") +
            fadeCls(yDenSimpOut, false),
          ref: yDenGroupRef,
        },
        boxedSpan(yBoxed ? "tpf-box-brown" : "", yUnboxing, S.yDenVal2),
        ce("span", { className: "tpf-op" }, " \u2212 "),
        boxedSpan(yBoxed ? "tpf-box-blue" : "", yUnboxing, S.yDenVal1),
      );
    } else {
      rightDen = ce(
        "div",
        { className: "tpf-den" },
        ce(
          "span",
          {
            ref: fY2DenRef,
            className: "tpf-subscript" + boxCls(false, yBoxed, yUnboxing),
          },
          mvar("y"),
          sub("2"),
        ),
        ce("span", { className: "tpf-op" }, " \u2212 "),
        ce(
          "span",
          {
            ref: fY1DenRef,
            className: "tpf-subscript" + boxCls(yBoxed, false, yUnboxing),
          },
          mvar("y"),
          sub("1"),
        ),
      );
    }

    var formulaEl = ce(
      "div",
      { className: "tpf-container" },
      ce(
        "div",
        { className: "tpf-fraction" },
        leftNum,
        ce("div", { className: "tpf-bar" }),
        leftDen,
      ),
      ce("span", { className: "tpf-equals" }, "="),
      ce(
        "div",
        { className: "tpf-fraction" },
        rightNum,
        ce("div", { className: "tpf-bar" }),
        rightDen,
      ),
    );

    // ── Right panel ──
    var rightContent;
    if (rightChanged) {
      rightContent = ce(
        "div",
        { className: "step2-right-content fade-in", key: "after" },
        ce("p", {
          className: "step2-right-text",
          dangerouslySetInnerHTML: { __html: APP_DATA.step2.rightTextAfter },
        }),
        ce("p", { className: "step2-right-formula" }, "ax + by = c"),
        ce(
          "p",
          { className: "step2-right-text" },
          APP_DATA.step2.rightTextAfterEnd,
        ),
      );
    } else {
      rightContent = ce(
        "div",
        {
          className:
            "step2-right-content" +
            (props.step2Ready ? " fade-in" : " hidden-content"),
          key: "before",
        },
        ce("p", {
          className: "step2-right-text",
          dangerouslySetInnerHTML: { __html: APP_DATA.step2.rightText },
        }),
        ce(
          "button",
          {
            className: "btn step2-substitute-btn",
            id: "substitute-button",
            onClick: props.onSubstitute,
            disabled: props.substAnimStarted,
          },
          APP_DATA.step2.substituteBtn,
        ),
      );
    }

    return ce(
      React.Fragment,
      null,
      ce(
        "div",
        { className: "main-canvas-container" },
        ce(
          "div",
          { className: "step2-left-column" },
          ce(
            "div",
            {
              className:
                "step2-heading-bar" +
                (props.step2LeftVisible ? "" : " hidden-content"),
            },
            APP_DATA.step2.headingLeft,
          ),
          ce(
            "div",
            { className: "step2-visual" },
            ce(
              "div",
              {
                className:
                  "step2-coord-title" +
                  (props.step2LeftVisible ? "" : " hidden-content"),
              },
              APP_DATA.step2.coordTitle,
            ),
            coordRow,
            ce("div", {
              className:
                "step2-formula-title" +
                (props.step2LeftVisible ? "" : " hidden-content"),
              dangerouslySetInnerHTML: { __html: APP_DATA.step2.formulaTitle },
            }),
            ce(
              "div",
              {
                className:
                  "tpf-container-wrap" +
                  (props.step2LeftVisible ? "" : " hidden-content"),
              },
              formulaEl,
            ),
          ),
        ),
        ce("aside", { className: "step2-right-column" }, rightContent),
      ),
      renderFlyClones(),
    );
  }

  // ══════════════════════════════════════════════════
  //  STEP 3 RENDER
  // ══════════════════════════════════════════════════

  function renderStep3() {
    function mvar(t) {
      return ce("span", { className: "math-var" }, t);
    }

    var f = APP_DATA.step3Formula;

    var formulaEl = ce(
      "div",
      { className: "tpf-container" },
      ce(
        "div",
        { className: "tpf-fraction" },
        ce(
          "div",
          { className: "tpf-num" },
          mvar("x"),
          ce("span", { className: "tpf-op" }, " " + f.leftNumOp + " "),
          f.leftNumVal,
        ),
        ce("div", { className: "tpf-bar" }),
        ce("div", { className: "tpf-den" }, f.leftDen),
      ),
      ce("span", { className: "tpf-equals" }, "="),
      ce(
        "div",
        { className: "tpf-fraction" },
        ce(
          "div",
          { className: "tpf-num" },
          mvar("y"),
          ce("span", { className: "tpf-op" }, " " + f.rightNumOp + " "),
          f.rightNumVal,
        ),
        ce("div", { className: "tpf-bar" }),
        ce("div", { className: "tpf-den" }, f.rightDen),
      ),
    );

    // Options
    var optionButtons = APP_DATA.step3.options.map(function (opt, idx) {
      var isSelected = props.simplifySelected === idx;
      var isCorrectSel =
        isSelected &&
        idx === APP_DATA.step3.correctIndex &&
        props.simplifyStatus === "correct";
      var isWrongSel =
        isSelected &&
        idx !== APP_DATA.step3.correctIndex &&
        props.simplifyStatus === "wrong";
      var cls = "reflection-option";
      if (isCorrectSel) cls += " is-correct";
      if (isWrongSel) cls += " is-wrong";
      return ce(
        "button",
        {
          key: "s-" + idx,
          className: cls,
          disabled: props.simplifyStatus === "correct",
          ref: function (el) {
            optionRefs.current.simplify[idx] = el;
          },
          onClick: function () {
            props.onSimplifySelect(idx);
          },
        },
        opt,
      );
    });

    var feedbackEl = null;
    if (props.simplifyStatus === "correct") {
      feedbackEl = ce("div", {
        className: "simplify-feedback correct-feedback",
        dangerouslySetInnerHTML: { __html: APP_DATA.step3.feedbackCorrect },
      });
    } else if (props.showSimplifyFeedback) {
      feedbackEl = ce("div", {
        className: "simplify-feedback wrong-feedback",
        dangerouslySetInnerHTML: { __html: APP_DATA.step3.feedbackWrong },
      });
    }

    return ce(
      "div",
      { className: "main-canvas-container" },
      ce(
        "div",
        { className: "step3-left-column" },
        ce(
          "div",
          { className: "step2-heading-bar" },
          APP_DATA.step3.headingLeft,
        ),
        ce(
          "div",
          { className: "step3-visual" },
          ce("div", {
            className: "step2-formula-title",
            dangerouslySetInnerHTML: { __html: APP_DATA.step3.formulaTitle },
          }),
          ce("div", { className: "tpf-container-wrap" }, formulaEl),
          ce(
            "div",
            { className: "step3-simplify-prompt fade-in" },
            ce("span", null, APP_DATA.step3.simplifyTitle),
            ce("span", { className: "step3-simplify-formula" }, "ax + by = c"),
          ),
        ),
      ),
      ce(
        "aside",
        { className: "step3-right-column" },
        ce("div", {
          className: "step3-mcq-title",
          dangerouslySetInnerHTML: { __html: APP_DATA.step3.mcqTitle },
        }),
        ce(
          "div",
          { className: "reflection-options step3-options" },
          optionButtons,
        ),
        feedbackEl,
      ),
    );
  }

  // ══════════════════════════════════════════════════
  //  STEP 4 RENDER
  // ══════════════════════════════════════════════════

  function renderStep4() {
    var phase = step4Phase < 0 ? 0 : step4Phase;
    var yellow = REFLECTION_GRAPH_YELLOW;
    var g = APP_DATA.graph;
    var points = [];

    if (phase >= 1) {
      points.push({
        id: "A",
        x: g.A.x,
        y: g.A.y,
        label: APP_DATA.pointA,
        labelPlacement: g.A.labelPlacement,
        color: yellow,
      });
    }
    if (phase >= 2) {
      points.push({
        id: "B",
        x: g.B.x,
        y: g.B.y,
        label: APP_DATA.pointB,
        labelPlacement: g.B.labelPlacement,
        color: yellow,
      });
    }
    if (phase >= 5) {
      points.push({
        id: "Aprime",
        x: g.Aprime.x,
        y: g.Aprime.y,
        label: APP_DATA.imageA,
        labelPlacement: g.Aprime.labelPlacement,
        color: yellow,
      });
    }
    if (phase >= 6) {
      points.push({
        id: "Bprime",
        x: g.Bprime.x,
        y: g.Bprime.y,
        label: APP_DATA.imageB,
        labelPlacement: g.Bprime.labelPlacement,
        color: yellow,
      });
    }

    var extendedLines = [];
    if (phase >= 3) {
      extendedLines.push({
        through: [
          { x: g.A.x, y: g.A.y },
          { x: g.B.x, y: g.B.y },
        ],
        color: yellow,
        dashed: false,
        growFromCenter: true,
      });
    }
    if (phase >= 7) {
      extendedLines.push({
        through: [
          { x: g.Aprime.x, y: g.Aprime.y },
          { x: g.Bprime.x, y: g.Bprime.y },
        ],
        color: yellow,
        dashed: true,
        growFromCenter: true,
        equationLabel: APP_DATA.step4.equationLabel,
        showLabelAfterGrow: true,
        labelColor: REFLECTION_GRAPH_YELLOW,
      });
    }

    var reflectionAxisLine = null;
    if (phase >= 4 && APP_DATA.step4.reflectionAxisLine) {
      reflectionAxisLine = Object.assign({}, APP_DATA.step4.reflectionAxisLine, {
        color: REFLECTION_GRAPH_ORANGE,
        growFromCenter: true,
        noArrows: true,
      });
    }

    return ce(
      "div",
      { className: "main-canvas-container" },
      ce(
        "div",
        { className: "step4-left-column" },
        ce("div", {
          className: "step2-heading-bar",
          dangerouslySetInnerHTML: { __html: APP_DATA.step4.headingLeft },
        }),
        ce(
          "div",
          { className: "step4-visual" },
          ce(TranslationGraphPanel, {
            graphConfig: APP_DATA.graphConfig || REFLECTION_LINE_GRAPH_CONFIG,
            points: points,
            extendedLines: extendedLines,
            yAxisHighlight: phase >= 4 && APP_DATA.step4.highlightYAxis,
            dimAxisNumbers: true,
            reflectionAxisLine: reflectionAxisLine,
          }),
        ),
      ),
      ce(
        "aside",
        { className: "step4-right-column" },
        ce("div", {
          className:
            "step4-right-content" +
            (phase >= 8 ? " fade-in" : " hidden-content"),
          dangerouslySetInnerHTML: { __html: APP_DATA.step4.rightText },
        }),
      ),
    );
  }

  // ── Fly clones (shared render) ──

  function renderFlyClones() {
    var isSubstFly = currentStep === 2;
    return flyClones.map(function (clone) {
      return ce("div", {
        key: clone.id,
        className:
          "reflection-fly-clone" +
          (isSubstFly ? " substitution-fly-clone" : ""),
        style: {
          left: clone.left + "px",
          top: clone.top + "px",
          transform: clone.active
            ? "translate(calc(-50% + " +
              clone.dx +
              "px), calc(-50% + " +
              clone.dy +
              "px))"
            : "translate(-50%, -50%)",
        },
        dangerouslySetInnerHTML: { __html: clone.html },
      });
    });
  }

  // ══════════════════════════════════════════════════
  //  MAIN RENDER
  // ══════════════════════════════════════════════════

  if (currentStep === 1) return renderStep1();
  if (currentStep === 2) return renderStep2();
  if (currentStep === 3) return renderStep3();
  if (currentStep === 4) return renderStep4();
  return null;
};
