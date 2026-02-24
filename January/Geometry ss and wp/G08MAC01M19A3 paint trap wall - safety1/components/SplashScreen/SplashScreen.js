/**
 * SplashScreen: two rows.
 * Row 1: two columns - left: image, right: data list.
 * Row 2: text (supports <blue>, <yellow> etc. via dangerouslySetInnerHTML).
 */
const SplashScreen = ({ imageSrc, text, dataList = [], step }) => {
  return React.createElement(
    "div",
    { className: "splash-screen" },
    // Row 1: image (left) + data list (right)
    React.createElement(
      "div",
      { className: "splash-top-row" },
      React.createElement(
        "div",
        { className: "splash-image-column" },
        imageSrc &&
          React.createElement("img", {
            src: imageSrc,
            alt: "Summary visual",
            className: "splash-image",
          })
      ),
      React.createElement(
        "div",
        { className: "splash-data-column" },
        dataList && dataList.length > 0
          ? React.createElement(
              "ul",
              { className: "splash-data-list" },
              dataList.map((item, i) =>
                React.createElement("li", { key: i, className: "splash-data-item" }, item)
              )
            )
          : null
      )
    ),
    // Row 2: text
    React.createElement(
      "div",
      {
        className: "splash-text-container",
        ...(text ? { dangerouslySetInnerHTML: { __html: text } } : {}),
      }
    )
  );
};
