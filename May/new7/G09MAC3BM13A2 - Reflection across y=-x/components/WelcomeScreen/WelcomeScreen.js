const WelcomeScreen = ({ onStart }) => React.createElement('section', { className: 'welcome-screen' },
  React.createElement('h1', { className: 'welcome-title' }, T.ui.welcomeTitle),
  T.ui.welcomeLines.map((line, i) =>
    React.createElement('p', { key: i, className: 'welcome-message' },
      line.map((part, j) =>
        part.highlight
          ? React.createElement('span', { key: j, className: 'story-highlight' }, part.text)
          : part.text
      )
    )
  ),
  React.createElement('p', { className: 'welcome-prompt' },
    T.ui.welcomePrompt.map((part, j) =>
      part.highlight
        ? React.createElement('span', { key: j, className: 'story-highlight' }, part.text)
        : part.text
    )
  ),
  React.createElement('button', { className: 'start-button', onClick: onStart }, T.ui.startButton)
);
window.WelcomeScreen = WelcomeScreen;
