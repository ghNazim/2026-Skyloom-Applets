function tokenizeReflectionExpression(text) {
  const matches = String(text || "").match(/\d+|[xy]'?|k|[()+\-\u2212=\u00d7]/g);
  return (matches || []).map((value, index) => ({
    value: value === "-" ? "\u2212" : value,
    id: "reflection-token-" + index + "-" + value,
  }));
}

function buildReflectionTokenMatches(fromTokens, toTokens) {
  const availableTargets = {};
  toTokens.forEach((token, index) => {
    if (!availableTargets[token.value]) availableTargets[token.value] = [];
    availableTargets[token.value].push(index);
  });

  return fromTokens.map((token) => {
    const targets = availableTargets[token.value];
    if (!targets || !targets.length) return null;
    let bestListIndex = 0;
    let bestDistance = Math.abs(targets[0] - fromTokens.indexOf(token));
    targets.forEach((targetIndex, listIndex) => {
      const distance = Math.abs(targetIndex - fromTokens.indexOf(token));
      if (distance < bestDistance) {
        bestDistance = distance;
        bestListIndex = listIndex;
      }
    });
    return targets.splice(bestListIndex, 1)[0];
  });
}

const Q4_REARRANGE_MS = 2200;
const Q2_STEP_GAP_MS = 500;
const Q2_BRACKET_FADE_MS = 900;
const Q2_WRAP_DONE_MS = 2100;
const Q2_SIMPLIFY_DONE_MS = 2000;
const STEP4_FLY_MS = 1140;
const STEP4_PAUSE_MS = 250;
const STEP4_READ_PAUSE_MS = Math.round(500 * 1.3);
const STEP4_GUIDE_FADE_MS = 280;
const STEP4_PRIME_HOLD_MS = 450;
const STEP4_PRIME_FADE_MS = 1125;

const STEP4_STEP_IDS_BY_KIND = {
  minusTimesNegative: [
    "copy",
    "combineNegatives",
    "removeBrackets",
    "final",
  ],
  reflectNegativeDiagonal: [
    "copy",
    "combineNegatives",
    "multipliedWithBrackets",
    "removeBrackets",
    "multiplyByMinus1",
    "simplifyMultiply",
    "final",
  ],
  verticalLineK: [
    "copy",
    "replaceK",
    "simplifyK",
    "distribute",
    "removeProductParens",
    "substitute8",
    "removeInnerParens",
    "cleanSigns",
    "rearrangeFinal",
    "combineConstants",
    "final",
  ],
};

const renderStep4Prime = () =>
  React.createElement("span", { className: "step4-prime" }, "'");

const renderStep4PrimedToken = (renderText, letter, tokenClass, key) =>
  React.createElement(
    "span",
    { key: key, className: tokenClass },
    renderText(letter),
    renderStep4Prime(),
  );

const ReflectionRearrangeAnimation = ({ from, to, renderText, instant }) => {
  const { useEffect, useMemo, useRef, useState } = React;
  const fromTokens = useMemo(() => tokenizeReflectionExpression(from), [from]);
  const toTokens = useMemo(() => tokenizeReflectionExpression(to), [to]);
  const matches = useMemo(
    () => buildReflectionTokenMatches(fromTokens, toTokens),
    [fromTokens, toTokens],
  );
  const matchedTargets = useMemo(
    () => matches.filter((targetIndex) => targetIndex !== null),
    [matches],
  );
  const oldRefs = useRef([]);
  const targetRefs = useRef([]);
  const [tokenMoves, setTokenMoves] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSettled, setIsSettled] = useState(false);

  useEffect(() => {
    setIsPlaying(false);
    setIsSettled(false);
    setTokenMoves(null);

    const measureFrame = requestAnimationFrame(() => {
      const moves = fromTokens.map((token, index) => {
        const targetIndex = matches[index];
        const oldNode = oldRefs.current[index];
        const targetNode =
          targetIndex === null ? null : targetRefs.current[targetIndex];

        if (!oldNode || !targetNode) {
          return { matched: false, x: "0px", y: "0px" };
        }

        const oldRect = oldNode.getBoundingClientRect();
        const targetRect = targetNode.getBoundingClientRect();
        return {
          matched: true,
          x: targetRect.left - oldRect.left + "px",
          y: targetRect.top - oldRect.top + "px",
        };
      });

      setTokenMoves(moves);
      requestAnimationFrame(() => {
        setIsPlaying(true);
        if (instant) setIsSettled(true);
      });
    });

    return () => cancelAnimationFrame(measureFrame);
  }, [from, to, fromTokens, matches, instant]);

  useEffect(() => {
    if (!isPlaying || instant) return undefined;
    const timer = setTimeout(() => setIsSettled(true), Q4_REARRANGE_MS);
    return () => clearTimeout(timer);
  }, [isPlaying, instant]);

  return React.createElement(
    "span",
    {
      className:
        "reflection-rearrange-animation" +
        (isPlaying ? " is-playing" : "") +
        (isSettled ? " is-settled" : ""),
      "aria-label": to,
    },
    React.createElement(
      "span",
      {
        className: "reflection-rearrange-measure-stack",
        "aria-hidden": "true",
      },
      React.createElement(
        "span",
        { className: "reflection-rearrange-measure-row" },
        fromTokens.map((token, index) =>
          React.createElement(
            "span",
            { key: token.id, className: "reflection-rearrange-token" },
            renderText(token.value, "reflection-source-measure-" + index),
          ),
        ),
      ),
      React.createElement(
        "span",
        { className: "reflection-rearrange-measure-row" },
        toTokens.map((token, index) =>
          React.createElement(
            "span",
            {
              key: token.id,
              className: "reflection-rearrange-token",
              ref: (node) => {
                targetRefs.current[index] = node;
              },
            },
            renderText(token.value, "reflection-target-" + index),
          ),
        ),
      ),
    ),
    React.createElement(
      "span",
      { className: "reflection-rearrange-old-layer", "aria-hidden": "true" },
      fromTokens.map((token, index) => {
        const move = tokenMoves && tokenMoves[index];
        return React.createElement(
          "span",
          {
            key: token.id,
            className:
              "reflection-rearrange-token reflection-rearrange-old-token" +
              (move && move.matched ? " is-matched" : " is-removed"),
            ref: (node) => {
              oldRefs.current[index] = node;
            },
            style:
              move && move.matched
                ? { "--move-x": move.x, "--move-y": move.y }
                : undefined,
          },
          renderText(token.value, "reflection-old-" + index),
        );
      }),
    ),
    React.createElement(
      "span",
      { className: "reflection-rearrange-new-layer", "aria-hidden": "true" },
      toTokens.map((token, index) =>
        React.createElement(
          "span",
          {
            key: token.id,
            className:
              "reflection-rearrange-token reflection-rearrange-new-token" +
              (matchedTargets.includes(index) ? " is-matched" : " is-added"),
          },
          renderText(token.value, "reflection-new-" + index),
        ),
      ),
    ),
  );
};

const Q4_FADE_SWAP_MS = 1425;
const Q4_FADE_COLLAPSE_MS = 700;
const Q4_SIGN_FADE_MS = 2400;
const Q4_SIGN_COLLAPSE_MS = 900;
const Q4_REMOVAL_MS = 750;
const Q4_SWAP_DONE_MS = Q4_FADE_SWAP_MS + Q4_FADE_COLLAPSE_MS + 120;
const Q4_SIGN_SWAP_DONE_MS = Q4_SIGN_FADE_MS + Q4_SIGN_COLLAPSE_MS + 120;

const getStepFourAnimMs = (kind, id) => {
  switch (id) {
    case "copy":
      return STEP4_FLY_MS;
    case "final":
      return STEP4_PRIME_HOLD_MS + STEP4_PRIME_FADE_MS;
    case "combineNegatives":
      return kind === "reflectNegativeDiagonal" ? Q4_REARRANGE_MS : 1000;
    case "removeBrackets":
      return kind === "reflectNegativeDiagonal" ? Q2_BRACKET_FADE_MS : 1200;
    case "multipliedWithBrackets":
      return Q2_STEP_GAP_MS;
    case "multiplyByMinus1":
      return Q2_WRAP_DONE_MS;
    case "simplifyMultiply":
      return Q2_SIMPLIFY_DONE_MS;
    case "replaceK":
      return STEP4_FLY_MS;
    case "simplifyK":
      return Q4_SWAP_DONE_MS;
    case "distribute":
      return STEP4_PAUSE_MS + STEP4_FLY_MS;
    case "removeProductParens":
      return Q4_REMOVAL_MS + 80;
    case "substitute8":
      return Q4_SWAP_DONE_MS;
    case "removeInnerParens":
      return Q4_SIGN_SWAP_DONE_MS;
    case "cleanSigns":
      return Q4_SWAP_DONE_MS;
    case "rearrangeFinal":
      return Q4_REARRANGE_MS;
    case "combineConstants":
      return Q4_SWAP_DONE_MS;
    default:
      return STEP4_FLY_MS;
  }
};

const getStepFourGuideSpecs = (step4) => {
  const kind = step4.simplifyKind;
  const ids =
    STEP4_STEP_IDS_BY_KIND[kind] || STEP4_STEP_IDS_BY_KIND.minusTimesNegative;
  const arrayLen = (step4.simplificationArray || []).length;
  if (ids.length !== arrayLen) {
    console.warn(
      "simplificationArray length (" +
        arrayLen +
        ") does not match step count (" +
        ids.length +
        ") for " +
        kind,
    );
  }
  return ids.map((id) => ({
    id,
    animMs: getStepFourAnimMs(kind, id),
  }));
};

const Q4FadeOutToken = ({ children, fade, instant }) => {
  const { useEffect, useState } = React;
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!fade) {
      setActive(false);
      return;
    }
    if (instant) {
      setActive(true);
      return;
    }
    setActive(false);
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => setActive(true));
    });
    return () => cancelAnimationFrame(frame);
  }, [fade, instant]);

  return React.createElement(
    "span",
    {
      className: fade
        ? "q4-removable-token" + (active ? " is-fading-out" : "")
        : undefined,
    },
    children,
  );
};

const Q4FadeSwap = ({ out, inContent, renderText, signSwap, instant }) => {
  const { useLayoutEffect, useRef, useState } = React;
  const outMeasureRef = useRef(null);
  const inMeasureRef = useRef(null);
  const [widths, setWidths] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const fadeMs = signSwap ? Q4_SIGN_FADE_MS : Q4_FADE_SWAP_MS;
  const collapseMs = signSwap ? Q4_SIGN_COLLAPSE_MS : Q4_FADE_COLLAPSE_MS;

  useLayoutEffect(() => {
    setIsCollapsed(!!instant);
    setWidths(null);

    const outWidth = outMeasureRef.current?.getBoundingClientRect().width ?? 0;
    const inWidth = inMeasureRef.current?.getBoundingClientRect().width ?? 0;
    const outHeight =
      outMeasureRef.current?.getBoundingClientRect().height ?? 0;
    const inHeight = inMeasureRef.current?.getBoundingClientRect().height ?? 0;
    setWidths({
      out: outWidth,
      in: inWidth,
      height: Math.max(outHeight, inHeight),
    });

    if (instant) return undefined;

    const collapseTimer = setTimeout(() => {
      requestAnimationFrame(() => setIsCollapsed(true));
    }, fadeMs);

    return () => clearTimeout(collapseTimer);
  }, [out, inContent, fadeMs, instant]);

  const widthStyle =
    widths == null
      ? undefined
      : {
          width: (isCollapsed ? widths.in : widths.out) + "px",
          height: widths.height + "px",
          transition: isCollapsed ? "width " + collapseMs + "ms ease" : "none",
          "--q4-fade-swap-ms": fadeMs + "ms",
          "--q4-fade-collapse-ms": collapseMs + "ms",
        };

  return React.createElement(
    "span",
    {
      className:
        "q4-fade-swap" +
        (isCollapsed ? " is-collapsed" : "") +
        (signSwap ? " is-sign-swap" : ""),
      style: widthStyle,
    },
    React.createElement(
      "span",
      { className: "q4-fade-swap-ghost", "aria-hidden": "true" },
      renderText(out),
    ),
    React.createElement(
      "span",
      { className: "q4-fade-swap-measure", "aria-hidden": "true" },
      React.createElement(
        "span",
        { ref: outMeasureRef, className: "q4-fade-swap-measure-cell" },
        renderText(out),
      ),
      React.createElement(
        "span",
        { ref: inMeasureRef, className: "q4-fade-swap-measure-cell" },
        renderText(inContent),
      ),
    ),
    React.createElement("span", { className: "q4-fade-out" }, renderText(out)),
    React.createElement(
      "span",
      { className: "q4-fade-in" },
      renderText(inContent),
    ),
  );
};

const renderQ3MathFragment = (renderText, text) => {
  if (!text) return null;
  return String(text)
    .split(/(x'|y'|[xy])/)
    .map((part, index) => {
      if (part === "x" || part === "x'") {
        return renderStep4PrimedToken(
          renderText,
          "x",
          "x-token",
          "q3-x-" + index,
        );
      }
      if (part === "y" || part === "y'") {
        return renderStep4PrimedToken(
          renderText,
          "y",
          "y-token",
          "q3-y-" + index,
        );
      }
      return part
        ? React.createElement(
            "span",
            { key: "q3-t-" + index },
            renderText(part),
          )
        : null;
    });
};

const renderQ3RearrangeText = (renderText, text) => {
  if (text === "x" || text === "x'") {
    return renderStep4PrimedToken(renderText, "x", "x-token");
  }
  if (text === "y" || text === "y'") {
    return renderStep4PrimedToken(renderText, "y", "y-token");
  }
  return renderText(text);
};

const getCloneTokenClass = (el) => {
  if (!el) return null;
  if (el.classList.contains("x-token")) return "x-token";
  if (el.classList.contains("y-token")) return "y-token";
  return null;
};

const getCloneFontStyle = (el) => {
  if (!el) {
    return { fontFamily: "inherit", fontStyle: "normal", fontWeight: "400" };
  }
  const style = window.getComputedStyle(el);
  return {
    fontFamily: style.fontFamily,
    fontStyle: style.fontStyle,
    fontWeight: style.fontWeight,
  };
};

const renderQ3YTail = (renderText, fadeYBrackets, instant) =>
  React.createElement(
    React.Fragment,
    null,
    renderText("\u2212"),
    React.createElement(
      Q4FadeOutToken,
      { fade: fadeYBrackets, instant: instant },
      renderText("("),
    ),
    renderStep4PrimedToken(renderText, "y", "y-token"),
    React.createElement(
      Q4FadeOutToken,
      { fade: fadeYBrackets, instant: instant },
      renderText(")"),
    ),
    renderText("+1=0"),
  );

const renderQ3DistributeLine = (renderText, fadeOuterParens, instant) =>
  React.createElement(
    React.Fragment,
    null,
    React.createElement(
      Q4FadeOutToken,
      { fade: fadeOuterParens, instant: instant },
      renderText("("),
    ),
    renderText("\u22122\u00d7\u22124\u2212(\u22122)"),
    renderStep4PrimedToken(renderText, "x", "x-token"),
    React.createElement(
      Q4FadeOutToken,
      { fade: fadeOuterParens, instant: instant },
      renderText(")"),
    ),
    renderQ3YTail(renderText, false, instant),
  );

const renderQ3SubstitutedLine = (renderText, options) => {
  const { fadeInnerParens, fadeYBrackets, leading, instant } = options;
  return React.createElement(
    React.Fragment,
    null,
    leading || renderText("8"),
    renderText("\u2212"),
    React.createElement(
      Q4FadeOutToken,
      { fade: fadeInnerParens, instant: instant },
      renderText("("),
    ),
    renderText("\u22122"),
    React.createElement(
      Q4FadeOutToken,
      { fade: fadeInnerParens, instant: instant },
      renderText(")"),
    ),
    renderStep4PrimedToken(renderText, "x", "x-token"),
    renderQ3YTail(renderText, fadeYBrackets, instant),
  );
};

const renderQ3RemoveInnerParensLine = (renderText, instant) =>
  React.createElement(
    React.Fragment,
    null,
    renderText("8"),
    React.createElement(Q4FadeSwap, {
      out: "\u2212(\u22122)",
      inContent: "+2",
      renderText: renderText,
      signSwap: true,
      instant: instant,
    }),
    renderStep4PrimedToken(renderText, "x", "x-token"),
    renderQ3YTail(renderText, true, instant),
  );

const Q2MinusOneExpression = ({ stage, renderText, instant }) => {
  const { useEffect, useState } = React;
  const showInnerBrackets = stage === "bracketed";
  const [wrapActive, setWrapActive] = useState(
    stage === "simplify" || stage === "final" || instant,
  );
  const [simplifyActive, setSimplifyActive] = useState(
    stage === "simplify" || stage === "final" || (instant && stage === "wrap"),
  );

  useEffect(() => {
    if (stage === "final" || instant) {
      setWrapActive(stage !== "bracketed");
      setSimplifyActive(stage === "simplify" || stage === "final");
      if (instant && stage === "wrap") setWrapActive(true);
      if (instant && stage === "simplify") {
        setWrapActive(true);
        setSimplifyActive(true);
      }
      return undefined;
    }
    if (stage === "simplify") {
      setWrapActive(true);
      setSimplifyActive(false);
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => setSimplifyActive(true));
      });
      return () => cancelAnimationFrame(frame);
    }
    if (stage === "wrap") {
      setSimplifyActive(false);
      setWrapActive(false);
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => setWrapActive(true));
      });
      return () => cancelAnimationFrame(frame);
    }
    setWrapActive(false);
    setSimplifyActive(false);
    return undefined;
  }, [stage, instant]);

  const renderFactor = () =>
    React.createElement(
      "span",
      { className: "q2-minus1-factor" },
      React.createElement(
        "span",
        { className: "q2-minus1-neg" },
        renderText("\u22121"),
      ),
      React.createElement(
        "span",
        { className: "q2-minus1-times" },
        renderText(" \u00d7 "),
      ),
    );

  const renderOpSlot = (from, to) =>
    React.createElement(
      "span",
      { className: "q2-op-slot" },
      React.createElement(
        "span",
        { className: "q2-op-from" },
        renderText(from),
      ),
      React.createElement("span", { className: "q2-op-to" }, renderText(to)),
    );

  const renderVariable = (letter, tokenClass) => {
    const token = renderStep4PrimedToken(renderText, letter, tokenClass);
    if (!showInnerBrackets) return token;
    return React.createElement(
      React.Fragment,
      null,
      React.createElement("span", { className: "working-bracket" }, "("),
      token,
      React.createElement("span", { className: "working-bracket" }, ")"),
    );
  };

  const coreExpression = React.createElement(
    "span",
    { className: "q2-minus1-core" },
    React.createElement(
      "span",
      {
        className: showInnerBrackets
          ? "working-leading-negative"
          : "q2-core-leading-sign",
      },
      renderText("\u2212"),
    ),
    React.createElement("span", null, "5"),
    renderVariable("y", "y-token"),
    showInnerBrackets ? renderText(" \u2212 ") : renderOpSlot("\u2212", "+"),
    renderVariable("x", "x-token"),
    showInnerBrackets
      ? renderText(" \u2212 6")
      : React.createElement(
          React.Fragment,
          null,
          renderOpSlot("\u2212", "+"),
          renderText(" 6"),
        ),
  );

  const lineClassName =
    "q2-minus1-line" +
    (showInnerBrackets ? " is-bracketed" : "") +
    (wrapActive ? " is-wrapped" : "") +
    (simplifyActive ? " is-simplifying" : "");

  return React.createElement(
    "span",
    { className: lineClassName },
    React.createElement(
      "span",
      { className: "q2-minus1-lhs-group" },
      renderFactor(),
      React.createElement("span", { className: "q2-minus1-bracket" }, "("),
      coreExpression,
      React.createElement("span", { className: "q2-minus1-bracket" }, ")"),
    ),
    renderText(showInnerBrackets ? " = 0" : " = "),
    showInnerBrackets
      ? null
      : React.createElement(
          "span",
          { className: "q2-minus1-rhs-group" },
          renderFactor(),
          React.createElement("span", { className: "q2-minus1-zero" }, "0"),
        ),
  );
};

const MainCanvas = React.forwardRef(
  ({ step, question, onReadyChange }, ref) => {
    const {
      useState,
      useEffect,
      useLayoutEffect,
      useRef,
      useImperativeHandle,
      useCallback,
    } = React;

    const [typedProblem, setTypedProblem] = useState("");
    const [rightVisible, setRightVisible] = useState(false);
    const [introLineCount, setIntroLineCount] = useState(0);
    const [introDataCount, setIntroDataCount] = useState(0);
    const [ruleStatus, setRuleStatus] = useState("pending");
    const [ruleSelected, setRuleSelected] = useState(null);
    const [coordinatePhase, setCoordinatePhase] = useState(0);
    const [coordinateParts, setCoordinateParts] = useState({
      xBlue: false,
      xRhs: false,
      xOr: false,
      xYellowBox: false,
      xYellow: false,
      yBlue: false,
      yRhs: false,
      yOr: false,
      yYellowBox: false,
      yYellow: false,
    });
    const [formedStepThree, setFormedStepThree] = useState(false);
    const [showStepThreeCard, setShowStepThreeCard] = useState(false);
    const [formingPhase, setFormingPhase] = useState(false);
    const [collapseBeforeFinal, setCollapseBeforeFinal] = useState(false);
    const [subValues, setSubValues] = useState({ x: "", y: "" });
    const [activeBox, setActiveBox] = useState("x");
    const [boxStatus, setBoxStatus] = useState({ x: "active", y: "idle" });
    const [numpadFeedback, setNumpadFeedback] = useState("");
    const [simplifySelected, setSimplifySelected] = useState(null);
    const [simplifyStatus, setSimplifyStatus] = useState("pending");
    const [stepFourPhase, setStepFourPhase] = useState("idle");
    const [stepFourNegativesCombined, setStepFourNegativesCombined] =
      useState(false);
    const [stepFourBracketsGone, setStepFourBracketsGone] = useState(false);
    const [stepFourPrimesGone, setStepFourPrimesGone] = useState(false);
    const [stepFourGuideIndex, setStepFourGuideIndex] = useState(-1);
    const [stepFourManual, setStepFourManual] = useState(false);
    const [stepFourInstant, setStepFourInstant] = useState(false);
    const [stepFourGuideVisible, setStepFourGuideVisible] = useState(false);
    const [stepFourGuideDisplay, setStepFourGuideDisplay] = useState({
      title: "",
      note: "",
    });
    const [flyClone, setFlyClone] = useState(null);
    const [flyClones, setFlyClones] = useState([]);
    const [formingSources, setFormingSources] = useState([]);
    const timersRef = useRef([]);
    const stepFourManualRef = useRef(false);
    const stepFourGuideIndexRef = useRef(-1);
    const stepFourGuideDisplayRef = useRef({ title: "", note: "" });
    const stepFourInstantRef = useRef(false);
    const applyStepFourVisualRef = useRef(() => {});
    const playStepFourAutoRef = useRef(() => {});

    const data = APP_DATA;
    const labels = data.common.labels;
    const numpad = data.common.numpad;
    const step1Data = data.steps.step1;
    const step2Data = data.steps.step2;
    const step3Data = data.steps.step3;
    const step4Data = data.steps.step4;
    const activeQuestion = question || data.questions[0];
    const plainProblem = activeQuestion.problem.replace(/&minus;/g, "-");
    const emptyCoordinateParts = {
      xBlue: false,
      xRhs: false,
      xOr: false,
      xYellowBox: false,
      xYellow: false,
      yBlue: false,
      yRhs: false,
      yOr: false,
      yYellowBox: false,
      yYellow: false,
    };

    const clearTimers = useCallback(() => {
      timersRef.current.forEach((timer) => clearTimeout(timer));
      timersRef.current = [];
    }, []);

    const queue = useCallback((fn, delay) => {
      const timer = setTimeout(fn, delay);
      timersRef.current.push(timer);
      return timer;
    }, []);

    const makeReady = useCallback(
      (ready) => {
        if (typeof onReadyChange === "function") onReadyChange(ready);
      },
      [onReadyChange],
    );

    useImperativeHandle(
      ref,
      () => ({
        prepareStepChange: () => {
          clearTimers();
          setFlyClone(null);
          if (step === 2) {
            setFormedStepThree(false);
            setShowStepThreeCard(false);
            captureFormingSources();
          }
          if (step === 3) {
            setCollapseBeforeFinal(true);
            return 430;
          }
          return 0;
        },
      }),
      [clearTimers, step],
    );

    useEffect(() => {
      clearTimers();
      makeReady(false);
      setFlyClone(null);
      setRightVisible(false);

      if (step === 1) {
        setTypedProblem("");
        setIntroLineCount(0);
        setIntroDataCount(0);
        setRuleStatus("pending");
        setRuleSelected(null);
        setCoordinatePhase(0);
        setCoordinateParts(emptyCoordinateParts);

        let index = 0;
        const typeNext = () => {
          index += 1;
          setTypedProblem(plainProblem.slice(0, index));
          if (index < plainProblem.length) {
            queue(typeNext, 30);
          } else {
            queue(() => setRightVisible(true), 300);
            queue(() => {
              setIntroLineCount(1);
              queue(
                () =>
                  animateSelectorClone(
                    ".problem-equation-source",
                    ".line-equation-target",
                    () => setIntroDataCount(1),
                    { targetAlign: "left" },
                  ),
                120,
              );
            }, 900);
            queue(() => {
              setIntroLineCount(2);
              queue(
                () =>
                  animateSelectorClone(
                    ".problem-axis-source",
                    ".line-axis-target",
                    () => setIntroDataCount(2),
                    { targetAlign: "left" },
                  ),
                120,
              );
            }, 2100);
            queue(() => {
              setIntroLineCount(3);
              queue(() => setIntroDataCount(3), 250);
            }, 3300);
            queue(() => makeReady(true), 4350);
          }
        };
        queue(typeNext, 30);
      }

      if (step === 2) {
        setTypedProblem(plainProblem);
        setIntroLineCount(3);
        setIntroDataCount(3);
        setRuleStatus("pending");
        setRuleSelected(null);
        setCoordinatePhase(0);
        setCoordinateParts(emptyCoordinateParts);
        queue(() => setRightVisible(true), 60);
      }

      if (step === 3) {
        setTypedProblem(plainProblem);
        setFormedStepThree(false);
        setShowStepThreeCard(false);
        setFormingPhase(flyClones.length > 0);
        setCollapseBeforeFinal(false);
        setSubValues({ x: "", y: "" });
        setActiveBox("x");
        setBoxStatus({ x: "active", y: "idle" });
        setNumpadFeedback("");
        queue(() => setRightVisible(true), 80);
        queue(
          () => {
            setFlyClones([]);
            setFormingPhase(false);
            setFormedStepThree(true);
            queue(() => setShowStepThreeCard(true), 500);
          },
          formingSources.length > 0 ? 920 : 650,
        );
      }

      if (step !== 4) {
        setStepFourGuideIndex(-1);
        setStepFourManual(false);
        setStepFourInstant(false);
        setStepFourGuideVisible(false);
        setStepFourGuideDisplay({ title: "", note: "" });
        stepFourManualRef.current = false;
        stepFourGuideIndexRef.current = -1;
        stepFourGuideDisplayRef.current = { title: "", note: "" };
        stepFourInstantRef.current = false;
      }

      if (step === 4) {
        setTypedProblem(plainProblem);
        setRightVisible(true);
        setFormedStepThree(true);
        setShowStepThreeCard(false);
        setFormingPhase(false);
        setCollapseBeforeFinal(false);
        setSubValues(activeQuestion.step3.answers);
        setBoxStatus({ x: "plain", y: "plain" });
        setSimplifySelected(null);
        setSimplifyStatus("pending");
        setStepFourPhase("idle");
        setStepFourNegativesCombined(false);
        setStepFourBracketsGone(false);
        setStepFourPrimesGone(false);
        setStepFourGuideIndex(-1);
        setStepFourManual(false);
        setStepFourInstant(false);
        setStepFourGuideVisible(false);
        setStepFourGuideDisplay({ title: "", note: "" });
        stepFourManualRef.current = false;
        stepFourGuideIndexRef.current = -1;
        stepFourGuideDisplayRef.current = { title: "", note: "" };
        stepFourInstantRef.current = false;
      }

      return clearTimers;
    }, [step, plainProblem, activeQuestion, clearTimers, makeReady, queue]);

    useEffect(() => {
      const notes = activeQuestion.step4.simplificationArray || [];
      const guide = step4Data.guide || {};
      const shouldShow = step === 4 && stepFourGuideIndex >= 1;
      const nextTitle = shouldShow
        ? String(guide.title || "Step {n}:").replace(
            "{n}",
            String(stepFourGuideIndex),
          )
        : "";
      const nextNote = shouldShow
        ? (notes[stepFourGuideIndex] || {}).note || ""
        : "";
      const current = stepFourGuideDisplayRef.current;

      if (!shouldShow) {
        setStepFourGuideVisible(false);
        if (current.title || current.note) {
          stepFourGuideDisplayRef.current = { title: "", note: "" };
          setStepFourGuideDisplay({ title: "", note: "" });
        }
        return undefined;
      }

      if (current.title === nextTitle && current.note === nextNote) {
        setStepFourGuideVisible(true);
        return undefined;
      }

      const isFirst = !current.title && !current.note;
      if (isFirst) {
        stepFourGuideDisplayRef.current = { title: nextTitle, note: nextNote };
        setStepFourGuideDisplay(stepFourGuideDisplayRef.current);
        setStepFourGuideVisible(false);
        const frame = requestAnimationFrame(() => {
          requestAnimationFrame(() => setStepFourGuideVisible(true));
        });
        return () => cancelAnimationFrame(frame);
      }

      setStepFourGuideVisible(false);
      const timer = setTimeout(() => {
        stepFourGuideDisplayRef.current = { title: nextTitle, note: nextNote };
        setStepFourGuideDisplay(stepFourGuideDisplayRef.current);
        requestAnimationFrame(() => setStepFourGuideVisible(true));
      }, STEP4_GUIDE_FADE_MS);
      return () => clearTimeout(timer);
    }, [step, stepFourGuideIndex, activeQuestion, step4Data]);

    useEffect(() => {
      if (step !== 4) return;

      const wantNegativesCombined =
        stepFourPhase === "combineNegatives" ||
        stepFourPhase === "multipliedWithBrackets" ||
        stepFourPhase === "removeBrackets" ||
        stepFourPhase === "rearrangeFinal" ||
        stepFourPhase === "final";

      if (!wantNegativesCombined) {
        setStepFourNegativesCombined(false);
        return;
      }

      if (stepFourInstantRef.current) {
        setStepFourNegativesCombined(true);
        return;
      }

      setStepFourNegativesCombined(false);
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => setStepFourNegativesCombined(true));
      });
      return () => cancelAnimationFrame(frame);
    }, [step, stepFourPhase]);

    useEffect(() => {
      if (step !== 4) return;

      const wantBracketsGone =
        stepFourPhase === "removeBrackets" ||
        stepFourPhase === "rearrangeFinal" ||
        stepFourPhase === "final";

      if (!wantBracketsGone) {
        setStepFourBracketsGone(false);
        return;
      }

      if (stepFourInstantRef.current) {
        setStepFourBracketsGone(true);
        return;
      }

      setStepFourBracketsGone(false);
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => setStepFourBracketsGone(true));
      });
      return () => cancelAnimationFrame(frame);
    }, [step, stepFourPhase]);

    useEffect(() => {
      if (step !== 4) return;

      if (stepFourPhase !== "final") {
        setStepFourPrimesGone(false);
        return undefined;
      }

      if (stepFourInstantRef.current) {
        setStepFourPrimesGone(true);
        return undefined;
      }

      setStepFourPrimesGone(false);
      const timer = setTimeout(() => {
        setStepFourPrimesGone(true);
      }, STEP4_PRIME_HOLD_MS);
      return () => clearTimeout(timer);
    }, [step, stepFourPhase]);

    useLayoutEffect(() => {
      if (step !== 3) return;
      setFormedStepThree(false);
      setShowStepThreeCard(false);
    }, [step]);

    useLayoutEffect(() => {
      if (step !== 3 || formingSources.length === 0) return;
      const nextClones = [];
      formingSources.forEach((source, index) => {
        const targetEl = document.querySelector(source.targetSelector);
        if (!targetEl) return;
        const targetRect = targetEl.getBoundingClientRect();
        const targetFontSize =
          parseFloat(window.getComputedStyle(targetEl).fontSize) ||
          source.sourceFontSize ||
          42;
        nextClones.push({
          id: "forming-" + index,
          text: source.text,
          left: source.left,
          top: source.top,
          dx: targetRect.left + targetRect.width / 2 - source.left,
          dy: targetRect.top + targetRect.height / 2 - source.top,
          sourceFontSize: source.sourceFontSize || targetFontSize,
          targetFontSize: targetFontSize,
          active: false,
        });
      });
      setFlyClones(nextClones);
      setFormingSources([]);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setFlyClones((clones) =>
            clones.map((clone) => ({ ...clone, active: true })),
          );
        });
      });
    }, [step, formingSources]);

    const renderMathHtml = (html, className) =>
      React.createElement(
        "span",
        { className: className || "" },
        renderMathText(html),
      );

    const normalizeMathText = (text) =>
      text.replace(/&minus;/g, "-").replace(/&rarr;/g, "\u2192");

    const normalizeCloneText = (text) =>
      String(text || "").replace(/-/g, "\u2212");

    const step4Schedule = (baseMs, pauseIndex) =>
      Math.round(baseMs * 1.5) + STEP4_PAUSE_MS * pauseIndex;

    const renderMathText = (text) =>
      normalizeMathText(text)
        .split("")
        .map((char, index, chars) => {
          const prev = chars[index - 1] || "";
          const next = chars[index + 1] || "";
          const isLetterBefore = /[A-Za-z]/.test(prev);
          const isLetterAfter = /[A-Za-z]/.test(next);
          const isMathVariable =
            (char === "x" || char === "y" || char === "k") &&
            !isLetterBefore &&
            !isLetterAfter;
          if (isMathVariable) {
            return React.createElement(
              "span",
              { key: index, className: "math-var" },
              char,
            );
          }
          return char === "-" ? "\u2212" : char;
        });

    const renderProblemText = (text) => renderMathText(text);

    const renderRuleTuple = (answer) =>
      React.createElement(
        React.Fragment,
        null,
        React.createElement("span", null, "("),
        React.createElement("span", null, renderMathText(answer.left[0])),
        React.createElement("span", null, ", "),
        React.createElement("span", null, renderMathText(answer.left[1])),
        React.createElement("span", null, ") \u2192 ("),
        React.createElement(
          "span",
          { className: "rule-x-source" },
          renderMathText(answer.right[0]),
        ),
        React.createElement("span", null, ", "),
        React.createElement(
          "span",
          { className: "rule-y-source" },
          renderMathText(answer.right[1]),
        ),
        React.createElement("span", null, ")"),
      );

    const renderFormulaParts = (parts, options = {}) =>
      parts.map((part, index) => {
        if (part.var) {
          return React.createElement(
            "span",
            { key: index, className: part.var + "-token" },
            renderMathText(part.var),
          );
        }
        if (part.box) {
          return React.createElement(
            React.Fragment,
            { key: index },
            React.createElement("span", { className: "paren" }, "("),
            renderSubBox(part.box),
            React.createElement("span", { className: "paren" }, ")"),
          );
        }
        if (part.value) {
          return React.createElement(
            React.Fragment,
            { key: index },
            React.createElement("span", { className: "paren" }, "("),
            React.createElement(
              "span",
              { className: "sub-box plain " + part.color + "-token" },
              renderMathText(part.value),
            ),
            React.createElement("span", { className: "paren" }, ")"),
          );
        }
        return React.createElement(
          "span",
          { key: index },
          renderMathText(part.text || ""),
        );
      });

    const renderWorkingBracket = (char) =>
      React.createElement("span", { className: "working-bracket" }, char);

    const renderWorkingFormulaParts = (parts) =>
      parts.map((part, index) => {
        if (part.text) {
          return React.createElement(
            "span",
            { key: index },
            renderMathText(part.text),
          );
        }
        if (!part.value) return null;
        const value = normalizeMathText(part.value);
        const simplePositive = value.match(/^([xy])'$/);
        const simpleNegative = value.match(/^(\u2212|-)([xy])'$/);
        if (simplePositive) {
          return React.createElement(
            React.Fragment,
            { key: index },
            renderWorkingBracket("("),
            renderStep4PrimedToken(
              renderMathText,
              simplePositive[1],
              simplePositive[1] + "-token",
            ),
            renderWorkingBracket(")"),
          );
        }
        if (simpleNegative) {
          return React.createElement(
            React.Fragment,
            { key: index },
            renderWorkingBracket("("),
            React.createElement(
              "span",
              { className: "working-inner-negative" },
              renderMathText("\u2212"),
            ),
            renderStep4PrimedToken(
              renderMathText,
              simpleNegative[2],
              simpleNegative[2] + "-token",
            ),
            renderWorkingBracket(")"),
          );
        }
        if (value.includes("k")) {
          return React.createElement(
            React.Fragment,
            { key: index },
            renderWorkingBracket("("),
            React.createElement(
              "span",
              { className: "x-token" },
              renderMathText("2"),
            ),
            React.createElement(
              "span",
              { className: "q4-k-target x-token" },
              renderMathText("k"),
            ),
            renderMathText(" \u2212 "),
            renderStep4PrimedToken(renderMathText, "x", "x-token"),
            renderWorkingBracket(")"),
          );
        }
        return React.createElement(
          React.Fragment,
          { key: index },
          renderFormulaParts([part]),
        );
      });

    const renderStructuredProblem = () =>
      (() => {
        const problem = normalizeMathText(activeQuestion.problem);
        const equation = normalizeMathText(activeQuestion.lineEquation);
        const axis = normalizeMathText(activeQuestion.reflectionAxis);
        const axisValue = activeQuestion.reflectionAxisValue
          ? normalizeMathText(activeQuestion.reflectionAxisValue)
          : "";
        const equationIndex = problem.indexOf(equation);
        const axisIndex = problem.indexOf(
          axis,
          equationIndex + equation.length,
        );
        if (equationIndex < 0 || axisIndex < 0) {
          return React.createElement("span", null, renderMathText(problem));
        }
        const axisValueIndex = axisValue ? axis.indexOf(axisValue) : -1;
        const renderedAxis =
          axisValueIndex >= 0
            ? React.createElement(
                "span",
                { className: "problem-axis-source axis-token" },
                renderMathText(axis.slice(0, axisValueIndex)),
                React.createElement(
                  "span",
                  { className: "axis-value-source" },
                  renderMathText(axisValue),
                ),
                renderMathText(axis.slice(axisValueIndex + axisValue.length)),
              )
            : React.createElement(
                "span",
                { className: "problem-axis-source axis-token" },
                renderMathText(axis),
              );
        return React.createElement(
          "span",
          null,
          renderMathText(problem.slice(0, equationIndex)),
          React.createElement(
            "span",
            { className: "problem-equation-source" },
            renderMathText(equation),
          ),
          renderMathText(
            problem.slice(equationIndex + equation.length, axisIndex),
          ),
          renderedAxis,
          renderMathText(problem.slice(axisIndex + axis.length)),
        );
      })();

    const renderProblem = () =>
      React.createElement(
        "div",
        { className: "line-problem-card" },
        step === 1 && typedProblem.length < plainProblem.length
          ? React.createElement("span", null, renderProblemText(typedProblem))
          : renderStructuredProblem(),
      );

    const renderIntroLine = (index, label, value, kind) => {
      const visible = introLineCount >= index;
      return React.createElement(
        "div",
        { className: "sol-line" + (visible ? " is-visible" : "") },
        React.createElement(
          "div",
          { className: "sol-info" },
          renderMathText(label),
        ),
        React.createElement(
          "div",
          {
            className:
              "sol-data " +
              (kind === "equation"
                ? "line-equation-target"
                : kind === "axis"
                  ? "line-axis-target"
                  : ""),
          },
          kind === "question"
            ? React.createElement("span", { className: "jump-question" }, "??")
            : introDataCount >= index
              ? renderMathHtml(value, kind === "axis" ? "axis-token" : "")
              : null,
        ),
      );
    };

    const animateTextClone = (sourceEl, targetEl, onDone, options = {}) => {
      if (!sourceEl || !targetEl) {
        if (typeof onDone === "function") onDone();
        return;
      }
      const sourceRect = sourceEl.getBoundingClientRect();
      const targetRect = targetEl.getBoundingClientRect();
      const sourceFontSize =
        parseFloat(window.getComputedStyle(sourceEl).fontSize) || 42;
      const targetFontSize =
        parseFloat(window.getComputedStyle(targetEl).fontSize) ||
        sourceFontSize;
      const targetPaddingLeft =
        parseFloat(window.getComputedStyle(targetEl).paddingLeft) || 0;
      const targetCenterX =
        options.targetAlign === "left"
          ? targetRect.left + targetPaddingLeft + sourceRect.width / 2
          : targetRect.left + targetRect.width / 2;
      const dx = targetCenterX - (sourceRect.left + sourceRect.width / 2);
      const dy =
        targetRect.top +
        targetRect.height / 2 -
        (sourceRect.top + sourceRect.height / 2);
      const flyDuration = options.duration || 760;
      const preserveHtml = options.preserveHtml === true;
      const cloneFont = getCloneFontStyle(sourceEl);
      setFlyClone({
        text: preserveHtml
          ? null
          : normalizeCloneText(sourceEl.textContent.trim()),
        html: preserveHtml ? sourceEl.innerHTML : null,
        tokenClass: preserveHtml ? null : getCloneTokenClass(sourceEl),
        left: sourceRect.left + sourceRect.width / 2,
        top: sourceRect.top + sourceRect.height / 2,
        dx: dx,
        dy: dy,
        sourceFontSize: sourceFontSize,
        targetFontSize: targetFontSize,
        fontFamily: cloneFont.fontFamily,
        fontStyle: cloneFont.fontStyle,
        fontWeight: cloneFont.fontWeight,
        active: false,
        duration: flyDuration,
      });
      requestAnimationFrame(() => {
        requestAnimationFrame(() =>
          setFlyClone((clone) => (clone ? { ...clone, active: true } : clone)),
        );
      });
      queue(() => {
        setFlyClone(null);
        if (typeof onDone === "function") onDone();
      }, flyDuration);
    };

    const animateSelectorClone = (
      sourceSelector,
      targetSelector,
      onDone,
      options,
    ) => {
      animateTextClone(
        document.querySelector(sourceSelector),
        document.querySelector(targetSelector),
        onDone,
        options,
      );
    };

    const animateTokenClones = (pairs, onDone, options = {}) => {
      const flyDuration = options.duration || 780;
      const nextClones = [];
      pairs.forEach(([sourceSelector, targetSelector], index) => {
        const sourceEl = document.querySelector(sourceSelector);
        const targetEl = document.querySelector(targetSelector);
        if (!sourceEl || !targetEl || !sourceEl.textContent.trim()) return;
        const sourceRect = sourceEl.getBoundingClientRect();
        const targetRect = targetEl.getBoundingClientRect();
        const sourceFontSize =
          parseFloat(window.getComputedStyle(sourceEl).fontSize) || 42;
        const targetFontSize =
          parseFloat(window.getComputedStyle(targetEl).fontSize) ||
          sourceFontSize;
        const cloneFont = getCloneFontStyle(sourceEl);
        nextClones.push({
          id: "token-clone-" + Date.now() + "-" + index,
          text: normalizeCloneText(sourceEl.textContent.trim()),
          tokenClass: getCloneTokenClass(sourceEl),
          left: sourceRect.left + sourceRect.width / 2,
          top: sourceRect.top + sourceRect.height / 2,
          dx:
            targetRect.left +
            targetRect.width / 2 -
            (sourceRect.left + sourceRect.width / 2),
          dy:
            targetRect.top +
            targetRect.height / 2 -
            (sourceRect.top + sourceRect.height / 2),
          sourceFontSize: sourceFontSize,
          targetFontSize: targetFontSize,
          fontFamily: cloneFont.fontFamily,
          fontStyle: cloneFont.fontStyle,
          fontWeight: cloneFont.fontWeight,
          active: false,
          duration: flyDuration,
        });
      });

      if (nextClones.length === 0) {
        if (typeof onDone === "function") onDone();
        return;
      }

      setFlyClones((clones) => [...clones, ...nextClones]);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setFlyClones((clones) =>
            clones.map((clone) =>
              nextClones.some((nextClone) => nextClone.id === clone.id)
                ? { ...clone, active: true }
                : clone,
            ),
          );
        });
      });
      queue(() => {
        setFlyClones((clones) =>
          clones.filter(
            (clone) =>
              !nextClones.some((nextClone) => nextClone.id === clone.id),
          ),
        );
        if (typeof onDone === "function") onDone();
      }, flyDuration);
    };

    const STEP4_FLY = { duration: STEP4_FLY_MS, preserveHtml: true };

    const setStepFourInstantMode = (instant) => {
      stepFourInstantRef.current = instant;
      setStepFourInstant(instant);
    };

    const applyStepFourVisual = (id, mode) => {
      setFlyClone(null);
      setFlyClones([]);
      const instant = mode === "complete";
      setStepFourInstantMode(instant);
      if (id !== "final" || mode === "start") makeReady(false);

      const startCopy = () => {
        setStepFourPhase("building");
        queue(() => {
          animateSelectorClone(
            ".step4-substitution-expression",
            ".step4-working-line-target",
            () => setStepFourPhase("copied"),
            STEP4_FLY,
          );
        }, 30);
      };

      const startReplaceK = () => {
        setStepFourPhase("copied");
        queue(() => {
          animateSelectorClone(
            ".axis-value-source",
            ".q4-k-target",
            () => setStepFourPhase("replaceK"),
            STEP4_FLY,
          );
        }, 40);
      };

      const startDistribute = () => {
        setStepFourPhase("distributePrep");
        queue(() => {
          animateTokenClones(
            [
              [".q4-distribute-source", ".q4-distribute-target-a"],
              [".q4-distribute-source", ".q4-distribute-target-b"],
            ],
            () => setStepFourPhase("distribute"),
            STEP4_FLY,
          );
        }, STEP4_PAUSE_MS);
      };

      if (id === "copy") {
        if (mode === "start") startCopy();
        else setStepFourPhase("copied");
        return;
      }
      if (id === "replaceK") {
        if (mode === "start") startReplaceK();
        else setStepFourPhase("replaceK");
        return;
      }
      if (id === "distribute") {
        if (mode === "start") startDistribute();
        else setStepFourPhase("distribute");
        return;
      }
      if (id === "final") {
        setStepFourPhase("final");
        if (typeof playSound === "function" && mode === "start") {
          playSound("congrats");
        }
        if (mode === "complete") {
          setStepFourPrimesGone(true);
          makeReady(true);
        } else {
          queue(
            () => makeReady(true),
            STEP4_PRIME_HOLD_MS + STEP4_PRIME_FADE_MS,
          );
        }
        return;
      }

      const phaseById = {
        simplifyK: "simplifyK",
        removeProductParens: "removeProductParens",
        substitute8: "substitute8",
        removeInnerParens: "removeInnerParens",
        cleanSigns: "cleanSigns",
        rearrangeFinal: "rearrangeFinal",
        combineConstants: "combineConstants",
        combineNegatives: "combineNegatives",
        multipliedWithBrackets: "multipliedWithBrackets",
        removeBrackets: "removeBrackets",
        multiplyByMinus1: "multiplyByMinus1",
        simplifyMultiply: "simplifyMultiply",
      };
      if (phaseById[id]) setStepFourPhase(phaseById[id]);
    };

    applyStepFourVisualRef.current = applyStepFourVisual;

    const playStepFourAutoFrom = (index) => {
      if (stepFourManualRef.current) return;
      const specs = getStepFourGuideSpecs(activeQuestion.step4);
      if (index < 0 || index >= specs.length) return;
      stepFourGuideIndexRef.current = index;
      setStepFourGuideIndex(index);
      applyStepFourVisual(specs[index].id, "start");
      queue(() => {
        if (stepFourManualRef.current) return;
        if (index >= specs.length - 1) {
          applyStepFourVisualRef.current(specs[index].id, "complete");
          return;
        }
        playStepFourAutoRef.current(index + 1);
      }, specs[index].animMs + STEP4_READ_PAUSE_MS);
    };

    playStepFourAutoRef.current = playStepFourAutoFrom;

    const enterStepFourManual = () => {
      clearTimers();
      setFlyClone(null);
      setFlyClones([]);
      if (!stepFourManualRef.current) {
        stepFourManualRef.current = true;
        setStepFourManual(true);
      }
    };

    const handleStepFourPrev = () => {
      enterStepFourManual();
      const specs = getStepFourGuideSpecs(activeQuestion.step4);
      const current = Math.max(0, stepFourGuideIndexRef.current);
      const target = current <= 1 ? 1 : current - 1;
      stepFourGuideIndexRef.current = target;
      setStepFourGuideIndex(target);
      applyStepFourVisual(specs[target].id, "complete");
    };

    const handleStepFourNext = () => {
      enterStepFourManual();
      const specs = getStepFourGuideSpecs(activeQuestion.step4);
      const current = Math.max(1, stepFourGuideIndexRef.current);
      if (current >= specs.length - 1) {
        applyStepFourVisual(specs[specs.length - 1].id, "complete");
        return;
      }
      const next = current + 1;
      stepFourGuideIndexRef.current = next;
      setStepFourGuideIndex(next);
      applyStepFourVisual(specs[next].id, "start");
    };

    const animateYellowCoordinateBox = (side, onDone) => {
      const isX = side === "x";
      const yellowBoxKey = isX ? "xYellowBox" : "yYellowBox";
      const yellowDoneKey = isX ? "xYellow" : "yYellow";
      const sourcePrefix = ".coord-" + side + "-blue-";
      const targetPrefix = ".coord-" + side + "-yellow-";
      const card = activeQuestion.coordinateCard;
      const coordinateTokens = splitCoordinateSide(
        isX ? card.xBlue : card.yBlue,
        isX ? card.xYellow : card.yYellow,
      );
      setCoordinateParts((parts) => ({ ...parts, [yellowBoxKey]: true }));
      queue(() => {
        const simplePairs =
          coordinateTokens.rhs.length > 1 &&
          coordinateTokens.yellowRhs.length > 1
            ? [
                [
                  sourcePrefix +
                    "rhs-token-" +
                    (coordinateTokens.rhs.length - 1),
                  targetPrefix + "lhs-token-0",
                ],
                [sourcePrefix + "eq", targetPrefix + "eq"],
                [sourcePrefix + "rhs-token-0", targetPrefix + "rhs-token-0"],
                [
                  sourcePrefix + "image-var",
                  targetPrefix +
                    "rhs-token-" +
                    (coordinateTokens.yellowRhs.length - 1),
                ],
              ]
            : [
                [sourcePrefix + "rhs-token-0", targetPrefix + "lhs-token-0"],
                [sourcePrefix + "eq", targetPrefix + "eq"],
                [sourcePrefix + "image-var", targetPrefix + "rhs-token-0"],
              ];
        const pairs =
          activeQuestion.step4.simplifyKind === "verticalLineK" && side === "x"
            ? [
                [sourcePrefix + "rhs-token-1", targetPrefix + "lhs-token-0"],
                [sourcePrefix + "eq", targetPrefix + "eq"],
                [sourcePrefix + "rhs-token-0", targetPrefix + "rhs-token-1"],
                [sourcePrefix + "rhs-token-3", targetPrefix + "rhs-token-0"],
                [sourcePrefix + "image-var", targetPrefix + "rhs-token-2"],
              ]
            : simplePairs;
        animateTokenClones(pairs, () => {
          setCoordinateParts((parts) => ({
            ...parts,
            [yellowDoneKey]: true,
          }));
          if (typeof onDone === "function") onDone();
        });
      }, 80);
    };

    const captureFormingSources = () => {
      const rulePairs =
        activeQuestion.step4.simplifyKind === "reflectNegativeDiagonal"
          ? [
              [".coord-y-yellow", ".formed-rule-x"],
              [".coord-x-yellow", ".formed-rule-y"],
            ]
          : [
              [".coord-x-yellow", ".formed-rule-x"],
              [".coord-y-yellow", ".formed-rule-y"],
            ];
      const pairs = [
        ...rulePairs,
        [".line-equation-target", ".formed-given-line"],
      ];
      const nextSources = [];
      pairs.forEach(([sourceSelector, targetSelector], index) => {
        const sourceEl = document.querySelector(sourceSelector);
        if (!sourceEl) return;
        const sourceRect = sourceEl.getBoundingClientRect();
        const sourceFontSize =
          parseFloat(window.getComputedStyle(sourceEl).fontSize) || 42;
        nextSources.push({
          id: "forming-" + index,
          text: sourceEl.textContent.trim(),
          left: sourceRect.left + sourceRect.width / 2,
          top: sourceRect.top + sourceRect.height / 2,
          sourceFontSize: sourceFontSize,
          targetSelector: targetSelector,
        });
      });
      setFormingSources(nextSources);
    };

    const handleRuleOption = (index, event) => {
      if (ruleStatus !== "pending") return;
      const isCorrect = index === activeQuestion.ruleCorrectIndex;
      setRuleSelected(index);
      if (typeof playSound === "function")
        playSound(isCorrect ? "correct" : "wrong");

      if (!isCorrect) {
        setRuleStatus("wrong");
        queue(() => {
          setRuleSelected(null);
          setRuleStatus("pending");
        }, 650);
        return;
      }

      setRuleStatus("animating");
      makeReady(false);
      const target = document.querySelector(".intro-rule-answer-target");
      animateTextClone(event.currentTarget, target, () => {
        setRuleStatus("correct");
        const cardDelay = 600;
        const pause = 500;
        const flyDuration = 760;
        const start1 = cardDelay;
        const fly1 = start1 + pause;
        const or1 = fly1 + flyDuration + pause;
        const yellow1 = or1 + pause;
        const start2 = yellow1 + flyDuration + pause;
        const fly2 = start2 + pause;
        const or2 = fly2 + flyDuration + pause;
        const yellow2 = or2 + pause;

        queue(() => {
          setCoordinatePhase(1);
          setCoordinateParts((parts) => ({ ...parts, xBlue: true }));
        }, start1);
        queue(
          () =>
            animateSelectorClone(".rule-x-source", ".coord-x-rhs", () => {
              setCoordinateParts((parts) => ({ ...parts, xRhs: true }));
            }),
          fly1,
        );
        queue(
          () => setCoordinateParts((parts) => ({ ...parts, xOr: true })),
          or1,
        );
        queue(() => animateYellowCoordinateBox("x"), yellow1);
        queue(
          () => setCoordinateParts((parts) => ({ ...parts, yBlue: true })),
          start2,
        );
        queue(
          () =>
            animateSelectorClone(".rule-y-source", ".coord-y-rhs", () => {
              setCoordinateParts((parts) => ({ ...parts, yRhs: true }));
            }),
          fly2,
        );
        queue(
          () => setCoordinateParts((parts) => ({ ...parts, yOr: true })),
          or2,
        );
        queue(() => animateYellowCoordinateBox("y"), yellow2);
        queue(() => makeReady(true), yellow2 + flyDuration + pause);
      });
    };

    const renderRuleOptions = () =>
      React.createElement(
        "div",
        { className: "line-options no-feedback-options" },
        activeQuestion.ruleOptions.map((option, index) => {
          let className = "line-option";
          if (
            ruleSelected === index &&
            index === activeQuestion.ruleCorrectIndex &&
            ruleStatus !== "pending"
          ) {
            className += " is-correct";
          }
          if (
            ruleSelected === index &&
            index !== activeQuestion.ruleCorrectIndex &&
            ruleStatus === "wrong"
          ) {
            className += " is-wrong";
          }
          return React.createElement("button", {
            key: index,
            type: "button",
            className: className,
            disabled: ruleStatus !== "pending",
            children: renderMathText(option.replace(/&rarr;/g, "\u2192")),
            onClick: (event) => handleRuleOption(index, event),
          });
        }),
      );

    const splitCoordinateSide = (blueParts, yellowText) => {
      const imageVar = normalizeMathText(blueParts[0]).split("=")[0].trim();
      const rhs = normalizeMathText(blueParts[1]).trim();
      const yellowPieces = normalizeMathText(yellowText).split("=");
      const yellowLhs = (yellowPieces[0] || "").trim();
      const yellowRhs = (yellowPieces[1] || "").trim();
      const splitTerm = (term) =>
        (term.match(/2k|[xy]'?|k|[+\-\u2212]/g) || [term]).map((token) =>
          token === "-" ? "\u2212" : token,
        );
      return {
        imageVar: imageVar,
        rhs: splitTerm(rhs),
        yellowLhs: splitTerm(yellowLhs),
        yellowRhs: splitTerm(yellowRhs),
      };
    };

    const renderCoordinateToken = (text, className, visible = true) =>
      React.createElement(
        "span",
        {
          className:
            "coord-token " + className + (visible ? "" : " is-pending"),
        },
        text ? renderMathText(text) : "",
      );

    const renderCoordinateTokens = (tokens, prefix, visible = true) =>
      tokens.map((token, index) =>
        renderCoordinateToken(token, prefix + "token-" + index, visible),
      );

    const renderCoordinateColumn = (side) => {
      const isX = side === "x";
      const card = activeQuestion.coordinateCard;
      const blueParts = isX ? card.xBlue : card.yBlue;
      const yellowText = isX ? card.xYellow : card.yYellow;
      const coordinateTokens = splitCoordinateSide(blueParts, yellowText);
      const firstVisible = isX ? coordinateParts.xBlue : coordinateParts.yBlue;
      const rhsVisible = isX ? coordinateParts.xRhs : coordinateParts.yRhs;
      const orVisible = isX ? coordinateParts.xOr : coordinateParts.yOr;
      const yellowBoxVisible = isX
        ? coordinateParts.xYellowBox || coordinateParts.xYellow
        : coordinateParts.yYellowBox || coordinateParts.yYellow;
      const thirdVisible = isX
        ? coordinateParts.xYellow
        : coordinateParts.yYellow;
      const bluePrefix = "coord-" + side + "-blue-";
      const yellowPrefix = "coord-" + side + "-yellow-";
      return React.createElement(
        "div",
        { className: "coordinate-column" },
        React.createElement(
          "div",
          {
            className:
              "coordinate-box blue-box " +
              (isX ? "coord-x-blue" : "coord-y-blue") +
              (firstVisible ? " is-visible" : ""),
          },
          React.createElement(
            React.Fragment,
            null,
            renderCoordinateToken(
              coordinateTokens.imageVar,
              bluePrefix + "image-var " + bluePrefix + "image-token-0",
            ),
            renderCoordinateToken("=", bluePrefix + "eq"),
            React.createElement(
              "span",
              { className: isX ? "coord-x-rhs" : "coord-y-rhs" },
              renderCoordinateTokens(
                coordinateTokens.rhs,
                bluePrefix + "rhs-",
                rhsVisible,
              ),
            ),
          ),
        ),
        React.createElement(
          "div",
          { className: "coordinate-or" + (orVisible ? " is-visible" : "") },
          labels.or,
        ),
        React.createElement(
          "div",
          {
            className:
              "coordinate-box yellow-box " +
              (isX ? "coord-x-yellow" : "coord-y-yellow") +
              (yellowBoxVisible ? " is-visible" : ""),
          },
          React.createElement(
            React.Fragment,
            null,
            renderCoordinateTokens(
              coordinateTokens.yellowLhs,
              yellowPrefix + "lhs-",
              thirdVisible,
            ),
            renderCoordinateToken("=", yellowPrefix + "eq", thirdVisible),
            renderCoordinateTokens(
              coordinateTokens.yellowRhs,
              yellowPrefix + "rhs-",
              thirdVisible,
            ),
          ),
        ),
      );
    };

    const renderStepOneOrTwoMath = () =>
      React.createElement(
        React.Fragment,
        null,
        renderIntroLine(
          1,
          labels.equationGivenLine,
          activeQuestion.lineEquation,
          "equation",
        ),
        renderIntroLine(
          2,
          labels.lineReflection,
          activeQuestion.reflectionAxis,
          "axis",
        ),
        React.createElement(
          "div",
          {
            className: "sol-line" + (introLineCount >= 3 ? " is-visible" : ""),
          },
          React.createElement(
            "div",
            { className: "sol-info" },
            renderMathText(activeQuestion.ruleLineLabel),
          ),
          React.createElement(
            "div",
            { className: "sol-data intro-rule-answer-target" },
            ruleStatus === "correct"
              ? renderRuleTuple(activeQuestion.ruleAnswer)
              : React.createElement(
                  "span",
                  { className: "jump-question" },
                  "??",
                ),
          ),
        ),
        step === 2 && coordinatePhase > 0
          ? React.createElement(
              "div",
              { className: "sol-card coordinate-card is-visible" },
              React.createElement(
                "div",
                { className: "sol-card-title" },
                renderMathText(labels.coordinatesImage),
              ),
              React.createElement(
                "div",
                { className: "coordinate-card-grid" },
                renderCoordinateColumn("x"),
                renderCoordinateColumn("y"),
              ),
            )
          : null,
      );

    const handleNumpadValue = (value) => {
      if (!activeBox || boxStatus[activeBox] === "correct") return;
      setNumpadFeedback("");
      setBoxStatus((prev) => ({ ...prev, [activeBox]: "active" }));
      setSubValues((prev) => ({
        ...prev,
        [activeBox]: prev[activeBox] + value,
      }));
    };

    const handleNumpadClear = () => {
      if (!activeBox || boxStatus[activeBox] === "correct") return;
      if (typeof playSound === "function") playSound("click");
      setNumpadFeedback("");
      setBoxStatus((prev) => ({ ...prev, [activeBox]: "active" }));
      setSubValues((prev) => ({ ...prev, [activeBox]: "" }));
    };

    const handleNumpadSubmit = () => {
      if (!activeBox || boxStatus[activeBox] === "correct") return;
      const expected = activeQuestion.step3.answers[activeBox];
      const userValue = subValues[activeBox].replace(/\s/g, "");
      const isCorrect = userValue === expected;
      if (typeof playSound === "function")
        playSound(isCorrect ? "correct" : "wrong");

      if (!isCorrect) {
        setNumpadFeedback(
          activeBox === "x"
            ? step3Data.feedback.wrongX
            : step3Data.feedback.wrongY,
        );
        setBoxStatus((prev) => ({ ...prev, [activeBox]: "wrong" }));
        queue(() => {
          setSubValues((prev) => ({ ...prev, [activeBox]: "" }));
          setBoxStatus((prev) => ({ ...prev, [activeBox]: "active" }));
        }, 650);
        return;
      }

      setNumpadFeedback("");
      setSubValues((prev) => ({ ...prev, [activeBox]: expected }));
      if (activeBox === "x") {
        setBoxStatus({ x: "correct", y: "active" });
        setActiveBox("y");
      } else {
        setBoxStatus({ x: "correct", y: "correct" });
        setActiveBox(null);
        makeReady(true);
      }
    };

    const renderSubBox = (name) =>
      React.createElement(
        "span",
        {
          className:
            "sub-box " +
            name +
            "-token " +
            (boxStatus[name] || "idle") +
            (activeBox === name ? " is-active" : ""),
        },
        subValues[name]
          ? renderMathText(subValues[name])
          : activeBox === name
            ? React.createElement("span", { className: "caret" })
            : "",
      );

    const renderStepThreeMath = () =>
      React.createElement(
        React.Fragment,
        null,
        React.createElement(
          "div",
          {
            className:
              "sol-line transform-line collapsible-line" +
              (formedStepThree ? " is-visible" : "") +
              (collapseBeforeFinal ? " is-collapsing" : ""),
          },
          React.createElement(
            "div",
            { className: "sol-info" },
            renderMathText(labels.ruleReflection),
          ),
          React.createElement(
            "div",
            { className: "sol-data rule-pair" },
            React.createElement(
              "span",
              { className: "x-token formed-rule-x" },
              formedStepThree
                ? renderMathText(activeQuestion.step3.ruleX)
                : null,
            ),
            React.createElement(
              "span",
              { className: "y-token formed-rule-y" },
              formedStepThree
                ? renderMathText(activeQuestion.step3.ruleY)
                : null,
            ),
          ),
        ),
        React.createElement(
          "div",
          {
            className:
              "sol-line transform-line collapsible-line" +
              (formedStepThree ? " is-visible" : "") +
              (collapseBeforeFinal ? " is-collapsing" : ""),
          },
          React.createElement(
            "div",
            { className: "sol-info" },
            renderMathText(labels.givenLine),
          ),
          React.createElement(
            "div",
            { className: "sol-data equation-large formed-given-line" },
            renderFormulaParts(activeQuestion.step3.givenParts),
          ),
        ),
        React.createElement(
          "div",
          {
            className:
              "sol-card substitution-card" +
              (showStepThreeCard ? " is-visible" : ""),
          },
          React.createElement(
            "div",
            { className: "sol-card-title" },
            renderMathText(labels.equationReflectedLine),
          ),
          React.createElement(
            "div",
            { className: "substitution-expression" },
            renderFormulaParts(activeQuestion.step3.answerParts),
          ),
        ),
      );

    const handleSimplifyOption = (index, event) => {
      if (simplifyStatus === "correct") return;
      const isCorrect = index === activeQuestion.step4.correctIndex;
      setSimplifySelected(index);
      if (typeof playSound === "function")
        playSound(isCorrect ? "correct" : "wrong");

      if (!isCorrect) {
        setSimplifyStatus("wrong");
        queue(() => {
          setSimplifySelected(null);
          setSimplifyStatus("pending");
        }, 850);
        return;
      }

      setSimplifyStatus("correct");
      setStepFourPhase("selected");
      stepFourGuideIndexRef.current = 0;
      setStepFourGuideIndex(0);
      queue(() => setStepFourPhase("feedbackCollapsed"), step4Schedule(600, 1));
      queue(() => {
        stepFourManualRef.current = false;
        setStepFourManual(false);
        playStepFourAutoFrom(0);
      }, step4Schedule(1300, 2));
    };

    const renderStepFourWorkingLine = () => {
      const visible =
        stepFourPhase === "copied" ||
        stepFourPhase === "removeBrackets" ||
        stepFourPhase === "combineNegatives" ||
        stepFourPhase === "multipliedWithBrackets" ||
        stepFourPhase === "multiplyByMinus1" ||
        stepFourPhase === "simplifyMultiply" ||
        stepFourPhase === "rearrangeFinal" ||
        stepFourPhase === "replaceK" ||
        stepFourPhase === "simplifyK" ||
        stepFourPhase === "distributePrep" ||
        stepFourPhase === "distribute" ||
        stepFourPhase === "removeProductParens" ||
        stepFourPhase === "substitute8" ||
        stepFourPhase === "removeInnerParens" ||
        stepFourPhase === "cleanSigns" ||
        stepFourPhase === "combineConstants" ||
        stepFourPhase === "final";
      const final = stepFourPhase === "final";
      const bracketsGone = stepFourBracketsGone;
      const negativesCombined = stepFourNegativesCombined;
      const primesGone = stepFourPrimesGone;
      const instant = stepFourInstant;

      const className =
        "step4-working-line step4-working-line-target " +
        activeQuestion.step4.simplifyKind +
        (visible ? " is-visible" : "") +
        (bracketsGone ? " brackets-gone" : "") +
        (negativesCombined ? " negatives-combined" : "") +
        (primesGone ? " primes-gone" : "") +
        (final ? " is-final" : "");

      if (activeQuestion.step4.simplifyKind === "plusNegative") {
        return React.createElement(
          "div",
          { className: className },
          React.createElement("span", null, "4"),
          React.createElement("span", { className: "working-bracket" }, "("),
          renderStep4PrimedToken(renderMathText, "x", "x-token"),
          React.createElement("span", { className: "working-bracket" }, ")"),
          React.createElement(
            "span",
            { className: "working-operator-slot" },
            React.createElement(
              "span",
              { className: "working-plus-original" },
              "+",
            ),
            React.createElement(
              "span",
              { className: "working-minus-result" },
              renderMathText("\u2212"),
            ),
          ),
          React.createElement("span", { className: "working-bracket" }, "("),
          React.createElement(
            "span",
            { className: "working-inner-negative" },
            renderMathText("\u2212"),
          ),
          renderStep4PrimedToken(renderMathText, "y", "y-token"),
          React.createElement("span", { className: "working-bracket" }, ")"),
          React.createElement("span", null, " = 6"),
        );
      }

      if (activeQuestion.step4.simplifyKind === "verticalLineK") {
        if (final) {
          return React.createElement(
            "div",
            { className: className },
            renderQ3MathFragment(
              renderMathText,
              normalizeMathText(activeQuestion.step4.finalAnswer),
            ),
          );
        }
        if (stepFourPhase === "rearrangeFinal") {
          return React.createElement(
            "div",
            { className: className },
            React.createElement(ReflectionRearrangeAnimation, {
              from: "8+2x'\u2212y'+1=0",
              to: "2x'\u2212y'+8+1=0",
              renderText: (text) => renderQ3RearrangeText(renderMathText, text),
              instant: instant,
            }),
          );
        }
        if (stepFourPhase === "combineConstants") {
          return React.createElement(
            "div",
            { className: className + " q4-phase-line" },
            renderQ3MathFragment(renderMathText, "2x\u2212y+"),
            React.createElement(Q4FadeSwap, {
              out: "8+1",
              inContent: "9",
              renderText: renderMathText,
              instant: instant,
            }),
            renderMathText("=0"),
          );
        }
        if (stepFourPhase === "substitute8") {
          return React.createElement(
            "div",
            { className: className + " q4-phase-line" },
            renderQ3SubstitutedLine(renderMathText, {
              leading: React.createElement(Q4FadeSwap, {
                out: "\u22122\u00d7\u22124",
                inContent: "8",
                renderText: renderMathText,
                instant: instant,
              }),
              fadeInnerParens: false,
              fadeYBrackets: false,
              instant: instant,
            }),
          );
        }
        if (stepFourPhase === "removeInnerParens") {
          return React.createElement(
            "div",
            { className: className + " q4-phase-line" },
            renderQ3RemoveInnerParensLine(renderMathText, instant),
          );
        }
        if (stepFourPhase === "cleanSigns") {
          return React.createElement(
            "div",
            { className: className + " q4-phase-line" },
            renderQ3MathFragment(renderMathText, "8+2x\u2212y+1=0"),
          );
        }
        if (stepFourPhase === "distributePrep") {
          return React.createElement(
            "div",
            { className: className + " q4-phase-line q4-distribute-stage" },
            React.createElement(
              "span",
              { className: "q4-visible-source-line" },
              React.createElement(
                "span",
                { className: "q4-distribute-source" },
                renderMathText("\u22122"),
              ),
              renderQ3MathFragment(
                renderMathText,
                "(\u22124\u2212x)\u2212(y)+1=0",
              ),
            ),
            React.createElement(
              "span",
              { className: "q4-hidden-target-line", "aria-hidden": "true" },
              React.createElement("span", null, "("),
              React.createElement(
                "span",
                { className: "q4-distribute-target-a" },
                renderMathText("\u22122"),
              ),
              renderMathText("\u00d7\u22124\u2212("),
              React.createElement(
                "span",
                { className: "q4-distribute-target-b" },
                renderMathText("\u22122"),
              ),
              renderQ3MathFragment(renderMathText, ")x)\u2212(y)+1=0"),
            ),
          );
        }
        if (stepFourPhase === "distribute") {
          return React.createElement(
            "div",
            { className: className + " q4-phase-line" },
            renderQ3DistributeLine(renderMathText, false, instant),
          );
        }
        if (stepFourPhase === "removeProductParens") {
          return React.createElement(
            "div",
            { className: className + " q4-phase-line" },
            renderQ3DistributeLine(renderMathText, true, instant),
          );
        }
        if (stepFourPhase === "simplifyK") {
          return React.createElement(
            "div",
            { className: className + " q4-phase-line" },
            renderMathText("\u22122("),
            React.createElement(Q4FadeSwap, {
              out: "2\u00d7(\u22122)",
              inContent: "\u22124",
              renderText: renderMathText,
              instant: instant,
            }),
            renderQ3MathFragment(renderMathText, "\u2212x)\u2212(y)+1=0"),
          );
        }
        if (stepFourPhase === "replaceK") {
          return React.createElement(
            "div",
            { className: className + " q4-phase-line" },
            renderQ3MathFragment(
              renderMathText,
              "\u22122(2\u00d7(\u22122)\u2212x)\u2212(y)+1=0",
            ),
          );
        }
        if (stepFourPhase === "copied") {
          return React.createElement(
            "div",
            { className: className + " q4-phase-line" },
            renderWorkingFormulaParts(activeQuestion.step4.substitutionParts),
          );
        }
        return React.createElement("div", {
          className: className + " q4-phase-line",
        });
      }

      if (activeQuestion.step4.simplifyKind === "reflectNegativeDiagonal") {
        const showRearrange =
          stepFourPhase === "combineNegatives" ||
          stepFourPhase === "multipliedWithBrackets";
        const showMinusOne =
          final ||
          stepFourPhase === "removeBrackets" ||
          stepFourPhase === "multiplyByMinus1" ||
          stepFourPhase === "simplifyMultiply" ||
          stepFourPhase === "multipliedWithBrackets";

        if (showRearrange || showMinusOne) {
          const minusStage = final
            ? "final"
            : stepFourPhase === "simplifyMultiply"
              ? "simplify"
              : stepFourPhase === "multiplyByMinus1"
                ? "wrap"
                : "bracketed";
          return React.createElement(
            "div",
            { className: className + (final ? "" : " q4-phase-line") },
            React.createElement(
              "div",
              { className: "q2-working-stack" },
              React.createElement(
                "div",
                {
                  className:
                    "q2-working-base" + (showRearrange ? " is-underlay" : ""),
                },
                React.createElement(Q2MinusOneExpression, {
                  stage: minusStage,
                  renderText: renderMathText,
                  instant: instant,
                }),
              ),
              showRearrange
                ? React.createElement(
                    "div",
                    { className: "q2-working-overlay" },
                    React.createElement(ReflectionRearrangeAnimation, {
                      from: "5(\u2212y')+(\u2212x')\u22126=0",
                      to: "\u22125(y')\u2212(x')\u22126=0",
                      renderText: (text) =>
                        renderQ3RearrangeText(renderMathText, text),
                      instant: instant,
                    }),
                  )
                : null,
            ),
          );
        }
        if (stepFourPhase === "copied") {
          return React.createElement(
            "div",
            { className: className },
            renderWorkingFormulaParts(activeQuestion.step4.substitutionParts),
          );
        }
        return React.createElement("div", {
          className: className + " q4-phase-line",
        });
      }

      if (stepFourPhase === "copied") {
        return React.createElement(
          "div",
          { className: className },
          renderWorkingFormulaParts(activeQuestion.step4.substitutionParts),
        );
      }

      return React.createElement(
        "div",
        { className: className },
        React.createElement("span", null, "3"),
        React.createElement("span", { className: "working-bracket" }, "("),
        renderStep4PrimedToken(renderMathText, "x", "x-token"),
        React.createElement("span", { className: "working-bracket" }, ")"),
        React.createElement(
          "span",
          { className: "working-operator-slot" },
          React.createElement(
            "span",
            { className: "working-minus" },
            renderMathText("\u2212"),
          ),
          React.createElement("span", { className: "working-plus" }, "+"),
        ),
        React.createElement("span", null, "2"),
        renderWorkingBracket("("),
        React.createElement(
          "span",
          { className: "working-inner-negative" },
          renderMathText("\u2212"),
        ),
        renderStep4PrimedToken(renderMathText, "y", "y-token"),
        React.createElement("span", { className: "working-bracket" }, ")"),
        React.createElement("span", null, " = 1"),
      );
    };

    const renderStepFourMath = () =>
      React.createElement(
        React.Fragment,
        null,
        React.createElement(
          "div",
          { className: "sol-card substitution-card compact is-visible" },
          React.createElement(
            "div",
            { className: "sol-card-title" },
            renderMathText(labels.equationReflectedLine),
          ),
          React.createElement(
            "div",
            {
              className:
                "substitution-expression step4-substitution-expression",
            },
            renderFormulaParts(activeQuestion.step4.substitutionParts),
          ),
        ),
        renderStepFourWorkingLine(),
      );

    const renderStepFourGuideBox = () => {
      if (step !== 4 || stepFourGuideIndex < 1) return null;
      const specs = getStepFourGuideSpecs(activeQuestion.step4);
      return React.createElement(
        "div",
        { className: "steps-box" + (stepFourManual ? " is-manual" : "") },
        React.createElement(
          "div",
          {
            className:
              "steps-box-body" + (stepFourGuideVisible ? " is-visible" : ""),
          },
          React.createElement(
            "div",
            { className: "steps-box-title" },
            stepFourGuideDisplay.title,
          ),
          React.createElement("div", {
            className: "steps-box-copy",
            dangerouslySetInnerHTML: { __html: stepFourGuideDisplay.note },
          }),
        ),
        React.createElement(
          "div",
          { className: "steps-box-nav" },
          React.createElement(
            "button",
            {
              type: "button",
              className: "steps-box-nav-btn",
              "aria-label": "Previous step",
              disabled: stepFourGuideIndex <= 1,
              onClick: handleStepFourPrev,
            },
            "<",
          ),
          React.createElement(
            "button",
            {
              type: "button",
              className: "steps-box-nav-btn",
              "aria-label": "Next step",
              disabled:
                stepFourGuideIndex >= specs.length - 1 &&
                stepFourPhase === "final" &&
                stepFourPrimesGone,
              onClick: handleStepFourNext,
            },
            ">",
          ),
        ),
      );
    };

    const renderSimplifyOptions = () =>
      React.createElement(
        "div",
        {
          className:
            "line-options simplify-options" +
            (simplifyStatus === "correct" ? " is-pruning" : ""),
        },
        activeQuestion.step4.options.map((option, index) => {
          let className = "line-option";
          if (
            simplifyStatus === "correct" &&
            index !== activeQuestion.step4.correctIndex
          ) {
            className += " is-collapsing";
          }
          if (
            simplifySelected === index &&
            index === activeQuestion.step4.correctIndex &&
            simplifyStatus === "correct"
          ) {
            className += " is-correct";
          }
          if (
            simplifySelected === index &&
            index !== activeQuestion.step4.correctIndex &&
            simplifyStatus === "wrong"
          ) {
            className += " is-wrong";
          }
          return React.createElement("button", {
            key: index,
            type: "button",
            className: className,
            disabled:
              simplifyStatus === "correct" ||
              className.indexOf("is-collapsing") >= 0,
            children: renderMathText(option),
            onClick: (event) => handleSimplifyOption(index, event),
          });
        }),
      );

    const renderRightPanel = () => {
      if (step === 1) {
        return React.createElement("div", {
          className: "right-text-panel" + (rightVisible ? " is-visible" : ""),
          dangerouslySetInnerHTML: {
            __html: step1Data.rightPanel.exploreDetails,
          },
        });
      }
      if (step === 2) {
        return React.createElement(
          React.Fragment,
          null,
          React.createElement("div", {
            className: "right-title",
            dangerouslySetInnerHTML: { __html: activeQuestion.ruleQuestion },
          }),
          renderRuleOptions(),
        );
      }
      if (step === 3) {
        return React.createElement(
          React.Fragment,
          null,
          React.createElement("div", {
            className: "right-feedback-space",
            dangerouslySetInnerHTML: { __html: numpadFeedback },
          }),
          React.createElement("div", {
            className: "right-title compact-title",
            dangerouslySetInnerHTML: {
              __html: step3Data.rightPanel.numpadHelp,
            },
          }),
          React.createElement(Numpad, {
            disabled: activeBox === null,
            keys: [
              "1",
              "2",
              "3",
              "4",
              "5",
              "6",
              "7",
              "8",
              "9",
              "2k",
              "x'",
              "y'",
              "+",
              "-",
              "clear",
              "submit",
            ],
            clearLabel: numpad.clearLabel,
            submitLabel: numpad.submitLabel,
            plusLabel: numpad.plusLabel,
            minusLabel: numpad.minusLabel,
            onValue: handleNumpadValue,
            onClear: handleNumpadClear,
            onSubmit: handleNumpadSubmit,
          }),
        );
      }
      return React.createElement(
        React.Fragment,
        null,
        React.createElement(
          "div",
          {
            className:
              "right-feedback-space mcq-feedback " +
              simplifyStatus +
              (stepFourPhase !== "idle" && stepFourPhase !== "selected"
                ? " is-collapsed"
                : ""),
          },
          simplifyStatus === "wrong" ? step4Data.feedback.tryAgain : "",
        ),
        React.createElement("div", {
          className: "right-title simplify-title",
          dangerouslySetInnerHTML: {
            __html: step4Data.rightPanel.simplifyTitle,
          },
        }),
        renderSimplifyOptions(),
      );
    };

    return React.createElement(
      React.Fragment,
      null,
      React.createElement(
        "div",
        { className: "main-canvas-container line-reflection-canvas" },
        React.createElement(
          "section",
          { className: "math-column" },
          renderProblem(),
          React.createElement(
            "div",
            { className: "solution-row" },
            step <= 2
              ? renderStepOneOrTwoMath()
              : step === 3
                ? renderStepThreeMath()
                : renderStepFourMath(),
          ),
        ),
        React.createElement(
          "aside",
          { className: "action-column" },
          renderRightPanel(),
        ),
        renderStepFourGuideBox(),
      ),
      flyClone
        ? React.createElement(
            "div",
            {
              className:
                "reflection-fly-clone" +
                (flyClone.html
                  ? " substitution-expression step4-fly-expression"
                  : "") +
                (flyClone.tokenClass ? " " + flyClone.tokenClass : ""),
              style: {
                left: flyClone.left + "px",
                top: flyClone.top + "px",
                fontSize:
                  (flyClone.active
                    ? flyClone.targetFontSize
                    : flyClone.sourceFontSize) + "px",
                fontFamily: flyClone.fontFamily,
                fontStyle: flyClone.fontStyle,
                fontWeight: flyClone.fontWeight,
                transform: flyClone.active
                  ? "translate(calc(-50% + " +
                    flyClone.dx +
                    "px), calc(-50% + " +
                    flyClone.dy +
                    "px))"
                  : "translate(-50%, -50%)",
                transitionDuration:
                  (flyClone.duration ? flyClone.duration / 1000 : 0.74) + "s",
              },
              ...(flyClone.html
                ? { dangerouslySetInnerHTML: { __html: flyClone.html } }
                : {}),
            },
            flyClone.html ? null : renderMathText(flyClone.text),
          )
        : null,
      flyClones.map((clone) =>
        React.createElement(
          "div",
          {
            key: clone.id,
            className:
              "reflection-fly-clone" +
              (clone.tokenClass ? " " + clone.tokenClass : ""),
            style: {
              left: clone.left + "px",
              top: clone.top + "px",
              fontSize:
                (clone.active ? clone.targetFontSize : clone.sourceFontSize) +
                "px",
              fontFamily: clone.fontFamily,
              fontStyle: clone.fontStyle,
              fontWeight: clone.fontWeight,
              transform: clone.active
                ? "translate(calc(-50% + " +
                  clone.dx +
                  "px), calc(-50% + " +
                  clone.dy +
                  "px))"
                : "translate(-50%, -50%)",
              transitionDuration:
                (clone.duration ? clone.duration / 1000 : 0.74) + "s",
            },
          },
          renderMathText(clone.text),
        ),
      ),
    );
  },
);
