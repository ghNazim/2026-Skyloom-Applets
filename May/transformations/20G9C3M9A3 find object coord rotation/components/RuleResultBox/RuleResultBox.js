const RuleResultBox = ({ ruleState, coordRefs, visible }) => {
  const rp = APP_DATA.rulePanel;

  const imgNegY = ruleState.imgNegY;
  const imgX = ruleState.imgX;
  const objX = ruleState.objX;
  const objY = ruleState.objY;

  const renderImgNegY = () => {
    if (!imgNegY) {
      return React.createElement(
        "span",
        {
          id: "rule-ref-img-neg-y",
          className: "rule-val rule-image-val",
          ref: (el) => {
            if (coordRefs) coordRefs.current.imgNegY = el;
          },
        },
        rp.genericNegY,
      );
    }
    return React.createElement(
      "span",
      { className: "rule-image-val" },
      React.createElement("span", { className: "rule-sign" }, "-"),
      React.createElement(
        "span",
        {
          id: "rule-src-img-y-num",
          className: "rule-val rule-num",
          ref: (el) => {
            if (coordRefs) coordRefs.current.imgNegYNum = el;
          },
        },
        imgNegY.num,
      ),
    );
  };

  const renderImgX = () => {
    if (!imgX) {
      return React.createElement(
        "span",
        {
          id: "rule-ref-img-x",
          className: "rule-val rule-image-val",
          ref: (el) => {
            if (coordRefs) coordRefs.current.imgX = el;
          },
        },
        rp.genericImgX,
      );
    }
    return React.createElement(
      "span",
      {
        id: "rule-src-img-x-num",
        className: "rule-val rule-num rule-image-val",
        ref: (el) => {
          if (coordRefs) coordRefs.current.imgXNum = el;
        },
      },
      imgX,
    );
  };

  const renderObjX = () => {
    if (!objX) {
      return React.createElement(
        "span",
        {
          id: "rule-ref-obj-x",
          className: "rule-val rule-object-val",
          ref: (el) => {
            if (coordRefs) coordRefs.current.objX = el;
          },
        },
        rp.genericObjX,
      );
    }
    return React.createElement(
      "span",
      {
        id: "rule-ref-obj-x",
        className: "rule-val rule-num rule-object-val",
        ref: (el) => {
          if (coordRefs) coordRefs.current.objXNum = el;
        },
      },
      objX,
    );
  };

  const renderObjY = () => {
    if (!objY) {
      return React.createElement(
        "span",
        {
          id: "rule-ref-obj-y",
          className: "rule-val rule-object-val",
          ref: (el) => {
            if (coordRefs) coordRefs.current.objY = el;
          },
        },
        rp.genericObjY,
      );
    }
    return React.createElement(
      "span",
      {
        id: "rule-ref-obj-y",
        className: "rule-val rule-num rule-object-val",
        ref: (el) => {
          if (coordRefs) coordRefs.current.objYNum = el;
        },
      },
      objY,
    );
  };

  return React.createElement(
    "div",
    {
      className:
        "rule-result-box" + (visible ? " is-visible" : ""),
    },
    React.createElement(
      "span",
      { className: "rule-result-paren" },
      "( ",
    ),
    React.createElement(
      "span",
      { className: "rule-object-group" },
      renderObjX(),
      React.createElement("span", { className: "rule-comma" }, " , "),
      renderObjY(),
    ),
    React.createElement(
      "span",
      { className: "rule-result-paren" },
      " ) \u2192 ( ",
    ),
    React.createElement(
      "span",
      { className: "rule-image-group" },
      renderImgNegY(),
      React.createElement("span", { className: "rule-comma" }, " , "),
      renderImgX(),
    ),
    React.createElement(
      "span",
      { className: "rule-result-paren" },
      " )",
    ),
  );
};
