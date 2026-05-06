const MainCanvas = (props) => {
  const { step, onSetNextEnabled, onUpdateNavText } = props;
  const { useState, useEffect, useRef } = React;
  const prevStepRef = useRef(null);

  const createQuizState = (cards) =>
    cards.map(() => ({
      selected: null,
      lockedCorrect: false,
      disabledOptions: [],
      wrongActive: false,
    }));

  const createStep1ContentRightHighlight = () =>
    APP_DATA.steps[1].cards.map(() => false);

  const [step1State, setStep1State] = useState(() =>
    createQuizState(APP_DATA.steps[1].cards),
  );
  const [step1ContentRightHighlight, setStep1ContentRightHighlight] =
    useState(createStep1ContentRightHighlight);
  const [step4State, setStep4State] = useState(() =>
    createQuizState(APP_DATA.steps[4].cards),
  );
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackType, setFeedbackType] = useState("none");

  useEffect(() => {
    const prevStep = prevStepRef.current;
    prevStepRef.current = step;

    if (step === 1) {
      // Only reset step 1 when entering from the start screen (0), not when
      // returning from step 2 — preserves answers and feedback.
      if (prevStep === 0 || prevStep === null) {
        setStep1State(createQuizState(APP_DATA.steps[1].cards));
        setStep1ContentRightHighlight(createStep1ContentRightHighlight());
        setFeedbackText("");
        setFeedbackType("none");
        onSetNextEnabled(false);
        onUpdateNavText(APP_DATA.steps[1].navText);
      } else if (prevStep === 2) {
        const allDone = step1State.every((c) => c.lockedCorrect);
        onSetNextEnabled(allDone);
        onUpdateNavText(
          allDone
            ? APP_DATA.steps[1].navTextDone
            : APP_DATA.steps[1].navText,
        );
      }
    }
    if (step === 2) {
      onSetNextEnabled(true);
      onUpdateNavText(APP_DATA.steps[2].navText);
    }
    if (step === 4) {
      setStep4State(createQuizState(APP_DATA.steps[4].cards));
      setFeedbackText("");
      setFeedbackType("none");
      onSetNextEnabled(false);
      onUpdateNavText(APP_DATA.steps[4].navText);
    }
  }, [step]);

  const allUnlockedCardsReady = (state) =>
    state.every((card) => {
      if (card.lockedCorrect) return true;
      return (
        card.selected !== null &&
        card.disabledOptions.indexOf(card.selected) === -1
      );
    });

  const getStep1WrongMessage = (wrongIndexes) => {
    const feedback = APP_DATA.steps[1].feedback;
    if (wrongIndexes.length >= 3) return feedback.wrongMany;
    const wrongTitles = wrongIndexes.map(
      (idx) => APP_DATA.steps[1].cards[idx].shortTitle,
    );
    return feedback.wrongFewTemplate.replace(
      "{titles}",
      wrongTitles.join(", "),
    );
  };

  const getStep4WrongMessage = (wrongIndexes) => {
    const feedback = APP_DATA.steps[4].feedback;
    if (wrongIndexes.length === 4) return feedback.allWrong;

    // Decide by the expected answer type of wrong cards:
    // all words -> specialName, all numbers -> specialCount, mixed -> default.
    const wrongAnswerTypes = wrongIndexes.map(
      (idx) => APP_DATA.steps[4].cards[idx].answer,
    );
    const hasWordCardWrong = wrongAnswerTypes.indexOf(0) !== -1;
    const hasNumberCardWrong = wrongAnswerTypes.indexOf(1) !== -1;

    if (hasWordCardWrong && hasNumberCardWrong) {
      return feedback.defaultWrong;
    }
    if (hasNumberCardWrong) {
      return feedback.specialCount;
    }
    if (hasWordCardWrong) {
      return feedback.specialName;
    }

    return feedback.defaultWrong;
  };

  const evaluateStep = (stepNumber, state, setState) => {
    const cards = APP_DATA.steps[stepNumber].cards;
    const nextState = state.map((card) => ({
      selected: card.selected,
      lockedCorrect: card.lockedCorrect,
      disabledOptions: card.disabledOptions.slice(),
      wrongActive: false,
    }));
    const wrongIndexes = [];

    cards.forEach((cardData, idx) => {
      const cardState = nextState[idx];
      if (cardState.lockedCorrect) return;

      if (cardState.selected === cardData.answer) {
        cardState.lockedCorrect = true;
        cardState.wrongActive = false;
      } else {
        wrongIndexes.push(idx);
        cardState.wrongActive = true;
        if (cardState.selected !== null) {
          if (cardState.disabledOptions.indexOf(cardState.selected) === -1) {
            cardState.disabledOptions.push(cardState.selected);
          }
        }
      }
    });

    const allCorrect = nextState.every((card) => card.lockedCorrect);
    if (allCorrect) {
      setFeedbackType("correct");
      setFeedbackText(APP_DATA.steps[stepNumber].feedback.correct);
      onSetNextEnabled(true);
      onUpdateNavText(APP_DATA.steps[stepNumber].navTextDone);
      if (typeof playSound === "function") playSound("congrats");
    } else {
      setFeedbackType("wrong");
      setFeedbackText(
        stepNumber === 1
          ? getStep1WrongMessage(wrongIndexes)
          : getStep4WrongMessage(wrongIndexes),
      );
      onSetNextEnabled(false);
      if (typeof playSound === "function") playSound("wrong");
    }

    if (stepNumber === 1) {
      setStep1ContentRightHighlight((prev) => {
        const next = prev.slice();
        if (allCorrect) {
          for (var i = 0; i < next.length; i++) {
            next[i] = true;
          }
        } else {
          wrongIndexes.forEach(function (idx) {
            next[idx] = true;
          });
        }
        return next;
      });
    }

    setState(nextState);
  };

  const handleOptionSelect = (stepNumber, cardIndex, option) => {
    if (typeof playSound === "function") playSound("click");

    const state = stepNumber === 1 ? step1State : step4State;
    const setState = stepNumber === 1 ? setStep1State : setStep4State;

    const cardState = state[cardIndex];
    if (cardState.lockedCorrect) return;
    if (cardState.disabledOptions.indexOf(option) !== -1) return;

    const updatedState = state.map((item, idx) => {
      if (idx !== cardIndex) return item;
      return {
        selected: option,
        lockedCorrect: item.lockedCorrect,
        disabledOptions: item.disabledOptions.slice(),
        wrongActive: false,
      };
    });

    setState(updatedState);

    if (allUnlockedCardsReady(updatedState)) {
      evaluateStep(stepNumber, updatedState, setState);
    }
  };

  const renderOptionButton = (
    stepNumber,
    cardState,
    cardIndex,
    optionValue,
    label,
  ) => {
    const isSelected = cardState.selected === optionValue;
    const isCorrect = cardState.lockedCorrect && isSelected;
    const isWrong = cardState.wrongActive && isSelected;
    const isDisabled =
      cardState.lockedCorrect ||
      cardState.disabledOptions.indexOf(optionValue) !== -1;

    const classNames = ["answer-btn"];
    if (isCorrect) classNames.push("correct");
    else if (isWrong) classNames.push("wrong");
    else if (isSelected) classNames.push("selected");
    else if (isDisabled) classNames.push("disabled");

    return React.createElement(
      "button",
      {
        className: classNames.join(" "),
        onClick: () => handleOptionSelect(stepNumber, cardIndex, optionValue),
        disabled: isDisabled,
      },
      label,
    );
  };

  const applyHighlight = (text, highlight) => {
    if (!highlight) return text;
    const escaped = highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return text.replace(
      new RegExp(escaped),
      '<span class="question-phrase-highlight">' + highlight + "</span>",
    );
  };

  const renderStep1Card = (card, cardState, cardIndex, highlightRightValues) =>
    React.createElement(
      "div",
      {
        className:
          "data-card " + (cardState.lockedCorrect ? "card-locked" : ""),
        key: "s1-card-" + cardIndex,
      },
      React.createElement(
        "div",
        { className: "card-title-section" },
        React.createElement("h3", null, card.title),
      ),
      React.createElement(
        "div",
        { className: "card-content-section" },
        card.contentRows.map((row, rowIndex) =>
          React.createElement(
            "div",
            { className: "content-pair-row", key: "row-" + rowIndex },
            React.createElement("span", { className: "content-left" }, row[0]),
            React.createElement("span", { className: "content-arrow" }, row[1]),
            React.createElement(
              "span",
              {
                className: "content-right",
                style: highlightRightValues ? { color: "#ff9800" } : undefined,
                dangerouslySetInnerHTML: { __html: row[2] },
              },
              // row[2],
            ),
          ),
        ),
      ),
      React.createElement(
        "div",
        { className: "card-buttons-section" },
        renderOptionButton(1, cardState, cardIndex, 0, APP_DATA.labels.words),
        renderOptionButton(1, cardState, cardIndex, 1, APP_DATA.labels.numbers),
      ),
    );

  const renderStep4Card = (card, cardState, cardIndex) =>
    React.createElement(
      "div",
      {
        className:
          "data-card no-title " +
          (cardState.lockedCorrect ? "card-locked" : ""),
        key: "s4-card-" + cardIndex,
      },
      React.createElement(
        "div",
        { className: "card-content-section question-card-content" },
        React.createElement("p", {
          dangerouslySetInnerHTML: {
            __html: cardState.wrongActive
              ? applyHighlight(card.content, card.wrongHighlight)
              : card.content,
          },
        }),
      ),
      React.createElement(
        "div",
        { className: "card-buttons-section" },
        renderOptionButton(4, cardState, cardIndex, 0, APP_DATA.labels.words),
        renderOptionButton(4, cardState, cardIndex, 1, APP_DATA.labels.numbers),
      ),
    );

  const renderStep2Card = (card, cardIndex) =>
    React.createElement(
      "div",
      { className: "data-card summary-card", key: "s2-card-" + cardIndex },
      React.createElement(
        "div",
        { className: "card-title-section" },
        React.createElement("h3", null, card.title),
      ),
      React.createElement(
        "div",
        { className: "summary-card-content" },
        React.createElement("p", {
          className: "summary-highlight-text",
          dangerouslySetInnerHTML: { __html: "<y>" + card.highlight + "</y>" },
        }),
        React.createElement("p", null, card.text),
      ),
    );

  if (step === 2) {
    return React.createElement(
      "div",
      { className: "main-canvas-container step-two" },
      React.createElement(
        "div",
        { className: "cards-row cards-row-step-two" },
        APP_DATA.steps[2].cards.map((card, index) =>
          renderStep2Card(card, index),
        ),
      ),
      React.createElement(
        "div",
        { className: "text-row" },
        React.createElement("p", {
          dangerouslySetInnerHTML: { __html: APP_DATA.steps[2].noteText },
        }),
      ),
    );
  }

  const isStep1 = step === 1;
  const activeCards = isStep1
    ? APP_DATA.steps[1].cards
    : APP_DATA.steps[4].cards;
  const activeState = isStep1 ? step1State : step4State;

  return React.createElement(
    "div",
    { className: "main-canvas-container" },
    React.createElement(
      "div",
      { className: "feedback-row" },
      React.createElement("div", {
        className:
          "feedback-banner " +
          (feedbackType === "correct"
            ? "feedback-correct"
            : feedbackType === "wrong"
              ? "feedback-wrong"
              : "feedback-none"),
        dangerouslySetInnerHTML: {
          __html: feedbackText || "&nbsp;",
        },
      }),
    ),
    React.createElement(
      "div",
      { className: "cards-row" },
      activeCards.map((card, index) =>
        isStep1
          ? renderStep1Card(
              card,
              activeState[index],
              index,
              step1ContentRightHighlight[index],
            )
          : renderStep4Card(card, activeState[index], index),
      ),
    ),
  );
};
