const RightPanel = ({
  visible,
  textHtml,
  mcq,
  mcqWrongIndices,
  mcqCorrectIndex,
  mcqAnswered,
  onMcqSelect,
}) => {
  const { useState, useEffect, useRef } = React;
  const [expanded, setExpanded] = useState(false);
  const [displayMcq, setDisplayMcq] = useState(mcq);
  const [displayText, setDisplayText] = useState(textHtml);
  const hideTimerRef = useRef(null);
  const wasVisibleRef = useRef(false);
  const PANEL_TRANSITION_MS = 450;

  useEffect(() => {
    if (visible) {
      setDisplayMcq(mcq);
      setDisplayText(textHtml);
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }

      if (!wasVisibleRef.current) {
        setExpanded(false);
        let outerRaf = 0;
        let innerRaf = 0;
        outerRaf = requestAnimationFrame(() => {
          innerRaf = requestAnimationFrame(() => setExpanded(true));
        });
        wasVisibleRef.current = true;
        return () => {
          cancelAnimationFrame(outerRaf);
          cancelAnimationFrame(innerRaf);
        };
      }

      setExpanded(true);
      wasVisibleRef.current = true;
      return undefined;
    }

    wasVisibleRef.current = false;
    setExpanded(false);
    hideTimerRef.current = setTimeout(() => {
      setDisplayMcq(null);
      setDisplayText("");
      hideTimerRef.current = null;
    }, PANEL_TRANSITION_MS);

    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
    };
  }, [visible, mcq, textHtml]);

  const hasContent = !!(displayMcq || displayText);

  return React.createElement(
    "div",
    {
      className:
        "dilation-right-panel" + (expanded ? " is-visible" : " is-hidden"),
    },
    hasContent
      ? React.createElement(
          "div",
          {
            className:
              "dilation-right-panel-inner" +
              (expanded ? " is-shown" : " is-collapsed"),
          },
          displayMcq
            ? React.createElement(McqPanel, {
                mcq: displayMcq,
                wrongIndices: mcqWrongIndices || [],
                correctIndex: mcqCorrectIndex,
                answered: mcqAnswered,
                onSelect: onMcqSelect,
              })
            : displayText
              ? React.createElement("div", {
                  className: "dilation-right-text",
                  dangerouslySetInnerHTML: {
                    __html: renderRichHtml(displayText),
                  },
                })
              : null,
        )
      : null,
  );
};
