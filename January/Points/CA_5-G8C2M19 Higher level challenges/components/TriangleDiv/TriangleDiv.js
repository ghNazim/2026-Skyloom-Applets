// components/TriangleDiv/TriangleDiv.js
const TriangleDiv = ({ 
    draggableLabels = false, 
    onLabelPointerDown, 
    labelRefs,
    shadowMarked = false,
    heightMarked = false,
    showFinalHeight = false,
    showActualHeight = false
}) => {
    const h = React.createElement;
    
    // The triangle has a 75° angle at the base (ladder angle)
    const hypAngle = 75;
    
    return h('div', { className: 'triangle-container-div' },
        // Base (distance) - horizontal orange line at bottom
        h('div', { className: 'triangle-side-base' }),
        
        // Height (vertical) - blue line on right
        h('div', { className: 'triangle-side-height' }),
        
        // Hypotenuse (ladder) - orange line from top-right to bottom-left
        h('div', { 
            className: 'triangle-side-hypotenuse',
            style: { transform: `rotate(-${hypAngle}deg)` }
        }),
        
        // Right angle marker (bottom-right)
        h('div', { className: 'right-angle-marker' }),
        
        // 75° angle marker (bottom-left)
        h('div', { className: 'theta-angle-marker' }),
        h('div', { className: 'theta-label' }, '75°'),
        
        // Height label (on right side) - show h or 9.6 m based on showActualHeight
        h('div', { 
            ref: labelRefs?.shadow,
            className: `label label-shadow ${draggableLabels ? 'draggable' : ''}`,
            style: { cursor: draggableLabels ? 'grab' : 'default' },
            onPointerDown: draggableLabels ? (e) => onLabelPointerDown(e, 'shadow') : undefined,
            onTouchStart: draggableLabels ? (e) => onLabelPointerDown(e, 'shadow') : undefined
        }, showActualHeight ? '9.6 m' : 'h'),
        
        // Ladder label (on hypotenuse) - show L or 10 m
        h('div', { 
            ref: labelRefs?.height,
            className: `label label-height ${draggableLabels ? 'draggable' : ''}`,
            style: { cursor: draggableLabels ? 'grab' : 'default' },
            onPointerDown: draggableLabels ? (e) => onLabelPointerDown(e, 'height') : undefined,
            onTouchStart: draggableLabels ? (e) => onLabelPointerDown(e, 'height') : undefined
        }, showFinalHeight ? '10 m' : 'L')
    );
};

