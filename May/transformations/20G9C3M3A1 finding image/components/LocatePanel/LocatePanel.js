const LocatePanel = ({
  title,
  highlightTarget,
  feedback,
  titleBlink,
  cellVisible,
  cellRefs,
}) => {
  const t = APP_DATA.steps[4];
  const rows = t.tableRows;

  const isPartVisible = (key) =>
    cellVisible == null || cellVisible[key] !== false;

  const partClass = (key) =>
    "locate-part" + (isPartVisible(key) ? " is-visible" : " is-hidden");

  const renderValue = (rowKey, value, refKey, visibleKey) => {
    const isHighlighted = highlightTarget === rowKey;
    return React.createElement(
      "span",
      {
        className:
          "locate-value " +
          partClass(visibleKey) +
          (isHighlighted ? " is-highlighted" : ""),
        ref: (el) => {
          if (cellRefs && refKey) cellRefs[refKey] = el;
        },
      },
      value,
    );
  };

  let feedbackClass = "locate-feedback";
  if (feedback) {
    feedbackClass += feedback.type === "wrong" ? " is-wrong" : " is-correct";
  }

  return React.createElement(
    "div",
    { className: "locate-panel" },
    React.createElement(
      "h3",
      {
        className:
          "locate-title locate-part" +
          (isPartVisible("title") ? " is-visible" : " is-hidden") +
          (titleBlink ? " is-blinking" : ""),
        ref: (el) => {
          if (cellRefs) cellRefs.title = el;
        },
      },
      title,
    ),
    React.createElement(
      "div",
      { className: "locate-table" },
      React.createElement(
        "div",
        { className: "locate-row" },
        React.createElement(
          "span",
          {
            className: "locate-label locate-label-p " + partClass("pLabel"),
            ref: (el) => {
              if (cellRefs) cellRefs.pLabel = el;
            },
          },
          rows.pointP,
        ),
        renderValue("p", rows.pointPCoord, "pValue", "pValue"),
      ),
      React.createElement(
        "div",
        { className: "locate-row" },
        React.createElement(
          "span",
          {
            className: "locate-label locate-label-trans " + partClass("transLabel"),
            ref: (el) => {
              if (cellRefs) cellRefs.transLabel = el;
            },
          },
          rows.translation,
        ),
        React.createElement(
          "span",
          {
            className: "locate-value " + partClass("transValue"),
            ref: (el) => {
              if (cellRefs) cellRefs.transValue = el;
            },
          },
          rows.translationCoord,
        ),
      ),
      React.createElement(
        "div",
        { className: "locate-row" },
        React.createElement(
          "span",
          {
            className: "locate-label locate-label-pprime " + partClass("pprimeLabel"),
            ref: (el) => {
              if (cellRefs) cellRefs.pprimeLabel = el;
            },
          },
          rows.pointPPrime,
        ),
        renderValue("pPrime", rows.pointPPrimeCoord, "pprimeValue", "pprimeValue"),
      ),
    ),
    feedback
      ? React.createElement(
          "div",
          {
            className:
              feedbackClass +
              " locate-part" +
              (isPartVisible("feedback") ? " is-visible" : " is-hidden"),
          },
          feedback.text,
        )
      : React.createElement(
          "div",
          {
            className:
              "locate-feedback is-empty locate-part" +
              (isPartVisible("feedback") ? " is-visible" : " is-hidden"),
          },
        ),
  );
};
