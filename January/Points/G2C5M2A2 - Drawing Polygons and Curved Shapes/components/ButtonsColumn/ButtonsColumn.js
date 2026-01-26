const ButtonsColumn = ({
  activeButton,
  onButtonClick,
  wrongButtonType,
}) => {
  const getStraightButtonClass = () => {
    let className = "drawing-button";
    if (activeButton === "straight") {
      className += " active";
    }
    if (wrongButtonType === "straight") {
      className += " wrong";
    }
    return className;
  };

  const getCurvedButtonClass = () => {
    let className = "drawing-button";
    if (activeButton === "curved") {
      className += " active";
    }
    if (wrongButtonType === "curved") {
      className += " wrong";
    }
    return className;
  };

  return React.createElement(
    "div",
    { className: "buttons-column" },
    // Straight button
    React.createElement(
      "button",
      {
        className: getStraightButtonClass(),
        onClick: () => onButtonClick("straight"),
        disabled: wrongButtonType === "straight",
      },
      React.createElement("img", {
        src: "assets/straight.png",
        alt: "Straight",
        className: "button-icon",
      }),
      React.createElement(
        "span",
        { className: "button-text" },
        APP_DATA.buttonStraight
      )
    ),
    // Curved button
    React.createElement(
      "button",
      {
        className: getCurvedButtonClass(),
        onClick: () => onButtonClick("curved"),
        disabled: wrongButtonType === "curved",
      },
      React.createElement("img", {
        src: "assets/curved.png",
        alt: "Curved",
        className: "button-icon",
      }),
      React.createElement(
        "span",
        { className: "button-text" },
        APP_DATA.buttonCurved
      )
    )
  );
};
