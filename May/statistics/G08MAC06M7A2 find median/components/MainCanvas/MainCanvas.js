var MainCanvas = function (props) {
  var step = props.step;
  var onSetNextEnabled = props.onSetNextEnabled;
  var onUpdateNavText = props.onUpdateNavText;
  var onUpdateQuestionText = props.onUpdateQuestionText;
  var useState = React.useState;
  var useEffect = React.useEffect;
  var useRef = React.useRef;
  var useCallback = React.useCallback;
  var e = React.createElement;

  var S1 = APP_DATA.steps[1];
  var S2 = APP_DATA.steps[2];
  var dataset = APP_DATA.dataset;
  var sortedDataset = APP_DATA.sortedDataset;
  var sortMapping = APP_DATA.sortMapping;
  var fullDataset = APP_DATA.fullDataset;
  var N = dataset.length;
  var MID_IDX = Math.floor(N / 2);
  var MID_POS = MID_IDX + 1;

  /* ───── state ───── */
  var _phase = useState(0);
  var phase = _phase[0];
  var setPhase = _phase[1];
  var _displayData = useState(dataset.slice());
  var displayData = _displayData[0];
  var setDisplayData = _displayData[1];
  var _crossed = useState([]);
  var crossed = _crossed[0];
  var setCrossed = _crossed[1];
  var _showBadges = useState(false);
  var showBadges = _showBadges[0];
  var setShowBadges = _showBadges[1];
  var _badgeCount = useState(0);
  var badgeCount = _badgeCount[0];
  var setBadgeCount = _badgeCount[1];
  var _dimCircles = useState(false);
  var dimCircles = _dimCircles[0];
  var setDimCircles = _dimCircles[1];
  var _showMedianCallout = useState(false);
  var showMedianCallout = _showMedianCallout[0];
  var setShowMedianCallout = _showMedianCallout[1];
  var _showCountCallouts = useState(false);
  var showCountCallouts = _showCountCallouts[0];
  var setShowCountCallouts = _showCountCallouts[1];
  var _showFormula = useState(false);
  var showFormula = _showFormula[0];
  var setShowFormula = _showFormula[1];
  var _showFormulaText = useState(false);
  var showFormulaText = _showFormulaText[0];
  var setShowFormulaText = _showFormulaText[1];
  var _showFormulaExpr = useState(false);
  var showFormulaExpr = _showFormulaExpr[0];
  var setShowFormulaExpr = _showFormulaExpr[1];
  var _btnState = useState("visible");
  var btnState = _btnState[0];
  var setBtnState = _btnState[1];
  var _btnText = useState("");
  var btnText = _btnText[0];
  var setBtnText = _btnText[1];
  var _sliderVal = useState(7);
  var sliderVal = _sliderVal[0];
  var setSliderVal = _sliderVal[1];
  var _seenValues = useState({});
  var seenValues = _seenValues[0];
  var setSeenValues = _seenValues[1];
  var _badgesSettled = useState(false);
  var badgesSettled = _badgesSettled[0];
  var setBadgesSettled = _badgesSettled[1];
  var _sliderReady = useState(false);
  var sliderReady = _sliderReady[0];
  var setSliderReady = _sliderReady[1];

  /* ───── refs ───── */
  var containerRef = useRef(null);
  var circleRefs = useRef([]);
  var badgeRefs = useRef([]);
  var overlayRef = useRef(null);
  var formulaNRef = useRef(null);
  var formulaResultRef = useRef(null);
  var phaseRef = useRef(0);
  var belowBtnRef = useRef(null);

  useEffect(
    function () {
      phaseRef.current = phase;
    },
    [phase],
  );

  /* ───── helpers ───── */
  function clearOverlay() {
    if (overlayRef.current) overlayRef.current.innerHTML = "";
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

  function boxRect(el) {
    var origin = overlayRef.current || containerRef.current;
    if (!el || !origin) return { left: 0, top: 0, width: 0, height: 0 };
    var er = el.getBoundingClientRect();
    var oRect = origin.getBoundingClientRect();
    return {
      left: er.left - oRect.left,
      top: er.top - oRect.top,
      width: er.width,
      height: er.height,
    };
  }

  function disableAndFadeBtn(cb) {
    setBtnState("disabled");
    setTimeout(function () {
      setBtnState("fading");
      setTimeout(function () {
        setBtnState("hidden");
        if (cb) cb();
      }, 320);
    }, 80);
  }

  /* ───── STEP INIT ───── */
  useEffect(
    function () {
      if (step === 1) {
        setPhase(0);
        setDisplayData(dataset.slice());
        setCrossed([]);
        setShowBadges(false);
        setBadgeCount(0);
        setBadgesSettled(false);
        setSliderReady(false);
        setDimCircles(false);
        setShowMedianCallout(false);
        setShowCountCallouts(false);
        setShowFormula(false);
        setShowFormulaText(false);
        setShowFormulaExpr(false);
        setBtnState("visible");
        setBtnText(S1.sortButton);
        clearOverlay();
        onSetNextEnabled(false);
        onUpdateQuestionText(S1.questionText);
        onUpdateNavText(S1.navText);
      }
      if (step === 2) {
        setSliderVal(7);
        setSeenValues({});
        setShowFormula(true);
        setShowFormulaText(true);
        setShowFormulaExpr(true);
        setShowBadges(true);
        setBadgeCount(99);
        setBadgesSettled(true);
        setDimCircles(false);
        setCrossed([]);
        setDisplayData(sortedDataset.slice());
        setShowMedianCallout(false);
        setShowCountCallouts(false);
        setBtnState("none");
        setPhase(100);
        clearOverlay();
        setSliderReady(false);
        onSetNextEnabled(false);
        onUpdateQuestionText(S2.questionText);
        onUpdateNavText(S2.navText);
        var sliderTimer = setTimeout(function () {
          setSliderReady(true);
        }, 80);
        return function () {
          clearTimeout(sliderTimer);
        };
      }
    },
    [step],
  );

  /* ═══════════════════════════════════════════════════
     SORT ANIMATION (clone-based for flicker-free swap)
     ═══════════════════════════════════════════════════ */
  function handleSort() {
    if (typeof playSound === "function") playSound("click");
    disableAndFadeBtn(function () {
      var circles = circleRefs.current;
      var cRect = containerRef.current.getBoundingClientRect();
      var positions = [];
      for (var i = 0; i < N; i++) {
        var r = circles[i].getBoundingClientRect();
        positions.push({
          left: r.left - cRect.left,
          top: r.top - cRect.top,
          w: r.width,
          h: r.height,
        });
      }

      var overlay = overlayRef.current;
      var clones = [];
      for (var i = 0; i < N; i++) {
        var d = document.createElement("div");
        d.className = "num-circle sort-clone";
        d.textContent = dataset[i];
        d.style.left = positions[i].left + "px";
        d.style.top = positions[i].top + "px";
        d.style.width = positions[i].w + "px";
        d.style.height = positions[i].h + "px";
        overlay.appendChild(d);
        clones.push(d);
      }
      for (var i = 0; i < N; i++) circles[i].style.visibility = "hidden";

      var tl = gsap.timeline({
        onComplete: function () {
          setDisplayData(sortedDataset.slice());
          requestAnimationFrame(function () {
            for (var j = 0; j < clones.length; j++) clones[j].remove();
            var nc = circleRefs.current;
            for (var j = 0; j < N; j++) {
              if (nc[j]) nc[j].style.visibility = "";
            }
          });
          setPhase(1);
          setBtnState("visible");
          setBtnText(S1.crossOutButton);
          onUpdateNavText(S1.navTextAfterSort);
          if (typeof playSound === "function") playSound("tick");
        },
      });

      for (var i = 0; i < N; i++) {
        var target = positions[sortMapping[i]];
        tl.to(
          clones[i],
          {
            left: target.left,
            top: target.top,
            duration: 0.8,
            ease: "power2.inOut",
          },
          0.06 * i,
        );
      }
    });
  }

  /* ═══════════════════════════════════════════════════
     CROSS OUT ANIMATION
     ═══════════════════════════════════════════════════ */
  function handleCrossOut() {
    if (typeof playSound === "function") playSound("click");
    disableAndFadeBtn(function () {
      var pairs = [];
      for (var i = 0; i < MID_IDX; i++) pairs.push([i, N - 1 - i]);
      var crossedSoFar = [];
      var delay = 0;
      pairs.forEach(function (pair) {
        setTimeout(function () {
          crossedSoFar = crossedSoFar.concat([pair[0]]);
          setCrossed(crossedSoFar.slice());
          if (typeof playSound === "function") playSound("click");
        }, delay);
        delay += 450;
        setTimeout(function () {
          crossedSoFar = crossedSoFar.concat([pair[1]]);
          setCrossed(crossedSoFar.slice());
          if (typeof playSound === "function") playSound("click");
        }, delay);
        delay += 450;
      });
      setTimeout(function () {
        setPhase(2);
        setShowMedianCallout(true);
        setBtnState("visible");
        setBtnText(S1.findButton);
        onUpdateNavText(S1.navTextFind);
      }, delay + 400);
    });
  }

  /* ═══════════════════════════════════════════════════
     FIND → removes crosses, shows count button
     ═══════════════════════════════════════════════════ */
  function handleFind() {
    if (typeof playSound === "function") playSound("click");
    disableAndFadeBtn(function () {
      setCrossed([]);
      setShowMedianCallout(false);
      setPhase(3);
      setBtnState("visible");
      setBtnText(S1.countButton);
      onUpdateQuestionText(S1.questionTextCount);
      onUpdateNavText(S1.navTextCount);
    });
  }

  /* ═══════════════════════════════════════════════════
     COUNT ANIMATION
     ═══════════════════════════════════════════════════ */
  function handleCount() {
    if (typeof playSound === "function") playSound("click");
    disableAndFadeBtn(function () {
      setShowBadges(true);
      var count = 0;
      var iv = setInterval(function () {
        count++;
        setBadgeCount(count);
        if (typeof playSound === "function") playSound("tick");
        if (count >= N) {
          clearInterval(iv);
          setTimeout(function () {
            setDimCircles(true);
            setTimeout(function () {
              setShowCountCallouts(true);
              setPhase(4);
              setBtnState("visible");
              setBtnText(S1.relationButton);
              onUpdateNavText(S1.navTextRelation);
            }, 500);
          }, 400);
        }
      }, 220);
    });
  }

  /* ═══════════════════════════════════════════════════
     RELATION → fly badges to formula
     ═══════════════════════════════════════════════════ */
  function handleRelation() {
    if (typeof playSound === "function") playSound("click");
    disableAndFadeBtn(function () {
      setShowCountCallouts(false);
      setTimeout(function () {
        setShowFormula(true);
        setShowFormulaExpr(false);
        setShowFormulaText(false);
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            var lastBadge = badgeRefs.current[N - 1];
            var midBadge = badgeRefs.current[MID_IDX];
            var nSlot = formulaNRef.current;
            var resSlot = formulaResultRef.current;
            var flyRects = null;
            if (
              lastBadge &&
              midBadge &&
              nSlot &&
              resSlot &&
              containerRef.current
            ) {
              flyRects = {
                fromN: boxRect(lastBadge),
                fromMid: boxRect(midBadge),
                toN: boxRect(nSlot),
                toMid: boxRect(resSlot),
              };
            }
            animateClonesToFormula(flyRects);
          });
        });
      }, 400);
    });
  }

  function makeFlyingClone(sourceEl, targetEl, text, fromRect, cls) {
    var cs = window.getComputedStyle(sourceEl);
    var tcs = targetEl ? window.getComputedStyle(targetEl) : cs;
    var d = document.createElement("div");
    d.className = "flying-badge " + cls;
    d.textContent = text;
    d.style.cssText =
      "position:absolute;margin:0;z-index:120;box-sizing:border-box;" +
      "bottom:auto;right:auto;" +
      "left:" +
      fromRect.left +
      "px;top:" +
      fromRect.top +
      "px;width:" +
      fromRect.width +
      "px;height:" +
      fromRect.height +
      "px;" +
      "font-size:" +
      cs.fontSize +
      ";border-radius:" +
      cs.borderRadius +
      ";";
    overlayRef.current.appendChild(d);
    gsap.set(d, { clearProps: "transform", x: 0, y: 0, rotation: 0, scale: 1 });
    return { el: d, targetFontSize: tcs.fontSize, targetRadius: tcs.borderRadius };
  }

  function animateClonesToFormula(flyRects) {
    var lastBadge = badgeRefs.current[N - 1];
    var midBadge = badgeRefs.current[MID_IDX];
    var nSlot = formulaNRef.current;
    var resSlot = formulaResultRef.current;

    if (
      !lastBadge ||
      !midBadge ||
      !nSlot ||
      !resSlot ||
      !overlayRef.current ||
      !flyRects
    ) {
      setShowFormulaExpr(true);
      setShowFormulaText(true);
      finishFormula();
      return;
    }

    var cloneN = makeFlyingClone(
      lastBadge,
      nSlot,
      String(N),
      flyRects.fromN,
      "badge-blue",
    );
    var cloneMid = makeFlyingClone(
      midBadge,
      resSlot,
      String(MID_POS),
      flyRects.fromMid,
      "badge-pink",
    );

    var tl = gsap.timeline();
    tl.to(
      cloneN.el,
      {
        left: flyRects.toN.left,
        top: flyRects.toN.top,
        width: flyRects.toN.width,
        height: flyRects.toN.height,
        fontSize: cloneN.targetFontSize,
        borderRadius: cloneN.targetRadius,
        x: 0,
        y: 0,
        duration: 0.75,
        ease: "power2.inOut",
        force3D: false,
      },
      0,
    );
    tl.to(
      cloneMid.el,
      {
        left: flyRects.toMid.left,
        top: flyRects.toMid.top,
        width: flyRects.toMid.width,
        height: flyRects.toMid.height,
        fontSize: cloneMid.targetFontSize,
        borderRadius: cloneMid.targetRadius,
        x: 0,
        y: 0,
        duration: 0.75,
        ease: "power2.inOut",
        force3D: false,
      },
      0.12,
    );
    tl.call(function () {
      cloneN.el.remove();
      cloneMid.el.remove();
      setShowFormulaExpr(true);
    });
    tl.call(
      function () {
        setShowFormulaText(true);
        setTimeout(blinkFormulaText, 250);
      },
      null,
      "+=0.35",
    );
  }

  function blinkFormulaText() {
    var el = document.querySelector(".formula-textbox");
    if (!el) {
      finishFormula();
      return;
    }
    var count = 0;
    var iv = setInterval(function () {
      el.style.opacity = el.style.opacity === "0.2" ? "1" : "0.2";
      count++;
      if (count >= 6) {
        clearInterval(iv);
        el.style.opacity = "1";
        finishFormula();
      }
    }, 250);
  }

  function finishFormula() {
    setPhase(5);
    onSetNextEnabled(true);
    onUpdateNavText(S1.navTextDone);
  }

  /* ═══════════════════════════════════════════════════
     STEP 2 – SLIDER
     ═══════════════════════════════════════════════════ */
  var handleSliderChange = useCallback(function (val) {
    setSliderVal(val);
    setSeenValues(function (prev) {
      var next = {};
      for (var k in prev) next[k] = true;
      next[val] = true;
      return next;
    });
  }, []);

  useEffect(
    function () {
      if (step !== 2) return;
      var explored = 0;
      for (var k in seenValues) {
        if (Number(k) !== 7) explored++;
      }
      if (explored >= 3) {
        onSetNextEnabled(true);
        onUpdateNavText(S2.navTextDone);
      }
    },
    [seenValues, step],
  );

  /* ═══════════════════════════════════════════════════
     BUTTON DISPATCH
     ═══════════════════════════════════════════════════ */
  function handleBelowBtn() {
    var p = phaseRef.current;
    if (p === 0) handleSort();
    else if (p === 1) handleCrossOut();
    else if (p === 2) handleFind();
    else if (p === 3) handleCount();
    else if (p === 4) handleRelation();
  }

  /* ═══════════════════════════════════════════════════
     RENDER: DATA ROW with inline callouts
     ═══════════════════════════════════════════════════ */
  function renderDataRow() {
    var isStep2 = step === 2;
    var data = isStep2 ? fullDataset.slice(0, sliderVal) : displayData;
    var count = data.length;
    var midIdx = Math.floor(count / 2);
    var hasBadges = (step === 1 && showBadges) || isStep2;
    var sizeClass = isStep2 ? "" : count > 9 ? " sm" : count > 7 ? " md" : "";

    var circles = data.map(function (val, i) {
      var isCrossed = crossed.indexOf(i) >= 0;
      var isMiddle = step === 1 && phase >= 2 && i === MID_IDX;
      var isDim = dimCircles;
      var cls = "num-circle" + sizeClass;
      if (isCrossed) cls += " crossed";
      if (isMiddle && step === 1) cls += " middle-pink";
      if (isDim) cls += " dim";

      var badge = null;
      if (hasBadges && (isStep2 || i < badgeCount)) {
        var bc = "count-badge bg-tan";
        if (badgesSettled) bc += " settled";
        var colorizeBadges =
          isStep2 || showCountCallouts || (step === 1 && phase >= 4);
        if (colorizeBadges) {
          if (i === midIdx) bc = "count-badge bg-pink" + (badgesSettled ? " settled" : "");
          else if (i === count - 1)
            bc = "count-badge bg-blue" + (badgesSettled ? " settled" : "");
        }
        badge = e(
          "div",
          {
            className: bc,
            key: "b" + i,
            ref: function (el) {
              badgeRefs.current[i] = el;
            },
          },
          i + 1,
        );
      }

      var crossSvg = null;
      if (isCrossed) {
        crossSvg = e(
          "div",
          { className: "cross-mark", key: "x" + i },
          e(
            "svg",
            { viewBox: "0 0 40 40", xmlns: "http://www.w3.org/2000/svg" },
            e("line", {
              x1: "8",
              y1: "8",
              x2: "32",
              y2: "32",
              stroke: "#d32f2f",
              strokeWidth: "5.5",
              strokeLinecap: "round",
            }),
            e("line", {
              x1: "32",
              y1: "8",
              x2: "8",
              y2: "32",
              stroke: "#d32f2f",
              strokeWidth: "5.5",
              strokeLinecap: "round",
            }),
          ),
        );
      }

      /* inline callout below this circle */
      var callout = null;
      if (step === 1 && showMedianCallout && i === MID_IDX) {
        callout = e(
          "div",
          { className: "inline-callout median-callout" },
          e(
            "div",
            { className: "callout-arrow pink-arrow-anim" },
            e(
              "svg",
              { viewBox: "0 0 30 44", xmlns: "http://www.w3.org/2000/svg" },
              e("path", {
                d: "M15 44 L15 10 M5 20 L15 4 L25 20",
                fill: "none",
                stroke: "#e84888",
                strokeWidth: "3.5",
                strokeLinecap: "round",
                strokeLinejoin: "round",
              }),
            ),
          ),
          e("div", {
            className: "callout-box pink-bg",
            dangerouslySetInnerHTML: { __html: S1.medianText },
          }),
        );
      }
      if (step === 1 && showCountCallouts && i === MID_IDX) {
        callout = e(
          "div",
          { className: "inline-callout count-mid-callout" },
          e(
            "div",
            { className: "callout-arrow pink-arrow-anim" },
            e(
              "svg",
              { viewBox: "0 0 30 44", xmlns: "http://www.w3.org/2000/svg" },
              e("path", {
                d: "M15 44 L15 10 M5 20 L15 4 L25 20",
                fill: "none",
                stroke: "#e84888",
                strokeWidth: "3.5",
                strokeLinecap: "round",
                strokeLinejoin: "round",
              }),
            ),
          ),
          e(
            "div",
            { className: "callout-box pink-bg" },
            e("span", {
              dangerouslySetInnerHTML: {
                __html: S1.middlePositionLabel + "<b>" + MID_POS + "</b>",
              },
            }),
          ),
        );
      }
      var calloutBlue = null;
      if (step === 1 && showCountCallouts && i === count - 1) {
        calloutBlue = e(
          "div",
          { className: "inline-callout count-total-callout" },
          e(
            "div",
            { className: "callout-arrow blue-arrow-anim" },
            e(
              "svg",
              { viewBox: "0 0 30 44", xmlns: "http://www.w3.org/2000/svg" },
              e("path", {
                d: "M15 44 L15 10 M5 20 L15 4 L25 20",
                fill: "none",
                stroke: "#5b9bd5",
                strokeWidth: "3.5",
                strokeLinecap: "round",
                strokeLinejoin: "round",
              }),
            ),
          ),
          e(
            "div",
            { className: "callout-box blue-bg" },
            e("span", {
              dangerouslySetInnerHTML: {
                __html: S1.totalCountLabel + "<b>" + N + "</b>",
              },
            }),
          ),
        );
      }

      return e(
        "div",
        { className: "num-wrap", key: "w" + i },
        e(
          "div",
          { className: "num-circle-slot" },
          badge,
          e(
            "div",
            {
              className: cls,
              ref: function (el) {
                circleRefs.current[i] = el;
              },
            },
            e("span", { className: "circle-val" }, val),
            crossSvg,
          ),
        ),
        callout,
        calloutBlue,
      );
    });

    return e(
      "div",
      { className: "dr-container" + sizeClass },
      e("div", { className: "dr-row" + sizeClass }, circles),
    );
  }

  /* ═══════════════════════════════════════════════════
     RENDER: FORMULA ROW
     ═══════════════════════════════════════════════════ */
  function renderFormulaRow() {
    if (!showFormula) return null;
    var n = step === 2 ? sliderVal : N;
    var mid = (n + 1) / 2;
    var formulaInstant = step === 2;
    return e(
      "div",
      { className: "formula-row" },
      e(
        "div",
        {
          className:
            "formula-textbox" +
            (showFormulaText ? " vis" : "") +
            (formulaInstant ? " instant" : ""),
        },
        e("span", { dangerouslySetInnerHTML: { __html: S1.formulaText } }),
      ),
      e(
        "div",
        {
          className:
            "formula-expr" +
            (showFormulaExpr ? " vis" : "") +
            (formulaInstant ? " instant" : ""),
        },
        e(
          "div",
          { className: "frac" },
          e(
            "div",
            { className: "frac-num" },
            e("span", { className: "n-box", ref: formulaNRef }, n),
            e("span", { className: "frac-op" }, " + 1"),
          ),
          e("div", { className: "frac-line" }),
          e("div", { className: "frac-den" }, "2"),
        ),
        e("span", { className: "eq-sign" }, "="),
        e("span", { className: "res-box", ref: formulaResultRef }, mid),
      ),
    );
  }

  /* ═══════════════════════════════════════════════════
     RENDER: BELOW-SPACE BUTTON
     ═══════════════════════════════════════════════════ */
  function renderBelowBtn() {
    if (step !== 1 || btnState === "none" || btnState === "hidden") return null;
    var cls = "bsb";
    if (btnState === "disabled" || btnState === "fading")
      cls += " bsb-disabled";
    if (btnState === "fading") cls += " bsb-fading";
    return e(
      React.Fragment,
      null,
      e(
        "button",
        {
          ref: belowBtnRef,
          className: cls,
          onClick:
            btnState === "disabled" || btnState === "fading"
              ? undefined
              : handleBelowBtn,
          disabled: btnState !== "visible",
        },
        btnText,
      ),
      e(Nudge, { targetRef: belowBtnRef, show: btnState === "visible" }),
    );
  }

  /* ═══════════════════════════════════════════════════
     RENDER: SLIDER (STEP 2)
     ═══════════════════════════════════════════════════ */
  function renderSlider() {
    if (step !== 2) return null;
    return e(
      "div",
      { className: "slider-area" + (sliderReady ? " vis" : "") },
      e(CustomSlider, {
        min: 3,
        max: 11,
        step: 2,
        value: sliderVal,
        onChange: handleSliderChange,
      }),
    );
  }

  /* ═══════════════════════════════════════════════════
     MAIN RENDER
     ═══════════════════════════════════════════════════ */
  var hasCallouts = step === 1 && (showMedianCallout || showCountCallouts);
  return e(
    "div",
    { className: "main-canvas-container", ref: containerRef },
    e(
      "div",
      { className: "data-section" + (hasCallouts ? " with-callouts" : "") },
      renderDataRow(),
    ),
    e(
      "div",
      { className: "below-section" },
      renderBelowBtn(),
      renderFormulaRow(),
      renderSlider(),
    ),
    e("div", { className: "anim-overlay", ref: overlayRef }),
  );
};
