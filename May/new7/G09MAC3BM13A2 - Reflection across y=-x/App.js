const App = () => {
  const { useCallback, useEffect, useRef, useState } = React;

  const [screen, setScreen] = useState('welcome');
  const [stepIndex, setStepIndex] = useState(0);
  const [pickedPoint, setPickedPoint] = useState(T.shared.startPoint);
  const [dragPoint, setDragPoint] = useState(T.shared.startPoint);
  const [panelPoint, setPanelPoint] = useState(T.shared.startPoint);
  const [coordinateFlyStage, setCoordinateFlyStage] = useState('idle');
  const [linePoints, setLinePoints] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [buttonPulse, setButtonPulse] = useState(false);
  const [autoLocked, setAutoLocked] = useState(false);
  const [distanceAnim, setDistanceAnim] = useState(null);
  const [fly, setFly] = useState(null);
  const flyPendingRef = useRef(null);
  const completedFlightsRef = useRef(new Set());
  const flightTimerRef = useRef(null);
  const distanceTimerRef = useRef(null);
  const step = T.steps[stepIndex];
  const settledCoordinateTokens = ['pre-x', 'pre-y', 'image-x', 'image-y'];

  const coordinateTokensForStage = (stage) => {
    if (Array.isArray(stage)) return stage;
    if (stage === 'pre-x') return ['pre-x'];
    if (stage === 'preimage') return ['pre-x', 'pre-y'];
    if (stage === 'image-y') return ['pre-x', 'pre-y', 'image-x'];
    if (stage === 'settled') return settledCoordinateTokens;
    return [];
  };

  const markCoordinateLanded = useCallback((token) => {
    setCoordinateFlyStage((stage) => {
      const tokens = coordinateTokensForStage(stage);
      if (tokens.includes(token)) return tokens;
      return [...tokens, token];
    });
  }, []);

  const sound = (name) => {
    const audio = new Audio(`assets/sfx/${name}.mp3`);
    audio.volume = 0.32;
    audio.play().catch(() => {});
  };

  const move = (fn) => fn();

  const reset = () => {
    setStepIndex(0);
    setPickedPoint(T.shared.startPoint);
    setDragPoint(T.shared.startPoint);
    setPanelPoint(T.shared.startPoint);
    setCoordinateFlyStage('idle');
    setLinePoints([]);
    setFeedback(null);
    setButtonPulse(false);
    setAutoLocked(false);
    setDistanceAnim(null);
    setFly(null);
    flyPendingRef.current = null;
    completedFlightsRef.current = new Set();
    clearTimeout(flightTimerRef.current);
    clearTimeout(distanceTimerRef.current);
  };

  const start = () => {
    sound('click');
    move(() => {
      reset();
      setScreen('lesson');
    });
  };

  const restart = () => {
    sound('click');
    move(() => {
      reset();
      setScreen('welcome');
    });
  };

  const goNext = () => {
    if (autoLocked || step.autoNextMs) return;
    if (step.requires && step.requires !== 'dragPoint') return;
    sound('click');
    move(() => {
      setFeedback(null);
      if (stepIndex >= T.steps.length - 1) {
        setScreen('final');
        return;
      }
      setStepIndex((i) => i + 1);
    });
  };

  const goBack = () => {
    setAutoLocked(false);
    setDistanceAnim(null);
    clearTimeout(distanceTimerRef.current);
    sound('click');
    move(() => {
      setFeedback(null);
      if (screen === 'final') {
        setScreen('lesson');
        setStepIndex(T.steps.length - 1);
        return;
      }
      if (stepIndex === 0) {
        setScreen('welcome');
        return;
      }
      setStepIndex((i) => i - 1);
    });
  };

  const completeStep = (nextState) => {
    sound('correct');
    move(() => {
      setFeedback(null);
      if (nextState) nextState();
      setStepIndex((i) => Math.min(i + 1, T.steps.length - 1));
    });
  };

  const handlePlaneTap = (point) => {
    if (autoLocked) return;
    if (step.requires === 'equalPoint' || step.requires === 'secondEqualPoint') {
      if (!T.shared.isOnReflectionLine(point)) {
        sound('click');
        setFeedback({ type: 'wrong', text: T.ui.wrongEqual, point });
        return;
      }
      completeStep(() => setLinePoints((points) => [...points, { x: point.x, y: point.y }]));
      return;
    }
    if (step.requires === 'anyPoint') {
      completeStep(() => {
        setPickedPoint({ x: point.x, y: point.y });
        setDragPoint({ x: point.x, y: point.y });
        setPanelPoint({ x: point.x, y: point.y });
      });
    }
  };

  const handlePointDrag = (point) => {
    if (autoLocked) return;
    setDragPoint(point);
    if (step.requires === 'dragPoint') {
      clearTimeout(flightTimerRef.current);
      flyPendingRef.current = null;
      setFly(null);
      setPanelPoint(point);
      setCoordinateFlyStage('idle');
      setButtonPulse(true);
    }
  };

  const startFly = useCallback((fromEl, toEl, text, tone, durationMs = 760) => {
    if (!fromEl || !toEl) return false;
    const fromRect = fromEl.getBoundingClientRect();
    const toRect = toEl.getBoundingClientRect();
    if ((!fromRect.width && !fromRect.height) || (!toRect.width && !toRect.height)) return false;
    setFly({ fromRect, toRect, text, tone, durationMs });
    return true;
  }, []);

  const completeFly = useCallback(() => {
    const pending = flyPendingRef.current;
    flyPendingRef.current = null;
    setFly(null);
    if (pending) pending();
  }, []);

  const runPanelUpdateFlight = useCallback((nextPoint) => {
    clearTimeout(flightTimerRef.current);
    setPanelPoint(nextPoint);

    const finish = () => {
      markCoordinateLanded('image-y');
    };

    const flyY = () => {
      flightTimerRef.current = setTimeout(() => {
        const fromEl = document.querySelector('[data-coordinate-source="panel-pre-y"]');
        const toEl = document.querySelector('[data-coordinate-target="panel-image-x"]');
        flyPendingRef.current = () => {
          markCoordinateLanded('image-x');
          flyX();
        };
        if (!startFly(fromEl, toEl, String(nextPoint.y), 'coord-y-tone', 720)) {
          markCoordinateLanded('image-x');
          flyX();
        }
      }, 160);
    };

    const flyX = () => {
      flightTimerRef.current = setTimeout(() => {
        const fromEl = document.querySelector('[data-coordinate-source="panel-pre-x"]');
        const toEl = document.querySelector('[data-coordinate-target="panel-image-y"]');
        flyPendingRef.current = finish;
        if (!startFly(fromEl, toEl, String(nextPoint.x), 'coord-x-tone', 720)) finish();
      }, 160);
    };

    const landPreY = () => {
      flightTimerRef.current = setTimeout(() => {
        const fromEl = document.querySelector('[data-graph-coordinate="active-y"]');
        const toEl = document.querySelector('[data-coordinate-target="panel-pre-y"]');
        flyPendingRef.current = () => {
          markCoordinateLanded('pre-y');
          flyY();
        };
        if (!startFly(fromEl, toEl, String(nextPoint.y), 'coord-y-tone', 760)) {
          markCoordinateLanded('pre-y');
          flyY();
        }
      }, 220);
    };

    const fromEl = document.querySelector('[data-graph-coordinate="active-x"]');
    const toEl = document.querySelector('[data-coordinate-target="panel-pre-x"]');
    setCoordinateFlyStage('idle');
    flyPendingRef.current = () => {
      markCoordinateLanded('pre-x');
      landPreY();
    };
    if (!startFly(fromEl, toEl, String(nextPoint.x), 'coord-x-tone', 760)) {
      markCoordinateLanded('pre-x');
      landPreY();
    }
  }, [markCoordinateLanded, startFly]);

  const runDistanceAnimation = useCallback(() => {
    clearTimeout(distanceTimerRef.current);
    const total = Math.abs(pickedPoint.x + pickedPoint.y) / 2;
    const wholeUnits = Math.max(0, Math.floor(total));
    const steps = [];
    for (let c = 1; c <= wholeUnits; c++) {
      steps.push({ substep: 'count', count: c, ms: 850 });
    }
    if (total > wholeUnits) steps.push({ substep: 'count', count: total, ms: 850 });
    steps.push({ substep: 'count-hold', count: total, ms: 700 });

    let i = 0;
    setAutoLocked(true);
    setDistanceAnim({ substep: 'pending', count: 0 });
    move(() => setStepIndex((idx) => Math.min(idx + 1, T.steps.length - 1)));

    const runNext = () => {
      if (i >= steps.length) {
        setDistanceAnim(null);
        move(() => {
          setAutoLocked(false);
          setStepIndex((idx) => Math.min(idx + 2, T.steps.length - 1));
        });
        return;
      }
      const animStep = steps[i++];
      setDistanceAnim(animStep);
      sound('click');
      distanceTimerRef.current = setTimeout(runNext, animStep.ms);
    };

    distanceTimerRef.current = setTimeout(runNext, 120);
  }, [pickedPoint]);

  const handlePointDragEnd = (point) => {
    if (autoLocked || step.requires !== 'dragPoint') return;
    const nextPoint = { x: point.x, y: point.y };
    setDragPoint(nextPoint);
    setButtonPulse(true);
    runPanelUpdateFlight(nextPoint);
  };

  const handleAction = () => {
    if (autoLocked) return;
    if (step.id === 'perp-drawn') {
      runDistanceAnimation();
      return;
    }
    sound('swoosh');
    move(() => {
      setFeedback(null);
      setStepIndex((i) => Math.min(i + 1, T.steps.length - 1));
    });
  };

  useEffect(() => {
    const hand = document.getElementById('hand-ftue');
    if (!hand) return;
    hand.style.opacity = '0';
    hand.style.pointerEvents = 'none';
    hand.style.display = 'none';
    hand.classList.remove('hand-animating', 'hand-dragging', 'hand-drag-nudge');

    let targets = [];
    if (screen === 'welcome') targets = [...document.querySelectorAll('.start-button')];
    if (screen === 'lesson' && step.button) targets = [...document.querySelectorAll('.reflect-btn')];
    if (screen === 'lesson' && step.ftuePoints) targets = [...document.querySelectorAll('[data-ftue-point]')];
    if (screen === 'lesson' && step.requires === 'dragPoint' && !buttonPulse) targets = [...document.querySelectorAll('[data-ftue-target="active-point"]')].slice(0, 1);
    if (screen === 'lesson' && step.requires && step.requires !== 'dragPoint' && !step.ftuePoints) targets = [...document.querySelectorAll('.reflection-plane')].slice(0, 1);
    if (screen === 'lesson' && !step.button && !step.requires && !step.autoNextMs) {
      targets = [...document.querySelectorAll('.navigation .nav-chevron:last-child:not(:disabled)')];
    }
    targets = targets.filter(Boolean);
    if (!targets.length) return undefined;

    const placeHand = (target) => {
      const rect = target.getBoundingClientRect();
      const isDragHint = target.getAttribute('data-ftue-target') === 'active-point';
      hand.style.left = `${rect.left + rect.width * (isDragHint ? 0.62 : 0.5)}px`;
      hand.style.top = `${rect.top + rect.height * (isDragHint ? 0.46 : 0.5)}px`;
      hand.style.opacity = '0.82';
      hand.style.display = 'block';
      hand.classList.add('hand-animating');
    };

    let targetIndex = 0;
    placeHand(targets[targetIndex]);
    if (screen === 'lesson' && step.requires === 'dragPoint') {
      hand.classList.add('hand-drag-nudge');
      return undefined;
    }
    if (targets.length < 2) return undefined;

    hand.classList.add('hand-dragging');
    const timer = setInterval(() => {
      targetIndex = (targetIndex + 1) % targets.length;
      placeHand(targets[targetIndex]);
    }, 1000);
    return () => clearInterval(timer);
  }, [screen, stepIndex, step?.id, buttonPulse]);

  useEffect(() => {
    if (screen !== 'lesson' || !step.autoNextMs) {
      if (!distanceAnim) setAutoLocked(false);
      return undefined;
    }
    if (fly) return undefined;
    setAutoLocked(true);
    const timer = setTimeout(() => {
      move(() => {
        setAutoLocked(false);
        setStepIndex((i) => Math.min(i + 1, T.steps.length - 1));
      });
    }, step.autoNextMs);
    return () => clearTimeout(timer);
  }, [screen, stepIndex, step?.autoNextMs, fly, distanceAnim]);

  useEffect(() => {
    if (screen !== 'lesson') return undefined;
    if (!['patternA', 'patternYFirst', 'patternXSecond'].includes(step.visual)) return undefined;
    const key = `${step.id}-${panelPoint.x}-${panelPoint.y}`;
    if (completedFlightsRef.current.has(key) || fly) return undefined;
    completedFlightsRef.current.add(key);

    const run = () => {
      if (step.visual === 'patternA') {
        const flyPreY = () => {
          flightTimerRef.current = setTimeout(() => {
            const fromEl = document.querySelector('[data-graph-coordinate="active-y"]');
            const toEl = document.querySelector('[data-coordinate-target="panel-pre-y"]');
            flyPendingRef.current = () => markCoordinateLanded('pre-y');
            if (!startFly(fromEl, toEl, String(panelPoint.y), 'coord-y-tone', 760)) {
              markCoordinateLanded('pre-y');
              flyPendingRef.current = null;
            }
          }, 220);
        };

        const fromEl = document.querySelector('[data-graph-coordinate="active-x"]');
        const toEl = document.querySelector('[data-coordinate-target="panel-pre-x"]');
        setCoordinateFlyStage('idle');
        flyPendingRef.current = () => {
          markCoordinateLanded('pre-x');
          flyPreY();
        };
        if (!startFly(fromEl, toEl, String(panelPoint.x), 'coord-x-tone', 760)) {
          markCoordinateLanded('pre-x');
          flyPreY();
        }
        return;
      }

      if (step.visual === 'patternYFirst') {
        setCoordinateFlyStage(['pre-x', 'pre-y']);
        const fromEl = document.querySelector('[data-coordinate-source="panel-pre-y"]');
        const toEl = document.querySelector('[data-coordinate-target="panel-image-x"]');
        flyPendingRef.current = () => markCoordinateLanded('image-x');
        if (!startFly(fromEl, toEl, String(panelPoint.y), 'coord-y-tone', 720)) {
          markCoordinateLanded('image-x');
          flyPendingRef.current = null;
        }
        return;
      }

      if (step.visual === 'patternXSecond') {
        setCoordinateFlyStage(['pre-x', 'pre-y', 'image-x']);
        const fromEl = document.querySelector('[data-coordinate-source="panel-pre-x"]');
        const toEl = document.querySelector('[data-coordinate-target="panel-image-y"]');
        flyPendingRef.current = () => markCoordinateLanded('image-y');
        if (!startFly(fromEl, toEl, String(panelPoint.x), 'coord-x-tone', 720)) {
          markCoordinateLanded('image-y');
          flyPendingRef.current = null;
        }
      }
    };

    const timer = setTimeout(run, 120);
    return () => clearTimeout(timer);
  }, [screen, step?.id, step?.visual, panelPoint, fly, markCoordinateLanded, startFly]);

  useEffect(() => {
    if (screen !== 'lesson') return undefined;
    if (['patternComplete', 'dragExplore', 'generalXOnly', 'generalComplete'].includes(step.visual)) {
      setCoordinateFlyStage('settled');
    }
    return undefined;
  }, [screen, step?.visual]);

  const activePoint = ['summary', 'generalXOnly', 'generalComplete'].includes(step.visual)
    ? panelPoint
    : step.visual === 'dragExplore'
      ? dragPoint
      : pickedPoint;
  const activePanelPoint = panelPoint;
  const canNext = step.visual !== 'generalComplete' && !autoLocked && !fly && !step.autoNextMs && !step.requires && !step.button;
  const rightControl = step.requires === 'dragPoint'
    ? React.createElement('button', {
      className: 'nav-chevron',
      onClick: buttonPulse && !fly ? goNext : undefined,
      disabled: !buttonPulse || Boolean(fly),
      'aria-label': T.ui.nextLabel,
    }, '\u00bb')
    : undefined;

  if (screen === 'welcome') {
    return React.createElement('main', { className: 'applet-container' },
      React.createElement(WelcomeScreen, { onStart: start })
    );
  }

  if (screen === 'final') {
    return React.createElement('main', { className: 'applet-container' },
      React.createElement('section', { className: 'final-screen' },
        React.createElement('h1', null, T.ui.completeTitle),
        React.createElement('div', { className: 'final-card' },
          T.ui.completeLines.map((line, i) =>
            React.createElement('p', { key: i },
              line.map((p, j) => p.highlight
                ? React.createElement('span', { key: j, className: 'story-highlight' }, p.text)
                : p.text)
            )
          )
        ),
        React.createElement('button', { className: 'start-button final-start', onClick: restart }, T.ui.startOverButton)
      )
    );
  }

  const panel = {
    ...step,
    feedback,
    point: activePanelPoint,
    image: T.shared.reflect(activePanelPoint),
    coordinateFlyStage,
    distanceAnim,
  };

  return React.createElement('main', { className: 'applet-container' },
    React.createElement(ReflectionLessonScreen, {
      title: step.title,
      panel,
      step,
      point: activePoint,
      panelPoint: activePanelPoint,
      pickedPoint,
      dragPoint,
      linePoints,
      distanceAnim,
      onPlaneTap: handlePlaneTap,
      onPointDrag: handlePointDrag,
      onPointDragEnd: handlePointDragEnd,
      onAction: handleAction,
      onRestart: restart,
    }),
    React.createElement(FlyOverlay, { fly, onComplete: completeFly }),
    React.createElement(Navigation, {
      showBack: true,
      showNext: canNext,
      onBack: goBack,
      onNext: canNext ? goNext : undefined,
      rightControl,
    }, React.createElement('div', { className: 'lower-text' }, step.lower || ''))
  );
};
