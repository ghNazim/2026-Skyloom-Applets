/* ═══════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════ */
const polarToXY = (cx, cy, r, deg) => {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
};
const arcPath = (cx, cy, r, startDeg, endDeg) => {
  const s = polarToXY(cx, cy, r, startDeg);
  const e = polarToXY(cx, cy, r, endDeg);
  const span = endDeg - startDeg;
  const large = span > 180 ? 1 : 0;
  return [
    "M",
    cx,
    cy,
    "L",
    s.x,
    s.y,
    "A",
    r,
    r,
    0,
    large,
    1,
    e.x,
    e.y,
    "Z",
  ].join(" ");
};
const lineArcPath = (cx, cy, r, startDeg, endDeg) => {
  if (Math.abs(endDeg - startDeg) < 0.1) return "";
  const s = polarToXY(cx, cy, r, startDeg);
  const e = polarToXY(cx, cy, r, endDeg);
  const large = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
  const sweep = endDeg > startDeg ? 1 : 0;
  return ["M", s.x, s.y, "A", r, r, 0, large, sweep, e.x, e.y].join(" ");
};
const rotatePoint = (px, py, cx, cy, deg) => {
  const r = (deg * Math.PI) / 180;
  const dx = px - cx,
    dy = py - cy;
  return {
    x: cx + dx * Math.cos(r) - dy * Math.sin(r),
    y: cy + dx * Math.sin(r) + dy * Math.cos(r),
  };
};
const mkr = (id, color, rev) =>
  React.createElement(
    "marker",
    {
      id,
      viewBox: "0 0 10 10",
      refX: rev ? "2" : "8",
      refY: "5",
      markerWidth: "5",
      markerHeight: "5",
      orient: rev ? "auto-start-reverse" : "auto",
    },
    React.createElement("path", { d: "M 0 0 L 10 5 L 0 10 z", fill: color }),
  );

/* ═══════════════════════════════════════════════════
   GEOMETRY CONSTANTS
   ═══════════════════════════════════════════════════ */
const COL_PARALLEL = "#FFC000";
const COL_TRANS = "#00B0F0";
const COL_ODD = "#9E63F2";
const COL_EVEN = "#C9A5FC";
const COL_GREY = "#888";

const ANG_R = 53;
const LABEL_R = 82;
const LABEL_R_SMALL = Math.round(LABEL_R * 0.55);
const LABEL_FS_LARGE = 28;
const LABEL_FS_SMALL = 20;
const CLONE_PEAK_R = ANG_R * 2.7;
const ARC_R = 78;
const LINEAR_ARC_R = Math.round(ARC_R * 1.2);
const LINE_LEFT = 60,
  LINE_RIGHT = 710;
const AY = 158,
  BY = 348;
const DEFAULT_TRANS_ANGLE = 60;
const EXT = 180;

const transDir = (transAngle) => {
  const rad = (transAngle * Math.PI) / 180;
  return { tdx: Math.cos(rad), tdy: Math.sin(rad) };
};

const POINT_OF = {
  1: "A",
  2: "A",
  3: "A",
  4: "A",
  5: "B",
  6: "B",
  7: "B",
  8: "B",
};
const ANGLE_BOUNDARY_LINES = {
  1: ["topLeftRay", "transversalTop"],
  2: ["topRightRay", "transversalTop"],
  3: ["topRightRay", "transversalMid"],
  4: ["topLeftRay", "transversalMid"],
  5: ["bottomLeftRay", "transversalMid"],
  6: ["bottomRightRay", "transversalMid"],
  7: ["bottomRightRay", "transversalBot"],
  8: ["bottomLeftRay", "transversalBot"],
};
const COINTERIOR_PAIRS = { 3: 6, 4: 5, 5: 4, 6: 3 };
const COEXTERIOR_PAIRS = { 1: 8, 8: 1, 2: 7, 7: 2 };

const angleColor = (id) => (id % 2 === 1 ? COL_ODD : COL_EVEN);
const labelPosAt = (cx, cy, start, end, lr) =>
  polarToXY(cx, cy, lr, (start + end) / 2);

const vecToDeg = (dx, dy) => {
  let deg = (Math.atan2(dy, dx) * 180) / Math.PI;
  if (deg < 0) deg += 360;
  return deg;
};

const buildAnglesAt = (cx, cy, transUp, transDown, idStart) => {
  const span = (start, end) => Math.abs(end - start);
  return [
    {
      id: idStart,
      cx,
      cy,
      start: 180,
      end: transUp,
      measure: span(180, transUp),
    },
    {
      id: idStart + 1,
      cx,
      cy,
      start: transUp,
      end: 360,
      measure: span(transUp, 360),
    },
    {
      id: idStart + 2,
      cx,
      cy,
      start: 0,
      end: transDown,
      measure: span(0, transDown),
    },
    {
      id: idStart + 3,
      cx,
      cy,
      start: transDown,
      end: 180,
      measure: span(transDown, 180),
    },
  ];
};

const buildLinearPairInfo = (transUpA, transDownA, transUpB, transDownB) => ({
  "1,2": { arc: { start: 180, end: 360 } },
  "2,3": { arc: { start: transUpA, end: transDownA + 360 } },
  "3,4": { arc: { start: 0, end: 180 } },
  "4,1": { arc: { start: transDownA, end: transUpA } },
  "5,6": { arc: { start: 180, end: 360 } },
  "6,7": { arc: { start: transUpB, end: transDownB + 360 } },
  "7,8": { arc: { start: 0, end: 180 } },
  "8,5": { arc: { start: transDownB, end: transUpB } },
});

const buildCoArcInfo = (midTransDeg) => {
  const leftCenter = midTransDeg + 90;
  const rightCenter = midTransDeg + 270;
  const arcAround = (center) => ({ start: center - 90, end: center + 90 });
  return {
    coInterior: {
      "3,6": {
        topRay: "topRightRay",
        botRay: "bottomRightRay",
        arc: arcAround(rightCenter),
      },
      "4,5": {
        topRay: "topLeftRay",
        botRay: "bottomLeftRay",
        arc: arcAround(leftCenter),
      },
    },
    coExterior: {
      "1,8": {
        topParRay: "topLeftRay",
        botParRay: "bottomLeftRay",
        arc: arcAround(leftCenter),
      },
      "2,7": {
        topParRay: "topRightRay",
        botParRay: "bottomRightRay",
        arc: arcAround(rightCenter),
      },
    },
  };
};

const createGeometry = (flipped, transAngle) => {
  const { tdx, tdy } = transDir(transAngle);
  const dy = BY - AY;
  const dx = Math.round((dy / tdy) * tdx);
  const AX = flipped ? 355 : 445;
  const BX = flipped ? AX + dx : AX - dx;
  const MX = (AX + BX) / 2;
  const MY = (AY + BY) / 2;

  const TRANS_TOP = flipped
    ? { x: Math.round(AX - EXT * tdx), y: Math.round(AY - EXT * tdy) }
    : { x: Math.round(AX + EXT * tdx), y: Math.round(AY - EXT * tdy) };
  const TRANS_BOT = flipped
    ? { x: Math.round(BX + EXT * tdx), y: Math.round(BY + EXT * tdy) }
    : { x: Math.round(BX - EXT * tdx), y: Math.round(BY + EXT * tdy) };

  const transUpA = vecToDeg(TRANS_TOP.x - AX, TRANS_TOP.y - AY);
  const transDownA = vecToDeg(BX - AX, BY - AY);
  const transUpB = vecToDeg(AX - BX, AY - BY);
  const transDownB = vecToDeg(TRANS_BOT.x - BX, TRANS_BOT.y - BY);
  const midTransDeg = vecToDeg(BX - AX, BY - AY);

  const ANGLE_DATA = [
    ...buildAnglesAt(AX, AY, transUpA, transDownA, 1),
    ...buildAnglesAt(BX, BY, transUpB, transDownB, 5),
  ];

  const LINES = {
    topLeftRay: {
      x1: LINE_LEFT,
      y1: AY,
      x2: AX,
      y2: AY,
      color: COL_PARALLEL,
      ms: "url(#a-yel-s)",
      me: "",
    },
    topRightRay: {
      x1: AX,
      y1: AY,
      x2: LINE_RIGHT,
      y2: AY,
      color: COL_PARALLEL,
      ms: "",
      me: "url(#a-yel-e)",
    },
    bottomLeftRay: {
      x1: LINE_LEFT,
      y1: BY,
      x2: BX,
      y2: BY,
      color: COL_PARALLEL,
      ms: "url(#a-yel-s)",
      me: "",
    },
    bottomRightRay: {
      x1: BX,
      y1: BY,
      x2: LINE_RIGHT,
      y2: BY,
      color: COL_PARALLEL,
      ms: "",
      me: "url(#a-yel-e)",
    },
    transversalTop: {
      x1: AX,
      y1: AY,
      x2: TRANS_TOP.x,
      y2: TRANS_TOP.y,
      color: COL_TRANS,
      ms: "",
      me: "url(#a-cyn-e)",
    },
    transversalMid: {
      x1: AX,
      y1: AY,
      x2: BX,
      y2: BY,
      color: COL_TRANS,
      ms: "",
      me: "",
    },
    transversalBot: {
      x1: BX,
      y1: BY,
      x2: TRANS_BOT.x,
      y2: TRANS_BOT.y,
      color: COL_TRANS,
      ms: "",
      me: "url(#a-cyn-e)",
    },
  };
  const LINE_KEYS = Object.keys(LINES);

  const coArc = buildCoArcInfo(midTransDeg);
  const LINEAR_PAIR_INFO = buildLinearPairInfo(
    transUpA,
    transDownA,
    transUpB,
    transDownB,
  );
  const COINTERIOR_INFO = coArc.coInterior;
  const COEXTERIOR_INFO = coArc.coExterior;

  const parRayCopyAt = (rayKey, vcX, vcY) => {
    const ln = LINES[rayKey];
    if (rayKey.includes("Left")) {
      return {
        x1: LINE_LEFT,
        y1: vcY,
        x2: vcX,
        y2: vcY,
        color: ln.color,
        ms: ln.ms,
        me: ln.me,
      };
    }
    return {
      x1: vcX,
      y1: vcY,
      x2: LINE_RIGHT,
      y2: vcY,
      color: ln.color,
      ms: ln.ms,
      me: ln.me,
    };
  };

  return {
    flipped,
    transAngle,
    AX,
    BX,
    MX,
    MY,
    ANGLE_DATA,
    LINES,
    LINE_KEYS,
    LINEAR_PAIR_INFO,
    COINTERIOR_INFO,
    COEXTERIOR_INFO,
    angleDataOf: (id) => ANGLE_DATA[id - 1],
    getPairCopyOffsets: () => ({
      dtx: MX - AX,
      dty: MY - AY,
      dbx: MX - BX,
      dby: MY - BY,
    }),
    parRayCopyAt,
  };
};

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════ */
const MainCanvas = (props) => {
  const {
    questionIndex,
    questionStates,
    onSaveQuestionState,
    onSetNextEnabled,
    onUpdateTexts,
    onAllQuestionsDone,
    nextTrigger,
    prevTrigger,
  } = props;
  const h = React.createElement;
  const { useState, useEffect, useRef, useCallback, useMemo } = React;

  const question = APP_DATA.questions[questionIndex];
  const totalQuestions = APP_DATA.questions.length;
  const geo = useMemo(
    () =>
      createGeometry(
        questionIndex > 0,
        question?.trans_angle ?? DEFAULT_TRANS_ANGLE,
      ),
    [questionIndex, question?.trans_angle],
  );

  const [inputValue, setInputValue] = useState("");
  const [inputState, setInputState] = useState("");
  const [shakeInput, setShakeInput] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackMode, setFeedbackMode] = useState("");
  const [isAnswered, setIsAnswered] = useState(false);
  const [solvedValue, setSolvedValue] = useState(null);
  const [wrongCount, setWrongCount] = useState(0);
  const [numpadDisabled, setNumpadDisabled] = useState(false);
  const [dehiLines, setDehiLines] = useState([]);
  const [dehiAngles, setDehiAngles] = useState([]);
  const [greyedAngles, setGreyedAngles] = useState([]);
  const [greyedLines, setGreyedLines] = useState([]);
  const [cloneAngle, setCloneAngle] = useState(null);
  const [arcAnim, setArcAnim] = useState(null);
  const [floatingLabel, setFloatingLabel] = useState(null);
  const [coInteriorCopies, setCoInteriorCopies] = useState(null);
  const [linearLabelStyles, setLinearLabelStyles] = useState(null);
  const [emphasizedLines, setEmphasizedLines] = useState([]);

  const animatingRef = useRef(false);
  const prevNextTrigger = useRef(0);
  const prevPrevTrigger = useRef(0);
  const inputBoxRef = useRef(null);

  const playSnd = (s) => {
    if (typeof playSound === "function") playSound(s);
  };

  const getKeepLines = useCallback((givenId, unknownId) => {
    const keep = new Set([
      ...ANGLE_BOUNDARY_LINES[givenId],
      ...ANGLE_BOUNDARY_LINES[unknownId],
    ]);
    return Array.from(keep);
  }, []);

  const applyWrongDehighlight = useCallback(() => {
    if (!question) return;
    const keep = getKeepLines(question.givenAngle, question.unknownAngle);
    setDehiLines(geo.LINE_KEYS.filter((k) => !keep.includes(k)));
    setDehiAngles([]);
  }, [question, geo, getKeepLines]);

  const restoreHighlights = useCallback(() => {
    setDehiLines([]);
    setDehiAngles([]);
    setGreyedAngles([]);
    setGreyedLines([]);
    setCloneAngle(null);
    setArcAnim(null);
    setFloatingLabel(null);
    setCoInteriorCopies(null);
    setLinearLabelStyles(null);
    setEmphasizedLines([]);
  }, []);

  const getAngleLabelText = useCallback(
    (id) => {
      if (!question) return "";
      if (id === question.givenAngle) return question.givenValue + "\u00B0";
      if (solvedValue !== null && id === question.unknownAngle)
        return solvedValue + "\u00B0";
      return "x\u00B0";
    },
    [question, solvedValue],
  );

  const resetQuestionUI = useCallback(
    (saved) => {
      if (saved && saved.answered) {
        setInputValue(String(saved.value));
        setInputState("correct");
        setFeedbackText(saved.feedbackText || question.correct_feedback);
        setFeedbackMode("correct");
        setIsAnswered(true);
        setSolvedValue(saved.value);
        setWrongCount(saved.wrongCount || 0);
        setNumpadDisabled(true);
        restoreHighlights();
        const isLast = questionIndex === totalQuestions - 1;
        onSetNextEnabled(true);
        onUpdateTexts(
          isLast ? APP_DATA.step1.navTextSummarize : APP_DATA.step1.navTextNext,
          APP_DATA.step1.questionText,
        );
      } else {
        const wc = saved ? saved.wrongCount || 0 : 0;
        setInputValue(saved && saved.value ? String(saved.value) : "");
        setInputState("");
        setShakeInput(false);
        setIsAnswered(false);
        setSolvedValue(null);
        setWrongCount(wc);
        setNumpadDisabled(false);

        if (wc > 0) {
          setFeedbackMode("wrong");
          setFeedbackText(wc >= 2 ? question.wrong2 : question.wrong1);
          applyWrongDehighlight();
        } else {
          setFeedbackText("");
          setFeedbackMode("");
          restoreHighlights();
        }

        onSetNextEnabled(false);
        onUpdateTexts(APP_DATA.step1.navText, APP_DATA.step1.questionText);
      }
    },
    [
      question,
      questionIndex,
      totalQuestions,
      onSetNextEnabled,
      onUpdateTexts,
      restoreHighlights,
      applyWrongDehighlight,
    ],
  );

  useEffect(() => {
    animatingRef.current = false;
    const saved = questionStates[questionIndex];
    resetQuestionUI(saved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionIndex]);

  useEffect(() => {
    if (nextTrigger === prevNextTrigger.current) return;
    prevNextTrigger.current = nextTrigger;
  }, [nextTrigger]);

  useEffect(() => {
    if (prevTrigger === prevPrevTrigger.current) return;
    prevPrevTrigger.current = prevTrigger;
  }, [prevTrigger]);

  /* ── Hint animations ── */
  const finishHintAnimation = () => {
    animatingRef.current = false;
  };

  const runVerticalHint = (givenId) => {
    animatingRef.current = true;
    const a = geo.angleDataOf(givenId);
    const mid = (a.start + a.end) / 2;
    const tl = gsap.timeline({ onComplete: finishHintAnimation });

    tl.to({}, { duration: 0.4 });
    tl.call(() => {
      setCloneAngle({
        cx: a.cx,
        cy: a.cy,
        start: a.start,
        end: a.end,
        r: ANG_R,
        rot: 0,
        color: angleColor(givenId),
      });
    });

    const proxy = { r: ANG_R, rot: 0 };
    tl.to(proxy, {
      r: CLONE_PEAK_R,
      duration: 0.4,
      onUpdate: () => setCloneAngle((prev) => prev && { ...prev, r: proxy.r }),
    });
    tl.to(proxy, {
      rot: 180,
      duration: 0.8,
      ease: "power2.inOut",
      onUpdate: () =>
        setCloneAngle((prev) => prev && { ...prev, rot: proxy.rot }),
    });
    tl.to(proxy, {
      r: ANG_R,
      duration: 0.4,
      onUpdate: () => setCloneAngle((prev) => prev && { ...prev, r: proxy.r }),
    });
    tl.call(() => setCloneAngle(null));
  };

  const runTranslateCloneHint = (givenId, unknownId, rotateToAlign) => {
    animatingRef.current = true;
    const src = geo.angleDataOf(givenId);
    const dst = geo.angleDataOf(unknownId);
    const srcMid = (src.start + src.end) / 2;
    const dstMid = (dst.start + dst.end) / 2;
    const rotTarget = rotateToAlign ? dstMid - srcMid : 0;

    const updateClone = (proxy) => {
      setCloneAngle({
        cx: proxy.cx,
        cy: proxy.cy,
        start: src.start,
        end: src.end,
        r: proxy.r,
        rot: proxy.rot,
        color: angleColor(givenId),
      });
    };

    const tl = gsap.timeline({ onComplete: finishHintAnimation });
    tl.to({}, { duration: 0.4 });

    const proxy = { r: ANG_R, cx: src.cx, cy: src.cy, rot: 0 };

    tl.call(() => updateClone(proxy));
    tl.to(proxy, {
      r: CLONE_PEAK_R,
      duration: 0.4,
      onUpdate: () => updateClone(proxy),
    });
    tl.to(proxy, {
      cx: dst.cx,
      cy: dst.cy,
      duration: 0.8,
      ease: "power2.inOut",
      onUpdate: () => updateClone(proxy),
    });
    if (rotateToAlign && rotTarget !== 0) {
      tl.to(proxy, {
        rot: rotTarget,
        duration: 0.8,
        ease: "power2.inOut",
        onUpdate: () => updateClone(proxy),
      });
    }
    tl.to(proxy, {
      r: ANG_R,
      duration: 0.4,
      onUpdate: () => updateClone(proxy),
    });
    tl.call(() => setCloneAngle(null));
  };

  const runLinearHint = (givenId, unknownId) => {
    animatingRef.current = true;
    const pairIds = [givenId, unknownId];
    let info = geo.LINEAR_PAIR_INFO[pairIds.join(",")];
    if (!info) info = geo.LINEAR_PAIR_INFO[[unknownId, givenId].join(",")];
    if (!info) {
      animatingRef.current = false;
      return;
    }

    const pt = POINT_OF[givenId];
    const cx = pt === "A" ? geo.AX : geo.BX;
    const cy = pt === "A" ? AY : BY;

    const setLabelStyles = (lr, fs) => {
      const styles = {};
      pairIds.forEach((id) => {
        styles[id] = { lr, fontSize: fs };
      });
      setLinearLabelStyles(styles);
    };

    const tl = gsap.timeline({ onComplete: finishHintAnimation });

    tl.to({}, { duration: 0.3 });
    const blinkSel = pairIds
      .map((a) => ".angle-group-" + a + " path")
      .join(", ");
    tl.to(blinkSel, {
      fillOpacity: 0.15,
      duration: 0.2,
      yoyo: true,
      repeat: 5,
    });

    tl.to({}, { duration: 0.3 });

    const labelProxy = { t: 0 };
    tl.to(labelProxy, {
      t: 1,
      duration: 0.5,
      ease: "power2.inOut",
      onUpdate: () => {
        const lr = LABEL_R + (LABEL_R_SMALL - LABEL_R) * labelProxy.t;
        const fs =
          LABEL_FS_LARGE + (LABEL_FS_SMALL - LABEL_FS_LARGE) * labelProxy.t;
        setLabelStyles(lr, fs);
      },
    });

    tl.call(() => {
      setArcAnim({
        cx,
        cy,
        start: info.arc.start,
        end: info.arc.start,
        finalEnd: info.arc.end,
      });
    });

    const arcProxy = { a: info.arc.start };
    tl.to(arcProxy, {
      a: info.arc.end,
      duration: 0.8,
      ease: "power2.inOut",
      onUpdate: () =>
        setArcAnim((prev) => prev && { ...prev, end: arcProxy.a }),
      onComplete: () => {
        const midAng = (info.arc.start + info.arc.end) / 2;
        const mergePos = polarToXY(cx, cy, LINEAR_ARC_R + 35, midAng);
        setFloatingLabel({
          text: "180\u00B0",
          x: mergePos.x,
          y: mergePos.y,
          opacity: 1,
        });
      },
    });

    tl.to({}, { duration: 1.5 });

    tl.call(() => {
      setArcAnim(null);
      setFloatingLabel(null);
    });

    const returnLabelProxy = { t: 1 };
    tl.to(returnLabelProxy, {
      t: 0,
      duration: 0.5,
      ease: "power2.inOut",
      onUpdate: () => {
        const outward = 1 - returnLabelProxy.t;
        const lr = LABEL_R_SMALL + (LABEL_R - LABEL_R_SMALL) * outward;
        const fs = LABEL_FS_SMALL + (LABEL_FS_LARGE - LABEL_FS_SMALL) * outward;
        setLabelStyles(lr, fs);
      },
      onComplete: () => setLinearLabelStyles(null),
    });
  };

  const runCoPairHint = (givenId, unknownId, pairType) => {
    animatingRef.current = true;
    const infoMap =
      pairType === "coExterior" ? geo.COEXTERIOR_INFO : geo.COINTERIOR_INFO;
    const pairKey = [
      Math.min(givenId, unknownId),
      Math.max(givenId, unknownId),
    ].join(",");
    const info = infoMap[pairKey];
    if (!info) {
      animatingRef.current = false;
      return;
    }

    const topId = POINT_OF[givenId] === "A" ? givenId : unknownId;
    const botId = POINT_OF[givenId] === "B" ? givenId : unknownId;
    const topA = geo.angleDataOf(topId);
    const botA = geo.angleDataOf(botId);

    const topRayKey = info.topParRay || info.topRay;
    const botRayKey = info.botParRay || info.botRay;
    const topRayData =
      pairType === "coExterior"
        ? geo.parRayCopyAt(topRayKey, topA.cx, topA.cy)
        : { ...geo.LINES[topRayKey] };
    const botRayData =
      pairType === "coExterior"
        ? geo.parRayCopyAt(botRayKey, botA.cx, botA.cy)
        : { ...geo.LINES[botRayKey] };

    const { dtx, dty, dbx, dby } = geo.getPairCopyOffsets();

    setGreyedAngles([topId, botId]);
    setGreyedLines([topRayKey, botRayKey]);
    if (pairType === "coExterior") {
      setEmphasizedLines(["transversalMid"]);
    }
    setCoInteriorCopies({
      variant: pairType,
      topAngle: {
        id: topId,
        cx: topA.cx,
        cy: topA.cy,
        start: topA.start,
        end: topA.end,
        color: angleColor(topId),
      },
      botAngle: {
        id: botId,
        cx: botA.cx,
        cy: botA.cy,
        start: botA.start,
        end: botA.end,
        color: angleColor(botId),
      },
      topRay: { ...topRayData },
      botRay: { ...botRayData },
      tx: 0,
      ty: 0,
      bx: 0,
      by: 0,
      topLabel: {
        text: getAngleLabelText(topId),
        lr: LABEL_R,
        fontSize: LABEL_FS_LARGE,
        hide: false,
      },
      botLabel: {
        text: getAngleLabelText(botId),
        lr: LABEL_R,
        fontSize: LABEL_FS_LARGE,
        hide: false,
      },
    });

    const tl = gsap.timeline();
    tl.to({}, { duration: 0.3 });

    const proxy = { t: 0 };
    tl.to(proxy, {
      t: 1,
      duration: 1,
      ease: "power2.inOut",
      onUpdate: () => {
        setCoInteriorCopies(
          (prev) =>
            prev && {
              ...prev,
              tx: dtx * proxy.t,
              ty: dty * proxy.t,
              bx: dbx * proxy.t,
              by: dby * proxy.t,
            },
        );
      },
      onComplete: () => {
        setCoInteriorCopies(
          (prev) => prev && { ...prev, tx: dtx, ty: dty, bx: dbx, by: dby },
        );
      },
    });

    const labelProxy = { t: 0 };
    tl.to(labelProxy, {
      t: 1,
      duration: 0.5,
      ease: "power2.inOut",
      onUpdate: () => {
        const lr = LABEL_R + (LABEL_R_SMALL - LABEL_R) * labelProxy.t;
        const fs =
          LABEL_FS_LARGE + (LABEL_FS_SMALL - LABEL_FS_LARGE) * labelProxy.t;
        setCoInteriorCopies(
          (prev) =>
            prev && {
              ...prev,
              topLabel: { ...prev.topLabel, lr, fontSize: fs },
              botLabel: { ...prev.botLabel, lr, fontSize: fs },
            },
        );
      },
    });

    tl.call(() => {
      setArcAnim({
        cx: geo.MX,
        cy: geo.MY,
        start: info.arc.start,
        end: info.arc.start,
        finalEnd: info.arc.end,
      });
    });

    const arcProxy = { a: info.arc.start };
    tl.to(arcProxy, {
      a: info.arc.end,
      duration: 0.8,
      ease: "power2.inOut",
      onUpdate: () =>
        setArcAnim((prev) => prev && { ...prev, end: arcProxy.a }),
      onComplete: () => {
        const midAng = (info.arc.start + info.arc.end) / 2;
        const mergePos = polarToXY(geo.MX, geo.MY, ARC_R + 35, midAng);
        setFloatingLabel({
          text: "180\u00B0",
          x: mergePos.x,
          y: mergePos.y,
          opacity: 1,
        });
      },
    });

    tl.to({}, { duration: 1.5 });

    tl.call(() => {
      setArcAnim(null);
      setFloatingLabel(null);
    });

    const returnProxy = { t: 1 };
    tl.to(returnProxy, {
      t: 0,
      duration: 1,
      ease: "power2.inOut",
      onUpdate: () => {
        const outward = 1 - returnProxy.t;
        const lr = LABEL_R_SMALL + (LABEL_R - LABEL_R_SMALL) * outward;
        const fs = LABEL_FS_SMALL + (LABEL_FS_LARGE - LABEL_FS_SMALL) * outward;
        setCoInteriorCopies(
          (prev) =>
            prev && {
              ...prev,
              tx: dtx * returnProxy.t,
              ty: dty * returnProxy.t,
              bx: dbx * returnProxy.t,
              by: dby * returnProxy.t,
              topLabel: { ...prev.topLabel, lr, fontSize: fs, hide: false },
              botLabel: { ...prev.botLabel, lr, fontSize: fs, hide: false },
            },
        );
      },
      onComplete: () => {
        setCoInteriorCopies(null);
        setGreyedAngles([]);
        setGreyedLines([]);
        setEmphasizedLines([]);
        finishHintAnimation();
      },
    });
  };

  const runHintAnimation = () => {
    if (!question || animatingRef.current) return;
    const { givenAngle, unknownAngle, pairType } = question;

    if (pairType === "vertical") {
      runVerticalHint(givenAngle);
    } else if (pairType === "corresponding") {
      runTranslateCloneHint(givenAngle, unknownAngle, false);
    } else if (
      pairType === "alternateInterior" ||
      pairType === "alternateExterior"
    ) {
      runTranslateCloneHint(givenAngle, unknownAngle, true);
    } else if (pairType === "linear") {
      runLinearHint(givenAngle, unknownAngle);
    } else if (pairType === "coInterior" || pairType === "coExterior") {
      runCoPairHint(givenAngle, unknownAngle, pairType);
    }
  };

  const handleSubmit = () => {
    if (numpadDisabled || isAnswered || animatingRef.current || !inputValue)
      return;

    const numVal = parseInt(inputValue, 10);
    if (isNaN(numVal)) return;

    if (numVal === question.correct) {
      playSnd("correct");
      setInputState("correct");
      setFeedbackMode("correct");
      setFeedbackText(question.correct_feedback);
      setIsAnswered(true);
      setSolvedValue(numVal);
      setNumpadDisabled(true);
      restoreHighlights();

      onSaveQuestionState(questionIndex, {
        answered: true,
        value: numVal,
        wrongCount,
        feedbackText: question.correct_feedback,
      });

      const isLast = questionIndex === totalQuestions - 1;
      onSetNextEnabled(true);
      onUpdateTexts(
        isLast ? APP_DATA.step1.navTextSummarize : APP_DATA.step1.navTextNext,
        APP_DATA.step1.questionText,
      );
      if (isLast) onAllQuestionsDone();
    } else {
      playSnd("wrong");
      const newWrong = wrongCount + 1;
      setWrongCount(newWrong);
      setInputState("wrong");
      setFeedbackMode("wrong");
      setFeedbackText(newWrong >= 2 ? question.wrong2 : question.wrong1);

      setShakeInput(true);
      setTimeout(() => setShakeInput(false), 300);

      applyWrongDehighlight();

      onSaveQuestionState(questionIndex, {
        answered: false,
        value: inputValue,
        wrongCount: newWrong,
      });

      if (newWrong >= 2) {
        setTimeout(() => runHintAnimation(), 350);
      }
    }
  };

  const clearWrongRetryState = () => {
    setInputState("");
    setFeedbackText("");
    setFeedbackMode("");
  };

  const handleNumberClick = (num) => {
    if (numpadDisabled || isAnswered) return;
    if (inputState === "wrong") {
      clearWrongRetryState();
      setInputValue(num);
      return;
    }
    setInputValue((prev) => {
      if (prev.length >= 3) return prev;
      return prev + num;
    });
  };

  const handleClear = () => {
    if (numpadDisabled || isAnswered) return;
    setInputValue("");
    if (inputState === "wrong") clearWrongRetryState();
  };

  /* ── SVG render helpers ── */
  const renderDefs = () =>
    h(
      "defs",
      null,
      mkr("a-yel-s", COL_PARALLEL, true),
      mkr("a-yel-e", COL_PARALLEL, false),
      mkr("a-cyn-s", COL_TRANS, true),
      mkr("a-cyn-e", COL_TRANS, false),
      h(
        "marker",
        {
          id: "a-wht-e",
          viewBox: "0 0 10 10",
          refX: "8",
          refY: "5",
          markerWidth: "5",
          markerHeight: "5",
          orient: "auto",
        },
        h("path", { d: "M 0 0 L 10 5 L 0 10 z", fill: "white" }),
      ),
    );

  const renderLines = () =>
    h(
      "g",
      null,
      geo.LINE_KEYS.map((key) => {
        const ln = geo.LINES[key];
        const isEmphasized = emphasizedLines.includes(key);
        const dehi = dehiLines.includes(key) && !isEmphasized;
        const isGrey = greyedLines.includes(key);
        return h(
          "g",
          {
            key,
            className:
              "line-segment line-" +
              key +
              (dehi ? " dehi" : "") +
              (isGrey ? " grey" : "") +
              (isEmphasized ? " emphasized" : ""),
          },
          h("line", {
            x1: ln.x1,
            y1: ln.y1,
            x2: ln.x2,
            y2: ln.y2,
            stroke: isGrey ? COL_GREY : ln.color,
            strokeWidth: isEmphasized ? 4 : 3,
            strokeOpacity: isGrey ? 0.4 : 1,
            markerStart: isGrey ? "" : ln.ms,
            markerEnd: isGrey ? "" : ln.me,
          }),
        );
      }),
    );

  const renderAngles = () => {
    if (!question) return null;
    const activeIds = [question.givenAngle, question.unknownAngle];
    return h(
      "g",
      null,
      activeIds.map((id) => {
        const a = geo.angleDataOf(id);
        const dehi = dehiAngles.includes(id);
        const isGrey = greyedAngles.includes(id);
        const col = isGrey ? COL_GREY : angleColor(id);
        const mid = (a.start + a.end) / 2;
        const labelOverride = linearLabelStyles && linearLabelStyles[id];
        const lr = labelOverride ? labelOverride.lr : LABEL_R;
        const dlp = polarToXY(a.cx, a.cy, lr, mid);
        const hideLabel = isGrey && coInteriorCopies;

        let labelText;
        if (id === question.givenAngle) {
          labelText = question.givenValue + "\u00B0";
        } else if (solvedValue !== null) {
          labelText = solvedValue + "\u00B0";
        } else {
          labelText = "x\u00B0";
        }

        return h(
          "g",
          {
            key: "ang-" + id,
            className:
              "angle-group angle-group-" +
              id +
              (dehi ? " dehi" : "") +
              (isGrey ? " grey" : ""),
          },
          h("path", {
            d: arcPath(a.cx, a.cy, ANG_R, a.start, a.end),
            fill: col,
            fillOpacity: isGrey ? 0.4 : 0.7,
          }),
          !hideLabel &&
            h(
              "text",
              {
                x: dlp.x,
                y: dlp.y,
                className: "degree-label",
                fontSize: labelOverride ? labelOverride.fontSize : undefined,
              },
              labelText,
            ),
        );
      }),
    );
  };

  const renderCloneAngle = () => {
    if (!cloneAngle) return null;
    const { cx, cy, r, start, end, rot, color } = cloneAngle;
    return h(
      "g",
      {
        style: {
          transform: "rotate(" + rot + "deg)",
          transformOrigin: cx + "px " + cy + "px",
        },
      },
      h("path", {
        d: arcPath(cx, cy, r, start, end),
        fill: color,
        fillOpacity: 0.5,
      }),
    );
  };

  const renderArc = () => {
    if (!arcAnim) return null;
    const arcR =
      question && question.pairType === "linear" ? LINEAR_ARC_R : ARC_R;
    const d = lineArcPath(
      arcAnim.cx,
      arcAnim.cy,
      arcR,
      arcAnim.start,
      arcAnim.end,
    );
    return h(
      "g",
      { className: "semicircle-arc" },
      h("path", {
        d,
        fill: "none",
        stroke: "white",
        strokeWidth: 3,
        markerEnd: "url(#a-wht-e)",
        pointerEvents: "none",
        className: "semicircle-arc-visible",
      }),
    );
  };

  const renderCoInteriorCopies = () => {
    if (!coInteriorCopies) return null;
    const c = coInteriorCopies;
    const isCoExt = c.variant === "coExterior";
    const topA = c.topAngle,
      botA = c.botAngle;
    const topLr = c.topLabel && c.topLabel.lr != null ? c.topLabel.lr : LABEL_R;
    const botLr = c.botLabel && c.botLabel.lr != null ? c.botLabel.lr : LABEL_R;
    const topLp = labelPosAt(topA.cx, topA.cy, topA.start, topA.end, topLr);
    const botLp = labelPosAt(botA.cx, botA.cy, botA.start, botA.end, botLr);

    const renderLine = (ray) =>
      h("line", {
        x1: ray.x1,
        y1: ray.y1,
        x2: ray.x2,
        y2: ray.y2,
        stroke: ray.color,
        strokeWidth: 3,
        markerStart: ray.ms,
        markerEnd: ray.me,
      });

    return h(
      "g",
      { className: "co-interior-copies" },
      isCoExt &&
        h(
          "g",
          { className: "co-exterior-fixed-trans" },
          renderLine(geo.LINES.transversalTop),
          renderLine(geo.LINES.transversalBot),
        ),
      h(
        "g",
        { transform: "translate(" + c.tx + " " + c.ty + ")" },
        h("path", {
          d: arcPath(topA.cx, topA.cy, ANG_R, topA.start, topA.end),
          fill: topA.color,
          fillOpacity: 0.7,
        }),
        renderLine(c.topRay),
        c.topLabel &&
          !c.topLabel.hide &&
          h(
            "text",
            {
              x: topLp.x,
              y: topLp.y,
              fill: "white",
              fontSize: c.topLabel.fontSize || LABEL_FS_LARGE,
              fontWeight: "bold",
              textAnchor: "middle",
              dominantBaseline: "central",
              className: "degree-label",
            },
            c.topLabel.text,
          ),
      ),
      h(
        "g",
        { transform: "translate(" + c.bx + " " + c.by + ")" },
        h("path", {
          d: arcPath(botA.cx, botA.cy, ANG_R, botA.start, botA.end),
          fill: botA.color,
          fillOpacity: 0.7,
        }),
        renderLine(c.botRay),
        c.botLabel &&
          !c.botLabel.hide &&
          h(
            "text",
            {
              x: botLp.x,
              y: botLp.y,
              fill: "white",
              fontSize: c.botLabel.fontSize || LABEL_FS_LARGE,
              fontWeight: "bold",
              textAnchor: "middle",
              dominantBaseline: "central",
              className: "degree-label",
            },
            c.botLabel.text,
          ),
      ),
    );
  };

  const renderFloatingLabel = () => {
    if (!floatingLabel) return null;
    return h(
      "text",
      {
        x: floatingLabel.x,
        y: floatingLabel.y,
        fill: "white",
        fontSize: 32,
        fontWeight: "bold",
        textAnchor: "middle",
        dominantBaseline: "central",
        opacity: floatingLabel.opacity,
      },
      floatingLabel.text,
    );
  };

  const inputBoxClass =
    "answer-input-box" +
    (inputState === "correct" ? " correct" : "") +
    (inputState === "wrong" ? " wrong" : "") +
    (shakeInput ? " shake" : "");

  return h(
    "div",
    { className: "main-canvas-container" },
    h(
      "div",
      { className: "diagram-panel" },
      h(
        "svg",
        { className: "diagram-svg", viewBox: "0 0 800 500" },
        renderDefs(),
        renderLines(),
        renderAngles(),
        renderCloneAngle(),
        renderCoInteriorCopies(),
        renderArc(),
        renderFloatingLabel(),
      ),
    ),
    h(
      "div",
      { className: "interaction-panel" },
      h(
        "div",
        {
          className:
            "panel-feedback-box" +
            (feedbackMode ? " visible " + feedbackMode : ""),
        },
        feedbackText,
      ),
      h(
        "div",
        { className: "input-row" },
        h("span", { className: "input-prefix" }, APP_DATA.input.prefix),
        h(
          "div",
          {
            ref: inputBoxRef,
            className: inputBoxClass,
          },
          inputValue || "\u00A0",
        ),
      ),
      h(
        "div",
        { className: "numpad-wrapper" },
        h(Numpad, {
          disabled: numpadDisabled,
          onNumberClick: handleNumberClick,
          onClear: handleClear,
          onSubmit: handleSubmit,
        }),
      ),
    ),
  );
};
