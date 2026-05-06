const MainCanvas = function (props) {
  var step = props.step;
  var exploredSplit2 = props.exploredSplit2 === true;
  var exploredSplit3 = props.exploredSplit3 === true;
  var onSetNextEnabled = props.onSetNextEnabled;
  var onUpdateNavText = props.onUpdateNavText;
  var onAdvanceStep = props.onAdvanceStep;
  var onFinishStep5Route = props.onFinishStep5Route;
  var registerNextOverride = props.registerNextOverride;
  var registerPrevOverride = props.registerPrevOverride;

  var useState = React.useState;
  var useEffect = React.useEffect;
  var useRef = React.useRef;

  // ── State ──
  var selectedSplitState = useState(null);
  var selectedSplit = selectedSplitState[0];
  var setSelectedSplit = selectedSplitState[1];

  var substepState = useState(0);
  var substep = substepState[0];
  var setSubstep = substepState[1];

  var step5IndexState = useState(0);
  var step5Index = step5IndexState[0];
  var setStep5Index = step5IndexState[1];

  var step3VideoSrcState = useState("");
  var step3VideoSrc = step3VideoSrcState[0];
  var setStep3VideoSrc = step3VideoSrcState[1];

  var step3VideoVisibleState = useState(false);
  var step3VideoVisible = step3VideoVisibleState[0];
  var setStep3VideoVisible = step3VideoVisibleState[1];

  var numpadValueState = useState("");
  var numpadValue = numpadValueState[0];
  var setNumpadValue = numpadValueState[1];

  var boxStateState = useState("default");
  var boxState = boxStateState[0];
  var setBoxState = boxStateState[1];

  var wrongTimerRef = useRef(null);
  var step3VideoRef = useRef(null);
  var step4SubstepVideoRef = useRef(null);
  /** First canvas image for the chosen split (config[0]); avoids question.svg flash on 3→4. */
  var firstStep4ImageUrlRef = useRef("");

  var step4SubstepVideoSrcState = useState("");
  var step4SubstepVideoSrc = step4SubstepVideoSrcState[0];
  var setStep4SubstepVideoSrc = step4SubstepVideoSrcState[1];
  var step4SubstepVideoVisibleState = useState(false);
  var step4SubstepVideoVisible = step4SubstepVideoVisibleState[0];
  var setStep4SubstepVideoVisible = step4SubstepVideoVisibleState[1];
  var step4SubstepVideoPlaybackEndedState = useState(false);
  var step4SubstepVideoPlaybackEnded = step4SubstepVideoPlaybackEndedState[0];
  var setStep4SubstepVideoPlaybackEnded = step4SubstepVideoPlaybackEndedState[1];

  // Preload visual assets to avoid flashes during step transitions.
  useEffect(function () {
    var sources = ["assets/question.svg"];
    var i;
    var addSrc = function (src) {
      if (!src) return;
      if (sources.indexOf(src) === -1) sources.push(src);
    };

    if (APP_DATA.step5 && APP_DATA.step5.img) {
      addSrc("assets/" + APP_DATA.step5.img);
    }
    if (APP_DATA.step5Split3 && APP_DATA.step5Split3.img) {
      addSrc("assets/" + APP_DATA.step5Split3.img);
    }
    if (APP_DATA.split2Config) {
      for (i = 0; i < APP_DATA.split2Config.length; i++) {
        addSrc("assets/" + APP_DATA.split2Config[i].img);
        if (APP_DATA.split2Config[i].imgCorrect) {
          addSrc("assets/" + APP_DATA.split2Config[i].imgCorrect);
        }
      }
    }
    if (APP_DATA.split3Config) {
      for (i = 0; i < APP_DATA.split3Config.length; i++) {
        addSrc("assets/" + APP_DATA.split3Config[i].img);
        if (APP_DATA.split3Config[i].imgCorrect) {
          addSrc("assets/" + APP_DATA.split3Config[i].imgCorrect);
        }
        if (APP_DATA.split3Config[i].imgEnd) {
          addSrc("assets/" + APP_DATA.split3Config[i].imgEnd);
        }
      }
    }

    for (i = 0; i < sources.length; i++) {
      var img = new Image();
      img.src = sources[i];
    }
  }, []);

  // ── Derived ──
  var config =
    selectedSplit === "split2"
      ? APP_DATA.split2Config
      : selectedSplit === "split3"
        ? APP_DATA.split3Config
        : null;

  var getStep5Data = function () {
    if (selectedSplit === "split3" && APP_DATA.step5Split3) {
      return APP_DATA.step5Split3;
    }
    return APP_DATA.step5;
  };

  var getNavForStep5 = function (idx) {
    var d = getStep5Data();
    var lastIdx = d.texts.length - 1;
    var oneRouteDoneAlready = exploredSplit2 !== exploredSplit3;
    if (idx === lastIdx && oneRouteDoneAlready && APP_DATA.step5NavSummarise) {
      return APP_DATA.step5NavSummarise;
    }
    return d.navs[idx];
  };
  var currentSubConfig =
    config && substep >= 0 && substep < config.length ? config[substep] : null;

  var hasHighlight =
    currentSubConfig &&
    currentSubConfig.text1 &&
    currentSubConfig.text1.indexOf("[") !== -1 &&
    !currentSubConfig.text2;

  var hasText2 = currentSubConfig && !!currentSubConfig.text2;

  var showNumpadInRight = step === 4 && hasText2 && boxState !== "correct";

  var showRightPanel = step >= 2;

  // ── Highlighted step index in right panel ──
  var getHighlightedStepIndex = function () {
    if (step === 2) return -1;
    if (step === 3) return 0;
    if (step === 4) return 1;
    if (step === 5) return 2;
    return -1;
  };

  // Preload + decode first step-4 image for this route so 3→4 does not flash question.svg
  // or wait on undecoded pixels when the video overlay is removed.
  var preloadFirstStep4ImageForSplit = function (split) {
    var cfg =
      split === "split2"
        ? APP_DATA.split2Config
        : split === "split3"
          ? APP_DATA.split3Config
          : null;
    if (!cfg || !cfg[0] || !cfg[0].img) return;
    var url = "assets/" + cfg[0].img;
    firstStep4ImageUrlRef.current = url;
    var im = new Image();
    im.src = url;
    if (typeof im.decode === "function") {
      im.decode().catch(function () {});
    }
  };

  // ── Current image ──
  var getCurrentImage = function () {
    if (step === 1 || step === 2) return "assets/question.svg";
    if (step === 3) {
      return "assets/question.svg";
    }
    if (step === 4 && currentSubConfig) {
      if (boxState === "correct" && currentSubConfig.imgCorrect) {
        return "assets/" + currentSubConfig.imgCorrect;
      }
      if (currentSubConfig.imgEnd && step4SubstepVideoPlaybackEnded) {
        return "assets/" + currentSubConfig.imgEnd;
      }
      return "assets/" + currentSubConfig.img;
    }
    if (step === 5) return "assets/" + getStep5Data().img;
    // Step 4 before currentSubConfig is ready: use preloaded route first image, not question.svg.
    if (step === 4 && firstStep4ImageUrlRef.current) {
      return firstStep4ImageUrlRef.current;
    }
    return "assets/question.svg";
  };

  // ── Cleanup ──
  var clearWrongTimer = function () {
    if (wrongTimerRef.current) {
      clearTimeout(wrongTimerRef.current);
      wrongTimerRef.current = null;
    }
  };

  // ── Step init ──
  useEffect(
    function () {
      clearWrongTimer();
      setNumpadValue("");
      setBoxState("default");

      if (step === 1) {
        onSetNextEnabled(false);
        registerNextOverride(null);
        registerPrevOverride(null);
      } else if (step === 2) {
        onSetNextEnabled(true);
        registerNextOverride(null);
        registerPrevOverride(null);
      } else if (step === 3) {
        onSetNextEnabled(false);
        setSelectedSplit(null);
        firstStep4ImageUrlRef.current = "";
        setStep3VideoSrc("");
        setStep3VideoVisible(false);
        registerNextOverride(null);
        registerPrevOverride(null);
      } else if (step === 4) {
        setSubstep(0);
        setStep3VideoSrc("");
        setStep3VideoVisible(false);
      } else if (step === 5) {
        setStep5Index(0);
      }

      return clearWrongTimer;
    },
    [step],
  );

  // ── Step 4: substep init & next override ──
  useEffect(
    function () {
      if (step !== 4) return;
      if (!config) {
        onSetNextEnabled(true);
        onUpdateNavText(APP_DATA.commonNavs.navCorrect);
        registerNextOverride(function () {
          registerNextOverride(null);
          onAdvanceStep();
        });
        registerPrevOverride(null);
        return;
      }
      if (substep < 0 || substep >= config.length) return;

      var sub = config[substep];
      clearWrongTimer();
      setNumpadValue("");
      setBoxState("default");

      if (sub.video) {
        setStep4SubstepVideoSrc("assets/" + sub.video);
        setStep4SubstepVideoVisible(false);
        setStep4SubstepVideoPlaybackEnded(false);
      } else {
        setStep4SubstepVideoSrc("");
        setStep4SubstepVideoVisible(false);
        setStep4SubstepVideoPlaybackEnded(false);
      }

      var hasH = sub.text1 && sub.text1.indexOf("[") !== -1 && !sub.text2;
      var hasT2 = !!sub.text2;

      if (hasH) {
        onSetNextEnabled(false);
        onUpdateNavText(APP_DATA.commonNavs.navHighlightBox);
      } else if (hasT2) {
        onSetNextEnabled(false);
        onUpdateNavText(APP_DATA.commonNavs.navNumpad);
      } else {
        onSetNextEnabled(true);
        onUpdateNavText(sub.nav);
      }

      registerNextOverride(function () {
        var nextSub = substep + 1;
        if (nextSub >= config.length) {
          registerNextOverride(null);
          onAdvanceStep();
          return;
        }
        setSubstep(nextSub);
      });
      registerPrevOverride(
        substep > 0
          ? function () {
              setSubstep(function (prev) {
                return prev - 1;
              });
            }
          : null,
      );

      return function () {
        registerNextOverride(null);
        registerPrevOverride(null);
      };
    },
    [substep, step, config],
  );

  // ── Step 5: substep init & next override ──
  useEffect(
    function () {
      if (step !== 5) return;

      var step5Data = getStep5Data();

      onSetNextEnabled(true);
      onUpdateNavText(getNavForStep5(step5Index));

      registerNextOverride(function () {
        var nextIdx = step5Index + 1;
        if (nextIdx >= step5Data.texts.length) {
          registerNextOverride(null);
          if (onFinishStep5Route && selectedSplit) {
            onFinishStep5Route(selectedSplit);
          } else {
            onAdvanceStep();
          }
          return;
        }
        setStep5Index(nextIdx);
      });
      registerPrevOverride(
        step5Index > 0
          ? function () {
              setStep5Index(function (prev) {
                return prev - 1;
              });
            }
          : null,
      );

      return function () {
        registerNextOverride(null);
        registerPrevOverride(null);
      };
    },
    [step5Index, step, selectedSplit, exploredSplit2, exploredSplit3],
  );

  // ── Handlers ──
  var handleHighlightClick = function () {
    if (typeof playSound === "function") playSound("click");
    setSubstep(function (prev) {
      return prev + 1;
    });
  };

  var handleSplitClick = function (split) {
    if (typeof playSound === "function") playSound("click");
    // Reset route-specific progression before entering step 4 to avoid
    // one-frame flashes from stale substeps on re-entry.
    setSubstep(0);
    setNumpadValue("");
    setBoxState("default");
    setSelectedSplit(split);
    preloadFirstStep4ImageForSplit(split);
    setStep3VideoSrc(split === "split2" ? "assets/2.mp4" : "assets/3.mp4");
    setStep3VideoVisible(false);
    onSetNextEnabled(false);
    onUpdateNavText(APP_DATA.step3.navTextAfterSelect);
  };

  var handleStep3VideoLoaded = function () {
    setStep3VideoVisible(true);
  };

  var handleStep3VideoEnded = function () {
    var v = step3VideoRef.current;
    if (v) {
      var lastFrameTime = Math.max(0, v.duration - 0.03);
      v.currentTime = lastFrameTime;
      v.pause();
    }
    if (selectedSplit === "split2" || selectedSplit === "split3") {
      preloadFirstStep4ImageForSplit(selectedSplit);
    }
    onSetNextEnabled(true);
  };

  var handleStep4SubstepVideoLoaded = function () {
    setStep4SubstepVideoVisible(true);
  };

  var handleStep4SubstepVideoEnded = function () {
    var v = step4SubstepVideoRef.current;
    if (v && !isNaN(v.duration) && isFinite(v.duration)) {
      var lastFrameTime = Math.max(0, v.duration - 0.03);
      v.currentTime = lastFrameTime;
      v.pause();
    }
    setStep4SubstepVideoPlaybackEnded(true);
  };

  // Keep video mounted (paused on last frame) until correct answer; then remove
  // overlay so imgEnd/imgCorrect beneath is revealed without a gap.
  var showStep4SubstepVideo =
    step === 4 &&
    currentSubConfig &&
    currentSubConfig.video &&
    boxState !== "correct" &&
    step4SubstepVideoSrc;

  var handleStepsButton = function () {
    if (typeof playSound === "function") playSound("click");
    onAdvanceStep();
  };

  var handleNumpadNumber = function (num) {
    if (boxState !== "default") return;
    if (numpadValue.length >= 3) return;
    setNumpadValue(function (prev) {
      return prev + num;
    });
  };

  var handleNumpadClear = function () {
    if (boxState !== "default") return;
    setNumpadValue(function (prev) {
      return prev.slice(0, -1);
    });
  };

  var handleNumpadSubmit = function () {
    if (boxState !== "default" || numpadValue === "") return;
    if (!currentSubConfig || !currentSubConfig.answer) return;

    if (numpadValue === currentSubConfig.answer) {
      if (typeof playSound === "function") playSound("correct");
      setBoxState("correct");
      onSetNextEnabled(true);
      onUpdateNavText(APP_DATA.commonNavs.navCorrect);
    } else {
      if (typeof playSound === "function") playSound("wrong");
      setBoxState("wrong");
      wrongTimerRef.current = setTimeout(function () {
        setBoxState("default");
        setNumpadValue("");
      }, 800);
    }
  };

  // ── Render helpers ──
  var renderText1 = function (text1) {
    if (!text1) return null;

    if (text1.indexOf("[") === -1) {
      return React.createElement(
        "span",
        { className: "text-row-content" },
        text1,
      );
    }

    var parts = [];
    var key = 0;
    var searchIndex = 0;
    var lastIndex = 0;

    while (searchIndex < text1.length) {
      var bracketStart = text1.indexOf("[", searchIndex);
      if (bracketStart === -1) break;
      var bracketEnd = text1.indexOf("]", bracketStart);
      if (bracketEnd === -1) break;

      var before = text1.substring(lastIndex, bracketStart);
      var highlighted = text1.substring(bracketStart + 1, bracketEnd);

      if (before)
        parts.push(React.createElement("span", { key: "t" + key++ }, before));

      parts.push(
        React.createElement(
          "span",
          {
            key: "h" + key++,
            className: "highlight-box",
            onClick: handleHighlightClick,
          },
          highlighted,
        ),
      );

      lastIndex = bracketEnd + 1;
      searchIndex = bracketEnd + 1;
    }

    if (lastIndex < text1.length) {
      parts.push(
        React.createElement(
          "span",
          { key: "t" + key++ },
          text1.substring(lastIndex),
        ),
      );
    }

    return React.createElement(
      "span",
      { className: "text-row-content" },
      parts,
    );
  };

  var renderText2 = function (text2) {
    if (!text2) return null;
    var parts = text2.split("[box]");
    return React.createElement(
      "span",
      { className: "text-row-content" },
      React.createElement("span", {
        dangerouslySetInnerHTML: { __html: parts[0] },
      }),
      React.createElement(
        "span",
        { className: "answer-box " + boxState },
        numpadValue || "\u00A0\u00A0",
      ),
      parts[1] ? React.createElement("span", null, parts[1]) : null,
    );
  };

  // ── Action Row ──
  var renderActionRow = function () {
    if (step === 1) {
      return React.createElement(
        "div",
        { className: "action-content" },
        React.createElement(
          "button",
          { className: "action-btn", onClick: handleStepsButton },
          APP_DATA.step1.buttonText,
        ),
      );
    }

    if (step === 2) {
      return React.createElement("div", { className: "action-content" });
    }

    if (step === 3) {
      var split2Disabled =
        exploredSplit2 ||
        selectedSplit === "split2" ||
        selectedSplit === "split3";
      var split3Disabled =
        exploredSplit3 ||
        selectedSplit === "split3" ||
        selectedSplit === "split2";
      return React.createElement(
        "div",
        { className: "action-content split-buttons" },
        React.createElement(
          "button",
          {
            className:
              "split-btn" +
              (selectedSplit === "split2" ? " clicked" : "") +
              (exploredSplit2 && selectedSplit !== "split2" ? " explored" : ""),
            onClick: function () {
              handleSplitClick("split2");
            },
            disabled: split2Disabled,
          },
          APP_DATA.step3.split2Button,
        ),
        React.createElement(
          "button",
          {
            className:
              "split-btn" +
              (selectedSplit === "split3" ? " clicked" : "") +
              (exploredSplit3 && selectedSplit !== "split3" ? " explored" : ""),
            onClick: function () {
              handleSplitClick("split3");
            },
            disabled: split3Disabled,
          },
          APP_DATA.step3.split3Button,
        ),
      );
    }

    if (step === 4 && currentSubConfig) {
      return React.createElement(
        "div",
        { className: "action-content action-column" },
        React.createElement(
          "div",
          { key: "tr1", className: "text-row" },
          renderText1(currentSubConfig.text1),
        ),
        React.createElement(
          "div",
          { key: "tr2", className: "text-row text-row-2" },
          currentSubConfig.text2 ? renderText2(currentSubConfig.text2) : null,
        ),
      );
    }

    if (step === 5) {
      var s5 = getStep5Data();
      return React.createElement(
        "div",
        { className: "action-content" },
        React.createElement(
          "span",
          { className: "action-text" },
          s5.texts[step5Index],
        ),
      );
    }

    return React.createElement("div", { className: "action-content" });
  };

  // ── Right Panel ──
  var renderRightPanel = function () {
    if (!showRightPanel) return null;

    if (showNumpadInRight) {
      return React.createElement(
        "div",
        { className: "right-column" },
        React.createElement(
          "div",
          { className: "numpad-wrapper" },
          React.createElement(Numpad, {
            onNumberClick: handleNumpadNumber,
            onClear: handleNumpadClear,
            onSubmit: handleNumpadSubmit,
            disabled: boxState === "correct",
          }),
        ),
      );
    }

    var highlightedIndex = getHighlightedStepIndex();
    var stepElements = APP_DATA.rightPanelSteps.map(function (stepInfo, i) {
      var isHighlighted = highlightedIndex === -1 || highlightedIndex === i;
      return React.createElement(
        "div",
        {
          key: "rs" + i,
          className: "right-step-text",
          style: { opacity: isHighlighted ? 1 : 0.3 },
        },
        React.createElement("div", { className: "step-title" }, stepInfo.title),
        React.createElement("div", { className: "step-desc" }, stepInfo.desc),
      );
    });

    return React.createElement(
      "div",
      { className: "right-column" },
      React.createElement(
        "div",
        { className: "right-panel-content" },
        stepElements,
      ),
    );
  };

  // ── Visual Labels ──
  var renderVisualLabels = function () {
    if (step !== 4 && step !== 5) return null;

    if (selectedSplit === "split2") {
      var labels2 = APP_DATA.split2Labels;
      if (!labels2) return null;

      var showT1Area =
        step === 5 || (step === 4 && substep >= labels2.a1step - 1);
      var showT2Area =
        step === 5 || (step === 4 && substep >= labels2.a2step - 1);

      return [
        React.createElement(
          "div",
          { key: "lbl-t1", className: "visual-label " + labels2.t1class },
          React.createElement("div", null, labels2.t1),
          showT1Area
            ? React.createElement(
                "div",
                { className: "label-area" },
                labels2.t1a,
              )
            : null,
        ),
        React.createElement(
          "div",
          { key: "lbl-t2", className: "visual-label " + labels2.t2class },
          React.createElement("div", null, labels2.t2),
          showT2Area
            ? React.createElement(
                "div",
                { className: "label-area" },
                labels2.t2a,
              )
            : null,
        ),
      ];
    }

    if (selectedSplit === "split3") {
      var labels3 = APP_DATA.split3Labels;
      if (!labels3) return null;

      var showR1Area =
        step === 5 || (step === 4 && substep >= labels3.a1step - 1);
      var showR2Area =
        step === 5 || (step === 4 && substep >= labels3.a2step - 1);
      var showTrArea =
        step === 5 || (step === 4 && substep >= labels3.a3step - 1);

      return [
        React.createElement(
          "div",
          { key: "lbl-r1", className: "visual-label " + labels3.r1class },
          React.createElement("div", null, labels3.r1),
          showR1Area
            ? React.createElement(
                "div",
                { className: "label-area" },
                labels3.r1a,
              )
            : null,
        ),
        React.createElement(
          "div",
          { key: "lbl-r2", className: "visual-label " + labels3.r2class },
          React.createElement("div", null, labels3.r2),
          showR2Area
            ? React.createElement(
                "div",
                { className: "label-area" },
                labels3.r2a,
              )
            : null,
        ),
        React.createElement(
          "div",
          { key: "lbl-tr", className: "visual-label " + labels3.trclass },
          React.createElement("div", null, labels3.tr),
          showTrArea
            ? React.createElement(
                "div",
                { className: "label-area" },
                labels3.tra,
              )
            : null,
        ),
      ];
    }

    return null;
  };

  // ── Main Render ──
  return React.createElement(
    "div",
    { className: "main-canvas-container" },
    React.createElement(
      "div",
      {
        className: "left-column" + (showRightPanel ? "" : " full-width"),
      },
      React.createElement(
        "div",
        { className: "visual-row" },
        React.createElement(
          "div",
          { className: "visual-media-frame" },
          React.createElement("img", {
            src: getCurrentImage(),
            alt: "",
            className: "visual-image",
          }),
          step === 3 && step3VideoSrc
            ? React.createElement("video", {
                key: step3VideoSrc,
                ref: step3VideoRef,
                src: step3VideoSrc,
                className:
                  "split-video-overlay" + (step3VideoVisible ? " visible" : ""),
                autoPlay: true,
                muted: true,
                playsInline: true,
                preload: "auto",
                onLoadedData: handleStep3VideoLoaded,
                onEnded: handleStep3VideoEnded,
              })
            : null,
          showStep4SubstepVideo
            ? React.createElement("video", {
                key: step4SubstepVideoSrc,
                ref: step4SubstepVideoRef,
                src: step4SubstepVideoSrc,
                className:
                  "split-video-overlay" +
                  (step4SubstepVideoVisible ? " visible" : ""),
                autoPlay: true,
                muted: true,
                playsInline: true,
                preload: "auto",
                onLoadedData: handleStep4SubstepVideoLoaded,
                onEnded: handleStep4SubstepVideoEnded,
              })
            : null,
        ),
        renderVisualLabels(),
      ),
      React.createElement(
        "div",
        { className: "action-row" },
        renderActionRow(),
      ),
    ),
    renderRightPanel(),
  );
};
