import React, { useState, useEffect } from 'react';
import { Play, RotateCcw } from 'lucide-react';

const App = () => {
  const [tilt, setTilt] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Grid constants to match the visual style
  const gridSize = 50;
  const cols = 12;
  const rows = 8;
  const svgWidth = (cols - 1) * gridSize;
  const svgHeight = (rows - 1) * gridSize;
  
  // Rectangle dimensions
  const rectW = 5 * gridSize;
  const rectH = 3 * gridSize;
  
  // Starting position (anchored to grid points)
  const startX = 2 * gridSize;
  const startY = 2 * gridSize;

  // Tilt logic - max tilt is 2 grid units
  const maxTiltOffset = 2 * gridSize;
  const currentTiltOffset = (tilt / 2) * maxTiltOffset;

  // Animation logic for the sliding triangle
  useEffect(() => {
    let animationFrame;
    if (isAnimating) {
      const startTime = performance.now();
      const duration = 1800;

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const p = Math.min(elapsed / duration, 1);
        
        // Cubic easing for smooth movement
        const easedP = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
        setProgress(easedP);

        if (p < 1) {
          animationFrame = requestAnimationFrame(animate);
        } else {
          setIsAnimating(false);
          setIsComplete(true);
        }
      };
      animationFrame = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(animationFrame);
  }, [isAnimating]);

  const handleReset = () => {
    setTilt(0);
    setIsAnimating(false);
    setProgress(0);
    setIsComplete(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#050810] p-4 font-sans">
      <div className="bg-[#0a1120] p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-8 w-full max-w-4xl border border-white/5">
        
        {/* SVG Viewport */}
        <div className="relative bg-[#020617] rounded-lg overflow-hidden border border-white/10 shadow-inner">
          <svg 
            width={svgWidth} 
            height={svgHeight} 
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="block"
          >
            {/* Grid Lines */}
            <g stroke="#1e293b" strokeWidth="1">
              {Array.from({ length: cols }).map((_, i) => (
                <line key={`v-${i}`} x1={i * gridSize} y1={0} x2={i * gridSize} y2={svgHeight} />
              ))}
              {Array.from({ length: rows }).map((_, i) => (
                <line key={`h-${i}`} x1={0} y1={i * gridSize} x2={svgWidth} y2={i * gridSize} />
              ))}
            </g>

            {/* Grid Dots */}
            {Array.from({ length: cols }).map((_, i) => (
              Array.from({ length: rows }).map((_, j) => (
                <circle 
                  key={`${i}-${j}`} 
                  cx={i * gridSize} 
                  cy={j * gridSize} 
                  r="2" 
                  fill="#475569" 
                />
              ))
            ))}

            {/* Stage: Interactive Tilt */}
            {!isAnimating && !isComplete && (
              <polygon
                points={`
                  ${startX + currentTiltOffset},${startY} 
                  ${startX + rectW + currentTiltOffset},${startY} 
                  ${startX + rectW},${startY + rectH} 
                  ${startX},${startY + rectH}
                `}
                fill={tilt === 0 ? "#b56666" : "#a2c4e0"}
                fillOpacity="0.8"
                stroke="white"
                strokeWidth="2.5"
              />
            )}

            {/* Stage: Animation Phase */}
            {isAnimating && (
              <g>
                {/* Main Body (Trapezoid) */}
                <polygon
                  points={`
                    ${startX + maxTiltOffset},${startY} 
                    ${startX + rectW},${startY} 
                    ${startX + rectW},${startY + rectH} 
                    ${startX},${startY + rectH}
                  `}
                  fill="#a2c4e0"
                  fillOpacity="0.8"
                  stroke="white"
                  strokeWidth="2.5"
                />
                
                {/* Sliding Triangle Piece */}
                <g transform={`translate(${-rectW * progress}, 0)`}>
                  <polygon
                    points={`
                      ${startX + rectW},${startY} 
                      ${startX + rectW + maxTiltOffset},${startY} 
                      ${startX + rectW},${startY + rectH}
                    `}
                    fill="#a2c4e0"
                    fillOpacity="0.8"
                    stroke="white"
                    strokeWidth="2.5"
                  />
                </g>

                {/* Vertical Cut guide */}
                <line 
                  x1={startX + maxTiltOffset} y1={startY} 
                  x2={startX + maxTiltOffset} y2={startY + rectH} 
                  stroke="white" 
                  strokeDasharray="6"
                  strokeWidth="2"
                  opacity="0.6"
                />
              </g>
            )}

            {/* Stage: Completed */}
            {isComplete && (
              <rect
                x={startX}
                y={startY}
                width={rectW}
                height={rectH}
                fill="#b56666"
                fillOpacity="0.8"
                stroke="white"
                strokeWidth="3"
              />
            )}
          </svg>
        </div>

        {/* Interaction Controls */}
        <div className="w-full max-w-md flex flex-col gap-8 items-center">
          <div className="w-full">
            <div className="flex justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tilt Slider</span>
              <span className="text-xs font-bold text-slate-400">Continuous Adjustment</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="2" 
              step="0.01" 
              value={tilt} 
              onChange={(e) => setTilt(parseFloat(e.target.value))}
              disabled={isAnimating || isComplete}
              className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-blue-500 disabled:opacity-30 transition-all"
            />
          </div>

          <div className="h-16 flex items-center justify-center">
            {tilt > 1.98 && !isAnimating && !isComplete && (
              <button 
                onClick={() => setIsAnimating(true)}
                className="flex items-center gap-2 px-10 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-lg active:scale-95 text-lg"
              >
                <Play size={20} fill="currentColor" />
                Animate
              </button>
            )}
            
            {isComplete && (
              <button 
                onClick={handleReset}
                className="flex items-center gap-2 px-10 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-all active:scale-95 text-lg"
              >
                <RotateCcw size={18} />
                Reset
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;