const ZoomCanvas = function (props) {
  var onUpdateQuestion = props.onUpdateQuestion;
  var onNudgeTarget = props.onNudgeTarget;
  var onNudgeDismiss = props.onNudgeDismiss;
  var onZoomFlowComplete = props.onZoomFlowComplete;
  var revealBtnRef = props.revealBtnRef;
  var paperAnchorRef = props.paperAnchorRef;
  var blueBoxRef = props.blueBoxRef;
  var fromStep1 = props.fromStep1;

  var useState = React.useState;
  var useEffect = React.useEffect;
  var useRef = React.useRef;
  var useCallback = React.useCallback;

  var ZOOM = APP_DATA.zoom;
  var ZOOM_CFG = PATH_CONFIG.zoom;
  var SVG_WIDTH = 2000;
  var SVG_HEIGHT = 845;
  var BASE_POINTS = PATH_CONFIG.basePoints;
  var POINT_ORDER = PATH_CONFIG.pointOrder;
  var MATH_Y_MAX = PATH_CONFIG.mathYMax;
  var SHAPE_HEIGHT = PATH_CONFIG.shapeHeight;
  var SHAPE_SCALE = SHAPE_HEIGHT / MATH_Y_MAX;
  var PAPER_WIDTH = 20 * SHAPE_SCALE;
  var LEFT_OFFSET = PATH_CONFIG.leftOffset;
  var ANCHOR_KEY = ZOOM_CFG.anchorPoint;
  var SCALE_MIN = ZOOM_CFG.scaleMin;
  var SCALE_MAX = ZOOM_CFG.scaleMax;
  var SLIDER_MARKERS = ZOOM_CFG.sliderMarkers;
  var SNAP_THRESHOLD = ZOOM_CFG.snapThreshold;
  var TRACK_KEYS = ZOOM_CFG.revealTrackPoints;
  var SCALE_HIGH = ZOOM_CFG.summaryScaleHigh;
  var SCALE_LOW = ZOOM_CFG.summaryScaleLow;

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

  var zoomPhaseState = useState(fromStep1 ? "enter" : "enterFromMove");
  var zoomPhase = zoomPhaseState[0];
  var setZoomPhase = zoomPhaseState[1];

  var paperOffsetState = useState(LEFT_PAPER);
  var paperOffset = paperOffsetState[0];
  var setPaperOffset = paperOffsetState[1];

  var paperScaleState = useState(ZOOM_CFG.scaleDefault);
  var paperScale = paperScaleState[0];
  var setPaperScale = paperScaleState[1];

  var showAnchorState = useState(false);
  var showAnchor = showAnchorState[0];
  var setShowAnchor = showAnchorState[1];

  var showSliderState = useState(false);
  var showSlider = showSliderState[0];
  var setShowSlider = showSliderState[1];

  var hasSliderDragStartedState = useState(false);
  var hasSliderDragStarted = hasSliderDragStartedState[0];
  var setHasSliderDragStarted = hasSliderDragStartedState[1];

  var markerIndexState = useState(0);
  var markerIndex = markerIndexState[0];
  var setMarkerIndex = markerIndexState[1];

  var visitedMarkersState = useState([]);
  var visitedMarkers = visitedMarkersState[0];
  var setVisitedMarkers = visitedMarkersState[1];

  var showSummaryState = useState(false);
  var showSummary = showSummaryState[0];
  var setShowSummary = showSummaryState[1];

  var summaryVisibleState = useState(false);
  var summaryVisible = summaryVisibleState[0];
  var setSummaryVisible = summaryVisibleState[1];

  var activeSummaryState = useState(null);
  var activeSummary = activeSummaryState[0];
  var setActiveSummary = activeSummaryState[1];

  var showRevealBtnState = useState(false);
  var showRevealBtn = showRevealBtnState[0];
  var setShowRevealBtn = showRevealBtnState[1];

  var revealBtnLabelState = useState("");
  var revealBtnLabel = revealBtnLabelState[0];
  var setRevealBtnLabel = revealBtnLabelState[1];

  var showReplayBtnState = useState(false);
  var showReplayBtn = showReplayBtnState[0];
  var setShowReplayBtn = showReplayBtnState[1];

  var showRevealDemoState = useState(false);
  var showRevealDemo = showRevealDemoState[0];
  var setShowRevealDemo = showRevealDemoState[1];

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
  var paperScaleRef = useRef(ZOOM_CFG.scaleDefault);
  var zoomPhaseRef = useRef(zoomPhase);
  var markerIndexRef = useRef(0);
  var visitedMarkersRef = useRef([]);

  paperScaleRef.current = paperScale;
  zoomPhaseRef.current = zoomPhase;
  markerIndexRef.current = markerIndex;
  visitedMarkersRef.current = visitedMarkers;

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

  var scalePointAround = useCallback(function (p, anchor, scale) {
    return {
      x: anchor.x + (p.x - anchor.x) * scale,
      y: anchor.y + (p.y - anchor.y) * scale,
    };
  }, []);

  var scaleToPercent = useCallback(
    function (scale) {
      return ((scale - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * 100;
    },
    [SCALE_MIN, SCALE_MAX]
  );

  var leftPoints = getPathPoints(LEFT_OFFSET);
  var anchorA = leftPoints[ANCHOR_KEY];
  var shapeCentroid = (function () {
    var sx = 0;
    var sy = 0;
    POINT_ORDER.forEach(function (key) {
      sx += leftPoints[key].x;
      sy += leftPoints[key].y;
    });
    return { x: sx / POINT_ORDER.length, y: sy / POINT_ORDER.length };
  })();

  var animateScale = useCallback(
    function (toScale, duration, onComplete) {
      killTween();
      var proxy = { s: paperScaleRef.current };
      gsapTweenRef.current = gsap.to(proxy, {
        s: toScale,
        duration: duration,
        ease: "power2.inOut",
        onUpdate: function () {
          setPaperScale(proxy.s);
          paperScaleRef.current = proxy.s;
        },
        onComplete: onComplete || null,
      });
    },
    [killTween]
  );

  var runPingPongScale = useCallback(
    function (onComplete) {
      setPaperScale(SCALE_HIGH);
      paperScaleRef.current = SCALE_HIGH;
      animateScale(SCALE_LOW, ZOOM_CFG.pingPongDuration, function () {
        gsapTweenRef.current = gsap.delayedCall(
          ZOOM_CFG.pingPongPause || 0.5,
          function () {
            animateScale(SCALE_HIGH, ZOOM_CFG.pingPongDuration, function () {
              if (onComplete) onComplete();
            });
          }
        );
      });
    },
    [
      animateScale,
      SCALE_HIGH,
      SCALE_LOW,
      ZOOM_CFG.pingPongDuration,
      ZOOM_CFG.pingPongPause,
    ]
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

  var finishSliderPhase = useCallback(
    function () {
      setShowSlider(false);
      setZoomPhase("summary");
      setPaperScale(SCALE_HIGH);
      paperScaleRef.current = SCALE_HIGH;
      setActiveSummary(ZOOM.summary);
      if (onUpdateQuestion) onUpdateQuestion(ZOOM.summaryQuestion);
      setShowSummary(true);
      setSummaryVisible(false);
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          setSummaryVisible(true);
          setShowRevealBtn(false);
          setShowReplayBtn(false);
          runPingPongScale(function () {
            setShowReplayBtn(true);
            setShowRevealBtn(true);
            setRevealBtnLabel(ZOOM.revealButton);
          });
        });
      });
    },
    [SCALE_HIGH, ZOOM, onUpdateQuestion, runPingPongScale]
  );

  var runRevealDemoAnim = useCallback(
    function (onComplete) {
      killTween();
      setShowRevealDemo(true);

      var proxy = { s: paperScaleRef.current };
      gsapTweenRef.current = gsap
        .timeline({ onComplete: onComplete || null })
        .to(proxy, {
          s: SCALE_HIGH,
          duration: ZOOM_CFG.revealAnimDuration,
          ease: "power2.inOut",
          onUpdate: function () {
            setPaperScale(proxy.s);
            paperScaleRef.current = proxy.s;
          },
        })
        .to(proxy, {
          s: SCALE_HIGH,
          duration: ZOOM_CFG.revealAnimPause || 0.5,
          onUpdate: function () {
            setPaperScale(proxy.s);
            paperScaleRef.current = proxy.s;
          },
        })
        .to(proxy, {
          s: SCALE_LOW,
          duration: ZOOM_CFG.revealAnimDuration,
          ease: "power2.inOut",
          onUpdate: function () {
            setPaperScale(proxy.s);
            paperScaleRef.current = proxy.s;
          },
        });
    },
    [
      killTween,
      SCALE_HIGH,
      SCALE_LOW,
      ZOOM_CFG.revealAnimDuration,
      ZOOM_CFG.revealAnimPause,
    ]
  );

  var animateScaleToOneThenReveal = useCallback(
    function (onComplete) {
      setShowRevealDemo(false);
      animateScale(1, ZOOM_CFG.scaleToOneDuration, function () {
        runRevealDemoAnim(onComplete);
      });
    },
    [animateScale, runRevealDemoAnim, ZOOM_CFG.scaleToOneDuration]
  );

  var startDefinitionTyping = useCallback(
    function (onComplete) {
      var full = ZOOM.definitionTyping;
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
    [ZOOM.definitionTyping]
  );

  useEffect(
    function () {
      if (onUpdateQuestion) onUpdateQuestion(ZOOM.tapQuestion);

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
            setZoomPhase("tap");
          },
        });
      } else {
        setPaperOffset(LEFT_PAPER);
        gsapTweenRef.current = gsap.delayedCall(0.01, function () {
          setZoomPhase("tap");
        });
      }

      return killTween;
    },
    [fromStep1, killTween, onUpdateQuestion, ZOOM.tapQuestion]
  );

  useEffect(
    function () {
      if (zoomPhase === "tap" && onNudgeTarget) {
        onNudgeTarget("zoomPaper");
      } else if (showBlueBox && onNudgeTarget) {
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            onNudgeTarget("blue");
          });
        });
      } else if (showRevealBtn && onNudgeTarget) {
        onNudgeTarget("zoomReveal");
      }
    },
    [zoomPhase, showBlueBox, showRevealBtn, onNudgeTarget]
  );

  var handlePaperTap = useCallback(
    function () {
      if (zoomPhase !== "tap") return;
      if (typeof playSound === "function") playSound("click");
      if (onNudgeDismiss) onNudgeDismiss();
      setShowAnchor(true);
      setShowSlider(true);
      setHasSliderDragStarted(false);
      setZoomPhase("slider");
      setPaperScale(ZOOM_CFG.scaleDefault);
      paperScaleRef.current = ZOOM_CFG.scaleDefault;
      setMarkerIndex(0);
      markerIndexRef.current = 0;
      setVisitedMarkers([]);
      visitedMarkersRef.current = [];
      if (onUpdateQuestion) onUpdateQuestion(ZOOM.sliderQuestion);
    },
    [zoomPhase, onNudgeDismiss, onUpdateQuestion, ZOOM.sliderQuestion, ZOOM_CFG.scaleDefault]
  );

  var handleSliderChange = useCallback(
    function (e) {
      if (zoomPhaseRef.current !== "slider") return;
      setHasSliderDragStarted(true);
      var val = parseFloat(e.target.value);
      var idx = markerIndexRef.current;
      var target = SLIDER_MARKERS[idx];
      if (
        target !== undefined &&
        Math.abs(val - target) <= SNAP_THRESHOLD &&
        visitedMarkersRef.current.indexOf(target) === -1
      ) {
        if (typeof playSound === "function") playSound("correct");
        val = target;
        var newVisited = visitedMarkersRef.current.concat([target]);
        visitedMarkersRef.current = newVisited;
        setVisitedMarkers(newVisited);
        var nextIdx = idx + 1;
        if (nextIdx >= SLIDER_MARKERS.length) {
          if (onNudgeDismiss) onNudgeDismiss();
          setTimeout(finishSliderPhase, 400);
        } else {
          setMarkerIndex(nextIdx);
          markerIndexRef.current = nextIdx;
        }
      }
      setPaperScale(val);
      paperScaleRef.current = val;
    },
    [SLIDER_MARKERS, SNAP_THRESHOLD, finishSliderPhase, onNudgeDismiss]
  );

  var handleReplay = useCallback(
    function () {
      if (typeof playSound === "function") playSound("click");
      setShowReplayBtn(false);
      if (zoomPhase === "summary") {
        runPingPongScale(function () {
          setShowReplayBtn(true);
        });
      } else if (zoomPhase === "revealSummary") {
        animateScaleToOneThenReveal(function () {
          setShowReplayBtn(true);
        });
      }
    },
    [zoomPhase, runPingPongScale, animateScaleToOneThenReveal]
  );

  var handleRevealClick = useCallback(
    function () {
      if (typeof playSound === "function") playSound("click");
      if (onNudgeDismiss) onNudgeDismiss();

      if (zoomPhase === "summary") {
        setSummaryVisible(false);
        setShowRevealBtn(false);
        setShowReplayBtn(false);
        setTimeout(function () {
          setShowSummary(false);
          setZoomPhase("revealAnim");
          animateScaleToOneThenReveal(function () {
            setZoomPhase("revealSummary");
            showSummaryPanel(
              ZOOM.revealSummary,
              ZOOM.summarizeButton,
              true
            );
          });
        }, 450);
        return;
      }

      if (zoomPhase === "revealSummary") {
        setSummaryVisible(false);
        setShowRevealBtn(false);
        setShowReplayBtn(false);
        setTimeout(function () {
          setShowSummary(false);
          setZoomPhase("fullSummary");
          setActiveSummary(ZOOM.fullSummary);
          setDefinitionTyped("");
          if (onUpdateQuestion) onUpdateQuestion(ZOOM.summaryQuestion);
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
      zoomPhase,
      onNudgeDismiss,
      animateScaleToOneThenReveal,
      showSummaryPanel,
      onUpdateQuestion,
      ZOOM,
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
      if (onUpdateQuestion) onUpdateQuestion(ZOOM.questionTranslation);
    },
    [onNudgeDismiss, onUpdateQuestion, ZOOM.questionTranslation]
  );

  var handleTextLayoverClose = useCallback(
    function () {
      setTextLayoverVisible(false);
      setTimeout(function () {
        setShowTextLayover(false);
        setZoomPhase("definition");
        setShowSummary(true);
        setSummaryVisible(true);
        setDefinitionTyped("");
        startDefinitionTyping(function () {
          if (onZoomFlowComplete) onZoomFlowComplete();
        });
      }, 450);
    },
    [startDefinitionTyping, onZoomFlowComplete]
  );

  var computeArrowheadPoints = function (tipX, tipY, angleRad, size, halfWidth) {
    var baseX = tipX - size * Math.cos(angleRad);
    var baseY = tipY - size * Math.sin(angleRad);
    var p2x = baseX + halfWidth * Math.cos(angleRad + Math.PI / 2);
    var p2y = baseY + halfWidth * Math.sin(angleRad + Math.PI / 2);
    var p3x = baseX - halfWidth * Math.cos(angleRad + Math.PI / 2);
    var p3y = baseY - halfWidth * Math.sin(angleRad + Math.PI / 2);
    return tipX + "," + tipY + " " + p2x + "," + p2y + " " + p3x + "," + p3y;
  };

  var renderBlueArrow = function (x1, y1, x2, y2, key) {
    var dx = x2 - x1;
    var dy = y2 - y1;
    var len = Math.hypot(dx, dy);
    if (len < 4) return null;
    var angleRad = Math.atan2(dy, dx);
    var headLen = 14;
    var lineRatio = Math.max(0, (len - headLen) / len);
    var lineX2 = x1 + dx * lineRatio;
    var lineY2 = y1 + dy * lineRatio;
    return React.createElement(
      "g",
      { key: "zoom-arrow-" + key, className: "zoom-dilation-arrow" },
      React.createElement("line", {
        x1: x1,
        y1: y1,
        x2: lineX2,
        y2: lineY2,
        stroke: "#4fc3f7",
        strokeWidth: 5,
        strokeLinecap: "round",
      }),
      React.createElement("polygon", {
        points: computeArrowheadPoints(x2, y2, angleRad, 14, 8),
        fill: "#4fc3f7",
      })
    );
  };

  var renderMarkerPoint = function (x, y, fill, key) {
    return React.createElement(
      "g",
      { key: key, className: "zoom-track-point" },
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

  var renderAnchor = function () {
    if (!showAnchor) return null;
    return React.createElement(
      "g",
      { className: "zoom-anchor-point" },
      React.createElement("line", {
        x1: anchorA.x - 18,
        y1: anchorA.y,
        x2: anchorA.x + 18,
        y2: anchorA.y,
        stroke: "white",
        strokeWidth: 2,
      }),
      React.createElement("line", {
        x1: anchorA.x,
        y1: anchorA.y - 18,
        x2: anchorA.x,
        y2: anchorA.y + 18,
        stroke: "white",
        strokeWidth: 2,
      }),
      React.createElement("circle", {
        cx: anchorA.x,
        cy: anchorA.y,
        r: 10,
        fill: "#e53935",
        stroke: "white",
        strokeWidth: 2,
      })
    );
  };

  var paperW = PAPER_WIDTH;
  var paperH = SHAPE_HEIGHT;
  var needsDilation =
    zoomPhase !== "enter" &&
    zoomPhase !== "enterFromMove" &&
    zoomPhase !== "tap";
  var displayPaperScale = paperOffset.scale || SHAPE_SCALE;
  var displayPaperW = PAPER_WIDTH * (displayPaperScale / SHAPE_SCALE);
  var displayPaperH = SHAPE_HEIGHT * (displayPaperScale / SHAPE_SCALE);
  var displayPaperX = needsDilation ? LEFT_PAPER.x : paperOffset.x;
  var displayPaperY = needsDilation ? LEFT_PAPER.y : paperOffset.y;
  var currentSummary = activeSummary || ZOOM.summary;
  var handleLeft = scaleToPercent(paperScale);
  var currentSliderTarget = SLIDER_MARKERS[markerIndex];

  var renderRevealOverlay = function () {
    if (!showRevealDemo) return null;
    var scale = paperScale;
    var radialLines = TRACK_KEYS.map(function (key) {
      var blue = leftPoints[key];
      return React.createElement("line", {
        key: "radial-" + key,
        className: "zoom-radial-line",
        x1: anchorA.x,
        y1: anchorA.y,
        x2: blue.x,
        y2: blue.y,
        stroke: "#e53935",
        strokeWidth: 6,
        strokeDasharray: "10 8",
      });
    });
    var bluePts = TRACK_KEYS.map(function (key) {
      return renderMarkerPoint(
        leftPoints[key].x,
        leftPoints[key].y,
        "#4fc3f7",
        "blue-" + key
      );
    });
    var yellowPts = TRACK_KEYS.map(function (key) {
      var blue = leftPoints[key];
      var yellow = scalePointAround(blue, anchorA, scale);
      return renderMarkerPoint(yellow.x, yellow.y, "#ffc107", "yellow-" + key);
    });
    var arrows = TRACK_KEYS.map(function (key) {
      var blue = leftPoints[key];
      var yellow = scalePointAround(blue, anchorA, scale);
      return renderBlueArrow(blue.x, blue.y, yellow.x, yellow.y, key);
    });
    return React.createElement(
      "g",
      { className: "zoom-reveal-overlay" },
      radialLines,
      arrows,
      bluePts,
      yellowPts
    );
  };

  return React.createElement(
    "div",
    { className: "zoom-canvas-container" },
    zoomPhase === "tap" &&
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
            "zoom-summary-stack" +
            (summaryVisible ? " zoom-summary-stack--visible" : ""),
        },
        React.createElement(
          "div",
          { className: "zoom-summary-box" },
          definitionTyped
            ? React.createElement("div", {
                className: "zoom-summary-box__typing",
                dangerouslySetInnerHTML: { __html: definitionTyped },
              })
            : createSummaryElement(currentSummary)
        ),
        showRevealBtn &&
          React.createElement(
            "button",
            {
              ref: revealBtnRef,
              className: "zoom-reveal-btn",
              onClick: handleRevealClick,
            },
            revealBtnLabel || ZOOM.revealButton
          ),
        showBlueBox &&
          React.createElement("div", {
            ref: blueBoxRef,
            className: "blue-box zoom-blue-box",
            onClick: handleBlueBoxClick,
            dangerouslySetInnerHTML: { __html: ZOOM.blueBox },
          })
      ),
    React.createElement(
      "button",
      {
        className:
          "zoom-replay-btn" +
          (showReplayBtn ? " zoom-replay-btn--visible" : ""),
        onClick: handleReplay,
      },
      ZOOM.replayButton
    ),
    showTextLayover &&
      React.createElement(TextLayover, {
        visible: textLayoverVisible,
        body: ZOOM.textLayover.body,
        footer: ZOOM.textLayover.footer,
        onClose: handleTextLayoverClose,
      }),
    React.createElement(
      "svg",
      {
        ref: svgRef,
        viewBox: "0 0 " + SVG_WIDTH + " " + SVG_HEIGHT,
        className: "main-svg zoom-main-svg",
        preserveAspectRatio: "xMidYMid meet",
        style: { pointerEvents: "none" },
      },
      React.createElement(
        "g",
        needsDilation
          ? {
              transform:
                "translate(" +
                anchorA.x +
                "," +
                anchorA.y +
                ") scale(" +
                paperScale +
                ") translate(" +
                -anchorA.x +
                "," +
                -anchorA.y +
                ")",
            }
          : null,
        React.createElement("image", {
          href: "assets/paper.png",
          x: needsDilation ? LEFT_PAPER.x : displayPaperX,
          y: needsDilation ? LEFT_PAPER.y : displayPaperY,
          width: needsDilation ? paperW : displayPaperW,
          height: needsDilation ? paperH : displayPaperH,
          className:
            "paper-image" +
            (zoomPhase === "tap" ? " paper-image--tappable" : ""),
          style: { pointerEvents: "none" },
        })
      ),
      React.createElement("path", {
        className: "path-left zoom-path-left",
        d: pointsToPath(leftPoints),
        fill: "#4fc3f7",
        fillOpacity: 0.3,
        stroke: "#4fc3f7",
        strokeWidth: 5,
        strokeDasharray: "10 6",
        style: { pointerEvents: "none" },
      }),
      zoomPhase === "tap" &&
        React.createElement("path", {
          d: pointsToPath(leftPoints),
          fill: "rgba(255,255,255,0.001)",
          stroke: "none",
          style: { cursor: "pointer", pointerEvents: "all" },
          onClick: handlePaperTap,
        }),
      renderRevealOverlay(),
      renderAnchor()
    ),
    showSlider &&
      React.createElement(
        "div",
        { className: "zoom-slider-outer" },
        React.createElement(
          "div",
          { className: "zoom-slider-card" },
          
          React.createElement(
            "div",
            { className: "zoom-slider-wrap" },
            currentSliderTarget !== undefined &&
              React.createElement("div", {
                key: "marker-" + currentSliderTarget,
                className: "zoom-slider-marker",
                style: { left: scaleToPercent(currentSliderTarget) + "%" },
              }),
            React.createElement("div", {
              className: "zoom-slider-track",
            }),
            React.createElement("div", {
              className: "zoom-slider-handle",
              style: { left: handleLeft + "%" },
            }),
            showSlider &&
              !hasSliderDragStarted &&
              React.createElement("img", {
                src: "assets/drag.gif",
                alt: "",
                className: "zoom-slider-drag-hint",
                style: { left: handleLeft + "%" },
              }),
            React.createElement("input", {
              type: "range",
              className: "zoom-slider-input",
              min: SCALE_MIN,
              max: SCALE_MAX,
              step: 0.01,
              value: paperScale,
              onChange: handleSliderChange,
              onInput: handleSliderChange,
              onPointerDown: function () {
                setHasSliderDragStarted(true);
              },
            })
          )
        )
      )
  );
};
