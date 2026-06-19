const FinalTable = ({ onStartOver }) => {
  const renderMiniCard = (key, headingText, cardKey) =>
    React.createElement(
      "div",
      { key: cardKey, className: "mini-transform-card" },
      React.createElement(
        "svg",
        {
          viewBox: TransformCards.getCardViewBox(key),
          className: "mini-transform-svg",
          preserveAspectRatio: "xMidYMid meet",
        },
        React.createElement(
          "g",
          { className: "mini-transform-scene" },
          TransformCards.createCompletedCardElements(key, headingText)
        )
      )
    );

  return React.createElement(
    "div",
    { className: "final-table-panel" },
    React.createElement(
      "div",
      { className: "final-table-cards-row" },
      React.createElement(
        "div",
        { className: "final-table-card final-table-card-left" },
        React.createElement(
          "div",
          { className: "final-table-card-header" },
          APP_DATA.finalTable.leftHeading
        ),
        React.createElement(
          "div",
          { className: "final-table-card-body final-table-card-body-grid" },
          renderMiniCard(
            "translation",
            APP_DATA.steps[2].translationHeading,
            "mini-translation"
          ),
          renderMiniCard(
            "reflection",
            APP_DATA.steps[3].reflectionHeading,
            "mini-reflection"
          ),
          renderMiniCard(
            "bottomRight",
            APP_DATA.steps[4].rotationHeading,
            "mini-rotation"
          )
        )
      ),
      React.createElement(
        "div",
        { className: "final-table-card final-table-card-right" },
        React.createElement(
          "div",
          { className: "final-table-card-header" },
          APP_DATA.finalTable.rightHeading
        ),
        React.createElement(
          "div",
          { className: "final-table-card-body final-table-card-body-single" },
          renderMiniCard(
            "bottomLeft",
            APP_DATA.steps[5].dilationHeading,
            "mini-dilation"
          )
        )
      )
    ),
    React.createElement(
      "button",
      {
        className: "btn final-table-button",
        onClick: onStartOver,
      },
      APP_DATA.finalTable.buttonText
    )
  );
};
