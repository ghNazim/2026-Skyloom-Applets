const ANIMATION_MS = 1000;
const PAUSE_MS = 500;
const SIMILAR_WORD_MOVE_MS = 700;
const READ_PAUSE_MS = 1500;

const MainCanvas = (props) => {
  const {
    step,
    onSetNextEnabled,
    onUpdateNavText,
    onPrevAvailabilityChange,
    onAnimatingChange,
    registerGoPrevQuestion,
    onUpdateQuestionPanel,
  } = props;

  const { useState, useEffect, useRef } = React;

  const stepData = APP_DATA.steps[1];
  const objects = stepData.objects;
  const dollIds = objects
    .filter((object) => object.type === "doll")
    .map((object) => object.id);
  const [phase, setPhase] = useState("selecting");
  const [selectedIds, setSelectedIds] = useState([]);
  const [wrongIds, setWrongIds] = useState([]);
  const [sameLines, setSameLines] = useState([]);
  const [differentLines, setDifferentLines] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasTappedOpeningImage, setHasTappedOpeningImage] = useState(false);

  const phaseRef = useRef(phase);
  const selectedIdsRef = useRef(selectedIds);
  const isAnimatingRef = useRef(isAnimating);

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const setAnimating = (value) => {
    isAnimatingRef.current = value;
    setIsAnimating(value);
    if (onAnimatingChange) onAnimatingChange(value);
  };

  const setPhaseValue = (value) => {
    phaseRef.current = value;
    setPhase(value);
  };

  const setSelectedIdsValue = (value) => {
    selectedIdsRef.current = value;
    setSelectedIds(value);
  };

  const isDoll = (object) => object.type === "doll";

  const allDollsSelected = (ids) =>
    dollIds.every((id) => ids.indexOf(id) !== -1);

  const resetActivity = () => {
    setPhaseValue("selecting");
    setSelectedIdsValue([]);
    setWrongIds([]);
    setSameLines([]);
    setDifferentLines([]);
    setHasTappedOpeningImage(false);
    setAnimating(false);
    if (onSetNextEnabled) onSetNextEnabled(false);
    if (onUpdateNavText) onUpdateNavText(stepData.navText);
    if (onPrevAvailabilityChange) onPrevAvailabilityChange(false);
    if (registerGoPrevQuestion) registerGoPrevQuestion(null);
    if (onUpdateQuestionPanel) onUpdateQuestionPanel(false, "");
  };

  useEffect(() => {
    if (step === 1) resetActivity();
  }, [step]);

  if (step !== 1) return null;

  const handleSelectTap = (object) => {
    if (isAnimatingRef.current || phaseRef.current !== "selecting") return;

    if (!isDoll(object)) {
      if (typeof playSound === "function") playSound("wrong");
      if (wrongIds.indexOf(object.id) === -1) {
        setWrongIds((prev) => prev.concat(object.id));
      }
      return;
    }

    if (selectedIdsRef.current.indexOf(object.id) !== -1) return;

    if (typeof playSound === "function") playSound("correct");
    const nextSelected = selectedIdsRef.current.concat(object.id);
    setSelectedIdsValue(nextSelected);

    if (allDollsSelected(nextSelected)) {
      setPhaseValue("readyToCompare");
      if (onUpdateQuestionPanel) {
        onUpdateQuestionPanel(true, stepData.questionText);
      }
      if (onUpdateNavText) onUpdateNavText(stepData.navTextCompare);
    }
  };

  const handleCompare = async () => {
    if (isAnimatingRef.current || phaseRef.current !== "readyToCompare") return;

    if (typeof playSound === "function") playSound("click");
    setAnimating(true);
    if (onUpdateQuestionPanel) {
      onUpdateQuestionPanel(true, stepData.questionTextCompare);
    }
    setPhaseValue("distractorsDocked");
    await wait(ANIMATION_MS + PAUSE_MS);
    setPhaseValue("dollsBlack");
    await wait(ANIMATION_MS + PAUSE_MS);
    setPhaseValue("dollsRow");
    await wait(ANIMATION_MS);
    setSameLines([stepData.sameShapeLine1]);
    setPhaseValue("dollsClickable");
    if (onUpdateNavText) onUpdateNavText(stepData.navTextLineUp);
    setAnimating(false);
  };

  const handleDollTap = async () => {
    if (isAnimatingRef.current || phaseRef.current !== "dollsClickable") return;

    if (typeof playSound === "function") playSound("click");
    setAnimating(true);
    setPhaseValue("dollsStackedOriginalScale");
    await wait(ANIMATION_MS);
    await wait(ANIMATION_MS);
    setPhaseValue("dollsStacked");
    await wait(ANIMATION_MS);
    setPhaseValue("dollsTilting");
    await wait(ANIMATION_MS);
    setPhaseValue("dollsStacked");
    await wait(ANIMATION_MS);
    setSameLines([stepData.sameShapeLine1, stepData.sameShapeLine2]);
    await wait(ANIMATION_MS);
    setPhaseValue("othersClickable");
    if (onUpdateNavText) onUpdateNavText(stepData.navTextOtherCompare);
    setAnimating(false);
  };

  const handleOtherTap = async () => {
    if (isAnimatingRef.current || phaseRef.current !== "othersClickable") return;

    if (typeof playSound === "function") playSound("click");
    setAnimating(true);
    setDifferentLines([stepData.differentShapeLine1]);
    setPhaseValue("othersGrid");
    await wait(ANIMATION_MS);
    await wait(ANIMATION_MS);
    setPhaseValue("othersStacked");
    await wait(ANIMATION_MS);
    setDifferentLines([stepData.differentShapeLine1, stepData.differentShapeLine2]);
    setPhaseValue("awaitSimilarCallout");
    if (onUpdateNavText) onUpdateNavText(stepData.navTextLookAlikeShapes);
    setAnimating(false);
  };

  const handleSimilarCalloutTap = async () => {
    if (
      isAnimatingRef.current ||
      phaseRef.current !== "awaitSimilarCallout"
    ) {
      return;
    }

    if (typeof playSound === "function") playSound("click");
    setAnimating(true);
    setPhaseValue("similarIntroDollsLeft");
    await wait(ANIMATION_MS);
    setPhaseValue("similarIntroBox");
    await wait(ANIMATION_MS);
    setPhaseValue("similarIntroDollsRow");
    await wait(ANIMATION_MS);
    setPhaseValue("similarComplete");
    if (onUpdateNavText) onUpdateNavText(stepData.navTextOtherShapes);
    setAnimating(false);
  };

  const handleNonSimilarCalloutTap = async () => {
    if (isAnimatingRef.current || phaseRef.current !== "similarComplete") {
      return;
    }

    if (typeof playSound === "function") playSound("click");
    setAnimating(true);
    setPhaseValue("similarTitleAnimating");
    await wait(SIMILAR_WORD_MOVE_MS);
    setPhaseValue("similarTitleVisible");
    await wait(READ_PAUSE_MS);
    setPhaseValue("similarObjectsRight");
    await wait(ANIMATION_MS);
    await wait(ANIMATION_MS);
    setPhaseValue("nonSimilarIntro");
    await wait(ANIMATION_MS);
    setPhaseValue("nonSimilarBox");
    await wait(ANIMATION_MS);
    setPhaseValue("nonSimilarComplete");
    if (onUpdateNavText) onUpdateNavText(stepData.navTextSummarise);
    if (onSetNextEnabled) onSetNextEnabled(true);
    setAnimating(false);
  };

  const handleObjectClick = (object) => {
    if (phase === "selecting") {
      setHasTappedOpeningImage(true);
      handleSelectTap(object);
      return;
    }

    if (phase === "dollsClickable" && isDoll(object)) {
      handleDollTap();
      return;
    }

    if (phase === "awaitSimilarCallout" && isDoll(object)) {
      handleSimilarCalloutTap();
      return;
    }

    if (phase === "othersClickable" && !isDoll(object)) {
      handleOtherTap();
      return;
    }

    if (phase === "similarComplete" && !isDoll(object)) {
      handleNonSimilarCalloutTap();
    }
  };

  const getObjectPlacement = (object) => {
    if (!isDoll(object)) {
      if (
        phase === "distractorsDocked" ||
        phase === "dollsBlack" ||
        phase === "dollsRow" ||
        phase === "dollsClickable" ||
        phase === "dollsStackedOriginalScale" ||
        phase === "dollsStacked" ||
        phase === "dollsTilting" ||
        phase === "othersClickable" ||
        phase === "similarIntroDollsLeft" ||
        phase === "similarIntroBox" ||
        phase === "similarIntroDollsRow" ||
        phase === "similarComplete" ||
        phase === "similarTitleVisible" ||
        phase === "similarTitleAnimating" ||
        phase === "similarObjectsRight"
      ) {
        return {
          left: object.dockLeft,
          top: object.dockTop,
          scale: 0.7,
          rotateY: 0,
          rotateZ: 0,
        };
      }

      if (
        phase === "nonSimilarIntro" ||
        phase === "nonSimilarBox" ||
        phase === "nonSimilarComplete"
      ) {
        const rightPositions = {
          car: { left: "55%", top: "68%", scale: 0.95 },
          robo: { left: "68%", top: "50%", scale: 0.95 },
          teddy: { left: "80%", top: "50%", scale: 0.95 },
          dino: { left: "93%", top: "63%", scale: 1 },
        };
        return {
          left: rightPositions[object.id].left,
          top: rightPositions[object.id].top,
          scale: rightPositions[object.id].scale,
          rotateY: 0,
          rotateZ: 0,
        };
      }

      if (phase === "othersGrid") {
        return {
          left: object.gridLeft,
          top: object.gridTop,
          scale: 1,
          rotateY: 0,
          rotateZ: 0,
        };
      }

      if (
        phase === "othersStacked" ||
        phase === "awaitSimilarCallout" ||
        phase === "complete"
      ) {
        return {
          left: object.stackLeft,
          top: object.stackTop,
          scale: 1,
          rotateY: 0,
          rotateZ: 0,
        };
      }
    }

    if (isDoll(object)) {
      if (phase === "similarIntroDollsLeft" || phase === "similarIntroBox") {
        return {
          left: "28%",
          top: "57%",
          scale: 1,
          rotateY: 0,
          rotateZ: 0,
        };
      }

      if (
        phase === "similarIntroDollsRow" ||
        phase === "similarComplete" ||
        phase === "similarTitleAnimating" ||
        phase === "similarTitleVisible"
      ) {
        const leftRowPositions = {
          doll1: { left: "13%", top: "62%" },
          doll2: { left: "25%", top: "57%" },
          doll3: { left: "38%", top: "55%" },
          doll4: { left: "50%", top: "60%" },
        };
        return {
          left: leftRowPositions[object.id].left,
          top: leftRowPositions[object.id].top,
          scale: object.scale,
          rotateY: object.rotateY,
          rotateZ: 0,
        };
      }

      if (phase === "similarObjectsRight") {
        return {
          left: object.stackLeft,
          top: object.stackTop,
          scale: 1,
          rotateY: 0,
          rotateZ: 0,
        };
      }

      if (
        phase === "nonSimilarIntro" ||
        phase === "nonSimilarBox" ||
        phase === "nonSimilarComplete"
      ) {
        return {
          left: "112%",
          top: object.stackTop,
          scale: 1,
          rotateY: 0,
          rotateZ: 0,
        };
      }

      if (phase === "dollsRow" || phase === "dollsClickable") {
        return {
          left: object.rowLeft,
          top: object.rowTop,
          scale: object.scale,
          rotateY: 0,
          rotateZ: 0,
        };
      }

      if (
        phase === "dollsStackedOriginalScale" ||
        phase === "dollsStacked" ||
        phase === "othersClickable" ||
        phase === "othersGrid" ||
        phase === "othersStacked" ||
        phase === "awaitSimilarCallout"
      ) {
        return {
          left: object.stackLeft,
          top: object.stackTop,
          scale: phase === "dollsStackedOriginalScale" ? object.scale : 1,
          rotateY: 0,
          rotateZ: 0,
        };
      }

      if (phase === "dollsTilting") {
        const tiltById = {
          doll1: 15,
          doll2: 30,
          doll3: -15,
          doll4: -30,
        };
        return {
          left: object.stackLeft,
          top: object.stackTop,
          scale: 1,
          rotateY: 0,
          rotateZ: tiltById[object.id] || 0,
        };
      }
    }

    return {
      left: object.left,
      top: object.top,
      scale: object.scale,
      rotateY: object.rotateY,
      rotateZ: 0,
    };
  };

  const isOtherDocked =
    phase === "distractorsDocked" ||
    phase === "dollsBlack" ||
    phase === "dollsRow" ||
    phase === "dollsClickable" ||
    phase === "dollsStackedOriginalScale" ||
    phase === "dollsStacked" ||
    phase === "dollsTilting" ||
    phase === "othersClickable" ||
    phase === "similarIntroDollsLeft" ||
    phase === "similarIntroBox" ||
    phase === "similarIntroDollsRow" ||
    phase === "similarComplete" ||
    phase === "similarTitleVisible" ||
    phase === "similarTitleAnimating" ||
    phase === "similarObjectsRight";

  const getObjectClassName = (object) => {
    const classes = ["look-object"];
    const objectIsDoll = isDoll(object);

    if (phase === "selecting" || phase === "readyToCompare") {
      if (selectedIds.indexOf(object.id) !== -1 && objectIsDoll) {
        classes.push("is-selected-doll");
      }
      if (
        wrongIds.indexOf(object.id) !== -1 ||
        (phase === "readyToCompare" && !objectIsDoll)
      ) {
        classes.push("is-greyed");
      }
    }

    if (
      phase === "distractorsDocked" &&
      objectIsDoll &&
      selectedIds.indexOf(object.id) !== -1
    ) {
      classes.push("is-selected-doll");
    }

    if (
      objectIsDoll &&
      (phase === "dollsBlack" ||
        phase === "dollsRow" ||
        phase === "dollsClickable" ||
        phase === "dollsStackedOriginalScale" ||
        phase === "dollsStacked" ||
        phase === "dollsTilting" ||
        phase === "othersClickable" ||
        phase === "othersGrid" ||
        phase === "othersStacked" ||
        phase === "awaitSimilarCallout" ||
        phase === "similarIntroDollsLeft" ||
        phase === "similarIntroBox" ||
        phase === "similarIntroDollsRow" ||
        phase === "similarObjectsRight")
    ) {
      classes.push("is-black-green");
    }

    if (!objectIsDoll && isOtherDocked) {
      classes.push("is-faded-other");
    }

    if (
      !objectIsDoll &&
      (phase === "othersGrid" ||
        phase === "othersStacked" ||
        phase === "awaitSimilarCallout" ||
        phase === "nonSimilarIntro" ||
        phase === "nonSimilarBox")
    ) {
      classes.push("is-black-red");
    }

    if (
      !objectIsDoll &&
      (phase === "similarIntroDollsLeft" ||
        phase === "similarIntroBox" ||
        phase === "similarIntroDollsRow" ||
        phase === "similarComplete" ||
        phase === "similarTitleVisible" ||
        phase === "similarTitleAnimating" ||
        phase === "similarObjectsRight")
    ) {
      classes.push("is-greyed");
    }

    if (
      phase === "selecting" ||
      (phase === "dollsClickable" && objectIsDoll) ||
      (phase === "othersClickable" && !objectIsDoll) ||
      (phase === "awaitSimilarCallout" && objectIsDoll) ||
      (phase === "similarComplete" && !objectIsDoll)
    ) {
      classes.push("is-clickable");
    }

    return classes.join(" ");
  };

  const getObjectStyle = (object) => {
    const placement = getObjectPlacement(object);
    const stackOrder = {
      doll3: 3,
      doll2: 4,
      doll1: 5,
      doll4: 6,
    };
    const isStackedDoll =
      isDoll(object) &&
      (phase === "dollsStackedOriginalScale" ||
        phase === "dollsStacked" ||
        phase === "dollsTilting" ||
        phase === "othersClickable" ||
        phase === "othersGrid" ||
        phase === "othersStacked" ||
        phase === "awaitSimilarCallout" ||
        phase === "similarIntroDollsLeft" ||
        phase === "similarIntroBox" ||
        phase === "similarObjectsRight");

    return {
      left: placement.left,
      top: placement.top,
      width: object.width,
      transform:
        "translate(-50%, -50%) perspective(40vw) rotateY(" +
        placement.rotateY +
        "deg) rotate(" +
        placement.rotateZ +
        "deg) scale(" +
        placement.scale +
        ")",
      zIndex: isStackedDoll ? stackOrder[object.id] : isDoll(object) ? 3 : 2,
    };
  };

  const renderNudge = () => {
    let left = "50%";
    let top = "50%";
    let className = "tap-nudge canvas-tap-nudge";

    if (phase === "dollsClickable") {
      const doll = objects.find((object) => object.id === "doll1");
      const placement = getObjectPlacement(doll);
      left = placement.left;
      top = placement.top;
      className += " on-object";
    } else if (phase === "awaitSimilarCallout") {
      const doll = objects.find((object) => object.id === "doll4");
      const placement = getObjectPlacement(doll);
      left = placement.left;
      top = "42%";
      className += " on-object";
    } else if (phase === "similarComplete") {
      const dino = objects.find((object) => object.id === "dino");
      const placement = getObjectPlacement(dino);
      left = placement.left;
      top = placement.top;
      className += " on-object";
    } else if (phase === "othersClickable") {
      const dino = objects.find((object) => object.id === "dino");
      const placement = getObjectPlacement(dino);
      left = placement.left;
      top = placement.top;
      className += " on-object";
    } else if (
      phase !== "selecting" ||
      selectedIds.length > 0 ||
      hasTappedOpeningImage
    ) {
      return null;
    }

    return React.createElement("img", {
      src: "assets/tap.gif",
      alt: "",
      className,
      style: { left, top },
    });
  };

  return React.createElement(
    "div",
    { className: "main-canvas-container look-alikes-applet" },
    React.createElement(
      "div",
      {
        className:
          "same-shape-text" +
          (sameLines.length &&
          phase !== "similarTitleAnimating" &&
          phase !== "similarTitleVisible" &&
          phase !== "similarObjectsRight" &&
          phase !== "nonSimilarIntro" &&
          phase !== "nonSimilarBox" &&
          phase !== "nonSimilarComplete"
            ? " is-visible"
            : "") +
          (phase === "dollsStackedOriginalScale" ||
          phase === "dollsStacked" ||
          phase === "dollsTilting" ||
          phase === "othersClickable" ||
          phase === "othersGrid" ||
          phase === "othersStacked" ||
          phase === "awaitSimilarCallout" ||
          phase === "similarIntroDollsLeft" ||
          phase === "similarIntroBox" ||
          phase === "similarIntroDollsRow" ||
          phase === "similarComplete"
            ? " is-right"
            : ""),
      },
      sameLines.map((line, index) =>
        React.createElement("div", { key: "same-line-" + index }, line),
      ),
    ),
    React.createElement(
      "div",
      {
        className:
          "different-shape-text" +
          (differentLines.length ? " is-visible" : "") +
          (phase === "similarIntroDollsLeft" ||
          phase === "similarIntroBox" ||
          phase === "similarIntroDollsRow" ||
          phase === "similarComplete" ||
          phase === "similarTitleVisible" ||
          phase === "similarTitleAnimating" ||
          phase === "similarObjectsRight"
            ? " is-out-left"
            : ""),
      },
      differentLines.map((line, index) =>
        React.createElement("div", { key: "different-line-" + index }, line),
      ),
    ),
    React.createElement(
      "div",
      {
        className:
          "object-title similar-objects-title" +
          (phase === "similarTitleVisible" ||
          phase === "similarObjectsRight" ||
          phase === "nonSimilarIntro" ||
          phase === "nonSimilarBox" ||
          phase === "nonSimilarComplete"
            ? " is-visible"
            : "") +
          (phase === "nonSimilarIntro" ||
          phase === "nonSimilarBox" ||
          phase === "nonSimilarComplete"
            ? " is-out-right"
            : ""),
      },
      stepData.similarObjectsTitle,
    ),
    React.createElement(
      "div",
      {
        className:
          "math-callout similar-big-box" +
          (phase === "similarIntroBox" ||
          phase === "similarIntroDollsRow" ||
          phase === "similarComplete" ||
          phase === "similarTitleAnimating"
            ? " is-visible"
            : "") +
          (phase === "similarTitleAnimating" ? " is-fading" : ""),
      },
      React.createElement("div", null, stepData.similarBoxLine1),
      React.createElement("div", null, stepData.similarBoxLine2),
      React.createElement(
        "div",
        { className: "callout-word similar-word" },
        stepData.similarBoxWord + ".",
      ),
    ),
    phase === "similarTitleAnimating" &&
      React.createElement(
        "div",
        { className: "moving-similar-word is-moving" },
        stepData.similarBoxWord,
      ),
    React.createElement(
      "div",
      {
        className:
          "math-callout non-similar-big-box" +
          (phase === "nonSimilarBox" || phase === "nonSimilarComplete"
            ? " is-visible"
            : ""),
      },
      React.createElement("div", null, stepData.similarBoxLine1),
      React.createElement("div", null, stepData.similarBoxLine2),
      React.createElement(
        "div",
        { className: "callout-word non-similar-word" },
        stepData.nonSimilarBoxWord + ".",
      ),
    ),
    objects.map((object) =>
      React.createElement("img", {
        key: object.id,
        src: object.src,
        alt: "",
        className: getObjectClassName(object),
        style: getObjectStyle(object),
        onClick: () => handleObjectClick(object),
        draggable: false,
      }),
    ),
    phase === "readyToCompare" &&
      React.createElement(
        "button",
        {
          type: "button",
          className: "btn compare-button",
          onClick: handleCompare,
        },
        stepData.compareButton,
      ),
    phase === "readyToCompare" &&
      React.createElement("img", {
        src: "assets/tap.gif",
        alt: "",
        className: "tap-nudge compare-tap-nudge",
      }),
    renderNudge(),
  );
};
