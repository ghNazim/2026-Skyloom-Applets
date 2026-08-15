const Splash = ({ heading, image, text }) => {
  return React.createElement(
    "div",
    { className: "splash-panel" },
    React.createElement(
      "div",
      { className: "splash-image-column" },
      React.createElement("img", {
        src: image,
        className: "splash-image",
        alt: "bowl",
        draggable: false,
      })
    ),
    React.createElement(
      "div",
      { className: "splash-text-column" },
      React.createElement("p", { className: "splash-heading" }, heading),
      React.createElement("p", {
        className: "splash-text",
        dangerouslySetInnerHTML: { __html: text },
      })
    )
  );
};
