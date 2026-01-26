import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const App = () => {
  const [pos, setPos] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [gsapLoaded, setGsapLoaded] = useState(false);

  // Refs for animation
  const containerRef = useRef(null);
  const decimalRef = useRef(null);
  const digit3Ref = useRef(null);
  const digit0Refs = useRef([]);

  const labels = ["hundreds", "tens", "ones", "tenths", "hundredths"];
  const placeSymbols = ["H", "T", "O", "t", "h"];

  const baseDigits = ["0", "0", "3", "0", "0", "0", "0", "0"];
  const SLOT_WIDTH = 4.5; // vw
  const dotIndices = [5, 4, 3, 2, 1];

  // Load GSAP dynamically
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
    const duration = 0.8;
    const ease = "power2.inOut";

    // 1. Swap Animation (Top Chart)
    const activeBox = digit3Ref.current;
    const targetBox = digit0Refs.current[newPos];

    if (activeBox && targetBox) {
      const activeRect = activeBox.getBoundingClientRect();
      const targetRect = targetBox.getBoundingClientRect();
      const deltaX = targetRect.left - activeRect.left;

      gsap.to(activeBox, { x: deltaX, duration, ease });
      gsap.to(targetBox, { x: -deltaX, duration, ease });
    }

    // 2. Decimal Arc Animation (Standard Box)
    const dot = decimalRef.current;
    if (dot) {
      const currentIdx = dotIndices[pos];
      const nextIdx = dotIndices[newPos];
      const totalShiftVw = (nextIdx - currentIdx) * SLOT_WIDTH;

      gsap.set(dot, { x: 0, y: 0 });

      const tl = gsap.timeline();
      tl.to(dot, {
        x: `${totalShiftVw}vw`,
        y: "2.5vw", // CHANGED: Positive value makes the arc go BELOW the digits
        duration: duration / 2,
        ease: "power1.out",
      }).to(dot, {
        y: 0,
        duration: duration / 2,
        ease: "power1.in",
      });
    }

    // 3. Sync State and Cleanup
    gsap.delayedCall(duration, () => {
      if (dot) gsap.set(dot, { x: 0, y: 0 });
      if (activeBox) gsap.set(activeBox, { x: 0 });
      digit0Refs.current.forEach((box) => {
        if (box) gsap.set(box, { x: 0 });
      });

      setPos(newPos);
      setIsMoving(false);
    });
  };

  const move = (direction) => {
    const next = direction === "right" ? pos + 1 : pos - 1;
    if (next >= 0 && next <= 4) {
      triggerTransition(next);
    }
  };

  const getDigitColor = (idx) => {
    const dotIdx = dotIndices[pos];
    const isThree = idx === 2;
    if (isThree) return "text-white";
    if (idx > 2 && idx < dotIdx) return "text-[#ffd54f]";
    if (idx >= dotIdx && idx < dotIdx + 2) return "text-white";
    return "text-white/20";
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#0f2e3d] flex items-center justify-center p-[2vw] font-sans select-none overflow-hidden"
    >
      <style>{`
        .chalk-bg {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Ctext x='20' y='50' fill='rgba(255,255,255,0.03)' font-size='40' font-family='cursive'%3E76 39 12%3C/text%3E%3Ctext x='300' y='120' fill='rgba(255,255,255,0.03)' font-size='50' font-family='cursive'%3E910%3C/text%3E%3Ctext x='100' y='300' fill='rgba(255,255,255,0.03)' font-size='60' font-family='cursive'%3E59%3C/text%3E%3C/svg%3E");
        }
        .pulsate { animation: pulse 2s infinite ease-in-out; }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
      `}</style>

      <div className="main-container w-full aspect-[2/1] max-h-[90vh] flex flex-col gap-[2.5%] relative chalk-bg">
        <div className="text-center text-[#ffb74d] text-[2.5vw] font-medium h-[10%] flex items-center justify-center">
          Let us move the digit '3' across the place values.
        </div>

        {/* Top: Place Value Chart (Swap Animation) */}
        <div className="section-box flex-[1.2] border-[0.2vw] border-[#3da37a] bg-black/20 rounded-[1.2vw] relative p-[4%_2%_2%_2%] flex items-center justify-center">
          <div className="absolute top-[-1.2vw] left-1/2 -translate-x-1/2 bg-[#4caf50] px-[2vw] py-[0.5vw] rounded-[0.8vw] text-white font-medium text-[1.5vw] whitespace-nowrap z-10 shadow-lg">
            Place value chart
          </div>

          <div className="grid grid-cols-[repeat(3,1fr)_4%_repeat(2,1fr)] gap-[1.5vw] w-[85%] h-[80%] relative">
            {placeSymbols.map((s, i) => (
              <React.Fragment key={`sym-${i}`}>
                {i === 3 && (
                  <div className="flex flex-col justify-around items-center">
                    <div className="w-[1.2vw] h-[1.2vw] bg-[#00bcd4] rounded-full" />
                  </div>
                )}
                <div
                  className={`border-[0.2vw] border-[#526b77] rounded-[1vw] flex items-center justify-center text-[3.5vw] text-white h-full transition-colors duration-500 ${i === pos ? "border-[#00bcd4] bg-[#00bcd4]/10" : ""}`}
                >
                  {s}
                </div>
              </React.Fragment>
            ))}

            {placeSymbols.map((_, i) => (
              <React.Fragment key={`dig-${i}`}>
                {i === 3 && (
                  <div className="flex flex-col justify-around items-center">
                    <div className="w-[1.2vw] h-[1.2vw] bg-[#00bcd4] rounded-full" />
                  </div>
                )}
                <div
                  ref={(el) =>
                    i === pos
                      ? (digit3Ref.current = el)
                      : (digit0Refs.current[i] = el)
                  }
                  className={`relative border-[0.2vw] border-[#526b77] rounded-[1vw] flex items-center justify-center text-[4vw] text-white h-full transition-colors duration-500 ${i === pos ? "bg-[#00bcd4] border-[#00bcd4] z-10 shadow-xl" : "bg-transparent"}`}
                >
                  {i === pos ? "3" : "0"}

                  {i === pos && !isMoving && gsapLoaded && (
                    <div className="absolute bottom-[-3.2vw] left-1/2 -translate-x-1/2 flex gap-[1.2vw] z-20 pulsate">
                      <button
                        onClick={() => move("left")}
                        className={`p-[0.3vw] bg-[#00bcd4] rounded-full text-white shadow-md ${pos === 0 ? "opacity-20 pointer-events-none" : "hover:scale-110 active:scale-95 transition-transform"}`}
                      >
                        <ChevronLeft size="2.5vw" />
                      </button>
                      <button
                        onClick={() => move("right")}
                        className={`p-[0.3vw] bg-[#00bcd4] rounded-full text-white shadow-md ${pos === 4 ? "opacity-20 pointer-events-none" : "hover:scale-110 active:scale-95 transition-transform"}`}
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

        {/* Bottom Area */}
        <div className="flex-[1] flex gap-[2.5%]">
          {/* Standard Form Box */}
          <div className="flex-[1.2] border-[0.2vw] border-[#914660] bg-black/20 rounded-[1.2vw] relative p-[4%_2%_2%_2%] flex items-center justify-center">
            <div className="absolute top-[-1.2vw] left-1/2 -translate-x-1/2 bg-[#e91e63] px-[2vw] py-[0.5vw] rounded-[0.8vw] text-white font-medium text-[1.5vw] whitespace-nowrap z-10">
              Value of the number in standard form
            </div>

            <div className="text-[7vw] tracking-[0.2vw] flex items-center relative h-full">
              {baseDigits.map((char, idx) => (
                <div
                  key={idx}
                  className="char-slot relative flex items-center justify-center w-[4.5vw] z-0"
                >
                  <span
                    className={`transition-colors duration-500 ${getDigitColor(idx)}`}
                  >
                    {char}
                  </span>
                </div>
              ))}

              {/* Decimal Dot - Positioned slightly lower and arcs under digits */}
              <div
                ref={decimalRef}
                className="absolute bg-[#00bcd4] rounded-full shadow-[0_0_5px_rgba(0,188,212,0.5)]"
                style={{
                  width: "1vw",
                  height: "1vw",
                  left: `${dotIndices[pos] * SLOT_WIDTH}vw`,
                  top: "68%", // CHANGED: Moved from 50% to 68% to be near baseline
                  transform: "translate(-50%, -50%)",
                  zIndex: 20,
                }}
              />
            </div>
          </div>

          {/* Expanded Form Box */}
          <div className="flex-[1] border-[0.2vw] border-[#4d4982] bg-black/20 rounded-[1.2vw] relative p-[4%_2%_2%_2%] flex flex-col items-center justify-center">
            <div className="absolute top-[-1.2vw] left-1/2 -translate-x-1/2 bg-[#7e57c2] px-[2vw] py-[0.5vw] rounded-[0.8vw] text-white font-medium text-[1.5vw] whitespace-nowrap z-10">
              Expanded form of the number
            </div>

            <div className="flex flex-col items-center">
              {pos <= 2 ? (
                <div className="text-[6vw] flex items-center gap-[1.5vw] transition-all duration-500">
                  <span className="text-white">3</span>
                  <span className="text-[4vw] pb-[0.8vw] text-white">×</span>
                  <span className="text-[#ffd54f]">
                    {Math.pow(10, 2 - pos)}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-[1.5vw] transition-all duration-500">
                  <div className="flex flex-col items-center">
                    <div className="text-[5.5vw] leading-none text-white border-b-[0.3vw] border-white px-[1.2vw]">
                      3
                    </div>
                    <div className="text-[5.5vw] leading-none text-[#ffd54f] pt-[0.2vw]">
                      {Math.pow(10, pos - 2)}
                    </div>
                  </div>
                </div>
              )}
              <div className="text-[#ffb74d] text-[2.5vw] mt-[2%] font-medium">
                3 {labels[pos]}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
