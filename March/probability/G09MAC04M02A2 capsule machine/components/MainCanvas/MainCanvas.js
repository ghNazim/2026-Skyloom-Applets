var MainCanvas = function (props) {
  var useState = React.useState;
  var useRef = React.useRef;
  var useCallback = React.useCallback;
  var useEffect = React.useEffect;

  var mode = props.mode;
  var currentStep = props.currentStep;
  var machineData = props.machineData;
  var problemData = props.problemData;
  var revealedPositions = props.revealedPositions || [1, 5];
  var filledPositions = props.filledPositions || {};
  var onStepComplete = props.onStepComplete;
  var onNavTextChange = props.onNavTextChange;
  var onPositionFilled = props.onPositionFilled;
  var onPositionRevealed = props.onPositionRevealed;

  var phaseState = useState("initial");
  var phase = phaseState[0];
  var setPhase = phaseState[1];

  var wrongPosState = useState([]);
  var wrongPositions = wrongPosState[0];
  var setWrongPositions = wrongPosState[1];

  var animatingState = useState(false);
  var isAnimating = animatingState[0];
  var setIsAnimating = animatingState[1];

  var sparkleState = useState(false);
  var showSparkle = sparkleState[0];
  var setShowSparkle = sparkleState[1];

  var gridBallsState = useState([]);
  var gridBalls = gridBallsState[0];
  var setGridBalls = gridBallsState[1];

  var showServeButtonState = useState(false);
  var showServeButton = showServeButtonState[0];
  var setShowServeButton = showServeButtonState[1];

  var serveCounterState = useState(0);
  var serveCounter = serveCounterState[0];
  var setServeCounter = serveCounterState[1];

  var servingState = useState(false);
  var isServing = servingState[0];
  var setIsServing = servingState[1];

  var svgHtmlState = useState("");
  var capturedSvgHtml = svgHtmlState[0];
  var setCapturedSvgHtml = svgHtmlState[1];

  var machineRef = useRef(null);
  var serveButtonRef = useRef(null);
  var scaleImagesRef = useRef({});
  var correctScaleSlotRef = useRef(null);
  var containerRef = useRef(null);

  var stepData = mode === "serve" ? machineData : problemData;
  var resetKey = stepData
    ? (stepData.correctPosition + "-" + (stepData.tubeColors || []).join(",") + "-" + (mode === "challenge" ? (props.problemIndex || 0) : currentStep))
    : currentStep;

  useEffect(function () {
    setPhase("initial");
    setWrongPositions([]);
    setIsAnimating(false);
    setShowSparkle(false);
    setGridBalls([]);
    setServeCounter(0);
    setIsServing(false);
    setCapturedSvgHtml("");
    setShowServeButton(mode === "serve");
    scaleImagesRef.current = {};
    correctScaleSlotRef.current = null;
  }, [resetKey]);

  var registerImageRef = useCallback(
    function (position, el) {
      if (el) scaleImagesRef.current[position] = el;
      else delete scaleImagesRef.current[position];
      if (mode === "serve" && stepData && position === stepData.correctPosition) {
        correctScaleSlotRef.current = el || null;
      }
    },
    [mode, stepData && stepData.correctPosition]
  );

  var getBallImage = function (code) {
    return "assets/" + code + ".png";
  };

  var handleServe = function () {
    if (!stepData || isServing) return;
    playSound("click");
    setIsServing(true);
    setIsAnimating(true);
    setServeCounter(function (c) { return c + 1; });
  };

  var handleServeStep = function (idx) {
    var serves = stepData.serves;
    setGridBalls(function (prev) {
      var next = prev.slice();
      next.push(serves[idx]);
      return next;
    });
  };

  var handleServesDone = function () {
    setIsServing(false);
    setIsAnimating(false);
    if (mode === "serve") {
      setPhase("served");
      if (onNavTextChange) onNavTextChange(stepData.navAfterServe);
    } else if (mode === "challenge") {
      setPhase("served");
      if (onNavTextChange) onNavTextChange(stepData.afterServeNav);
      if (onStepComplete) onStepComplete();
    }
  };

  var animateMachineToPosition = function (position) {
    var machineEl = machineRef.current;
    var targetWrapper = scaleImagesRef.current[position];
    var container = containerRef.current;

    if (!machineEl || !targetWrapper || !container) {
      finishPlacement();
      return;
    }

    var machineRect = machineEl.getBoundingClientRect();
    var targetImg = targetWrapper.querySelector(".scale-image");
    var targetRect = targetImg
      ? targetImg.getBoundingClientRect()
      : targetWrapper.getBoundingClientRect();

    var svgEl = machineEl.querySelector("svg");
    var svgSnapshot = "";
    var clone;
    if (svgEl) {
      clone = svgEl.cloneNode(true);
      clone.style.position = "fixed";
      clone.style.left = machineRect.left + "px";
      clone.style.top = machineRect.top + "px";
      clone.style.width = machineRect.width + "px";
      clone.style.height = machineRect.height + "px";
      clone.style.zIndex = "10000";
      clone.style.pointerEvents = "none";
      svgSnapshot = svgEl.outerHTML;
    } else {
      clone = document.createElement("div");
      clone.style.position = "fixed";
      clone.style.left = machineRect.left + "px";
      clone.style.top = machineRect.top + "px";
      clone.style.width = machineRect.width + "px";
      clone.style.height = machineRect.height + "px";
      clone.style.zIndex = "10000";
      clone.style.pointerEvents = "none";
      clone.style.background = "#ccc";
    }
    document.body.appendChild(clone);

    gsap.to(clone, {
      left: targetRect.left + "px",
      top: targetRect.top + "px",
      width: targetRect.width + "px",
      height: targetRect.height + "px",
      duration: 0.8,
      ease: "power2.inOut",
      onComplete: function () {
        setShowSparkle(true);
        playSound("congrats");
        if (svgSnapshot) setCapturedSvgHtml(svgSnapshot);
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            clone.remove();
          });
        });
        setTimeout(function () {
          setShowSparkle(false);
        }, 1500);
        finishPlacement(svgSnapshot);
      },
    });
  };

  var finishPlacement = function (svgHtml) {
    setIsAnimating(false);
    setPhase("placed");

    if (mode === "serve") {
      if (onPositionFilled) onPositionFilled(stepData.correctPosition, svgHtml || "assets/machine.png");
      if (onPositionRevealed) onPositionRevealed(stepData.correctPosition);
      if (onNavTextChange) onNavTextChange(stepData.navAfterPlace);
      if (onStepComplete) onStepComplete();
    } else if (mode === "challenge") {
      setShowServeButton(true);
      if (onNavTextChange) onNavTextChange(stepData.correctNavText);
    }
  };

  var handleImageClick = function (position) {
    if (isAnimating || isServing) return;
    if (phase === "placed") return;
    if (mode === "challenge" && phase === "served") return;
    if (wrongPositions.indexOf(position) !== -1) return;
    if (filledPositions[position]) return;

    if (position === stepData.correctPosition) {
      playSound("correct");
      setIsAnimating(true);
      animateMachineToPosition(position);
    } else {
      playSound("wrong");
      setWrongPositions(function (prev) { return prev.concat([position]); });
      setPhase("wrong");
    }
  };

  if (mode === "intro") {
    return renderIntro();
  }
  if (mode === "serve") {
    return renderServeMode();
  }
  if (mode === "challenge") {
    return renderChallengeMode();
  }
  return null;

  function renderIntro() {
    var step = currentStep;
    var showLeftPanel = true;
    var leftOpacity = step >= 2 ? 0.3 : 1;
    var showScale = step >= 2;
    var showHeading = step >= 3;
    var showLabel2 = step === 2;
    var showImagesRow = step >= 4;
    var introTextData = null;

    if (step === 1) introTextData = null;
    else if (step === 2) introTextData = APP_DATA.introStep2.text;
    else if (step === 3) introTextData = APP_DATA.introStep3.text;
    else if (step === 4) introTextData = APP_DATA.introStep4.text;

    var tubeColors = APP_DATA.introTubeColors || ["red", "yellow", "blue", "pink"];

    var leftCol = React.createElement(
      "div",
      {
        className: "mc-left-column",
        style: { opacity: leftOpacity, transition: "opacity 0.4s ease" },
      },
      React.createElement(
        "div",
        { className: "mc-image-row" },
        React.createElement(MachineVisual, {
          tubeColors: tubeColors,
          serveSequence: [],
          autoFill: true,
          triggerServe: 0,
        }),
        React.createElement(
          "div",
          { className: "mc-serve-button-wrap mc-serve-button-wrap--intro" },
          React.createElement(
            "span",
            { className: "mc-serve-intro-label" },
            null
          )
        )
      ),
      React.createElement(
        "div",
        { className: "mc-bottom-row" },
        step === 1
          ? React.createElement("div", {
              className: "mc-intro-text",
              dangerouslySetInnerHTML: { __html: APP_DATA.introStep1.text },
            })
          : null
      )
    );

    var rightCol = React.createElement(
      "div",
      {
        className: "mc-right-column",
        style: { opacity: showScale ? 1 : 0, transition: "opacity 0.4s ease" },
      },
      React.createElement(
        "div",
        {
          className: "mc-heading-row",
          style: { opacity: showHeading ? 1 : 0, transition: "opacity 0.4s ease" },
        },
        React.createElement("div", {
          className: "mc-heading-text",
          dangerouslySetInnerHTML: {
            __html: APP_DATA.introStep3 ? APP_DATA.introStep3.headingText : "",
          },
        })
      ),
      React.createElement(
        "div",
        { className: "mc-scale-row" },
        React.createElement(Scale, {
          revealedPositions: revealedPositions,
          filledPositions: {},
          showImagesRow: showImagesRow,
          showLabel2: showLabel2,
          introText: introTextData,
        })
      ),
      React.createElement("div", { className: "mc-text-row", style: { opacity: 0 } })
    );

    return React.createElement(
      "div",
      { ref: containerRef, className: "main-canvas" },
      leftCol,
      rightCol
    );
  }

  function renderServeMode() {
    var isPlaced = phase === "placed";
    var showGrid = gridBalls.length > 0;

    var textHtml = "";
    if (isPlaced) textHtml = stepData.finalText;
    else if (phase === "initial") textHtml = stepData.initialText;
    else textHtml = stepData.afterServeText;

    var tubeColors = stepData.tubeColors || ["red", "yellow", "blue", "pink"];
    var serveColors = stepData.serveColors || [];

    var leftCol = React.createElement(
      "div",
      { className: "mc-left-column" },
      React.createElement(
        "div",
        { className: "mc-image-row" },
        React.createElement(MachineVisual, {
          tubeColors: tubeColors,
          serveSequence: serveColors,
          autoFill: true,
          triggerServe: serveCounter,
          onServeStep: handleServeStep,
          onServesDone: handleServesDone,
          machineRef: machineRef,
        }),
        React.createElement(
          "div",
          { className: "mc-serve-button-wrap" },
          React.createElement(
            "button",
            {
              type: "button",
              ref: serveButtonRef,
              className: "mc-serve-button btn",
              disabled:
                phase !== "initial" ||
                showGrid ||
                isServing ||
                isPlaced,
              onClick: handleServe,
            },
            APP_DATA.serveButtonText
          )
        )
      ),
      React.createElement(
        "div",
        { className: "mc-bottom-row" },
        showGrid
          ? renderGrid()
          : renderNumberGrid()
      )
    );

    var scaleWrongText = APP_DATA.machineWrongText;
    var canClick = showGrid && !isPlaced && !isAnimating && !isServing;

    var serveBtnEnabled =
      phase === "initial" &&
      !showGrid &&
      !isServing &&
      !isPlaced;

    var nudgeCorrectDashedSlot =
      canClick && (phase === "served" || phase === "wrong");

    var rightCol = React.createElement(
      "div",
      { className: "mc-right-column" },
      React.createElement(
        "div",
        { className: "mc-heading-row" },
        React.createElement("div", {
          className: "mc-heading-text",
          dangerouslySetInnerHTML: { __html: APP_DATA.eventHeading },
        })
      ),
      React.createElement(
        "div",
        { className: "mc-scale-row" },
        React.createElement(Scale, {
          revealedPositions: revealedPositions,
          filledPositions: filledPositions,
          wrongPositions: wrongPositions,
          correctPosition: stepData.correctPosition,
          isAnswered: isPlaced,
          currentImage: capturedSvgHtml || "assets/machine.png",
          onImageClick: canClick ? handleImageClick : null,
          registerImageRef: registerImageRef,
          wrongText: scaleWrongText,
          showSparkle: showSparkle,
          showImagesRow: true,
        })
      ),
      React.createElement(
        "div",
        { className: "mc-text-row" },
        React.createElement("div", {
          className: "mc-extra-text",
          dangerouslySetInnerHTML: { __html: textHtml },
        })
      )
    );

    return React.createElement(
      React.Fragment,
      null,
      React.createElement(
        "div",
        { ref: containerRef, className: "main-canvas" },
        leftCol,
        rightCol
      ),
      React.createElement(Nudge, {
        show: serveBtnEnabled,
        targetRef: serveButtonRef,
      }),
      React.createElement(Nudge, {
        key: "scale-correct-" + stepData.correctPosition + "-" + phase,
        show: nudgeCorrectDashedSlot,
        targetRef: correctScaleSlotRef,
      })
    );
  }

  function renderChallengeMode() {
    var isInitial = phase === "initial" || phase === "wrong";
    var isPlaced = phase === "placed";
    var isServed = phase === "served";
    var showGrid = gridBalls.length > 0;
    var challengeGridVisible = showGrid || isServing;

    var textHtml = "";
    if (isServed) textHtml = stepData.extraTextFinal;
    else if (isPlaced) textHtml = stepData.correctExtraText;
    else textHtml = stepData.extraText;

    var tubeColors = stepData.tubeColors || ["red", "yellow", "blue", "pink"];
    var serveColors = stepData.serveColors || [];

    var challengeServeBtnEnabled =
      isPlaced &&
      showServeButton &&
      !challengeGridVisible &&
      !isServing;

    var feedbackContent = null;
    if (challengeGridVisible) {
      feedbackContent = renderGrid();
    } else if (phase === "wrong") {
      feedbackContent = React.createElement("div", {
        className: "mc-feedback-box",
        dangerouslySetInnerHTML: { __html: APP_DATA.challengeWrongFeedback },
      });
    }

    var leftCol = React.createElement(
      "div",
      { className: "mc-left-column" },
      React.createElement(
        "div",
        { className: "mc-image-row" },
        React.createElement(MachineVisual, {
          tubeColors: tubeColors,
          serveSequence: serveColors,
          autoFill: true,
          triggerServe: serveCounter,
          onServeStep: handleServeStep,
          onServesDone: handleServesDone,
          machineRef: machineRef,
        }),
        React.createElement(
          "div",
          { className: "mc-serve-button-wrap" },
          React.createElement(
            "button",
            {
              type: "button",
              ref: serveButtonRef,
              className: "mc-serve-button btn",
              disabled: !challengeServeBtnEnabled,
              onClick: handleServe,
            },
            APP_DATA.serveButtonText
          )
        )
      ),
      React.createElement(
        "div",
        { className: "mc-bottom-row" },
        feedbackContent
      )
    );

    var canClick = isInitial && !isAnimating && !isServing;

    var rightCol = React.createElement(
      "div",
      { className: "mc-right-column" },
      React.createElement("div", { className: "mc-heading-row", style: { opacity: 0 } }),
      React.createElement(
        "div",
        { className: "mc-scale-row" },
        React.createElement(Scale, {
          revealedPositions: [1, 2, 3, 4, 5],
          filledPositions: {},
          wrongPositions: wrongPositions,
          correctPosition: stepData.correctPosition,
          isAnswered: isPlaced || isServed,
          currentImage: capturedSvgHtml || "assets/machine.png",
          onImageClick: canClick ? handleImageClick : null,
          registerImageRef: registerImageRef,
          wrongText: APP_DATA.challengeWrongText,
          showSparkle: showSparkle,
          showImagesRow: true,
          hideNonCorrectSlotImages: isPlaced || isServed,
          glowCorrectDot: isPlaced || isServed,
        })
      ),
      React.createElement(
        "div",
        { className: "mc-text-row" },
        React.createElement("div", {
          className: "mc-extra-text",
          dangerouslySetInnerHTML: { __html: textHtml },
        })
      )
    );

    return React.createElement(
      React.Fragment,
      null,
      React.createElement(
        "div",
        { ref: containerRef, className: "main-canvas" },
        leftCol,
        rightCol
      ),
      React.createElement(Nudge, {
        show: challengeServeBtnEnabled,
        targetRef: serveButtonRef,
      })
    );
  }

  function renderNumberGrid() {
    var cells = [];
    for (var i = 0; i < 10; i++) {
      cells.push(
        React.createElement(
          "div",
          { key: i, className: "mc-grid-cell mc-grid-cell-number" },
          String(i + 1)
        )
      );
    }
    return React.createElement("div", { className: "mc-grid" }, cells);
  }

  function renderGrid() {
    var cells = [];
    for (var i = 0; i < 10; i++) {
      (function (idx) {
        var hasBall = idx < gridBalls.length;
        cells.push(
          React.createElement(
            "div",
            { key: idx, className: "mc-grid-cell" },
            hasBall
              ? React.createElement("img", {
                  src: getBallImage(gridBalls[idx]),
                  className: "mc-grid-ball mc-grid-ball-pop",
                  alt: gridBalls[idx],
                  draggable: false,
                })
              : React.createElement(
                  "span",
                  { className: "mc-grid-cell-number" },
                  String(idx + 1)
                )
          )
        );
      })(i);
    }
    return React.createElement("div", { className: "mc-grid" }, cells);
  }
};
