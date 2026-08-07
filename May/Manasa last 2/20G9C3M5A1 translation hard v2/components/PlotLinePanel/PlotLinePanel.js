const PlotLinePanel = ({ texts, contentVisible, coordBoxes, onCoordClick }) => {
  return React.createElement(
    "div",
    { className: "plot-line-panel" },
    React.createElement(
      "div",
      { className: "plot-line-block", id: "step10-points-block" },
      React.createElement(
        "div",
        {
          id: "step10-image-title",
          className: "plot-line-title" + (contentVisible ? " is-visible" : ""),
        },
        texts.imagePointsTitle,
      ),
      React.createElement(
        "div",
        { className: "plot-line-coords-row" },
        coordBoxes.map((box, i) =>
          React.createElement(
            "div",
            {
              key: box.id,
              id: box.id,
              className:
                "plot-line-coord-box" +
                (contentVisible ? " is-visible" : "") +
                (box.clickable ? " is-clickable" : ""),
              onClick: box.clickable ? () => onCoordClick(i) : undefined,
            },
            box.text,
          ),
        ),
      ),
    ),
    React.createElement(
      "div",
      { className: "plot-line-block", id: "step10-formula-block" },
      React.createElement(
        "div",
        {
          id: "step10-formula-title",
          className: "plot-line-title" + (contentVisible ? " is-visible" : ""),
        },
        texts.formulaTitleTranslated || texts.formulaTitle,
      ),
      React.createElement(
        "div",
        {
          id: "step10-formula-box",
          className:
            "plot-line-formula-box" + (contentVisible ? " is-visible" : ""),
        },
        renderXYLineFormula("5"),
      ),
    ),
  );
};
