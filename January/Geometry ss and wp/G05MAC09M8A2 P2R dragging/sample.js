import React, { useState, useEffect, useRef } from 'react';

const App = () => {
  // SVG and Grid Constants
  const gridSize = 40;
  const cols = 14;
  const rows = 10;
  const svgWidth = cols * gridSize;
  const svgHeight = rows * gridSize;
  
  // Fixed Base parameters
  const startX = 2 * gridSize;
  const startY = 8 * gridSize;
  const b = 6 * gridSize;

  // State for top vertex position
  const [topVertex, setTopVertex] = useState({ x: startX + 2.5 * gridSize, y: startY - 5 * gridSize });
  const [isDragging, setIsDragging] = useState(false);

  // Animation States: 'initial', 'cloning', 'parallelogram', 'rect-transform', 'final-rect'
  const [step, setStep] = useState('initial');
  const [progress, setProgress] = useState(0);
  const animationRef = useRef(null);
  const svgRef = useRef(null);

  // Constraints for the top vertex
  const minHeight = 2 * gridSize;
  const maxHeight = 7 * gridSize;
  const minX = startX;
  const maxX = startX + b;

  // Derived dimensions
  const t = startY - topVertex.y;
  const p1 = { x: startX, y: startY };
  const p2 = { x: startX + b, y: startY };
  const p3 = { ...topVertex };

  // Color Palette
  const colorOrig = "#7c3aed";
  const opOrig = 0.7;
  const colorClone = "#7c3aed";
  const opClone = 0.35;

  // Pointer Event Handlers
  const handlePointerDown = () => step === 'initial' && setIsDragging(true);
  const handlePointerUp = () => setIsDragging(false);

  const handlePointerMove = (e) => {
    if (!isDragging || step !== 'initial' || !svgRef.current) return;
    const CTM = svgRef.current.getScreenCTM();
    const x = (e.clientX - CTM.e) / CTM.a;
    const y = (e.clientY - CTM.f) / CTM.d;
    setTopVertex({
      x: Math.max(minX, Math.min(maxX, x)),
      y: Math.max(startY - maxHeight, Math.min(startY - minHeight, y))
    });
  };

  // Animation Controller
  const animate = (targetStep, duration, onComplete) => {
    let startTime = null;
    const frame = (now) => {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;
      const p = Math.min(elapsed / duration, 1);
      const ease = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      setProgress(ease);
      if (p < 1) animationRef.current = requestAnimationFrame(frame);
      else { setStep(targetStep); setProgress(0); if (onComplete) onComplete(); }
    };
    animationRef.current = requestAnimationFrame(frame);
  };

  const handleCopy = () => { setStep('cloning'); animate('parallelogram', 1500); };
  const handleMakeRectangle = () => { setStep('rect-transform'); animate('final-rect', 1500); };
  const handleReset = () => { cancelAnimationFrame(animationRef.current); setStep('initial'); setProgress(0); };

  const ptsStr = (pts) => pts.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#050810] text-white p-4 font-sans select-none overflow-hidden">
      <div className="bg-[#0a1120] p-6 md:p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-6 w-full max-w-4xl border border-white/5">
        
        <div className="text-center">
          <h1 className="text-xl font-bold text-slate-300 uppercase tracking-widest opacity-80 mb-1">
            Area Transformation
          </h1>
        </div>

        {/* SVG WORKSPACE */}
        <div className="relative bg-[#020617] rounded-xl overflow-hidden border border-white/10 shadow-inner w-full touch-none">
          <svg 
            ref={svgRef} width="100%" height="100%" viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}
          >
            {/* BACKGROUND GRID DEFINITION */}
            <defs>
              <pattern id="grid" width={gridSize} height={gridSize} patternUnits="userSpaceOnUse">
                <path d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`} fill="none" stroke="#1e293b" strokeWidth="1"/>
                <circle cx="0" cy="0" r="1.5" fill="#334155" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* STAGE 1: INITIAL STATE ELEMENTS */}
            {step === 'initial' && (
              <g>
                {/* ORIGINAL TRIANGLE POLYGON */}
                <polygon points={ptsStr([p1, p2, p3])} fill={colorOrig} fillOpacity={opOrig} stroke="#a78bfa" strokeWidth="3" />
                
                {/* HEIGHT LINE (SOLID) */}
                <line x1={p3.x} y1={p1.y} x2={p3.x} y2={p3.y} stroke="#22d3ee" strokeWidth="2.5" />
                
                {/* HEIGHT LABEL "t" */}
                <text x={p3.x - 15} y={(p1.y + p3.y) / 2} textAnchor="middle" fill="#22d3ee" fontSize="16" fontWeight="bold">t</text>
                
                {/* BASE LABEL "b" */}
                <text x={startX + b/2} y={startY + 25} textAnchor="middle" fill="#facc15" fontSize="16" fontWeight="bold">b</text>
              </g>
            )}

            {/* STAGE 2: CLONING AND ROTATION ELEMENTS */}
            {(step === 'cloning' || step === 'parallelogram') && (
              <g>
                {/* FIXED ORIGINAL TRIANGLE */}
                <polygon points={ptsStr([p1, p2, p3])} fill={colorOrig} fillOpacity={opOrig} stroke="#a78bfa" strokeWidth="3" />
                
                {/* FIXED BASE LABEL "b" */}
                <text x={startX + b/2} y={startY + 25} textAnchor="middle" fill="#facc15" fontSize="16" fontWeight="bold">b</text>

                {/* MOVING CLONED TRIANGLE GROUP (Triangle + Height Line + Label t) */}
                {(() => {
                  const midX = (p2.x + p3.x) / 2;
                  const midY = (p2.y + p3.y) / 2;
                  let rot = step === 'cloning' ? 180 * progress : 180;
                  let tx = step === 'cloning' ? 120 * (1 - progress) : 0;
                  const labelX = p3.x - 15;
                  const labelY = (p1.y + p3.y) / 2;

                  return (
                    <g transform={`rotate(${rot}, ${midX + tx}, ${midY}) translate(${tx}, 0)`}>
                      {/* CLONED TRIANGLE POLYGON (LIGHTER COLOR) */}
                      <polygon points={ptsStr([p1, p2, p3])} fill={colorClone} fillOpacity={opClone} stroke="#a78bfa" strokeWidth="3" />
                      
                      {/* CLONED HEIGHT LINE (SOLID) */}
                      <line x1={p3.x} y1={p1.y} x2={p3.x} y2={p3.y} stroke="#22d3ee" strokeWidth="2.5" />
                      
                      {/* CLONED HEIGHT LABEL "t" (WITH COUNTER-ROTATION TO STAY UPRIGHT) */}
                      <text 
                        x={labelX} y={labelY} textAnchor="middle" fill="#22d3ee" fontSize="16" fontWeight="bold"
                        transform={`rotate(${-rot}, ${labelX}, ${labelY})`}
                      >t</text>
                    </g>
                  );
                })()}
              </g>
            )}

            {/* STAGE 3: RECTANGLE TRANSFORMATION ELEMENTS */}
            {(step === 'rect-transform' || step === 'final-rect') && (
              <g>
                {(() => {
                  const C = { x: p2.x + (p3.x - p1.x), y: p3.y };
                  const D = p3;
                  const sliceX = p2.x;
                  const moveX = (step === 'rect-transform') ? -b * progress : -b;

                  return (
                    <g>
                      {/* ORIGINAL TRIANGLE PART (DEEP COLOR) */}
                      <polygon points={ptsStr([p1, p2, p3])} fill={colorOrig} fillOpacity={opOrig} stroke="#a78bfa" strokeWidth="3" />
                      
                      {/* STATIC PART OF CLONE (LIGHT COLOR) */}
                      <polygon points={ptsStr([p2, { x: sliceX, y: D.y }, D])} fill={colorClone} fillOpacity={opClone} stroke="#a78bfa" strokeWidth="3" />
                      
                      {/* MOVING PART OF CLONE (LIGHT COLOR) */}
                      <g transform={`translate(${moveX}, 0)`}>
                        <polygon points={ptsStr([p2, C, { x: sliceX, y: D.y }])} fill={colorClone} fillOpacity={opClone} stroke="#a78bfa" strokeWidth="3" />
                      </g>
                      
                      {/* PERSISTENT HEIGHT LINE ON STATIC PART (SOLID) */}
                      <line x1={sliceX} y1={startY} x2={sliceX} y2={startY - t} stroke="#22d3ee" strokeWidth="2.5" />
                      
                      {/* PERSISTENT HEIGHT LABEL "t" */}
                      <text x={sliceX - 15} y={startY - t/2} textAnchor="middle" fill="#22d3ee" fontSize="16" fontWeight="bold">t</text>

                      {/* BASE LABEL "b" */}
                      <text x={startX + b/2} y={startY + 25} textAnchor="middle" fill="#facc15" fontSize="16" fontWeight="bold">b</text>
                    </g>
                  );
                })()}
              </g>
            )}

            {/* DRAG POINTER (ONLY VISIBLE IN INITIAL STEP) */}
            {step === 'initial' && (
              <g onPointerDown={handlePointerDown} style={{ cursor: isDragging ? 'grabbing' : 'grab' }}>
                {/* DRAG POINTER: OUTER GLOW */}
                <circle cx={p3.x} cy={p3.y} r="18" fill="rgba(250, 204, 21, 0.15)" />
                {/* DRAG POINTER: CENTER CIRCLE */}
                <circle cx={p3.x} cy={p3.y} r="8" fill="#facc15" stroke="white" strokeWidth="2" className={isDragging ? "" : "animate-pulse"} />
              </g>
            )}
          </svg>
        </div>

        {/* INTERACTION BUTTONS */}
        <div className="flex flex-col items-center gap-4 w-full">
          <div className="flex gap-4">
            {step === 'initial' && (
              /* COPY TRIANGLE BUTTON */
              <button onClick={handleCopy} className="px-8 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl transition-all active:scale-95 shadow-lg">
                Copy Triangle
              </button>
            )}
            {(step === 'parallelogram' || step === 'cloning') && (
              /* MAKE RECTANGLE BUTTON */
              <button onClick={handleMakeRectangle} disabled={step === 'cloning'} className="px-8 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-xl transition-all active:scale-95 shadow-lg">
                Make a Rectangle
              </button>
            )}
            {(step === 'final-rect' || step === 'rect-transform') && (
              /* RESET BUTTON */
              <button onClick={handleReset} disabled={step === 'rect-transform'} className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-all active:scale-95">
                Start Over
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;