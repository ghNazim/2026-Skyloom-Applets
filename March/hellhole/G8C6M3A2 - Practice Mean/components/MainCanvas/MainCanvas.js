function buildStudentRows(visual) {
  if (!visual) return [];
  if (visual.layout === "q3Bags") return [];
  if (visual.layout === "q4Slots") return [];
  if (
    visual.studentImageSingle &&
    visual.studentSizesPattern &&
    visual.studentSizesPattern.length
  ) {
    return visual.studentSizesPattern.map(function (sizeToken, idx) {
      return {
        image: visual.studentImageSingle,
        count: idx + 1,
        sizeClass:
          sizeToken === "full"
            ? ""
            : sizeToken === "medium"
              ? "student-size-medium"
              : "student-size-small",
      };
    });
  }
  const arr = [];
  const n = visual.studentCount || 0;
  let i;
  for (i = 1; i <= n; i += 1) {
    arr.push({
      image: visual.studentImagePrefix + i + visual.studentImageSuffix,
      count: i,
      sizeClass: "",
    });
  }
  return arr;
}

function flagForHighlightKey(key, flags) {
  if (key === "students") return flags.studentsDone;
  if (key === "total") return flags.totalDone;
  if (key === "mean") return flags.meanDone;
  if (key === "bags") return flags.bagsDone;
  if (key === "dataset") return flags.datasetDone;
  if (key === "missing") return flags.missingDone;
  return false;
}

function highlightFlagsFromStatus(st) {
  return {
    studentsDone: st.studentsDone,
    totalDone: st.totalDone,
    meanDone: st.meanDone,
    bagsDone: st.bagsDone,
    datasetDone: st.datasetDone,
    missingDone: st.missingDone,
  };
}

function countStep2Progress(keysOrder, flags) {
  const ko = keysOrder || ["students", "total", "mean"];
  let c = 0;
  let i;
  for (i = 0; i < ko.length; i += 1) {
    if (flagForHighlightKey(ko[i], flags)) c += 1;
  }
  return c;
}

function getStep2ProgressiveQuestionText(step2Data, status) {
  if (status.showWrong && step2Data.questionTextWrong) {
    return step2Data.questionTextWrong;
  }
  const keysOrder = step2Data.keysOrder || ["students", "total", "mean"];
  const n = countStep2Progress(keysOrder, status);
  const base = step2Data.questionText || "";
  if (n <= 0) return base;
  if (n === 1) {
    return step2Data.questionText2 !== undefined &&
      step2Data.questionText2 !== null
      ? step2Data.questionText2
      : base;
  }
  if (n === 2) {
    return step2Data.questionText3 !== undefined &&
      step2Data.questionText3 !== null
      ? step2Data.questionText3
      : base;
  }
  const koLen = keysOrder.length;
  if (koLen >= 4 && n === 3) {
    return step2Data.questionText4 !== undefined &&
      step2Data.questionText4 !== null
      ? step2Data.questionText4
      : step2Data.questionText3 !== undefined &&
          step2Data.questionText3 !== null
        ? step2Data.questionText3
        : base;
  }
  return step2Data.questionTextComplete !== undefined &&
    step2Data.questionTextComplete !== null
    ? step2Data.questionTextComplete
    : base;
}

function computeNavMode(step2Data, flags) {
  const keysOrder = step2Data.keysOrder || ["students", "total", "mean"];
  const priorKeys = keysOrder.slice(0, keysOrder.length - 1);
  const lastKey = keysOrder[keysOrder.length - 1];
  let priorDone = true;
  let pi;
  for (pi = 0; pi < priorKeys.length; pi += 1) {
    if (!flagForHighlightKey(priorKeys[pi], flags)) {
      priorDone = false;
      break;
    }
  }
  const lastDone = flagForHighlightKey(lastKey, flags);
  if (lastDone) return "done";
  if (priorDone) return "find";
  return "given";
}

const MainCanvas = (props) => {
  const {
    step,
    questionIndex,
    questionCount,
    onSetNextEnabled,
    onUpdateNavText,
    onUpdateQuestionText,
  } = props;
  const { useState, useEffect, useLayoutEffect, useMemo, useRef } = React;

  const stepsBundle = APP_DATA.questions[questionIndex];
  const steps = stepsBundle.steps;
  const step1Data = steps[1];
  const step2Data = steps[2];
  const step3Data = steps[3];
  const labels = APP_DATA.labels;

  const [status, setStatus] = useState({
    studentsDone: false,
    totalDone: false,
    meanDone: false,
    bagsDone: false,
    datasetDone: false,
    missingDone: false,
    q3ImagesRevealed: false,
    showWrong: false,
    navMode: "given",
  });
  const [givenItems, setGivenItems] = useState([]);
  const [toFindItems, setToFindItems] = useState([]);
  const [showStudents, setShowStudents] = useState(false);
  const [showTotalBox, setShowTotalBox] = useState(false);
  const [showMeanBox, setShowMeanBox] = useState(false);
  const [step2HighlightsReady, setStep2HighlightsReady] = useState(false);
  const [step2EnterStage, setStep2EnterStage] = useState("idle");
  const [step2Animating, setStep2Animating] = useState(false);
  const [step3PhaseIndex, setStep3PhaseIndex] = useState(0);
  const [step3Exp1Html, setStep3Exp1Html] = useState("");
  const [step3Exp2Html, setStep3Exp2Html] = useState("");
  const [step3WrongIndex, setStep3WrongIndex] = useState(null);
  const [step3ShakeIndex, setStep3ShakeIndex] = useState(null);
  const [step3McqActive, setStep3McqActive] = useState(false);
  const [step3QuestionHtml, setStep3QuestionHtml] = useState("");
  const [step3MeanValue, setStep3MeanValue] = useState("?");
  const [step3TotalValue, setStep3TotalValue] = useState("");
  const [step3CalcCollapsed, setStep3CalcCollapsed] = useState(false);
  const [step3Animating, setStep3Animating] = useState(false);
  const [step3NSlotValue, setStep3NSlotValue] = useState("n");
  const [step3Q3FinalGrid, setStep3Q3FinalGrid] = useState(false);
  const [q3Step2LabelsRevealed, setQ3Step2LabelsRevealed] = useState(false);
  const [step3XSlotValue, setStep3XSlotValue] = useState("x");
  const [q4Step2SlotsMounted, setQ4Step2SlotsMounted] = useState(false);
  const [deferStudentLabels, setDeferStudentLabels] = useState(false);

  const step2RootRef = useRef(null);
  const imageColumnRef = useRef(null);
  const totalSlotRef = useRef(null);
  const meanSlotRef = useRef(null);
  const studentsLoadedRef = useRef(false);
  const step3Exp1Ref = useRef(null);
  const step3Exp2Ref = useRef(null);
  const step3MeanValueRef = useRef(null);
  const step3TotalValueRef = useRef(null);
  const step3NLabelRef = useRef(null);
  const step3XSlotRef = useRef(null);
  const findBoxRef = useRef(null);
  const step3VisualRootRef = useRef(null);
  const step2TransitionTimerRef = useRef(null);
  const step2TransitionTimerRef2 = useRef(null);
  const step2TransitionTimerRef3 = useRef(null);
  const q4LabelsShownRef = useRef(false);
  const q4ValuesShownRef = useRef(false);
  /** Q1 step 2: user tapped total before students — images first, labels on students tap */
  const studentsRevealVariantRef = useRef(null);
  const statusRef = useRef(status);
  statusRef.current = status;

  const answerSlot = step3Data.answerSlot || "mean";
  const finalAnswer = step3Data.finalAnswer || "75";

  const students = useMemo(
    function () {
      return buildStudentRows(step2Data.visual);
    },
    [step2Data.visual],
  );

  const studentsStep3 = useMemo(
    function () {
      return buildStudentRows(step3Data.visual);
    },
    [step3Data.visual],
  );

  const phaseToExp1Html = (phase, prevPhaseCorrectHtml) => {
    if (phase.exp1FromPrevious) {
      return prevPhaseCorrectHtml || "";
    }
    if (phase.exp1 && phase.exp1.type === "mean_formula") {
      if (typeof renderFractionHTML === "function") {
        return (
          phase.exp1.left +
          " " +
          renderFractionHTML(phase.exp1.numerator, phase.exp1.denominator)
        );
      }
      return phase.exp1.left;
    }
    if (phase.exp1 && phase.exp1.type === "html" && phase.exp1.html) {
      return phase.exp1.html;
    }
    return "";
  };

  const optionToHtml = (option) => {
    const lhs = "<span class='eq-lhs'>" + option.lhs + "</span>";
    let rhs = "";
    if (option.rhsFraction) {
      if (typeof renderFractionHTML === "function") {
        rhs = renderFractionHTML(
          option.rhsFraction.numerator,
          option.rhsFraction.denominator,
        );
      } else {
        rhs =
          option.rhsFraction.numerator + " / " + option.rhsFraction.denominator;
      }
      rhs = "<span class='eq-rhs-frac'>" + rhs + "</span>";
    } else {
      rhs = "<span class='eq-rhs-value'>" + option.rhs + "</span>";
    }
    return lhs + " = " + rhs;
  };

  useEffect(() => {
    if (step === 1) {
      onSetNextEnabled(true);
      onUpdateNavText(step1Data.navText);
      onUpdateQuestionText(step1Data.questionText);
    }
    if (step === 2) {
      const ko = step2Data.keysOrder || ["students", "total", "mean"];
      const allStep2Done = ko.every(function (k) {
        return flagForHighlightKey(k, status);
      });
      onSetNextEnabled(allStep2Done);
      onUpdateQuestionText(getStep2ProgressiveQuestionText(step2Data, status));
      if (allStep2Done) {
        onUpdateNavText(step2Data.navTextDone);
      } else if (
        computeNavMode(step2Data, highlightFlagsFromStatus(status)) === "find"
      ) {
        onUpdateNavText(step2Data.navTextToFind);
      } else {
        onUpdateNavText(step2Data.navText);
      }
    }
    if (step === 3) {
      const allowNext = step3CalcCollapsed;
      onSetNextEnabled(allowNext);
      onUpdateQuestionText(step3QuestionHtml || step3Data.questionText);
      if (step3CalcCollapsed) {
        onUpdateNavText(step3Data.navTextDone);
      } else if (step3Animating) {
        onUpdateNavText("");
      } else if (step3McqActive) {
        onUpdateNavText(step3Data.navText);
      } else {
        onUpdateNavText("");
      }
    }
  }, [
    step,
    status,
    step3CalcCollapsed,
    step3McqActive,
    step3Animating,
    step3QuestionHtml,
    questionIndex,
    questionCount,
  ]);

  useLayoutEffect(() => {
    if (step2TransitionTimerRef.current) {
      clearTimeout(step2TransitionTimerRef.current);
      step2TransitionTimerRef.current = null;
    }
    if (step2TransitionTimerRef2.current) {
      clearTimeout(step2TransitionTimerRef2.current);
      step2TransitionTimerRef2.current = null;
    }
    if (step2TransitionTimerRef3.current) {
      clearTimeout(step2TransitionTimerRef3.current);
      step2TransitionTimerRef3.current = null;
    }

    if (step === 2) {
      const ko = step2Data.keysOrder || ["students", "total", "mean"];
      const flags = highlightFlagsFromStatus(statusRef.current);
      const allStep2Done = ko.every(function (k) {
        return flagForHighlightKey(k, flags);
      });

      if (allStep2Done) {
        setStep2Animating(false);
        setStep2EnterStage("done");
        setStep2HighlightsReady(true);
        return;
      }

      setStep2HighlightsReady(false);
      setStep2Animating(false);
      setStep2EnterStage("stage1");
      step2TransitionTimerRef.current = setTimeout(() => {
        setStep2EnterStage("stage2");
        step2TransitionTimerRef2.current = setTimeout(() => {
          setStep2EnterStage("stage3");
          step2TransitionTimerRef3.current = setTimeout(() => {
            setStep2HighlightsReady(true);
            setStep2EnterStage("done");
          }, 430);
        }, 430);
      }, 430);
      return;
    }

    setStep2HighlightsReady(false);
    setStep2Animating(false);
    setStep2EnterStage("idle");
  }, [step, questionIndex]);

  useLayoutEffect(() => {
    if (step !== 2 || !step2HighlightsReady || !step2RootRef.current) return;
    const root = step2RootRef.current;
    const ko = step2Data.keysOrder || ["students", "total", "mean"];
    let ki;
    for (ki = 0; ki < ko.length; ki += 1) {
      const key = ko[ki];
      if (!flagForHighlightKey(key, highlightFlagsFromStatus(statusRef.current))) {
        continue;
      }
      const el = root.querySelector('[data-key="' + key + '"]');
      if (el && !el.classList.contains("clicked")) {
        el.classList.add("clicked");
      }
    }
  }, [step, step2HighlightsReady, questionIndex]);

  useLayoutEffect(() => {
    if (step !== 2 || !q4Step2SlotsMounted) return;
    const vis = step2Data.visual;
    if (!vis || vis.layout !== "q4Slots") return;
    const col = imageColumnRef.current;
    if (!col) return;
    const cells = col.querySelectorAll(".q4-slot-cell");
    const lbl = col.querySelectorAll(".q4-slot-count");
    const vals = col.querySelectorAll(".q4-slot-inner-value");
    const ko = step2Data.keysOrder || ["students", "total", "mean"];
    const flags = highlightFlagsFromStatus(statusRef.current);
    const allStep2Done = ko.every(function (k) {
      return flagForHighlightKey(k, flags);
    });
    if (allStep2Done) {
      gsap.set(cells, { opacity: 1 });
      gsap.set(lbl, { opacity: 1 });
      gsap.set(vals, { opacity: 1 });
      return;
    }
    gsap.set(cells, { opacity: 0 });
    gsap.set(lbl, { opacity: q4LabelsShownRef.current ? 1 : 0 });
    gsap.set(vals, { opacity: q4ValuesShownRef.current ? 1 : 0 });
  }, [step, q4Step2SlotsMounted, questionIndex]);

  useEffect(() => {
    studentsLoadedRef.current = false;
    setStatus({
      studentsDone: false,
      totalDone: false,
      meanDone: false,
      bagsDone: false,
      datasetDone: false,
      missingDone: false,
      q3ImagesRevealed: false,
      showWrong: false,
      navMode: "given",
    });
    setGivenItems([]);
    setToFindItems([]);
    setShowStudents(false);
    setShowTotalBox(false);
    setShowMeanBox(false);
    setDeferStudentLabels(false);
    studentsRevealVariantRef.current = null;
    setStep3NSlotValue("n");
    setStep3Q3FinalGrid(false);
    setQ3Step2LabelsRevealed(false);
    q4LabelsShownRef.current = false;
    q4ValuesShownRef.current = false;
    setQ4Step2SlotsMounted(false);
  }, [questionIndex]);

  useEffect(() => {
    if (step !== 3) return;
    const phase0 = step3Data.phases[0];
    setStep3PhaseIndex(0);
    setStep3Exp1Html(phaseToExp1Html(phase0, ""));
    setStep3Exp2Html("");
    setStep3WrongIndex(null);
    setStep3ShakeIndex(null);
    setStep3McqActive(true);
    setStep3QuestionHtml(phase0.q);
    setStep3MeanValue(step3Data.visual.meanValue);
    setStep3TotalValue(step3Data.visual.totalValue);
    setStep3CalcCollapsed(false);
    setStep3Animating(false);
    setStep3NSlotValue("n");
    const vInit = step3Data.visual;
    if (vInit && vInit.layout === "q4Slots") {
      const ix =
        vInit.missingSlotIndex != null ? vInit.missingSlotIndex : 2;
      const vals = vInit.slotValues || [];
      setStep3XSlotValue(vals[ix] != null ? String(vals[ix]) : "x");
    } else {
      setStep3XSlotValue("x");
    }
    setStep3Q3FinalGrid(false);
  }, [step, questionIndex]);

  useEffect(() => {
    if (step !== 3 || !step3Q3FinalGrid || !step3CalcCollapsed) return;
    if (step3Data.visual && step3Data.visual.layout !== "q3Bags") return;
    const root = step3VisualRootRef.current;
    if (!root) return;
    const cells = root.querySelectorAll(".q3-final-bag-cell");
    if (!cells.length) return;
    const eachStagger = 2 / Math.max(cells.length, 1);
    gsap.fromTo(
      cells,
      { opacity: 0, scale: 0.35 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.1,
        stagger: eachStagger,
        ease: "power2.out",
      },
    );
  }, [step, step3Q3FinalGrid, step3CalcCollapsed, questionIndex]);

  useEffect(() => {
    if (step !== 2 || !showStudents || studentsLoadedRef.current) return;
    if (step2Data.visual && step2Data.visual.layout === "q3Bags") return;
    if (step2Data.visual && step2Data.visual.layout === "q4Slots") return;
    const items = step2RootRef.current.querySelectorAll(".student-item");
    if (!items.length) return;

    const finishTotalAfterClone = () => {
      markHighlightClicked("total");
      setShowTotalBox(true);
      setGivenItems((prev) =>
        step2Data.givenTotal && prev.indexOf(step2Data.givenTotal) === -1
          ? prev.concat(step2Data.givenTotal)
          : prev,
      );
      setToFindItems((prev) =>
        step2Data.toFindTotal && prev.indexOf(step2Data.toFindTotal) === -1
          ? prev.concat(step2Data.toFindTotal)
          : prev,
      );
      setStatus((prev) => {
        const nextFlags = { ...prev, totalDone: true };
        return {
          ...prev,
          totalDone: true,
          navMode: computeNavMode(step2Data, nextFlags),
        };
      });
      setStep2Animating(false);
    };

    if (
      questionIndex === 0 &&
      step2Data.givenHighlightsAnyOrder &&
      studentsRevealVariantRef.current === "total_first"
    ) {
      studentsLoadedRef.current = true;
      const n = items.length;
      const totalSec = 2;
      const itemDur = 0.22;
      const staggerEach =
        n <= 1 ? 0 : Math.max((totalSec - itemDur) / (n - 1), 0.04);
      gsap.fromTo(
        items,
        { opacity: 0, scale: 0, y: 16 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: itemDur,
          stagger: { each: staggerEach },
          ease: "power2.out",
          onComplete: () => {
            const totalEl = step2RootRef.current.querySelector(
              '[data-key="total"]',
            );
            if (!totalEl || !totalSlotRef.current) {
              finishTotalAfterClone();
              return;
            }
            animateCloneTo(totalEl, totalSlotRef.current, finishTotalAfterClone);
          },
        },
      );
      return;
    }

    gsap.fromTo(
      items,
      { opacity: 0, scale: 0, y: 20 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.45,
        stagger: {
          each: 0.3,
          onStart: () => {
            if (typeof playSound === "function") playSound("tick");
          },
        },
        ease: "back.out(1.7)",
        onComplete: () => {
          setGivenItems((prev) =>
            prev.indexOf(step2Data.givenN) === -1
              ? prev.concat(step2Data.givenN)
              : prev,
          );
          setStatus((prev) => {
            const flags = { ...prev, studentsDone: true };
            return {
              ...prev,
              studentsDone: true,
              navMode: computeNavMode(step2Data, flags),
            };
          });
          setStep2Animating(false);
        },
      },
    );
    studentsLoadedRef.current = true;
  }, [step, showStudents, questionIndex]);

  const markHighlightClicked = (key) => {
    const el = step2RootRef.current.querySelector('[data-key="' + key + '"]');
    if (el && !el.classList.contains("clicked")) {
      el.classList.add("clicked");
    }
  };

  const animateCloneTo = (sourceEl, targetEl, done, options) => {
    if (!targetEl) {
      if (typeof done === "function") done();
      return;
    }

    const sourceRect = sourceEl.getBoundingClientRect();
    const sourceStyle = window.getComputedStyle(sourceEl);
    const cloneColor =
      options && options.cloneColor != null ? options.cloneColor : null;

    const clone = sourceEl.cloneNode(true);
    clone.className = (clone.className + " moving-clone").trim();
    clone.style.background = "transparent";
    clone.style.padding = "0";
    clone.style.borderRadius = "0";
    clone.style.boxSizing = "border-box";
    clone.style.position = "fixed";
    clone.style.left = sourceRect.left + "px";
    clone.style.top = sourceRect.top + "px";
    clone.style.width = sourceRect.width + "px";
    clone.style.height = sourceRect.height + "px";
    clone.style.margin = "0";
    clone.style.zIndex = "2147483647";
    clone.style.pointerEvents = "none";
    clone.style.opacity = "1";
    clone.style.fontSize = sourceStyle.fontSize;
    clone.style.fontFamily = sourceStyle.fontFamily;
    clone.style.fontWeight = sourceStyle.fontWeight;
    clone.style.fontStyle = sourceStyle.fontStyle;
    clone.style.lineHeight = sourceStyle.lineHeight;
    clone.style.letterSpacing = sourceStyle.letterSpacing;
    clone.style.color = cloneColor || sourceStyle.color;
    clone.style.textTransform = sourceStyle.textTransform;

    document.body.appendChild(clone);

    const runTween = () => {
      gsap.killTweensOf(clone);

      const cloneRect = clone.getBoundingClientRect();
      const targetRect = targetEl.getBoundingClientRect();

      const tcx = targetRect.left + targetRect.width / 2;
      const tcy = targetRect.top + targetRect.height / 2;
      const endLeft = tcx - cloneRect.width / 2;
      const endTop = tcy - cloneRect.height / 2;

      gsap.fromTo(
        clone,
        {
          left: cloneRect.left,
          top: cloneRect.top,
          immediateRender: false,
        },
        {
          left: endLeft,
          top: endTop,
          duration: 0.5,
          ease: "power2.inOut",
          overwrite: "auto",
          onComplete: () => {
            gsap.killTweensOf(clone);
            clone.remove();
            if (typeof done === "function") done();
          },
        },
      );
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(runTween);
    });
  };

  const runQ3BagImageStagger = (onDone) => {
    const root = step2RootRef.current;
    if (!root) {
      if (typeof onDone === "function") onDone();
      return;
    }
    const imgs = root.querySelectorAll(".q3-bag-img-inner");
    if (!imgs.length) {
      if (typeof onDone === "function") onDone();
      return;
    }
    gsap.fromTo(
      imgs,
      { opacity: 0, scale: 0.45 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.14,
        stagger: {
          each: 0.16,
          onStart: function () {
            if (typeof playSound === "function") playSound("tick");
          },
        },
        ease: "power2.out",
        onComplete: function () {
          if (typeof onDone === "function") onDone();
        },
      },
    );
  };

  const runQ4RevealSlotsAndLabels = (columnEl, done) => {
    const cells = columnEl.querySelectorAll(".q4-slot-cell");
    const labels = columnEl.querySelectorAll(".q4-slot-count");
    const values = columnEl.querySelectorAll(".q4-slot-inner-value");
    gsap.set(values, { opacity: 0 });
    gsap.fromTo(
      cells,
      { opacity: 0, scale: 0.82 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.35,
        stagger: 0.09,
        ease: "back.out(1.35)",
        onComplete: () => {
          gsap.fromTo(
            labels,
            { opacity: 0, y: -8 },
            {
              opacity: 1,
              y: 0,
              duration: 0.25,
              stagger: 0.07,
              ease: "power2.out",
              onComplete: done,
            },
          );
        },
      },
    );
  };

  const runQ4RevealSlotsAndValues = (columnEl, done) => {
    const cells = columnEl.querySelectorAll(".q4-slot-cell");
    const labels = columnEl.querySelectorAll(".q4-slot-count");
    const values = columnEl.querySelectorAll(".q4-slot-inner-value");
    gsap.set(labels, { opacity: 0 });
    gsap.fromTo(
      cells,
      { opacity: 0, scale: 0.82 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.35,
        stagger: 0.09,
        ease: "back.out(1.35)",
        onComplete: () => {
          gsap.fromTo(
            values,
            { opacity: 0, scale: 0.85 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.28,
              stagger: 0.07,
              ease: "power2.out",
              onComplete: done,
            },
          );
        },
      },
    );
  };

  const runQ4RevealLabelsOnly = (columnEl, done) => {
    const labels = columnEl.querySelectorAll(".q4-slot-count");
    gsap.set(labels, { opacity: 0 });
    gsap.fromTo(
      labels,
      { opacity: 0, y: -8 },
      {
        opacity: 1,
        y: 0,
        duration: 0.25,
        stagger: 0.07,
        ease: "power2.out",
        onComplete: done,
      },
    );
  };

  const runQ4RevealValuesOnly = (columnEl, done) => {
    const values = columnEl.querySelectorAll(".q4-slot-inner-value");
    gsap.set(values, { opacity: 0 });
    gsap.fromTo(
      values,
      { opacity: 0, scale: 0.85 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.28,
        stagger: 0.07,
        ease: "power2.out",
        onComplete: done,
      },
    );
  };

  const handleQ4Step2Highlight = (key, event) => {
    const columnEl = imageColumnRef.current;
    const wrapFinishStudents = () => {
      q4LabelsShownRef.current = true;
      markHighlightClicked("students");
      setGivenItems((prev) =>
        step2Data.givenN && prev.indexOf(step2Data.givenN) === -1
          ? prev.concat(step2Data.givenN)
          : prev,
      );
      setStatus((prev) => {
        const next = { ...prev, studentsDone: true };
        return {
          ...next,
          navMode: computeNavMode(step2Data, highlightFlagsFromStatus(next)),
        };
      });
      setStep2Animating(false);
    };
    const wrapFinishDataset = () => {
      q4ValuesShownRef.current = true;
      markHighlightClicked("dataset");
      setGivenItems((prev) =>
        step2Data.givenValues && prev.indexOf(step2Data.givenValues) === -1
          ? prev.concat(step2Data.givenValues)
          : prev,
      );
      setStatus((prev) => {
        const next = { ...prev, datasetDone: true };
        return {
          ...next,
          navMode: computeNavMode(step2Data, highlightFlagsFromStatus(next)),
        };
      });
      setStep2Animating(false);
    };

    if (key === "students" && !status.studentsDone) {
      setStep2Animating(true);
      animateCloneTo(event.target, columnEl, () => {
        if (!columnEl) {
          setStep2Animating(false);
          return;
        }
        setQ4Step2SlotsMounted(true);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            const col = imageColumnRef.current;
            if (!col) {
              setStep2Animating(false);
              return;
            }
            const lv = q4LabelsShownRef.current;
            const vv = q4ValuesShownRef.current;
            if (!lv && !vv)
              runQ4RevealSlotsAndLabels(col, wrapFinishStudents);
            else if (vv && !lv)
              runQ4RevealLabelsOnly(col, wrapFinishStudents);
            else wrapFinishStudents();
          });
        });
      });
      return;
    }

    if (key === "dataset" && !status.datasetDone) {
      setStep2Animating(true);
      animateCloneTo(event.target, columnEl, () => {
        if (!columnEl) {
          setStep2Animating(false);
          return;
        }
        setQ4Step2SlotsMounted(true);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            const col = imageColumnRef.current;
            if (!col) {
              setStep2Animating(false);
              return;
            }
            const lv = q4LabelsShownRef.current;
            const vv = q4ValuesShownRef.current;
            if (!lv && !vv)
              runQ4RevealSlotsAndValues(col, wrapFinishDataset);
            else if (lv && !vv)
              runQ4RevealValuesOnly(col, wrapFinishDataset);
            else wrapFinishDataset();
          });
        });
      });
      return;
    }

    if (key === "mean" && !status.meanDone) {
      setStep2Animating(true);
      animateCloneTo(event.target, meanSlotRef.current, () => {
        markHighlightClicked("mean");
        setShowMeanBox(true);
        setGivenItems((prev) =>
          step2Data.givenMean && prev.indexOf(step2Data.givenMean) === -1
            ? prev.concat(step2Data.givenMean)
            : prev,
        );
        setStatus((prev) => {
          const next = { ...prev, meanDone: true };
          return {
            ...next,
            navMode: computeNavMode(step2Data, highlightFlagsFromStatus(next)),
          };
        });
        setStep2Animating(false);
      });
      return;
    }

    if (key === "missing" && !status.missingDone) {
      const root = step2RootRef.current;
      const xEl = root
        ? root.querySelector(".q4-slot-missing-value")
        : null;
      setStep2Animating(true);
      const runMissing = () => {
        markHighlightClicked("missing");
        setShowTotalBox(true);
        setToFindItems((prev) =>
          step2Data.toFindX && prev.indexOf(step2Data.toFindX) === -1
            ? prev.concat(step2Data.toFindX)
            : prev,
        );
        setStatus((prev) => {
          const next = { ...prev, missingDone: true };
          return {
            ...next,
            navMode: computeNavMode(step2Data, highlightFlagsFromStatus(next)),
          };
        });
        setStep2Animating(false);
      };
      if (xEl && findBoxRef.current) {
        animateCloneTo(xEl, findBoxRef.current, runMissing);
      } else {
        runMissing();
      }
    }
  };

  const handleQ3Step2Highlight = (key, event) => {
    if (key === "total" && !status.totalDone) {
      const afterClone = () => {
        markHighlightClicked("total");
        setShowTotalBox(true);
        setGivenItems((prev) =>
          step2Data.givenTotal && prev.indexOf(step2Data.givenTotal) === -1
            ? prev.concat(step2Data.givenTotal)
            : prev,
        );
        setStatus((prev) => {
          const next = { ...prev, totalDone: true, q3ImagesRevealed: true };
          return { ...next, navMode: computeNavMode(step2Data, next) };
        });
        setStep2Animating(false);
      };
      setStep2Animating(true);
      if (!status.q3ImagesRevealed) {
        runQ3BagImageStagger(function () {
          animateCloneTo(event.target, totalSlotRef.current, afterClone);
        });
      } else {
        animateCloneTo(event.target, totalSlotRef.current, afterClone);
      }
      return;
    }
    if (key === "mean" && !status.meanDone) {
      const afterClone = () => {
        markHighlightClicked("mean");
        setShowMeanBox(true);
        setGivenItems((prev) =>
          step2Data.givenMean && prev.indexOf(step2Data.givenMean) === -1
            ? prev.concat(step2Data.givenMean)
            : prev,
        );
        setStatus((prev) => {
          const next = { ...prev, meanDone: true, q3ImagesRevealed: true };
          return { ...next, navMode: computeNavMode(step2Data, next) };
        });
        setStep2Animating(false);
      };
      setStep2Animating(true);
      if (!status.q3ImagesRevealed) {
        runQ3BagImageStagger(function () {
          animateCloneTo(event.target, meanSlotRef.current, afterClone);
        });
      } else {
        animateCloneTo(event.target, meanSlotRef.current, afterClone);
      }
      return;
    }
    if (key === "bags" && !status.bagsDone) {
      setStep2Animating(true);
      animateCloneTo(event.target, imageColumnRef.current, () => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            const root = step2RootRef.current;
            if (!root) {
              setStep2Animating(false);
              return;
            }
            const labels = root.querySelectorAll(".q3-slot-label");
            gsap.fromTo(
              labels,
              { opacity: 0, y: -6 },
              {
                opacity: 1,
                y: 0,
                duration: 0.2,
                stagger: 0.08,
                ease: "power1.out",
                onComplete: function () {
                  setQ3Step2LabelsRevealed(true);
                  const nLab = root.querySelector(".q3-slot-label-n");
                  if (nLab && findBoxRef.current) {
                    animateCloneTo(
                      nLab,
                      findBoxRef.current,
                      () => {
                        markHighlightClicked("bags");
                        setToFindItems((prev) =>
                          step2Data.toFindN &&
                          prev.indexOf(step2Data.toFindN) === -1
                            ? prev.concat(step2Data.toFindN)
                            : prev,
                        );
                        setStatus((prev) => {
                          const next = { ...prev, bagsDone: true };
                          return {
                            ...next,
                            navMode: computeNavMode(step2Data, next),
                          };
                        });
                        setStep2Animating(false);
                      },
                      { cloneColor: "#ffffff" },
                    );
                  } else {
                    markHighlightClicked("bags");
                    setToFindItems((prev) =>
                      step2Data.toFindN &&
                      prev.indexOf(step2Data.toFindN) === -1
                        ? prev.concat(step2Data.toFindN)
                        : prev,
                    );
                    setStatus((prev) => {
                      const next = { ...prev, bagsDone: true };
                      return {
                        ...next,
                        navMode: computeNavMode(step2Data, next),
                      };
                    });
                    setStep2Animating(false);
                  }
                },
              },
            );
          });
        });
      });
    }
  };

  const advanceFromPhase = (fromPhaseIndex, phaseCorrectHtml) => {
    const phase1RefEl = step3Exp1Ref.current;
    const phase2RefEl = step3Exp2Ref.current;
    const nextPhaseIndex = fromPhaseIndex + 1;
    const nextPhase = step3Data.phases[nextPhaseIndex];

    setStep3Animating(true);
    setStep3McqActive(false);
    if (phase1RefEl && phase2RefEl && nextPhase) {
      const phase1Rect = phase1RefEl.getBoundingClientRect();
      const phase2Rect = phase2RefEl.getBoundingClientRect();
      const deltaY = phase1Rect.top - phase2Rect.top;

      gsap.to(phase1RefEl, {
        opacity: 0,
        duration: 0.5,
        ease: "power1.out",
      });
      gsap.to(phase2RefEl, {
        y: deltaY,
        duration: 0.5,
        ease: "power2.inOut",
        onComplete: () => {
          setStep3PhaseIndex(nextPhaseIndex);
          setStep3Exp1Html(phaseCorrectHtml);
          setStep3Exp2Html("");
          setStep3WrongIndex(null);
          setStep3ShakeIndex(null);
          setStep3QuestionHtml(nextPhase.q);
          setStep3McqActive(true);
          setStep3Animating(false);
          requestAnimationFrame(() => {
            if (step3Exp1Ref.current) {
              gsap.set(step3Exp1Ref.current, { opacity: 1, y: 0 });
            }
            if (step3Exp2Ref.current) {
              gsap.fromTo(
                step3Exp2Ref.current,
                { opacity: 0, y: 12 },
                { opacity: 1, y: 0, duration: 0.5, ease: "power1.out" },
              );
            }
          });
        },
      });
      return;
    }

    if (nextPhase) {
      setStep3PhaseIndex(nextPhaseIndex);
      setStep3Exp1Html(phaseCorrectHtml);
      setStep3Exp2Html("");
      setStep3WrongIndex(null);
      setStep3QuestionHtml(nextPhase.q);
      setStep3McqActive(true);
      setStep3Animating(false);
    }
  };

  const finishStep3WithAnswerFill = () => {
    setStep3Animating(true);
    setStep3McqActive(false);
    const rhsEl =
      step3Exp2Ref.current &&
      step3Exp2Ref.current.querySelector(".eq-rhs-value");
    const sourceEl = rhsEl || step3Exp2Ref.current;
    const phases = step3Data.phases;
    const lastPhase = phases[phases.length - 1];
    const doneMsg =
      step3Data.questionTextDone ||
      lastPhase.qCorrect ||
      lastPhase.q;

    if (answerSlot === "n") {
      const targetEl = step3NLabelRef.current;
      animateCloneTo(sourceEl, targetEl, () => {
        setStep3NSlotValue(String(finalAnswer));
        setTimeout(() => {
          setStep3CalcCollapsed(true);
          setStep3Animating(false);
          setStep3QuestionHtml(doneMsg);
          setStep3Q3FinalGrid(true);
          const allowNext = true;
          onSetNextEnabled(allowNext);
        }, 300);
      });
      return;
    }

    if (answerSlot === "xSlot") {
      const targetEl = step3XSlotRef.current;
      animateCloneTo(sourceEl, targetEl, () => {
        setStep3XSlotValue(String(finalAnswer));
        setTimeout(() => {
          setStep3CalcCollapsed(true);
          setStep3Animating(false);
          setStep3QuestionHtml(doneMsg);
          const allowNext = true;
          onSetNextEnabled(allowNext);
        }, 300);
      });
      return;
    }

    const targetEl =
      answerSlot === "total"
        ? step3TotalValueRef.current
        : step3MeanValueRef.current;

    animateCloneTo(sourceEl, targetEl, () => {
      if (answerSlot === "total") {
        setStep3TotalValue(finalAnswer);
      } else {
        setStep3MeanValue(finalAnswer);
      }
      setTimeout(() => {
        setStep3CalcCollapsed(true);
        setStep3Animating(false);
        setStep3QuestionHtml(doneMsg);
        const allowNext = true;
        onSetNextEnabled(allowNext);
      }, 300);
    });
  };

  const handleStep3OptionClick = (index, event) => {
    if (!step3McqActive || step3Animating) return;
    const phase = step3Data.phases[step3PhaseIndex];
    const option = phase.options[index];
    const selectedHtml = optionToHtml(option);

    if (index !== phase.correct) {
      if (typeof playSound === "function") playSound("wrong");
      setStep3WrongIndex(index);
      setStep3ShakeIndex(index);
      setStep3QuestionHtml(phase.qWrong + "<br>" + phase.q);
      setTimeout(() => {
        setStep3ShakeIndex(null);
      }, 520);
      return;
    }

    if (typeof playSound === "function") playSound("correct");
    setStep3WrongIndex(null);
    if (phase.qCorrect) {
      setStep3QuestionHtml(phase.qCorrect);
    } else {
      setStep3QuestionHtml(phase.q);
    }
    setStep3Animating(true);
    setStep3McqActive(false);

    const sourceEl = event.currentTarget.querySelector(".mcq-option-text");
    const phaseIxSnapshot = step3PhaseIndex;
    const visSnap = step3Data.visual;
    const q4CloneTotal =
      visSnap &&
      visSnap.layout === "q4Slots" &&
      phaseIxSnapshot === 1;

    animateCloneTo(
      sourceEl || event.currentTarget,
      step3Exp2Ref.current,
      () => {
        setStep3Exp2Html(selectedHtml);
        const proceed = () => {
          setStep3Animating(false);
          const lastIx = step3Data.phases.length - 1;
          if (phaseIxSnapshot < lastIx) {
            setTimeout(() => {
              advanceFromPhase(phaseIxSnapshot, selectedHtml);
            }, 300);
          } else {
            setTimeout(() => {
              finishStep3WithAnswerFill();
            }, 300);
          }
        };
        if (
          q4CloneTotal &&
          step3TotalValueRef.current &&
          step3Exp2Ref.current
        ) {
          requestAnimationFrame(() => {
            const lhsEl =
              step3Exp2Ref.current &&
              step3Exp2Ref.current.querySelector(".eq-lhs");
            if (lhsEl) {
              animateCloneTo(lhsEl, step3TotalValueRef.current, () => {
                setStep3TotalValue("30");
                proceed();
              });
              return;
            }
            proceed();
          });
          return;
        }
        proceed();
      },
    );
  };

  const handleWrongClick = (el) => {
    if (typeof playSound === "function") playSound("wrong");
    setStatus((prev) => ({ ...prev, showWrong: true }));
    if (el) {
      el.classList.remove("wrong-highlight-shake");
      void el.offsetWidth;
      el.classList.add("wrong-highlight-shake");
      setTimeout(() => {
        el.classList.remove("wrong-highlight-shake");
      }, 520);
    }
  };

  const validateHighlightOrder = (key, flags) => {
    const keysOrder = step2Data.keysOrder || ["students", "total", "mean"];
    const ix = keysOrder.indexOf(key);
    if (ix === -1) return false;
    const lastKey = keysOrder[keysOrder.length - 1];
    const priorKeys = keysOrder.slice(0, keysOrder.length - 1);

    if (step2Data.givenHighlightsAnyOrder) {
      if (key === lastKey) {
        return priorKeys.every(function (k) {
          return flagForHighlightKey(k, flags);
        });
      }
      return priorKeys.indexOf(key) !== -1;
    }

    let i;
    for (i = 0; i < ix; i += 1) {
      if (!flagForHighlightKey(keysOrder[i], flags)) return false;
    }
    return true;
  };

  const handleHighlightClick = (event) => {
    if (step2Animating || !step2HighlightsReady) return;
    const key = event.target.getAttribute("data-key");
    if (!key) return;

    const flags = highlightFlagsFromStatus(status);

    if (key === "students" && status.studentsDone) return;
    if (key === "total" && status.totalDone) return;
    if (key === "mean" && status.meanDone) return;
    if (key === "bags" && status.bagsDone) return;
    if (key === "dataset" && status.datasetDone) return;
    if (key === "missing" && status.missingDone) return;

    if (!validateHighlightOrder(key, flags)) {
      handleWrongClick(event.target);
      return;
    }

    if (typeof playSound === "function") playSound("click");

    setStatus((prev) => ({ ...prev, showWrong: false }));

    if (step2Data.visual && step2Data.visual.layout === "q4Slots") {
      handleQ4Step2Highlight(key, event);
      return;
    }

    if (step2Data.visual && step2Data.visual.layout === "q3Bags") {
      handleQ3Step2Highlight(key, event);
      return;
    }

    if (key === "students" && !status.studentsDone) {
      const imageColumnEl = imageColumnRef.current;
      const q1TotalFirstContinuation =
        questionIndex === 0 &&
        studentsRevealVariantRef.current === "total_first" &&
        showStudents &&
        imageColumnEl;

      if (q1TotalFirstContinuation) {
        setStep2Animating(true);
        const labels = imageColumnEl.querySelectorAll(
          ".student-item .student-count",
        );
        gsap.set(labels, { opacity: 0 });
        setDeferStudentLabels(false);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            const col = imageColumnRef.current;
            const lbl =
              col &&
              col.querySelectorAll(".student-item .student-count");
            if (!lbl || !lbl.length) {
              setStep2Animating(false);
              return;
            }
            gsap.fromTo(
              lbl,
              { opacity: 0, scale: 0.35, y: -6 },
              {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.35,
                stagger: {
                  each: 0.3,
                  onStart: () => {
                    if (typeof playSound === "function") playSound("tick");
                  },
                },
                ease: "back.out(1.7)",
                onComplete: () => {
                  studentsRevealVariantRef.current = null;
                  markHighlightClicked("students");
                  setGivenItems((prev) =>
                    prev.indexOf(step2Data.givenN) === -1
                      ? prev.concat(step2Data.givenN)
                      : prev,
                  );
                  setStatus((prev) => {
                    const flags = { ...prev, studentsDone: true };
                    return {
                      ...prev,
                      studentsDone: true,
                      navMode: computeNavMode(step2Data, flags),
                    };
                  });
                  setStep2Animating(false);
                },
              },
            );
          });
        });
        return;
      }

      if (!imageColumnEl) return;
      setStep2Animating(true);
      animateCloneTo(event.target, imageColumnEl, () => {
        markHighlightClicked("students");
        setShowStudents(true);
      });
      return;
    }

    if (key === "total" && !status.totalDone) {
      const q1Visual = step2Data.visual;
      const q1TotalFirstIntro =
        questionIndex === 0 &&
        step2Data.givenHighlightsAnyOrder &&
        !status.studentsDone &&
        !(q1Visual && q1Visual.layout === "q3Bags") &&
        !(q1Visual && q1Visual.layout === "q4Slots");

      if (q1TotalFirstIntro) {
        studentsRevealVariantRef.current = "total_first";
        studentsLoadedRef.current = false;
        setDeferStudentLabels(true);
        setStep2Animating(true);
        setShowStudents(true);
        return;
      }

      setStep2Animating(true);
      animateCloneTo(event.target, totalSlotRef.current, () => {
        markHighlightClicked("total");
        setShowTotalBox(true);
        setGivenItems((prev) =>
          step2Data.givenTotal && prev.indexOf(step2Data.givenTotal) === -1
            ? prev.concat(step2Data.givenTotal)
            : prev,
        );
        setToFindItems((prev) =>
          step2Data.toFindTotal && prev.indexOf(step2Data.toFindTotal) === -1
            ? prev.concat(step2Data.toFindTotal)
            : prev,
        );
        setStatus((prev) => {
          const nextFlags = { ...prev, totalDone: true };
          return {
            ...prev,
            totalDone: true,
            navMode: computeNavMode(step2Data, nextFlags),
          };
        });
        setStep2Animating(false);
      });
      return;
    }

    if (key === "mean" && !status.meanDone) {
      setStep2Animating(true);
      animateCloneTo(event.target, meanSlotRef.current, () => {
        markHighlightClicked("mean");
        setShowMeanBox(true);
        setGivenItems((prev) =>
          step2Data.givenMean && prev.indexOf(step2Data.givenMean) === -1
            ? prev.concat(step2Data.givenMean)
            : prev,
        );
        setToFindItems((prev) =>
          step2Data.toFindMean && prev.indexOf(step2Data.toFindMean) === -1
            ? prev.concat(step2Data.toFindMean)
            : prev,
        );
        setStatus((prev) => {
          const nextFlags = { ...prev, meanDone: true };
          return {
            ...prev,
            meanDone: true,
            navMode: computeNavMode(step2Data, nextFlags),
          };
        });
        setStep2Animating(false);
      });
    }
  };

  const renderQ4SlotsStep2 = (visual, showMissingBorder) => {
    const labels = visual.slotLabels || [];
    const values = visual.slotValues || [];
    const missingIx =
      visual.missingSlotIndex != null ? visual.missingSlotIndex : 2;
    return labels.map(function (lab, idx) {
      const innerHtml =
        idx === missingIx
          ? "<span class='q4-x-italic'>x</span>"
          : String(values[idx] != null ? values[idx] : "");
      const missBorder =
        idx === missingIx && showMissingBorder ? "q4-slot-value-missing" : "";
      return React.createElement(
        "div",
        { key: "q4s2-" + idx, className: "q4-slot-cell" },
        React.createElement(
          "span",
          { className: "student-count q4-slot-count" },
          lab,
        ),
        React.createElement(
          "div",
          {
            className: "q4-slot-value-box " + missBorder,
          },
          React.createElement("span", {
            className:
              "q4-slot-inner-value " +
              (idx === missingIx ? "q4-slot-missing-value" : ""),
            dangerouslySetInnerHTML: { __html: innerHtml },
          }),
        ),
      );
    });
  };

  const renderQ4SlotsStep3 = (visual, xVal, xBlinkActive) => {
    const labels = visual.slotLabels || [];
    const values = visual.slotValues || [];
    const missingIx =
      visual.missingSlotIndex != null ? visual.missingSlotIndex : 2;
    return labels.map(function (lab, idx) {
      const isMiss = idx === missingIx;
      const innerEl = isMiss
        ? String(xVal) === "x"
          ? React.createElement(
              "span",
              { className: "q4-x-italic" },
              "x",
            )
          : xVal
        : String(values[idx] != null ? values[idx] : "");
      return React.createElement(
        "div",
        {
          key: "q4s3-" + idx,
          className: "q4-slot-cell q4-slot-cell-step3",
        },
        React.createElement(
          "span",
          {
            className:
              "student-count q4-slot-count q4-slot-count-static",
          },
          lab,
        ),
        React.createElement(
          "div",
          {
            className:
              "q4-slot-value-box " +
              (isMiss ? "q4-slot-value-missing" : ""),
          },
          React.createElement(
            "span",
            {
              className:
                "q4-slot-inner-value " +
                (isMiss ? "q4-slot-missing-value " : "") +
                (isMiss && xBlinkActive ? "mean-value-blink" : ""),
              ref: isMiss ? step3XSlotRef : undefined,
            },
            innerEl,
          ),
        ),
      );
    });
  };

  const renderStatement = (html) =>
    React.createElement("div", {
      className: "question-statement",
      dangerouslySetInnerHTML: { __html: html },
    });

  const renderQ3BagSlots = (visual, slotLabelForN, attachNRef, nBlinkActive) => {
    const bagImg = visual.bagImage || "assets/bag.png";
    const slots = visual.q3Slots || [];
    return slots.map(function (slot, idx) {
      const isEllipsis = slot.type === "ellipsis" || slot.label === "...";
      const sizeClass =
        slot.bagSize === "small"
          ? "q3-bag-size-small"
          : slot.bagSize === "large"
            ? "q3-bag-size-large"
            : slot.bagSize === "medium"
              ? "q3-bag-size-medium"
              : "";
      const labelText =
        slot.isN && slotLabelForN !== undefined && slotLabelForN !== null
          ? slotLabelForN
          : slot.label;
      const labelClass =
        "q3-slot-label" +
        (slot.isN ? " q3-slot-label-n" : "") +
        (slot.isN && nBlinkActive ? " mean-value-blink" : "");
      return React.createElement(
        "div",
        {
          key: "q3-slot-" + idx,
          className: "q3-bag-cell " + sizeClass,
        },
        React.createElement(
          "span",
          {
            className: labelClass,
            ref: slot.isN && attachNRef ? step3NLabelRef : undefined,
          },
          labelText,
        ),
        isEllipsis
          ? React.createElement(
              "div",
              {
                className: "q3-bag-img-inner q3-bag-ellipsis-inner",
              },
              "...",
            )
          : React.createElement(
              "div",
              { className: "q3-bag-img-wrap" },
              React.createElement("img", {
                className: "q3-bag-img-inner",
                src: bagImg,
                alt: "",
              }),
            ),
      );
    });
  };

  const meanBlink =
    step3CalcCollapsed &&
    answerSlot === "mean" &&
    String(step3MeanValue) === String(finalAnswer);
  const totalBlink =
    step3CalcCollapsed &&
    answerSlot === "total" &&
    String(step3TotalValue) === String(finalAnswer);
  const nBlink =
    step3CalcCollapsed &&
    answerSlot === "n" &&
    String(step3NSlotValue) === String(finalAnswer);
  const xBlink =
    step3CalcCollapsed &&
    answerSlot === "xSlot" &&
    String(step3XSlotValue) === String(finalAnswer);

  const q2MeanLayout = questionIndex === 1;
  const q3MeanLayout = questionIndex === 2;
  const q4MeanLayout = questionIndex === 3;

  if (step === 1 || step === 2) {
    const isStep1 = step === 1;
    const hintKeysForReveal = step2Data.revealHintUntilPriorDone
      ? (step2Data.keysOrder || []).slice(0, -1)
      : ["students"];
    const revealHintHidden =
      isStep1 ||
      hintKeysForReveal.every(function (k) {
        return flagForHighlightKey(k, highlightFlagsFromStatus(status));
      });
    const step2PlainStatement = step2Data.statementTemplate.replace(
      /<span[^>]*>(.*?)<\/span>/g,
      "$1",
    );
    return React.createElement(
      "div",
      {
        className:
          "main-canvas-container mean-step2-root " +
          (isStep1 ? "step1-transition-layout" : "step2-transition-layout") +
          (!isStep1 && !step2HighlightsReady ? " step2-entering" : "") +
          (!isStep1 ? " step2-enter-" + step2EnterStage : ""),
        ref: step2RootRef,
      },
      React.createElement(
        "div",
        { className: "comprehend-row" },
        React.createElement(
          "div",
          { className: "info-column" },
          React.createElement(
            "div",
            {
              className:
                "info-box given-box " +
                (status.navMode === "given" && !isStep1 ? "active-blink" : ""),
            },
            React.createElement("h3", null, labels.givenTitle),
            !isStep1 &&
              givenItems.map((item, idx) =>
                React.createElement(
                  "p",
                  { key: "given-" + idx, className: "info-item-fade-in" },
                  item,
                ),
              ),
          ),
          React.createElement(
            "div",
            {
              ref: findBoxRef,
              className:
                "info-box find-box " +
                (status.navMode === "find" && !isStep1 ? "active-blink" : "") +
                (status.navMode === "given" && !isStep1 ? " muted-box" : ""),
            },
            React.createElement("h3", null, labels.toFindTitle),
            !isStep1 &&
              toFindItems.map((item, idx) =>
                React.createElement(
                  "p",
                  { key: "find-" + idx, className: "info-item-fade-in" },
                  item,
                ),
              ),
          ),
        ),
        React.createElement(
          "div",
          {
            className: "statement-column",
            onClick:
              isStep1 || !step2HighlightsReady
                ? undefined
                : handleHighlightClick,
          },
          renderStatement(
            isStep1
              ? step1Data.statement
              : step2HighlightsReady
                ? step2Data.statementTemplate
                : step2PlainStatement,
          ),
        ),
      ),
      React.createElement(
        "div",
        { className: "visual-row" },
        React.createElement(
          "div",
          {
            className:
              "image-column" +
              (!isStep1 &&
              step2Data.visual &&
              step2Data.visual.layout === "q4Slots"
                ? " image-column-q4-slots"
                : "") +
              (!isStep1 &&
              step2Data.visual &&
              step2Data.visual.layout === "q3Bags"
                ? " image-column-q3-bags" +
                  (status.q3ImagesRevealed ? " q3-bag-images-on" : "") +
                  (q3Step2LabelsRevealed ? " q3-bags-labels-on" : "")
                : "") +
              (!isStep1 && deferStudentLabels
                ? " step2-student-counts-deferred"
                : ""),
            ref: imageColumnRef,
          },
          !isStep1 &&
            step2Data.visual &&
            step2Data.visual.layout === "q4Slots" &&
            q4Step2SlotsMounted
            ? renderQ4SlotsStep2(
                step2Data.visual,
                status.datasetDone,
              )
            : !isStep1 &&
                step2Data.visual &&
                step2Data.visual.layout === "q3Bags"
              ? renderQ3BagSlots(step2Data.visual, "n", false, false)
              : showStudents
              ? students.map((student, idx) =>
                  React.createElement(
                    "div",
                    {
                      className:
                        "student-item " +
                        (student.sizeClass ? student.sizeClass + " " : "") +
                        (status.studentsDone ? "shown " : ""),
                      key: "student-" + idx,
                    },
                    React.createElement(
                      "span",
                      { className: "student-count" },
                      student.count,
                    ),
                    React.createElement("img", {
                      src: student.image,
                      alt: "student-" + student.count,
                    }),
                  ),
                )
              : null,
        ),
        React.createElement(
          "div",
          { className: "total-column" },
          React.createElement(
            "div",
            { className: "total-slot", ref: totalSlotRef },
            !isStep1 &&
              showTotalBox &&
              React.createElement(
                React.Fragment,
                null,
                React.createElement("span", { className: "equals-sign" }, "="),
                React.createElement(
                  "div",
                  { className: "metric-box pink-theme" },
                  React.createElement(
                    "span",
                    { className: "metric-label" },
                    labels.total,
                  ),
                  React.createElement(
                    "span",
                    { className: "metric-value" },
                    step2Data.visual.totalValue,
                  ),
                ),
              ),
          ),
        ),
        React.createElement(
          "div",
          {
            className:
              "mean-column" +
              (q2MeanLayout || q4MeanLayout ? " mean-column-q2" : "") +
              (q3MeanLayout ? " mean-column-q3" : ""),
          },
          React.createElement(
            "div",
            { className: "mean-slot", ref: meanSlotRef },
            !isStep1 &&
              showMeanBox &&
              React.createElement(
                React.Fragment,
                null,
                React.createElement("img", {
                  src: step2Data.visual.meanImage,
                  alt: "mean-visual",
                  className: "mean-image",
                }),
                React.createElement(
                  "div",
                  { className: "metric-box orange-theme" },
                  React.createElement(
                    "span",
                    { className: "metric-label" },
                    labels.mean,
                  ),
                  React.createElement(
                    "span",
                    { className: "metric-value" },
                    step2Data.visual.meanValue,
                  ),
                ),
              ),
          ),
        ),
      ),
      React.createElement(
        "p",
        {
          className:
            "reveal-hint " + (revealHintHidden ? "hide-hint" : ""),
        },
        step2Data.revealHint,
      ),
    );
  }

  if (step !== 2) {
    if (step !== 3) {
      return React.createElement("div", { className: "main-canvas-container" });
    }
  }

  if (step === 3) {
    const activePhase = step3Data.phases[step3PhaseIndex];
    const isQ3Bags =
      step3Data.visual && step3Data.visual.layout === "q3Bags";
    const isQ4Slots =
      step3Data.visual && step3Data.visual.layout === "q4Slots";
    const q3BagImg = step3Data.visual
      ? step3Data.visual.bagImage || "assets/bag.png"
      : "assets/bag.png";
    const q3FinalCount =
      (step3Data.visual && step3Data.visual.finalBagCount) || 30;
    const q3FinalCells = [];
    let fi;
    for (fi = 0; fi < q3FinalCount; fi += 1) {
      q3FinalCells.push(
        React.createElement(
          "div",
          { key: "q3f-" + fi, className: "q3-final-bag-cell" },
          React.createElement(
            "span",
            { className: "q3-final-bag-count" },
            String(fi + 1),
          ),
          React.createElement("img", {
            className: "q3-final-bag-img",
            src: q3BagImg,
            alt: "",
          }),
        ),
      );
    }
    return React.createElement(
      "div",
      {
        className:
          "main-canvas-container step3-root " +
          (step3CalcCollapsed ? "step3-root-collapsed" : "") +
          (isQ4Slots ? " step3-root-q4" : ""),
      },
      React.createElement(
        "div",
        {
          ref: step3VisualRootRef,
          className:
            "visual-row step3-visual-row" +
            (isQ3Bags && step3Q3FinalGrid ? " step3-visual-row-q3-final" : ""),
        },
        isQ3Bags
          ? step3Q3FinalGrid
            ? React.createElement(
                "div",
                { className: "image-column q3-final-grid" },
                q3FinalCells,
              )
            : React.createElement(
                "div",
                {
                  className:
                    "image-column image-column-q3-bags" +
                    (status.q3ImagesRevealed ? " q3-bag-images-on" : "") +
                    (q3Step2LabelsRevealed ? " q3-bags-labels-on" : ""),
                },
                renderQ3BagSlots(
                  step3Data.visual,
                  step3NSlotValue,
                  true,
                  nBlink,
                ),
              )
          : isQ4Slots
            ? React.createElement(
                "div",
                {
                  className:
                    "image-column image-column-q4-slots image-column-q4-step3",
                },
                renderQ4SlotsStep3(
                  step3Data.visual,
                  step3XSlotValue,
                  xBlink,
                ),
              )
            : React.createElement(
                "div",
                { className: "image-column" },
                studentsStep3.map((student, idx) =>
                  React.createElement(
                    "div",
                    {
                      className:
                        "student-item shown " +
                        (student.sizeClass ? student.sizeClass + " " : ""),
                      key: "s3-student-" + idx,
                    },
                    React.createElement(
                      "span",
                      { className: "student-count" },
                      student.count,
                    ),
                    React.createElement("img", {
                      src: student.image,
                      alt: "student-" + student.count,
                    }),
                  ),
                ),
              ),
        React.createElement(
          "div",
          { className: "total-column" },
          React.createElement(
            "div",
            { className: "total-slot" },
            React.createElement("span", { className: "equals-sign" }, "="),
            React.createElement(
              "div",
              { className: "metric-box pink-theme" },
              React.createElement(
                "span",
                { className: "metric-label" },
                labels.total,
              ),
              React.createElement(
                "span",
                {
                  className:
                    "metric-value " + (totalBlink ? "mean-value-blink" : ""),
                  ref: step3TotalValueRef,
                },
                step3TotalValue,
              ),
            ),
          ),
        ),
        React.createElement(
          "div",
          {
            className:
              "mean-column" +
              (q2MeanLayout || q4MeanLayout ? " mean-column-q2" : "") +
              (q3MeanLayout ? " mean-column-q3" : ""),
          },
          React.createElement(
            "div",
            { className: "mean-slot" },
            React.createElement("img", {
              src: step3Data.visual.meanImage,
              alt: "mean-visual",
              className: "mean-image",
            }),
            React.createElement(
              "div",
              { className: "metric-box orange-theme" },
              React.createElement(
                "span",
                { className: "metric-label" },
                labels.mean,
              ),
              React.createElement(
                "span",
                {
                  className:
                    "metric-value " + (meanBlink ? "mean-value-blink" : ""),
                  ref: step3MeanValueRef,
                },
                step3MeanValue,
              ),
            ),
          ),
        ),
      ),
      React.createElement(
        "div",
        {
          className:
            "calculation-row " +
            (step3CalcCollapsed ? "calculation-row-collapsed" : ""),
        },
        React.createElement(
          "div",
          { className: "math-box" },
          React.createElement(
            "div",
            { className: "math-expression-line" },
            activePhase.implies1 &&
              React.createElement("span", { className: "implies" }, "⇒"),
            React.createElement("div", {
              ref: step3Exp1Ref,
              className: "expression-box filled",
              dangerouslySetInnerHTML: { __html: step3Exp1Html || "&nbsp;" },
            }),
          ),
          React.createElement(
            "div",
            { className: "math-expression-line" },
            activePhase.implies2 &&
              React.createElement("span", { className: "implies" }, "⇒"),
            React.createElement("div", {
              ref: step3Exp2Ref,
              className:
                "expression-box " + (step3Exp2Html ? "filled" : "empty"),
              dangerouslySetInnerHTML: { __html: step3Exp2Html || "?" },
            }),
          ),
        ),
        React.createElement(
          "div",
          { className: "mcq-box" },
          activePhase.options.map((option, idx) =>
            React.createElement("button", {
              key: "phase-option-" + idx,
              className:
                "mcq-option " +
                (step3WrongIndex === idx ? "wrong-option " : "") +
                (step3ShakeIndex === idx ? "wrong-option-shake" : ""),
              disabled: !step3McqActive,
              onClick: (event) => handleStep3OptionClick(idx, event),
              children: React.createElement("span", {
                className: "mcq-option-text",
                dangerouslySetInnerHTML: { __html: optionToHtml(option) },
              }),
            }),
          ),
        ),
      ),
    );
  }

  return React.createElement("div", { className: "main-canvas-container" });
};
