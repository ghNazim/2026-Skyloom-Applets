const MainCanvas = ({
  step,
  sliderVal,
  setSliderVal,
  isDoneStacking,
  setIsDoneStacking,
  showSlider,
  setShowSlider,
  clickedBoxIds,
  setClickedBoxIds,
  onEnableNext,
  onUpdateNavText,
}) => {
  const { useState, useRef, useCallback, useEffect } = React;
  const shapeCanvasRef = useRef(null);
  const [animationPlaying, setAnimationPlaying] = useState(false);
  const [cubeTapped, setCubeTapped] = useState(false);
  const prevStepRef = useRef(step);

  useEffect(() => {
    if (step === 2 && prevStepRef.current !== 2) {
      setCubeTapped(false);
    }
    prevStepRef.current = step;
  }, [step]);

  const stepData = APP_DATA.steps[step];
  const isCuboidStep = step === 1;
  const isCubeStep = step === 2;
  const isCompareStep = step === 3;

  const shapeId = isCuboidStep ? "cuboid" : "cube";
  const affirmAction = isCuboidStep ? "cuboid-affirm" : "cube-affirm";

  const enabledBoxIds = React.useMemo(() => {
    if (!stepData?.textLines) return [];
    const allBoxIds = stepData.textLines.flat().filter((l) => l.type === "box").map((l) => l.id);
    if (!isDoneStacking) {
      return [shapeId];
    }
    return allBoxIds;
  }, [stepData, isDoneStacking, shapeId]);

  const lastTickVal = useRef(-1);
  const handleSliderChange = useCallback(
    (e) => {
      const val = parseInt(e.target.value, 10);
      setSliderVal(val);
      const step = Math.floor(val / 5) * 5;
      if (typeof playSound === "function" && step !== lastTickVal.current) {
        lastTickVal.current = step;
        playSound("tick");
      }
    },
    [setSliderVal]
  );

  const handleSliderRelease = useCallback(() => {
    if (sliderVal >= 95) {
      if (typeof playSound === "function") playSound("click");
      setIsDoneStacking(true);
      setSliderVal(100);
      setShowSlider(false);
      onUpdateNavText(stepData.navTapBoxes);
    } else {
      setSliderVal(0);
    }
  }, [sliderVal, setIsDoneStacking, setSliderVal, setShowSlider, stepData, onUpdateNavText]);

  const handleBoxClick = useCallback(
    async (boxId) => {
      if (animationPlaying) return;
      if (typeof playSound === "function") playSound("click");

      if (boxId === shapeId && !isDoneStacking) {
        if (isCubeStep) {
          setCubeTapped(true);
        } else {
          setShowSlider(true);
          onUpdateNavText(stepData.navSlider);
        }
        setClickedBoxIds((prev) => {
          const next = prev.includes(shapeId) ? prev : [...prev, shapeId];
          const allBoxIds = stepData.textLines.flat().filter((l) => l.type === "box").map((l) => l.id);
          if (allBoxIds.every((id) => next.includes(id))) {
            onEnableNext();
            onUpdateNavText(stepData.navNext);
          }
          return next;
        });
        return;
      }

      if (boxId === shapeId && isDoneStacking) {
        if (shapeCanvasRef.current?.performAction) {
          setAnimationPlaying(true);
          try {
            await shapeCanvasRef.current.performAction(affirmAction);
          } finally {
            setAnimationPlaying(false);
          }
        }
      } else if (["faces", "vertices", "edges"].includes(boxId)) {
        if (shapeCanvasRef.current?.performAction) {
          setAnimationPlaying(true);
          try {
            await shapeCanvasRef.current.performAction(boxId);
          } finally {
            setAnimationPlaying(false);
          }
        }
      }

      setClickedBoxIds((prev) => {
        const next = prev.includes(boxId) ? prev : [...prev, boxId];
        const allBoxIds = stepData.textLines.flat().filter((l) => l.type === "box").map((l) => l.id);
        if (allBoxIds.every((id) => next.includes(id))) {
          onEnableNext();
          onUpdateNavText(stepData.navNext);
        }
        return next;
      });
    },
    [
      shapeId,
      isDoneStacking,
      isCubeStep,
      stepData,
      affirmAction,
      animationPlaying,
      setShowSlider,
      setCubeTapped,
      setClickedBoxIds,
      onEnableNext,
      onUpdateNavText,
    ]
  );

  if (isCompareStep) {
    return React.createElement(
      "div",
      { className: "main-canvas-container main-canvas-compare" },
      React.createElement(Compare, {
        cuboidData: stepData.compare.cuboid,
        cubeData: stepData.compare.cube,
      })
    );
  }

  if (isCuboidStep || isCubeStep) {
    return React.createElement(
      "div",
      { className: "main-canvas-container main-canvas-shape" },
      React.createElement(
        "div",
        {
          className: "main-canvas-text-column",
          style: {
            flex: "0 0 40%",
            pointerEvents: animationPlaying ? "none" : "auto",
          },
        },
        React.createElement(TextPanel, {
          textLines: stepData.textLines,
          enabledBoxIds: enabledBoxIds,
          onBoxClick: handleBoxClick,
        })
      ),
      React.createElement(
        "div",
        { className: "main-canvas-visual-column", style: { flex: "0 0 60%", position: "relative" } },
        React.createElement(ShapeCanvas3D, {
          ref: shapeCanvasRef,
          shapeType: isCuboidStep ? "cuboid" : "cube",
          sliderVal: sliderVal,
          isDoneStacking: isDoneStacking,
          cubeTapped: isCubeStep ? cubeTapped : undefined,
          onBackFaceAnimationComplete: isCubeStep
            ? () => {
                setShowSlider(true);
                onUpdateNavText(stepData.navSlider);
              }
            : undefined,
        }),
        showSlider &&
          React.createElement(
            "div",
            { className: "shape-slider-overlay" },
            React.createElement("input", {
              type: "range",
              min: 0,
              max: 100,
              value: sliderVal,
              onChange: handleSliderChange,
              onMouseUp: handleSliderRelease,
              onTouchEnd: handleSliderRelease,
              className: "shape-slider",
            })
          )
      )
    );
  }

  return null;
};
