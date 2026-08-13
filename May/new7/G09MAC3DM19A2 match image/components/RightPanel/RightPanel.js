const COLOR_CLASSES = {
  orange: "color-orange",
  blue: "color-blue",
  purple: "color-purple",
  yellow: "color-yellow",
  green: "color-green",
  pink: "color-pink",
};

function richLinesToHtml(lines, tokens) {
  return lines
    .map(function (line) {
      return line
        .map(function (segment) {
          const text = segment.token ? tokens[segment.token] : segment.text;
          if (!segment.color) return text;
          return (
            '<span class="' +
            COLOR_CLASSES[segment.color] +
            '">' +
            text +
            "</span>"
          );
        })
        .join("");
    })
    .join("<br>");
}

const SegmentText = ({ line, tokens }) =>
  React.createElement(
    React.Fragment,
    null,
    line.map(function (segment, index) {
      const text = segment.token ? tokens[segment.token] : segment.text;
      return React.createElement(
        "span",
        {
          key: index,
          className: segment.color ? COLOR_CLASSES[segment.color] : undefined,
        },
        text,
      );
    }),
  );

const RichLines = ({ lines, tokens, className }) =>
  React.createElement(
    "div",
    { className: className || "instruction-lines" },
    lines.map(function (line, index) {
      return React.createElement(
        "p",
        { key: index },
        React.createElement(SegmentText, { line: line, tokens: tokens || {} }),
      );
    }),
  );

function splitTransformText(text) {
  const index = text.indexOf(":");
  if (index === -1) return { label: text, value: "" };
  return {
    label: text.slice(0, index + 1),
    value: text.slice(index + 1).trim(),
  };
}

function parseTranslationValue(value) {
  const match = value.match(/\(([-+]?\d+)\s*,\s*([-+]?\d+)\)/);
  return match ? { x: match[1], y: match[2] } : null;
}

const TransformList = ({ entries, reveal, listRef }) =>
  React.createElement(
    "div",
    {
      ref: reveal ? null : listRef,
      className: "transform-list" + (reveal ? " is-reveal" : ""),
    },
    entries.map(function (entry, index) {
      const parts = splitTransformText(entry.text);
      const vector =
        reveal && (entry.kind || entry.id) === "translation"
          ? parseTranslationValue(parts.value)
          : null;

      return React.createElement(
        "div",
        {
          key: entry.id,
          className:
            "transform-card transform-" +
            (entry.kind || entry.id) +
            (reveal ? " is-reveal-card" : ""),
        },
        React.createElement(
          "div",
          { className: "transform-card-content" },
          React.createElement(
            "span",
            { className: "transform-card-label" },
            parts.label,
          ),
          vector
            ? React.createElement(
                "span",
                { className: "transform-vector" },
                React.createElement("span", { className: "vector-bracket left" }),
                React.createElement(
                  "span",
                  { className: "vector-values" },
                  React.createElement("span", null, vector.x),
                  React.createElement("span", null, vector.y),
                ),
                React.createElement("span", { className: "vector-bracket right" }),
              )
            : React.createElement(
                "span",
                { className: "transform-card-value" },
                parts.value,
              ),
        ),
        reveal && index < entries.length - 1
          ? React.createElement("span", { className: "transform-card-arrow" })
          : null,
      );
    }),
  );

const RightPanel = ({
  stage,
  panel,
  tokens,
  historyEntries,
  showHistoryBox,
  revealHeading,
  action,
  onReveal,
  onNext,
  onReset,
}) => {
  const labels = APP_DATA.labels;
  const transformListRef = React.useRef(null);

  React.useEffect(
    function () {
      if (!showHistoryBox || !transformListRef.current) return;
      transformListRef.current.scrollTop = transformListRef.current.scrollHeight;
    },
    [historyEntries, showHistoryBox],
  );

  const renderContent = function () {
    if (stage === "reveal") {
      return React.createElement(
        "div",
        { className: "reveal-content" },
        React.createElement(
          "h1",
          { className: "panel-heading success-heading" },
          revealHeading || APP_DATA.panels.success.heading,
        ),
        React.createElement(TransformList, {
          entries: historyEntries,
          reveal: true,
        }),
        React.createElement(RichLines, {
          lines: panel.lines,
          tokens: tokens,
          className: "instruction-lines reveal-lines",
        }),
        React.createElement(
          "button",
          {
            id: "next-button",
            className: "panel-action-button",
            onClick: onNext,
          },
          labels.next,
        ),
      );
    }

    return React.createElement(
      React.Fragment,
      null,
      panel.heading
        ? React.createElement(
            "h1",
            {
              className:
                "panel-heading" +
                (stage === "success" ? " success-heading" : ""),
            },
            panel.heading,
          )
        : null,
      React.createElement(RichLines, {
        lines: panel.lines,
        tokens: tokens,
        className: "instruction-lines",
      }),
      stage === "success"
        ? React.createElement(
            "button",
            {
              id: "reveal-button",
              className: "panel-action-button",
              onClick: onReveal,
            },
          labels.reveal,
        )
        : null,
      action === "reset"
        ? React.createElement(
            "button",
            {
              id: "reset-button",
              className: "panel-action-button",
              onClick: onReset,
            },
            labels.reset,
          )
        : null,
    );
  };

  return React.createElement(
    "aside",
    { className: "right-workspace" },
    showHistoryBox
      ? React.createElement(TransformList, {
          entries: historyEntries,
          listRef: transformListRef,
        })
      : null,
    React.createElement(
      "div",
      {
        className: "right-text-panel" + (showHistoryBox ? " has-history" : ""),
      },
      renderContent(),
    ),
  );
};
