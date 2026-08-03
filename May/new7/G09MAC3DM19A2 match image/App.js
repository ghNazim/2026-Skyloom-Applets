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

function rotatePoint(point, direction, degrees) {
  const radians = ((direction === "cw" ? -degrees : degrees) * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  return normalizePoint({
    x: point.x * cos - point.y * sin,
    y: point.x * sin + point.y * cos,
  });
}

function reflectPoint(point, axis) {
  if (axis === "x") return { x: point.x, y: -point.y };
  return { x: -point.x, y: point.y };
}

function translatePoint(point, vector) {
  return { x: point.x + vector.x, y: point.y + vector.y };
}

function transformPoint(point, matrix) {
  return normalizePoint({
    x: matrix[0] * point.x + matrix[2] * point.y + matrix[4],
    y: matrix[1] * point.x + matrix[3] * point.y + matrix[5],
  });
}

function multiplyMatrix(left, right) {
  return [
    left[0] * right[0] + left[2] * right[1],
    left[1] * right[0] + left[3] * right[1],
    left[0] * right[2] + left[2] * right[3],
    left[1] * right[2] + left[3] * right[3],
    left[0] * right[4] + left[2] * right[5] + left[4],
    left[1] * right[4] + left[3] * right[5] + left[5],
  ].map(function (value) {
    return Math.round(value * 1000) / 1000;
  });
}

function operationMatrix(kind, value) {
  if (kind === "translate") return [1, 0, 0, 1, value.x, value.y];
  if (kind === "reflect-x") return [1, 0, 0, -1, 0, 0];
  if (kind === "reflect-y") return [-1, 0, 0, 1, 0, 0];

  const radians = ((value.direction === "cw" ? -value.degrees : value.degrees) * Math.PI) / 180;
  const cos = Math.round(Math.cos(radians));
  const sin = Math.round(Math.sin(radians));
  return [cos, sin, -sin, cos, 0, 0];
}

function matricesMatch(left, right) {
  return left.every(function (value, index) {
    return Math.abs(value - right[index]) < 0.001;
  });
}

function isIdentityMatrix(matrix) {
  return matricesMatch(matrix, [1, 0, 0, 1, 0, 0]);
}

const App = () => {
  const { useState, useMemo, useEffect, useCallback, useRef } = React;
  const data = APP_DATA;
  const labels = data.labels;

  const [exampleIndex, setExampleIndex] = useState(0);
  const [stage, setStage] = useState("start");
  const [activeTool, setActiveTool] = useState(null);
  const [rotationDirection, setRotationDirection] = useState(null);
  const [rotationDegrees, setRotationDegrees] = useState(0);
  const [rotationFixed, setRotationFixed] = useState(null);
  const [translationVector, setTranslationVector] = useState({ x: 0, y: 0 });
  const [historyEntries, setHistoryEntries] = useState([]);
  const [sliderPulse, setSliderPulse] = useState(false);
  const [showVerticalGuides, setShowVerticalGuides] = useState(false);
  const [reflectionAxis, setReflectionAxis] = useState(null);
  const [nudgeRect, setNudgeRect] = useState(null);
  const [freeMatrix, setFreeMatrix] = useState([1, 0, 0, 1, 0, 0]);
  const [freeRotateBaseMatrix, setFreeRotateBaseMatrix] = useState([1, 0, 0, 1, 0, 0]);
  const lastSliderCommitRef = useRef({ key: "", time: 0 });

  const currentExample = data.examples[exampleIndex] || data.examples[0];
  const isSecondExample = exampleIndex === 1;
  const isFreeExample = Boolean(currentExample.targetMatrix);

  const play = useCallback(function (name) {
    if (typeof playSound === "function") {
      try {
        playSound(name);
      } catch (error) {
        console.warn(error);
      }
    }
  }, []);

  const resetTransformState = useCallback(function () {
    setActiveTool(null);
    setRotationDirection(null);
    setRotationDegrees(0);
    setRotationFixed(null);
    setTranslationVector({ x: 0, y: 0 });
    setHistoryEntries([]);
    setSliderPulse(false);
    setShowVerticalGuides(false);
    setReflectionAxis(null);
    setFreeMatrix([1, 0, 0, 1, 0, 0]);
    setFreeRotateBaseMatrix([1, 0, 0, 1, 0, 0]);
  }, []);

  const startExample = useCallback(
    function (nextIndex) {
      resetTransformState();
      setExampleIndex(nextIndex);
      setStage("chooseRotate");
    },
    [resetTransformState],
  );

  const rotationAmountText = useMemo(
    function () {
      if (!rotationFixed) return "";
      const directionText =
        rotationFixed.direction === "cw"
          ? labels.clockwise
          : labels.anticlockwise;
      return rotationFixed.degrees + "\u00b0 " + directionText;
    },
    [rotationFixed, labels],
  );

  const updateHistory = useCallback(function (kind, text) {
    setHistoryEntries(function (entries) {
      const next = entries.filter(function (entry) {
        return entry.id !== kind;
      });
      next.push({ id: kind, kind: kind, text: text });
      return next;
    });
  }, []);

  const appendHistory = useCallback(function (kind, text, combineLast) {
    setHistoryEntries(function (entries) {
      if (
        combineLast &&
        entries.length > 0 &&
        entries[entries.length - 1].kind === kind
      ) {
        return entries.map(function (entry, index) {
          return index === entries.length - 1 ? { ...entry, text: text } : entry;
        });
      }

      return entries.concat({
        id: kind + "-" + (entries.length + 1),
        kind: kind,
        text: text,
      });
    });
  }, []);

  const setRotationHistory = useCallback(
    function (fixed) {
      const directionText =
        fixed.direction === "cw"
          ? labels.clockwiseTitle
          : labels.anticlockwiseTitle;
      updateHistory(
        "rotation",
        formatTemplate(data.history.rotation, {
          angle: fixed.degrees,
          direction: directionText,
        }),
      );
    },
    [data.history.rotation, labels, updateHistory],
  );

  const setTranslationHistory = useCallback(
    function (vector) {
      updateHistory(
        "translation",
        formatTemplate(data.history.translation, {
          x: vector.x,
          y: vector.y,
        }),
      );
    },
    [data.history.translation, updateHistory],
  );

  const handleStart = function () {
    play("click");
    startExample(0);
  };

  const handleStartOver = function () {
    play("click");
    resetTransformState();
    setExampleIndex(0);
    setStage("start");
  };

  const handleToolClick = function (tool) {
    play("click");

    if (stage === "freePlay") {
      setActiveTool(tool);
      if (tool === "rotate" && !rotationDirection) {
        setFreeRotateBaseMatrix(freeMatrix);
      }
      return;
    }

    if (tool === "rotate" && stage === "chooseRotate") {
      setActiveTool("rotate");
      setStage("rotateDirection");
      return;
    }

    if (tool === "rotate" && stage === "afterReflect") {
      setActiveTool("rotate");
      setStage("rotateAgainDirection");
      return;
    }

    if (
      tool === "translate" &&
      (stage === "rotationDone" || stage === "orientationDone2")
    ) {
      setActiveTool("translate");
      setStage("translateRight");
      return;
    }

    if (tool === "reflect" && stage === "reflectIntro") {
      setActiveTool("reflect");
      setStage("reflectPrompt");
    }
  };

  const handleDirection = function (direction) {
    if (
      stage !== "freePlay" &&
      stage !== "rotateDirection" &&
      stage !== "rotateSlider" &&
      stage !== "rotateAgainDirection" &&
      stage !== "rotateAgainSlider"
    ) {
      return;
    }

    play("click");
    if (stage === "freePlay") {
      if (direction !== rotationDirection) {
        setFreeRotateBaseMatrix(freeMatrix);
        setRotationDegrees(0);
      }
      setRotationDirection(direction);
      setSliderPulse(true);
      return;
    }

    setRotationDirection(direction);
    setRotationDegrees(0);
    setSliderPulse(true);
    setStage(stage === "rotateAgainDirection" ? "rotateAgainSlider" : "rotateSlider");
  };

  const checkFreeCompletion = useCallback(
    function (matrix) {
      if (!isFreeExample || stage !== "freePlay") return;
      if (!matricesMatch(matrix, currentExample.targetMatrix)) return;
      play("congrats");
      setStage("freeSuccess");
      setActiveTool(null);
      setRotationDirection(null);
      setSliderPulse(false);
    },
    [currentExample.targetMatrix, isFreeExample, play, stage],
  );

  const completeRotationIfCorrect = useCallback(
    function () {
      if (!rotationDirection) return;
      const commitKey =
        stage + "|" + activeTool + "|" + rotationDirection + "|" + rotationDegrees;
      const now = Date.now();
      if (
        lastSliderCommitRef.current.key === commitKey &&
        now - lastSliderCommitRef.current.time < 250
      ) {
        return;
      }
      lastSliderCommitRef.current = { key: commitKey, time: now };
      play("click");

      if (stage === "freePlay" && activeTool === "rotate") {
        if (rotationDegrees > 0 && rotationDegrees < 360) {
          const fixed = { direction: rotationDirection, degrees: rotationDegrees };
          const op = operationMatrix("rotate", fixed);
          const next = multiplyMatrix(op, freeRotateBaseMatrix);
          setFreeMatrix(next);
          checkFreeCompletion(next);
          const directionText =
            fixed.direction === "cw"
              ? labels.clockwiseTitle
              : labels.anticlockwiseTitle;
          appendHistory(
            "rotation",
            formatTemplate(data.history.rotation, {
              angle: fixed.degrees,
              direction: directionText,
            }),
            true,
          );
        }
        setSliderPulse(false);
        return;
      }

      if (!isSecondExample && stage === "rotateSlider") {
        const isCorrect =
          (rotationDirection === "cw" && rotationDegrees === 90) ||
          (rotationDirection === "acw" && rotationDegrees === 270);
        if (!isCorrect) return;

        const fixed = { direction: rotationDirection, degrees: rotationDegrees };
        play("correct");
        setRotationFixed(fixed);
        setRotationHistory(fixed);
        setSliderPulse(false);
        setStage("rotationDone");
        setActiveTool(null);
        return;
      }

      if (isSecondExample && stage === "rotateSlider") {
        if (rotationDirection !== "cw" || rotationDegrees !== 90) return;
        const fixed = { direction: "cw", degrees: 90 };
        setRotationFixed(fixed);
        setRotationHistory(fixed);
        setSliderPulse(false);
        setStage("wrongRotation");
        setActiveTool(null);
        return;
      }

      if (isSecondExample && stage === "rotateAgainSlider") {
        if (rotationDirection !== "cw" || rotationDegrees !== 90) return;
        const fixed = { direction: "cw", degrees: 90 };
        play("correct");
        setRotationFixed(fixed);
        setRotationHistory(fixed);
        setSliderPulse(false);
        setStage("orientationDone2");
        setActiveTool(null);
      }
    },
    [
      isSecondExample,
      activeTool,
      appendHistory,
      checkFreeCompletion,
      data.history.rotation,
      freeRotateBaseMatrix,
      labels.clockwiseTitle,
      labels.anticlockwiseTitle,
      play,
      rotationDegrees,
      rotationDirection,
      setRotationHistory,
      stage,
    ],
  );

  const handleSliderChange = function (value) {
    if (
      stage !== "freePlay" &&
      stage !== "rotateSlider" &&
      stage !== "rotateAgainSlider"
    ) {
      return;
    }
    if (value !== rotationDegrees) play("tick");
    if (stage === "freePlay") setSliderPulse(false);
    setRotationDegrees(value);
  };

  const handleReset = function () {
    play("click");
    if (stage === "freePlay" || isFreeExample) {
      setActiveTool(null);
      setRotationDirection(null);
      setRotationDegrees(0);
      setRotationFixed(null);
      setTranslationVector({ x: 0, y: 0 });
      setHistoryEntries([]);
      setSliderPulse(false);
      setShowVerticalGuides(false);
      setReflectionAxis(null);
      setFreeMatrix([1, 0, 0, 1, 0, 0]);
      setFreeRotateBaseMatrix([1, 0, 0, 1, 0, 0]);
      if (stage !== "freePlay") setStage("freePlay");
      return;
    }

    setActiveTool(null);
    setRotationDirection(null);
    setRotationDegrees(0);
    setRotationFixed(null);
    setHistoryEntries([]);
    setSliderPulse(false);
    setStage("reflectIntro");
  };

  const handleReflect = function (axis) {
    if (stage === "freePlay" && activeTool === "reflect") {
      play("click");
      setReflectionAxis(axis);
      const op = operationMatrix("reflect-" + axis);
      const next = multiplyMatrix(op, freeMatrix);
      setFreeMatrix(next);
      checkFreeCompletion(next);
      setRotationDirection(null);
      setRotationDegrees(0);
      setSliderPulse(false);
      setFreeRotateBaseMatrix(next);
      appendHistory(
        "reflection",
        axis === "x" ? data.history.reflectionX : data.history.reflectionY,
      );
      return;
    }

    if (activeTool !== "reflect" || stage !== "reflectPrompt" || axis !== "y") {
      return;
    }
    play("click");
    setReflectionAxis("y");
    updateHistory("reflection", data.history.reflectionY);
    setStage("afterReflect");
  };

  const handleMove = function (direction) {
    if (activeTool !== "translate") return;
    if (stage === "freePlay") {
      const delta =
        direction === "right"
          ? { x: 1, y: 0 }
          : direction === "left"
            ? { x: -1, y: 0 }
            : direction === "up"
              ? { x: 0, y: 1 }
            : { x: 0, y: -1 };
      play("click");
      const op = operationMatrix("translate", delta);
      const nextMatrix = multiplyMatrix(op, freeMatrix);
      setFreeMatrix(nextMatrix);
      checkFreeCompletion(nextMatrix);
      setRotationDirection(null);
      setRotationDegrees(0);
      setSliderPulse(false);
      setFreeRotateBaseMatrix(nextMatrix);
      setTranslationVector(function (current) {
        const next = { x: current.x + delta.x, y: current.y + delta.y };
        appendHistory(
          "translation",
          formatTemplate(data.history.translation, {
            x: next.x,
            y: next.y,
          }),
          true,
        );
        return next;
      });
      return;
    }

    if (stage === "translateRight" && direction !== "right") return;
    if (stage === "translateDown" && direction !== "down") return;

    play("click");
    setTranslationVector(function (current) {
      let next = current;
      if (stage === "translateRight") {
        next = { x: Math.min(4, current.x + 1), y: current.y };
      } else if (stage === "translateDown") {
        next = {
          x: current.x,
          y: Math.max(currentExample.downTarget, current.y - 1),
        };
      }
      setTranslationHistory(next);

      if (stage === "translateRight" && next.x === 4) {
        play("correct");
        setShowVerticalGuides(true);
        setStage("verticalGuide");
        window.setTimeout(function () {
          setShowVerticalGuides(false);
          setStage("translateDown");
        }, 1000);
      }

      if (stage === "translateDown" && next.y === currentExample.downTarget) {
        play("congrats");
        setStage("success");
        setActiveTool(null);
      }

      return next;
    });
  };

  const handleReveal = function () {
    play("click");
    setStage("reveal");
  };

  const handleNext = function () {
    play("click");
    if (exampleIndex === 0) {
      startExample(1);
      return;
    }
    if (exampleIndex === 1) {
      resetTransformState();
      setExampleIndex(2);
      setStage("freePlay");
      return;
    }
    if (isFreeExample && exampleIndex < data.examples.length - 1) {
      resetTransformState();
      setExampleIndex(exampleIndex + 1);
      setStage("freePlay");
      return;
    }
    if (isFreeExample && exampleIndex === data.examples.length - 1) {
      resetTransformState();
      setStage("completed");
      return;
    }
    resetTransformState();
    setStage("step3Pending");
  };

  const freeDisplayMatrix = useMemo(
    function () {
      if (
        isFreeExample &&
        stage === "freePlay" &&
        activeTool === "rotate" &&
        rotationDirection
      ) {
        return multiplyMatrix(
          operationMatrix("rotate", {
            direction: rotationDirection,
            degrees: rotationDegrees,
          }),
          freeRotateBaseMatrix,
        );
      }
      return freeMatrix;
    },
    [
      activeTool,
      freeMatrix,
      freeRotateBaseMatrix,
      isFreeExample,
      rotationDegrees,
      rotationDirection,
      stage,
    ],
  );

  const cloneVertices = useMemo(
    function () {
      const base = currentExample.object || data.graph.object;

      if (isFreeExample) {
        if (currentExample.raster) return null;
        if (isIdentityMatrix(freeDisplayMatrix) && stage !== "freeSuccess") {
          return null;
        }
        return base.map(function (point) {
          return transformPoint(point, freeDisplayMatrix);
        });
      }

      if (isSecondExample) {
        if (stage === "rotateSlider" || stage === "wrongRotation") {
          return base.map(function (point) {
            return rotatePoint(point, rotationDirection || "cw", rotationDegrees);
          });
        }

        const shouldShowReflected =
          stage === "afterReflect" ||
          stage === "rotateAgainDirection" ||
          stage === "rotateAgainSlider" ||
          stage === "orientationDone2" ||
          activeTool === "translate" ||
          stage === "verticalGuide" ||
          stage === "translateDown" ||
          stage === "success" ||
          stage === "reveal";

        if (!shouldShowReflected) return null;

        return base
          .map(function (point) {
            return reflectPoint(point, "y");
          })
          .map(function (point) {
            const shouldRotate =
              stage === "rotateAgainSlider" ||
              stage === "orientationDone2" ||
              activeTool === "translate" ||
              stage === "verticalGuide" ||
              stage === "translateDown" ||
              stage === "success" ||
              stage === "reveal";
            const rotateDegrees =
              stage === "rotateAgainSlider" ? rotationDegrees : 90;
            return shouldRotate
              ? rotatePoint(point, "cw", rotateDegrees)
              : point;
          })
          .map(function (point) {
            return translatePoint(point, translationVector);
          });
      }

      const shouldShowRotationClone =
        stage === "rotateSlider" ||
        stage === "rotationDone" ||
        activeTool === "translate" ||
        stage === "verticalGuide" ||
        stage === "translateDown" ||
        stage === "success" ||
        stage === "reveal";

      if (!shouldShowRotationClone) return null;

      const direction = rotationFixed
        ? rotationFixed.direction
        : rotationDirection || "cw";
      const degrees = rotationFixed ? rotationFixed.degrees : rotationDegrees;

      return base
        .map(function (point) {
          return rotatePoint(point, direction, degrees);
        })
        .map(function (point) {
          return translatePoint(point, translationVector);
        });
    },
    [
      activeTool,
      currentExample.object,
      currentExample.raster,
      data.graph.object,
      exampleIndex,
      freeDisplayMatrix,
      isSecondExample,
      isFreeExample,
      rotationDegrees,
      rotationDirection,
      rotationFixed,
      stage,
      translationVector,
    ],
  );

  const enabledArrow =
    stage === "freePlay" && activeTool === "translate"
      ? "all"
      : stage === "translateRight"
      ? "right"
      : stage === "translateDown"
        ? "down"
        : null;

  const canRotate =
    stage === "freePlay" ||
    stage === "chooseRotate" ||
    (isSecondExample && stage === "afterReflect");
  const canTranslate =
    stage === "freePlay" ||
    stage === "rotationDone" ||
    stage === "orientationDone2" ||
    activeTool === "translate";
  const canReflect =
    stage === "freePlay" ||
    (isSecondExample && stage === "reflectIntro") || activeTool === "reflect";

  const rightPanelKey =
    stage === "freePlay"
      ? "freePlay"
      : stage === "freeSuccess"
        ? currentExample.revealPanel
        : stage === "chooseRotate"
      ? "chooseRotate"
      : stage === "rotateDirection" || stage === "rotateSlider"
        ? isSecondExample
          ? "rotatePrompt2"
          : "rotatePrompt"
        : stage === "wrongRotation"
          ? "wrongRotation"
          : stage === "reflectIntro"
            ? "reflectIntro"
            : stage === "reflectPrompt"
              ? "reflectPrompt"
              : stage === "afterReflect"
                ? "afterReflect"
                : stage === "rotateAgainDirection"
                  ? "rotateAgainPrompt"
                  : stage === "rotateAgainSlider"
                    ? "rotateAgainDrag"
                    : stage === "rotationDone"
                      ? "rotationDone"
                      : stage === "orientationDone2"
                        ? "orientationDone2"
                        : stage === "translateDown"
                          ? "translateDown"
                          : stage === "success"
                            ? currentExample.successPanel
                            : stage === "reveal"
                              ? currentExample.revealPanel
                              : "translateRight";

  const activeNudgeId =
    stage === "start"
      ? "start-button"
      : stage === "chooseRotate"
        ? "tool-rotate"
        : stage === "rotateDirection" || stage === "rotateAgainDirection"
          ? "rotate-cw"
          : stage === "wrongRotation"
            ? "reset-button"
            : stage === "reflectIntro"
              ? "tool-reflect"
              : stage === "reflectPrompt"
                ? "reflect-y"
                : stage === "afterReflect"
                  ? "tool-rotate"
                  : stage === "rotationDone" || stage === "orientationDone2"
                    ? "tool-translate"
                    : stage === "success"
                      ? "reveal-button"
                      : stage === "reveal" || stage === "freeSuccess"
                        ? "next-button"
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
    [activeNudgeId, stage, activeTool, sliderPulse, translationVector],
  );

  const showHistoryBox =
    (historyEntries.length > 0 &&
      stage !== "success" &&
      stage !== "reveal" &&
      stage !== "freeSuccess") ||
    stage === "freePlay";
  const tokens = { rotationAmount: rotationAmountText };
  const isCorrectStage =
    stage === "rotationDone" ||
    stage === "orientationDone2" ||
    stage === "success" ||
    stage === "reveal";
  const isFreeSuccess = stage === "freeSuccess";
  const rasterScene =
    isFreeExample && currentExample.raster
      ? {
          ...currentExample.raster,
          targetMatrix: currentExample.targetMatrix,
          cloneMatrix: freeDisplayMatrix,
          showClone: !isIdentityMatrix(freeDisplayMatrix) || isFreeSuccess,
          cloneIsCorrect: isFreeSuccess,
        }
      : null;

  if (stage === "start") {
    return React.createElement(
      "div",
      { className: "applet-container transformation-applet fullscreen-stage" },
      React.createElement(Fullscreen, {
        heading: data.panels.start.heading,
        text: richLinesToHtml(data.panels.start.lines, tokens),
        buttonText: labels.start,
        onButtonClick: handleStart,
        buttonId: "start-button",
      }),
      React.createElement(Nudge, {
        show: Boolean(nudgeRect),
        position: nudgeRect,
      }),
    );
  }

  if (stage === "step3Pending") {
    return React.createElement(
      "div",
      { className: "applet-container transformation-applet fullscreen-stage" },
      React.createElement(Fullscreen, {
        heading: data.panels.step3Pending.heading,
        text: richLinesToHtml(data.panels.step3Pending.lines, tokens),
        buttonText: labels.next,
        onButtonClick: handleNext,
        buttonId: "next-button",
      }),
    );
  }

  if (stage === "completed") {
    return React.createElement(
      "div",
      { className: "applet-container transformation-applet fullscreen-stage" },
      React.createElement(Fullscreen, {
        heading: data.panels.completed.heading,
        text: richLinesToHtml(data.panels.completed.lines, tokens),
        buttonText: labels.startOver,
        onButtonClick: handleStartOver,
        buttonId: "start-over-button",
      }),
    );
  }

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
            objectVertices: currentExample.object || data.graph.object,
            imageVertices: currentExample.image || data.graph.image,
            cloneVertices: cloneVertices,
            cloneIsCorrect: isCorrectStage || isFreeSuccess,
            cloneStatus: stage === "wrongRotation" ? "wrong" : null,
            cloneMotionClass: stage === "afterReflect" ? "is-flipping" : "",
            imageIsCorrect: isCorrectStage || isFreeSuccess,
            showVerticalGuides: showVerticalGuides,
            reflectionAxis:
              isSecondExample &&
              (stage === "afterReflect" ||
                stage === "rotateAgainDirection" ||
                stage === "rotateAgainSlider")
                ? "y"
                : null,
            rasterScene: rasterScene,
          }),
        ),
        React.createElement(Controls, {
          activeTool: activeTool,
          stage:
            stage === "freePlay"
              ? "freePlay"
              : stage === "freeSuccess"
                ? "freeSuccess"
                : stage === "rotateAgainDirection"
                  ? "rotateDirection"
                  : stage === "rotateAgainSlider"
                    ? "rotateSlider"
                    : stage,
          rotationDirection: rotationDirection,
          rotationDegrees: rotationDegrees,
        sliderPulse: sliderPulse,
          translationVector: translationVector,
          enabledArrow: enabledArrow,
          canRotate: canRotate,
          canReflect: canReflect,
          canTranslate: canTranslate,
          reflectionAxis: reflectionAxis,
          enabledDirection: isSecondExample ? "cw" : null,
          enabledReflectAxis: isSecondExample ? "y" : null,
          onToolClick: handleToolClick,
          onDirection: handleDirection,
          onSliderChange: handleSliderChange,
          onSliderCommit: completeRotationIfCorrect,
          onReflect: handleReflect,
          onMove: handleMove,
        }),
      ),
      React.createElement(RightPanel, {
        stage:
          stage === "orientationDone2"
            ? "rotationDone"
            : stage === "freeSuccess"
              ? "reveal"
              : stage,
        panel: data.panels[rightPanelKey],
        tokens: tokens,
        historyEntries: historyEntries,
        showHistoryBox: showHistoryBox,
        revealHeading: data.panels[currentExample.successPanel].heading,
        action: stage === "wrongRotation" || stage === "freePlay" ? "reset" : null,
        onReveal: handleReveal,
        onNext: handleNext,
        onReset: handleReset,
      }),
    ),
    React.createElement(Nudge, { show: Boolean(nudgeRect), position: nudgeRect }),
  );
};
