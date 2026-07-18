const Mode = (props) => {
  const { onSetNextEnabled, onUpdateNavText, onUpdateQuestionText, initialStage, showNudges } = props;
  const { useEffect, useState, useRef } = React;
  const e = React.createElement;
  const stepText = APP_DATA.steps[1];
  const dataset = APP_DATA.dataset;
  const modeValues = APP_DATA.modeValues;
  const countOptions = [0, 1, 2, 3, 4];
  const modeOptions = [3, 6, 4, 7, 8, 9];

  const [openId, setOpenId] = useState(null);
  const [modeCount, setModeCount] = useState(null);
  const [wrongKey, setWrongKey] = useState(null);
  const [answers, setAnswers] = useState([null, null]);
  const [foundModes, setFoundModes] = useState([]);
  const [modePairNudgesDismissed, setModePairNudgesDismissed] = useState(false);
  const countDropdownRef = useRef(null);
  const mode0DropdownRef = useRef(null);
  const mode1DropdownRef = useRef(null);

  useEffect(function () {
    if (initialStage === "final") {
      setModeCount(modeValues.length);
      setAnswers([modeValues[0], modeValues[1]]);
      setFoundModes(modeValues.slice());
      setOpenId(null);
      setModePairNudgesDismissed(true);
      onUpdateQuestionText(stepText.completeQuestion);
      onUpdateNavText(stepText.completeNav);
      onSetNextEnabled(true);
      return;
    }
    onSetNextEnabled(false);
    onUpdateQuestionText(stepText.questionText);
    onUpdateNavText(stepText.navText);
  }, [initialStage]);

  function markWrong(key) {
    setWrongKey(key);
    if (typeof playSound === "function") playSound("wrong");
    setTimeout(function () { setWrongKey(null); }, 650);
  }

  function handleCountSelect(value) {
    if (value !== modeValues.length) {
      markWrong("count-" + value);
      return;
    }
    setModeCount(value);
    setOpenId(null);
    if (typeof playSound === "function") playSound("correct");
    onUpdateQuestionText(stepText.countCorrectQuestion);
    onUpdateNavText(stepText.countCorrectNav);
  }

  function getModeOptionsForSlot(slot) {
    const otherSlot = slot === 0 ? 1 : 0;
    const otherAnswer = answers[otherSlot];
    if (otherAnswer === null) return modeOptions;
    return modeOptions.filter(function (option) { return option !== otherAnswer; });
  }

  function handleModeSelect(slot, value) {
    const otherSlot = slot === 0 ? 1 : 0;
    const isCorrect = modeValues.indexOf(value) >= 0 && answers[otherSlot] !== value;

    if (!isCorrect) {
      markWrong("mode-" + slot + "-" + value);
      return;
    }

    const nextAnswers = answers.slice();
    nextAnswers[slot] = value;
    const nextFound = foundModes.indexOf(value) >= 0 ? foundModes.slice() : foundModes.concat(value);

    setAnswers(nextAnswers);
    setFoundModes(nextFound);
    setOpenId(null);
    if (typeof playSound === "function") playSound("correct");

    if (nextFound.length === 1) {
      onUpdateQuestionText(stepText.oneModeQuestion);
      onUpdateNavText(stepText.countCorrectNav);
    } else if (nextFound.length === modeValues.length) {
      onUpdateQuestionText(stepText.completeQuestion);
      onUpdateNavText(stepText.completeNav);
      onSetNextEnabled(true);
    }
  }

  function renderDropdown(config) {
    const disabled = !!config.disabled;
    const locked = !!config.locked;
    const isOpen = openId === config.id && !disabled && !locked;
    const hasValue = config.value !== null && config.value !== undefined;
    const buttonClasses = [
      "custom-select-button",
      config.theme || "",
      disabled ? "disabled" : "",
      locked ? "locked" : "",
      wrongKey && wrongKey.indexOf(config.id) === 0 ? "wrong" : "",
    ].join(" ");

    return e("div", { className: "custom-select-wrap " + (config.theme || "") },
      e("button", {
        type: "button",
        ref: config.buttonRef || null,
        className: buttonClasses,
        disabled: disabled || locked,
        onClick: function () {
          if ((config.id === "mode-0" || config.id === "mode-1") && !disabled && !locked) {
            setModePairNudgesDismissed(true);
          }
          setOpenId(isOpen ? null : config.id);
          if (!isOpen && typeof playSound === "function") playSound("click");
        },
      },
        hasValue ? config.value : "",
        !locked ? e("span", { className: "select-arrow" }, isOpen ? "\u25B2" : "\u25BC") : null
      ),
      isOpen ? e("div", { className: "custom-options" },
        config.options.map(function (option) {
          const optionWrong = wrongKey === config.id + "-" + option;
          return e("button", {
            type: "button",
            className: "custom-option" + (optionWrong ? " wrong-option" : ""),
            key: config.id + "-option-" + option,
            onClick: function () { config.onSelect(option); },
          }, option);
        })
      ) : null
    );
  }

  function renderData() {
    return e("div", { className: "mode-data-grid" },
      dataset.map(function (value, index) {
        const classes = [
          "mode-data-number",
          foundModes.indexOf(value) >= 0 ? "found-mode mode-" + value : "",
        ].join(" ");
        return e("span", { className: classes, key: "mode-value-" + index },
          value + (index < dataset.length - 1 ? "," : "")
        );
      })
    );
  }

  const countComplete = modeCount === modeValues.length;
  const showCountNudge = showNudges && !countComplete && openId !== "count";
  const showModePairNudges = showNudges && countComplete && !modePairNudgesDismissed;

  return e("div", { className: "main-canvas-container mode-canvas" },
    e("div", { className: "mode-column mode-data-column" }, renderData()),
    e("div", { className: "mode-column mode-count-column" },
      e("h3", null, stepText.countPrompt),
      renderDropdown({
        id: "count",
        theme: "pink",
        value: modeCount,
        options: countOptions,
        locked: countComplete,
        buttonRef: countDropdownRef,
        onSelect: handleCountSelect,
      })
    ),
    e("div", { className: "mode-column mode-identify-column" },
      e("h3", null, countComplete && foundModes.length > 0 ? stepText.modePromptSingular : stepText.identifyPrompt),
      e("div", { className: "mode-answer-row " + (countComplete ? "two-selects" : "") },
        renderDropdown({
          id: "mode-0",
          theme: "blue",
          value: answers[0],
          options: getModeOptionsForSlot(0),
          disabled: !countComplete,
          locked: answers[0] !== null,
          buttonRef: mode0DropdownRef,
          onSelect: function (value) { handleModeSelect(0, value); },
        }),
        countComplete ? renderDropdown({
          id: "mode-1",
          theme: "blue",
          value: answers[1],
          options: getModeOptionsForSlot(1),
          disabled: false,
          locked: answers[1] !== null,
          buttonRef: mode1DropdownRef,
          onSelect: function (value) { handleModeSelect(1, value); },
        }) : null
      )
    ),
    e(Nudge, { targetRef: countDropdownRef, show: showCountNudge }),
    showModePairNudges ? e(Nudge, { targetRef: mode0DropdownRef, show: answers[0] === null }) : null,
    showModePairNudges ? e(Nudge, { targetRef: mode1DropdownRef, show: answers[1] === null }) : null
  );
};
