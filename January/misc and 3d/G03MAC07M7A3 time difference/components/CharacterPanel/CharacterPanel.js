const CharacterPanel = ({ characterImage, characterText }) => {
  return React.createElement(
    "div",
    { className: "character-panel" },
    React.createElement("img", {
      src: `assets/${characterImage}`,
      alt: "Character",
      className: "character-image",
    }),
    React.createElement(
      "div",
      { className: "character-text-box" },
      characterText
    )
  );
};
