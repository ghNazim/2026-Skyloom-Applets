const Comprehend = ({ step, substep }) => {
  const comprehendData = APP_DATA.comprehend;
  const stepData = APP_DATA.steps[step];
  
  // Step 1: Show Information Analysis with progressive reveal (nested structure)
  if (step === 1) {
    const givenData = comprehendData.given.data;
    const toFindData = comprehendData.toFind.data;
    
    // Calculate what to show based on substep
    // Structure: Given has items with labels and subitems
    // We reveal one subitem at a time
    
    // Count total subitems in Given section
    let givenSubitemCount = 0;
    givenData.forEach(item => {
      givenSubitemCount += item.subitems.length;
    });
    
    const showToFind = substep >= givenSubitemCount;
    const toFindSubstepIndex = showToFind ? substep - givenSubitemCount : -1;
    
    // Calculate which items and subitems to show in Given section
    const getGivenItemsToShow = () => {
      let currentSubstep = 0;
      const result = [];
      
      for (let i = 0; i < givenData.length; i++) {
        const item = givenData[i];
        const subitemsToShow = [];
        
        for (let j = 0; j < item.subitems.length; j++) {
          if (currentSubstep <= substep) {
            subitemsToShow.push({
              text: item.subitems[j],
              isNew: currentSubstep === substep
            });
          }
          currentSubstep++;
        }
        
        if (subitemsToShow.length > 0) {
          result.push({
            label: item.label,
            subitems: subitemsToShow,
            isNewLabel: result.length === 0 ? substep < item.subitems.length : 
                        currentSubstep - item.subitems.length <= substep && 
                        currentSubstep - item.subitems.length > substep - subitemsToShow.length
          });
        }
      }
      
      return result;
    };
    
    const givenItemsToShow = getGivenItemsToShow();
    
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
          // Nested list structure
          React.createElement(
            "div",
            { className: "nested-list" },
            givenItemsToShow.map((item, itemIndex) => {
              return React.createElement(
                "div",
                { 
                  key: `given-item-${itemIndex}`,
                  className: "nested-list-item"
                },
                // Item label
                React.createElement(
                  "div",
                  { className: "nested-list-label" },
                  item.label
                ),
                // Subitems
                React.createElement(
                  "ul",
                  { className: "nested-sublist" },
                  item.subitems.map((subitem, subIndex) => {
                    return React.createElement(
                      "li",
                      { 
                        key: `given-subitem-${itemIndex}-${subIndex}`,
                        className: "nested-sublist-item",
                        style: {
                          animation: subitem.isNew ? "fadeInUp 0.3s ease-out" : "none"
                        }
                      },
                      subitem.text
                    );
                  })
                )
              );
            })
          )
        )
      ),
      // To Find Section (appears after all given items are shown)
      showToFind && React.createElement(
        "div",
        { 
          className: "comprehend-section tofind-section",
          style: {
            animation: toFindSubstepIndex === 0 ? "fadeInUp 0.3s ease-out" : "none"
          }
        },
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
            toFindData.slice(0, toFindSubstepIndex + 1).map((item, index) => {
              return React.createElement(
                "li",
                { 
                  key: `tofind-${index}`,
                  className: "section-list-item tofind-item",
                  style: {
                    animation: index === toFindSubstepIndex ? "fadeInUp 0.3s ease-out" : "none"
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

// LeftQuestion component - shows question with highlights in left panel
const LeftQuestion = ({ step, substep }) => {
  const comprehendData = APP_DATA.comprehend;
  const questionText = APP_DATA.questionText;
  
  // Calculate which highlight to show based on substep
  let givenSubitemCount = 0;
  comprehendData.given.data.forEach(item => {
    givenSubitemCount += item.subitems.length;
  });
  
  const isToFind = substep >= givenSubitemCount;
  
  // Get the highlight for current substep
  const getHighlightedText = () => {
    let text = questionText;
    
    if (!isToFind && substep < comprehendData.given.highlights.length) {
      // Highlight given item
      const highlight = comprehendData.given.highlights[substep];
      if (highlight && text.includes(highlight)) {
        text = text.replace(
          highlight,
          `<span class="left-question-highlight-orange">${highlight}</span>`
        );
      }
    } else if (isToFind) {
      // Highlight toFind item
      comprehendData.toFind.highlights.forEach(highlight => {
        if (highlight && text.includes(highlight)) {
          text = text.replace(
            highlight,
            `<span class="left-question-highlight-purple">${highlight}</span>`
          );
        }
      });
    }
    
    return text;
  };
  
  return React.createElement(
    "div",
    { className: "left-question-panel" },
    React.createElement(
      "div",
      { 
        className: "left-question-text",
        dangerouslySetInnerHTML: { __html: getHighlightedText() }
      }
    )
  );
};
