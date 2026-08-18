const WelcomeScreen = () => {
  const GRAPH_AXIS_X = 8;
  const GRAPH_AXIS_RIGHT = 96;
  const GRAPH_AXIS_TOP = 10;
  const GRAPH_AXIS_BOTTOM = 76;
  const GRAPH_PLOT_H = GRAPH_AXIS_BOTTOM - GRAPH_AXIS_TOP;
  const GRAPH_X_LABEL_Y = GRAPH_AXIS_BOTTOM + 6.2;
  const GRAPH_X_TITLE_Y = 92;
  const GRAPH_Y_TITLE_X = -12;
  const GRAPH_X_MAX_TRIAL = 5;

  const getTrialX = (trial) =>
    GRAPH_AXIS_X + (trial * (GRAPH_AXIS_RIGHT - GRAPH_AXIS_X)) / GRAPH_X_MAX_TRIAL;

  const formatYAxisTick = (val) => {
    const text = val === 1 ? "1" : val.toFixed(1);
    return window.APP_LANGUAGE === "id" ? text.replace(".", ",") : text;
  };

  const getSvgCoords = (trial, rf) => {
    const x = getTrialX(trial);
    const y = GRAPH_AXIS_BOTTOM - Number(rf) * GRAPH_PLOT_H;
    return { x, y };
  };

  const renderWelcomeGraph = (person) => {
    const points = person.rf.map((rf, idx) => ({
      trial: idx + 1,
      rf,
      ...getSvgCoords(idx + 1, rf),
    }));
    const path = points.map((p) => `${p.x},${p.y}`).join(" ");

    return React.createElement(
      "div",
      {
        key: person.id,
        className: "panel graph-panel graph-panel--welcome",
        style: { "--person-color": person.color },
      },
      React.createElement("div", { className: "graph-name", style: { color: person.color } }, T.peopleText[person.id]),
      React.createElement(
        "div",
        { className: "graph-wrapper" },
        React.createElement(
          "svg",
          { viewBox: "0 0 100 92", className: "graph-svg", preserveAspectRatio: "xMidYMid meet" },
          [0.2, 0.4, 0.6, 0.8, 1.0].map((val) => {
            const y = GRAPH_AXIS_BOTTOM - val * GRAPH_PLOT_H;
            return React.createElement("line", {
              key: `grid-y-${val}`,
              className: "grid-line",
              x1: GRAPH_AXIS_X,
              y1: y,
              x2: GRAPH_AXIS_RIGHT,
              y2: y,
            });
          }),
          [1, 2, 3, 4, 5].map((trial) => {
            const x = getTrialX(trial);
            return React.createElement("line", {
              key: `grid-x-${trial}`,
              className: "grid-line",
              x1: x,
              y1: GRAPH_AXIS_TOP,
              x2: x,
              y2: GRAPH_AXIS_BOTTOM,
            });
          }),
          React.createElement("line", {
            className: "axis-line",
            x1: GRAPH_AXIS_X,
            y1: GRAPH_AXIS_BOTTOM,
            x2: GRAPH_AXIS_RIGHT + 2,
            y2: GRAPH_AXIS_BOTTOM,
          }),
          React.createElement("line", {
            className: "axis-line",
            x1: GRAPH_AXIS_X,
            y1: GRAPH_AXIS_TOP - 2,
            x2: GRAPH_AXIS_X,
            y2: GRAPH_AXIS_BOTTOM + 2,
          }),
          [0, 0.2, 0.4, 0.6, 0.8, 1].map((val) => {
            const y = GRAPH_AXIS_BOTTOM - val * GRAPH_PLOT_H;
            return React.createElement(
              "g",
              { key: `y-${val}` },
              React.createElement("line", {
                className: "axis-tick",
                x1: GRAPH_AXIS_X - 2,
                y1: y,
                x2: GRAPH_AXIS_X,
                y2: y,
              }),
              React.createElement(
                "text",
                {
                  className: "axis-label y-axis-label",
                  x: GRAPH_AXIS_X - 3,
                  y,
                  fontSize: 5,
                  textAnchor: "end",
                  dominantBaseline: "central",
                },
                formatYAxisTick(val)
              )
            );
          }),
          [1, 2, 3, 4, 5].map((trial) => {
            const x = getTrialX(trial);
            return React.createElement(
              "g",
              { key: `x-${trial}` },
              React.createElement("line", {
                className: "axis-tick",
                x1: x,
                y1: GRAPH_AXIS_BOTTOM,
                x2: x,
                y2: GRAPH_AXIS_BOTTOM + 2,
              }),
              React.createElement(
                "text",
                {
                  className: "axis-label x-axis-label",
                  x,
                  y: GRAPH_X_LABEL_Y,
                  fontSize: 5,
                  textAnchor: "middle",
                  dominantBaseline: "central",
                },
                trial
              )
            );
          }),
          React.createElement(
            "text",
            {
              className: "axis-title-text x-axis-title",
              x: (GRAPH_AXIS_X + GRAPH_AXIS_RIGHT) / 2,
              y: GRAPH_X_TITLE_Y,
              fontSize: 5.5,
              textAnchor: "middle",
              dominantBaseline: "central",
            },
            T.ui.trialsLabel
          ),
          React.createElement("text", {
            className: "axis-title-text y-axis-title",
            transform: `rotate(-90 ${GRAPH_Y_TITLE_X} ${GRAPH_AXIS_TOP + GRAPH_PLOT_H / 2})`,
            x: GRAPH_Y_TITLE_X,
            y: GRAPH_AXIS_TOP + GRAPH_PLOT_H / 2,
            fontSize: 5.5,
            textAnchor: "middle",
            dominantBaseline: "central",
            dangerouslySetInnerHTML: { __html: T.ui.graphRfAxis },
          }),
          React.createElement("polyline", {
            className: "graph-polyline",
            points: path,
          }),
          points.map((p) =>
            React.createElement("circle", {
              key: p.trial,
              className: "graph-point-inner point-filled",
              cx: p.x,
              cy: p.y,
              r: 1.8,
            })
          )
        )
      )
    );
  };

  return React.createElement(
    "div",
    { className: "welcome-screen" },
    React.createElement("div", {
      className: "welcome-prompt-banner",
      dangerouslySetInnerHTML: { __html: T.ui.bothPrompt.split(".")[0] + "." },
    }),
    React.createElement(
      "div",
      { className: "welcome-main-panel panel" },
      React.createElement("div", {
        className: "welcome-message",
        dangerouslySetInnerHTML: { __html: T.ui.welcomeMessage },
      }),
      React.createElement(
        "div",
        { className: "welcome-dual-graphs" },
        T.people.map((p) => renderWelcomeGraph(p))
      )
    )
  );
};
