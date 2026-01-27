const current_language = "en";
const decimal = {
  en: ".",
  id: ",",
};

// Master data structure
const DATA = {
  en: {
    app: {
      start: {
        heading: "Creating shapes table!",
        text: "Use the table to select the correct number of shapes and build Andi's house.<br><br>Tap 'START' to begin!",
        buttonText: "Start",
      },
      
      steps: {
        1: {
          layout: "with-character",
          characterImage: "boyHappy.png",
          characterText: "Here are the shapes I have and a table that shows how many of each shape I need.\n\n Can you help me build the house using this table?",
          bottomText: "Tap 'Next' to continue.",
          tableData: {
            headers: ["SHAPES", "COUNT"],
            rows: [
              ["Square", "4"],
              ["Rectangle", "2"],
              ["Triangle", "5"],
              ["Circle", "3"],
            ],
          },
        },
        2: {
          layout: "without-character",
          questionText: "Let's start with squares.",
          navText: "Select 4 squares and Tap 'OK'.",
          tableData: {
            headers: ["SHAPES", "COUNT"],
            rows: [
              ["Square", "4"],
              ["Rectangle", "2"],
              ["Triangle", "5"],
              ["Circle", "3"],
            ],
          },
        },
        
      },
     
    },
  },

};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
