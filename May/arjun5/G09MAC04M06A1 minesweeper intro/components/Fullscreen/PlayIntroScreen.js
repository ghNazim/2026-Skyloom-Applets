const PlayIntroScreen = ({ onPlay, buttonRef }) => {
  const { createElement: e } = React;

  const experiment = getExperiment(0);
  const step4 = APP_DATA.steps[4];

  const cellKey = (row, col) => `${row}-${col}`;

  const cellState = experiment.introRevealed.reduce((acc, cell) => {
    acc[cellKey(cell.row, cell.col)] = "safe";
    return acc;
  }, {});

  const html = (text) => (typeof handleComma === "function" ? handleComma(text) : text);

  return e(
    Fullscreen,
    {
      heading: step4.heading,
      buttonText: step4.playButton,
      hintText: step4.playHint,
      onButtonClick: onPlay,
      buttonRef,
    },
    e(
      "div",
      { className: "play-intro-row" },
      e(
        "div",
        { className: "play-intro-left" },
        e(GameRow, {
          cellState,
          clickableKeys: [],
          highlightedKey: null,
          showNudge: false,
          showLives: false,
          compact: true,
          caption: step4.tableCaption,
          locked: true,
          table: experiment.table,
          cornerImages: experiment.cornerImages,
        }),
      ),
      e("div", {
        className: "play-intro-right",
        dangerouslySetInnerHTML: { __html: html(`<div>${step4.rightText}</div>`) },
      }),
    ),
  );
};
