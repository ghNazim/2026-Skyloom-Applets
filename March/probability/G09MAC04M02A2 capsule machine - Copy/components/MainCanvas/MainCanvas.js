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

  var machineImageRef = useRef(null);
  var scaleImagesRef = useRef({});
  var containerRef = useRef(null);

  var stepData = mode === "serve" ? machineData : problemData;
  var resetKey = stepData ? (stepData.image + "-" + stepData.correctPosition + "-" + (mode === "challenge" ? (props.problemIndex || 0) : currentStep)) : currentStep;

  useEffect(function () {
    setPhase("initial");
    setWrongPositions([]);
    setIsAnimating(false);
    setShowSparkle(false);
    setGridBalls([]);
    setShowServeButton(mode === "serve");
    scaleImagesRef.current = {};
  }, [resetKey]);

  var registerImageRef = useCallback(function (position, el) {
    if (el) scaleImagesRef.current[position] = el;
  }, []);

  var getBallImage = function (code) {
    return "assets/" + code + ".png";
  };

  var handleServe = function () {
    if (!stepData) return;
    playSound("click");
    var serves = stepData.serves;
    setGridBalls(serves);
    setShowServeButton(false);

    if (mode === "serve") {
      setPhase("served");
      if (onNavTextChange) onNavTextChange(stepData.navAfterServe);
    } else if (mode === "challenge") {
      setPhase("served");
      if (onNavTextChange) onNavTextChange(stepData.afterServeNav);
      setTimeout(function () {
        if (onStepComplete) onStepComplete();
      }, 600);
    }
  };

  var animateMachineToPosition = function (position) {
    var machineEl = machineImageRef.current;
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

    var clone = document.createElement("img");
    clone.src = stepData.image;
    clone.style.position = "fixed";
    clone.style.left = machineRect.left + "px";
    clone.style.top = machineRect.top + "px";
    clone.style.width = machineRect.width + "px";
    clone.style.height = "auto";
    clone.style.zIndex = "10000";
    clone.style.pointerEvents = "none";
    clone.style.objectFit = "contain";
    document.body.appendChild(clone);

    gsap.to(clone, {
      left: targetRect.left + "px",
      top: targetRect.top + "px",
      width: targetRect.width + "px",
      duration: 0.8,
      ease: "power2.inOut",
      onComplete: function () {
        setShowSparkle(true);
        playSound("congrats");
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            clone.remove();
          });
        });
        setTimeout(function () {
          setShowSparkle(false);
        }, 1500);
        finishPlacement();
      },
    });
  };

  var finishPlacement = function () {
    setIsAnimating(false);
    setPhase("placed");

    if (mode === "serve") {
      if (onPositionFilled) onPositionFilled(stepData.correctPosition, stepData.image);
      if (onPositionRevealed) onPositionRevealed(stepData.correctPosition);
      if (onNavTextChange) onNavTextChange(stepData.navAfterPlace);
      if (onStepComplete) onStepComplete();
    } else if (mode === "challenge") {
      setShowServeButton(true);
      if (onNavTextChange) onNavTextChange(stepData.correctNavText);
    }
  };

  var handleImageClick = function (position) {
    if (isAnimating) return;
    // After serving, phase is "served" — user must tap the scale (serve mode).
    // Block only after correct placement ("placed"). Challenge mode never passes
    // onClick when phase is "served", so that case stays disabled via canClick.
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

    var leftCol = React.createElement(
      "div",
      {
        className: "mc-left-column",
        style: { opacity: leftOpacity, transition: "opacity 0.4s ease" },
      },
      React.createElement(
        "div",
        { className: "mc-image-row" },
        React.createElement("img", {
          src: APP_DATA.introStep1.image,
          className: "mc-machine-image",
          alt: "machine",
          draggable: false,
        })
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
    else if (showGrid) textHtml = stepData.afterServeText;
    else textHtml = stepData.initialText;

    var leftCol = React.createElement(
      "div",
      { className: "mc-left-column" },
      React.createElement(
        "div",
        { className: "mc-image-row" },
        React.createElement("img", {
          ref: machineImageRef,
          src: stepData.image,
          className: "mc-machine-image",
          alt: "machine",
          draggable: false,
          decoding: "sync",
        }),
        showServeButton && !showGrid
          ? React.createElement(
              "button",
              {
                className: "mc-serve-button btn",
                onClick: handleServe,
              },
              APP_DATA.serveButtonText
            )
          : null
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
    // After a wrong tap, phase becomes "wrong" (not "served"), but the user must
    // keep trying other slots until the correct one — use grid + not placed, not phase === "served".
    var canClick = showGrid && !isPlaced && !isAnimating;

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
          currentImage: stepData.image,
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
      "div",
      { ref: containerRef, className: "main-canvas" },
      leftCol,
      rightCol
    );
  }

  function renderChallengeMode() {
    var isInitial = phase === "initial" || phase === "wrong";
    var isPlaced = phase === "placed";
    var isServed = phase === "served";
    var showGrid = gridBalls.length > 0;

    var textHtml = "";
    if (isServed) textHtml = stepData.extraTextFinal;
    else if (isPlaced) textHtml = stepData.correctExtraText;
    else textHtml = stepData.extraText;

    var feedbackContent = null;
    if (showGrid) {
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
        React.createElement("img", {
          ref: machineImageRef,
          src: stepData.image,
          className: "mc-machine-image",
          alt: "machine",
          draggable: false,
          decoding: "sync",
        }),
        showServeButton && isPlaced && !showGrid
          ? React.createElement(
              "button",
              {
                className: "mc-serve-button btn",
                onClick: handleServe,
              },
              APP_DATA.serveButtonText
            )
          : null
      ),
      React.createElement(
        "div",
        { className: "mc-bottom-row" },
        feedbackContent
      )
    );

    var canClick = isInitial && !isAnimating;

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
          currentImage: stepData.image,
          onImageClick: canClick ? handleImageClick : null,
          registerImageRef: registerImageRef,
          wrongText: APP_DATA.challengeWrongText,
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
      "div",
      { ref: containerRef, className: "main-canvas" },
      leftCol,
      rightCol
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
    for (var i = 0; i < gridBalls.length; i++) {
      (function (idx) {
        cells.push(
          React.createElement(
            "div",
            { key: idx, className: "mc-grid-cell" },
            React.createElement("img", {
              src: getBallImage(gridBalls[idx]),
              className: "mc-grid-ball",
              alt: gridBalls[idx],
              draggable: false,
              style: {
                animationDelay: (idx * 0.08) + "s",
              },
            })
          )
        );
      })(i);
    }
    return React.createElement("div", { className: "mc-grid" }, cells);
  }
};
