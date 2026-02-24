/**
 * Compute1: step-by-step substitution and simplification for area of trapezium.
 * Runs through compute1Config.steps with delays, updates image and nav at end.
 */
const Compute1 = ({
  config,
  onUpdateImage,
  onEnableNext,
  onUpdateNav,
}) => {
  const { useState, useEffect, useRef } = React;

  const [rows, setRows] = useState([]);
  const [row1Highlight, setRow1Highlight] = useState([]);
  const [row2Highlight, setRow2Highlight] = useState([]);
  const [row3Highlight, setRow3Highlight] = useState([]);
  const [row2Colored, setRow2Colored] = useState([]);
  const [row3Colored, setRow3Colored] = useState([]);
  const [row3FullReplace, setRow3FullReplace] = useState(null);
  const [row3FullHighlight, setRow3FullHighlight] = useState(false);
  const stepIndexRef = useRef(0);
  const timersRef = useRef([]);

  const clearTimers = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  };

  function buildRowHtml(text, highlights, colored) {
    if (!text) return "";
    const segments = [];
    let lastEnd = 0;
    const items = [];
    (highlights || []).forEach((h) => {
        const i = text.indexOf(h.text, lastEnd);
        if (i !== -1) {
          items.push({ start: i, end: i + h.text.length, type: "highlight", color: h.color, text: h.text });
        }
      });
    (colored || []).forEach((c) => {
        const i = text.indexOf(c.text, lastEnd);
        if (i !== -1) {
          items.push({ start: i, end: i + c.text.length, type: "colored", color: c.color, text: c.text });
        }
      });
    items.sort((a, b) => a.start - b.start);
    items.forEach((item) => {
      if (item.start > lastEnd) {
        segments.push({ type: "normal", text: text.slice(lastEnd, item.start) });
      }
      segments.push({ type: item.type, text: item.text, color: item.color });
      lastEnd = item.end;
    });
    if (lastEnd < text.length) {
      segments.push({ type: "normal", text: text.slice(lastEnd) });
    }
    return segments
      .map((s) => {
        if (s.type === "normal") return s.text.replace(/</g, "&lt;");
        if (s.type === "highlight") {
          return `<span class="compute1-highlight" style="background-color:${s.color};color:white;padding:0.1em 0.2em;border-radius:0.2em">${s.text.replace(/</g, "&lt;")}</span>`;
        }
        return `<span class="compute1-colored" style="color:${s.color}">${s.text.replace(/</g, "&lt;")}</span>`;
      })
      .join("");
  }

  useEffect(() => {
    if (!config || !config.steps || config.steps.length === 0) return;

    let cumulativeDelay = 0;

    config.steps.forEach((step, index) => {
      cumulativeDelay += step.delay || 0;
      const t = setTimeout(() => {
        if (step.rowsCount !== undefined) {
          setRows([step.row1]);
          setRow1Highlight([]);
          setRow2Highlight([]);
          setRow3Highlight([]);
          setRow2Colored([]);
          setRow3Colored([]);
          setRow3FullReplace(null);
          setRow3FullHighlight(false);
        }
        if (step.appendRow !== undefined) {
          setRows((prev) => [...prev, step.appendRow]);
          setRow1Highlight([]);
          setRow2Highlight([]);
          setRow2Colored([]);
        }
        if (step.highlightRow1) {
          setRow1Highlight(step.highlightRow1);
        }
        if (step.highlightRow2) {
          setRow2Highlight(step.highlightRow2);
        }
        if (step.row2 !== undefined) {
          setRows((prev) => {
            const next = [...prev];
            if (next.length < 2) next.push(step.row2);
            else next[1] = step.row2;
            return next;
          });
        }
        if (step.row2Colored) {
          setRow2Colored(step.row2Colored);
        }
        if (step.row3 !== undefined) {
          setRows((prev) => {
            const next = [...prev];
            while (next.length < 3) next.push("");
            next[2] = step.row3;
            return next;
          });
        }
        if (step.row3Colored) {
          setRow3Colored(step.row3Colored);
        } else if (step.row3 !== undefined) {
          setRow3Colored([]);
        }
        if (step.row3FullHighlight) {
          setRow3FullHighlight(true);
        }
        if (step.row3Replace !== undefined) {
          setRow3FullReplace(step.row3Replace);
        }
        if (step.image) {
          onUpdateImage && onUpdateImage(step.image);
        }
        if (step.final) {
          setRow2Highlight([]);
          onUpdateImage && config.finalImage && onUpdateImage(config.finalImage);
          onEnableNext && onEnableNext();
          onUpdateNav && config.navFinal && onUpdateNav(config.navFinal);
        }
      }, cumulativeDelay);
      timersRef.current.push(t);
    });

    return () => clearTimers();
  }, [config]);

  if (!config) return null;

  return React.createElement(
    "div",
    { className: "compute1-panel" },
    config.title &&
      React.createElement("h3", { className: "compute1-title" }, config.title),
    React.createElement(
      "div",
      { className: "compute1-rows" },
      rows.map((rowText, rowIdx) => {
        if (rowIdx === 0) {
          const html = buildRowHtml(rowText, row1Highlight, null);
          return React.createElement("div", {
            key: "r0",
            className: "compute1-row",
            dangerouslySetInnerHTML: { __html: html },
          });
        }
        if (rowIdx === 1) {
          const html = buildRowHtml(rowText, row2Highlight, row2Colored);
          return React.createElement("div", {
            key: "r1",
            className: "compute1-row",
            dangerouslySetInnerHTML: { __html: html },
          });
        }
        if (rowIdx === 2) {
          if (row3FullReplace !== null) {
            return React.createElement(
              "div",
              {
                key: "r2",
                className: "compute1-row compute1-row-final",
              },
              row3FullReplace
            );
          }
          const html = buildRowHtml(rowText, row3Highlight, row3Colored);
          return React.createElement("div", {
            key: "r2",
            className: "compute1-row" + (row3FullHighlight ? " compute1-row-highlight" : ""),
            dangerouslySetInnerHTML: { __html: html },
          });
        }
        return null;
      })
    )
  );
};
