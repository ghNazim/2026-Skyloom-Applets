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

const TransformList = ({ entries, reveal }) =>
  React.createElement(
    "div",
    { className: "transform-list" + (reveal ? " is-reveal" : "") },
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
  mcqChoice,
  mcqCollapsed,
  keptLabel,
  footerText,
  footerAction,
  onMcqSelect,
  onMcqTransitionEnd,
  onReveal,
  onNext,
}) => {
  const labels = APP_DATA.labels;

  const renderMcq = function () {
    if (!mcqChoice && stage !== "step2" && !mcqCollapsed) return null;

    const showTitle = stage === "step2" && !mcqCollapsed;
    const showOptionA =
      (stage === "step2" && !mcqCollapsed) ||
      (mcqCollapsed && mcqChoice === "dilateFirst");
    const showOptionB = stage === "step2" && !mcqCollapsed;

    return React.createElement(
      "div",
      { className: "mcq-container" + (mcqCollapsed ? " is-collapsed" : "") },
      React.createElement(
        "div",
        {
          className: "mcq-title-wrap" + (mcqCollapsed ? " is-hidden" : ""),
          onTransitionEnd: onMcqTransitionEnd,
        },
        React.createElement(
          "h2",
          { className: "mcq-title" },
          APP_DATA.panels.step2.title,
        ),
      ),
      React.createElement(
        "div",
        { className: "mcq-options" },
        showOptionA
          ? React.createElement(
              "button",
              {
                id: "mcq-dilate-first",
                className:
                  "mcq-option" +
                  (mcqChoice === "dilateFirst" ? " kept" : "") +
                  (mcqCollapsed && mcqChoice !== "dilateFirst"
                    ? " is-hidden"
                    : ""),
                disabled: mcqCollapsed || mcqChoice === "dilateFirst",
                onClick: function () {
                  onMcqSelect("dilateFirst");
                },
              },
              labels.dilateFirstThenTranslate,
            )
          : null,
        showOptionB
          ? React.createElement(
              "button",
              {
                id: "mcq-translate-first",
                className:
                  "mcq-option" +
                  (mcqCollapsed && mcqChoice !== "translateFirst"
                    ? " is-hidden"
                    : ""),
                disabled: true,
                onClick: function () {
                  onMcqSelect("translateFirst");
                },
              },
              labels.translateFirstThenDilate,
            )
          : null,
      ),
    );
  };

  const renderContent = function () {
    if (stage === "revealPanel") {
      return React.createElement(
        "div",
        { className: "reveal-content" },
        React.createElement(
          "h1",
          { className: "panel-heading success-heading" },
          revealHeading || APP_DATA.panels.translateSuccess.heading,
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
      );
    }

    if (stage === "translateSuccess") {
      return React.createElement(
        React.Fragment,
        null,
        panel.heading
          ? React.createElement(
              "h1",
              { className: "panel-heading success-heading" },
              panel.heading,
            )
          : null,
        React.createElement(RichLines, {
          lines: panel.lines,
          tokens: tokens,
          className: "instruction-lines",
        }),
      );
    }

    if (stage === "step2") {
      return null;
    }

    return React.createElement(
      React.Fragment,
      null,
      panel && panel.heading
        ? React.createElement(
            "h1",
            { className: "panel-heading" },
            panel.heading,
          )
        : null,
      panel && panel.lines
        ? React.createElement(RichLines, {
            lines: panel.lines,
            tokens: tokens,
            className: "instruction-lines",
          })
        : null,
    );
  };

  const renderFooter = function () {
    if (footerAction === "reveal") {
      return React.createElement(
        "button",
        {
          id: "reveal-button",
          className: "panel-action-button footer-action-button",
          onClick: onReveal,
        },
        labels.reveal,
      );
    }

    if (footerAction === "next") {
      return React.createElement(
        "button",
        {
          id: "next-button",
          className: "panel-action-button footer-action-button",
          onClick: onNext,
        },
        labels.next,
      );
    }

    if (footerText) {
      return React.createElement(
        "p",
        { className: "right-footer-text" },
        footerText,
      );
    }

    return null;
  };

  return React.createElement(
    "aside",
    { className: "right-workspace" },
    React.createElement(
      "div",
      { className: "right-main-row" },
      mcqChoice || stage === "step2"
        ? renderMcq()
        : null,
      showHistoryBox
        ? React.createElement(TransformList, { entries: historyEntries })
        : null,
      React.createElement(
        "div",
        {
          className:
            "right-text-panel" +
            (showHistoryBox ? " has-history" : "") +
            (mcqChoice || stage === "step2" ? " has-mcq" : ""),
        },
        renderContent(),
      ),
    ),
    React.createElement(
      "div",
      { className: "right-footer-row" },
      renderFooter(),
    ),
  );
};
