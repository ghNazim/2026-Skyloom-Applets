const HIGHLIGHT_CLASS_NAMES = ["purple-bg", "cyan-bg", "orange-bg"];

const QuestionPanel = ({
  html,
  visibleHighlights = [],
  showQuestionVisual = false,
  questionVisualVisible = false,
  objectBoxA = null,
  objectBoxB = null,
}) => {
  const content = html || "";

  let processedHtml = content;
  HIGHLIGHT_CLASS_NAMES.forEach((className) => {
    const re = new RegExp(
      'id="(highlight-[^"]+)" class="' + className + '([^"]*)"',
      "g",
    );
    processedHtml = processedHtml.replace(re, (match, id, extra) => {
      const visible = visibleHighlights.indexOf(id) !== -1;
      return (
        'id="' +
        id +
        '" class="' +
        className +
        (extra || "") +
        (visible ? " is-visible" : "") +
        '"'
      );
    });
  });

  const qv = APP_DATA.questionVisual;
  const boxA = objectBoxA != null ? objectBoxA : qv.objectAUnknown;
  const boxB = objectBoxB != null ? objectBoxB : qv.objectBUnknown;

  return React.createElement(
    "div",
    { className: "question-panel" },
    showQuestionVisual
      ? React.createElement(
          "div",
          {
            className:
              "question-visual" +
              (questionVisualVisible ? " is-visible" : ""),
          },
          React.createElement(
            "div",
            { className: "qv-box qv-object-box" },
            React.createElement(
              "span",
              { key: boxA, className: "qv-box-text" },
              boxA,
            ),
          ),
          React.createElement(
            "div",
            { className: "qv-box qv-object-box" },
            React.createElement(
              "span",
              { key: boxB, className: "qv-box-text" },
              boxB,
            ),
          ),
          React.createElement(
            "div",
            { className: "qv-arrow-box" },
            React.createElement("img", {
              className: "qv-arrow-img",
              src: "assets/arrow.svg",
              alt: "",
            }),
            React.createElement(
              "span",
              { className: "qv-arrow-text" },
              qv.rotation,
            ),
          ),
          React.createElement(
            "div",
            { className: "qv-box qv-image-box" },
            qv.imageA,
          ),
          React.createElement(
            "div",
            { className: "qv-box qv-image-box" },
            qv.imageB,
          ),
        )
      : React.createElement("h2", {
          dangerouslySetInnerHTML: { __html: processedHtml },
        }),
  );
};
