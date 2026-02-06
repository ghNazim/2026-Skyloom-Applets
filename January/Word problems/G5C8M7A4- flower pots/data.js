const current_language = "en";
const decimal = {
  en: ".",
  id: ",",
};

// Master data structure for Flower Pots Word Problem
const DATA = {
  en: {
    app: {
      start_over: "Restart",
      
      // Question text for display
      questionText: "Dinda's backyard is shaped like an isosceles trapezoid with dimensions given in the image. Flower pots will be placed all around the boundary of the yard with a distance of 50 cm between pots. If the price per pot is Rp10000, how much money is needed to buy all the pots?",
      
      // Comprehend step data (Step 1)
      comprehend: {
        sectionTitle: "INFORMATION ANALYSIS",
        images: [
          "assets/compre1.png",
          "assets/compre2.png",
          "assets/compre3.png",
          "assets/compre4.png",
          "assets/compre5.png",
          "assets/compre6.png",
          "assets/compre7.png"
        ],
        given: {
          title: "Given,",
          data: [
            "Dinda's backyard is shaped like an isosceles trapezoid.",
            "Top base = 420 cm",
            "Bottom base = 600 cm",
            "Each slanted side = 340 cm",
            "Distance between pots = 50 cm",
            "Price per pot = Rp 10,000"
          ],
          highlights: [
            "Dinda's backyard is shaped like an isosceles trapezoid",
            "Top base = 420 cm",
            "Bottom base = 600 cm",
            "Each slanted side = 340 cm",
            "Distance between pots = 50 cm",
            "Price per pot = Rp 10,000"
          ]
        },
        toFind: {
          title: "To Find",
          data: [
            "Total money needed to buy all flower pots"
          ],
          highlights: [
            "how much money is needed to buy all the pots"
          ]
        },
      },
      
      // Splash screens data
      splash: {
        step2: {
          image: "assets/compre7.png",
          text: "<blue>✓ Information gathered from the figure.</blue><br><yellow>Next - Let's solve the problem with the information that we have.</yellow>"
        }
      },
      
      // MCQ for Step 3 (boundary question)
      mcq1: {
        title: "Flower pots are placed all around the backyard. What does this boundary describe?",
        options: [
          "A. The area of the backyard",
          "B. The perimeter of the backyard",
          "C. The height of the backyard",
          "D. The shape of the backyard"
        ],
        answerIndex: 1,
        fontSize: "1.6vw"
      },
      
      // MCQ for Step 4 (perimeter definition)
      mcq2: {
        title: "Which statement correctly describes the perimeter of a trapezoid?",
        options: [
          "A) The sum of all the side lengths.",
          "B) The distance between the two parallel sides.",
          "C) The amount of space inside the trapezoid.",
          "D) Half the sum of the parallel sides."
        ],
        answerIndex: 0
      },
      
      // MCQ for Step 10 (total cost)
      mcq3: {
        title: "If you know the number of flower pots and the cost of one pot, what should you do to find the total cost?",
        options: [
          "A) Multiply the number of pots by the cost of one pot",
          "B) Add the number of pots and the cost of one pot",
          "C) Divide the number of pots by the cost of one pot",
          "D) Subtract the cost of one pot from the number of pots"
        ],
        answerIndex: 0,
        fontSize: "1.6vw"
      },
      
      // Drag and Drop data for Step 7 (Number of pots)
      dragDrop1: {
        equationLabel: "Number of pots",
        dropZones: [
          { id: "zone1", correctAnswer: "Perimeter", placeholder: "Perimeter" },
          { id: "zone2", correctAnswer: "÷", placeholder: "÷" },
          { id: "zone3", correctAnswer: "Distance between pots", placeholder: "Distance between pots" }
        ],
        draggables: [
          { id: "drag1", text: "Perimeter" },
          { id: "drag2", text: "Distance between pots" },
          { id: "drag3", text: "+" },
          { id: "drag4", text: "-" },
          { id: "drag5", text: "×" },
          { id: "drag6", text: "÷" }
        ],
        findingsTitle: "Given",
        findingsList: [
          "Distance between pots = 50 cm",
          "Price per pot = Rp 10,000"
        ]
      },
      
      // Drag and Drop data for Step 11 (Total cost)
      dragDrop2: {
        equationLabel: "Total Cost",
        dropZones: [
          { id: "zone1", correctAnswers: ["Number of pots", "Cost of one pot"], placeholder: "Number of pots" },
          { id: "zone2", correctAnswer: "×", placeholder: "×" },
          { id: "zone3", correctAnswers: ["Number of pots", "Cost of one pot"], placeholder: "Cost of one pot" }
        ],
        draggables: [
          { id: "drag1", text: "Cost of one pot" },
          { id: "drag2", text: "Number of pots" },
          { id: "drag3", text: "+" },
          { id: "drag4", text: "-" },
          { id: "drag5", text: "×" },
          { id: "drag6", text: "÷" }
        ],
        findingsTitle: "Given",
        findingsList: [
          "Distance between pots = 50 cm",
          "Price per pot = Rp 10,000"
        ]
      },
      
      // Calculation data for Steps 5-6 (Perimeter calculation)
      calculation1: {
        // Step 5: Interactive boxes for perimeter
        perimeterBoxes: {
          values: ["420", "340", "600", "340"],
          labels: ["side length 1", "side length 2", "side length 3", "side length 4"]
        },
        numpad: {
          answer: "1700",
          maxLength: 4,
          unit: "m"
        },
        findings: {
          perimeter: "Perimeter of backyard = Perimeter of trapezoid = 1700 m"
        }
      },
      
      // Calculation data for Steps 8-9 (Number of pots)
      calculation2: {
        numpad1: {
          answer: "1700",
          maxLength: 4
        },
        numpad2: {
          answer: "34",
          maxLength: 2
        },
        findings: {
          numberOfPots: "Number of pots = 34"
        }
      },
      
      // Calculation data for Steps 12-13 (Total cost)
      calculation3: {
        values: {
          initialBox1: "Number of pots",
          initialBox2: "Cost of one pot",
          numberOfPots: "34",
          costPerPot: "10000"
        },
        numpad: {
          answer: "340000",
          maxLength: 6
        }
      },
      
      // Step 0 image
      step0Image: "assets/question.png",
      
      // Alt texts for images
      altTexts: {
        questionImage: "Question image",
        calculationVisual: "Calculation visual",
        summaryVisual: "Summary visual",
        visualRepresentation: "Visual representation",
        finalAnswer: "Final answer"
      },
      
      // Calculation display strings
      calculation: {
        altTexts: {
          flowerPots: "Flower pots"
        },
        // Calculation row texts
        rows: {
          step3Row1: "Dinda's backyard is shaped like an isosceles trapezoid.",
          step3Row2: "So, perimeter of the backyard = Perimeter of the trapezoid",
          step4Row3: "Perimeter of the trapezoid = Sum of the side lengths",
          step5Row1: "Perimeter of the trapezoid = ",
          step5SumBox: "Sum of the side lengths",
          step5Row2: "Perimeter of the trapezoid = Sum of the side lengths",
          step6Row1: "Perimeter of the trapezoid = Sum of the side lengths",
          step6Row2Prefix: "Perimeter of the trapezoid = ",
          step8Row1: "Number of pots = Perimeter ÷ Distance between pots",
          step8Row2Prefix: "Number of pots = ",
          step8Row2Suffix: " ÷ 50",
          step9Row1: "Number of pots = Perimeter ÷ Distance between pots",
          step9Row2Prefix: "Number of pots = ",
          step9Row3Prefix: "Number of pots = ",
          step12Row1: "Total Cost = Number of pots × Cost of one pot",
          step12Row2Prefix: "Total Cost = ",
          step12Row2Middle: " × ",
          step13Row1: "Total Cost = Number of pots × Cost of one pot",
          step13Row2Prefix: "Total Cost = ",
          step13Row3Prefix: "Total cost = Rp "
        },
        // Default given/findings lists
        defaultGiven: {
          step3: ["Dinda's backyard is shaped like an isosceles trapezoid."],
          step5: [
            "The side lengths of the trapezoid are:",
            "Top base = 420 cm",
            "Bottom base = 600 cm",
            "Each slanted side = 340 cm"
          ],
          step6: ["Distance between pots = 50 cm", "Price per pot = Rp 10,000"],
          step7to13: ["Distance between pots = 50 cm", "Price per pot = Rp 10,000"]
        },
        defaultFindings: {
          step3to4: ["Perimeter of backyard = Perimeter of trapezoid"]
        }
      },
      
      // Final answer
      finalAnswer: "The total money needed to buy all the pots is Rp 34,0000.",
      
      // Steps configuration
      steps: {
        // Step 0: Initial comprehend - question display only
        0: {
          questionText: "Read the question and identify 'given' and 'to find'.",
          navText: "Tap » to identify 'given' information.",
          isComprehendQuestion: true,
          nextEnabled: true,
          hideVisualPanel: true
        },
        // Step 1: Comprehend with substeps (Given/To Find)
        1: {
          questionText: "Dinda's backyard is shaped like an isosceles trapezoid with dimensions given in the image. Flower pots will be placed all around the boundary of the yard with a distance of 50 cm between pots. If the price per pot is Rp10000, how much money is needed to buy all the pots?",
          navText: "Tap » to identify 'given' information.",
          navToFind: "Tap » to identify what we need 'to find'.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compre1.png",
          isComprehend: true,
          isSubstepComprehend: true,
          nextEnabled: false
        },
        // Step 2: Splash screen
        2: {
          questionText: "",
          navText: "Tap » to continue.",
          isSplash: true,
          splashKey: "step2",
          nextEnabled: true
        },
        // Step 3: MCQ + Calculation Panel (boundary question)
        3: {
          questionText: "Let's see what the boundary around the backyard represents.",
          navText: "Tap the correct answer.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compute1.png",
          isMcq: true,
          mcqKey: "mcq1",
          isCalculation: true,
          calcKey: "calc1",
          nextEnabled: false
        },
        // Step 4: MCQ (perimeter definition)
        4: {
          questionText: "Let's find the perimeter",
          navText: "Tap the correct answer.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compute1.png",
          isMcq: true,
          mcqKey: "mcq2",
          isCalculation: true,
          calcKey: "calc1",
          nextEnabled: false
        },
        // Step 5: Interactive boxes (Perimeter calculation - 4 boxes)
        5: {
          questionText: "Let's find the perimeter",
          navText: "Tap the highlighted boxes to substitute the values.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compute1.png",
          isInteractiveBoxes: true,
          calcKey: "calc1",
          isPerimeterBoxes: true,
          nextEnabled: false
        },
        // Step 6: Numpad (Perimeter result)
        6: {
          questionText: "Let's find the perimeter",
          navText: "Use the numpad to fill the answer and click ✓ to check.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compute1.png",
          isNumpad: true,
          calcKey: "calc1",
          nextEnabled: false
        },
        // Step 7: Drag and Drop (Number of pots)
        7: {
          questionText: "Number of Pots = numbers of equal gaps, now complete the math sentence.",
          navText: "Drag the correct buttons to the correct spot in the sentence.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compre7.png",
          isDragDrop: true,
          dragDropKey: "dragDrop1",
          nextEnabled: false
        },
        // Step 8: Calculation with numpad (1700 ÷ 50)
        8: {
          questionText: "Number of Pots = numbers of equal gaps, now complete the math sentence.",
          navText: "Use the numpad to fill the answer and click ✓ to check.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compre7.png",
          isNumpad: true,
          calcKey: "calc2",
          numpadStep: 1,
          nextEnabled: false
        },
        // Step 9: Numpad (Number of pots result)
        9: {
          questionText: "Number of Pots = numbers of equal gaps, now complete the math sentence.",
          navText: "Use the numpad to fill the answer and click ✓ to check.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compre7.png",
          isNumpad: true,
          calcKey: "calc2",
          numpadStep: 2,
          nextEnabled: false
        },
        // Step 10: MCQ (Total cost method)
        10: {
          questionText: "Number of Pots = numbers of equal gaps, now complete the math sentence.",
          navText: "Tap the correct answer.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compre7.png",
          isMcq: true,
          mcqKey: "mcq3",
          isCalculation: true,
          calcKey: "calc2",
          nextEnabled: false
        },
        // Step 11: Drag and Drop (Total cost)
        11: {
          questionText: "Number of Pots = numbers of equal gaps, now complete the math sentence.",
          navText: "Drag the correct buttons to the correct spot in the sentence.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compre7.png",
          isDragDrop: true,
          dragDropKey: "dragDrop2",
          nextEnabled: false
        },
        // Step 12: Interactive boxes (Total cost calculation)
        12: {
          questionText: "Number of Pots = numbers of equal gaps, now complete the math sentence.",
          navText: "Tap the highlighted boxes to substitute the values.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compre7.png",
          isInteractiveBoxes: true,
          calcKey: "calc3",
          nextEnabled: false
        },
        // Step 13: Numpad (Total cost result)
        13: {
          questionText: "Number of Pots = numbers of equal gaps, now complete the math sentence.",
          navText: "Use the numpad to fill the answer and click ✓ to check.",
          navTextCorrect: "Tap » to continue.",
          image: "assets/compre7.png",
          isNumpad: true,
          calcKey: "calc3",
          nextEnabled: false
        },
        // Step 14: Final step
        14: {
          questionText: "Activity Completed!",
          navText: "Tap 'Restart' to restart the activity",
          image: "assets/compre7.png",
          isFinalStep: true,
          nextEnabled: true
        }
      },
      labels: {
        given: "Given",
        toFind: "To Find",
        findings: "Findings"
      },
    },
  },
  
};

const APP_DATA = DATA[current_language].app;
const decimalSymbol = decimal[current_language];
