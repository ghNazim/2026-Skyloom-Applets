/**
 * TimelineContent - Timeline visualization with labels and optional CalloutBox
 * Layout: horizontal yellow line, 2 vertical dashed lines at 28%, shaded area, labels
 */
const TimelineContent = ({
  labels,
  startTimeColor,
  endTimeColor,
  durationColor,
  onClickStartTime,
  onClickEndTime,
  onClickDuration,
  activeCallout,
  nudgeTargetRef,
  formulaHtml,
  arrowImage,
  glowStartTime,
  glowEndTime,
  glowDuration,
  showDifferenceText,
  differenceText = "(Difference)",
}) => {
  return React.createElement(
    'div',
    { className: 'timeline-content' },
    // Formula box (steps 4, 5, 6)
    formulaHtml && React.createElement('div', {
      className: 'timeline-formula-box',
      dangerouslySetInnerHTML: { __html: formulaHtml },
    }),
    // Arrow image rtl.png or ltr.png (steps 4, 5) - 5vw above A and B, from A to B
    arrowImage && React.createElement('img', {
      src: `assets/${arrowImage}`,
      alt: '',
      className: 'timeline-direction-arrow',
    }),
    // Shaded area between vertical lines (28% to 72%)
    React.createElement('div', { className: 'timeline-shaded' }),
    // Vertical dashed line left (28%)
    React.createElement('div', { className: 'timeline-vline timeline-vline-left' }),
    // Vertical dashed line right (72%)
    React.createElement('div', { className: 'timeline-vline timeline-vline-right' }),
    // Horizontal yellow line
    React.createElement('div', { className: 'timeline-hline' }),
    // "The Timeline" label
    React.createElement('div', { className: 'timeline-label timeline-the-timeline' }, labels.theTimeline),
    // Start time label
    React.createElement('div', {
      ref: nudgeTargetRef,
      className: `timeline-label timeline-start-time ${onClickStartTime ? 'clickable' : ''} ${glowStartTime ? 'glow-cyan' : ''}`,
      style: { color: startTimeColor },
      onClick: onClickStartTime || undefined,
    }, labels.startTime),
    // End time label
    React.createElement('div', {
      className: `timeline-label timeline-end-time ${onClickEndTime ? 'clickable' : ''} ${glowEndTime ? 'glow-orange' : ''}`,
      style: { color: endTimeColor },
      onClick: onClickEndTime || undefined,
    }, labels.endTime),
    // Bidirectional arrow (arr.svg image)
    React.createElement('div', { className: 'timeline-arrow' },
      React.createElement('img', { src: 'assets/arr.svg', alt: '', className: 'timeline-arrow-img' })
    ),
    // Duration label + optional (Difference) text
    React.createElement('div', { className: 'timeline-duration-wrap' },
      React.createElement('div', {
        className: `timeline-label timeline-duration ${onClickDuration ? 'clickable' : ''} ${glowDuration ? 'glow-white' : ''}`,
        style: { color: durationColor },
        onClick: onClickDuration || undefined,
      }, labels.duration),
      showDifferenceText && React.createElement('div', { className: 'timeline-difference-text' }, differenceText)
    ),
    // CalloutBox (when active)
    activeCallout && React.createElement(CalloutBox, {
      position: activeCallout.position,
      bgColor: activeCallout.bgColor,
      tailPlacement: activeCallout.tailPlacement,
      calloutText: activeCallout.text,
    })
  );
};
