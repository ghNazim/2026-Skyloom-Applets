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
    x:
      vertices.reduce(function (sum, point) {
        return sum + point.x;
      }, 0) / vertices.length,
    y:
      vertices.reduce(function (sum, point) {
        return sum + point.y;
      }, 0) / vertices.length,
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

function getTranslationHint(current, expected) {
  if (!current || !expected) return null;
  const dx = expected.x - current.x;
  const dy = expected.y - current.y;
  if (dx === 0 && dy === 0) return null;
  if (Math.abs(dx) >= Math.abs(dy) && dx !== 0) {
    return dx < 0 ? "left" : "right";
  }
  if (dy !== 0) {
    return dy < 0 ? "down" : "up";
  }
  return null;
}

function findMatchingVertexIndex(objectVerts, imageVerts, translation, tolerance) {
  const eps = tolerance == null ? 0.05 : tolerance;
  for (let i = 0; i < objectVerts.length; i++) {
    const moved = translatePoint(objectVerts[i], translation);
    if (
      Math.abs(moved.x - imageVerts[i].x) <= eps &&
      Math.abs(moved.y - imageVerts[i].y) <= eps
    ) {
      return i;
    }
  }
  return -1;
}

function getNearestVertexTranslation(objectVerts, imageVerts, current) {
  let best = null;
  let bestDist = Infinity;
  for (let i = 0; i < objectVerts.length; i++) {
    const expected = {
      x: imageVerts[i].x - objectVerts[i].x,
      y: imageVerts[i].y - objectVerts[i].y,
    };
    const dist =
      Math.abs(expected.x - current.x) + Math.abs(expected.y - current.y);
    if (dist < bestDist) {
      bestDist = dist;
      best = expected;
    }
  }
  return best;
}

function getCorrectRotationSnap(direction, degrees) {
  if (!direction) return null;
  if (direction === "acw" && Math.abs(degrees - 90) <= 5) {
    return { degrees: 90, direction: "acw" };
  }
  if (direction === "cw" && Math.abs(degrees - 270) <= 5) {
    return { degrees: 270, direction: "cw" };
  }
  return null;
}

function postMcqStage(choice) {
  return choice === "translateFirst" ? "stepB3" : "stepA3";
}

function postMcqStage2(choice) {
  return choice === "rotateFirstDilate" ? "step5B" : "step5A";
}

function rotatePointAboutOrigin(point, degrees, direction) {
  const rad = (degrees * Math.PI) / 180;
  const angle = direction === "acw" ? rad : -rad;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return normalizePoint({
    x: point.x * cos - point.y * sin,
    y: point.x * sin + point.y * cos,
  });
}

function rotateVertices(vertices, degrees, direction) {
  if (!direction) return vertices;
  return vertices.map(function (point) {
    return rotatePointAboutOrigin(point, degrees, direction);
  });
}

function isPhase2Stage(stage) {
  return (
    [
      "step4",
      "step5A",
      "step5B",
      "p2DilateSlider",
      "p2DilateSuccess",
      "p2RotateActive",
      "p2SuccessA",
      "p2RotateBActive",
      "p2RotateBSuccess",
      "p2DilateBIntro",
      "p2DilateBSlider",
      "p2SuccessB",
      "reveal2Panel",
    ].indexOf(stage) !== -1
  );
}

const App = () => {
  const { useState, useMemo, useEffect, useCallback, useRef } = React;
  const data = APP_DATA;
  const graphConfig = data.graph;
  const graph2Config = data.graph2;
  const rightAngleIndex = graphConfig.rightAngleIndex;
  const originPoint = { x: 0, y: 0 };

  const [stage, setStage] = useState("step1");
  const [activeTool, setActiveTool] = useState(null);
  const [mcqChoice, setMcqChoice] = useState(null);
  const [mcqCollapsed, setMcqCollapsed] = useState(false);
  const [flowPath, setFlowPath] = useState(null);
  const [completedPaths, setCompletedPaths] = useState({
    dilateFirst: false,
    translateFirst: false,
  });
  const [completedPaths2, setCompletedPaths2] = useState({
    dilateFirstRotate: false,
    rotateFirstDilate: false,
  });
  const [rotationDirection, setRotationDirection] = useState(null);
  const [rotationDegrees, setRotationDegrees] = useState(0);
  const [rotationCorrect, setRotationCorrect] = useState(false);
  const [cloneIsWrong, setCloneIsWrong] = useState(false);
  const [dilationCenter, setDilationCenter] = useState(null);
  const [scaleFactor, setScaleFactor] = useState(1);
  const [dilationCorrect, setDilationCorrect] = useState(false);
  const [showDilationClones, setShowDilationClones] = useState(false);
  const [translationVector, setTranslationVector] = useState({ x: 0, y: 0 });
  const [translatePhase, setTranslatePhase] = useState("left");
  const [matchedVertexIndex, setMatchedVertexIndex] = useState(null);
  const [historyEntries, setHistoryEntries] = useState([]);
  const [sliderPulse, setSliderPulse] = useState(false);
  const [isDilateDragging, setIsDilateDragging] = useState(false);
  const [hintArrow, setHintArrow] = useState(null);
  const [nudgeRect, setNudgeRect] = useState(null);
  const mcqTransitionDoneRef = useRef(false);
  const mcqChoiceRef = useRef(null);
  const translateIdleTimerRef = useRef(null);

  const isPhase2 = isPhase2Stage(stage);
  const activeGraph = isPhase2 ? graph2Config : graphConfig;
  const objectVertices = activeGraph.object;
  const imageVertices = activeGraph.image;
  const correctScale = activeGraph.correctScale;
  const correctRotation = graph2Config.correctRotation;
  const correctRotDir = graph2Config.rotationDirection;

  const resetFlowState = useCallback(function () {
    setActiveTool(null);
    setDilationCenter(null);
    setScaleFactor(1);
    setDilationCorrect(false);
    setShowDilationClones(false);
    setTranslationVector({ x: 0, y: 0 });
    setTranslatePhase("left");
    setMatchedVertexIndex(null);
    setHistoryEntries([]);
    setSliderPulse(false);
    setIsDilateDragging(false);
    setHintArrow(null);
    setFlowPath(null);
    setMcqChoice(null);
    setMcqCollapsed(false);
    mcqTransitionDoneRef.current = false;
  }, []);

  const resetFlowState2 = useCallback(function () {
    setActiveTool(null);
    setDilationCenter(null);
    setScaleFactor(1);
    setDilationCorrect(false);
    setShowDilationClones(false);
    setRotationDirection(null);
    setRotationDegrees(0);
    setRotationCorrect(false);
    setCloneIsWrong(false);
    setHistoryEntries([]);
    setSliderPulse(false);
    setIsDilateDragging(false);
    setHintArrow(null);
    setFlowPath(null);
    setMcqChoice(null);
    setMcqCollapsed(false);
    mcqTransitionDoneRef.current = false;
  }, []);

  const resetAll = useCallback(function () {
    resetFlowState();
    resetFlowState2();
    setCompletedPaths({ dilateFirst: false, translateFirst: false });
    setCompletedPaths2({
      dilateFirstRotate: false,
      rotateFirstDilate: false,
    });
    setStage("step1");
  }, [resetFlowState, resetFlowState2]);

  const isPathB = flowPath === "translateFirst";
  const isPathB2 = flowPath === "rotateFirstDilate";

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
      return getNearestVertexTranslation(
        objectVertices,
        imageVertices,
        translationVector,
      );
    },
    [imageVertices, objectVertices, translationVector],
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
      if (isPhase2) {
        const showStages = [
          "p2DilateSlider",
          "p2DilateSuccess",
          "p2RotateActive",
          "p2SuccessA",
          "p2RotateBActive",
          "p2RotateBSuccess",
          "p2DilateBIntro",
          "p2DilateBSlider",
          "p2SuccessB",
          "reveal2Panel",
        ];
        if (showStages.indexOf(stage) === -1) return null;

        if (!isPathB2) {
          if (stage === "p2DilateSlider") {
            return dilateVertices(objectVertices, originPoint, scaleFactor);
          }

          const dilatedAtCorrect = dilateVertices(
            objectVertices,
            originPoint,
            correctScale,
          );

          if (
            stage === "p2SuccessA" ||
            stage === "reveal2Panel"
          ) {
            if (rotationDirection && rotationDegrees) {
              return rotateVertices(
                dilatedAtCorrect,
                rotationDegrees,
                rotationDirection,
              );
            }
            return rotateVertices(
              dilatedAtCorrect,
              correctRotation,
              correctRotDir,
            );
          }

          if (stage === "p2DilateSuccess") {
            return dilatedAtCorrect;
          }

          const dilatedBase =
            dilationCorrect || stage === "p2RotateActive"
              ? dilatedAtCorrect
              : dilateVertices(objectVertices, originPoint, scaleFactor);

          if (!rotationDirection) {
            return dilatedBase;
          }

          return rotateVertices(
            dilatedBase,
            rotationDegrees,
            rotationDirection,
          );
        }

        const rotatedAtCorrect =
          rotationCorrect && rotationDirection
            ? rotateVertices(
                objectVertices,
                rotationDegrees,
                rotationDirection,
              )
            : rotateVertices(
                objectVertices,
                correctRotation,
                correctRotDir,
              );

        if (stage === "p2RotateBActive") {
          if (!rotationDirection) return null;
          return rotateVertices(
            objectVertices,
            rotationDegrees,
            rotationDirection,
          );
        }

        if (
          stage === "p2RotateBSuccess" ||
          stage === "p2DilateBIntro"
        ) {
          return rotatedAtCorrect;
        }

        if (stage === "p2DilateBSlider") {
          return dilateVertices(
            rotatedAtCorrect,
            originPoint,
            scaleFactor,
          );
        }

        if (stage === "p2SuccessB" || stage === "reveal2Panel") {
          return dilateVertices(
            rotatedAtCorrect,
            originPoint,
            correctScale,
          );
        }

        return null;
      }

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
            (matchedVertexIndex != null
              ? translatedObjectVertices[matchedVertexIndex]
              : translatedObjectVertices[rightAngleIndex]);
          return dilateVertices(
            translatedObjectVertices,
            center,
            correctScale,
          );
        }

        if (stage === "dilateBSlider") {
          const center =
            dilationCenter ||
            (matchedVertexIndex != null
              ? translatedObjectVertices[matchedVertexIndex]
              : translatedObjectVertices[rightAngleIndex]);
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
      correctRotDir,
      correctRotation,
      correctScale,
      dilatedBaseVertices,
      dilationCenter,
      dilationCorrect,
      isPathB,
      isPathB2,
      isPhase2,
      matchedVertexIndex,
      objectVertices,
      rightAngleIndex,
      rotationDegrees,
      rotationDirection,
      rotationCorrect,
      scaleFactor,
      showDilationClones,
      stage,
      translatedObjectVertices,
      translationVector,
    ],
  );

  const clone2Vertices = useMemo(
    function () {
      if (isPhase2) {
        if (
          isPathB2 ||
          !showDilationClones ||
          stage !== "p2DilateSlider"
        ) {
          return null;
        }
        if (!dilationCenter) return null;
        const dilated = dilateVertices(
          objectVertices,
          dilationCenter,
          scaleFactor,
        );
        const rotatedDilated = rotateVertices(
          dilated,
          correctRotation,
          correctRotDir,
        );
        const imageCenter = triangleCentroid(imageVertices);
        return offsetCloneToCentroid(rotatedDilated, imageCenter);
      }

      if (isPathB || !showDilationClones || stage !== "dilateSlider") {
        return null;
      }
      if (!dilatedBaseVertices) return null;
      const imageCenter = triangleCentroid(imageVertices);
      return offsetCloneToCentroid(dilatedBaseVertices, imageCenter);
    },
    [
      correctRotDir,
      correctRotation,
      dilatedBaseVertices,
      dilationCenter,
      imageVertices,
      isPathB,
      isPathB2,
      isPhase2,
      objectVertices,
      scaleFactor,
      showDilationClones,
      stage,
    ],
  );

  const dilationLineVertices = useMemo(
    function () {
      if (
        isPhase2 &&
        (stage === "p2DilateSlider" || stage === "p2DilateBSlider")
      ) {
        if (isPathB2 && stage === "p2DilateBSlider") {
          return rotateVertices(
            objectVertices,
            correctRotation,
            correctRotDir,
          );
        }
        return objectVertices;
      }
      if (isPathB && (stage === "dilateBSlider" || stage === "translateSuccessB")) {
        return translatedObjectVertices;
      }
      if (!isPathB && stage === "dilateSlider" && dilationCenter) {
        return objectVertices;
      }
      return null;
    },
    [
      correctRotDir,
      correctRotation,
      dilationCenter,
      isPathB,
      isPhase2,
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
    if ((stage !== "step2" && stage !== "step4") || mcqCollapsed) return;
    if (stage === "step2") {
      if (choice === "dilateFirst" && completedPaths.dilateFirst) return;
      if (choice === "translateFirst" && completedPaths.translateFirst) return;
    }
    if (stage === "step4") {
      if (choice === "dilateFirstRotate" && completedPaths2.dilateFirstRotate) {
        return;
      }
      if (choice === "rotateFirstDilate" && completedPaths2.rotateFirstDilate) {
        return;
      }
    }
    play("click");
    mcqChoiceRef.current = choice;
    setFlowPath(choice);
    setMcqChoice(choice);
    setMcqCollapsed(true);
    mcqTransitionDoneRef.current = false;
  };

  const advanceAfterMcq = useCallback(function () {
    const choice = mcqChoiceRef.current;
    if (choice === "dilateFirstRotate" || choice === "rotateFirstDilate") {
      setStage(postMcqStage2(choice));
      return;
    }
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
      setMatchedVertexIndex(null);
      setDilationCenter(null);
      setStage("translateBActive");
      return;
    }

    if (tool === "dilate" && stage === "dilateBIntro") {
      const anchorIndex =
        matchedVertexIndex != null ? matchedVertexIndex : rightAngleIndex;
      const anchor =
        dilationCenter ||
        translatePoint(objectVertices[anchorIndex], translationVector);
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

    if (tool === "dilate" && stage === "step5A") {
      setDilationCenter(originPoint);
      setActiveTool("dilate");
      setScaleFactor(1);
      setDilationCorrect(false);
      setShowDilationClones(false);
      setSliderPulse(true);
      setStage("p2DilateSlider");
      return;
    }

    if (tool === "rotate" && stage === "step5B") {
      setActiveTool("rotate");
      setRotationDirection(null);
      setRotationDegrees(0);
      setRotationCorrect(false);
      setCloneIsWrong(false);
      setStage("p2RotateBActive");
      return;
    }

    if (tool === "rotate" && stage === "p2DilateSuccess") {
      setActiveTool("rotate");
      setRotationDirection(null);
      setRotationDegrees(0);
      setRotationCorrect(false);
      setCloneIsWrong(false);
      setSliderPulse(false);
      setStage("p2RotateActive");
      return;
    }

    if (tool === "dilate" && stage === "p2DilateBIntro") {
      setDilationCenter(originPoint);
      setActiveTool("dilate");
      setScaleFactor(1);
      setDilationCorrect(false);
      setShowDilationClones(false);
      setSliderPulse(true);
      setStage("p2DilateBSlider");
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
    if (
      stage !== "dilateSlider" &&
      stage !== "dilateBSlider" &&
      stage !== "p2DilateSlider" &&
      stage !== "p2DilateBSlider"
    ) {
      return;
    }
    setShowDilationClones(true);
    setIsDilateDragging(true);
    setSliderPulse(false);
    setScaleFactor(value);
  };

  const handleScaleDragStart = function () {
    setSliderPulse(false);
    setShowDilationClones(true);
    setIsDilateDragging(true);
  };

  const handleScaleCommit = function () {
    if (
      stage !== "dilateSlider" &&
      stage !== "dilateBSlider" &&
      stage !== "p2DilateSlider" &&
      stage !== "p2DilateBSlider"
    ) {
      return;
    }
    setIsDilateDragging(false);
    const next = scaleFactor;
    const targetScale = isPhase2 ? correctScale : correctScale;
    if (Math.abs(next - targetScale) > 0.1) {
      setScaleFactor(next);
      return;
    }

    play(
      stage === "dilateBSlider" || stage === "p2DilateBSlider"
        ? "congrats"
        : "correct",
    );
    setScaleFactor(targetScale);
    setDilationCorrect(true);
    setSliderPulse(false);

    if (stage === "p2DilateBSlider") {
      updateHistory(
        "dilation",
        formatTemplate(data.history.dilation, { k: targetScale }),
      );
      setStage("p2SuccessB");
      return;
    }

    if (stage === "p2DilateSlider") {
      updateHistory(
        "dilation",
        formatTemplate(data.history.dilation, { k: targetScale }),
      );
      setShowDilationClones(true);
      setDilationCorrect(true);
      setStage("p2DilateSuccess");
      return;
    }

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
    if (!dilatedBaseVertices) return;

    setTranslationVector(function (current) {
      const delta =
        direction === "left"
          ? { x: -1, y: 0 }
          : direction === "right"
            ? { x: 1, y: 0 }
            : direction === "up"
              ? { x: 0, y: 1 }
              : direction === "down"
                ? { x: 0, y: -1 }
                : { x: 0, y: 0 };
      const next = {
        x: current.x + delta.x,
        y: current.y + delta.y,
      };

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
        setTranslatePhase("done");
        setHintArrow(null);
      }

      return next;
    });
  };

  const handleMoveB = function (direction) {
    setTranslationVector(function (current) {
      const delta =
        direction === "left"
          ? { x: -1, y: 0 }
          : direction === "right"
            ? { x: 1, y: 0 }
            : direction === "up"
              ? { x: 0, y: 1 }
              : direction === "down"
                ? { x: 0, y: -1 }
                : { x: 0, y: 0 };
      const next = {
        x: current.x + delta.x,
        y: current.y + delta.y,
      };

      updateHistory(
        "translation",
        formatTemplate(data.history.translation, {
          x: next.x,
          y: next.y,
        }),
      );

      const matchIndex = findMatchingVertexIndex(
        objectVertices,
        imageVertices,
        next,
      );

      if (matchIndex !== -1) {
        play("correct");
        setMatchedVertexIndex(matchIndex);
        setDilationCenter(imageVertices[matchIndex]);
        setActiveTool(null);
        setStage("dilateBIntro");
        setTranslatePhase("done");
        setHintArrow(null);
      }

      return next;
    });
  };

  const clearTranslateIdleTimer = useCallback(function () {
    if (translateIdleTimerRef.current) {
      window.clearTimeout(translateIdleTimerRef.current);
      translateIdleTimerRef.current = null;
    }
  }, []);

  const scheduleTranslateHint = useCallback(
    function () {
      clearTranslateIdleTimer();
      setHintArrow(null);
      if (stage !== "translateActive" && stage !== "translateBActive") {
        return;
      }
      translateIdleTimerRef.current = window.setTimeout(function () {
        const expected =
          stage === "translateBActive"
            ? expectedBTranslation
            : expectedTranslation;
        setHintArrow(getTranslationHint(translationVector, expected));
      }, 5000);
    },
    [
      clearTranslateIdleTimer,
      expectedBTranslation,
      expectedTranslation,
      stage,
      translationVector,
    ],
  );

  const handleMove = function (direction) {
    if (activeTool !== "translate") return;
    if (stage === "translateActive") {
      play("click");
      setHintArrow(null);
      handleMoveA(direction);
      scheduleTranslateHint();
      return;
    }
    if (stage === "translateBActive") {
      play("click");
      setHintArrow(null);
      handleMoveB(direction);
      scheduleTranslateHint();
    }
  };

  useEffect(
    function () {
      if (stage === "translateActive" || stage === "translateBActive") {
        scheduleTranslateHint();
        return function () {
          clearTranslateIdleTimer();
        };
      }
      clearTranslateIdleTimer();
      setHintArrow(null);
    },
    [clearTranslateIdleTimer, scheduleTranslateHint, stage],
  );

  const handleDirection = function (direction) {
    if (activeTool !== "rotate") return;
    play("click");
    setRotationDirection(direction);
    setCloneIsWrong(false);
    setSliderPulse(true);
  };

  const handleRotationChange = function (value) {
    if (stage !== "p2RotateActive" && stage !== "p2RotateBActive") return;
    setRotationDegrees(value);
    setSliderPulse(false);
    setCloneIsWrong(false);
  };

  const handleRotationDragStart = function () {
    setSliderPulse(false);
  };

  const handleRotationCommit = function () {
    if (stage !== "p2RotateActive" && stage !== "p2RotateBActive") return;
    if (!rotationDirection) return;

    const snapped = getCorrectRotationSnap(
      rotationDirection,
      rotationDegrees,
    );

    if (!snapped) {
      play("wrong");
      setCloneIsWrong(true);
      setSliderPulse(true);
      return;
    }

    play("congrats");
    setRotationDirection(snapped.direction);
    setRotationDegrees(snapped.degrees);
    setRotationCorrect(true);
    setCloneIsWrong(false);
    setSliderPulse(false);
    updateHistory(
      "rotation",
      formatTemplate(data.history.rotation, {
        degrees: snapped.degrees,
        direction:
          snapped.direction === "acw"
            ? data.labels.anticlockwise
            : data.labels.clockwise,
      }),
    );

    if (stage === "p2RotateActive") {
      setStage("p2SuccessA");
      return;
    }

    setActiveTool(null);
    setStage("p2DilateBIntro");
  };

  const handleReveal = function () {
    play("click");
    if (flowPath) {
      if (isPhase2) {
        setCompletedPaths2(function (prev) {
          return { ...prev, [flowPath]: true };
        });
      } else {
        setCompletedPaths(function (prev) {
          return { ...prev, [flowPath]: true };
        });
      }
    }
    setMcqChoice(null);
    setMcqCollapsed(false);
    setStage(isPhase2 ? "reveal2Panel" : "revealPanel");
  };

  const handleNext = function () {
    play("click");
    if (stage === "revealPanel") {
      const bothDone =
        completedPaths.dilateFirst && completedPaths.translateFirst;
      resetFlowState();
      setStage(bothDone ? "step4" : "step2");
      return;
    }
    if (stage === "reveal2Panel") {
      const bothDone2 =
        completedPaths2.dilateFirstRotate &&
        completedPaths2.rotateFirstDilate;
      resetFlowState2();
      setStage(bothDone2 ? "step6" : "step4");
    }
  };

  const handleStartOver = function () {
    play("click");
    resetAll();
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
      if (stage === "step5A") return "step5A";
      if (stage === "step5B") return "step5B";
      if (stage === "p2DilateSlider") return "p2DilateSlider";
      if (stage === "p2DilateSuccess") return "p2DilateSuccess";
      if (stage === "p2RotateActive") return "p2RotateActive";
      if (stage === "p2SuccessA") return "p2SuccessA";
      if (stage === "p2RotateBActive") return "p2RotateBActive";
      if (stage === "p2RotateBSuccess") return "p2RotateBSuccess";
      if (stage === "p2DilateBIntro") return "p2DilateBIntro";
      if (stage === "p2DilateBSlider") return "p2DilateBSlider";
      if (stage === "p2SuccessB") return "p2SuccessB";
      if (stage === "reveal2Panel") return "reveal2Panel";
      if (stage === "step6") return "step6";
      return "step1";
    },
    [stage],
  );

  const panel = useMemo(
    function () {
      const base = data.panels[rightPanelKey];
      if (stage === "revealPanel") {
        const bothDone =
          completedPaths.dilateFirst && completedPaths.translateFirst;
        return {
          ...base,
          lines: bothDone ? base.linesBothDone : base.lines,
        };
      }
      if (stage === "reveal2Panel") {
        const bothDone =
          completedPaths2.dilateFirstRotate &&
          completedPaths2.rotateFirstDilate;
        return {
          ...base,
          lines: bothDone ? base.linesBothDone : base.lines,
        };
      }
      return base;
    },
    [completedPaths, completedPaths2, data.panels, rightPanelKey, stage],
  );

  const footerText = useMemo(
    function () {
      if (
        stage === "translateSuccess" ||
        stage === "translateSuccessB" ||
        stage === "revealPanel" ||
        stage === "translateBSuccess" ||
        stage === "p2SuccessA" ||
        stage === "p2SuccessB" ||
        stage === "reveal2Panel" ||
        stage === "p2RotateBSuccess"
      ) {
        return "";
      }
      if (
        stage === "step2" &&
        (completedPaths.dilateFirst || completedPaths.translateFirst)
      ) {
        return data.panels.step2.footerReturn || panel.footer || "";
      }
      if (
        stage === "step4" &&
        (completedPaths2.dilateFirstRotate ||
          completedPaths2.rotateFirstDilate)
      ) {
        return data.panels.step4.footerReturn || panel.footer || "";
      }
      return panel.footer || "";
    },
    [completedPaths, completedPaths2, data.panels.step2, data.panels.step4, panel, stage],
  );

  const footerAction =
    stage === "translateSuccess" ||
    stage === "translateSuccessB" ||
    stage === "p2SuccessA" ||
    stage === "p2SuccessB"
      ? "reveal"
      : stage === "revealPanel" || stage === "reveal2Panel"
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
          : stage === "step4" &&
              completedPaths2.dilateFirstRotate &&
              !completedPaths2.rotateFirstDilate
            ? "mcq-rotate-first-dilate"
            : stage === "step4" &&
                completedPaths2.rotateFirstDilate &&
                !completedPaths2.dilateFirstRotate
              ? "mcq-dilate-first-rotate"
              : stage === "stepA3"
                ? "tool-dilate"
                : stage === "stepB3"
                  ? "tool-translate"
                  : stage === "dilateBIntro" || stage === "p2DilateBIntro"
                    ? "tool-dilate"
                    : stage === "dilateSuccess"
                      ? "tool-translate"
                      : stage === "step5A"
                        ? "tool-dilate"
                        : stage === "step5B"
                          ? "tool-rotate"
                          : stage === "p2DilateSuccess"
                            ? "tool-rotate"
                            : stage === "p2RotateActive" ||
                                stage === "p2RotateBActive"
                              ? rotationDirection
                                ? null
                                : "rotate-acw"
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
    [activeNudgeId, stage, sliderPulse, scaleFactor, rotationDegrees, rotationDirection],
  );

  const enabledArrow =
    stage === "translateActive" || stage === "translateBActive"
      ? "all"
      : null;

  const showHistoryBox = false;

  const showDilationLines =
    isDilateDragging &&
    (stage === "dilateSlider" ||
      stage === "dilateBSlider" ||
      stage === "p2DilateSlider" ||
      stage === "p2DilateBSlider");
  const showDilationAnchor =
    dilationCenter &&
    (stage === "dilateSlider" ||
      stage === "dilateSuccess" ||
      stage === "dilateBSlider" ||
      stage === "translateSuccessB" ||
      stage === "p2DilateSlider" ||
      stage === "p2DilateSuccess" ||
      stage === "p2DilateBSlider" ||
      stage === "p2SuccessB");
  const showClone2 =
    (!isPathB && stage === "dilateSlider" && showDilationClones) ||
    (!isPathB2 && stage === "p2DilateSlider" && showDilationClones);
  const cloneIsCorrect =
    (dilationCorrect &&
      (stage === "dilateSlider" ||
        stage === "dilateSuccess" ||
        stage === "dilateBSlider" ||
        stage === "p2DilateSlider" ||
        stage === "p2DilateSuccess" ||
        stage === "p2DilateBSlider")) ||
    rotationCorrect ||
    stage === "translateSuccess" ||
    stage === "translateSuccessB" ||
    stage === "p2SuccessA" ||
    stage === "p2SuccessB" ||
    stage === "revealPanel" ||
    stage === "reveal2Panel";
  const clone2IsCorrect =
    dilationCorrect && ((!isPathB && !isPhase2) || (!isPathB2 && isPhase2));

  const imageIsCorrect =
    stage === "translateSuccess" ||
    stage === "translateSuccessB" ||
    stage === "revealPanel" ||
    stage === "p2SuccessA" ||
    stage === "p2SuccessB" ||
    stage === "reveal2Panel";

  if (stage === "step6") {
    return React.createElement(
      "div",
      { className: "applet-container transformation-applet fullscreen-stage" },
      React.createElement(Fullscreen, {
        heading: data.panels.step6.heading,
        text: data.panels.step6.text,
        buttonText: data.labels.startOver,
        buttonId: "start-over-button",
        onButtonClick: handleStartOver,
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
            objectVertices: objectVertices,
            imageVertices: imageVertices,
            cloneVertices: cloneVertices,
            clone2Vertices: showClone2 ? clone2Vertices : null,
            cloneIsCorrect: cloneIsCorrect,
            clone2IsCorrect: clone2IsCorrect,
            cloneIsWrong: cloneIsWrong,
            imageIsCorrect: imageIsCorrect,
            graphConfig: activeGraph,
            dilationAnchor: showDilationAnchor ? dilationCenter : null,
            dilationLines: showDilationLines ? dilationLineVertices : null,
            vertexPickers:
              stage === "dilateVertexPick" ? objectVertices : null,
            onVertexPick: handleVertexPick,
          }),
        ),
        React.createElement(Controls, {
          activeTool: activeTool,
          stage: stage,
          rotationDirection: rotationDirection,
          rotationDegrees: rotationDegrees,
          scaleFactor: scaleFactor,
          sliderPulse: sliderPulse,
          translationVector: translationVector,
          enabledArrow: enabledArrow,
          hintArrow: hintArrow,
          canRotate:
            stage === "step5B" ||
            stage === "p2DilateSuccess" ||
            stage === "p2RotateActive" ||
            stage === "p2RotateBActive",
          canReflect: false,
          canTranslate: stage === "dilateSuccess" || stage === "stepB3",
          canDilate:
            stage === "stepA3" ||
            stage === "dilateBIntro" ||
            stage === "step5A" ||
            stage === "p2DilateBIntro",
          reflectionAxis: null,
          enabledDirection: null,
          dilateMax: 3,
          rotationLocked:
            stage === "p2SuccessA" || stage === "p2RotateBSuccess",
          toolsHidden: stage === "step1",
          mainControlsHidden: stage === "dilateOptions",
          showStartButton: stage === "step1",
          showDilateOptions: stage === "dilateOptions",
          onStartClick: handleStart,
          onDilateOption: handleDilateOption,
          onToolClick: handleToolClick,
          onDirection: handleDirection,
          onSliderChange: handleRotationChange,
          onSliderDragStart: handleRotationDragStart,
          onSliderCommit: handleRotationCommit,
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
          stage === "reveal2Panel"
            ? flowPath === "rotateFirstDilate"
              ? data.panels.p2SuccessB.heading
              : data.panels.p2SuccessA.heading
            : stage === "translateSuccessB"
              ? data.panels.translateSuccessB.heading
              : stage === "p2SuccessB"
                ? data.panels.p2SuccessB.heading
                : stage === "p2SuccessA"
                  ? data.panels.p2SuccessA.heading
                  : data.panels.translateSuccess.heading,
        mcqChoice: mcqChoice,
        mcqCollapsed: mcqCollapsed,
        mcqMode: isPhase2 || stage === "step4" ? "phase2" : "phase1",
        completedPaths:
          isPhase2 || stage === "step4" ? completedPaths2 : completedPaths,
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
