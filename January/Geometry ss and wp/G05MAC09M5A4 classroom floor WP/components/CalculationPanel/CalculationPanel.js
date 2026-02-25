const CalculationPanel = ({
  step,
  onEnableNext,
  onUpdateNavText,
  onUpdateQuestionText,
  step3McqAnswered,
  setStep3McqAnswered,
  step3FractionTapped,
  setStep3FractionTapped,
  calcState,
  setCalcState,
  imageSrc,
  onUpdateImage
}) => {
  const { useState, useEffect } = React;

  const step3Data = APP_DATA.step3Calc;
  const step5Data = APP_DATA.step5Calc;
  const step6Data = APP_DATA.step6Calc;
  const step7Data = APP_DATA.step7Calc;
  const step8Data = APP_DATA.step8Calc;
  const step9Data = APP_DATA.step9Final;
  const stepData = APP_DATA.steps[step] || {};
  const hideImage = stepData.hideImage === true;

  const [numpadValue, setNumpadValue] = useState("");
  const [inputError, setInputError] = useState(false);
  const [step5InputError, setStep5InputError] = useState(false);
  const [selectedMcqOption, setSelectedMcqOption] = useState(null);
  const [mcqCorrect, setMcqCorrect] = useState(false);
  const [step6SelectedOption, setStep6SelectedOption] = useState(null);
  const [step6McqCorrect, setStep6McqCorrect] = useState(false);

  useEffect(() => {
    setNumpadValue("");
    setInputError(false);
    setSelectedMcqOption(null);
    setMcqCorrect(false);
    setStep6SelectedOption(null);
    setStep6McqCorrect(false);
  }, [step]);

  useEffect(() => {
    if (step === 5 && step5Data && step5Data.questions) {
      const idx = typeof calcState.step5BoxIndex === "number" ? calcState.step5BoxIndex : 0;
      const revealed = calcState.step5Revealed;
      const filled = calcState.step5Filled;
      const qKey = step5Data.variables && step5Data.variables[idx] ? step5Data.variables[idx].questionKey : "q1";
      const qText = step5Data.questions[qKey] || step5Data.questions.q1;
      if (onUpdateQuestionText && qText) onUpdateQuestionText(qText);
      if (onUpdateNavText) {
        const v = step5Data.variables && step5Data.variables[idx];
        if (calcState.step5AllDone) onUpdateNavText(step5Data.navTapContinue);
        else if (!Array.isArray(revealed) || !revealed[idx]) onUpdateNavText(step5Data.navTapVariable || step5Data.navUseNumpad);
        else if (v && v.needsNumpad && (!Array.isArray(filled) || !filled[idx])) onUpdateNavText(step5Data.navUseNumpad);
        else if (idx < 2) onUpdateNavText(step5Data.navTapVariable || step5Data.navUseNumpad);
        else onUpdateNavText(step5Data.navTapContinue);
      }
    }
  }, [step, calcState.step5BoxIndex, calcState.step5Revealed, calcState.step5Filled, calcState.step5AllDone]);

  function renderFraction(numContent, denContent) {
    return React.createElement(
      "span",
      { className: "calc-fraction" },
      React.createElement("span", { className: "calc-fraction-num" }, numContent),
      React.createElement("span", { className: "calc-fraction-bar" }),
      React.createElement("span", { className: "calc-fraction-den" }, denContent)
    );
  }

  // —— Step 3: MCQ then interactive box (rewrite as fraction) ——
  const handleStep3McqClick = (index) => {
    if (mcqCorrect || !step3Data) return;
    setSelectedMcqOption(index);
    if (index === step3Data.mcqAnswerIndex) {
      setMcqCorrect(true);
      if (window.playSound) window.playSound("correct");
      setTimeout(() => {
        setStep3McqAnswered(true);
        if (onUpdateNavText) onUpdateNavText(step3Data.navTapHighlighted);
      }, 500);
    } else {
      if (window.playSound) window.playSound("wrong");
    }
  };

  const handleStep3BoxTap = () => {
    if (!step3FractionTapped) {
      setStep3FractionTapped(true);
      if (window.playSound) window.playSound("tick");
      if (onEnableNext) onEnableNext();
      if (onUpdateNavText) onUpdateNavText(step3Data.navTapContinue);
    }
  };

  // —— Step 5: Tap variable to reveal, then numpad (var 0,1) or direct value (var 2) ——
  const handleStep5VariableTap = (idx) => {
    const boxIndex = typeof calcState.step5BoxIndex === "number" ? calcState.step5BoxIndex : 0;
    if (idx !== boxIndex) return;
    const revealedArr = calcState.step5Revealed;
    if (!Array.isArray(revealedArr)) return;
    if (revealedArr[idx]) return;
    if (window.playSound) window.playSound("tick");
    setCalcState(prev => {
      const nextRevealed = Array.isArray(prev.step5Revealed) ? [...prev.step5Revealed] : [false, false, false];
      nextRevealed[idx] = true;
      const v = step5Data.variables[idx];
      const noNumpad = v && v.needsNumpad === false;
      const nextFilled = noNumpad ? (() => { const f = Array.isArray(prev.step5Filled) ? [...prev.step5Filled] : [false, false, false]; f[idx] = true; return f; })() : prev.step5Filled;
      const nextIndex = noNumpad ? idx + 1 : prev.step5BoxIndex;
      const allDone = noNumpad && nextIndex >= 3;
      if (allDone && onEnableNext) setTimeout(() => onEnableNext(), 300);
      if (allDone && onUpdateNavText) setTimeout(() => onUpdateNavText(step5Data.navTapContinue), 300);
      if (noNumpad && onUpdateNavText && idx < 2) setTimeout(() => onUpdateNavText(step5Data.navTapVariable), 0);
      if (!noNumpad && onUpdateNavText) setTimeout(() => onUpdateNavText(step5Data.navUseNumpad), 0);
      return { ...prev, step5Revealed: nextRevealed, step5Filled: nextFilled, step5BoxIndex: noNumpad ? nextIndex : prev.step5BoxIndex, step5AllDone: allDone };
    });
  };

  const handleStep5NumberClick = (num) => {
    const idx = typeof calcState.step5BoxIndex === "number" ? calcState.step5BoxIndex : 0;
    if (idx >= 2) return;
    const v = step5Data.variables && step5Data.variables[idx];
    const maxLen = (v && v.answer && v.answer.length) || 5;
    const valuesArr = Array.isArray(calcState.step5Values) ? calcState.step5Values : ["", "", ""];
    if ((valuesArr[idx] || "").length >= maxLen) return;
    setCalcState(prev => {
      const prevValues = Array.isArray(prev.step5Values) ? prev.step5Values : ["", "", ""];
      const next = [...prevValues];
      next[idx] = next[idx] + num;
      return { ...prev, step5Values: next };
    });
    setStep5InputError(false);
  };

  const handleStep5Clear = () => {
    const idx = typeof calcState.step5BoxIndex === "number" ? calcState.step5BoxIndex : 0;
    setCalcState(prev => {
      const prevValues = Array.isArray(prev.step5Values) ? prev.step5Values : ["", "", ""];
      const next = [...prevValues];
      next[idx] = next[idx].slice(0, -1);
      return { ...prev, step5Values: next };
    });
    setStep5InputError(false);
  };

  const handleStep5Submit = () => {
    const idx = typeof calcState.step5BoxIndex === "number" ? calcState.step5BoxIndex : 0;
    const v = step5Data.variables && step5Data.variables[idx];
    const correct = v && v.answer;
    const valuesArr = calcState.step5Values;
    const currentVal = Array.isArray(valuesArr) ? valuesArr[idx] : "";
    if (currentVal === correct) {
      if (window.playSound) window.playSound("correct");
      setCalcState(prev => {
        const prevFilled = Array.isArray(prev.step5Filled) ? prev.step5Filled : [false, false, false];
        const filled = [...prevFilled];
        filled[idx] = true;
        const nextIndex = idx + 1;
        const allDone = nextIndex >= 3;
        if (allDone && onEnableNext) setTimeout(() => onEnableNext(), 300);
        if (allDone && onUpdateNavText) setTimeout(() => onUpdateNavText(step5Data.navTapContinue), 300);
        if (nextIndex < 3 && onUpdateNavText) setTimeout(() => onUpdateNavText(step5Data.navTapVariable), 300);
        return { ...prev, step5Filled: filled, step5BoxIndex: nextIndex, step5AllDone: allDone };
      });
      setStep5InputError(false);
    } else {
      if (window.playSound) window.playSound("wrong");
      setStep5InputError(true);
      setTimeout(() => {
        setStep5InputError(false);
        setCalcState(prev => {
          const prevValues = Array.isArray(prev.step5Values) ? prev.step5Values : ["", "", ""];
          const next = [...prevValues];
          next[idx] = "";
          return { ...prev, step5Values: next };
        });
      }, 300);
    }
  };

  // —— Step 6: Conversion MCQ ——
  const handleStep6McqClick = (index) => {
    if (step6McqCorrect || !step6Data) return;
    setStep6SelectedOption(index);
    if (index === step6Data.mcqAnswerIndex) {
      setStep6McqCorrect(true);
      if (window.playSound) window.playSound("correct");
      setTimeout(() => {
        setCalcState(prev => ({ ...prev, step6McqAnswered: true }));
        if (onEnableNext) onEnableNext();
        if (onUpdateNavText) onUpdateNavText(step6Data.navTapContinue);
      }, 500);
    } else {
      if (window.playSound) window.playSound("wrong");
    }
  };

  // —— Step 7: Numpad for 10000 ——
  const handleStep7NumberClick = (num) => {
    const maxLen = step7Data ? step7Data.numpadMaxLength : 5;
    if (numpadValue.length < maxLen) setNumpadValue(prev => prev + num);
  };

  const handleStep7Submit = () => {
    const correct = step7Data ? step7Data.numpadAnswer : "10000";
    if (numpadValue === correct) {
      if (window.playSound) window.playSound("correct");
      setCalcState(prev => ({ ...prev, step7NumpadAnswered: true, step7Value: numpadValue }));
      if (onEnableNext) onEnableNext();
      if (onUpdateNavText) onUpdateNavText(step7Data ? step7Data.navTapContinue : "");
    } else {
      setInputError(true);
      if (window.playSound) window.playSound("wrong");
      setTimeout(() => { setInputError(false); setNumpadValue(""); }, 300);
    }
  };

  // —— Step 8: Simplify then numpad for 16875000 ——
  const handleStep8Simplify = () => {
    if (!calcState.step8SimplifyClicked) {
      if (window.playSound) window.playSound("click");
      setCalcState(prev => ({ ...prev, step8SimplifyClicked: true }));
      if (onUpdateNavText) onUpdateNavText(step8Data ? step8Data.navUseNumpad : "");
    }
  };

  const handleStep8NumberClick = (num) => {
    const maxLen = step8Data ? step8Data.numpadMaxLength : 8;
    if (numpadValue.length < maxLen) setNumpadValue(prev => prev + num);
  };

  const handleStep8Submit = () => {
    const correct = step8Data ? step8Data.numpadAnswer : "16875000";
    if (numpadValue === correct) {
      if (window.playSound) window.playSound("correct");
      setCalcState(prev => ({ ...prev, step8NumpadAnswered: true, step8Value: numpadValue }));
      if (onEnableNext) onEnableNext();
      if (onUpdateNavText) onUpdateNavText(step8Data ? step8Data.navTapContinue : "");
    } else {
      setInputError(true);
      if (window.playSound) window.playSound("wrong");
      setTimeout(() => { setInputError(false); setNumpadValue(""); }, 300);
    }
  };

  // —— Get findings for right panel ——
  const getFindings = () => {
    if (step === 3) return { title: "", list: [], hide: true };
    if (step === 5) {
      return { title: step5Data ? step5Data.givenTitle : APP_DATA.labels.given, list: step5Data ? step5Data.givenList : [] };
    }
    if (step === 6) return { title: "", list: [], hide: true };
    if (step === 7 || step === 8) {
      return { title: step7Data ? step7Data.findingsTitle : APP_DATA.labels.findings, list: step7Data ? step7Data.findingsList : [] };
    }
    if (step === 9) {
      return { title: step7Data ? step7Data.findingsTitle : APP_DATA.labels.findings, list: step7Data ? step7Data.findingsList : [] };
    }
    return { title: "", list: [] };
  };

  const findingsData = getFindings();
  const showFindingsDiv = !findingsData.hide && (findingsData.title || findingsData.list.length > 0);

  // —— Render left panel calc rows by step ——
  const renderCalcRows = () => {
    if (step === 3 && step3Data) {
      const rows = [];
      if (!step3McqAnswered) {
        rows.push(React.createElement("div", { key: "r1", className: "calc-row" }, step3Data.initialCalcRow));
      } else {
        if (!step3FractionTapped) {
          rows.push(
            React.createElement("div", { key: "r1", className: "calc-row" },
              step3Data.afterMcqCalcRowLabel,
              React.createElement(
                "span",
                {
                  className: "calc-interactive-box clickable",
                  onClick: handleStep3BoxTap
                },
                step3Data.interactiveBoxLabel
              ),
              " × ",
              step3Data.costOfOneTile
            )
          );
        } else {
          rows.push(
            React.createElement("div", { key: "r1", className: "calc-row" },
              (APP_DATA.labels && APP_DATA.labels.totalCost ? APP_DATA.labels.totalCost + " = " : "Total cost = "),
              renderFraction(step3Data.areaOfFloor, step3Data.areaOfOneTile),
              " × ",
              step3Data.costOfOneTile
            )
          );
        }
      }
      return rows;
    }

    if (step === 5 && step5Data) {
      const vars = step5Data.variables || [];
      const revealed = Array.isArray(calcState.step5Revealed) ? calcState.step5Revealed : [false, false, false];
      const filled = Array.isArray(calcState.step5Filled) ? calcState.step5Filled : [false, false, false];
      const values = Array.isArray(calcState.step5Values) ? calcState.step5Values : ["", "", ""];
      const currentIdx = typeof calcState.step5BoxIndex === "number" ? calcState.step5BoxIndex : 0;
      const renderVar0 = () => {
        if (!vars[0]) return null;
        if (!revealed[0]) {
          const isCurrent = currentIdx === 0;
          return isCurrent
            ? React.createElement("span", { className: "calc-interactive-box clickable", onClick: () => handleStep5VariableTap(0) }, vars[0].label)
            : React.createElement("span", { className: "calc-var-label" }, vars[0].label);
        }
        if (filled[0]) return vars[0].answer + vars[0].unit;
        const val0 = values[0];
        return React.createElement("span", { className: `calc-input-box ${step5InputError ? "error shake" : ""} highlighted ${!val0 ? "placeholder" : ""}` }, val0 || vars[0].expression);
      };
      const renderVar1 = () => {
        if (!vars[1]) return null;
        if (!revealed[1]) {
          const isCurrent = currentIdx === 1;
          return isCurrent
            ? React.createElement("span", { className: "calc-interactive-box clickable", onClick: () => handleStep5VariableTap(1) }, vars[1].label)
            : React.createElement("span", { className: "calc-var-label" }, vars[1].label);
        }
        if (filled[1]) return vars[1].answer + vars[1].unit;
        const val1 = values[1];
        return React.createElement("span", { className: `calc-input-box ${step5InputError ? "error shake" : ""} highlighted ${!val1 ? "placeholder" : ""}` }, val1 || vars[1].expression);
      };
      const renderVar2 = () => {
        if (!vars[2]) return null;
        if (!revealed[2]) {
          const isCurrent = currentIdx === 2;
          return isCurrent
            ? React.createElement("span", { className: "calc-interactive-box clickable", onClick: () => handleStep5VariableTap(2) }, vars[2].label)
            : React.createElement("span", { className: "calc-var-label" }, vars[2].label);
        }
        return vars[2].answer + vars[2].unit;
      };
      return [
        React.createElement("div", { key: "r1", className: "calc-row calc-row-input-boxes" },
          (APP_DATA.labels && APP_DATA.labels.totalCost ? APP_DATA.labels.totalCost + " = " : "Total cost = "),
          renderFraction(renderVar0(), renderVar1()),
          " × ",
          renderVar2()
        )
      ];
    }

    if (step === 6 && step6Data) {
      return [
        React.createElement("div", { key: "r1", className: "calc-row" },
          (APP_DATA.labels && APP_DATA.labels.totalCost ? APP_DATA.labels.totalCost + " = " : "Total cost = "),
          renderFraction("108 m²", "1600 cm²"),
          " × 25000"
        )
      ];
    }

    if (step === 7 && step7Data) {
      const rows = [];
      rows.push(
        React.createElement("div", { key: "r1", className: "calc-row" },
          (APP_DATA.labels && APP_DATA.labels.totalCost ? APP_DATA.labels.totalCost + " = " : "Total cost = "),
          renderFraction("108 m²", "1600 cm²"),
          " × 25000"
        )
      );
      if (!calcState.step7NumpadAnswered) {
        rows.push(
          React.createElement("div", { key: "r2", className: "calc-row" },
            (APP_DATA.labels && APP_DATA.labels.totalCost ? APP_DATA.labels.totalCost + " = " : "Total cost = "),
            renderFraction(
              React.createElement(React.Fragment, null, "108 × ", React.createElement("span", { className: `calc-input-box ${inputError ? "error shake" : ""}` }, numpadValue || ""), " cm²"),
              "1600 cm²"
            ),
            " × 25000"
          )
        );
      } else {
        rows.push(
          React.createElement("div", { key: "r2", className: "calc-row" },
            (APP_DATA.labels && APP_DATA.labels.totalCost ? APP_DATA.labels.totalCost + " = " : "Total cost = "),
            renderFraction("108 × " + (calcState.step7Value || "10000") + " cm²", "1600 cm²"),
            " × 25000"
          )
        );
      }
      return rows;
    }

    if (step === 8 && step8Data) {
      const rows = [];
      rows.push(
        React.createElement("div", { key: "r1", className: "calc-row" },
          (APP_DATA.labels && APP_DATA.labels.totalCost ? APP_DATA.labels.totalCost + " = " : "Total cost = "),
          renderFraction("108 m²", "1600 cm²"),
          " × 25000"
        )
      );
      rows.push(
        React.createElement("div", { key: "r2", className: "calc-row" },
          (APP_DATA.labels && APP_DATA.labels.totalCost ? APP_DATA.labels.totalCost + " = " : "Total cost = "),
          renderFraction("108 × 10000 cm²", "1600 cm²"),
          " × 25000"
        )
      );
      if (calcState.step8SimplifyClicked) {
        rows.push(React.createElement("div", { key: "r3", className: "calc-row" }, step8Data.rowAfterSimplify1));
        if (!calcState.step8NumpadAnswered) {
          rows.push(
            React.createElement("div", { key: "r4", className: "calc-row" },
              step8Data.rowAfterSimplify2,
              React.createElement("span", { className: `calc-input-box ${inputError ? "error shake" : ""}` }, numpadValue || "")
            )
          );
        } else {
          rows.push(
            React.createElement("div", { key: "r4", className: "calc-row" }, step8Data.rowAfterSimplify2 + (calcState.step8Value || ""))
          );
        }
      }
      return rows;
    }

    if (step === 9 && step8Data && step9Data) {
      const rows = [];
      rows.push(React.createElement("div", { key: "r1", className: "calc-row" }, (APP_DATA.labels && APP_DATA.labels.totalCost ? APP_DATA.labels.totalCost + " = " : "Total cost = "), renderFraction("108 m²", "1600 cm²"), " × 25000"));
      rows.push(React.createElement("div", { key: "r2", className: "calc-row" }, (APP_DATA.labels && APP_DATA.labels.totalCost ? APP_DATA.labels.totalCost + " = " : "Total cost = "), renderFraction("108 × 10000 cm²", "1600 cm²"), " × 25000"));
      rows.push(React.createElement("div", { key: "r3", className: "calc-row" }, step8Data.rowAfterSimplify1));
      rows.push(React.createElement("div", { key: "r4", className: "calc-row" }, step8Data.rowAfterSimplify2 + (calcState.step8Value || step8Data.numpadAnswer)));
      return rows;
    }

    return [];
  };

  // —— Right panel input content ——
  const renderRightPanelInput = () => {
    if (step === 3) {
      if (!step3McqAnswered) {
        return React.createElement("div", { className: "calc-mcq" },
          React.createElement("div", { className: "calc-mcq-title" }, step3Data ? step3Data.mcqQuestion : ""),
          React.createElement("div", { className: "calc-mcq-options" },
            (step3Data ? step3Data.mcqOptions : []).map((opt, index) =>
              React.createElement("button", {
                key: index,
                className: `calc-mcq-option ${selectedMcqOption === index ? (index === step3Data.mcqAnswerIndex ? "correct" : "incorrect") : ""} ${mcqCorrect ? "disabled" : ""}`,
                onClick: () => handleStep3McqClick(index),
                disabled: mcqCorrect
              }, opt)
            )
          )
        );
      }
      return null;
    }

    if (step === 5 && !calcState.step5AllDone) {
      const idx = typeof calcState.step5BoxIndex === "number" ? calcState.step5BoxIndex : 0;
      const v = step5Data.variables && step5Data.variables[idx];
      const revealed = calcState.step5Revealed;
      const filled = calcState.step5Filled;
      const showNumpad = v && v.needsNumpad && Array.isArray(revealed) && revealed[idx] && (!Array.isArray(filled) || !filled[idx]);
      if (showNumpad) {
        return React.createElement(Numpad, {
          onNumberClick: handleStep5NumberClick,
          onClear: handleStep5Clear,
          onSubmit: handleStep5Submit
        });
      }
      return null;
    }

    if (step === 6 && !calcState.step6McqAnswered && step6Data) {
      return React.createElement("div", { className: "calc-mcq" },
        React.createElement("div", { className: "calc-mcq-title" }, step6Data.mcqQuestion),
        React.createElement("div", { className: "calc-mcq-options" },
          step6Data.mcqOptions.map((opt, index) =>
            React.createElement("button", {
              key: index,
              className: `calc-mcq-option ${step6SelectedOption === index ? (index === step6Data.mcqAnswerIndex ? "correct" : "incorrect") : ""} ${step6McqCorrect ? "disabled" : ""}`,
              onClick: () => handleStep6McqClick(index),
              disabled: step6McqCorrect
            }, opt)
          )
        )
      );
    }

    if (step === 7 && !calcState.step7NumpadAnswered) {
      return React.createElement(Numpad, {
        onNumberClick: handleStep7NumberClick,
        onClear: () => setNumpadValue(prev => prev.slice(0, -1)),
        onSubmit: handleStep7Submit
      });
    }

    if (step === 8) {
      if (!calcState.step8SimplifyClicked) {
        return React.createElement(
          "button",
          { className: "calc-mcq-option", onClick: handleStep8Simplify },
          (step8Data && step8Data.simplifyButtonLabel) || (APP_DATA.labels && APP_DATA.labels.simplifyButton) || ""
        );
      }
      if (!calcState.step8NumpadAnswered) {
        return React.createElement(Numpad, {
          onNumberClick: handleStep8NumberClick,
          onClear: () => setNumpadValue(prev => prev.slice(0, -1)),
          onSubmit: handleStep8Submit
        });
      }
    }

    return null;
  };

  // —— Build left panel (with or without image) ——
  const leftPanelContent = () => {
    const equationRow = React.createElement(
      "div",
      { className: "calc-equation-row" },
      React.createElement("div", { className: "calc-rows-container" }, renderCalcRows())
    );

    if (hideImage) {
      return React.createElement("div", { className: "calc-left-panel no-image" }, equationRow);
    }

    return React.createElement(
      "div",
      { className: "calc-left-panel with-image" },
      imageSrc && React.createElement(
        "div",
        { className: "calc-image-row" },
        React.createElement("img", { src: imageSrc, alt: (APP_DATA.altTexts && (APP_DATA.altTexts.classroom || APP_DATA.altTexts.diagram)) || "", className: "calc-image" })
      ),
      equationRow
    );
  };

  // —— Step 9: show final answer below calc rows ——
  if (step === 9) {
    return React.createElement(
      "div",
      { className: "calc-panel-container" },
      React.createElement(
        "div",
        { className: "calc-left-panel final no-image" },
        React.createElement("div", { className: "calc-equation-row" },
          React.createElement("div", { className: "calc-rows-container" }, renderCalcRows()),
          step9Data && React.createElement("div", { className: "final-answer-div" }, step9Data.finalAnswerText)
        )
      ),
      React.createElement(
        "div",
        { className: "calc-right-panel" },
        showFindingsDiv && React.createElement("div", { className: "calc-findings-div" },
          React.createElement("div", { className: "findings-title" }, findingsData.title),
          React.createElement("ul", { className: "findings-list" }, findingsData.list.map((item, i) => React.createElement("li", { key: i }, item)))
        ),
        React.createElement("div", { className: "calc-input-div" }, null)
      )
    );
  }

  // —— Steps 3, 5, 6, 7, 8 ——
  return React.createElement(
    "div",
    { className: "calc-panel-container" },
    leftPanelContent(),
    React.createElement(
      "div",
      { className: "calc-right-panel" },
      showFindingsDiv && React.createElement("div", { className: "calc-findings-div" },
        React.createElement("div", { className: "findings-title" }, findingsData.title),
        React.createElement("ul", { className: "findings-list" }, findingsData.list.map((item, i) => React.createElement("li", { key: i }, item)))
      ),
      React.createElement("div", { className: "calc-input-div" }, renderRightPanelInput())
    )
  );
};
