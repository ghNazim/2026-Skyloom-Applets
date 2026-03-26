function renderConditionIcon(state) {
  if (state === "correct")
    return React.createElement(
      "div",
      { className: "cond-icon-badge cond-icon-badge-correct" },
      React.createElement("span", null, "\u2714")
    );
  if (state === "incorrect")
    return React.createElement(
      "div",
      { className: "cond-icon-badge cond-icon-badge-incorrect" },
      React.createElement("span", null, "\u2718")
    );
  return null;
}

function renderConditionsStrip(conditionStates) {
  var calcData = APP_DATA.calculate;
  return React.createElement(
    "div",
    { className: "conditions-strip" },
    React.createElement("div", { className: "estimate-text" }, calcData.estimateText),

    React.createElement(
      "div",
      {
        className:
          "condition-box condition-box-" + conditionStates[0],
      },
      React.createElement("div", {
        className: "condition-box-content",
        dangerouslySetInnerHTML: { __html: calcData.conditionTotalText },
      }),
      renderConditionIcon(conditionStates[0])
    ),

    calcData.compareData.map(function (comp, i) {
      return React.createElement(
        "div",
        {
          key: i,
          className:
            "condition-box condition-box-" + conditionStates[i + 1],
        },
        React.createElement(
          "div",
          { className: "condition-box-content condition-compare-content" },
          React.createElement("img", {
            src: comp.img1,
            className: "condition-ball",
            draggable: false,
          }),
          React.createElement(
            "span",
            { className: "condition-operator" },
            comp.operator
          ),
          React.createElement("img", {
            src: comp.img2,
            className: "condition-ball",
            draggable: false,
          })
        ),
        renderConditionIcon(conditionStates[i + 1])
      );
    })
  );
}

const Calculate = ({ foundAnswers, onCorrect, onNavChange }) => {
  const { useState } = React;
  const data = APP_DATA.calculate;
  const totalTarget = data.totalTarget;

  const [counts, setCounts] = useState(
    data.ballImages.map(function () { return 0; })
  );
  const [checkResult, setCheckResult] = useState(null);

  var total = counts.reduce(function (sum, c) { return sum + c; }, 0);

  var cond1State =
    total > totalTarget ? "incorrect" : total === totalTarget ? "correct" : "default";

  var compResults = data.compareData.map(function (comp) {
    var i1 = data.ballImages.indexOf(comp.img1);
    var i2 = data.ballImages.indexOf(comp.img2);
    if(counts[i1] === 0 || counts[i2] === 0) return false;
    if (comp.operator === "<") return counts[i1] < counts[i2];
    if (comp.operator === ">") return counts[i1] > counts[i2];
    return counts[i1] === counts[i2];
  });

  var compStates = compResults.map(function (met) {
    return checkResult !== null ? (met ? "correct" : "incorrect") : "default";
  });

  var digitState = "default";
  if (checkResult === "correct" || checkResult === "duplicate")
    digitState = "correct";
  if (checkResult === "wrong") digitState = "incorrect";

  var isCheckEnabled = total === totalTarget && checkResult === null;

  var handleStep = function (idx, delta) {
    var newVal = counts[idx] + delta;
    if (newVal < 0 || newVal > totalTarget - 1) return;
    var newCounts = counts.slice();
    newCounts[idx] = newVal;
    setCounts(newCounts);
    if (checkResult !== null) setCheckResult(null);
    playSound("click");

    var newTotal = newCounts.reduce(function (s, c) { return s + c; }, 0);
    if (onNavChange) {
      if (newTotal === totalTarget) {
        onNavChange(data.navOnCheckActive);
      } else {
        onNavChange(data.navActive);
      }
    }
  };

  var handleCheck = function () {
    if (total !== totalTarget) return;

    var allMet = compResults.every(function (r) { return r; });

    if (!allMet) {
      setCheckResult("wrong");
      playSound("wrong");
      if (onNavChange) onNavChange(data.navWrong);
      return;
    }

    var isDuplicate = foundAnswers.some(function (a) {
      return a.every(function (v, i) { return v === counts[i]; });
    });

    if (isDuplicate) {
      setCheckResult("duplicate");
      playSound("wrong");
      return;
    }

    setCheckResult("correct");
    playSound("correct");
    onCorrect(counts.slice());
  };

  var conditionStates = [cond1State].concat(compStates);

  var calcRow = React.createElement(
    "div",
    { className: "calc-row" },

    counts.map(function (count, i) {
      return React.createElement(
        "div",
        { key: i, className: "digit-box-wrapper" },
        React.createElement("img", {
          src: data.ballImages[i],
          className: "digit-box-ball",
          draggable: false,
        }),
        React.createElement(
          "div",
          {
            className:
              "digit-box digit-box-" +
              (checkResult !== null ? digitState : "default"),
          },
          count
        ),
        React.createElement(
          "div",
          { className: "stepper-buttons" },
          React.createElement(
            "button",
            {
              className: "stepper-btn",
              onClick: function () {
                handleStep(i, -1);
              },
              disabled: checkResult === "correct",
            },
            "\u25C0"
          ),
          React.createElement(
            "button",
            {
              className: "stepper-btn",
              onClick: function () {
                handleStep(i, 1);
              },
              disabled: checkResult === "correct",
            },
            "\u25B6"
          )
        )
      );
    }),

    React.createElement(
      "div",
      { className: "digit-box-wrapper" },
      React.createElement(
        "span",
        { className: "total-label" },
        data.totalLabel
      ),
      React.createElement(
        "div",
        {
          className:
            "digit-box total-digit-box digit-box-" + cond1State,
        },
        total
      )
    )
  );

  var bottomElement;
  if (checkResult === null) {
    bottomElement = React.createElement(
      "button",
      {
        className: "check-btn" + (isCheckEnabled ? " check-btn-active" : ""),
        onClick: handleCheck,
        disabled: !isCheckEnabled,
      },
      data.checkText
    );
  } else {
    var feedbackText = "";
    var feedbackClass = "";
    if (checkResult === "correct") {
      feedbackText = data.correctFeedback;
      feedbackClass = "calc-feedback-correct";
    } else if (checkResult === "wrong") {
      feedbackText = data.wrongFeedback;
      feedbackClass = "calc-feedback-wrong";
    } else if (checkResult === "duplicate") {
      feedbackText = data.duplicateFeedback;
      feedbackClass = "calc-feedback-duplicate";
    }
    bottomElement = React.createElement(
      "div",
      { className: "calc-feedback " + feedbackClass },
      feedbackText
    );
  }

  return React.createElement(
    "div",
    { className: "calculate-container" },
    renderConditionsStrip(conditionStates),
    calcRow,
    bottomElement
  );
};
