const TRANSFORM_BUTTONS = [
  { id: "move", src: "assets/move.png", exploredSrc: "assets/movex.png" },
  { id: "rotate", src: "assets/rotate.png", exploredSrc: "assets/rotatex.png" },
  { id: "zoom", src: "assets/zoom.png", exploredSrc: "assets/zoomx.png" },
  { id: "mirror", src: "assets/mirror.png", exploredSrc: "assets/mirrorx.png" },
];

const Navigation = ({
  activeButton,
  clickableButtons = [],
  exploredButtons = [],
  navText = "",
  navTextVisible = false,
  showStartOver = false,
  showExploredImages = false,
  startOverText = "Start Over",
  onButtonClick,
  onStartOver,
  moveBtnRef,
}) => {
  const isClickable = (id) => clickableButtons.includes(id);

  const getButtonClass = (id) => {
    var classes = ["nav-transform-btn"];
    if (activeButton === id) classes.push("active");
    if (exploredButtons.includes(id) && showExploredImages) classes.push("explored");
    else if (activeButton && activeButton !== id) classes.push("inactive");
    if (!isClickable(id)) classes.push("not-clickable");
    return classes.join(" ");
  };

  const getButtonSrc = (btn) =>
    showExploredImages && exploredButtons.includes(btn.id)
      ? btn.exploredSrc
      : btn.src;

  return React.createElement(
    "div",
    { className: "navigation" },
    React.createElement(
      "div",
      { className: "nav-images-row" },
      TRANSFORM_BUTTONS.map(function (btn) {
        return React.createElement(
          "button",
          {
            key: btn.id,
            ref: btn.id === "move" ? moveBtnRef : null,
            className: getButtonClass(btn.id),
            onClick: function () {
              if (isClickable(btn.id) && onButtonClick) onButtonClick(btn.id);
            },
            disabled: !isClickable(btn.id),
            "aria-label": APP_DATA.navigation[btn.id],
          },
          React.createElement("img", {
            src: getButtonSrc(btn),
            alt: APP_DATA.navigation[btn.id],
            draggable: false,
          })
        );
      })
    ),
    React.createElement(
      "div",
      {
        className:
          "nav-text-row" + (navTextVisible ? " nav-text-row--visible" : ""),
      },
      showStartOver
        ? React.createElement(
            "button",
            {
              className: "btn nav-start-over-btn",
              onClick: function () {
                if (onStartOver) onStartOver();
              },
            },
            startOverText
          )
        : React.createElement("p", {
            className: "nav-text-row__content",
            dangerouslySetInnerHTML: { __html: navText || "" },
          })
    )
  );
};
