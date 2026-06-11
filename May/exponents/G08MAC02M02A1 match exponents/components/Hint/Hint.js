const HintP2MarkerDefs = () => {
  return React.createElement(
    "defs",
    null,
    React.createElement(
      "marker",
      {
        id: "hint-p2-marker-exp",
        viewBox: "0 0 10 10",
        refX: "9",
        refY: "5",
        markerWidth: "8",
        markerHeight: "8",
        orient: "auto",
        markerUnits: "userSpaceOnUse",
      },
      React.createElement("path", {
        d: "M 0 0 L 10 5 L 0 10 Z",
        fill: "#4ade80",
      })
    ),
    React.createElement(
      "marker",
      {
        id: "hint-p2-marker-base",
        viewBox: "0 0 10 10",
        refX: "9",
        refY: "5",
        markerWidth: "8",
        markerHeight: "8",
        orient: "auto",
        markerUnits: "userSpaceOnUse",
      },
      React.createElement("path", {
        d: "M 0 0 L 10 5 L 0 10 Z",
        fill: "#ff6b9d",
      })
    )
  );
};

const HintPage2Diagram = ({ base, exponent, baseLabel, exponentLabel }) => {
  const { useState, useEffect, useRef, useCallback } = React;

  const diagramRef = useRef(null);
  const expLabelRef = useRef(null);
  const expSupRef = useRef(null);
  const baseLabelRef = useRef(null);
  const expBaseRef = useRef(null);
  const [arrows, setArrows] = useState(null);

  const getAnchorPoint = function (el, anchor, containerRect) {
    var rect = el.getBoundingClientRect();
    var x = rect.left - containerRect.left;
    var y = rect.top - containerRect.top;
    var midX = x + rect.width / 2;
    var midY = y + rect.height / 2;

    if (anchor === "bottom-center") {
      return { x: midX, y: y + rect.height };
    }
    if (anchor === "top-center") {
      return { x: midX, y: y };
    }
    return { x: midX, y: midY };
  };

  const updateArrows = useCallback(function () {
    var container = diagramRef.current;
    if (
      !container ||
      !expLabelRef.current ||
      !expSupRef.current ||
      !baseLabelRef.current ||
      !expBaseRef.current
    ) {
      return;
    }

    var cRect = container.getBoundingClientRect();
    if (cRect.width === 0 || cRect.height === 0) {
      return;
    }

    var expStart = getAnchorPoint(expLabelRef.current, "bottom-center", cRect);
    var expEnd = getAnchorPoint(expSupRef.current, "top-center", cRect);
    var baseStart = getAnchorPoint(baseLabelRef.current, "top-center", cRect);
    var baseEnd = getAnchorPoint(expBaseRef.current, "bottom-center", cRect);

    setArrows({
      width: cRect.width,
      height: cRect.height,
      exp: {
        x1: expStart.x,
        y1: expStart.y,
        x2: expEnd.x,
        y2: expEnd.y,
      },
      base: {
        x1: baseStart.x,
        y1: baseStart.y,
        x2: baseEnd.x,
        y2: baseEnd.y,
      },
    });
  }, []);

  useEffect(function () {
    updateArrows();

    var raf1 = requestAnimationFrame(function () {
      requestAnimationFrame(updateArrows);
    });

    var resizeObserver = null;
    if (typeof ResizeObserver !== "undefined" && diagramRef.current) {
      resizeObserver = new ResizeObserver(updateArrows);
      resizeObserver.observe(diagramRef.current);
    }

    window.addEventListener("resize", updateArrows);

    return function () {
      cancelAnimationFrame(raf1);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows, baseLabel, exponentLabel, base, exponent]);

  const renderConnectors = function () {
    if (!arrows) {
      return null;
    }

    var w = arrows.width;
    var h = arrows.height;

    return React.createElement(
      "svg",
      {
        className: "hint-p2-connectors",
        width: w,
        height: h,
        viewBox: "0 0 " + w + " " + h,
        "aria-hidden": "true",
      },
      React.createElement(HintP2MarkerDefs),
      React.createElement("line", {
        x1: arrows.exp.x1,
        y1: arrows.exp.y1,
        x2: arrows.exp.x2,
        y2: arrows.exp.y2,
        stroke: "#4ade80",
        strokeWidth: 2,
        strokeLinecap: "round",
        markerEnd: "url(#hint-p2-marker-exp)",
      }),
      React.createElement("line", {
        x1: arrows.base.x1,
        y1: arrows.base.y1,
        x2: arrows.base.x2,
        y2: arrows.base.y2,
        stroke: "#ff6b9d",
        strokeWidth: 2,
        strokeLinecap: "round",
        markerEnd: "url(#hint-p2-marker-base)",
      })
    );
  };

  return React.createElement(
    "div",
    { className: "hint-p2-diagram", ref: diagramRef },
    renderConnectors(),
    React.createElement(
      "div",
      { className: "hint-p2-stack" },
      React.createElement(
        "span",
        {
          ref: expLabelRef,
          className: "hint-p2-label hint-p2-label-exp",
        },
        exponentLabel
      ),
      React.createElement(
        "div",
        { className: "exp-notation hint-p2-notation" },
        React.createElement(
          "span",
          { ref: expBaseRef, className: "exp-base hint-p2-base" },
          base
        ),
        React.createElement(
          "span",
          { ref: expSupRef, className: "exp-sup hint-p2-sup" },
          exponent
        )
      ),
      React.createElement(
        "span",
        {
          ref: baseLabelRef,
          className: "hint-p2-label hint-p2-label-base",
        },
        baseLabel
      )
    )
  );
};

const Hint = ({
  base,
  exponent,
  baseLabel,
  exponentLabel,
  closeText,
  onClose,
  showForwardNudge,
  onDismissForwardNudge,
}) => {
  const { useState } = React;
  const [page, setPage] = useState(0);
  const [showCloseNudge, setShowCloseNudge] = useState(false);

  const handleClose = function () {
    setShowCloseNudge(false);
    if (onDismissForwardNudge) onDismissForwardNudge();
    onClose();
  };

  const handleForward = function () {
    if (typeof playSound === "function") playSound("click");
    if (onDismissForwardNudge) onDismissForwardNudge();
    setPage(1);
    setShowCloseNudge(true);
  };

  const handleBackward = function () {
    if (typeof playSound === "function") playSound("click");
    setPage(0);
  };

  const renderPage1 = () => {
    return React.createElement(
      "div",
      { className: "hint-page hint-page-1" },
      React.createElement(
        "div",
        { className: "hint-expression" },
        React.createElement(
          "div",
          { className: "hint-exp-section" },
          React.createElement(
            "span",
            { className: "hint-label hint-label-exp" },
            exponentLabel + " \u2192"
          ),
          React.createElement(
            "span",
            { className: "hint-exp-number" },
            exponent
          )
        ),
        React.createElement(
          "div",
          { className: "hint-base-section" },
          React.createElement(
            "span",
            { className: "hint-label hint-label-base" },
            baseLabel + " \u2192"
          ),
          React.createElement(
            "span",
            { className: "hint-base-number" },
            base
          )
        )
      )
    );
  };

  const renderPage2 = () => {
    var factors = [];
    for (var i = 0; i < exponent; i++) {
      factors.push(i);
    }

    return React.createElement(
      "div",
      { className: "hint-page hint-page-2" },
      React.createElement(
        "div",
        { className: "hint-page2-content" },
        React.createElement(
          "div",
          { className: "hint-mult-block" },
          factors.map(function (idx) {
            return React.createElement(
              React.Fragment,
              { key: "factor-" + idx },
              idx > 0 &&
                React.createElement(
                  "span",
                  { className: "hint-mult-sign" },
                  "\u00D7"
                ),
              React.createElement(
                "div",
                { className: "hint-factor-unit" },
                React.createElement(
                  "span",
                  { className: "hint-count-badge" },
                  idx + 1
                ),
                React.createElement(
                  "span",
                  { className: "hint-factor-num" },
                  base
                )
              )
            );
          })
        ),
        React.createElement(
          "div",
          { className: "hint-exp-block" },
          React.createElement(HintPage2Diagram, {
            base: base,
            exponent: exponent,
            baseLabel: baseLabel,
            exponentLabel: exponentLabel,
          })
        )
      )
    );
  };

  const renderHintNav = () => {
    return React.createElement(
      "div",
      { className: "hint-nav-row" },
      React.createElement(
        "button",
        {
          type: "button",
          className: "hint-nav-btn hint-nav-back",
          disabled: page === 0,
          onClick: handleBackward,
        },
        "\u00AB"
      ),
      React.createElement(
        "div",
        { className: "nudge-wrapper hint-nav-forward-wrap" },
        React.createElement(
          "button",
          {
            type: "button",
            className: "hint-nav-btn hint-nav-forward",
            disabled: page === 1,
            onClick: handleForward,
          },
          "\u00BB"
        ),
        page === 0 && showForwardNudge && React.createElement(Nudge)
      )
    );
  };

  return React.createElement(
    "div",
    { className: "hint-overlay", onClick: handleClose },
    React.createElement(
      "div",
      {
        className: "hint-card-wrapper",
        onClick: function (e) {
          e.stopPropagation();
        },
      },
      React.createElement(
        "div",
        { className: "hint-card" },
        page === 0 ? renderPage1() : renderPage2(),
        renderHintNav()
      ),
      React.createElement(
        "div",
        { className: "nudge-wrapper" },
        React.createElement(
          "button",
          { className: "hint-close-button", onClick: handleClose },
          closeText
        ),
        page === 1 && showCloseNudge && React.createElement(Nudge)
      )
    )
  );
};
