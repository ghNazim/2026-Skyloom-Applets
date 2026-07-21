const SummaryCanvas = (function () {
  const SUMMARY_ROTATION = 95;

  const VB_W = 400;
  const VB_H = 380;
  const CB_W = 148 * 0.7;
  const CB_H = 205 * 0.7;
  const CB_CX = VB_W / 2;
  const CB_CY = VB_H / 2 - 10;
  const ANCHOR_OFFSET_X = 30;
  const ANCHOR_OFFSET_Y = CB_H - 30;
  const ANCHOR_X = CB_CX - CB_W / 2 + ANCHOR_OFFSET_X;
  const ANCHOR_Y = CB_CY - CB_H / 2 + ANCHOR_OFFSET_Y;
  const CB_LEFT = CB_CX - CB_W / 2;
  const CB_TOP = CB_CY - CB_H / 2;
  const RED_REL_X = CB_W - 28;
  const RED_REL_Y = 28;
  const CROSSHAIR_MARGIN = 14;
  const PURPLE = "#9c27b0";
  const PURPLE_FILL = "rgba(156, 39, 176, 0.4)";
  const SECTOR_RADIUS = 30;
  const FADE_MS = 500;
  const BOX_FADE_MS = 600;
  const ROTATE_MS = 1000;
  const WAIT_SHORT_MS = 600;
  const WAIT_LONG_MS = 2000;
  const DIRECTION_EMPHASIS_MS = 4300;
  const ANGLE_EMPHASIS_MS = 3000;

  function describeSector(cx, cy, r, startRad, rotationDeg) {
    if (Math.abs(rotationDeg) < 0.5) return "";
    const rotationRad = (rotationDeg * Math.PI) / 180;
    const sweep = rotationDeg >= 0 ? 1 : 0;
    const absRot = Math.abs(rotationRad);
    const largeArc = absRot > Math.PI ? 1 : 0;
    const endRad = startRad + rotationRad;
    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);
    return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} ${sweep} ${x2} ${y2} Z`;
  }

  function getPointWorld(relX, relY, rotDeg) {
    const absX = CB_LEFT + relX;
    const absY = CB_TOP + relY;
    const rad = (rotDeg * Math.PI) / 180;
    const dx = absX - ANCHOR_X;
    const dy = absY - ANCHOR_Y;
    return {
      x: ANCHOR_X + dx * Math.cos(rad) - dy * Math.sin(rad),
      y: ANCHOR_Y + dx * Math.sin(rad) + dy * Math.cos(rad),
    };
  }

  function getRedBaseAngle() {
    const absX = CB_LEFT + RED_REL_X;
    const absY = CB_TOP + RED_REL_Y;
    return Math.atan2(absY - ANCHOR_Y, absX - ANCHOR_X);
  }

  function buildDirectionArc(cx, cy, r, startRad, rotationDeg) {
    if (Math.abs(rotationDeg) < 8) return null;
    const rotationRad = (rotationDeg * Math.PI) / 180;
    const endRad = startRad + rotationRad;
    const headLen = 12;
    const spread = Math.PI / 7;
    const trimRad = headLen / r;
    const arcEndRad = endRad - trimRad;

    const sweep = rotationDeg >= 0 ? 1 : 0;
    const arcSpan = rotationRad - trimRad;
    const absRot = Math.abs(arcSpan);
    const largeArc = absRot > Math.PI ? 1 : 0;

    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(arcEndRad);
    const y2 = cy + r * Math.sin(arcEndRad);
    const arcPath = `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} ${sweep} ${x2} ${y2}`;

    const tipX = cx + r * Math.cos(endRad);
    const tipY = cy + r * Math.sin(endRad);
    const tangent = endRad + Math.PI / 2;
    const wing1X = tipX - headLen * Math.cos(tangent - spread);
    const wing1Y = tipY - headLen * Math.sin(tangent - spread);
    const wing2X = tipX - headLen * Math.cos(tangent + spread);
    const wing2Y = tipY - headLen * Math.sin(tangent + spread);

    return {
      arcPath,
      arrowPoints: `${tipX},${tipY} ${wing1X},${wing1Y} ${wing2X},${wing2Y}`,
      tipX,
      tipY,
    };
  }

  function buildConnectorArrow(fromX, fromY, toX, toY, bendX, bendY, color, endGap, headLen) {
    const spread = Math.PI / 7;
    const cx = (fromX + toX) / 2 + bendX;
    const cy = (fromY + toY) / 2 + bendY;
    const tangentAngle = Math.atan2(toY - cy, toX - cx);
    const tipX = toX - endGap * Math.cos(tangentAngle);
    const tipY = toY - endGap * Math.sin(tangentAngle);
    const baseX = tipX - headLen * Math.cos(tangentAngle);
    const baseY = tipY - headLen * Math.sin(tangentAngle);
    const wing1X = tipX - headLen * Math.cos(tangentAngle - spread);
    const wing1Y = tipY - headLen * Math.sin(tangentAngle - spread);
    const wing2X = tipX - headLen * Math.cos(tangentAngle + spread);
    const wing2Y = tipY - headLen * Math.sin(tangentAngle + spread);

    return {
      pathD: `M ${fromX} ${fromY} Q ${cx} ${cy} ${baseX} ${baseY}`,
      arrowPoints: `${tipX},${tipY} ${wing1X},${wing1Y} ${wing2X},${wing2Y}`,
      color,
    };
  }

  const BOX_BORDER_ANGLE = "#c77dff";
  const BOX_BORDER_CENTRE = "#ffd34d";
  const BOX_BORDER_DIRECTION = "#ffae00";

  function makeFadeStyle(visible, durationMs) {
    return {
      opacity: visible ? 1 : 0,
      transition: `opacity ${durationMs}ms ease`,
    };
  }

  function makeCalloutStyle(visible, dimmed, durationMs) {
    return {
      opacity: visible ? (dimmed ? 0.3 : 1) : 0,
      transition: `opacity ${durationMs}ms ease`,
    };
  }

  return function SummaryCanvas(props) {
    const { onSequenceComplete } = props || {};
    const { useState, useEffect, useRef } = React;
    const data = APP_DATA.steps[6];
    const baseAngle = getRedBaseAngle();
    const redInitial = getPointWorld(RED_REL_X, RED_REL_Y, 0);
    const redRotated = getPointWorld(RED_REL_X, RED_REL_Y, SUMMARY_ROTATION);
    const trackRadius = Math.hypot(redInitial.x - ANCHOR_X, redInitial.y - ANCHOR_Y);
    const directionArcRadius = trackRadius + 22;

    const [stage, setStage] = useState({
      baseVisible: false,
      centreVisible: false,
      rotatingCloneVisible: false,
      directionArcVisible: false,
      directionBoxVisible: false,
      directionBlinking: false,
      angleVisible: false,
      angleBoxVisible: false,
      angleBlinking: false,
      complete: false,
    });
    const [cardRotation, setCardRotation] = useState(0);
    const completeCalledRef = useRef(false);
    const sequenceTokenRef = useRef(0);

    useEffect(() => {
      const token = sequenceTokenRef.current + 1;
      sequenceTokenRef.current = token;
      completeCalledRef.current = false;
      setStage({
        baseVisible: true,
        centreVisible: false,
        rotatingCloneVisible: false,
        directionArcVisible: false,
        directionBoxVisible: false,
        directionBlinking: false,
        angleVisible: false,
        angleBoxVisible: false,
        angleBlinking: false,
        complete: false,
      });
      setCardRotation(0);

      const timers = [];
      let frameId = null;

      const schedule = (delay, callback) => {
        timers.push(setTimeout(() => {
          if (sequenceTokenRef.current !== token) return;
          callback();
        }, delay));
      };

      const startRotation = () => {
        setStage((prev) => ({
          ...prev,
          rotatingCloneVisible: true,
          directionArcVisible: true,
        }));
        const startTime = performance.now();
        const tick = (now) => {
          if (sequenceTokenRef.current !== token) return;
          const elapsed = now - startTime;
          const t = Math.min(1, elapsed / ROTATE_MS);
          const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
          setCardRotation(SUMMARY_ROTATION * eased);
          if (t < 1) {
            frameId = requestAnimationFrame(tick);
          } else {
            setCardRotation(SUMMARY_ROTATION);
          }
        };
        frameId = requestAnimationFrame(tick);
      };

      schedule(WAIT_SHORT_MS, () => {
        setStage((prev) => ({ ...prev, centreVisible: true }));
      });

      schedule(WAIT_SHORT_MS + WAIT_LONG_MS, startRotation);

      schedule(WAIT_SHORT_MS + WAIT_LONG_MS + ROTATE_MS + WAIT_SHORT_MS * 2, () => {
        setStage((prev) => ({
          ...prev,
          directionBoxVisible: true,
          directionBlinking: true,
        }));
      });

      schedule(WAIT_SHORT_MS + WAIT_LONG_MS + ROTATE_MS + WAIT_SHORT_MS * 2 + DIRECTION_EMPHASIS_MS, () => {
        setStage((prev) => ({
          ...prev,
          directionBlinking: false,
          angleVisible: true,
          angleBoxVisible: true,
        }));
      });

      schedule(WAIT_SHORT_MS + WAIT_LONG_MS + ROTATE_MS + WAIT_SHORT_MS * 2 + DIRECTION_EMPHASIS_MS + FADE_MS, () => {
        setStage((prev) => ({ ...prev, angleBlinking: true }));
      });

      schedule(WAIT_SHORT_MS + WAIT_LONG_MS + ROTATE_MS + WAIT_SHORT_MS * 2 + DIRECTION_EMPHASIS_MS + FADE_MS + ANGLE_EMPHASIS_MS, () => {
        setStage((prev) => ({ ...prev, angleBlinking: false, complete: true }));
      });

      schedule(WAIT_SHORT_MS + WAIT_LONG_MS + ROTATE_MS + WAIT_SHORT_MS * 2 + DIRECTION_EMPHASIS_MS + FADE_MS + ANGLE_EMPHASIS_MS, () => {
        if (!completeCalledRef.current && typeof onSequenceComplete === "function") {
          completeCalledRef.current = true;
          onSequenceComplete();
        }
      });

      return () => {
        sequenceTokenRef.current += 1;
        timers.forEach((timer) => clearTimeout(timer));
        if (frameId) cancelAnimationFrame(frameId);
      };
    }, [onSequenceComplete]);

    const sectorPath = describeSector(
      ANCHOR_X,
      ANCHOR_Y,
      SECTOR_RADIUS,
      baseAngle,
      SUMMARY_ROTATION
    );
    const directionArcRotation = stage.directionArcVisible ? Math.max(0, cardRotation) : 0;
    const directionArc = buildDirectionArc(
      ANCHOR_X,
      ANCHOR_Y,
      directionArcRadius,
      baseAngle,
      directionArcRotation
    );
    const cardboardTransform = `rotate(${cardRotation} ${ANCHOR_X} ${ANCHOR_Y})`;

    const midAngleRad = baseAngle + ((SUMMARY_ROTATION * Math.PI) / 180) / 2;
    const sectorMidX = ANCHOR_X + SECTOR_RADIUS * 0.8 * Math.cos(midAngleRad);
    const sectorMidY = ANCHOR_Y + SECTOR_RADIUS * 0.8 * Math.sin(midAngleRad);
    const directionStartRadius = directionArcRadius + 18;
    const directionStartX =
      ANCHOR_X + directionStartRadius * Math.cos(midAngleRad);
    const directionStartY =
      ANCHOR_Y + directionStartRadius * Math.sin(midAngleRad);

    const OVERLAY_W = 1000;
    const OVERLAY_H = 500;
    const diagramScale = 420 / VB_W;
    const diagramOffsetX = OVERLAY_W / 2 - (VB_W / 2) * diagramScale;
    const diagramOffsetY = OVERLAY_H / 2 - (VB_H / 2) * diagramScale;
    const mapToOverlay = (x, y) => ({
      x: diagramOffsetX + x * diagramScale,
      y: diagramOffsetY + y * diagramScale,
    });

    const anchorOverlay = mapToOverlay(ANCHOR_X, ANCHOR_Y);
    const sectorOverlay = mapToOverlay(sectorMidX, sectorMidY);
    const directionStartOverlay = mapToOverlay(directionStartX, directionStartY);
    const angleBoxTarget = { x: 308, y: 158 };
    const centreBoxTarget = { x: 302, y: 372 };
    const directionBoxTarget = { x: 692, y: 158 };

    const connectors = {
      angle: buildConnectorArrow(
        sectorOverlay.x,
        sectorOverlay.y,
        angleBoxTarget.x,
        angleBoxTarget.y,
        -55,
        18,
        BOX_BORDER_ANGLE,
        24,
        11
      ),
      centre: buildConnectorArrow(
        anchorOverlay.x,
        anchorOverlay.y,
        centreBoxTarget.x,
        centreBoxTarget.y,
        -45,
        -35,
        BOX_BORDER_CENTRE,
        24,
        11
      ),
      direction: buildConnectorArrow(
        directionStartOverlay.x,
        directionStartOverlay.y,
        directionBoxTarget.x,
        directionBoxTarget.y,
        65,
        8,
        BOX_BORDER_DIRECTION,
        24,
        11
      ),
    };

    const isCentreBlinking = stage.centreVisible && !stage.directionBoxVisible;
    const isDirectionGrowing = stage.directionBlinking;
    const isAngleBlinking = stage.angleBlinking;
    const dimCentreBox = stage.directionBoxVisible && !stage.complete;
    const dimDirectionBox = stage.angleBoxVisible && !stage.complete;

    const renderConnectorOverlay = () =>
      React.createElement(
        "svg",
        {
          className: "summary-connectors-svg",
          viewBox: `0 0 ${OVERLAY_W} ${OVERLAY_H}`,
          preserveAspectRatio: "none",
        },
        ["angle", "centre", "direction"].map((key) => {
          const visible =
            (key === "centre" && stage.centreVisible) ||
            (key === "direction" && stage.directionBoxVisible) ||
            (key === "angle" && stage.angleBoxVisible);
          const connector = connectors[key];
          return React.createElement(
            "g",
            {
              key: "connector-" + key,
              style: makeFadeStyle(visible, key === "centre" ? BOX_FADE_MS : FADE_MS),
            },
            React.createElement("path", {
              d: connector.pathD,
              fill: "none",
              stroke: connector.color,
              strokeWidth: 5.5,
              opacity: 0.55,
              strokeLinecap: "butt",
            }),
            React.createElement("polygon", {
              points: connector.arrowPoints,
              fill: connector.color,
              stroke: connector.color,
              strokeWidth: 0.5,
              strokeLinejoin: "round",
              opacity: 0.85,
            })
          );
        })
      );

    const renderDiagram = () =>
      React.createElement(
        "svg",
        {
          className: "summary-diagram-svg",
          viewBox: `0 0 ${VB_W} ${VB_H}`,
          preserveAspectRatio: "xMidYMid meet",
        },
        React.createElement(
          "g",
          { style: makeFadeStyle(stage.baseVisible, FADE_MS) },
          React.createElement("image", {
            href: "assets/cardboard.png",
            x: CB_LEFT,
            y: CB_TOP,
            width: CB_W,
            height: CB_H,
            opacity: stage.rotatingCloneVisible ? 0.4 : 1,
            transition: `opacity ${FADE_MS}ms ease`,
          })
        ),
        React.createElement(
          "g",
          { style: makeFadeStyle(stage.rotatingCloneVisible, FADE_MS) },
          React.createElement(
            "g",
            { transform: cardboardTransform },
            React.createElement("image", {
              href: "assets/cardboard.png",
              x: CB_LEFT,
              y: CB_TOP,
              width: CB_W,
              height: CB_H,
            })
          )
        ),
        React.createElement(
          "g",
          { style: makeFadeStyle(stage.baseVisible, FADE_MS) },
          React.createElement("line", {
            x1: CB_LEFT - CROSSHAIR_MARGIN,
            y1: ANCHOR_Y,
            x2: CB_LEFT + CB_W + CROSSHAIR_MARGIN,
            y2: ANCHOR_Y,
            stroke: "#9aa3ad",
            strokeWidth: 1.2,
            strokeDasharray: "4 3",
            opacity: 0.65,
          }),
          React.createElement("line", {
            x1: ANCHOR_X,
            y1: CB_TOP - CROSSHAIR_MARGIN,
            x2: ANCHOR_X,
            y2: CB_TOP + CB_H + CROSSHAIR_MARGIN,
            stroke: "#9aa3ad",
            strokeWidth: 1.2,
            strokeDasharray: "4 3",
            opacity: 0.65,
          }),
          React.createElement("line", {
            x1: ANCHOR_X,
            y1: ANCHOR_Y,
            x2: redInitial.x,
            y2: redInitial.y,
            stroke: "#ffffff",
            strokeWidth: 2,
            strokeDasharray: "6 4",
            strokeLinecap: "round",
          }),
          React.createElement("circle", {
            cx: redInitial.x,
            cy: redInitial.y,
            r: 6,
            fill: "#e53935",
            stroke: "#ffffff",
            strokeWidth: 2,
          }),
          React.createElement("circle", {
            cx: ANCHOR_X,
            cy: ANCHOR_Y,
            r: 8,
            className: isCentreBlinking ? "summary-blink-centre" : undefined,
            fill: "#ffd700",
            stroke: "#ffffff",
            strokeWidth: 2,
          })
        ),
        React.createElement(
          "g",
          { style: makeFadeStyle(stage.rotatingCloneVisible, FADE_MS) },
          React.createElement("line", {
            x1: ANCHOR_X,
            y1: ANCHOR_Y,
            x2: getPointWorld(RED_REL_X, RED_REL_Y, cardRotation).x,
            y2: getPointWorld(RED_REL_X, RED_REL_Y, cardRotation).y,
            stroke: "#ffffff",
            strokeWidth: 2,
            strokeDasharray: "6 4",
            strokeLinecap: "round",
          }),
          React.createElement("circle", {
            cx: getPointWorld(RED_REL_X, RED_REL_Y, cardRotation).x,
            cy: getPointWorld(RED_REL_X, RED_REL_Y, cardRotation).y,
            r: 6,
            fill: "#e53935",
            stroke: "#ffffff",
            strokeWidth: 2,
          })
        ),
        React.createElement(
          "g",
          { style: makeFadeStyle(stage.directionArcVisible, FADE_MS) },
          React.createElement(
            "defs",
            null,
            directionArc &&
              React.createElement(
                "mask",
                {
                  id: "summary-direction-grow-mask",
                  maskUnits: "userSpaceOnUse",
                  x: 0,
                  y: 0,
                  width: VB_W,
                  height: VB_H,
                },
                React.createElement("path", {
                  className: "summary-direction-grow-mask-path",
                  d: directionArc.arcPath,
                  pathLength: 1,
                  fill: "none",
                  stroke: "#ffffff",
                  strokeWidth: 24,
                  strokeLinecap: "round",
                })
              )
          ),
          React.createElement("circle", {
            cx: ANCHOR_X,
            cy: ANCHOR_Y,
            r: trackRadius,
            fill: "none",
            stroke: "#8a96a3",
            strokeWidth: 1.5,
            strokeDasharray: "5 4",
            opacity: 0.75,
          }),
          directionArc &&
            React.createElement(
              "g",
              {
                key: "direction-arc",
                className: isDirectionGrowing ? "summary-grow-direction" : undefined,
                mask: isDirectionGrowing ? "url(#summary-direction-grow-mask)" : undefined,
              },
              React.createElement("path", {
                d: directionArc.arcPath,
                fill: "none",
                stroke: "#ffb84c",
                strokeWidth: 4,
                strokeDasharray: "8 6",
                strokeLinecap: "butt",
              }),
              React.createElement("polygon", {
                points: directionArc.arrowPoints,
                fill: "#ffb84c",
                stroke: "#ffb84c",
                strokeWidth: 0.5,
                strokeLinejoin: "round",
              })
            )
        ),
        sectorPath &&
          React.createElement(
            "g",
            {
              className: isAngleBlinking ? "summary-blink-angle" : undefined,
              style: makeFadeStyle(stage.angleVisible, FADE_MS),
            },
            React.createElement("line", {
              x1: ANCHOR_X,
              y1: ANCHOR_Y,
              x2: redRotated.x,
              y2: redRotated.y,
              stroke: "#ffffff",
              strokeWidth: 2,
              strokeDasharray: "6 4",
              strokeLinecap: "round",
            }),
            React.createElement("path", {
              d: sectorPath,
              fill: PURPLE_FILL,
              stroke: PURPLE,
              strokeWidth: 1.5,
            })
          )
      );

    return React.createElement(
      "div",
      { className: "summary-canvas-container" },
      React.createElement(
        "div",
        {
          className: "summary-callout summary-callout-angle",
          style: makeCalloutStyle(stage.angleBoxVisible, false, FADE_MS),
        },
        React.createElement("div", {
          className: "summary-box summary-box-angle",
          dangerouslySetInnerHTML: {
            __html:
              "<div class='summary-box-title'>" +
              data.calloutAngleTitle +
              "</div><div class='summary-box-text'>" +
              data.calloutAngleText +
              "</div>",
          },
        })
      ),
      React.createElement(
        "div",
        {
          className: "summary-callout summary-callout-centre",
          style: makeCalloutStyle(stage.centreVisible, dimCentreBox, BOX_FADE_MS),
        },
        React.createElement("div", {
          className: "summary-box summary-box-centre",
          dangerouslySetInnerHTML: {
            __html:
              "<div class='summary-box-title'>" +
              data.calloutCentreTitle +
              "</div><div class='summary-box-text'>" +
              data.calloutCentreText +
              "</div>",
          },
        })
      ),
      React.createElement(
        "div",
        {
          className: "summary-callout summary-callout-direction",
          style: makeCalloutStyle(stage.directionBoxVisible, dimDirectionBox, FADE_MS),
        },
        React.createElement("div", {
          className: "summary-box summary-box-direction",
          dangerouslySetInnerHTML: {
            __html:
              "<div class='summary-box-title'>" +
              data.calloutDirectionTitle +
              "</div><div class='summary-box-text'>" +
              data.calloutDirectionText +
              "</div>",
          },
        })
      ),
      React.createElement("div", { className: "summary-diagram-wrap" }, renderDiagram()),
      renderConnectorOverlay()
    );
  };
})();
