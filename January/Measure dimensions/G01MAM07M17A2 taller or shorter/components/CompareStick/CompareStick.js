const CompareStick = ({
  mode,
  labelA,
  labelB,
  clickable,
  onClickA,
  onClickB,
  stickAClass,
  stickBClass,
  arrowLabelLong,
  arrowLabelShort,
}) => {
  const ce = React.createElement;

  const LONG_COUNT = 7;
  const SHORT_COUNT = 5;
  const longHeight = "30vw";
  const shortHeight = "24vw";

  const renderHandspans = (count, type) => {
    const items = [];
    for (let i = 0; i < count; i++) {
      items.push(
        ce(
          "div",
          {
            key: "hs-" + i,
            className: "compare-handspan",
            style: { height: 100 / count + "%" },
          },
          ce("img", { src: "assets/handspan.png", alt: "" }),
        ),
      );
    }
    return ce("div", { className: "compare-handspans " + (type || "") }, items);
  };

  const renderArrow = (color, label, labelSide) => {
    const arrowEl = ce(
      "div",
      { className: "compare-arrow" },
      ce("div", {
        className: "compare-arrow-head-up",
        style: { borderBottomColor: color },
      }),
      ce("div", {
        className: "compare-arrow-shaft",
        style: { borderLeftColor: color },
      }),
      ce("div", {
        className: "compare-arrow-head-down",
        style: { borderTopColor: color },
      }),
    );
    const labelEl = ce(
      "div",
      { className: "compare-arrow-label", style: { color: color } },
      label,
    );
    const children =
      labelSide === "left"
        ? [labelEl, arrowEl]
        : [arrowEl, labelEl];
    return ce("div", { className: "compare-arrow-wrap" }, ...children);
  };

  return ce(
    "div",
    { className: "compare-stick-container" },
    ce(
      "div",
      { className: "compare-sticks-row" },
      ce(
        "div",
        {
          className: "stick-wrapper " + (stickAClass || ""),
          onClick: clickable ? onClickA : undefined,
          style: { cursor: clickable ? "pointer" : "default" },
        },
        ce(
          "div",
          { className: "stick-body", style: { height: longHeight } },
          mode === "arrows" && renderArrow("#FFFF00", arrowLabelLong, "left"),
          mode === "compare" && renderHandspans(LONG_COUNT, "long"),
          ce(
            "div",
            { className: "stick-label-wrap" },
            ce("div", {
              className: "stick-label",
              dangerouslySetInnerHTML: { __html: labelA },
            }),
            ce("img", {
              src: "assets/longstick.png",
              className: "compare-stick-img",
              alt: "Stick A",
            }),
          ),
        ),
      ),
      ce(
        "div",
        {
          className: "stick-wrapper " + (stickBClass || ""),
          onClick: clickable ? onClickB : undefined,
          style: { cursor: clickable ? "pointer" : "default" },
        },
        ce(
          "div",
          { className: "stick-body", style: { height: shortHeight } },
          mode === "compare" && renderHandspans(SHORT_COUNT, "short"),
          ce(
            "div",
            { className: "stick-label-wrap" },
            ce("div", {
              className: "stick-label",
              dangerouslySetInnerHTML: { __html: labelB },
            }),
            ce("img", {
              src: "assets/shortstick.png",
              className: "compare-stick-img",
              alt: "Stick B",
            }),
          ),

          mode === "arrows" && renderArrow("#00FFFF", arrowLabelShort, "right"),
        ),
      ),
    ),
    ce("div", { className: "compare-baseline" }),
  );
};
