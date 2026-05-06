const polarToCartesian = (cx, cy, r, angleInDegrees) => {
  var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: cx + (r * Math.cos(angleInRadians)),
    y: cy + (r * Math.sin(angleInRadians))
  };
};

const describeArc = (x, y, radius, startAngle, endAngle) => {
  var start = polarToCartesian(x, y, radius, endAngle);
  var end = polarToCartesian(x, y, radius, startAngle);
  var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  var d = [
      "M", x, y,
      "L", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      "Z"
  ].join(" ");
  return d;
};

const angleData = [
  { id: 1, cx: 305, cy: 170, start: -170.9 + 90, end: -80.5 + 90, r: 35, color: "rgba(156, 39, 176, 0.7)", label: "1", labelR: 45, type: "exterior" },
  { id: 2, cx: 305, cy: 170, start: -80.5 + 90, end: 9.1 + 90, r: 45, color: "rgba(156, 39, 176, 0.5)", label: "2", labelR: 55, type: "exterior" },
  { id: 3, cx: 305, cy: 170, start: 9.1 + 90, end: 99.5 + 90, r: 35, color: "rgba(156, 39, 176, 0.7)", label: "3", labelR: 45, type: "interior" },
  { id: 4, cx: 305, cy: 170, start: 99.5 + 90, end: 189.1 + 90, r: 45, color: "rgba(156, 39, 176, 0.5)", label: "4", labelR: 55, type: "interior" },
  { id: 5, cx: 275, cy: 350, start: -180 + 90, end: -80.5 + 90, r: 35, color: "rgba(156, 39, 176, 0.7)", label: "5", labelR: 45, type: "interior" },
  { id: 6, cx: 275, cy: 350, start: -80.5 + 90, end: 0 + 90, r: 45, color: "rgba(156, 39, 176, 0.5)", label: "6", labelR: 55, type: "interior" },
  { id: 7, cx: 275, cy: 350, start: 0 + 90, end: 99.5 + 90, r: 35, color: "rgba(156, 39, 176, 0.7)", label: "7", labelR: 45, type: "exterior" },
  { id: 8, cx: 275, cy: 350, start: 99.5 + 90, end: 180 + 90, r: 45, color: "rgba(156, 39, 176, 0.5)", label: "8", labelR: 55, type: "exterior" }
];

const MainCanvas = (props) => {
  const { step, onSetNextEnabled, onUpdateTexts, onNext } = props;
  const { useState, useEffect, useRef, useCallback } = React;

  // Refs for animations
  const blueLineRef = useRef(null);
  const yellow1Ref = useRef(null);
  const yellow2Ref = useRef(null);
  const int1OuterRef = useRef(null);
  const int1InnerRef = useRef(null);
  const int2OuterRef = useRef(null);
  const int2InnerRef = useRef(null);
  const whiteCircle1Ref = useRef(null);
  const whiteCircle2Ref = useRef(null);
  const angleGroupRef = useRef(null);
  const tapGifRef = useRef(null);
  const intRegionRef = useRef(null);
  const extRegionTopRef = useRef(null);
  const extRegionBottomRef = useRef(null);
  const actionTriggeredRef = useRef(false);

  // States
  const [elementsVisible, setElementsVisible] = useState({
    blue: false,
    yellow1: false,
    int1: false,
    yellow2: false,
    int2: false,
    blueLabel: false,
  });
  const [anglesVisible, setAnglesVisible] = useState(Array(8).fill(false));
  const [tapGifTarget, setTapGifTarget] = useState(null); // {x, y} or null
  const [visitedInterior, setVisitedInterior] = useState(false);
  const [visitedExterior, setVisitedExterior] = useState(false);
  const [anglesClickable, setAnglesClickable] = useState(false);

  // Helper to play sound safely
  const playSnd = (snd) => {
    if (typeof playSound === "function") playSound(snd);
  };

  // Set initial visibility based on step when component mounts/updates
  useEffect(() => {
    actionTriggeredRef.current = false;
    setAnglesVisible(Array(8).fill(false));
    let vis = { ...elementsVisible };
    if (step >= 1) vis.blue = true;
    if (step >= 2) { vis.yellow1 = true; vis.int1 = true; }
    if (step >= 4) { vis.yellow1 = true; vis.int1 = true; }
    if (step >= 5) { vis.yellow2 = true; vis.int2 = true; }
    if (step === 8) { vis.blueLabel = false; }
    
    if (step === 'i1' || step === 'i2' || step === 'i3' || step === 'e1' || step === 'e2' || step === 'e3' || step === 'ie4') {
      vis.yellow1 = true; vis.int1 = true; vis.yellow2 = true; vis.int2 = true;
      vis.blue = true;
      setAnglesVisible(Array(8).fill(true));
    }
    
    setElementsVisible(vis);

    // Initial animations
    if (step === 1 && !vis.yellow1) {
      gsap.fromTo(blueLineRef.current, { x: -600, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: "power2.out" });
    }

    // Tap GIF logic
    clearTimeout(window.tapTimeout);
    setTapGifTarget(null);
    window.tapTimeout = setTimeout(() => {
      showTapGifForStep(step);
    }, 500);

    // Update nav for i3/e3 if both visited
    if (step === 'i3' && visitedExterior) {
      setTimeout(() => {
        onSetNextEnabled(true);
        onUpdateTexts(APP_DATA.steps.i3.navNext);
      }, 0);
    }
    if (step === 'e3' && visitedInterior) {
      setTimeout(() => {
        onSetNextEnabled(true);
        onUpdateTexts(APP_DATA.steps.e3.navNext);
      }, 0);
    }

  }, [step]);

  const showTapGifForStep = (s) => {
    // Determine position based on step
    if (s === 1) setTapGifTarget({ x: 290, y: 250 }); // Blue line
    if (s === 2) setTapGifTarget({ x: 'text', textClass: 'single-point' });
    if (s === 3) setTapGifTarget({ x: 'text', textClass: 'intersecting-lines' });
    if (s === 4) setTapGifTarget({ x: 290, y: 250 }); // Blue line
    if (s === 5) setTapGifTarget({ x: 'text', textClass: 'two-or-more-lines' });
    if (s === 6) setTapGifTarget({ x: 'text', textClass: 'different-points' });
    if (s === 7) setTapGifTarget({ x: 'text', textClass: 'transversal-highlight' });
    if (s === 8 && !anglesClickable) setTapGifTarget({ x: 'text', textClass: 'eight-angles' });

    if (s === 'i1') setTapGifTarget({ x: 'text', textClass: 'between-two-lines' });
    if (s === 'i2') setTapGifTarget({ x: 'text', textClass: 'interior-angles' });
    if (s === 'i3' && !visitedExterior) {
      setTapGifTarget([
         polarToCartesian(angleData[1].cx, angleData[1].cy, angleData[1].labelR, angleData[1].start + (angleData[1].end - angleData[1].start)/2),
         polarToCartesian(angleData[6].cx, angleData[6].cy, angleData[6].labelR, angleData[6].start + (angleData[6].end - angleData[6].start)/2)
      ]);
    }
    
    if (s === 'e1') setTapGifTarget({ x: 'text', textClass: 'outside-two-lines' });
    if (s === 'e2') setTapGifTarget({ x: 'text', textClass: 'exterior-angles' });
    if (s === 'e3' && !visitedInterior) {
      setTapGifTarget([
         polarToCartesian(angleData[2].cx, angleData[2].cy, angleData[2].labelR, angleData[2].start + (angleData[2].end - angleData[2].start)/2),
         polarToCartesian(angleData[5].cx, angleData[5].cy, angleData[5].labelR, angleData[5].start + (angleData[5].end - angleData[5].start)/2)
      ]);
    }
  };

  const getTapGifStyles = () => {
    if (!tapGifTarget) return [];
    const targets = Array.isArray(tapGifTarget) ? tapGifTarget : [tapGifTarget];
    
    return targets.map((target) => {
      if (target.x === 'text') {
        const el = document.querySelector(`.${target.textClass}`);
        if (!el) return { display: 'none' };
        const rect = el.getBoundingClientRect();
        const parentRect = document.querySelector('.main-canvas-container').getBoundingClientRect();
        return {
          left: rect.left - parentRect.left + rect.width / 2,
          top: rect.top - parentRect.top + rect.height / 2,
          position: 'absolute',
          display: 'block',
          pointerEvents: 'none'
        };
      }
      // SVG coordinate space mapping (approximate)
      const svgEl = document.querySelector('.grid-svg');
      if (!svgEl) return { display: 'none' };
      const rect = svgEl.getBoundingClientRect();
      const parentRect = document.querySelector('.main-canvas-container').getBoundingClientRect();
      const scaleX = rect.width / 600;
      const scaleY = rect.height / 500;
      
      return {
        left: rect.left - parentRect.left + target.x * scaleX,
        top: rect.top - parentRect.top + target.y * scaleY,
        position: 'absolute',
        display: 'block',
        pointerEvents: 'none'
      };
    });
  };

  const hideTapGif = () => {
    setTapGifTarget(null);
    clearTimeout(window.tapTimeout);
  };

  const handleAngleClick = (ang) => {
    if (step === 8 && anglesClickable) {
      hideTapGif();
      playSnd("click");
      setAnglesClickable(false);
      if (ang.type === 'interior') {
        setVisitedInterior(true);
        onNext('i1');
      } else {
        setVisitedExterior(true);
        onNext('e1');
      }
    } else if (step === 'i3') {
      if (ang.type === 'exterior') {
        hideTapGif();
        playSnd("click");
        setVisitedExterior(true);
        onNext('e1');
      }
    } else if (step === 'e3') {
      if (ang.type === 'interior') {
        hideTapGif();
        playSnd("click");
        setVisitedInterior(true);
        onNext('i1');
      }
    }
  };

  // Interactions
  const handleBlueLineClick = () => {
    if (actionTriggeredRef.current) return;
    if (step === 1 && !elementsVisible.yellow1) {
      actionTriggeredRef.current = true;
      hideTapGif();
      playSnd("click");
      setElementsVisible(v => ({ ...v, yellow1: true }));
      gsap.fromTo(yellow1Ref.current, { x: -600, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: "power2.out", onComplete: () => {
        setElementsVisible(v => ({ ...v, int1: true }));
        gsap.fromTo(int1OuterRef.current, { attr: { r: 0 }, opacity: 0 }, { attr: { r: 10 }, opacity: 1, duration: 0.5, ease: "back.out(1.7)" });
        gsap.fromTo(int1InnerRef.current, { attr: { r: 0 }, opacity: 0 }, { attr: { r: 4 }, opacity: 1, duration: 0.5, ease: "back.out(1.7)", onComplete: onNext });
      }});
    } else if (step === 4 && !elementsVisible.yellow2) {
      actionTriggeredRef.current = true;
      hideTapGif();
      playSnd("click");
      setElementsVisible(v => ({ ...v, yellow2: true }));
      gsap.fromTo(yellow2Ref.current, { x: -600, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: "power2.out", onComplete: () => {
        setElementsVisible(v => ({ ...v, int2: true }));
        gsap.fromTo(int2OuterRef.current, { attr: { r: 0 }, opacity: 0 }, { attr: { r: 10 }, opacity: 1, duration: 0.5, ease: "back.out(1.7)" });
        gsap.fromTo(int2InnerRef.current, { attr: { r: 0 }, opacity: 0 }, { attr: { r: 4 }, opacity: 1, duration: 0.5, ease: "back.out(1.7)", onComplete: onNext });
      }});
    }
  };

  const handleRightColumnClick = (e) => {
    if (!e.target.classList.contains("active")) return;
    if (actionTriggeredRef.current) return;
    
    if (e.target.classList.contains("single-point") && step === 2) {
      actionTriggeredRef.current = true;
      hideTapGif();
      playSnd("click");
      gsap.fromTo(whiteCircle1Ref.current, { opacity: 0 }, { opacity: 0.5, duration: 0.25, yoyo: true, repeat: 9, onComplete: onNext });
    }
    else if (e.target.classList.contains("intersecting-lines") && step === 3) {
      actionTriggeredRef.current = true;
      hideTapGif();
      playSnd("click");
      gsap.to([blueLineRef.current, yellow1Ref.current], { opacity: 0.3, duration: 0.25, yoyo: true, repeat: 9, onComplete: onNext });
    }
    else if (e.target.classList.contains("two-or-more-lines") && step === 5) {
      actionTriggeredRef.current = true;
      hideTapGif();
      playSnd("click");
      gsap.to(blueLineRef.current, { opacity: 0.3, duration: 0.2, yoyo: true, repeat: 3, onComplete: () => {
        gsap.to([yellow1Ref.current, yellow2Ref.current], { opacity: 0.3, duration: 0.225, yoyo: true, repeat: 7, onComplete: onNext });
      }});
    }
    else if (e.target.classList.contains("different-points") && step === 6) {
      actionTriggeredRef.current = true;
      hideTapGif();
      playSnd("click");
      gsap.fromTo([whiteCircle1Ref.current, whiteCircle2Ref.current], { opacity: 0 }, { opacity: 0.5, duration: 0.25, yoyo: true, repeat: 9, onComplete: onNext });
    }
    else if (e.target.classList.contains("transversal-highlight") && step === 7) {
      actionTriggeredRef.current = true;
      hideTapGif();
      playSnd("click");
      gsap.to(blueLineRef.current, { opacity: 0.3, duration: 0.2, yoyo: true, repeat: 9, onComplete: () => {
        setElementsVisible(v => ({ ...v, blueLabel: true }));
        onUpdateTexts(APP_DATA.steps[7].navNext);
        onSetNextEnabled(true);
      }});
    }
    else if (e.target.classList.contains("eight-angles") && step === 8) {
      actionTriggeredRef.current = true;
      hideTapGif();
      playSnd("click");
      // Animate 8 angles sequentially
      let tl = gsap.timeline({ onComplete: () => {
        onUpdateTexts(APP_DATA.steps[8].navNext);
        setAnglesClickable(true);
        const ang3 = angleData[2];
        const ang7 = angleData[6];
        setTapGifTarget([
           polarToCartesian(ang3.cx, ang3.cy, ang3.labelR, ang3.start + (ang3.end - ang3.start)/2),
           polarToCartesian(ang7.cx, ang7.cy, ang7.labelR, ang7.start + (ang7.end - ang7.start)/2)
        ]);
      }});
      for (let i = 0; i < 8; i++) {
        tl.call(() => {
          setAnglesVisible(prev => {
            let newArr = [...prev];
            newArr[i] = true;
            return newArr;
          });
          playSnd("tick");
        }, null, i * 0.4);
      }
    }
    else if (e.target.classList.contains("between-two-lines") && step === 'i1') {
      actionTriggeredRef.current = true;
      hideTapGif();
      playSnd("click");
      gsap.fromTo(intRegionRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, yoyo: true, repeat: 8, onComplete: () => {
         onNext('i2');
      }});
    }
    else if (e.target.classList.contains("interior-angles") && step === 'i2') {
      actionTriggeredRef.current = true;
      hideTapGif();
      playSnd("click");
      gsap.to('.angle-interior', { opacity: 0.3, duration: 0.3, yoyo: true, repeat: 9, onComplete: () => {
         onNext('i3');
      }});
    }
    else if (e.target.classList.contains("outside-two-lines") && step === 'e1') {
      actionTriggeredRef.current = true;
      hideTapGif();
      playSnd("click");
      gsap.fromTo([extRegionTopRef.current, extRegionBottomRef.current], { opacity: 0 }, { opacity: 1, duration: 0.3, yoyo: true, repeat: 8, onComplete: () => {
         onNext('e2');
      }});
    }
    else if (e.target.classList.contains("exterior-angles") && step === 'e2') {
      actionTriggeredRef.current = true;
      hideTapGif();
      playSnd("click");
      gsap.to('.angle-exterior', { opacity: 0.3, duration: 0.3, yoyo: true, repeat: 9, onComplete: () => {
         onNext('e3');
      }});
    }
  };



  return React.createElement(
    "div",
    { className: "main-canvas-container" },
    getTapGifStyles().map((style, i) => React.createElement("img", {
      key: `tap-gif-${i}`,
      src: "assets/tap.gif",
      className: "tap-gif",
      style: style
    })),
    React.createElement(
      "div",
      { className: "left-column" },
      React.createElement(
        "svg",
        { className: "grid-svg", viewBox: "0 0 600 500" },
        React.createElement(
          "defs",
          null,
          React.createElement(
            "marker",
            { id: "arrow-blue-start", viewBox: "0 0 10 10", refX: "5", refY: "5", markerWidth: "5", markerHeight: "5", orient: "auto-start-reverse" },
            React.createElement("path", { d: "M 0 0 L 10 5 L 0 10 z", fill: "#00b0ff" })
          ),
          React.createElement(
            "marker",
            { id: "arrow-blue-end", viewBox: "0 0 10 10", refX: "5", refY: "5", markerWidth: "5", markerHeight: "5", orient: "auto" },
            React.createElement("path", { d: "M 0 0 L 10 5 L 0 10 z", fill: "#00b0ff" })
          ),
          React.createElement(
            "marker",
            { id: "arrow-yellow-start", viewBox: "0 0 10 10", refX: "5", refY: "5", markerWidth: "5", markerHeight: "5", orient: "auto-start-reverse" },
            React.createElement("path", { d: "M 0 0 L 10 5 L 0 10 z", fill: "#ffc107" })
          ),
          React.createElement(
            "marker",
            { id: "arrow-yellow-end", viewBox: "0 0 10 10", refX: "5", refY: "5", markerWidth: "5", markerHeight: "5", orient: "auto" },
            React.createElement("path", { d: "M 0 0 L 10 5 L 0 10 z", fill: "#ffc107" })
          )
        ),
        
        // Regions
        React.createElement("polygon", {
          ref: intRegionRef,
          points: "0,121.2 600,217.2 600,350 0,350",
          fill: "rgba(255, 235, 59, 0.3)",
          style: { opacity: (step === 'i2' || step === 'i3' || step === 'ie4') ? 1 : 0 }
        }),
        React.createElement("polygon", {
          ref: extRegionTopRef,
          points: "0,0 600,0 600,217.2 0,121.2",
          fill: "rgba(3, 169, 244, 0.3)",
          style: { opacity: (step === 'e2' || step === 'e3' || step === 'ie4') ? 1 : 0 }
        }),
        React.createElement("polygon", {
          ref: extRegionBottomRef,
          points: "0,350 600,350 600,500 0,500",
          fill: "rgba(3, 169, 244, 0.3)",
          style: { opacity: (step === 'e2' || step === 'e3' || step === 'ie4') ? 1 : 0 }
        }),

        // Angles
        React.createElement("g", { ref: angleGroupRef }, 
          angleData.map((ang, idx) => {
            if (!anglesVisible[idx]) return null;
            
            let isI = step === 'i1' || step === 'i2' || step === 'i3';
            let isE = step === 'e1' || step === 'e2' || step === 'e3';
            let isIE4 = step === 'ie4';
            
            let pathColor = ang.color;
            if (isI || isE || isIE4) {
              if (ang.type === 'interior') {
                pathColor = (ang.id % 2 === 0) ? "rgba(255, 140, 0, 0.8)" : "rgba(255, 193, 7, 0.8)";
              } else {
                pathColor = (ang.id % 2 === 0) ? "rgba(2, 119, 189, 0.8)" : "rgba(3, 169, 244, 0.8)";
              }
            }

            let groupOpacity = 1;
            if (isI && ang.type === 'exterior') groupOpacity = 0.45;
            if (isE && ang.type === 'interior') groupOpacity = 0.45;

            let showLabel = (typeof step === 'number' && step <= 8) || isIE4;

            const isClickable = (step === 8 && anglesClickable) 
                               || (step === 'i3' && !visitedExterior && ang.type === 'exterior') 
                               || (step === 'e3' && !visitedInterior && ang.type === 'interior');

            const appearClass = typeof step === 'number' ? 'angle-appear' : '';

            return React.createElement(
              "g", { 
                key: `angle-${ang.id}`, 
                className: `${appearClass} angle-${ang.type} ${isClickable ? 'angle-clickable' : ''}`,
                style: { opacity: groupOpacity },
                onClick: () => isClickable && handleAngleClick(ang)
              },
              React.createElement("path", {
                d: describeArc(ang.cx, ang.cy, ang.r, ang.start, ang.end),
                fill: pathColor,
                style: { transition: "fill 0.3s" }
              }),
              showLabel && React.createElement("text", {
                x: polarToCartesian(ang.cx, ang.cy, ang.labelR, ang.start + (ang.end - ang.start)/2).x,
                y: polarToCartesian(ang.cx, ang.cy, ang.labelR, ang.start + (ang.end - ang.start)/2).y + 6,
                fill: "#ff80ab",
                fontSize: "18",
                fontWeight: "bold",
                textAnchor: "middle"
              }, ang.label)
            );
          })
        ),

        // Lines
        React.createElement("g", {
          ref: blueLineRef,
          className: ((step === 1 && !elementsVisible.yellow1) || (step === 4 && !elementsVisible.yellow2)) ? "line-clickable-group" : "",
          onClick: handleBlueLineClick,
          opacity: elementsVisible.blue ? "1" : "0"
        },
          React.createElement("line", {
            x1: "325", y1: "50", x2: "260", y2: "440",
            stroke: "transparent", strokeWidth: "30"
          }),
          React.createElement("line", {
            x1: "325", y1: "50", x2: "260", y2: "440",
            stroke: "#00b0ff", strokeWidth: "3",
            markerStart: "url(#arrow-blue-start)", markerEnd: "url(#arrow-blue-end)"
          })
        ),
        React.createElement("line", {
          ref: yellow1Ref,
          x1: "55", y1: "130", x2: "555", y2: "210",
          stroke: "#ffc107", strokeWidth: "3",
          markerStart: "url(#arrow-yellow-start)", markerEnd: "url(#arrow-yellow-end)",
          opacity: elementsVisible.yellow1 ? "1" : "0"
        }),
        React.createElement("line", {
          ref: yellow2Ref,
          x1: "25", y1: "350", x2: "525", y2: "350",
          stroke: "#ffc107", strokeWidth: "3",
          markerStart: "url(#arrow-yellow-start)", markerEnd: "url(#arrow-yellow-end)",
          opacity: elementsVisible.yellow2 ? "1" : "0"
        }),

        // Highlights (White Circles)
        React.createElement("circle", {
          ref: whiteCircle1Ref,
          cx: "305", cy: "170", r: "30",
          fill: "white", opacity: "0", pointerEvents: "none"
        }),
        React.createElement("circle", {
          ref: whiteCircle2Ref,
          cx: "275", cy: "350", r: "30",
          fill: "white", opacity: "0", pointerEvents: "none"
        }),

        // Intersection Points
        React.createElement("g", { opacity: elementsVisible.int1 ? "1" : "0" },
          React.createElement("circle", { ref: int1OuterRef, cx: "305", cy: "170", r: "10", fill: "#e91e63" }),
          React.createElement("circle", { ref: int1InnerRef, cx: "305", cy: "170", r: "4", fill: "white" })
        ),
        React.createElement("g", { opacity: elementsVisible.int2 ? "1" : "0" },
          React.createElement("circle", { ref: int2OuterRef, cx: "275", cy: "350", r: "10", fill: "#e91e63" }),
          React.createElement("circle", { ref: int2InnerRef, cx: "275", cy: "350", r: "4", fill: "white" })
        ),

        // Transversal Label
        elementsVisible.blueLabel && React.createElement(
          "text",
          {
            x: "275", y: "245",
            fill: "white",
            fontSize: "20",
            transform: "rotate(-80.5, 275, 245)",
            textAnchor: "middle",
            className: "angle-appear"
          },
          APP_DATA.labels.transversal
        ),

        // Interior/Exterior Region Texts
        (step === 'i3' || step === 'ie4') && React.createElement("text", {
          x: "20", y: "235", fill: "#ffc107", fontSize: "16", className: "angle-appear"
        }, APP_DATA.labels.interiorAngles),
        
        (step === 'e3' || step === 'ie4') && React.createElement("g", { className: "angle-appear" },
          React.createElement("text", { x: "20", y: "70", fill: "#03a9f4", fontSize: "16" }, APP_DATA.labels.exteriorAngles),
          React.createElement("text", { x: "20", y: "450", fill: "#03a9f4", fontSize: "16" }, APP_DATA.labels.exteriorAngles)
        )
      )
    ),
    React.createElement(
      "div",
      { className: "right-column", onClick: handleRightColumnClick },
      APP_DATA.steps[step]?.rightText && React.createElement("div", {
        className: "right-text",
        dangerouslySetInnerHTML: { __html: APP_DATA.steps[step].rightText }
      })
    )
  );
};
