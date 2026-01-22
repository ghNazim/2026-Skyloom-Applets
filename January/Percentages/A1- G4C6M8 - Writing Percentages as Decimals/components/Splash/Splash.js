const Splash = ({ onButtonClick }) => {
  const splashData = APP_DATA.splash;

  return React.createElement(
    "div",
    { className: "splash-panel" },
    React.createElement(
      "div",
      { className: "splash-content" },
      // Equation Box
      React.createElement(
        "div",
        { className: "splash-equation-box" },
        // 24 (bluish)
        React.createElement("span", { 
          style: { color: "#4fc3f7", fontSize: '6vw', fontWeight: 'bold' } 
        }, "24"),
        // % (white)
        React.createElement("span", { 
          style: { color: "white", fontSize: '6vw', fontWeight: 'bold', marginLeft: '0.2vw' } 
        }, "%"),
        // = (green)
        React.createElement("span", { 
          style: { color: "#4caf50", fontSize: '6vw', fontWeight: 'bold', margin: "0 2vw" } 
        }, "="),
        // 0 (white)
        React.createElement("span", { 
          style: { color: "white", fontSize: '6vw', fontWeight: 'bold' } 
        }, "0"),
        // . (violet)
        React.createElement("span", { 
          style: { color: "#ff6b9d", fontSize: '6vw', fontWeight: 'bold', fontFamily: 'Georgia, sans-serif' } 
        }, decimalSymbol),
        // 24 (bluish)
        React.createElement("span", { 
          style: { color: "#4fc3f7", fontSize: '6vw', fontWeight: 'bold' } 
        }, "24")
      ),
      // Right Column - Text
      React.createElement(
        "div",
        { className: "splash-right-text" },
        splashData.rightText
      )
    ),
    // Button
    React.createElement(
      "button",
      {
        className: "btn splash-button",
        onClick: onButtonClick,
      },
      splashData.buttonText
    )
  );
};
