const RightPanel = ({
  titleLabel = "",
  titleValue = "",
  children,
  footer = null,
  className = "",
  visualClassName = "",
  footerClassName = "",
}) => {
  const e = React.createElement;
  const html = (text) => (typeof handleComma === "function" ? handleComma(text) : text);

  return e(
    "div",
    { className: `right-panel ${className}`.trim() },
    e(
      "div",
      { className: "title-row" },
      e("span", {
        className: "title-label",
        dangerouslySetInnerHTML: { __html: html(titleLabel) },
      }),
      titleValue
        ? e("span", {
            className: "title-value",
            dangerouslySetInnerHTML: { __html: ` ${html(titleValue)}` },
          })
        : null,
    ),
    e("div", { className: `visual-row ${visualClassName}`.trim() }, children),
    footer
      ? e("div", { className: `footer-row ${footerClassName}`.trim() }, footer)
      : null,
  );
};
