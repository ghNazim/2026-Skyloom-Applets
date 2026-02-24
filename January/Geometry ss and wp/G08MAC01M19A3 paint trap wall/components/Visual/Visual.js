/**
 * Visual: left column with two rows.
 * - Image row: 50% height, shows image.
 * - Info row: rest of height, shows list of info items (first showCount items).
 * infoList and showCount are optional; if not provided, only image is shown (legacy behaviour).
 */
const Visual = ({
  imageSrc,
  infoList = null,
  showCount = 0,
  greenItemIndex = null,
  yellowLastItem = true,
  showAreaLabel = false,
  step,
  substep = 0,
  isAnswered = false,
  showPerpDots = false,
  perpLeftClicked = false,
  perpRightClicked = false,
  onPerpLeftClick,
  onPerpRightClick,
}) => {
  const isSvgInline = imageSrc && imageSrc.trim().startsWith("<svg");
  const hasInfoRow = infoList && infoList.length > 0 && showCount >= 0;
  const itemsToShow = hasInfoRow ? infoList.slice(0, showCount) : [];

  return React.createElement(
    "div",
    { className: "visual-panel" },
    // Image row - 50% when info row present, else full height
    React.createElement(
      "div",
      {
        className:
          "visual-image-row" +
          (hasInfoRow ? "" : " visual-image-row-full") +
          (showPerpDots ? " visual-image-row-relative" : ""),
      },
      imageSrc && imageSrc.trim()
        ? isSvgInline
          ? React.createElement("div", {
              className: "svg-inline-wrapper",
              dangerouslySetInnerHTML: { __html: imageSrc },
            })
          : React.createElement("img", {
              src: imageSrc,
              alt: "Visual representation",
              className: "visual-image",
            })
        : null,
      showPerpDots &&
        !perpLeftClicked &&
        React.createElement("div", {
          className: "visual-perp-dot visual-perp-dot-left",
          onClick: () => onPerpLeftClick && onPerpLeftClick(),
          role: "button",
          "aria-label": "Tap point D",
        }),
      showPerpDots &&
        !perpRightClicked &&
        React.createElement("div", {
          className: "visual-perp-dot visual-perp-dot-right",
          onClick: () => onPerpRightClick && onPerpRightClick(),
          role: "button",
          "aria-label": "Tap point C",
        })
    ),
    // Info row - rest of height (only when infoList and showCount provided)
    hasInfoRow &&
      React.createElement(
        "div",
        { className: "visual-info-row" },
        React.createElement(
          "ul",
          { className: "visual-info-list" },
          itemsToShow.map((item, index) => {
            const isLast = index === itemsToShow.length - 1;
            let content = typeof item === "object" && item !== null && "text" in item ? item.text : item;
            if (typeof content === "string" && typeof APP_DATA !== "undefined" && APP_DATA.listLineKeys && APP_DATA.listLineKeys.indexOf(content) !== -1 && APP_DATA[content]) {
              content = APP_DATA[content];
            }
            const isGreen = index === greenItemIndex || (typeof item === "object" && item !== null && item.green);
            const isYellow = yellowLastItem && !isGreen && isLast && greenItemIndex == null;
            const useHtml = typeof content === "string" && content.indexOf("<") !== -1;
            return React.createElement(
              "li",
              {
                key: `info-${index}`,
                className: "visual-info-item" + (isGreen ? " green" : isYellow ? " yellow" : ""),
                style: {
                  animation: isLast ? "fadeInUp 0.3s ease-out" : "none",
                },
                ...(useHtml ? { dangerouslySetInnerHTML: { __html: content } } : {}),
              },
              useHtml ? null : content
            );
          })
        )
      )
  );
};
