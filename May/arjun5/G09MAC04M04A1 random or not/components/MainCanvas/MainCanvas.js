const spinnerPolar = (cx, cy, r, angleDeg) => {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
};

const spinnerSectorPath = (cx, cy, innerR, outerR, startAngle, endAngle) => {
  const outerStart = spinnerPolar(cx, cy, outerR, startAngle);
  const outerEnd = spinnerPolar(cx, cy, outerR, endAngle);
  const innerEnd = spinnerPolar(cx, cy, innerR, endAngle);
  const innerStart = spinnerPolar(cx, cy, innerR, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;

  return [
    "M", outerStart.x, outerStart.y,
    "A", outerR, outerR, 0, largeArc, 1, outerEnd.x, outerEnd.y,
    "L", innerEnd.x, innerEnd.y,
    "A", innerR, innerR, 0, largeArc, 0, innerStart.x, innerStart.y,
    "Z",
  ].join(" ");
};

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
  const common = APP_DATA.common;
  const isEventStep = step === 3 || step === 4 || step === 5 || step === 6;
  const eventData = isEventStep ? APP_DATA.steps[step] : null;
  const sampleSpace = eventData ? eventData.sampleSpace : [];
  const answer = eventData ? eventData.answer : [];

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
    if (!isEventStep) return;

    if (initialStage === "final") {
      setSelected(answer.slice());
      setSubmitted(true);
      setIsCorrect(true);
      onUpdateNavText(eventData.navNext);
      onSetNextEnabled(true);
      return;
    }

    setSelected([]);
    setSubmitted(false);
    setIsCorrect(false);
    setTryAgainNudgeDismissed(false);
    onUpdateNavText(eventData.navText);
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

  const sortSelected = (items) => {
    if (typeof items[0] === "number") {
      return items.slice().sort((a, b) => a - b);
    }
    const order = sampleSpace.slice();
    return items.slice().sort((a, b) => order.indexOf(a) - order.indexOf(b));
  };

  const toggleOutcome = (value) => {
    if (!isEventStep || submitted) return;
    play("click");
    setSelected((prev) => (
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : sortSelected(prev.concat(value))
    ));
  };

  const setsMatch = (picked, expected) => {
    if (picked.length !== expected.length) return false;
    return expected.every((value) => picked.includes(value));
  };

  const handleSubmit = () => {
    if (!isEventStep || submitted || selected.length === 0) return;

    if (setsMatch(selected, answer)) {
      play("correct");
      setSubmitted(true);
      setIsCorrect(true);
      onUpdateNavText(eventData.navNext);
      onSetNextEnabled(true);
      return;
    }

    play("wrong");
    setSubmitted(true);
    setIsCorrect(false);
    setTryAgainNudgeDismissed(false);
    onUpdateNavText(eventData.navTryAgain);
    onSetNextEnabled(false);
  };

  const handleTryAgain = () => {
    if (!isEventStep || !submitted || isCorrect) return;
    play("click");
    setSelected((prev) => prev.filter((value) => answer.includes(value)));
    setSubmitted(false);
    setIsCorrect(false);
    setTryAgainNudgeDismissed(false);
    onUpdateNavText(eventData.navText);
  };

  const getOutcomeState = (value) => {
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

  const renderDiceCard = () =>
    e(
      "div",
      { className: "dice-card" },
      sampleSpace.map((value) => {
        const outcomeState = getOutcomeState(value);
        return e(
          "button",
          {
            type: "button",
            key: `die-${value}`,
            className: `die-item ${outcomeState} ${submitted ? "locked" : ""}`.trim(),
            onClick: () => toggleOutcome(value),
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
    );

  const renderBagCard = () =>
    e(
      "div",
      { className: "bag-card" },
      e("img", {
        className: "bag-card-image",
        src: eventData.bagImage,
        alt: "",
        draggable: false,
      }),
      e(
        "div",
        { className: "bag-card-options" },
        eventData.bagOptions.map((option) => {
          const outcomeState = getOutcomeState(option.id);
          return e(
            "button",
            {
              type: "button",
              key: `bag-${option.id}`,
              className: `bag-option ${outcomeState} ${submitted ? "locked" : ""}`.trim(),
              onClick: () => toggleOutcome(option.id),
              disabled: submitted,
            },
            e("span", { className: "bag-option-count" }, option.count),
            e("img", {
              className: "bag-option-ball",
              src: option.ball,
              alt: option.id,
              draggable: false,
            }),
          );
        }),
      ),
    );

  const renderSpinnerCard = () => {
    const cx = 100;
    const cy = 100;
    const innerR = 22;
    const outerR = 88;
    const sectorCount = sampleSpace.length;
    const hubR = 10;

    const sectorAngle = 360 / sectorCount;
    const idxForTwo = sampleSpace.indexOf(2);
    const arrowAngleDeg =
      idxForTwo >= 0 ? idxForTwo * sectorAngle : sectorAngle;

    const arrowStart = spinnerPolar(cx, cy, hubR, arrowAngleDeg);
    const arrowTipR = 42;
    const arrowHeadLen = 7;
    const arrowHeadSpread = 7;
    const arrowTip = spinnerPolar(cx, cy, arrowTipR, arrowAngleDeg);
    const arrowBaseR = arrowTipR - arrowHeadLen;
    const arrowLeft = spinnerPolar(cx, cy, arrowBaseR, arrowAngleDeg - arrowHeadSpread);
    const arrowRight = spinnerPolar(cx, cy, arrowBaseR, arrowAngleDeg + arrowHeadSpread);
    const arrowLineEnd = spinnerPolar(cx, cy, arrowBaseR - 0.8, arrowAngleDeg);

    return e(
      "div",
      { className: "spinner-card" },
      e(
        "svg",
        {
          className: "spinner-svg",
          viewBox: "0 0 200 200",
          role: "img",
          "aria-label": eventData.titleValue,
        },
        e("circle", {
          cx,
          cy,
          r: 96,
          className: "spinner-rim",
        }),
        sampleSpace.map((value, index) => {
          const startAngle = index * (360 / sectorCount) - (360 / sectorCount) / 2;
          const endAngle = startAngle + (360 / sectorCount);
          const midAngle = startAngle + (360 / sectorCount) / 2;
          const labelPos = spinnerPolar(cx, cy, 58, midAngle);
          const outcomeState = getOutcomeState(value);

          return e(
            "g",
            { key: `spinner-sector-${value}` },
            e("path", {
              d: spinnerSectorPath(cx, cy, innerR, outerR, startAngle, endAngle),
              className: `spinner-sector ${outcomeState} ${submitted ? "locked" : ""}`.trim(),
              onClick: submitted ? undefined : () => toggleOutcome(value),
            }),
            e(
              "text",
              {
                x: labelPos.x,
                y: labelPos.y,
                className: "spinner-label",
                textAnchor: "middle",
                dominantBaseline: "middle",
              },
              String(value),
            ),
          );
        }),
        e("circle", {
          cx,
          cy,
          r: hubR,
          className: "spinner-hub",
        }),
        e("line", {
          x1: arrowStart.x,
          y1: arrowStart.y,
          x2: arrowLineEnd.x,
          y2: arrowLineEnd.y,
          className: "spinner-arrow-line",
        }),
        e("polygon", {
          points: `${arrowTip.x},${arrowTip.y} ${arrowLeft.x},${arrowLeft.y} ${arrowRight.x},${arrowRight.y}`,
          className: "spinner-pointer",
        }),
      ),
    );
  };

  const renderEventVisual = () => {
    if (step === 3 || step === 6) return renderDiceCard();
    if (step === 4) return renderBagCard();
    return renderSpinnerCard();
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
            dangerouslySetInnerHTML: { __html: html(eventData.eventText) },
          }),
        ),
        e(
          "div",
          { className: "set-row s-row" },
          e("span", { className: "set-lhs" }, eventData.sampleLabel),
          e("span", { className: "set-eq" }, "="),
          e("span", { className: "set-rhs" }, renderSetItems(sampleSpace, true)),
        ),
        e(
          "div",
          { className: `set-row e-row ${eState}`.trim() },
          e("span", { className: "set-lhs" }, eventData.eventSetLabel),
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
                  __html: html(isCorrect ? eventData.correctFeedback : eventData.wrongFeedback),
                },
              })
            : null,
        ),
      ),
      e(
        RightPanel,
        {
          titleLabel: common.experimentLabel,
          titleValue: eventData.titleValue,
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
        renderEventVisual(),
      ),
      e(Nudge, {
        targetRef: tryAgainRef,
        active: submitted && !isCorrect && !tryAgainNudgeDismissed,
        onDismiss: () => setTryAgainNudgeDismissed(true),
      }),
    );
  };

  if (isEventStep) return renderEventStep();
  return renderChoiceStep();
};
