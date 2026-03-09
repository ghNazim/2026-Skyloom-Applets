import React, { useState, useRef } from "react";

const App = () => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [prize, setPrize] = useState(null);
  const wheelRef = useRef(null);

  const segments = [
    { label: "JACKPOT" },
    { label: "$100" },
    { label: "$15" },
    { label: "$20" },
    { label: "$5" },
  ];

  const segmentAngle = 360 / segments.length;

  const spinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setPrize(null);

    const extraDegrees = Math.floor(Math.random() * 360);
    const totalSpins = 1800 + extraDegrees;
    const newRotation = rotation + totalSpins;

    setRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const finalDegrees = newRotation % 360;
      const relativeAngle = (540 - finalDegrees) % 360;
      const index = Math.floor(relativeAngle / segmentAngle);
      setPrize(segments[index].label);
    }, 4000);
  };

  return (
    <div className="app-container">
      <style>{`
        .app-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background-color: #FDFBF7;
          font-family: 'Georgia', serif;
          margin: 0;
          padding: 20px;
        }

        .wheel-container {
          position: relative;
          cursor: pointer;
          user-select: none;
        }

        /* The Base/Stand */
        .base-stand {
          position: absolute;
          bottom: -60px;
          left: 50%;
          transform: translateX(-50%);
          width: 200px;
          height: 100px;
          background-color: #013444;
          clip-path: polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%);
          box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }

        /* RIM GEOMETRY (Standardized)
           Outer Gold Diameter: 320px (Radius 160)
           Thick Blue Diameter: 312px (Radius 156)
           Inner Gold Diameter: 268px (Radius 134)
           Band width = 156 - 134 = 22px
           Band Center = 134 + 11 = 145px radius
        */
        .rim-outer-gold {
          position: relative;
          width: 320px;
          height: 320px;
          border-radius: 50%;
          background-color: #D4AF37; /* Bright Gold */
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 15px 40px rgba(0,0,0,0.4);
        }

        .rim-thick-blue {
          position: relative;
          width: 312px;
          height: 312px;
          border-radius: 50%;
          background-color: #013444; /* Thick Bluish Strip */
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .rim-inner-gold {
          position: relative;
          width: 268px;
          height: 268px;
          border-radius: 50%;
          background-color: #D4AF37; /* Inner Gold Ring */
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 5;
          box-shadow: inset 0 0 10px rgba(0,0,0,0.2);
        }

        /* Golden Dots - Precision Centered */
        .golden-dot {
          position: absolute;
          width: 8px;
          height: 8px;
          background-color: #FFECB3;
          border: 1px solid #D4AF37;
          border-radius: 50%;
          box-shadow: 0 1px 2px rgba(0,0,0,0.5);
          top: 50%;
          left: 50%;
          /* translateY is exactly the Band Center (145px) */
          margin-top: -4px;
          margin-left: -4px;
        }

        /* ROTATING CIRCLE */
        .rotating-disc {
          position: relative;
          width: 260px; /* Sits inside the inner gold ring */
          height: 260px;
          border-radius: 50%;
          overflow: hidden;
          background: #B91C1C;
          transition: transform 4000ms cubic-bezier(0.15, 0, 0.15, 1);
          box-shadow: inset 0 0 35px rgba(0,0,0,0.8);
        }

        .divider {
          position: absolute;
          width: 2px;
          height: 50%;
          background-color: #000000;
          left: 50%;
          bottom: 50%;
          transform-origin: bottom center;
          transform: translateX(-50%);
        }

        .label-wrap {
          position: absolute;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          padding-top: 35px;
          pointer-events: none;
        }

        .label-text {
          color: #ffffff;
          font-size: 18px;
          font-weight: 900;
          text-transform: uppercase;
          text-shadow: 1px 1px 3px rgba(0,0,0,0.7);
        }

        /* Marker coming from the inner gold ring */
        .marker-indicator {
          position: absolute;
          bottom: -2px; /* Pull it slightly into the inner ring base */
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
        }

        .triangle-marker {
          width: 0;
          height: 0;
          border-left: 12px solid transparent;
          border-right: 12px solid transparent;
          border-bottom: 20px solid #FFD700;
          filter: drop-shadow(0 -2px 3px rgba(0,0,0,0.4));
        }

        .center-knob {
          position: absolute;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #FFFDE7 0%, #FFD700 60%, #B8860B 100%);
          z-index: 20;
          box-shadow: 0 4px 10px rgba(0,0,0,0.5);
          border: 1px solid #B8860B;
        }

        .controls {
          margin-top: 110px;
          text-align: center;
        }

        .spin-btn {
          padding: 14px 45px;
          font-size: 20px;
          font-weight: bold;
          color: white;
          background-color: #013444;
          border: 2px solid #D4AF37;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }

        .spin-btn:hover:not(:disabled) {
          background-color: #024e66;
          transform: scale(1.05);
        }

        .result-box {
          height: 80px;
          margin-top: 25px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .result-val {
          font-size: 40px;
          font-weight: 900;
          color: #013444;
          margin: 0;
        }
      `}</style>

      <div className="wheel-container" onClick={spinWheel}>
        <div className="base-stand"></div>

        {/* Triple-Layered Golden/Teal Rim */}
        <div className="rim-outer-gold">
          <div className="rim-thick-blue">
            {/* Golden Dots - Set at exactly 145px offset for center alignment */}
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                className="golden-dot"
                style={{
                  transform: `rotate(${(i * 360) / 24}deg) translateY(-145px)`,
                }}
              />
            ))}

            <div className="rim-inner-gold">
              {/* Stopping marker originating from the inner gold ring */}
              <div className="marker-indicator">
                <div className="triangle-marker"></div>
              </div>

              {/* Central Metallic Hub */}
              <div className="center-knob"></div>

              {/* The Spinning Red Circle */}
              <div
                ref={wheelRef}
                className="rotating-disc"
                style={{ transform: `rotate(${rotation}deg)` }}
              >
                {/* 5 Segments */}
                {Array.from({ length: 5 }).map((_, i) => (
                  <React.Fragment key={i}>
                    <div
                      className="divider"
                      style={{
                        transform: `rotate(${i * segmentAngle}deg) translateX(-50%)`,
                      }}
                    />
                    <div
                      className="label-wrap"
                      style={{
                        transform: `rotate(${i * segmentAngle + segmentAngle / 2}deg)`,
                      }}
                    >
                      <span className="label-text">{segments[i].label}</span>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="controls">
        <button className="spin-btn" onClick={spinWheel} disabled={isSpinning}>
          {isSpinning ? "SPINNING..." : "SPIN WHEEL"}
        </button>
        <div className="result-box">
          {prize && <h2 className="result-val">{prize}</h2>}
        </div>
      </div>
    </div>
  );
};

export default App;
