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
          questionCorrect: "Squares make up the windows of the house.",
          navCorrect: "Tap 'Next' to select rectangles.",
          shapeClass: "square",
          requiredCount: 4,
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
        3: {
          layout: "without-character",
          questionText: "Let's pick rectangles now.",
          navText: "Select 2 rectangles and Tap 'OK'.",
          questionCorrect: "Rectangles make up the wall and the door of the house.",
          navCorrect: "Tap 'Next' to select triangles.",
          shapeClass: "rectangle",
          requiredCount: 2,
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
        4: {
          layout: "without-character",
          questionText: "Let's pick triangles now.",
          navText: "Select 5 triangles and Tap 'OK'.",
          questionCorrect: "Triangles make up the roof of the house.",
          navCorrect: "Tap 'Next' to select circles.",
          shapeClass: "triangle",
          requiredCount: 5,
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
        5: {
          layout: "without-character",
          questionText: "Let's pick circles now.",
          navText: "Select 3 circles and Tap 'OK'.",
          questionCorrect: "Circles make up the windows of the roof.",
          navCorrect: "Tap 'Next' to continue.",
          shapeClass: "circle",
          requiredCount: 3,
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
        6: {
          layout: "with-character",
          characterImage: "boyHappy.png",
          characterText: "Wow! The house looks fabulous.\n\nYou used data from the table to help me build the house.",
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
        7: {
          layout: "fullscreen",
          heading: "",
          text: "Andi's house is ready!<br><br>Now he needs to record the colors of the shapes he used.<br><br>Let's count the shapes by color and make a table.<br><br>Tap 'Continue'.",
          buttonText: "Continue",
        },
        8: {
          layout: "with-character",
          characterImage: "boyHappy.png",
          characterText: "Look at the house and count how many shapes of each color are used.",
          bottomText: "Tap 'Next' to continue.",
          showOnlyLeftVisual: true,
        },
        9: {
          layout: "color-counting",
          colors: [
            { name: "Red", hex: "#CC0000" },
            { name: "Orange", hex: "#FF9900" },
            { name: "Yellow", hex: "#FFFF00" },
            { name: "Green", hex: "#00FF00" },
            { name: "Pink", hex: "#FF7ED1" },
            { name: "Blue", hex: "#00FFFF" },
          ],
        },
        10: {
          layout: "with-character",
          characterImage: "boyHappy.png",
          characterText: "That's great!\n\nYou created a table by counting the colors in it.",
          bottomText: "Tap 'Next' to continue.",
        },
        11: {
          layout: "fullscreen",
          heading: "Creating Shapes Table!",
          text: "You used a table to build Andi's house<br><br>and created a new table by sorting shapes by their colors.<br><br>Tap 'Start Over' to repeat this activity.",
          buttonText: "Start Over",
        },
        
      },
     
    },
  },

};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
