const GifVisual = ({ cards, cardText, hidden, assets }) => {
  const renderMedia = (card) => {
    const src = assets[card.media];
    if (card.type === "video") {
      return React.createElement("video", {
        className: "gif-visual__media",
        src,
        autoPlay: true,
        loop: true,
        muted: true,
        playsInline: true,
      });
    }
    if (card.type === "gif") {
      return React.createElement("img", {
        className: "gif-visual__media",
        src,
        alt: card.title,
      });
    }
    return React.createElement("img", {
      className: "gif-visual__media",
      src,
      alt: card.title,
    });
  };

  return React.createElement(
    "div",
    { className: "gif-visual" },
    React.createElement(
      "div",
      {
        className:
          "gif-visual__cards" + (hidden ? " gif-visual__cards--hidden" : ""),
      },
      cards.map((card, i) =>
        React.createElement(
          "div",
          { className: "gif-visual__card", key: i },
          React.createElement("div", { className: "gif-visual__card-title" }, card.title),
          React.createElement(
            "div",
            { className: "gif-visual__card-media" },
            renderMedia(card)
          )
        )
      )
    ),
    React.createElement("div", {
      className:
        "gif-visual__text" + (hidden ? " gif-visual__text--hidden" : ""),
      dangerouslySetInnerHTML: { __html: cardText || "" },
    })
  );
};
