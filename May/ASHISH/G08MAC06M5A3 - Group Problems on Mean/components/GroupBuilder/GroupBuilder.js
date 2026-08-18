const toVw = (value) => `${(value / window.innerWidth) * 100}vw`;
const toVh = (value) => `${(value / window.innerHeight) * 100}vh`;

const CoinStack = ({ amount, delay = 0, animate = true, className = "" }) => React.createElement(
  "span",
  { className: `coin-stack ${className}` },
  Array.from({ length: amount }, (_, index) => React.createElement("img", {
    key: index,
    className: `coin-stack__coin ${animate ? "coin-stack__coin--pile-in" : "coin-stack__coin--no-anim"}`,
    src: "./assets/coin.png",
    alt: "",
    style: {
      "--coin-index": index,
      "--coin-delay": `${delay + index * 70}ms`,
      "--coin-nudge": `${index % 2 ? 0.08 : -0.08}vw`,
    },
  }))
);

const getPoolStackOrigin = (stackIdx) => {
  try {
    const isGroupA = stackIdx < 2;
    const sourceIndex = stackIdx % 2;
    const selector = isGroupA ? ".story-group--a .pile-card .coin-stack" : ".story-group--b .pile-card .coin-stack";
    const sourceStacks = document.querySelectorAll(selector);
    const poolStacks = document.querySelectorAll(".coin-total-pool .coin-stack");
    if (sourceStacks[sourceIndex] && poolStacks[stackIdx]) {
      const groupRect = sourceStacks[sourceIndex].getBoundingClientRect();
      const stackRect = poolStacks[stackIdx].getBoundingClientRect();
      return {
        x: toVw(groupRect.left + groupRect.width / 2 - (stackRect.left + stackRect.width / 2)),
        y: toVh(groupRect.top + groupRect.height / 2 - (stackRect.top + stackRect.height / 2)),
      };
    }
  } catch (_) {}
  return { x: stackIdx < 2 ? "-48vw" : "-22vw", y: "-25vh" };
};

const getCoinFlyOffset = (arrivalStep, slotIndex) => {
  try {
    const sourcePoolStackIdx = Math.floor((23 - arrivalStep) / 6);
    const poolStacks = document.querySelectorAll(".coin-total-pool .coin-stack");
    const slots = document.querySelectorAll(".count-slot");
    if (poolStacks[sourcePoolStackIdx] && slots[slotIndex]) {
      const poolRect = poolStacks[sourcePoolStackIdx].getBoundingClientRect();
      const slotRect = slots[slotIndex].getBoundingClientRect();
      return {
        x: toVw(poolRect.left - slotRect.left),
        y: toVh(poolRect.top - slotRect.top),
      };
    }
  } catch (_) {}
  const destCol = slotIndex % 3;
  const destRow = Math.floor(slotIndex / 3);
  const sourcePoolStackIdx = Math.floor((23 - arrivalStep) / 6);
  return {
    x: `${(sourcePoolStackIdx - 1.5) * 6.5 - (destCol - 1) * 8.5}vw`,
    y: `${13.5 - destRow * 11}vh`,
  };
};

const getSlotOrigin = (slotIndex) => {
  try {
    const isGroupA = slotIndex < 4;
    const pileIndex = isGroupA ? slotIndex : slotIndex - 4;
    const selector = isGroupA ? ".story-group--a .pile-card" : ".story-group--b .pile-card";
    const piles = document.querySelectorAll(selector);
    const slots = document.querySelectorAll(".count-slot");
    if (piles[pileIndex] && slots[slotIndex]) {
      const pileRect = piles[pileIndex].getBoundingClientRect();
      const slotRect = slots[slotIndex].getBoundingClientRect();
      return {
        x: toVw(pileRect.left + pileRect.width / 2 - (slotRect.left + slotRect.width / 2)),
        y: toVh(pileRect.top + pileRect.height / 2 - (slotRect.top + slotRect.height / 2)),
      };
    }
  } catch (_) {}
  const fallbacks = [
    { x: "-52vw", y: "-22vh" },
    { x: "-38vw", y: "-22vh" },
    { x: "-60vw", y: "-6vh" },
    { x: "-46vw", y: "-6vh" },
    { x: "-24vw", y: "-14vh" },
    { x: "-14vw", y: "-14vh" },
  ];
  return fallbacks[slotIndex] || { x: "-30vw", y: "-10vh" };
};

const PoolStack = ({ amount, stackIndex, animateIn }) => React.createElement(
  "div",
  {
    className: "coin-stack coin-stack--pool",
    style: {
      "--pool-origin-x": getPoolStackOrigin(stackIndex).x,
      "--pool-origin-y": getPoolStackOrigin(stackIndex).y,
    },
  },
  Array.from({ length: amount }, (_, index) => React.createElement("img", {
    key: index,
    className: `coin-stack__coin ${animateIn ? "coin-stack__coin--pool-in" : "coin-stack__coin--static"}`,
    src: "./assets/coin.png",
    alt: "",
    style: {
      "--coin-index": index,
      "--coin-delay": `${stackIndex * 100 + index * 50}ms`,
      "--coin-nudge": `${index % 2 ? 0.08 : -0.08}vw`,
    },
  }))
);

const DistributedSlotStack = ({ amount, slotIndex, meanRound, flownCoins }) => React.createElement(
  "div",
  { className: "coin-stack coin-stack--slot" },
  Array.from({ length: amount }, (_, coinIndex) => {
    const coinKey = `${slotIndex}-${coinIndex}`;
    const isNewThisRound = meanRound > 0 && coinIndex === meanRound - 1;
    const shouldFly = isNewThisRound && !flownCoins.current.has(coinKey);
    if (shouldFly) flownCoins.current.add(coinKey);
    const arrivalStep = coinIndex * 6 + slotIndex;

    return React.createElement("img", {
      key: coinKey,
      className: `coin-stack__coin ${shouldFly ? "coin-stack__coin--fly-in" : "coin-stack__coin--static"}`,
      src: "./assets/coin.png",
      alt: "",
      style: {
        "--coin-index": coinIndex,
        "--coin-nudge": `${coinIndex % 2 ? 0.08 : -0.08}vw`,
        "--coin-fly-start-x": getCoinFlyOffset(arrivalStep, slotIndex).x,
        "--coin-fly-start-y": getCoinFlyOffset(arrivalStep, slotIndex).y,
      },
    });
  })
);

const Pile = ({ value, index, groupKey, animate, groupAPileCount }) => {
  const sourceOrder = groupKey === "a" ? index : groupAPileCount + index;
  return React.createElement(
    "div",
    {
      className: `pile-card ${animate ? "pile-card--arrive" : ""}`,
      "data-source-order": sourceOrder,
      style: { "--pile-delay": animate ? `${index * 170}ms` : "0ms" },
    },
    React.createElement("span", { className: "pile-number" }, index + 1),
    React.createElement(CoinStack, { amount: value, delay: index * 170, animate }),
    React.createElement("span", { className: "pile-caption" }, `${T.ui.pile} ${String.fromCharCode(65 + index)} = `, React.createElement("b", null, value))
  );
};

const GroupStats = ({ item, suffix }) => React.createElement("div", { className: "group-stats" },
  React.createElement("span", null, React.createElement("i", null, T.ui.count, React.createElement("sub", null, suffix)), ` = ${item.count}`),
  React.createElement("span", null, React.createElement("i", null, T.ui.total, React.createElement("sub", null, suffix)), ` = ${item.total}`),
  React.createElement("span", null, React.createElement("i", null, T.ui.mean, React.createElement("sub", null, suffix)), ` = ${localizeNumberText(item.mean)}`)
);

const GroupButton = ({ label, actionStage, stage, muted, onAdvance }) => React.createElement("button", {
  type: "button",
  className: `group-action ${stage === actionStage ? "ftue-target group-action--active" : ""} ${muted ? "group-action--muted" : ""}`,
  disabled: stage !== actionStage,
  onClick: () => {
    const hand = document.getElementById("hand-ftue");
    if (hand) hand.classList.remove("hand-animating", "hand-nudge-right");
    onAdvance(actionStage);
  },
}, label);

const AddGroup = ({ groupKey, label, revealStage, actionStage, suffix, stage, item, groupAPileCount, animatedGroups, onAdvance }) => {
  const open = stage > revealStage;
  const shouldAnimate = stage === revealStage + 1;

  return React.createElement("section", {
    className: `story-group story-group--${groupKey} ${open ? "story-group--open" : ""} ${stage === actionStage ? "story-group--active" : ""} ${stage === 4 ? "story-group--feeding-count" : ""} ${stage === 5 ? "story-group--feeding-total" : ""}`,
  },
    !open && React.createElement(GroupButton, { label, actionStage, stage, muted: stage !== actionStage, onAdvance }),
    open && React.createElement("h3", { className: "group-section-title" }, label),
    open && React.createElement("div", { className: "pile-grid" }, item.piles.map((value, index) => React.createElement(Pile, {
      value, index, groupKey, animate: shouldAnimate, groupAPileCount, key: `${groupKey}-${index}`,
    }))),
    open && React.createElement(GroupStats, { item, suffix })
  );
};

const getGroupBuilderFinalState = (mode) => {
  const isAdd = mode === "add";
  const data = T.lesson.groups[mode];
  return {
    stage: isAdd ? 6 : 3,
    stageReady: true,
    skipAnimations: true,
    countDone: true,
    totalDone: true,
    meanDone: true,
    countAnimStage: isAdd ? data.result.count : -1,
    meanRound: isAdd ? Number(data.result.mean) : 0,
  };
};

const FinalAddGroup = ({ stage, stageReady, data, onAdvance, playSfx, initialState }) => {
  const h = React.createElement;
  const { useEffect, useLayoutEffect, useRef, useState } = React;
  const resume = initialState || {};
  const [countAnimStage, setCountAnimStage] = useState(resume.countAnimStage ?? -1);
  const [countDone, setCountDone] = useState(!!resume.countDone);
  const [totalDone, setTotalDone] = useState(!!resume.totalDone);
  const [meanRound, setMeanRound] = useState(resume.meanRound ?? 0);
  const [meanDone, setMeanDone] = useState(!!resume.meanDone);

  const countStartedRef = useRef(!!resume.skipAnimations);
  const totalStartedRef = useRef(!!resume.skipAnimations);
  const meanStartedRef = useRef(!!resume.skipAnimations);
  const flownCoinsRef = useRef(new Set());
  const countSoundStepRef = useRef(resume.skipAnimations ? 99 : -1);
  const meanSoundRoundRef = useRef(resume.skipAnimations ? 4 : 0);

  const slotCount = data.result.count;
  const meanVal = Number(data.result.mean);

  useLayoutEffect(() => {
    const sourceCards = document.querySelectorAll(".story-group .pile-card[data-source-order]");
    sourceCards.forEach((card) => card.classList.remove("pile-card--source-pop"));
    if (stage !== 4 || countAnimStage < 0 || countAnimStage >= slotCount) return undefined;

    const activeSource = document.querySelector(`.story-group .pile-card[data-source-order="${countAnimStage}"]`);
    if (!activeSource) return undefined;
    activeSource.classList.add("pile-card--source-pop");
    return () => activeSource.classList.remove("pile-card--source-pop");
  }, [stage, countAnimStage, slotCount]);

  useEffect(() => {
    if (stage !== 4) {
      if (stage < 4) {
        countStartedRef.current = false;
        countSoundStepRef.current = -1;
        setCountAnimStage(-1);
        setCountDone(false);
      }
      return undefined;
    }
    if (countStartedRef.current) return undefined;
    countStartedRef.current = true;

    let current = 0;
    setCountAnimStage(0);
    const interval = setInterval(() => {
      current += 1;
      if (current < slotCount) {
        setCountAnimStage(current);
      } else {
        clearInterval(interval);
        setCountAnimStage(slotCount);
        setCountDone(true);
      }
    }, 550);
    return () => clearInterval(interval);
  }, [stage, slotCount]);

  useEffect(() => {
    if (resume.skipAnimations) return undefined;
    if (stage !== 4) return undefined;
    if (countAnimStage < 0 || countAnimStage >= slotCount) return undefined;
    if (countSoundStepRef.current === countAnimStage) return undefined;
    countSoundStepRef.current = countAnimStage;
    playSfx("tick");
    return undefined;
  }, [stage, countAnimStage, slotCount, playSfx]);

  useEffect(() => {
    if (stage !== 5) {
      if (stage < 5) {
        totalStartedRef.current = false;
        setTotalDone(false);
      }
      return undefined;
    }
    if (totalStartedRef.current) return undefined;
    totalStartedRef.current = true;
    playSfx("zoom");

    const timer = setTimeout(() => setTotalDone(true), 1400);
    return () => clearTimeout(timer);
  }, [stage, playSfx]);

  useEffect(() => {
    if (stage !== 6) {
      if (stage < 6) {
        meanStartedRef.current = false;
        meanSoundRoundRef.current = 0;
        flownCoinsRef.current = new Set();
        setMeanRound(0);
        setMeanDone(false);
      }
      return undefined;
    }
    if (meanStartedRef.current) return undefined;
    meanStartedRef.current = true;

    let round = 0;
    const interval = setInterval(() => {
      round += 1;
      if (round <= 4) {
        setMeanRound(round);
      } else {
        clearInterval(interval);
        setMeanRound(4);
        setMeanDone(true);
      }
    }, 950);
    return () => clearInterval(interval);
  }, [stage]);

  useEffect(() => {
    if (resume.skipAnimations) return undefined;
    if (stage !== 6) return undefined;
    if (meanRound <= 0 || meanRound > 4) return undefined;
    if (meanSoundRoundRef.current === meanRound) return undefined;
    meanSoundRoundRef.current = meanRound;
    playSfx("swoosh");
    return undefined;
  }, [stage, meanRound, playSfx]);

  const slotsVisible = stage >= 4;
  const totalVisible = stage >= 5;

  return h("section", { className: `story-group story-group--result ${stage >= 3 ? "story-group--open" : ""} ${stage === 2 ? "story-group--active" : ""}` },
    stage < 3 && h(GroupButton, { label: T.ui.finalGroup, actionStage: 2, stage, muted: stage !== 2, onAdvance }),
    stage >= 3 && h(React.Fragment, null,
      h("h3", { className: "group-section-title" }, T.ui.finalGroup),
      h("div", { className: "final-visual" },
        slotsVisible && h("div", { className: "count-slots" }, Array.from({ length: slotCount }, (_, index) => {
          const origin = getSlotOrigin(index);
          const isArriving = stage === 4 && countAnimStage === index;
          const isLanded = countAnimStage > index || stage > 4;

          let slotCoinCount = 0;
          if (stage > 6 || (stage === 6 && meanDone)) {
            slotCoinCount = meanVal;
          } else if (stage === 6 && meanRound > 0) {
            slotCoinCount = meanRound;
          }

          return h("span", {
            key: index,
            className: `count-slot ${isArriving ? "count-slot--arriving" : isLanded ? "count-slot--landed" : "count-slot--hidden"}`,
            style: {
              "--slot-origin-x": origin.x,
              "--slot-origin-y": origin.y,
            },
          },
            isArriving && h("span", { className: "pile-flight-copy" },
              h("span", { className: "pile-number" }, index + 1)
            ),
            isLanded && !isArriving && h("b", null, index + 1),
            slotCoinCount > 0 && h(DistributedSlotStack, {
              amount: slotCoinCount,
              slotIndex: index,
              meanRound: stage === 6 && !meanDone ? meanRound : 0,
              flownCoins: flownCoinsRef,
            })
          );
        })),
        totalVisible && h("div", { className: "coin-total-pool" },
          [6, 6, 6, 6].map((stackSize, stackIdx) => {
            const stackStartSeq = stackIdx * 6;
            let coinsRemaining = stackSize;
            if (stage > 6 || (stage === 6 && meanDone)) {
              coinsRemaining = 0;
            } else if (stage === 6 && meanRound > 0) {
              const totalDrained = meanRound * 6;
              const stackEndSeq = stackStartSeq + stackSize;
              if (totalDrained <= stackStartSeq) {
                coinsRemaining = stackSize;
              } else if (totalDrained >= stackEndSeq) {
                coinsRemaining = 0;
              } else {
                coinsRemaining = stackEndSeq - totalDrained;
              }
            }

            return h(PoolStack, {
              key: stackIdx,
              amount: coinsRemaining,
              stackIndex: stackIdx,
              animateIn: stage === 5 && !totalDone,
            });
          })
        )
      ),
      h("div", { className: "final-metrics" },
        h("button", {
          className: `metric-button metric-button--n ${stage === 3 && stageReady ? "ftue-target metric-button--active" : ""} ${stage >= 4 ? "metric-button--revealed" : ""}`,
          disabled: stage !== 3,
          onClick: () => onAdvance(3),
        }, countDone ? `${T.ui.count} = ${data.result.count}` : T.ui.count),
        h("button", {
          className: `metric-button metric-button--total ${stage === 4 && countDone && stageReady ? "ftue-target metric-button--active" : ""} ${stage >= 5 ? "metric-button--revealed" : ""}`,
          disabled: stage !== 4 || !countDone,
          onClick: () => onAdvance(4),
        }, totalDone ? `${T.ui.total} = ${data.result.total}` : T.ui.total),
        h("button", {
          className: `metric-button metric-button--mean ${stage === 5 && totalDone && stageReady ? "ftue-target metric-button--active" : ""} ${stage >= 6 ? "metric-button--revealed" : ""}`,
          disabled: stage !== 5 || !totalDone,
          onClick: () => onAdvance(5),
        }, meanDone ? `${T.ui.mean} = ${data.result.total} \u00f7 ${data.result.count} = ${localizeNumberText(data.result.mean)}` : T.ui.mean)
      )
    )
  );
};

const FormulaGroup = ({ label, actionStage, suffix, stage, animatedGroups, formulaKey, onAdvance }) => {
  const open = stage > actionStage;
  const shouldReveal = stage === actionStage + 1;

  return React.createElement("section", {
    className: `formula-group ${open ? "formula-group--open" : ""} ${stage === actionStage ? "formula-group--active-step" : ""}`,
  },
    !open && React.createElement(GroupButton, { label, actionStage, stage, muted: stage !== actionStage, onAdvance }),
    open && React.createElement("h3", { className: "group-section-title" }, label),
    open && React.createElement("div", { className: "formula-stack" },
      React.createElement("span", { className: `metric-tile metric-tile--n ${shouldReveal ? "metric-tile--reveal" : ""}` }, T.ui.count, React.createElement("sub", null, suffix)),
      React.createElement("span", { className: `metric-tile metric-tile--total ${shouldReveal ? "metric-tile--reveal" : ""}` }, T.ui.total, React.createElement("sub", null, suffix)),
      React.createElement("span", { className: `metric-tile metric-tile--mean ${shouldReveal ? "metric-tile--reveal" : ""}` }, T.ui.mean, React.createElement("sub", null, suffix))
    )
  );
};

const GroupBuilder = ({ mode, onComplete, onInstruction, onAnimationBusy = () => {}, playSfx, initialState }) => {
  const h = React.createElement;
  const { useEffect, useRef, useState } = React;
  const resume = initialState || {};
  const data = T.lesson.groups[mode];
  const isAdd = mode === "add";
  const maxStage = isAdd ? 6 : 3;
  const [stage, setStage] = useState(resume.stage ?? 0);
  const [stageReady, setStageReady] = useState(resume.stageReady ?? true);
  const prompts = isAdd
    ? [T.ui.tapGroupA, T.ui.tapGroupB, T.ui.tapFinal, T.ui.tapCount, T.ui.tapTotal, T.ui.tapMean, T.ui.continuePrompt]
    : [T.ui.tapGroupA, T.ui.tapGroupBSubtract, T.ui.tapFinalSubtract, T.ui.continuePrompt];

  const animatedGroupsRef = useRef(new Set());
  const advance = (needed) => {
    if (stage !== needed) return;
    playSfx(isAdd && needed === 5 ? "click" : (needed === maxStage - 1 ? "correct" : "click"));
    setStageReady(false);
    setStage((value) => value + 1);
  };

  useEffect(() => {
    if (resume.skipAnimations) {
      setStageReady(true);
      return undefined;
    }
    const animationDurations = isAdd
      ? [0, 1700, 1200, 500, 3450, 1400, 4900]
      : [0, 500, 500, 500];
    const duration = animationDurations[stage] || 0;
    if (!duration) {
      setStageReady(true);
      return undefined;
    }
    const timer = setTimeout(() => setStageReady(true), duration);
    return () => clearTimeout(timer);
  }, [stage, isAdd]);

  useEffect(() => {
    onInstruction(stageReady ? prompts[stage] : "");
    onComplete(stage >= maxStage && stageReady);
    onAnimationBusy(!stageReady);
  }, [stage, stageReady]);

  useEffect(() => () => onAnimationBusy(false), []);

  const subtractScene = h("div", { className: "subtraction-equation" },
    h(FormulaGroup, { label: T.ui.groupA, actionStage: 0, suffix: "1", stage, animatedGroups: animatedGroupsRef, formulaKey: "formula-a", onAdvance: advance }),
    h("span", { className: "math-operator" }, "\u2212"),
    h(FormulaGroup, { label: T.ui.groupB, actionStage: 1, suffix: "2", stage, animatedGroups: animatedGroupsRef, formulaKey: "formula-b", onAdvance: advance }),
    h("span", { className: "math-operator" }, "="),
    h("section", { className: `formula-group formula-group--result ${stage >= 3 ? "formula-group--open" : ""} ${stage === 2 ? "formula-group--active-step" : ""}` },
      stage < 3 && h(GroupButton, { label: T.ui.finalGroup, actionStage: 2, stage, muted: stage !== 2, onAdvance: advance }),
      stage >= 3 && h(React.Fragment, null,
        h("h3", { className: "group-section-title" }, T.ui.finalGroup),
        h("div", { className: "formula-stack" },
          h("span", { className: "metric-tile metric-tile--n" }, T.ui.count, " = ", T.ui.count, h("sub", null, "1"), " \u2212 ", T.ui.count, h("sub", null, "2")),
          h("span", { className: "metric-tile metric-tile--total" }, T.ui.total, " = ", T.ui.total, h("sub", null, "1"), " \u2212 ", T.ui.total, h("sub", null, "2")),
          h("span", { className: "metric-tile metric-tile--mean" }, T.ui.mean, " = ", T.ui.total, " \u00f7 ", T.ui.count)
        )
      )
    )
  );

  const title = isAdd
    ? (stage === 0 ? T.ui.buildAddTitle
      : stage === 1 ? T.ui.groupAStory
        : stage === 2 ? T.ui.groupBStory
          : stage === 3 ? T.ui.finalGroupStory
            : stage === 4 ? T.ui.finalCountStory
              : stage === 5 || !stageReady ? T.ui.finalTotalStory
                : T.ui.finalMeanStory)
    : T.ui.buildSubtractTitle;

  return h("section", { className: `lesson-screen group-builder group-builder--${mode} fade-in` },
    h("div", { className: "rule-title", dangerouslySetInnerHTML: { __html: title } }),
    isAdd ? h("div", { className: "group-equation" },
      h(AddGroup, { groupKey: "a", label: T.ui.groupA, revealStage: 0, actionStage: 0, suffix: "1", stage, item: data.a, groupAPileCount: data.a.piles.length, animatedGroups: animatedGroupsRef, onAdvance: advance }),
      h("span", { className: "math-operator" }, "+"),
      h(AddGroup, { groupKey: "b", label: T.ui.groupB, revealStage: 1, actionStage: 1, suffix: "2", stage, item: data.b, groupAPileCount: data.a.piles.length, animatedGroups: animatedGroupsRef, onAdvance: advance }),
      h("span", { className: "math-operator" }, "="),
      h(FinalAddGroup, { stage, stageReady, data, onAdvance: advance, playSfx, initialState: resume })
    ) : subtractScene
  );
};
