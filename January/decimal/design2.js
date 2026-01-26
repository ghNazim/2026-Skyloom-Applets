import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const App = () => {
  const [pos, setPos] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [gsapLoaded, setGsapLoaded] = useState(false);

  const containerRef = useRef(null);
  const decimalRef = useRef(null);
  const digit3Ref = useRef(null);
  const digit0Refs = useRef([]);
  const slotsRef = useRef([]);

  const labels = ["hundreds", "tens", "ones", "tenths", "hundredths"];
  const placeSymbols = ["H", "T", "O", "t", "h"];
  const baseDigits = ["0", "0", "3", "0", "0", "0", "0", "0"];
  const SLOT_WIDTH = 4.5; // vw
  const dotIndices = [5, 4, 3, 2, 1];

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
    script.async = true;
    script.onload = () => setGsapLoaded(true);
    document.head.appendChild(script);
    return () => {
      if (document.head.contains(script)) document.head.removeChild(script);
    };
  }, []);

  const triggerTransition = (newPos) => {
    if (!window.gsap || isMoving) return;
    setIsMoving(true);

    const gsap = window.gsap;
    const duration = 0.7;
    const ease = "power2.inOut";

    // 1. Swap Animation Logic
    const activeBox = digit3Ref.current;
    const targetBox = digit0Refs.current[newPos];

    if (activeBox && targetBox) {
      const activeRect = activeBox.getBoundingClientRect();
      const targetRect = targetBox.getBoundingClientRect();
      const deltaX = targetRect.left - activeRect.left;

      gsap.to(activeBox, { x: deltaX, duration, ease });
      gsap.to(targetBox, { x: -deltaX, duration, ease });
    }

    // 2. Decimal Arc Animation
    const dot = decimalRef.current;
    if (dot) {
      const currentSlot = slotsRef.current[dotIndices[pos]];
      const nextSlot = slotsRef.current[dotIndices[newPos]];
      const startRect = currentSlot.getBoundingClientRect();
      const endRect = nextSlot.getBoundingClientRect();
      const totalShift = endRect.left - startRect.left;

      gsap.set(dot, { x: 0, y: 0 }); // Ensure clean start
      const tl = gsap.timeline();
      tl.to(dot, {
        x: totalShift,
        y: "2.5vw",
        duration: duration / 2,
        ease: "power1.out",
      }).to(dot, {
        y: 0,
        duration: duration / 2,
        ease: "power1.in",
        onComplete: () => {
          // Sync state at exact end of visual motion
          setPos(newPos);
          setIsMoving(false);

          // Clear all GSAP transforms so React takes over positions instantly without flicker
          gsap.set([activeBox, targetBox, dot], {
            clearProps: "transform,x,y",
          });
        },
      });
    }
  };

  const move = (direction) => {
    const next = direction === "right" ? pos + 1 : pos - 1;
    if (next >= 0 && next <= 4) triggerTransition(next);
  };

  const getDigitColor = (idx) => {
    const dotIdx = dotIndices[pos];
    const isThree = idx === 2;
    if (isThree) return "var(--white)";
    if (idx > 2 && idx < dotIdx) return "var(--yellow)";
    if (idx >= dotIdx && idx < dotIdx + 2) return "var(--white)";
    return "var(--white-dim)";
  };

  return (
    <div ref={containerRef} className="app-wrapper">
      <style>{`
        :root {
          --bg-dark: #0f2e3d;
          --green-border: #3da37a;
          --green-pill: #4caf50;
          --pink-border: #914660;
          --pink-pill: #e91e63;
          --purple-border: #4d4982;
          --purple-pill: #7e57c2;
          --cyan: #00bcd4;
          --gray-border: #526b77;
          --yellow: #ffd54f;
          --orange: #ffb74d;
          --white: #ffffff;
          --white-dim: rgba(255, 255, 255, 0.2);
        }

        .app-wrapper {
          min-height: 100vh;
          background-color: var(--bg-dark);
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Ctext x='20' y='50' fill='rgba(255,255,255,0.03)' font-size='40' font-family='cursive'%3E76 39 12%3C/text%3E%3Ctext x='300' y='120' fill='rgba(255,255,255,0.03)' font-size='50' font-family='cursive'%3E910%3C/text%3E%3Ctext x='100' y='300' fill='rgba(255,255,255,0.03)' font-size='60' font-family='cursive'%3E59%3C/text%3E%3C/svg%3E");
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 2vw;
          font-family: 'Segoe UI', sans-serif;
          user-select: none;
          overflow: hidden;
        }

        .main-container {
          width: 100%;
          aspect-ratio: 2 / 1;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          gap: 2.5%;
          position: relative;
        }

        .instruction {
          text-align: center;
          color: var(--orange);
          font-size: 2.5vw;
          font-weight: 500;
          height: 10%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .box {
          position: relative;
          background: rgba(0,0,0,0.2);
          border: 0.2vw solid transparent;
          border-radius: 1.2vw;
        }

        .pill {
          position: absolute;
          top: -1.2vw;
          left: 50%;
          transform: translateX(-50%);
          padding: 0.5vw 2vw;
          border-radius: 0.8vw;
          color: var(--white);
          font-size: 1.5vw;
          font-weight: 500;
          white-space: nowrap;
          z-index: 20;
        }

        .top-box { flex: 1.2; border-color: var(--green-border); display: flex; align-items: center; justify-content: center; padding: 4% 2% 2% 2%; }
        .top-box .pill { background: var(--green-pill); }

        .chart-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr) 4% repeat(2, 1fr);
          gap: 1.5vw;
          width: 85%;
          height: 80%;
        }

        .cell {
          border: 0.2vw solid var(--gray-border);
          border-radius: 1vw;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 3.5vw;
          color: var(--white);
          height: 100%;
          position: relative;
        }

        .digit-cell { font-size: 4vw; }
        .active-cell { background: var(--cyan); border-color: var(--cyan); z-index: 5; }
        .header-active { border-color: var(--cyan); background: rgba(0, 188, 212, 0.1); }

        .dot-circle { width: 1.2vw; height: 1.2vw; background: var(--cyan); border-radius: 50%; margin: auto; }

        /* Navigation Arrows FIXED to move with 3 */
        .arrow-container {
          position: absolute;
          bottom: -3.5vw;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 1vw;
          z-index: 30;
          animation: pulse 2s infinite ease-in-out;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1) translateX(-50%); }
          50% { transform: scale(1.1) translateX(-50%); }
        }

        .nav-btn {
          background: var(--cyan);
          border: none;
          border-radius: 50%;
          color: white;
          width: 3vw;
          height: 3vw;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 0.5vw 1vw rgba(0,0,0,0.3);
          transition: transform 0.2s;
        }
        .nav-btn:hover:not(:disabled) { transform: scale(1.1); }
        .nav-btn:active:not(:disabled) { transform: scale(0.9); }
        .nav-btn:disabled { opacity: 0.2; cursor: default; }

        /* Bottom Row */
        .bottom-row { flex: 1; display: flex; gap: 2.5%; }

        .standard-box { flex: 1.2; border-color: var(--pink-border); display: flex; justify-content: center; align-items: center; padding: 4% 2% 2% 2%; }
        .standard-box .pill { background: var(--pink-pill); }

        .standard-display { font-size: 7vw; display: flex; align-items: center; position: relative; height: 100%; }
        .char-slot { width: 4.5vw; display: flex; justify-content: center; align-items: center; }

        .decimal-point {
          position: absolute;
          background: var(--cyan);
          width: 1vw;
          height: 1vw;
          border-radius: 50%;
          top: 68%;
          transform: translate(-50%, -50%);
          z-index: 20;
          box-shadow: 0 0 5px rgba(0, 188, 212, 0.5);
        }

        /* Expanded Box FIXED layout */
        .expanded-box { flex: 1; border-color: var(--purple-border); display: flex; align-items: center; justify-content: center; padding: 4% 2% 2% 2%; }
        .expanded-box .pill { background: var(--purple-pill); }

        .expanded-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          min-height: 8vw; /* Stable container height */
        }

        .fraction-mode { flex-direction: row !important; gap: 3vw !important; }

        .equation { font-size: 6vw; display: flex; align-items: center; gap: 1.5vw; color: var(--white); }
        .multiply-sign { font-size: 4vw; padding-bottom: 0.8vw; }
        .value-text { color: var(--yellow); }

        .fraction-wrap { display: flex; flex-direction: column; align-items: center; }
        .frac-num { font-size: 5.5vw; line-height: 1; border-bottom: 0.3vw solid var(--white); padding: 0 1.2vw; color: var(--white); }
        .frac-den { font-size: 5.5vw; line-height: 1; color: var(--yellow); padding-top: 0.2vw; }

        .label-text { color: var(--orange); font-size: 2.5vw; font-weight: 500; margin-top: 1vw; }
        .fraction-mode .label-text { margin-top: 0; }
      `}</style>

      <div className="main-container">
        <div className="instruction">
          Let us move the digit '3' across the place values.
        </div>

        <div className="box top-box">
          <div className="pill">Place value chart</div>
          <div className="chart-grid">
            {placeSymbols.map((s, i) => (
              <React.Fragment key={`h-${i}`}>
                {i === 3 && (
                  <div className="dot-marker">
                    <div className="dot-circle" />
                  </div>
                )}
                <div className={`cell ${i === pos ? "header-active" : ""}`}>
                  {s}
                </div>
              </React.Fragment>
            ))}
            {placeSymbols.map((_, i) => (
              <React.Fragment key={`d-${i}`}>
                {i === 3 && (
                  <div className="dot-marker">
                    <div className="dot-circle" />
                  </div>
                )}
                <div
                  ref={(el) =>
                    i === pos
                      ? (digit3Ref.current = el)
                      : (digit0Refs.current[i] = el)
                  }
                  className={`cell digit-cell ${i === pos ? "active-cell" : ""}`}
                >
                  {i === pos ? "3" : "0"}
                  {/* Nested Arrows move with the cell */}
                  {i === pos && !isMoving && gsapLoaded && (
                    <div className="arrow-container">
                      <button
                        onClick={() => move("left")}
                        className="nav-btn"
                        disabled={pos === 0}
                      >
                        <ChevronLeft size="2.5vw" />
                      </button>
                      <button
                        onClick={() => move("right")}
                        className="nav-btn"
                        disabled={pos === 4}
                      >
                        <ChevronRight size="2.5vw" />
                      </button>
                    </div>
                  )}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="bottom-row">
          <div className="box standard-box">
            <div className="pill">Value of the number in standard form</div>
            <div className="standard-display">
              {baseDigits.map((char, idx) => (
                <div
                  key={idx}
                  ref={(el) => (slotsRef.current[idx] = el)}
                  className="char-slot"
                >
                  <span
                    style={{
                      color: getDigitColor(idx),
                      transition: "color 0.4s",
                    }}
                  >
                    {char}
                  </span>
                </div>
              ))}
              <div
                ref={decimalRef}
                className="decimal-point"
                style={{ left: `${dotIndices[pos] * SLOT_WIDTH}vw` }}
              />
            </div>
          </div>

          <div className="box expanded-box">
            <div className="pill">Expanded form of the number</div>
            <div
              className={`expanded-content ${pos > 2 ? "fraction-mode" : ""}`}
            >
              {pos <= 2 ? (
                <>
                  <div className="equation">
                    <span>3</span>
                    <span className="multiply-sign">×</span>
                    <span className="value-text">{Math.pow(10, 2 - pos)}</span>
                  </div>
                  <div className="label-text">3 {labels[pos]}</div>
                </>
              ) : (
                <>
                  <div className="fraction-wrap">
                    <div className="frac-num">3</div>
                    <div className="frac-den">{Math.pow(10, pos - 2)}</div>
                  </div>
                  <div className="label-text">3 {labels[pos]}</div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
