const renderParts = (parts, keyPrefix = 'p') =>
  parts.map((part, i) =>
    part.highlight
      ? React.createElement('span', { key: `${keyPrefix}-${i}`, className: `story-highlight ${part.tone || ''}` }, part.text)
      : part.text
  );

const CoordinatePair = ({ point, image, mode, flyStage = 'settled', compact = false }) => {
  const stageTokens = {
    idle: [],
    'pre-x': ['pre-x'],
    preimage: ['pre-x', 'pre-y'],
    'image-y': ['pre-x', 'pre-y', 'image-x'],
    settled: ['pre-x', 'pre-y', 'image-x', 'image-y'],
  };
  const landedTokens = new Set(Array.isArray(flyStage)
    ? flyStage
    : (stageTokens[flyStage] || stageTokens.settled));
  const isAnimatedPattern = ['patternA', 'patternYFirst', 'patternXSecond', 'dragExplore'].includes(mode);
  const completeMode = ['patternComplete', 'rule', 'algebra-x', 'algebra'].includes(mode);
  const showPreimage = true;
  const showPreX = completeMode || !isAnimatedPattern || landedTokens.has('pre-x');
  const showPreY = completeMode || !isAnimatedPattern || landedTokens.has('pre-y');
  const showFirstImageToken = completeMode || (isAnimatedPattern && landedTokens.has('image-x'));
  const showSecondImageToken = ['rule', 'algebra'].includes(mode) || mode === 'patternComplete' || (isAnimatedPattern && landedTokens.has('image-y'));
  const dragMode = mode === 'dragExplore';
  const dragYToImageXCue = dragMode && landedTokens.has('pre-x') && landedTokens.has('pre-y') && !landedTokens.has('image-x');
  const dragXToImageYCue = dragMode && landedTokens.has('image-x') && !landedTokens.has('image-y');
  const showYToImageXArrow = completeMode || mode === 'patternYFirst' || dragYToImageXCue || (dragMode && landedTokens.has('image-x'));
  const showXToImageYArrow = completeMode || mode === 'patternXSecond' || dragXToImageYCue || (dragMode && landedTokens.has('image-y'));
  const showArrow = showPreimage && (showYToImageXArrow || showXToImageYArrow);
  const algebra = mode === 'algebra';
  const algebraXOnly = mode === 'algebra-x';
  const leftX = (algebra || algebraXOnly) ? 'x' : point.x;
  const leftY = algebra ? 'y' : algebraXOnly ? '' : point.y;
  const rightX = algebra ? '\u2212y' : algebraXOnly ? '' : image.x;
  const rightY = algebra ? '\u2212x' : algebraXOnly ? 'x' : image.y;
  const blankToken = (key) => React.createElement('span', { key, className: 'coord-blank' });
  const tokenOrBlank = (value, className, key, attrs = {}) =>
    value === ''
      ? blankToken(key)
      : React.createElement('span', { key, className, ...attrs }, value);
  const labelClass = 'coord-label-row';

  return React.createElement('div', { className: `coordinate-panel coordinate-panel-${mode}${compact ? ' coordinate-panel-compact' : ''}` },
    !compact && React.createElement('p', { className: 'coordinate-note' }, T.ui.noteCoordinates),
    React.createElement('div', { className: 'coordinate-swap-stage' },
      React.createElement('div', {
        className: `coordinate-row${showPreimage ? '' : ' coordinate-row-hidden'}`,
        'data-coordinate-target': 'panel-pre-row',
      },
        React.createElement('span', { className: 'coord-paren' }, '('),
        showPreX && tokenOrBlank(leftX, 'coord-token coord-x', 'left-x', { 'data-coordinate-source': 'panel-pre-x', 'data-coordinate-target': 'panel-pre-x' }),
        !showPreX && React.createElement('span', { className: 'coord-blank', 'data-coordinate-target': 'panel-pre-x' }),
        React.createElement('span', { className: 'coord-comma' }, ','),
        showPreY && tokenOrBlank(leftY, 'coord-token coord-y', 'left-y', { 'data-coordinate-source': 'panel-pre-y', 'data-coordinate-target': 'panel-pre-y' }),
        !showPreY && React.createElement('span', { className: 'coord-blank', 'data-coordinate-target': 'panel-pre-y' }),
        React.createElement('span', { className: 'coord-paren' }, ')')
      ),
      React.createElement('div', { className: `${labelClass}${showPreimage ? '' : ' coordinate-row-hidden'}` },
        React.createElement('span', null, T.ui.preImage)
      ),
      React.createElement('svg', {
        className: `swap-arrow-overlay${showArrow ? '' : ' coordinate-row-hidden'}`,
        viewBox: '0 0 80 80',
        preserveAspectRatio: 'none',
        'aria-hidden': 'true',
      },
        React.createElement('defs', null,
          React.createElement('marker', { id: 'swapArrowHeadX', markerWidth: 5, markerHeight: 5, refX: 4.4, refY: 2.5, orient: 'auto', markerUnits: 'strokeWidth' },
            React.createElement('path', { d: 'M 0 0 L 5 2.5 L 0 5 Z', className: 'swap-arrow-head-x' })
          ),
          React.createElement('marker', { id: 'swapArrowHeadY', markerWidth: 5, markerHeight: 5, refX: 4.4, refY: 2.5, orient: 'auto', markerUnits: 'strokeWidth' },
            React.createElement('path', { d: 'M 0 0 L 5 2.5 L 0 5 Z', className: 'swap-arrow-head-y' })
          )
        ),
        React.createElement('path', {
          d: 'M 34 20 L 56 60',
          className: `swap-token-arrow swap-token-arrow-x${showXToImageYArrow ? ' swap-arrow-visible' : ''}`,
          markerEnd: 'url(#swapArrowHeadX)',
        }),
        React.createElement('path', {
          d: 'M 46 20 L 24 60',
          className: `swap-token-arrow swap-token-arrow-y${showYToImageXArrow ? ' swap-arrow-visible' : ''}`,
          markerEnd: 'url(#swapArrowHeadY)',
        })
      ),
      React.createElement('div', { className: 'coordinate-row image-row' },
        React.createElement('span', { className: 'coord-paren' }, '('),
        showFirstImageToken && tokenOrBlank(rightX, 'coord-token coord-y', 'right-x', { 'data-coordinate-target': 'panel-image-x' }),
        !showFirstImageToken && React.createElement('span', { className: 'coord-blank', 'data-coordinate-target': 'panel-image-x' }),
        React.createElement('span', { className: 'coord-comma' }, ','),
        showSecondImageToken && tokenOrBlank(rightY, 'coord-token coord-x', 'right-y', { 'data-coordinate-target': 'panel-image-y' }),
        !showSecondImageToken && React.createElement('span', { className: 'coord-blank', 'data-coordinate-target': 'panel-image-y' }),
        React.createElement('span', { className: 'coord-paren' }, ')')
      ),
      React.createElement('div', { className: `${labelClass}${showFirstImageToken || showSecondImageToken ? '' : ' coordinate-row-hidden'}` },
        React.createElement('span', null, T.ui.image)
      )
    )
  );
};

const RulePanel = ({ point, image, algebra = false, algebraXOnly = false, flyStage = 'settled', modeOverride = null }) =>
  React.createElement('div', { className: 'rule-panel' },
    React.createElement('p', null, T.ui.ruleA),
    React.createElement('p', null, T.ui.ruleB),
    React.createElement('p', { className: 'story-highlight' }, T.ui.ruleC),
    React.createElement(CoordinatePair, {
      point,
      image,
      flyStage,
      mode: modeOverride || (algebra ? 'algebra' : algebraXOnly ? 'algebra-x' : 'rule'),
    })
  );

const SwapArrow = () =>
  React.createElement('div', { className: 'swap-arrow', 'aria-hidden': 'true' }, '\u2192');

const MorphToken = ({ numberText, varText, className, morphing, done }) =>
  React.createElement('span', { className: `coord-morph ${className}` },
    React.createElement('span', {
      className: `coord-morph-num${morphing ? ' morph-out' : ''}${done ? ' morph-hidden' : ''}`,
    }, numberText),
    React.createElement('span', {
      className: `coord-morph-var${morphing ? ' morph-in' : ''}${done ? ' morph-shown' : ' morph-hidden'}`,
    }, varText)
  );

const BigSwapExpression = ({ mode, point, image }) => {
  const leftMorphing = mode === 'generalXOnly';
  const leftDone = mode === 'generalComplete';
  const rightMorphing = mode === 'generalComplete';
  const rightDone = false;
  return React.createElement('div', { className: `big-swap-expression ${mode !== 'summary' ? 'big-swap-algebra' : ''}` },
    React.createElement('div', { className: 'big-coord-group' },
      React.createElement('div', { className: 'big-coordinate-row' },
        React.createElement('span', { className: 'coord-paren' }, '('),
        React.createElement(MorphToken, {
          numberText: String(point.x),
          varText: 'x',
          className: 'coord-x',
          morphing: leftMorphing,
          done: leftDone,
        }),
        React.createElement('span', { className: 'coord-comma' }, ','),
        React.createElement(MorphToken, {
          numberText: String(point.y),
          varText: 'y',
          className: 'coord-y',
          morphing: leftMorphing,
          done: leftDone,
        }),
        React.createElement('span', { className: 'coord-paren' }, ')')
      ),
      React.createElement('div', { className: 'big-label-stack' },
        React.createElement('span', null, T.ui.preImage)
      )
    ),
    React.createElement(SwapArrow),
    React.createElement('div', { className: 'big-coord-group' },
      React.createElement('div', { className: 'big-coordinate-row' },
        React.createElement('span', { className: 'coord-paren' }, '('),
        React.createElement(MorphToken, {
          numberText: String(image.x),
          varText: '\u2212y',
          className: 'coord-y',
          morphing: rightMorphing,
          done: rightDone,
        }),
        React.createElement('span', { className: 'coord-comma' }, ','),
        React.createElement(MorphToken, {
          numberText: String(image.y),
          varText: '\u2212x',
          className: 'coord-x',
          morphing: rightMorphing,
          done: rightDone,
        }),
        React.createElement('span', { className: 'coord-paren' }, ')')
      ),
      React.createElement('div', { className: 'big-label-stack' },
        React.createElement('span', null, T.ui.image)
      )
    )
  );
};

const GeneralizationPanel = ({ step, panel, onAction }) =>
  React.createElement('section', { className: 'generalization-screen' },
    React.createElement('div', { className: 'lesson-header-band' },
      React.createElement('h2', { className: 'lesson-header-text' }, step.title)
    ),
    React.createElement('div', { className: 'generalization-card' },
      React.createElement('p', null, T.ui.summaryA),
      React.createElement('p', null, T.ui.summaryB),
      React.createElement(BigSwapExpression, { mode: step.visual, point: panel.point, image: panel.image }),
    ),
    panel.button && React.createElement('button', {
      className: 'rotate-action-btn pulse reflect-btn generalize-btn',
      onClick: onAction,
    }, panel.button),
    step.visual === 'generalComplete' && React.createElement('button', {
      className: 'rotate-action-btn final-start generalize-btn',
      onClick: panel.onRestart,
    }, T.ui.startOverButton)
  );

const ReflectionLessonScreen = ({
  title,
  panel,
  step,
  point,
  panelPoint,
  dragPoint,
  linePoints,
  distanceAnim,
  onPlaneTap,
  onPointDrag,
  onPointDragEnd,
  onAction,
  onRestart,
}) => {
  const image = T.shared.reflect(panelPoint || point);
  const panelClass = '';
  if (['summary', 'generalXOnly', 'generalComplete'].includes(step.visual)) {
    return React.createElement(GeneralizationPanel, { step, panel: { ...panel, onRestart }, onAction });
  }

  const renderPanelBody = () => {
    if (panel.panelKind === 'coordinate') {
      return React.createElement(CoordinatePair, {
        point: panelPoint || point,
        image,
        mode: step.visual,
        flyStage: panel.coordinateFlyStage,
      });
    }
    if (panel.panelKind === 'rule') {
      return React.createElement(RulePanel, {
        point: panelPoint || point,
        image,
        flyStage: panel.coordinateFlyStage,
        modeOverride: step.visual === 'dragExplore' ? 'dragExplore' : null,
      });
    }
    if (panel.panelKind === 'algebra') {
      return React.createElement(RulePanel, {
        point: panelPoint || point,
        image,
        algebra: step.visual === 'generalComplete',
        algebraXOnly: step.visual === 'generalXOnly',
        flyStage: panel.coordinateFlyStage,
      });
    }
    return React.createElement(React.Fragment, null,
      panel.panel.map((line, i) =>
        React.createElement('p', { key: i }, renderParts(line, `line${i}`))
      ),
      panel.button && React.createElement('button', {
        className: 'rotate-action-btn pulse reflect-btn',
        onClick: onAction,
      }, panel.button)
    );
  };
  const shouldSlidePanel = !panel.panelKind && !['patternA', 'patternYFirst', 'patternXSecond', 'patternComplete', 'dragExplore'].includes(step.visual);
  const panelKey = panel.panelKind
    ? panel.panelKind
    : (panel.panel || []).map((line) => line.map((part) => part.text).join('')).join('|') || step.id;

  return React.createElement('section', { className: 'reflection-lesson-screen layout-split' },
    React.createElement('div', { className: 'lesson-header-band', style: { viewTransitionName: 'lesson-header-band' } },
      React.createElement('h2', { className: 'lesson-header-text' }, title)
    ),
    React.createElement('div', { className: 'lesson-body' },
      React.createElement('div', { className: 'lesson-graph-panel', style: { viewTransitionName: 'lesson-graph-panel' } },
        React.createElement(ReflectionPlane, {
          step,
          point,
          dragPoint,
          linePoints,
          feedbackPoint: panel.feedback?.point,
          distanceAnim,
          onPlaneTap,
          onPointDrag,
          onPointDragEnd,
        })
      ),
      React.createElement('aside', { className: `lesson-right-panel ${panelClass}`, style: { viewTransitionName: 'lesson-right-panel' } },
        React.createElement('div', {
          className: `reflection-copy-box${shouldSlidePanel ? ' fly-in-panel' : ''}${panel.feedback ? ' with-feedback-slot' : ''}`,
          key: panelKey,
        },
          React.createElement('div', { className: 'reflection-copy-main' }, renderPanelBody()),
          React.createElement('div', { className: 'reflection-feedback-slot' },
            panel.feedback && React.createElement('div', { className: 'reflection-feedback wrong' },
              React.createElement('span', null, panel.feedback.text)
            )
          )
        )
      )
    )
  );
};

window.ReflectionLessonScreen = ReflectionLessonScreen;
