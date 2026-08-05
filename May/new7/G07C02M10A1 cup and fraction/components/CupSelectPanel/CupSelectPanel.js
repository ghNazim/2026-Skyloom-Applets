const CUP_SELECT_DENOMINATORS = [1, 2, 3, 4];
const CUP_SELECT_BASE_WIDTH = 9.975;

const CupSelectPanel = ({
  selectedDenominator = null,
  wrongDenominator = null,
  isAnswered = false,
  correctDenominator = 2,
  onSelect,
}) => {
  const h = React.createElement;

  return h(
    "div",
    { className: "cup-select-panel" },
    CUP_SELECT_DENOMINATORS.map((denominator) => {
      const scale = CUP_SIZE_SCALE[denominator] || 1;
      const symbol = CUP_SYMBOLS[denominator] || String(denominator);
      const isCorrect = denominator === correctDenominator;
      let stateClass = "";
      if (isAnswered) {
        stateClass = isCorrect ? " correct" : " dimmed";
      } else if (wrongDenominator === denominator) {
        stateClass = " picked-wrong";
      } else if (selectedDenominator === denominator) {
        stateClass = " selected";
      }

      return h(
        "button",
        {
          key: "cup-select-" + denominator,
          id: "cup-select-" + denominator,
          className: "cup-select-card" + stateClass,
          onClick: () => onSelect(denominator),
          disabled: isAnswered,
        },
        h("img", {
          className: "cup-select-img",
          src: "assets/cup.png",
          alt: "",
          style: { width: CUP_SELECT_BASE_WIDTH * scale + "vw" },
        }),
        h(
          "div",
          { className: "cup-select-label" },
          h("span", { className: "cup-select-symbol" }, symbol),
          h("span", { className: "cup-select-unit" }, APP_DATA.cupUnit),
        ),
      );
    }),
  );
};
