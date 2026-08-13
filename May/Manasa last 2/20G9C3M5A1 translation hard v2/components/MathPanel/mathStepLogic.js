const getStep9SimplifyNavText = (simplifyStep) =>
  simplifyStep === 4
    ? APP_DATA.steps[9].navTapRearrange
    : APP_DATA.steps[9].navTapSimplify;

const runStep7Intro = async (ctx) => {
  const { delay, isCancelled, setMath, onMathNavChange, MathStepHelpers } = ctx;

  const nextFrame = () =>
    new Promise((resolve) => requestAnimationFrame(resolve));

  onMathNavChange({ text: "", hidden: true, nudgeId: null });

  setMath((m) => ({ ...m, equationVisible: false }));

  await nextFrame();
  await nextFrame();
  await delay(40);
  if (isCancelled()) return;

  const equationBox = document.getElementById("math-equation-box");
  if (
    equationBox &&
    MathStepHelpers &&
    typeof MathStepHelpers.flyPendingLineEquationTo === "function" &&
    MathStepHelpers.hasPendingLineEquationClone &&
    MathStepHelpers.hasPendingLineEquationClone()
  ) {
    await MathStepHelpers.flyPendingLineEquationTo(equationBox, {
      duration: 780,
      onLanded: () => {
        setMath((m) => ({ ...m, equationVisible: true }));
      },
      overlapMs: 80,
    });
    if (isCancelled()) {
      if (typeof MathStepHelpers.clearPendingLineEquationClone === "function") {
        MathStepHelpers.clearPendingLineEquationClone();
      }
      return;
    }
  } else {
    if (
      MathStepHelpers &&
      typeof MathStepHelpers.clearPendingLineEquationClone === "function"
    ) {
      MathStepHelpers.clearPendingLineEquationClone();
    }
    setMath((m) => ({ ...m, equationVisible: true }));
  }

  await delay(500);
  if (isCancelled()) return;

  setMath((m) => ({ ...m, line1Visible: true }));
  await delay(450);
  if (isCancelled()) return;

  setMath((m) => ({ ...m, line2Visible: true }));
  await delay(450);
  if (isCancelled()) return;

  setMath((m) => ({
    ...m,
    highlightVar: "x",
    step7Phase: "tapX",
  }));
  onMathNavChange({
    text: APP_DATA.steps[7].navTapX,
    hidden: false,
    nudgeId: "math-x-highlight",
  });
};

const runStep7AfterXClick = async (ctx) => {
  const { delay, isCancelled, setMath, onMathNavChange } = ctx;

  if (typeof playSound === "function") playSound("click");
  onMathNavChange({ text: "", hidden: true, nudgeId: null });

  setMath((m) => ({
    ...m,
    highlightVar: null,
    equationParts: {
      left: "0",
      showPlus: true,
      middle: "y",
      right: "2",
    },
    equationClickable: true,
    step7Phase: "tapEquationX",
  }));

  await delay(200);
  if (isCancelled()) return;

  onMathNavChange({
    text: APP_DATA.steps[7].navTapEquation,
    hidden: false,
    nudgeId: "math-equation-box",
  });
};

const runStep7AfterEquationX = async (ctx) => {
  const { delay, isCancelled, setMath, onMathNavChange, mp } = ctx;

  if (typeof playSound === "function") playSound("click");
  onMathNavChange({ text: "", hidden: true, nudgeId: null });

  setMath((m) => ({
    ...m,
    equationClickable: false,
    equationParts: {
      left: "0",
      showPlus: true,
      middle: "y",
      right: "2",
      fadeLeft: true,
      fadePlus: true,
    },
  }));

  await delay(600);
  if (isCancelled()) return;

  setMath((m) => ({
    ...m,
    equationParts: { mode: "simplified", left: "y", right: "2" },
    step7Phase: "flyPoint0",
  }));

  await delay(1000);
  if (isCancelled()) return;

  await runStep7FlyPoint(ctx, 0, "2", "0");
  if (isCancelled()) return;

  setMath((m) => ({
    ...m,
    line1Text: mp.line1y,
    line2Text: mp.line2Y,
    equationParts: {
      left: "x",
      showPlus: true,
      middle: "y",
      right: "2",
    },
    highlightVar: "y",
    equationClickable: false,
    step7Phase: "tapY",
  }));

  await delay(200);
  if (isCancelled()) return;

  onMathNavChange({
    text: APP_DATA.steps[7].navTapY,
    hidden: false,
    nudgeId: "math-y-highlight",
  });
};

const runStep7AfterYClick = async (ctx) => {
  const { delay, isCancelled, setMath, onMathNavChange } = ctx;

  if (typeof playSound === "function") playSound("click");
  onMathNavChange({ text: "", hidden: true, nudgeId: null });

  setMath((m) => ({
    ...m,
    highlightVar: null,
    equationParts: {
      left: "x",
      showPlus: true,
      middle: "0",
      right: "2",
    },
    equationClickable: true,
    step7Phase: "tapEquationY",
  }));

  await delay(200);
  if (isCancelled()) return;

  onMathNavChange({
    text: APP_DATA.steps[7].navTapEquation,
    hidden: false,
    nudgeId: "math-equation-box",
  });
};

const runStep7AfterEquationY = async (ctx) => {
  const { delay, isCancelled, setMath, onMathNavChange } = ctx;

  if (typeof playSound === "function") playSound("click");
  onMathNavChange({ text: "", hidden: true, nudgeId: null });

  setMath((m) => ({
    ...m,
    equationClickable: false,
    equationParts: {
      left: "x",
      showPlus: true,
      middle: "0",
      right: "2",
      fadeMiddle: true,
      fadePlus: true,
    },
  }));

  await delay(600);
  if (isCancelled()) return;

  setMath((m) => ({
    ...m,
    equationParts: { mode: "simplified", left: "x", right: "2" },
    step7Phase: "flyPoint1",
  }));

  await delay(1000);
  if (isCancelled()) return;

  await runStep7FlyPoint(ctx, 1, "2", "0");
  if (isCancelled()) return;

  await delay(1000);
  if (isCancelled()) return;

  setMath((m) => ({
    ...m,
    equationCollapsed: true,
    step7Phase: "showTitle",
  }));

  await delay(650);
  if (isCancelled()) return;

  setMath((m) => ({
    ...m,
    objectTitleVisible: true,
    exploredCardIds: ["card-step1"],
    activeCardId: "card-step2",
    contentHighlightId: "card-step2",
    step7Phase: "done",
  }));

  setCardsClickable(ctx, "card-step2");

  onMathNavChange({
    text: APP_DATA.steps[7].navTapStep2,
    hidden: false,
    nudgeId: "step-card-clickable",
  });
};

const runStep7FlyPoint = async (ctx, pointIndex, digitFromEq, digitFromLine) => {
  const { isCancelled, setMath, setFlyClones, MathStepHelpers, mp } = ctx;

  const objectId = "math-object-" + pointIndex;
  const objectText =
    pointIndex === 0 ? mp.objectCoord0 : mp.objectCoord1;
  const coordMatch = String(objectText).match(/\(\s*(\d+)\s*,\s*(\d+)\s*\)/);
  const c0 = coordMatch ? coordMatch[1] : "0";
  const c1 = coordMatch ? coordMatch[2] : "0";

  const eqEl = document.getElementById("eq-part-two");
  const lineEl = document.getElementById("math-line2-val");
  const eqTargetEl = document.getElementById(
    objectId + (digitFromEq === c0 ? "-d0" : "-d1"),
  );
  const lineTargetEl = document.getElementById(
    objectId + (digitFromLine === c0 ? "-d0" : "-d1"),
  );

  await MathStepHelpers.createFlyClonesParallel(
    [
      {
        sourceEl: eqEl,
        targetEl: eqTargetEl,
        options: { text: digitFromEq },
      },
      {
        sourceEl: lineEl,
        targetEl: lineTargetEl,
        options: { text: digitFromLine },
      },
    ],
    setFlyClones,
  );
  if (isCancelled()) return;

  setMath((m) => ({
    ...m,
    objectPoints: m.objectPoints.map((p, i) =>
      i === pointIndex
        ? { ...p, visible: true, instant: true, contentVisible: true }
        : p,
    ),
  }));
};

const setCardsClickable = (ctx, cardId) => {
  if (typeof ctx.setCards === "function") {
    ctx.setCards((prev) =>
      prev.map((c) => ({
        ...c,
        clickable: c.id === cardId,
      })),
    );
  }
};

const runStep8Intro = async (ctx) => {
  const {
    delay,
    isCancelled,
    setMath,
    onMathNavChange,
    setFlyClones,
    MathStepHelpers,
    addHighlight,
    mp,
  } = ctx;

  onMathNavChange({ text: "", hidden: true, nudgeId: null });

  setMath((m) => ({
    ...m,
    activeCardId: "card-step2",
    contentHighlightId: "card-step2",
    exploredCardIds: ["card-step1"],
    line3Visible: true,
    line3PrefixVisible: true,
    step8Phase: "line3Anim",
  }));

  await delay(500);
  if (isCancelled()) return;

  addHighlight("highlight-translation");

  const questionEl = document.getElementById("highlight-translation");
  const vectorEl = document.getElementById("math-line3-vector");

  await MathStepHelpers.flyFromCenter(
    mp.line3Vector,
    vectorEl,
    { colorClass: "is-purple" },
    setFlyClones,
  );
  if (isCancelled()) return;

  setMath((m) => ({
    ...m,
    line3VectorVisible: true,
    line3VectorInstant: true,
    step8Phase: "tapPoints",
  }));

  await delay(300);
  if (isCancelled()) return;

  setMath((m) => ({
    ...m,
    objectPoints: m.objectPoints.map((p, i) =>
      i === 0 ? { ...p, clickable: true } : p,
    ),
  }));

  onMathNavChange({
    text: APP_DATA.steps[8].navTapPoints,
    hidden: false,
    nudgeId: "math-object-0",
  });
};

const runStep8TranslatePoint = async (ctx, pointIndex) => {
  const {
    delay,
    isCancelled,
    setMath,
    onMathNavChange,
    setFlyClones,
    MathStepHelpers,
    mp,
  } = ctx;

  if (typeof playSound === "function") playSound("click");
  onMathNavChange({ text: "", hidden: true, nudgeId: null });

  const imageId = "math-image-" + pointIndex;
  const objectId = "math-object-" + pointIndex;
  const objectText =
    pointIndex === 0 ? mp.objectCoord0 : mp.objectCoord1;
  const resultText =
    pointIndex === 0 ? mp.imageCoord0 : mp.imageCoord1;

  setMath((m) => ({
    ...m,
    objectPoints: m.objectPoints.map((p, i) => ({
      ...p,
      clickable: false,
    })),
    imagePoints: m.imagePoints.map((p, i) =>
      i === pointIndex
        ? {
            ...p,
            visible: true,
            mode: "coords",
            text: objectText,
            contentVisible: false,
          }
        : p,
    ),
    step8Phase: "animating-" + pointIndex,
  }));

  await delay(100);
  if (isCancelled()) return;

  const sourceEl = document.getElementById(objectId);
  const targetEl = document.getElementById(imageId);

  await MathStepHelpers.createFlyClone(
    sourceEl,
    targetEl,
    { text: objectText },
    setFlyClones,
  );
  if (isCancelled()) return;

  setMath((m) => ({
    ...m,
    imagePoints: m.imagePoints.map((p, i) =>
      i === pointIndex
        ? {
            ...p,
            mode: "coords",
            text: objectText,
            instant: true,
            contentVisible: true,
          }
        : p,
    ),
  }));

  await delay(500);
  if (isCancelled()) return;

  const calcLeft = pointIndex === 0 ? "0" : "2";
  const calcRight = pointIndex === 0 ? "2" : "0";

  setMath((m) => ({
    ...m,
    imagePoints: m.imagePoints.map((p, i) =>
      i === pointIndex
        ? {
            ...p,
            mode: "calc",
            calcLeft: calcLeft,
            calcRight: calcRight,
            calcIds: [
              "calc-left-" + pointIndex,
              "calc-plus2-" + pointIndex,
              "calc-right-" + pointIndex,
              "calc-plus1-" + pointIndex,
            ],
            plus2Visible: false,
            plus1Visible: false,
          }
        : p,
    ),
  }));

  await delay(100);
  if (isCancelled()) return;

  const plus2Source = document.getElementById("math-fly-plus2");
  const plus1Source = document.getElementById("math-fly-plus1");
  const plus2Target = document.getElementById("calc-plus2-" + pointIndex);
  const plus1Target = document.getElementById("calc-plus1-" + pointIndex);

  if (plus2Source && plus2Target && plus1Source && plus1Target) {
    await MathStepHelpers.createFlyClonesParallel(
      [
        {
          sourceEl: plus2Source,
          targetEl: plus2Target,
          options: { text: "+2", colorClass: "is-purple" },
        },
        {
          sourceEl: plus1Source,
          targetEl: plus1Target,
          options: { text: "+1", colorClass: "is-purple" },
        },
      ],
      setFlyClones,
    );
    if (isCancelled()) return;
  }

  setMath((m) => ({
    ...m,
    imagePoints: m.imagePoints.map((p, i) =>
      i === pointIndex
        ? { ...p, plus2Visible: true, plus1Visible: true, plus2Instant: true, plus1Instant: true }
        : p,
    ),
  }));

  await delay(400);
  if (isCancelled()) return;

  setMath((m) => ({
    ...m,
    imagePoints: m.imagePoints.map((p, i) =>
      i === pointIndex ? { ...p, contentFading: true } : p,
    ),
  }));

  await delay(600);
  if (isCancelled()) return;

  setMath((m) => ({
    ...m,
    imagePoints: m.imagePoints.map((p, i) =>
      i === pointIndex
        ? {
            ...p,
            mode: "result",
            text: resultText,
            contentFading: false,
            resultVisible: true,
            instant: true,
          }
        : p,
    ),
  }));

  if (pointIndex === 0) {
    setMath((m) => ({
      ...m,
      objectPoints: m.objectPoints.map((p, i) =>
        i === 1 ? { ...p, clickable: true } : p,
      ),
      step8Phase: "tapPoint1",
    }));
    onMathNavChange({
      text: APP_DATA.steps[8].navTapPoints,
      hidden: false,
      nudgeId: "math-object-1",
    });
    return;
  }

  await runStep8Finish(ctx);
};

const runStep8Finish = async (ctx) => {
  const { delay, isCancelled, setMath, onMathNavChange } = ctx;

  setMath((m) => ({
    ...m,
    objectRowHidden: true,
    line3Hidden: true,
    step8Phase: "finishing",
  }));

  await delay(650);
  if (isCancelled()) return;

  setMath((m) => ({
    ...m,
    imageTitleVisible: true,
    exploredCardIds: ["card-step1", "card-step2"],
    activeCardId: "card-step3",
    contentHighlightId: "card-step3",
    step8Phase: "done",
  }));

  setCardsClickable(ctx, "card-step3");

  onMathNavChange({
    text: APP_DATA.steps[8].navTapStep3,
    hidden: false,
    nudgeId: "step-card-clickable",
  });
};

const runStep9Intro = async (ctx) => {
  const { delay, isCancelled, setMath, onMathNavChange } = ctx;

  onMathNavChange({
    text: "",
    hidden: true,
    nudgeId: null,
    nextEnabled: false,
  });

  setMath((m) => ({
    ...m,
    activeCardId: "card-step3",
    contentHighlightId: "card-step3",
    exploredCardIds: ["card-step1", "card-step2"],
    formulaVisible: true,
    formulaVarsYellow: false,
    formulaClickable: false,
    formulaGlow: false,
    formulaComplete: false,
    simplifyStep: -1,
    simplifyAnimPhase: "idle",
    imagePoints: m.imagePoints.map((p, i) => ({
      ...p,
      visible: true,
      clickable: i === 0,
    })),
    step9Phase: "tapCoord0",
  }));

  await delay(400);
  if (isCancelled()) return;

  onMathNavChange({
    text: APP_DATA.steps[9].navTapPoints,
    hidden: false,
    nudgeId: "math-image-0",
    nextEnabled: false,
  });
};

const runStep9CoordClick = async (ctx, pointIndex) => {
  const { delay, isCancelled, setMath, onMathNavChange } = ctx;

  if (typeof playSound === "function") playSound("click");
  onMathNavChange({
    text: "",
    hidden: true,
    nudgeId: null,
    nextEnabled: false,
  });

  const named = [
    { pointNum: "1", xVal: "2", yVal: "3" },
    { pointNum: "2", xVal: "4", yVal: "1" },
  ];
  const data = named[pointIndex];

  setMath((m) => ({
    ...m,
    imagePoints: m.imagePoints.map((p, i) => {
      if (i === pointIndex) {
        return {
          ...p,
          mode: "named",
          pointNum: data.pointNum,
          xVal: data.xVal,
          yVal: data.yVal,
          clickable: false,
        };
      }
      if (pointIndex === 0 && i === 1) {
        return { ...p, clickable: true };
      }
      return { ...p, clickable: false };
    }),
    step9Phase: pointIndex === 0 ? "tapCoord1" : "tapFormula",
  }));

  await delay(200);
  if (isCancelled()) return;

  if (pointIndex === 0) {
    onMathNavChange({
      text: APP_DATA.steps[9].navTapPoints,
      hidden: false,
      nudgeId: "math-image-1",
      nextEnabled: false,
    });
    return;
  }

  setMath((m) => ({
    ...m,
    formulaVarsYellow: true,
    formulaClickable: true,
    formulaGlow: true,
  }));

  onMathNavChange({
    text: APP_DATA.steps[9].navTapSubstitute,
    hidden: false,
    nudgeId: "math-formula-box",
    nextEnabled: false,
  });
};

const runStep9Substitute = async (ctx) => {
  const { delay, isCancelled, setMath, onMathNavChange, setFlyClones, MathStepHelpers } =
    ctx;

  if (typeof playSound === "function") playSound("click");
  onMathNavChange({
    text: "",
    hidden: true,
    nudgeId: null,
    nextEnabled: false,
  });

  setMath((m) => ({
    ...m,
    formulaClickable: false,
    formulaGlow: false,
    step9Phase: "substituting",
  }));

  await delay(120);
  if (isCancelled()) return;

  const flyItems = [
  {
    sourceEl: document.getElementById("math-image-0-x-val"),
    targetEl: document.getElementById("formula-sub-x1-den"),
    options: { text: "2" },
  },
  {
    sourceEl: document.getElementById("math-image-0-x-val"),
    targetEl: document.getElementById("formula-sub-x1-rhs"),
    options: { text: "2" },
  },
  {
    sourceEl: document.getElementById("math-image-0-y-val"),
    targetEl: document.getElementById("formula-sub-y1"),
    options: { text: "3" },
  },
  {
    sourceEl: document.getElementById("math-image-0-y-val"),
    targetEl: document.getElementById("formula-sub-y1-frac"),
    options: { text: "3" },
  },
  {
    sourceEl: document.getElementById("math-image-1-x-val"),
    targetEl: document.getElementById("formula-sub-x2"),
    options: { text: "4" },
  },
  {
    sourceEl: document.getElementById("math-image-1-y-val"),
    targetEl: document.getElementById("formula-sub-y2"),
    options: { text: "1" },
  },
  ];

  await MathStepHelpers.createFlyClonesParallel(flyItems, setFlyClones);
  if (isCancelled()) return;

  setMath((m) => ({
    ...m,
    simplifyStep: 0,
    simplifyAnimPhase: "idle",
    step9Phase: "simplify-0",
  }));

  await delay(300);
  if (isCancelled()) return;

  onMathNavChange({
    text: getStep9SimplifyNavText(0),
    hidden: false,
    nudgeId: "formula-highlight-box",
    nextEnabled: false,
  });
};

const runStep9Simplify = async (ctx, currentStep) => {
  const { delay, isCancelled, setMath, onMathNavChange } = ctx;

  if (typeof playSound === "function") playSound("click");
  onMathNavChange({
    text: "",
    hidden: true,
    nudgeId: null,
    nextEnabled: false,
  });

  const nextStep = currentStep + 1;

  if (currentStep === 2) {
    setMath((m) => ({
      ...m,
      simplifyStep: nextStep,
      simplifyAnimPhase: "pause",
      step9Phase: "simplify-" + nextStep,
    }));

    await delay(900);
    if (isCancelled()) return;

    setMath((m) => ({
      ...m,
      simplifyAnimPhase: "idle",
    }));

    onMathNavChange({
      text: getStep9SimplifyNavText(nextStep),
      hidden: false,
      nudgeId: "formula-highlight-box",
      nextEnabled: false,
    });
    return;
  }

  setMath((m) => ({
    ...m,
    simplifyAnimPhase: "fade-out",
    step9Phase: "simplifying",
  }));

  await delay(200);
  if (isCancelled()) return;

  setMath((m) => ({
    ...m,
    simplifyAnimPhase: "fade-in",
  }));

  await delay(400);
  if (isCancelled()) return;

  setMath((m) => ({
    ...m,
    simplifyAnimPhase: "hold",
  }));

  await delay(450);
  if (isCancelled()) return;

  setMath((m) => ({
    ...m,
    simplifyStep: nextStep,
    simplifyAnimPhase: "pause",
    step9Phase: nextStep >= 6 ? "simplifying" : "simplify-" + nextStep,
  }));

  await delay(900);
  if (isCancelled()) return;

  if (nextStep >= 6) {
    setMath((m) => ({
      ...m,
      formulaComplete: true,
      step9Phase: "done",
      simplifyAnimPhase: "idle",
    }));
    onMathNavChange({
      text: APP_DATA.steps[9].navTapNext,
      hidden: false,
      nudgeId: "next-button",
      nextEnabled: true,
    });
    return;
  }

  setMath((m) => ({
    ...m,
    simplifyAnimPhase: "idle",
  }));

  onMathNavChange({
    text: getStep9SimplifyNavText(nextStep),
    hidden: false,
    nudgeId: "formula-highlight-box",
    nextEnabled: false,
  });
};

const runStep9To10Transfer = async (ctx) => {
  const {
    delay,
    isCancelled,
    onMathNavChange,
    MathStepHelpers,
    mp,
    setStep10State,
    onStepAdvance,
  } = ctx;

  const nextFrame = () =>
    new Promise((resolve) => requestAnimationFrame(resolve));

  onMathNavChange({
    text: "",
    hidden: true,
    nudgeId: null,
    nextEnabled: false,
  });

  setStep10State({
    transferring: true,
    panelsHidden: false,
    panelContentVisible: false,
    phase: "transfer",
  });

  setStep10State({ plotPanelMounted: true });
  await nextFrame();
  await nextFrame();
  await delay(40);
  if (isCancelled()) return;

  const flyItems = [
    {
      sourceEl: document.getElementById("math-image-title"),
      targetEl: document.getElementById("step10-image-title"),
      options: { kind: "title", text: mp.imagePointsTitle },
    },
    {
      sourceEl: document.getElementById("math-image-0"),
      targetEl: document.getElementById("step10-coord-0"),
      options: { text: mp.imageCoord0 },
    },
    {
      sourceEl: document.getElementById("math-image-1"),
      targetEl: document.getElementById("step10-coord-1"),
      options: { text: mp.imageCoord1 },
    },
    {
      sourceEl: document.getElementById("math-formula-title"),
      targetEl: document.getElementById("step10-formula-title"),
      options: {
        kind: "title",
        text: mp.formulaTitleTranslated || mp.formulaTitle,
      },
    },
    {
      sourceEl: document.getElementById("math-formula-box"),
      targetEl: document.getElementById("step10-formula-box"),
      options: { kind: "formula", text: "x + y = 5" },
    },
  ];

  await MathStepHelpers.runPanelElementTransfer(flyItems, {
    holdMs: 1000,
    duration: 900,
    onClonesPlaced: () => {
      setStep10State({ panelsHidden: true });
    },
  });
  if (isCancelled()) return;

  if (typeof onStepAdvance === "function") onStepAdvance(10);
  await delay(50);
  if (isCancelled()) return;

  setStep10State({
    transferring: false,
    panelsHidden: false,
    panelContentVisible: true,
    phase: "tapCoord0",
    plottedIndices: [],
    showImageLine: false,
    imageLineGrow: 0,
    plottedGraphPoints: [],
    coordClickable: 0,
  });

  await delay(100);
  if (isCancelled()) return;

  await runStep10Intro(ctx);
};

const runStep10Intro = async (ctx) => {
  const { delay, isCancelled, onMathNavChange } = ctx;

  await delay(200);
  if (isCancelled()) return;

  onMathNavChange({
    text: APP_DATA.steps[10].navTapPoints,
    hidden: false,
    nudgeId: "step10-coord-0",
    nextEnabled: false,
  });
};

const runStep10PointClick = async (ctx, pointIndex) => {
  const {
    delay,
    isCancelled,
    onMathNavChange,
    setStep10State,
    colors,
    mp,
  } = ctx;

  if (typeof playSound === "function") playSound("click");
  onMathNavChange({
    text: "",
    hidden: true,
    nudgeId: null,
    nextEnabled: false,
  });

  const coordText = pointIndex === 0 ? mp.imageCoord0 : mp.imageCoord1;
  const match = String(coordText).match(/\(\s*(-?\d+)\s*,\s*(-?\d+)\s*\)/);
  if (!match) return;

  const pt = { x: Number(match[1]), y: Number(match[2]) };
  const label = coordText;
  const labelPlacement = "right";

  setStep10State((prev) => ({
    ...prev,
    plottedIndices: prev.plottedIndices.concat([pointIndex]),
    plottedGraphPoints: (prev.plottedGraphPoints || []).concat([
      {
        id: "s10-pt-" + pointIndex,
        x: pt.x,
        y: pt.y,
        color: colors.pointPink,
        labelColor: colors.image,
        label: label,
        showLabel: true,
        labelPlacement: labelPlacement,
      },
    ]),
    phase: pointIndex === 0 ? "tapCoord1" : "plotting",
    coordClickable: pointIndex === 0 ? 1 : null,
  }));

  await delay(250);
  if (isCancelled()) return;

  if (pointIndex === 0) {
    onMathNavChange({
      text: APP_DATA.steps[10].navTapPoints,
      hidden: false,
      nudgeId: "step10-coord-1",
      nextEnabled: false,
    });
    return;
  }

  await delay(500);
  if (isCancelled()) return;

  await runStep10DrawLine(ctx);
};

const runStep10DrawLine = async (ctx) => {
  const { isCancelled, onMathNavChange, setStep10State, animateImageLineGrow } =
    ctx;

  setStep10State({ phase: "drawingLine", showImageLine: true, imageLineGrow: 0 });

  await animateImageLineGrow(900);
  if (isCancelled()) return;

  setStep10State({ phase: "done", imageLineGrow: 1 });

  onMathNavChange({
    text: APP_DATA.steps[10].navTapNext,
    hidden: false,
    nudgeId: "next-button",
    nextEnabled: true,
  });
};
