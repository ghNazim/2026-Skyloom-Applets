import React, { useState, useEffect, useRef } from 'react';

const App = () => {
  const canvasRef = useRef(null);
  const [state, setState] = useState('idle'); // 'idle', 'splitting', 'returning'
  const [selectedAxis, setSelectedAxis] = useState(null);
  const [offset, setOffset] = useState(0);
  
  // Define shape coordinates relative to its own center (0,0)
  const points = [
    { x: -80, y: -100 }, // Top Left
    { x: 40,  y: -100 }, // Top Right
    { x: 40,  y: 0 },    // Inner corner
    { x: 120, y: 0 },    // Far Right
    { x: 40,  y: 100 },  // Bottom Point
    { x: -80, y: 20 }    // Side corner
  ];

  // Define split lines that pass through the shape
  const splitLines = [
    { id: 'horizontal', x1: -150, y1: 0, x2: 200, y2: 0 },
    { id: 'diag1', x1: 150, y1: -150, x2: -150, y2: 150 }, 
    { id: 'diag2', x1: -150, y1: -150, x2: 150, y2: 150 }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrame;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      if (state === 'idle') {
        // Draw the solid shape at the center
        drawShape(ctx, cx, cy, points, '#a6d8d4', true);
        
        // Draw the interactive yellow lines
        splitLines.forEach(line => {
          ctx.beginPath();
          ctx.moveTo(cx + line.x1, cy + line.y1);
          ctx.lineTo(cx + line.x2, cy + line.y2);
          ctx.strokeStyle = '#fbbf24'; 
          ctx.lineWidth = 6;
          ctx.lineCap = 'round';
          ctx.stroke();
        });
      } else {
        const line = splitLines.find(l => l.id === selectedAxis);
        if (!line) return;

        // Calculate perpendicular vector for movement
        const dx = line.x2 - line.x1;
        const dy = line.y2 - line.y1;
        const len = Math.sqrt(dx * dx + dy * dy);
        const nx = -dy / len;
        const ny = dx / len;

        // Piece 1 (Moves in positive normal direction)
        ctx.save();
        ctx.translate(cx + nx * offset, cy + ny * offset);
        applyLocalClip(ctx, line, nx, ny, true);
        drawShape(ctx, 0, 0, points, '#a6d8d4', true);
        ctx.restore();

        // Piece 2 (Moves in negative normal direction)
        ctx.save();
        ctx.translate(cx - nx * offset, cy - ny * offset);
        applyLocalClip(ctx, line, nx, ny, false);
        drawShape(ctx, 0, 0, points, '#a6d8d4', true);
        ctx.restore();
      }

      animationFrame = requestAnimationFrame(draw);
    };

    const drawShape = (ctx, x, y, pts, color, border) => {
      ctx.beginPath();
      ctx.moveTo(x + pts[0].x, y + pts[0].y);
      pts.forEach((p, i) => { if (i > 0) ctx.lineTo(x + p.x, y + p.y); });
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
      if (border) {
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 3;
        ctx.stroke();
      }
    };

    const applyLocalClip = (ctx, line, nx, ny, towardNormal) => {
      const dist = 2000;
      ctx.beginPath();
      const x1 = line.x1;
      const y1 = line.y1;
      const x2 = line.x2;
      const y2 = line.y2;

      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);

      const side = towardNormal ? 1 : -1;
      ctx.lineTo(x2 + nx * side * dist, y2 + ny * side * dist);
      ctx.lineTo(x1 + nx * side * dist, y1 + ny * side * dist);
      
      ctx.closePath();
      ctx.clip();
    };

    draw();
    return () => cancelAnimationFrame(animationFrame);
  }, [state, offset, selectedAxis]);

  // Animation Loop
  useEffect(() => {
    let timer;
    if (state === 'splitting') {
      if (offset < 70) {
        timer = requestAnimationFrame(() => setOffset(prev => prev + 4));
      }
      // Note: No automatic timeout here anymore
    } else if (state === 'returning') {
      if (offset > 0) {
        timer = requestAnimationFrame(() => setOffset(prev => Math.max(0, prev - 4)));
      } else {
        setState('idle');
        setSelectedAxis(null);
      }
    }
    return () => {
      cancelAnimationFrame(timer);
    };
  }, [state, offset]);

  const handleCanvasClick = (e) => {
    if (state !== 'idle') return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - canvasRef.current.width / 2;
    const y = e.clientY - rect.top - canvasRef.current.height / 2;

    for (const line of splitLines) {
      const dist = distanceToLine(x, y, line.x1, line.y1, line.x2, line.y2);
      if (dist < 25) {
        setSelectedAxis(line.id);
        setState('splitting');
        break;
      }
    }
  };

  const distanceToLine = (px, py, x1, y1, x2, y2) => {
    const l2 = (x2-x1)**2 + (y2-y1)**2;
    if (l2 === 0) return Math.sqrt((px-x1)**2 + (py-y1)**2);
    let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
    t = Math.max(0, Math.min(1, t));
    return Math.sqrt((px - (x1 + t * (x2 - x1)))**2 + (py - (y1 + t * (y2 - y1)))**2);
  };

  const handleCombine = () => {
    setState('returning');
  };

  const showCombineButton = state === 'splitting' && offset >= 70;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4 select-none">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-200">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Geometry Slice</h1>
          <p className="text-slate-500 mt-2 font-medium">Click a yellow line to bisect the shape</p>
        </div>
        
        <div className="relative p-2 bg-slate-100 rounded-3xl">
          <canvas
            ref={canvasRef}
            width={500}
            height={500}
            onClick={handleCanvasClick}
            className={`bg-white rounded-2xl shadow-inner transition-all duration-300 ${state === 'idle' ? 'cursor-pointer hover:shadow-lg' : 'cursor-default'}`}
            style={{ touchAction: 'none' }}
          />
        </div>

        <div className="mt-8 h-12 flex justify-center items-center">
          {showCombineButton ? (
            <button
              onClick={handleCombine}
              className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-2xl font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>
              Combine Pieces
            </button>
          ) : (
            <div className={`flex items-center gap-3 px-6 py-2 rounded-full border transition-all duration-500 ${state === 'idle' ? 'bg-white border-slate-200' : 'bg-blue-50 border-blue-200'}`}>
              <div className={`h-2.5 w-2.5 rounded-full ${state === 'idle' ? 'bg-emerald-500' : 'bg-blue-500 animate-pulse'}`} />
              <span className="text-sm font-bold text-slate-700 tracking-wide uppercase">
                {state === 'idle' ? 'System Ready' : state === 'returning' ? 'Returning' : 'Splitting...'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;