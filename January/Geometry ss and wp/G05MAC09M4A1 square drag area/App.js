const App = () => {
  const { useState } = React;

  const [questionText] = useState(APP_DATA.initial.q);
  const [navText] = useState(APP_DATA.initial.n);

  return React.createElement(
    "div",
    { className: "applet-container" },

    React.createElement(QuestionPanel, { text: questionText }),

    React.createElement(
      "div",
      { className: "app-main-content" },
      React.createElement(MainCanvas, null)
    ),

    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, { navText: navText })
    )
  );
};
