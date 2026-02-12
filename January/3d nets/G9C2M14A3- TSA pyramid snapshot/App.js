const App = () => {
  const { useState, useRef, useEffect } = React;

  // Colors
  const SEA_GREEN = APP_DATA.colors.green;
  const SEA_BLUE = APP_DATA.colors.blue;

  // ---- Button states ----
  const [btn1Enabled, setBtn1Enabled] = useState(true);
  const [btn2Enabled, setBtn2Enabled] = useState(false);
  const [btn1Clicked, setBtn1Clicked] = useState(false);
  const [btn2Clicked, setBtn2Clicked] = useState(false);

  // ---- Text box states ----
  const [text1Visible, setText1Visible] = useState(false);
  const [text1Display, setText1Display] = useState("");
  const [text2Visible, setText2Visible] = useState(false);
  const [text2Display, setText2Display] = useState("");

  // ---- Pyramid states ----
  const [unfoldValue, setUnfoldValue] = useState(0);
  const [isUnfolded, setIsUnfolded] = useState(false);
  const [baseFillTransparent, setBaseFillTransparent] = useState(false);
  const [labelMode, setLabelMode] = useState("none");

  // ---- Highlight animation trigger: "lateral" = 4 faces, "total" = 5 faces ----
  const [highlightTrigger, setHighlightTrigger] = useState(null);

  // ---- Folded state labels ("a", "l", yellow line): show only after highlight ends, hide when unfold starts ----
  const [showFoldedLabelsVisible, setShowFoldedLabelsVisible] = useState(false);

  // ---- Formula states ----
  const [formula1Visible, setFormula1Visible] = useState(false);
  const [formula2Visible, setFormula2Visible] = useState(false);

  // ---- Tap gif states ----
  const [showTap1, setShowTap1] = useState(true);
  const [showTap2, setShowTap2] = useState(false);

  // ---- Refs for cleanup ----
  const typewriterRef = useRef(null);
  const unfoldAnimRef = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typewriterRef.current) clearInterval(typewriterRef.current);
      if (unfoldAnimRef.current) unfoldAnimRef.current.kill();
    };
  }, []);

  // ===== BUTTON 1 CLICK HANDLER (Lateral) =====
  const handleBtn1Click = () => {
    if (!btn1Enabled || btn1Clicked) return;
    playSound("click");
    setBtn1Clicked(true);
    setBtn1Enabled(false);
    setShowTap1(false);

    // 1. Show text box 1 with typewriter (character by character, 30ms)
    setText1Visible(true);
    typewriterRef.current = typewriterEffect(
      APP_DATA.texts[0],
      setText1Display,
      30,
      () => {
        // [delay 0.5s] after text finishes → start highlight (4 lateral faces only)
        setTimeout(() => {
          setHighlightTrigger("lateral");
        }, 500);
      }
    );
  };

  // Called when highlight animation completes (from SquarePyramid)
  const handleHighlightComplete = (type) => {
    setShowFoldedLabelsVisible(true); // show "a", "l" and yellow line now that highlight is over
    // [delay 0.5s] after highlight → unfold
    setTimeout(() => {
      const anim = { value: 0 };
      unfoldAnimRef.current = gsap.to(anim, {
        value: 1,
        duration: 2,
        ease: "power2.inOut",
        onUpdate: () => setUnfoldValue(anim.value),
        onComplete: () => {
          setIsUnfolded(true);
          setUnfoldValue(1);
          setLabelMode("side");
          setBaseFillTransparent(true);

          // [delay 0.5s] after unfold → formula row 1
          setTimeout(() => {
            setFormula1Visible(true);
            setTimeout(() => {
              setBtn2Enabled(true);
              setShowTap2(true);
            }, 600);
          }, 500);
        },
      });
    }, 500);
  };

  // ===== BUTTON 2 CLICK HANDLER (Total) =====
  const handleBtn2Click = () => {
    if (!btn2Enabled || btn2Clicked) return;
    playSound("click");
    setBtn2Clicked(true);
    setBtn2Enabled(false);
    setShowTap2(false);

    // 1. Immediately fold pyramid to default (no animation); hide folded labels until highlight ends
    setUnfoldValue(0);
    setIsUnfolded(false);
    setBaseFillTransparent(false);
    setLabelMode("none");
    setShowFoldedLabelsVisible(false);

    // 2. Show text box 2 with typewriter
    setText2Visible(true);
    typewriterRef.current = typewriterEffect(
      APP_DATA.texts[1],
      setText2Display,
      30,
      () => {
        // [delay 0.5s] after text finishes → start highlight (all 5 faces)
        setTimeout(() => {
          setHighlightTrigger("total");
        }, 500);
      }
    );
  };

  // Called when "total" highlight animation completes
  const handleTotalHighlightComplete = () => {
    setShowFoldedLabelsVisible(true); // show "a", "l" and yellow line now that highlight is over
    // [delay 0.5s] after highlight → unfold
    setTimeout(() => {
      const anim = { value: 0 };
      unfoldAnimRef.current = gsap.to(anim, {
        value: 1,
        duration: 2,
        ease: "power2.inOut",
        onUpdate: () => setUnfoldValue(anim.value),
        onComplete: () => {
          setIsUnfolded(true);
          setUnfoldValue(1);
          setLabelMode("side");
          // Total flow: keep base visible throughout (do not set transparent)

          // [delay 0.5s] then play click and show formula 2
          setTimeout(() => {
            playSound("click");
            setTimeout(() => {
              setFormula2Visible(true);
            }, 500);
          }, 500);
        },
      });
    }, 500);
  };

  const onHighlightAnimationComplete = (type) => {
    if (type === "lateral") handleHighlightComplete(type);
    if (type === "total") handleTotalHighlightComplete();
  };

  // ===== RENDER =====
  return React.createElement(
    "div",
    { className: "applet-container" },
    React.createElement(
      "div",
      { className: "app-main-content" },
      React.createElement(MainCanvas, {
        btn1Enabled,
        btn2Enabled,
        btn1Clicked,
        btn2Clicked,
        text1Visible,
        text1Display,
        text2Visible,
        text2Display,
        unfoldValue,
        isUnfolded,
        baseFillTransparent,
        labelMode,
        formula1Visible,
        formula2Visible,
        showTap1,
        showTap2,
        highlightTrigger,
        showFoldedLabelsVisible,
        onHighlightAnimationComplete,
        onBtn1Click: handleBtn1Click,
        onBtn2Click: handleBtn2Click,
        greenColor: SEA_GREEN,
        blueColor: SEA_BLUE,
      })
    )
  );
};
