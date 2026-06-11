function SchoolCompareCanvas(props) {
  var step = props.step;
  var questionIndex = props.questionIndex || 0;
  var startAtFinal = props.startAtFinal;
  var onSetNextEnabled = props.onSetNextEnabled;
  var onUpdateNavText = props.onUpdateNavText;
  var onUpdateQuestionText = props.onUpdateQuestionText;
  var useState = React.useState;
  var useEffect = React.useEffect;
  var useRef = React.useRef;
  var e = React.createElement;

  var popConfig = APP_DATA.graphs[2];
  var step7Config = APP_DATA.steps[7] || {};
  var currentQuestion = (step7Config.questions || [])[questionIndex] || {};
  var stepCopy = step7Config;
  var popData = popConfig.graphData;
  var sampleData = currentQuestion.graphData || [];
  var sampleBarColor = step7Config.barColor || "#5b9bd5";
  var sampleHeading = step7Config.sampleHeading || "Sample";

  var SVG_W = 760, SVG_H = 440;
  var ML = 50, MR = 30, MT = 10, MB = 30;
  var XMIN = 0, XMAX = 21, YMAX = 70;
  var pW = SVG_W - ML - MR;
  var pH = SVG_H - MT - MB;
  var xSc = pW / XMAX;
  var ySc = pH / YMAX;
  var barW = Math.round(xSc * 0.52);
  var AXIS_LABEL_SIZE = 15;
  var Y_TICK_STROKE = 2.5;

  function xP(x) { return ML + (x - XMIN) * xSc; }
  function yP(y) { return MT + (YMAX - y) * ySc; }
  var baseY = yP(0);

  function getPathPoints(data, scale) {
    var n = data.length;
    if (n === 0) return [];

    var bars = data.map(function (d) {
      return {
        bl: xP(d.x) - barW / 2,
        br: xP(d.x) + barW / 2,
        bt: yP(d.y * scale),
        h: d.y * scale,
      };
    });

    function pushPt(pts, x, y) {
      var last = pts[pts.length - 1];
      if (!last || last[0] !== x || last[1] !== y) pts.push([x, y]);
    }

    var pts = [];
    var curX = bars[0].bl;
    var curY = bars[0].bt;
    pushPt(pts, curX, curY);

    for (var i = 0; i < n - 1; i++) {
      var b = bars[i];
      var next = bars[i + 1];
      if (next.h > b.h) {
        pushPt(pts, next.bl, next.bt);
        curX = next.bl;
        curY = next.bt;
      } else if (next.h < b.h) {
        if (curX !== b.br || curY !== b.bt) {
          pushPt(pts, b.br, b.bt);
          curX = b.br;
          curY = b.bt;
        }
        pushPt(pts, next.bl, next.bt);
        curX = next.bl;
        curY = next.bt;
      } else {
        pushPt(pts, next.bl, next.bt);
        curX = next.bl;
        curY = next.bt;
      }
    }
    if (curX !== bars[n - 1].br || curY !== bars[n - 1].bt) {
      pushPt(pts, bars[n - 1].br, bars[n - 1].bt);
    }
    return pts;
  }

  function ptsToPathD(pts) {
    return "M " + pts[0][0] + " " + pts[0][1] +
      pts.slice(1).map(function (p) { return " L " + p[0] + " " + p[1]; }).join("");
  }

  function fillPathD(pts) {
    var first = pts[0], last = pts[pts.length - 1];
    return "M " + first[0] + " " + baseY +
      pts.map(function (p) { return " L " + p[0] + " " + p[1]; }).join("") +
      " L " + last[0] + " " + baseY + " Z";
  }

  var popPts = getPathPoints(popData, 1);
  var samPts = getPathPoints(sampleData, 1);
  var popPathD = ptsToPathD(popPts);
  var samPathD = ptsToPathD(samPts);
  var popFillD = fillPathD(popPts);
  var samFillD = fillPathD(samPts);

  var _cv = useState(startAtFinal ? "merged" : "split");
  var compareView = _cv[0], setCompareView = _cv[1];
  var _sel = useState(null);
  var selectedOption = _sel[0], setSelectedOption = _sel[1];
  var _retry = useState(false);
  var retryMode = _retry[0], setRetryMode = _retry[1];
  var _locked = useState(false);
  var mcqFullyLocked = _locked[0], setMcqFullyLocked = _locked[1];
  var _anim = useState(false);
  var isAnimating = _anim[0], setIsAnimating = _anim[1];
  var _fb = useState(null);
  var mcqFeedback = _fb[0], setMcqFeedback = _fb[1];

  var animatingRef = useRef(false);
  var cmpBgRef = useRef(null);
  var cmpPopBarsRef = useRef(null);
  var cmpSamBarsRef = useRef(null);
  var cmpPopFillRef = useRef(null);
  var cmpSamFillRef = useRef(null);
  var cmpPopPathRef = useRef(null);
  var cmpSamPathRef = useRef(null);
  var cmpPopClipRef = useRef(null);
  var cmpSamClipRef = useRef(null);
  var stageRef = useRef(null);
  var leftSlideRef = useRef(null);
  var rightSlideRef = useRef(null);
  var centerRef = useRef(null);

  var correctAnswer = currentQuestion.mcqAnswer;
  var questionCount = (step7Config.questions || []).length;
  var isLastQuestion = questionIndex >= questionCount - 1;
  var isYesQuestion = correctAnswer === "Yes" || correctAnswer === "Ya";
  var pathAccentColor = isYesQuestion ? "#7CFC00" : "#ff5252";
  var pathBlinkClass = isYesQuestion ? "blink-green" : "blink-red";

  function applyStep7FinalState() {
    setCompareView("merged");
    setSelectedOption(correctAnswer);
    setRetryMode(false);
    setMcqFullyLocked(true);
    setMcqFeedback("correct");
    setIsAnimating(false);
    animatingRef.current = false;

    resetCmpAnim();

    if (leftSlideRef.current) {
      gsap.set(leftSlideRef.current, { visibility: "hidden", opacity: 0, clearProps: "x" });
    }
    if (rightSlideRef.current) {
      gsap.set(rightSlideRef.current, { visibility: "hidden", opacity: 0, clearProps: "x" });
    }
    if (centerRef.current) {
      gsap.set(centerRef.current, { visibility: "visible", opacity: 1 });
    }

    var popPath = cmpPopPathRef.current;
    var samPath = cmpSamPathRef.current;
    if (popPath) {
      gsap.set(popPath, {
        opacity: 1,
        attr: {
          stroke: pathAccentColor,
          "stroke-width": 4,
          "stroke-dashoffset": 0,
          "stroke-dasharray": "none",
        },
      });
    }
    if (samPath) {
      gsap.set(samPath, {
        opacity: 1,
        attr: {
          stroke: pathAccentColor,
          "stroke-width": 4,
          "stroke-dashoffset": 0,
          "stroke-dasharray": "none",
        },
      });
    }
    if (cmpPopFillRef.current) gsap.set(cmpPopFillRef.current, { opacity: 1 });
    if (cmpSamFillRef.current) gsap.set(cmpSamFillRef.current, { opacity: 1 });
    if (cmpPopClipRef.current) {
      gsap.set(cmpPopClipRef.current, { attr: { height: SVG_H } });
    }
    if (cmpSamClipRef.current) {
      gsap.set(cmpSamClipRef.current, { attr: { height: SVG_H } });
    }

    onUpdateQuestionText(null);
    onUpdateNavText(isLastQuestion ? step7Config.navNextLast : step7Config.navNext);
    onSetNextEnabled(true);
  }

  useEffect(function () {
    if (step !== 7) return;
    onUpdateNavText(null);

    if (startAtFinal) {
      setCompareView("merged");
      var finalTimer = setTimeout(applyStep7FinalState, 80);
      return function () { clearTimeout(finalTimer); };
    }

    setCompareView("split");
    setSelectedOption(null);
    setRetryMode(false);
    setMcqFullyLocked(false);
    setIsAnimating(false);
    setMcqFeedback(null);
    animatingRef.current = false;
    onSetNextEnabled(false);
  }, [step, questionIndex, startAtFinal]);

  function clearWrongEffects() {
    if (cmpBgRef.current) cmpBgRef.current.style.filter = "";
    if (cmpPopBarsRef.current) cmpPopBarsRef.current.style.filter = "";
    if (cmpSamBarsRef.current) cmpSamBarsRef.current.style.filter = "";
    [cmpPopPathRef, cmpSamPathRef].forEach(function (ref) {
      if (!ref.current) return;
      ref.current.classList.remove("blink-green", "blink-red");
    });
  }

  function resetCmpAnim() {
    [cmpPopFillRef, cmpSamFillRef, cmpPopPathRef, cmpSamPathRef].forEach(function (ref) {
      if (!ref.current) return;
      gsap.killTweensOf(ref.current);
      gsap.set(ref.current, { opacity: 0 });
      ref.current.classList.remove("blink-green", "blink-red");
      ref.current.removeAttribute("style");
    });
    if (cmpBgRef.current) cmpBgRef.current.removeAttribute("style");
    if (cmpPopBarsRef.current) cmpPopBarsRef.current.removeAttribute("style");
    if (cmpSamBarsRef.current) cmpSamBarsRef.current.removeAttribute("style");
    [cmpPopClipRef, cmpSamClipRef].forEach(function (ref) {
      if (!ref.current) return;
      gsap.killTweensOf(ref.current);
      gsap.set(ref.current, { attr: { height: 0 } });
    });
  }

  function runPathRevealAnimation(isWrongAnswer, done) {
    var popPath = cmpPopPathRef.current;
    var samPath = cmpSamPathRef.current;
    if (!popPath || !samPath) {
      animatingRef.current = false;
      setIsAnimating(false);
      done();
      return;
    }

    var tl = gsap.timeline();
    var popLen = popPath.getTotalLength();
    gsap.set(popPath, {
      attr: { "stroke-dasharray": popLen, "stroke-dashoffset": popLen },
      opacity: 1,
    });

    tl.to(popPath, {
      attr: { "stroke-dashoffset": 0 },
      duration: 1.2,
      ease: "none",
    });

    tl.call(function () {
      gsap.set(cmpPopFillRef.current, { opacity: 1 });
    }, null, "+=0.4");

    tl.to(cmpPopClipRef.current, {
      attr: { height: SVG_H },
      duration: 0.8,
      ease: "power2.out",
    });

    tl.call(function () {
      var samLen = samPath.getTotalLength();
      gsap.set(samPath, {
        attr: { "stroke-dasharray": samLen, "stroke-dashoffset": samLen },
        opacity: 1,
      });
    });

    tl.to(samPath, {
      attr: { "stroke-dashoffset": 0 },
      duration: 1.2,
      ease: "none",
    });

    tl.call(function () {
      gsap.set(cmpSamFillRef.current, { opacity: 1 });
    }, null, "+=0.4");

    tl.to(cmpSamClipRef.current, {
      attr: { height: SVG_H },
      duration: 0.8,
      ease: "power2.out",
    });

    tl.call(function () {
      gsap.to(popPath, { attr: { stroke: pathAccentColor, "stroke-width": 4 }, duration: 0.5 });
      gsap.to(samPath, { attr: { stroke: pathAccentColor, "stroke-width": 4 }, duration: 0.5 });
      if (isWrongAnswer) {
        if (cmpBgRef.current) {
          cmpBgRef.current.style.transition = "filter 0.6s ease";
          cmpBgRef.current.style.filter = "blur(5px)";
        }
        if (cmpPopBarsRef.current) {
          cmpPopBarsRef.current.style.transition = "filter 0.6s ease";
          cmpPopBarsRef.current.style.filter = "blur(5px)";
        }
        if (cmpSamBarsRef.current) {
          cmpSamBarsRef.current.style.transition = "filter 0.6s ease";
          cmpSamBarsRef.current.style.filter = "blur(5px)";
        }
        popPath.classList.add(pathBlinkClass);
        samPath.classList.add(pathBlinkClass);
      }
    }, null, "+=1.5");

    tl.call(function () {
      animatingRef.current = false;
      setIsAnimating(false);
      done();
    }, null, isWrongAnswer ? "+=0.8" : "+=0.5");
  }

  function animateMergeThenPaths(isWrongAnswer, done) {
    animatingRef.current = true;
    setIsAnimating(true);
    onUpdateNavText(" ");
    resetCmpAnim();

    function startMergeAnim() {
      var stage = stageRef.current;
      var left = leftSlideRef.current;
      var right = rightSlideRef.current;
      var center = centerRef.current;

      if (!stage || !left || !right || !center) {
        setCompareView("merged");
        runPathRevealAnimation(isWrongAnswer, done);
        return;
      }

      gsap.killTweensOf([left, right, center]);
      gsap.set(left, { x: 0, opacity: 1, visibility: "visible" });
      gsap.set(right, { x: 0, opacity: 1, visibility: "visible" });
      gsap.set(center, { opacity: 0, visibility: "hidden" });

      var stageRect = stage.getBoundingClientRect();
      var leftRect = left.getBoundingClientRect();
      var rightRect = right.getBoundingClientRect();
      var stageCx = stageRect.left + stageRect.width / 2;
      var leftDx = stageCx - (leftRect.left + leftRect.width / 2);
      var rightDx = stageCx - (rightRect.left + rightRect.width / 2);

      var leftHeading = left.querySelector(".graph-heading");
      var rightHeading = right.querySelector(".graph-heading");

      var mergeTl = gsap.timeline();

      mergeTl.to(left, {
        x: leftDx,
        duration: 1,
        ease: "power2.inOut",
      }, 0);

      mergeTl.to(right, {
        x: rightDx,
        duration: 1,
        ease: "power2.inOut",
      }, 0);

      if (leftHeading && rightHeading) {
        mergeTl.to([leftHeading, rightHeading], {
          opacity: 0,
          duration: 0.4,
          ease: "power2.in",
        }, 0.4);
      }

      mergeTl.to([left, right], {
        opacity: 0,
        duration: 0.4,
        ease: "power2.in",
        onComplete: function () {
          gsap.set([left, right], { visibility: "hidden" });
        },
      }, 1);

      mergeTl.set(center, { visibility: "visible" }, 1.05);
      mergeTl.to(center, {
        opacity: 1,
        duration: 0.55,
        ease: "power2.out",
      }, 1.05);

      mergeTl.call(function () {
        runPathRevealAnimation(isWrongAnswer, function () {
          gsap.set(left, { clearProps: "all" });
          gsap.set(right, { clearProps: "all" });
          setCompareView("merged");
          done();
        });
      });
    }

    setTimeout(startMergeAnim, 120);
  }

  function runCompareAnimation(isWrongAnswer, done) {
    animateMergeThenPaths(isWrongAnswer, done);
  }

  function finishCorrect() {
    setMcqFullyLocked(true);
    onUpdateNavText(isLastQuestion ? step7Config.navNextLast : step7Config.navNext);
    onSetNextEnabled(true);
  }

  function handleMcq(option) {
    if (animatingRef.current || mcqFullyLocked) return;
    if (retryMode && option !== correctAnswer) return;

    if (typeof playSound === "function") playSound("click");
    setSelectedOption(option);

    if (retryMode && option === correctAnswer) {
      if (typeof playSound === "function") playSound("correct");
      clearWrongEffects();
      setMcqFeedback("correct");
      finishCorrect();
      return;
    }

    if (option === correctAnswer) {
      if (typeof playSound === "function") playSound("correct");
      runCompareAnimation(false, function () {
        setMcqFeedback("correct");
        finishCorrect();
      });
      return;
    }

    if (typeof playSound === "function") playSound("wrong");
    runCompareAnimation(true, function () {
      setRetryMode(true);
      setMcqFeedback("wrong");
      onUpdateNavText(step7Config.navText);
    });
  }

  function renderAxesChildren() {
    var items = [];
    items.push(e("line", { key: "ya", x1: ML, y1: yP(YMAX), x2: ML, y2: baseY, stroke: "white", strokeWidth: 1.5 }));
    items.push(e("line", { key: "xa", x1: ML, y1: baseY, x2: ML + pW, y2: baseY, stroke: "white", strokeWidth: 1.5 }));
    for (var yv = 0; yv <= YMAX; yv += 10) {
      var yy = yP(yv);
      items.push(e("text", {
        key: "yl" + yv, x: ML - 18, y: yy + 5,
        textAnchor: "end", fill: "#f0a030", fontSize: AXIS_LABEL_SIZE, fontWeight: 600,
      }, yv));
      items.push(e("line", {
        key: "yt" + yv, x1: ML - 8, y1: yy, x2: ML, y2: yy,
        stroke: "white", strokeWidth: Y_TICK_STROKE,
      }));
    }
    for (var xv = 1; xv <= 21; xv++) {
      items.push(e("text", {
        key: "xl" + xv, x: xP(xv), y: baseY + 22,
        textAnchor: "middle", fill: "#f0a030", fontSize: AXIS_LABEL_SIZE, fontWeight: 600,
      }, xv));
    }
    return items;
  }

  function renderBars(data, color, barsRef) {
    return data.map(function (d, i) {
      return e("rect", {
        key: "b" + i,
        x: xP(d.x) - barW / 2,
        y: yP(d.y),
        width: barW,
        height: d.y * ySc,
        fill: color,
      });
    });
  }

  function renderChartSVG(opts) {
    var showOverlay = opts.showOverlay;
    var id = opts.idSuffix || "school";

    var ch = [];
    ch.push(e("defs", { key: "defs" },
      e("clipPath", { id: "cmp-pop-clip-" + id },
        e("rect", { ref: cmpPopClipRef, x: 0, y: 0, width: SVG_W, height: 0 })
      ),
      e("clipPath", { id: "cmp-sam-clip-" + id },
        e("rect", { ref: cmpSamClipRef, x: 0, y: 0, width: SVG_W, height: 0 })
      )
    ));

    var bgKids = renderAxesChildren();
    bgKids.push(e("rect", {
      key: "underlay",
      x: ML - 8, y: MT - 4,
      width: pW + 16, height: baseY - MT + 14,
      fill: "rgba(12, 22, 48, 0.22)", rx: 10, opacity: 0.9,
    }));
    ch.push(e("g", { key: "bg", ref: showOverlay ? cmpBgRef : null }, bgKids));

    if (showOverlay) {
      /* Layer order: pop fill/bars, then sample fill/bars on top so pink never shows through blue */
      ch.push(e("path", {
        key: "pf", ref: cmpPopFillRef,
        d: popFillD, fill: "rgba(100,25,80,0.7)",
        opacity: 0, clipPath: "url(#cmp-pop-clip-" + id + ")",
      }));
      ch.push(e("g", { key: "pop-bars", ref: cmpPopBarsRef }, renderBars(popData, popConfig.barColor || "#e85a8a")));
      ch.push(e("path", {
        key: "sf", ref: cmpSamFillRef,
        d: samFillD, fill: "rgba(91,155,213,0.7)",
        opacity: 0, clipPath: "url(#cmp-sam-clip-" + id + ")",
      }));
      ch.push(e("g", { key: "sam-bars", ref: cmpSamBarsRef }, renderBars(sampleData, sampleBarColor)));
      ch.push(e("path", {
        key: "pp", ref: cmpPopPathRef,
        d: popPathD, fill: "none",
        stroke: "rgba(220,180,230,0.9)", strokeWidth: 2.5, opacity: 0,
      }));
      ch.push(e("path", {
        key: "sp", ref: cmpSamPathRef,
        d: samPathD, fill: "none",
        stroke: "rgba(180,210,240,0.9)", strokeWidth: 2.5, opacity: 0,
      }));
    } else {
      ch.push.apply(ch, renderBars(opts.data, opts.color));
    }

    return e("svg", {
      viewBox: "0 0 " + SVG_W + " " + SVG_H,
      className: "bar-graph-svg",
      preserveAspectRatio: "xMidYMid meet",
    }, ch);
  }

  function renderSlideChart(data, color, heading) {
    var ch = renderAxesChildren();
    ch.push.apply(ch, renderBars(data, color));
    return e("div", { className: "compare-panel" },
      e("div", { className: "graph-heading" }, heading),
      e("div", { className: "graph-wrapper compare-graph" },
        e("svg", {
          viewBox: "0 0 " + SVG_W + " " + SVG_H,
          className: "bar-graph-svg",
          preserveAspectRatio: "xMidYMid meet",
        }, ch)
      )
    );
  }

  function renderMergedCenter() {
    return e("div", { className: "compare-center", ref: centerRef },
      e("div", { className: "graph-heading compare-heading-spacer", "aria-hidden": true }, "\u00a0"),
      e("div", { className: "graph-wrapper compare-graph" },
        renderChartSVG({ showOverlay: true, idSuffix: "merged-" + questionIndex })
      )
    );
  }

  function renderCompareStage() {
    var stageClass = "compare-stage";
    if (compareView === "merged" || startAtFinal) {
      stageClass += " compare-stage--merged";
    }
    if (startAtFinal) {
      stageClass += " compare-stage--final-only";
    }

    if (startAtFinal) {
      return e("div", { className: stageClass, ref: stageRef },
        renderMergedCenter()
      );
    }

    return e("div", { className: stageClass, ref: stageRef },
      e("div", { className: "compare-slide compare-slide-left", ref: leftSlideRef },
        renderSlideChart(popData, popConfig.barColor || "#e85a8a", popConfig.populationHeading)
      ),
      e("div", { className: "compare-slide compare-slide-right", ref: rightSlideRef },
        renderSlideChart(sampleData, sampleBarColor, sampleHeading)
      ),
      renderMergedCenter()
    );
  }

  if (step === 6) {
    return e("div", { className: "main-canvas-container" },
      e("div", { className: "visual-row" },
        e("div", { className: "graph-heading" }, popConfig.populationHeading),
        e("div", { className: "graph-wrapper" },
          renderChartSVG({
            data: popData,
            color: popConfig.barColor || "#e85a8a",
            showOverlay: false,
          })
        )
      ),
      e("div", { className: "action-row-container" })
    );
  }

  var opt0 = stepCopy.mcqOptions[0];
  var opt1 = stepCopy.mcqOptions[1];

  function btnClass(opt) {
    var cls = "mcq-btn";
    if (selectedOption === opt) {
      if (opt === correctAnswer) cls += " correct";
      else cls += " wrong";
    }
    if (retryMode && opt !== correctAnswer) cls += " wrong";
    if (mcqFullyLocked) cls += " disabled";
    if (isAnimating) cls += " disabled";
    return cls;
  }

  function btnDisabled(opt) {
    if (isAnimating || mcqFullyLocked) return true;
    if (retryMode && opt !== correctAnswer) return true;
    return false;
  }

  var visualContent = renderCompareStage();
  var feedbackEl = null;
  if (mcqFeedback === "correct") {
    feedbackEl = e("div", { className: "compare-mcq-feedback correct" }, currentQuestion.feedbackCorrect);
  } else if (mcqFeedback === "wrong") {
    feedbackEl = e("div", { className: "compare-mcq-feedback wrong" }, currentQuestion.feedbackWrong);
  }

  return e("div", { className: "main-canvas-container" },
    e("div", { className: "visual-row visual-row--step7" },
      visualContent,
      feedbackEl
    ),
    e("div", { className: "action-row-container has-content" },
      e("div", { className: "mcq-action-row" },
        e("div", { className: "mcq-title" }, stepCopy.mcqTitle),
        e("div", { className: "mcq-buttons" },
          e("button", {
            className: btnClass(opt0),
            disabled: btnDisabled(opt0),
            onClick: btnDisabled(opt0) ? undefined : function () { handleMcq(opt0); },
          }, opt0),
          e("button", {
            className: btnClass(opt1),
            disabled: btnDisabled(opt1),
            onClick: btnDisabled(opt1) ? undefined : function () { handleMcq(opt1); },
          }, opt1)
        )
      )
    )
  );
}

const MainCanvas = (props) => {
  if (props.step === 6 || props.step === 7) {
    return SchoolCompareCanvas({
      step: props.step,
      questionIndex: props.questionIndex,
      startAtFinal: props.startAtFinal,
      onSetNextEnabled: props.onSetNextEnabled,
      onUpdateNavText: props.onUpdateNavText,
      onUpdateQuestionText: props.onUpdateQuestionText,
    });
  }

  const { step, startAtFinal, onSetNextEnabled, onUpdateNavText, onUpdateQuestionText } = props;
  const { useState, useEffect, useRef } = React;
  const e = React.createElement;

  function getGraphIndex(s) {
    return s <= 2 ? 0 : 1;
  }

  var graphIndex = getGraphIndex(step);
  var graphConfig = APP_DATA.graphs[graphIndex];
  var graphData = graphConfig.graphData;
  var xRange = graphConfig.xRange;
  var yRange = graphConfig.yRange;
  var stepCopy = APP_DATA.steps[step] || {};

  var SVG_W = 760, SVG_H = 440;
  var ML = graphIndex === 0 ? 60 : 58;
  var MR = graphIndex === 0 ? 100 : 88;
  var MT = 10, MB = 30;
  var XMIN = xRange.min;
  var XMAX = xRange.max;
  var YMAX = yRange.max;
  var xSpan = XMAX - XMIN;
  var pW = SVG_W - ML - MR;
  var pH = SVG_H - MT - MB;
  var xSc = pW / xSpan;
  var ySc = pH / YMAX;
  var xLabelStep = xRange.step;
  var yLabelStep = yRange.step;
  var xLabelFrom = xRange.labelFrom != null ? xRange.labelFrom : XMIN;
  var xLabelTo = xRange.labelTo != null ? xRange.labelTo : XMAX;
  var barW = graphIndex === 0
    ? Math.round(xSc * 0.6)
    : Math.round(xLabelStep * xSc * 0.52);

  function xP(x) { return ML + (x - XMIN) * xSc; }
  function yP(y) { return MT + (YMAX - y) * ySc; }
  var baseY = yP(0);

  function getPathPoints(scale) {
    var n = graphData.length;
    if (n === 0) return [];

    var bars = graphData.map(function (d) {
      return {
        bl: xP(d.x) - barW / 2,
        br: xP(d.x) + barW / 2,
        bt: yP(d.y * scale),
        h: d.y * scale,
      };
    });

    function pushPt(pts, x, y) {
      var last = pts[pts.length - 1];
      if (!last || last[0] !== x || last[1] !== y) {
        pts.push([x, y]);
      }
    }

    var pts = [];
    var curX = bars[0].bl;
    var curY = bars[0].bt;
    pushPt(pts, curX, curY);

    for (var i = 0; i < n - 1; i++) {
      var b = bars[i];
      var next = bars[i + 1];

      if (next.h > b.h) {
        /* Rising: must land on left top of next bar (start corner on current bar is free) */
        pushPt(pts, next.bl, next.bt);
        curX = next.bl;
        curY = next.bt;
      } else if (next.h < b.h) {
        /* Falling: must leave from right top of current bar (landing corner on next bar is free) */
        if (curX !== b.br || curY !== b.bt) {
          pushPt(pts, b.br, b.bt);
          curX = b.br;
          curY = b.bt;
        }
        pushPt(pts, next.bl, next.bt);
        curX = next.bl;
        curY = next.bt;
      } else {
        pushPt(pts, next.bl, next.bt);
        curX = next.bl;
        curY = next.bt;
      }
    }

    /* End at right top of rightmost bar */
    var lastBar = bars[n - 1];
    if (curX !== lastBar.br || curY !== lastBar.bt) {
      pushPt(pts, lastBar.br, lastBar.bt);
    }

    return pts;
  }

  function ptsToPathD(pts) {
    return "M " + pts[0][0] + " " + pts[0][1] +
      pts.slice(1).map(function (p) { return " L " + p[0] + " " + p[1]; }).join("");
  }

  function fillPathD(pts) {
    var first = pts[0], last = pts[pts.length - 1];
    return "M " + first[0] + " " + baseY +
      pts.map(function (p) { return " L " + p[0] + " " + p[1]; }).join("") +
      " L " + last[0] + " " + baseY + " Z";
  }

  var popPts = getPathPoints(1);
  var samPts = getPathPoints(1 / 3);
  var popPathD = ptsToPathD(popPts);
  var samPathD = ptsToPathD(samPts);
  var popFillD = fillPathD(popPts);
  var samFillD = fillPathD(samPts);

  var popClipId = "pop-clip-" + graphIndex;
  var samClipId = "sam-clip-" + graphIndex;
  var arrowMarkerId = "sample-arrowhead-" + graphIndex;

  var _ap = useState("none");
  var actionPhase = _ap[0], setActionPhase = _ap[1];
  var _dpe = useState(true);
  var drawPopEnabled = _dpe[0], setDrawPopEnabled = _dpe[1];
  var _dse = useState(false);
  var drawSampleEnabled = _dse[0], setDrawSampleEnabled = _dse[1];

  var ghostGRef = useRef(null);
  var barRefs = useRef([]);
  var barsGRef = useRef(null);
  var popFillRef = useRef(null);
  var samFillRef = useRef(null);
  var popPathRef = useRef(null);
  var samPathRef = useRef(null);
  var popClipRef = useRef(null);
  var samClipRef = useRef(null);
  var sampleLabelGRef = useRef(null);
  var backgroundGRef = useRef(null);
  var actionContentRef = useRef(null);
  var shrinkBtnRef = useRef(null);
  var drawPopBtnRef = useRef(null);
  var drawSampleBtnRef = useRef(null);
  var animatingRef = useRef(false);
  var _aa = useState(false);
  var isActionAnimating = _aa[0], setIsActionAnimating = _aa[1];
  var _snr = useState(false);
  var shrinkNudgeReady = _snr[0], setShrinkNudgeReady = _snr[1];

  var AXIS_LABEL_SIZE = graphIndex === 0 ? 21 : 17;
  var SAMPLE_LABEL_SIZE = 33;
  var Y_TICK_STROKE = 2.5;

  function resetSVG() {
    graphData.forEach(function (d, i) {
      var bar = barRefs.current[i];
      if (!bar) return;
      gsap.killTweensOf(bar);
      gsap.set(bar, { attr: { y: yP(d.y), height: d.y * ySc } });
      bar.classList.remove("bar-glow");
      bar.removeAttribute("filter");
    });

    [ghostGRef, popFillRef, samFillRef, popPathRef, samPathRef, sampleLabelGRef].forEach(function (ref) {
      if (!ref.current) return;
      gsap.killTweensOf(ref.current);
      gsap.set(ref.current, { opacity: 0 });
    });

    if (popPathRef.current) {
      popPathRef.current.classList.remove("blink-green");
      popPathRef.current.removeAttribute("style");
    }
    if (samPathRef.current) {
      samPathRef.current.classList.remove("blink-green");
      samPathRef.current.removeAttribute("style");
    }
    if (popFillRef.current) popFillRef.current.removeAttribute("style");
    if (samFillRef.current) samFillRef.current.removeAttribute("style");

    if (backgroundGRef.current) backgroundGRef.current.removeAttribute("style");
    if (barsGRef.current) barsGRef.current.removeAttribute("style");

    [popClipRef, samClipRef].forEach(function (ref) {
      if (!ref.current) return;
      gsap.killTweensOf(ref.current);
      gsap.set(ref.current, { attr: { height: 0 } });
    });

    animatingRef.current = false;
  }

  function applyGraphFinalStage() {
    resetSVG();

    graphData.forEach(function (d, i) {
      var bar = barRefs.current[i];
      if (!bar) return;
      gsap.set(bar, {
        attr: { y: yP(d.y / 3), height: (d.y / 3) * ySc },
      });
    });

    if (ghostGRef.current) gsap.set(ghostGRef.current, { opacity: 1 });
    if (sampleLabelGRef.current) gsap.set(sampleLabelGRef.current, { opacity: 0 });

    if (popPathRef.current) {
      gsap.set(popPathRef.current, {
        opacity: 1,
        attr: {
          stroke: "#7CFC00",
          "stroke-width": 4,
          "stroke-dashoffset": 0,
          "stroke-dasharray": "none",
        },
      });
      popPathRef.current.classList.add("blink-green");
    }
    if (samPathRef.current) {
      gsap.set(samPathRef.current, {
        opacity: 1,
        attr: {
          stroke: "#7CFC00",
          "stroke-width": 4,
          "stroke-dashoffset": 0,
          "stroke-dasharray": "none",
        },
      });
      samPathRef.current.classList.add("blink-green");
    }
    if (popFillRef.current) gsap.set(popFillRef.current, { opacity: 1 });
    if (samFillRef.current) gsap.set(samFillRef.current, { opacity: 1 });
    if (popClipRef.current) gsap.set(popClipRef.current, { attr: { height: SVG_H } });
    if (samClipRef.current) gsap.set(samClipRef.current, { attr: { height: SVG_H } });

    if (backgroundGRef.current) {
      backgroundGRef.current.style.filter = "blur(5px)";
    }
    if (barsGRef.current) {
      barsGRef.current.style.filter = "blur(5px)";
    }

    setDrawPopEnabled(false);
    setDrawSampleEnabled(false);
    setActionPhase("conclusion");
    onUpdateQuestionText(stepCopy.afterSampleShapeQuestion);
    onUpdateNavText(stepCopy.conclusionNav);
    onSetNextEnabled(true);
  }

  useEffect(function () {
    resetSVG();
    setIsActionAnimating(false);

    if (startAtFinal) {
      if (step === 1 || step === 3 || step === 6) {
        setActionPhase("none");
        setDrawPopEnabled(true);
        setDrawSampleEnabled(false);
        onUpdateQuestionText(null);
        onUpdateNavText(stepCopy.navText);
        onSetNextEnabled(true);
        return;
      }
      if (step === 2 || step === 4) {
        setActionPhase("none");
        setDrawPopEnabled(true);
        setDrawSampleEnabled(false);
        var finalTimer = setTimeout(applyGraphFinalStage, 120);
        return function () { clearTimeout(finalTimer); };
      }
      return;
    }

    if (step === 1 || step === 3) {
      setActionPhase("none");
      setDrawPopEnabled(true);
      setDrawSampleEnabled(false);
    }
    if (step === 2 || step === 4) {
      setActionPhase("none");
      setDrawPopEnabled(true);
      setDrawSampleEnabled(false);
      setTimeout(function () { setActionPhase("shrink"); }, 250);
    }
  }, [step, startAtFinal]);

  useEffect(function () {
    if ((step !== 2 && step !== 4) || actionPhase !== "shrink" || startAtFinal) {
      setShrinkNudgeReady(false);
      return;
    }
    setShrinkNudgeReady(false);
    var timer = setTimeout(function () {
      setShrinkNudgeReady(true);
    }, 1000);
    return function () {
      clearTimeout(timer);
    };
  }, [step, actionPhase, startAtFinal]);

  function getActionNudgeRef() {
    if (step !== 2 && step !== 4) return null;
    if (startAtFinal || isActionAnimating) return null;
    if (actionPhase === "shrink") {
      if (!shrinkNudgeReady) return null;
      return shrinkBtnRef;
    }
    if (actionPhase === "draw") {
      if (drawPopEnabled) return drawPopBtnRef;
      if (drawSampleEnabled) return drawSampleBtnRef;
    }
    return null;
  }

  function handleShrink() {
    if (animatingRef.current) return;
    animatingRef.current = true;
    setIsActionAnimating(true);
    if (typeof playSound === "function") playSound("click");
    onUpdateNavText(" ");

    var el = actionContentRef.current;
    if (el) gsap.to(el, { opacity: 0, y: 10, duration: 0.3 });

    var tl = gsap.timeline();

    tl.to(ghostGRef.current, { opacity: 1, duration: 0.4 }, 0);

    graphData.forEach(function (d, i) {
      var bar = barRefs.current[i];
      if (!bar) return;
      tl.to(bar, {
        attr: { y: yP(d.y / 3), height: (d.y / 3) * ySc },
        duration: 0.8,
        ease: "power2.inOut",
      }, 0.2);
    });

    tl.call(function () {
      graphData.forEach(function (d, i) {
        var bar = barRefs.current[i];
        if (bar) bar.classList.add("bar-glow");
      });
    });

    if (sampleLabelGRef.current) {
      tl.to(sampleLabelGRef.current, { opacity: 1, duration: 0.5 });
    }

    tl.call(function () {
      animatingRef.current = false;
      setIsActionAnimating(false);
      setActionPhase("draw");
      setDrawPopEnabled(true);
      setDrawSampleEnabled(false);
      onUpdateQuestionText(stepCopy.afterShrinkQuestion);
      onUpdateNavText(stepCopy.afterShrinkNav);
    }, null, "+=0.3");
  }

  function handleDrawPopulation() {
    if (animatingRef.current) return;
    animatingRef.current = true;
    setIsActionAnimating(true);
    if (typeof playSound === "function") playSound("click");
    setDrawPopEnabled(false);
    onUpdateNavText(" ");

    if (sampleLabelGRef.current) {
      gsap.to(sampleLabelGRef.current, { opacity: 0, duration: 0.3 });
    }

    graphData.forEach(function (d, i) {
      var bar = barRefs.current[i];
      if (bar) bar.classList.remove("bar-glow");
    });

    var pathEl = popPathRef.current;
    if (!pathEl) return;

    setTimeout(function () {
      var len = pathEl.getTotalLength();
      gsap.set(pathEl, {
        attr: { "stroke-dasharray": len, "stroke-dashoffset": len },
        opacity: 1,
      });

      var tl = gsap.timeline();

      tl.to(pathEl, {
        attr: { "stroke-dashoffset": 0 },
        duration: 1.2,
        ease: "none",
      });

      tl.call(function () {
        gsap.set(popFillRef.current, { opacity: 1 });
      }, null, "+=0.4");

      tl.to(popClipRef.current, {
        attr: { height: SVG_H },
        duration: 0.8,
        ease: "power2.out",
      });

      tl.call(function () {
        animatingRef.current = false;
        setIsActionAnimating(false);
        onUpdateQuestionText(stepCopy.afterPopulationShapeQuestion);
        onUpdateNavText(stepCopy.afterPopulationShapeNav || stepCopy.afterShrinkNav);
        setDrawSampleEnabled(true);
      });
    }, 300);
  }

  function handleDrawSample() {
    if (animatingRef.current) return;
    animatingRef.current = true;
    setIsActionAnimating(true);
    if (typeof playSound === "function") playSound("click");
    setDrawSampleEnabled(false);
    onUpdateNavText(" ");

    var pathEl = samPathRef.current;
    if (!pathEl) return;

    var len = pathEl.getTotalLength();
    gsap.set(pathEl, {
      attr: { "stroke-dasharray": len, "stroke-dashoffset": len },
      opacity: 1,
    });

    var tl = gsap.timeline();

    tl.to(pathEl, {
      attr: { "stroke-dashoffset": 0 },
      duration: 1.2,
      ease: "none",
    });

    tl.call(function () {
      gsap.set(samFillRef.current, { opacity: 1 });
    }, null, "+=0.4");

    tl.to(samClipRef.current, {
      attr: { height: SVG_H },
      duration: 0.8,
      ease: "power2.out",
    });

    tl.call(function () {
      onUpdateQuestionText(stepCopy.afterSampleShapeQuestion);
    });

    tl.call(function () {
      if (backgroundGRef.current) {
        backgroundGRef.current.style.transition = "filter 0.6s ease";
        backgroundGRef.current.style.filter = "blur(5px)";
      }
      if (barsGRef.current) {
        barsGRef.current.style.transition = "filter 0.6s ease";
        barsGRef.current.style.filter = "blur(5px)";
      }
      if (popFillRef.current) popFillRef.current.style.filter = "none";
      if (samFillRef.current) samFillRef.current.style.filter = "none";

      gsap.to(popPathRef.current, {
        attr: { stroke: "#7CFC00", "stroke-width": 4 },
        duration: 0.5,
      });
      gsap.to(samPathRef.current, {
        attr: { stroke: "#7CFC00", "stroke-width": 4 },
        duration: 0.5,
      });

      popPathRef.current.classList.add("blink-green");
      samPathRef.current.classList.add("blink-green");
    }, null, "+=1.5");

    tl.call(function () {
      animatingRef.current = false;
      setIsActionAnimating(false);

      var el = actionContentRef.current;
      if (el) {
        gsap.to(el, {
          opacity: 0, y: 10, duration: 0.3,
          onComplete: function () {
            setActionPhase("conclusion");
            onUpdateNavText(stepCopy.conclusionNav);
            onSetNextEnabled(true);
          },
        });
      } else {
        setActionPhase("conclusion");
        onUpdateNavText(stepCopy.conclusionNav);
        onSetNextEnabled(true);
      }
    }, null, "+=0.8");
  }

  function renderSVG() {
    var ch = [];
    var bgChildren = [];
    var barsChildren = [];

    ch.push(e("defs", { key: "defs" },
      e("clipPath", { id: popClipId },
        e("rect", { ref: popClipRef, x: 0, y: 0, width: SVG_W, height: 0 })
      ),
      e("clipPath", { id: samClipId },
        e("rect", { ref: samClipRef, x: 0, y: 0, width: SVG_W, height: 0 })
      ),
      e("marker", {
        id: arrowMarkerId,
        markerWidth: 10,
        markerHeight: 10,
        refX: 10,
        refY: 5,
        orient: "auto",
        markerUnits: "strokeWidth",
      },
        e("path", { d: "M0,0 L10,5 L0,10 Z", fill: "#ff69b4" })
      )
    ));

    bgChildren.push(e("line", { key: "ya", x1: ML, y1: yP(YMAX), x2: ML, y2: baseY, stroke: "white", strokeWidth: 1.5 }));
    bgChildren.push(e("line", { key: "xa", x1: ML, y1: baseY, x2: ML + pW, y2: baseY, stroke: "white", strokeWidth: 1.5 }));

    bgChildren.push(e("rect", {
      key: "blur-underlay",
      x: ML - 10,
      y: MT - 6,
      width: pW + 26,
      height: baseY - MT + 18,
      fill: "rgba(12, 22, 48, 0.22)",
      rx: 14,
      opacity: 0.9,
    }));

    for (var yv = 0; yv <= YMAX; yv += yLabelStep) {
      var yy = yP(yv);
      bgChildren.push(e("text", {
        key: "yl" + yv, x: ML - 20, y: yy + 6,
        textAnchor: "end", fill: "#f0a030", fontSize: AXIS_LABEL_SIZE, fontWeight: 600,
      }, yv));
      bgChildren.push(e("line", {
        key: "yt" + yv, x1: ML - 8, y1: yy, x2: ML, y2: yy,
        stroke: "white", strokeWidth: Y_TICK_STROKE,
      }));
    }

    for (var xv = xLabelFrom; xv <= xLabelTo; xv += xLabelStep) {
      bgChildren.push(e("text", {
        key: "xl" + xv, x: xP(xv), y: baseY + 26,
        textAnchor: "middle", fill: "#f0a030", fontSize: AXIS_LABEL_SIZE, fontWeight: 600,
      }, xv));
    }

    var ghosts = graphData.map(function (d, i) {
      return e("rect", {
        key: "g" + i,
        x: xP(d.x) - barW / 2, y: yP(d.y), width: barW, height: d.y * ySc,
        fill: "rgba(90,40,72,0.45)",
      });
    });
    bgChildren.push(e("g", { key: "ghosts", ref: ghostGRef, opacity: 0 }, ghosts));

    var lastD = graphData[graphData.length - 1];
    var barRight = xP(lastD.x) + barW / 2;
    var labelGap = graphIndex === 0 ? 48 : 36;
    var lx = barRight + labelGap + 8;
    var ly = yP(lastD.y / 3) - 52;
    var asx = lx - 6;
    var asy = ly + 14;
    var aex = barRight + 24;
    var aey = yP(lastD.y / 3) - 4;

    bgChildren.push(e("g", { key: "slg", ref: sampleLabelGRef, opacity: 0 },
      e("text", {
        x: lx, y: ly,
        fill: "#ff69b4", fontSize: SAMPLE_LABEL_SIZE, fontWeight: 700, fontStyle: "italic",
      }, APP_DATA.sampleLabel),
      e("path", {
        d: "M " + asx + " " + asy + " L " + aex + " " + aey,
        fill: "none", stroke: "#ff69b4", strokeWidth: 2.5,
        markerEnd: "url(#" + arrowMarkerId + ")",
      })
    ));

    ch.push(e("g", { key: "bg-layer", ref: backgroundGRef }, bgChildren));

    ch.push(e("path", {
      key: "pf", ref: popFillRef,
      d: popFillD, fill: "rgba(100,25,80,0.7)",
      opacity: 0, clipPath: "url(#" + popClipId + ")",
    }));

    ch.push(e("path", {
      key: "sf", ref: samFillRef,
      d: samFillD, fill: "rgba(255,105,180,0.7)",
      opacity: 0, clipPath: "url(#" + samClipId + ")",
    }));

    graphData.forEach(function (d, i) {
      barsChildren.push(e("rect", {
        key: "b" + i,
        ref: function (el) { barRefs.current[i] = el; },
        x: xP(d.x) - barW / 2, y: yP(d.y), width: barW, height: d.y * ySc,
        fill: "#ff69b4",
      }));
    });
    ch.push(e("g", { key: "bars-layer", ref: barsGRef }, barsChildren));

    ch.push(e("path", {
      key: "pp", ref: popPathRef,
      d: popPathD, fill: "none",
      stroke: "rgba(220,180,230,0.9)", strokeWidth: 2.5, opacity: 0,
    }));

    ch.push(e("path", {
      key: "sp", ref: samPathRef,
      d: samPathD, fill: "none",
      stroke: "rgba(255,180,210,0.9)", strokeWidth: 2.5, opacity: 0,
    }));

    return e("svg", {
      key: "graph-" + graphIndex,
      viewBox: "0 0 " + SVG_W + " " + SVG_H,
      className: "bar-graph-svg",
      preserveAspectRatio: "xMidYMid meet",
    }, ch);
  }

  function renderActionContent() {
    if (actionPhase === "shrink") {
      return e("div", {
        key: "ac-shrink", className: "action-content", ref: actionContentRef,
      },
        e("button", {
          ref: shrinkBtnRef,
          className: "action-btn shrink-btn",
          onClick: handleShrink,
        }, stepCopy.shrinkButtonText)
      );
    }

    if (actionPhase === "draw") {
      return e("div", {
        key: "ac-draw", className: "action-content", ref: actionContentRef,
      },
        e("button", {
          ref: drawPopBtnRef,
          className: "action-btn draw-pop-btn",
          onClick: drawPopEnabled ? handleDrawPopulation : undefined,
          disabled: !drawPopEnabled,
        }, stepCopy.drawPopulationButtonText),
        e("button", {
          ref: drawSampleBtnRef,
          className: "action-btn draw-sample-btn",
          onClick: drawSampleEnabled ? handleDrawSample : undefined,
          disabled: !drawSampleEnabled,
        }, stepCopy.drawSampleButtonText)
      );
    }

    if (actionPhase === "conclusion") {
      return e("div", {
        key: "ac-conc", className: "action-content", ref: actionContentRef,
      },
        e("div", { className: "conclusion-text-box" }, stepCopy.conclusionText)
      );
    }

    return null;
  }

  var hasContent = actionPhase !== "none";
  var actionNudgeRef = getActionNudgeRef();
  var actionNudgeKey = actionPhase +
    (actionPhase === "shrink" ? (shrinkNudgeReady ? "-ready" : "-wait") : "") +
    (drawPopEnabled ? "-pop" : drawSampleEnabled ? "-sample" : "");

  return e("div", { className: "main-canvas-container" },
    e("div", { className: "visual-row" },
      e("div", { className: "graph-heading" }, graphConfig.populationHeading),
      e("div", { className: "graph-wrapper" }, renderSVG())
    ),
    e("div", {
      className: "action-row-container" + (hasContent ? " has-content" : ""),
    }, renderActionContent()),
    actionNudgeRef
      ? e(Nudge, {
          key: "action-nudge-" + actionNudgeKey,
          targetRef: actionNudgeRef,
          active: true,
        })
      : null
  );
};
