const formatPoint = (point) =>
  T.ui.pointLabel
    .replace('{x}', point.x)
    .replace('{y}', point.y);

const ReflectionPlane = ({
  step,
  point,
  dragPoint,
  linePoints,
  feedbackPoint,
  distanceAnim,
  onPlaneTap,
  onPointDrag,
  onPointDragEnd,
}) => {
  const { useRef, useState } = React;
  const svgRef = useRef(null);
  const dragPointerIdRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const interactionGraph = T.shared.graph;
  const activePoint = step.visual === 'dragExplore' ? dragPoint : point;
  const image = T.shared.reflect(activePoint);
  const graph = interactionGraph;
  const grid = { x: 0, y: 0, w: 720, h: 470 };
  const scale = Math.min(grid.w / (graph.maxX - graph.minX), grid.h / (graph.maxY - graph.minY));
  const graphOffsetX = grid.x + (grid.w - (graph.maxX - graph.minX) * scale) / 2;
  const graphOffsetY = grid.y + (grid.h - (graph.maxY - graph.minY) * scale) / 2;
  const origin = {
    x: graphOffsetX - graph.minX * scale,
    y: graphOffsetY + graph.maxY * scale,
  };
  const foot = { x: (activePoint.x - activePoint.y) / 2, y: (activePoint.y - activePoint.x) / 2 };
  const diagonalUnitDirection = activePoint.x + activePoint.y > 0
    ? { x: -1, y: -1 }
    : { x: 1, y: 1 };
  const summaryVisuals = ['summary', 'generalXOnly', 'generalComplete'];
  const patternVisuals = ['patternA', 'patternYFirst', 'patternXSecond', 'patternComplete'];
  const showPoint = !['intro', 'lineBuild', 'lineComplete', 'pickPoint', ...summaryVisuals].includes(step.visual);
  const showPerp = ['perpendicular', 'plotImageDraw', 'distanceOneCount', 'distanceOne', 'distanceTwo', 'find-image', 'imageFound', ...patternVisuals, 'dragExplore'].includes(step.visual);
  const showImage = ['imageFound', ...patternVisuals, 'dragExplore'].includes(step.visual);
  const showDistanceOne = ['distanceOneCount', 'distanceOne', 'distanceTwo', 'find-image', 'imageFound', ...patternVisuals].includes(step.visual);
  const showDistanceTwo = ['distanceTwo', 'find-image', 'imageFound', ...patternVisuals].includes(step.visual);
  const showDirectPerpSegment = ['plotImageDraw', 'distanceTwo', 'find-image', 'imageFound', ...patternVisuals, 'dragExplore'].includes(step.visual);
  const showLineComplete = !['intro', 'lineBuild'].includes(step.visual);
  const isInteractive = Boolean(step.requires);
  const diagonalDistance = Math.abs(activePoint.x + activePoint.y) / 2;
  const ftuePoints = Array.isArray(step.ftuePoints)
    ? step.ftuePoints.filter((p) => !linePoints.some((plotted) => plotted.x === p.x && plotted.y === p.y))
    : [];

  const toSvg = (p) => ({ x: origin.x + p.x * scale, y: origin.y - p.y * scale });
  const fromSvg = (x, y) => ({ x: (x - origin.x) / scale, y: (origin.y - y) / scale });
  const perpendicularLineBounds = () => {
    const diff = activePoint.x - activePoint.y;
    const candidates = [
      { x: graph.minX, y: graph.minX - diff },
      { x: graph.maxX, y: graph.maxX - diff },
      { x: graph.minY + diff, y: graph.minY },
      { x: graph.maxY + diff, y: graph.maxY },
    ].filter((p) =>
      p.x >= graph.minX - 0.001 &&
      p.x <= graph.maxX + 0.001 &&
      p.y >= graph.minY - 0.001 &&
      p.y <= graph.maxY + 0.001
    );
    const unique = candidates.filter((p, index) =>
      candidates.findIndex((q) => Math.abs(q.x - p.x) < 0.001 && Math.abs(q.y - p.y) < 0.001) === index
    );
    return unique.length >= 2
      ? [toSvg(unique[0]), toSvg(unique[unique.length - 1])]
      : [toSvg(activePoint), toSvg(T.shared.reflect(activePoint))];
  };
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const dragBounds = T.shared.dragBounds(interactionGraph);
  const snapPoint = (p, bounds = interactionGraph) => ({
    x: clamp(Math.round(p.x), bounds.minX, bounds.maxX),
    y: clamp(Math.round(p.y), bounds.minY, bounds.maxY),
  });
  const pointerToMath = (event, bounds = interactionGraph) => {
    const svg = svgRef.current;
    if (!svg) return snapPoint(activePoint, bounds);
    const rect = svg.getBoundingClientRect();
    const sx = ((event.clientX - rect.left) / rect.width) * 720;
    const sy = ((event.clientY - rect.top) / rect.height) * 470;
    return snapPoint(fromSvg(sx, sy), bounds);
  };
  const isNearActivePoint = (event) => {
    const svg = svgRef.current;
    if (!svg) return false;
    const rect = svg.getBoundingClientRect();
    const sx = ((event.clientX - rect.left) / rect.width) * 720;
    const sy = ((event.clientY - rect.top) / rect.height) * 470;
    const pt = toSvg(activePoint);
    return Math.hypot(sx - pt.x, sy - pt.y) <= 28;
  };
  const releaseDragPointer = (event) => {
    if (svgRef.current?.releasePointerCapture && event.pointerId != null) {
      try {
        svgRef.current.releasePointerCapture(event.pointerId);
      } catch (error) {
        // Ignore release errors when the pointer is already released.
      }
    }
    dragPointerIdRef.current = null;
    setDragging(false);
  };

  const handleTap = (event) => {
    if (!isInteractive) return;
    if (step.requires === 'dragPoint') return;
    onPlaneTap(pointerToMath(event));
  };

  const handlePointerDown = (event) => {
    if (step.requires !== 'dragPoint') return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    if (!isNearActivePoint(event)) return;
    event.preventDefault();
    event.stopPropagation();
    if (svgRef.current?.setPointerCapture && event.pointerId != null) {
      svgRef.current.setPointerCapture(event.pointerId);
    }
    dragPointerIdRef.current = event.pointerId;
    setDragging(true);
    onPointDrag(pointerToMath(event, dragBounds));
  };
  const handlePointerMove = (event) => {
    if (!dragging || step.requires !== 'dragPoint') return;
    if (dragPointerIdRef.current !== event.pointerId) return;
    event.preventDefault();
    onPointDrag(pointerToMath(event, dragBounds));
  };
  const handlePointerUp = (event) => {
    if (!dragging || step.requires !== 'dragPoint') return;
    if (dragPointerIdRef.current !== event.pointerId) return;
    event.preventDefault();
    if (onPointDragEnd) onPointDragEnd(pointerToMath(event, dragBounds));
    releaseDragPointer(event);
  };
  const handlePointerCancel = (event) => {
    if (dragPointerIdRef.current !== event.pointerId) return;
    releaseDragPointer(event);
  };

  const axisTicks = [];
  for (let x = graph.minX; x <= graph.maxX; x++) {
    const pos = toSvg({ x, y: 0 });
    axisTicks.push(React.createElement('g', { key: `x-${x}` },
      React.createElement('line', { x1: pos.x, y1: origin.y - 4, x2: pos.x, y2: origin.y + 4, className: 'tick-mark' }),
      x !== 0 && x !== graph.minX && x !== graph.maxX && React.createElement('text', { x: pos.x, y: origin.y + 20, className: 'axis-number', textAnchor: 'middle' }, x)
    ));
  }
  for (let y = graph.minY; y <= graph.maxY; y++) {
    const pos = toSvg({ x: 0, y });
    axisTicks.push(React.createElement('g', { key: `y-${y}` },
      React.createElement('line', { x1: origin.x - 4, y1: pos.y, x2: origin.x + 4, y2: pos.y, className: 'tick-mark' }),
      y !== 0 && y !== graph.minY && y !== graph.maxY && React.createElement('text', { x: origin.x - 12, y: pos.y + 5, className: 'axis-number', textAnchor: 'end' }, y)
    ));
  }

  const coordinateLabel = (p, opts = {}) => {
    const flyKey = opts.flySource === 'graph-active-label' ? 'active' : opts.flySource;
    return React.createElement(React.Fragment, null,
      React.createElement('tspan', null, '('),
      React.createElement('tspan', {
        className: 'graph-coord-x',
        'data-graph-coordinate': flyKey ? `${flyKey}-x` : undefined,
      }, p.x),
      React.createElement('tspan', null, ', '),
      React.createElement('tspan', {
        className: 'graph-coord-y',
        'data-graph-coordinate': flyKey ? `${flyKey}-y` : undefined,
      }, p.y),
      React.createElement('tspan', null, ')')
    );
  };

  const pointLabelText = (p, kind, opts = {}) => {
    if (kind === 'source') {
      return React.createElement(React.Fragment, null, 'A', coordinateLabel(p, opts));
    }
    if (kind === 'image') {
      return React.createElement(React.Fragment, null, "A'", coordinateLabel(p, opts));
    }
    return coordinateLabel(p, opts);
  };

  // Tweak label position per point type: dx/dy are pixel offsets from the point center.
  // textAnchor 'start' = label grows right (use with positive dx for top-right).
  // textAnchor 'end' = label grows left (use with negative dx for top-left / left).
  const LABEL_OFFSETS = {
    source: { dx: 14, dy: -18, textAnchor: 'start' },
    image: { dx: -14, dy: -18, textAnchor: 'end' },
    onLine: { dx: -18, dy: 5, textAnchor: 'end' },
    default: { dx: 14, dy: -18, textAnchor: 'start' },
  };

  const labelPlacement = (kind, placementKey) => {
    if (placementKey === 'onLine') return LABEL_OFFSETS.onLine;
    if (kind === 'image') return LABEL_OFFSETS.image;
    if (kind === 'source') return LABEL_OFFSETS.source;
    return LABEL_OFFSETS.default;
  };

  const pointEl = (p, className, label, opts = {}) => {
    const s = toSvg(p);
    const kind = opts.kind || '';
    const placement = labelPlacement(kind, opts.placement);
    return React.createElement('g', {
      className,
      key: `${className}-${p.x}-${p.y}`,
    },
      opts.draggable && React.createElement('circle', {
        cx: s.x,
        cy: s.y,
        r: 24,
        className: 'drag-hit-area',
      }),
      opts.draggable && React.createElement('circle', {
        cx: s.x,
        cy: s.y,
        r: 13,
        className: 'drag-pulse-ring',
      }),
      opts.blink && React.createElement('circle', { cx: s.x, cy: s.y, r: opts.large ? 15 : 12, className: 'point-ping-ring' }),
      React.createElement('circle', {
        cx: s.x,
        cy: s.y,
        r: opts.large ? 9 : 7,
        'data-ftue-target': opts.ftueTarget || undefined,
      }),
      React.createElement('text', {
        x: s.x + placement.dx,
        y: s.y + placement.dy,
        className: 'point-label',
        textAnchor: placement.textAnchor,
        'data-fly-source': opts.flySource || undefined,
      }, label || pointLabelText(p, kind, opts))
    );
  };

  const formatMeasure = (count) => {
    if (Number.isInteger(count)) return String(count);
    return `${Math.floor(count)}.5`;
  };

  const unitWord = (count) => `${formatMeasure(count)} ${count === 1 ? T.ui.unit : T.ui.units}`;

  const getUnitPoints = (from, direction, count) => {
    const pts = [];
    if (count <= 0) return pts;
    const whole = Math.floor(count);
    for (let k = 0; k <= whole; k++) {
      pts.push(toSvg({
        x: from.x + direction.x * k,
        y: from.y + direction.y * k,
      }));
    }
    if (count > whole) {
      pts.push(toSvg({
        x: from.x + direction.x * count,
        y: from.y + direction.y * count,
      }));
    }
    return pts;
  };

  const distanceLabel = (from, direction, count, total, mode, key) => {
    if (count <= 0 || total <= 0) return null;
    const span = mode === 'unit' ? count - 0.5 : count / 2;
    const fromSvgPoint = toSvg(from);
    const toSvgPoint = toSvg({
      x: from.x + direction.x * Math.max(count, 0.5),
      y: from.y + direction.y * Math.max(count, 0.5),
    });
    const mid = toSvg({
      x: from.x + direction.x * span,
      y: from.y + direction.y * span,
    });
    const dx = toSvgPoint.x - fromSvgPoint.x;
    const dy = toSvgPoint.y - fromSvgPoint.y;
    const len = Math.hypot(dx, dy) || 1;
    const normal = activePoint.x + activePoint.y > 0
      ? { x: dy / len, y: -dx / len }
      : { x: -dy / len, y: dx / len };
    const labelGap = mode === 'unit' ? 54 : 48;
    const offset = { x: normal.x * labelGap, y: normal.y * labelGap };
    return React.createElement('g', {
      key,
      className: 'dist-label-follow',
      style: { transform: `translate(${mid.x + offset.x}px, ${mid.y + offset.y}px)` },
    },
      React.createElement('text', {
        x: 0,
        y: 0,
        className: 'unit-label unit-label-on-line',
        textAnchor: 'middle',
        dominantBaseline: 'middle',
      }, unitWord(count))
    );
  };

  const animatedSourceDistance = () => {
    if (!distanceAnim || diagonalDistance <= 0) return null;
    const { substep, count } = distanceAnim;
    const pts = getUnitPoints(activePoint, diagonalUnitDirection, diagonalDistance);
    const yellowSegments = [];

    if ((substep === 'count' || substep === 'count-hold') && pts.length > 1) {
      const visibleSegments = Math.min(Math.ceil(count), pts.length - 1);
      for (let i = 1; i <= visibleSegments; i++) {
        const pA = pts[i - 1];
        const pB = pts[i];
        const isActiveSegment = substep === 'count' && i === visibleSegments;
        const className = isActiveSegment
          ? i === 1 ? 'first-segment-draw' : 'caterpillar-flipping'
          : 'count-segment';
        const isPartialFinal = count % 1 !== 0 && i === visibleSegments;
        if (pA && pB) {
          yellowSegments.push(React.createElement('line', {
            key: `yellow-count-${i}`,
            x1: pA.x,
            y1: pA.y,
            x2: isPartialFinal ? pts[pts.length - 1].x : pB.x,
            y2: isPartialFinal ? pts[pts.length - 1].y : pB.y,
            pathLength: 1,
            className,
            style: isActiveSegment && i !== 1 ? { transformOrigin: `${pA.x}px ${pA.y}px` } : undefined,
          }));
        }
      }
    }

    return React.createElement(React.Fragment, null,
      yellowSegments,
      distanceLabel(
        activePoint,
        diagonalUnitDirection,
        count,
        diagonalDistance,
        substep === 'count-hold' ? 'full' : 'unit',
        'src-dist-label'
      )
    );
  };

  const staticMeasuredSourceDistance = () => {
    const pts = getUnitPoints(activePoint, diagonalUnitDirection, diagonalDistance);
    if (pts.length <= 1) return null;
    return React.createElement(React.Fragment, null,
      pts.slice(1).map((p, index) => React.createElement('line', {
        key: `yellow-count-${index + 1}`,
        x1: pts[index].x,
        y1: pts[index].y,
        x2: p.x,
        y2: p.y,
        className: 'count-segment',
      })),
      distanceLabel(
        activePoint,
        diagonalUnitDirection,
        diagonalDistance,
        diagonalDistance,
        'full',
        'src-dist-label'
      )
    );
  };

  const unitFlipDistance = (from, direction, count, className, opts = {}) => {
    if (count <= 0) return null;
    const showLabel = opts.showLabel !== false;
    const labelStart = toSvg(from);
    const labelEnd = toSvg({
      x: from.x + direction.x * count,
      y: from.y + direction.y * count,
    });
    const midX = (labelStart.x + labelEnd.x) / 2;
    const midY = (labelStart.y + labelEnd.y) / 2;
    return React.createElement('g', { className: `unit-flip-distance ${className || ''}` },
      React.createElement('line', {
        x1: labelStart.x,
        y1: labelStart.y,
        x2: labelEnd.x,
        y2: labelEnd.y,
        pathLength: 1,
        className: opts.travel ? 'unit-travel-segment' : 'unit-measure-segment',
      }),
      showLabel && React.createElement('text', {
        x: midX + 13,
        y: midY - 10,
        className: 'unit-label unit-flip-label',
      }, unitWord(count))
    );
  };

  const equidistanceMarker = (from, direction, count, className, key) => {
    if (count <= 0) return null;
    const start = toSvg(from);
    const end = toSvg({
      x: from.x + direction.x * count,
      y: from.y + direction.y * count,
    });
    const mid = {
      x: (start.x + end.x) / 2,
      y: (start.y + end.y) / 2,
    };
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const len = Math.hypot(dx, dy) || 1;
    const half = 11;
    const nx = (-dy / len) * half;
    const ny = (dx / len) * half;
    return React.createElement('line', {
      key,
      x1: mid.x - nx,
      y1: mid.y - ny,
      x2: mid.x + nx,
      y2: mid.y + ny,
      className: `equidistance-marker ${className || ''}`,
    });
  };

  const rightAngleMark = () => {
    const size = 14;
    const f = footSvg;
    const lineUnit = { x: Math.SQRT1_2, y: -Math.SQRT1_2 };
    const perpUnit = activePoint.x + activePoint.y > 0
      ? { x: -Math.SQRT1_2, y: -Math.SQRT1_2 }
      : { x: Math.SQRT1_2, y: Math.SQRT1_2 };
    const a = { x: f.x + lineUnit.x * size, y: f.y + lineUnit.y * size };
    const b = { x: a.x + perpUnit.x * size, y: a.y + perpUnit.y * size };
    const c = { x: f.x + perpUnit.x * size, y: f.y + perpUnit.y * size };
    return React.createElement('g', { className: 'right-angle-mark diagonal-right-angle' },
      React.createElement('path', {
        d: `M ${a.x} ${a.y} L ${b.x} ${b.y} L ${c.x} ${c.y}`,
        className: 'construction-angle',
      }),
      React.createElement('text', {
        x: c.x + perpUnit.x * 16,
        y: c.y + perpUnit.y * 16,
        className: 'degree-label',
      }, '90\u00b0')
    );
  };

  const distanceConstruction = () => {
    if (!showPerp) return null;
    const showGuideToFoot = ['perpendicular', 'plotImageDraw', 'distanceOneCount', 'distanceOne', 'distanceTwo', 'find-image'].includes(step.visual);
    const showJoinedSegment = ['find-image', 'imageFound', ...patternVisuals, 'dragExplore'].includes(step.visual);
    const showSourceCount = ['distanceOneCount', 'distanceOne'].includes(step.visual);
    const showFlip = step.visual === 'distanceTwo';
    const showImageTravel = step.visual === 'find-image';
    const showAnimatedCount = Boolean(distanceAnim && ['distanceOneCount', 'distanceOne'].includes(step.visual));
    const showStaticMeasuredSource = false;
    const showBothMarkers = ['distanceTwo', 'find-image', 'imageFound'].includes(step.visual);
    const showJoinedMarkers = ['patternComplete', 'dragExplore'].includes(step.visual);
    const pivot = `${footSvg.x}px ${footSvg.y}px`;
    const [guideStart, guideEnd] = perpendicularLineBounds();
    return React.createElement('g', { className: 'diagonal-reflection-construction' },
      showGuideToFoot && React.createElement('line', {
        x1: guideStart.x,
        y1: guideStart.y,
        x2: guideEnd.x,
        y2: guideEnd.y,
        className: step.visual === 'perpendicular' ? 'perpendicular-solid-guide' : 'full-dashed-guide',
      }),
      showJoinedSegment && React.createElement('line', {
        x1: perpStart.x,
        y1: perpStart.y,
        x2: perpEnd.x,
        y2: perpEnd.y,
        className: 'joined-reflection-distance',
      }),
      ['perpendicular', 'plotImageDraw', 'distanceOneCount', 'distanceOne', 'distanceTwo', 'find-image', 'imageFound', ...patternVisuals].includes(step.visual) && rightAngleMark(),
      showDirectPerpSegment && React.createElement('line', {
        x1: perpStart.x,
        y1: perpStart.y,
        x2: footSvg.x,
        y2: footSvg.y,
        pathLength: 1,
        className: step.visual === 'plotImageDraw' ? 'first-segment-draw' : 'count-segment',
      }),
      showStaticMeasuredSource && staticMeasuredSourceDistance(),
      showSourceCount && !showAnimatedCount && !showStaticMeasuredSource && unitFlipDistance(
        activePoint,
        diagonalUnitDirection,
        step.visual === 'distanceOneCount' ? Math.min(1, diagonalDistance) : diagonalDistance,
        'distance-one',
        { showGuide: false, showLabel: step.visual !== 'distanceOneCount' }
      ),
      showAnimatedCount && animatedSourceDistance(),
      showFlip && React.createElement('line', {
        x1: perpStart.x,
        y1: perpStart.y,
        x2: footSvg.x,
        y2: footSvg.y,
        className: `construction-white-flip${step.visual === 'find-image' ? ' becomes-yellow' : ''}`,
        style: { transformOrigin: pivot },
      }),
      showFlip && unitFlipDistance(foot, diagonalUnitDirection, diagonalDistance, 'distance-two', {
        showLabel: false,
        travel: true,
      }),
      showBothMarkers && equidistanceMarker(activePoint, diagonalUnitDirection, diagonalDistance, 'orange-marker', 'marker-source'),
      showBothMarkers && equidistanceMarker(foot, diagonalUnitDirection, diagonalDistance, 'orange-marker', 'marker-image'),
      showJoinedMarkers && equidistanceMarker(activePoint, diagonalUnitDirection, diagonalDistance, 'orange-marker', 'joined-marker-source'),
      showJoinedMarkers && equidistanceMarker(foot, diagonalUnitDirection, diagonalDistance, 'orange-marker', 'joined-marker-image'),
      showImageTravel && React.createElement('circle', {
        cx: perpStart.x,
        cy: perpStart.y,
        r: 9,
        className: 'construction-point-travel',
        style: {
          '--tdx': `${perpEnd.x - perpStart.x}px`,
          '--tdy': `${perpEnd.y - perpStart.y}px`,
        },
      })
    );
  };

  const lineStart = toSvg({ x: Math.max(graph.minX, -graph.maxY), y: Math.min(graph.maxY, -graph.minX) });
  const lineEnd = toSvg({ x: Math.min(graph.maxX, -graph.minY), y: Math.max(graph.minY, -graph.maxX) });
  const perpStart = toSvg(activePoint);
  const perpEnd = toSvg(image);
  const footSvg = toSvg(foot);
  const wrong = feedbackPoint && toSvg(feedbackPoint);

  return React.createElement('div', { className: 'reflection-plane-shell', style: { viewTransitionName: 'reflection-plane-shell' } },
    React.createElement('svg', {
      ref: svgRef,
      className: `reflection-plane diagonal-plane ${isInteractive ? 'plot-ready' : ''}${step.requires === 'dragPoint' ? ' drag-enabled' : ''}${dragging ? ' is-dragging' : ''}`,
      viewBox: '0 0 720 470',
      role: 'img',
      onClick: handleTap,
      onPointerDown: step.requires === 'dragPoint' ? handlePointerDown : undefined,
      onPointerMove: step.requires === 'dragPoint' ? handlePointerMove : undefined,
      onPointerUp: step.requires === 'dragPoint' ? handlePointerUp : undefined,
      onPointerCancel: step.requires === 'dragPoint' ? handlePointerCancel : undefined,
      onLostPointerCapture: step.requires === 'dragPoint' ? handlePointerCancel : undefined,
    },
      React.createElement('defs', null,
        React.createElement('marker', { id: 'axisArrowGrey', markerWidth: 7, markerHeight: 7, refX: 3.5, refY: 3.5, orient: 'auto-start-reverse' },
          React.createElement('path', { d: 'M0,0 L7,3.5 L0,7 Z', className: 'axis-arrow-grey' })
        ),
        React.createElement('pattern', { id: 'grid-small', width: scale, height: scale, patternUnits: 'userSpaceOnUse', x: origin.x % scale, y: origin.y % scale },
          React.createElement('path', { d: `M ${scale} 0 L 0 0 0 ${scale}`, className: 'grid-small' })
        )
      ),
      React.createElement('rect', { x: grid.x, y: grid.y, width: grid.w, height: grid.h, className: 'grid-bg' }),
      React.createElement('rect', { x: grid.x, y: grid.y, width: grid.w, height: grid.h, fill: 'url(#grid-small)', opacity: '0.55' }),
      React.createElement('line', { x1: grid.x + 8, y1: origin.y, x2: grid.x + grid.w - 8, y2: origin.y, className: 'graph-axis-line', markerStart: 'url(#axisArrowGrey)', markerEnd: 'url(#axisArrowGrey)' }),
      React.createElement('line', { x1: origin.x, y1: grid.y + 8, x2: origin.x, y2: grid.y + grid.h - 8, className: 'graph-axis-line', markerStart: 'url(#axisArrowGrey)', markerEnd: 'url(#axisArrowGrey)' }),
      axisTicks,
      React.createElement('text', { x: grid.x + grid.w - 18, y: origin.y - 12, className: 'axis-label' }, 'x'),
      React.createElement('text', { x: origin.x + 14, y: grid.y + 24, className: 'axis-label axis-label-y' }, 'y'),
      React.createElement('text', { x: origin.x - 15, y: origin.y + 17, className: 'origin-label' }, 'O'),
      showLineComplete && React.createElement('line', {
        x1: lineStart.x, y1: lineStart.y, x2: lineEnd.x, y2: lineEnd.y,
        className: 'reflection-line diagonal-reflection-line',
      }),
      showLineComplete && React.createElement('text', { x: lineEnd.x + 18, y: lineEnd.y - 10, className: 'reflection-line-label diagonal-line-label' }, T.shared.lineLabel),
      ftuePoints.map((p, i) => {
        const s = toSvg(p);
        return React.createElement('circle', {
          key: `ftue-point-${i}-${p.x}-${p.y}`,
          cx: s.x,
          cy: s.y,
          r: 20,
          className: 'ftue-point-anchor',
          'data-ftue-point': `${p.x},${p.y}`,
        });
      }),
      (['lineBuild'].includes(step.visual) ? linePoints : linePoints)
        .filter(() => ['lineBuild', 'lineComplete'].includes(step.visual))
        .map((p) => pointEl(p, 'equal-point source-point', null, { large: true, blink: true, placement: 'onLine' })),
      wrong && React.createElement('g', { className: 'attempt-point wrong' },
        React.createElement('circle', { cx: wrong.x, cy: wrong.y, r: 14, className: 'point-ping-ring' }),
        React.createElement('circle', { cx: wrong.x, cy: wrong.y, r: 8 }),
        React.createElement('text', { x: wrong.x + 12, y: wrong.y - 14, className: 'point-label wrong-label' }, formatPoint(feedbackPoint))
      ),
      distanceConstruction(),
      showPoint && pointEl(activePoint, `source-point ${step.visual === 'dragExplore' ? 'draggable-point' : ''}`, null, { draggable: step.requires === 'dragPoint', large: true, flySource: 'graph-active-label', kind: 'source', ftueTarget: step.requires === 'dragPoint' ? 'active-point' : undefined }),
      showImage && pointEl(image, 'image-point image-point-joined', null, { large: true, flySource: step.visual === 'dragExplore' ? 'graph-image-label' : undefined, kind: 'image' }),
      summaryVisuals.includes(step.visual) && React.createElement(React.Fragment, null,
        pointEl(activePoint, 'source-point', null, { large: true, flySource: 'graph-active-label', kind: 'source' }),
        pointEl(image, 'image-point image-point-joined', null, { large: true, kind: 'image' })
      )
    )
  );
};

window.ReflectionPlane = ReflectionPlane;
window.formatReflectionPoint = formatPoint;
