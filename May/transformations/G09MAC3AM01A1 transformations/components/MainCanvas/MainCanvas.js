const REVEAL_POINT_GROUPS = [
  { keys: ["H"], part: 1 },
  { keys: ["A", "G"], part: 2 },
  { keys: ["B", "F"], part: 3 },
  { keys: ["C", "E"], part: 4 },
  { keys: ["D"], part: 5 },
];

const MainCanvas = (props) => {
  const {
    step,
    onSnapComplete,
    onUpdateQuestion,
    onMoveFlowComplete,
    onNudgeTarget,
    onNudgeDismiss,
    greyNudgeAnchorRef,
    blueBoxRef,
  } = props;
  const { useState, useEffect, useRef, useCallback } = React;

  const SVG_WIDTH = 2000;
  const SVG_HEIGHT = 845;
  const STEP3 = APP_DATA.steps[3];

  const BASE_POINTS = PATH_CONFIG.basePoints;
  const POINT_ORDER = PATH_CONFIG.pointOrder;
  const MATH_Y_MAX = PATH_CONFIG.mathYMax;
  const SHAPE_HEIGHT = PATH_CONFIG.shapeHeight;
  const SHAPE_SCALE = SHAPE_HEIGHT / MATH_Y_MAX;
  const PAPER_WIDTH = 20 * SHAPE_SCALE;

  const LEFT_OFFSET = PATH_CONFIG.leftOffset;
  const RIGHT_OFFSET = PATH_CONFIG.rightOffset;
  const MCQ_GREY_OFFSET = PATH_CONFIG.mcqGreyOffset;
  const INTRO_PAPER = {
    x: PATH_CONFIG.introPaper.x,
    y: PATH_CONFIG.introPaper.y,
    scale: SHAPE_SCALE * PATH_CONFIG.introPaper.scaleMultiplier,
  };
  const SNAP_THRESHOLD = PATH_CONFIG.snapThreshold;
  const DISFIGURE_DURATION = PATH_CONFIG.disfigureDuration;
  const REALIGN_DURATION = PATH_CONFIG.realignDuration;
  const TOTAL_DISFIGURE_STEPS = DISFIGUREMENT_STEPS.length;

  const [subPhase, setSubPhase] = useState("intro");
  const [paperOffset, setPaperOffset] = useState(INTRO_PAPER);
  const [paperSnapped, setPaperSnapped] = useState(false);
  const [rightPathFilled, setRightPathFilled] = useState(false);
  const [mcqActive, setMcqActive] = useState(false);
  const [mcqOverlayVisible, setMcqOverlayVisible] = useState(false);
  const [mcqIndex, setMcqIndex] = useState(0);
  const [disfigureProgress, setDisfigureProgress] = useState(0);
  const [realignProgress, setRealignProgress] = useState(0);
  const [moveProgress, setMoveProgress] = useState(0);
  const [centerProgress, setCenterProgress] = useState(0);
  const [showConnectors, setShowConnectors] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [summaryVisible, setSummaryVisible] = useState(false);
  const [summaryLevel, setSummaryLevel] = useState(0);
  const [greyClickable, setGreyClickable] = useState(false);
  const [movePhaseComplete, setMovePhaseComplete] = useState(false);
  const [showRevealBtn, setShowRevealBtn] = useState(false);
  const [showRevealBox, setShowRevealBox] = useState(false);
  const [revealPartsShown, setRevealPartsShown] = useState(0);
  const [showBlueBox, setShowBlueBox] = useState(false);
  const [revealPanelVisible, setRevealPanelVisible] = useState(true);
  const [revealSceneDimmed, setRevealSceneDimmed] = useState(false);
  const [showTextLayover, setShowTextLayover] = useState(false);
  const [textLayoverVisible, setTextLayoverVisible] = useState(false);
  const [definitionTyped, setDefinitionTyped] = useState("");
  const [showVertexPoints, setShowVertexPoints] = useState(false);
  const [showGreyShape, setShowGreyShape] = useState(true);
  const [greyScale, setGreyScale] = useState(1);
  const [greyRotation, setGreyRotation] = useState(0);
  const [pointProgress, setPointProgress] = useState({});
  const [arrowMergeProgress, setArrowMergeProgress] = useState(0);
  const [introTextVisible, setIntroTextVisible] = useState(false);
  const [paperEnterDone, setPaperEnterDone] = useState(false);
  const [hasPaperDragStarted, setHasPaperDragStarted] = useState(false);
  const [greyPathVisible, setGreyPathVisible] = useState(false);

  const svgRef = useRef(null);
  const dragRef = useRef(null);
  const gsapTweenRef = useRef(null);
  const disfigureProgressRef = useRef(0);
  const greyScaleRef = useRef(1);
  const greyRotationRef = useRef(0);
  const mcqIndexRef = useRef(0);

  disfigureProgressRef.current = disfigureProgress;
  greyScaleRef.current = greyScale;
  greyRotationRef.current = greyRotation;
  mcqIndexRef.current = mcqIndex;

  const killTween = useCallback(function () {
    if (gsapTweenRef.current) {
      gsapTweenRef.current.kill();
      gsapTweenRef.current = null;
    }
  }, []);

  const getCentroid = useCallback(function (points) {
    var sx = 0;
    var sy = 0;
    POINT_ORDER.forEach(function (key) {
      sx += points[key].x;
      sy += points[key].y;
    });
    var n = POINT_ORDER.length;
    return { x: sx / n, y: sy / n };
  }, [POINT_ORDER]);

  const buildDisfigurementSmooth = useCallback(function (progress) {
    if (progress <= 0) return null;
    var result = {};
    DISFIGUREMENT_STEPS.forEach(function (item, index) {
      var t = Math.min(1, Math.max(0, progress - index));
      if (t <= 0) return;
      if (!result[item.point]) result[item.point] = { x: 0, y: 0 };
      result[item.point].x += item.offsets.x * t;
      result[item.point].y += item.offsets.y * t;
    });
    return Object.keys(result).length ? result : null;
  }, []);

  const lerpOffset = useCallback(function (from, to, t) {
    return {
      x: from.x + (to.x - from.x) * t,
      y: from.y + (to.y - from.y) * t,
    };
  }, []);

  const getPathPoints = useCallback(
    function (offset, disfigurement) {
      var points = {};
      POINT_ORDER.forEach(function (key) {
        var base = BASE_POINTS[key];
        var xMath = base.x;
        var yMath = base.y;
        if (disfigurement && disfigurement[key]) {
          xMath += disfigurement[key].x;
          yMath += disfigurement[key].y;
        }
        points[key] = {
          x: offset.x + xMath * SHAPE_SCALE,
          y: offset.y + (MATH_Y_MAX - yMath) * SHAPE_SCALE,
        };
      });
      return points;
    },
    [BASE_POINTS, POINT_ORDER, SHAPE_SCALE, MATH_Y_MAX]
  );

  const pointsToPath = useCallback(function (points) {
    return (
      "M " +
      POINT_ORDER.map(function (key, i) {
        var p = points[key];
        return (i === 0 ? "" : " L ") + p.x + "," + p.y;
      }).join("") +
      " Z"
    );
  }, [POINT_ORDER]);

  const getSvgPoint = useCallback(function (clientX, clientY) {
    var svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    var pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    var ctm = svg.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    var svgPt = pt.matrixTransform(ctm.inverse());
    return { x: svgPt.x, y: svgPt.y };
  }, []);

  const centerProgressRef = useRef(0);
  centerProgressRef.current = centerProgress;

  const animateCenterProgress = useCallback(
    function (toValue, duration, onComplete) {
      killTween();
      var proxy = { t: centerProgressRef.current };
      gsapTweenRef.current = gsap.to(proxy, {
        t: toValue,
        duration: duration,
        ease: "power2.inOut",
        onUpdate: function () {
          setCenterProgress(proxy.t);
        },
        onComplete: onComplete || null,
      });
    },
    [killTween]
  );

  const stopMcqTransform = useCallback(
    function () {
      killTween();
      var idx = mcqIndexRef.current;
      if (idx === 0) setDisfigureProgress(0);
      else if (idx === 1) setGreyScale(1);
      else if (idx === 2) setGreyRotation(0);
    },
    [killTween]
  );

  const runDisfigureAnimation = useCallback(
    function () {
      killTween();
      var proxy = { p: 0 };
      setDisfigureProgress(0);
      gsapTweenRef.current = gsap.to(proxy, {
        p: TOTAL_DISFIGURE_STEPS,
        duration: DISFIGURE_DURATION,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
        onUpdate: function () {
          setDisfigureProgress(proxy.p);
        },
      });
    },
    [killTween, DISFIGURE_DURATION, TOTAL_DISFIGURE_STEPS]
  );

  const restoreDisfigurement = useCallback(
    function (duration, onComplete) {
      killTween();
      var proxy = { p: disfigureProgressRef.current };
      gsapTweenRef.current = gsap.to(proxy, {
        p: 0,
        duration: duration,
        ease: "power2.inOut",
        onUpdate: function () {
          setDisfigureProgress(proxy.p);
        },
        onComplete: onComplete || null,
      });
    },
    [killTween]
  );

  const restoreGreyScale = useCallback(
    function (duration, onComplete) {
      killTween();
      var proxy = { s: greyScaleRef.current };
      gsapTweenRef.current = gsap.to(proxy, {
        s: 1,
        duration: duration,
        ease: "power2.inOut",
        onUpdate: function () {
          setGreyScale(proxy.s);
        },
        onComplete: onComplete || null,
      });
    },
    [killTween]
  );

  const restoreGreyRotation = useCallback(
    function (duration, onComplete) {
      killTween();
      var proxy = { r: greyRotationRef.current };
      gsapTweenRef.current = gsap.to(proxy, {
        r: 0,
        duration: duration,
        ease: "power2.inOut",
        onUpdate: function () {
          setGreyRotation(proxy.r);
        },
        onComplete: onComplete || null,
      });
    },
    [killTween]
  );

  const runScaleAnimation = useCallback(
    function () {
      killTween();
      var proxy = { s: 1 };
      setGreyScale(1);
      gsapTweenRef.current = gsap
        .timeline({ repeat: -1, yoyo: true })
        .to(proxy, {
          s: 0.5,
          duration: 0.55,
          ease: "power2.inOut",
          onUpdate: function () {
            setGreyScale(proxy.s);
          },
        })
        .to(proxy, {
          s: 1.5,
          duration: 0.55,
          ease: "power2.inOut",
          onUpdate: function () {
            setGreyScale(proxy.s);
          },
        });
    },
    [killTween]
  );

  const runRotateAnimation = useCallback(
    function () {
      killTween();
      var proxy = { r: 0 };
      setGreyRotation(0);
      gsapTweenRef.current = gsap
        .timeline({ repeat: -1 })
        .to(proxy, {
          r: -90,
          duration: 0.6,
          ease: "power2.inOut",
          onUpdate: function () {
            setGreyRotation(proxy.r);
          },
        })
        .to(proxy, {
          r: 0,
          duration: 0.6,
          ease: "power2.inOut",
          onUpdate: function () {
            setGreyRotation(proxy.r);
          },
        })
        .to(proxy, {
          r: 90,
          duration: 0.6,
          ease: "power2.inOut",
          onUpdate: function () {
            setGreyRotation(proxy.r);
          },
        })
        .to(proxy, {
          r: 0,
          duration: 0.6,
          ease: "power2.inOut",
          onUpdate: function () {
            setGreyRotation(proxy.r);
          },
        });
    },
    [killTween]
  );

  const startMoveAnimation = useCallback(
    function (summaryOptions) {
      var level = summaryOptions && summaryOptions.level;
      setSubPhase("moving");
      setShowConnectors(true);
      setMoveProgress(0);
      var proxy = { t: 0 };
      gsapTweenRef.current = gsap.to(proxy, {
        t: 1,
        duration: 1.5,
        ease: "power2.inOut",
        onUpdate: function () {
          setMoveProgress(proxy.t);
        },
        onComplete: function () {
          setTimeout(function () {
            setShowConnectors(false);
            setMcqActive(false);
            setCenterProgress(0);
            setRealignProgress(0);
            if (level) {
              setSummaryLevel(level);
              setShowSummary(true);
              setSummaryVisible(false);
              requestAnimationFrame(function () {
                requestAnimationFrame(function () {
                  setSummaryVisible(true);
                });
              });
              if (level === 3) {
                setShowRevealBtn(true);
                setGreyClickable(false);
              } else {
                setGreyClickable(true);
              }
              if (level === 1) {
                setMovePhaseComplete(true);
              }
            }
          }, 1000);
        },
      });
    },
    []
  );

  const startRealignToLeft = useCallback(
    function (onReadyToMove) {
      setSubPhase("realign");
      setRealignProgress(0);
      setMoveProgress(0);
      setCenterProgress(0);
      var proxy = { t: 0 };
      gsapTweenRef.current = gsap.to(proxy, {
        t: 1,
        duration: REALIGN_DURATION,
        ease: "power2.inOut",
        onUpdate: function () {
          setRealignProgress(proxy.t);
        },
        onComplete: function () {
          setSubPhase("move-ready");
          gsapTweenRef.current = gsap.delayedCall(1, function () {
            if (onReadyToMove) onReadyToMove();
          });
        },
      });
    },
    [REALIGN_DURATION]
  );

  const runPostMcqCorrectMove = useCallback(
    function (summaryLevel) {
      startRealignToLeft(function () {
        startMoveAnimation({ level: summaryLevel });
      });
    },
    [startRealignToLeft, startMoveAnimation]
  );

  const finishSecondaryMcqCorrect = useCallback(
    function (index) {
      setMcqOverlayVisible(false);
      if (onUpdateQuestion) onUpdateQuestion(STEP3.questionTextAfter);
      setGreyScale(1);
      setGreyRotation(0);
      setCenterProgress(0);
      runPostMcqCorrectMove(index + 1);
    },
    [runPostMcqCorrectMove, onUpdateQuestion, STEP3.questionTextAfter]
  );

  const openSecondaryMcq = useCallback(
    function (index) {
      setMcqIndex(index);
      setGreyClickable(false);
      setSummaryVisible(false);
      setGreyScale(1);
      setGreyRotation(0);
      setTimeout(function () {
        setShowSummary(false);
        if (onUpdateQuestion) onUpdateQuestion(STEP3.questionText);
        setMcqActive(true);
        setCenterProgress(0);
        setMoveProgress(0);
        setRealignProgress(0);
        setMcqOverlayVisible(true);
        setGreyPathVisible(true);
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            animateCenterProgress(1, 0.8, function () {
              if (index === 1) runScaleAnimation();
              if (index === 2) runRotateAnimation();
            });
          });
        });
      }, 450);
    },
    [
      onUpdateQuestion,
      STEP3.questionText,
      animateCenterProgress,
      runScaleAnimation,
      runRotateAnimation,
    ]
  );

  const startRevealPointSequence = useCallback(
    function () {
      var groupIndex = 0;

      function runGroup() {
        if (groupIndex >= REVEAL_POINT_GROUPS.length) {
          setTimeout(function () {
            var mergeProxy = { t: 0 };
            setArrowMergeProgress(0);
            gsap.to(mergeProxy, {
              t: 1,
              duration: 1.1,
              ease: "power2.inOut",
              onUpdate: function () {
                setArrowMergeProgress(mergeProxy.t);
              },
              onComplete: function () {
                setArrowMergeProgress(1);
                setTimeout(function () {
                  setShowBlueBox(true);
                }, 350);
              },
            });
          }, 400);
          return;
        }

        var group = REVEAL_POINT_GROUPS[groupIndex];
        setRevealPartsShown(group.part);

        var completed = 0;
        group.keys.forEach(function (key) {
          var proxy = { t: pointProgress[key] || 0 };
          gsap.to(proxy, {
            t: 1,
            duration: 0.75,
            ease: "power2.inOut",
            onUpdate: function () {
              setPointProgress(function (prev) {
                var next = Object.assign({}, prev);
                next[key] = proxy.t;
                return next;
              });
            },
            onComplete: function () {
              completed += 1;
              if (completed === group.keys.length) {
                groupIndex += 1;
                gsap.delayedCall(0.25, runGroup);
              }
            },
          });
        });
      }

      runGroup();
    },
    [pointProgress]
  );

  const startDefinitionTyping = useCallback(
    function (onComplete) {
      var full = STEP3.definitionTyping;
      var index = 0;
      setDefinitionTyped("");

      function typeNext() {
        if (index >= full.length) {
          if (onComplete) onComplete();
          return;
        }
        index += 1;
        setDefinitionTyped(full.slice(0, index));
        gsapTweenRef.current = gsap.delayedCall(0.03, typeNext);
      }

      typeNext();
    },
    [STEP3.definitionTyping]
  );

  const handleRevealClick = useCallback(
    function () {
      if (typeof playSound === "function") playSound("click");
      setGreyClickable(false);
      setSummaryVisible(false);
      setShowRevealBtn(false);
      setTimeout(function () {
        setShowSummary(false);
        setShowRevealBox(true);
        setShowGreyShape(false);
        setShowVertexPoints(true);
        setShowBlueBox(false);
        setRevealPanelVisible(true);
        setRevealSceneDimmed(false);
        setRevealPartsShown(0);
        setPointProgress({});
        setArrowMergeProgress(0);
        startRevealPointSequence();
      }, 450);
    },
    [startRevealPointSequence]
  );

  const handleBlueBoxClick = useCallback(
    function () {
      if (typeof playSound === "function") playSound("click");
      setShowBlueBox(false);
      setRevealPanelVisible(false);
      if (onNudgeDismiss) onNudgeDismiss();
      setShowTextLayover(true);
      setTextLayoverVisible(false);
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          setTextLayoverVisible(true);
        });
      });
      if (onUpdateQuestion) onUpdateQuestion(STEP3.questionTranslation);
    },
    [onUpdateQuestion, STEP3.questionTranslation, onNudgeDismiss]
  );

  const handleTextLayoverClose = useCallback(
    function () {
      setTextLayoverVisible(false);
      setTimeout(function () {
        setShowTextLayover(false);
        setRevealPanelVisible(true);
        setRevealSceneDimmed(true);
        setArrowMergeProgress(1);
        setRevealPartsShown(0);
        setDefinitionTyped("");
        startDefinitionTyping(function () {
          if (onMoveFlowComplete) onMoveFlowComplete();
        });
      }, 450);
    },
    [startDefinitionTyping, onMoveFlowComplete]
  );

  const handleGreyClick = useCallback(
    function () {
      if (!greyClickable) return;
      if (typeof playSound === "function") playSound("click");
      if (onNudgeDismiss) onNudgeDismiss();
      if (summaryLevel === 1) openSecondaryMcq(1);
      else if (summaryLevel === 2) openSecondaryMcq(2);
    },
    [greyClickable, summaryLevel, openSecondaryMcq, onNudgeDismiss]
  );

  const handleMcqOptionClick = useCallback(
    function () {
      stopMcqTransform();
    },
    [stopMcqTransform]
  );

  const handleMcqAnswer = useCallback(
    function (isCorrect) {
      if (mcqIndex === 0) {
        if (isCorrect) {
          setMcqOverlayVisible(false);
          if (onUpdateQuestion) onUpdateQuestion(STEP3.questionTextAfter);
          restoreDisfigurement(0.5, function () {
            runPostMcqCorrectMove(1);
          });
        } else {
          restoreDisfigurement(0.6, function () {
            runDisfigureAnimation();
          });
        }
        return;
      }

      if (isCorrect) {
        finishSecondaryMcqCorrect(mcqIndex);
      } else if (mcqIndex === 1) {
        runScaleAnimation();
      } else if (mcqIndex === 2) {
        runRotateAnimation();
      }
    },
    [
      mcqIndex,
      onUpdateQuestion,
      STEP3.questionTextAfter,
      restoreDisfigurement,
      runDisfigureAnimation,
      runPostMcqCorrectMove,
      finishSecondaryMcqCorrect,
      runScaleAnimation,
      runRotateAnimation,
    ]
  );

  useEffect(
    function () {
      if (!onNudgeTarget) return;
      if (showBlueBox) {
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            onNudgeTarget("blue");
          });
        });
      } else if (greyClickable) {
        onNudgeTarget("grey");
      }
    },
    [showBlueBox, greyClickable, onNudgeTarget]
  );

  useEffect(function () {
    killTween();
    setSubPhase("intro");
    setPaperSnapped(false);
    setRightPathFilled(false);
    setMcqActive(false);
    setMcqOverlayVisible(false);
    setMcqIndex(0);
    setDisfigureProgress(0);
    setRealignProgress(0);
    setMoveProgress(0);
    setCenterProgress(0);
    setShowConnectors(false);
    setShowSummary(false);
    setSummaryVisible(false);
    setSummaryLevel(0);
    setGreyClickable(false);
    setMovePhaseComplete(false);
    setShowRevealBtn(false);
    setShowRevealBox(false);
    setRevealPartsShown(0);
    setShowBlueBox(false);
    setRevealPanelVisible(true);
    setRevealSceneDimmed(false);
    setShowTextLayover(false);
    setTextLayoverVisible(false);
    setDefinitionTyped("");
    setShowVertexPoints(false);
    setShowGreyShape(true);
    setGreyScale(1);
    setGreyRotation(0);
    setPointProgress({});
    setArrowMergeProgress(0);
    setPaperEnterDone(false);
    setGreyPathVisible(false);

    if (step === 1) {
      setIntroTextVisible(false);
      var startX =
        INTRO_PAPER.x + (PATH_CONFIG.introPaper.enterFromXOffset || 550);
      setPaperOffset({
        x: startX,
        y: INTRO_PAPER.y,
        scale: INTRO_PAPER.scale,
      });
      var paperEnterProxy = { x: startX };
      gsapTweenRef.current = gsap.to(paperEnterProxy, {
        x: INTRO_PAPER.x,
        duration: PATH_CONFIG.introPaper.enterDuration || 0.85,
        ease: "power2.out",
        onUpdate: function () {
          setPaperOffset({
            x: paperEnterProxy.x,
            y: INTRO_PAPER.y,
            scale: INTRO_PAPER.scale,
          });
        },
        onComplete: function () {
          setPaperEnterDone(true);
        },
      });
      var textTimer = setTimeout(function () {
        setIntroTextVisible(true);
      }, 200);
      return function () {
        clearTimeout(textTimer);
        killTween();
      };
    }

    if (step === 2) {
      setIntroTextVisible(false);
      setHasPaperDragStarted(false);
      setSubPhase("enter");
      var enterProxy = {
        x: INTRO_PAPER.x,
        y: INTRO_PAPER.y,
        scale: INTRO_PAPER.scale,
      };
      gsapTweenRef.current = gsap.to(enterProxy, {
        x: LEFT_OFFSET.x,
        y: LEFT_OFFSET.y,
        scale: SHAPE_SCALE,
        duration: 0.8,
        ease: "power2.out",
        onUpdate: function () {
          setPaperOffset({
            x: enterProxy.x,
            y: enterProxy.y,
            scale: enterProxy.scale,
          });
        },
        onComplete: function () {
          setHasPaperDragStarted(false);
          setSubPhase("drag");
        },
      });
    }

    if (step === 3) {
      setSubPhase("mcq");
      setMcqActive(true);
      setPaperSnapped(true);
      setRightPathFilled(true);
      setDisfigureProgress(0);
      setRealignProgress(0);
      setMoveProgress(0);
      setCenterProgress(0);
      setGreyPathVisible(false);
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          setMcqOverlayVisible(true);
          setGreyPathVisible(true);
        });
      });
      var disfigureProxy = { p: 0 };
      gsapTweenRef.current = gsap.to(disfigureProxy, {
        p: TOTAL_DISFIGURE_STEPS,
        duration: DISFIGURE_DURATION,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
        onUpdate: function () {
          setDisfigureProgress(disfigureProxy.p);
        },
      });
    }

    return killTween;
  }, [step, killTween, SHAPE_SCALE, DISFIGURE_DURATION, TOTAL_DISFIGURE_STEPS]);

  const handlePointerDown = useCallback(
    function (e) {
      if (step !== 2 || subPhase !== "drag" || paperSnapped) return;
      e.preventDefault();
      setHasPaperDragStarted(true);
      if (onNudgeDismiss) onNudgeDismiss();
      var pt = getSvgPoint(e.clientX, e.clientY);
      dragRef.current = {
        startX: pt.x,
        startY: pt.y,
        origX: paperOffset.x,
        origY: paperOffset.y,
      };
      if (typeof playSound === "function") playSound("click");
    },
    [step, subPhase, paperSnapped, getSvgPoint, paperOffset, onNudgeDismiss]
  );

  const handlePointerMove = useCallback(
    function (e) {
      if (!dragRef.current) return;
      var pt = getSvgPoint(e.clientX, e.clientY);
      var dx = pt.x - dragRef.current.startX;
      var dy = pt.y - dragRef.current.startY;
      setPaperOffset(function (prev) {
        return {
          x: dragRef.current.origX + dx,
          y: dragRef.current.origY + dy,
          scale: prev.scale || SHAPE_SCALE,
        };
      });
    },
    [getSvgPoint, SHAPE_SCALE]
  );

  const handlePointerUp = useCallback(
    function () {
      if (!dragRef.current) return;
      dragRef.current = null;

      setPaperOffset(function (current) {
        var dx = current.x - RIGHT_OFFSET.x;
        var dy = current.y - RIGHT_OFFSET.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < SNAP_THRESHOLD) {
          setPaperSnapped(true);
          setRightPathFilled(true);
          setSubPhase("snapped");
          if (typeof playSound === "function") playSound("correct");
          setTimeout(function () {
            if (onSnapComplete) onSnapComplete();
          }, 600);
          return {
            x: RIGHT_OFFSET.x,
            y: RIGHT_OFFSET.y,
            scale: SHAPE_SCALE,
          };
        }
        return current;
      });
    },
    [onSnapComplete, SHAPE_SCALE, SNAP_THRESHOLD, RIGHT_OFFSET]
  );

  const handleTouchMove = useCallback(
    function (e) {
      if (!dragRef.current || !e.touches[0]) return;
      e.preventDefault();
      handlePointerMove({
        clientX: e.touches[0].clientX,
        clientY: e.touches[0].clientY,
      });
    },
    [handlePointerMove]
  );

  useEffect(function () {
    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handlePointerUp);
    return function () {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handlePointerUp);
    };
  }, [handlePointerMove, handlePointerUp, handleTouchMove]);

  var leftPoints = getPathPoints(LEFT_OFFSET, null);
  var rightPoints = getPathPoints(RIGHT_OFFSET, null);

  var greyOffset;
  if (moveProgress > 0) {
    greyOffset = lerpOffset(LEFT_OFFSET, RIGHT_OFFSET, moveProgress);
  } else if (realignProgress > 0) {
    greyOffset = lerpOffset(MCQ_GREY_OFFSET, LEFT_OFFSET, realignProgress);
  } else if (centerProgress > 0) {
    greyOffset = lerpOffset(RIGHT_OFFSET, MCQ_GREY_OFFSET, centerProgress);
  } else if (mcqIndex === 0 && mcqActive) {
    greyOffset = MCQ_GREY_OFFSET;
  } else if (movePhaseComplete) {
    greyOffset = RIGHT_OFFSET;
  } else {
    greyOffset = LEFT_OFFSET;
  }

  var disfigureAmount = 0;
  if (
    mcqIndex === 0 &&
    moveProgress <= 0 &&
    realignProgress <= 0 &&
    centerProgress <= 0 &&
    mcqActive
  ) {
    disfigureAmount = Math.min(disfigureProgress, TOTAL_DISFIGURE_STEPS);
  }

  var greyDisfigure =
    disfigureAmount > 0 ? buildDisfigurementSmooth(disfigureAmount) : null;
  var greyPoints = getPathPoints(greyOffset, greyDisfigure);
  var greyCentroid = getCentroid(greyPoints);

  var currentMcq = STEP3.mcqs[mcqIndex] || STEP3.mcqs[0];
  var currentSummary =
    summaryLevel > 0 ? STEP3.summaries[summaryLevel - 1] : null;

  var renderPath = function (points, className, extraProps) {
    return React.createElement(
      "path",
      Object.assign(
        {
          className: className,
          d: pointsToPath(points),
        },
        extraProps || {}
      )
    );
  };

  var renderConnectors = function () {
    if (!showConnectors) return null;
    return React.createElement(
      "g",
      { className: "connector-lines", pointerEvents: "none" },
      POINT_ORDER.map(function (key) {
        var lp = leftPoints[key];
        var gp = greyPoints[key];
        return React.createElement("line", {
          key: "conn-" + key,
          x1: lp.x,
          y1: lp.y,
          x2: gp.x,
          y2: gp.y,
          stroke: "rgba(180,180,180,0.6)",
          strokeWidth: 2,
          strokeDasharray: "6 4",
        });
      })
    );
  };

  var REVEAL_ARROW_STROKE = 5;

  var computeArrowheadPoints = function (tipX, tipY, angleRad, size, halfWidth) {
    var baseX = tipX - size * Math.cos(angleRad);
    var baseY = tipY - size * Math.sin(angleRad);
    var p2x = baseX + halfWidth * Math.cos(angleRad + Math.PI / 2);
    var p2y = baseY + halfWidth * Math.sin(angleRad + Math.PI / 2);
    var p3x = baseX - halfWidth * Math.cos(angleRad + Math.PI / 2);
    var p3y = baseY - halfWidth * Math.sin(angleRad + Math.PI / 2);
    return tipX + "," + tipY + " " + p2x + "," + p2y + " " + p3x + "," + p3y;
  };

  var renderGradientArrow = function (x1, y1, x2, y2, id) {
    var dx = x2 - x1;
    var dy = y2 - y1;
    var len = Math.hypot(dx, dy);
    if (len < 3) return null;

    var angleRad = Math.atan2(dy, dx);
    var headLen = 16;
    var lineRatio = Math.max(0, (len - headLen) / len);
    var lineX2 = x1 + dx * lineRatio;
    var lineY2 = y1 + dy * lineRatio;
    var gradId = "reveal-arrow-grad-" + id;

    return React.createElement(
      "g",
      { key: "reveal-arrow-" + id },
      React.createElement(
        "defs",
        null,
        React.createElement(
          "linearGradient",
          {
            id: gradId,
            gradientUnits: "userSpaceOnUse",
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2,
          },
          React.createElement("stop", {
            offset: "0%",
            stopColor: "#4fc3f7",
          }),
          React.createElement("stop", {
            offset: "100%",
            stopColor: "#ffc107",
          })
        )
      ),
      React.createElement("line", {
        x1: x1,
        y1: y1,
        x2: lineX2,
        y2: lineY2,
        stroke: "url(#" + gradId + ")",
        strokeWidth: REVEAL_ARROW_STROKE,
        strokeDasharray: "12 8",
        strokeLinecap: "round",
      }),
      React.createElement("polygon", {
        points: computeArrowheadPoints(x2, y2, angleRad, 16, 9),
        fill: "#ffc107",
      })
    );
  };

  var renderRevealArrows = function () {
    if (!showVertexPoints) return null;

    var leftCentroid = getCentroid(leftPoints);
    var rightCentroid = getCentroid(rightPoints);
    var arrowsClass =
      "reveal-arrows" + (revealSceneDimmed ? " reveal-arrows--dimmed" : "");

    if (arrowMergeProgress >= 1) {
      return React.createElement(
        "g",
        { className: arrowsClass, pointerEvents: "none" },
        renderGradientArrow(
          leftCentroid.x,
          leftCentroid.y,
          rightCentroid.x,
          rightCentroid.y,
          "center"
        )
      );
    }

    return React.createElement(
      "g",
      { className: arrowsClass, pointerEvents: "none" },
      POINT_ORDER.map(function (key) {
        var progress = pointProgress[key] || 0;
        if (progress <= 0 && arrowMergeProgress <= 0) return null;

        var from = leftPoints[key];
        var to = rightPoints[key];
        var x1;
        var y1;
        var x2;
        var y2;

        if (arrowMergeProgress > 0) {
          x1 =
            from.x + (leftCentroid.x - from.x) * arrowMergeProgress;
          y1 =
            from.y + (leftCentroid.y - from.y) * arrowMergeProgress;
          x2 = to.x + (rightCentroid.x - to.x) * arrowMergeProgress;
          y2 = to.y + (rightCentroid.y - to.y) * arrowMergeProgress;
        } else {
          x1 = from.x;
          y1 = from.y;
          x2 = from.x + (to.x - from.x) * progress;
          y2 = from.y + (to.y - from.y) * progress;
        }

        return renderGradientArrow(x1, y1, x2, y2, key);
      })
    );
  };

  var renderStaticSourcePoint = function (key) {
    var from = leftPoints[key];
    return React.createElement(
      "g",
      {
        key: "source-" + key,
        className:
          "vertex-point vertex-point--source" +
          (revealSceneDimmed ? " vertex-point--dimmed" : ""),
      },
      React.createElement("circle", {
        cx: from.x,
        cy: from.y,
        r: 14,
        fill: "white",
      }),
      React.createElement("circle", {
        cx: from.x,
        cy: from.y,
        r: 8,
        fill: "#4fc3f7",
      })
    );
  };

  var renderMovingVertexPoint = function (key) {
    var progress = pointProgress[key] || 0;
    if (progress <= 0) return null;

    var from = leftPoints[key];
    var to = rightPoints[key];
    var x = from.x + (to.x - from.x) * progress;
    var y = from.y + (to.y - from.y) * progress;
    var innerColor = progress >= 0.98 ? "#ffc107" : "#4fc3f7";

    return React.createElement(
      "g",
      {
        key: "moving-" + key,
        className:
          "vertex-point vertex-point--moving" +
          (revealSceneDimmed ? " vertex-point--dimmed" : ""),
      },
      React.createElement("circle", {
        cx: x,
        cy: y,
        r: 14,
        fill: "white",
      }),
      React.createElement("circle", {
        cx: x,
        cy: y,
        r: 8,
        fill: innerColor,
      })
    );
  };

  var showPaths = step >= 2;
  var showGreyPath = step >= 3 && showGreyShape;
  var showPaper = step >= 1 && step <= 2 && !paperSnapped;
  var currentPaperScale = paperOffset.scale || SHAPE_SCALE;
  var paperDisplayWidth = PAPER_WIDTH * (currentPaperScale / SHAPE_SCALE);
  var paperDisplayHeight = SHAPE_HEIGHT * (currentPaperScale / SHAPE_SCALE);
  var paperCenterX = paperOffset.x + paperDisplayWidth / 2;
  var paperCenterY = paperOffset.y + paperDisplayHeight / 2;
  var showPaperDragHint =
    step === 2 && subPhase === "drag" && !paperSnapped && !hasPaperDragStarted;

  var revealBoxContent = showRevealBox
    ? definitionTyped
      ? React.createElement("div", {
          className: "reveal-box__typing",
          dangerouslySetInnerHTML: { __html: definitionTyped },
        })
      : React.createElement(
          "div",
          { className: "reveal-box__parts" },
          STEP3.revealParts.map(function (part, i) {
            if (i >= revealPartsShown) return null;
            return React.createElement("span", {
              key: "part-" + i,
              className: "reveal-box__part",
              dangerouslySetInnerHTML: { __html: part },
            });
          })
        )
    : null;

  var pathDimSuffix = revealSceneDimmed ? "--dimmed" : "";

  return React.createElement(
    "div",
    { className: "main-canvas-container" },
    step === 1 &&
      React.createElement("div", {
        className:
          "intro-text-box" +
          (introTextVisible ? " intro-text-box--visible" : ""),
        dangerouslySetInnerHTML: {
          __html: APP_DATA.steps[1].introText,
        },
      }),
    showSummary &&
      React.createElement(
        "div",
        {
          className:
            "summary-stack" +
            (summaryVisible ? " summary-stack--visible" : ""),
        },
        React.createElement(
          "div",
          { className: "summary-box" },
          createSummaryElement(currentSummary)
        ),
        showRevealBtn &&
          React.createElement(
            "button",
            {
              className: "reveal-btn",
              onClick: handleRevealClick,
            },
            STEP3.revealButton
          )
      ),
    showRevealBox &&
      React.createElement(
        "div",
        { className: "reveal-stack reveal-stack--visible" },
        revealPanelVisible &&
          React.createElement(
            "div",
            {
              className:
                "reveal-box" +
                (showBlueBox ? " reveal-box--dimmed" : ""),
            },
            revealBoxContent
          ),
        showBlueBox &&
          revealPanelVisible &&
          React.createElement("div", {
            ref: blueBoxRef,
            className: "blue-box",
            onClick: handleBlueBoxClick,
            dangerouslySetInnerHTML: { __html: STEP3.blueBox },
          })
      ),
    mcqActive &&
      React.createElement(McqLayover, {
        visible: mcqOverlayVisible,
        title: currentMcq.title,
        options: currentMcq.options,
        correctAnswer: currentMcq.answer,
        onOptionClick: handleMcqOptionClick,
        onAnswer: handleMcqAnswer,
      }),
    showTextLayover &&
      React.createElement(TextLayover, {
        visible: textLayoverVisible,
        body: STEP3.textLayover.body,
        footer: STEP3.textLayover.footer,
        onClose: handleTextLayoverClose,
      }),
    showPaperDragHint &&
      React.createElement("img", {
        src: "assets/drag.gif",
        alt: "",
        className: "move-paper-drag-hint",
        style: {
          left: (paperCenterX / SVG_WIDTH) * 100 + "%",
          top: (paperCenterY / SVG_HEIGHT) * 100 + "%",
        },
      }),
    greyClickable &&
      greyNudgeAnchorRef &&
      React.createElement("div", {
        ref: greyNudgeAnchorRef,
        className: "nudge-anchor",
        style: {
          position: "absolute",
          left: (greyCentroid.x / SVG_WIDTH) * 100 + "%",
          top: (greyCentroid.y / SVG_HEIGHT) * 100 + "%",
          width: 0,
          height: 0,
          pointerEvents: "none",
        },
      }),
    showGreyPath &&
      React.createElement(
        "svg",
        {
          className:
            "grey-path-overlay" +
            (greyPathVisible ? " grey-path-overlay--visible" : "") +
            (greyClickable ? " grey-path-overlay--clickable" : ""),
          viewBox: "0 0 " + SVG_WIDTH + " " + SVG_HEIGHT,
          preserveAspectRatio: "xMidYMid meet",
        },
        React.createElement(
          "g",
          {
            transform:
              "translate(" +
              greyCentroid.x +
              "," +
              greyCentroid.y +
              ") rotate(" +
              greyRotation +
              ") scale(" +
              greyScale +
              ") translate(" +
              -greyCentroid.x +
              "," +
              -greyCentroid.y +
              ")",
          },
          renderPath(
            greyPoints,
            "grey-path" + (greyClickable ? " grey-path--clickable" : ""),
            {
              fill: "#888888",
              stroke: "white",
              strokeWidth: 6,
              onClick: greyClickable ? handleGreyClick : undefined,
              style: {
                cursor: greyClickable ? "pointer" : "default",
                pointerEvents: greyClickable ? "all" : "none",
              },
            }
          )
        )
      ),
    React.createElement(
      "svg",
      {
        ref: svgRef,
        viewBox: "0 0 " + SVG_WIDTH + " " + SVG_HEIGHT,
        className: "main-svg",
        preserveAspectRatio: "xMidYMid meet",
      },
      showPaths &&
        renderPath(leftPoints, "path-left" + pathDimSuffix, {
          fill: "none",
          stroke: "#4fc3f7",
          strokeWidth: 3,
          strokeDasharray: "10 6",
        }),
      showPaths &&
        renderPath(rightPoints, "path-right" + pathDimSuffix, {
          fill: rightPathFilled ? "rgba(255, 193, 7, 0.2)" : "rgba(0,0,0,0.15)",
          stroke: rightPathFilled ? "#ffc107" : "#ffc107",
          strokeWidth: 3,
          strokeDasharray: rightPathFilled ? "none" : "10 6",
        }),
      showVertexPoints && renderRevealArrows(),
      showVertexPoints &&
        POINT_ORDER.map(function (key) {
          return renderStaticSourcePoint(key);
        }),
      showVertexPoints &&
        POINT_ORDER.map(function (key) {
          return renderMovingVertexPoint(key);
        }),
      renderConnectors(),
      showPaper &&
        React.createElement(
          "g",
          {
            className:
              (step === 1 && paperEnterDone ? "paper-wiggle-group" : "") +
              (step === 1 && !paperEnterDone ? " paper-entering" : ""),
          },
          React.createElement("image", {
            href: "assets/paper.png",
            x: paperOffset.x,
            y: paperOffset.y,
            width: PAPER_WIDTH * (currentPaperScale / SHAPE_SCALE),
            height: SHAPE_HEIGHT * (currentPaperScale / SHAPE_SCALE),
            className:
              "paper-image" +
              (step === 2 && subPhase === "drag" ? " paper-draggable" : ""),
            onMouseDown: handlePointerDown,
            onTouchStart: function (e) {
              if (e.touches[0]) {
                handlePointerDown({
                  preventDefault: function () {
                    e.preventDefault();
                  },
                  clientX: e.touches[0].clientX,
                  clientY: e.touches[0].clientY,
                });
              }
            },
            style: {
              cursor:
                step === 2 && subPhase === "drag" ? "grab" : "default",
            },
          })
        )
    )
  );
};
