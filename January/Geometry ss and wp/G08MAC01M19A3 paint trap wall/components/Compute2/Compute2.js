/**
 * Compute2: step-by-step fraction substitution for #cans of paint.
 * Row 1 & 2 show fraction (num/den); row 2 then substitutes and becomes final value.
 * Calls onAppendInfoItem when final step runs, then onEnableNext and onUpdateNav.
 */
const Compute2 = ({
  config,
  onAppendInfoItem,
  onEnableNext,
  onUpdateNav,
  onNumeratorHighlight,
  onDenominatorHighlight,
  onUnitsHighlight,
}) => {
  const { useState, useEffect, useRef } = React;

  const fraction = (config && config.fraction) || { num: "Area of Wall", den: "Area painted by 1 Can" };
  const yellow = (config && config.colors && config.colors.yellow) || "#EAB308";

  const [row1Visible, setRow1Visible] = useState(false);
  const [row2Visible, setRow2Visible] = useState(false);
  const [row1Highlight, setRow1Highlight] = useState(null); // "numerator" | "denominator" | null
  const [row2Num, setRow2Num] = useState(fraction.num);
  const [row2Den, setRow2Den] = useState(fraction.den);
  const [row2ColoredNum, setRow2ColoredNum] = useState(false);
  const [row2ColoredDen, setRow2ColoredDen] = useState(false);
  const [row2HighlightUnits, setRow2HighlightUnits] = useState(false);
  const [row2Replace, setRow2Replace] = useState(null); // "13.84" when final
  const timersRef = useRef([]);

  const clearTimers = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  };

  useEffect(() => {
    if (!config || !config.steps || config.steps.length === 0) return;

    let cumulativeDelay = 0;
    config.steps.forEach((step) => {
      cumulativeDelay += step.delay || 0;
      const t = setTimeout(() => {
        if (step.rowsCount === 1) {
          setRow1Visible(true);
          setRow2Visible(false);
          setRow1Highlight(null);
          setRow2Num(fraction.num);
          setRow2Den(fraction.den);
          setRow2ColoredNum(false);
          setRow2ColoredDen(false);
          setRow2Replace(null);
        }
        if (step.row2Fraction) {
          setRow2Visible(true);
          setRow2Num(fraction.num);
          setRow2Den(fraction.den);
          setRow2ColoredNum(false);
          setRow2ColoredDen(false);
          setRow2Replace(null);
        }
        if (step.highlightRow1 || step.row2Replace !== undefined || step.highlightRow2Units === true || (step.row2Num !== undefined && !step.row2ColoredNum)) {
          if (window.playSound) window.playSound("tick");
        }
        if (step.highlightRow1) {
          setRow1Highlight(step.highlightRow1);
          if (step.highlightRow1 === "numerator") {
            setRow2ColoredDen(false);
            onNumeratorHighlight && onNumeratorHighlight();
          }
          if (step.highlightRow1 === "denominator") {
            setRow2ColoredNum(false);
            onDenominatorHighlight && onDenominatorHighlight();
          }
        }
        if (step.row2Num !== undefined) setRow2Num(step.row2Num);
        if (step.row2Den !== undefined) setRow2Den(step.row2Den);
        if (step.row2ColoredNum) setRow2ColoredNum(true);
        if (step.row2ColoredDen) setRow2ColoredDen(true);
        if (step.highlightRow2Units !== undefined) {
          setRow2HighlightUnits(step.highlightRow2Units);
          if (step.highlightRow2Units) {
            setRow1Highlight(null);
            setRow2ColoredNum(false);
            setRow2ColoredDen(false);
            onUnitsHighlight && onUnitsHighlight();
          }
        }
        if (step.row2Replace !== undefined) {
          setRow2Replace(step.row2Replace);
          setRow1Highlight(null);
        }
        if (step.appendInfoText) {
          onAppendInfoItem && onAppendInfoItem(step.appendInfoText);
        }
        if (step.final) {
          onEnableNext && onEnableNext();
          onUpdateNav && config.navFinal && onUpdateNav(config.navFinal);
        }
      }, cumulativeDelay);
      timersRef.current.push(t);
    });

    return () => clearTimers();
  }, [config]);

  const renderTextWithUnits = (text, unitHighlight) => {
    if (!unitHighlight || typeof text !== "string") return text;
    const unitStr = "m²";
    const idx = text.indexOf(unitStr);
    if (idx === -1) return text;
    return React.createElement(
      React.Fragment,
      null,
      text.slice(0, idx),
      React.createElement("span", { className: "compute2-unit-highlight" }, unitStr),
      text.slice(idx + unitStr.length)
    );
  };

  const renderFractionRow = (num, den, highlightPart, coloredNum, coloredDen, highlightUnits) => {
    const numContent = highlightUnits ? renderTextWithUnits(num, true) : num;
    const denContent = highlightUnits ? renderTextWithUnits(den, true) : den;
    const numEl = React.createElement(
      "span",
      {
        className: "compute2-frac-num" + (highlightPart === "numerator" ? " compute2-highlight" : ""),
        style: coloredNum ? { color: yellow } : undefined,
      },
      numContent
    );
    const denEl = React.createElement(
      "span",
      {
        className: "compute2-frac-den" + (highlightPart === "denominator" ? " compute2-highlight" : ""),
        style: coloredDen ? { color: yellow } : undefined,
      },
      denContent
    );
    return React.createElement(
      "div",
      { className: "compute2-fraction-row" },
      React.createElement("div", { className: "compute2-frac-num-wrap" }, numEl),
      React.createElement("div", { className: "compute2-frac-line" }),
      React.createElement("div", { className: "compute2-frac-den-wrap" }, denEl)
    );
  };

  if (!config) return null;

  return React.createElement(
    "div",
    { className: "compute2-panel" },
    config.title &&
      React.createElement("h3", { className: "compute2-title" }, config.title),
    React.createElement(
      "div",
      { className: "compute2-rows" },
      row1Visible &&
        renderFractionRow(
          fraction.num,
          fraction.den,
          row1Highlight,
          false,
          false,
          false
        ),
      row2Visible &&
        (row2Replace != null
          ? React.createElement(
              "div",
              { className: "compute2-row compute2-row-final" },
              row2Replace
            )
          : renderFractionRow(
              row2Num,
              row2Den,
              null,
              row2ColoredNum,
              row2ColoredDen,
              row2HighlightUnits
            ))
    )
  );
};
