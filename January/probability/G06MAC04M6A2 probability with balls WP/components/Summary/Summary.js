const Summary = ({ onStartOver }) => {
  const scalePositions = APP_DATA.scalePositions;
  const images = APP_DATA.images;
  const summaryLabels = APP_DATA.summaryLabels;
  const summary = APP_DATA.summary;

  const getIndexPct = (idx) => idx * 25;

  return React.createElement(
    "div",
    { className: "summary-panel" },

    React.createElement(
      "p",
      { className: "summary-heading" },
      summary.heading
    ),

    React.createElement("p", {
      className: "summary-event-text",
      dangerouslySetInnerHTML: { __html: summary.eventText },
    }),

    React.createElement(
      "div",
      { className: "summary-scale" },

      React.createElement(
        "div",
        { className: "scale-labels-row" },
        scalePositions.map((pos, i) =>
          React.createElement(
            "div",
            {
              key: i,
              className: "scale-label-wrapper",
              style: { left: getIndexPct(i) + "%" },
            },
            React.createElement(
              "div",
              { className: "scale-label-bubble" },
              pos.label
            )
          )
        )
      ),

      React.createElement(
        "div",
        { className: "scale-track-row" },
        React.createElement("div", { className: "scale-track-line" }),
        scalePositions.map((pos, i) =>
          React.createElement("div", {
            key: i,
            className: "scale-dot",
            style: {
              left: getIndexPct(i) + "%",
              backgroundColor: pos.dotColor,
              boxShadow: "0 0 0.4vw " + pos.dotColor,
            },
          })
        )
      ),

      React.createElement(
        "div",
        { className: "summary-cards-row" },
        images.map((img, i) =>
          React.createElement(
            "div",
            {
              key: i,
              className: "summary-card",
              style: { left: getIndexPct(i) + "%" },
            },
            React.createElement("img", {
              src: img,
              className: "summary-card-image",
              draggable: false,
              alt: scalePositions[i].label,
            }),
            React.createElement("div", {
              className: "summary-card-label",
              dangerouslySetInnerHTML: { __html: summaryLabels[i] },
            })
          )
        )
      )
    ),

    React.createElement(
      "p",
      { className: "summary-footer-text" },
      summary.footerText
    ),

    React.createElement(Button, {
      text: summary.buttonText,
      onClick: onStartOver,
      className: "summary-button",
    })
  );
};
