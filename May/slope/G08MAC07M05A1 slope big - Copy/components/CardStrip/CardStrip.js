const CardStrip = ({ selectedCard, onSelectCard, interactive }) => {
  return React.createElement(
    "div",
    { className: "card-strip" },
    CARD_IDS.map((cardId) =>
      React.createElement(
        "button",
        {
          key: cardId,
          type: "button",
          className:
            "strip-card" +
            (selectedCard === cardId ? " selected" : "") +
            (interactive ? " interactive" : ""),
          onClick: interactive
            ? () => {
                if (typeof playSound === "function") playSound("click");
                onSelectCard(cardId);
              }
            : undefined,
          disabled: !interactive,
        },
        React.createElement("img", {
          src: CARD_IMAGES[cardId],
          alt: "",
          className: "strip-card-img",
        }),
      ),
    ),
  );
};
