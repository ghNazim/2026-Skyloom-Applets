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

  function wrapFirstOutsideTags(html, searchText, openTag, closeTag) {
    var parts = html.split(/(<[^>]*>)/);
    var found = false;
    var depth = 0;
    var result = parts.map(function (part) {
      if (part.charAt(0) === '<') {
        if (part.charAt(1) === '/') depth--;
        else if (part.charAt(part.length - 2) !== '/') depth++;
        return part;
      }
      if (found || depth > 0) return part;
      var idx = part.indexOf(searchText);
      if (idx !== -1) {
        found = true;
        return part.slice(0, idx) + openTag + searchText + closeTag + part.slice(idx + searchText.length);
      }
      return part;
    });
    return result.join('');
  }

  function buildRowHtml(text, highlights, colored) {
    if (!text) return "";
    var html = text;
    var allItems = [];
    (highlights || []).forEach(function (h) {
      allItems.push({ text: h.text, color: h.color, type: "highlight" });
    });
    (colored || []).forEach(function (c) {
      allItems.push({ text: c.text, color: c.color, type: "colored" });
    });
    allItems.forEach(function (item) {
      var wrapOpen = item.type === "highlight"
        ? '<span class="compute1-highlight" style="display:inline-block;vertical-align:middle;background-color:' + item.color + ';color:white;padding:0.1em 0.2em;border-radius:0.2em">'
        : '<span class="compute1-colored" style="color:' + item.color + '">';
      var wrapClose = '</span>';
      if (item.text.indexOf('<') !== -1) {
        var idx = html.indexOf(item.text);
        if (idx !== -1) {
          html = html.slice(0, idx) + wrapOpen + item.text + wrapClose + html.slice(idx + item.text.length);
        }
      } else {
        html = wrapFirstOutsideTags(html, item.text, wrapOpen, wrapClose);
      }
    });
    return html;
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
        if (step.highlightRow1 || step.highlightRow2 || step.row2 !== undefined || step.row3 !== undefined || step.row3Replace !== undefined) {
          if (window.playSound) window.playSound("tick");
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
            return React.createElement("div", {
              key: "r2",
              className: "compute1-row compute1-row-final",
              dangerouslySetInnerHTML: { __html: row3FullReplace },
            });
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
