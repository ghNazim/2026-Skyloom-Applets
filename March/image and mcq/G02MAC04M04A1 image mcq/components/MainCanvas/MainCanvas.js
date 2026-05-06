const MainCanvas = ({
  step,
  questionIndex,
  onSetNextEnabled,
  onNavAfterAnswer,
  onStart,
}) => {
  const { useState, useEffect, useRef } = React;

  const questions = APP_DATA.questions;
  const introImageSrc =
    questions.length > 0 ? questions[0].img : "assets/one.png";

  const [selIndex, setSelIndex] = useState(null);
  const [correct, setCorrect] = useState(false);
  const [shake, setShake] = useState(false);

  const dashRef = useRef(null);
  const optionRefs = useRef([]);

  const q =
    step === 2 && questions[questionIndex]
      ? questions[questionIndex]
      : null;

  const setOptionRef = (el, index) => {
    optionRefs.current[index] = el;
  };

  useEffect(() => {
    setSelIndex(null);
    setCorrect(false);
    setShake(false);
    optionRefs.current = [];
    if (typeof onSetNextEnabled === "function") onSetNextEnabled(false);
  }, [step, questionIndex, onSetNextEnabled]);

  const runCorrectFlyAnimation = (dashEl, sourceBtn, answerText, onDone) => {
    const from = sourceBtn.getBoundingClientRect();
    const to = dashEl.getBoundingClientRect();

    const applyAnswerToDash = () => {
      if (typeof handleComma === "function" && current_language === "id") {
        dashEl.innerHTML = handleComma(answerText);
      } else {
        dashEl.textContent = answerText;
      }
      dashEl.classList.add("filled", "sparkle-on");
    };

    const finishSparkleAndDone = () => {
      dashEl.classList.remove("sparkle-on");
      onDone();
    };

    const fly = document.createElement("div");
    fly.className = "mcq-answer-fly-clone";
    fly.textContent = answerText;
    const cs = window.getComputedStyle(sourceBtn);
    fly.style.fontFamily = cs.fontFamily;
    fly.style.fontSize = cs.fontSize;
    fly.style.fontWeight = cs.fontWeight;
    fly.style.color = "#ffffff";

    const startX = from.left + from.width / 2;
    const startY = from.top + from.height / 2;
    const endX = to.left + to.width / 2;
    const endY = to.top + to.height / 2;

    document.body.appendChild(fly);

    if (typeof gsap !== "undefined") {
      const tween = gsap.fromTo(
        fly,
        {
          position: "fixed",
          left: startX,
          top: startY,
          xPercent: -50,
          yPercent: -50,
          zIndex: 10000,
          pointerEvents: "none",
        },
        {
          duration: 0.75,
          left: endX,
          top: endY,
          xPercent: -50,
          yPercent: -50,
          scale: 0.92,
          ease: "power2.inOut",
          onComplete: () => {
            fly.remove();
            applyAnswerToDash();
            setTimeout(finishSparkleAndDone, 900);
          },
        }
      );
      return tween;
    }

    Object.assign(fly.style, {
      position: "fixed",
      left: `${startX}px`,
      top: `${startY}px`,
      transform: "translate(-50%, -50%)",
      zIndex: "10000",
      pointerEvents: "none",
    });
    const wanim = fly.animate(
      [
        {
          left: `${startX}px`,
          top: `${startY}px`,
          transform: "translate(-50%, -50%) scale(1)",
        },
        {
          left: `${endX}px`,
          top: `${endY}px`,
          transform: "translate(-50%, -50%) scale(0.92)",
        },
      ],
      {
        duration: 750,
        easing: "cubic-bezier(0.45, 0, 0.55, 1)",
        fill: "forwards",
      }
    );
    wanim.onfinish = () => {
      fly.remove();
      applyAnswerToDash();
      setTimeout(finishSparkleAndDone, 900);
    };
    return wanim;
  };

  useEffect(() => {
    if (!correct || !q || selIndex !== q.ans) return;

    let cancelled = false;
    let activeAnim = null;

    const enableNextAndNav = () => {
      if (cancelled) return;
      if (typeof onSetNextEnabled === "function") onSetNextEnabled(true);
      const isLast = questionIndex >= questions.length - 1;
      if (typeof onNavAfterAnswer === "function") {
        onNavAfterAnswer(isLast);
      }
    };

    const run = () => {
      if (cancelled) return;
      const dashEl = dashRef.current;
      const srcBtn = optionRefs.current[q.ans];
      const answerText = String(q.options[q.ans]);

      if (!dashEl || !srcBtn) {
        enableNextAndNav();
        return;
      }

      activeAnim = runCorrectFlyAnimation(dashEl, srcBtn, answerText, () => {
        if (cancelled) return;
        enableNextAndNav();
      });
    };

    const id = requestAnimationFrame(() => {
      requestAnimationFrame(run);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(id);
      if (activeAnim && typeof activeAnim.kill === "function") {
        activeAnim.kill();
      } else if (activeAnim && typeof activeAnim.cancel === "function") {
        activeAnim.cancel();
      }
    };
  }, [
    correct,
    q,
    selIndex,
    questionIndex,
    questions.length,
    onSetNextEnabled,
    onNavAfterAnswer,
  ]);

  const handleOptionClick = (optionIndex) => {
    if (!q || correct) return;
    setSelIndex(optionIndex);

    if (optionIndex === q.ans) {
      setCorrect(true);
      if (typeof playSound === "function") playSound("correct");
    } else {
      if (typeof playSound === "function") playSound("wrong");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const showFeedbackImage =
    step === 2 && q && selIndex !== null && q.feedbackImage;
  const sceneSrc =
    showFeedbackImage && q.feedbackImage
      ? q.feedbackImage
      : step === 2 && q
        ? q.img
        : introImageSrc;

  const leftPanel = React.createElement(
    "div",
    { className: "canvas-left-panel" },
    React.createElement(
      "div",
      { className: "canvas-image-wrap" },
      React.createElement("img", {
        className: "canvas-scene-image",
        src: sceneSrc,
        alt: "",
      })
    )
  );

  let rightContent = null;

  if (step === 1) {
    rightContent = React.createElement(
      "div",
      { className: "right-panel-center" },
      React.createElement(
        "button",
        {
          className: "action-btn start-intro-btn",
          type: "button",
          onClick: onStart,
        },
        APP_DATA.steps[1].startButton
      )
    );
  } else if (step === 2 && q) {
    rightContent = React.createElement(MCQPanel, {
      mcqData: {
        title: q.title,
        options: q.options,
      },
      selectedIndex: selIndex,
      selectionByIndex: true,
      isCorrect: correct,
      onOptionClick: handleOptionClick,
      suppressFeedbackText: true,
      shake: shake,
      dashRef: dashRef,
      setOptionRef: setOptionRef,
    });
  }

  const rightPanel = React.createElement(
    "div",
    { className: "canvas-right-panel" },
    rightContent
  );

  return React.createElement(
    "div",
    { className: "main-canvas-container" },
    leftPanel,
    rightPanel
  );
};
