const Navigation = ({
  onNav,
  isNextDisabled,
  isPrevDisabled,
  navText,
  nextSymbol = "»",
  completionMode = false,
  startOverText = "",
  onStartOver,
}) => {
  const { useState, useEffect, useRef } = React;

  const [displayedText, setDisplayedText] = useState(navText);
  const [opacity, setOpacity] = useState(1);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (completionMode || navText === displayedText) return;
    setOpacity(0);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setDisplayedText(navText);
      setOpacity(1);
    }, 300);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [navText, completionMode, displayedText]);

  if (completionMode) {
    return React.createElement(
      "div",
      { className: "navigation navigation-completion" },
      React.createElement(
        "button",
        {
          className: "btn start-over-btn",
          id: "start-over-button",
          onClick: onStartOver,
        },
        startOverText
      )
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
      "«"
    ),
    React.createElement("div", {
      className: "nav-text-container",
      style: { opacity, transition: "opacity 0.3s ease" },
      dangerouslySetInnerHTML: { __html: displayedText || "" },
    }),
    React.createElement(
      "button",
      {
        className: "nav-chevron",
        onClick: () => onNav("next"),
        disabled: isNextDisabled,
        id: "next-button",
      },
      nextSymbol
    )
  );
};
