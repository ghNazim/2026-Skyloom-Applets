const LowerPanel = ({ text, hidden = false }) => {
    return React.createElement(
        'div',
        { className: `lower-panel-container ${hidden ? "lower-panel-container--quiet" : ""}` },
        React.createElement('p', { className: 'instruction-text' }, text)
    );
};
