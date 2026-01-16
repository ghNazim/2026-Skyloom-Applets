const SplashScreen = ({ svgContent, contentText, boxes, visualPanelChildren }) => {
  return React.createElement(
    "div",
    { className: "splash-screen" },
    React.createElement(
      "div",
      { className: "splash-visual-panel", style: { position: "relative" } },
      svgContent,
      visualPanelChildren
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

