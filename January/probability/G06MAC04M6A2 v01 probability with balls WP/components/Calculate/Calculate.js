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

const Calculate = ({ step, foundAnswers, onCorrect }) => {
  const { useState } = React;
  const data = APP_DATA.calculate;

  const [counts, setCounts] = useState([0, 0, 0]);
  const [checkResult, setCheckResult] = useState(null);

  var total = counts[0] + counts[1] + counts[2];

  var cond1State =
    total > 10 ? "incorrect" : total === 10 ? "correct" : "default";
  var cond2Met = counts[0] < counts[1];
  var cond3Met = counts[1] < counts[2];
  var cond2State =
    checkResult !== null ? (cond2Met ? "correct" : "incorrect") : "default";
  var cond3State =
    checkResult !== null ? (cond3Met ? "correct" : "incorrect") : "default";

  var digitState = "default";
  if (checkResult === "correct" || checkResult === "duplicate")
    digitState = "correct";
  if (checkResult === "wrong") digitState = "incorrect";

  var isCheckEnabled = total === 10 && checkResult === null;

  var handleStep = function (idx, delta) {
    var newVal = counts[idx] + delta;
    if (newVal < 0 || newVal > 9) return;
    var newCounts = [counts[0], counts[1], counts[2]];
    newCounts[idx] = newVal;
    setCounts(newCounts);
    if (checkResult !== null) setCheckResult(null);
    playSound("click");
  };

  var handleCheck = function () {
    if (total !== 10) return;

    var allMet = cond2Met && cond3Met;

    if (!allMet) {
      setCheckResult("wrong");
      playSound("wrong");
      return;
    }

    var isDuplicate = foundAnswers.some(function (a) {
      return a[0] === counts[0] && a[1] === counts[1] && a[2] === counts[2];
    });

    if (isDuplicate) {
      setCheckResult("duplicate");
      playSound("wrong");
      return;
    }

    setCheckResult("correct");
    playSound("correct");
    onCorrect([counts[0], counts[1], counts[2]]);
  };

  // Step 6: Table of all estimates
  if (step === 6) {
    var validAnswers = data.validAnswers;
    return React.createElement(
      "div",
      { className: "calculate-container" },

      renderConditionsStrip(["correct", "correct", "correct"]),

      React.createElement(
        "div",
        { className: "estimates-table" },

        React.createElement(
          "div",
          { className: "estimates-table-header" },
          data.ballImages.map(function (img, i) {
            return React.createElement(
              "div",
              { key: i, className: "estimates-table-cell estimates-header-cell" },
              React.createElement("img", {
                src: img,
                className: "estimates-header-ball",
                draggable: false,
              })
            );
          }),
          React.createElement(
            "div",
            { className: "estimates-table-cell estimates-header-cell" },
            React.createElement(
              "span",
              { className: "estimates-total-label" },
              data.totalLabel
            )
          )
        ),

        validAnswers.map(function (answer, rowIdx) {
          return React.createElement(
            "div",
            { key: rowIdx, className: "estimates-table-row" },
            answer.map(function (val, colIdx) {
              return React.createElement(
                "div",
                { key: colIdx, className: "estimates-table-cell" },
                val
              );
            }),
            React.createElement(
              "div",
              { className: "estimates-table-cell estimates-total-cell" },
              10
            )
          );
        })
      )
    );
  }

  // Step 5: Interactive calculation
  var conditionStates = [cond1State, cond2State, cond3State];

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
