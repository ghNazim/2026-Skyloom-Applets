const RecipePaper = ({ highlightIndex = null, fadedExceptIndex = null, estimates = {} }) => {
  const recipe = APP_DATA.recipe;

  const amountHTML = (item) => {
    const unit = recipe.units[item.unit];
    return (
      fractionHTML(item.amount[0], item.amount[1], "recipe-fraction") +
      '<span class="recipe-unit">' + unit + "</span>"
    );
  };

  return React.createElement(
    "div",
    { className: "recipe-paper" },
    React.createElement("div", { className: "recipe-title" }, recipe.title),
    React.createElement("div", { className: "recipe-subtitle" }, recipe.subtitle),
    React.createElement("div", { className: "recipe-rule" }),
    React.createElement(
      "div",
      { className: "recipe-header" },
      React.createElement("span", null),
      React.createElement("span", { className: "recipe-header-actual" }, recipe.actual),
      React.createElement("span", { className: "recipe-header-estimate" }, recipe.estimate),
    ),
    React.createElement(
      "div",
      { className: "recipe-rows" },
      recipe.items.map((item, index) => {
        const faded = fadedExceptIndex !== null && index !== fadedExceptIndex;
        const highlighted = highlightIndex === index;
        const estimate = estimates[item.key];
        return React.createElement(
          "div",
          {
            key: item.key,
            className:
              "recipe-row" +
              (highlighted ? " recipe-row-highlight" : "") +
              (faded ? " recipe-row-faded" : ""),
          },
          React.createElement("div", { className: "recipe-name" }, item.label),
          React.createElement("div", {
            className: "recipe-actual",
            dangerouslySetInnerHTML: { __html: amountHTML(item) },
          }),
          React.createElement(
            "div",
            { className: "recipe-estimate" },
            estimate
              ? React.createElement("span", {
                  dangerouslySetInnerHTML: { __html: formatFractionsInText(estimate) },
                })
              : highlighted
                ? "?"
                : "",
          ),
        );
      }),
    ),
  );
};
