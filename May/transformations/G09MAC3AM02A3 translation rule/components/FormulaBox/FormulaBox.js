const FormulaBox = (props) => {
  const {
    visible = false,
    twoLine = false,
    threeLine = false,
    line1Grey = false,
    line1Shifted = false,
    line2Grey = false,
    line2Shifted = false,
    revealed = {},
    words = {},
    morph = {},
    morphWidths = {},
    line2 = {},
    line3 = {},
    highlightTopTerm = null,
    highlightLine2Term = null,
    line1Hidden = false,
    line2Hidden = false,
    slotImageCoordsRef,
    slotEqualsRef,
    slotPreimageCoordsRef,
    slotPlusRef,
    slotOpenParenRef,
    slotARef,
    slotCommaRef,
    slotBRef,
    slotCloseParenRef,
    slotTransMorphRef,
    slotImageWordRef,
    slotPreimageWordRef,
    slotTranslationWordRef,
    line2TranslationRef,
    line2EqualsRef,
    line2ImageRef,
    line2PreimageRef,
    line3PreimageRef,
    line3EqualsRef,
    line3ImageRef,
    line3TranslationRef,
  } = props;

  const f = APP_DATA.formula;
  const lbl = APP_DATA.svgLabels;

  const isTopHighlighted = (key) => highlightTopTerm === key;
  const isLine2Highlighted = (key) => highlightLine2Term === key;

  const highlightClass = (key, colorClass, onLine2) => {
    const active = onLine2 ? isLine2Highlighted(key) : isTopHighlighted(key);
    return active ? " formula-word-highlight " + colorClass : "";
  };

  const partClass = (isRevealed, morphKey, extra) => {
    const m = morphKey ? morph[morphKey] : null;
    let cls = "formula-part";
    if (extra) cls += " " + extra;
    if (isRevealed) cls += " revealed";
    if (m === "fadeOut") cls += " fading-out";
    if (m === "fadeIn") cls += " revealing";
    return cls;
  };

  const renderImageCoords = () =>
    React.createElement(
      "span",
      { className: "formula-slot-inner" },
      React.createElement("span", { className: "color-blue" }, lbl.openParen),
      React.createElement("span", { className: "color-pink" }, lbl.x),
      React.createElement("span", { className: "color-white" }, lbl.plus),
      React.createElement("span", { className: "color-yellow" }, lbl.a),
      React.createElement("span", { className: "color-blue" }, lbl.comma + " "),
      React.createElement("span", { className: "color-pink" }, lbl.y),
      React.createElement("span", { className: "color-white" }, lbl.plus),
      React.createElement("span", { className: "color-yellow" }, lbl.b),
      React.createElement("span", { className: "color-blue" }, lbl.closeParen),
    );

  const renderPreimageCoords = () =>
    React.createElement(
      "span",
      { className: "formula-slot-inner" },
      React.createElement("span", { className: "color-blue" }, lbl.openParen),
      React.createElement("span", { className: "color-pink" }, lbl.x),
      React.createElement("span", { className: "color-blue" }, lbl.comma + " "),
      React.createElement("span", { className: "color-pink" }, lbl.y),
      React.createElement("span", { className: "color-blue" }, lbl.closeParen),
    );

  const renderMorphSlot = (
    key,
    coordContent,
    wordText,
    wordClass,
    slotRef,
    wordRef,
  ) => {
    const coordRevealed = revealed[key] && !words[key];
    const wordRevealed = words[key];
    const width = morphWidths[key];
    const coordExtra = words[key] ? "coord-suppressed" : "";

    return React.createElement(
      "span",
      {
        ref: slotRef,
        className: "formula-morph-slot",
        style: width ? { width: width + "px" } : undefined,
      },
      React.createElement(
        "span",
        {
          className: partClass(coordRevealed, key, coordExtra),
        },
        coordContent,
      ),
      React.createElement(
        "span",
        {
          ref: wordRef,
          className:
            partClass(wordRevealed, key, "formula-word-layer " + wordClass) +
            highlightClass(key, wordClass, false),
        },
        wordText,
      ),
    );
  };

  const showLine1 = !threeLine;

  const boxClass =
    "formula-box" +
    (visible ? " visible" : "") +
    (threeLine || twoLine ? " two-line" : "") +
    (line1Hidden && !threeLine ? " line2-only" : "") +
    (line2Hidden && threeLine ? " line3-only" : "");

  return React.createElement(
    "div",
    { className: boxClass },
    showLine1
      ? React.createElement(
          "div",
          {
            className:
              "formula-line line-1" +
              (line1Grey ? " greyed" : "") +
              (line1Shifted && !line1Hidden ? " shifted" : "") +
              (line1Hidden ? " line-1-exit" : ""),
          },
          renderMorphSlot(
            "image",
            renderImageCoords(),
            f.imageCoordinates,
            "color-orange",
            slotImageCoordsRef,
            slotImageWordRef,
          ),
          React.createElement(
            "span",
            {
              ref: slotEqualsRef,
              className: partClass(revealed.equals, null) + " formula-op",
            },
            "=",
          ),
          renderMorphSlot(
            "preimage",
            renderPreimageCoords(),
            f.preimageCoordinates,
            "color-pink",
            slotPreimageCoordsRef,
            slotPreimageWordRef,
          ),
          React.createElement(
            "span",
            {
              ref: slotPlusRef,
              className: partClass(revealed.plus, null) + " formula-op",
            },
            "+",
          ),
          React.createElement(
            "span",
            {
              ref: slotTransMorphRef,
              className: "formula-morph-slot",
              style: morphWidths.translation
                ? { width: morphWidths.translation + "px" }
                : undefined,
            },
            React.createElement(
              "span",
              {
                className: partClass(
                  revealed.translation && !words.translation,
                  "translation",
                  words.translation ? "coord-suppressed" : "",
                ),
              },
              React.createElement(
                "span",
                { className: "formula-slot-inner" },
                React.createElement(
                  "span",
                  { ref: slotOpenParenRef, className: "color-yellow" },
                  lbl.openParen,
                ),
                React.createElement(
                  "span",
                  {
                    ref: slotARef,
                    className: "color-yellow",
                    "data-char": "a",
                  },
                  lbl.a,
                ),
                React.createElement(
                  "span",
                  { ref: slotCommaRef, className: "color-yellow" },
                  lbl.comma + " ",
                ),
                React.createElement(
                  "span",
                  {
                    ref: slotBRef,
                    className: "color-yellow",
                    "data-char": "b",
                  },
                  lbl.b,
                ),
                React.createElement(
                  "span",
                  { ref: slotCloseParenRef, className: "color-yellow" },
                  lbl.closeParen,
                ),
              ),
            ),
            React.createElement(
              "span",
              {
                ref: slotTranslationWordRef,
                className:
                  partClass(
                    words.translation,
                    "translation",
                    "formula-word-layer color-yellow",
                  ) + highlightClass("translation", "color-yellow", false),
              },
              f.translation,
            ),
          ),
        )
      : null,
    twoLine || threeLine
      ? React.createElement(
          "div",
          {
            className:
              "formula-line line-2" +
              (line2Grey ? " greyed" : "") +
              (line2Shifted && !line2Hidden ? " shifted" : "") +
              (line2Hidden ? " line-2-exit" : ""),
          },
          React.createElement(
            "span",
            {
              ref: line2TranslationRef,
              className:
                partClass(line2.translation, null) +
                " formula-word color-yellow" +
                highlightClass("translation", "color-yellow", true),
            },
            f.translation,
          ),
          React.createElement(
            "span",
            {
              ref: line2EqualsRef,
              className: partClass(line2.equals, null) + " formula-op",
            },
            "=",
          ),
          React.createElement(
            "span",
            {
              ref: line2ImageRef,
              className:
                partClass(line2.image, null) +
                " formula-word color-orange" +
                highlightClass("image", "color-orange", true),
            },
            f.imageCoordinates,
          ),
          React.createElement(
            "span",
            {
              className: partClass(line2.minus, null) + " formula-op",
            },
            "−",
          ),
          React.createElement(
            "span",
            {
              ref: line2PreimageRef,
              className:
                partClass(line2.preimage, null) +
                " formula-word color-pink" +
                highlightClass("preimage", "color-pink", true),
            },
            f.preimageCoordinates,
          ),
        )
      : null,
    threeLine
      ? React.createElement(
          "div",
          { className: "formula-line line-3" },
          React.createElement(
            "span",
            {
              ref: line3PreimageRef,
              className:
                partClass(line3.preimage, null) + " formula-word color-pink",
            },
            f.preimageCoordinates,
          ),
          React.createElement(
            "span",
            {
              ref: line3EqualsRef,
              className: partClass(line3.equals, null) + " formula-op",
            },
            "=",
          ),
          React.createElement(
            "span",
            {
              ref: line3ImageRef,
              className:
                partClass(line3.image, null) + " formula-word color-orange",
            },
            f.imageCoordinates,
          ),
          React.createElement(
            "span",
            {
              className: partClass(line3.minus, null) + " formula-op",
            },
            "−",
          ),
          React.createElement(
            "span",
            {
              ref: line3TranslationRef,
              className:
                partClass(line3.translation, null) +
                " formula-word color-yellow",
            },
            f.translation,
          ),
        )
      : null,
  );
};
