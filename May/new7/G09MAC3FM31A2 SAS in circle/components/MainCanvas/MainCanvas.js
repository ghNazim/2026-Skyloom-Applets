const SVG_VIEWBOX = "0 0 800 520";
const CENTER = { x: 400, y: 205 };
const RADIUS = 155;
const POINT_ANGLES = { A: -128, E: 52, B: 176, D: -4 };

const COLORS = {
  circle: "#d5963c",
  blue: "#55c3d2",
  green: "#14f018",
  orange: "#ffa32b",
  purple: "#9d5cff",
  white: "#ffffff",
  grey: "#606060",
  yellow: "#fff200",
};

const TAP_HINT = {
  size: 48,
  offsetY: 30,
};

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function degToRad(deg) {
  return (deg * Math.PI) / 180;
}

function pointOnCircle(angleDeg) {
  const a = degToRad(angleDeg);
  return {
    x: CENTER.x + RADIUS * Math.cos(a),
    y: CENTER.y + RADIUS * Math.sin(a),
  };
}

function getCirclePoints() {
  return {
    A: pointOnCircle(POINT_ANGLES.A),
    B: pointOnCircle(POINT_ANGLES.B),
    C: CENTER,
    D: pointOnCircle(POINT_ANGLES.D),
    E: pointOnCircle(POINT_ANGLES.E),
  };
}

function labelPosition(key, pts) {
  const offsets = {
    A: { x: -24, y: -32 },
    B: { x: -36, y: 12 },
    C: { x: 27, y: -18 },
    D: { x: 36, y: -5 },
    E: { x: 24, y: 32 },
  };
  return { x: pts[key].x + offsets[key].x, y: pts[key].y + offsets[key].y };
}

function lineEnd(angleDeg) {
  const a = degToRad(angleDeg);
  return {
    x: CENTER.x + RADIUS * Math.cos(a),
    y: CENTER.y + RADIUS * Math.sin(a),
  };
}

function trianglePath(a, b, c) {
  return `M ${a.x} ${a.y} L ${b.x} ${b.y} L ${c.x} ${c.y} Z`;
}

function normalizeDiff(diff) {
  while (diff <= -Math.PI) diff += Math.PI * 2;
  while (diff > Math.PI) diff -= Math.PI * 2;
  return diff;
}

function describeSector(vertex, p1, p2, radius) {
  let a1 = Math.atan2(p1.y - vertex.y, p1.x - vertex.x);
  let a2 = Math.atan2(p2.y - vertex.y, p2.x - vertex.x);
  let diff = normalizeDiff(a2 - a1);
  if (diff < 0) {
    const t = a1;
    a1 = a2;
    a2 = t;
    diff = -diff;
  }
  const start = {
    x: vertex.x + radius * Math.cos(a1),
    y: vertex.y + radius * Math.sin(a1),
  };
  const end = {
    x: vertex.x + radius * Math.cos(a2),
    y: vertex.y + radius * Math.sin(a2),
  };
  const large = diff > Math.PI ? 1 : 0;
  return `M ${vertex.x} ${vertex.y} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${large} 1 ${end.x} ${end.y} Z`;
}

const INFO = {
  x: 225,
  y: 398,
  w: 350,
  h: 154,
  rowY: [434, 476, 518],
  leftX: 315,
  eqX: 400,
  rightX: 485,
};

function sideTargets(segment) {
  const side = {
    AC: { row: 0, x: INFO.leftX },
    CD: { row: 0, x: INFO.rightX },
    CE: { row: 1, x: INFO.leftX },
    BC: { row: 1, x: INFO.rightX },
  }[segment];
  const y = INFO.rowY[side.row];
  return segment.split("").map((ch, i) => ({
    text: ch,
    x: side.x + (i === 0 ? -13 : 13),
    y,
  }));
}

function angleTargets(segment) {
  const side = segment === "ACB" ? INFO.leftX : INFO.rightX;
  const letters = segment.split("");
  return letters.map((ch, i) => ({
    text: ch,
    x: side - 9 + i * 18,
    y: INFO.rowY[2],
  }));
}

const MainCanvas = ({
  step,
  onSetNextEnabled,
  onUpdateTexts,
  onSetNextLabel,
  onHideNudge,
  onAnimationStateChange,
}) => {
  const { useState, useEffect, useMemo, useCallback, useRef } = React;

  const pts = useMemo(() => getCirclePoints(), []);
  const circleClickRef = useRef(null);
  const rotatingAngleRef = useRef(null);

  const [mcqState, setMcqState] = useState({});
  const [actionPhase, setActionPhase] = useState("radiiIntro");
  const [isAnimating, setIsAnimating] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);
  const [infoParts, setInfoParts] = useState({
    AC: false,
    CD: false,
    eq1: false,
    CE: false,
    BC: false,
    eq2: false,
    angleLeft: false,
    angleRight: false,
    eq3: false,
  });
  const [observedLines, setObservedLines] = useState([]);
  const [rotatingAngle, setRotatingAngle] = useState(null);
  const [rotatingColor, setRotatingColor] = useState(COLORS.green);
  const [radiusMuted, setRadiusMuted] = useState(false);
  const [showAngles, setShowAngles] = useState(false);
  const [angleBlinking, setAngleBlinking] = useState(false);
  const [flyingClones, setFlyingClones] = useState([]);
  const [radiusDone, setRadiusDone] = useState(false);

  useEffect(() => {
    if (onAnimationStateChange) onAnimationStateChange(isAnimating);
  }, [isAnimating, onAnimationStateChange]);

  useEffect(() => {
    if (step !== 5 || radiusDone) {
      if (onHideNudge) onHideNudge();
    }
    if (step === 6 || step === 7 || step === 8) {
      setInfoVisible(true);
      setInfoParts((prev) => ({
        ...prev,
        AC: true,
        CD: true,
        eq1: true,
        CE: true,
        BC: true,
        eq2: true,
      }));
    }
    if (step === 6) {
      setShowAngles(true);
      setAngleBlinking(!infoParts.angleLeft || !infoParts.angleRight);
    }
    if (step === 7 || step === 8) {
      setShowAngles(true);
      setAngleBlinking(false);
    }
    if (step === 8) {
      setInfoParts({
        AC: true,
        CD: true,
        eq1: true,
        CE: true,
        BC: true,
        eq2: true,
        angleLeft: true,
        angleRight: true,
        eq3: true,
      });
      if (onSetNextLabel) onSetNextLabel(APP_DATA.steps[8].nextText);
      onSetNextEnabled(true);
    }
  }, [
    infoParts.angleLeft,
    infoParts.angleRight,
    onHideNudge,
    onSetNextEnabled,
    onSetNextLabel,
    radiusDone,
    step,
  ]);

  const flyLetters = useCallback(
    (items, color) => {
      return new Promise((resolve) => {
        if (!items.length) {
          resolve();
          return;
        }
        if (typeof playSound === "function") playSound("swoosh");
        const batchId = Date.now() + "-" + Math.random();
        const anim = { t: 0 };
        const clones = items.map((item, index) => ({
          id: `${batchId}-${index}`,
          text: item.text,
          from: item.from,
          to: item.to,
          color,
          t: 0,
        }));
        setFlyingClones((prev) => [...prev, ...clones]);
        gsap.to(anim, {
          t: 1,
          duration: 0.8,
          ease: "power2.inOut",
          onUpdate: () => {
            setFlyingClones((prev) =>
              prev.map((clone) =>
                clone.id.indexOf(batchId) === 0 ? { ...clone, t: anim.t } : clone,
              ),
            );
          },
          onComplete: () => {
            setFlyingClones((prev) =>
              prev.filter((clone) => clone.id.indexOf(batchId) !== 0),
            );
            resolve();
          },
        });
      });
    },
    [],
  );

  const flySideName = useCallback(
    async (segment) => {
      const labelPts = segment.split("").map((ch) => labelPosition(ch, pts));
      const targets = sideTargets(segment);
      await flyLetters(
        targets.map((target, index) => ({
          text: target.text,
          from: labelPts[index],
          to: { x: target.x, y: target.y },
        })),
        COLORS.green,
      );
      setInfoParts((prev) => ({ ...prev, [segment]: true }));
    },
    [flyLetters, pts],
  );

  const flyAngleName = useCallback(
    async (segment, partKey) => {
      const targets = angleTargets(segment);
      await flyLetters(
        targets.map((target) => ({
          text: target.text,
          from: labelPosition(target.text, pts),
          to: { x: target.x, y: target.y },
        })),
        COLORS.purple,
      );
      setInfoParts((prev) => ({ ...prev, [partKey]: true }));
    },
    [flyLetters, pts],
  );

  const rotateTo = useCallback((targetAngle) => {
    return new Promise((resolve) => {
      setRotatingColor(COLORS.yellow);
      const anim = {
        angle:
          rotatingAngleRef.current === null || rotatingAngleRef.current === undefined
            ? POINT_ANGLES.A
            : rotatingAngleRef.current,
      };
      gsap.to(anim, {
        angle: targetAngle,
        duration: 0.9,
        ease: "power1.inOut",
        onUpdate: () => {
          rotatingAngleRef.current = anim.angle;
          setRotatingAngle(anim.angle);
        },
        onComplete: () => {
          rotatingAngleRef.current = targetAngle;
          setRotatingAngle(targetAngle);
          setRotatingColor(COLORS.green);
          resolve();
        },
      });
    });
  }, []);

  const restOnRadius = useCallback(
    async (lineKey, angle) => {
      setRotatingAngle(angle);
      rotatingAngleRef.current = angle;
      setRotatingColor(COLORS.green);
      setObservedLines((prev) => (prev.includes(lineKey) ? prev : [...prev, lineKey]));
      await wait(220);
      await flySideName(lineKey);
      await wait(520);
    },
    [flySideName],
  );

  const runRadiusObservation = useCallback(async () => {
    if (isAnimating || radiusDone || step !== 5) return;
    if (onHideNudge) onHideNudge();
    setIsAnimating(true);
    onSetNextEnabled(false);
    setRadiusMuted(true);
    setInfoVisible(true);
    setActionPhase("radiiIntro");

    await wait(500);
    await restOnRadius("AC", POINT_ANGLES.A);
    await rotateTo(POINT_ANGLES.D);
    await restOnRadius("CD", POINT_ANGLES.D);
    setInfoParts((prev) => ({ ...prev, eq1: true }));
    await wait(300);
    await rotateTo(POINT_ANGLES.E);
    await restOnRadius("CE", POINT_ANGLES.E);
    await rotateTo(POINT_ANGLES.B);
    await restOnRadius("BC", POINT_ANGLES.B);
    setInfoParts((prev) => ({ ...prev, eq2: true }));
    await wait(250);

    setRotatingAngle(null);
    rotatingAngleRef.current = null;
    setRadiusMuted(false);
    setRadiusDone(true);
    setActionPhase("radiiDone");
    onUpdateTexts(undefined, APP_DATA.steps[5].navAfterObservation);
    onSetNextEnabled(true);
    setIsAnimating(false);
  }, [
    isAnimating,
    onHideNudge,
    onSetNextEnabled,
    onUpdateTexts,
    radiusDone,
    restOnRadius,
    rotateTo,
    step,
  ]);

  const runAngleReveal = useCallback(async () => {
    setIsAnimating(true);
    setAngleBlinking(false);
    await wait(200);
    await flyAngleName("ACB", "angleLeft");
    await flyAngleName("ECD", "angleRight");
    await wait(250);
    setInfoParts((prev) => ({ ...prev, eq3: true }));
    await wait(200);
    onUpdateTexts(undefined, APP_DATA.steps[6].navAfterCorrect);
    onSetNextEnabled(true);
    setIsAnimating(false);
  }, [flyAngleName, onSetNextEnabled, onUpdateTexts]);

  const getMcqForStep = () => {
    if (step === 4) return APP_DATA.mcqs.congruentParts;
    if (step === 6) return APP_DATA.mcqs.verticalAngles;
    if (step === 7) return APP_DATA.mcqs.sasRule;
    return null;
  };

  const handleMcqSelect = useCallback(
    (index) => {
      const mcq = getMcqForStep();
      if (!mcq) return;
      const isCorrect = index === mcq.answerIndex;
      if (typeof playSound === "function") playSound(isCorrect ? "correct" : "wrong");
      setMcqState((prev) => ({
        ...prev,
        [step]: {
          selectedIndex: index,
          resultState: isCorrect ? "correct" : "wrong",
          feedbackText: mcq.feedbacks[index],
          feedbackType: isCorrect ? "correct" : "wrong",
          showFeedback: true,
        },
      }));
      if (!isCorrect) return;

      if (step === 4) {
        onUpdateTexts(undefined, APP_DATA.steps[4].navAfterCorrect);
        onSetNextEnabled(true);
      }
      if (step === 6) {
        runAngleReveal();
      }
      if (step === 7) {
        onUpdateTexts(undefined, APP_DATA.steps[7].navAfterCorrect);
        onSetNextEnabled(true);
      }
    },
    [onSetNextEnabled, onUpdateTexts, runAngleReveal, step],
  );

  const renderMcq = () => {
    const mcq = getMcqForStep();
    const state = mcqState[step] || {};
    if (!mcq) return null;
    return React.createElement(McqPanel, {
      title: mcq.title,
      options: mcq.options,
      selectedIndex:
        state.selectedIndex === undefined ? null : state.selectedIndex,
      resultState: state.resultState || null,
      showFeedback: !!state.showFeedback,
      feedbackText: state.feedbackText || "",
      feedbackType: state.feedbackType || null,
      disabled: isAnimating,
      onSelect: handleMcqSelect,
    });
  };

  const renderTextPanel = () => {
    let text = "";
    let className = "action-text";
    if (step === 5) text = APP_DATA.actionText[actionPhase];
    if (step === 8) {
      text = APP_DATA.actionText.final;
      className += " final-proof";
    }
    return React.createElement("div", {
      className,
      dangerouslySetInnerHTML: { __html: handleComma(text) },
    });
  };

  const renderActionPanel = () => {
    const visible = step >= 4;
    let key = `empty-${step}`;
    let content = null;

    if (step === 4 || step === 6 || step === 7) {
      key = `mcq-${step}`;
      content = renderMcq();
    }
    if (step === 5 || step === 8) {
      key = `text-${step}-${actionPhase}`;
      content = renderTextPanel();
    }

    return React.createElement(
      "div",
      { className: "action-column" + (visible ? " is-visible" : "") },
      React.createElement(
        "div",
        { className: "action-panel" },
        React.createElement("div", { key, className: "action-content-fade" }, content),
      ),
    );
  };

  const lineProps = (key) => {
    const observed = observedLines.includes(key);
    return {
      stroke: observed ? COLORS.green : COLORS.white,
      strokeWidth: observed ? 6 : 4,
      strokeOpacity: radiusMuted && !observed ? 0.35 : 1,
    };
  };

  const renderLine = (key, p1, p2) => {
    const props = lineProps(key);
    return React.createElement("line", {
      key,
      x1: p1.x,
      y1: p1.y,
      x2: p2.x,
      y2: p2.y,
      stroke: props.stroke,
      strokeWidth: props.strokeWidth,
      strokeOpacity: props.strokeOpacity,
      strokeLinecap: "round",
    });
  };

  const renderInfoText = (text, key, x, y, visible, color) =>
    React.createElement(
      "text",
      {
        key,
        x,
        y,
        fill: color,
        fontSize: 36,
        fontWeight: 800,
        textAnchor: "middle",
        dominantBaseline: "middle",
        style: { opacity: visible ? 1 : 0 },
      },
      text,
    );

  const renderInfoBox = () => {
    if (!infoVisible) return null;
    const info = APP_DATA.infoBox;
    return React.createElement(
      "g",
      { className: "info-box" },
      React.createElement("rect", {
        x: INFO.x,
        y: INFO.y,
        width: INFO.w,
        height: INFO.h,
        rx: 8,
        fill: "rgba(5, 56, 92, 0.92)",
      }),
      renderInfoText(info.line1Left, "AC", INFO.leftX, INFO.rowY[0], infoParts.AC, COLORS.green),
      renderInfoText("=", "eq1", INFO.eqX, INFO.rowY[0], infoParts.eq1, COLORS.white),
      renderInfoText(info.line1Right, "CD", INFO.rightX, INFO.rowY[0], infoParts.CD, COLORS.green),
      renderInfoText(info.line2Left, "CE", INFO.leftX, INFO.rowY[1], infoParts.CE, COLORS.green),
      renderInfoText("=", "eq2", INFO.eqX, INFO.rowY[1], infoParts.eq2, COLORS.white),
      renderInfoText(info.line2Right, "BC", INFO.rightX, INFO.rowY[1], infoParts.BC, COLORS.green),
      renderInfoText(info.line3Left, "ang1", INFO.leftX, INFO.rowY[2], infoParts.angleLeft, COLORS.purple),
      renderInfoText("=", "eq3", INFO.eqX, INFO.rowY[2], infoParts.eq3, COLORS.white),
      renderInfoText(info.line3Right, "ang2", INFO.rightX, INFO.rowY[2], infoParts.angleRight, COLORS.purple),
    );
  };

  const renderFlyingClones = () => {
    if (!flyingClones.length) return null;
    return React.createElement(
      "g",
      { className: "flying-clones" },
      flyingClones.map((clone) => {
        const x = clone.from.x + (clone.to.x - clone.from.x) * clone.t;
        const y = clone.from.y + (clone.to.y - clone.from.y) * clone.t;
        return React.createElement(
          "text",
          {
            key: clone.id,
            x,
            y,
            fill: clone.color,
            fontSize: 32,
            fontWeight: 800,
            textAnchor: "middle",
            dominantBaseline: "middle",
          },
          clone.text,
        );
      }),
    );
  };

  const renderDiagram = () => {
    const labels = APP_DATA.labels;
    const circleClass = step === 2 ? "circle-shape blink-highlight" : "circle-shape";
    const centerClass = step === 2 ? "center-point blink-center" : "center-point";
    const triangleAbcClass =
      step === 3 ? "triangle-fill triangle-abc step3-blink" : "triangle-fill triangle-abc";
    const triangleDecClass =
      step === 3 ? "triangle-fill triangle-dec step3-blink" : "triangle-fill triangle-dec";
    const circleMuted = step === 3 || radiusMuted;
    const pointLabels = ["A", "B", "C", "D", "E"];
    const rotatingEnd = rotatingAngle === null ? null : lineEnd(rotatingAngle);

    return React.createElement(
      "svg",
      {
        className: "main-svg",
        viewBox: SVG_VIEWBOX,
        preserveAspectRatio: "xMidYMid meet",
      },
      React.createElement(
        "g",
        { className: "circle-diagram" },
        React.createElement("circle", {
          className: circleClass,
          cx: CENTER.x,
          cy: CENTER.y,
          r: RADIUS,
          fill: circleMuted ? COLORS.grey : COLORS.circle,
          fillOpacity: circleMuted ? 0.38 : 0.72,
          stroke: circleMuted && step === 3 ? COLORS.grey : COLORS.white,
          strokeWidth: 4,
          strokeOpacity: circleMuted && step === 3 ? 0.45 : 1,
        }),
        React.createElement("path", {
          className: triangleAbcClass,
          d: trianglePath(pts.A, pts.B, pts.C),
          fill: step === 3 ? COLORS.green : COLORS.blue,
          fillOpacity: radiusMuted ? 0.42 : 1,
        }),
        React.createElement("path", {
          className: triangleDecClass,
          d: trianglePath(pts.D, pts.E, pts.C),
          fill: step === 3 ? COLORS.orange : COLORS.blue,
          fillOpacity: radiusMuted ? 0.42 : 1,
        }),
        renderLine("AE", pts.A, pts.E),
        renderLine("BD", pts.B, pts.D),
        renderLine("AB", pts.A, pts.B),
        renderLine("DE", pts.D, pts.E),
        observedLines.includes("AC") &&
          renderLine("AC", pts.A, pts.C),
        observedLines.includes("CD") &&
          renderLine("CD", pts.C, pts.D),
        observedLines.includes("CE") &&
          renderLine("CE", pts.C, pts.E),
        observedLines.includes("BC") &&
          renderLine("BC", pts.B, pts.C),
        showAngles &&
          React.createElement(
            "g",
            { className: angleBlinking ? "angle-sectors angle-blink" : "angle-sectors" },
            React.createElement("path", {
              d: describeSector(pts.C, pts.A, pts.B, 44),
              fill: COLORS.purple,
              fillOpacity: 0.72,
              stroke: COLORS.white,
              strokeWidth: 2,
            }),
            React.createElement("path", {
              d: describeSector(pts.C, pts.E, pts.D, 44),
              fill: COLORS.purple,
              fillOpacity: 0.72,
              stroke: COLORS.white,
              strokeWidth: 2,
            }),
          ),
        rotatingEnd &&
          React.createElement("line", {
            x1: CENTER.x,
            y1: CENTER.y,
            x2: rotatingEnd.x,
            y2: rotatingEnd.y,
            stroke: rotatingColor,
            strokeWidth: 7,
            strokeLinecap: "round",
          }),
        React.createElement("circle", {
          className: centerClass,
          cx: CENTER.x,
          cy: CENTER.y,
          r: 9,
          fill: COLORS.white,
        }),
        step === 5 && !radiusDone && !isAnimating &&
          React.createElement("image", {
            href: "assets/tap.gif",
            x: CENTER.x - TAP_HINT.size / 2,
            y: CENTER.y + TAP_HINT.offsetY,
            width: TAP_HINT.size,
            height: TAP_HINT.size,
            preserveAspectRatio: "xMidYMid meet",
            style: { pointerEvents: "none" },
          }),
        pointLabels.map((key) => {
          const pos = labelPosition(key, pts);
          return React.createElement(
            "text",
            {
              key,
              x: pos.x,
              y: pos.y,
              fill: COLORS.white,
              fontSize: 34,
              fontStyle: key === "C" ? "normal" : "italic",
              fontWeight: 600,
              textAnchor: "middle",
              dominantBaseline: "middle",
            },
            labels[key],
          );
        }),
        React.createElement("circle", {
          ref: circleClickRef,
          className: "circle-click-target",
          cx: CENTER.x,
          cy: CENTER.y,
          r: RADIUS + 12,
          fill: "transparent",
          style: {
            cursor: step === 5 && !radiusDone && !isAnimating ? "pointer" : "default",
            pointerEvents: step === 5 && !radiusDone && !isAnimating ? "all" : "none",
          },
          onClick: runRadiusObservation,
        }),
        renderInfoBox(),
        renderFlyingClones(),
      ),
    );
  };

  return React.createElement(
    "div",
    { className: "main-canvas-container" },
    React.createElement(
      "div",
      { className: "visual-column" + (step >= 4 ? " is-split" : "") },
      renderDiagram(),
    ),
    renderActionPanel(),
  );
};
