/* ── Plane Landing – Main Canvas ── */

const STEP2_PAUSE_AT = 0.6;
const STEP3_PAUSE_AT = 0.7;
const COMPARE_FIRST_DELAY_MS = 200;
const COMPARE_FIRST_MAX_MS = 4500;
const COMPARE_SECOND_MAX_MS = 5000;
const LAND_NEXT_DELAY_MS = 2500;
const FINALE_IMAGE_TRANSITION_MS = 1000;

const MainCanvas = (props) => {
  const {
    step,
    advanceRef,
    onSetNextEnabled,
    onUpdateTexts,
    onSetNextLabel,
    onSetQuestionCollapsed,
    onRestart,
    onRegisterNudgeTarget,
    onHideNudge,
  } = props;
  const { useState, useEffect, useRef, useCallback } = React;

  const assets = APP_DATA.assets;

  const mainVideoRef = useRef(null);
  const badVideoRef = useRef(null);
  const goodVideoRef = useRef(null);
  const step2PhaseRef = useRef("init");
  const compareTimersRef = useRef([]);

  const [topText, setTopText] = useState("");
  const [topTextVisible, setTopTextVisible] = useState(false);
  const [showLandButton, setShowLandButton] = useState(false);
  const [compareLooping, setCompareLooping] = useState(false);
  const [step6Phase, setStep6Phase] = useState("cards");
  const [gifHidden, setGifHidden] = useState(false);
  const [finalImageActive, setFinalImageActive] = useState(false);
  const [finalImageFinal, setFinalImageFinal] = useState(false);
  const [finaleTextVisible, setFinaleTextVisible] = useState(false);

  const clearCompareTimers = useCallback(() => {
    compareTimersRef.current.forEach(clearTimeout);
    compareTimersRef.current = [];
  }, []);

  const registerVideoNudge = useCallback(() => {
    setTimeout(() => {
      const el = document.getElementById("video-row");
      if (el && onRegisterNudgeTarget) {
        onRegisterNudgeTarget(el.getBoundingClientRect());
      }
    }, 400);
  }, [onRegisterNudgeTarget]);

  const registerLandNudge = useCallback(() => {
    setTimeout(() => {
      const el = document.getElementById("land-button");
      if (el && onRegisterNudgeTarget) {
        onRegisterNudgeTarget(el.getBoundingClientRect());
      }
    }, 400);
  }, [onRegisterNudgeTarget]);

  const pauseAtTime = useCallback((video, time) => {
    if (!video) return;
    video.currentTime = time;
    video.pause();
  }, []);

  const startFinaleAnimation = useCallback(() => {
    const stepData = APP_DATA.steps[6];
    setGifHidden(true);
    setFinalImageActive(true);
    setFinalImageFinal(false);
    onSetQuestionCollapsed(true);
    onUpdateTexts(undefined, stepData.navTextDone);
    onSetNextLabel(stepData.startOver);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setFinalImageFinal(true);
      });
    });

    setTimeout(() => {
      setFinaleTextVisible(true);
      onSetNextEnabled(true);
    }, FINALE_IMAGE_TRANSITION_MS);
  }, [onSetNextEnabled, onSetNextLabel, onSetQuestionCollapsed, onUpdateTexts]);

  useEffect(() => {
    advanceRef.current = () => {
      if (step === 6 && step6Phase === "cards") {
        onSetNextEnabled(false);
        setStep6Phase("finale");
        startFinaleAnimation();
        return true;
      }
      if (step === 6 && step6Phase === "finale") {
        onRestart();
        return true;
      }
      return false;
    };
    return () => {
      advanceRef.current = null;
    };
  }, [step, step6Phase, advanceRef, onRestart, onSetNextEnabled, startFinaleAnimation]);

  // ── Step 1 ──
  useEffect(() => {
    if (step !== 1) return;
    setTopText("");
    setTopTextVisible(false);
    setShowLandButton(false);
    onSetNextEnabled(true);
    onUpdateTexts(undefined, null);

    const video = mainVideoRef.current;
    if (!video) return;
    video.muted = false;
    video.loop = false;
    const reset = () => pauseAtTime(video, 0);
    if (video.readyState >= 1) reset();
    else video.addEventListener("loadeddata", reset, { once: true });
  }, [step, onSetNextEnabled, onUpdateTexts, pauseAtTime]);

  // ── Step 2 ──
  useEffect(() => {
    if (step !== 2) return;
    const stepData = APP_DATA.steps[2];
    step2PhaseRef.current = "playing";
    setTopText("");
    setTopTextVisible(false);
    setShowLandButton(false);
    onSetNextEnabled(false);
    onUpdateTexts(undefined, stepData.navText);

    const video = mainVideoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (step2PhaseRef.current !== "playing") return;
      if (video.currentTime >= STEP2_PAUSE_AT) {
        video.pause();
        video.removeEventListener("timeupdate", handleTimeUpdate);
        step2PhaseRef.current = "malfunction";
        setTopText(stepData.topTextMalfunction);
        setTopTextVisible(true);
        registerVideoNudge();
      }
    };

    const startPlay = () => {
      video.muted = false;
      video.loop = false;
      video.currentTime = 0;
      video.play().catch(() => {});
      video.addEventListener("timeupdate", handleTimeUpdate);
    };

    if (video.readyState >= 1) startPlay();
    else video.addEventListener("loadeddata", startPlay, { once: true });

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [step, onSetNextEnabled, onUpdateTexts, registerVideoNudge]);

  const handleStep2VideoTap = useCallback(() => {
    if (step !== 2 || step2PhaseRef.current !== "malfunction") return;
    if (typeof playSound === "function") playSound("click");
    onHideNudge();

    const video = mainVideoRef.current;
    if (!video) return;
    step2PhaseRef.current = "finishing";

    const handleEnded = () => {
      video.pause();
      step2PhaseRef.current = "crashed";
      setTopText(APP_DATA.steps[2].topTextCrashed);
      onSetNextEnabled(true);
      onUpdateTexts(undefined, APP_DATA.steps[2].navTextDone);
    };

    video.addEventListener("ended", handleEnded, { once: true });
    video.play().catch(() => {});
  }, [step, onHideNudge, onSetNextEnabled, onUpdateTexts]);

  // ── Step 3 ──
  useEffect(() => {
    if (step !== 3) return;
    const stepData = APP_DATA.steps[3];
    setTopText("");
    setTopTextVisible(false);
    setShowLandButton(false);
    onSetNextEnabled(false);
    onUpdateTexts(undefined, stepData.navText);

    const video = mainVideoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (video.currentTime >= STEP3_PAUSE_AT) {
        video.pause();
        video.removeEventListener("timeupdate", handleTimeUpdate);
        setTopText(stepData.topTextMalfunction);
        setTopTextVisible(true);
        setShowLandButton(true);
        onUpdateTexts(undefined, stepData.navTextLand);
        registerLandNudge();
      }
    };

    const startPlay = () => {
      video.muted = false;
      video.loop = false;
      video.currentTime = 0;
      video.play().catch(() => {});
      video.addEventListener("timeupdate", handleTimeUpdate);
    };

    if (video.readyState >= 1) startPlay();
    else video.addEventListener("loadeddata", startPlay, { once: true });

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [step, onSetNextEnabled, onUpdateTexts, registerLandNudge]);

  const handleLandClick = useCallback(() => {
    if (step !== 3 || !showLandButton) return;
    if (typeof playSound === "function") playSound("click");
    onHideNudge();
    setShowLandButton(false);

    const video = mainVideoRef.current;
    if (!video) return;

    const handleEnded = () => {
      video.pause();
      setTopText(APP_DATA.steps[3].topTextLanded);
      setTimeout(() => {
        onSetNextEnabled(true);
        onUpdateTexts(undefined, APP_DATA.steps[3].navTextDone);
      }, LAND_NEXT_DELAY_MS);
    };

    video.addEventListener("ended", handleEnded, { once: true });
    video.play().catch(() => {});
  }, [step, showLandButton, onHideNudge, onSetNextEnabled, onUpdateTexts]);

  const startCompareLoop = useCallback(() => {
    const bad = badVideoRef.current;
    const good = goodVideoRef.current;
    if (!bad || !good) return;

    setCompareLooping(true);
    bad.loop = true;
    good.loop = true;
    bad.muted = true;
    good.muted = true;
    bad.currentTime = 0;
    good.currentTime = 0;
    bad.play().catch(() => {});
    good.play().catch(() => {});
  }, []);

  const playCompareSecond = useCallback(() => {
    const good = goodVideoRef.current;
    if (!good) return;

    let secondDone = false;
    const finishSecond = () => {
      if (secondDone) return;
      secondDone = true;
      good.removeEventListener("ended", finishSecond);
      startCompareLoop();
    };

    good.muted = false;
    good.loop = false;
    good.currentTime = 0;
    good.play().catch(() => {});
    good.addEventListener("ended", finishSecond);

    const backup = setTimeout(finishSecond, COMPARE_SECOND_MAX_MS);
    compareTimersRef.current.push(backup);
  }, [startCompareLoop]);
  useEffect(() => {
    if (step !== 4) return;

    const stepData = APP_DATA.steps[4];
    setCompareLooping(false);
    onSetNextEnabled(true);
    onUpdateTexts(undefined, stepData.navText);

    let cancelled = false;
    let cleanup = () => {};

    const initCompare = () => {
      const bad = badVideoRef.current;
      const good = goodVideoRef.current;
      if (!bad || !good) {
        requestAnimationFrame(initCompare);
        return;
      }
      if (cancelled) return;

      clearCompareTimers();

      const setupVideo = (video) => {
        video.loop = false;
        video.muted = false;
        video.pause();
        video.currentTime = 0;
      };

      setupVideo(bad);
      setupVideo(good);

      let firstDone = false;
      const finishFirst = () => {
        if (firstDone || cancelled) return;
        firstDone = true;
        bad.removeEventListener("ended", finishFirst);
        playCompareSecond();
      };

      const startFirst = () => {
        if (cancelled) return;
        bad.muted = false;
        bad.play().catch(() => {});
        bad.addEventListener("ended", finishFirst);
        const backup = setTimeout(finishFirst, COMPARE_FIRST_MAX_MS);
        compareTimersRef.current.push(backup);
      };

      const delay = setTimeout(startFirst, COMPARE_FIRST_DELAY_MS);
      compareTimersRef.current.push(delay);

      cleanup = () => {
        clearCompareTimers();
        bad.removeEventListener("ended", finishFirst);
      };
    };

    initCompare();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [step, onSetNextEnabled, onUpdateTexts, clearCompareTimers, playCompareSecond]);

  // ── Step 5 – keep compare videos looping ──
  useEffect(() => {
    if (step !== 5) return;
    const stepData = APP_DATA.steps[5];
    onSetNextEnabled(true);
    onUpdateTexts(undefined, stepData.navText);

    const bad = badVideoRef.current;
    const good = goodVideoRef.current;
    if (!bad || !good) return;

    setCompareLooping(true);
    bad.loop = true;
    good.loop = true;
    bad.muted = true;
    good.muted = true;
    bad.currentTime = 0;
    good.currentTime = 0;
    bad.play().catch(() => {});
    good.play().catch(() => {});
  }, [step, onSetNextEnabled, onUpdateTexts]);

  // ── Step 6 ──
  useEffect(() => {
    if (step !== 6) return;
    const stepData = APP_DATA.steps[6];
    setStep6Phase("cards");
    setGifHidden(false);
    setFinalImageActive(false);
    setFinalImageFinal(false);
    setFinaleTextVisible(false);
    onSetNextEnabled(true);
    onSetNextLabel("\u00BB");
    onSetQuestionCollapsed(false);
    onUpdateTexts(undefined, stepData.navText);
  }, [
    step,
    onSetNextEnabled,
    onSetNextLabel,
    onSetQuestionCollapsed,
    onUpdateTexts,
  ]);

  const renderTopRow = () =>
    React.createElement(
      "div",
      { className: "main-canvas__row main-canvas__top-row" },
      React.createElement("div", {
        className:
          "main-canvas__top-text" +
          (topTextVisible ? " main-canvas__top-text--visible" : ""),
        dangerouslySetInnerHTML: { __html: topText || "" },
      })
    );

  const renderVideoRow = (src, onClick, clickable) =>
    React.createElement(
      "div",
      {
        id: "video-row",
        className:
          "main-canvas__row main-canvas__video-row" +
          (clickable ? " main-canvas__video-row--clickable" : ""),
        onClick: clickable ? onClick : undefined,
      },
      React.createElement("video", {
        ref: mainVideoRef,
        className: "main-canvas__video",
        src,
        playsInline: true,
        preload: "auto",
      })
    );

  const renderBottomRow = () =>
    React.createElement(
      "div",
      { className: "main-canvas__row main-canvas__bottom-row" },
      showLandButton
        ? React.createElement(
            "button",
            {
              id: "land-button",
              className: "main-canvas__action-btn",
              onClick: handleLandClick,
            },
            APP_DATA.steps[3].landButton
          )
        : null
    );

  const renderThreeRowLayout = (videoSrc, videoClickable, onVideoClick) =>
    React.createElement(
      "div",
      { className: "main-canvas main-canvas--three-row" },
      renderTopRow(),
      renderVideoRow(videoSrc, onVideoClick, videoClickable),
      renderBottomRow()
    );

  const renderCompareColumn = (title, titleClass, videoRef, src) =>
    React.createElement(
      "div",
      { className: "main-canvas__compare-col" },
      React.createElement(
        "div",
        { className: "main-canvas__compare-title " + titleClass },
        title
      ),
      React.createElement(
        "div",
        { className: "main-canvas__compare-media" },
        React.createElement("video", {
          ref: videoRef,
          className: "main-canvas__video",
          src,
          playsInline: true,
          preload: "auto",
          muted: compareLooping,
          loop: compareLooping,
        })
      )
    );

  const renderCompareLayout = () => {
    const stepData = APP_DATA.steps[step];
    return React.createElement(
      "div",
      { className: "main-canvas main-canvas--compare" },
      React.createElement(
        "div",
        { className: "main-canvas__compare-row" },
        renderCompareColumn(
          stepData.badTitle,
          "main-canvas__compare-title--bad",
          badVideoRef,
          assets.crash1
        ),
        renderCompareColumn(
          stepData.goodTitle,
          "main-canvas__compare-title--good",
          goodVideoRef,
          assets.good2
        )
      ),
      React.createElement("div", {
        className: "main-canvas__compare-text",
        dangerouslySetInnerHTML: { __html: stepData.compareText || "" },
      })
    );
  };

  const renderStep6 = () => {
    const stepData = APP_DATA.steps[6];
    return React.createElement(
      "div",
      { className: "main-canvas main-canvas--step6" },
      React.createElement(GifVisual, {
        cards: stepData.cards,
        cardText: stepData.cardText,
        hidden: gifHidden,
        assets: assets,
      }),
      finalImageActive
        ? React.createElement(
            "div",
            { className: "main-canvas__finale" },
            React.createElement("img", {
              className:
                "main-canvas__final-image" +
                (finalImageFinal
                  ? " main-canvas__final-image--final"
                  : " main-canvas__final-image--initial"),
              src: assets.final,
              alt: "",
            }),
            React.createElement("div", {
              className:
                "main-canvas__finale-text" +
                (finaleTextVisible
                  ? " main-canvas__finale-text--visible"
                  : ""),
              dangerouslySetInnerHTML: { __html: stepData.finaleText || "" },
            })
          )
        : null
    );
  };

  if (step === 1) {
    return renderThreeRowLayout(assets.crash1, false, null);
  }

  if (step === 2) {
    return renderThreeRowLayout(assets.crash1, true, handleStep2VideoTap);
  }

  if (step === 3) {
    return renderThreeRowLayout(assets.good1, false, null);
  }

  if (step === 4 || step === 5) {
    return renderCompareLayout();
  }

  if (step === 6) {
    return renderStep6();
  }

  return null;
};
