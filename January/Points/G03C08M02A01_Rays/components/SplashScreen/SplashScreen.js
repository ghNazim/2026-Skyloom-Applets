const SplashScreen = ({ svgContent, contentText, boxes }) => {
  return React.createElement(
    "div",
    { className: "splash-screen" },
    React.createElement(
      "div",
      { className: "splash-visual-panel" },
      svgContent
    ),
    React.createElement(
      "div",
      { className: "splash-content-panel" },
      boxes
        ? boxes.map((boxText, index) =>
            React.createElement(
              "div",
              { key: index, className: "splash-content-box", dangerouslySetInnerHTML: { __html: boxText } },
              
            )
          )
        : React.createElement(
            "div",
            { className: "splash-content-text", dangerouslySetInnerHTML: { __html: contentText } },
            // contentText
          )
    )
  );
};

