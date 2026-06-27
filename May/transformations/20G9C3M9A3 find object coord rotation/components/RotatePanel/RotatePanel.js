const RotatePanel = ({ visible, contentVisible, onRotate, disabled }) => {
  const rp = APP_DATA.rotatePanel;

  return React.createElement(
    "div",
    {
      className:
        "rotate-panel" + (visible ? " is-visible" : ""),
    },
    React.createElement(
      "div",
      {
        className:
          "rotate-panel-old" + (contentVisible ? " is-hidden" : ""),
      },
      React.createElement(RuleResultBox, {
        ruleState: GENERIC_RULE,
        visible: true,
      }),
    ),
    React.createElement(
      "div",
      {
        className:
          "rotate-panel-new" + (contentVisible ? " is-visible" : ""),
      },
      React.createElement("div", {
        className: "rotate-panel-text",
        dangerouslySetInnerHTML: { __html: rp.text },
      }),
      React.createElement(
        "button",
        {
          className: "btn rotate-panel-btn",
          id: "rotate-button",
          onClick: onRotate,
          disabled: disabled,
        },
        rp.buttonText,
      ),
    ),
  );
};
