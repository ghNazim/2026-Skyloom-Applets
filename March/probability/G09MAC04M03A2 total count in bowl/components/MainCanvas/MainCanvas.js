const MainCanvas = ({
  stepData,
  onStepComplete,
  inZeroStage,
  onExitZeroStage,
  previousStepData,
}) => {
  const { useState, useRef, useCallback, useEffect } = React;

  inZeroStage = !!inZeroStage;

  const [wrongPositions, setWrongPositions] = useState([]);
  const [lastWrongPosition, setLastWrongPosition] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [feedbackState, setFeedbackState] = useState("initial");
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSparkle, setShowSparkle] = useState(false);

  const bowlImageRef = useRef(null);
  const scaleImagesRef = useRef({});
  const containerRef = useRef(null);

  useEffect(function () {
    APP_DATA.steps.forEach(function (s) {
      var im = new Image();
      im.src = s.image;
    });
  }, []);

  useEffect(
    function () {
      setWrongPositions([]);
      setLastWrongPosition(null);
      setIsAnswered(false);
      setFeedbackState("initial");
      setIsAnimating(false);
      setShowSparkle(false);
      scaleImagesRef.current = {};
    },
    [stepData.image]
  );

  const registerImageRef = useCallback(function (position, el) {
    if (el) {
      scaleImagesRef.current[position] = el;
    }
  }, []);

  var animateBowlToPosition = function (position) {
    var bowlEl = bowlImageRef.current;
    var targetWrapper = scaleImagesRef.current[position];
    var container = containerRef.current;

    if (!bowlEl || !targetWrapper || !container) {
      setIsAnswered(true);
      setIsAnimating(false);
      setFeedbackState("hidden");
      onStepComplete();
      return;
    }

    var bowlRect = bowlEl.getBoundingClientRect();
    var targetImg = targetWrapper.querySelector(".scale-image");
    var targetRect = targetImg
      ? targetImg.getBoundingClientRect()
      : targetWrapper.getBoundingClientRect();

    var clone = document.createElement("img");
    clone.src = stepData.image;
    clone.style.position = "fixed";
    clone.style.left = bowlRect.left + "px";
    clone.style.top = bowlRect.top + "px";
    clone.style.width = bowlRect.width + "px";
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
        setIsAnswered(true);
        setIsAnimating(false);
        setFeedbackState("hidden");
        setShowSparkle(true);
        playSound("congrats");
        onStepComplete();

        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            clone.remove();
          });
        });

        setTimeout(function () {
          setShowSparkle(false);
        }, 1500);
      },
    });
  };

  var handleImageClick = function (position) {
    if (inZeroStage) return;
    if (isAnswered || isAnimating) return;
    if (wrongPositions.indexOf(position) !== -1) return;

    if (position === stepData.correctPosition) {
      playSound("correct");
      setWrongPositions([]);
      setLastWrongPosition(null);
      setFeedbackState("initial");
      setIsAnimating(true);
      animateBowlToPosition(position);
    } else {
      playSound("wrong");
      setLastWrongPosition(position);
      setWrongPositions(function (prev) {
        return prev.concat([position]);
      });
      setFeedbackState("wrong");
    }
  };

  var resolveWrongFeedbackText = function () {
    var byPos = stepData.wrongFeedbackByPosition;
    if (byPos && lastWrongPosition >= 1 && lastWrongPosition <= 5) {
      var keyed = byPos[lastWrongPosition];
      if (keyed) return keyed;
    }
    return stepData.wrongFeedback || "";
  };

  var displayBowlSrc = inZeroStage
    ? (previousStepData && previousStepData.image) || stepData.image
    : stepData.image;
  var displayRedCount = inZeroStage
    ? previousStepData
      ? previousStepData.redCount
      : stepData.redCount
    : stepData.redCount;
  var displayTotalCount = inZeroStage
    ? previousStepData
      ? previousStepData.totalCount
      : stepData.totalCount
    : stepData.totalCount;

  var leftColumn = React.createElement(
    "div",
    { className: "mc-left-column" },

    React.createElement(
      "div",
      { className: "mc-bowl-wrapper" },
      React.createElement("img", {
        ref: bowlImageRef,
        src: displayBowlSrc,
        className: "mc-bowl-image",
        alt: "bowl",
        draggable: false,
        decoding: "sync",
      })
    ),

    React.createElement(
      "div",
      { className: "mc-question-div" },
      React.createElement("div", {
        className: "mc-question-col",
        dangerouslySetInnerHTML: {
          __html:
            "<red>" +
            APP_DATA.labels.red +
            "</red> = " +
            displayRedCount +
            "",
        },
      }),
      React.createElement("div", { className: "mc-question-separator" }),
      React.createElement("div", {
        className: "mc-question-col",
        dangerouslySetInnerHTML: {
          __html:
            APP_DATA.labels.total + " = " + displayTotalCount + "",
        },
      })
    ),

    React.createElement(
      "div",
      { className: "mc-feedback-div" },
      inZeroStage
        ? null
        : feedbackState === "initial"
        ? React.createElement(
            "div",
            { className: "mc-feedback-initial" },
            stepData.initialFeedback
          )
        : feedbackState === "wrong"
        ? React.createElement(
            "div",
            { className: "mc-feedback-box" },
            resolveWrongFeedbackText()
          )
        : null,
      inZeroStage
        ? React.createElement(
            "button",
            {
              type: "button",
              className: "mc-add-balls-btn",
              onClick: function () {
                if (onExitZeroStage) onExitZeroStage();
              },
            },
            APP_DATA.zeroStage.buttonText
          )
        : null
    )
  );

  var extraHtml = inZeroStage
    ? APP_DATA.zeroStage.extraText
    : isAnswered
    ? stepData.correctExtraText
    : stepData.extraText;

  var rightColumn = React.createElement(
    "div",
    { className: "mc-right-column" },

    React.createElement(
      "div",
      { className: "mc-scale-row" },
      React.createElement(Scale, {
        wrongPositions: wrongPositions,
        isAnswered: isAnswered,
        currentImage: stepData.image,
        correctPosition: stepData.correctPosition,
        onImageClick: handleImageClick,
        registerImageRef: registerImageRef,
        wrongText: stepData.wrongText,
        showSparkle: showSparkle,
        interactionLocked: inZeroStage,
      })
    ),

    React.createElement(
      "div",
      { className: "mc-text-row" },
      React.createElement("div", {
        className: "mc-event-text",
        dangerouslySetInnerHTML: { __html: stepData.eventText },
      }),
      React.createElement("div", {
        className: "mc-extra-text",
        dangerouslySetInnerHTML: {
          __html: extraHtml,
        },
      })
    )
  );

  return React.createElement(
    "div",
    { ref: containerRef, className: "main-canvas" },
    leftColumn,
    rightColumn
  );
};
