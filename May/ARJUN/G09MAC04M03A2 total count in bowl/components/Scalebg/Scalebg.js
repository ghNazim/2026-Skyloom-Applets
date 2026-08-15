function scaleBgHexToRgba(hex, alpha) {
  var h = hex.replace("#", "");
  var r = parseInt(h.substring(0, 2), 16);
  var g = parseInt(h.substring(2, 4), 16);
  var b = parseInt(h.substring(4, 6), 16);
  return "rgba(" + r + "," + g + "," + b + "," + alpha + ")";
}

function scaleBgPanelSegments(col) {
  var panelBg = scaleBgHexToRgba(col.dotColor, 0.28);
  var panelBgDeep = scaleBgHexToRgba(col.dotColor, 0.38);
  var borderCol = scaleBgHexToRgba(col.dotColor, 0.55);
  return {
    label: {
      background:
        "linear-gradient(180deg, " +
        panelBgDeep +
        " 0%, " +
        panelBg +
        " 90%, " +
        panelBg +
        " 100%)",
      borderColor: borderCol,
    },
    dot: {
      background: panelBg,
      borderColor: borderCol,
    },
    visual: {
      background:
        "linear-gradient(180deg, " +
        panelBg +
        " 0%, " +
        panelBg +
        " 12%, " +
        panelBgDeep +
        " 100%)",
      borderColor: borderCol,
    },
  };
}

const Scalebg = function (props) {
  props = props || {};
  var columns = props.columns || APP_DATA.introScaleBg.columns;
  var imageSrcs = props.imageSrcs;
  var segsList = columns.map(function (col) {
    return scaleBgPanelSegments(col);
  });

  return React.createElement(
    "div",
    { className: "scale-bg" },
    columns.map(function (col, i) {
      return React.createElement("div", {
        key: "lab-" + i,
        className: "scale-bg-label-slot",
        style: Object.assign({ gridColumn: i + 1, gridRow: 1 }, segsList[i].label),
        dangerouslySetInnerHTML: { __html: col.labelHtml },
      });
    }),
    React.createElement(
      "div",
      { className: "scale-bg-track-row" },
      React.createElement("div", { className: "scale-bg-track-line" }),
      columns.map(function (col, i) {
        return React.createElement(
          "div",
          {
            key: "dot-" + i,
            className: "scale-bg-dot-slot",
            style: segsList[i].dot,
          },
          React.createElement("div", {
            className: "scale-bg-dot",
            style: {
              backgroundColor: col.dotColor,
              boxShadow:
                "0 0 0.35vw " +
                col.dotColor +
                ", 0 0 0.8vw rgba(0,0,0,0.35)",
            },
          })
        );
      })
    ),
    columns.map(function (col, i) {
      var src =
        imageSrcs && imageSrcs.length
          ? imageSrcs[i]
          : "assets/" + (i + 1) + ".png";
      return React.createElement(
        "div",
        {
          key: "vis-" + i,
          className: "scale-bg-visual-slot",
          style: Object.assign({ gridColumn: i + 1, gridRow: 3 }, segsList[i].visual),
        },
        src
          ? React.createElement("img", {
              src: src,
              className: "scale-bg-visual-img",
              alt: "",
              draggable: false,
            })
          : React.createElement("div", { className: "scale-bg-visual-placeholder" })
      );
    })
  );
};
