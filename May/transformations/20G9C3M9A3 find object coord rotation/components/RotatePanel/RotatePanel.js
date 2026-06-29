const RotatePanel = ({
  visible,
  contentVisible,
  onRotate,
  disabled,
  panelConfig,
  ruleVariant,
}) => {
  const rp = panelConfig || APP_DATA.rotatePanel;
  const genericRule =
    ruleVariant === "180" ? GENERIC_RULE_180 : GENERIC_RULE;

  return React.createElement(
    "div",
    {
      className: "rotate-panel" + (visible ? " is-visible" : ""),
    },
    React.createElement(
      "div",
      {
        className: "rotate-panel-old" + (contentVisible ? " is-hidden" : ""),
      },
      React.createElement(RuleResultBox, {
        ruleState: genericRule,
        visible: true,
        variant: ruleVariant,
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
