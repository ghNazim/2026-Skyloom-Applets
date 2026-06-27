const VisualQuestion = ({ heading, object, transformation, image }) => {
  const renderValue = (value) => {
    if (value === null || value === undefined) {
      return React.createElement("span", { className: "vq-unknown" }, "?");
    }
    return value;
  };

  return React.createElement(
    "div",
    { className: "visual-question-panel" },
    React.createElement("h2", { className: "visual-question-heading" }, heading),
    React.createElement(
      "div",
      { className: "visual-question-row" },
      React.createElement(
        "div",
        { className: "vq-object-box" },
        renderValue(object),
      ),
      React.createElement(
        "div",
        { className: "vq-arrow-box" },
        React.createElement("img", {
          src: "assets/arrow.svg",
          className: "vq-arrow-img",
          alt: "",
        }),
        React.createElement(
          "div",
          {
            className: "vq-arrow-text",
            dangerouslySetInnerHTML: {
              __html: handleComma(
                transformation === null || transformation === undefined
                  ? '<span class="vq-unknown">?</span>'
                  : transformation,
              ),
            },
          },
        ),
      ),
      React.createElement(
        "div",
        { className: "vq-image-box" },
        renderValue(image),
      ),
    ),
  );
};
