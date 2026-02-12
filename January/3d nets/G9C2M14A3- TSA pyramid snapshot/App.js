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

  // ===== BUTTON 1 CLICK HANDLER =====
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
        // [delay 0.5s] after text finishes
        setTimeout(() => {
          // 2. Unfold pyramid, show side labels, make base transparent
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

              // [delay 0.5s] after unfold
              setTimeout(() => {
                // 3. Show formula row 1 with opacity animation
                setFormula1Visible(true);

                // After formula appears, enable button 2
                setTimeout(() => {
                  setBtn2Enabled(true);
                  setShowTap2(true);
                }, 600);
              }, 500);
            },
          });
        }, 500);
      }
    );
  };

  // ===== BUTTON 2 CLICK HANDLER =====
  const handleBtn2Click = () => {
    if (!btn2Enabled || btn2Clicked) return;
    playSound("click");
    setBtn2Clicked(true);
    setBtn2Enabled(false);
    setShowTap2(false);

    // 1. Show text box 2 with typewriter (character by character, 30ms)
    setText2Visible(true);
    typewriterRef.current = typewriterEffect(
      APP_DATA.texts[1],
      setText2Display,
      30,
      () => {
        // [delay 0.5s] after text finishes
        setTimeout(() => {
          // 2. Color the square base (play click sound)
          setBaseFillTransparent(false);
          playSound("click");

          // [delay 0.5s] after base colored
          setTimeout(() => {
            // 3. Show formula row 2 with opacity animation
            setFormula2Visible(true);
          }, 500);
        }, 500);
      }
    );
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
        onBtn1Click: handleBtn1Click,
        onBtn2Click: handleBtn2Click,
        greenColor: SEA_GREEN,
        blueColor: SEA_BLUE,
      })
    )
  );
};
