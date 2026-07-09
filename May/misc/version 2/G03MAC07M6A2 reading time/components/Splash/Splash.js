const Splash = ({ heading, image, text, step }) => {
  return React.createElement(
    "div",
    { className: "splash-panel" },
    React.createElement("div", { className: "splash-heading" }, heading),
    React.createElement(
      "div",
      { className: "splash-content-row" },
      React.createElement(
        "div",
        { className: "splash-left" },
        React.createElement("img", { src: image, className: "splash-img" + " step" + step, alt: "" })
      ),
      React.createElement(
        "div",
        { className: "splash-right" },
        React.createElement("div", {
          className: "splash-text",
          dangerouslySetInnerHTML: {
            __html: handleComma(String(text || "").replace(/\n/g, "<br>")),
          },
        })
      )
    )
  );
};
