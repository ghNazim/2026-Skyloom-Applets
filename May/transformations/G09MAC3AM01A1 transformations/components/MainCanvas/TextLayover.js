const TextLayover = ({ visible, body, footer, onClose }) => {
  return React.createElement(
    "div",
    {
      className:
        "text-layover" + (visible ? " text-layover--visible" : ""),
      onClick: function () {
        if (visible && onClose) onClose();
      },
    },
    React.createElement("div", {
      className: "text-layover__body",
      dangerouslySetInnerHTML: { __html: body },
    }),
    React.createElement("p", {
      className: "text-layover__footer",
      dangerouslySetInnerHTML: { __html: footer },
    })
  );
};
