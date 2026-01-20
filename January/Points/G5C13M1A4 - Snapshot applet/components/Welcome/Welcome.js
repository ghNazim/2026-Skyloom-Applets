// const Button = ({ onClick, text, className }) => {
//   return React.createElement(
//     "button",
//     {
//       className: `btn ${className || ""}`,
//       onClick: onClick,
//     },
//     text
//   );
// };

const Welcome = ({ onButtonClick }) => {
  const m = DIVISION_CONFIG.m;
  const n = DIVISION_CONFIG.n;
  const total = m * n;

  // Render pyramid
  const renderPyramid = () => {
    const rows = [];
    let bananaIndex = 0;
    let rowSize = 1;
    let currentRow = [];

    while (bananaIndex < total) {
      for (let i = 0; i < rowSize && bananaIndex < total; i++) {
        currentRow.push({
          index: bananaIndex,
          filled: true,
        });
        bananaIndex++;
      }
      rows.push(currentRow);
      currentRow = [];
      rowSize++;
    }

    return React.createElement(
      "div",
      { className: "welcome-pyramid-container" },
      rows.map((row, rowIdx) =>
        React.createElement(
          "div",
          { key: rowIdx, className: "welcome-pyramid-row" },
          row.map((banana) =>
            React.createElement("img", {
              key: banana.index,
              src: "assets/banana.png",
              className: "welcome-pyramid-banana",
              alt: "banana",
            })
          )
        )
      )
    );
  };

  return React.createElement(
    "div",
    { className: "welcome-panel" },
    React.createElement(
      "div",
      { className: "welcome-content" },
      APP_DATA.welcome.text
        .split("\n")
        .map((line, idx) =>
          React.createElement(
            "div",
            { key: idx, className: "welcome-text" },
            line
          )
        )
    ),
    renderPyramid(),
    React.createElement(Button, {
      text: APP_DATA.welcome.buttonText,
      onClick: onButtonClick,
      className: "welcome-button",
    })
  );
};
