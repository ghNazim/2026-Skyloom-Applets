/**
 * MachineVisual – renders the capsule-machine Lottie animation.
 *
 * Props:
 *   tubeColors        : [c1,c2,c3,c4]  colour names (keys of MACHINE_COLOR_MAP)
 *   serveSequence     : [c,c,c, …]     10 colour names for each serve ball
 *   autoFill          : bool            run fill (scene 1) as soon as mounted / colours change
 *   triggerServe      : number          bump this to start the 10-serve sequence
 *   onServeStep       : fn(index)       called after each serve completes (0-based)
 *   onServesDone      : fn()            called when all 10 serves finish
 *   machineRef        : React ref       forwarded to the container div (for cloning / positioning)
 */

var MACHINE_COLOR_MAP = {
  red: "#F42330",
  blue: "#39C9FA",
  green: "#8CEF67",
  yellow: "#FFE631",
  purple: "#B93EE5",
  orange: "#FA6B18",
  pink: "#FE3A67",
};

function mcParseHex(hex) {
  var m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  return m
    ? [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255, 1]
    : [1, 1, 1, 1];
}

function mcGetScenes(data) {
  var markers = (data && data.markers) ? data.markers.slice() : [];
  var scenes = [];
  for (var i = 0; i < markers.length - 1; i++) {
    scenes.push({
      startFrame: typeof markers[i].tm === "number" ? markers[i].tm : 0,
      endFrame:   typeof markers[i + 1].tm === "number" ? markers[i + 1].tm : 0,
    });
  }
  return scenes;
}

function mcAnalyseEffects(data) {
  var layers = data && data.layers;
  if (!Array.isArray(layers)) return [];
  var li = -1;
  for (var i = 0; i < layers.length; i++) {
    if (layers[i].nm === "Machine") { li = i; break; }
  }
  if (li === -1) return [];
  var ef = layers[li].ef;
  if (!Array.isArray(ef)) return [];
  var out = [];
  for (var j = 0; j < ef.length; j++) {
    var sub = ef[j].ef;
    if (!Array.isArray(sub) || !sub[0]) continue;
    var ty = sub[0].ty;
    if (ty === 0 || ty === 2) {
      out.push({ name: (ef[j].nm || "").toLowerCase(), path: [li, j], ty: ty });
    }
  }
  return out;
}

function mcSetEffect(data, path, value) {
  var layer = data.layers[path[0]];
  if (!layer || !layer.ef) return;
  var prop = layer.ef[path[1]].ef[0];
  if (!prop) return;
  if (prop.ty === 0) {
    prop.v = { a: 0, k: typeof value === "number" ? value : Number(value), ix: prop.ix };
  } else if (prop.ty === 2) {
    var k = Array.isArray(value) ? value.slice(0, 4) : [1, 1, 1, 1];
    if (k.length === 3) k.push(1);
    prop.v = { a: 0, k: k, ix: prop.ix };
  }
}

function mcApplyColors(data, tubeColors) {
  var ctrls = mcAnalyseEffects(data);
  ctrls.forEach(function (c) {
    if (c.name === "step") mcSetEffect(data, c.path, 20);
    else if (c.name === "color1" && tubeColors[0])
      mcSetEffect(data, c.path, mcParseHex(MACHINE_COLOR_MAP[tubeColors[0]] || tubeColors[0]));
    else if (c.name === "color2" && tubeColors[1])
      mcSetEffect(data, c.path, mcParseHex(MACHINE_COLOR_MAP[tubeColors[1]] || tubeColors[1]));
    else if (c.name === "color3" && tubeColors[2])
      mcSetEffect(data, c.path, mcParseHex(MACHINE_COLOR_MAP[tubeColors[2]] || tubeColors[2]));
    else if (c.name === "color4" && tubeColors[3])
      mcSetEffect(data, c.path, mcParseHex(MACHINE_COLOR_MAP[tubeColors[3]] || tubeColors[3]));
  });
}

var MachineVisual = function (props) {
  var useRef = React.useRef;
  var useEffect = React.useEffect;
  var useState = React.useState;

  var tubeColors = props.tubeColors || ["red", "yellow", "blue", "pink"];
  var serveSequence = props.serveSequence || [];
  var autoFill = props.autoFill !== false;
  var triggerServe = props.triggerServe || 0;
  var onServeStep = props.onServeStep;
  var onServesDone = props.onServesDone;
  var machineRef = props.machineRef;

  var containerRef = useRef(null);
  var animRef = useRef(null);
  var servingRef = useRef(false);
  var enterFrameRef = useRef(null);
  var intervalRef = useRef(null);

  var colorKey = tubeColors.join(",");

  var CROP_VIEWBOX = "600 180 700 780";

  function cropSvg() {
    var el = containerRef.current;
    if (!el) return;
    var svg = el.querySelector("svg");
    if (svg) {
      svg.setAttribute("viewBox", CROP_VIEWBOX);
      svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    }
  }

  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function cleanup() {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    if (animRef.current) {
      if (enterFrameRef.current) {
        animRef.current.removeEventListener("enterFrame", enterFrameRef.current);
        enterFrameRef.current = null;
      }
      animRef.current.destroy();
      animRef.current = null;
    }
    servingRef.current = false;
  }

  function loadAnim(tubeColorsArr, cb) {
    cleanup();
    var el = containerRef.current;
    if (!el) return;
    el.innerHTML = "";
    var data = deepClone(animationData);
    mcApplyColors(data, tubeColorsArr);
    var inst = lottie.loadAnimation({
      container: el,
      renderer: "svg",
      loop: false,
      autoplay: false,
      animationData: data,
    });
    animRef.current = inst;
    inst.__animData = data;
    if (cb) {
      if (inst.isLoaded) { cropSvg(); cb(inst, data); }
      else inst.addEventListener("DOMLoaded", function () { cropSvg(); cb(inst, data); });
    } else {
      if (inst.isLoaded) cropSvg();
      else inst.addEventListener("DOMLoaded", cropSvg);
    }
    return inst;
  }

  function playSceneOnce(inst, scene, onDone) {
    if (!inst || !inst.isLoaded) { if (onDone) onDone(); return; }
    if (inst.isPlaying) inst.stop();
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    if (enterFrameRef.current) {
      inst.removeEventListener("enterFrame", enterFrameRef.current);
      enterFrameRef.current = null;
    }
    inst.setLoop(false);
    var done = false;
    var handler = function () {
      if (done) return;
      var f = Math.round(inst.currentFrame);
      if (f >= Math.round(scene.endFrame)) {
        done = true;
        inst.stop();
        inst.goToAndStop(scene.endFrame, true);
        if (enterFrameRef.current) {
          inst.removeEventListener("enterFrame", enterFrameRef.current);
          enterFrameRef.current = null;
        }
        if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
        if (onDone) onDone();
      }
    };
    enterFrameRef.current = handler;
    inst.addEventListener("enterFrame", handler);
    inst.goToAndStop(scene.startFrame, true);
    setTimeout(function () {
      if (!inst.isLoaded || done) return;
      inst.goToAndStop(scene.startFrame, true);
      inst.play();
    }, 50);
    intervalRef.current = setInterval(function () {
      if (!inst || !inst.isLoaded || done) {
        if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
        return;
      }
      handler();
    }, 30);
  }

  // Fill: load animation with colours and play scene 1 (index 0)
  useEffect(function () {
    if (!autoFill) return;
    loadAnim(tubeColors, function (inst, data) {
      var scenes = mcGetScenes(data);
      if (scenes[0]) playSceneOnce(inst, scenes[0]);
    });
    return cleanup;
  }, [colorKey, autoFill]);

  // Serve: when triggerServe bumps, run 10-serve sequence
  useEffect(function () {
    if (!triggerServe) return;
    servingRef.current = true;
    var count = 0;
    var maxCount = serveSequence.length || 10;

    function serveNext() {
      if (count >= maxCount || !servingRef.current) {
        servingRef.current = false;
        if (onServesDone) onServesDone();
        return;
      }
      var colorHex = MACHINE_COLOR_MAP[serveSequence[count]] || "#FFFFFF";
      var prevHex = count > 0
        ? (MACHINE_COLOR_MAP[serveSequence[count - 1]] || "#FFFFFF")
        : colorHex;

      var data = deepClone(animationData);
      mcApplyColors(data, tubeColors);
      var ctrls = mcAnalyseEffects(data);
      ctrls.forEach(function (c) {
        if (c.name === "drop new") mcSetEffect(data, c.path, mcParseHex(colorHex));
        if (c.name === "drop old") mcSetEffect(data, c.path, mcParseHex(prevHex));
      });

      var el = containerRef.current;
      if (!el) return;
      if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
      if (animRef.current) {
        if (enterFrameRef.current) {
          animRef.current.removeEventListener("enterFrame", enterFrameRef.current);
          enterFrameRef.current = null;
        }
        animRef.current.destroy();
        animRef.current = null;
      }
      el.innerHTML = "";

      var inst = lottie.loadAnimation({
        container: el,
        renderer: "svg",
        loop: false,
        autoplay: false,
        animationData: data,
      });
      animRef.current = inst;
      inst.__animData = data;

      function afterLoaded() {
        cropSvg();
        var scenes = mcGetScenes(data);
        var scene = count === 0 ? scenes[1] : scenes[3];
        if (!scene) { servingRef.current = false; return; }
        playSceneOnce(inst, scene, function () {
          var idx = count;
          count++;
          if (onServeStep) onServeStep(idx);
          setTimeout(serveNext, 400);
        });
      }
      if (inst.isLoaded) afterLoaded();
      else inst.addEventListener("DOMLoaded", afterLoaded);
    }

    serveNext();
    return function () { servingRef.current = false; };
  }, [triggerServe]);

  return React.createElement("div", {
    ref: function (el) {
      containerRef.current = el;
      if (machineRef) machineRef.current = el;
    },
    className: "machine-visual",
  });
};
