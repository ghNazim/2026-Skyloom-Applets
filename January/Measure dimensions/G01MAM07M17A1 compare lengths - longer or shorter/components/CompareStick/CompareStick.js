const CompareStick = ({
  mode,
  labelA,
  labelB,
  absLabelA,
  absLabelB,
  clickable,
  onClickA,
  onClickB,
  stickAClass,
  stickBClass,
  arrowLabelLong,
  arrowLabelShort,
}) => {
  const ce = React.createElement;

  const LONG_COUNT = 5;
  const SHORT_COUNT = 4;
  const longWidth = "85%";
  const shortWidth = "68%";

  const renderHandspans = (count) => {
    const items = [];
    for (let i = 0; i < count; i++) {
      items.push(
        ce(
          "div",
          {
            key: "hs-" + i,
            className: "compare-handspan",
            style: { width: 100 / count + "%" },
          },
          ce("img", { src: "assets/handspan.png", alt: "" }),
        ),
      );
    }
    return ce("div", { className: "compare-handspans-row" }, items);
  };

  const renderArrow = (color, label) => {
    return ce(
      "div",
      { className: "compare-arrow-horiz-wrap" },
      ce(
        "div",
        { className: "compare-arrow-horiz", style: { width: "100%" } },
        ce("div", {
          className: "compare-arrow-head-left",
          style: { borderRightColor: color },
        }),
        ce("div", {
          className: "compare-arrow-shaft-horiz",
          style: { borderTopColor: color },
        }),
        ce("div", {
          className: "compare-arrow-head-right",
          style: { borderLeftColor: color },
        }),
      ),
      ce(
        "div",
        { className: "compare-arrow-label-horiz", style: { color: color } },
        label,
      ),
    );
  };

  return ce(
    "div",
    { className: "compare-stick-container" },
    ce("div", { className: "compare-left-line" }),
    ce(
      "div",
      { className: "compare-sticks-column" },
      /* Stick A (longer) */
      ce(
        "div",
        {
          className: "stick-row-wrapper " + (stickAClass || ""),
          onClick: clickable ? onClickA : undefined,
          style: { cursor: clickable ? "pointer" : "default" },
        },
        ce(
          "div",
          { className: "stick-body-horiz", style: { width: longWidth } },
          ce(
            "div",
            { className: "stick-top-row" },
            absLabelA &&
              ce("div", {
                className: "stick-label-abs",
                dangerouslySetInnerHTML: { __html: absLabelA },
              }),
            ce("div", {
              className: "stick-label",
              dangerouslySetInnerHTML: { __html: labelA },
            }),
            ce("img", {
              src: "assets/longstick.png",
              className: "compare-stick-img-horiz",
              alt: "Stick A",
            }),
          ),
          mode === "compare" && renderHandspans(LONG_COUNT),
          mode === "arrows" && renderArrow("#FFFF00", arrowLabelLong),
        ),
      ),
      /* Stick B (shorter) */
      ce(
        "div",
        {
          className: "stick-row-wrapper " + (stickBClass || ""),
          onClick: clickable ? onClickB : undefined,
          style: { cursor: clickable ? "pointer" : "default" },
        },
        ce(
          "div",
          { className: "stick-body-horiz", style: { width: shortWidth } },
          ce(
            "div",
            { className: "stick-top-row" },
            absLabelB &&
              ce("div", {
                className: "stick-label-abs",
                dangerouslySetInnerHTML: { __html: absLabelB },
              }),
            ce("div", {
              className: "stick-label",
              dangerouslySetInnerHTML: { __html: labelB },
            }),
            ce("img", {
              src: "assets/shortstick.png",
              className: "compare-stick-img-horiz",
              alt: "Stick B",
            }),
          ),
          mode === "compare" && renderHandspans(SHORT_COUNT),
          mode === "arrows" && renderArrow("#00FFFF", arrowLabelShort),
        ),
      ),
    ),
  );
};
