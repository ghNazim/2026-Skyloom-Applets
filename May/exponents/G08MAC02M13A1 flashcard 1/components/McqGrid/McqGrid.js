const McqGrid = ({ options, disabledIds, onSelect }) => {
  var renderOption = function (option) {
    var isDisabled = disabledIds.has(option.id);
    var className = "mcq-option";
    if (option.result === "correct") className += " mcq-option--correct";
    if (option.result === "incorrect") className += " mcq-option--incorrect";
    if (option.shaking) className += " mcq-option--shaking";

    var latexHtml = renderLatex(option.latex, false);

    return React.createElement(
      "button",
      {
        key: option.id,
        type: "button",
        className: className,
        disabled: isDisabled,
        onClick: function () {
          onSelect(option);
        },
      },
      React.createElement("span", { className: "mcq-option-frame" }),
      React.createElement("span", {
        className: "mcq-option-content",
        dangerouslySetInnerHTML: { __html: latexHtml },
      })
    );
  };

  return React.createElement(
    "div",
    { className: "mcq-grid" },
    options.map(renderOption)
  );
};
