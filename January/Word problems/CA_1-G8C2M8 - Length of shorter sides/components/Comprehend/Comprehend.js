const Comprehend = ({ step, substep }) => {
  const comprehendData = APP_DATA.comprehend;
  const stepData = APP_DATA.steps[step];
  
  // Step 0: Show only the question text
  if (step === 0) {
    return React.createElement(
      "div",
      { className: "comprehend-panel" },
      React.createElement(
        "div",
        { className: "comprehend-question-text" },
        stepData.comprehendText
      )
    );
  }
  
  // Step 1: Show Information Analysis with progressive reveal
  if (step === 1) {
    const givenData = comprehendData.given.data;
    const toFindData = comprehendData.toFind.data;
    const totalGiven = givenData.length;
    
    // Calculate what to show based on substep
    // substep 0 = first given item
    // substep 1 = second given item
    // substep 2 = third given item
    // substep 3 = toFind title + first toFind item
    
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
              // Color mapping: given 1 = white, given 2 = #EF6AA9, given 3 = #FFB84D
              const colors = ["white", "#EF6AA9", "#FFB84D"];
              const itemColor = colors[index] || "white";
              
              return React.createElement(
                "li",
                { 
                  key: `given-${index}`,
                  className: "section-list-item",
                  style: {
                    animation: index === showGivenCount - 1 ? "fadeInUp 0.3s ease-out" : "none",
                    color: itemColor
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
              // Color mapping: tofind 1 = #5EB2E7
              const itemColor = index === 0 ? "#5EB2E7" : "white";
              
              return React.createElement(
                "li",
                { 
                  key: `tofind-${index}`,
                  className: "section-list-item tofind-item",
                  style: {
                    animation: index === toFindCount - 1 ? "fadeInUp 0.3s ease-out" : "none",
                    color: itemColor
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
