var Scale = function (props) {
  var scalePositions = APP_DATA.scalePositions;
  var revealedPositions = props.revealedPositions || [1, 5];
  var filledPositions = props.filledPositions || {};
  var wrongPositions = props.wrongPositions || [];
  var correctPosition = props.correctPosition || 0;
  var isAnswered = props.isAnswered || false;
  var currentImage = props.currentImage || "";
  var onImageClick = props.onImageClick;
  var registerImageRef = props.registerImageRef;
  var wrongText = props.wrongText || "";
  var showSparkle = props.showSparkle || false;
  var showImagesRow = props.showImagesRow !== false;
  var showLabel2 = props.showLabel2 || false;
  var introText = props.introText || null;
  var hideNonCorrectSlotImages = props.hideNonCorrectSlotImages || false;
  var glowCorrectDot = props.glowCorrectDot || false;

  var getIndexPct = function (idx) {
    return idx * 25;
  };

  var isRevealed = function (position) {
    return revealedPositions.indexOf(position) !== -1;
  };

  var isSvgHtml = function (val) {
    return typeof val === "string" && val.indexOf("<svg") === 0;
  };

  var getImageSrc = function (position) {
    if (isAnswered && position === correctPosition) return currentImage;
    if (filledPositions[position]) return filledPositions[position];
    if (wrongPositions.indexOf(position) !== -1) return "assets/wrong.png";
    return "assets/dashed.png";
  };

  var isClickable = function (position) {
    if (isAnswered) return false;
    if (filledPositions[position]) return false;
    if (wrongPositions.indexOf(position) !== -1) return false;
    return !!onImageClick;
  };

  var labelsRow = React.createElement(
    "div",
    { className: "scale-labels-row" },
    scalePositions.map(function (pos, i) {
      var position = i + 1;
      var revealed = isRevealed(position);
      var isWrong = wrongPositions.indexOf(position) !== -1;
      return React.createElement(
        "div",
        {
          key: i,
          className: "scale-label-wrapper" + (isWrong ? " label-wrong-shake" : ""),
          style: {
            left: getIndexPct(i) + "%",
            opacity: revealed ? 1 : 0,
            transition: "opacity 0.4s ease",
          },
        },
        React.createElement(
          "div",
          {
            className: "scale-label-text",
            style: { color: pos.dotColor },
          },
          pos.label.split("\n").map(function (line, j) {
            if (j === 0) return React.createElement("span", { key: j }, line);
            return React.createElement(
              React.Fragment,
              { key: j },
              React.createElement("br"),
              line
            );
          })
        )
      );
    })
  );

  var trackRow = React.createElement(
    "div",
    { className: "scale-track-row" },
    React.createElement("div", { className: "scale-track-line" }),
    scalePositions.map(function (pos, i) {
      var position = i + 1;
      var revealed = isRevealed(position);
      var dotGlow = glowCorrectDot && position === correctPosition;
      return React.createElement("div", {
        key: i,
        className: "scale-dot" + (dotGlow ? " active-glow" : ""),
        style: {
          left: getIndexPct(i) + "%",
          backgroundColor: revealed ? pos.dotColor : "#888",
          boxShadow: dotGlow
            ? undefined
            : revealed
              ? "0 0 0.4vw " + pos.dotColor
              : "none",
          transition: dotGlow
            ? undefined
            : "background-color 0.4s ease, box-shadow 0.4s ease",
          "--dot-color": pos.dotColor,
        },
      });
    })
  );

  var label2Row = showLabel2
    ? React.createElement(
        "div",
        { className: "scale-label2-row" },
        scalePositions.map(function (pos, i) {
          var position = i + 1;
          var revealed = isRevealed(position);
          return React.createElement(
            "div",
            {
              key: i,
              className: "scale-label2-item",
              style: {
                left: getIndexPct(i) + "%",
                color: revealed ? pos.dotColor : "#888",
              },
            },
            String(position)
          );
        })
      )
    : null;

  var imagesRow = showImagesRow
    ? React.createElement(
        "div",
        { className: "scale-images-row" },
        scalePositions.map(function (pos, i) {
          var position = i + 1;
          var isCorrectAndAnswered = isAnswered && position === correctPosition;
          if (
            hideNonCorrectSlotImages &&
            isAnswered &&
            position !== correctPosition
          ) {
            return React.createElement("div", {
              key: i,
              className: "scale-image-wrapper scale-image-slot-hidden",
              style: { left: getIndexPct(i) + "%" },
            });
          }
          var imgSrc = getImageSrc(position);
          var clickable = isClickable(position);
          var isWrong = wrongPositions.indexOf(position) !== -1;

          return React.createElement(
            "div",
            {
              key: i,
              ref: registerImageRef
                ? function (el) { registerImageRef(position, el); }
                : undefined,
              className:
                "scale-image-wrapper" +
                (clickable ? " clickable" : "") +
                (isWrong ? " wrong-shake" : ""),
              style: { left: getIndexPct(i) + "%" },
              onClick: clickable
                ? function () { onImageClick(position); }
                : undefined,
            },
            isSvgHtml(imgSrc)
              ? React.createElement("div", {
                  className: "scale-image scale-image-svg",
                  dangerouslySetInnerHTML: { __html: imgSrc },
                })
              : React.createElement("img", {
                  src: imgSrc,
                  className: "scale-image",
                  draggable: false,
                  alt: pos.label.replace("\n", " "),
                }),
            isWrong
              ? React.createElement("div", { className: "wrong-text" }, wrongText)
              : null,
            showSparkle && isCorrectAndAnswered
              ? React.createElement(
                  "div",
                  { className: "sparkle-container" },
                  Array.from({ length: 12 }).map(function (_, idx) {
                    var angle = (idx * 30 * Math.PI) / 180;
                    var dist = 3.5 + (idx % 3);
                    return React.createElement("div", {
                      key: idx,
                      className: "sparkle-particle",
                      style: {
                        "--tx": (Math.cos(angle) * dist).toFixed(2) + "vw",
                        "--ty": (Math.sin(angle) * dist).toFixed(2) + "vw",
                        "--delay": (idx * 0.04).toFixed(2) + "s",
                        "--color": [
                          "#FFD700", "#FFF", "#FF6B6B",
                          "#4ECDC4", "#FFE66D", "#A8E6CF",
                        ][idx % 6],
                      },
                    });
                  })
                )
              : null
          );
        })
      )
    : null;

  var introTextEl = introText
    ? React.createElement("div", {
        className: "scale-intro-text",
        dangerouslySetInnerHTML: { __html: introText },
      })
    : null;

  return React.createElement(
    "div",
    {
      className:
        "scale-component" +
        (introText ? " scale-component--intro-below" : ""),
    },
    labelsRow,
    trackRow,
    label2Row,
    imagesRow,
    introTextEl
  );
};
