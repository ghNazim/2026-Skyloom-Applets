var Fullscreen2Button = React.forwardRef(function (props, ref) {
  return React.createElement(
    "button",
    {
      ref: ref,
      className: "btn fullscreen2-button",
      onClick: props.onClick,
    },
    props.text
  );
});

var Fullscreen2 = function (props) {
  var data = props.data;
  if (!data) return null;

  var children = [];

  children.push(
    React.createElement("p", {
      key: "heading",
      className: "fullscreen2-heading",
    }, data.heading)
  );

  children.push(
    React.createElement(
      "div",
      { key: "scale", className: "fullscreen2-scale-wrap" },
      React.createElement(Scalebg, {
        columns: data.scaleColumns,
        hideVisuals: true,
      })
    )
  );

  if (data.scaleText) {
    children.push(
      React.createElement("div", {
        key: "scaleText",
        className: "fullscreen2-scale-text",
        dangerouslySetInnerHTML: { __html: data.scaleText },
      })
    );
  }

  children.push(
    React.createElement("div", {
      key: "box",
      className: "fullscreen2-card",
      dangerouslySetInnerHTML: { __html: data.boxedHtml },
    })
  );

  if (data.instructionText) {
    children.push(
      React.createElement("p", {
        key: "instruction",
        className: "fullscreen2-instruction",
      }, data.instructionText)
    );
  }

  children.push(
    React.createElement(Fullscreen2Button, {
      key: "btn",
      ref: props.buttonRef,
      text: data.buttonText,
      onClick: props.onButtonClick,
    })
  );

  return React.createElement("div", { className: "fullscreen2-panel" }, children);
};
