const Fullscreen = (props) => {
  const {
    text,
    buttonText,
    onButtonClick,
    heading,
    dataset,
    stats,
    introLines,
    completionText,
    isCompletion,
    showNudge = true,
  } = props;

  const { useRef } = React;
  const e = React.createElement;
  const buttonRef = useRef(null);

  const startContent = isCompletion && dataset && stats
    ? e("div", { className: "start-grid completion-grid" },
        e("div", { className: "start-card data-start-card" },
          e("div", { className: "start-data-grid" },
            dataset.map(function (value, index) {
              return e("span", { key: "start-value-" + index }, value + (index < dataset.length - 1 ? "," : ""));
            })
          ),
          e("div", { className: "start-stats" },
            stats.map(function (line, index) {
              return e("div", { key: "start-stat-" + index }, line);
            })
          )
        ),
        e("div", { className: "start-instructions completion-text" },
          e("p", null, completionText)
        )
      )
    : dataset && introLines
      ? e("div", { className: "start-grid" },
          e("div", { className: "start-card data-start-card" },
            e("div", { className: "start-data-grid" },
              dataset.map(function (value, index) {
                return e("span", { key: "start-value-" + index }, value + (index < dataset.length - 1 ? "," : ""));
              })
            ),
            e("div", { className: "start-stats" },
              stats.map(function (line, index) {
                return e("div", { key: "start-stat-" + index }, line);
              })
            )
          ),
          e("div", { className: "start-instructions" },
            introLines.map(function (line, index) {
              return e("p", { key: "intro-line-" + index }, line);
            })
          )
        )
      : e("div", { className: "fullscreen-content-wrap" },
          e("p", {
            className: "fullscreen-content center",
            dangerouslySetInnerHTML: { __html: text || "" },
          })
        );

  return e(
    "div",
    { className: "fullscreen-panel" },
    e("p", { className: "heading" }, heading),
    startContent,
    e(
      "button",
      {
        ref: buttonRef,
        type: "button",
        className: "btn fullscreen-button",
        onClick: onButtonClick,
      },
      buttonText
    ),
    e(Nudge, { targetRef: buttonRef, show: showNudge })
  );
};
