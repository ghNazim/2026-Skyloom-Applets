const App = () => {
  const { useState } = React;

  const [questionText, setQuestionText] = useState(APP_DATA.initial.q);
  const [navText] = useState(APP_DATA.initial.n);

  const handleSliderMove = (hasMoved) => {
    if (hasMoved) {
      setQuestionText(APP_DATA.sliderMoved.q);
    } else {
      setQuestionText(APP_DATA.initial.q);
    }
  };

  return React.createElement(
    "div",
    { className: "applet-container" },

    React.createElement(QuestionPanel, { text: questionText }),

    React.createElement(
      "div",
      { className: "app-main-content" },
      React.createElement(MainCanvas, { onSliderMove: handleSliderMove })
    ),

    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, { navText: navText })
    )
  );
};
