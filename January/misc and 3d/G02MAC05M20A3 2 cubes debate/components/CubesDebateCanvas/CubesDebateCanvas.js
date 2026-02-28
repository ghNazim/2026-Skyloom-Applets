const CubesDebateCanvas = ({ onCorrectAnswer, onUpdateNavText, onStartOverReady }) => {
  const { useState, useRef, useEffect } = React;
  const [leftButtonState, setLeftButtonState] = useState("normal"); // normal, wrong, disabled
  const [rightButtonState, setRightButtonState] = useState("normal"); // normal, correct, disabled
  const [showCubeLabels, setShowCubeLabels] = useState(true);
  const [showCuboidLabel, setShowCuboidLabel] = useState(false);
  const [labelPositions, setLabelPositions] = useState({ left: 25, right: 75, left3D: -1.5, right3D: 1.5 });
  const canvas3DRef = useRef(null);
  const bottomRowRef = useRef(null);
  const isAnimatingRef = useRef(false);
  const isCorrectAnsweredRef = useRef(false);

  const handleButtonClick = (isLeft) => {
    if (isAnimatingRef.current || isCorrectAnsweredRef.current) return;
    if (isLeft && leftButtonState === "disabled") return;
    if (!isLeft && rightButtonState === "disabled") return;

    isAnimatingRef.current = true;

    if (isLeft) {
      // Wrong answer
      if (typeof playSound === "function") playSound("wrong");
      setLeftButtonState("wrong");
      
      // Play animation
      const canvasContainer = canvas3DRef.current;
      if (canvasContainer && canvasContainer.animateCubes) {
        canvasContainer.animateCubes(true, () => {
          // After joining, hide cube labels and show cuboid label
          setShowCubeLabels(false);
          setShowCuboidLabel(true);
          
          // Wait 1 second, then reverse
          setTimeout(() => {
            setShowCuboidLabel(false);
            setShowCubeLabels(true);
            if (canvasContainer && canvasContainer.animateCubes) {
              canvasContainer.animateCubes(false, () => {
                setLeftButtonState("normal");
                isAnimatingRef.current = false;
              });
            }
          }, 1000);
        });
      }
    } else {
      // Correct answer
      if (typeof playSound === "function") playSound("correct");
      confettiBurst();
      setRightButtonState("correct");
      setLeftButtonState("disabled");
      
      // Play animation
      const canvasContainer = canvas3DRef.current;
      if (canvasContainer && canvasContainer.animateCubes) {
        canvasContainer.animateCubes(true, () => {
          // After joining, hide cube labels and show cuboid label
          setShowCubeLabels(false);
          setShowCuboidLabel(true);
          isCorrectAnsweredRef.current = true;
          isAnimatingRef.current = false;
          
          if (onCorrectAnswer) onCorrectAnswer();
          if (onUpdateNavText) onUpdateNavText();
        });
      }
    }
  };

  const handleStartOver = () => {
    if (typeof playSound === "function") playSound("click");
    
    // Reset all states
    setLeftButtonState("normal");
    setRightButtonState("normal");
    setShowCubeLabels(true);
    setShowCuboidLabel(false);
    setLabelPositions({ left: 25, right: 75, left3D: -1.5, right3D: 1.5 });
    isAnimatingRef.current = false;
    isCorrectAnsweredRef.current = false;
    
    // Reset animation
    const canvasContainer = canvas3DRef.current;
    if (canvasContainer && canvasContainer.animateCubes) {
      canvasContainer.animateCubes(false, () => {
        // Animation complete, positions already reset
      });
    }
  };

  // Expose handleStartOver to parent
  useEffect(() => {
    if (onStartOverReady) {
      onStartOverReady(handleStartOver);
    }
  }, [onStartOverReady]);

  const handleLabelPositionsUpdate = (positions) => {
    setLabelPositions(positions);
  };

  return React.createElement(
    "div",
    { className: "cubes-debate-canvas" },
    // Top row - Character buttons (55% height)
    React.createElement(
      "div",
      { className: "cubes-debate-top-row" },
      React.createElement(
        "div",
        {
          className: `char-btn char-btn-left ${leftButtonState}`,
          onClick: () => handleButtonClick(true),
        },
        React.createElement(
          "div",
          { className: "char-btn-image" },
          React.createElement("img", { src: "assets/fatima.png", alt: "Fatima" })
        ),
        React.createElement(
          "div",
          { className: "char-btn-text" },
          APP_DATA.leftButtonText
        )
      ),
      React.createElement(
        "div",
        {
          className: `char-btn char-btn-right ${rightButtonState}`,
          onClick: () => handleButtonClick(false),
        },
        React.createElement(
          "div",
          { className: "char-btn-text" },
          APP_DATA.rightButtonText
        ),
        React.createElement(
          "div",
          { className: "char-btn-image" },
          React.createElement("img", { src: "assets/nick.png", alt: "Nick" })
        )
      )
    ),
    // Bottom row - 3D Canvas (45% height)
    React.createElement(
      "div",
      { className: "cubes-debate-bottom-row", ref: bottomRowRef },
      React.createElement(CubesDebate3D, {
        ref: canvas3DRef,
        onLabelPositionsUpdate: handleLabelPositionsUpdate,
      }),
      // Cube labels (absolutely positioned)
      showCubeLabels && React.createElement(
        "div",
        {
          className: "cube-label cube-label-left",
          style: { left: `${labelPositions.left || 25}%` },
        },
        APP_DATA.cubeLabel
      ),
      showCubeLabels && React.createElement(
        "div",
        {
          className: "cube-label cube-label-right",
          style: { left: `${labelPositions.right || 75}%` },
        },
        APP_DATA.cubeLabel
      ),
      // Cuboid label (centered)
      showCuboidLabel && React.createElement(
        "div",
        { className: "cuboid-label" },
        APP_DATA.cuboidLabel
      )
    )
  );
};
