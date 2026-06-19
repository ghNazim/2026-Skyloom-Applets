const MirrorCanvas = function (props) {
  var onUpdateQuestion = props.onUpdateQuestion;
  var onNudgeTarget = props.onNudgeTarget;
  var onNudgeDismiss = props.onNudgeDismiss;
  var onMirrorFlowComplete = props.onMirrorFlowComplete;
  var fromStep1 = props.fromStep1;
  var reflectorRef = props.reflectorRef;
  var mirrorLineRef = props.mirrorLineRef;
  var revealBtnRef = props.revealBtnRef;
  var blueBoxRef = props.blueBoxRef;

  var useState = React.useState;
  var useEffect = React.useEffect;
  var useRef = React.useRef;
  var useCallback = React.useCallback;

  var MIRROR = APP_DATA.mirror;
  var MIRROR_CFG = PATH_CONFIG.mirror;
  var SVG_WIDTH = MIRROR_CFG.viewboxWidth || 2000;
  var SVG_HEIGHT = 845;
  var BASE_POINTS = PATH_CONFIG.basePoints;
  var POINT_ORDER = PATH_CONFIG.pointOrder;
  var MATH_Y_MAX = PATH_CONFIG.mathYMax;
  var SHAPE_HEIGHT = PATH_CONFIG.shapeHeight;
  var SHAPE_SCALE = SHAPE_HEIGHT / MATH_Y_MAX;
  var PAPER_WIDTH = 20 * SHAPE_SCALE;
  var LEFT_OFFSET = {
    x: PATH_CONFIG.leftOffset.x + (MIRROR_CFG.leftOffsetShiftX || 0),
    y: PATH_CONFIG.leftOffset.y + (MIRROR_CFG.leftOffsetShiftY || 0),
  };
  var REFLECTOR_HEIGHT = MIRROR_CFG.reflectorHeight;
  var REFLECTOR_WIDTH = MIRROR_CFG.reflectorWidth;
  var REFLECTOR_START_X = MIRROR_CFG.reflectorStartX;
  var STATIC_YELLOW_OFFSET = MIRROR_CFG.staticYellowOffset;
  var SNAP_THRESHOLD = MIRROR_CFG.snapThreshold;
  var SNAP_OVERLAP_DURATION = MIRROR_CFG.snapOverlapDuration || 1;
  var GUIDE_LINE_KEYS = MIRROR_CFG.guideLinePoints;
  var REVEAL_TRACK_KEYS = MIRROR_CFG.revealTrackPoints;
  var FLIP_DURATION = MIRROR_CFG.flipDuration || 1.4;
  var REVEAL_RECT_DURATION = MIRROR_CFG.revealRectDuration || 0.55;
  var REVEAL_PAUSE = MIRROR_CFG.revealPauseBeforeFlip || 1.2;
  var SURROUND_PADDING = MIRROR_CFG.surroundRectPadding || 24;
  var SURROUND_RADIUS = MIRROR_CFG.surroundRectRadius || 18;
  var DIST_RECT_H = MIRROR_CFG.distanceRectHeight || 28;
  var DIST_RECT_R = MIRROR_CFG.distanceRectRadius || 8;
  var F_LINE_EXT = MIRROR_CFG.fLineExtension || 50;

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

  var mirrorPhaseState = useState(fromStep1 ? "enter" : "ready");
  var mirrorPhase = mirrorPhaseState[0];
  var setMirrorPhase = mirrorPhaseState[1];

  var paperOffsetState = useState(LEFT_PAPER);
  var paperOffset = paperOffsetState[0];
  var setPaperOffset = paperOffsetState[1];

  var mirrorXState = useState(REFLECTOR_START_X);
  var mirrorX = mirrorXState[0];
  var setMirrorX = mirrorXState[1];

  var mirrorLockedState = useState(false);
  var mirrorLocked = mirrorLockedState[0];
  var setMirrorLocked = mirrorLockedState[1];

  var showImageYellowState = useState(true);
  var showImageYellow = showImageYellowState[0];
  var setShowImageYellow = showImageYellowState[1];

  var showStaticYellowState = useState(true);
  var showStaticYellow = showStaticYellowState[0];
  var setShowStaticYellow = showStaticYellowState[1];

  var showReflectorState = useState(true);
  var showReflector = showReflectorState[0];
  var setShowReflector = showReflectorState[1];

  var showMirrorLineState = useState(false);
  var showMirrorLine = showMirrorLineState[0];
  var setShowMirrorLine = showMirrorLineState[1];

  var showFeedbackState = useState(false);
  var showFeedback = showFeedbackState[0];
  var setShowFeedback = showFeedbackState[1];

  var isDraggingState = useState(false);
  var isDragging = isDraggingState[0];
  var setIsDragging = isDraggingState[1];

  var hasDragStartedState = useState(false);
  var hasDragStarted = hasDragStartedState[0];
  var setHasDragStarted = hasDragStartedState[1];

  var staticYellowSnappedState = useState(false);
  var staticYellowSnapped = staticYellowSnappedState[0];
  var setStaticYellowSnapped = staticYellowSnappedState[1];

  var flipScaleXState = useState(1);
  var flipScaleX = flipScaleXState[0];
  var setFlipScaleX = flipScaleXState[1];

  var revealFlipScaleXState = useState(1);
  var revealFlipScaleX = revealFlipScaleXState[0];
  var setRevealFlipScaleX = revealFlipScaleXState[1];

  var paperFlipScaleXState = useState(1);
  var paperFlipScaleX = paperFlipScaleXState[0];
  var setPaperFlipScaleX = paperFlipScaleXState[1];

  var showFlipExtrasState = useState(true);
  var showFlipExtras = showFlipExtrasState[0];
  var setShowFlipExtras = showFlipExtrasState[1];

  var showInitialFlipGroupState = useState(false);
  var showInitialFlipGroup = showInitialFlipGroupState[0];
  var setShowInitialFlipGroup = showInitialFlipGroupState[1];

  var showFReferenceState = useState(false);
  var showFReference = showFReferenceState[0];
  var setShowFReference = showFReferenceState[1];

  var showRevealGroupState = useState(false);
  var showRevealGroup = showRevealGroupState[0];
  var setShowRevealGroup = showRevealGroupState[1];

  var showRevealYellowState = useState(false);
  var showRevealYellow = showRevealYellowState[0];
  var setShowRevealYellow = showRevealYellowState[1];

  var visibleRevealPointsState = useState({ B: false, F: false, H: false });
  var visibleRevealPoints = visibleRevealPointsState[0];
  var setVisibleRevealPoints = visibleRevealPointsState[1];

  var rectProgressState = useState({ B: 0, F: 0, H: 0 });
  var rectProgress = rectProgressState[0];
  var setRectProgress = rectProgressState[1];

  var showSummaryState = useState(false);
  var showSummary = showSummaryState[0];
  var setShowSummary = showSummaryState[1];

  var summaryVisibleState = useState(false);
  var summaryVisible = summaryVisibleState[0];
  var setSummaryVisible = summaryVisibleState[1];

  var activeSummaryState = useState(null);
  var activeSummary = activeSummaryState[0];
  var setActiveSummary = activeSummaryState[1];

  var revealBtnLabelState = useState("");
  var revealBtnLabel = revealBtnLabelState[0];
  var setRevealBtnLabel = revealBtnLabelState[1];

  var showRevealBtnState = useState(false);
  var showRevealBtn = showRevealBtnState[0];
  var setShowRevealBtn = showRevealBtnState[1];

  var showReplayBtnState = useState(false);
  var showReplayBtn = showReplayBtnState[0];
  var setShowReplayBtn = showReplayBtnState[1];

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

  var svgRef = useRef(null);
  var gsapTweenRef = useRef(null);
  var mirrorXRef = useRef(REFLECTOR_START_X);
  var dragOffsetRef = useRef(0);
  var isDraggingRef = useRef(false);
  var mirrorLockedRef = useRef(false);
  var mirrorPhaseRef = useRef(mirrorPhase);

  mirrorXRef.current = mirrorX;
  mirrorLockedRef.current = mirrorLocked;
  mirrorPhaseRef.current = mirrorPhase;

  var killTween = useCallback(function () {
    if (gsapTweenRef.current) {
      gsapTweenRef.current.kill();
      gsapTweenRef.current = null;
    }
  }, []);

  var getPathPoints = useCallback(
    function (offset) {
      var points = {};
      POINT_ORDER.forEach(function (key) {
        var base = BASE_POINTS[key];
        points[key] = {
          x: offset.x + base.x * SHAPE_SCALE,
          y: offset.y + (MATH_Y_MAX - base.y) * SHAPE_SCALE,
        };
      });
      return points;
    },
    [BASE_POINTS, POINT_ORDER, SHAPE_SCALE, MATH_Y_MAX]
  );

  var pointsToPath = useCallback(
    function (points) {
      return (
        "M " +
        POINT_ORDER.map(function (key, i) {
          var p = points[key];
          return (i === 0 ? "" : " L ") + p.x + "," + p.y;
        }).join("") +
        " Z"
      );
    },
    [POINT_ORDER]
  );

  var getCentroid = useCallback(
    function (points) {
      var sx = 0;
      var sy = 0;
      POINT_ORDER.forEach(function (key) {
        sx += points[key].x;
        sy += points[key].y;
      });
      return { x: sx / POINT_ORDER.length, y: sy / POINT_ORDER.length };
    },
    [POINT_ORDER]
  );

  var getPathBounds = useCallback(
    function (points, padding) {
      var minX = Infinity;
      var minY = Infinity;
      var maxX = -Infinity;
      var maxY = -Infinity;
      POINT_ORDER.forEach(function (key) {
        var p = points[key];
        minX = Math.min(minX, p.x);
        minY = Math.min(minY, p.y);
        maxX = Math.max(maxX, p.x);
        maxY = Math.max(maxY, p.y);
      });
      var pad = padding || 0;
      return {
        x: minX - pad,
        y: minY - pad,
        width: maxX - minX + pad * 2,
        height: maxY - minY + pad * 2,
      };
    },
    [POINT_ORDER]
  );

  var reflectPointsAcrossX = useCallback(
    function (points, axisX) {
      var reflected = {};
      POINT_ORDER.forEach(function (key) {
        var p = points[key];
        reflected[key] = { x: 2 * axisX - p.x, y: p.y };
      });
      return reflected;
    },
    [POINT_ORDER]
  );

  var translatePoints = useCallback(
    function (points, dx, dy) {
      var moved = {};
      POINT_ORDER.forEach(function (key) {
        moved[key] = {
          x: points[key].x + dx,
          y: points[key].y + dy,
        };
      });
      return moved;
    },
    [POINT_ORDER]
  );

  var leftPoints = getPathPoints(LEFT_OFFSET);
  var blueCentroid = getCentroid(leftPoints);
  var surroundBounds = getPathBounds(leftPoints, SURROUND_PADDING);

  var staticYellowPoints = (function () {
    var flipped = reflectPointsAcrossX(leftPoints, blueCentroid.x);
    var flippedCentroid = getCentroid(flipped);
    var targetCentroidX = blueCentroid.x + STATIC_YELLOW_OFFSET;
    return translatePoints(flipped, targetCentroidX - flippedCentroid.x, 0);
  })();

  var staticYellowCentroid = getCentroid(staticYellowPoints);
  var snapMirrorX = (blueCentroid.x + staticYellowCentroid.x) / 2;

  var imageYellowPoints = reflectPointsAcrossX(leftPoints, mirrorX);

  var getFlipTransform = function (scaleX, axisX) {
    return (
      "translate(" +
      axisX +
      ",0) scale(" +
      scaleX +
      ",1) translate(" +
      -axisX +
      ",0)"
    );
  };

  var getMinPathX = useCallback(
    function (points) {
      var minX = Infinity;
      POINT_ORDER.forEach(function (key) {
        minX = Math.min(minX, points[key].x);
      });
      return minX;
    },
    [POINT_ORDER]
  );

  var isReflectionInViewbox = useCallback(
    function (points) {
      return getMinPathX(points) < SVG_WIDTH;
    },
    [getMinPathX, SVG_WIDTH]
  );

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

  var resetRevealVisuals = useCallback(function () {
    setVisibleRevealPoints({ B: false, F: false, H: false });
    setRectProgress({ B: 0, F: 0, H: 0 });
    setShowRevealYellow(false);
    setRevealFlipScaleX(1);
  }, []);

  var showSummaryPanel = useCallback(
    function (summaryData, revealLabel, showReplay) {
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
    },
    []
  );

  var runFlipAnimation = useCallback(
    function (scaleSetter, onComplete, skipPhase) {
      killTween();
      scaleSetter(1);
      if (!skipPhase) setMirrorPhase("flipping");

      var proxy = { t: 0 };
      gsapTweenRef.current = gsap.to(proxy, {
        t: 1,
        duration: FLIP_DURATION,
        ease: "power2.inOut",
        onUpdate: function () {
          var angle = proxy.t * Math.PI;
          scaleSetter(Math.cos(angle));
        },
        onComplete: function () {
          scaleSetter(-1);
          if (onComplete) onComplete();
        },
      });
    },
    [killTween, FLIP_DURATION]
  );

  var runFlipBackAnimation = useCallback(
    function (onComplete) {
      killTween();
      var proxy = { t: 0 };
      gsapTweenRef.current = gsap.to(proxy, {
        t: 1,
        duration: FLIP_DURATION * 0.7,
        ease: "power2.inOut",
        onUpdate: function () {
          var angle = proxy.t * Math.PI;
          setFlipScaleX(-Math.cos(angle));
        },
        onComplete: function () {
          setFlipScaleX(1);
          if (onComplete) onComplete();
        },
      });
    },
    [killTween, FLIP_DURATION]
  );

  var runInitialFlip = useCallback(
    function (onComplete) {
      setShowInitialFlipGroup(true);
      runFlipAnimation(setFlipScaleX, function () {
        setMirrorPhase("flipped");
        if (onComplete) onComplete();
      });
    },
    [runFlipAnimation]
  );

  var runRevealFlipAnimation = useCallback(
    function (onComplete) {
      setMirrorPhase("revealFlipping");
      runFlipAnimation(
        setRevealFlipScaleX,
        function () {
          setMirrorPhase("revealDone");
          if (onComplete) onComplete();
        },
        true
      );
    },
    [runFlipAnimation]
  );

  var runPaperFinalFlip = useCallback(
    function (onComplete) {
      setMirrorPhase("paperFlipping");
      runFlipAnimation(
        setPaperFlipScaleX,
        function () {
          setMirrorPhase("fullSummary");
          if (onComplete) onComplete();
        },
        true
      );
    },
    [runFlipAnimation]
  );

  var animateRevealRect = useCallback(
    function (key, onComplete) {
      var proxy = { p: 0 };
      gsapTweenRef.current = gsap.to(proxy, {
        p: 1,
        duration: REVEAL_RECT_DURATION,
        ease: "power2.out",
        onUpdate: function () {
          setRectProgress(function (prev) {
            var next = Object.assign({}, prev);
            next[key] = proxy.p;
            return next;
          });
        },
        onComplete: onComplete || null,
      });
    },
    [REVEAL_RECT_DURATION]
  );

  var runRevealSequence = useCallback(
    function (onComplete) {
      killTween();
      resetRevealVisuals();
      setShowRevealGroup(true);

      var keys = REVEAL_TRACK_KEYS;
      var idx = 0;

      function nextStep() {
        if (idx >= keys.length) {
          setShowRevealYellow(true);
          gsapTweenRef.current = gsap.delayedCall(REVEAL_PAUSE, function () {
            runRevealFlipAnimation(onComplete);
          });
          return;
        }
        var key = keys[idx];
        idx += 1;
        setVisibleRevealPoints(function (prev) {
          var next = Object.assign({}, prev);
          next[key] = true;
          return next;
        });
        gsapTweenRef.current = gsap.delayedCall(0.25, function () {
          animateRevealRect(key, nextStep);
        });
      }

      nextStep();
    },
    [
      killTween,
      resetRevealVisuals,
      REVEAL_TRACK_KEYS,
      REVEAL_PAUSE,
      animateRevealRect,
      runRevealFlipAnimation,
    ]
  );

  var beginRevealFlow = useCallback(
    function () {
      setShowFlipExtras(false);
      runFlipBackAnimation(function () {
        setShowInitialFlipGroup(false);
        setShowFReference(true);
        setMirrorPhase("revealPrep");
        runRevealSequence(function () {
          if (onUpdateQuestion) onUpdateQuestion(MIRROR.summaryQuestion);
          showSummaryPanel(
            MIRROR.revealSummary,
            MIRROR.summarizeButton,
            true
          );
        });
      });
    },
    [
      runFlipBackAnimation,
      runRevealSequence,
      onUpdateQuestion,
      showSummaryPanel,
      MIRROR,
    ]
  );

  var snapMirror = useCallback(
    function () {
      if (mirrorLockedRef.current) return;
      killTween();
      setShowFeedback(false);
      setMirrorLocked(true);
      mirrorLockedRef.current = true;
      var proxy = { x: mirrorXRef.current };
      gsapTweenRef.current = gsap.to(proxy, {
        x: snapMirrorX,
        duration: 0.45,
        ease: "power2.out",
        onUpdate: function () {
          setMirrorX(proxy.x);
          mirrorXRef.current = proxy.x;
        },
        onComplete: function () {
          if (typeof playSound === "function") playSound("correct");
          gsapTweenRef.current = gsap.delayedCall(
            SNAP_OVERLAP_DURATION,
            function () {
              setShowImageYellow(false);
              setStaticYellowSnapped(true);
              setMirrorPhase("tapMirror");
              if (onUpdateQuestion) {
                onUpdateQuestion(MIRROR.tapMirrorQuestion);
              }
              if (onNudgeTarget) onNudgeTarget("mirrorReflector");
            }
          );
        },
      });
    },
    [
      killTween,
      snapMirrorX,
      SNAP_OVERLAP_DURATION,
      onUpdateQuestion,
      onNudgeTarget,
      MIRROR.tapMirrorQuestion,
    ]
  );

  var trySnapMirror = useCallback(
    function (x) {
      if (mirrorLockedRef.current) return false;
      if (Math.abs(x - snapMirrorX) <= SNAP_THRESHOLD) {
        snapMirror();
        return true;
      }
      return false;
    },
    [snapMirror, snapMirrorX, SNAP_THRESHOLD]
  );

  var handlePointerMove = useCallback(
    function (e) {
      if (!isDraggingRef.current || mirrorLockedRef.current) return;
      if (e.cancelable) e.preventDefault();
      var clientX = e.clientX;
      var clientY = e.clientY;
      if (e.touches && e.touches[0]) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }
      var pt = getSvgPoint(clientX, clientY);
      var nextX = pt.x - dragOffsetRef.current;
      if (nextX < snapMirrorX) nextX = snapMirrorX;
      if (nextX > REFLECTOR_START_X) nextX = REFLECTOR_START_X;
      setMirrorX(nextX);
      mirrorXRef.current = nextX;
      trySnapMirror(nextX);
    },
    [getSvgPoint, snapMirrorX, REFLECTOR_START_X, trySnapMirror]
  );

  var handlePointerUp = useCallback(
    function () {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      setIsDragging(false);
      if (mirrorLockedRef.current) return;

      if (!trySnapMirror(mirrorXRef.current)) {
        var reflected = reflectPointsAcrossX(leftPoints, mirrorXRef.current);
        if (!isReflectionInViewbox(reflected)) {
          setShowFeedback(true);
        }
      }
    },
    [
      trySnapMirror,
      reflectPointsAcrossX,
      leftPoints,
      isReflectionInViewbox,
    ]
  );

  var handleReflectorPointerDown = useCallback(
    function (e) {
      if (mirrorPhaseRef.current !== "drag") return;
      if (mirrorLockedRef.current) return;
      if (e.cancelable) e.preventDefault();
      setShowFeedback(false);
      setHasDragStarted(true);
      isDraggingRef.current = true;
      setIsDragging(true);
      if (onNudgeDismiss) onNudgeDismiss();
      var clientX = e.clientX;
      var clientY = e.clientY;
      if (e.touches && e.touches[0]) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }
      var pt = getSvgPoint(clientX, clientY);
      dragOffsetRef.current = pt.x - mirrorXRef.current;
      if (typeof playSound === "function") playSound("click");
    },
    [getSvgPoint, onNudgeDismiss]
  );

  var handleReflectorTouchStart = useCallback(
    function (e) {
      if (!e.touches || !e.touches[0]) return;
      handleReflectorPointerDown(e);
    },
    [handleReflectorPointerDown]
  );

  var handleReflectorTap = useCallback(
    function () {
      if (mirrorPhaseRef.current !== "tapMirror") return;
      if (typeof playSound === "function") playSound("click");
      if (onNudgeDismiss) onNudgeDismiss();
      setShowStaticYellow(false);
      setShowReflector(false);
      setShowMirrorLine(true);
      setShowInitialFlipGroup(true);
      setShowFlipExtras(true);
      setMirrorPhase("flipReady");
      if (onUpdateQuestion) onUpdateQuestion(MIRROR.flipQuestion);
      if (onNudgeTarget) onNudgeTarget("mirrorLine");
    },
    [onNudgeDismiss, onUpdateQuestion, onNudgeTarget, MIRROR.flipQuestion]
  );

  var handleMirrorLineTap = useCallback(
    function () {
      if (mirrorPhaseRef.current !== "flipReady") return;
      if (typeof playSound === "function") playSound("click");
      if (onNudgeDismiss) onNudgeDismiss();
      runInitialFlip(function () {
        if (onUpdateQuestion) onUpdateQuestion(MIRROR.summaryQuestion);
        showSummaryPanel(MIRROR.summary, MIRROR.revealButton, true);
      });
    },
    [
      onNudgeDismiss,
      runInitialFlip,
      onUpdateQuestion,
      showSummaryPanel,
      MIRROR,
    ]
  );

  var handleReplay = useCallback(
    function () {
      if (typeof playSound === "function") playSound("click");
      setShowReplayBtn(false);

      if (
        mirrorPhaseRef.current === "flipped" ||
        mirrorPhaseRef.current === "flipping"
      ) {
        runInitialFlip(function () {
          setShowReplayBtn(true);
        });
        return;
      }

      if (
        mirrorPhaseRef.current === "revealDone" ||
        mirrorPhaseRef.current === "revealFlipping"
      ) {
        resetRevealVisuals();
        runRevealSequence(function () {
          setShowReplayBtn(true);
        });
      }
    },
    [runInitialFlip, resetRevealVisuals, runRevealSequence]
  );

  var handleRevealClick = useCallback(
    function () {
      if (typeof playSound === "function") playSound("click");
      if (onNudgeDismiss) onNudgeDismiss();

      if (mirrorPhaseRef.current === "flipped") {
        setSummaryVisible(false);
        setShowRevealBtn(false);
        setShowReplayBtn(false);
        setTimeout(function () {
          setShowSummary(false);
          beginRevealFlow();
        }, 450);
        return;
      }

      if (mirrorPhaseRef.current === "revealDone") {
        setSummaryVisible(false);
        setShowRevealBtn(false);
        setShowReplayBtn(false);
        setTimeout(function () {
          setShowSummary(false);
          setShowRevealGroup(false);
          setShowFReference(false);
          resetRevealVisuals();
          setActiveSummary(MIRROR.fullSummary);
          setDefinitionTyped("");
          if (onUpdateQuestion) onUpdateQuestion(MIRROR.summaryQuestion);
          setShowBlueBox(true);
          runPaperFinalFlip(function () {
            setShowSummary(true);
            setSummaryVisible(false);
            requestAnimationFrame(function () {
              requestAnimationFrame(function () {
                setSummaryVisible(true);
              });
            });
          });
        }, 450);
      }
    },
    [
      onNudgeDismiss,
      beginRevealFlow,
      resetRevealVisuals,
      runPaperFinalFlip,
      onUpdateQuestion,
      MIRROR,
    ]
  );

  var startDefinitionTyping = useCallback(
    function (onComplete) {
      var full = MIRROR.definitionTyping;
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
    [MIRROR.definitionTyping]
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
      if (onUpdateQuestion) onUpdateQuestion(MIRROR.questionTranslation);
    },
    [onNudgeDismiss, onUpdateQuestion, MIRROR.questionTranslation]
  );

  var handleTextLayoverClose = useCallback(
    function () {
      setTextLayoverVisible(false);
      setTimeout(function () {
        setShowTextLayover(false);
        setMirrorPhase("definition");
        setShowSummary(true);
        setSummaryVisible(true);
        setDefinitionTyped("");
        startDefinitionTyping(function () {
          if (onMirrorFlowComplete) onMirrorFlowComplete();
        });
      }, 450);
    },
    [startDefinitionTyping, onMirrorFlowComplete]
  );

  useEffect(
    function () {
      if (onUpdateQuestion) onUpdateQuestion(MIRROR.dragQuestion);

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
          duration: PATH_CONFIG.introPaper.enterDuration || 0.85,
          ease: "power2.out",
          onUpdate: function () {
            setPaperOffset({ x: proxy.x, y: proxy.y, scale: proxy.s });
          },
          onComplete: function () {
            setMirrorPhase("drag");
          },
        });
      } else {
        setPaperOffset(LEFT_PAPER);
        gsapTweenRef.current = gsap.delayedCall(0.01, function () {
          setMirrorPhase("drag");
        });
      }

      return killTween;
    },
    [fromStep1, killTween, onUpdateQuestion, MIRROR.dragQuestion]
  );

  useEffect(
    function () {
      if (mirrorPhase !== "drag") return;
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
      window.addEventListener("pointercancel", handlePointerUp);
      window.addEventListener("touchmove", handlePointerMove, { passive: false });
      window.addEventListener("touchend", handlePointerUp);
      window.addEventListener("touchcancel", handlePointerUp);
      return function () {
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", handlePointerUp);
        window.removeEventListener("pointercancel", handlePointerUp);
        window.removeEventListener("touchmove", handlePointerMove);
        window.removeEventListener("touchend", handlePointerUp);
        window.removeEventListener("touchcancel", handlePointerUp);
      };
    },
    [mirrorPhase, handlePointerMove, handlePointerUp]
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
        onNudgeTarget("mirrorReveal");
      }
    },
    [showRevealBtn, showBlueBox, onNudgeTarget]
  );

  var paperScale = paperOffset.scale || SHAPE_SCALE;
  var paperW = PAPER_WIDTH * (paperScale / SHAPE_SCALE);
  var paperH = SHAPE_HEIGHT * (paperScale / SHAPE_SCALE);
  var reflectorY = blueCentroid.y - REFLECTOR_HEIGHT / 2;
  var reflectorCenterY = reflectorY + REFLECTOR_HEIGHT / 2;
  var reflectorImageX = mirrorX - REFLECTOR_WIDTH / 2;
  var mirrorLineTop = reflectorY;
  var mirrorLineBottom = reflectorY + REFLECTOR_HEIGHT;
  var fLineY = leftPoints.F.y;
  var hReflectX = 2 * mirrorX - leftPoints.H.x;
  var fLineLeft = leftPoints.H.x - F_LINE_EXT;
  var fLineRight = hReflectX + F_LINE_EXT;
  var currentSummary = activeSummary || MIRROR.summary;

  var renderPaperImage = function () {
    return React.createElement("image", {
      href: "assets/paper.png",
      x: paperOffset.x,
      y: paperOffset.y,
      width: paperW,
      height: paperH,
      className: "paper-image",
      style: { pointerEvents: "none" },
    });
  };

  var renderGuideLines = function () {
    return GUIDE_LINE_KEYS.map(function (key) {
      var pt = leftPoints[key];
      return React.createElement("line", {
        key: "guide-" + key,
        className: "mirror-guide-line",
        x1: pt.x,
        y1: pt.y,
        x2: mirrorX,
        y2: pt.y,
        stroke: "#9e9e9e",
        strokeWidth: 6,
        strokeLinecap: "round",
      });
    });
  };

  var renderBluePoint = function (key) {
    if (!visibleRevealPoints[key]) return null;
    var pt = leftPoints[key];
    return React.createElement(
      "g",
      { key: "reveal-pt-" + key, className: "mirror-reveal-point" },
      React.createElement("circle", {
        cx: pt.x,
        cy: pt.y,
        r: 14,
        fill: "white",
      }),
      React.createElement("circle", {
        cx: pt.x,
        cy: pt.y,
        r: 8,
        fill: "#4fc3f7",
      })
    );
  };

  var renderDistanceRect = function (key) {
    var progress = rectProgress[key] || 0;
    if (progress <= 0) return null;
    var pt = leftPoints[key];
    var fullWidth = mirrorX - pt.x;
    if (fullWidth <= 0) return null;
    var width = fullWidth * progress;
    return React.createElement("rect", {
      key: "dist-rect-" + key,
      className: "mirror-distance-rect",
      x: mirrorX - width,
      y: pt.y - DIST_RECT_H / 2,
      width: width,
      height: DIST_RECT_H,
      rx: DIST_RECT_R,
      ry: DIST_RECT_R,
      fill: "white",
      fillOpacity: 0.25,
    });
  };

  var renderFReference = function () {
    if (!showFReference) return null;
    var corner = 22;
    return React.createElement(
      "g",
      { className: "mirror-f-reference" },
      React.createElement("line", {
        className: "mirror-f-line",
        x1: fLineLeft,
        y1: fLineY,
        x2: fLineRight,
        y2: fLineY,
        stroke: "white",
        strokeWidth: 2,
        strokeDasharray: "6 6",
        strokeLinecap: "round",
      }),
      React.createElement("path", {
        className: "mirror-right-angle",
        d:
          "M " +
          mirrorX +
          "," +
          fLineY +
          " L " +
          (mirrorX - corner) +
          "," +
          fLineY +
          " L " +
          (mirrorX - corner) +
          "," +
          (fLineY - corner) +
          " L " +
          mirrorX +
          "," +
          (fLineY - corner),
        fill: "none",
        stroke: "white",
        strokeWidth: 2,
        strokeDasharray: "5 5",
      })
    );
  };

  var renderRevealGroup = function () {
    if (!showRevealGroup) return null;
    return React.createElement(
      "g",
      {
        className: "mirror-reveal-flip-group",
        transform: getFlipTransform(revealFlipScaleX, mirrorX),
      },
      REVEAL_TRACK_KEYS.map(renderDistanceRect),
      showRevealYellow &&
        React.createElement("path", {
          className: "mirror-reveal-yellow-path",
          d: pointsToPath(leftPoints),
          fill: "#ffc107",
          fillOpacity: 0.3,
          stroke: "#ffc107",
          strokeWidth: 5,
          strokeDasharray: "10 6",
        }),
      REVEAL_TRACK_KEYS.map(renderBluePoint)
    );
  };

  var renderSummaryContent = function () {
    if (definitionTyped) {
      return React.createElement("div", {
        className: "mirror-summary-box__typing",
        dangerouslySetInnerHTML: { __html: definitionTyped },
      });
    }
    return createSummaryElement(currentSummary);
  };

  return React.createElement(
    "div",
    { className: "mirror-canvas-container" },
    mirrorPhase === "tapMirror" &&
      reflectorRef &&
      React.createElement("div", {
        ref: reflectorRef,
        className: "nudge-anchor",
        style: {
          position: "absolute",
          left: (mirrorX / SVG_WIDTH) * 100 + "%",
          top: (mirrorLineBottom / SVG_HEIGHT) * 100 + "%",
          width: 0,
          height: 0,
          pointerEvents: "none",
        },
      }),
    showMirrorLine &&
      mirrorPhase === "flipReady" &&
      mirrorLineRef &&
      React.createElement("div", {
        ref: mirrorLineRef,
        className: "nudge-anchor",
        style: {
          position: "absolute",
          left: (mirrorX / SVG_WIDTH) * 100 + "%",
          top: (mirrorLineBottom / SVG_HEIGHT) * 100 + "%",
          width: 0,
          height: 0,
          pointerEvents: "none",
        },
      }),
    React.createElement(
      "div",
      {
        className:
          "mirror-feedback" + (showFeedback ? " mirror-feedback--visible" : ""),
      },
      MIRROR.dragFeedback
    ),
    mirrorPhase === "drag" &&
      !hasDragStarted &&
      !mirrorLocked &&
      React.createElement("img", {
        src: "assets/tap.png",
        alt: "",
        className: "mirror-drag-hint",
        style: {
          top: (reflectorCenterY / SVG_HEIGHT) * 100 + "%",
          left: (mirrorX / SVG_WIDTH) * 100 + "%",
        },
      }),
    showSummary &&
      React.createElement(
        "div",
        {
          className:
            "mirror-summary-stack" +
            (summaryVisible ? " mirror-summary-stack--visible" : ""),
        },
        React.createElement(
          "div",
          { className: "mirror-summary-box" },
          renderSummaryContent()
        ),
        showRevealBtn &&
          React.createElement(
            "button",
            {
              ref: revealBtnRef,
              className: "mirror-reveal-btn",
              onClick: handleRevealClick,
            },
            revealBtnLabel || MIRROR.revealButton
          ),
        showBlueBox &&
          React.createElement("div", {
            ref: blueBoxRef,
            className: "blue-box mirror-blue-box",
            onClick: handleBlueBoxClick,
            dangerouslySetInnerHTML: { __html: MIRROR.blueBox },
          })
      ),
    React.createElement(
      "button",
      {
        className:
          "mirror-replay-btn" +
          (showReplayBtn ? " mirror-replay-btn--visible" : ""),
        onClick: handleReplay,
      },
      MIRROR.replayButton
    ),
    showTextLayover &&
      React.createElement(TextLayover, {
        visible: textLayoverVisible,
        body: MIRROR.textLayover.body,
        footer: MIRROR.textLayover.footer,
        onClose: handleTextLayoverClose,
      }),
    React.createElement(
      "svg",
      {
        ref: svgRef,
        viewBox: "0 0 " + SVG_WIDTH + " " + SVG_HEIGHT,
        className: "main-svg mirror-main-svg",
        preserveAspectRatio: "xMidYMid meet",
      },
      React.createElement("path", {
        className: "mirror-path-blue path-left",
        d: pointsToPath(leftPoints),
        fill: "#4fc3f7",
        fillOpacity: 0.3,
        stroke: "#4fc3f7",
        strokeWidth: 5,
        strokeDasharray: "10 6",
      }),
      showStaticYellow &&
        React.createElement("path", {
          className:
            "mirror-path-yellow-static" +
            (staticYellowSnapped ? " mirror-path-yellow-static--snapped" : ""),
          d: pointsToPath(staticYellowPoints),
          fill: "#ffc107",
          fillOpacity: staticYellowSnapped ? 0.6 : 0.3,
          stroke: "#ffc107",
          strokeWidth: 5,
          strokeDasharray: staticYellowSnapped ? undefined : "10 6",
        }),
      showImageYellow &&
        React.createElement("path", {
          className: "mirror-path-yellow-image",
          d: pointsToPath(imageYellowPoints),
          fill: "#ffc107",
          fillOpacity: 0.3,
          stroke: "#ffc107",
          strokeWidth: 5,
          strokeDasharray: "10 6",
        }),
      showInitialFlipGroup &&
        React.createElement(
          "g",
          {
            className: "mirror-flip-group",
            transform: getFlipTransform(flipScaleX, mirrorX),
          },
          showFlipExtras &&
            React.createElement("rect", {
              className: "mirror-surround-rect",
              x: surroundBounds.x,
              y: surroundBounds.y,
              width: surroundBounds.width,
              height: surroundBounds.height,
              rx: SURROUND_RADIUS,
              ry: SURROUND_RADIUS,
              fill: "black",
              fillOpacity: 0.2,
            }),
          showFlipExtras && renderGuideLines(),
          renderPaperImage()
        ),
      !showInitialFlipGroup &&
        paperFlipScaleX === 1 &&
        renderPaperImage(),
      !showInitialFlipGroup &&
        paperFlipScaleX !== 1 &&
        React.createElement(
          "g",
          {
            className: "mirror-paper-flip-group",
            transform: getFlipTransform(paperFlipScaleX, mirrorX),
          },
          renderPaperImage()
        ),
      renderFReference(),
      renderRevealGroup(),
      showMirrorLine &&
        React.createElement(
          "g",
          { className: "mirror-reflector-line-group" },
          React.createElement("line", {
            className: "mirror-reflector-line",
            x1: mirrorX,
            y1: mirrorLineTop,
            x2: mirrorX,
            y2: mirrorLineBottom,
            stroke: "white",
            strokeWidth: 7,
            strokeDasharray: "14 10",
            strokeLinecap: "round",
          }),
          mirrorPhase === "flipReady" &&
            React.createElement("line", {
              className: "mirror-reflector-line-hit",
              x1: mirrorX,
              y1: mirrorLineTop,
              x2: mirrorX,
              y2: mirrorLineBottom,
              stroke: "transparent",
              strokeWidth: 48,
              onClick: handleMirrorLineTap,
            })
        ),
      showReflector &&
        React.createElement("image", {
          href: "assets/reflector.png",
          x: reflectorImageX,
          y: reflectorY,
          width: REFLECTOR_WIDTH,
          height: REFLECTOR_HEIGHT,
          preserveAspectRatio: "xMidYMid meet",
          className:
            "mirror-reflector" +
            (isDragging ? " mirror-reflector--dragging" : "") +
            (mirrorPhase === "tapMirror"
              ? " mirror-reflector--tappable"
              : mirrorLocked
                ? " mirror-reflector--locked"
                : ""),
          style: {
            pointerEvents:
              mirrorPhase === "drag" || mirrorPhase === "tapMirror"
                ? "all"
                : "none",
          },
          onPointerDown:
            mirrorPhase === "drag" ? handleReflectorPointerDown : undefined,
          onTouchStart:
            mirrorPhase === "drag" ? handleReflectorTouchStart : undefined,
          onClick: mirrorPhase === "tapMirror" ? handleReflectorTap : undefined,
        })
    )
  );
};
