const SplashScreen = ({ contentText }) => {
  return React.createElement(
    "div",
    { className: "splash-screen" },
    React.createElement("div", {
      className: "splash-content-text",
      dangerouslySetInnerHTML: { __html: contentText },
    })
  );
};
