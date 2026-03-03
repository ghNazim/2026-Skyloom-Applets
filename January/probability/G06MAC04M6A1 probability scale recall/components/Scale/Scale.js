const Scale = ({ step, allVisible, showImages }) => {
  const shouldShowImages = showImages !== false;
  const scalePositions = APP_DATA.scalePositions;
  const images = APP_DATA.images;

  const getIndexPct = (idx) => idx * 25;

  const labelsRow = React.createElement(
    "div",
    { className: "scale-labels-row" },
    scalePositions.map((pos, i) =>
      React.createElement(
        "div",
        {
          key: i,
          className: "scale-label-wrapper",
          style: {
            left: getIndexPct(i) + "%",
            opacity: allVisible ? 1 : step === i + 1 ? 1 : 0,
            pointerEvents: allVisible || step === i + 1 ? "auto" : "none",
          },
        },
        React.createElement(
          "div",
          { className: "scale-label-bubble" },
          pos.label
        )
      )
    )
  );

  const trackRow = React.createElement(
    "div",
    { className: "scale-track-row" },
    React.createElement("div", { className: "scale-track-line" }),
    scalePositions.map((pos, i) =>
      React.createElement("div", {
        key: i,
        className: "scale-dot",
        style: {
          left: getIndexPct(i) + "%",
          backgroundColor: pos.dotColor,
          boxShadow: "0 0 0.4vw " + pos.dotColor,
        },
      })
    )
  );

  const imagesRow = shouldShowImages
    ? React.createElement(
        "div",
        { className: "scale-images-row" },
        images.map((img, i) =>
          React.createElement(
            "div",
            {
              key: i,
              className: "scale-image-wrapper",
              style: {
                left: getIndexPct(i) + "%",
                opacity: allVisible ? 1 : step === i + 1 ? 1 : 0.4,
              },
            },
            React.createElement("img", {
              src: img,
              className: "scale-image",
              draggable: false,
              alt: scalePositions[i].label,
            })
          )
        )
      )
    : null;

  return React.createElement(
    "div",
    {
      className:
        "scale-component" + (shouldShowImages ? "" : " scale-compact"),
    },
    labelsRow,
    trackRow,
    imagesRow
  );
};
