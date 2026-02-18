const App = () => {
  const { useState } = React;

  const [questionText] = useState(APP_DATA.initial.q);
  const [navText, setNavText] = useState(APP_DATA.initial.n);
  const [feedbackText, setFeedbackText] = useState("");

  return React.createElement(
    "div",
    { className: "applet-container" },

    React.createElement(QuestionPanel, { text: questionText }),

    React.createElement(
      "div",
      { className: "app-main-content" },
      React.createElement(MainCanvas, { 
        navText: navText,
        setNavText: setNavText,
        feedbackText: feedbackText,
        setFeedbackText: setFeedbackText
      })
    ),

    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, { navText: navText })
    )
  );
};
