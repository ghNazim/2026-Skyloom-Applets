/**
 * CalloutBox - Speech bubble with text and triangular tail
 * Props: position { left, top }, bgColor, tailPlacement ('above' | 'below'), calloutText
 */
const CalloutBox = ({ position = {}, bgColor, tailPlacement = 'below', calloutText }) => {
  if (!calloutText) return null;

  const { left, top } = position;
  const style = {
    position: 'absolute',
    left: left != null ? `${left}%` : '50%',
    top: top != null ? `${top}%` : undefined,
    transform: left != null ? 'translateX(-50%)' : 'translateX(-50%)',
    backgroundColor: bgColor || 'rgba(0, 150, 200, 0.9)',
    color: 'white',
    fontSize: '2.5vw',
    padding: '1vw',
    borderRadius: '1vw',
    whiteSpace: 'pre-line',
    textAlign: 'center',
    zIndex: 20,
    border: '1px solid rgba(255,255,255,0.3)',
    width: '30vw',
  };

  const tailBelow = tailPlacement === 'below';
  const tailStyle = {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 0,
    height: 0,
    borderLeft: '1.2vw solid transparent',
    borderRight: '1.2vw solid transparent',
    ...(tailBelow
      ? { bottom: '-1.2vw', borderTop: `1.2vw solid ${bgColor || 'rgba(0, 150, 200, 0.9)'}` }
      : { top: '-1.2vw', borderBottom: `1.2vw solid ${bgColor || 'rgba(0, 150, 200, 0.9)'}` }),
  };

  return React.createElement(
    'div',
    { className: 'callout-box', style },
    React.createElement('div', { className: 'callout-text', style: { lineHeight: 1.3 } }, calloutText),
    React.createElement('div', { className: 'callout-tail', style: tailStyle })
  );
};
