const Summary = function (props) {
  var onStartOver = props.onStartOver;
  var useRef = React.useRef;
  var e = React.createElement;
  var F = APP_DATA.final;
  var ellipsis = F.ellipsis || "\u2026";
  var startOverRef = useRef(null);

  var badgeLabels = ["1", "2", ellipsis, "frac", ellipsis, ellipsis, "n"];
  var midIdx = 3;

  function renderBadgeFracSmall() {
    return e("div", { className: "summary-badge-frac" },
      e("div", { className: "sbf-num" },
        e("span", { className: "sbf-n" }, "n"),
        e("span", { className: "sbf-plus" }, "+1")
      ),
      e("div", { className: "sbf-line" }),
      e("div", { className: "sbf-den" }, "2")
    );
  }

  function renderSummaryRow() {
    var items = badgeLabels.map(function (label, i) {
      var isMid = i === midIdx;
      var isLast = i === 6;
      var circleCls = "summary-circle" + (isMid ? " summary-circle-mid" : "");
      var badgeCls = "summary-badge bg-tan";
      if (isMid) badgeCls = "summary-badge bg-pink summary-badge-frac-host";
      else if (isLast) badgeCls = "summary-badge bg-blue";

      var badgeContent = label === "frac" ? renderBadgeFracSmall() : label;

      return e("div", { className: "summary-num-wrap", key: "s-" + i },
        e("div", { className: "summary-circle-slot" },
          e("div", { className: badgeCls }, badgeContent),
          e("div", { className: circleCls })
        )
      );
    });

    return e("div", { className: "summary-dr-container" },
      e("div", { className: "summary-dr-row" }, items)
    );
  }

  function renderFormulaBlock() {
    return e("div", { className: "summary-formula-block" },
      e("p", { className: "summary-formula-intro" }, F.summaryIntro),
      e("div", { className: "summary-formula-row" },
        e("div", { className: "summary-formula-box" },
          e("div", { className: "summary-frac" },
            e("div", { className: "summary-frac-num" },
              e("span", { className: "summary-n-box" }, "n"),
              e("span", { className: "summary-frac-op" }, " + 1")
            ),
            e("div", { className: "summary-frac-line" }),
            e("div", { className: "summary-frac-den" }, "2")
          )
        ),
        e("span", { className: "summary-th" }, "th")
      ),
      e("p", { className: "summary-formula-outro" }, F.summaryOutro)
    );
  }

  return e("div", { className: "summary-panel" },
    e("p", { className: "summary-heading" }, F.heading),
    renderSummaryRow(),
    renderFormulaBlock(),
    e("p", { className: "summary-footer-text" }, F.footerText),
    e("button", {
      ref: startOverRef,
      type: "button",
      className: "btn summary-start-over-btn",
      onClick: onStartOver,
    }, F.buttonText),
    e(Nudge, { targetRef: startOverRef, show: true })
  );
};
