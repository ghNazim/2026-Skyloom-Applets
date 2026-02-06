import React, { useState, useMemo } from 'react';

/**
 * Interactive SVG Shape App
 * Displays a T-shape based on user image with clickable edges and offset labels.
 * Adjusted for better padding and removed point circles.
 */
const App = () => {
  // Reduced scale slightly and adjusted offsets to prevent label cropping
  // Dimensions: Width 40cm, Total Height 43cm (23 + 20)
  const scale = 8.5;
  
  // Centers the ~340x365 shape in the 500x500 viewBox with generous padding
  const offsetX = 80; 
  const offsetY = 65;

  // The points array defining the 8 vertices of the T-shape
  const points = useMemo(() => [
    { x: 0, y: 0, label: 'A' },
    { x: 0, y: 23, label: 'B' },
    { x: 16, y: 23, label: 'C' },
    { x: 16, y: 43, label: 'D' }, 
    { x: 26, y: 43, label: 'E' }, 
    { x: 26, y: 23, label: 'F' },
    { x: 40, y: 23, label: 'G' },
    { x: 40, y: 0, label: 'H' },
  ].map(p => ({
    x: p.x * scale + offsetX,
    y: p.y * scale + offsetY,
    id: p.label
  })), []);

  const [highlighted, setHighlighted] = useState({});

  const toggleEdge = (index) => {
    setHighlighted(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const edges = useMemo(() => {
    const sizes = ["23 cm", "16 cm", "20 cm", "10 cm", "20 cm", "14 cm", "23 cm", "40 cm"];
    
    // Direction vectors to push labels OUTSIDE the shape
    const offsets = [
      { dx: -1, dy: 0 },  // A-B: Left
      { dx: 0, dy: 1 },   // B-C: Down
      { dx: -1, dy: 0 },  // C-D: Left
      { dx: 0, dy: 1 },   // D-E: Down
      { dx: 1, dy: 0 },   // E-F: Right
      { dx: 0, dy: 1 },   // F-G: Down
      { dx: 1, dy: 0 },   // G-H: Right
      { dx: 0, dy: -1 },  // H-A: Up
    ];

    return points.map((p, i) => {
      const nextP = points[(i + 1) % points.length];
      return {
        x1: p.x,
        y1: p.y,
        x2: nextP.x,
        y2: nextP.y,
        size: sizes[i],
        labelOffset: offsets[i]
      };
    });
  }, [points]);

  const pathData = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')} Z`;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white font-sans p-4">
      <div className="max-w-2xl w-full text-center space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-blue-400">Geometry Inspector</h1>
          <p className="text-slate-400 mt-2">
            Click edges to see dimensions. Points are labeled but markers are removed.
          </p>
        </div>

        {/* SVG Container */}
        <div className="relative bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden aspect-square flex items-center justify-center p-4">
          <svg
            viewBox="0 0 500 500"
            className="w-full h-full drop-shadow-2xl"
          >
            {/* Main Shape Fill */}
            <path
              d={pathData}
              className="fill-blue-500/10 stroke-blue-500/20"
              strokeWidth="2"
            />

            {/* Edge Interactive Elements */}
            {edges.map((edge, i) => {
              const isHigh = highlighted[i];
              const midX = (edge.x1 + edge.x2) / 2;
              const midY = (edge.y1 + edge.y2) / 2;
              
              // Shift label based on its specific direction
              const labelX = midX + (edge.labelOffset.dx * 35);
              const labelY = midY + (edge.labelOffset.dy * 25);
              
              return (
                <g key={i} onClick={() => toggleEdge(i)} className="cursor-pointer group">
                  {/* Interaction Area */}
                  <line
                    x1={edge.x1} y1={edge.y1}
                    x2={edge.x2} y2={edge.y2}
                    stroke="transparent"
                    strokeWidth="30"
                  />
                  
                  {/* Line Segment */}
                  <line
                    x1={edge.x1} y1={edge.y1}
                    x2={edge.x2} y2={edge.y2}
                    className={`transition-all duration-300 ${
                      isHigh ? 'stroke-yellow-400 stroke-[8]' : 'stroke-white/30 stroke-[4] group-hover:stroke-blue-400'
                    }`}
                    strokeLinecap="round"
                  />

                  {/* Dimension Label */}
                  {isHigh && (
                    <g transform={`translate(${labelX}, ${labelY})`}>
                      <rect
                        x="-35" y="-14"
                        width="70" height="28"
                        rx="6"
                        className="fill-yellow-400 animate-in fade-in zoom-in duration-200"
                      />
                      <text
                        textAnchor="middle"
                        dy="6"
                        className="fill-slate-950 text-[13px] font-bold pointer-events-none select-none"
                      >
                        {edge.size}
                      </text>
                      {/* Connection to edge */}
                      <line 
                        x1={-edge.labelOffset.dx * 8} 
                        y1={-edge.labelOffset.dy * 8}
                        x2={-edge.labelOffset.dx * 18}
                        y2={-edge.labelOffset.dy * 18}
                        className="stroke-yellow-400/40 stroke-1"
                      />
                    </g>
                  )}
                </g>
              );
            })}

            {/* Vertex Labels (Points) */}
            {points.map((p) => {
                const dx = p.x < 250 ? -18 : 18;
                const dy = p.y < 250 ? -18 : 18;
                return (
                    <g key={p.id}>
                        {/* Circle removed as requested */}
                        <text
                            x={p.x + dx}
                            y={p.y + dy}
                            textAnchor="middle"
                            className="fill-slate-500 text-[14px] font-black tracking-tighter pointer-events-none"
                        >
                            {p.id}
                        </text>
                    </g>
                );
            })}
          </svg>
        </div>

        <div className="flex gap-4 justify-center">
          <button 
            onClick={() => setHighlighted(Object.fromEntries(edges.map((_, i) => [i, true])))}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-semibold transition-all shadow-lg"
          >
            Show All
          </button>
          <button 
            onClick={() => setHighlighted({})}
            className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-semibold transition-all border border-slate-700"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;