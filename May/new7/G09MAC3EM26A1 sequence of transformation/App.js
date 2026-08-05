function formatTemplate(template, values) {
  return template.replace(/\{(\w+)\}/g, function (_, key) {
    return values[key] == null ? "" : values[key];
  });
}

function normalizePoint(point) {
  return {
    x: Math.round(point.x * 1000) / 1000,
    y: Math.round(point.y * 1000) / 1000,
  };
}

function translatePoint(point, vector) {
  return { x: point.x + vector.x, y: point.y + vector.y };
}

function dilatePoint(point, center, scale) {
  return normalizePoint({
    x: center.x + scale * (point.x - center.x),
    y: center.y + scale * (point.y - center.y),
  });
}

function dilateVertices(vertices, center, scale) {
  return vertices.map(function (point) {
    return dilatePoint(point, center, scale);
  });
}

function triangleCentroid(vertices) {
  return normalizePoint({
    x: (vertices[0].x + vertices[1].x + vertices[2].x) / 3,
    y: (vertices[0].y + vertices[1].y + vertices[2].y) / 3,
  });
}

function verticesMatch(left, right, tolerance) {
  const eps = tolerance == null ? 0.05 : tolerance;
  return left.every(function (point, index) {
    return (
      Math.abs(point.x - right[index].x) <= eps &&
      Math.abs(point.y - right[index].y) <= eps
    );
  });
}

function offsetCloneToCentroid(vertices, centroid) {
  const current = triangleCentroid(vertices);
  const delta = {
    x: centroid.x - current.x,
    y: centroid.y - current.y,
  };
  return vertices.map(function (point) {
    return translatePoint(point, delta);
  });
}

function postMcqStage(choice) {
  return choice === "translateFirst" ? "stepB3" : "stepA3";
}

const App = () => {
  const { useState, useMemo, useEffect, useCallback, useRef } = React;
  const data = APP_DATA;
  const graphConfig = data.graph;
  const objectVertices = graphConfig.object;
  const imageVertices = graphConfig.image;
  const correctScale = graphConfig.correctScale;
  const rightAngleIndex = graphConfig.rightAngleIndex;

  const [stage, setStage] = useState("step1");
  const [activeTool, setActiveTool] = useState(null);
  const [mcqChoice, setMcqChoice] = useState(null);
  const [mcqCollapsed, setMcqCollapsed] = useState(false);
  const [flowPath, setFlowPath] = useState(null);
  const [completedPaths, setCompletedPaths] = useState({
    dilateFirst: false,
    translateFirst: false,
  });
  const [dilationCenter, setDilationCenter] = useState(null);
  const [scaleFactor, setScaleFactor] = useState(1);
  const [dilationCorrect, setDilationCorrect] = useState(false);
  const [showDilationClones, setShowDilationClones] = useState(false);
  const [translationVector, setTranslationVector] = useState({ x: 0, y: 0 });
  const [translatePhase, setTranslatePhase] = useState("left");
  const [historyEntries, setHistoryEntries] = useState([]);
  const [sliderPulse, setSliderPulse] = useState(false);
  const [nudgeRect, setNudgeRect] = useState(null);
  const mcqTransitionDoneRef = useRef(false);
  const mcqChoiceRef = useRef(null);

  const resetFlowState = useCallback(function () {
    setActiveTool(null);
    setDilationCenter(null);
    setScaleFactor(1);
    setDilationCorrect(false);
    setShowDilationClones(false);
    setTranslationVector({ x: 0, y: 0 });
    setTranslatePhase("left");
    setHistoryEntries([]);
    setSliderPulse(false);
    setFlowPath(null);
    setMcqChoice(null);
    setMcqCollapsed(false);
    mcqTransitionDoneRef.current = false;
  }, []);

  const isPathB = flowPath === "translateFirst";

  const expectedTranslation = useMemo(
    function () {
      if (!dilationCenter || isPathB) return null;
      const dilated = dilateVertices(
        objectVertices,
        dilationCenter,
        correctScale,
      );
      return {
        x: imageVertices[0].x - dilated[0].x,
        y: imageVertices[0].y - dilated[0].y,
      };
    },
    [correctScale, dilationCenter, imageVertices, isPathB, objectVertices],
  );

  const expectedBTranslation = useMemo(
    function () {
      return {
        x:
          imageVertices[rightAngleIndex].x -
          objectVertices[rightAngleIndex].x,
        y:
          imageVertices[rightAngleIndex].y -
          objectVertices[rightAngleIndex].y,
      };
    },
    [imageVertices, objectVertices, rightAngleIndex],
  );

  const translatedObjectVertices = useMemo(
    function () {
      return objectVertices.map(function (point) {
        return translatePoint(point, translationVector);
      });
    },
    [objectVertices, translationVector],
  );

  const play = useCallback(function (name) {
    if (typeof playSound === "function") {
      try {
        playSound(name);
      } catch (error) {
        console.warn(error);
      }
    }
  }, []);

  const updateHistory = useCallback(function (kind, text) {
    setHistoryEntries(function (entries) {
      const next = entries.filter(function (entry) {
        return entry.id !== kind;
      });
      next.push({ id: kind, kind: kind, text: text });
      return next;
    });
  }, []);

  const dilatedBaseVertices = useMemo(
    function () {
      if (!dilationCenter || isPathB) return null;
      return dilateVertices(objectVertices, dilationCenter, scaleFactor);
    },
    [dilationCenter, isPathB, objectVertices, scaleFactor],
  );

  const cloneVertices = useMemo(
    function () {
      if (isPathB) {
        const showStages = [
          "translateBActive",
          "translateBSuccess",
          "dilateBIntro",
          "dilateBSlider",
          "translateSuccessB",
          "revealPanel",
        ];
        if (showStages.indexOf(stage) === -1) return null;

        if (stage === "translateSuccessB" || stage === "revealPanel") {
          const center =
            dilationCenter ||
            translatedObjectVertices[rightAngleIndex];
          return dilateVertices(
            translatedObjectVertices,
            center,
            correctScale,
          );
        }

        if (stage === "dilateBSlider") {
          const center =
            dilationCenter ||
            translatedObjectVertices[rightAngleIndex];
          return dilateVertices(
            translatedObjectVertices,
            center,
            scaleFactor,
          );
        }

        return translatedObjectVertices;
      }

      const pathACloneStages = [
        "dilateSuccess",
        "translateActive",
        "translateSuccess",
        "revealPanel",
      ];
      if (
        !showDilationClones &&
        pathACloneStages.indexOf(stage) === -1
      ) {
        return null;
      }
      if (!dilationCenter) return null;

      const dilatedAtCorrectScale = dilateVertices(
        objectVertices,
        dilationCenter,
        correctScale,
      );

      if (stage === "dilateSlider" || stage === "dilateSuccess") {
        return dilateVertices(objectVertices, dilationCenter, scaleFactor);
      }

      return dilatedAtCorrectScale.map(function (point) {
        return translatePoint(point, translationVector);
      });
    },
    [
      correctScale,
      dilatedBaseVertices,
      dilationCenter,
      isPathB,
      rightAngleIndex,
      scaleFactor,
      showDilationClones,
      stage,
      translatedObjectVertices,
      translationVector,
    ],
  );

  const clone2Vertices = useMemo(
    function () {
      if (isPathB || !showDilationClones || stage !== "dilateSlider") {
        return null;
      }
      if (!dilatedBaseVertices) return null;
      const imageCenter = triangleCentroid(imageVertices);
      return offsetCloneToCentroid(dilatedBaseVertices, imageCenter);
    },
    [
      dilatedBaseVertices,
      imageVertices,
      isPathB,
      showDilationClones,
      stage,
    ],
  );

  const dilationLineVertices = useMemo(
    function () {
      if (isPathB && (stage === "dilateBSlider" || stage === "translateSuccessB")) {
        return translatedObjectVertices;
      }
      if (!isPathB && stage === "dilateSlider" && dilationCenter) {
        return objectVertices;
      }
      return null;
    },
    [
      dilationCenter,
      isPathB,
      objectVertices,
      stage,
      translatedObjectVertices,
    ],
  );

  const handleStart = function () {
    play("click");
    setStage("step2");
  };

  const handleMcqSelect = function (choice) {
    if (stage !== "step2" || mcqCollapsed) return;
    if (choice === "dilateFirst" && completedPaths.dilateFirst) return;
    if (choice === "translateFirst" && completedPaths.translateFirst) return;
    play("click");
    mcqChoiceRef.current = choice;
    setFlowPath(choice);
    setMcqChoice(choice);
    setMcqCollapsed(true);
    mcqTransitionDoneRef.current = false;
  };

  const advanceAfterMcq = useCallback(function () {
    const choice = mcqChoiceRef.current;
    setStage(postMcqStage(choice));
  }, []);

  const handleMcqTransitionEnd = function (event) {
    if (event.propertyName !== "height" && event.propertyName !== "max-height") {
      return;
    }
    if (!mcqCollapsed || mcqTransitionDoneRef.current) return;
    if (
      event.target.className.indexOf("mcq-title-wrap") === -1 &&
      event.target.className.indexOf("mcq-option") === -1 &&
      event.target.className.indexOf("is-hidden") === -1
    ) {
      return;
    }
    mcqTransitionDoneRef.current = true;
    window.setTimeout(advanceAfterMcq, 120);
  };

  useEffect(
    function () {
      if (!mcqCollapsed) return;
      const timer = window.setTimeout(function () {
        if (!mcqTransitionDoneRef.current) {
          mcqTransitionDoneRef.current = true;
          advanceAfterMcq();
        }
      }, 700);
      return function () {
        window.clearTimeout(timer);
      };
    },
    [advanceAfterMcq, mcqCollapsed],
  );

  const handleToolClick = function (tool) {
    play("click");

    if (tool === "dilate" && stage === "stepA3") {
      setActiveTool("dilate");
      setStage("dilateOptions");
      return;
    }

    if (tool === "translate" && stage === "stepB3") {
      setActiveTool("translate");
      setTranslationVector({ x: 0, y: 0 });
      setTranslatePhase("left");
      setStage("translateBActive");
      return;
    }

    if (tool === "dilate" && stage === "dilateBIntro") {
      const anchor = translatePoint(
        objectVertices[rightAngleIndex],
        translationVector,
      );
      setDilationCenter(anchor);
      setActiveTool("dilate");
      setScaleFactor(1);
      setDilationCorrect(false);
      setSliderPulse(true);
      setStage("dilateBSlider");
      return;
    }

    if (tool === "translate" && stage === "dilateSuccess") {
      setActiveTool("translate");
      setShowDilationClones(true);
      setTranslationVector({ x: 0, y: 0 });
      setStage("translateActive");
      setTranslatePhase("left");
      return;
    }
  };

  const handleDilateOption = function (option) {
    play("click");
    if (option === "origin") {
      setDilationCenter({ x: 0, y: 0 });
      setActiveTool("dilate");
      setScaleFactor(1);
      setDilationCorrect(false);
      setShowDilationClones(false);
      setSliderPulse(true);
      setStage("dilateSlider");
      return;
    }

    if (option === "vertex") {
      setStage("dilateVertexPick");
    }
  };

  const handleVertexPick = function (vertex) {
    play("click");
    setDilationCenter(vertex);
    setActiveTool("dilate");
    setScaleFactor(1);
    setDilationCorrect(false);
    setShowDilationClones(false);
    setSliderPulse(true);
    setStage("dilateSlider");
  };

  const handleScaleChange = function (value) {
    if (stage !== "dilateSlider" && stage !== "dilateBSlider") return;
    setShowDilationClones(true);
    setSliderPulse(false);
    setScaleFactor(value);
  };

  const handleScaleDragStart = function () {
    setSliderPulse(false);
    setShowDilationClones(true);
  };

  const handleScaleCommit = function () {
    if (stage !== "dilateSlider" && stage !== "dilateBSlider") return;
    const next = scaleFactor;
    if (Math.abs(next - correctScale) > 0.1) {
      setScaleFactor(next);
      return;
    }

    play(stage === "dilateBSlider" ? "congrats" : "correct");
    setScaleFactor(correctScale);
    setDilationCorrect(true);
    setSliderPulse(false);

    if (stage === "dilateBSlider") {
      updateHistory(
        "dilation",
        formatTemplate(data.history.dilationVertex, {
          k: correctScale,
          x: dilationCenter.x,
          y: dilationCenter.y,
        }),
      );
      setStage("translateSuccessB");
      setActiveTool(null);
      return;
    }

    const dilationText =
      dilationCenter.x === 0 && dilationCenter.y === 0
        ? formatTemplate(data.history.dilation, { k: correctScale })
        : formatTemplate(data.history.dilationVertex, {
            k: correctScale,
            x: dilationCenter.x,
            y: dilationCenter.y,
          });
    updateHistory("dilation", dilationText);
    setStage("dilateSuccess");
  };

  const handleMoveA = function (direction) {
    if (!expectedTranslation || !dilatedBaseVertices) return;

    setTranslationVector(function (current) {
      const delta =
        direction === "left"
          ? { x: -1, y: 0 }
          : direction === "up"
            ? { x: 0, y: 1 }
            : { x: 0, y: 0 };
      let next = {
        x: current.x + delta.x,
        y: current.y + delta.y,
      };

      if (translatePhase === "left" && next.x <= expectedTranslation.x) {
        next = { x: expectedTranslation.x, y: current.y };
        setTranslatePhase("up");
      }

      if (
        translatePhase === "up" &&
        next.x === expectedTranslation.x &&
        next.y >= expectedTranslation.y
      ) {
        next = {
          x: expectedTranslation.x,
          y: expectedTranslation.y,
        };
      }

      updateHistory(
        "translation",
        formatTemplate(data.history.translation, {
          x: next.x,
          y: next.y,
        }),
      );

      const translated = dilatedBaseVertices.map(function (point) {
        return translatePoint(point, next);
      });

      if (verticesMatch(translated, imageVertices)) {
        play("congrats");
        setStage("translateSuccess");
        setActiveTool(null);
        setTranslatePhase("done");
      }

      return next;
    });
  };

  const handleMoveB = function (direction) {
    setTranslationVector(function (current) {
      const delta =
        direction === "left"
          ? { x: -1, y: 0 }
          : direction === "up"
            ? { x: 0, y: 1 }
            : { x: 0, y: 0 };
      let next = {
        x: current.x + delta.x,
        y: current.y + delta.y,
      };

      if (translatePhase === "left" && next.x <= expectedBTranslation.x) {
        next = { x: expectedBTranslation.x, y: current.y };
        setTranslatePhase("up");
      }

      if (
        translatePhase === "up" &&
        next.x === expectedBTranslation.x &&
        next.y >= expectedBTranslation.y
      ) {
        next = {
          x: expectedBTranslation.x,
          y: expectedBTranslation.y,
        };
      }

      updateHistory(
        "translation",
        formatTemplate(data.history.translation, {
          x: next.x,
          y: next.y,
        }),
      );

      const cloneRightAngle = translatePoint(
        objectVertices[rightAngleIndex],
        next,
      );
      const targetRightAngle = imageVertices[rightAngleIndex];

      if (
        Math.abs(cloneRightAngle.x - targetRightAngle.x) <= 0.05 &&
        Math.abs(cloneRightAngle.y - targetRightAngle.y) <= 0.05
      ) {
        play("correct");
        setStage("translateBSuccess");
        setActiveTool(null);
        setTranslatePhase("done");
      }

      return next;
    });
  };

  const handleMove = function (direction) {
    if (activeTool !== "translate") return;
    if (stage === "translateActive") {
      if (translatePhase === "left" && direction !== "left") return;
      if (translatePhase === "up" && direction !== "up") return;
      play("click");
      handleMoveA(direction);
      return;
    }
    if (stage === "translateBActive") {
      if (translatePhase === "left" && direction !== "left") return;
      if (translatePhase === "up" && direction !== "up") return;
      play("click");
      handleMoveB(direction);
    }
  };

  const handleReveal = function () {
    play("click");
    if (flowPath) {
      setCompletedPaths(function (prev) {
        return { ...prev, [flowPath]: true };
      });
    }
    setMcqChoice(null);
    setMcqCollapsed(false);
    setStage("revealPanel");
  };

  const handleNext = function () {
    play("click");
    if (stage === "translateBSuccess") {
      setStage("dilateBIntro");
      setActiveTool(null);
      return;
    }
    if (stage === "revealPanel") {
      const bothDone =
        completedPaths.dilateFirst && completedPaths.translateFirst;
      resetFlowState();
      setStage(bothDone ? "step4" : "step2");
    }
  };

  const rightPanelKey = useMemo(
    function () {
      if (stage === "step1") return "step1";
      if (stage === "step2") return "step2";
      if (stage === "stepA3") return "stepA3";
      if (stage === "stepB3") return "stepB3";
      if (stage === "dilateOptions") return "dilateOptions";
      if (stage === "dilateVertexPick") return "dilateVertexPick";
      if (stage === "dilateSlider") return "dilateSlider";
      if (stage === "dilateSuccess") return "dilateSuccess";
      if (stage === "translateActive") return "translateActive";
      if (stage === "translateBActive") return "translateBActive";
      if (stage === "translateBSuccess") return "translateBSuccess";
      if (stage === "dilateBIntro") return "dilateBIntro";
      if (stage === "dilateBSlider") return "dilateBSlider";
      if (stage === "translateSuccess") return "translateSuccess";
      if (stage === "translateSuccessB") return "translateSuccessB";
      if (stage === "revealPanel") return "revealPanel";
      if (stage === "step4") return "step4";
      return "step1";
    },
    [stage],
  );

  const panel = data.panels[rightPanelKey];

  const footerText = useMemo(
    function () {
      if (
        stage === "translateSuccess" ||
        stage === "translateSuccessB" ||
        stage === "revealPanel" ||
        stage === "translateBSuccess"
      ) {
        return "";
      }
      return panel.footer || "";
    },
    [panel, stage],
  );

  const footerAction =
    stage === "translateBSuccess"
      ? "next"
      : stage === "translateSuccess" || stage === "translateSuccessB"
        ? "reveal"
        : stage === "revealPanel"
          ? "next"
          : null;

  const activeNudgeId =
    stage === "step1"
      ? "start-button"
      : stage === "step2" &&
          completedPaths.dilateFirst &&
          !completedPaths.translateFirst
        ? "mcq-translate-first"
        : stage === "step2" &&
            completedPaths.translateFirst &&
            !completedPaths.dilateFirst
          ? "mcq-dilate-first"
          : stage === "stepA3"
            ? "tool-dilate"
            : stage === "stepB3"
              ? "tool-translate"
              : stage === "dilateBIntro"
                ? "tool-dilate"
                : stage === "dilateSuccess"
                  ? "tool-translate"
                  : null;

  useEffect(
    function () {
      const updateNudge = function () {
        if (!activeNudgeId) {
          setNudgeRect(null);
          return;
        }
        const element = document.getElementById(activeNudgeId);
        setNudgeRect(element ? element.getBoundingClientRect() : null);
      };

      const frame = window.requestAnimationFrame(updateNudge);
      window.addEventListener("resize", updateNudge);
      return function () {
        window.cancelAnimationFrame(frame);
        window.removeEventListener("resize", updateNudge);
      };
    },
    [activeNudgeId, stage, sliderPulse, scaleFactor],
  );

  const enabledArrow =
    stage === "translateActive" || stage === "translateBActive"
      ? translatePhase === "left"
        ? "left"
        : translatePhase === "up"
          ? "up"
          : null
      : null;

  const showHistoryBox = false;

  const showDilationLines =
    stage === "dilateSlider" || stage === "dilateBSlider";
  const showDilationAnchor =
    dilationCenter && (stage === "dilateSlider" || stage === "dilateBSlider");
  const showClone2 = !isPathB && stage === "dilateSlider" && showDilationClones;
  const cloneIsCorrect =
    (dilationCorrect &&
      (stage === "dilateSlider" ||
        stage === "dilateSuccess" ||
        stage === "dilateBSlider")) ||
    stage === "translateSuccess" ||
    stage === "translateSuccessB" ||
    stage === "revealPanel";
  const clone2IsCorrect = dilationCorrect && !isPathB;

  const imageIsCorrect =
    stage === "translateSuccess" ||
    stage === "translateSuccessB" ||
    stage === "revealPanel";

  return React.createElement(
    "div",
    { className: "applet-container transformation-applet" },
    React.createElement(
      "main",
      { className: "transformation-canvas" },
      React.createElement(
        "section",
        { className: "left-workspace" },
        React.createElement(
          "div",
          { className: "graph-row" },
          React.createElement(Graph, {
            objectVertices: objectVertices,
            imageVertices: imageVertices,
            cloneVertices: cloneVertices,
            clone2Vertices: showClone2 ? clone2Vertices : null,
            cloneIsCorrect: cloneIsCorrect,
            clone2IsCorrect: clone2IsCorrect,
            imageIsCorrect: imageIsCorrect,
            dilationAnchor: showDilationAnchor ? dilationCenter : null,
            dilationLines: dilationLineVertices,
            vertexPickers:
              stage === "dilateVertexPick" ? objectVertices : null,
            onVertexPick: handleVertexPick,
          }),
        ),
        React.createElement(Controls, {
          activeTool: activeTool,
          stage: stage,
          rotationDirection: null,
          rotationDegrees: 0,
          scaleFactor: scaleFactor,
          sliderPulse: sliderPulse,
          translationVector: translationVector,
          enabledArrow: enabledArrow,
          canRotate: false,
          canReflect: false,
          canTranslate: stage === "dilateSuccess" || stage === "stepB3",
          canDilate: stage === "stepA3" || stage === "dilateBIntro",
          reflectionAxis: null,
          toolsHidden: stage === "step1",
          mainControlsHidden: stage === "dilateOptions",
          showStartButton: stage === "step1",
          showDilateOptions: stage === "dilateOptions",
          onStartClick: handleStart,
          onDilateOption: handleDilateOption,
          onToolClick: handleToolClick,
          onDirection: function () {},
          onSliderChange: function () {},
          onSliderDragStart: function () {},
          onSliderCommit: function () {},
          onScaleChange: handleScaleChange,
          onScaleDragStart: handleScaleDragStart,
          onScaleCommit: handleScaleCommit,
          onReflect: function () {},
          onMove: handleMove,
        }),
      ),
      React.createElement(RightPanel, {
        stage: stage,
        panel: panel,
        tokens: {},
        historyEntries: historyEntries,
        showHistoryBox: showHistoryBox,
        revealHeading:
          stage === "translateSuccessB"
            ? data.panels.translateSuccessB.heading
            : data.panels.translateSuccess.heading,
        mcqChoice: mcqChoice,
        mcqCollapsed: mcqCollapsed,
        completedPaths: completedPaths,
        footerText: footerText,
        footerAction: footerAction,
        onMcqSelect: handleMcqSelect,
        onMcqTransitionEnd: handleMcqTransitionEnd,
        onReveal: handleReveal,
        onNext: handleNext,
      }),
    ),
    React.createElement(Nudge, { show: Boolean(nudgeRect), position: nudgeRect }),
  );
};
