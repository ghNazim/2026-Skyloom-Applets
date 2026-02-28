/**
 * SplashScreen: two rows.
 * Row 1: two columns - left: image, right: data list.
 * Row 2: text (supports <blue>, <yellow> etc. via dangerouslySetInnerHTML).
 */
const SplashScreen = ({ imageSrc, text, dataList = [], belowImage, step }) => {
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
          }),
        belowImage &&
          React.createElement("div", {
            className: "splash-below-image",
            dangerouslySetInnerHTML: { __html: belowImage },
          })
      ),
      React.createElement(
        "div",
        { className: "splash-data-column" },
        dataList && dataList.length > 0
          ? React.createElement(
              "ul",
              { className: "splash-data-list" },
              dataList.map((item, i) => {
                let content = typeof item === "object" && item !== null && "text" in item ? item.text : item;
                if (typeof content === "string" && typeof APP_DATA !== "undefined" && APP_DATA.listLineKeys && APP_DATA.listLineKeys.indexOf(content) !== -1 && APP_DATA[content]) {
                  content = APP_DATA[content];
                }
                const useHtml = typeof content === "string" && content.indexOf("<") !== -1;
                return React.createElement(
                  "li",
                  {
                    key: i,
                    className: "splash-data-item",
                    ...(useHtml ? { dangerouslySetInnerHTML: { __html: content } } : {}),
                  },
                  useHtml ? null : content
                );
              })
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
