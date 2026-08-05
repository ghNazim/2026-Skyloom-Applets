/** Width (vw) of a full-size 1-cup image inside a count card. */
const COUNT_CUP_BASE_WIDTH = 9.6;
const COUNT_CUP_ASPECT = 139 / 351;
/** Fraction of the cup image taken up by the bowl; the rest is the handle. */
const COUNT_CUP_BOWL_FRACTION = 0.51;
/** Horizontal room (vw) reserved for the "+" between two cups. */
const COUNT_CUP_PLUS_GAP = 1.35;

const CountPanel = ({ title, cards, visibleCount, pendingCupRef }) => {
  const h = React.createElement;

  const renderCups = (card, isPending) => {
    const scale = CUP_SIZE_SCALE[card.denominator] || 1;
    const cupWidth = COUNT_CUP_BASE_WIDTH * scale;
    const cupHeight = cupWidth * COUNT_CUP_ASPECT;
    const bowlWidth = cupWidth * COUNT_CUP_BOWL_FRACTION;
    const pitch = bowlWidth + COUNT_CUP_PLUS_GAP;
    const totalWidth = (card.count - 1) * pitch + cupWidth;
    const symbol = CUP_SYMBOLS[card.denominator] || String(card.denominator);
    const children = [];

    for (let i = 0; i < card.count; i += 1) {
      children.push(
        h(
          "div",
          {
            key: "cup-" + i,
            className: "count-cup",
            style: { left: i * pitch + "vw", width: cupWidth + "vw", height: cupHeight + "vw" },
          },
          h("img", {
            ref: isPending && i === 0 ? pendingCupRef : undefined,
            className: "count-cup-img",
            src: "assets/cup.png",
            alt: "",
          }),
          h(
            "span",
            { className: "count-cup-label", style: { fontSize: cupHeight * 0.45 + "vw" } },
            symbol,
          ),
        ),
      );
      if (i < card.count - 1) {
        children.push(
          h(
            "span",
            {
              key: "plus-" + i,
              className: "count-cup-plus",
              style: {
                left: i * pitch + bowlWidth + COUNT_CUP_PLUS_GAP / 2 + "vw",
                fontSize: cupHeight * 0.6 + "vw",
              },
            },
            "+",
          ),
        );
      }
    }

    return h(
      "div",
      {
        className: "count-cup-row",
        style: { width: totalWidth + "vw", height: cupHeight + "vw" },
      },
      children,
    );
  };

  const footerFor = (card) =>
    card.count === 1
      ? APP_DATA.count.footerOne
      : APP_DATA.count.footerMany.replace("{count}", String(card.count));

  return h(
    "div",
    { className: "count-panel" },
    h(
      "div",
      { className: "count-title", style: { opacity: visibleCount > 0 ? 1 : 0 } },
      title,
    ),
    h(
      "div",
      { className: "count-card-list" },
      cards.map((card, index) =>
        h(
          "div",
          {
            key: "card-" + card.denominator,
            className: "count-card-row",
            style: { opacity: index < visibleCount ? 1 : 0 },
          },
          h(
            "div",
            { className: "count-card-main" },
            h("img", { className: "count-glass-img", src: "assets/glass.png", alt: "" }),
            h("span", { className: "count-equals" }, "="),
            renderCups(card, index === visibleCount),
          ),
          h("div", { className: "count-card-footer" }, footerFor(card)),
        ),
      ),
    ),
  );
};
