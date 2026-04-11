const MainCanvas = ({ stepData, onStepComplete }) => {
  const { useState, useRef, useCallback, useEffect } = React;

  const [wrongPositions, setWrongPositions] = useState([]);
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
    if (isAnswered || isAnimating) return;
    if (wrongPositions.indexOf(position) !== -1) return;

    if (position === stepData.correctPosition) {
      playSound("correct");
      setIsAnimating(true);
      animateBowlToPosition(position);
    } else {
      playSound("wrong");
      setWrongPositions(function (prev) {
        return prev.concat([position]);
      });
      setFeedbackState("wrong");
    }
  };

  var leftColumn = React.createElement(
    "div",
    { className: "mc-left-column" },

    React.createElement(
      "div",
      { className: "mc-bowl-wrapper" },
      React.createElement("img", {
        ref: bowlImageRef,
        src: stepData.image,
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
            "</red> = <b>" +
            stepData.redCount +
            "</b>",
        },
      }),
      React.createElement("div", { className: "mc-question-separator" }),
      React.createElement("div", {
        className: "mc-question-col",
        dangerouslySetInnerHTML: {
          __html:
            APP_DATA.labels.total + " = <b>" + stepData.totalCount + "</b>",
        },
      })
    ),

    React.createElement(
      "div",
      { className: "mc-feedback-div" },
      feedbackState === "initial"
        ? React.createElement(
            "div",
            { className: "mc-feedback-initial" },
            stepData.initialFeedback
          )
        : feedbackState === "wrong"
        ? React.createElement(
            "div",
            { className: "mc-feedback-box" },
            stepData.wrongFeedback
          )
        : null
    )
  );

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
          __html: isAnswered ? stepData.correctExtraText : stepData.extraText,
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
