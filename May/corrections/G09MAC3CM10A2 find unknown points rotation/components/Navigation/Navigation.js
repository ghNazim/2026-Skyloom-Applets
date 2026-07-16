const Navigation = ({
  onNav,
  isNextDisabled,
  isPrevDisabled,
  navText,
  navTextHidden = false,
  nextSymbol = "»",
  showStartOver = false,
  onStartOver,
  startOverText = "START OVER",
}) => {
  const { useState, useEffect, useRef } = React;
  const [displayText, setDisplayText] = useState(navText || "");
  const [textVisible, setTextVisible] = useState(!navTextHidden);
  const prevHiddenRef = useRef(navTextHidden);
  const prevNavTextRef = useRef(navText || "");

  useEffect(() => {
    if (navTextHidden) {
      setTextVisible(false);
      prevHiddenRef.current = true;
      return;
    }

    const wasHidden = prevHiddenRef.current;
    prevHiddenRef.current = false;
    const nextText = navText || "";

    if (wasHidden) {
      setDisplayText(nextText);
      prevNavTextRef.current = nextText;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setTextVisible(true));
      });
      return;
    }

    if (nextText === prevNavTextRef.current) {
      setTextVisible(true);
      return;
    }

    prevNavTextRef.current = nextText;
    setTextVisible(false);
    const t = setTimeout(() => {
      setDisplayText(nextText);
      requestAnimationFrame(() => setTextVisible(true));
    }, 280);
    return () => clearTimeout(t);
  }, [navText, navTextHidden]);

  if (showStartOver) {
    return React.createElement(
      "div",
      { className: "navigation navigation-start-over" },
      React.createElement(
        "button",
        {
          className: "nav-start-over-btn",
          id: "start-over-button",
          onClick: onStartOver,
        },
        startOverText,
      ),
    );
  }

  return React.createElement(
    "div",
    { className: "navigation" },
    React.createElement(
      "button",
      {
        className: "nav-chevron",
        onClick: () => onNav("prev"),
        disabled: isPrevDisabled,
      },
      "«",
    ),
    React.createElement("div", {
      className:
        "nav-text-container" +
        (navTextHidden ? " nav-text-hidden" : "") +
        (textVisible ? " is-visible" : " is-fading"),
      dangerouslySetInnerHTML: { __html: displayText },
    }),
    React.createElement(
      "button",
      {
        className: "nav-chevron",
        onClick: () => onNav("next"),
        disabled: isNextDisabled,
        id: "next-button",
      },
      nextSymbol,
    ),
  );
};
