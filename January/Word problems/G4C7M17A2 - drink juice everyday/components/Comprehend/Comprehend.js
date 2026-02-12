const Comprehend = ({ step, substep }) => {
  const comprehendData = APP_DATA.comprehend;
  const stepData = APP_DATA.steps[step];
  
  // Step 1: Show Information Analysis. Substep 0 = intro (title only). Then progressive reveal.
  if (step === 1) {
    const givenData = comprehendData.given.data;
    const toFindData = comprehendData.toFind.data;
    
    let givenSubitemCount = 0;
    givenData.forEach(item => {
      givenSubitemCount += item.subitems.length;
    });
    
    // Substep 0 = intro: only section title, no list
    const isIntro = substep === 0;
    const showToFind = !isIntro && substep > givenSubitemCount;
    const toFindSubstepIndex = showToFind ? substep - givenSubitemCount - 1 : -1;
    
    const getGivenItemsToShow = () => {
      if (isIntro) return [];
      let currentSubstep = 0;
      const result = [];
      
      for (let i = 0; i < givenData.length; i++) {
        const item = givenData[i];
        const subitemsToShow = [];
        
        for (let j = 0; j < item.subitems.length; j++) {
          if (currentSubstep < substep) {
            subitemsToShow.push({
              text: item.subitems[j],
              isNew: currentSubstep === substep - 1
            });
          }
          currentSubstep++;
        }
        
        if (subitemsToShow.length > 0) {
          result.push({
            label: item.label,
            subitems: subitemsToShow,
            isNewLabel: result.length === 0 ? substep - 1 < item.subitems.length : 
                        currentSubstep - item.subitems.length <= substep - 1 && 
                        currentSubstep - item.subitems.length > substep - 1 - subitemsToShow.length
          });
        }
      }
      return result;
    };
    
    const givenItemsToShow = getGivenItemsToShow();
    
    return React.createElement(
      "div",
      { className: "comprehend-panel" },
      React.createElement(
        "h3",
        { className: "comprehend-section-title" },
        comprehendData.sectionTitle
      ),
      // Given section only when past intro
      !isIntro && React.createElement(
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
            "div",
            { className: "nested-list" },
            givenItemsToShow.map((item, itemIndex) => {
              return React.createElement(
                "div",
                { key: `given-item-${itemIndex}`, className: "nested-list-item" },
                React.createElement("div", { className: "nested-list-label" }, item.label),
                React.createElement(
                  "ul",
                  { className: "nested-sublist" },
                  item.subitems.map((subitem, subIndex) => {
                    return React.createElement(
                      "li",
                      { 
                        key: `given-subitem-${itemIndex}-${subIndex}`,
                        className: "nested-sublist-item" + (subitem.isNew ? " yellow" : ""),
                        style: { animation: subitem.isNew ? "fadeInUp 0.3s ease-out" : "none" }
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
                  className: "section-list-item tofind-item" + (index === toFindSubstepIndex ? " yellow" : ""),
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

// LeftQuestion component - shows question with highlights in left panel (substep 0 = no highlights)
const LeftQuestion = ({ step, substep }) => {
  const comprehendData = APP_DATA.comprehend;
  const questionText = APP_DATA.questionText;
  
  let givenSubitemCount = 0;
  comprehendData.given.data.forEach(item => {
    givenSubitemCount += item.subitems.length;
  });
  
  const isIntro = substep === 0;
  const isToFind = substep > givenSubitemCount;
  
  const getHighlightedText = () => {
    let text = questionText;
    if (isIntro) return text;
    
    if (!isToFind && substep >= 1) {
      const highlightIndex = substep - 1;
      if (highlightIndex < comprehendData.given.highlights.length) {
        const highlight = comprehendData.given.highlights[highlightIndex];
        if (highlight && text.includes(highlight)) {
          text = text.replace(
            highlight,
            `<span class="left-question-highlight-orange">${highlight}</span>`
          );
        }
      }
    } else if (isToFind) {
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
