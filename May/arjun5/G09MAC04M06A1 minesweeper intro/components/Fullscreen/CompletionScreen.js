const CompletionScreen = ({ onRestart, buttonRef }) => {
  const { createElement: e } = React;
  const final = APP_DATA.final;
  const html = (text) => (typeof handleComma === "function" ? handleComma(text) : text);

  return e(Fullscreen, {
    heading: final.heading,
    text: html(final.text),
    buttonText: final.buttonText,
    hintText: final.hintText,
    onButtonClick: onRestart,
    buttonRef,
  });
};
