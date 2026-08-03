const CardSelect = ({ exploredCards, activeCardId, onSelectCard }) => {
  return React.createElement(
    "div",
    { className: "card-select-page" },
    CARD_IDS.map((cardId) => {
      const cardData = APP_DATA.cards[cardId];
      const isExplored = exploredCards.includes(cardId);
      const isActive = cardId === activeCardId && !isExplored;
      return React.createElement(
        "button",
        {
          key: cardId,
          type: "button",
          id: "card-" + cardId,
          className:
            "select-card" +
            (isExplored ? " explored" : "") +
            (isActive ? " active" : " disabled") +
            " select-card-" +
            cardId,
          disabled: !isActive,
          onClick: () => onSelectCard(cardId),
        },
        isExplored
          ? React.createElement("p", {
              className: "select-card-explored-title",
              dangerouslySetInnerHTML: { __html: cardData.title },
            })
          : null,
        React.createElement("img", {
          src: CARD_IMAGES[cardId],
          alt: "",
          className: "select-card-img",
        }),
      );
    }),
  );
};
