const CardSelect = ({ exploredCards, onSelectCard }) => {
  return React.createElement(
    "div",
    { className: "card-select-page" },
    CARD_IDS.map((cardId) => {
      const cardData = APP_DATA.cards[cardId];
      const isExplored = exploredCards.includes(cardId);
      return React.createElement(
        "button",
        {
          key: cardId,
          type: "button",
          className:
            "select-card" +
            (isExplored ? " explored" : "") +
            " select-card-" +
            cardId,
          onClick: () => {
            if (typeof playSound === "function") playSound("click");
            onSelectCard(cardId);
          },
        },
        React.createElement(
          "div",
          { className: "select-card-diagram" },
          React.createElement("img", {
            src: CARD_IMAGES[cardId],
            alt: "",
            className: "select-card-img",
          }),
        ),
        React.createElement("p", {
          className: "select-card-title",
          dangerouslySetInnerHTML: { __html: cardData.title },
        }),
      );
    }),
  );
};
