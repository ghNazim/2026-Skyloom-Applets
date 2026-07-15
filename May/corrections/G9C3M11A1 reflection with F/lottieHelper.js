function getSortedMarkerFrames(animationData) {
  return animationData.markers
    .map(function (marker) {
      return marker.tm;
    })
    .sort(function (a, b) {
      return a - b;
    });
}

function createLottieController(anim, animationData) {
  const markerFrames = getSortedMarkerFrames(animationData);
  let currentMarkerIndex = 0;
  let isAnimating = false;
  let frameId = null;

  function stopAtFrame(frame) {
    anim.goToAndStop(Math.round(frame), true);
  }

  function goToMarker(markerIndex) {
    if (markerIndex < 0 || markerIndex >= markerFrames.length) return;
    currentMarkerIndex = markerIndex;
    stopAtFrame(markerFrames[markerIndex]);
  }

  function cancelAnimation() {
    if (frameId) {
      cancelAnimationFrame(frameId);
      frameId = null;
    }
    isAnimating = false;
  }

  function playToMarker(targetMarkerIndex, onComplete) {
    if (
      isAnimating ||
      targetMarkerIndex < 0 ||
      targetMarkerIndex >= markerFrames.length
    ) {
      return false;
    }

    const startIndex = targetMarkerIndex > 0 ? targetMarkerIndex - 1 : 0;
    const fromFrame = markerFrames[startIndex];
    const toFrame = markerFrames[targetMarkerIndex];
    const distance = Math.abs(toFrame - fromFrame);

    if (distance === 0) {
      currentMarkerIndex = targetMarkerIndex;
      stopAtFrame(toFrame);
      if (typeof onComplete === "function") onComplete();
      return true;
    }

    isAnimating = true;
    stopAtFrame(fromFrame);

    const startedAt = performance.now();
    const duration = (distance / animationData.fr) * 1000;

    function tick(now) {
      const progress = Math.min((now - startedAt) / duration, 1);
      const frame = fromFrame + (toFrame - fromFrame) * progress;
      stopAtFrame(frame);

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
        return;
      }

      frameId = null;
      currentMarkerIndex = targetMarkerIndex;
      stopAtFrame(toFrame);
      isAnimating = false;
      if (typeof onComplete === "function") onComplete();
    }

    frameId = requestAnimationFrame(tick);
    return true;
  }

  function playMarkersSequentially(markerIndices, onComplete) {
    if (!markerIndices.length) {
      if (typeof onComplete === "function") onComplete();
      return;
    }

    const [first, ...rest] = markerIndices;
    playToMarker(first, function () {
      if (rest.length) {
        playMarkersSequentially(rest, onComplete);
      } else if (typeof onComplete === "function") {
        onComplete();
      }
    });
  }

  return {
    goToMarker: goToMarker,
    playToMarker: playToMarker,
    playMarkersSequentially: playMarkersSequentially,
    cancelAnimation: cancelAnimation,
    getCurrentMarkerIndex: function () {
      return currentMarkerIndex;
    },
    isAnimating: function () {
      return isAnimating;
    },
  };
}
