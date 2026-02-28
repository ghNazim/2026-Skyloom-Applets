const Comprehend = ({ step, substep }) => {
  const comprehendData = APP_DATA.comprehend;
  const stepData = APP_DATA.steps[step];
  
  // Step 1: Show Information Analysis with progressive reveal
  if (step === 1) {
    // Comprehend -1: only section title, no list yet
    if (substep < 0) {
      return React.createElement(
        "div",
        { className: "comprehend-panel" },
        React.createElement(
          "h3",
          { className: "comprehend-section-title" },
          comprehendData.sectionTitle
        )
      );
    }

    const givenData = comprehendData.given.data;
    const toFindData = comprehendData.toFind.data;
    const totalGiven = givenData.length;
    
    // substep 0 = first given item, 1 = second, etc.
    const showGivenCount = Math.min(substep + 1, totalGiven);
    const showToFind = substep >= totalGiven;
    const toFindCount = showToFind ? Math.min(substep - totalGiven + 1, toFindData.length) : 0;
    
    return React.createElement(
      "div",
      { className: "comprehend-panel" },
      // Section Title
      React.createElement(
        "h3",
        { className: "comprehend-section-title" },
        comprehendData.sectionTitle
      ),
      // Given Section
      React.createElement(
        "div",
        { className: "comprehend-section given-section" },
        React.createElement(
          "div",
          { className: "section-border given-border" }
        ),
        React.createElement(
          "div",
          { className: "section-content" },
          React.createElement(
            "h4",
            { className: "section-title given-title" },
            comprehendData.given.title
          ),
          React.createElement(
            "ul",
            { className: "section-list" },
            givenData.slice(0, showGivenCount).map((item, index) => {
              // Only the last item in given list should be yellow, and only if we're still showing given items
              const isLastGivenItem = index === showGivenCount - 1 && !showToFind;
              return React.createElement(
                "li",
                { 
                  key: `given-${index}`,
                  className: `section-list-item ${isLastGivenItem ? 'highlight-yellow' : ''}`,
                  style: {
                    animation: index === showGivenCount - 1 ? "fadeInUp 0.3s ease-out" : "none"
                  }
                },
                item
              );
            })
          )
        )
      ),
      // To Find Section (appears after all given items are shown)
      showToFind && React.createElement(
        "div",
        { className: "comprehend-section tofind-section" },
        React.createElement(
          "div",
          { className: "section-border tofind-border" }
        ),
        React.createElement(
          "div",
          { className: "section-content" },
          React.createElement(
            "h4",
            { className: "section-title tofind-title" },
            comprehendData.toFind.title
          ),
          React.createElement(
            "ul",
            { className: "section-list" },
            toFindData.slice(0, toFindCount).map((item, index) => {
              // Only the last item in toFind list should be yellow
              const isLastToFindItem = index === toFindCount - 1;
              return React.createElement(
                "li",
                { 
                  key: `tofind-${index}`,
                  className: `section-list-item tofind-item ${isLastToFindItem ? 'highlight-yellow' : ''}`,
                  style: {
                    animation: index === toFindCount - 1 ? "fadeInUp 0.3s ease-out" : "none"
                  }
                },
                item
              );
            })
          )
        )
      )
    );
  }
  
  return null;
};
