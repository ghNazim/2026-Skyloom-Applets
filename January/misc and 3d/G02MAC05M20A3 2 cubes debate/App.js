const App = () => {
  const { useState, useEffect, useRef } = React;

  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [navText, setNavText] = useState(APP_DATA.navText);
  const [nextButtonText, setNextButtonText] = useState("»");
  const startOverHandlerRef = useRef(null);

  const handleCorrectAnswer = () => {
    setIsNextDisabled(false);
    setNavText(APP_DATA.navTextStartOver);
    setNextButtonText(APP_DATA.startOverButton);
  };

  const handleStartOver = () => {
    if (startOverHandlerRef.current) {
      startOverHandlerRef.current();
    }
    setIsNextDisabled(true);
    setNavText(APP_DATA.navText);
    setNextButtonText("»");
  };

  const handleNav = (dir) => {
    if (dir === "next" && !isNextDisabled) {
      handleStartOver();
    }
  };

  return React.createElement(
    "div",
    { className: "applet-container" },
    React.createElement(QuestionPanel, {
      text: APP_DATA.questionText,
      step: 1,
    }),
    React.createElement(
      "div",
      { className: "app-main-content" },
      React.createElement(CubesDebateCanvas, {
        onCorrectAnswer: handleCorrectAnswer,
        onStartOverReady: (handler) => {
          startOverHandlerRef.current = handler;
        },
      })
    ),
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: handleNav,
        isNextDisabled: isNextDisabled,
        isPrevDisabled: true,
        navText: navText,
        nextSymbol: nextButtonText,
      })
    )
  );
};
