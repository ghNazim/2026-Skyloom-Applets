const RightPanel = ({ text, visible }) => {
  const { useState, useEffect, useRef } = React;
  const [displayText, setDisplayText] = useState(text || "");
  const [panelVisible, setPanelVisible] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const prevTextRef = useRef(text || "");

  useEffect(() => {
    if (!visible) {
      setPanelVisible(false);
      setTextVisible(false);
      return;
    }
    setPanelVisible(false);
    const t = requestAnimationFrame(() => {
      requestAnimationFrame(() => setPanelVisible(true));
    });
    return () => cancelAnimationFrame(t);
  }, [visible]);

  useEffect(() => {
    if (!visible) return undefined;

    const nextText = text || "";
    if (nextText === prevTextRef.current) {
      setTextVisible(true);
      return undefined;
    }

    prevTextRef.current = nextText;
    setTextVisible(false);
    const t = setTimeout(() => {
      setDisplayText(nextText);
      requestAnimationFrame(() => setTextVisible(true));
    }, 280);
    return () => clearTimeout(t);
  }, [text, visible]);

  if (!visible && !panelVisible) return null;

  return React.createElement(
    "div",
    {
      className:
        "right-panel" + (panelVisible ? " is-visible" : "") + (textVisible ? " text-visible" : ""),
    },
    React.createElement("p", { className: "right-panel-text" }, displayText),
  );
};
