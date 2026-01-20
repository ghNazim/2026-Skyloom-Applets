const ratioMap = {
  0: {
    small: "= 3 : 4 : 5",
    large: "= 6 : 8 : 10",
  },
  1: {
    small: "= 5 : 12 : 13",
    large: "=10 : 24 : 26",
  },
  2: {
    small: "= 8 : 15 : 17",
    large: "= 16 : 30 : 34",
  },
};

const Page2 = ({ question }) => {
  // This component displays two triangle examples and an explanatory text,
  // based on the provided image. It is designed to be shown at a specific step
  // in the learning application.

  // The main container uses flexbox to create a side-by-side layout.
  return React.createElement(
    "div",
    { className: "page2-container" },

    // Left panel containing two informational cards.
    React.createElement(
      "div",
      { className: "page2-left-panel" },

      // First card with the smaller triangle (3:4:5 ratio).
      React.createElement(
        "div",
        { className: "page2-card" },
        React.createElement("img", {
          className: "small-image",
          src: `assets/small${question + 1}.svg`,
          alt: "A 3-4-5 right triangle with angles 37 and 53 degrees.",
        }),
        React.createElement("p", null, APP_DATA.ratio),
        React.createElement("p", null, ratioMap[question].small)
      ),

      // Second card with the larger triangle (6:8:10 ratio, simplified to 3:4:5).
      React.createElement(
        "div",
        { className: "page2-card" },
        React.createElement("img", {
          className: "big-image",
          src: `assets/big${question + 1}.svg`,
          alt: "A 6-8-10 right triangle with angles 37 and 53 degrees.",
        }),
        React.createElement("p", null, APP_DATA.ratio),
        React.createElement("p", null, ratioMap[question].large),
        React.createElement("p", null, ratioMap[question].small)
      )
    ),

    // Right panel with the explanatory text.
    React.createElement(
      "div",
      { className: "page2-right-panel" },
      React.createElement("p", null, APP_DATA.side[question + 1])
    )
  );
};
