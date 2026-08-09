const renderDicePips = (num) => {
  const pipConfigs = {
    1: [7],
    2: [3, 4],
    3: [3, 7, 4],
    4: [1, 3, 4, 2],
    5: [1, 3, 7, 4, 2],
    6: [1, 5, 4, 3, 6, 2],
  };
  const pips = pipConfigs[num] || [];
  return React.createElement(
    "div",
    { className: "dice-pips" },
    pips.map((pos) =>
      React.createElement("div", {
        key: `pip-${pos}`,
        className: `dice-pip dice-pip--pos-${pos}`,
      })
    )
  );
};

const getDiceRotation = (value) => {
  const rotations = {
    1: "rotateX(0deg) rotateY(0deg)",
    2: "rotateX(-90deg) rotateY(0deg)",
    3: "rotateX(0deg) rotateY(-90deg)",
    4: "rotateX(0deg) rotateY(90deg)",
    5: "rotateX(90deg) rotateY(0deg)",
    6: "rotateX(0deg) rotateY(180deg)",
  };
  return rotations[value] || "rotateX(-20deg) rotateY(-20deg)";
};

const Dice = ({ value, clickable, onClick, showIdleAnimation, isRolling, fastRoll }) => {
  const diceClasses =
    "dice" +
    (clickable ? " dice-clickable" : " dice-unclickable") +
    (showIdleAnimation && !clickable ? " dice-idle" : "") +
    (isRolling ? (fastRoll ? " dice-rolling dice-rolling--fast" : " dice-rolling") : "");

  const diceCube = React.createElement(
    "div",
    { className: "dice-cube" },
    React.createElement("div", { className: "dice-face dice-face-front" }, renderDicePips(1)),
    React.createElement("div", { className: "dice-face dice-face-back" }, renderDicePips(6)),
    React.createElement("div", { className: "dice-face dice-face-right" }, renderDicePips(3)),
    React.createElement("div", { className: "dice-face dice-face-left" }, renderDicePips(4)),
    React.createElement("div", { className: "dice-face dice-face-top" }, renderDicePips(2)),
    React.createElement("div", { className: "dice-face dice-face-bottom" }, renderDicePips(5))
  );

  return React.createElement(
    "div",
    {
      className: diceClasses,
      onClick: clickable ? onClick : null,
      style: {
        cursor: clickable ? "pointer" : "default",
        transform:
          value !== null && !isRolling ? getDiceRotation(value) : "rotateX(-20deg) rotateY(-20deg)",
        transition: fastRoll ? "none" : undefined,
      },
    },
    diceCube
  );
};

const DiceDisplay = ({ value, clickable, onClick, showIdleAnimation, isRolling, fastRoll }) =>
  React.createElement(
    "div",
    { className: "dice-container dice-count-1" },
    React.createElement(Dice, { value, clickable, onClick, showIdleAnimation, isRolling, fastRoll })
  );
