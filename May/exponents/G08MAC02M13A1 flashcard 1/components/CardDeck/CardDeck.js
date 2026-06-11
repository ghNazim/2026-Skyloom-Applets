const CardDeck = ({ questions, currentCardIndex, cardExiting }) => {
  const totalCards = questions.length;
  const cardColors = ["#FFF5CC", "#D4F5D4", "#CCE5FF", "#F5D4F5", "#FFD4CC"];
  var ROTATION_STEP = 5;

  var cards = [];
  var visibleCount = Math.min(totalCards - currentCardIndex, 5);

  for (var i = visibleCount - 1; i >= 0; i--) {
    var cardIdx = currentCardIndex + i;
    if (cardIdx >= totalCards) continue;

    var isTop = i === 0;
    var rotation = i * ROTATION_STEP;
    var colorIdx = cardIdx % cardColors.length;
    var zIndex = 10 + (visibleCount - i);
    var scale = 1 - i * 0.02;
    var offsetY = i * 3;

    var q = questions[cardIdx];
    var expressionHtml = renderLatex(q.expression, true);

    var outerStyle = {
      position: "absolute",
      zIndex: zIndex,
      transform:
        "rotate(" +
        rotation +
        "deg) scale(" +
        scale +
        ") translateY(" +
        offsetY +
        "px)",
      transition: "transform 0.4s ease, opacity 0.4s ease",
    };

    if (isTop && cardExiting) {
      outerStyle.transform = "translateX(-120%) rotate(-15deg)";
      outerStyle.opacity = "0";
    }

    cards.push(
      React.createElement(
        "div",
        {
          key: "card-" + cardIdx,
          className: "deck-card",
          style: outerStyle,
        },
        React.createElement(
          "div",
          {
            className: "deck-card-inner",
            style: { backgroundColor: cardColors[colorIdx] },
          },
          React.createElement(
            "span",
            { className: "card-number" },
            cardIdx + 1
          ),
          React.createElement(
            "div",
            { className: "inner-card" },
            React.createElement("div", {
              className: "card-expression-content",
              dangerouslySetInnerHTML: { __html: expressionHtml },
            })
          )
        )
      )
    );
  }

  return React.createElement("div", { className: "card-deck-wrapper" }, cards);
};
