const FlyOverlay = ({ fly, onComplete }) => {
  const { useEffect, useRef } = React;
  const elRef = useRef(null);

  useEffect(() => {
    if (!fly) return undefined;
    const el = elRef.current;
    if (!el) return undefined;

    const from = fly.fromRect;
    const to = fly.toRect;
    const startX = from.left + from.width / 2;
    const startY = from.top + from.height / 2;
    const endX = to.left + to.width / 2;
    const endY = to.top + to.height / 2;
    const dx = endX - startX;
    const dy = endY - startY;
    const duration = fly.durationMs || 720;

    el.style.left = `${startX}px`;
    el.style.top = `${startY}px`;
    el.style.setProperty('--fly-duration', `${duration}ms`);
    el.style.transform = 'translate(-50%, -50%) translate(0, 0) scale(1)';
    el.style.opacity = '1';

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transform = `translate(-50%, -50%) translate(${dx}px, ${dy}px) scale(0.96)`;
        el.classList.add('is-landing');
      });
    });

    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, Math.max(360, duration - 90));
    return () => clearTimeout(timer);
  }, [fly, onComplete]);

  if (!fly) return null;

  return React.createElement('div', { className: 'fly-overlay', 'aria-hidden': 'true' },
    React.createElement('div', {
      ref: elRef,
      className: `fly-chip ${fly.tone || ''}`,
    }, fly.text)
  );
};

window.FlyOverlay = FlyOverlay;
