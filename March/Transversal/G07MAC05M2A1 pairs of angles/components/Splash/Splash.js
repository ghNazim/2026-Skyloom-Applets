const Splash = (props) => {
  const { step } = props;
  const stepData = APP_DATA.steps[step];
  const imgSrc = step === 7 ? "assets/summary2.png" : "assets/summary1.png";
  
  return React.createElement("div", { className: "splash-container" },
    React.createElement("div", { className: "splash-left" },
      React.createElement("img", { src: imgSrc, className: "splash-img" })
    ),
    React.createElement("div", { className: "splash-right" },
      React.createElement("div", { className: "splash-text", dangerouslySetInnerHTML: { __html: stepData.text } })
    )
  );
};
