const polarToCartesian = (cx, cy, r, angleInDegrees) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(angleInRadians),
    y: cy + r * Math.sin(angleInRadians),
  };
};

const describeArc = (x, y, radius, startAngle, endAngle) => {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return [
    "M",
    x,
    y,
    "L",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
    "Z",
  ].join(" ");
};

const angleData = [
  {
    id: 1,
    cx: 305,
    cy: 170,
    start: -170.9 + 90,
    end: -80.5 + 90,
    r: 35,
    labelR: 45,
  },
  {
    id: 2,
    cx: 305,
    cy: 170,
    start: -80.5 + 90,
    end: 9.1 + 90,
    r: 45,
    labelR: 55,
  },
  {
    id: 3,
    cx: 305,
    cy: 170,
    start: 9.1 + 90,
    end: 99.5 + 90,
    r: 35,
    labelR: 52,
  },
  {
    id: 4,
    cx: 305,
    cy: 170,
    start: 99.5 + 90,
    end: 189.1 + 90,
    r: 45,
    labelR: 60,
  },
  {
    id: 5,
    cx: 275,
    cy: 350,
    start: -180 + 90,
    end: -80.5 + 90,
    r: 35,
    labelR: 45,
  },
  {
    id: 6,
    cx: 275,
    cy: 350,
    start: -80.5 + 90,
    end: 0 + 90,
    r: 45,
    labelR: 55,
  },
  {
    id: 7,
    cx: 275,
    cy: 350,
    start: 0 + 90,
    end: 99.5 + 90,
    r: 35,
    labelR: 52,
  },
  {
    id: 8,
    cx: 275,
    cy: 350,
    start: 99.5 + 90,
    end: 180 + 90,
    r: 45,
    labelR: 60,
  },
];

const ANGLE_COLORS = ["rgba(206, 147, 216, 0.85)", "rgba(129, 212, 250, 0.85)"];

const ANGLE_BOUNDARY_LINES = {
  1: ["topLeftRay", "transversalTop"],
  2: ["topRightRay", "transversalTop"],
  3: ["topRightRay", "transversalMid"],
  4: ["topLeftRay", "transversalMid"],
  5: ["bottomLeftRay", "transversalMid"],
  6: ["bottomRightRay", "transversalMid"],
  7: ["bottomRightRay", "transversalBot"],
  8: ["bottomLeftRay", "transversalBot"],
};

const LINE_KEYS = [
  "topLeftRay",
  "topRightRay",
  "bottomLeftRay",
  "bottomRightRay",
  "transversalTop",
  "transversalMid",
  "transversalBot",
];

const LINES = {
  topLeftRay: {
    x1: 55,
    y1: 130,
    x2: 305,
    y2: 170,
    color: "#ffc107",
    ms: "url(#arrow-yellow-start)",
    me: "",
  },
  topRightRay: {
    x1: 305,
    y1: 170,
    x2: 555,
    y2: 210,
    color: "#ffc107",
    ms: "",
    me: "url(#arrow-yellow-end)",
  },
  bottomLeftRay: {
    x1: 25,
    y1: 350,
    x2: 275,
    y2: 350,
    color: "#ffc107",
    ms: "url(#arrow-yellow-start)",
    me: "",
  },
  bottomRightRay: {
    x1: 275,
    y1: 350,
    x2: 525,
    y2: 350,
    color: "#ffc107",
    ms: "",
    me: "url(#arrow-yellow-end)",
  },
  transversalTop: {
    x1: 305,
    y1: 170,
    x2: 325,
    y2: 50,
    color: "#00b0ff",
    ms: "",
    me: "url(#arrow-blue-end)",
  },
  transversalMid: {
    x1: 305,
    y1: 170,
    x2: 275,
    y2: 350,
    color: "#00b0ff",
    ms: "",
    me: "",
  },
  transversalBot: {
    x1: 275,
    y1: 350,
    x2: 260,
    y2: 440,
    color: "#00b0ff",
    ms: "",
    me: "url(#arrow-blue-end)",
  },
};

const getAssociatedLines = (angleIds) => {
  const associated = new Set();
  angleIds.forEach((id) => {
    ANGLE_BOUNDARY_LINES[id].forEach((key) => associated.add(key));
  });
  return associated;
};

const MainCanvas = (props) => {
  const { questionIndex, isLastQuestion, onSetNextEnabled, onUpdateTexts } =
    props;
  const { useState, useEffect, useRef, useCallback } = React;

  const question = APP_DATA.questions[questionIndex];
  const options = APP_DATA.options;
  const celebrateTimelineRef = useRef(null);

  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackMode, setFeedbackMode] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [wrongOptions, setWrongOptions] = useState([]);
  const [answered, setAnswered] = useState(false);
  const [dehighlightActive, setDehighlightActive] = useState(false);
  const [anglePhase, setAnglePhase] = useState("pulsate");
  const [angleRadii, setAngleRadii] = useState({});

  const playSnd = (snd) => {
    if (typeof playSound === "function") playSound(snd);
  };

  const runCorrectAngleEffect = useCallback((angleIds) => {
    setAnglePhase("celebrate");

    if (celebrateTimelineRef.current) {
      celebrateTimelineRef.current.kill();
    }

    const timeline = gsap.timeline({
      onComplete: () => {
        setAnglePhase("stable");
        setAngleRadii({});
      },
    });
    celebrateTimelineRef.current = timeline;

    angleIds.forEach((id, index) => {
      const ang = angleData.find((a) => a.id === id);
      if (!ang) return;

      const baseR = ang.r;
      const expandedR = baseR * 1.3;
      const proxy = { r: baseR };
      const offset = index * 0.08;

      timeline.to(
        proxy,
        {
          r: expandedR,
          duration: 0.3,
          ease: "power2.out",
          onUpdate: () => {
            setAngleRadii((prev) => ({ ...prev, [id]: proxy.r }));
          },
        },
        offset
      );

      timeline.to(
        proxy,
        {
          r: baseR,
          duration: 0.3,
          ease: "power2.inOut",
          onUpdate: () => {
            setAngleRadii((prev) => ({ ...prev, [id]: proxy.r }));
          },
        },
        offset + 0.3
      );
    });
  }, []);

  useEffect(() => {
    setFeedbackVisible(false);
    setFeedbackMode(null);
    setFeedbackText("");
    setWrongOptions([]);
    setAnswered(false);
    setDehighlightActive(false);
    setAnglePhase("pulsate");
    setAngleRadii({});
    if (celebrateTimelineRef.current) {
      celebrateTimelineRef.current.kill();
      celebrateTimelineRef.current = null;
    }
    onSetNextEnabled(false);
    onUpdateTexts(APP_DATA.nav.initial);
  }, [questionIndex]);

  const associatedLines = getAssociatedLines(question.angles);

  const getLineStyle = (key) => {
    const line = LINES[key];
    const isDehighlighted = dehighlightActive && !associatedLines.has(key);
    const markerColor = isDehighlighted
      ? "grey"
      : line.color === "#ffc107"
      ? "yellow"
      : "blue";

    return {
      stroke: isDehighlighted ? "#888888" : line.color,
      opacity: isDehighlighted ? 0.5 : 1,
      markerStart: line.ms ? `url(#arrow-${markerColor}-start)` : undefined,
      markerEnd: line.me ? `url(#arrow-${markerColor}-end)` : undefined,
    };
  };

  const handleOptionClick = (option) => {
    if (answered) return;

    setDehighlightActive(true);

    if (option === question.answer) {
      setAnswered(true);
      setWrongOptions([]);
      runCorrectAngleEffect(question.angles);
      setFeedbackMode("correct");
      setFeedbackText(question.correct_feedback);
      setFeedbackVisible(true);
      playSnd("correct");
      onSetNextEnabled(true);
      onUpdateTexts(
        isLastQuestion ? APP_DATA.nav.last : APP_DATA.nav.correct
      );
      return;
    }

    playSnd("wrong");
    setWrongOptions((prev) =>
      prev.includes(option) ? prev : prev.concat(option)
    );
    setFeedbackMode("wrong");
    setFeedbackText(question.wrong_feedback);
    setFeedbackVisible(true);
  };

  const processedFeedback =
    typeof handleComma === "function"
      ? handleComma(feedbackText)
      : feedbackText;

  return React.createElement(
    "div",
    { className: "main-canvas-container" },
    React.createElement(
      "div",
      { className: "left-column" },
      React.createElement(
        "svg",
        {
          className: "grid-svg",
          viewBox: "0 0 600 500",
          preserveAspectRatio: "xMidYMid slice",
        },
        React.createElement(
          "defs",
          null,
          React.createElement(
            "marker",
            {
              id: "arrow-blue-start",
              viewBox: "0 0 10 10",
              refX: "5",
              refY: "5",
              markerWidth: "5",
              markerHeight: "5",
              orient: "auto-start-reverse",
            },
            React.createElement("path", {
              d: "M 0 0 L 10 5 L 0 10 z",
              fill: "#00b0ff",
            })
          ),
          React.createElement(
            "marker",
            {
              id: "arrow-blue-end",
              viewBox: "0 0 10 10",
              refX: "5",
              refY: "5",
              markerWidth: "5",
              markerHeight: "5",
              orient: "auto",
            },
            React.createElement("path", {
              d: "M 0 0 L 10 5 L 0 10 z",
              fill: "#00b0ff",
            })
          ),
          React.createElement(
            "marker",
            {
              id: "arrow-yellow-start",
              viewBox: "0 0 10 10",
              refX: "5",
              refY: "5",
              markerWidth: "5",
              markerHeight: "5",
              orient: "auto-start-reverse",
            },
            React.createElement("path", {
              d: "M 0 0 L 10 5 L 0 10 z",
              fill: "#ffc107",
            })
          ),
          React.createElement(
            "marker",
            {
              id: "arrow-yellow-end",
              viewBox: "0 0 10 10",
              refX: "5",
              refY: "5",
              markerWidth: "5",
              markerHeight: "5",
              orient: "auto",
            },
            React.createElement("path", {
              d: "M 0 0 L 10 5 L 0 10 z",
              fill: "#ffc107",
            })
          ),
          React.createElement(
            "marker",
            {
              id: "arrow-grey-start",
              viewBox: "0 0 10 10",
              refX: "5",
              refY: "5",
              markerWidth: "5",
              markerHeight: "5",
              orient: "auto-start-reverse",
            },
            React.createElement("path", {
              d: "M 0 0 L 10 5 L 0 10 z",
              fill: "#888888",
            })
          ),
          React.createElement(
            "marker",
            {
              id: "arrow-grey-end",
              viewBox: "0 0 10 10",
              refX: "5",
              refY: "5",
              markerWidth: "5",
              markerHeight: "5",
              orient: "auto",
            },
            React.createElement("path", {
              d: "M 0 0 L 10 5 L 0 10 z",
              fill: "#888888",
            })
          )
        ),

        LINE_KEYS.map((key) => {
          const line = LINES[key];
          const style = getLineStyle(key);
          return React.createElement("line", {
            key,
            x1: line.x1,
            y1: line.y1,
            x2: line.x2,
            y2: line.y2,
            stroke: style.stroke,
            strokeWidth: "3",
            opacity: style.opacity,
            markerStart: style.markerStart,
            markerEnd: style.markerEnd,
            style: { transition: "stroke 0.3s, opacity 0.3s" },
          });
        }),

        React.createElement(
          "g",
          null,
          angleData.map((ang) => {
            if (!question.angles.includes(ang.id)) return null;

            const colorIndex = question.angles.indexOf(ang.id);
            const pulsateClass = anglePhase === "pulsate" ? "angle-pulsate" : "";
            const currentR = angleRadii[ang.id] ?? ang.r;

            return React.createElement(
              "g",
              {
                key: `angle-${ang.id}`,
                className: pulsateClass,
              },
              React.createElement("path", {
                d: describeArc(ang.cx, ang.cy, currentR, ang.start, ang.end),
                fill: ANGLE_COLORS[colorIndex],
              })
            );
          })
        )
      )
    ),

    React.createElement(
      "div",
      { className: "right-column" },
      React.createElement(
        "div",
        {
          className:
            "feedback-box" +
            (feedbackMode ? " " + feedbackMode : "") +
            (feedbackVisible ? " visible" : ""),
          dangerouslySetInnerHTML: { __html: processedFeedback },
        }
      ),
      React.createElement(
        "div",
        { className: "options-container" },
        options.map((option) => {
          const isWrong = !answered && wrongOptions.includes(option);
          const isCorrect = answered && option === question.answer;
          const optionLabel =
            typeof handleComma === "function"
              ? handleComma(option)
              : option;

          return React.createElement(
            "button",
            {
              key: option,
              type: "button",
              className:
                "option-button" +
                (isWrong ? " incorrect" : "") +
                (isCorrect ? " correct" : ""),
              onClick: () => handleOptionClick(option),
              disabled: answered,
              dangerouslySetInnerHTML: { __html: optionLabel },
            }
          );
        })
      )
    )
  );
};
