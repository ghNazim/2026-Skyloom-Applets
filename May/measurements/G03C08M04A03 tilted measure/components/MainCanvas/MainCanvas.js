const MainCanvas = (props) => {
  const {
    step,
    onSetNextEnabled,
    onUpdateNavText,
    step5Trigger,
    onStep5Complete,
  } = props;
  const { useState, useEffect, useCallback, useRef } = React;

  const [mcqAnswered, setMcqAnswered] = useState(false);
  const [placedCount, setPlacedCount] = useState(0);
  const [transparentCount, setTransparentCount] = useState(0);
  const [hasExtraBlink, setHasExtraBlink] = useState(false);
  const [textBoxType, setTextBoxType] = useState("neutral");
  const [countBadgeType, setCountBadgeType] = useState("default");
  const [textKey, setTextKey] = useState("default");
  const [checkDisabled, setCheckDisabled] = useState(true);
  const [eraserTapNudgeDismissed, setEraserTapNudgeDismissed] = useState(false);
  const [extraEraserNudgeDismissed, setExtraEraserNudgeDismissed] = useState(false);

  const [optionPencilState, setOptionPencilState] = useState("default");
  const [optionBoxState, setOptionBoxState] = useState("default");
  const [step4Answered, setStep4Answered] = useState(false);

  const [lineAnimProgress, setLineAnimProgress] = useState(0);
  const [measureAnim, setMeasureAnim] = useState({
    eraserCount: false,
    pencilSettled: 0,
    pencilFlying: null,
    pencilCount: false,
    boxSettled: 0,
    boxFlying: null,
    boxCount: false,
  });
  const animTweenRef = useRef(null);

  const fullMeasureAnim = {
    eraserCount: true,
    pencilSettled: MEASURE_ANIM_CONFIG.pencilCount,
    pencilFlying: null,
    pencilCount: true,
    boxSettled: MEASURE_ANIM_CONFIG.boxCount,
    boxFlying: null,
    boxCount: true,
  };

  const resetMeasureAnim = useCallback(function () {
    setMeasureAnim({
      eraserCount: false,
      pencilSettled: 0,
      pencilFlying: null,
      pencilCount: false,
      boxSettled: 0,
      boxFlying: null,
      boxCount: false,
    });
  }, []);

  const addCloneMoveSteps = useCallback(function (tl, segId, totalCount, settledKey, flyingKey) {
    const source = getEraserCloneSource();
    if (!source) return;

    for (let i = 0; i < totalCount; i += 1) {
      const target = getUnitCloneGeometry(segId, i, totalCount);
      if (!target) continue;

      const proxy = { t: 0 };
      tl.call(function () {
        setMeasureAnim(function (s) {
          const next = Object.assign({}, s);
          next[flyingKey] = { t: 0 };
          return next;
        });
        if (typeof playSound === "function") playSound("click");
      });
      tl.to(proxy, {
        t: 1,
        duration: MEASURE_ANIM_CONFIG.cloneMoveDuration,
        ease: "power2.out",
        onUpdate: function () {
          setMeasureAnim(function (s) {
            const next = Object.assign({}, s);
            next[flyingKey] = { t: proxy.t };
            return next;
          });
        },
      });
      tl.call(function () {
        setMeasureAnim(function (s) {
          const next = Object.assign({}, s);
          next[settledKey] = i + 1;
          next[flyingKey] = null;
          return next;
        });
      });
    }
  }, []);

  const measureType = step === 3 ? "box" : "pencil";
  const stepData = APP_DATA.steps[step];
  const correctCount =
    step === 1
      ? 0
      : stepData && stepData.correctCount
      ? stepData.correctCount
      : MEASURE_CONFIG[measureType].correctCount;
  const maxCount = correctCount + 1;

  const resetMeasureState = useCallback((options) => {
    const opts = options || {};
    setPlacedCount(opts.placedCount || 0);
    setTransparentCount(0);
    setHasExtraBlink(false);
    setTextBoxType("neutral");
    setCountBadgeType("default");
    setTextKey("default");
    setCheckDisabled(true);
  }, []);

  useEffect(() => {
    if (step === 1) {
      setMcqAnswered(false);
      onSetNextEnabled(false);
    }
    if (step === 2) {
      resetMeasureState({ placedCount: 0 });
      setEraserTapNudgeDismissed(false);
      setExtraEraserNudgeDismissed(false);
      onSetNextEnabled(false);
      if (onUpdateNavText) onUpdateNavText(APP_DATA.steps[2].navText);
    }
    if (step === 3) {
      resetMeasureState({ placedCount: 0 });
      setEraserTapNudgeDismissed(false);
      setExtraEraserNudgeDismissed(false);
      onSetNextEnabled(false);
      if (onUpdateNavText) onUpdateNavText(APP_DATA.steps[3].navText);
    }
    if (step === 4) {
      setOptionPencilState("default");
      setOptionBoxState("default");
      setStep4Answered(false);
      onSetNextEnabled(false);
      if (onUpdateNavText) onUpdateNavText(APP_DATA.steps[4].navText);
    }
    if (step === 5) {
      setLineAnimProgress(0);
      resetMeasureAnim();
      onSetNextEnabled(true);
      if (onUpdateNavText) onUpdateNavText(APP_DATA.steps[5].navText);
    }
    if (step === 6) {
      setLineAnimProgress(1);
      setMeasureAnim(fullMeasureAnim);
      onSetNextEnabled(true);
      if (onUpdateNavText) onUpdateNavText(APP_DATA.steps[6].navText);
    }
    if (step === 7) {
      setMcqAnswered(false);
      onSetNextEnabled(false);
      if (onUpdateNavText) onUpdateNavText(APP_DATA.steps[7].navText);
    }
  }, [step, onSetNextEnabled, onUpdateNavText, resetMeasureState, resetMeasureAnim]);

  useEffect(() => {
    if (step === 2 || step === 3) {
      setCheckDisabled(
        placedCount === 0 || hasExtraBlink || textBoxType === "correct"
      );
    }
  }, [step, placedCount, hasExtraBlink, textBoxType]);

  useEffect(() => {
    if (step !== 5 || !step5Trigger) return;

    if (animTweenRef.current) animTweenRef.current.kill();
    setLineAnimProgress(0);
    resetMeasureAnim();

    const tl = gsap.timeline({
      onComplete: function () {
        if (typeof onStep5Complete === "function") onStep5Complete();
      },
    });

    const proxy = { t: 0 };
    tl.to(proxy, {
      t: 1,
      duration: 2.5,
      ease: "power2.inOut",
      onUpdate: function () {
        setLineAnimProgress(proxy.t);
      },
      onComplete: function () {
        if (typeof playSound === "function") playSound("tick");
      },
    });

    tl.call(function () {
      setMeasureAnim(function (s) {
        return Object.assign({}, s, { eraserCount: true });
      });
    });
    tl.to({}, { duration: 0.7 });

    addCloneMoveSteps(
      tl,
      "pencil",
      MEASURE_ANIM_CONFIG.pencilCount,
      "pencilSettled",
      "pencilFlying"
    );

    tl.call(function () {
      setMeasureAnim(function (s) {
        return Object.assign({}, s, { pencilCount: true });
      });
      if (typeof playSound === "function") playSound("tick");
    });
    tl.to({}, { duration: 0.7 });

    addCloneMoveSteps(
      tl,
      "box",
      MEASURE_ANIM_CONFIG.boxCount,
      "boxSettled",
      "boxFlying"
    );

    tl.call(function () {
      setMeasureAnim(function (s) {
        return Object.assign({}, s, { boxCount: true });
      });
      if (typeof playSound === "function") playSound("tick");
    });
    tl.to({}, { duration: 1 });

    animTweenRef.current = tl;

    return function () {
      if (animTweenRef.current) animTweenRef.current.kill();
    };
  }, [step5Trigger, step, onStep5Complete, resetMeasureAnim, addCloneMoveSteps]);

  const handleMcqCorrect = () => {
    setMcqAnswered(true);
    onSetNextEnabled(true);
    if (onUpdateNavText) onUpdateNavText(APP_DATA.steps[1].navNext);
  };

  const handleLineMcqCorrect = () => {
    setMcqAnswered(true);
    onSetNextEnabled(true);
    if (onUpdateNavText) onUpdateNavText(APP_DATA.steps[7].navNext);
  };

  const getLineMcqOptionHtml = () => {
    return {
      AB: lineNotationHtml("AB"),
      MN: lineNotationHtml("MN"),
    };
  };

  const handleOptionClick = (type) => {
    if (step4Answered) return;

    if (type === "pencil") {
      if (typeof playSound === "function") playSound("wrong");
      setOptionPencilState("wrong");
      setOptionBoxState("default");
      return;
    }

    if (typeof playSound === "function") playSound("correct");
    setOptionPencilState("default");
    setOptionBoxState("correct");
    setStep4Answered(true);
    onSetNextEnabled(true);
    if (onUpdateNavText) onUpdateNavText(APP_DATA.steps[4].navNext);
  };

  const handleAddEraser = () => {
    if (textBoxType === "correct") return;
    if (hasExtraBlink) return;
    if (placedCount >= maxCount) return;

    setEraserTapNudgeDismissed(true);
    if (typeof playSound === "function") playSound("click");
    setTransparentCount(0);
    setTextBoxType("neutral");
    setCountBadgeType("default");
    setTextKey("default");
    setPlacedCount((prev) => prev + 1);
  };

  const handleCheck = () => {
    if (checkDisabled || hasExtraBlink) return;

    if (placedCount < correctCount) {
      setTransparentCount(correctCount - placedCount);
      setTextBoxType("wrong");
      setCountBadgeType("wrong");
      setTextKey("wrongLesser");
      if (typeof playSound === "function") playSound("wrong");
      return;
    }

    if (placedCount > correctCount) {
      setHasExtraBlink(true);
      setExtraEraserNudgeDismissed(false);
      setTextBoxType("wrong");
      setCountBadgeType("wrong");
      setTextKey("wrongExtra");
      setCheckDisabled(true);
      if (typeof playSound === "function") playSound("wrong");
      return;
    }

    setTextBoxType("correct");
    setCountBadgeType("correct");
    setTextKey("correct");
    setCheckDisabled(true);
    onSetNextEnabled(true);
    if (onUpdateNavText && stepData) onUpdateNavText(stepData.navNext);
    if (typeof playSound === "function") playSound("correct");
  };

  const handleRemoveExtraEraser = () => {
    if (!hasExtraBlink) return;
    setExtraEraserNudgeDismissed(true);
    if (typeof playSound === "function") playSound("click");
    setPlacedCount((prev) => prev - 1);
    setHasExtraBlink(false);
    setTextBoxType("neutral");
    setCountBadgeType("default");
    setTextKey("default");
  };

  const getOptionBg = (type) => {
    const state = type === "pencil" ? optionPencilState : optionBoxState;
    if (state === "wrong") return "assets/redfloor.png";
    if (state === "correct") return "assets/greenfloor.png";
    return "assets/floor.png";
  };

  const renderEraserImage = (index, type, extraClass, onClick) => {
    const pos = getEraserPosition(index, type);
    const imageProps = {
      key: type + "-eraser-" + index,
      href: "./assets/eraser.png",
      x: pos.x,
      y: pos.y,
      width: MEASURE_CONFIG.eraserWidth,
      className: extraClass || "",
    };
    if (onClick) {
      imageProps.onClick = onClick;
      imageProps.style = { cursor: "pointer" };
    }
    return React.createElement("image", imageProps);
  };

  const renderMeasureErasers = (type, count, options) => {
    const opts = options || {};
    const elements = [];
    for (let i = 0; i < count; i += 1) {
      const isBlink =
        opts.blinkLast && i === count - 1 && hasExtraBlink && type === measureType;
      elements.push(
        renderEraserImage(
          i,
          type,
          isBlink ? "red-blink" : "",
          isBlink ? handleRemoveExtraEraser : undefined
        )
      );
      if (isBlink && !extraEraserNudgeDismissed) {
        const pos = getEraserPosition(count - 1, type);
        elements.push(
          React.createElement("image", {
            key: type + "-eraser-nudge-" + i,
            href: "./assets/tap.gif",
            x: pos.x + MEASURE_CONFIG.eraserWidth * 0.2,
            y: pos.y + 18,
            width: 72,
            height: 72,
            className: "tap-nudge-svg",
          })
        );
      }
    }
    if (opts.transparentCount > 0) {
      for (let i = count; i < count + opts.transparentCount; i += 1) {
        elements.push(renderEraserImage(i, type, "transparent"));
      }
    }
    return elements;
  };

  const renderLinesScene = () => {
    return React.createElement("img", {
      src: "./assets/lines.svg",
      alt: "",
      className: "lines-scene-image",
    });
  };

  const renderMainSvg = () => {
    const eraserElements = [];

    if (step === 1) {
      eraserElements.push(renderEraserImage(0, "pencil"));
    }
    if (step === 2) {
      eraserElements.push(
        ...renderMeasureErasers("pencil", placedCount, {
          blinkLast: true,
          transparentCount: transparentCount,
        })
      );
    }
    if (step === 3) {
      eraserElements.push(...renderMeasureErasers("pencil", 6));
      eraserElements.push(
        ...renderMeasureErasers("box", placedCount, {
          blinkLast: true,
          transparentCount: transparentCount,
        })
      );
    }

    return React.createElement(
      "svg",
      {
        className: "main-scene-svg",
        width: "1300",
        height: "820",
        viewBox: "0 -40 1300 780",
        xmlns: "http://www.w3.org/2000/svg",
      },
      React.createElement("image", {
        href: "./assets/box.png",
        x: "355",
        y: "-130",
        width: "850",
        className: "pencil-box",
      }),
      React.createElement("image", {
        href: "./assets/pencil.png",
        x: "352",
        y: "500",
        width: "570",
        className: "pencil",
      }),
      eraserElements
    );
  };

  const renderLineSegment = (seg, progress) => {
    const tf = getLineSegmentTransform(seg, progress);
    const half = tf.length / 2;

    if (progress >= 1) {
      const x1 = tf.lineStartX;
      const x2 = getHorizontalLineEndX(seg);
      return React.createElement("line", {
        key: "line-" + seg.id,
        x1: x1,
        y1: seg.finalY,
        x2: x2,
        y2: seg.finalY,
        stroke: seg.color,
        strokeWidth: LINE_SEGMENT_CONFIG.lineWidth,
        strokeLinecap: "round",
      });
    }

    return React.createElement(
      "g",
      {
        key: "line-" + seg.id,
        transform: "rotate(" + tf.angle + " " + tf.cx + " " + tf.cy + ")",
      },
      React.createElement("line", {
        x1: tf.cx - half,
        y1: tf.cy,
        x2: tf.cx + half,
        y2: tf.cy,
        stroke: seg.color,
        strokeWidth: LINE_SEGMENT_CONFIG.lineWidth,
        strokeLinecap: "round",
      })
    );
  };

  const renderSegmentLabel = (seg, labelText, progress) => {
    const labelOpacity =
      step === 6 ? 1 : Math.max(0, Math.min(1, (progress - 0.55) / 0.35));
    if (labelOpacity <= 0) return null;

    const box = LINE_SEGMENT_CONFIG.labelBox;
    return React.createElement(
      "g",
      {
        key: "label-" + seg.id,
        opacity: labelOpacity,
      },
      React.createElement("rect", {
        x: box.x,
        y: seg.finalY - box.height / 2,
        width: box.width,
        height: box.height,
        rx: box.rx,
        fill: "rgba(0,0,0,0.35)",
        stroke: seg.color,
        strokeWidth: 2.5,
        strokeDasharray: "8 4",
      }),
      React.createElement(
        "text",
        {
          x: box.x + box.width / 2,
          y: seg.finalY,
          fill: "white",
          fontSize: box.fontSize,
          fontWeight: "600",
          textAnchor: "middle",
          dominantBaseline: "middle",
          fontFamily: "Arial, sans-serif",
        },
        labelText
      )
    );
  };

  const renderCountBadge = (rowY, value, visible, cxOverride) => {
    if (!visible) return null;
    const badge = MEASURE_ANIM_CONFIG.countBadge;
    const cx = cxOverride != null ? cxOverride : badge.cx;
    return React.createElement(
      "g",
      { key: "count-badge-" + value + "-" + rowY, className: "line-count-badge" },
      React.createElement("circle", {
        cx: cx,
        cy: rowY,
        r: badge.radius,
        fill: "#f472b6",
        stroke: "white",
        strokeWidth: 2,
      }),
      React.createElement(
        "text",
        {
          x: cx,
          y: rowY,
          fill: "white",
          fontSize: badge.fontSize,
          fontWeight: "700",
          textAnchor: "middle",
          dominantBaseline: "middle",
          fontFamily: "Arial, sans-serif",
        },
        String(value)
      )
    );
  };

  const renderCloneLine = (coords, key) => {
    return React.createElement("line", {
      key: key,
      x1: coords.x1,
      y1: coords.y1,
      x2: coords.x2,
      y2: coords.y2,
      stroke: coords.color,
      strokeWidth: LINE_SEGMENT_CONFIG.lineWidth,
      strokeLinecap: "butt",
    });
  };

  const renderCloneRow = (segId, settledCount, totalCount, flyingT) => {
    if (!settledCount && flyingT == null) return null;

    const seg = getSegmentById(segId);
    const eraser = getSegmentById("eraser");
    if (!seg || !eraser) return null;

    const x0 = getLineStartX(seg);
    const unitLen = seg.length / totalCount;
    const cloneY = seg.finalY + MEASURE_ANIM_CONFIG.cloneRowOffset;
    const tickH = MEASURE_ANIM_CONFIG.tickHeight;
    const elements = [];
    const source = getEraserCloneSource();

    for (let i = 0; i < settledCount; i += 1) {
      const geom = getUnitCloneGeometry(segId, i, totalCount);
      if (geom) {
        elements.push(
          renderCloneLine(
            { x1: geom.x1, y1: geom.y, x2: geom.x2, y2: geom.y, color: geom.color },
            "clone-" + segId + "-" + i
          )
        );
      }
      if (i < settledCount - 1) {
        const tickX = x0 + (i + 1) * unitLen;
        elements.push(
          React.createElement("line", {
            key: "clone-tick-" + segId + "-" + i,
            x1: tickX,
            y1: cloneY - tickH / 2,
            x2: tickX,
            y2: cloneY + tickH / 2,
            stroke: "rgba(255,255,255,0.85)",
            strokeWidth: 2.5,
          })
        );
      }
    }

    if (flyingT != null && source) {
      const target = getUnitCloneGeometry(segId, settledCount, totalCount);
      if (target) {
        const coords = lerpCloneSegment(flyingT, source, target);
        elements.push(renderCloneLine(coords, "clone-flying-" + segId));
      }
    }

    if (settledCount === totalCount) {
      elements.push(
        React.createElement("line", {
          key: "clone-tick-" + segId + "-end",
          x1: x0 + settledCount * unitLen,
          y1: cloneY - tickH / 2,
          x2: x0 + settledCount * unitLen,
          y2: cloneY + tickH / 2,
          stroke: "rgba(255,255,255,0.85)",
          strokeWidth: 2.5,
        })
      );
    } else if (settledCount > 0) {
      const tickX = x0 + settledCount * unitLen;
      elements.push(
        React.createElement("line", {
          key: "clone-tick-" + segId + "-last",
          x1: tickX,
          y1: cloneY - tickH / 2,
          x2: tickX,
          y2: cloneY + tickH / 2,
          stroke: "rgba(255,255,255,0.85)",
          strokeWidth: 2.5,
        })
      );
    }

    return React.createElement("g", { key: "clones-" + segId }, elements);
  };

  const renderMeasureOverlay = () => {
    const eraserSeg = getSegmentById("eraser");
    const pencilSeg = getSegmentById("pencil");
    const boxSeg = getSegmentById("box");
    if (!eraserSeg || !pencilSeg || !boxSeg) return null;

    const pencilCloneY = pencilSeg.finalY + MEASURE_ANIM_CONFIG.cloneRowOffset;
    const boxCloneY = boxSeg.finalY + MEASURE_ANIM_CONFIG.cloneRowOffset;

    return React.createElement(
      "g",
      { className: "measure-overlay" },
      renderCountBadge(eraserSeg.finalY, 1, measureAnim.eraserCount),
      renderCloneRow(
        "pencil",
        measureAnim.pencilSettled,
        MEASURE_ANIM_CONFIG.pencilCount,
        measureAnim.pencilFlying ? measureAnim.pencilFlying.t : null
      ),
      renderCountBadge(
        pencilCloneY,
        MEASURE_ANIM_CONFIG.pencilCount,
        measureAnim.pencilCount,
        getCounterBadgeCx(pencilSeg)
      ),
      renderCloneRow(
        "box",
        measureAnim.boxSettled,
        MEASURE_ANIM_CONFIG.boxCount,
        measureAnim.boxFlying ? measureAnim.boxFlying.t : null
      ),
      renderCountBadge(
        boxCloneY,
        MEASURE_ANIM_CONFIG.boxCount,
        measureAnim.boxCount,
        getCounterBadgeCx(boxSeg)
      )
    );
  };

  const renderLineSegmentsSvg = () => {
    const progress = step === 6 ? 1 : lineAnimProgress;
    const objectFade = step === 6 ? 0 : 0.3 * (1 - Math.min(progress / 0.35, 1));
    const labels = APP_DATA.steps[5].labels;

    return React.createElement(
      "svg",
      {
        className: "main-scene-svg line-segments-svg",
        width: "1300",
        height: "820",
        viewBox: "0 -40 1300 780",
        xmlns: "http://www.w3.org/2000/svg",
      },
      objectFade > 0 &&
        React.createElement(
          "g",
          { className: "faded-objects", opacity: objectFade },
          React.createElement("image", {
            href: "./assets/box.png",
            x: "355",
            y: "-130",
            width: "850",
            className: "pencil-box",
          }),
          React.createElement("image", {
            href: "./assets/pencil.png",
            x: "352",
            y: "500",
            width: "570",
            className: "pencil",
          }),
          React.createElement("image", {
            href: "./assets/eraser.png",
            x: "320",
            y: "420",
            width: "140",
          })
        ),
      LINE_SEGMENT_CONFIG.segments.map(function (seg) {
        return renderLineSegment(seg, progress);
      }),
      LINE_SEGMENT_CONFIG.segments.map(function (seg) {
        return renderSegmentLabel(seg, labels[seg.id], progress);
      }),
      (step === 6 || measureAnim.eraserCount) && renderMeasureOverlay()
    );
  };

  const renderOptionColumn = (type) => {
    const opts = APP_DATA.steps[4].options;
    const data = opts[type];
    const state = type === "pencil" ? optionPencilState : optionBoxState;
    const feedback =
      state === "wrong"
        ? data.wrongFeedback
        : state === "correct"
        ? data.correctFeedback
        : null;
    const feedbackClass =
      state === "wrong" ? " wrong" : state === "correct" ? " correct" : "";

    return React.createElement(
      "div",
      {
        key: type,
        className: "option-column",
        style: { backgroundImage: "url(" + getOptionBg(type) + ")" },
        onClick: function () {
          handleOptionClick(type);
        },
      },
      React.createElement("div", {
        className: "option-heading-box",
        dangerouslySetInnerHTML: {
          __html:
            typeof handleComma === "function"
              ? handleComma(data.heading)
              : data.heading,
        },
      }),
      React.createElement("img", {
        src: data.imageSrc,
        alt: "",
        className: "option-column-image",
      }),
      feedback &&
        React.createElement("div", {
          className: "option-feedback-box" + feedbackClass,
          dangerouslySetInnerHTML: {
            __html:
              typeof handleComma === "function"
                ? handleComma(feedback)
                : feedback,
          },
        })
    );
  };

  const renderTextPanel = () => {
    if (step === 1) {
      if (!mcqAnswered) {
        const mcq = APP_DATA.steps[1].mcq;
        return React.createElement(Mcq, {
          title: mcq.title,
          options: mcq.options,
          answer: mcq.answer,
          onCorrect: handleMcqCorrect,
        });
      }
      return React.createElement("div", {
        className: "text-box correct",
        dangerouslySetInnerHTML: {
          __html:
            typeof handleComma === "function"
              ? handleComma(APP_DATA.steps[1].mcq.feedback)
              : APP_DATA.steps[1].mcq.feedback,
        },
      });
    }

    if (step === 7) {
      const mcq = APP_DATA.steps[7].mcq;
      return React.createElement(Mcq, {
        title: buildLineMcqTitle(),
        options: mcq.options,
        optionHtml: getLineMcqOptionHtml(),
        answer: mcq.answer,
        wrongFeedback: mcq.wrongFeedback,
        correctFeedback: mcq.correctFeedback,
        feedbackInPlace: true,
        onCorrect: handleLineMcqCorrect,
      });
    }

    if (step === 2 || step === 3) {
      const texts = stepData.texts;
      const content = texts[textKey] || texts.default;
      return React.createElement("div", {
        className: "text-box " + textBoxType,
        dangerouslySetInnerHTML: {
          __html: typeof handleComma === "function" ? handleComma(content) : content,
        },
      });
    }

    if (step === 5 || step === 6) {
      const content = APP_DATA.steps[step].text;
      return React.createElement("div", {
        className: "text-box neutral",
        dangerouslySetInnerHTML: {
          __html: typeof handleComma === "function" ? handleComma(content) : content,
        },
      });
    }

    return null;
  };

  const renderTapColumn = () => {
    const isMeasureStep = step === 2 || step === 3;
    if (!isMeasureStep) {
      return React.createElement("div", { className: "tap-column" });
    }

    const checkBtnClass =
      "check-btn" +
      (textBoxType === "correct" ? " correct" : "") +
      (placedCount === 0 || hasExtraBlink ? " disabled" : "");

    const showEraserColumnNudge =
      !eraserTapNudgeDismissed &&
      textBoxType !== "correct" &&
      !hasExtraBlink &&
      placedCount < maxCount;

    return React.createElement(
      "div",
      { className: "tap-column" },
      React.createElement(
        "div",
        {
          className:
            "eraser-tap-wrapper" +
            (placedCount >= maxCount || textBoxType === "correct"
              ? " disabled"
              : ""),
          onClick: handleAddEraser,
        },
        React.createElement("img", {
          src: "assets/eraser.png",
          alt: "",
          className: "eraser-tap-img",
        }),
        showEraserColumnNudge &&
          React.createElement("img", {
            src: "assets/tap.gif",
            alt: "",
            className: "tap-nudge tap-nudge--eraser-add",
          }),
        React.createElement(
          "div",
          { className: "eraser-count-badge " + countBadgeType },
          placedCount
        )
      ),
      React.createElement(
        "button",
        {
          type: "button",
          className: checkBtnClass,
          disabled: checkDisabled,
          onClick: handleCheck,
        },
        stepData.checkButton
      )
    );
  };

  const getCanvasLayoutClass = () => {
    if (step === 4) return "canvas-columns step4-layout";
    if (step === 2 || step === 3) return "canvas-columns with-tap-column";
    return "canvas-columns no-tap-column";
  };

  const getSvgSceneClass = () => {
    if (step === 1) return "svg-scene svg-scene--intro";
    if (step === 7) return "svg-scene svg-scene--lines-mcq";
    if (step === 2) return "svg-scene svg-scene--measure-step2";
    if (step === 3) return "svg-scene svg-scene--measure-step3";
    if (step === 5 || step === 6) return "svg-scene svg-scene--lines";
    return "svg-scene";
  };

  if (step === 4) {
    return React.createElement(
      "div",
      { className: "main-canvas-container" },
      React.createElement(
        "div",
        { className: "option-columns-row" },
        renderOptionColumn("pencil"),
        renderOptionColumn("box")
      )
    );
  }

  return React.createElement(
    "div",
    { className: "main-canvas-container" },
    React.createElement(
      "div",
      { className: getCanvasLayoutClass() },
      renderTapColumn(),
      React.createElement(
        "div",
        { className: "view-column" + (step > 4 ? " after-4" : "") },
        React.createElement(
          "div",
          { className: getSvgSceneClass() },
          step === 7
            ? renderLinesScene()
            : step === 5 || step === 6
            ? renderLineSegmentsSvg()
            : renderMainSvg()
        )
      ),
      (step === 1 ||
        step === 2 ||
        step === 3 ||
        step === 5 ||
        step === 6 ||
        step === 7) &&
        React.createElement(
          "div",
          { className: "text-column" },
          renderTextPanel()
        )
    )
  );
};
