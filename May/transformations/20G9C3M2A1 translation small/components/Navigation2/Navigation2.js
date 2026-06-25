const Navigation2 = ({ feedbackHtml, showSummarize = false, onSummarize }) => {
  return React.createElement(
    "div",
    { className: "navigation2" },
    React.createElement(
      "div",
      { className: "navigation2-left" },
      React.createElement(
        "button",
        {
          className: "navigation2-summarize-btn",
          style: { opacity: showSummarize ? 1 : 0 },
          disabled: !showSummarize,
          onClick: onSummarize,
          id: "summarize-button",
        },
        APP_DATA.navigation2.summarize,
      ),
    ),
    React.createElement(
      "div",
      { className: "navigation2-right" },
      React.createElement("div", {
        className: "navigation2-text-box",
        dangerouslySetInnerHTML: {
          __html: renderAppTextHtml(handleComma(feedbackHtml || "")),
        },
      }),
    ),
  );
};
