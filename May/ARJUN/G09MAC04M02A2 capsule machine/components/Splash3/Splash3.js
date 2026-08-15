const Splash3 = function () {
  var d = APP_DATA.splash3;

  var seqChildren = [];
  for (var i = 0; i < d.sequenceImages.length; i++) {
    if (i > 0) {
      seqChildren.push(
        React.createElement(
          "span",
          { key: "arr-" + i, className: "splash3-seq-arrow" },
          "\u2192",
        ),
      );
    }
    seqChildren.push(
      React.createElement(
        "div",
        { key: "item-" + i, className: "splash3-seq-item" },
        React.createElement("img", {
          src: d.sequenceImages[i],
          className: "splash3-seq-img",
          alt: "",
          draggable: false,
        }),
        React.createElement(
          "div",
          { className: "splash3-seq-count" },
          d.sequenceCounts[i],
        ),
      ),
    );
  }

  return React.createElement(
    "div",
    { className: "splash3-panel" },
    React.createElement("h2", { className: "splash3-heading" }, d.heading),
    React.createElement(
      "div",
      { className: "splash3-main-row" },
      React.createElement(
        "div",
        { className: "splash3-col splash3-col--left" },
        React.createElement(
          "div",
          { className: "splash3-box splash3-box--want" },
          React.createElement(
            "div",
            { className: "splash3-box-title" },
            d.leftTitle,
          ),
          React.createElement(
            "div",
            { className: "splash3-left-img-wrap" },
            React.createElement("img", {
              src: d.leftImage,
              className: "splash3-left-img",
              alt: "",
              draggable: false,
            }),
          ),
          React.createElement(
            "div",
            { className: "splash3-count-big" },
            d.leftCount,
          ),
          React.createElement(
            "div",
            { className: "splash3-box-footer" },
            d.leftFooter,
          ),
        ),
      ),
      React.createElement(
        "div",
        { className: "splash3-col splash3-col--right" },
        React.createElement(
          "div",
          { className: "splash3-box splash3-box--sequence" },
          React.createElement(
            "div",
            { className: "splash3-box-title" },
            d.rightTitle,
          ),
          React.createElement(
            "div",
            { className: "splash3-sequence" },
            seqChildren,
          ),
          React.createElement(
            "div",
            { className: "splash3-box-footer" },
            d.rightFooter,
          ),
        ),
      ),
    ),
    React.createElement("div", {
      className: "splash3-text-box",
      dangerouslySetInnerHTML: { __html: d.summaryHtml },
    }),
  );
};
