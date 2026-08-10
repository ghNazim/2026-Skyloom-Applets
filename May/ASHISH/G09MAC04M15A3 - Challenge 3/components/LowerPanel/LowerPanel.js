const LowerPanel = ({ text }) => {
    return React.createElement(
        'div',
        { className: 'lower-panel-container' },
        React.createElement('p', { className: 'instruction-text' }, text)
    );
};