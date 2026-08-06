const SUMMARY_FLY_MS = 780;
const SUMMARY_SIGN_FLIP_MS = Math.round(SUMMARY_FLY_MS * 0.42);
const SUMMARY_SLOT_OPEN_MS = 720;
const SUMMARY_BRACKET_MS = 850;

const summaryDelay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const openLhsSlot = async (setBottomEq, slot, isCancelled) => {
  const gapKey = slot === 2 ? "lhsGap2" : "lhsGap1";
  const openKey = slot === 2 ? "lhsGap2Open" : "lhsGap1Open";

  setBottomEq((prev) => ({
    ...prev,
    [gapKey]: true,
    [openKey]: false,
  }));
  await summaryDelay(80);
  if (isCancelled()) return;

  setBottomEq((prev) => ({
    ...prev,
    [openKey]: true,
  }));
  await summaryDelay(SUMMARY_SLOT_OPEN_MS);
};

const hideFlyElement = (el) => {
  if (!el) return;
  el.classList.add("summary-fly-source-hidden");
};

const showFlyElement = (el) => {
  if (!el) return;
  el.classList.remove("summary-fly-source-hidden");
};

const flySummaryToken = (sourceEl, targetEl, options, setFlyClones) => {
  return new Promise((resolve) => {
    if (!sourceEl || !targetEl) {
      resolve();
      return;
    }

    const id = "summary-fly-" + Date.now() + "-" + Math.random();
    const src = sourceEl.getBoundingClientRect();
    const tgt = targetEl.getBoundingClientRect();
    const computed = window.getComputedStyle(sourceEl);
    const dx = tgt.left + tgt.width / 2 - (src.left + src.width / 2);
    const dy = tgt.top + tgt.height / 2 - (src.top + src.height / 2);

    if (options.hideSource) {
      hideFlyElement(sourceEl);
    }
    if (options.hideTarget) {
      hideFlyElement(targetEl);
    }

    const clone = {
      id: id,
      text: options.signFlip
        ? options.signFlip.from
        : options.text != null
          ? options.text
          : sourceEl.textContent.trim(),
      signFlip: options.signFlip || null,
      signFlipped: false,
      startX: src.left + src.width / 2,
      startY: src.top + src.height / 2,
      dx: dx,
      dy: dy,
      animating: false,
      color: options.color || computed.color,
      fontSize: computed.fontSize,
      fontFamily: computed.fontFamily,
      fontStyle: computed.fontStyle,
      fontWeight: computed.fontWeight,
    };

    if (typeof options.onStart === "function") options.onStart();
    setFlyClones((prev) => prev.concat([clone]));

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setFlyClones((prev) =>
          prev.map((c) => (c.id === id ? { ...c, animating: true } : c)),
        );
      });
    });

    if (options.signFlip) {
      setTimeout(() => {
        setFlyClones((prev) =>
          prev.map((c) => (c.id === id ? { ...c, signFlipped: true } : c)),
        );
      }, SUMMARY_SIGN_FLIP_MS);
    }

    setTimeout(() => {
      setFlyClones((prev) => prev.filter((c) => c.id !== id));
      if (options.hideTarget) {
        showFlyElement(targetEl);
      }
      if (typeof options.onComplete === "function") options.onComplete();
      resolve();
    }, SUMMARY_FLY_MS);
  });
};

const runSummaryExpandAndFly = async (ctx) => {
  const {
    setBottomEq,
    setFlyClones,
    onNavChange,
    isCancelled,
    texts,
    colors,
  } = ctx;

  onNavChange({ text: "", hidden: true, nudgeId: null });
  setBottomEq((prev) => ({ ...prev, fadingFive: true }));
  await summaryDelay(450);
  if (isCancelled()) return;

  setBottomEq((prev) => ({
    ...prev,
    mode: "expanded",
    fadingFive: false,
    rhsFiveVisible: false,
  }));
  await summaryDelay(550);
  if (isCancelled()) return;
  await summaryDelay(80);
  if (isCancelled()) return;

  const flyTwo = () =>
    flySummaryToken(
      document.getElementById("summary-top-rhs-2"),
      document.getElementById("summary-bottom-rhs-2-first"),
      {
        text: "2",
        color: colors.yellow,
        onComplete: () => {
          setBottomEq((prev) => ({
            ...prev,
            colored: { ...prev.colored, rhs2: true },
          }));
        },
      },
      setFlyClones,
    );

  const flyDx = () =>
    flySummaryToken(
      document.getElementById("summary-arrow-dx"),
      document.getElementById("summary-bottom-rhs-plus2"),
      {
        color: colors.pink,
        onComplete: () => {
          setBottomEq((prev) => ({
            ...prev,
            colored: { ...prev.colored, rhsPlus2: true },
          }));
        },
      },
      setFlyClones,
    );

  const flyDy = () =>
    flySummaryToken(
      document.getElementById("summary-arrow-dy"),
      document.getElementById("summary-bottom-rhs-plus1"),
      {
        color: colors.orange,
        onComplete: () => {
          setBottomEq((prev) => ({
            ...prev,
            colored: { ...prev.colored, rhsPlus1: true },
          }));
        },
      },
      setFlyClones,
    );

  await flyTwo();
  if (isCancelled()) return;
  await summaryDelay(120);
  if (isCancelled()) return;
  await flyDx();
  if (isCancelled()) return;
  await summaryDelay(120);
  if (isCancelled()) return;
  await flyDy();
  if (isCancelled()) return;

  setBottomEq((prev) => ({ ...prev, interaction: "expandDone" }));
  onNavChange({
    text: texts.navTapRewrite,
    hidden: false,
    nudgeId: "summary-translated-box",
  });
};

const runSummaryRewrite = async (ctx) => {
  const {
    setBottomEq,
    setFlyClones,
    onNavChange,
    isCancelled,
    texts,
    colors,
    setBottomTextKey,
    setBottomTextVisible,
  } = ctx;

  onNavChange({ text: "", hidden: true, nudgeId: null });
  setBottomEq((prev) => ({
    ...prev,
    interaction: "rewriting",
  }));
  await openLhsSlot(setBottomEq, 2, isCancelled);
  if (isCancelled()) return;

  await flySummaryToken(
    document.getElementById("summary-bottom-rhs-plus2"),
    document.getElementById("summary-bottom-lhs-minus2"),
    {
      signFlip: { from: "+ 2", to: "- 2" },
      color: colors.pink,
      hideSource: true,
      onComplete: () => {
        setBottomEq((prev) => ({
          ...prev,
          lhsMinus2: true,
          rhsPlus2Gone: true,
        }));
      },
    },
    setFlyClones,
  );
  if (isCancelled()) return;

  await openLhsSlot(setBottomEq, 1, isCancelled);
  if (isCancelled()) return;

  await flySummaryToken(
    document.getElementById("summary-bottom-rhs-plus1"),
    document.getElementById("summary-bottom-lhs-minus1"),
    {
      signFlip: { from: "+ 1", to: "- 1" },
      color: colors.orange,
      hideSource: true,
      onComplete: () => {
        setBottomEq((prev) => ({
          ...prev,
          lhsMinus1: true,
          rhsPlus1Gone: true,
        }));
      },
    },
    setFlyClones,
  );
  if (isCancelled()) return;

  await summaryDelay(450);
  if (isCancelled()) return;

  setBottomEq((prev) => ({
    ...prev,
    interaction: "bracketing",
    brackets: false,
  }));
  await summaryDelay(120);
  if (isCancelled()) return;

  setBottomEq((prev) => ({
    ...prev,
    brackets: true,
  }));
  await summaryDelay(SUMMARY_BRACKET_MS);
  if (isCancelled()) return;

  setBottomEq((prev) => ({ ...prev, interaction: "rewriteDone" }));

  setBottomTextVisible(false);
  await summaryDelay(400);
  if (isCancelled()) return;
  setBottomTextKey("pattern");
  setBottomTextVisible(true);

  onNavChange({
    text: texts.navTapCompare,
    hidden: false,
    nudgeId: "summary-translated-box",
  });
};

const runSummaryCompare = async (ctx) => {
  const { setBottomEq, onNavChange, isCancelled, texts } = ctx;

  onNavChange({ hidden: true });
  setBottomEq((prev) => ({ ...prev, interaction: "comparing" }));

  setBottomEq((prev) => ({ ...prev, hideVerticalArrow: true }));
  await summaryDelay(120);
  if (isCancelled()) return;

  setBottomEq((prev) => ({ ...prev, arrowCompareMode: true }));
  await summaryDelay(650);
  if (isCancelled()) return;

  setBottomEq((prev) => ({ ...prev, showSpotlights: true }));
  await summaryDelay(80);
  if (isCancelled()) return;

  setBottomEq((prev) => ({ ...prev, spotlightsVisible: true }));
  await summaryDelay(900);
  if (isCancelled()) return;

  setBottomEq((prev) => ({ ...prev, interaction: "compareDone" }));
  onNavChange({
    text: texts.navTapGeneralize,
    hidden: false,
    nudgeId: "summary-translated-box",
  });
};

const runSummaryGeneralize = async (ctx) => {
  const {
    setBottomEq,
    onNavChange,
    isCancelled,
    texts,
    setBottomTextKey,
    setBottomTextVisible,
  } = ctx;

  onNavChange({ hidden: true });
  setBottomEq((prev) => ({ ...prev, interaction: "generalizing", morphActive: true }));

  await summaryDelay(80);
  if (isCancelled()) return;

  setBottomEq((prev) => ({ ...prev, morphFlip: true }));
  await summaryDelay(750);
  if (isCancelled()) return;

  setBottomEq((prev) => ({
    ...prev,
    generalized: true,
    morphActive: false,
    interaction: "summarizeReady",
  }));

  setBottomTextVisible(false);
  await summaryDelay(380);
  if (isCancelled()) return;

  setBottomTextKey("generalForm");
  setBottomTextVisible(true);

  onNavChange({
    text: texts.navTapSummarize,
    hidden: false,
    nudgeId: null,
    nextEnabled: true,
  });
};
