// components/Navigation/Navigation.js

const Navigation = ({ 
    onNext, 
    onBack, 
    disabled, 
    nextLabel,
    step,
    subStep,
    totalSteps,
    subStepsCount,
    children 
}) => {
    const h = React.createElement;
    const showBack = step > 0 || subStep > 0;

    return h('div', { className: 'navigation' },
        h('button', {
            className: `nav-chevron back ${!showBack ? 'disabled' : ''}`,
            onClick: onBack,
            disabled: !showBack
        }, '«'),
        children,
        h('button', {
            className: `nav-chevron next ${disabled ? 'disabled' : ''}`,
            onClick: onNext,
            disabled: disabled
        }, nextLabel || '»')
    );
};