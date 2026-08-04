const RightPanel = ({
  text,
  html,
  visible,
  buttonText,
  buttonId,
  onButtonClick,
  buttonDisabled = false,
  buttonVisible = false,
}) => {
  const { useState, useEffect, useRef } = React;
  const content = html || text || "";
  const [displayContent, setDisplayContent] = useState(content);
  const [panelVisible, setPanelVisible] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const prevContentRef = useRef(content);

  useEffect(() => {
    if (!visible) {
      setPanelVisible(false);
      setTextVisible(false);
      return undefined;
    }
    setPanelVisible(false);
    const frameId = requestAnimationFrame(() => {
      requestAnimationFrame(() => setPanelVisible(true));
    });
    return () => cancelAnimationFrame(frameId);
  }, [visible]);

  useEffect(() => {
    if (!visible) return undefined;

    if (content === prevContentRef.current) {
      setTextVisible(true);
      return undefined;
    }

    prevContentRef.current = content;
    setTextVisible(false);
    const t = setTimeout(() => {
      setDisplayContent(content);
      requestAnimationFrame(() => setTextVisible(true));
    }, 280);
    return () => clearTimeout(t);
  }, [content, visible]);

  if (!visible && !panelVisible) return null;

  return React.createElement(
    "div",
    {
      className:
        "right-panel" +
        (panelVisible ? " is-visible" : "") +
        (textVisible ? " text-visible" : ""),
    },
    React.createElement("p", {
      className: "right-panel-text",
      dangerouslySetInnerHTML: { __html: displayContent },
    }),
    buttonVisible
      ? React.createElement(
          "button",
          {
            id: buttonId,
            className: "btn right-panel-action",
            disabled: buttonDisabled,
            onClick: buttonDisabled ? null : onButtonClick,
          },
          buttonText,
        )
      : null,
  );
};
