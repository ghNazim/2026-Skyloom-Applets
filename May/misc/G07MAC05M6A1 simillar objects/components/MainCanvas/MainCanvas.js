const MAX_ROW_VW = 7;
const FLY_DURATION = 0.75;
const FLY_EASE = "power3.inOut";
const COMPARE_IMAGE_OPACITY = 0.4;

const MainCanvas = (props) => {
  const {
    step,
    onSetNextEnabled,
    onUpdateNavText,
    onPrevAvailabilityChange,
    onAnimatingChange,
    registerGoPrevQuestion,
  } = props;

  const { useState, useEffect, useRef, useCallback } = React;

  const questions = APP_DATA.steps[1].questions;
  const totalQuestions = questions.length;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [placedSimilar, setPlacedSimilar] = useState([]);
  const [placedNonSimilar, setPlacedNonSimilar] = useState([]);
  const [columnsTappable, setColumnsTappable] = useState(true);
  const [visualVisible, setVisualVisible] = useState(true);
  const [compareMode, setCompareMode] = useState(false);
  const [correctFlashRow, setCorrectFlashRow] = useState(null);
  const [columnsCompleteHighlight, setColumnsCompleteHighlight] = useState(false);

  const similarColRef = useRef(null);
  const nonSimilarColRef = useRef(null);
  const visualColRef = useRef(null);
  const img1Ref = useRef(null);
  const img2Ref = useRef(null);
  const flyLayerRef = useRef(null);

  const setVisualOutline = (clone1, clone2, enabled, compareFade = false) => {
    clone1.classList.toggle("outlined-yellow", enabled && !compareFade);
    clone2.classList.toggle("outlined-blue", enabled && !compareFade);
    clone1.classList.toggle("compare-outlined-yellow", enabled && compareFade);
    clone2.classList.toggle("compare-outlined-blue", enabled && compareFade);

    if (enabled && compareFade) {
      gsap.set([clone1, clone2], { opacity: 1 });
    }
  };

  const isAnimatingRef = useRef(false);
  const currentQuestionIndexRef = useRef(0);
  const placedSimilarRef = useRef([]);
  const placedNonSimilarRef = useRef([]);
  const allQuestionsDoneRef = useRef(false);
  const pendingRetryRef = useRef(null);
  const completeHighlightTimerRef = useRef(null);

  const clearCompleteHighlightTimer = () => {
    if (completeHighlightTimerRef.current) {
      clearTimeout(completeHighlightTimerRef.current);
      completeHighlightTimerRef.current = null;
    }
  };

  const resetColumnsCompleteHighlight = () => {
    clearCompleteHighlightTimer();
    setColumnsCompleteHighlight(false);
  };

  const setAnimating = (value) => {
    isAnimatingRef.current = value;
    if (onAnimatingChange) onAnimatingChange(value);
    if (!value && !allQuestionsDoneRef.current) setColumnsTappable(true);
  };

  const getQuestion = (index) => questions[index];

  const getRowWidth = (question, which) => {
    const key = which === 1 ? "rowWidth1" : "rowWidth2";
    const configured = parseVw(question[key] || "7vw");
    return Math.min(configured, MAX_ROW_VW) + "vw";
  };

  const parseVw = (value) => {
    if (typeof value === "number") return value;
    if (!value) return 0;
    const match = String(value).match(/([\d.]+)vw/);
    return match ? parseFloat(match[1]) : 0;
  };

  const vwToPx = (vw) => (vw / 100) * window.innerWidth;

  const getVisualLayoutStyle = (question) => {
    const isRow = question.placement === "row";
    return {
      display: "flex",
      flexDirection: isRow ? "row" : "column",
      alignItems: "center",
      justifyContent: "center",
      gap: isRow ? "2vw" : "1.5vw",
      width: "100%",
      height: "100%",
    };
  };

  const getCompareLayoutStyle = () => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    position: "relative",
  });

  const getImageStyle = (question, which, options = {}) => {
    const {
      compare = false,
      useFinal = false,
      opacity = 1,
    } = options;

    const widthKey = useFinal
      ? which === 1
        ? "finalWidth1"
        : "finalWidth2"
      : which === 1
        ? "width1"
        : "width2";

    const style = {
      width: question[widthKey],
      height: "auto",
      opacity,
      objectFit: "contain",
      display: "block",
      flexShrink: 0,
    };

    if (compare) {
      style.position = "absolute";
      style.left = "50%";
      style.top = "50%";
      style.transform = "translate(-50%, -50%)";
    }

    return style;
  };

  const getColumnRef = (columnType) =>
    columnType === "similar" ? similarColRef : nonSimilarColRef;

  const addPlacement = (columnType, questionIndex) => {
    if (columnType === "similar") {
      setPlacedSimilar((prev) => [...prev, questionIndex]);
      placedSimilarRef.current = [...placedSimilarRef.current, questionIndex];
    } else {
      setPlacedNonSimilar((prev) => [...prev, questionIndex]);
      placedNonSimilarRef.current = [
        ...placedNonSimilarRef.current,
        questionIndex,
      ];
    }
  };

  const resetPlacements = (similarList, nonSimilarList) => {
    placedSimilarRef.current = similarList;
    placedNonSimilarRef.current = nonSimilarList;
    setPlacedSimilar(similarList);
    setPlacedNonSimilar(nonSimilarList);
  };

  const flushLayout = () =>
    new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve)),
    );

  const waitForImage = (img) =>
    img.complete && img.naturalWidth > 0
      ? Promise.resolve()
      : new Promise((resolve) => {
          img.addEventListener("load", resolve, { once: true });
          img.addEventListener("error", resolve, { once: true });
        });

  const getPositionsFromImages = (img1, img2) => {
    const r1 = img1.getBoundingClientRect();
    const r2 = img2.getBoundingClientRect();
    const centerY = (r1.top + r1.height / 2 + r2.top + r2.height / 2) / 2;

    return {
      img1: {
        left: r1.left + r1.width / 2,
        top: centerY,
        width: r1.width,
        height: r1.height,
      },
      img2: {
        left: r2.left + r2.width / 2,
        top: centerY,
        width: r2.width,
        height: r2.height,
      },
    };
  };

  const createRowImageEl = (question, which) => {
    const img = document.createElement("img");
    img.className = "row-image";
    img.src = which === 1 ? question.img1 : question.img2;
    img.alt = "";
    img.style.width = getRowWidth(question, which);
    img.style.maxWidth = "7vw";
    return img;
  };

  const measureNextRowPositions = async (columnEl, question) => {
    const rowsContainer = columnEl.querySelector(".column-rows");
    const slot = document.createElement("div");
    slot.className = "image-row image-row-measure";

    const img1 = createRowImageEl(question, 1);
    const img2 = createRowImageEl(question, 2);
    slot.appendChild(img1);
    slot.appendChild(img2);
    rowsContainer.appendChild(slot);

    await Promise.all([waitForImage(img1), waitForImage(img2)]);
    await flushLayout();

    const positions = getPositionsFromImages(img1, img2);
    slot.remove();
    return positions;
  };

  const getVisualImagePositions = () => {
    const img1 = img1Ref.current;
    const img2 = img2Ref.current;
    if (!img1 || !img2) return null;

    const r1 = img1.getBoundingClientRect();
    const r2 = img2.getBoundingClientRect();

    return {
      img1: {
        left: r1.left + r1.width / 2,
        top: r1.top + r1.height / 2,
        width: r1.width,
        height: r1.height,
      },
      img2: {
        left: r2.left + r2.width / 2,
        top: r2.top + r2.height / 2,
        width: r2.width,
        height: r2.height,
      },
    };
  };

  const getVisualCenterPositions = (question) => {
    const visualRect = visualColRef.current.getBoundingClientRect();
    const centerX = visualRect.left + visualRect.width / 2;
    const centerY = visualRect.top + visualRect.height / 2;
    const w1 = vwToPx(parseVw(question.finalWidth1));
    const w2 = vwToPx(parseVw(question.finalWidth2));

    return {
      img1: { left: centerX, top: centerY, width: w1 },
      img2: { left: centerX, top: centerY, width: w2 },
    };
  };

  const createFlyClone = (src, startPos) => {
    const wrap = document.createElement("div");
    wrap.className = "fly-clone-wrap";
    wrap.style.position = "fixed";
    wrap.style.left = startPos.left + "px";
    wrap.style.top = startPos.top + "px";
    wrap.style.transform = "translate(-50%, -50%)";
    wrap.style.zIndex = "1000";
    wrap.style.pointerEvents = "none";

    const img = document.createElement("img");
    img.src =
      typeof src === "string"
        ? src
        : src && (src.currentSrc || src.src)
          ? src.currentSrc || src.src
          : "";
    img.alt = "";
    img.className = "fly-clone visual-image";
    img.style.width = startPos.width + "px";
    img.style.height = "auto";
    img.style.display = "block";
    img.style.opacity = "1";
    img._flyWrap = wrap;

    wrap.appendChild(img);
    flyLayerRef.current.appendChild(wrap);
    return img;
  };

  const removeFlyClones = () => {
    if (!flyLayerRef.current) return;
    flyLayerRef.current.innerHTML = "";
  };

  const animateFlyPair = async (
    fromPositions,
    toPositions,
    duration,
    question,
    options = {},
  ) => {
    const { startOpacity = 1, endOpacity = 1 } = options;
    const clone1 = createFlyClone(question.img1, fromPositions.img1);
    const clone2 = createFlyClone(question.img2, fromPositions.img2);

    await Promise.all([waitForImage(clone1), waitForImage(clone2)]);

    if (startOpacity !== 1) {
      gsap.set([clone1, clone2], { opacity: startOpacity });
    }

    const wrap1 = clone1._flyWrap;
    const wrap2 = clone2._flyWrap;

    const tl = gsap.timeline();
    tl.to(
      wrap1,
      { left: toPositions.img1.left, top: toPositions.img1.top, duration, ease: FLY_EASE },
      0,
    );
    tl.to(
      wrap2,
      { left: toPositions.img2.left, top: toPositions.img2.top, duration, ease: FLY_EASE },
      0,
    );
    tl.to(
      clone1,
      { width: toPositions.img1.width, opacity: endOpacity, duration, ease: FLY_EASE },
      0,
    );
    tl.to(
      clone2,
      { width: toPositions.img2.width, opacity: endOpacity, duration, ease: FLY_EASE },
      0,
    );

    return { tl, clone1, clone2 };
  };

  const getTargetHeight = (clone, target) => {
    if (target.height != null) return target.height;
    if (clone.naturalWidth && clone.naturalHeight) {
      return target.width * (clone.naturalHeight / clone.naturalWidth);
    }
    const r = clone.getBoundingClientRect();
    if (r.width > 0) return target.width * (r.height / r.width);
    return r.height;
  };

  const animateClonesTo = (clone1, clone2, toPositions, duration, options = {}) => {
    const {
      endOpacity = 1,
      animateHeight = false,
      positionOnly = false,
      sizeOnly = false,
    } = options;
    const wrap1 = clone1._flyWrap;
    const wrap2 = clone2._flyWrap;

    const tl = gsap.timeline();

    if (!sizeOnly) {
      tl.to(
        wrap1,
        {
          left: toPositions.img1.left,
          top: toPositions.img1.top,
          duration,
          ease: FLY_EASE,
        },
        0,
      );
      tl.to(
        wrap2,
        {
          left: toPositions.img2.left,
          top: toPositions.img2.top,
          duration,
          ease: FLY_EASE,
        },
        0,
      );
    }

    if (!positionOnly) {
      const img1Props = {
        width: toPositions.img1.width,
        opacity: endOpacity,
        duration,
        ease: FLY_EASE,
      };
      const img2Props = {
        width: toPositions.img2.width,
        opacity: endOpacity,
        duration,
        ease: FLY_EASE,
      };

      if (animateHeight) {
        img1Props.height = getTargetHeight(clone1, toPositions.img1);
        img2Props.height = getTargetHeight(clone2, toPositions.img2);
      }

      tl.to(clone1, img1Props, 0);
      tl.to(clone2, img2Props, 0);
    }

    return tl;
  };

  const waitTimeline = (tl) => {
    if (typeof tl.then === "function") {
      return tl.then();
    }
    return new Promise((resolve) => {
      if (tl.completed()) {
        resolve();
        return;
      }
      tl.eventCallback("onComplete", resolve);
    });
  };

  const animateShorterHeightToMatch = (clone1, clone2) =>
    new Promise((resolve) => {
      const r1 = clone1.getBoundingClientRect();
      const r2 = clone2.getBoundingClientRect();

      if (Math.abs(r1.height - r2.height) < 2) {
        resolve();
        return;
      }

      const shorter = r1.height < r2.height ? clone1 : clone2;
      const taller = shorter === clone1 ? clone2 : clone1;
      const startHeight = Math.min(r1.height, r2.height);
      const targetHeight = Math.max(r1.height, r2.height);
      const naturalW = shorter.naturalWidth;
      const naturalH = shorter.naturalHeight;

      if (!naturalW || !naturalH) {
        resolve();
        return;
      }

      const aspect = naturalW / naturalH;
      const startWidth = shorter.getBoundingClientRect().width;
      const targetWidth = targetHeight * aspect;

      gsap.set(shorter, { maxWidth: "none" });

      gsap.fromTo(
        shorter,
        { width: startWidth, height: startHeight },
        {
          width: targetWidth,
          height: targetHeight,
          duration: 0.5,
          ease: FLY_EASE,
          onComplete: () => {
            gsap.set(shorter, { width: targetWidth, height: targetHeight });
            const tr = taller.getBoundingClientRect();
            gsap.set(taller, { width: tr.width, height: tr.height });
            resolve();
          },
        },
      );
    });

  const separateAndRejoinClones = async (
    clone1,
    clone2,
    originalPositions,
    comparePositions,
  ) => {
    if (typeof playSound === "function") playSound("wrong");

    await waitTimeline(
      animateClonesTo(clone1, clone2, originalPositions, FLY_DURATION, {
        positionOnly: true,
      }),
    );

    await waitTimeline(
      animateClonesTo(clone1, clone2, comparePositions, FLY_DURATION, {
        positionOnly: true,
      }),
    );
  };

  const shakeClones = (clone1, clone2) =>
    new Promise((resolve) => {
      if (typeof playSound === "function") playSound("wrong");

      const backdrop = document.createElement("div");
      backdrop.className = "clone-shake-backdrop";
      const r1 = clone1.getBoundingClientRect();
      const r2 = clone2.getBoundingClientRect();
      const left = Math.min(r1.left, r2.left) - 8;
      const top = Math.min(r1.top, r2.top) - 4;
      const right = Math.max(r1.right, r2.right) + 8;
      const bottom = Math.max(r1.bottom, r2.bottom) + 4;
      backdrop.style.left = left + "px";
      backdrop.style.top = top + "px";
      backdrop.style.width = right - left + "px";
      backdrop.style.height = bottom - top + "px";
      flyLayerRef.current.appendChild(backdrop);

      const wrap1 = clone1._flyWrap;
      const wrap2 = clone2._flyWrap;

      gsap.to([wrap1, wrap2], {
        left: "+=6",
        duration: 0.08,
        repeat: 5,
        yoyo: true,
        ease: "power1.inOut",
        onComplete: () => {
          backdrop.remove();
          resolve();
        },
      });
    });

  const flyClonesToCorrectColumn = async (
    clone1,
    clone2,
    question,
    questionIndex,
    correctColumn,
  ) => {
    setVisualOutline(clone1, clone2, false);

    const correctColumnEl = getColumnRef(correctColumn).current;
    const correctTarget = await measureNextRowPositions(
      correctColumnEl,
      question,
    );

    [clone1, clone2].forEach((clone) => {
      const r = clone.getBoundingClientRect();
      gsap.set(clone, { height: r.height, width: r.width });
    });

    await waitTimeline(
      animateClonesTo(clone1, clone2, correctTarget, FLY_DURATION, {
        endOpacity: 1,
        animateHeight: true,
      }),
    );

    await finishCorrectPlacement(
      correctColumn,
      questionIndex,
      clone1,
      clone2,
    );
  };

  const advanceToNextQuestion = (questionIndex) => {
    pendingRetryRef.current = null;
    removeFlyClones();
    setCompareMode(false);
    setCorrectFlashRow(null);

    const nextIndex = questionIndex + 1;
    if (nextIndex >= totalQuestions) {
      allQuestionsDoneRef.current = true;
      setVisualVisible(false);
      onSetNextEnabled(true);
      onUpdateNavText(APP_DATA.steps[1].navTextDone);
      setColumnsTappable(false);
      setAnimating(false);
      clearCompleteHighlightTimer();
      completeHighlightTimerRef.current = setTimeout(() => {
        setColumnsCompleteHighlight(true);
      }, 1000);
      return;
    }

    resetColumnsCompleteHighlight();

    setVisualVisible(true);
    currentQuestionIndexRef.current = nextIndex;
    setCurrentQuestionIndex(nextIndex);
    setAnimating(false);
  };

  const finishCorrectPlacement = async (
    columnType,
    questionIndex,
    clone1,
    clone2,
  ) => {
    if (typeof playSound === "function") playSound("correct");
    addPlacement(columnType, questionIndex);
    await flushLayout();
    if (clone1._flyWrap) clone1._flyWrap.remove();
    else clone1.remove();
    if (clone2._flyWrap) clone2._flyWrap.remove();
    else clone2.remove();
    await flushLayout();
    setCorrectFlashRow({ column: columnType, qIndex: questionIndex });
    await new Promise((resolve) => setTimeout(resolve, 500));
    setCorrectFlashRow(null);
    advanceToNextQuestion(questionIndex);
  };

  const handleColumnTap = async (tappedColumn) => {
    if (!columnsTappable || isAnimatingRef.current) return;

    const questionIndex = currentQuestionIndexRef.current;
    const question = getQuestion(questionIndex);
    const correctColumn =
      question.ans === "similar" ? "similar" : "non-similar";

    if (pendingRetryRef.current) {
      const pending = pendingRetryRef.current;
      if (pending.questionIndex !== questionIndex) return;

      setColumnsTappable(false);
      setAnimating(true);

      if (tappedColumn !== pending.correctColumn) {
        await separateAndRejoinClones(
          pending.clone1,
          pending.clone2,
          pending.originalPositions,
          pending.comparePositions,
        );
        setAnimating(false);
        return;
      }

      pendingRetryRef.current = null;
      await flyClonesToCorrectColumn(
        pending.clone1,
        pending.clone2,
        question,
        questionIndex,
        correctColumn,
      );
      return;
    }

    const isCorrect = tappedColumn === correctColumn;

    const fromPositions = getVisualImagePositions();
    if (!fromPositions) return;

    const originalPositions = {
      img1: { ...fromPositions.img1 },
      img2: { ...fromPositions.img2 },
    };

    setColumnsTappable(false);
    setAnimating(true);

    const columnEl = getColumnRef(tappedColumn).current;
    const targetPositions = await measureNextRowPositions(columnEl, question);

    const { tl, clone1, clone2 } = await animateFlyPair(
      fromPositions,
      targetPositions,
      FLY_DURATION,
      question,
    );
    setVisualVisible(false);
    await waitTimeline(tl);

    if (isCorrect) {
      await finishCorrectPlacement(
        tappedColumn,
        questionIndex,
        clone1,
        clone2,
      );
      return;
    }

    await shakeClones(clone1, clone2);

    // 2. Return to original places at original size in visual column
    await waitTimeline(
      animateClonesTo(clone1, clone2, originalPositions, FLY_DURATION, {
        endOpacity: 1,
      }),
    );

    // 3. Move to center, then grow to final width (compare)
    const comparePositions = getVisualCenterPositions(question);
    const centerMovePositions = {
      img1: {
        left: comparePositions.img1.left,
        top: comparePositions.img1.top,
        width: originalPositions.img1.width,
      },
      img2: {
        left: comparePositions.img2.left,
        top: comparePositions.img2.top,
        width: originalPositions.img2.width,
      },
    };

    setVisualOutline(clone1, clone2, true, true);

    await waitTimeline(
      animateClonesTo(clone1, clone2, centerMovePositions, FLY_DURATION, {
        positionOnly: true,
      }),
    );

    if (question.ans === "non-similar" && question.matchHeight) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      await animateShorterHeightToMatch(clone1, clone2);
      await new Promise((resolve) => setTimeout(resolve, 500));
    } else {
      await waitTimeline(
        animateClonesTo(clone1, clone2, comparePositions, FLY_DURATION, {
          sizeOnly: true,
        }),
      );

      if (question.ans === "non-similar") {
        await new Promise((resolve) => setTimeout(resolve, 200));
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    pendingRetryRef.current = {
      clone1,
      clone2,
      questionIndex,
      correctColumn,
      originalPositions,
      comparePositions,
    };
    setAnimating(false);
  };

  const goToPrevQuestion = useCallback(() => {
    if (isAnimatingRef.current) return;
    const idx = currentQuestionIndexRef.current;
    if (idx <= 0) return;

    const prevIndex = idx - 1;
    const newSimilar = placedSimilarRef.current.filter((i) => i < prevIndex);
    const newNonSimilar = placedNonSimilarRef.current.filter((i) => i < prevIndex);

    removeFlyClones();
    pendingRetryRef.current = null;
    setCompareMode(false);
    setCorrectFlashRow(null);
    setVisualVisible(true);
    resetPlacements(newSimilar, newNonSimilar);
    allQuestionsDoneRef.current = false;
    resetColumnsCompleteHighlight();
    onSetNextEnabled(false);
    onUpdateNavText(APP_DATA.steps[1].navText);

    currentQuestionIndexRef.current = prevIndex;
    setCurrentQuestionIndex(prevIndex);
    setAnimating(false);
  }, []);

  useEffect(() => {
    currentQuestionIndexRef.current = currentQuestionIndex;
    if (step === 1) {
      onPrevAvailabilityChange(currentQuestionIndex > 0);
    }
  }, [currentQuestionIndex, step]);

  useEffect(() => {
    if (step === 1) {
      onSetNextEnabled(false);
      onUpdateNavText(APP_DATA.steps[1].navText);
    }
  }, [step]);

  useEffect(() => {
    if (registerGoPrevQuestion) {
      registerGoPrevQuestion(goToPrevQuestion);
    }
  }, [registerGoPrevQuestion, goToPrevQuestion]);

  useEffect(() => {
    const existing = document.getElementById("compare-outline-filters");
    if (existing) existing.remove();

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("id", "compare-outline-filters");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("width", "0");
    svg.setAttribute("height", "0");
    svg.style.position = "absolute";
    svg.style.overflow = "hidden";

    svg.innerHTML = `
      <defs>
        <filter id="compare-outline-yellow" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="sRGB">
          <feMorphology in="SourceAlpha" operator="dilate" radius="3" result="dilated" />
          <feComposite in="dilated" in2="SourceAlpha" operator="out" result="outlineMask" />
          <feFlood flood-color="#ffcc00" flood-opacity="1" result="flood" />
          <feComposite in="flood" in2="outlineMask" operator="in" result="coloredOutline" />
          <feColorMatrix in="SourceGraphic" type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${COMPARE_IMAGE_OPACITY} 0"
            result="faded" />
          <feMerge>
            <feMergeNode in="coloredOutline" />
            <feMergeNode in="faded" />
          </feMerge>
        </filter>
        <filter id="compare-outline-blue" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="sRGB">
          <feMorphology in="SourceAlpha" operator="dilate" radius="3" result="dilated" />
          <feComposite in="dilated" in2="SourceAlpha" operator="out" result="outlineMask" />
          <feFlood flood-color="#66b3ff" flood-opacity="1" result="flood" />
          <feComposite in="flood" in2="outlineMask" operator="in" result="coloredOutline" />
          <feColorMatrix in="SourceGraphic" type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${COMPARE_IMAGE_OPACITY} 0"
            result="faded" />
          <feMerge>
            <feMergeNode in="coloredOutline" />
            <feMergeNode in="faded" />
          </feMerge>
        </filter>
      </defs>
    `;

    document.body.appendChild(svg);
  }, []);

  useEffect(() => {
    if (step !== 1) return;

    setCurrentQuestionIndex(0);
    currentQuestionIndexRef.current = 0;
    allQuestionsDoneRef.current = false;
    resetPlacements([], []);
    pendingRetryRef.current = null;
    resetColumnsCompleteHighlight();
    setColumnsTappable(true);
    setVisualVisible(true);
    setCompareMode(false);
    setCorrectFlashRow(null);
    removeFlyClones();
    isAnimatingRef.current = false;
    if (onAnimatingChange) onAnimatingChange(false);
  }, [step]);

  useEffect(() => () => clearCompleteHighlightTimer(), []);

  const renderQuestionRow = (qIndex, extraClass, columnType) => {
    const question = getQuestion(qIndex);
    const isFlashing =
      correctFlashRow &&
      correctFlashRow.column === columnType &&
      correctFlashRow.qIndex === qIndex;
    const rowClass =
      "image-row" +
      (extraClass ? " " + extraClass : "") +
      (isFlashing ? " row-correct-bg" : "");

    return React.createElement(
      "div",
      {
        className: rowClass,
        key: "row-" + qIndex + (extraClass || ""),
      },
      React.createElement("img", {
        className: "row-image",
        src: question.img1,
        alt: "",
        style: { width: getRowWidth(question, 1) },
      }),
      React.createElement("img", {
        className: "row-image",
        src: question.img2,
        alt: "",
        style: { width: getRowWidth(question, 2)},
      }),
    );
  };

  const renderColumnRows = (columnType, placedList) =>
    placedList.map((qIndex) => renderQuestionRow(qIndex, "", columnType));

  if (step !== 1) return null;

  const currentQuestion = getQuestion(currentQuestionIndex);

  return React.createElement(
    "div",
    { className: "main-canvas-container similar-applet" },
    React.createElement("div", { className: "fly-layer", ref: flyLayerRef }),
    React.createElement(
      "div",
      { className: "similar-canvas" },
      React.createElement(
        "div",
        {
          ref: similarColRef,
          className:
            "sort-column similar-column" +
            (columnsTappable ? " tappable" : "") +
            (columnsCompleteHighlight ? " quiz-complete" : ""),
          onClick: () => handleColumnTap("similar"),
        },
        React.createElement(
          "h3",
          { className: "column-heading similar-heading" },
          APP_DATA.labels.similarHeading,
        ),
        React.createElement(
          "div",
          {
            className:
              "column-rows" + (columnsCompleteHighlight ? " rows-centered" : ""),
          },
          renderColumnRows("similar", placedSimilar),
        ),
      ),
      React.createElement(
        "div",
        { className: "visual-column", ref: visualColRef },
        visualVisible &&
          React.createElement(
            "div",
            {
              className:
                "visual-images" + (compareMode ? " compare-mode" : ""),
              style: compareMode
                ? getCompareLayoutStyle()
                : getVisualLayoutStyle(currentQuestion),
            },
            React.createElement("img", {
              ref: img1Ref,
              key: "q" + currentQuestionIndex + "-img1",
              className:
                "visual-image" +
                (compareMode ? " compare-outlined-yellow" : ""),
              src: currentQuestion.img1,
              alt: "",
              style: getImageStyle(currentQuestion, 1, {
                compare: compareMode,
                useFinal: compareMode,
                opacity: 1,
              }),
            }),
            React.createElement("img", {
              ref: img2Ref,
              key: "q" + currentQuestionIndex + "-img2",
              className:
                "visual-image" + (compareMode ? " compare-outlined-blue" : ""),
              src: currentQuestion.img2,
              alt: "",
              style: getImageStyle(currentQuestion, 2, {
                compare: compareMode,
                useFinal: compareMode,
                opacity: 1,
              }),
            }),
          ),
      ),
      React.createElement(
        "div",
        {
          ref: nonSimilarColRef,
          className:
            "sort-column non-similar-column" +
            (columnsTappable ? " tappable" : "") +
            (columnsCompleteHighlight ? " quiz-complete" : ""),
          onClick: () => handleColumnTap("non-similar"),
        },
        React.createElement(
          "h3",
          { className: "column-heading non-similar-heading" },
          APP_DATA.labels.nonSimilarHeading,
        ),
        React.createElement(
          "div",
          {
            className:
              "column-rows" + (columnsCompleteHighlight ? " rows-centered" : ""),
          },
          renderColumnRows("non-similar", placedNonSimilar),
        ),
      ),
    ),
  );
};
