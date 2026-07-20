const Navigation = ({
  onNav,
  isNextDisabled,
  isPrevDisabled,
  navText,
  nextSymbol = "»",
  completionMode = false,
  completionVisible = true,
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
      completionVisible
        ? React.createElement(
            "button",
            {
              className: "btn start-over-btn start-over-btn-visible",
              id: "start-over-button",
              onClick: onStartOver,
            },
            startOverText
          )
        : React.createElement("div", {
            className: "start-over-placeholder",
            "aria-hidden": true,
          })
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
