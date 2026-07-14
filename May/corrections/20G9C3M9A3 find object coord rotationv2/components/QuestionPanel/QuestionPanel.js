const HIGHLIGHT_CLASS_NAMES = ["purple-bg", "cyan-bg", "orange-bg"];

const QuestionPanel = ({
  html,
  visibleHighlights = [],
  showQuestionVisual = false,
  questionVisualVisible = false,
  visualMode = "segment",
  objectBoxA = null,
  objectBoxB = null,
  rectObjectBoxes = {},
  rectImageBoxes = {},
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

  if (showQuestionVisual && visualMode === "rect") {
    const qv = APP_DATA.questionVisual2;
    const keys = qv.keys;

    return React.createElement(
      "div",
      { className: "question-panel" },
      React.createElement(
        "div",
        {
          className:
            "question-visual is-rect" +
            (questionVisualVisible ? " is-visible" : ""),
        },
        keys.map((key) =>
          React.createElement(
            "div",
            { key: "obj-" + key, className: "qv-box qv-object-box" },
            rectObjectBoxes[key]
              ? React.createElement(
                  "span",
                  { key: rectObjectBoxes[key], className: "qv-box-text" },
                  rectObjectBoxes[key],
                )
              : null,
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
        keys.map((key) =>
          React.createElement(
            "div",
            {
              key: "img-" + key,
              id: "qv-image-" + key.toLowerCase(),
              className: "qv-box qv-image-box",
            },
            rectImageBoxes[key]
              ? React.createElement(
                  "span",
                  { key: rectImageBoxes[key], className: "qv-box-text" },
                  rectImageBoxes[key],
                )
              : null,
          ),
        ),
      ),
    );
  }

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
