const SvgCanvas = ({
  currentObject,
  dropProgress = 0,
}) => {
  const { useRef, useEffect, useState } = React;
  const svgRef = useRef(null);
  const [currentObjectY, setCurrentObjectY] = useState(null);
  const [currentWaterLevel, setCurrentWaterLevel] = useState(200);

  // Beaker dimensions
  const jarWidth = 300;
  const jarHeight = 300;
  // Shifted 150px right from original 250
  const x0 = 400;
  const y0 = 450;
  const dx = 80;
  const dy = 40;
  const initialWaterLevel = 200;

  // Get object-specific data from APP_DATA
  const getObjectData = () => {
    if (!currentObject) return null;
    return APP_DATA.sinkData[currentObject];
  };

  // Single function that controls both water level and object position from progress (0 = top, 1 = bottom).
  // Same logic as the previous animate, but driven by slider value.
  const handleSlider = (progress) => {
    if (!currentObject) {
      setCurrentObjectY(null);
      setCurrentWaterLevel(initialWaterLevel);
      return;
    }
    const objData = getObjectData();
    if (!objData) return;

    const start = objData.objectStartY;
    const end = objData.objectEndY;
    const pivot = objData.pivot;
    const waterLevelIncrease = objData.waterLevel;
    const objectHeight = objData.objectHeight;
    const htosink = objectHeight - waterLevelIncrease;

    const newY = start + (end - start) * progress;
    setCurrentObjectY(newY);

    if (newY >= pivot && newY <= htosink + pivot) {
      const hh = ((newY - pivot) / htosink) * waterLevelIncrease;
      setCurrentWaterLevel(initialWaterLevel + hh);
    } else if (newY >= htosink + pivot) {
      setCurrentWaterLevel(initialWaterLevel + waterLevelIncrease);
    } else {
      setCurrentWaterLevel(initialWaterLevel);
    }
  };

  // Sync state from dropProgress prop (from slider or step 2 fixed at 1)
  useEffect(() => {
    if (!currentObject) {
      setCurrentObjectY(null);
      setCurrentWaterLevel(initialWaterLevel);
      return;
    }
    handleSlider(dropProgress);
  }, [dropProgress, currentObject]);

  // Draw prism (water) coordinates
  const getWaterPolygons = () => {
    const h = currentWaterLevel;
    return {
      bottom: `${x0},${y0} ${x0 + jarWidth},${y0} ${x0 + jarWidth + dx},${y0 - dy} ${x0 + dx},${y0 - dy}`,
      topBack: `${x0 + dx / 2},${y0 - h - dy / 2} ${x0 + jarWidth + dx / 2},${y0 - h - dy / 2} ${x0 + jarWidth + dx},${y0 - dy - h} ${x0 + dx},${y0 - dy - h}`,
      topFront: `${x0},${y0 - h} ${x0 + jarWidth},${y0 - h} ${x0 + jarWidth + dx / 2},${y0 - dy / 2 - h} ${x0 + dx / 2},${y0 - dy / 2 - h}`,
      front: `${x0},${y0} ${x0 + jarWidth},${y0} ${x0 + jarWidth},${y0 - h} ${x0},${y0 - h}`,
      back: `${x0 + dx},${y0 - dy} ${x0 + jarWidth + dx},${y0 - dy} ${x0 + jarWidth + dx},${y0 - h - dy} ${x0 + dx},${y0 - h - dy}`,
      right: `${x0 + jarWidth},${y0} ${x0 + dx + jarWidth},${y0 - dy} ${x0 + dx + jarWidth},${y0 - dy - h} ${x0 + jarWidth},${y0 - h}`,
      left: `${x0},${y0} ${x0 + dx},${y0 - dy} ${x0 + dx},${y0 - dy - h} ${x0},${y0 - h}`,
    };
  };

  // Beaker outline coordinates
  const getBeakerPolygons = () => {
    const h = jarHeight;
    return {
      beakerFront: `${x0},${y0} ${x0 + jarWidth},${y0} ${x0 + jarWidth},${y0 - h} ${x0},${y0 - h}`,
      beakerBack: `${x0 + dx},${y0 - dy} ${x0 + jarWidth + dx},${y0 - dy} ${x0 + jarWidth + dx},${y0 - h - dy} ${x0 + dx},${y0 - h - dy}`,
    };
  };

  // Beaker edge lines
  const getBeakerLines = () => {
    const h = jarHeight;
    return [
      { x1: x0, y1: y0, x2: x0 + dx, y2: y0 - dy },
      { x1: x0 + jarWidth, y1: y0, x2: x0 + dx + jarWidth, y2: y0 - dy },
      { x1: x0, y1: y0 - h, x2: x0 + dx, y2: y0 - dy - h },
      { x1: x0 + jarWidth, y1: y0 - h, x2: x0 + dx + jarWidth, y2: y0 - dy - h },
    ];
  };

  // Generate ruler ticks
  const getRulerTicks = () => {
    const objData = getObjectData();
    const baseTickLabel = objData?.baseTickLabel || 12000;
    const gap = objData?.gap || 50;
    const bottomTick = baseTickLabel - 10 * gap;
    const startY = y0 - jarHeight;
    const endY = y0;
    const interval = 20;
    const x = x0;
    const ticks = [];
    const totalTicks = Math.floor((endY - startY) / interval);

    for (let i = 0; i <= totalTicks; i++) {
      const y = endY - i * interval;
      ticks.push({
        y,
        x,
        showLabel: i % 2 === 0,
        label: bottomTick + i * gap + " cm³",
      });
    }
    return ticks;
  };

  const waterPolygons = getWaterPolygons();
  const beakerPolygons = getBeakerPolygons();
  const beakerLines = getBeakerLines();
  const rulerTicks = getRulerTicks();

  // Water level marker positions
  const waterLevelMarkerY = y0 - initialWaterLevel;
  const dynamicMarkerY = y0 - currentWaterLevel;

  // Zoom clip path center - adjusted to 400
  const zoomCx = 370;
  const zoomCy = 225;
  // Controls the radius/size of the zoom marker circle - bigger as requested
  const zoomR = 90;

  // Get object position + 150 shift
  const getObjectX = () => {
    const objData = getObjectData();
    return objData ? objData.objectStartX + 150 : 550;
  };

  const getObjectY = () => {
    if (currentObjectY !== null) {
      return currentObjectY;
    }
    const objData = getObjectData();
    return objData ? objData.objectStartY : 10;
  };

  const getImageHeight = () => {
    return 100;
  };

  return React.createElement(
    "div",
    { className: "svg-canvas-wrapper" },
    React.createElement(
      "svg",
      {
        ref: svgRef,
        viewBox: "0 0 800 500",
        className: "svg-canvas",
        preserveAspectRatio: "xMidYMid meet",
      },
      // Everything group (for clip path reference)
      React.createElement(
        "g",
        { id: "everything" },
        // Beaker group
        React.createElement(
          "g",
          { id: "beaker" },
          // Beaker back outline
          React.createElement("polygon", {
            id: "beakerBack",
            stroke: "white",
            strokeWidth: "2",
            fill: "none",
            points: beakerPolygons.beakerBack,
          }),
          // Water back face
          React.createElement("polygon", {
            id: "back",
            fill: "#4fc3f7",
            stroke: "white",
            fillOpacity: "0.3",
            points: waterPolygons.back,
          }),
          // Water top back face
          React.createElement("polygon", {
            id: "topBack",
            fill: "#81d4fa",
            stroke: "none",
            fillOpacity: "0.4",
            points: waterPolygons.topBack,
          }),
          // Water bottom face
          React.createElement("polygon", {
            id: "bottom",
            fill: "#4fc3f7",
            stroke: "white",
            fillOpacity: "0.3",
            points: waterPolygons.bottom,
          }),
          // Water left face
          React.createElement("polygon", {
            id: "left",
            fill: "#29b6f6",
            stroke: "white",
            fillOpacity: "0.3",
            points: waterPolygons.left,
          }),
          // Object images (only show selected object)
          currentObject === "stone" &&
            React.createElement("image", {
              href: "assets/stone.png",
              height: getImageHeight(),
              x: getObjectX(),
              y: getObjectY(),
              id: "stone",
              transform: "translate(-25,0)",
            }),
          currentObject === "anchor" &&
            React.createElement("image", {
              href: "assets/anchor.png",
              height: getImageHeight(),
              x: getObjectX(),
              y: getObjectY(),
              // transform: "translate(50,0)",
              id: "anchor",
            }),
          currentObject === "brick" &&
            React.createElement("image", {
              href: "assets/brick.png",
              height: getImageHeight(),
              x: getObjectX(),
              y: getObjectY(),
              transform: "translate(-40,0)",
              id: "brick",
            }),
          // Water right face
          React.createElement("polygon", {
            id: "right",
            fill: "#29b6f6",
            stroke: "white",
            fillOpacity: "0.3",
            points: waterPolygons.right,
          }),
          // Water top front face
          React.createElement("polygon", {
            id: "topFront",
            fill: "#81d4fa",
            stroke: "none",
            fillOpacity: "0.4",
            points: waterPolygons.topFront,
          }),
          // Water front face
          React.createElement("polygon", {
            id: "front",
            fill: "#29b6f6",
            stroke: "white",
            fillOpacity: "0.3",
            points: waterPolygons.front,
          }),
          // Beaker front outline
          React.createElement("polygon", {
            id: "beakerFront",
            fill: "none",
            stroke: "white",
            strokeWidth: "2",
            points: beakerPolygons.beakerFront,
          }),
          // Beaker edge lines
          ...beakerLines.map((line, i) =>
            React.createElement("line", {
              key: `beaker-line-${i}`,
              x1: line.x1,
              y1: line.y1,
              x2: line.x2,
              y2: line.y2,
              stroke: "white",
              strokeWidth: "2",
            })
          )
        )
      ),
      // Labels group
      React.createElement("g", { id: "labels" }),
      // Clip path definition for zoom
      React.createElement(
        "defs",
        null,
        React.createElement(
          "clipPath",
          { id: "zoomClip" },
          React.createElement("circle", { cx: zoomCx, cy: zoomCy, r: zoomR })
        )
      ),
      // Zoomed view
      React.createElement(
        "g",
        { id: "clip", transform: "scale(1.6) translate(-240, -100)" },
        React.createElement("use", {
          clipPath: "url(#zoomClip)",
          href: "#everything",
        }),
        // Zoom overlays (Markers & Ruler) - ONLY visible in zoom
        React.createElement(
          "g",
          { clipPath: "url(#zoomClip)" },
          // Water level markers
          React.createElement("polygon", {
            id: "waterLevelMarker",
            fill: "#f6d573",
            points: "0,0 10,5 0,10",
            transform: `translate(310, ${waterLevelMarkerY - 5})`,
          }),
          React.createElement("polygon", {
            id: "dynamicMarker",
            fill: "#72c6ed",
            points: "0,0 10,5 0,10",
            transform: `translate(310, ${dynamicMarkerY - 5})`,
          }),
          // Ruler group
          React.createElement(
            "g",
            { id: "ruler" },
            rulerTicks.map((tick, i) =>
              React.createElement(
                "g",
                { key: `tick-${i}` },
                React.createElement("line", {
                  x1: tick.x,
                  x2: tick.x + 10,
                  y1: tick.y,
                  y2: tick.y,
                  stroke: "white",
                  strokeWidth: "1",
                }),
                tick.showLabel &&
                  React.createElement(
                    "text",
                    {
                      x: tick.x - 5,
                      y: tick.y + 4,
                      textAnchor: "end",
                      fontSize: "12",
                      fill: "white",
                      fontWeight: "bold",
                    },
                    tick.label
                  )
              )
            )
          )
        ),
        React.createElement("circle", {
          cx: zoomCx,
          cy: zoomCy,
          r: zoomR,
          fill: "none",
          stroke: "white",
          strokeWidth: "3",
        })
      )
    )
  );
};
