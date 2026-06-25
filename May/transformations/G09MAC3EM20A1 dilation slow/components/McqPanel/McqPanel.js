const McqPanel = ({ mcq, wrongIndices, correctIndex, answered, onSelect }) => {
  if (!mcq) return null;

  const handleClick = (index) => {
    if (answered) return;
    if (wrongIndices.includes(index)) return;
    if (typeof onSelect === "function") onSelect(index);
  };

  return React.createElement(
    "div",
    { className: "mcq-panel" },
    React.createElement("div", {
      className: "mcq-panel-title",
      dangerouslySetInnerHTML: { __html: mcq.title },
    }),
    React.createElement(
      "div",
      { className: "mcq-panel-options" },
      mcq.options.map((opt, index) => {
        let cls = "mcq-option";
        if (wrongIndices.includes(index)) cls += " wrong";
        if (answered && index === correctIndex) cls += " correct";
        if (answered && index !== correctIndex) cls += " dimmed";
        const disabled =
          answered || wrongIndices.includes(index);
        return React.createElement(
          "button",
          {
            key: index,
            className: cls,
            disabled: disabled,
            onClick: () => handleClick(index),
          },
          opt,
        );
      }),
    ),
  );
};
