const Navigation = ({ onBack, onNext, showBack, showNext, rightControl, children }) => React.createElement('div', { className: 'navigation' },
  React.createElement('button', { className: 'nav-chevron', onClick: onBack, disabled: !showBack, 'aria-label': T.ui.backLabel }, '\u00ab'),
  children,
  rightControl || React.createElement('button', { className: 'nav-chevron', onClick: onNext, disabled: !showNext, 'aria-label': T.ui.nextLabel }, '\u00bb')
);

window.Navigation = Navigation;
