const Scale = ({
  wrongPositions,
  isAnswered,
  currentImage,
  correctPosition,
  onImageClick,
  registerImageRef,
  wrongText,
  showSparkle,
}) => {
  var scalePositions = APP_DATA.scalePositions;

  var getIndexPct = function (idx) {
    return idx * 25;
  };

  var getImageSrc = function (position) {
    if (isAnswered && position === correctPosition) return currentImage;
    if (wrongPositions.indexOf(position) !== -1) return "assets/wrong.png";
    return "assets/dashed.png";
  };

  var isClickable = function (position) {
    if (isAnswered) return false;
    if (wrongPositions.indexOf(position) !== -1) return false;
    return true;
  };

  var labelsRow = React.createElement(
    "div",
    { className: "scale-labels-row" },
    scalePositions.map(function (pos, i) {
      var position = i + 1;
      var isWrong = wrongPositions.indexOf(position) !== -1;
      return React.createElement(
        "div",
        {
          key: i,
          className:
            "scale-label-wrapper" + (isWrong ? " label-wrong-shake" : ""),
          style: { left: getIndexPct(i) + "%" },
        },
        React.createElement(
          "div",
          {
            className: "scale-label-text",
            style: { color: pos.dotColor },
          },
          pos.label.split("\n").map(function (line, j) {
            if (j === 0) {
              return React.createElement("span", { key: j }, line);
            }
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
      return React.createElement("div", {
        key: i,
        className: "scale-dot",
        style: {
          left: getIndexPct(i) + "%",
          backgroundColor: pos.dotColor,
          boxShadow: "0 0 0.4vw " + pos.dotColor,
        },
      });
    })
  );

  var imagesRow = React.createElement(
    "div",
    { className: "scale-images-row" },
    scalePositions.map(function (pos, i) {
      var position = i + 1;
      var imgSrc = getImageSrc(position);
      var clickable = isClickable(position);
      var isWrong = wrongPositions.indexOf(position) !== -1;
      var isCorrectAndAnswered = isAnswered && position === correctPosition;

      return React.createElement(
        "div",
        {
          key: i,
          ref: function (el) {
            registerImageRef(position, el);
          },
          className:
            "scale-image-wrapper" +
            (clickable ? " clickable" : "") +
            (isWrong ? " wrong-shake" : ""),
          style: { left: getIndexPct(i) + "%" },
          onClick: clickable
            ? function () {
                onImageClick(position);
              }
            : undefined,
        },
        React.createElement("img", {
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
                      "#FFD700",
                      "#FFF",
                      "#FF6B6B",
                      "#4ECDC4",
                      "#FFE66D",
                      "#A8E6CF",
                    ][idx % 6],
                  },
                });
              })
            )
          : null
      );
    })
  );

  return React.createElement(
    "div",
    { className: "scale-component" },
    labelsRow,
    trackRow,
    imagesRow
  );
};
