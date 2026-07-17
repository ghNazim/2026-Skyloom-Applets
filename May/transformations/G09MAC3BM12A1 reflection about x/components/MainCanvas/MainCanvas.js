const MainCanvas = (props) => {
  const { useEffect, useRef, useState } = React;
  const {
    step,
    step2Phase,
    step2Feedback,
    plottedPoint,
    lineAnimPhase,
    xAxisHighlighted,
    showReflectionLabel,
    step4Phase,
    showUnitLine,
    unitLineY1,
    unitLineY2,
    unitLabelText,
    unitLabelFinal,
    highlightFour,
    showQ1FourUnitsLabel,
    unitLineRotating,
    showDashedDistance,
    onGridClick,
    onXAxisClick,
    onRevealClick,
    onPropertiesClick,
    onProperty1Click,
    onProperty2Click,
    step5Phase,
    prop1Done,
    prop2Done,
    p1LineVisible,
    p1LineFadeReady,
    p1RightAngleVisible,
    p1RightAngleFadeReady,
    cloneVisible,
    cloneY,
    cloneOpacity,
    calloutVisible,
    calloutFadeReady,
    calloutPos,
    calloutMode,
    calloutPrevMode,
    calloutTextNextReady,
    calloutLoading,
    showMeasureLine,
    measureLineUnits,
    measureLineGrowing,
    unitLabelOverride,
    showApost,
    apostFadeReady,
    step5DoneTextVisible,
    step6Phase,
    step6ShowVerticalLine,
    step6VerticalLineGrowing,
    step6HighlightX2,
    step6ShowCoordLabel,
    step6ShowCoordX,
    step6XCloneVisible,
    step6XCloneFlying,
    step6ShowHorizontalLine,
    step6HorizontalLineGrowing,
    step6HighlightYNeg4,
    step6ShowCoordY,
    step6YCloneVisible,
    step6YCloneFlying,
    step7Answer,
    step7WrongCloneVisible,
    step7WrongCloneFlying,
    onStep7Option,
    step8Phase,
    step8ShowFormula,
    step8XActive,
    step8XBlink,
    step8YActive,
    step8YBlink,
    onStep8Reveal,
    step9Part,
    step9QuestionIndex,
    step9XAnswer,
    step9XStatus,
    step9XFeedback,
    step9YAnswer,
    step9YStatus,
    step9YFeedback,
    onStep9Option,
  } = props;

  const formulaSvgRef = useRef(null);
  const formulaTokenRefs = useRef({});
  const hintTextRef = useRef(null);
  const [step9HintGeometry, setStep9HintGeometry] = useState(null);
  const step9Question =
    APP_DATA.steps[9].questions[step9QuestionIndex] ||
    APP_DATA.steps[9].questions[0];

  const topText = (() => {
    if (step === 7) return handleComma(APP_DATA.steps[7].topText);
    if (step === 8) {
      return handleComma(
        step8ShowFormula
          ? APP_DATA.steps[8].topTextRule
          : APP_DATA.steps[8].topTextInitial,
      );
    }
    if (step === 9) return handleComma(step9Question.topText);
    return step >= 1 ? handleComma(APP_DATA.steps[1].topText) : "";
  })();

  const step9IsXPart = step9Part === "x";
  const step9CurrentStatus = step9IsXPart ? step9XStatus : step9YStatus;
  const step9CurrentHint =
    step === 9 && step9CurrentStatus === "wrong"
      ? step9IsXPart
        ? APP_DATA.steps[9].hintX
        : APP_DATA.steps[9].hintY
      : "";

  useEffect(() => {
    if (!step9CurrentHint) {
      setStep9HintGeometry(null);
      return;
    }

    const measureHint = () => {
      const refs = formulaTokenRefs.current;
      const leftToken = step9IsXPart ? refs.leftX : refs.leftY;
      const rightToken = step9IsXPart ? refs.rightX : refs.rightY;
      const hintText = hintTextRef.current;

      if (!leftToken || !rightToken || !hintText) return;

      const leftBox = leftToken.getBBox();
      const rightBox = rightToken.getBBox();
      const hintBox = hintText.getBBox();
      const hintY = hintBox.y + hintBox.height * 0.52;

      setStep9HintGeometry({
        leftStartX: leftBox.x + leftBox.width / 2,
        leftStartY: leftBox.y + leftBox.height + 5,
        rightStartX: rightBox.x + rightBox.width / 2,
        rightStartY: rightBox.y + rightBox.height + 5,
        leftEndX: hintBox.x,
        rightEndX: hintBox.x + hintBox.width,
        hintY: hintY,
      });
    };

    const id = requestAnimationFrame(measureHint);
    window.addEventListener("resize", measureHint);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", measureHint);
    };
  }, [step9CurrentHint, step9IsXPart, step9XAnswer, step9YAnswer]);

  const renderStep9Visual = () => {
    const s9 = APP_DATA.steps[9];
    const question = step9Question;
    const isXPart = step9IsXPart;
    const currentAnswer = isXPart ? step9XAnswer : step9YAnswer;
    const currentStatus = step9CurrentStatus;
    const currentHint = step9CurrentHint;
    const formulaAccent = currentStatus === "wrong" ? "#ffcc1a" : "#ffffff";

    return React.createElement(
      "div",
      { className: "step9-visual" },
      React.createElement(
        "div",
        { className: "step9-formula-row" },
        React.createElement(
          "svg",
          {
            ref: formulaSvgRef,
            className: "step9-formula-svg",
            viewBox: "0 0 920 200",
            preserveAspectRatio: "xMidYMid meet",
          },
          React.createElement(
            "text",
            {
              x: 205,
              y: 74,
              className: "step9-formula-svg-text",
              textAnchor: "middle",
            },
            React.createElement("tspan", { fill: "#ffffff" }, "A("),
            React.createElement(
              "tspan",
              {
                ref: (el) => {
                  formulaTokenRefs.current.leftX = el;
                },
                fontFamily: '"Times New Roman", Times, serif',
                fontStyle: "italic",
                fill: isXPart && currentStatus === "wrong" ? formulaAccent : "#ffffff",
              },
              "x",
            ),
            React.createElement("tspan", { fill: "#ffffff" }, ", "),
            React.createElement(
              "tspan",
              {
                ref: (el) => {
                  formulaTokenRefs.current.leftY = el;
                },
                fontFamily: '"Times New Roman", Times, serif',
                fontStyle: "italic",
                fill: !isXPart && currentStatus === "wrong" ? formulaAccent : "#ffffff",
              },
              "y",
            ),
            React.createElement("tspan", { fill: "#ffffff" }, ")"),
          ),
          React.createElement(
            "text",
            {
              x: 460,
              y: 74,
              className: "step9-formula-svg-text",
              textAnchor: "middle",
            },
            "\u2192",
          ),
          React.createElement(
            "text",
            {
              x: 677,
              y: 74,
              className: "step9-formula-svg-text",
              textAnchor: "middle",
            },
            React.createElement("tspan", { fill: "#ffffff" }, "A\u2032("),
            React.createElement(
              "tspan",
              {
                ref: (el) => {
                  formulaTokenRefs.current.rightX = el;
                },
                fontFamily: '"Times New Roman", Times, serif',
                fontStyle: "italic",
                fill: isXPart && currentStatus === "wrong" ? formulaAccent : "#ffffff",
              },
              "x",
            ),
            React.createElement("tspan", { fill: "#ffffff" }, ", "),
            React.createElement(
              "tspan",
              {
                ref: (el) => {
                  formulaTokenRefs.current.rightY = el;
                },
                fontFamily: '"Times New Roman", Times, serif',
                fontStyle: "italic",
                fill: !isXPart && currentStatus === "wrong" ? formulaAccent : "#ffffff",
              },
              "-y",
            ),
            React.createElement("tspan", { fill: "#ffffff" }, ")"),
          ),
          currentHint
            ? React.createElement(
                React.Fragment,
                null,
                step9HintGeometry
                  ? React.createElement("path", {
                      d:
                        "M " +
                        step9HintGeometry.leftStartX +
                        " " +
                        step9HintGeometry.leftStartY +
                        " Q " +
                        step9HintGeometry.leftStartX +
                        " " +
                        step9HintGeometry.hintY +
                        " " +
                        (step9HintGeometry.leftStartX + 16) +
                        " " +
                        step9HintGeometry.hintY +
                        " L " +
                        step9HintGeometry.leftEndX +
                        " " +
                        step9HintGeometry.hintY,
                      className: "step9-hint-path",
                    })
                  : null,
                step9HintGeometry
                  ? React.createElement("path", {
                      d:
                        "M " +
                        step9HintGeometry.rightStartX +
                        " " +
                        step9HintGeometry.rightStartY +
                        " Q " +
                        step9HintGeometry.rightStartX +
                        " " +
                        step9HintGeometry.hintY +
                        " " +
                        (step9HintGeometry.rightStartX - 16) +
                        " " +
                        step9HintGeometry.hintY +
                        " L " +
                        step9HintGeometry.rightEndX +
                        " " +
                        step9HintGeometry.hintY,
                      className: "step9-hint-path",
                    })
                  : null,
                React.createElement(
                  "text",
                  {
                    x: 460,
                    y: 146,
                    ref: hintTextRef,
                    className: "step9-hint-svg-text",
                    textAnchor: "middle",
                  },
                  currentHint,
                ),
              )
            : null,
        ),
      ),
      React.createElement(
        "div",
        { className: "step9-number-row" },
        React.createElement(
          "div",
          { className: "step9-object-wrap" },
          React.createElement(
            "div",
            { className: "step9-box step9-object-box" },
            React.createElement(
              "span",
              { className: "step9-object-coordinate" },
              question.point + "(",
            ),
            React.createElement(
              "span",
              {
                className:
                  "step9-object-coordinate" +
                  (step9XStatus === "wrong" && isXPart ? " is-highlight-x" : ""),
              },
              question.x,
            ),
            React.createElement("span", { className: "step9-object-coordinate" }, ", "),
            React.createElement(
              "span",
              {
                className:
                  "step9-object-coordinate" +
                  (step9YStatus === "wrong" && !isXPart ? " is-highlight-y" : ""),
              },
              question.y,
            ),
            React.createElement("span", { className: "step9-object-coordinate" }, ")"),
          ),
          React.createElement(
            "div",
            { className: "step9-box-label" },
            s9.pointLabel,
          ),
        ),
        React.createElement(
          "div",
          { className: "step9-mid-arrow" },
          "\u2192",
        ),
        React.createElement(
          "div",
          { className: "step9-image-wrap" },
          React.createElement(
            "div",
            { className: "step9-box step9-image-box" },
            React.createElement(
              "span",
              { className: "step9-image-prefix" },
              question.point + "\u2032(",
            ),
            React.createElement(
              "span",
              {
                className:
                  "step9-answer-box" +
                  (isXPart ? " is-active" : "") +
                  (step9XStatus ? " is-" + step9XStatus : "") +
                  (step9XStatus === "wrong" ? " is-highlight-x" : ""),
              },
              step9XAnswer || "",
            ),
            React.createElement("span", { className: "step9-image-prefix" }, ", "),
            React.createElement(
              "span",
              {
                className:
                  "step9-answer-box" +
                  (!isXPart ? " is-active" : "") +
                  (step9YStatus ? " is-" + step9YStatus : "") +
                  (step9YStatus === "wrong" ? " is-highlight-y" : ""),
              },
              step9YAnswer || "",
            ),
            React.createElement("span", { className: "step9-image-prefix" }, ")"),
          ),
          React.createElement(
            "div",
            { className: "step9-box-label" },
            s9.imageLabel,
          ),
        ),
      ),
    );
  };

  const renderRightPanel = () => {
    if (step === 2) {
      const s2 = APP_DATA.steps[2];
      return React.createElement(
        "div",
        { className: "right-panel-content" },
        React.createElement("div", {
          className: "right-panel-text",
          dangerouslySetInnerHTML: { __html: handleComma(s2.rightText) },
        }),
        step2Feedback
          ? React.createElement("div", {
              className:
                "feedback-box" +
                (step2Feedback === "correct" ? " is-correct" : " is-wrong"),
              dangerouslySetInnerHTML: {
                __html: handleComma(
                  step2Feedback === "correct"
                    ? s2.feedbackCorrect
                    : s2.feedbackWrong,
                ),
              },
            })
          : null,
      );
    }

    if (step === 3) {
      return React.createElement(
        "div",
        { className: "right-panel-content" },
        React.createElement("div", {
          className: "right-panel-text",
          dangerouslySetInnerHTML: {
            __html: handleComma(APP_DATA.steps[3].rightText),
          },
        }),
      );
    }

    if (step === 4) {
      const s4 = APP_DATA.steps[4];
      const showDoneText =
        step4Phase === "done" || step4Phase === "properties-ready";
      return React.createElement(
        "div",
        { className: "right-panel-content" },
        React.createElement("div", {
          className: "right-panel-text",
          dangerouslySetInnerHTML: {
            __html: handleComma(
              showDoneText ? s4.rightTextDone : s4.rightTextInitial,
            ),
          },
        }),
        step4Phase === "initial" || step4Phase === "revealing"
          ? React.createElement(
              "button",
              {
                className: "btn action-btn reveal-btn",
                id: "reveal-button",
                onClick: onRevealClick,
                disabled: step4Phase === "revealing",
              },
              s4.revealBtn,
            )
          : null,
        step4Phase === "done" || step4Phase === "properties-ready"
          ? React.createElement(
              "button",
              {
                className: "btn action-btn properties-btn",
                id: "properties-button",
                onClick: onPropertiesClick,
              },
              s4.propertiesBtn,
            )
          : null,
      );
    }

    if (step === 5) {
      const s5 = APP_DATA.steps[5];
      const prop2Enabled = step5Phase === "prop2-ready" || step5Phase === "prop2-running" || prop2Done;
      const prop1Dimmed =
        (step5Phase === "prop2-ready" || step5Phase === "prop2-running") && !prop2Done;
      return React.createElement(
        "div",
        { className: "right-panel-content property-cards" },
        React.createElement(
          "div",
          { className: "property-card" },
          React.createElement(
            "div",
            { className: "property-card-title-row" },
            React.createElement(
              "p",
              { className: "property-card-title" },
              s5.property1Title,
            ),
            prop1Done
              ? React.createElement("img", {
                  src: "assets/tick.svg",
                  alt: "",
                  className: "property-tick is-visible",
                })
              : React.createElement("img", {
                  src: "assets/tick.svg",
                  alt: "",
                  className: "property-tick",
                }),
          ),
          React.createElement(
            "button",
            {
              className:
                "property-card-box" +
                (prop1Done ? " is-complete" : "") +
                (prop1Dimmed ? " is-dimmed" : ""),
              id: "property-1-button",
              onClick: onProperty1Click,
              disabled: prop1Done || step5Phase === "prop1-running",
            },
            React.createElement("div", {
              dangerouslySetInnerHTML: {
                __html: handleComma(s5.property1Text),
              },
            }),
          ),
        ),
        React.createElement(
          "div",
          { className: "property-card" },
          React.createElement(
            "div",
            { className: "property-card-title-row" },
            React.createElement(
              "p",
              { className: "property-card-title" },
              s5.property2Title,
            ),
            prop2Done
              ? React.createElement("img", {
                  src: "assets/tick.svg",
                  alt: "",
                  className: "property-tick is-visible",
                })
              : React.createElement("img", {
                  src: "assets/tick.svg",
                  alt: "",
                  className: "property-tick",
                }),
          ),
          React.createElement(
            "button",
            {
              className:
                "property-card-box" +
                (prop1Done ? "" : " is-dimmed") +
                (prop2Done ? " is-complete" : ""),
              id: "property-2-button",
              onClick: onProperty2Click,
              disabled: !prop2Enabled || prop2Done,
            },
            React.createElement("div", {
              dangerouslySetInnerHTML: {
                __html: handleComma(s5.property2Text),
              },
            }),
          ),
        ),
        prop2Done && step5DoneTextVisible
          ? React.createElement(
              "div",
              { className: "step5-done-text is-visible" },
              s5.doneText,
            )
          : React.createElement("div", { className: "step5-done-text" }, ""),
      );
    }

    if (step === 6) {
      return step6Phase === "done"
        ? React.createElement(
            "div",
            { className: "right-panel-content" },
            React.createElement("div", {
              className: "right-panel-text step6-done-text",
              dangerouslySetInnerHTML: {
                __html: handleComma(APP_DATA.steps[6].rightTextDone),
              },
            }),
          )
        : null;
    }

    if (step === 7) {
      const s7 = APP_DATA.steps[7];
      return React.createElement(
        "div",
        { className: "right-panel-content step7-panel" },
        React.createElement(
          "h2",
          { className: "step7-title" },
          s7.title,
        ),
        React.createElement(
          "div",
          { className: "step7-options" },
          React.createElement(
            "button",
            {
              className:
                "step7-option" +
                (step7Answer === "wrong" ? " is-wrong" : ""),
              id: "step7-option-x",
              onClick: () => onStep7Option("x"),
              disabled: step7Answer === "correct",
            },
            s7.optionX,
          ),
          React.createElement(
            "button",
            {
              className:
                "step7-option" +
                (step7Answer === "correct" ? " is-correct" : ""),
              id: "step7-option-y",
              onClick: () => onStep7Option("y"),
              disabled: step7Answer === "correct",
            },
            s7.optionY,
          ),
        ),
        step7Answer
          ? React.createElement("div", {
              className:
                "feedback-box step7-feedback" +
                (step7Answer === "correct" ? " is-correct" : " is-wrong"),
              dangerouslySetInnerHTML: {
                __html: handleComma(
                  step7Answer === "correct"
                    ? s7.feedbackCorrect
                    : s7.feedbackWrong,
                ),
              },
            })
          : null,
      );
    }

    if (step === 8) {
      const s8 = APP_DATA.steps[8];
      return React.createElement(
        "div",
        { className: "right-panel-content step8-panel" },
        React.createElement(
          "div",
          { className: "step8-observation-card" },
          React.createElement(
            "div",
            { className: "step8-observation-title" },
            s8.observationTitle,
          ),
          React.createElement(
            "div",
            {
              className:
                "step8-observation-row" +
                (step8XActive ? " is-active-x" : "") +
                (step8XBlink ? " is-blinking" : ""),
            },
            React.createElement(
              "span",
              { className: "step8-observation-label" },
              s8.observationX,
            ),
            React.createElement(
              "span",
              { className: "step8-observation-value" },
              s8.observationXValue,
            ),
          ),
          React.createElement(
            "div",
            {
              className:
                "step8-observation-row" +
                (step8YActive ? " is-active-y" : "") +
                (step8YBlink ? " is-blinking" : "") +
                (step8ShowFormula && !step8YActive ? " is-dimmed" : ""),
            },
            React.createElement(
              "span",
              { className: "step8-observation-label" },
              s8.observationY,
            ),
            React.createElement(
              "span",
              { className: "step8-observation-value" },
              s8.observationYValue,
            ),
          ),
        ),
        !step8ShowFormula
          ? React.createElement(
              React.Fragment,
              null,
              React.createElement("div", {
                className: "right-panel-text step8-body-text",
                dangerouslySetInnerHTML: {
                  __html: handleComma(s8.bodyText),
                },
              }),
              React.createElement(
                "button",
                {
                  className: "btn step7-option step8-reveal-btn",
                  id: "step8-reveal-button",
                  onClick: onStep8Reveal,
                },
                s8.revealBtn,
              ),
            )
          : React.createElement(
              "div",
              {
                className:
                  "step8-formula" +
                  (step8ShowFormula ? " is-visible" : "") +
                  (step8XActive ? " has-x-active" : "") +
                  (step8XBlink ? " has-x-blink" : "") +
                  (step8YActive ? " has-y-active" : "") +
                  (step8YBlink ? " has-y-blink" : ""),
              },
              React.createElement("span", null, "A("),
              React.createElement("span", { className: "math-var formula-x" }, "x"),
              React.createElement("span", null, ", "),
              React.createElement("span", { className: "math-var formula-y" }, "y"),
              React.createElement("span", null, ") \u2192 A\u2032("),
              React.createElement("span", { className: "math-var formula-x" }, "x"),
              React.createElement("span", null, ", "),
              React.createElement("span", { className: "math-var formula-neg-y" }, "-y"),
              React.createElement("span", null, ")"),
            ),
      );
    }

    if (step === 9) {
      const s9 = APP_DATA.steps[9];
      const question = step9Question;
      const isXPart = step9Part === "x";
      const currentQuestion = isXPart ? s9.questionX : s9.questionY;
      const currentFeedback = isXPart ? step9XFeedback : step9YFeedback;
      const currentStatus = isXPart ? step9XStatus : step9YStatus;
      const currentAnswer = isXPart ? step9XAnswer : step9YAnswer;
      const isLocked = currentStatus === "correct";

      return React.createElement(
        "div",
        { className: "right-panel-content step9-panel" },
        React.createElement("div", {
          className: "step9-title",
          dangerouslySetInnerHTML: { __html: handleComma(currentQuestion) },
        }),
        React.createElement(
          "div",
          {
            className:
              "step9-options-grid" +
              (question.options.length === 3 ? " is-three" : ""),
          },
          question.options.map((option) =>
            React.createElement(
              "button",
              {
                key: option,
                className:
                  "step7-option step9-option" +
                  (currentStatus === "correct" && currentAnswer === option
                    ? " is-correct"
                    : "") +
                  (currentStatus === "wrong" && currentAnswer === option
                    ? " is-wrong"
                    : ""),
                onClick: () => onStep9Option(option),
                disabled: isLocked,
              },
              option,
            ),
          ),
        ),
        currentFeedback
          ? React.createElement("div", {
              className:
                "feedback-box step9-feedback" +
                (currentStatus === "correct" ? " is-correct" : " is-wrong"),
              dangerouslySetInnerHTML: {
                __html: handleComma(currentFeedback),
              },
            })
          : null,
      );
    }

    return null;
  };

  return React.createElement(
    "div",
    { className: "main-canvas-container" },
    React.createElement(
      "div",
      { className: "main-canvas-left" },
      React.createElement(
        "div",
        { className: "left-top-text-row" },
        React.createElement("div", {
          className: "left-top-text-content",
          dangerouslySetInnerHTML: { __html: topText },
        }),
      ),
      React.createElement(
        "div",
        { className: "left-graph-row" },
        step === 9
          ? renderStep9Visual()
          : React.createElement(GraphPanel, {
              step: step,
              step2Phase: step2Phase,
              plottedPoint: plottedPoint,
              lineAnimPhase: lineAnimPhase,
              xAxisHighlighted: xAxisHighlighted,
              showReflectionLabel: showReflectionLabel,
              step4Phase: step4Phase,
              showUnitLine: showUnitLine,
              unitLineY1: unitLineY1,
              unitLineY2: unitLineY2,
              unitLabelText: unitLabelText,
              unitLabelFinal: unitLabelFinal,
              highlightFour: highlightFour,
              showQ1FourUnitsLabel: showQ1FourUnitsLabel,
              unitLineRotating: unitLineRotating,
              showDashedDistance: showDashedDistance,
              step5Phase: step5Phase,
              prop1Done: prop1Done,
              prop2Done: prop2Done,
              p1LineVisible: p1LineVisible,
              p1LineFadeReady: p1LineFadeReady,
              p1RightAngleVisible: p1RightAngleVisible,
              p1RightAngleFadeReady: p1RightAngleFadeReady,
              cloneVisible: cloneVisible,
              cloneY: cloneY,
              cloneOpacity: cloneOpacity,
              calloutVisible: calloutVisible,
              calloutFadeReady: calloutFadeReady,
              calloutPos: calloutPos,
              calloutMode: calloutMode,
              calloutPrevMode: calloutPrevMode,
              calloutTextNextReady: calloutTextNextReady,
              calloutLoading: calloutLoading,
              showMeasureLine: showMeasureLine,
              measureLineUnits: measureLineUnits,
              measureLineGrowing: measureLineGrowing,
              unitLabelOverride: unitLabelOverride,
              showApost: showApost,
              apostFadeReady: apostFadeReady,
              step6Phase: step6Phase,
              step6ShowVerticalLine: step6ShowVerticalLine,
              step6VerticalLineGrowing: step6VerticalLineGrowing,
              step6HighlightX2: step6HighlightX2,
              step6ShowCoordLabel: step6ShowCoordLabel,
              step6ShowCoordX: step6ShowCoordX,
              step6XCloneVisible: step6XCloneVisible,
              step6XCloneFlying: step6XCloneFlying,
              step6ShowHorizontalLine: step6ShowHorizontalLine,
              step6HorizontalLineGrowing: step6HorizontalLineGrowing,
              step6HighlightYNeg4: step6HighlightYNeg4,
              step6ShowCoordY: step6ShowCoordY,
              step6YCloneVisible: step6YCloneVisible,
              step6YCloneFlying: step6YCloneFlying,
              step7Answer: step7Answer,
              step7WrongCloneVisible: step7WrongCloneVisible,
              step7WrongCloneFlying: step7WrongCloneFlying,
              step8Phase: step8Phase,
              step8ShowFormula: step8ShowFormula,
              step8XActive: step8XActive,
              step8XBlink: step8XBlink,
              step8YActive: step8YActive,
              step8YBlink: step8YBlink,
              onGridClick: onGridClick,
              onXAxisClick: onXAxisClick,
            }),
      ),
    ),
    React.createElement(
      "div",
      { className: "main-canvas-right" },
      renderRightPanel(),
    ),
  );
};
