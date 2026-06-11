const SolutionOverlay = function (props) {
  var visible = props.visible;
  var solutionSteps = props.solutionSteps;
  var onClose = props.onClose;

  if (!visible) return null;

  function isEqualsContinuation(content) {
    return /^\s*=/.test(content);
  }

  function buildAlignLatex(steps) {
    var hasEqualsContinuations = steps.length > 1;
    var lines = steps.map(function (step, idx) {
      var content = step.content.trim();
      if (idx > 0 && isEqualsContinuation(content)) {
        return content.replace(/^\s*=\s*/, "&= ");
      }
      if (hasEqualsContinuations && idx === 0) {
        return "& " + content;
      }
      return content;
    });
    return "\\begin{align*} " + lines.join(" \\\\ ") + " \\end{align*}";
  }

  function renderMathBlock(steps, key) {
    var mathHtml = renderLatex(buildAlignLatex(steps), true);
    return React.createElement("div", {
      key: key,
      className: "solution-math-step",
      dangerouslySetInnerHTML: { __html: mathHtml },
    });
  }

  var stepsElements = [];
  var stepIdx = 0;
  while (stepIdx < solutionSteps.length) {
    var step = solutionSteps[stepIdx];
    if (step.type === "text") {
      stepsElements.push(
        React.createElement(
          "p",
          { key: stepIdx, className: "solution-text-step" },
          step.content,
        ),
      );
      stepIdx++;
      continue;
    }

    if (
      !isEqualsContinuation(step.content) &&
      stepIdx + 1 < solutionSteps.length &&
      solutionSteps[stepIdx + 1].type === "math" &&
      isEqualsContinuation(solutionSteps[stepIdx + 1].content)
    ) {
      var alignGroup = [step];
      var nextIdx = stepIdx + 1;
      while (
        nextIdx < solutionSteps.length &&
        solutionSteps[nextIdx].type === "math" &&
        isEqualsContinuation(solutionSteps[nextIdx].content)
      ) {
        alignGroup.push(solutionSteps[nextIdx]);
        nextIdx++;
      }
      stepsElements.push(renderMathBlock(alignGroup, stepIdx));
      stepIdx = nextIdx;
      continue;
    }

    stepsElements.push(renderMathBlock([step], stepIdx));
    stepIdx++;
  }

  return React.createElement(
    "div",
    { className: "solution-overlay" },
    React.createElement(
      "div",
      { className: "solution-overlay-content" },
      React.createElement(
        "div",
        { className: "solution-steps-container" },
        stepsElements,
      ),
      React.createElement(
        "div",
        { className: "solution-close-wrapper" },
        React.createElement(
          "button",
          { className: "solution-close-btn", onClick: onClose },
          "Close",
        ),
        React.createElement("img", {
          src: "assets/tapgrey.gif",
          className: "tap-nudge tap-nudge--solution",
          alt: "",
        }),
      ),
    ),
  );
};
