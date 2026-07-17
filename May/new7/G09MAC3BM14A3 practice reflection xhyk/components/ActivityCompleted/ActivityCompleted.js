const ActivityCompleted = ({ onStartOver }) => {
  return React.createElement(
    "div",
    { className: "activity-completed-panel" },
    React.createElement(
      "h1",
      { className: "activity-completed-heading" },
      APP_DATA.completed.heading,
    ),
    React.createElement("p", { className: "activity-completed-body" }, APP_DATA.completed.body),
    React.createElement(
      "button",
      {
        className: "btn activity-completed-button",
        onClick: onStartOver,
        id: "start-over-button",
      },
      APP_DATA.completed.startOver,
    ),
  );
};
