const MainCanvas = (props) => {
  const { useEffect, useRef, useState } = React;
  const {
    step,
    s1YellowAxis,
    s1BlueAxis,
    s1Horizontal,
    onS1YellowAxis,
    onS1BlueAxis,
    onS1Horizontal,
    s2YellowAxis,
    s2BlueAxis,
    s2VerticalExpr,
    onS2YellowAxis,
    onS2BlueAxis,
    onS2VerticalExpr,
    onS2SlideDone,
    s3TriangleFill,
    s3RightTriangle,
    onS3TriangleFill,
    onS3RightTriangle,
    onQuestionMarkClick,
    onDClick,
    s4Phase,
    onS4PhaseAdvance,
    s5AnimDone,
    onS5AnimDone,
    practiceQuestion,
    s7HorizDone,
    s7VertDone,
    s7HypDone,
    onS7HorizReveal,
    onS7VertReveal,
    onS7HypReveal,
    s7XyAnimDone,
    onS7XyAnimDone,
    onPracticeContinue,
  } = props;

  const point1Color = "#FFD34D";
  const point2Color = "#64C7FF";
  const gridMajor = "rgba(255,255,255,0.22)";
  const axisColor = "#ffffff";
  const white = "#ffffff";
  const orangeDash = "#ff9800";
  const purpleText = "#c084fc";
  const greenText = "#34d399";
  const hypPink = "#E879A0";

  /** Full extent between endpoints (markers meet points). */
  const arrowEndInset = 0;

  /** Both coordinate labels use the same scaled body text (matches prior (3,4) size). */
  const label34Scale = 0.85;

  /**
   * Layout tweak hooks (SVG px). Adjust here or at call sites noted below.
   * - Step 1 yellow/blue/white "?": renderStep1 → qCenterY uses step1ColoredAxisQAboveLine (same band above each arrow).
   * - Step 2 yellow/blue vertical texts / "?": renderStep2 → labelRightGap + qCenterX on renderVerticalMeasureArrow.
   * - Step 2 white vertical expression: labelNearArrowDx (x = xSvg + offset); font 26px like step 1 white label.
   * - Step 3 hypotenuse "?": renderSegmentQuestionZone → step3HypotenuseQDx / step3HypotenuseQDy.
   * - Step 3 vertical leg text (“3 units”): renderStep3 → labelRightGap (step3VerticalLegLabelGap).
   * - Coordinate labels (3,4) & (7,7): coordLabel34Dx/Dy, coordLabel77Dx/Dy (after `unit` is defined below).
   *
   * --- Vertical arrow labels (steps 2 & 3), all sit to the RIGHT of the shaft ---
   * Text x = xSvg + gap (see renderVerticalMeasureArrow). Smaller gap → shift LEFT (closer to the line).
   *   • Step 2 yellow/blue “4 units” / “7 units”: step2ColoredVerticalLabelGap
   *   • Step 2 white “7 - 4 = …” (beside sliding arrow): step2WhiteVerticalExprLabelDx
   *   • Step 3 green “3 units”: renderStep3 → renderVerticalMeasureArrow(…, { labelRightGap: step3VerticalLegLabelGap });
   *       Horizontal position: x = xSvg + labelRightGap inside renderVerticalMeasureArrow. Vertical: y = (yLo+yHi)/2 + 8 there.
   * “?” boxes for step 2 colored verticals: step2ColoredVerticalQGap (qCenterX = xSvg + this).
   */
  const step1ColoredAxisQAboveLine = 34;
  /** Step 2 yellow/blue: label x = xSvg + this (was 72 in old default). Lower → left. */
  const step2ColoredVerticalLabelGap = 28;
  const step2ColoredVerticalQGap = 34;
  const step3HypotenuseQDx = -16;
  const step3HypotenuseQDy = -28;
  /** Step 3 vertical leg: label x = xSvg + this. Lower → left. */
  const step3VerticalLegLabelGap = 12;
  /** Step 2 white vertical expression: label x = xSvg + this (labelNearArrow). Lower → left. */
  const step2WhiteVerticalExprLabelDx = 8;

  /** Question-mark hit box & glyph (~20% smaller than original). */
  const qBoxHalfW = 19;
  const qBoxHalfH = 17;
  const qBoxRx = 5;
  const qFontSize = 26;

  const unit = 46;

  /** Offset of “(3, 4)” text from the yellow dot center: (pt.x + coordLabel34Dx, pt.y + coordLabel34Dy). */
  const coordLabel34Dx = -30 - unit;
  const coordLabel34Dy = 44;
  /** Offset of “(7, 7)” text from the blue dot center: (pt.x + coordLabel77Dx, pt.y + coordLabel77Dy). */
  const coordLabel77Dx = 20;
  const coordLabel77Dy = -30;

  /** Step 7 only: the higher point’s label — directly right of the dot, slightly below center. */
  const step7TopLabelDx = 14;
  const step7TopLabelDy = 22;

  const leftPad = 52;
  const rightPad = 28;
  const topPad = 36;
  const bottomPad = 48;
  const plotUnits = 10;
  const plotW = plotUnits * unit;
  const plotH = plotUnits * unit;
  const svgW = leftPad + plotW + rightPad;
  const svgH = topPad + plotH + bottomPad;
  const originX = leftPad;
  const originY = topPad + plotH;

  const [slideArrowX, setSlideArrowX] = useState(8.5);
  const slideDoneSentRef = useRef(false);
  const onS2SlideDoneRef = useRef(onS2SlideDone);
  onS2SlideDoneRef.current = onS2SlideDone;

  /** XY hypotenuse animation phase (only active when qtype=xy, s7HypDone=true, s7XyAnimDone=false) */
  const [xyAnimPhase, setXyAnimPhase] = useState(-1);
  const xyContainerRef = useRef(null);
  const xyXCloneRef = useRef(null);
  const xyYCloneRef = useRef(null);

  function toSvg(mx, my) {
    return { x: originX + mx * unit, y: originY - my * unit };
  }

  const p34 = toSvg(3, 4);
  const p77 = toSvg(7, 7);
  const p74 = toSvg(7, 4);

  /** Hypotenuse label sits on the segment (3,4)–(7,7); same tilt in steps 3–5. */
  function hypotenuseLabelGeometry() {
    const midHyp = { x: (p34.x + p77.x) / 2, y: (p34.y + p77.y) / 2 };
    const hypLabelY = midHyp.y - 8;
    const hypAngleDeg =
      (Math.atan2(p77.y - p34.y, p77.x - p34.x) * 180) / Math.PI;
    const hypTransform =
      "rotate(" + hypAngleDeg + " " + midHyp.x + " " + hypLabelY + ")";
    return { midHyp, hypLabelY, hypTransform };
  }

  useEffect(() => {
    slideDoneSentRef.current = false;
    setSlideArrowX(8.5);
  }, [step]);

  useEffect(() => {
    if (step !== 2 || !s2VerticalExpr) {
      slideDoneSentRef.current = false;
      return;
    }

    let start = null;
    const dur = 650;
    const from = 8.5;
    const to = 7;
    let rafId = null;

    function frame(t) {
      if (start == null) start = t;
      const u = Math.min(1, (t - start) / dur);
      const eased = u * (2 - u);
      const x = from + (to - from) * eased;
      setSlideArrowX(x);
      if (u < 1) {
        rafId = requestAnimationFrame(frame);
      } else if (!slideDoneSentRef.current) {
        slideDoneSentRef.current = true;
        const cb = onS2SlideDoneRef.current;
        if (typeof cb === "function") cb();
      }
    }

    rafId = requestAnimationFrame(frame);
    return () => {
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, [step, s2VerticalExpr]);

  /* ── XY hypotenuse animation phases ── */
  const isXyAnimActive = practiceQuestion && practiceQuestion.qtype === "xy" && s7HypDone && !s7XyAnimDone && step === 7;

  useEffect(() => {
    if (isXyAnimActive && xyAnimPhase < 0) {
      const timer = setTimeout(() => setXyAnimPhase(0), 200);
      return () => clearTimeout(timer);
    }
    if (!isXyAnimActive) setXyAnimPhase(-1);
  }, [isXyAnimActive]);

  // Phase 0→1: sqrt appears, then delay before x-clone flies
  useEffect(() => {
    if (xyAnimPhase !== 0) return;
    const timer = setTimeout(() => setXyAnimPhase(1), 700);
    return () => clearTimeout(timer);
  }, [xyAnimPhase]);

  // Phase 1: fly x-clone
  useEffect(() => {
    if (xyAnimPhase !== 1 || !xyContainerRef.current || !xyXCloneRef.current) return;
    const cRect = xyContainerRef.current.getBoundingClientRect();
    const srcEl = xyContainerRef.current.querySelector(".xy-horiz-label-src text");
    const tgtEl = xyContainerRef.current.querySelector(".xy-anim-x-slot");
    if (!srcEl || !tgtEl) { setXyAnimPhase(2); return; }

    const sRect = srcEl.getBoundingClientRect();
    const tRect = tgtEl.getBoundingClientRect();
    const el = xyXCloneRef.current;
    const angleDeg = practiceQuestion ? (Math.atan2(
      -(practiceQuestion.y2 - practiceQuestion.y1),
      (practiceQuestion.x2 - practiceQuestion.x1)
    ) * 180) / Math.PI : 0;

    gsap.set(el, {
      left: sRect.left + sRect.width / 2 - cRect.left,
      top: sRect.top + sRect.height / 2 - cRect.top,
      rotation: 0,
      opacity: 0.9, scale: 1.2, display: "inline-flex",
    });
    gsap.to(el, {
      left: tRect.left + tRect.width / 2 - cRect.left,
      top: tRect.top + tRect.height / 2 - cRect.top,
      rotation: angleDeg,
      opacity: 1, scale: 1, duration: 0.7, ease: "power2.inOut",
      onComplete: () => {
        gsap.set(el, { display: "none" });
        setXyAnimPhase(2);
      },
    });
  }, [xyAnimPhase]);

  // Phase 2→3: x arrived, show term, then delay for +
  useEffect(() => {
    if (xyAnimPhase !== 2) return;
    const timer = setTimeout(() => setXyAnimPhase(3), 400);
    return () => clearTimeout(timer);
  }, [xyAnimPhase]);

  // Phase 3→4: + visible, then delay for y-clone
  useEffect(() => {
    if (xyAnimPhase !== 3) return;
    const timer = setTimeout(() => setXyAnimPhase(4), 400);
    return () => clearTimeout(timer);
  }, [xyAnimPhase]);

  // Phase 4: fly y-clone
  useEffect(() => {
    if (xyAnimPhase !== 4 || !xyContainerRef.current || !xyYCloneRef.current) return;
    const cRect = xyContainerRef.current.getBoundingClientRect();
    const srcEl = xyContainerRef.current.querySelector(".xy-vert-label-src text");
    const tgtEl = xyContainerRef.current.querySelector(".xy-anim-y-slot");
    if (!srcEl || !tgtEl) { setXyAnimPhase(5); return; }

    const sRect = srcEl.getBoundingClientRect();
    const tRect = tgtEl.getBoundingClientRect();
    const el = xyYCloneRef.current;
    const angleDeg = practiceQuestion ? (Math.atan2(
      -(practiceQuestion.y2 - practiceQuestion.y1),
      (practiceQuestion.x2 - practiceQuestion.x1)
    ) * 180) / Math.PI : 0;

    gsap.set(el, {
      left: sRect.left + sRect.width / 2 - cRect.left,
      top: sRect.top + sRect.height / 2 - cRect.top,
      rotation: 0,
      opacity: 0.9, scale: 1.2, display: "inline-flex",
    });
    gsap.to(el, {
      left: tRect.left + tRect.width / 2 - cRect.left,
      top: tRect.top + tRect.height / 2 - cRect.top,
      rotation: angleDeg,
      opacity: 1, scale: 1, duration: 0.7, ease: "power2.inOut",
      onComplete: () => {
        gsap.set(el, { display: "none" });
        setXyAnimPhase(5);
      },
    });
  }, [xyAnimPhase]);

  // Phase 5: y arrived, done after delay
  useEffect(() => {
    if (xyAnimPhase !== 5) return;
    const timer = setTimeout(() => {
      if (typeof onS7XyAnimDone === "function") onS7XyAnimDone();
    }, 600);
    return () => clearTimeout(timer);
  }, [xyAnimPhase]);

  function clickReveal(handler) {
    if (typeof onQuestionMarkClick === "function") onQuestionMarkClick();
    if (typeof playSound === "function") playSound("click");
    handler();
  }

  function renderQuestionMarkBox(cx, cy, color, showQ, onClick) {
    if (!showQ) return null;
    const clickable = typeof onClick === "function";
    return React.createElement(
      "g",
      {
        onClick: clickable
          ? (e) => {
              e.stopPropagation();
              clickReveal(onClick);
            }
          : undefined,
        className: clickable ? "q-box-clickable" : "",
        style: { cursor: clickable ? "pointer" : "default" },
      },
      React.createElement("rect", {
        x: cx - qBoxHalfW,
        y: cy - qBoxHalfH,
        width: qBoxHalfW * 2,
        height: qBoxHalfH * 2,
        rx: qBoxRx,
        fill:
          color === white
            ? "rgba(255,255,255,0.12)"
            : color === point1Color
              ? "rgba(255,211,77,0.14)"
              : "rgba(100,199,255,0.14)",
        stroke: color,
        strokeWidth: 2,
        strokeDasharray: "5,4",
      }),
      React.createElement(
        "text",
        {
          x: cx,
          y: cy + 5,
          fill: color,
          fontSize: qFontSize,
          fontWeight: "700",
          textAnchor: "middle",
          dominantBaseline: "middle",
          fontFamily: "system-ui, sans-serif",
        },
        showQ ? "?" : "",
      ),
    );
  }

  function renderHorizontalMeasureArrow(ySvg, x1Svg, x2Svg, opts) {
    const {
      color,
      blink,
      opacity,
      labelBelow,
      labelNode,
      labelFontSize,
      qCenterX,
      qCenterY,
      showQ,
      onQClick,
    } = opts;
    const xL = Math.min(x1Svg, x2Svg);
    const xR = Math.max(x1Svg, x2Svg);
    const inset = arrowEndInset;
    const markerStart =
      color === point1Color
        ? "url(#arrow-yellow-start)"
        : color === point2Color
          ? "url(#arrow-blue-start)"
          : "url(#arrow-white-start)";
    const markerEnd =
      color === point1Color
        ? "url(#arrow-yellow-end)"
        : color === point2Color
          ? "url(#arrow-blue-end)"
          : "url(#arrow-white-end)";
    return React.createElement(
      "g",
      { opacity: opacity == null ? 1 : opacity },
      React.createElement("line", {
        x1: xL + inset,
        y1: ySvg,
        x2: xR - inset,
        y2: ySvg,
        stroke: color,
        strokeWidth: 3,
        markerStart,
        markerEnd,
        className: blink ? "blink-line" : "",
      }),
      labelNode
        ? React.createElement(
            "g",
            null,
            React.createElement(
              "text",
              {
                x: (xL + xR) / 2,
                y: labelBelow ? ySvg + 38 : ySvg - 22,
                fill: white,
                fontSize: labelFontSize != null ? labelFontSize : 26,
                textAnchor: "middle",
                fontFamily: "system-ui, sans-serif",
              },
              labelNode,
            ),
          )
        : null,
      showQ && qCenterX != null && qCenterY != null
        ? renderQuestionMarkBox(qCenterX, qCenterY, color, true, onQClick)
        : null,
    );
  }

  function renderVerticalMeasureArrow(xSvg, y1Svg, y2Svg, opts) {
    const {
      color,
      blink,
      opacity,
      labelRight,
      labelNearArrow,
      labelNearArrowDx,
      labelRightGap,
      labelNode,
      labelFontSize,
      qCenterX,
      qCenterY,
      showQ,
      onQClick,
    } = opts;
    const gapR = labelRightGap != null ? labelRightGap : 72;
    const nearDx = labelNearArrowDx != null ? labelNearArrowDx : 12;
    const yLo = Math.min(y1Svg, y2Svg);
    const yHi = Math.max(y1Svg, y2Svg);
    const inset = arrowEndInset;
    const markerStart =
      color === point1Color
        ? "url(#arrow-yellow-start)"
        : color === point2Color
          ? "url(#arrow-blue-start)"
          : "url(#arrow-white-start)";
    const markerEnd =
      color === point1Color
        ? "url(#arrow-yellow-end)"
        : color === point2Color
          ? "url(#arrow-blue-end)"
          : "url(#arrow-white-end)";
    return React.createElement(
      "g",
      { opacity: opacity == null ? 1 : opacity },
      React.createElement("line", {
        x1: xSvg,
        y1: yLo + inset,
        x2: xSvg,
        y2: yHi - inset,
        stroke: color,
        strokeWidth: 3,
        markerStart,
        markerEnd,
        className: blink ? "blink-line" : "",
      }),
      labelNode
        ? React.createElement(
            "text",
            {
              x: labelNearArrow
                ? xSvg + nearDx
                : labelRight
                  ? xSvg + gapR
                  : xSvg - gapR,
              y: labelNearArrow ? (yLo + yHi) / 2 + 10 : (yLo + yHi) / 2 + 8,
              fill: white,
              fontSize: labelFontSize != null ? labelFontSize : 26,
              textAnchor: labelNearArrow
                ? "start"
                : labelRight
                  ? "start"
                  : "end",
              fontFamily: "system-ui, sans-serif",
            },
            labelNode,
          )
        : null,
      showQ && qCenterX != null && qCenterY != null
        ? renderQuestionMarkBox(qCenterX, qCenterY, color, true, onQClick)
        : null,
    );
  }

  function coordLabelStep1(
    xMath,
    yMath,
    emphasizeX,
    revealedYellow,
    revealedBlue,
  ) {
    const pt = toSvg(xMath, yMath);
    const isYellow = xMath === 3;
    const labelColor = isYellow ? point1Color : point2Color;
    const emphasize =
      (isYellow && revealedYellow && emphasizeX) ||
      (!isYellow && revealedBlue && emphasizeX);
    const ty = pt.y + (isYellow ? coordLabel34Dy : coordLabel77Dy);
    const tx = pt.x + (isYellow ? coordLabel34Dx : coordLabel77Dx);
    const anchor = isYellow ? "start" : "start";
    const baseFs = Math.round(34 * label34Scale);
    const emphOuterFs = Math.round(38 * label34Scale);
    const emphCoordFs = Math.round(40 * label34Scale);
    return React.createElement(
      "text",
      {
        x: tx,
        y: ty,
        fill: white,
        fontSize: emphasize ? emphOuterFs : baseFs,
        fontFamily: "system-ui, sans-serif",
        textAnchor: anchor,
      },
      React.createElement("tspan", null, "("),
      React.createElement(
        "tspan",
        {
          fill: emphasize ? labelColor : white,
          fontWeight: emphasize ? "700" : "500",
          fontSize: emphasize ? emphCoordFs : baseFs,
        },
        String(xMath),
      ),
      React.createElement("tspan", null, ", " + String(yMath) + ")"),
    );
  }

  function coordLabelStep2White(xMath, yMath, revealedYellow, revealedBlue) {
    const pt = toSvg(xMath, yMath);
    const isYellow = xMath === 3;
    const labelColor = isYellow ? point1Color : point2Color;
    const emphasize = isYellow ? revealedYellow : revealedBlue;
    const ty = pt.y + (isYellow ? coordLabel34Dy : coordLabel77Dy);
    const tx = pt.x + (isYellow ? coordLabel34Dx : coordLabel77Dx);
    const baseFs = Math.round(34 * label34Scale);
    const emphFs = Math.round(38 * label34Scale);
    return React.createElement(
      "text",
      {
        x: tx,
        y: ty,
        fill: white,
        fontSize: baseFs,
        fontFamily: "system-ui, sans-serif",
        textAnchor: "start",
      },
      React.createElement("tspan", null, "(" + String(xMath) + ", "),
      React.createElement(
        "tspan",
        {
          fill: emphasize ? labelColor : white,
          fontWeight: emphasize ? "700" : "500",
          fontSize: emphasize ? emphFs : baseFs,
        },
        String(yMath),
      ),
      React.createElement("tspan", null, ")"),
    );
  }

  function coordLabelStep3White(xMath, yMath) {
    const pt = toSvg(xMath, yMath);
    const isYellow = xMath === 3;
    const ty = pt.y + (isYellow ? coordLabel34Dy : coordLabel77Dy);
    const tx = pt.x + (isYellow ? coordLabel34Dx : coordLabel77Dx);
    const baseFs = Math.round(34 * label34Scale);
    return React.createElement(
      "text",
      {
        x: tx,
        y: ty,
        fill: white,
        fontSize: baseFs,
        fontFamily: "system-ui, sans-serif",
        textAnchor: "start",
      },
      "(" + String(xMath) + ", " + String(yMath) + ")",
    );
  }

  /** Hypotenuse tap zone is wide (transparent line); step3-nudge-target wraps only the “?” box so the hand aligns there. */
  function renderSegmentQuestionZone(midX, midY, showQ, onReveal) {
    return React.createElement(
      "g",
      {
        onClick:
          showQ && onReveal
            ? (e) => {
                e.stopPropagation();
                clickReveal(onReveal);
              }
            : undefined,
        className: showQ ? "q-box-clickable" : "",
        style: { cursor: showQ ? "pointer" : "default" },
      },
      React.createElement("line", {
        x1: p34.x,
        y1: p34.y,
        x2: p77.x,
        y2: p77.y,
        stroke: "transparent",
        strokeWidth: 22,
      }),
      showQ
        ? React.createElement(
            "g",
            { className: "step3-nudge-target" },
            renderQuestionMarkBox(
              midX + step3HypotenuseQDx,
              midY + step3HypotenuseQDy,
              white,
              true,
              undefined,
            ),
          )
        : null,
    );
  }

  function renderStep1() {
    const d1 = APP_DATA.steps[1];
    const axisX = originX;
    const bothAxis = s1YellowAxis && s1BlueAxis;
    const horizMid = (p34.x + p74.x) / 2;

    const horizontalExprLabel = React.createElement(
      React.Fragment,
      null,
      React.createElement(
        "tspan",
        { fill: point2Color },
        d1.horizontalExprLeadingBlue,
      ),
      React.createElement("tspan", { fill: white }, " - "),
      React.createElement(
        "tspan",
        { fill: point1Color },
        d1.horizontalExprLeadingYellow,
      ),
      React.createElement("tspan", { fill: white }, " = "),
      React.createElement(
        "tspan",
        { fill: purpleText },
        d1.horizontalExprResult,
      ),
    );

    return React.createElement(
      React.Fragment,
      null,
      React.createElement("circle", {
        cx: p34.x,
        cy: p34.y,
        r: 8,
        fill: point1Color,
      }),
      React.createElement("circle", {
        cx: p77.x,
        cy: p77.y,
        r: 8,
        fill: point2Color,
      }),
      React.createElement("line", {
        x1: p34.x,
        y1: p34.y,
        x2: p77.x,
        y2: p77.y,
        stroke: white,
        strokeWidth: 3,
      }),
      coordLabelStep1(3, 4, true, s1YellowAxis, s1BlueAxis),
      coordLabelStep1(7, 7, true, s1YellowAxis, s1BlueAxis),
      !bothAxis || !s1Horizontal
        ? renderHorizontalMeasureArrow(p34.y, axisX, p34.x, {
            color: point1Color,
            blink: !s1YellowAxis,
            labelBelow: false,
            labelNode: s1YellowAxis
              ? React.createElement(
                  "tspan",
                  { fill: point1Color, fontWeight: "700" },
                  d1.labelYellowAxis,
                )
              : null,
            qCenterX: (axisX + p34.x) / 2,
            qCenterY: p34.y - step1ColoredAxisQAboveLine,
            showQ: !s1YellowAxis,
            onQClick: onS1YellowAxis,
          })
        : null,
      !bothAxis || !s1Horizontal
        ? renderHorizontalMeasureArrow(p77.y, axisX, p77.x, {
            color: point2Color,
            blink: !s1BlueAxis,
            labelBelow: false,
            labelNode: s1BlueAxis
              ? React.createElement(
                  "tspan",
                  { fill: point2Color, fontWeight: "700" },
                  d1.labelBlueAxis,
                )
              : null,
            qCenterX: (axisX + p77.x) / 2,
            qCenterY: p77.y - step1ColoredAxisQAboveLine,
            showQ: !s1BlueAxis,
            onQClick: onS1BlueAxis,
          })
        : null,
      bothAxis
        ? React.createElement(
            React.Fragment,
            null,
            React.createElement("line", {
              x1: p34.x,
              y1: p34.y,
              x2: p34.x,
              y2: toSvg(3, 1.5).y,
              stroke: orangeDash,
              strokeWidth: 2,
              strokeDasharray: "8 6",
            }),
            React.createElement("line", {
              x1: p77.x,
              y1: p77.y,
              x2: p77.x,
              y2: toSvg(7, 1.5).y,
              stroke: orangeDash,
              strokeWidth: 2,
              strokeDasharray: "8 6",
            }),
          )
        : null,
      bothAxis
        ? renderHorizontalMeasureArrow(p34.y, p34.x, p74.x, {
            color: white,
            blink: !s1Horizontal,
            opacity: 1,
            labelBelow: true,
            labelNode: s1Horizontal ? horizontalExprLabel : null,
            qCenterX: horizMid,
            qCenterY: p34.y - step1ColoredAxisQAboveLine,
            showQ: !s1Horizontal,
            onQClick: onS1Horizontal,
          })
        : null,
    );
  }

  function renderStep2() {
    const d2 = APP_DATA.steps[2];
    const bothAxis = s2YellowAxis && s2BlueAxis;
    const xLine8_5 = toSvg(slideArrowX, 0).x;
    const yTop = toSvg(0, 7).y;
    const yBot = toSvg(0, 4).y;

    const verticalExpr = React.createElement(
      React.Fragment,
      null,
      React.createElement(
        "tspan",
        { fill: point2Color },
        d2.verticalExprLeadingBlue,
      ),
      React.createElement("tspan", { fill: white }, " - "),
      React.createElement(
        "tspan",
        { fill: point1Color },
        d2.verticalExprLeadingYellow,
      ),
      React.createElement("tspan", { fill: white }, " = "),
      React.createElement("tspan", { fill: greenText }, d2.verticalExprResult),
    );

    const faded = 0.5;

    return React.createElement(
      React.Fragment,
      null,
      React.createElement("circle", {
        cx: p34.x,
        cy: p34.y,
        r: 8,
        fill: point1Color,
      }),
      React.createElement("circle", {
        cx: p77.x,
        cy: p77.y,
        r: 8,
        fill: point2Color,
      }),
      React.createElement("line", {
        x1: p34.x,
        y1: p34.y,
        x2: p77.x,
        y2: p77.y,
        stroke: white,
        strokeWidth: 3,
      }),
      coordLabelStep2White(3, 4, s2YellowAxis, s2BlueAxis),
      coordLabelStep2White(7, 7, s2YellowAxis, s2BlueAxis),
      renderHorizontalMeasureArrow(p34.y, p34.x, p74.x, {
        color: white,
        blink: false,
        opacity: faded,
        labelBelow: true,
        labelNode: React.createElement(
          "tspan",
          { fill: purpleText, fontWeight: "600" },
          d2.fadedHorizontalLabel,
        ),
        qCenterX: null,
        qCenterY: null,
        showQ: false,
      }),
      !s2VerticalExpr
        ? renderVerticalMeasureArrow(p34.x, originY, p34.y, {
            color: point1Color,
            blink: !s2YellowAxis,
            labelRight: true,
            labelRightGap: step2ColoredVerticalLabelGap,
            labelNode: s2YellowAxis
              ? React.createElement(
                  "tspan",
                  { fill: point1Color, fontWeight: "700" },
                  d2.labelYellowAxis,
                )
              : null,
            qCenterX: p34.x + step2ColoredVerticalQGap,
            qCenterY: (originY + p34.y) / 2,
            showQ: !s2YellowAxis,
            onQClick: onS2YellowAxis,
          })
        : null,
      !s2VerticalExpr
        ? renderVerticalMeasureArrow(p77.x, originY, p77.y, {
            color: point2Color,
            blink: !s2BlueAxis,
            labelRight: true,
            labelRightGap: step2ColoredVerticalLabelGap,
            labelNode: s2BlueAxis
              ? React.createElement(
                  "tspan",
                  { fill: point2Color, fontWeight: "700" },
                  d2.labelBlueAxis,
                )
              : null,
            qCenterX: p77.x + step2ColoredVerticalQGap,
            qCenterY: (originY + p77.y) / 2,
            showQ: !s2BlueAxis,
            onQClick: onS2BlueAxis,
          })
        : null,
      bothAxis
        ? React.createElement(
            React.Fragment,
            null,
            React.createElement("line", {
              x1: p34.x,
              y1: p34.y,
              x2: toSvg(10, 4).x,
              y2: p34.y,
              stroke: orangeDash,
              strokeWidth: 2,
              strokeDasharray: "8 6",
            }),
            React.createElement("line", {
              x1: p77.x,
              y1: p77.y,
              x2: toSvg(10, 7).x,
              y2: p77.y,
              stroke: orangeDash,
              strokeWidth: 2,
              strokeDasharray: "8 6",
            }),
          )
        : null,
      bothAxis
        ? renderVerticalMeasureArrow(xLine8_5, yTop, yBot, {
            color: white,
            blink: !s2VerticalExpr,
            opacity: 1,
            labelRight: true,
            labelNearArrow: !!s2VerticalExpr,
            labelNearArrowDx: step2WhiteVerticalExprLabelDx,
            labelNode: s2VerticalExpr ? verticalExpr : null,
            qCenterX: xLine8_5 + 36,
            qCenterY: (yTop + yBot) / 2,
            showQ: !s2VerticalExpr,
            onQClick: onS2VerticalExpr,
          })
        : null,
    );
  }

  function renderRightAngleSquare() {
    const s = unit * 0.64;
    const x0 = p74.x;
    const y0 = p74.y;
    const pa =
      x0 -
      s +
      "," +
      y0 +
      " " +
      x0 +
      "," +
      y0 +
      " " +
      x0 +
      "," +
      (y0 - s) +
      " " +
      (x0 - s) +
      "," +
      (y0 - s);
    return React.createElement("polygon", {
      points: pa,
      fill: "rgba(0,0,0,0.55)",
      stroke: white,
      strokeWidth: 2,
    });
  }

  function renderStep3() {
    const d3 = APP_DATA.steps[3];
    const { midHyp, hypLabelY, hypTransform } = hypotenuseLabelGeometry();

    /** Drawn after legs/points so taps hit the triangle, not dots. pointer-events:none after reveal so “d” receives taps. */
    const triFillInteractive =
      s3TriangleFill &&
      React.createElement("polygon", {
        points:
          String(p34.x) +
          "," +
          String(p34.y) +
          " " +
          String(p77.x) +
          "," +
          String(p77.y) +
          " " +
          String(p74.x) +
          "," +
          String(p74.y),
        fill: "rgba(255, 211, 77, 0.22)",
        stroke: "none",
        className:
          !s3RightTriangle && s3TriangleFill
            ? "triangle-fill-hit q-box-clickable step3-nudge-target"
            : "",
        onClick:
          !s3RightTriangle && s3TriangleFill
            ? (e) => {
                e.stopPropagation();
                clickReveal(onS3RightTriangle);
              }
            : undefined,
        style: s3RightTriangle
          ? { pointerEvents: "none" }
          : { cursor: "pointer", pointerEvents: "auto" },
      });

    return React.createElement(
      React.Fragment,
      null,
      renderHorizontalMeasureArrow(p34.y, p34.x, p74.x, {
        color: white,
        blink: false,
        opacity: 1,
        labelBelow: true,
        labelNode: React.createElement(
          "tspan",
          { fill: purpleText, fontWeight: "600" },
          d3.horizontalLegLabel,
        ),
        qCenterX: null,
        qCenterY: null,
        showQ: false,
      }),
      renderVerticalMeasureArrow(p74.x, p34.y, p77.y, {
        color: white,
        blink: false,
        opacity: 1,
        labelRight: true,
        labelRightGap: step3VerticalLegLabelGap,
        labelNode: React.createElement(
          "tspan",
          { fill: greenText, fontWeight: "600" },
          d3.verticalLegLabel,
        ),
        qCenterX: null,
        qCenterY: null,
        showQ: false,
      }),
      React.createElement("circle", {
        cx: p34.x,
        cy: p34.y,
        r: 8,
        fill: point1Color,
      }),
      React.createElement("circle", {
        cx: p77.x,
        cy: p77.y,
        r: 8,
        fill: point2Color,
      }),
      coordLabelStep3White(3, 4),
      coordLabelStep3White(7, 7),
      React.createElement("line", {
        x1: p34.x,
        y1: p34.y,
        x2: p77.x,
        y2: p77.y,
        stroke: white,
        strokeWidth: 3,
        pointerEvents: "none",
      }),
      !s3TriangleFill
        ? renderSegmentQuestionZone(midHyp.x, midHyp.y, true, onS3TriangleFill)
        : null,
      triFillInteractive,
      s3RightTriangle ? renderRightAngleSquare() : null,
      s3RightTriangle
        ? React.createElement(
            "g",
            {
              className: "q-box-clickable step3-nudge-target",
              style: { cursor: "pointer" },
              transform: hypTransform,
              onClick: () => {
                if (typeof onQuestionMarkClick === "function")
                  onQuestionMarkClick();
                if (typeof onDClick === "function") onDClick();
              },
            },
            React.createElement("rect", {
              x: midHyp.x - 30,
              y: midHyp.y - 38,
              width: 60,
              height: 46,
              fill: "transparent",
            }),
            React.createElement(
              "text",
              {
                x: midHyp.x,
                y: hypLabelY,
                fill: white,
                fontSize: 34,
                fontWeight: "700",
                textAnchor: "middle",
                fontFamily: "system-ui, sans-serif",
                pointerEvents: "none",
              },
              "d",
            ),
          )
        : null,
    );
  }

  /** ═══════ STEP 4: Pythagorean calculation ═══════ */
  function renderStep4Svg() {
    const d3 = APP_DATA.steps[3];
    const { midHyp, hypLabelY, hypTransform } = hypotenuseLabelGeometry();
    /** Step 4 ends with hypotenuse still “d”; step 5 animates “5” onto it, then shows full label. */
    const showFinalLabel = step === 5 && s5AnimDone;
    const hypPink = "#E879A0";
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(
        "g",
        { id: "s4-src-4" },
        renderHorizontalMeasureArrow(p34.y, p34.x, p74.x, {
          color: white,
          blink: false,
          opacity: 1,
          labelBelow: true,
          labelNode: React.createElement(
            "tspan",
            { fill: purpleText, fontWeight: "600" },
            d3.horizontalLegLabel,
          ),
          showQ: false,
        }),
      ),
      React.createElement(
        "g",
        { id: "s4-src-3" },
        renderVerticalMeasureArrow(p74.x, p34.y, p77.y, {
          color: white,
          blink: false,
          opacity: 1,
          labelRight: true,
          labelRightGap: step3VerticalLegLabelGap,
          labelNode: React.createElement(
            "tspan",
            { fill: greenText, fontWeight: "600", className: "s4-vert-label" },
            d3.verticalLegLabel,
          ),
          showQ: false,
        }),
      ),
      React.createElement("polygon", {
        points:
          p34.x +
          "," +
          p34.y +
          " " +
          p77.x +
          "," +
          p77.y +
          " " +
          p74.x +
          "," +
          p74.y,
        fill: "rgba(255, 211, 77, 0.22)",
        stroke: "none",
        style: { pointerEvents: "none" },
      }),
      renderRightAngleSquare(),
      React.createElement("circle", {
        cx: p34.x,
        cy: p34.y,
        r: 8,
        fill: point1Color,
      }),
      React.createElement("circle", {
        cx: p77.x,
        cy: p77.y,
        r: 8,
        fill: point2Color,
      }),
      coordLabelStep3White(3, 4),
      coordLabelStep3White(7, 7),
      React.createElement("line", {
        x1: p34.x,
        y1: p34.y,
        x2: p77.x,
        y2: p77.y,
        stroke: white,
        strokeWidth: 3,
        pointerEvents: "none",
      }),
      React.createElement(
        "g",
        { transform: hypTransform },
        React.createElement(
          "text",
          {
            x: midHyp.x,
            y: hypLabelY,
            fill: showFinalLabel ? hypPink : white,
            fontSize: 34,
            fontWeight: "700",
            textAnchor: "middle",
            fontFamily: "system-ui, sans-serif",
            className: "s4-hyp-label",
          },
          showFinalLabel ? APP_DATA.steps[4].hypLabel : "d",
        ),
      ),
    );
  }

  function practiceUnitsSuffix() {
    var pc = APP_DATA.practiceCopy;
    return pc && pc.unitsWord ? pc.unitsWord : "units";
  }

  function formatHypLabelUnits(dx, dy) {
    const n = dx * dx + dy * dy;
    const r = Math.sqrt(n);
    const u = practiceUnitsSuffix();
    if (Math.abs(r - Math.round(r)) < 1e-6)
      return String(Math.round(r)) + " " + u;
    return "\u221A" + n + " " + u;
  }

  function hypDistIsPerfectSquare(dx, dy) {
    const n = dx * dx + dy * dy;
    const r = Math.sqrt(n);
    return Math.abs(r - Math.round(r)) < 1e-6;
  }

  /**
   * Same DOM/CSS as Step 4 √ (√25): wrap → full-size overlay SVG + padded content under bar.
   * labelCx, labelCy = center of foreignObject (offset perpendicular from hypotenuse).
   */
  function renderHypSqrtForeignLabel(dx, dy, labelCx, labelCy) {
    const n = dx * dx + dy * dy;
    const radStr = String(n);
    const radMinW =
      radStr.length <= 2
        ? "2.5em"
        : Math.min(5.5, 1.2 + radStr.length * 0.95) + "em";
    const foW = Math.min(320, Math.max(152, 110 + radStr.length * 34));
    const foH = 56;
    return React.createElement(
      "foreignObject",
      {
        x: labelCx - foW / 2,
        y: labelCy - foH / 2,
        width: foW,
        height: foH,
        style: { overflow: "visible", pointerEvents: "none" },
      },
      React.createElement(
        "div",
        {
          xmlns: "http://www.w3.org/1999/xhtml",
          className: "s7-hyp-foreign-inner",
          style: {
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            height: "100%",
            fontWeight: 700,
            fontSize: 34,
            fontFamily: "system-ui, sans-serif",
            lineHeight: 1.05,
            color: hypPink,
          },
        },
        React.createElement(
          "span",
          { className: "s4-sqrt-wrap s7-hyp-sqrt-wrap" },
          React.createElement(
            "svg",
            {
              className: "s4-sqrt-svg",
              viewBox: "0 0 100 100",
              preserveAspectRatio: "none",
            },
            React.createElement("path", {
              d: "M 0 55 L 5 45 L 12 97 L 14 4 L 100 4",
              stroke: hypPink,
              strokeWidth: 3,
              fill: "none",
              strokeLinejoin: "round",
              strokeLinecap: "round",
              vectorEffect: "non-scaling-stroke",
            }),
          ),
          React.createElement(
            "span",
            {
              className: "s4-sqrt-content",
              style: { minWidth: radMinW },
            },
            radStr,
          ),
        ),
        React.createElement(
          "span",
          {
            style: {
              marginLeft: "0.32em",
              whiteSpace: "nowrap",
              color: hypPink,
              alignSelf: "flex-end",
            },
          },
          practiceUnitsSuffix(),
        ),
      ),
    );
  }

  function renderPracLabel(xm, ym, isFirst, highlight, opts) {
    const step7Top = opts && opts.step7Top;
    const pt = toSvg(xm, ym);
    const tx = step7Top
      ? pt.x + step7TopLabelDx
      : pt.x + (isFirst ? coordLabel34Dx : coordLabel77Dx);
    const ty = step7Top
      ? pt.y + step7TopLabelDy
      : pt.y + (isFirst ? coordLabel34Dy : coordLabel77Dy);
    const col = isFirst ? point1Color : point2Color;
    const baseFs = Math.round(34 * label34Scale);
    const emphFs = Math.round(40 * label34Scale);
    return React.createElement(
      "text",
      {
        x: tx,
        y: ty,
        fill: white,
        fontSize: baseFs,
        fontFamily: "system-ui, sans-serif",
        textAnchor: "start",
      },
      React.createElement("tspan", null, "("),
      React.createElement(
        "tspan",
        {
          fill: highlight === "x" ? col : white,
          fontWeight: highlight === "x" ? "700" : "500",
          fontSize: highlight === "x" ? emphFs : baseFs,
        },
        String(xm),
      ),
      React.createElement("tspan", null, ", "),
      React.createElement(
        "tspan",
        {
          fill: highlight === "y" ? col : white,
          fontWeight: highlight === "y" ? "700" : "500",
          fontSize: highlight === "y" ? emphFs : baseFs,
        },
        String(ym),
      ),
      React.createElement("tspan", null, ")"),
    );
  }

  function renderXyLabel(xm, ym, isFirst, highlight, opts) {
    const step7Top = opts && opts.step7Top;
    const pt = toSvg(xm, ym);
    const tx = step7Top
      ? pt.x + step7TopLabelDx
      : pt.x + (isFirst ? coordLabel34Dx : coordLabel77Dx);
    const ty = step7Top
      ? pt.y + step7TopLabelDy
      : pt.y + (isFirst ? coordLabel34Dy : coordLabel77Dy);
    const col = isFirst ? point1Color : point2Color;
    const baseFs = Math.round(34 * label34Scale);
    const emphFs = Math.round(40 * label34Scale);
    const sub = isFirst ? "\u2081" : "\u2082";
    return React.createElement(
      "text",
      {
        x: tx,
        y: ty,
        fill: white,
        fontSize: baseFs,
        fontFamily: "system-ui, sans-serif",
        textAnchor: "start",
      },
      React.createElement("tspan", null, "("),
      React.createElement(
        "tspan",
        {
          fill: highlight === "x" ? col : white,
          fontWeight: highlight === "x" ? "700" : "500",
          fontSize: highlight === "x" ? emphFs : baseFs,
        },
        "x" + sub,
      ),
      React.createElement("tspan", null, ", "),
      React.createElement(
        "tspan",
        {
          fill: highlight === "y" ? col : white,
          fontWeight: highlight === "y" ? "700" : "500",
          fontSize: highlight === "y" ? emphFs : baseFs,
        },
        "y" + sub,
      ),
      React.createElement("tspan", null, ")"),
    );
  }

  function renderSegmentQuestionZonePractice(
    pA,
    pB,
    midX,
    midY,
    showQ,
    onReveal,
  ) {
    return React.createElement(
      "g",
      {
        onClick:
          showQ && onReveal
            ? (e) => {
                e.stopPropagation();
                clickReveal(onReveal);
              }
            : undefined,
        className: showQ ? "q-box-clickable" : "",
        style: { cursor: showQ ? "pointer" : "default" },
      },
      React.createElement("line", {
        x1: pA.x,
        y1: pA.y,
        x2: pB.x,
        y2: pB.y,
        stroke: "transparent",
        strokeWidth: 22,
      }),
      showQ
        ? React.createElement(
            "g",
            { className: "step3-nudge-target" },
            renderQuestionMarkBox(
              midX + step3HypotenuseQDx,
              midY + step3HypotenuseQDy,
              white,
              true,
              undefined,
            ),
          )
        : null,
    );
  }

  function renderPracticeGeometry() {
    if (!practiceQuestion || (step !== 6 && step !== 7)) return null;
    const isXy = practiceQuestion.qtype === "xy";
    const { x1, y1, x2, y2 } = practiceQuestion;
    const pY = toSvg(x1, y1);
    const pB = toSvg(x2, y2);
    const pCorner = toSvg(x2, y1);
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    const xL = Math.min(pY.x, pCorner.x);
    const xR = Math.max(pY.x, pCorner.x);
    const horizMid = (xL + xR) / 2;
    const yHoriz = pY.y;
    const hypMid = { x: (pY.x + pB.x) / 2, y: (pY.y + pB.y) / 2 };
    const hypAngleDeg = (Math.atan2(pB.y - pY.y, pB.x - pY.x) * 180) / Math.PI;
    const hypSegLen = Math.hypot(pB.x - pY.x, pB.y - pY.y) || 1;
    const tnx = (pB.x - pY.x) / hypSegLen;
    const tny = (pB.y - pY.y) / hypSegLen;
    let nnx = -tny;
    let nny = tnx;
    const towardCorner = {
      x: pCorner.x - hypMid.x,
      y: pCorner.y - hypMid.y,
    };
    if (nnx * towardCorner.x + nny * towardCorner.y > 0) {
      nnx = -nnx;
      nny = -nny;
    }
    const hypLabelPerpPx = 38;
    const labelCx = hypMid.x + nnx * hypLabelPerpPx;
    const labelCy = hypMid.y + nny * hypLabelPerpPx;
    const hypTransform =
      "rotate(" + hypAngleDeg + " " + labelCx + " " + labelCy + ")";

    const horizExpr = isXy
      ? [
          React.createElement("tspan", { key: "h1", fill: point2Color }, "x\u2082"),
          React.createElement("tspan", { key: "h2", fill: white }, " \u2212 "),
          React.createElement("tspan", { key: "h3", fill: point1Color }, "x\u2081"),
        ]
      : [
          React.createElement("tspan", { key: "h1", fill: point2Color }, String(x2)),
          React.createElement("tspan", { key: "h2", fill: white }, " \u2212 "),
          React.createElement("tspan", { key: "h3", fill: point1Color }, String(x1)),
          React.createElement("tspan", { key: "h4", fill: white }, " = "),
          React.createElement("tspan", { key: "h5", fill: purpleText, fontWeight: "600" }, dx + " " + practiceUnitsSuffix()),
        ];

    const vertExpr = isXy
      ? [
          React.createElement("tspan", { key: "v1", fill: point2Color }, "y\u2082"),
          React.createElement("tspan", { key: "v2", fill: white }, " \u2212 "),
          React.createElement("tspan", { key: "v3", fill: point1Color }, "y\u2081"),
        ]
      : [
          React.createElement("tspan", { key: "v1", fill: point2Color }, String(y2)),
          React.createElement("tspan", { key: "v2", fill: white }, " \u2212 "),
          React.createElement("tspan", { key: "v3", fill: point1Color }, String(y1)),
          React.createElement("tspan", { key: "v4", fill: white }, " = "),
          React.createElement("tspan", { key: "v5", fill: greenText, fontWeight: "600" }, dy + " " + practiceUnitsSuffix()),
        ];

    const hypDistStr = formatHypLabelUnits(dx, dy);
    const hypPerfect = hypDistIsPerfectSquare(dx, dy);

    const horizLabelFinal = isXy
      ? [
          React.createElement("tspan", { key: "hf1", fill: point2Color }, "x\u2082"),
          React.createElement("tspan", { key: "hf2", fill: white }, " \u2212 "),
          React.createElement("tspan", { key: "hf3", fill: point1Color }, "x\u2081"),
        ]
      : React.createElement("tspan", { fill: purpleText, fontWeight: "600" }, dx + " " + practiceUnitsSuffix());

    const vertLabelFinal = isXy
      ? [
          React.createElement("tspan", { key: "vf1", fill: point2Color }, "y\u2082"),
          React.createElement("tspan", { key: "vf2", fill: white }, " \u2212 "),
          React.createElement("tspan", { key: "vf3", fill: point1Color }, "y\u2081"),
        ]
      : React.createElement("tspan", { fill: greenText, fontWeight: "600" }, dy + " " + practiceUnitsSuffix());

    const topPointLabel = y1 >= y2;

    const labelRenderer = isXy ? renderXyLabel : renderPracLabel;

    if (step === 6) {
      return React.createElement(
        React.Fragment,
        null,
        React.createElement("circle", {
          cx: pY.x,
          cy: pY.y,
          r: 8,
          fill: point1Color,
        }),
        React.createElement("circle", {
          cx: pB.x,
          cy: pB.y,
          r: 8,
          fill: point2Color,
        }),
        React.createElement("line", {
          x1: pY.x,
          y1: pY.y,
          x2: pB.x,
          y2: pB.y,
          stroke: white,
          strokeWidth: 3,
        }),
        labelRenderer(x1, y1, true, null, {
          step7Top: topPointLabel,
        }),
        labelRenderer(x2, y2, false, null, {
          step7Top: !topPointLabel,
        }),
      );
    }

    const coordHL =
      !s7HypDone && s7VertDone ? "y" : !s7VertDone && s7HorizDone ? "x" : null;

    const pieces = [];

    pieces.push(
      React.createElement(
        "g",
        { key: "hmeas", className: isXy ? "xy-horiz-label-src" : "" },
        renderHorizontalMeasureArrow(yHoriz, pY.x, pCorner.x, {
          color: white,
          blink: !s7HorizDone,
          opacity: 1,
          labelBelow: true,
          labelNode:
            s7HorizDone && !s7HypDone
              ? horizExpr
              : s7HypDone
                ? horizLabelFinal
                : null,
          qCenterX: horizMid,
          qCenterY: yHoriz + 46,
          showQ: !s7HorizDone,
          onQClick: onS7HorizReveal,
        }),
      ),
    );

    if (s7HorizDone) {
      const yLo = Math.min(pCorner.y, pB.y);
      const yHi = Math.max(pCorner.y, pB.y);
      pieces.push(
        React.createElement(
          "g",
          { key: "vmeas", className: isXy ? "xy-vert-label-src" : "" },
          renderVerticalMeasureArrow(pCorner.x, yLo, yHi, {
            color: white,
            blink: !s7VertDone,
            opacity: 1,
            labelRight: true,
            labelRightGap: step3VerticalLegLabelGap,
            labelNode:
              s7VertDone && !s7HypDone
                ? vertExpr
                : s7HypDone
                  ? vertLabelFinal
                  : null,
            qCenterX: pCorner.x + 36,
            qCenterY: (yLo + yHi) / 2,
            showQ: !s7VertDone,
            onQClick: onS7VertReveal,
          }),
        ),
      );
    }

    pieces.push(
      React.createElement("line", {
        key: "hypLine",
        x1: pY.x,
        y1: pY.y,
        x2: pB.x,
        y2: pB.y,
        stroke: white,
        strokeWidth: 3,
        pointerEvents: "none",
      }),
    );

    pieces.push(
      React.createElement("circle", {
        key: "c1",
        cx: pY.x,
        cy: pY.y,
        r: 8,
        fill: point1Color,
      }),
    );
    pieces.push(
      React.createElement("circle", {
        key: "c2",
        cx: pB.x,
        cy: pB.y,
        r: 8,
        fill: point2Color,
      }),
    );

    pieces.push(
      React.createElement(
        "g",
        { key: "lab1" },
        labelRenderer(x1, y1, true, coordHL, {
          step7Top: topPointLabel,
        }),
      ),
    );
    pieces.push(
      React.createElement(
        "g",
        { key: "lab2" },
        labelRenderer(x2, y2, false, coordHL, {
          step7Top: !topPointLabel,
        }),
      ),
    );

    if (!s7HypDone) {
      pieces.push(
        React.createElement(
          "g",
          { key: "hypq" },
          renderSegmentQuestionZonePractice(
            pY,
            pB,
            hypMid.x,
            hypMid.y,
            s7VertDone,
            isXy ? onS7HypReveal : onS7HypReveal,
          ),
        ),
      );
    } else if (isXy && !s7XyAnimDone) {
      pieces.push(
        React.createElement(
          "g",
          { key: "hyplab", transform: hypTransform },
          renderXyHypAnimLabel(labelCx, labelCy),
        ),
      );
    } else {
      if (isXy) {
        pieces.push(
          React.createElement(
            "g",
            { key: "hyplab", transform: hypTransform },
            renderXyHypForeignLabel(labelCx, labelCy),
          ),
        );
      } else {
        pieces.push(
          React.createElement(
            "g",
            {
              key: "hyplab",
              transform: hypTransform,
            },
            hypPerfect
              ? React.createElement(
                  "text",
                  {
                    x: labelCx,
                    y: labelCy,
                    fill: hypPink,
                    fontSize: 34,
                    fontWeight: "700",
                    textAnchor: "middle",
                    dominantBaseline: "middle",
                    fontFamily: "system-ui, sans-serif",
                    pointerEvents: "none",
                  },
                  hypDistStr,
                )
              : renderHypSqrtForeignLabel(dx, dy, labelCx, labelCy),
          ),
        );
      }
    }

    return React.createElement(React.Fragment, null, ...pieces);
  }

  function renderXyHypForeignLabel(labelCx, labelCy) {
    const foW = 340;
    const foH = 62;
    return React.createElement(
      "foreignObject",
      {
        x: labelCx - foW / 2,
        y: labelCy - foH / 2,
        width: foW,
        height: foH,
        style: { overflow: "visible", pointerEvents: "none" },
      },
      React.createElement(
        "div",
        {
          xmlns: "http://www.w3.org/1999/xhtml",
          className: "xy-hyp-formula-final",
        },
        React.createElement(
          "span",
          { className: "s4-sqrt-wrap xy-sqrt-wrap" },
          React.createElement(
            "svg",
            {
              className: "s4-sqrt-svg",
              viewBox: "0 0 100 100",
              preserveAspectRatio: "none",
            },
            React.createElement("path", {
              d: "M 0 55 L 5 45 L 12 97 L 14 4 L 100 4",
              stroke: hypPink,
              strokeWidth: 3,
              fill: "none",
              strokeLinejoin: "round",
              strokeLinecap: "round",
              vectorEffect: "non-scaling-stroke",
            }),
          ),
          React.createElement(
            "span",
            { className: "s4-sqrt-content xy-sqrt-content" },
            React.createElement(
              "span",
              { className: "xy-sqrt-term" },
              "(",
              React.createElement("span", { style: { color: point2Color } }, "x\u2082"),
              " \u2212 ",
              React.createElement("span", { style: { color: point1Color } }, "x\u2081"),
              ")",
              React.createElement("sup", null, "2"),
            ),
            React.createElement("span", { className: "xy-sqrt-plus" }, " + "),
            React.createElement(
              "span",
              { className: "xy-sqrt-term" },
              "(",
              React.createElement("span", { style: { color: point2Color } }, "y\u2082"),
              " \u2212 ",
              React.createElement("span", { style: { color: point1Color } }, "y\u2081"),
              ")",
              React.createElement("sup", null, "2"),
            ),
          ),
        ),
      ),
    );
  }

  function renderXyHypAnimLabel(lCx, lCy) {
    const foW = 360;
    const foH = 68;
    const sqrtVisible = xyAnimPhase >= 0;
    const xTermVisible = xyAnimPhase >= 2;
    const plusVisible = xyAnimPhase >= 3;
    const yTermVisible = xyAnimPhase >= 5;

    return React.createElement(
      "foreignObject",
      {
        x: lCx - foW / 2,
        y: lCy - foH / 2,
        width: foW,
        height: foH,
        style: { overflow: "visible", pointerEvents: "none" },
      },
      React.createElement(
        "div",
        {
          xmlns: "http://www.w3.org/1999/xhtml",
          className: "xy-anim-fo-inner",
          style: { opacity: sqrtVisible ? 1 : 0, transition: "opacity 0.45s ease" },
        },
        React.createElement(
          "span",
          { className: "s4-sqrt-wrap xy-anim-sqrt-final" },
          React.createElement("svg", {
            className: "s4-sqrt-svg",
            viewBox: "0 0 100 100",
            preserveAspectRatio: "none",
          }, React.createElement("path", {
            d: "M 0 55 L 5 45 L 12 97 L 14 4 L 100 4",
            stroke: hypPink,
            strokeWidth: 3,
            fill: "none",
            strokeLinejoin: "round",
            strokeLinecap: "round",
            vectorEffect: "non-scaling-stroke",
          })),
          React.createElement(
            "span",
            { className: "s4-sqrt-content xy-anim-sqrt-content-fixed" },
            React.createElement(
              "span",
              {
                className: "xy-anim-x-slot",
                style: { visibility: xTermVisible ? "visible" : "hidden" },
              },
              "(",
              React.createElement("span", { style: { color: point2Color } }, "x\u2082"),
              " \u2212 ",
              React.createElement("span", { style: { color: point1Color } }, "x\u2081"),
              ")",
              React.createElement("sup", null, "2"),
            ),
            React.createElement(
              "span",
              {
                className: "xy-anim-plus-slot",
                style: { visibility: plusVisible ? "visible" : "hidden", margin: "0 0.15em" },
              },
              "+",
            ),
            React.createElement(
              "span",
              {
                className: "xy-anim-y-slot",
                style: { visibility: yTermVisible ? "visible" : "hidden" },
              },
              "(",
              React.createElement("span", { style: { color: point2Color } }, "y\u2082"),
              " \u2212 ",
              React.createElement("span", { style: { color: point1Color } }, "y\u2081"),
              ")",
              React.createElement("sup", null, "2"),
            ),
          ),
        ),
      ),
    );
  }

  const marginAxes = 8;
  const gridEls = [];
  for (let i = 0; i <= plotUnits; i++) {
    const xi = originX + i * unit;
    gridEls.push(
      React.createElement("line", {
        key: "gv-" + i,
        x1: xi,
        y1: topPad,
        x2: xi,
        y2: originY,
        stroke: gridMajor,
        strokeWidth: 1,
      }),
    );
    const yi = originY - i * unit;
    gridEls.push(
      React.createElement("line", {
        key: "gh-" + i,
        x1: originX,
        y1: yi,
        x2: originX + plotW,
        y2: yi,
        stroke: gridMajor,
        strokeWidth: 1,
      }),
    );
  }

  const axisTicks = [];
  for (let i = 0; i <= plotUnits; i++) {
    const px = originX + i * unit;
    axisTicks.push(
      React.createElement(
        "text",
        {
          key: "tx-" + i,
          x: px,
          y: originY + 22,
          fill: "#fff",
          fontSize: 23,
          fontWeight: "bold",
          textAnchor: "middle",
          fontFamily: "system-ui, sans-serif",
        },
        String(i),
      ),
    );
    if (i !== 0) {
      const py = originY - i * unit;
      axisTicks.push(
        React.createElement(
          "text",
          {
            key: "ty-" + i,
            x: originX - 18,
            y: py + 5,
            fill: "#fff",
            fontSize: 23,
            fontWeight: "bold",
            textAnchor: "middle",
            fontFamily: "system-ui, sans-serif",
          },
          String(i),
        ),
      );
    }
  }

  /* ── SVG element with grid + axes + per-step overlays ── */
  const svgElement = React.createElement(
    "svg",
    {
      viewBox: "0 0 " + svgW + " " + svgH,
      className: "grid-svg distance-coordinate-svg",
      preserveAspectRatio: "xMidYMid meet",
    },
    React.createElement(
      "defs",
      null,
      ["yellow", "blue", "white"].map((name) =>
        React.createElement(
          "marker",
          {
            id: "arrow-" + name + "-end",
            key: "m-end-" + name,
            markerWidth: 6,
            markerHeight: 6,
            refX: 5,
            refY: 3,
            orient: "auto",
            markerUnits: "strokeWidth",
          },
          React.createElement("path", {
            d: "M0,0 L6,3 L0,6 z",
            fill:
              name === "yellow"
                ? point1Color
                : name === "blue"
                  ? point2Color
                  : white,
          }),
        ),
      ),
      ["yellow", "blue", "white"].map((name) =>
        React.createElement(
          "marker",
          {
            id: "arrow-" + name + "-start",
            key: "m-start-" + name,
            markerWidth: 6,
            markerHeight: 6,
            refX: 1,
            refY: 3,
            orient: "auto",
            markerUnits: "strokeWidth",
          },
          React.createElement("path", {
            d: "M6,0 L0,3 L6,6 z",
            fill:
              name === "yellow"
                ? point1Color
                : name === "blue"
                  ? point2Color
                  : white,
          }),
        ),
      ),
    ),
    gridEls,
    React.createElement("line", {
      x1: originX - marginAxes,
      y1: originY,
      x2: originX + plotW + marginAxes,
      y2: originY,
      stroke: axisColor,
      strokeWidth: 2,
      markerEnd: "url(#arrow-white-end)",
    }),
    React.createElement("line", {
      x1: originX,
      y1: originY + marginAxes,
      x2: originX,
      y2: topPad - marginAxes,
      stroke: axisColor,
      strokeWidth: 2,
      markerEnd: "url(#arrow-white-end)",
    }),
    axisTicks,
    step === 1 ? renderStep1() : null,
    step === 2 ? renderStep2() : null,
    step === 3 ? renderStep3() : null,
    step === 4 || step === 5 ? renderStep4Svg() : null,
    step === 6 || step === 7 ? renderPracticeGeometry() : null,
  );

  /* ── Step 4 & 5: calculation panel (HTML overlay, right side) ── */
  if (step === 4) {
    return React.createElement(Step4Layout, {
      svgElement: svgElement,
      s4Phase: s4Phase,
      onS4PhaseAdvance: onS4PhaseAdvance,
      isStep5: false,
      onS5AnimDone: onS5AnimDone,
    });
  }
  if (step === 5) {
    return React.createElement(Step4Layout, {
      svgElement: svgElement,
      s4Phase: 5,
      onS4PhaseAdvance: onS4PhaseAdvance,
      isStep5: true,
      onS5AnimDone: onS5AnimDone,
    });
  }

  if (step === 6 && practiceQuestion) {
    const pc = APP_DATA.practiceCopy;
    return React.createElement(Step6Layout, {
      svgElement: svgElement,
      problemTitle: practiceQuestion.title,
      problemStatement: practiceQuestion.statement,
      continueLabel: pc.continueButton,
      onContinue: onPracticeContinue,
    });
  }

  /* ── Steps 1–3 & 7: centered SVG ── */
  if (isXyAnimActive) {
    return React.createElement(
      "div",
      {
        ref: xyContainerRef,
        className:
          "main-canvas-container distance-applet-canvas single-svg-canvas xy-anim-container",
      },
      svgElement,
      React.createElement("span", {
        ref: xyXCloneRef,
        className: "s4-flying-clone xy-flying-clone",
        style: { display: "none", color: "#ffffff" },
      },
        React.createElement("span", { style: { color: point2Color } }, "x\u2082"),
        " \u2212 ",
        React.createElement("span", { style: { color: point1Color } }, "x\u2081"),
      ),
      React.createElement("span", {
        ref: xyYCloneRef,
        className: "s4-flying-clone xy-flying-clone",
        style: { display: "none", color: "#ffffff" },
      },
        React.createElement("span", { style: { color: point2Color } }, "y\u2082"),
        " \u2212 ",
        React.createElement("span", { style: { color: point1Color } }, "y\u2081"),
      ),
    );
  }

  return React.createElement(
    "div",
    {
      className:
        "main-canvas-container distance-applet-canvas single-svg-canvas",
    },
    svgElement,
  );
};
