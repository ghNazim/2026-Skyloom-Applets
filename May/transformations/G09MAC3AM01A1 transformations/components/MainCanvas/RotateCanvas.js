const RotateCanvas = function (props) {
  var onUpdateQuestion = props.onUpdateQuestion;
  var onNudgeTarget = props.onNudgeTarget;
  var onNudgeDismiss = props.onNudgeDismiss;
  var onRotateFlowComplete = props.onRotateFlowComplete;
  var revealBtnRef = props.revealBtnRef;
  var paperAnchorRef = props.paperAnchorRef;
  var blueBoxRef = props.blueBoxRef;
  var fromStep1 = props.fromStep1;

  var useState = React.useState;
  var useEffect = React.useEffect;
  var useLayoutEffect = React.useLayoutEffect;
  var useRef = React.useRef;
  var useCallback = React.useCallback;

  var ROTATE = APP_DATA.rotate;
  var ROTATE_CFG = PATH_CONFIG.rotate;
  var SVG_WIDTH = 2000;
  var SVG_HEIGHT = 845;
  var BASE_POINTS = PATH_CONFIG.basePoints;
  var POINT_ORDER = PATH_CONFIG.pointOrder;
  var MATH_Y_MAX = PATH_CONFIG.mathYMax;
  var SHAPE_HEIGHT = PATH_CONFIG.shapeHeight;
  var SHAPE_SCALE = SHAPE_HEIGHT / MATH_Y_MAX;
  var PAPER_WIDTH = 20 * SHAPE_SCALE;
  var LEFT_OFFSET = PATH_CONFIG.leftOffset;
  var TARGET_ANGLE = ROTATE_CFG.targetAngle;
  var SNAP_THRESHOLD = ROTATE_CFG.snapAngleThreshold;
  var CENTER_KEY = ROTATE_CFG.centerPoint;
  var TRACK_POINT_KEYS = ["E", "F", "centroid"];
  var TOTAL_DISFIGURE_STEPS = DISFIGUREMENT_STEPS.length;
  var DISFIGURE_DURATION = PATH_CONFIG.disfigureDuration;

  var LEFT_PAPER = {
    x: LEFT_OFFSET.x,
    y: LEFT_OFFSET.y,
    scale: SHAPE_SCALE,
  };

  var INTRO_PAPER_POS = {
    x: PATH_CONFIG.introPaper.x,
    y: PATH_CONFIG.introPaper.y,
    scale: SHAPE_SCALE * (PATH_CONFIG.introPaper.scaleMultiplier || 1.68),
  };

  var phaseState = useState(fromStep1 ? "enter" : "enterFromMove");
  var rotatePhase = phaseState[0];
  var setRotatePhase = phaseState[1];

  var paperOffsetState = useState(LEFT_PAPER);
  var paperOffset = paperOffsetState[0];
  var setPaperOffset = paperOffsetState[1];

  var paperAngleState = useState(0);
  var paperAngle = paperAngleState[0];
  var setPaperAngle = paperAngleState[1];

  var showYellowPathState = useState(false);
  var showYellowPath = showYellowPathState[0];
  var setShowYellowPath = showYellowPathState[1];

  var showGuideCircleState = useState(false);
  var showGuideCircle = showGuideCircleState[0];
  var setShowGuideCircle = showGuideCircleState[1];

  var mcqVisibleState = useState(false);
  var mcqVisible = mcqVisibleState[0];
  var setMcqVisible = mcqVisibleState[1];

  var mcqActiveState = useState(false);
  var mcqActive = mcqActiveState[0];
  var setMcqActive = mcqActiveState[1];

  var showSummaryState = useState(false);
  var showSummary = showSummaryState[0];
  var setShowSummary = showSummaryState[1];

  var summaryVisibleState = useState(false);
  var summaryVisible = summaryVisibleState[0];
  var setSummaryVisible = summaryVisibleState[1];

  var showRevealBtnState = useState(false);
  var showRevealBtn = showRevealBtnState[0];
  var setShowRevealBtn = showRevealBtnState[1];

  var showReplayBtnState = useState(false);
  var showReplayBtn = showReplayBtnState[0];
  var setShowReplayBtn = showReplayBtnState[1];

  var postRevealStepState = useState("idle");
  var postRevealStep = postRevealStepState[0];
  var setPostRevealStep = postRevealStepState[1];

  var paperSelfAngleState = useState(0);
  var paperSelfAngle = paperSelfAngleState[0];
  var setPaperSelfAngle = paperSelfAngleState[1];

  var activeSummaryState = useState(null);
  var activeSummary = activeSummaryState[0];
  var setActiveSummary = activeSummaryState[1];

  var revealBtnLabelState = useState("");
  var revealBtnLabel = revealBtnLabelState[0];
  var setRevealBtnLabel = revealBtnLabelState[1];

  var showTrackPointsState = useState(false);
  var showTrackPoints = showTrackPointsState[0];
  var setShowTrackPoints = showTrackPointsState[1];

  var showTrackArcsState = useState(false);
  var showTrackArcs = showTrackArcsState[0];
  var setShowTrackArcs = showTrackArcsState[1];

  var trackAngleState = useState(0);
  var trackAngle = trackAngleState[0];
  var setTrackAngle = trackAngleState[1];

  var trackGuidesState = useState({ e: false, f: false, center: false });
  var trackGuides = trackGuidesState[0];
  var setTrackGuides = trackGuidesState[1];

  var showBlueBoxState = useState(false);
  var showBlueBox = showBlueBoxState[0];
  var setShowBlueBox = showBlueBoxState[1];

  var showTextLayoverState = useState(false);
  var showTextLayover = showTextLayoverState[0];
  var setShowTextLayover = showTextLayoverState[1];

  var textLayoverVisibleState = useState(false);
  var textLayoverVisible = textLayoverVisibleState[0];
  var setTextLayoverVisible = textLayoverVisibleState[1];

  var definitionTypedState = useState("");
  var definitionTyped = definitionTypedState[0];
  var setDefinitionTyped = definitionTypedState[1];

  var disfigureProgressState = useState(0);
  var disfigureProgress = disfigureProgressState[0];
  var setDisfigureProgress = disfigureProgressState[1];

  var noScaleState = useState(1);
  var noGreyScale = noScaleState[0];
  var setNoGreyScale = noScaleState[1];

  var svgRef = useRef(null);
  var dragRef = useRef(null);
  var rotateHandleRef = useRef(null);
  var gsapTweenRef = useRef(null);
  var yesGsapRef = useRef(null);
  var noGsapRef = useRef(null);
  var disfigureProgressRef = useRef(0);
  var noGreyScaleRef = useRef(1);
  var paperAngleRef = useRef(0);
  var rotatePhaseRef = useRef(rotatePhase);
  var centerCRef = useRef(null);

  disfigureProgressRef.current = disfigureProgress;
  noGreyScaleRef.current = noGreyScale;
  paperAngleRef.current = paperAngle;
  rotatePhaseRef.current = rotatePhase;

  var killTween = useCallback(function () {
    if (gsapTweenRef.current) {
      gsapTweenRef.current.kill();
      gsapTweenRef.current = null;
    }
  }, []);

  var killMcqTweens = useCallback(function () {
    if (yesGsapRef.current) {
      yesGsapRef.current.kill();
      yesGsapRef.current = null;
    }
    if (noGsapRef.current) {
      noGsapRef.current.kill();
      noGsapRef.current = null;
    }
  }, []);

  var getPathPoints = useCallback(
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

  var pointsToPath = useCallback(function (points) {
    return (
      "M " +
      POINT_ORDER.map(function (key, i) {
        var p = points[key];
        return (i === 0 ? "" : " L ") + p.x + "," + p.y;
      }).join("") +
      " Z"
    );
  }, [POINT_ORDER]);

  var getCentroid = useCallback(
    function (points) {
      var sx = 0;
      var sy = 0;
      POINT_ORDER.forEach(function (key) {
        sx += points[key].x;
        sy += points[key].y;
      });
      var n = POINT_ORDER.length;
      return { x: sx / n, y: sy / n };
    },
    [POINT_ORDER]
  );

  var buildDisfigurementSmooth = useCallback(function (progress) {
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

  var rotatePointAround = useCallback(function (p, center, angleDeg) {
    var rad = (angleDeg * Math.PI) / 180;
    var cos = Math.cos(rad);
    var sin = Math.sin(rad);
    var dx = p.x - center.x;
    var dy = p.y - center.y;
    return {
      x: center.x + dx * cos + dy * sin,
      y: center.y - dx * sin + dy * cos,
    };
  }, []);

  var getSvgPoint = useCallback(function (clientX, clientY) {
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

  var leftPoints = getPathPoints(LEFT_OFFSET, null);
  var centerC = leftPoints[CENTER_KEY];
  centerCRef.current = centerC;
  var shapeCentroid = getCentroid(leftPoints);

  var yellowPoints = {};
  POINT_ORDER.forEach(function (key) {
    yellowPoints[key] = rotatePointAround(
      leftPoints[key],
      centerC,
      TARGET_ANGLE
    );
  });

  var guideRadius = Math.hypot(
    shapeCentroid.x - centerC.x,
    shapeCentroid.y - centerC.y
  );

  var runYesDisfigureLoop = useCallback(
    function () {
      if (yesGsapRef.current) {
        yesGsapRef.current.kill();
      }
      var proxy = { p: 0 };
      setDisfigureProgress(0);
      yesGsapRef.current = gsap.to(proxy, {
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
    [DISFIGURE_DURATION, TOTAL_DISFIGURE_STEPS]
  );

  var runNoScaleLoop = useCallback(
    function () {
      if (noGsapRef.current) {
        noGsapRef.current.kill();
      }
      var proxy = { s: 1 };
      setNoGreyScale(1);
      noGsapRef.current = gsap
        .timeline({ repeat: -1, yoyo: true })
        .to(proxy, {
          s: 0.5,
          duration: 0.55,
          ease: "power2.inOut",
          onUpdate: function () {
            setNoGreyScale(proxy.s);
          },
        })
        .to(proxy, {
          s: 1.5,
          duration: 0.55,
          ease: "power2.inOut",
          onUpdate: function () {
            setNoGreyScale(proxy.s);
          },
        });
    },
    []
  );

  var stopMcqAnims = useCallback(
    function () {
      killMcqTweens();
      setDisfigureProgress(0);
      setNoGreyScale(1);
    },
    [killMcqTweens]
  );

  var animatePaperAngle = useCallback(
    function (toAngle, duration, onComplete) {
      killTween();
      var proxy = { a: paperAngleRef.current };
      gsapTweenRef.current = gsap.to(proxy, {
        a: toAngle,
        duration: duration,
        ease: "power2.inOut",
        onUpdate: function () {
          setPaperAngle(proxy.a);
        },
        onComplete: onComplete || null,
      });
    },
    [killTween]
  );

  var runSummaryReplaySequence = useCallback(
    function (showReplayAfter) {
      animatePaperAngle(0, 0.7, function () {
        animatePaperAngle(TARGET_ANGLE, 1.1, function () {
          if (showReplayAfter) {
            setShowReplayBtn(true);
          }
        });
      });
    },
    [animatePaperAngle, TARGET_ANGLE]
  );

  var getTrackPointPos = useCallback(
    function (key) {
      if (key === "centroid") return shapeCentroid;
      return leftPoints[key];
    },
    [leftPoints, shapeCentroid]
  );

  var getGuideRadius = useCallback(
    function (key) {
      var p = getTrackPointPos(key);
      return Math.hypot(p.x - centerC.x, p.y - centerC.y);
    },
    [getTrackPointPos, centerC]
  );

  var describeTrackArcForPoint = useCallback(
    function (bluePt, sweepDeg) {
      var cx = centerC.x;
      var cy = centerC.y;
      var r = Math.hypot(bluePt.x - cx, bluePt.y - cy);
      if (r < 1 || Math.abs(sweepDeg) < 0.5) return "";

      // SVG group rotate(+θ) moves points clockwise; rotatePointAround needs -θ for that world position
      var toPt = rotatePointAround(bluePt, centerC, -sweepDeg);

      var startAngle = Math.atan2(-(bluePt.y - cy), bluePt.x - cx);
      var endAngle = Math.atan2(-(toPt.y - cy), toPt.x - cx);
      var delta = endAngle - startAngle;
      if (sweepDeg > 0) {
        while (delta > 0) delta -= 2 * Math.PI;
      } else {
        while (delta < 0) delta += 2 * Math.PI;
      }
      var largeArc = Math.abs(delta) > Math.PI ? 1 : 0;
      var sweep = sweepDeg > 0 ? 1 : 0;

      return (
        "M " +
        bluePt.x +
        " " +
        bluePt.y +
        " A " +
        r +
        " " +
        r +
        " 0 " +
        largeArc +
        " " +
        sweep +
        " " +
        toPt.x +
        " " +
        toPt.y
      );
    },
    [centerC, rotatePointAround]
  );

  var showSummaryPanel = useCallback(function (summaryData, revealLabel, showReplay) {
    setActiveSummary(summaryData);
    if (revealLabel) setRevealBtnLabel(revealLabel);
    setShowSummary(true);
    setSummaryVisible(false);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        setSummaryVisible(true);
        if (revealLabel) setShowRevealBtn(true);
        setShowReplayBtn(!!showReplay);
      });
    });
  }, []);

  var runOrientationRevealAnim = useCallback(
    function (onComplete) {
      killTween();
      setPaperSelfAngle(0);
      var proxy = { a: 0 };
      gsapTweenRef.current = gsap
        .timeline({ onComplete: onComplete || null })
        .to(proxy, {
          a: -180,
          duration: 1,
          ease: "power2.inOut",
          onUpdate: function () {
            setPaperSelfAngle(proxy.a);
          },
        })
        .to(proxy, {
          a: -185,
          duration: 0.25,
          ease: "power1.inOut",
          onUpdate: function () {
            setPaperSelfAngle(proxy.a);
          },
        })
        .to(proxy, {
          a: -175,
          duration: 0.25,
          ease: "power1.inOut",
          onUpdate: function () {
            setPaperSelfAngle(proxy.a);
          },
        })
        .to(proxy, {
          a: -185,
          duration: 0.25,
          ease: "power1.inOut",
          onUpdate: function () {
            setPaperSelfAngle(proxy.a);
          },
        })
        .to(proxy, {
          a: -175,
          duration: 0.25,
          ease: "power1.inOut",
          onUpdate: function () {
            setPaperSelfAngle(proxy.a);
          },
        })
        .to(proxy, {
          a: 0,
          duration: 1,
          ease: "power2.inOut",
          onUpdate: function () {
            setPaperSelfAngle(proxy.a);
          },
        });
    },
    [killTween]
  );

  var runPointsRevealAnim = useCallback(
    function (onComplete) {
      killTween();
      setShowTrackPoints(false);
      setShowTrackArcs(false);
      setTrackGuides({ e: false, f: false, center: false });
      setTrackAngle(0);

      var proxy = { a: paperAngleRef.current };
      gsapTweenRef.current = gsap
        .timeline({ onComplete: onComplete || null })
        .to(proxy, {
          a: 0,
          duration: 1.7,
          ease: "power2.inOut",
          onUpdate: function () {
            setPaperAngle(proxy.a);
            paperAngleRef.current = proxy.a;
            setTrackAngle(proxy.a);
          },
        })
        .call(function () {
          setShowTrackPoints(true);
          setShowTrackArcs(true);
          setTrackGuides({ e: true, f: true, center: true });
          proxy.a = 0;
          setTrackAngle(0);
        })
        .to(proxy, {
          a: TARGET_ANGLE,
          duration: 2.4,
          ease: "power2.inOut",
          onUpdate: function () {
            setPaperAngle(proxy.a);
            paperAngleRef.current = proxy.a;
            setTrackAngle(proxy.a);
          },
        });
    },
    [killTween, TARGET_ANGLE]
  );

  var startDefinitionTyping = useCallback(
    function (onComplete) {
      var full = ROTATE.definitionTyping;
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
    [ROTATE.definitionTyping]
  );

  useEffect(
    function () {
      if (onUpdateQuestion) onUpdateQuestion(ROTATE.tapQuestion);

      if (fromStep1) {
        setPaperOffset(INTRO_PAPER_POS);
        var proxy = {
          x: INTRO_PAPER_POS.x,
          y: INTRO_PAPER_POS.y,
          s: INTRO_PAPER_POS.scale,
        };
        gsapTweenRef.current = gsap.to(proxy, {
          x: LEFT_PAPER.x,
          y: LEFT_PAPER.y,
          s: LEFT_PAPER.scale,
          duration: ROTATE_CFG.paperEnterDuration || 0.85,
          ease: "power2.out",
          onUpdate: function () {
            setPaperOffset({ x: proxy.x, y: proxy.y, scale: proxy.s });
          },
          onComplete: function () {
            setRotatePhase("tap");
          },
        });
      } else {
        setPaperOffset(LEFT_PAPER);
        setPaperAngle(0);
        gsapTweenRef.current = gsap.fromTo(
          { o: 0 },
          { o: 0 },
          {
            o: 1,
            duration: 0.01,
            onComplete: function () {
              setRotatePhase("tap");
            },
          }
        );
      }

      return killTween;
    },
    [fromStep1, killTween, onUpdateQuestion, ROTATE.tapQuestion]
  );

  useEffect(
    function () {
      if (rotatePhase === "tap" && onNudgeTarget) {
        onNudgeTarget("rotatePaper");
      }
    },
    [rotatePhase, onNudgeTarget]
  );

  useEffect(
    function () {
      if (showBlueBox && onNudgeTarget) {
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            onNudgeTarget("blue");
          });
        });
      } else if (showRevealBtn && onNudgeTarget) {
        onNudgeTarget("rotateReveal");
      }
    },
    [showBlueBox, showRevealBtn, onNudgeTarget]
  );

  useEffect(
    function () {
      if (!mcqActive) return;
      runYesDisfigureLoop();
      runNoScaleLoop();
      return killMcqTweens;
    },
    [mcqActive, runYesDisfigureLoop, runNoScaleLoop, killMcqTweens]
  );

  var handlePaperTap = useCallback(
    function () {
      if (rotatePhase !== "tap") return;
      if (typeof playSound === "function") playSound("click");
      if (onNudgeDismiss) onNudgeDismiss();
      setRotatePhase("rotate");
      setShowYellowPath(true);
      setShowGuideCircle(true);
      if (onUpdateQuestion) onUpdateQuestion(ROTATE.rotateQuestion);
    },
    [rotatePhase, onNudgeDismiss, onUpdateQuestion, ROTATE.rotateQuestion]
  );

  var clampPaperAngle = function (angle) {
    if (angle < 0) return 0;
    if (angle > TARGET_ANGLE + 15) return TARGET_ANGLE + 15;
    return angle;
  };

  var handleRotateDown = useCallback(
    function (e) {
      if (rotatePhaseRef.current !== "rotate") return;
      killTween();
      if (e.cancelable) e.preventDefault();
      if (e.stopPropagation) e.stopPropagation();
      var clientX = e.clientX;
      var clientY = e.clientY;
      if (e.touches && e.touches[0]) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }
      var pt = getSvgPoint(clientX, clientY);
      dragRef.current = {
        lastX: pt.x,
        lastY: pt.y,
      };
      if (typeof playSound === "function") playSound("click");
    },
    [getSvgPoint, killTween]
  );

  var handleRotateMove = useCallback(
    function (e) {
      if (!dragRef.current || rotatePhaseRef.current !== "rotate") return;
      if (e.cancelable) e.preventDefault();
      var clientX = e.clientX;
      var clientY = e.clientY;
      if (e.touches && e.touches[0]) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }
      var pt = getSvgPoint(clientX, clientY);
      var c = centerCRef.current;
      if (!c) return;
      var dx1 = dragRef.current.lastX - c.x;
      var dy1 = dragRef.current.lastY - c.y;
      var dx2 = pt.x - c.x;
      var dy2 = pt.y - c.y;
      var cross = dx1 * dy2 - dy1 * dx2;
      var dot = dx1 * dx2 + dy1 * dy2;
      var delta = (Math.atan2(cross, dot) * 180) / Math.PI;
      if (delta < 0) return;
      dragRef.current.lastX = pt.x;
      dragRef.current.lastY = pt.y;
      var next = clampPaperAngle(paperAngleRef.current + delta);
      paperAngleRef.current = next;
      setPaperAngle(next);
    },
    [getSvgPoint, TARGET_ANGLE]
  );

  var handleRotateUp = useCallback(
    function () {
      if (!dragRef.current || rotatePhaseRef.current !== "rotate") return;
      dragRef.current = null;
      var angle = paperAngleRef.current;
      if (Math.abs(angle - TARGET_ANGLE) <= SNAP_THRESHOLD) {
        animatePaperAngle(TARGET_ANGLE, 0.35, function () {
          setShowYellowPath(false);
          setShowGuideCircle(false);
          setRotatePhase("mcq");
          setMcqActive(true);
          setMcqVisible(false);
          if (onUpdateQuestion) onUpdateQuestion(ROTATE.mcqQuestion);
          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              setMcqVisible(true);
            });
          });
        });
      }
    },
    [
      SNAP_THRESHOLD,
      TARGET_ANGLE,
      animatePaperAngle,
      onUpdateQuestion,
      ROTATE.mcqQuestion,
    ]
  );

  var handleRotateDownRef = useRef(handleRotateDown);
  var handleRotateMoveRef = useRef(handleRotateMove);
  var handleRotateUpRef = useRef(handleRotateUp);
  handleRotateDownRef.current = handleRotateDown;
  handleRotateMoveRef.current = handleRotateMove;
  handleRotateUpRef.current = handleRotateUp;

  useLayoutEffect(
    function () {
      if (rotatePhase !== "rotate") return;

      var cleanupFn = null;
      var cancelled = false;
      var attached = false;

      function attachListeners() {
        if (attached || cancelled) return;
        var el = rotateHandleRef.current;
        if (!el) return;
        attached = true;

        function onPointerDown(e) {
          e.preventDefault();
          e.stopPropagation();
          handleRotateDownRef.current(e);
          if (el.setPointerCapture) {
            el.setPointerCapture(e.pointerId);
          }
        }

        function onPointerMove(e) {
          if (!dragRef.current) return;
          handleRotateMoveRef.current(e);
        }

        function onPointerUp(e) {
          if (el.releasePointerCapture) {
            try {
              el.releasePointerCapture(e.pointerId);
            } catch (err) {
              /* already released */
            }
          }
          handleRotateUpRef.current();
        }

        el.addEventListener("pointerdown", onPointerDown);
        el.addEventListener("pointermove", onPointerMove);
        el.addEventListener("pointerup", onPointerUp);
        el.addEventListener("pointercancel", onPointerUp);

        cleanupFn = function () {
          el.removeEventListener("pointerdown", onPointerDown);
          el.removeEventListener("pointermove", onPointerMove);
          el.removeEventListener("pointerup", onPointerUp);
          el.removeEventListener("pointercancel", onPointerUp);
        };
      }

      attachListeners();
      if (!attached) {
        requestAnimationFrame(attachListeners);
      }

      return function () {
        cancelled = true;
        if (cleanupFn) cleanupFn();
      };
    },
    [rotatePhase]
  );

  var handleMcqOptionClick = useCallback(
    function (option) {
      killMcqTweens();
      setDisfigureProgress(0);
      setNoGreyScale(1);
      if (option !== ROTATE.mcq.answer) {
        if (option === ROTATE.mcq.options[0]) runYesDisfigureLoop();
        else runNoScaleLoop();
      }
    },
    [killMcqTweens, ROTATE.mcq, runYesDisfigureLoop, runNoScaleLoop]
  );

  var handleMcqAnswer = useCallback(
    function (isCorrect) {
      if (!isCorrect) return;
      setMcqVisible(false);
      stopMcqAnims();
      setTimeout(function () {
        setMcqActive(false);
        setShowSummary(true);
        setSummaryVisible(false);
        if (onUpdateQuestion) onUpdateQuestion(ROTATE.summaryQuestion);
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            setSummaryVisible(true);
            setShowRevealBtn(true);
            setPostRevealStep("mcqSummary");
            setActiveSummary(ROTATE.summary);
            setRevealBtnLabel(ROTATE.revealButton);
            runSummaryReplaySequence(true);
          });
        });
      }, 450);
    },
    [
      stopMcqAnims,
      onUpdateQuestion,
      ROTATE.summaryQuestion,
      runSummaryReplaySequence,
    ]
  );

  var handleReplay = useCallback(
    function () {
      if (typeof playSound === "function") playSound("click");
      setShowReplayBtn(false);
      if (postRevealStep === "mcqSummary") {
        runSummaryReplaySequence(true);
      } else if (postRevealStep === "orientSummary") {
        runOrientationRevealAnim(function () {
          setShowReplayBtn(true);
        });
      } else if (postRevealStep === "pointsSummary") {
        runPointsRevealAnim(function () {
          setShowReplayBtn(true);
        });
      }
    },
    [
      postRevealStep,
      runSummaryReplaySequence,
      runOrientationRevealAnim,
      runPointsRevealAnim,
    ]
  );

  var handleRevealClick = useCallback(
    function () {
      if (typeof playSound === "function") playSound("click");
      if (onNudgeDismiss) onNudgeDismiss();

      if (postRevealStep === "mcqSummary") {
        setSummaryVisible(false);
        setShowRevealBtn(false);
        setShowReplayBtn(false);
        setTimeout(function () {
          setShowSummary(false);
          setPostRevealStep("orientDemo");
          runOrientationRevealAnim(function () {
            setPostRevealStep("orientSummary");
            showSummaryPanel(
              ROTATE.orientationSummary,
              ROTATE.whatElseButton,
              true
            );
          });
        }, 450);
        return;
      }

      if (postRevealStep === "orientSummary") {
        setSummaryVisible(false);
        setShowRevealBtn(false);
        setShowReplayBtn(false);
        setTimeout(function () {
          setShowSummary(false);
          setPostRevealStep("pointsDemo");
          if (onUpdateQuestion) onUpdateQuestion(ROTATE.observeQuestion);
          runPointsRevealAnim(function () {
            setPostRevealStep("pointsSummary");
            showSummaryPanel(
              ROTATE.pointsSummary,
              ROTATE.summarizeButton,
              true
            );
          });
        }, 450);
        return;
      }

      if (postRevealStep === "pointsSummary") {
        setSummaryVisible(false);
        setShowRevealBtn(false);
        setShowReplayBtn(false);
        setShowTrackPoints(false);
        setShowTrackArcs(false);
        setTrackGuides({ e: false, f: false, center: true });
        setTimeout(function () {
          setShowSummary(false);
          setPostRevealStep("fullSummary");
          setActiveSummary(ROTATE.fullSummary);
          setDefinitionTyped("");
          if (onUpdateQuestion) onUpdateQuestion(ROTATE.summaryQuestion);
          setShowSummary(true);
          setSummaryVisible(false);
          setShowBlueBox(true);
          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              setSummaryVisible(true);
            });
          });
        }, 450);
      }
    },
    [
      postRevealStep,
      onNudgeDismiss,
      runOrientationRevealAnim,
      runPointsRevealAnim,
      showSummaryPanel,
      onUpdateQuestion,
      ROTATE,
    ]
  );

  var handleBlueBoxClick = useCallback(
    function () {
      if (typeof playSound === "function") playSound("click");
      setShowBlueBox(false);
      setShowSummary(false);
      setSummaryVisible(false);
      if (onNudgeDismiss) onNudgeDismiss();
      setShowTextLayover(true);
      setTextLayoverVisible(false);
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          setTextLayoverVisible(true);
        });
      });
      if (onUpdateQuestion) onUpdateQuestion(ROTATE.questionTranslation);
    },
    [onNudgeDismiss, onUpdateQuestion, ROTATE.questionTranslation]
  );

  var handleTextLayoverClose = useCallback(
    function () {
      setTextLayoverVisible(false);
      setTimeout(function () {
        setShowTextLayover(false);
        setPostRevealStep("definition");
        setShowSummary(true);
        setSummaryVisible(true);
        setDefinitionTyped("");
        startDefinitionTyping(function () {
          if (onRotateFlowComplete) onRotateFlowComplete();
        });
      }, 450);
    },
    [startDefinitionTyping, onRotateFlowComplete]
  );

  var renderGreyShapeSvg = function (disfigurement, scale, key) {
    var pts = getPathPoints({ x: 0, y: 0 }, disfigurement);
    var minX = Infinity;
    var minY = Infinity;
    var maxX = -Infinity;
    var maxY = -Infinity;
    POINT_ORDER.forEach(function (ptKey) {
      var p = pts[ptKey];
      if (p.x < minX) minX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.x > maxX) maxX = p.x;
      if (p.y > maxY) maxY = p.y;
    });
    var pad = 30;
    var vbW = maxX - minX + pad * 2;
    var vbH = maxY - minY + pad * 2;
    var c = getCentroid(pts);

    return React.createElement(
      "svg",
      {
        key: key,
        viewBox: minX - pad + " " + (minY - pad) + " " + vbW + " " + vbH,
        preserveAspectRatio: "xMidYMid meet",
      },
      React.createElement(
        "g",
        {
          transform:
            "translate(" +
            c.x +
            "," +
            c.y +
            ") scale(" +
            scale +
            ") translate(" +
            -c.x +
            "," +
            -c.y +
            ")",
        },
        React.createElement("path", {
          className: "rotate-grey-shape",
          d: pointsToPath(pts),
        })
      )
    );
  };

  var yesDisfigure = buildDisfigurementSmooth(disfigureProgress);
  var yesShape = renderGreyShapeSvg(yesDisfigure, 1, "yes-grey");
  var noShape = renderGreyShapeSvg(null, noGreyScale, "no-grey");

  var paperScale = paperOffset.scale || SHAPE_SCALE;
  var paperW = PAPER_WIDTH * (paperScale / SHAPE_SCALE);
  var paperH = SHAPE_HEIGHT * (paperScale / SHAPE_SCALE);
  var paperCenterX = paperOffset.x + paperW / 2;
  var paperCenterY = paperOffset.y + paperH / 2;
  var paperClass = "paper-image";
  if (rotatePhase === "tap") paperClass += " paper-image--tappable";

  var currentSummary = activeSummary || ROTATE.summary;

  var renderMarkerPoint = function (x, y, fill, key, className) {
    return React.createElement(
      "g",
      {
        key: key,
        className: "rotate-track-point" + (className ? " " + className : ""),
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
        fill: fill,
      })
    );
  };

  var renderTrackGuideCircles = function () {
    var items = [];
    if (trackGuides.e) {
      items.push(
        React.createElement("circle", {
          key: "guide-e",
          className: "rotate-track-guide",
          cx: centerC.x,
          cy: centerC.y,
          r: getGuideRadius("E"),
          fill: "none",
          stroke: "white",
          strokeWidth: 2,
          opacity: 0.25,
        })
      );
    }
    if (trackGuides.f) {
      items.push(
        React.createElement("circle", {
          key: "guide-f",
          className: "rotate-track-guide",
          cx: centerC.x,
          cy: centerC.y,
          r: getGuideRadius("F"),
          fill: "none",
          stroke: "white",
          strokeWidth: 2,
          opacity: 0.25,
        })
      );
    }
    if (trackGuides.center) {
      items.push(
        React.createElement("circle", {
          key: "guide-center",
          className: "rotate-track-guide",
          cx: centerC.x,
          cy: centerC.y,
          r: getGuideRadius("centroid"),
          fill: "none",
          stroke: "white",
          strokeWidth: 2,
          opacity: 0.25,
        })
      );
    }
    return items;
  };

  var renderTrackArcs = function () {
    if (!showTrackArcs || paperAngle < 0.5) return null;
    return TRACK_POINT_KEYS.map(function (key) {
      var fromPt = getTrackPointPos(key);
      var d = describeTrackArcForPoint(fromPt, paperAngle);
      if (!d) return null;
      return React.createElement("path", {
        key: "arc-" + key,
        className: "rotate-track-arc",
        d: d,
        fill: "none",
        stroke: "#ce93d8",
        strokeWidth: 6,
        strokeDasharray: "8 6",
      });
    });
  };

  var renderYellowTrackPoints = function () {
    if (!showTrackPoints) return null;
    return TRACK_POINT_KEYS.map(function (key) {
      var p = getTrackPointPos(key);
      return renderMarkerPoint(
        p.x,
        p.y,
        "#ffc107",
        "yellow-" + key,
        "rotate-track-point--yellow"
      );
    });
  };

  var renderBlueTrackPoints = function () {
    if (!showTrackPoints) return null;
    return TRACK_POINT_KEYS.map(function (key) {
      var p = getTrackPointPos(key);
      return renderMarkerPoint(
        p.x,
        p.y,
        "#4fc3f7",
        "blue-" + key,
        "rotate-track-point--blue"
      );
    });
  };

  var renderRotateHandle = function () {
    if (rotatePhase !== "rotate") return null;
    return React.createElement(
      "g",
      {
        className: "rotate-handle",
        transform:
          "translate(" + paperCenterX + "," + paperCenterY + ")",
      },
      React.createElement("circle", {
        ref: rotateHandleRef,
        className: "rotate-handle__hit",
        r: 36,
        fill: "rgba(255,255,255,0.001)",
      }),
      React.createElement("circle", {
        className: "rotate-handle__bg",
        r: 28,
        fill: "#81d4fa",
        stroke: "#4fc3f7",
        strokeWidth: 2.5,
      }),
      React.createElement("path", {
        className: "rotate-handle__arc",
        d: "M -14 -5 A 14 14 0 0 1 14 -5",
        fill: "none",
        stroke: "white",
        strokeWidth: 3.5,
        strokeLinecap: "round",
      }),
      React.createElement("polygon", {
        className: "rotate-handle__arrow",
        points: "14,-5 19,0 10,0",
        fill: "white",
      })
    );
  };

  return React.createElement(
    "div",
    { className: "rotate-canvas-container" },
    rotatePhase === "tap" &&
      paperAnchorRef &&
      React.createElement("div", {
        ref: paperAnchorRef,
        className: "nudge-anchor",
        style: {
          position: "absolute",
          left: (shapeCentroid.x / SVG_WIDTH) * 100 + "%",
          top: (shapeCentroid.y / SVG_HEIGHT) * 100 + "%",
          width: 0,
          height: 0,
          pointerEvents: "none",
        },
      }),
    showSummary &&
      React.createElement(
        "div",
        {
          className:
            "rotate-summary-stack" +
            (summaryVisible ? " rotate-summary-stack--visible" : ""),
        },
        React.createElement(
          "div",
          { className: "rotate-summary-box" },
          definitionTyped
            ? React.createElement("div", {
                className: "rotate-summary-box__typing",
                dangerouslySetInnerHTML: { __html: definitionTyped },
              })
            : createSummaryElement(currentSummary)
        ),
        showRevealBtn &&
          React.createElement(
            "button",
            {
              ref: revealBtnRef,
              className: "rotate-reveal-btn",
              onClick: handleRevealClick,
            },
            revealBtnLabel || ROTATE.revealButton
          ),
        showBlueBox &&
          React.createElement("div", {
            ref: blueBoxRef,
            className: "blue-box rotate-blue-box",
            onClick: handleBlueBoxClick,
            dangerouslySetInnerHTML: { __html: ROTATE.blueBox },
          })
      ),
    React.createElement(
      "button",
      {
        className:
          "rotate-replay-btn" +
          (showReplayBtn ? " rotate-replay-btn--visible" : ""),
        onClick: handleReplay,
      },
      ROTATE.replayButton
    ),
    mcqActive &&
      React.createElement(RotateMcqLayover, {
        visible: mcqVisible,
        title: ROTATE.mcq.title,
        options: ROTATE.mcq.options,
        correctAnswer: ROTATE.mcq.answer,
        onOptionClick: handleMcqOptionClick,
        onAnswer: handleMcqAnswer,
        yesShapeContent: yesShape,
        noShapeContent: noShape,
      }),
    showTextLayover &&
      React.createElement(TextLayover, {
        visible: textLayoverVisible,
        body: ROTATE.textLayover.body,
        footer: ROTATE.textLayover.footer,
        onClose: handleTextLayoverClose,
      }),
    React.createElement(
      "svg",
      {
        ref: svgRef,
        viewBox: "0 0 " + SVG_WIDTH + " " + SVG_HEIGHT,
        className:
          "main-svg" + (rotatePhase === "rotate" ? " main-svg--rotating" : ""),
        preserveAspectRatio: "xMidYMid meet",
      },
      React.createElement("path", {
        className: "path-left",
        d: pointsToPath(leftPoints),
        fill: "none",
        stroke: "#4fc3f7",
        strokeWidth: 3,
        strokeDasharray: "10 6",
        style: { pointerEvents: "none" },
      }),
      showYellowPath &&
        React.createElement("path", {
          className: "path-yellow-target",
          d: pointsToPath(yellowPoints),
          fill: "rgba(255, 193, 7, 0.22)",
          stroke: "#ffc107",
          strokeWidth: 3,
          strokeDasharray: "10 6",
        }),
      renderTrackGuideCircles(),
      React.createElement(
        "g",
        {
          transform:
            "translate(" +
            centerC.x +
            "," +
            centerC.y +
            ") rotate(" +
            paperAngle +
            ") translate(" +
            -centerC.x +
            "," +
            -centerC.y +
            ")",
        },
        rotatePhase === "tap" &&
          React.createElement("path", {
            d: pointsToPath(leftPoints),
            fill: "rgba(255,255,255,0.001)",
            stroke: "none",
            style: { cursor: "pointer", pointerEvents: "all" },
            onClick: handlePaperTap,
          }),
        React.createElement(
          "g",
          {
            transform:
              "translate(" +
              paperCenterX +
              "," +
              paperCenterY +
              ") rotate(" +
              paperSelfAngle +
              ") translate(" +
              -paperCenterX +
              "," +
              -paperCenterY +
              ")",
          },
          React.createElement("image", {
            href: "assets/paper.png",
            x: paperOffset.x,
            y: paperOffset.y,
            width: paperW,
            height: paperH,
            className: paperClass,
            opacity: 1,
            style: { pointerEvents: "none" },
          })
        ),
        renderYellowTrackPoints(),
        renderRotateHandle()
      ),
      renderTrackArcs(),
      showGuideCircle &&
        React.createElement("circle", {
          className: "rotation-guide-circle",
          cx: centerC.x,
          cy: centerC.y,
          r: guideRadius,
          fill: "none",
          stroke: "white",
          strokeWidth: 2,
          opacity: ROTATE_CFG.guideCircleOpacity || 0.12,
        }),
      showGuideCircle &&
        React.createElement(
          "g",
          { className: "rotation-center-point" },
          React.createElement("line", {
            x1: centerC.x - 18,
            y1: centerC.y,
            x2: centerC.x + 18,
            y2: centerC.y,
            stroke: "white",
            strokeWidth: 2,
          }),
          React.createElement("line", {
            x1: centerC.x,
            y1: centerC.y - 18,
            x2: centerC.x,
            y2: centerC.y + 18,
            stroke: "white",
            strokeWidth: 2,
          }),
          React.createElement("circle", {
            cx: centerC.x,
            cy: centerC.y,
            r: 10,
            fill: "#e53935",
            stroke: "white",
            strokeWidth: 2,
          })
        ),
      renderBlueTrackPoints()
    )
  );
};
