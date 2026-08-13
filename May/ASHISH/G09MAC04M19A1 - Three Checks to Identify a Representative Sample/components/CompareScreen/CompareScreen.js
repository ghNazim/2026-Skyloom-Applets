const CompareScreen = React.forwardRef((props, ref) => {
  const {
    stepConfig = { type: "charts", stepData: {} },
    completed = {},
    answers = {},
    feedback = "",
    onChoose,
    onDraw,
    onFormulaTap,
    onQuizAnswer,
    onFinalChoice,
    onVisualStateChange,
    handleStartOver,
    startOverButtonRef,
  } = props || {};
  const stepData = stepConfig.stepData || {};
  const isEndStep = stepConfig.type === "end";
  const datasets = T.datasets;
  const tests = ["shape", "centre", "spread"];
  const samples = ["sample1", "sample2"];
  const [formulaFlight, setFormulaFlight] = React.useState(null);
  const [animState, setAnimState] = React.useState({
    activeBar: null,
    freqLabelBar: null,
    expression: "",
    runningTotal: "",
    lineY: null,
  });

  const [introAnimStage, setIntroAnimStage] = React.useState("idle");
  const [finalIntroStage, setFinalIntroStage] = React.useState("idle");
  const [drawControlCount, setDrawControlCount] = React.useState(3);
  const [calculationSceneStage, setCalculationSceneStage] =
    React.useState("ready");
  const [returningDataset, setReturningDataset] = React.useState("");
  const [answerFlight, setAnswerFlight] = React.useState(null);
  const hasAnimatedIntroRef = React.useRef(false);
  const previousSceneRef = React.useRef(null);

  React.useEffect(() => {
    setFormulaFlight(null);
    setAnimState({
      activeBar: null,
      freqLabelBar: null,
      expression: "",
      runningTotal: "",
      lineY: null,
    });

    let t1, t2, t3;
    if (stepData.id === "chooseShape" && introAnimStage === "idle") {
      if (hasAnimatedIntroRef.current) {
        setIntroAnimStage("complete");
      } else {
        hasAnimatedIntroRef.current = true;
        setIntroAnimStage("initial");
        t1 = window.setTimeout(() => {
          setIntroAnimStage("duplicate");
          t2 = window.setTimeout(() => {
            setIntroAnimStage("merge");
            t3 = window.setTimeout(() => {
              setIntroAnimStage("complete");
              if (onVisualStateChange) onVisualStateChange();
            }, 1000);
          }, 1000);
        }, 100);
      }
    } else if (stepData.id !== "chooseShape") {
      setIntroAnimStage("idle");
    }

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [stepData.id]);

  React.useEffect(() => {
    let tableTimer;
    let readyTimer;
    if (stepData.id === "finalChoice") {
      setFinalIntroStage("strip");
      tableTimer = window.setTimeout(() => {
        setFinalIntroStage("table");
        readyTimer = window.setTimeout(() => {
          setFinalIntroStage("ready");
          if (onVisualStateChange) onVisualStateChange();
        }, 700);
      }, 800);
    } else {
      setFinalIntroStage("idle");
    }
    return () => {
      window.clearTimeout(tableTimer);
      window.clearTimeout(readyTimer);
    };
  }, [stepData.id]);

  (React.useLayoutEffect || React.useEffect)(() => {
    const previous = previousSceneRef.current;
    let expandTimer;
    let isolateTimer;
    let mergeTimer;
    let handoffTimer;
    let readyTimer;
    let returnTimer;

    if (["mean", "range"].includes(stepData.type)) {
      setReturningDataset("");
      setCalculationSceneStage("anchor");
      expandTimer = window.setTimeout(
        () => setCalculationSceneStage("expanded"),
        80,
      );
      isolateTimer = window.setTimeout(
        () => setCalculationSceneStage("isolating"),
        760,
      );
      mergeTimer = window.setTimeout(
        () => setCalculationSceneStage("merging"),
        1320,
      );
      handoffTimer = window.setTimeout(
        () => setCalculationSceneStage("handoff"),
        2720,
      );
      readyTimer = window.setTimeout(() => {
        setCalculationSceneStage("ready");
        if (onVisualStateChange) onVisualStateChange();
      }, 3140);
    } else if (
      stepData.type === "choose" &&
      previous &&
      ["mean", "range"].includes(previous.type)
    ) {
      setReturningDataset(previous.dataset || "");
      returnTimer = window.setTimeout(() => setReturningDataset(""), 1320);
    } else {
      setReturningDataset("");
      setCalculationSceneStage("ready");
    }

    previousSceneRef.current = {
      id: stepData.id,
      type: stepData.type,
      dataset: stepData.dataset,
    };

    return () => {
      window.clearTimeout(expandTimer);
      window.clearTimeout(isolateTimer);
      window.clearTimeout(mergeTimer);
      window.clearTimeout(handoffTimer);
      window.clearTimeout(readyTimer);
      window.clearTimeout(returnTimer);
    };
  }, [stepData.id, stepData.type, stepData.dataset]);

  React.useEffect(() => {
    let firstTimer;
    let secondTimer;
    let thirdTimer;
    if (stepData.id === "shapeDraw" && completed.shapeDraw !== true) {
      setDrawControlCount(0);
      firstTimer = window.setTimeout(() => setDrawControlCount(1), 180);
      secondTimer = window.setTimeout(() => setDrawControlCount(2), 500);
      thirdTimer = window.setTimeout(() => setDrawControlCount(3), 820);
    } else {
      setDrawControlCount(3);
    }
    return () => {
      window.clearTimeout(firstTimer);
      window.clearTimeout(secondTimer);
      window.clearTimeout(thirdTimer);
    };
  }, [stepData.id]);

  const isDone = (id = stepData.id) => completed[id] === true;
  const partial = (id = stepData.id) =>
    completed[id] && completed[id] !== true ? completed[id] : {};
  const capitalize = (value) => value.charAt(0).toUpperCase() + value.slice(1);
  const statusText = (value) => (value ? "👍" : "👎");
  const statusClass = (value) => (value ? "result-pass" : "result-fail");
  const labelFor = (dataset) => T.ui[dataset.labelKey];
  const chartXFor = (value) => 15 + ((Number(value) - 1) / 11) * 133;
  const testIsDone = (test) =>
    completed[`${test}Quiz1`] === true && completed[`${test}Quiz2`] === true;

  const getQuizResult = (test, sample) => {
    const quizId = `${test}Quiz${sample === "sample1" ? "1" : "2"}`;
    return completed[quizId] === true ? T.testResults[test][sample] : null;
  };

  const isFormulaComplete = (type, datasetId) =>
    completed[`${type}${capitalize(datasetId)}`] === true;
  const allFormulaeComplete = (kind) =>
    ["population", "sample1", "sample2"].every((datasetId) =>
      isFormulaComplete(kind, datasetId),
    );

  const currentTest =
    stepData.test ||
    (stepData.type === "mean"
      ? "centre"
      : stepData.type === "range"
        ? "spread"
        : "");

  const runFormulaAnimation = (part) => {
    if (formulaFlight || animState.activeBar !== null) return;
    const stage = document.querySelector(".story-workspace");
    const target = document.querySelector(`[data-formula-part="${part}"]`);
    if (!stage || !target) {
      onFormulaTap(part);
      return;
    }

    const stageRect = stage.getBoundingClientRect();
    const pointFor = (element) => {
      const rect = element.getBoundingClientRect();
      return {
        x:
          ((rect.left + rect.width / 2 - stageRect.left) / window.innerWidth) *
          100,
        y:
          ((rect.top + rect.height / 2 - stageRect.top) / window.innerHeight) *
          100,
      };
    };
    const targetPoint = pointFor(target);
    const targetRect = target.getBoundingClientRect();
    const targetPointAt = (horizontalRatio) => ({
      x:
        ((targetRect.left +
          targetRect.width * horizontalRatio -
          stageRect.left) /
          window.innerWidth) *
        100,
      y: targetPoint.y,
    });
    const dataset = datasets[stepData.dataset];

    if (stepData.type === "mean" && part !== "answer") {
      const bars = dataset.bars.filter((bar) => bar.frequency > 0);
      let currentBarIdx = 0;
      let runningSum = 0;
      let runningExpr = "";

      const animateNextBar = () => {
        if (currentBarIdx >= bars.length) {
          onFormulaTap(part);
          setAnimState({
            activeBar: null,
            freqLabelBar: null,
            expression: "",
            runningTotal: "",
            lineY: null,
          });
          setFormulaFlight(null);
          return;
        }

        const bar = bars[currentBarIdx];

        // Before landing expression
        let beforeExpr = "";
        let beforeTotal = "";
        if (currentBarIdx > 0) {
          beforeExpr = runningExpr;
          beforeTotal = String(runningSum);
        }

        setAnimState({
          activeBar: bar.value,
          freqLabelBar: null,
          expression: beforeExpr,
          runningTotal: beforeTotal,
          lineY: null,
        });

        window.setTimeout(() => {
          setAnimState((prev) => ({
            ...prev,
            lineY: bar.frequency,
            freqLabelBar: bar.value,
          }));

          window.setTimeout(() => {
            const sourceVal = stage.querySelector(
              `[data-dataset="${dataset.id}"][data-bar-value="${bar.value}"]`,
            );
            const sourcePoint = sourceVal ? pointFor(sourceVal) : targetPoint;

            const chartEl = stage.querySelector(
              `.standalone-chart--${dataset.id}`,
            );
            const chartRect = chartEl ? chartEl.getBoundingClientRect() : null;
            const xLabelY = chartRect
              ? ((chartRect.top +
                  (88 / 92) * chartRect.height -
                  stageRect.top) /
                  window.innerHeight) *
                100
              : (78 / 92) * 100;

            const itemVal = {
              id: `val-${bar.value}`,
              text: String(bar.value),
              source: { x: sourcePoint.x, y: xLabelY },
              collect:
                part === "numerator" ? targetPointAt(0.32) : targetPoint,
              merge:
                part === "numerator" ? targetPointAt(0.32) : targetPoint,
              delay: 0,
            };
            const itemFreq = {
              id: `freq-${bar.value}`,
              text: String(bar.frequency),
              source: { x: sourcePoint.x, y: sourcePoint.y },
              collect:
                part === "numerator" ? targetPointAt(0.68) : targetPoint,
              merge:
                part === "numerator" ? targetPointAt(0.68) : targetPoint,
              delay: 0,
            };

            const flightItems =
              part === "denominator" ? [itemFreq] : [itemVal, itemFreq];

            setFormulaFlight({
              part,
              kind: "mean",
              dataset: dataset.id,
              phase: "collect",
              items: flightItems,
              target: targetPoint,
            });

            window.setTimeout(() => {
              if (part === "denominator") {
                if (currentBarIdx === 0) {
                  runningSum = bar.frequency;
                  runningExpr = `${bar.frequency}`;
                } else if (currentBarIdx === 1) {
                  runningSum = bars[0].frequency + bar.frequency;
                  runningExpr = `${bars[0].frequency} + ${bar.frequency}`;
                } else {
                  const prevSum = bars
                    .slice(0, currentBarIdx)
                    .reduce((acc, b) => acc + b.frequency, 0);
                  runningSum = prevSum + bar.frequency;
                  runningExpr = `${prevSum} + ${bar.frequency}`;
                }
              } else {
                if (currentBarIdx === 0) {
                  runningSum = bar.value * bar.frequency;
                  runningExpr = `${bar.value} × ${bar.frequency}`;
                } else if (currentBarIdx === 1) {
                  runningSum =
                    bars[0].value * bars[0].frequency +
                    bar.value * bar.frequency;
                  runningExpr = `${bars[0].value} × ${bars[0].frequency} + ${bar.value} × ${bar.frequency}`;
                } else {
                  const prevSum = bars
                    .slice(0, currentBarIdx)
                    .reduce((acc, b) => acc + b.value * b.frequency, 0);
                  runningSum = prevSum + bar.value * bar.frequency;
                  runningExpr = `${prevSum} + ${bar.value} × ${bar.frequency}`;
                }
              }

              setAnimState({
                activeBar: bar.value,
                freqLabelBar: bar.value,
                expression: runningExpr,
                runningTotal: String(runningSum),
                lineY: bar.frequency,
              });
              setFormulaFlight(null);

              // Hold the completed product on screen before the next pair
              // begins flying, so each calculation reads as a separate step.
              window.setTimeout(() => {
                currentBarIdx++;
                animateNextBar();
              }, part === "numerator" ? 520 : 250);
            // The flight lasts 820 ms. Numerator text deliberately updates
            // only after it has landed and rested briefly at the destination.
            }, part === "numerator" ? 1140 : 860);
          }, 120);
        }, 120);
      };

      animateNextBar();
      return;
    }

    if (part === "answer") {
      setFormulaFlight({
        part,
        kind: stepData.type,
        dataset: dataset.id,
        phase: "reveal",
        items: [],
      });
      window.setTimeout(() => {
        const answerValue = stage.querySelector(
          '[data-formula-part="answer"]',
        );
        const resultTarget = stage.querySelector(
          `.calculation-focused-chart [data-result-target="${stepData.type}"]`,
        );
        const sourcePoint = answerValue ? pointFor(answerValue) : targetPoint;
        const destinationPoint = resultTarget
          ? pointFor(resultTarget)
          : targetPoint;
        const value =
          stepData.type === "mean" ? dataset.mean : dataset.range;

        setFormulaFlight({
          part,
          kind: stepData.type,
          dataset: dataset.id,
          phase: "direct",
          items: [
            {
              id: `answer-${dataset.id}-${stepData.type}`,
              text: String(value),
              source: sourcePoint,
              collect: destinationPoint,
              merge: destinationPoint,
              delay: 0,
            },
          ],
        });
        onFormulaTap(part);
        window.setTimeout(() => setFormulaFlight(null), 900);
      }, 420);
      return;
    }

    const source =
      stage.querySelector(
        `[data-axis-dataset="${dataset.id}"][data-axis-value="${part === "high" ? dataset.rangeHigh : dataset.rangeLow}"]`,
      ) ||
      stage.querySelector(
        `[data-dataset="${dataset.id}"][data-bar-value="${part === "high" ? dataset.rangeHigh : dataset.rangeLow}"]`,
      );
    const destination = target;
    const sourcePoint = source ? pointFor(source) : targetPoint;
    const destinationPoint = destination ? pointFor(destination) : targetPoint;
    const value =
      part === "high" ? dataset.rangeHigh : dataset.rangeLow;
    setFormulaFlight({
      part,
      kind: stepData.type,
      dataset: dataset.id,
      phase: "direct",
      items: [
        {
          id: part,
          text: value,
          source: sourcePoint,
          collect: destinationPoint,
          merge: destinationPoint,
          delay: 0,
        },
      ],
    });
    window.setTimeout(() => {
      onFormulaTap(part);
      setFormulaFlight(null);
    }, 900);
  };

  const getTitle = () => {
    if (isEndStep) return "";
    if (stepData.id === "chooseShape" && introAnimStage !== "complete")
      return T.ui.dataTitle;
    if (stepData.type === "charts") return T.ui.dataTitle;
    if (stepData.type === "choose") {
      if (stepData.test === "centre" && allFormulaeComplete("mean"))
        return T.ui.centreTitle;
      if (stepData.test === "spread" && allFormulaeComplete("range"))
        return T.ui.spreadTitle;
      const doneCount = tests.filter(testIsDone).length;
      if (doneCount === 0) return T.ui.chooseTitle;
      if (doneCount === 1) return T.ui.chooseCentrePrompt;
      return T.ui.chooseSpreadPrompt;
    }
    if (stepData.type === "draw") return T.ui.shapeTitle;
    if (stepData.type === "mean") return T.ui.centreTitle;
    if (stepData.type === "range") return T.ui.spreadTitle;
    if (stepData.type === "quiz") {
      const sampleNum = stepData.sample === "sample1" ? "1" : "2";
      return T.ui[`${stepData.test}Quiz${sampleNum}`];
    }
    if (stepData.type === "testDone") return T.ui[`${stepData.test}Done`];
    if (stepData.type === "finalChoice")
      return answers.finalChoice === "sample2"
        ? T.ui.finalSuccessTitle
        : T.ui.finalQuestion;
    if (stepData.type === "summary") return T.ui.summaryTitle;
    return "";
  };

  const chartOptionsFor = (sampleKey) => {
    const drawState = partial("shapeDraw");
    const isShapePhase = currentTest === "shape";
    const isCentrePhase = currentTest === "centre";
    const isSpreadPhase = currentTest === "spread";

    if (stepData.type === "finalChoice") {
      return {
        showShapePopulation: false,
        showShapeSample: false,
        showMeanPopulation: false,
        showMeanSample: false,
        showRangePopulation: false,
        showRangeSample: false,
      };
    }

    return {
      showShapePopulation:
        isShapePhase &&
        (completed.shapeDraw === true || !!drawState.population),
      showShapeSample:
        isShapePhase &&
        (completed.shapeDraw === true || !!drawState[sampleKey]),
      showMeanPopulation:
        isCentrePhase && isFormulaComplete("mean", "population"),
      showMeanSample: isCentrePhase && isFormulaComplete("mean", sampleKey),
      showRangePopulation:
        isSpreadPhase && isFormulaComplete("range", "population"),
      showRangeSample: isSpreadPhase && isFormulaComplete("range", sampleKey),
    };
  };

  const renderOverlayChart = (sampleKey, options = {}) => {
    const population = datasets.population;
    const sample = datasets[sampleKey];
    const bars = population.bars;
    const maxY = 10;
    const xFor = chartXFor;
    const yFor = (frequency) => 78 - (frequency / maxY) * 66;
    const shapePointsFor = (shapeBars) =>
      shapeBars
        .map((bar, index) => {
          const endpointOffset =
            index === 0 ? -3.6 : index === shapeBars.length - 1 ? 3.6 : 0;
          return `${xFor(bar.value) + endpointOffset},${yFor(bar.frequency)}`;
        })
        .join(" ");
    const popPoints = shapePointsFor(bars);
    const sampleByValue = Object.fromEntries(
      sample.bars.map((bar) => [bar.value, bar.frequency]),
    );
    const activeSampleBars = sample.bars.filter((bar) => bar.frequency > 0);
    const samplePoints = shapePointsFor(activeSampleBars);

    const popAreaPoints = `${xFor(1) - 3.6},78 ${popPoints} ${xFor(12) + 3.6},78`;
    const sampleFirstVal =
      activeSampleBars.length > 0 ? activeSampleBars[0].value : 1;
    const sampleLastVal =
      activeSampleBars.length > 0
        ? activeSampleBars[activeSampleBars.length - 1].value
        : 12;
    const sampleAreaPoints = `${xFor(sampleFirstVal) - 3.6},78 ${samplePoints} ${xFor(sampleLastVal) + 3.6},78`;

    return React.createElement(
      "div",
      {
        key: sampleKey,
        className: `story-chart ${options.dim ? "story-chart--dim" : ""} ${options.selected ? "story-chart--selected" : ""}`,
        "data-chart-dataset": sampleKey,
      },
      React.createElement(
        "svg",
        {
          className: "story-svg",
          viewBox: "0 -6 160 98",
          role: "img",
          "aria-label": labelFor(sample),
        },
        React.createElement("line", {
          className: "axis-line",
          x1: "8",
          y1: "78",
          x2: "152",
          y2: "78",
        }),
        React.createElement("line", {
          className: "axis-line",
          x1: "8",
          y1: "10",
          x2: "8",
          y2: "78",
        }),
        [0, 2, 4, 6, 8, 10].map((tick) =>
          React.createElement(
            "g",
            { key: tick },
            React.createElement("line", {
              className: "tick-line",
              x1: "6.2",
              y1: yFor(tick),
              x2: "8",
              y2: yFor(tick),
            }),
            React.createElement(
              "text",
              { className: "axis-text y-text", x: "5.4", y: yFor(tick) + 1 },
              tick,
            ),
          ),
        ),
        bars.map((bar, index) => {
          const x = xFor(bar.value);
          const h = 78 - yFor(bar.frequency);
          const sampleFrequency = sampleByValue[bar.value] || 0;
          const sampleH = 78 - yFor(sampleFrequency);
          return React.createElement(
            "g",
            { key: `${sampleKey}-${bar.value}` },
            React.createElement("rect", {
              key: `population-bar-${sampleKey}-${bar.value}`,
              className: "population-bar",
              "data-dataset": "population",
              "data-bar-value": bar.value,
              x: x - 3.6,
              y: 78 - h,
              width: 7.2,
              height: h,
              style: { "--bar-delay": `${index * 35}ms` },
            }),
            sampleFrequency > 0 &&
              React.createElement("rect", {
                key: `sample-bar-${sampleKey}-${bar.value}`,
                className: "sample-bar",
                "data-dataset": sampleKey,
                "data-bar-value": bar.value,
                x: x - 3.6,
                y: 78 - sampleH,
                width: 7.2,
                height: sampleH,
                style: {
                  "--sample-color": sample.color,
                  "--bar-delay": `${index * 35 + 120}ms`,
                },
              }),
            React.createElement(
              "text",
              {
                key: `axis-label-${sampleKey}-${bar.value}`,
                className: "axis-text x-text",
                x,
                y: "88",
                "data-axis-dataset": sampleKey,
                "data-axis-value": bar.value,
              },
              bar.value,
            ),
          );
        }),
        options.showShapePopulation &&
          React.createElement("polygon", {
            className: "shape-area population-shape-area",
            points: popAreaPoints,
          }),
        options.showShapePopulation &&
          React.createElement("polyline", {
            className: "shape-line population-shape",
            points: popPoints,
          }),
        options.showShapeSample &&
          React.createElement("polygon", {
            className: "shape-area sample-shape-area",
            points: sampleAreaPoints,
            style: { "--shape-color": sample.shapeColor },
          }),
        options.showShapeSample &&
          React.createElement("polyline", {
            className: "shape-line sample-shape",
            points: samplePoints,
            style: { "--shape-color": sample.shapeColor },
          }),
        options.showMeanPopulation &&
          renderMeanMarker(population, "population"),
        options.showMeanSample && renderMeanMarker(sample, sampleKey),
        options.showRangePopulation &&
          renderRangeMarker(population, "population"),
        options.showRangeSample && renderRangeMarker(sample, sampleKey),
      ),
      options.showCaption &&
        React.createElement(
          "div",
          { className: "chart-caption" },
          options.captionText || T.ui[`${sampleKey}Name`],
        ),
    );
  };

  const renderMeanMarker = (dataset, key, visible = true) => {
    const x = chartXFor(dataset.mean);
    const markerTop = key === "population" ? 10 : 12;
    const markerLabelY = key === "population" ? 8 : 16;
    return React.createElement(
      "g",
      { key: `mean-${key}` },
      React.createElement("circle", {
        className: "result-flight-target",
        "data-result-target": "mean",
        cx: x,
        cy: markerLabelY,
        r: "1",
      }),
      visible &&
        React.createElement("line", {
          className: `mean-line mean-line--${key}`,
          x1: x,
          y1: markerTop,
          x2: x,
          y2: "78",
        }),
      visible &&
        React.createElement(
          "text",
          {
            className: `marker-label marker-label--${key}`,
            x,
            y: markerLabelY,
          },
          dataset.mean,
        ),
    );
  };

  const renderRangeMarker = (dataset, key, phase = "complete") => {
    const lowX = chartXFor(dataset.rangeLow);
    const highX = chartXFor(dataset.rangeHigh);
    const showHigh = ["high", "low", "answer", "complete"].includes(phase);
    const showLow = ["low", "answer", "complete"].includes(phase);
    const showSpan = ["low", "answer", "complete"].includes(phase);
    const showAnswer = ["answer", "complete"].includes(phase);
    const y = key === "population" ? 9 : 61;
    return React.createElement(
      "g",
      { key: `range-${key}` },
      React.createElement(
        "defs",
        null,
        React.createElement(
          "marker",
          {
            id: `range-arrow-${key}`,
            viewBox: "0 0 10 10",
            refX: "5",
            refY: "5",
            markerWidth: "5",
            markerHeight: "5",
            orient: "auto-start-reverse",
          },
          React.createElement("path", {
            d: "M 0 0 L 10 5 L 0 10 z",
            fill: "context-stroke",
          }),
        ),
      ),
      showSpan &&
        React.createElement("line", {
          className: `range-line range-line--${key}`,
          x1: lowX,
          y1: y,
          x2: highX,
          y2: y,
          markerStart: `url(#range-arrow-${key})`,
          markerEnd: `url(#range-arrow-${key})`,
        }),
      React.createElement("circle", {
        className: "result-flight-target",
        "data-result-target": "range",
        cx: (lowX + highX) / 2,
        cy: y - 7,
        r: "1",
      }),
      showLow &&
        React.createElement("line", {
          className: `range-end range-line--${key}`,
          x1: lowX,
          y1: key === "population" ? "10" : y,
          x2: lowX,
          y2: "78",
        }),
      showHigh &&
        React.createElement("line", {
          className: `range-end range-line--${key}`,
          x1: highX,
          y1: key === "population" ? "10" : y,
          x2: highX,
          y2: "78",
        }),
      showAnswer &&
        React.createElement(
          "g",
          { className: "range-label-group" },
          React.createElement("rect", {
            className: `range-label-bg range-label-bg--${key}`,
            x: (lowX + highX) / 2 - 10,
            y: y - 15,
            width: "20",
            height: "10",
            rx: "2",
          }),
          React.createElement(
            "text",
            {
              className: `range-value-label range-value-label--${key}`,
              x: (lowX + highX) / 2,
              y: y - 7,
            },
            dataset.range,
          ),
        ),
    );
  };

  const renderCharts = (options = {}) =>
    React.createElement(
      "div",
      {
        className: `story-chart-row ${
          options.transitionDataset
            ? `story-chart-row--returning story-chart-row--returning-${options.transitionDataset}`
            : ""
        }`,
      },
      samples.map((sampleKey) =>
        renderOverlayChart(sampleKey, {
          ...chartOptionsFor(sampleKey),
          ...options,
          dim: options.dimSample && options.dimSample !== sampleKey,
          selected: options.selectedSample === sampleKey,
        }),
      ),
    );

  const renderStandaloneChart = (datasetKey, options = {}) => {
    const dataset = datasets[datasetKey];
    const compactSample =
      options.compact && !options.isMerging && datasetKey !== "population";
    const maxY = compactSample ? 4 : 10;
    const yTicks = compactSample ? [0, 1, 2, 3, 4] : [0, 2, 4, 6, 8, 10];
    const xFor = chartXFor;
    const yFor = (frequency) => 78 - (frequency / maxY) * 66;
    return React.createElement(
      "div",
      {
        className: `story-chart standalone-chart standalone-chart--${datasetKey} ${options.compact ? "standalone-chart--compact" : ""} ${options.large ? "standalone-chart--large" : ""} ${options.isMerging ? "chart--merging" : ""}`,
        "data-chart-dataset": datasetKey,
      },
      React.createElement(
        "svg",
        {
          className: "story-svg",
          viewBox: "0 -6 160 98",
          preserveAspectRatio: "xMidYMid meet",
          role: "img",
          "aria-label": labelFor(dataset),
        },
        React.createElement("line", {
          className: "axis-line",
          x1: "8",
          y1: "78",
          x2: "152",
          y2: "78",
        }),
        React.createElement("line", {
          className: "axis-line",
          x1: "8",
          y1: "10",
          x2: "8",
          y2: "78",
        }),
        yTicks.map((tick) =>
          React.createElement(
            "g",
            { key: tick },
            React.createElement("line", {
              className: "tick-line",
              x1: "6.2",
              y1: yFor(tick),
              x2: "8",
              y2: yFor(tick),
            }),
            React.createElement(
              "text",
              { className: "axis-text y-text", x: "5.4", y: yFor(tick) + 1 },
              tick,
            ),
          ),
        ),
        dataset.bars.map((bar, index) => {
          const x = xFor(bar.value);
          const height = 78 - yFor(bar.frequency);
          return React.createElement(
            "g",
            { key: `${datasetKey}-${bar.value}` },
            React.createElement("rect", {
              key: `bar-${datasetKey}-${bar.value}`,
              className: `${datasetKey === "population" ? "population-bar" : "sample-bar"} ${animState.activeBar !== null && animState.activeBar !== bar.value ? "bar--dimmed" : ""}`,
              "data-dataset": datasetKey,
              "data-bar-value": bar.value,
              x: x - 3.6,
              y: 78 - height,
              width: 7.2,
              height,
              style: {
                "--sample-color": dataset.color,
                "--bar-delay": `${index * 35}ms`,
                transition: options.compact
                  ? "y 0.9s cubic-bezier(0.22, 1, 0.36, 1), height 0.9s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease"
                  : "opacity 0.25s ease",
              },
            }),
            ((options.showFrequencies && bar.frequency > 0) ||
              (animState.freqLabelBar === bar.value && bar.frequency > 0)) &&
              React.createElement(
                "text",
                {
                  key: `frequency-label-${datasetKey}-${bar.value}`,
                  className: "frequency-label",
                  x,
                  y: yFor(bar.frequency) - 2,
                },
                bar.frequency,
              ),
            React.createElement(
              "text",
              {
                key: `axis-label-${datasetKey}-${bar.value}`,
                className: "axis-text x-text",
                x,
                y: "88",
                "data-axis-dataset": datasetKey,
                "data-axis-value": bar.value,
              },
              bar.value,
            ),
          );
        }),
        animState.activeBar !== null &&
          animState.lineY !== null &&
          (() => {
            const activeBarObj = dataset.bars.find(
              (b) => b.value === animState.activeBar,
            );
            if (activeBarObj && activeBarObj.frequency > 0) {
              const xVal = xFor(activeBarObj.value);
              const yVal = yFor(activeBarObj.frequency);
              return React.createElement("line", {
                key: `guide-line-${activeBarObj.value}`,
                className: "anim-axis-guide-line",
                x1: "8",
                y1: yVal,
                x2: xVal,
                y2: yVal,
                stroke: "#ffd36b",
                strokeWidth: "0.55",
                strokeDasharray: "2 2",
              });
            }
          })(),
        (options.showMean || options.meanTarget) &&
          renderMeanMarker(dataset, datasetKey, !!options.showMean),
        options.showRange &&
          renderRangeMarker(
            dataset,
            datasetKey,
            options.rangePhase || "complete",
          ),
      ),
      !options.hideCaption &&
        React.createElement(
          "div",
          { className: "chart-caption" },
          options.captionText || labelFor(dataset),
        ),
    );
  };

  const renderIntroCharts = () =>
    React.createElement(
      "div",
      { className: "intro-chart-layout" },
      React.createElement(
        "div",
        { className: "grid-item-scenario" },
        React.createElement(
          "div",
          {
            className: "scenario-callout",
            dangerouslySetInnerHTML: { __html: T.ui.scenario },
          },
        ),
      ),
      React.createElement(
        "div",
        { className: "grid-item-pop" },
        renderStandaloneChart("population", { hideCaption: true }),
      ),
      React.createElement(
        "div",
        { className: "grid-item-s1" },
        renderStandaloneChart("sample1", {
          captionText: `${T.ui.sample1Name}:`,
          compact: true,
        }),
      ),
      React.createElement(
        "div",
        { className: "grid-item-s2" },
        renderStandaloneChart("sample2", {
          captionText: `${T.ui.sample2Name}:`,
          compact: true,
        }),
      ),
    );

  const renderStatusStrip = (tableMode = false) => {
    const calculationOverview =
      stepData.type === "choose" &&
      ((stepData.test === "centre" && allFormulaeComplete("mean")) ||
        (stepData.test === "spread" && allFormulaeComplete("range")));
    const children = tests.map((test) => {
      const active =
        stepData.id !== "chooseShape" &&
        (currentTest === test ||
          (stepData.type === "choose" && stepData.test === test));
      const enabled =
        stepData.type === "choose" &&
        !calculationOverview &&
        !testIsDone(test);

      const r1 = getQuizResult(test, "sample1");
      const r2 = getQuizResult(test, "sample2");

      const hasResults = r1 !== null || r2 !== null;

      const s1Text = tableMode
        ? r1
          ? `${T.ui.passShort} 👍`
          : `${T.ui.failShort} 👎`
        : `${T.ui.sample1Short} ${statusText(r1)}`;
      const s2Text = tableMode
        ? r2
          ? `${T.ui.passShort} 👍`
          : `${T.ui.failShort} 👎`
        : `${T.ui.sample2Short} ${statusText(r2)}`;

      return React.createElement(
        "button",
        {
          key: test,
          type: "button",
          className: `status-tab status-tab--${test} ${active ? "status-tab--active" : ""} ${enabled ? "ftue-target" : ""}`,
          "data-status-test": test,
          onClick: enabled ? () => onChoose(test) : undefined,
          disabled: !enabled,
        },
        React.createElement("span", {
          className: "status-answer-target status-answer-target--sample1",
          "data-answer-target": `${test}-sample1`,
          "aria-hidden": "true",
        }),
        React.createElement("span", {
          className: "status-answer-target status-answer-target--sample2",
          "data-answer-target": `${test}-sample2`,
          "aria-hidden": "true",
        }),
        React.createElement(
          "span",
          { className: "status-tab-title" },
          T.ui[test] + (hasResults ? ":" : ""),
        ),
        r1 !== null &&
          React.createElement(
            "span",
            {
              className: `status-chip status-chip--sample1 ${answerFlight?.sample === "sample1" && answerFlight?.test === test ? "status-chip--awaiting-flight" : ""} ${r1 ? "status-chip--pass" : "status-chip--fail"}`,
            },
            s1Text,
          ),
        r2 !== null &&
          React.createElement(
            "span",
            {
              className: `status-chip status-chip--sample2 ${answerFlight?.sample === "sample2" && answerFlight?.test === test ? "status-chip--awaiting-flight" : ""} ${r2 ? "status-chip--pass" : "status-chip--fail"}`,
            },
            s2Text,
          ),
      );
    });

    if (tableMode) {
      return React.createElement(
        "div",
        {
          key: "status-strip-common",
          className: "status-strip status-strip--table",
        },
        React.createElement(
          "div",
          { className: "status-table-header" },
          React.createElement("span", { className: "header-label-empty" }),
          React.createElement(
            "span",
            { className: "header-label" },
            T.ui.sample1Name,
          ),
          React.createElement(
            "span",
            { className: "header-label" },
            T.ui.sample2Name,
          ),
        ),
        children,
      );
    }

    return React.createElement(
      "div",
      { key: "status-strip-common", className: "status-strip" },
      children,
    );
  };

  const renderDrawControls = () => {
    const drawState = partial(stepData.id);
    const controls = [
      ["population", T.ui.drawPopulation],
      ["sample1", T.ui.drawSample1],
      ["sample2", T.ui.drawSample2],
    ];
    return React.createElement(
      "div",
      { className: "floating-controls draw-controls" },
      controls
        .slice(0, drawControlCount)
        .filter(([key]) => !drawState[key] && !isDone())
        .map(([key, label], index) =>
        React.createElement(
          "button",
          {
            key,
            type: "button",
            className: `story-action story-action--${key} draw-control-enter ftue-target`,
            style: { "--control-index": index },
            onClick: () => onDraw(key),
          },
          label,
        ),
      ),
    );
  };

  const formulaState = partial(stepData.id);
  const formulaChip = (part, label, value) => {
    const order =
      stepData.type === "mean"
        ? ["numerator", "denominator", "answer"]
        : ["high", "low", "answer"];
    const partIndex = order.indexOf(part);
    const available = order
      .slice(0, partIndex)
      .every((key) => formulaState[key]);

    const isAnimatingThisPart =
      animState.activeBar !== null &&
      ((part === "numerator" &&
        animState.activeBar !== null &&
        !formulaState.numerator) ||
        (part === "denominator" &&
          animState.activeBar !== null &&
          formulaState.numerator &&
          !formulaState.denominator));
    const interactionInProgress =
      isAnimatingThisPart || formulaFlight?.part === part;

    let content = label;
    if (formulaState[part] || isDone()) {
      content = value;
    } else if (part === "answer" && formulaFlight?.part === "answer") {
      content = value;
    } else if (isAnimatingThisPart) {
      content = animState.runningTotal
        ? `${animState.expression} = ${animState.runningTotal}`
        : animState.expression;
    }

    return React.createElement(
      "button",
      {
        type: "button",
        className: `formula-chip formula-chip--${stepData.dataset} ${formulaState[part] || isDone() ? "formula-chip--filled" : available && !interactionInProgress && calculationSceneStage === "ready" ? "ftue-target" : ""} ${interactionInProgress ? "formula-chip--animating" : ""}`,
        "data-formula-part": part,
        onClick: () => runFormulaAnimation(part),
        disabled:
          formulaState[part] ||
          isDone() ||
          !available ||
          calculationSceneStage !== "ready" ||
          !!formulaFlight ||
          animState.activeBar !== null,
      },
      content,
    );
  };

  const renderCalculationChart = (kind) => {
    const dataset = datasets[stepData.dataset];
    const rangePhase = formulaFlight?.part === "low"
      ? "low"
      : formulaFlight?.part === "high"
        ? "high"
        : isDone()
      ? "answer"
      : formulaState.answer
        ? "answer"
        : formulaState.low
          ? "low"
          : formulaState.high
            ? "high"
            : "start";
    return React.createElement(
      "div",
      {
        className: `calculation-chart-stage calculation-chart-stage--${dataset.id} calculation-chart-stage--${calculationSceneStage} ${isDone() ? "calculation-chart-stage--settling" : ""}`,
      },
      React.createElement(
        "div",
        { className: "calculation-source-charts", "aria-hidden": "true" },
        samples.map((sampleKey) =>
          React.createElement(
            "div",
            {
              key: sampleKey,
              className: `calculation-source-chart calculation-source-chart--${sampleKey}`,
            },
            renderOverlayChart(sampleKey, chartOptionsFor(sampleKey)),
          ),
        ),
      ),
      React.createElement(
        "div",
        { className: "calculation-focused-chart" },
        renderStandaloneChart(dataset.id, {
          large: true,
          hideCaption: true,
          showFrequencies: kind === "mean" && !!formulaState.numerator,
          showMean: kind === "mean" && (formulaState.answer || isDone()),
          meanTarget: kind === "mean",
          showRange: kind === "range",
          rangePhase,
        }),
      ),
    );
  };

  const renderFormulaFlight = () => {
    if (!formulaFlight) return null;
    return React.createElement(
      "div",
      {
        className: `calculation-flight-layer calculation-flight-layer--${formulaFlight.phase}`,
      },
      formulaFlight.items.map((item) => {
        return React.createElement(
          "span",
          {
            key: item.id,
            className: `calculation-ghost calculation-ghost--${formulaFlight.dataset} calculation-ghost--${formulaFlight.kind} ${formulaFlight.part === "answer" ? "calculation-ghost--answer" : ""}`,
            style: {
              left: `${item.source.x}vw`,
              top: `${item.source.y}vh`,
              "--collect-x": `${item.collect.x - item.source.x}vw`,
              "--collect-y": `${item.collect.y - item.source.y}vh`,
              "--merge-x": `${item.merge.x - item.source.x}vw`,
              "--merge-y": `${item.merge.y - item.source.y}vh`,
              "--ghost-delay": `${item.delay}ms`,
            },
          },
          item.text,
        );
      }),
      formulaFlight.total &&
        React.createElement(
          "span",
          {
            className: "calculation-merge-total",
            style: {
              left: `${formulaFlight.target.x}vw`,
              top: `${formulaFlight.target.y}vh`,
            },
          },
          formulaFlight.total,
        ),
    );
  };

  const renderFormulaControls = (kind) => {
    const activeDatasetId = stepData.dataset;
    if (!activeDatasetId) return null;
    const visibleDatasetIds = ["population", "sample1", "sample2"].filter(
      (datasetId) =>
        datasetId === activeDatasetId ||
        !isFormulaComplete(kind, datasetId),
    );

    return React.createElement(
      "div",
      {
        className: `floating-controls formula-controls formula-controls--${kind} formula-controls--active-${activeDatasetId} formula-controls--scene-${calculationSceneStage} ${visibleDatasetIds.length === 1 ? "formula-controls--single" : ""}`,
        "aria-busy": calculationSceneStage !== "ready",
      },
      visibleDatasetIds.map((datasetId) => {
        const dataset = datasets[datasetId];
        const active = datasetId === activeDatasetId;
        const done = isFormulaComplete(kind, datasetId) || (active && isDone());

        return React.createElement(
          "div",
          {
            key: datasetId,
            className: `formula-card formula-card--${datasetId} ${active ? "formula-card--active" : "formula-card--faded"} ${done ? "formula-card--done formula-card--settled" : ""}`,
          },
          React.createElement(
            "div",
            { className: "formula-title" },
            T.ui[`${kind}${capitalize(dataset.id)}`],
          ),
          done
            ? React.createElement(
                "div",
                { className: "equation-row" },
                React.createElement("span", null, "="),
                React.createElement(
                  "div",
                  { className: "formula-done-value" },
                  kind === "mean" ? dataset.mean : dataset.range,
                ),
              )
            : active
              ? React.createElement(
                "div",
                { className: "equation-row" },
                React.createElement("span", null, "="),
                kind === "mean"
                  ? React.createElement(
                      "span",
                      { className: "fraction-formula" },
                      formulaChip(
                        "numerator",
                        React.createElement(
                          React.Fragment,
                          null,
                          "Sum of (x",
                          React.createElement("sub", null, "i"),
                          " × f",
                          React.createElement("sub", null, "i"),
                          ")",
                        ),
                        dataset.numerator,
                      ),
                      React.createElement("span", { className: "formula-bar" }),
                      formulaChip(
                        "denominator",
                        React.createElement(
                          React.Fragment,
                          null,
                          "Sum of (f",
                          React.createElement("sub", null, "i"),
                          ")",
                        ),
                        dataset.denominator,
                      ),
                    )
                  : React.createElement(
                      React.Fragment,
                      null,
                      formulaChip("high", T.ui.highestValue, dataset.rangeHigh),
                      React.createElement("span", null, "-"),
                      formulaChip("low", T.ui.lowestValue, dataset.rangeLow),
                    ),
                React.createElement("span", null, "="),
                formulaChip(
                  "answer",
                  T.ui.revealAnswer,
                  kind === "mean" ? dataset.mean : dataset.range,
                ),
              )
              : null,
        );
      }),
    );
  };

  const renderQuizButtons = () => {
    const sampleKey = stepData.sample;
    const correct = T.testResults[stepData.test][sampleKey];
    const answerKey = `${stepData.test}-${sampleKey}`;
    const selected = answers[answerKey];
    return React.createElement(
      "div",
      { className: `quiz-buttons-row quiz-buttons-row--${sampleKey}` },
      [true, false].map((choice) =>
        React.createElement(
          "button",
          {
            key: String(choice),
            type: "button",
            className: `${quizButtonClass(choice, selected, correct)} quiz-choice--${sampleKey} ${choice ? "quiz-choice--pass-option" : "quiz-choice--fail-option"}`,
            onClick: (event) => runQuizAnswerAnimation(choice, event),
            disabled: selected === correct,
          },
          choice ? `${T.ui.pass} 👍` : `${T.ui.fail} 👎`,
        ),
      ),
    );
  };

  const quizButtonClass = (choice, selected, correct) => {
    let className = "story-action quiz-choice ftue-target";
    if (selected === choice && choice === correct)
      className += " quiz-choice--correct";
    if (selected === choice && choice !== correct)
      className += " quiz-choice--wrong";
    return className;
  };

  const renderFeedback = () => {
    if (!feedback) return null;
    let sideClass = "";
    if (stepData.type === "quiz") {
      sideClass =
        stepData.sample === "sample2"
          ? "feedback-card--left"
          : "feedback-card--right";
    }
    return React.createElement("div", {
      className: `feedback-card ${answers.finalChoice === "sample2" || feedback === "" ? "feedback-card--correct" : "feedback-card--wrong"} ${sideClass}`,
      dangerouslySetInnerHTML: { __html: feedback },
    });
  };

  const renderFinalChoice = () => {
    const stage = finalIntroStage === "idle" ? "strip" : finalIntroStage;
    if (stage === "strip") {
      return React.createElement(
        "div",
        { className: "story-workspace story-workspace--final-strip fade-in" },
        renderCharts(),
        renderStatusStrip(),
      );
    }

    return React.createElement(
      "div",
      {
        className: `final-layout final-layout--${stage}`,
      },
      React.createElement(
        "div",
        { className: "final-chart-buttons" },
        samples.map((sampleKey) =>
          React.createElement(
            "button",
            {
              key: sampleKey,
              type: "button",
              className: `final-sample-button ${stage === "ready" ? "ftue-target" : ""} ${answers.finalChoice === sampleKey ? "final-sample-button--selected" : ""}`,
              onClick: () => onFinalChoice(sampleKey),
              disabled:
                stage !== "ready" ||
                answers.finalChoice === "sample2",
              "data-sample": sampleKey,
            },
            renderOverlayChart(sampleKey, {
              ...chartOptionsFor(sampleKey),
              selected: answers.finalChoice === sampleKey,
            }),
          ),
        ),
      ),
      renderStatusStrip(true),
      renderFeedback(),
    );
  };

  const runQuizAnswerAnimation = (choice, event) => {
    const sampleKey = stepData.sample;
    const correct = T.testResults[stepData.test][sampleKey];
    if (choice !== correct) {
      onQuizAnswer(choice);
      return;
    }

    const stage = event.currentTarget.closest(".story-workspace");
    const target = stage?.querySelector(
      `[data-answer-target="${stepData.test}-${sampleKey}"]`,
    );
    if (!stage || !target) {
      onQuizAnswer(choice);
      return;
    }

    const stageRect = stage.getBoundingClientRect();
    const sourceRect = event.currentTarget.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const source = {
      x: sourceRect.left + sourceRect.width * 0.76 - stageRect.left,
      y: sourceRect.top + sourceRect.height / 2 - stageRect.top,
    };
    const destination = {
      x: targetRect.left + targetRect.width / 2 - stageRect.left,
      y: targetRect.top + targetRect.height / 2 - stageRect.top,
    };

    setAnswerFlight({
      test: stepData.test,
      sample: sampleKey,
      icon: choice ? "👍" : "👎",
      source,
      destination,
    });
    onQuizAnswer(choice);
    window.setTimeout(() => setAnswerFlight(null), 920);
  };

  const renderAnswerFlight = () => {
    if (!answerFlight) return null;
    return React.createElement(
      "div",
      { className: "answer-flight-layer", "aria-hidden": "true" },
      React.createElement(
        "span",
        {
          className: `answer-flight answer-flight--${answerFlight.sample}`,
          style: {
            left: `${answerFlight.source.x}px`,
            top: `${answerFlight.source.y}px`,
            "--answer-flight-x": `${answerFlight.destination.x - answerFlight.source.x}px`,
            "--answer-flight-y": `${answerFlight.destination.y - answerFlight.source.y}px`,
          },
        },
        answerFlight.icon,
      ),
    );
  };

  const renderEnd = () =>
    React.createElement(
      "div",
      { className: "summary-layout fade-in" },
      React.createElement("h2", null, T.ui.summaryTitle),
      React.createElement("p", null, T.ui.summaryMessage),
      React.createElement("p", {
        dangerouslySetInnerHTML: { __html: T.ui.summaryRemember },
      }),
      React.createElement("p", null, T.ui.instructionStartOver),
      React.createElement(
        "button",
        {
          ref: startOverButtonRef,
          className: "start-over-button challenge-start-over-btn ftue-target",
          onClick: handleStartOver,
        },
        T.ui.startOverButton,
      ),
    );

  const renderIntroAnimation = () => {
    const showCallout = introAnimStage === "initial";
    const isFly = ["duplicate", "merge"].includes(introAnimStage);
    const isMerge = introAnimStage === "merge";

    return React.createElement(
      "div",
      {
        className: `intro-anim-container ${isMerge ? "intro-anim-container--merge" : ""}`,
      },
      React.createElement(
        "div",
        {
          className: `intro-scenario ${!showCallout ? "intro-scenario--fade" : ""}`,
        },
        React.createElement(
          "div",
          {
            className: "scenario-callout",
            dangerouslySetInnerHTML: { __html: T.ui.scenario },
          },
        ),
      ),
      React.createElement(
        "div",
        { className: "intro-pop-right" },
        renderStandaloneChart("population", { hideCaption: true }),
      ),
      React.createElement(
        "div",
        { className: `intro-pop-left ${isFly ? "intro-pop-left--fly" : ""}` },
        renderStandaloneChart("population", { hideCaption: true }),
      ),
      React.createElement(
        "div",
        { className: `intro-sample1 ${isMerge ? "intro-sample1--merge" : ""}` },
        renderStandaloneChart("sample1", {
          hideCaption: true,
          isMerging: isMerge,
          compact: true,
        }),
      ),
      React.createElement(
        "div",
        { className: `intro-sample2 ${isMerge ? "intro-sample2--merge" : ""}` },
        renderStandaloneChart("sample2", {
          hideCaption: true,
          isMerging: isMerge,
          compact: true,
        }),
      ),
    );
  };

  const renderChoiceButtons = (test) => {
    const isCentre = test === "centre";
    const choices = isCentre
      ? [
          {
            id: "meanPopulation",
            label: T.ui.meanPopulation,
            colorClass: "story-action--population",
          },
          {
            id: "meanSample1",
            label: T.ui.meanSample1,
            colorClass: "story-action--sample1",
          },
          {
            id: "meanSample2",
            label: T.ui.meanSample2,
            colorClass: "story-action--sample2",
          },
        ]
      : [
          {
            id: "rangePopulation",
            label: T.ui.rangePopulation,
            colorClass: "story-action--population",
          },
          {
            id: "rangeSample1",
            label: T.ui.rangeSample1,
            colorClass: "story-action--sample1",
          },
          {
            id: "rangeSample2",
            label: T.ui.rangeSample2,
            colorClass: "story-action--sample2",
          },
        ];

    return React.createElement(
      "div",
      { className: "centre-choice-buttons" },
      choices.map((choice, index) => {
        const done = completed[choice.id] === true;
        if (done) return null;
        return React.createElement(
          "button",
          {
            key: choice.id,
            type: "button",
            className: `story-action ${choice.colorClass} centre-choice-btn measure-control-enter ${done ? "centre-choice-btn--done" : "ftue-target"}`,
            style: { "--control-index": index },
            onClick: () => props.onChooseDataset(choice.id),
            disabled: done,
          },
          choice.label,
        );
      }),
    );
  };

  const renderContent = () => {
    if (isEndStep) return renderEnd();
    if (stepData.type === "finalChoice") return renderFinalChoice();

    if (stepData.id === "chooseShape" && introAnimStage !== "complete") {
      return React.createElement(
        "div",
        {
          className: `story-workspace story-workspace--${stepData.type} fade-in`,
        },
        renderIntroAnimation(),
      );
    }

    const showQuiz = stepData.type === "quiz";
    const selectedSample = showQuiz ? stepData.sample : null;
    const dimSample = showQuiz ? stepData.sample : null;

    return React.createElement(
      "div",
      {
        className: `story-workspace story-workspace--${stepData.type} fade-in`,
      },
      stepData.type === "charts"
        ? renderIntroCharts()
        : ["mean", "range"].includes(stepData.type)
          ? renderCalculationChart(stepData.type)
          : renderCharts({
              selectedSample,
              dimSample,
              transitionDataset:
                stepData.type === "choose" ? returningDataset : "",
            }),
      stepData.type === "choose" &&
        stepData.test === "centre" &&
        renderChoiceButtons("centre"),
      stepData.type === "choose" &&
        stepData.test === "spread" &&
        renderChoiceButtons("spread"),
      stepData.type === "draw" && renderDrawControls(),
      stepData.type === "mean" && renderFormulaControls("mean"),
      stepData.type === "range" && renderFormulaControls("range"),
      ["mean", "range"].includes(stepData.type) && renderFormulaFlight(),
      showQuiz && renderQuizButtons(),
      showQuiz && renderFeedback(),
      stepData.type !== "charts" && renderStatusStrip(),
      renderAnswerFlight(),
    );
  };

  return React.createElement(
    "div",
    {
      className: `compare-screen compare-screen--${stepData.id || "end"} ${stepConfig && stepConfig.step > 0 ? "no-bar-grow" : ""}`,
      ref,
    },
    getTitle() &&
      React.createElement("h2", { className: "rule-title" }, getTitle()),
    React.createElement("div", { className: "work-area" }, renderContent()),
  );
});
