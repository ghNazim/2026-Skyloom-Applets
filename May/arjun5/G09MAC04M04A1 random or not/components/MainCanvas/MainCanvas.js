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
    "M",
    outerStart.x,
    outerStart.y,
    "A",
    outerR,
    outerR,
    0,
    largeArc,
    1,
    outerEnd.x,
    outerEnd.y,
    "L",
    innerEnd.x,
    innerEnd.y,
    "A",
    innerR,
    innerR,
    0,
    largeArc,
    0,
    innerStart.x,
    innerStart.y,
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
  const html = (text) =>
    typeof handleComma === "function" ? handleComma(text) : text;

  const play = (name) => {
    if (typeof playSound === "function") playSound(name);
  };

  const choiceData =
    APP_DATA.choiceQuestions[questionIndex] || APP_DATA.choiceQuestions[0];
  const step1 = APP_DATA.steps[1];
  const common = APP_DATA.common;
  const isEventStep = step === 3 || step === 4 || step === 5 || step === 6;
  const eventData = isEventStep ? APP_DATA.steps[step] : null;
  const sampleSpace = eventData ? eventData.sampleSpace : [];
  const answer = eventData ? eventData.answer : [];

  const startsWithIntro =
    (step === 3 || step === 4 || step === 5 || step === 6) &&
    initialStage !== "final";
  const [clickedId, setClickedId] = useState(null);
  const [wrongClicked, setWrongClicked] = useState(false);
  const [choiceComplete, setChoiceComplete] = useState(false);
  const [nudgeDismissed, setNudgeDismissed] = useState(false);
  const [selected, setSelected] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [tryAgainNudgeDismissed, setTryAgainNudgeDismissed] = useState(false);
  const [eventPhase, setEventPhase] = useState(
    startsWithIntro ? "intro" : "play",
  );
  const [showIntroEventBox, setShowIntroEventBox] = useState(startsWithIntro);
  const [visualExpanded, setVisualExpanded] = useState(!startsWithIntro);
  const [revealedDice, setRevealedDice] = useState(
    startsWithIntro ? [] : sampleSpace.slice(),
  );
  const [bagOptionsRevealed, setBagOptionsRevealed] = useState(
    !startsWithIntro || step !== 4,
  );
  const [spinnerLabelsRevealed, setSpinnerLabelsRevealed] = useState(
    !startsWithIntro || step !== 5,
  );
  const [leftEventRevealed, setLeftEventRevealed] = useState(!startsWithIntro);
  const [setsRevealed, setSetsRevealed] = useState(!startsWithIntro);
  const [footerRevealed, setFooterRevealed] = useState(!startsWithIntro);
  const [introNudgeDismissed, setIntroNudgeDismissed] = useState(false);
  const correctCardRef = useRef(null);
  const tryAgainRef = useRef(null);
  const introDieRef = useRef(null);
  const introBagRef = useRef(null);
  const introSpinnerRef = useRef(null);
  const introEventBoxRef = useRef(null);
  const leftEventBoxRef = useRef(null);
  const visualCardRef = useRef(null);
  const dieItemRefs = useRef({});
  const activeTweensRef = useRef([]);
  const flyClonesRef = useRef([]);
  const introTargetRef =
    step === 5 ? introSpinnerRef : step === 4 ? introBagRef : introDieRef;

  const clearFlyClones = () => {
    flyClonesRef.current.forEach((node) => {
      if (node && node.parentNode) node.parentNode.removeChild(node);
    });
    flyClonesRef.current = [];
  };

  const killActiveTweens = () => {
    activeTweensRef.current.forEach((tween) => {
      if (tween && typeof tween.kill === "function") tween.kill();
    });
    activeTweensRef.current = [];
    clearFlyClones();
  };

  useEffect(() => () => killActiveTweens(), []);

  useEffect(() => {
    if (step !== 1) return;

    if (initialStage === "final") {
      setClickedId(choiceData.correctId);
      setWrongClicked(true);
      setChoiceComplete(true);
      setNudgeDismissed(true);
      const doneNav =
        questionIndex >= APP_DATA.choiceQuestions.length - 1
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
    killActiveTweens();

    if (initialStage === "final") {
      setEventPhase("play");
      setShowIntroEventBox(false);
      setVisualExpanded(true);
      setRevealedDice(sampleSpace.slice());
      setBagOptionsRevealed(true);
      setSpinnerLabelsRevealed(true);
      setLeftEventRevealed(true);
      setSetsRevealed(true);
      setFooterRevealed(true);
      setSelected(answer.slice());
      setSubmitted(true);
      setIsCorrect(true);
      setIntroNudgeDismissed(true);
      onUpdateNavText(eventData.navNext);
      onSetNextEnabled(true);
      return;
    }

    setSelected([]);
    setSubmitted(false);
    setIsCorrect(false);
    setTryAgainNudgeDismissed(false);
    setIntroNudgeDismissed(false);
    onSetNextEnabled(false);

    if (step === 3 || step === 4 || step === 5 || step === 6) {
      setEventPhase("intro");
      setShowIntroEventBox(true);
      setVisualExpanded(false);
      setRevealedDice([]);
      setBagOptionsRevealed(false);
      setSpinnerLabelsRevealed(false);
      setLeftEventRevealed(false);
      setSetsRevealed(false);
      setFooterRevealed(false);
      onUpdateNavText(eventData.navIntro || eventData.navText);
      return;
    }

    setEventPhase("play");
    setShowIntroEventBox(false);
    setVisualExpanded(true);
    setRevealedDice(sampleSpace.slice());
    setBagOptionsRevealed(true);
    setSpinnerLabelsRevealed(true);
    setLeftEventRevealed(true);
    setSetsRevealed(true);
    setFooterRevealed(true);
    onUpdateNavText(eventData.navText);
  }, [step, initialStage]);

  const handleCardClick = (cardId) => {
    if (step !== 1 || choiceComplete) return;
    if (cardId === clickedId && cardId !== choiceData.correctId) return;

    if (cardId === choiceData.correctId) {
      play("correct");
      setClickedId(cardId);
      setChoiceComplete(true);
      setNudgeDismissed(true);
      const doneNav =
        questionIndex >= APP_DATA.choiceQuestions.length - 1
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
    if (!isEventStep || submitted || eventPhase !== "play") return;
    play("click");
    setSelected((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : sortSelected(prev.concat(value)),
    );
  };

  const setsMatch = (picked, expected) => {
    if (picked.length !== expected.length) return false;
    return expected.every((value) => picked.includes(value));
  };

  const formatOutcome = (value) => {
    const labels = eventData && eventData.outcomeLabels;
    if (labels && Object.prototype.hasOwnProperty.call(labels, value)) {
      return labels[value];
    }
    return String(value);
  };

  const getWrongFeedbackText = () => {
    if (!eventData) return "";
    if (!eventData.wrongFeedbackIncomplete) return eventData.wrongFeedback;
    const hasWrongItem = selected.some((value) => !answer.includes(value));
    return hasWrongItem
      ? eventData.wrongFeedback
      : eventData.wrongFeedbackIncomplete;
  };

  const createFixedClone = (sourceEl, className) => {
    const rect = sourceEl.getBoundingClientRect();
    const styles = window.getComputedStyle(sourceEl);
    const clone = sourceEl.cloneNode(true);
    clone.classList.add("fly-clone", className);
    clone.style.position = "fixed";
    clone.style.left = `${rect.left}px`;
    clone.style.top = `${rect.top}px`;
    clone.style.width = `${rect.width}px`;
    clone.style.height = `${rect.height}px`;
    clone.style.margin = "0";
    clone.style.transform = "none";
    clone.style.zIndex = "20000";
    clone.style.pointerEvents = "none";
    clone.style.fontSize = styles.fontSize;
    clone.style.boxSizing = "border-box";
    document.body.appendChild(clone);
    flyClonesRef.current.push(clone);
    return { clone, rect };
  };

  const finishIntroAnimation = () => {
    setSetsRevealed(true);
    setFooterRevealed(true);
    setEventPhase("play");
    setRevealedDice(sampleSpace.slice());
    setBagOptionsRevealed(true);
    setSpinnerLabelsRevealed(true);
    onUpdateNavText(eventData.navText);
  };

  const flyDiceClones = (startRect) => {
    const values = sampleSpace.slice();
    let remaining = values.length;

    if (!values.length || typeof gsap === "undefined") {
      finishIntroAnimation();
      return;
    }

    values.forEach((value, index) => {
      const destItem = dieItemRefs.current[value];
      const destFace = destItem
        ? destItem.querySelector(".die-face") || destItem
        : null;

      const clone = document.createElement("img");
      clone.src = "assets/5.png";
      clone.alt = "";
      clone.className = "fly-clone fly-die-clone";
      clone.style.position = "fixed";
      clone.style.left = `${startRect.left}px`;
      clone.style.top = `${startRect.top}px`;
      clone.style.width = `${startRect.width}px`;
      clone.style.height = `${startRect.height}px`;
      clone.style.objectFit = "contain";
      clone.style.margin = "0";
      clone.style.zIndex = "20000";
      clone.style.pointerEvents = "none";
      document.body.appendChild(clone);
      flyClonesRef.current.push(clone);

      if (!destFace) {
        remaining -= 1;
        clone.remove();
        setRevealedDice((prev) =>
          prev.includes(value) ? prev : prev.concat(value),
        );
        if (remaining <= 0) finishIntroAnimation();
        return;
      }

      const to = destFace.getBoundingClientRect();
      const tween = gsap.to(clone, {
        left: to.left,
        top: to.top,
        width: to.width,
        height: to.height,
        duration: 0.55,
        delay: index * 0.06,
        ease: "power2.inOut",
        onComplete: () => {
          if (clone.parentNode) clone.parentNode.removeChild(clone);
          flyClonesRef.current = flyClonesRef.current.filter(
            (node) => node !== clone,
          );
          setRevealedDice((prev) =>
            prev.includes(value) ? prev : prev.concat(value),
          );
          remaining -= 1;
          if (remaining <= 0) {
            window.setTimeout(finishIntroAnimation, 180);
          }
        },
      });
      activeTweensRef.current.push(tween);
    });
  };

  const expandDiceAndFly = (startRect) => {
    const card = visualCardRef.current;
    if (!card || typeof gsap === "undefined") {
      setVisualExpanded(true);
      window.requestAnimationFrame(() => flyDiceClones(startRect));
      return;
    }

    const visual = card.parentElement;
    const visualRect = visual
      ? visual.getBoundingClientRect()
      : { width: startRect.cardWidth * 3, height: startRect.cardHeight * 2 };
    const targetW = visualRect.width * 0.75;
    const targetH = visualRect.height * 0.96;

    const tween = gsap.to(card, {
      width: targetW,
      height: targetH,
      duration: 0.45,
      ease: "power2.inOut",
      onComplete: () => {
        const die = introDieRef.current;
        const face = die ? die.querySelector(".intro-die-face") : null;
        const from = (face || die || card).getBoundingClientRect();
        const nextStart = {
          left: from.left,
          top: from.top,
          width: from.width,
          height: from.height,
        };
        setVisualExpanded(true);
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => {
            if (visualCardRef.current) {
              gsap.set(visualCardRef.current, { clearProps: "width,height" });
            }
            flyDiceClones(nextStart);
          });
        });
      },
    });
    activeTweensRef.current.push(tween);
  };

  const expandVisualCard = (endWidthRatio) => {
    const card = visualCardRef.current;
    setBagOptionsRevealed(true);

    if (!card) {
      setVisualExpanded(true);
      finishIntroAnimation();
      return;
    }

    const start = card.getBoundingClientRect();
    const visual = card.parentElement;
    const visualRect = visual ? visual.getBoundingClientRect() : start;
    const endW = visualRect.width * endWidthRatio;
    const endH = visualRect.height * 0.96;

    card.style.width = `${start.width}px`;
    card.style.height = `${start.height}px`;
    setVisualExpanded(true);

    let finished = false;
    const complete = () => {
      if (finished) return;
      finished = true;
      card.removeEventListener("transitionend", onTransitionEnd);
      window.clearTimeout(fallbackId);
      card.style.width = "";
      card.style.height = "";
      finishIntroAnimation();
    };

    const onTransitionEnd = (event) => {
      if (event.target !== card) return;
      if (event.propertyName !== "width" && event.propertyName !== "height")
        return;
      complete();
    };

    card.addEventListener("transitionend", onTransitionEnd);
    const fallbackId = window.setTimeout(complete, 700);

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        card.style.width = `${endW}px`;
        card.style.height = `${endH}px`;
      });
    });
  };

  const expandBagCard = () => expandVisualCard(0.7);
  const expandSpinnerCard = () => expandVisualCard(0.92);

  const startIntroAnimation = () => {
    if (
      eventPhase !== "intro" ||
      (step !== 3 && step !== 4 && step !== 5 && step !== 6)
    )
      return;

    play("click");
    setEventPhase("animating");
    setIntroNudgeDismissed(true);

    const introEvent = introEventBoxRef.current;
    const leftEvent = leftEventBoxRef.current;
    const introDie = introDieRef.current;
    const visualCard = visualCardRef.current;

    const dieRect = introDie ? introDie.getBoundingClientRect() : null;
    const cardRect = visualCard ? visualCard.getBoundingClientRect() : null;
    const startRect = {
      left: dieRect ? dieRect.left : 0,
      top: dieRect ? dieRect.top : 0,
      width: dieRect ? dieRect.width : 0,
      height: dieRect ? dieRect.height : 0,
      cardWidth: cardRect ? cardRect.width : 0,
      cardHeight: cardRect ? cardRect.height : 0,
    };

    const afterEventFly = () => {
      if (step === 4) expandBagCard();
      else if (step === 5) expandSpinnerCard();
      else expandDiceAndFly(startRect);
    };

    if (!introEvent || !leftEvent || typeof gsap === "undefined") {
      setShowIntroEventBox(false);
      setLeftEventRevealed(true);
      afterEventFly();
      return;
    }

    const { clone } = createFixedClone(introEvent, "fly-event-clone");
    setShowIntroEventBox(false);

    const dest = leftEvent.getBoundingClientRect();
    const tween = gsap.to(clone, {
      left: dest.left,
      top: dest.top,
      width: dest.width,
      height: dest.height,
      duration: 0.65,
      ease: "power2.inOut",
      onComplete: () => {
        if (clone.parentNode) clone.parentNode.removeChild(clone);
        flyClonesRef.current = flyClonesRef.current.filter(
          (node) => node !== clone,
        );
        setLeftEventRevealed(true);
        afterEventFly();
      },
    });
    activeTweensRef.current.push(tween);
  };

  const handleSubmit = () => {
    if (
      !isEventStep ||
      submitted ||
      selected.length === 0 ||
      eventPhase !== "play"
    )
      return;

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

  const shouldGlow = (value) => (
    eventPhase === "play" && !submitted && !selected.includes(value)
  );

  const renderSetItems = (values, highlightSelected) => {
    const nodes = [e("span", { className: "set-brace", key: "open" }, "{")];
    values.forEach((value, index) => {
      const selectedClass =
        highlightSelected && selected.includes(value) ? " selected" : "";
      nodes.push(
        e(
          "span",
          {
            className: `set-item${selectedClass}`,
            key: `item-${value}`,
          },
          formatOutcome(value),
        ),
      );
      if (index < values.length - 1) {
        nodes.push(
          e("span", {
            className: "set-comma",
            key: `comma-${value}`,
            dangerouslySetInnerHTML: { __html: html(", ") },
          }),
        );
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
        className:
          `choice-card ${state} ${choiceComplete ? "locked" : ""}`.trim(),
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
    const feedbackType = choiceComplete
      ? "correct"
      : wrongClicked
        ? "incorrect"
        : null;
    const feedbackText = choiceComplete
      ? choiceData.correctFeedback
      : wrongClicked
        ? choiceData.wrongFeedback
        : "";

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
        active:
          step === 1 && wrongClicked && !choiceComplete && !nudgeDismissed,
        onDismiss: () => setNudgeDismissed(true),
      }),
    );
  };

  const renderDiceCard = () => {
    if (!visualExpanded) {
      return e(
        "div",
        { className: "dice-card small", ref: visualCardRef },
        e(
          "button",
          {
            type: "button",
            className: "intro-die",
            ref: introDieRef,
            onClick: startIntroAnimation,
            disabled: eventPhase !== "intro",
          },
          e("img", {
            className: "intro-die-face",
            src: "assets/5.png",
            alt: "6",
            draggable: false,
          }),
        ),
      );
    }

    return e(
      "div",
      { className: "dice-card", ref: visualCardRef },
      sampleSpace.map((value) => {
        const outcomeState = getOutcomeState(value);
        const isHidden = !revealedDice.includes(value);
        const locked = submitted || eventPhase !== "play";
        const glow = !isHidden && shouldGlow(value);
        return e(
          "button",
          {
            type: "button",
            key: `die-${value}`,
            ref: (node) => {
              dieItemRefs.current[value] = node;
            },
            className:
              `die-item ${outcomeState} ${locked ? "locked" : ""} ${isHidden ? "is-hidden" : ""} ${glow ? "can-glow" : ""}`.trim(),
            onClick: () => toggleOutcome(value),
            disabled: locked || isHidden,
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
  };

  const renderBagCard = () => {
    const isIntro = !visualExpanded;
    const locked = submitted || eventPhase !== "play";

    return e(
      "div",
      {
        className: `bag-card ${isIntro ? "small" : ""}`.trim(),
        ref: visualCardRef,
      },
      e("img", {
        className: "bag-card-image",
        ref: introBagRef,
        src: eventData.bagImage,
        alt: "",
        draggable: false,
        onClick:
          isIntro && eventPhase === "intro" ? startIntroAnimation : undefined,
      }),
      e(
        "div",
        { className: "bag-card-options" },
        eventData.bagOptions.map((option) => {
          const outcomeState = getOutcomeState(option.id);
          const glow = bagOptionsRevealed && shouldGlow(option.id);
          return e(
            "button",
            {
              type: "button",
              key: `bag-${option.id}`,
              className:
                `bag-option ${outcomeState} ${locked ? "locked" : ""} ${glow ? "can-glow" : ""}`.trim(),
              onClick: () => toggleOutcome(option.id),
              disabled: locked || !bagOptionsRevealed,
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
  };

  const renderSpinnerCard = () => {
    const isIntro = !visualExpanded;
    const showLabels = spinnerLabelsRevealed;
    const locked = submitted || eventPhase !== "play";
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
    const arrowLeft = spinnerPolar(
      cx,
      cy,
      arrowBaseR,
      arrowAngleDeg - arrowHeadSpread,
    );
    const arrowRight = spinnerPolar(
      cx,
      cy,
      arrowBaseR,
      arrowAngleDeg + arrowHeadSpread,
    );
    const arrowLineEnd = spinnerPolar(cx, cy, arrowBaseR - 0.8, arrowAngleDeg);

    return e(
      "div",
      {
        className:
          `spinner-card ${isIntro ? "small" : ""} ${showLabels ? "" : "hide-labels"}`.trim(),
        ref: (node) => {
          visualCardRef.current = node;
          introSpinnerRef.current = node;
        },
        onClick:
          isIntro && eventPhase === "intro" ? startIntroAnimation : undefined,
      },
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
          const startAngle =
            index * (360 / sectorCount) - 360 / sectorCount / 2;
          const endAngle = startAngle + 360 / sectorCount;
          const midAngle = startAngle + 360 / sectorCount / 2;
          const labelPos = spinnerPolar(cx, cy, 58, midAngle);
          const outcomeState = getOutcomeState(value);
          const glow = showLabels && shouldGlow(value);

          return e(
            "g",
            { key: `spinner-sector-${value}` },
            e("path", {
              d: spinnerSectorPath(
                cx,
                cy,
                innerR,
                outerR,
                startAngle,
                endAngle,
              ),
              className:
                `spinner-sector ${outcomeState} ${locked ? "locked" : ""}`.trim(),
              onClick: locked
                ? undefined
                : (event) => {
                    event.stopPropagation();
                    toggleOutcome(value);
                  },
            }),
            e(
              "text",
              {
                x: labelPos.x,
                y: labelPos.y,
                className: `spinner-label ${glow ? "can-glow" : ""}`.trim(),
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

  const renderEventBoxContent = () => [
    e("div", {
      className: "event-label",
      key: "label",
      dangerouslySetInnerHTML: { __html: html(common.eventLabel) },
    }),
    e("div", {
      className: "event-text",
      key: "text",
      dangerouslySetInnerHTML: { __html: html(eventData.eventText) },
    }),
  ];

  const renderEventStep = () => {
    const eState = submitted ? (isCorrect ? "correct" : "incorrect") : "";
    const footerDisabled = submitted ? isCorrect : selected.length === 0;
    const footerLabel =
      submitted && !isCorrect ? common.tryAgain : common.submit;
    const inIntro = eventPhase === "intro" || eventPhase === "animating";
    const hasIntro = step === 3 || step === 4 || step === 5 || step === 6;
    const showIntroVisual = hasIntro && !visualExpanded;
    const keepIntroLayout = hasIntro && eventPhase !== "play";
    const footerHidden = hasIntro && !footerRevealed;

    return e(
      "div",
      { className: "main-canvas-container" },
      e(
        LeftPanel,
        { className: `event-layout ${inIntro ? "is-intro" : ""}`.trim() },
        e(
          "div",
          {
            className:
              `info-box event-box ${leftEventRevealed ? "is-revealed" : ""}`.trim(),
            ref: leftEventBoxRef,
          },
          renderEventBoxContent(),
        ),
        e(
          "div",
          {
            className:
              `set-row s-row ${setsRevealed ? "is-revealed" : ""}`.trim(),
          },
          e("span", { className: "set-lhs" }, eventData.sampleLabel),
          e("span", { className: "set-eq" }, "="),
          e(
            "span",
            { className: "set-rhs" },
            renderSetItems(sampleSpace, true),
          ),
        ),
        e(
          "div",
          {
            className:
              `set-row e-row ${eState} ${setsRevealed ? "is-revealed" : ""}`.trim(),
          },
          e("span", { className: "set-lhs" }, eventData.eventSetLabel),
          e("span", { className: "set-eq" }, "="),
          e("span", { className: "set-rhs" }, renderSetItems(selected, true)),
        ),
        e(
          "div",
          { className: "event-feedback-slot" },
          submitted && eventPhase === "play"
            ? e("div", {
                className: `feedback-box ${isCorrect ? "correct" : "incorrect"}`,
                dangerouslySetInnerHTML: {
                  __html: html(
                    isCorrect
                      ? eventData.correctFeedback
                      : getWrongFeedbackText(),
                  ),
                },
              })
            : null,
        ),
      ),
      e(
        RightPanel,
        {
          className: keepIntroLayout ? "has-intro" : "",
          titleLabel: common.experimentLabel,
          titleValue: eventData.titleValue,
          visualClassName: keepIntroLayout ? "intro-visual" : "",
          footerClassName: footerHidden ? "is-hidden" : "",
          footer: e(
            "button",
            {
              type: "button",
              ref: submitted && !isCorrect ? tryAgainRef : undefined,
              className: "btn",
              disabled: footerDisabled || eventPhase !== "play",
              onClick: submitted && !isCorrect ? handleTryAgain : handleSubmit,
            },
            footerLabel,
          ),
        },
        (step === 3 || step === 6) && showIntroVisual
          ? renderDiceCard()
          : renderEventVisual(),
        showIntroVisual && showIntroEventBox
          ? e(
              "div",
              {
                className: "info-box event-box intro-event-box",
                ref: introEventBoxRef,
              },
              renderEventBoxContent(),
            )
          : null,
      ),
      e(Nudge, {
        targetRef: introTargetRef,
        active: hasIntro && eventPhase === "intro" && !introNudgeDismissed,
        onDismiss: () => setIntroNudgeDismissed(true),
      }),
      e(Nudge, {
        targetRef: tryAgainRef,
        active:
          submitted &&
          !isCorrect &&
          eventPhase === "play" &&
          !tryAgainNudgeDismissed,
        onDismiss: () => setTryAgainNudgeDismissed(true),
      }),
    );
  };

  if (isEventStep) return renderEventStep();
  return renderChoiceStep();
};
