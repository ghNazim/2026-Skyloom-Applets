const POUR_DURATION = 1.7;
const EMPTY_DURATION = 0.9;
const CUP_FLIGHT_DURATION = 1.17; // 0.9 * 1.3
const POST_POUR_PAUSE_MS = 700;
const POST_FEEDBACK_PAUSE_MS = 2000;
const POST_CARD_ADVANCE_MS = 2500;

/** Width (vw) of the full-size 1-cup image in the visual column. */
const CUP_VISUAL_BASE_WIDTH = 17;

const FULL_TICKS = [0, 0.25, 1 / 3, 0.5, 1];

/** Meter ticks revealed before and after the pour of each step. */
const POUR_TICKS = {
  1: { before: [0, 1], after: [0, 1] },
  2: { before: [0, 1], after: [0, 0.5, 1] },
  3: { before: [0, 0.5, 1], after: [0, 1 / 3, 0.5, 1] },
};

const COMPARE_DENOMINATORS = [3, 4];
const COMPARE_CORRECT_DENOMINATOR = 3;
const COMPARE_BASE_TICKS = [0, 1 / 3, 0.5, 1];
const COMPARE_FOURTH_TICKS = [0, 0.25, 1 / 3, 0.5, 1];

const ESTIMATE_FIRST_STEP = 7;
const ESTIMATE_LAST_STEP = 9;

const DENOMINATOR_LEVEL = {
  1: 1,
  2: 0.5,
  3: 1 / 3,
  4: 0.25,
};

/**
 * Final (completed) stage snapshot for a step — animations done,
 * interactions finished, correct outcome visible.
 */
function getFinalStage(step) {
  const config = (typeof APP_DATA !== "undefined" && APP_DATA.steps[step]) || {};

  if (step === 1) {
    return {
      poured: true,
      showFillText: true,
      cupHidden: true,
      isBusy: true,
      guess: 0,
      guessArmed: false,
      hasGuessed: false,
      guessHidden: true,
      cardsVisible: 1,
      wrongPick: null,
      isAnswered: false,
      estimateWrongPick: null,
      estimateFeedback: null,
      isEstimateAnswered: false,
    };
  }

  if (step === 2) {
    return {
      poured: true,
      showFillText: true,
      cupHidden: true,
      isBusy: true,
      guess: 0.5,
      guessArmed: false,
      hasGuessed: true,
      guessHidden: true,
      cardsVisible: 2,
      wrongPick: null,
      isAnswered: false,
      estimateWrongPick: null,
      estimateFeedback: null,
      isEstimateAnswered: false,
    };
  }

  if (step === 3) {
    return {
      poured: true,
      showFillText: true,
      cupHidden: true,
      isBusy: true,
      guess: 1 / 3,
      guessArmed: false,
      hasGuessed: true,
      guessHidden: true,
      cardsVisible: 3,
      wrongPick: null,
      isAnswered: false,
      estimateWrongPick: null,
      estimateFeedback: null,
      isEstimateAnswered: false,
    };
  }

  if (step === 4) {
    return {
      poured: false,
      showFillText: false,
      cupHidden: false,
      isBusy: false,
      guess: 0,
      guessArmed: false,
      hasGuessed: false,
      guessHidden: true,
      cardsVisible: 3,
      wrongPick: null,
      isAnswered: true,
      estimateWrongPick: null,
      estimateFeedback: null,
      isEstimateAnswered: false,
    };
  }

  if (step === 5) {
    return {
      poured: true,
      showFillText: true,
      cupHidden: true,
      isBusy: true,
      guess: 0,
      guessArmed: false,
      hasGuessed: false,
      guessHidden: true,
      cardsVisible: 4,
      wrongPick: null,
      isAnswered: false,
      estimateWrongPick: null,
      estimateFeedback: null,
      isEstimateAnswered: false,
    };
  }

  if (step >= ESTIMATE_FIRST_STEP && step <= ESTIMATE_LAST_STEP) {
    return {
      poured: false,
      showFillText: false,
      cupHidden: false,
      isBusy: false,
      guess: 0,
      guessArmed: false,
      hasGuessed: false,
      guessHidden: true,
      cardsVisible: 4,
      wrongPick: null,
      isAnswered: false,
      estimateWrongPick: null,
      estimateFeedback: "correct",
      isEstimateAnswered: true,
      correctDenominator: config.correctDenominator || 2,
    };
  }

  return {
    poured: false,
    showFillText: false,
    cupHidden: false,
    isBusy: false,
    guess: 0,
    guessArmed: false,
    hasGuessed: false,
    guessHidden: true,
    cardsVisible: 0,
    wrongPick: null,
    isAnswered: false,
    estimateWrongPick: null,
    estimateFeedback: null,
    isEstimateAnswered: false,
  };
}

function buildCountCards(upTo) {
  const list = [];
  for (let i = 1; i <= upTo; i += 1) {
    list.push({ denominator: i, count: i });
  }
  return list;
}

const MainCanvas = ({
  step,
  stageMode = "play",
  onSetNextEnabled,
  onUpdateNav,
  onAdvance,
  onStepCompleted,
  onHideNudge,
  onShowNudgeAtElement,
}) => {
  const { useState, useEffect, useLayoutEffect, useRef, useCallback } = React;
  const h = React.createElement;
  const isCompletedView = stageMode === "completed";

  const [poured, setPoured] = useState(false);
  const [showFillText, setShowFillText] = useState(false);
  const [cupHidden, setCupHidden] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [guess, setGuess] = useState(0);
  const [guessArmed, setGuessArmed] = useState(false);
  const [hasGuessed, setHasGuessed] = useState(false);
  const [guessHidden, setGuessHidden] = useState(false);
  const [cardsVisible, setCardsVisible] = useState(0);
  const [wrongPick, setWrongPick] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [estimateWrongPick, setEstimateWrongPick] = useState(null);
  const [estimateFeedback, setEstimateFeedback] = useState(null);
  const [isEstimateAnswered, setIsEstimateAnswered] = useState(false);

  const cupImgRef = useRef(null);
  const pendingCupRef = useRef(null);
  const timersRef = useRef([]);
  const flightRef = useRef({ clone: null, tween: null });
  const stepRef = useRef(step);
  stepRef.current = step;

  const playSnd = (name) => {
    if (typeof playSound === "function") playSound(name);
  };

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  const addTimer = useCallback((delay, fn) => {
    const id = window.setTimeout(fn, delay);
    timersRef.current.push(id);
    return id;
  }, []);

  const clearFlight = useCallback(() => {
    const flight = flightRef.current;
    if (flight.tween) {
      flight.tween.kill();
      flight.tween = null;
    }
    if (flight.clone && flight.clone.parentNode) {
      flight.clone.parentNode.removeChild(flight.clone);
    }
    flight.clone = null;
  }, []);

  const applyStageState = useCallback((stage) => {
    setPoured(!!stage.poured);
    setShowFillText(!!stage.showFillText);
    setCupHidden(!!stage.cupHidden);
    setIsBusy(!!stage.isBusy);
    setGuess(stage.guess || 0);
    setGuessArmed(!!stage.guessArmed);
    setHasGuessed(!!stage.hasGuessed);
    setGuessHidden(!!stage.guessHidden);
    setCardsVisible(stage.cardsVisible || 0);
    setWrongPick(stage.wrongPick);
    setIsAnswered(!!stage.isAnswered);
    setEstimateWrongPick(stage.estimateWrongPick);
    setEstimateFeedback(stage.estimateFeedback);
    setIsEstimateAnswered(!!stage.isEstimateAnswered);
  }, []);

  const finishCardAnimation = useCallback(() => {
    const current = stepRef.current;
    setGuessHidden(true);
    setCardsVisible(current === 5 ? 4 : current);
    if (typeof onStepCompleted === "function") onStepCompleted(current);
    if (current === 5) {
      onUpdateNav(APP_DATA.steps[5].navDone);
      onSetNextEnabled(true);
      addTimer(400, () => onShowNudgeAtElement("next-button", "tap"));
      return;
    }
    addTimer(POST_CARD_ADVANCE_MS, () => onAdvance());
  }, [addTimer, onAdvance, onSetNextEnabled, onShowNudgeAtElement, onStepCompleted, onUpdateNav]);

  const flyCupToCard = useCallback(() => {
    const source = cupImgRef.current;
    const target = pendingCupRef.current;
    if (!source || !target || typeof gsap === "undefined") {
      setCupHidden(true);
      finishCardAnimation();
      return;
    }

    const from = source.getBoundingClientRect();
    const to = target.getBoundingClientRect();
    const clone = source.cloneNode(true);
    clone.removeAttribute("id");
    clone.className = "cup-flight-clone";
    clone.style.left = from.left + "px";
    clone.style.top = from.top + "px";
    clone.style.width = from.width + "px";
    clone.style.height = from.height + "px";
    document.body.appendChild(clone);
    flightRef.current.clone = clone;
    setCupHidden(true);

    flightRef.current.tween = gsap.to(clone, {
      left: to.left,
      top: to.top,
      width: to.width,
      height: to.height,
      duration: CUP_FLIGHT_DURATION,
      ease: "power2.inOut",
      onComplete: () => {
        clearFlight();
        finishCardAnimation();
      },
    });
  }, [clearFlight, finishCardAnimation]);

  useLayoutEffect(() => {
    clearTimers();
    clearFlight();
    onHideNudge();

    if (isCompletedView) {
      applyStageState(getFinalStage(step));
      onUpdateNav(APP_DATA.completedNav || "Tap \u00BB to go next");
      onSetNextEnabled(true);
      addTimer(400, () => onShowNudgeAtElement("next-button", "tap"));
      return undefined;
    }

    setPoured(false);
    setShowFillText(false);
    setCupHidden(false);
    setIsBusy(false);
    setGuess(0);
    setGuessArmed(false);
    setHasGuessed(false);
    setGuessHidden(false);
    setWrongPick(null);
    setIsAnswered(false);
    setEstimateWrongPick(null);
    setEstimateFeedback(null);
    setIsEstimateAnswered(false);
    setCardsVisible(step === 5 ? 3 : Math.max(0, Math.min(step, 4) - 1));
    onSetNextEnabled(false);

    const config = APP_DATA.steps[step];
    if (!config) return undefined;
    onUpdateNav(config.navText || "");

    if (step === 1) {
      addTimer(700, () => onShowNudgeAtElement("cup-tap-target", "tap"));
    } else if (step === 2 || step === 3) {
      addTimer(EMPTY_DURATION * 1000, () => setGuessArmed(true));
      addTimer(EMPTY_DURATION * 1000 + 250, () => onShowNudgeAtElement("guess-pointer", "drag"));
    } else if (step === 5) {
      setShowFillText(true);
      addTimer(POST_FEEDBACK_PAUSE_MS, flyCupToCard);
    }
    return undefined;
  }, [
    step,
    stageMode,
    isCompletedView,
    addTimer,
    applyStageState,
    clearFlight,
    clearTimers,
    flyCupToCard,
    onHideNudge,
    onSetNextEnabled,
    onShowNudgeAtElement,
    onUpdateNav,
  ]);

  useEffect(
    () => () => {
      clearTimers();
      clearFlight();
    },
    [clearTimers, clearFlight],
  );

  const config = APP_DATA.steps[step] || {};
  const isCompare = step === 4;
  const isQuarterReveal = step === 5;
  const isEstimate = step >= ESTIMATE_FIRST_STEP && step <= ESTIMATE_LAST_STEP;
  const estimateCorrectDenominator = config.correctDenominator || 2;
  const estimateWaterLevel = config.waterLevel ?? 0.6;
  const denominator = config.denominator || 1;
  const cupScale = CUP_SIZE_SCALE[denominator] || 1;
  const cupSymbol = CUP_SYMBOLS[denominator] || String(denominator);
  const needsGuess = step === 2 || step === 3;
  const tickSet = POUR_TICKS[step] || POUR_TICKS[1];
  const ticks = poured ? tickSet.after : tickSet.before;
  const showGuess = needsGuess && guessArmed && !guessHidden;
  const isCupClickable =
    !isCompletedView && !isBusy && !poured && !cupHidden && (!needsGuess || hasGuessed);
  const glassFillDuration = isCompletedView
    ? 0
    : isQuarterReveal
      ? 0
      : poured
        ? POUR_DURATION
        : EMPTY_DURATION;

  const cards = isEstimate
    ? buildCountCards(4)
    : isCompare || isQuarterReveal
      ? buildCountCards(isQuarterReveal ? 4 : 3)
      : buildCountCards(Math.min(step, 3));

  const countVisible = isEstimate
    ? 4
    : isCompare
      ? 3
      : isQuarterReveal
        ? cardsVisible
        : cardsVisible;

  const handleGuessChange = useCallback((value) => {
    setGuess(value);
  }, []);

  const handleGuessRelease = useCallback(() => {
    setHasGuessed(true);
    onHideNudge();
    const stepConfig = APP_DATA.steps[stepRef.current];
    if (stepConfig) onUpdateNav(stepConfig.navPour);
    addTimer(300, () => onShowNudgeAtElement("cup-tap-target", "tap"));
  }, [addTimer, onHideNudge, onShowNudgeAtElement, onUpdateNav]);

  const handleCupClick = () => {
    if (!isCupClickable) return;
    onHideNudge();
    playSnd("click");
    playSnd("fill");
    setIsBusy(true);
    setPoured(true);
    onUpdateNav("");
    addTimer(POUR_DURATION * 1000 + POST_POUR_PAUSE_MS, () => {
      setShowFillText(true);
      addTimer(POST_FEEDBACK_PAUSE_MS, flyCupToCard);
    });
  };

  const handleCompareClick = (value) => {
    if (isCompletedView || isAnswered) return;
    onHideNudge();
    if (value !== COMPARE_CORRECT_DENOMINATOR) {
      playSnd("wrong");
      setWrongPick(value);
      return;
    }
    playSnd("correct");
    playSnd("fill");
    setWrongPick(null);
    setIsAnswered(true);
    if (typeof onStepCompleted === "function") onStepCompleted(4);
    onUpdateNav(APP_DATA.steps[4].navDone);
    onSetNextEnabled(true);
    addTimer(400, () => onShowNudgeAtElement("next-button", "tap"));
  };

  const handleEstimateSelect = (denominatorValue) => {
    if (isCompletedView || isEstimateAnswered) return;
    onHideNudge();
    const stepConfig = APP_DATA.steps[stepRef.current];
    if (denominatorValue !== stepConfig.correctDenominator) {
      playSnd("wrong");
      setEstimateWrongPick(denominatorValue);
      setEstimateFeedback("wrong");
      return;
    }
    playSnd("correct");
    setEstimateWrongPick(null);
    setEstimateFeedback("correct");
    setIsEstimateAnswered(true);
    if (typeof onStepCompleted === "function") onStepCompleted(stepRef.current);
    onUpdateNav(stepConfig.navDone);
    onSetNextEnabled(true);
    addTimer(400, () => onShowNudgeAtElement("next-button", "tap"));
  };

  const renderPourView = () =>
    h(
      "div",
      { className: "cup-visual-split" },
      h(
        "div",
        { className: "cup-visual-left" },
        h(Glass, {
          fill: isQuarterReveal ? 0.25 : poured ? 1 / denominator : 0,
          fillDuration: glassFillDuration,
          ticks: isQuarterReveal ? FULL_TICKS : ticks,
          unitLabel: APP_DATA.meterUnit,
          showGuess: showGuess,
          guess: guess,
          guessLabel: hasGuessed ? APP_DATA.guessLabel : null,
          guessPointerId: "guess-pointer",
          onGuessChange: handleGuessChange,
          onGuessRelease: handleGuessRelease,
        }),
      ),
      h(
        "div",
        { className: "cup-visual-right" },
        h("div", {
          className: "cup-fill-text" + (showFillText ? " visible" : ""),
          dangerouslySetInnerHTML: { __html: config.fillText || "" },
        }),
        h(
          "div",
          { className: "cup-slot" },
          cupHidden
            ? null
            : h(
                "div",
                {
                  className:
                    "cup-label-visual" + (isCupClickable && !isQuarterReveal ? " tappable" : ""),
                  onClick: isQuarterReveal ? undefined : handleCupClick,
                },
                h("img", {
                  id: isQuarterReveal ? undefined : "cup-tap-target",
                  ref: cupImgRef,
                  className: "cup-visual-img",
                  src: "assets/cup.png",
                  alt: "",
                  style: { width: CUP_VISUAL_BASE_WIDTH * cupScale + "vw" },
                }),
                h(
                  "div",
                  { className: "cup-visual-label" },
                  h("span", { className: "cup-visual-symbol" }, cupSymbol),
                  h("span", { className: "cup-visual-unit" }, APP_DATA.cupUnit),
                ),
              ),
        ),
      ),
    );

  const renderCompareButton = (value) => {
    const isCorrectOption = value === COMPARE_CORRECT_DENOMINATOR;
    let stateClass = "";
    if (isAnswered) stateClass = isCorrectOption ? " correct" : " wrong";
    else if (wrongPick === value) stateClass = " picked-wrong";

    return h(
      "button",
      {
        key: "compare-button-" + value,
        id: "compare-button-" + value,
        className: "compare-button" + stateClass,
        onClick: () => handleCompareClick(value),
        disabled: isAnswered || isCompletedView,
      },
      h(
        "span",
        { className: "compare-label" },
        h("span", { className: "compare-symbol" }, CUP_SYMBOLS[value]),
        h("span", { className: "compare-unit" }, APP_DATA.cupUnit),
      ),
    );
  };

  const renderCompareGlass = (value) =>
    h(
      "div",
      {
        key: "compare-glass-" + value,
        id: "compare-glass-" + value,
        className:
          "compare-glass-cell" + (!isAnswered && !isCompletedView ? " clickable" : ""),
        onClick:
          isAnswered || isCompletedView ? undefined : () => handleCompareClick(value),
        role: isAnswered || isCompletedView ? undefined : "button",
        tabIndex: isAnswered || isCompletedView ? undefined : 0,
        onKeyDown:
          isAnswered || isCompletedView
            ? undefined
            : (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleCompareClick(value);
                }
              },
      },
      h(Glass, {
        fill: isAnswered ? 1 / value : 0,
        fillDuration: isCompletedView ? 0 : POUR_DURATION,
        ticks: value === 4 && isAnswered ? COMPARE_FOURTH_TICKS : COMPARE_BASE_TICKS,
        unitLabel: APP_DATA.meterUnit,
      }),
    );

  const renderCompareView = () => {
    const compareConfig = APP_DATA.steps[4];
    const feedback = isAnswered
      ? { type: "correct", text: compareConfig.correctFeedback }
      : wrongPick !== null
        ? { type: "wrong", text: compareConfig.wrongFeedback }
        : null;

    return h(
      "div",
      { className: "compare-view" },
      h(
        "div",
        { className: "compare-grid" },
        renderCompareGlass(COMPARE_DENOMINATORS[0]),
        h("div", { className: "compare-gap-cell" }),
        renderCompareGlass(COMPARE_DENOMINATORS[1]),
        renderCompareButton(COMPARE_DENOMINATORS[0]),
        h(
          "div",
          { className: "compare-operator" + (isAnswered ? " visible" : "") },
          ">",
        ),
        renderCompareButton(COMPARE_DENOMINATORS[1]),
      ),
      h(
        "div",
        { className: "compare-feedback-slot" },
        h("div", {
          className: "compare-feedback" + (feedback ? " visible " + feedback.type : ""),
          dangerouslySetInnerHTML: { __html: feedback ? feedback.text : "" },
        }),
      ),
    );
  };

  const renderEstimateView = () => {
    const estimateConfig = APP_DATA.steps[step];
    const pickedDenominator = isEstimateAnswered
      ? estimateCorrectDenominator
      : estimateWrongPick;
    const pickedLevel =
      pickedDenominator === null ? null : DENOMINATOR_LEVEL[pickedDenominator];
    const feedbackText =
      estimateFeedback === "correct"
        ? estimateConfig.correctFeedback
        : estimateFeedback === "wrong"
          ? estimateConfig.wrongFeedback
          : "";

    return h(
      "div",
      { className: "estimate-view" },
      h(
        "div",
        { className: "estimate-glass-col" },
        h("div", { className: "estimate-title" }, estimateConfig.needsTitle),
        h(Glass, {
          fill: estimateWaterLevel,
          fillDuration: 0,
          ticks: FULL_TICKS,
          unitLabel: APP_DATA.meterUnit,
          benchmarkPick: pickedLevel,
          feedbackMode: estimateFeedback,
          highlightNearWater: false,
        }),
      ),
      h(
        "div",
        { className: "estimate-feedback-col" },
        h("div", {
          className:
            "estimate-feedback" + (estimateFeedback ? " visible " + estimateFeedback : ""),
          dangerouslySetInnerHTML: { __html: feedbackText },
        }),
      ),
    );
  };

  const stageClass =
    "cup-stage" + (isEstimate ? " cup-stage-estimate" : "");

  return h(
    "div",
    { className: stageClass },
    h(
      "div",
      { className: "cup-visual-panel" },
      isEstimate ? renderEstimateView() : isCompare ? renderCompareView() : renderPourView(),
    ),
    isEstimate
      ? h(
          "div",
          { className: "cup-count-column cup-select-column" },
          h(CupSelectPanel, {
            selectedDenominator: isEstimateAnswered ? estimateCorrectDenominator : null,
            wrongDenominator: estimateWrongPick,
            isAnswered: isEstimateAnswered,
            correctDenominator: estimateCorrectDenominator,
            onSelect: handleEstimateSelect,
          }),
        )
      : h(
          "div",
          { className: "cup-count-column" },
          h(CountPanel, {
            title: APP_DATA.count.title,
            cards: cards,
            visibleCount: countVisible,
            pendingCupRef: pendingCupRef,
          }),
        ),
  );
};
