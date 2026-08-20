const MainCanvas = ({
  step,
  questionIndex = 0,
  initialStage,
  onSetNextEnabled,
  onUpdateNavText,
}) => {
  const { useState, useEffect, useRef } = React;
  const e = React.createElement;
  const html = (text) => (typeof handleComma === "function" ? handleComma(text) : text);

  const play = (name) => {
    if (typeof playSound === "function") playSound(name);
  };

  const choiceData = APP_DATA.choiceQuestions[questionIndex] || APP_DATA.choiceQuestions[0];
  const step1 = APP_DATA.steps[1];
  const step3 = APP_DATA.steps[3];
  const common = APP_DATA.common;
  const sampleSpace = step3.sampleSpace;
  const answer = step3.answer;

  const [clickedId, setClickedId] = useState(null);
  const [wrongClicked, setWrongClicked] = useState(false);
  const [choiceComplete, setChoiceComplete] = useState(false);
  const [nudgeDismissed, setNudgeDismissed] = useState(false);
  const [selected, setSelected] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [tryAgainNudgeDismissed, setTryAgainNudgeDismissed] = useState(false);
  const correctCardRef = useRef(null);
  const tryAgainRef = useRef(null);

  useEffect(() => {
    if (step !== 1) return;

    if (initialStage === "final") {
      setClickedId(choiceData.correctId);
      setWrongClicked(true);
      setChoiceComplete(true);
      setNudgeDismissed(true);
      const doneNav = questionIndex >= APP_DATA.choiceQuestions.length - 1
        ? step1.navSummarize
        : step1.navNextCard;
      onUpdateNavText(doneNav);
      onSetNextEnabled(true);
      return;
    }

    setClickedId(null);
    setWrongClicked(false);
    setChoiceComplete(false);
    setNudgeDismissed(false);
    onUpdateNavText(step1.navText);
    onSetNextEnabled(false);
  }, [step, questionIndex, initialStage]);

  useEffect(() => {
    if (step !== 3) return;

    if (initialStage === "final") {
      setSelected(answer.slice());
      setSubmitted(true);
      setIsCorrect(true);
      onUpdateNavText(step3.navNext);
      onSetNextEnabled(true);
      return;
    }

    setSelected([]);
    setSubmitted(false);
    setIsCorrect(false);
    onUpdateNavText(step3.navText);
    onSetNextEnabled(false);
  }, [step, initialStage]);

  const handleCardClick = (cardId) => {
    if (step !== 1 || choiceComplete) return;
    if (cardId === clickedId && cardId !== choiceData.correctId) return;

    if (cardId === choiceData.correctId) {
      play("correct");
      setClickedId(cardId);
      setChoiceComplete(true);
      setNudgeDismissed(true);
      const doneNav = questionIndex >= APP_DATA.choiceQuestions.length - 1
        ? step1.navSummarize
        : step1.navNextCard;
      onUpdateNavText(doneNav);
      onSetNextEnabled(true);
      return;
    }

    play("wrong");
    setClickedId(cardId);
    setWrongClicked(true);
    setNudgeDismissed(false);
    onUpdateNavText(step1.navOther);
  };

  const getCardState = (cardId) => {
    if (choiceComplete) {
      return cardId === choiceData.correctId ? "correct" : "incorrect";
    }
    if (wrongClicked && cardId === clickedId) return "incorrect";
    return "";
  };

  const toggleDie = (value) => {
    if (step !== 3 || submitted) return;
    play("click");
    setSelected((prev) => (
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : prev.concat(value).sort((a, b) => a - b)
    ));
  };

  const setsMatch = (picked, expected) => {
    if (picked.length !== expected.length) return false;
    return expected.every((value) => picked.includes(value));
  };

  const handleSubmit = () => {
    if (step !== 3 || submitted || selected.length === 0) return;

    if (setsMatch(selected, answer)) {
      play("correct");
      setSubmitted(true);
      setIsCorrect(true);
      onUpdateNavText(step3.navNext);
      onSetNextEnabled(true);
      return;
    }

    play("wrong");
    setSubmitted(true);
    setIsCorrect(false);
    setTryAgainNudgeDismissed(false);
    onUpdateNavText(step3.navTryAgain);
    onSetNextEnabled(false);
  };

  const handleTryAgain = () => {
    if (step !== 3 || !submitted || isCorrect) return;
    play("click");
    setSelected((prev) => prev.filter((value) => answer.includes(value)));
    setSubmitted(false);
    setIsCorrect(false);
    onUpdateNavText(step3.navText);
  };

  const getDieState = (value) => {
    const isSelected = selected.includes(value);
    if (!submitted) return isSelected ? "selected" : "";
    if (!isSelected) return "";
    if (isCorrect) return "correct";
    return answer.includes(value) ? "correct" : "incorrect";
  };

  const renderSetItems = (values, highlightSelected) => {
    const nodes = [e("span", { className: "set-brace", key: "open" }, "{")];
    values.forEach((value, index) => {
      const selectedClass = highlightSelected && selected.includes(value) ? " selected" : "";
      nodes.push(
        e("span", {
          className: `set-item${selectedClass}`,
          key: `item-${value}`,
        }, String(value)),
      );
      if (index < values.length - 1) {
        nodes.push(e("span", {
          className: "set-comma",
          key: `comma-${value}`,
          dangerouslySetInnerHTML: { __html: html(", ") },
        }));
      }
    });
    nodes.push(e("span", { className: "set-brace", key: "close" }, "}"));
    return nodes;
  };

  const renderChoiceCard = (card) => {
    const state = getCardState(card.id);
    const isCorrectCard = card.id === choiceData.correctId;

    return e(
      "button",
      {
        type: "button",
        key: card.id,
        className: `choice-card ${state} ${choiceComplete ? "locked" : ""}`.trim(),
        onClick: () => handleCardClick(card.id),
        disabled: choiceComplete,
        ref: isCorrectCard ? correctCardRef : undefined,
      },
      card.image
        ? e("img", {
            className: "choice-card-image",
            src: card.image,
            alt: "",
            draggable: false,
          })
        : null,
      card.items
        ? e(
            "div",
            { className: "choice-card-items" },
            card.items.map((item, index) =>
              e(
                "div",
                { className: "choice-item", key: `item-${card.id}-${index}` },
                e("span", null, item.count),
                e("img", {
                  className: "choice-ball",
                  src: item.ball,
                  alt: "",
                  draggable: false,
                }),
              ),
            ),
          )
        : null,
      card.faces
        ? e(
            "div",
            { className: "choice-faces" },
            card.faces.map((face, index) =>
              e(
                "div",
                { className: "choice-face", key: `face-${card.id}-${index}` },
                e("img", {
                  className: "choice-face-image",
                  src: face.image,
                  alt: "",
                  draggable: false,
                }),
                e("div", {
                  className: "choice-face-label",
                  dangerouslySetInnerHTML: { __html: html(face.label) },
                }),
              ),
            ),
          )
        : null,
    );
  };

  const renderChoiceStep = () => {
    const feedbackType = choiceComplete ? "correct" : (wrongClicked ? "incorrect" : null);
    const feedbackText = choiceComplete
      ? choiceData.correctFeedback
      : (wrongClicked ? choiceData.wrongFeedback : "");

    return e(
      "div",
      { className: "main-canvas-container" },
      e(
        LeftPanel,
        { className: "choice-layout" },
        e("div", {
          className: "choice-text",
          dangerouslySetInnerHTML: { __html: html(step1.leftText) },
        }),
        e(
          "div",
          { className: "choice-feedback-slot" },
          feedbackType
            ? e("div", {
                className: `feedback-box ${feedbackType}`,
                dangerouslySetInnerHTML: { __html: html(feedbackText) },
              })
            : null,
        ),
      ),
      e(
        RightPanel,
        {
          titleLabel: common.experimentLabel,
          titleValue: choiceData.titleValue,
        },
        e(
          "div",
          { className: "choice-cards" },
          choiceData.cards.map((card) => renderChoiceCard(card)),
        ),
      ),
      e(Nudge, {
        targetRef: correctCardRef,
        active: step === 1 && wrongClicked && !choiceComplete && !nudgeDismissed,
        onDismiss: () => setNudgeDismissed(true),
      }),
    );
  };

  const renderEventStep = () => {
    const eState = submitted ? (isCorrect ? "correct" : "incorrect") : "";
    const footerDisabled = submitted ? isCorrect : selected.length === 0;
    const footerLabel = submitted && !isCorrect ? common.tryAgain : common.submit;

    return e(
      "div",
      { className: "main-canvas-container" },
      e(
        LeftPanel,
        { className: "event-layout" },
        e(
          "div",
          { className: "info-box event-box" },
          e("div", {
            className: "event-label",
            dangerouslySetInnerHTML: { __html: html(common.eventLabel) },
          }),
          e("div", {
            className: "event-text",
            dangerouslySetInnerHTML: { __html: html(step3.eventText) },
          }),
        ),
        e(
          "div",
          { className: "set-row s-row" },
          e("span", { className: "set-lhs" }, step3.sampleLabel),
          e("span", { className: "set-eq" }, "="),
          e("span", { className: "set-rhs" }, renderSetItems(sampleSpace, true)),
        ),
        e(
          "div",
          { className: `set-row e-row ${eState}`.trim() },
          e("span", { className: "set-lhs" }, step3.eventSetLabel),
          e("span", { className: "set-eq" }, "="),
          e("span", { className: "set-rhs" }, renderSetItems(selected, true)),
        ),
        e(
          "div",
          { className: "event-feedback-slot" },
          submitted
            ? e("div", {
                className: `feedback-box ${isCorrect ? "correct" : "incorrect"}`,
                dangerouslySetInnerHTML: {
                  __html: html(isCorrect ? step3.correctFeedback : step3.wrongFeedback),
                },
              })
            : null,
        ),
      ),
      e(
        RightPanel,
        {
          titleLabel: common.experimentLabel,
          titleValue: step3.titleValue,
          footer: e(
            "button",
            {
              type: "button",
              ref: submitted && !isCorrect ? tryAgainRef : undefined,
              className: "btn",
              disabled: footerDisabled,
              onClick: submitted && !isCorrect ? handleTryAgain : handleSubmit,
            },
            footerLabel,
          ),
        },
        e(
          "div",
          { className: "dice-card" },
          sampleSpace.map((value) => {
            const dieState = getDieState(value);
            return e(
              "button",
              {
                type: "button",
                key: `die-${value}`,
                className: `die-item ${dieState} ${submitted ? "locked" : ""}`.trim(),
                onClick: () => toggleDie(value),
                disabled: submitted,
              },
              e("img", {
                className: "die-face",
                src: `assets/${value}.png`,
                alt: String(value),
                draggable: false,
              }),
              e("span", { className: "die-label" }, String(value)),
            );
          }),
        ),
      ),
      e(Nudge, {
        targetRef: tryAgainRef,
        active: submitted && !isCorrect && !tryAgainNudgeDismissed,
        onDismiss: () => setTryAgainNudgeDismissed(true),
      }),
    );
  };

  if (step === 3) return renderEventStep();
  return renderChoiceStep();
};
