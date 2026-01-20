const MainCanvas = ({
  question,
  step,
  onAnswerSubmit,
  onTransferComplete,
  onTransferClick,
  onSolveVisually,
  transfersDone,
  isAnswerCorrect,
}) => {
  const { useState, useEffect, useRef } = React;

  const { total, box_count, result, remainder, type } = question;
  const questionType = type || 1; // Default type is 1

  // State for division sentence inputs
  const [divisionInputs, setDivisionInputs] = useState({
    divisor: "",
    quotient: "",
    remainder: "",
  });
  const [activeInputBox, setActiveInputBox] = useState("divisor"); // "divisor", "quotient", "remainder"
  const [inputValidation, setInputValidation] = useState({
    divisor: null, // null, true (correct), false (wrong)
    quotient: null,
    remainder: null,
  });
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  // State for pyramid coins
  const [pyramidRows, setPyramidRows] = useState([]);
  const [pyramidCoinsState, setPyramidCoinsState] = useState([]); // Array of {index, filled}

  // State for boxes
  const [boxes, setBoxes] = useState(
    Array(box_count)
      .fill(null)
      .map(() => Array(questionType === 2 ? result : 6).fill(false)) // result coins per box for type 2, 6 for type 1
  );

  // State for visible boxes (type 2 only - show boxes one by one)
  const [visibleBoxes, setVisibleBoxes] = useState(
    questionType === 2 ? 1 : box_count
  );

  // State for transfer animation
  const [isTransferring, setIsTransferring] = useState(false);
  const [showLeftovers, setShowLeftovers] = useState(false);
  const [isTransferComplete, setIsTransferComplete] = useState(false);

  // Refs
  const pyramidRef = useRef(null);
  const boxRefs = useRef([]);

  // Update boxRefs when box_count changes
  useEffect(() => {
    boxRefs.current = Array(box_count)
      .fill(null)
      .map((_, idx) => boxRefs.current[idx] || React.createRef());
  }, [box_count]);

  // Initialize pyramid when question changes
  useEffect(() => {
    if (step === 2) {
      const rows = pyramidCoins(total);
      setPyramidRows(rows);
      // Create pyramid coins array
      const coins = [];
      let coinIndex = 0;
      rows.forEach((rowCount) => {
        for (let i = 0; i < rowCount; i++) {
          coins.push({ index: coinIndex, filled: true });
          coinIndex++;
        }
      });
      setPyramidCoinsState(coins);
      setBoxes(
        Array(box_count)
          .fill(null)
          .map(() => Array(questionType === 2 ? result : 6).fill(false))
      );
      setVisibleBoxes(questionType === 2 ? 1 : box_count); // Show one box for type 2, all for type 1
      setShowLeftovers(false);
      setIsTransferComplete(false); // Reset when entering step 2
      setIsTransferring(false); // Reset transfer state when question changes

      // Safety check: if there aren't enough coins for even one transfer, enable numpad immediately
      // (This shouldn't happen in normal flow, but handle edge cases)
      if (total < box_count) {
        setIsTransferComplete(true);
        setShowLeftovers(true);
      }
    }
  }, [step, total, box_count, questionType, result]);

  // Reset division inputs when question changes or step changes
  useEffect(() => {
    if (step === 1) {
      setDivisionInputs({ divisor: "", quotient: "", remainder: "" });
      setActiveInputBox("divisor");
      setInputValidation({ divisor: null, quotient: null, remainder: null });
      setIsSubmitDisabled(true);
      setIsTransferComplete(false);
      setIsTransferring(false); // Reset transfer state when question changes
    } else if (step === 2 && !isTransferComplete) {
      // When entering step 2 (Solve Visually clicked), remove active highlight
      setActiveInputBox(null);
      setIsTransferring(false); // Reset transfer state
    }
  }, [step, question]);

  // Check if all inputs are filled
  useEffect(() => {
    if (step === 1 || (step === 2 && isTransferComplete)) {
      const allFilled =
        divisionInputs.divisor !== "" &&
        divisionInputs.quotient !== "" &&
        divisionInputs.remainder !== "";
      setIsSubmitDisabled(!allFilled);
    }
  }, [divisionInputs, step, isTransferComplete]);

  // Handle numpad input
  const handleNumpadClick = (num) => {
    const canInput =
      (step === 1 && !isAnswerCorrect) ||
      (step === 2 && isTransferComplete && !isAnswerCorrect);

    if (!canInput) return;

    // Find next available box if current is correct
    let targetBox = activeInputBox;
    if (activeInputBox === "divisor" && inputValidation.divisor === true) {
      if (inputValidation.quotient !== true) {
        targetBox = "quotient";
      } else if (inputValidation.remainder !== true) {
        targetBox = "remainder";
      } else {
        return; // All boxes correct, do nothing
      }
    } else if (
      activeInputBox === "quotient" &&
      inputValidation.quotient === true
    ) {
      if (inputValidation.remainder !== true) {
        targetBox = "remainder";
      } else {
        return; // All boxes correct, do nothing
      }
    } else if (
      activeInputBox === "remainder" &&
      inputValidation.remainder === true
    ) {
      return; // All boxes correct, do nothing
    }

    // Update active box if needed
    if (targetBox !== activeInputBox) {
      setActiveInputBox(targetBox);
    }

    playSound("click");

    // Remove wrong highlight when inputting
    setInputValidation((prev) => {
      const newValidation = { ...prev };
      if (targetBox === "divisor" && prev.divisor === false) {
        newValidation.divisor = null;
      } else if (targetBox === "quotient" && prev.quotient === false) {
        newValidation.quotient = null;
      } else if (targetBox === "remainder" && prev.remainder === false) {
        newValidation.remainder = null;
      }
      return newValidation;
    });

    setDivisionInputs((prev) => {
      const newInputs = { ...prev };
      // Replace instead of append (max 1 digit)
      if (targetBox === "divisor") {
        newInputs.divisor = num;
      } else if (targetBox === "quotient") {
        newInputs.quotient = num;
      } else if (targetBox === "remainder") {
        newInputs.remainder = num;
      }
      return newInputs;
    });

    // Auto-move to next box
    if (targetBox === "divisor") {
      if (inputValidation.quotient !== true) {
        setActiveInputBox("quotient");
      } else if (inputValidation.remainder !== true) {
        setActiveInputBox("remainder");
      } else {
        setActiveInputBox(null); // Remove highlight if all boxes are correct
      }
    } else if (targetBox === "quotient") {
      if (inputValidation.remainder !== true) {
        setActiveInputBox("remainder");
      } else {
        setActiveInputBox(null); // Remove highlight if last box
      }
    } else if (targetBox === "remainder") {
      setActiveInputBox(null); // Remove highlight on last box
    }
  };

  const handleClear = () => {
    const canClear =
      (step === 1 && !isAnswerCorrect) ||
      (step === 2 && isTransferComplete && !isAnswerCorrect);

    if (!canClear) return;

    // Don't clear if box is correct
    if (activeInputBox === "divisor" && inputValidation.divisor === true)
      return;
    if (activeInputBox === "quotient" && inputValidation.quotient === true)
      return;
    if (activeInputBox === "remainder" && inputValidation.remainder === true)
      return;

    playSound("click");

    // Remove wrong highlight when clearing
    setInputValidation((prev) => {
      const newValidation = { ...prev };
      if (activeInputBox === "divisor" && prev.divisor === false) {
        newValidation.divisor = null;
      } else if (activeInputBox === "quotient" && prev.quotient === false) {
        newValidation.quotient = null;
      } else if (activeInputBox === "remainder" && prev.remainder === false) {
        newValidation.remainder = null;
      }
      return newValidation;
    });

    setDivisionInputs((prev) => {
      const newInputs = { ...prev };
      if (activeInputBox === "divisor") {
        newInputs.divisor = "";
      } else if (activeInputBox === "quotient") {
        newInputs.quotient = "";
      } else if (activeInputBox === "remainder") {
        newInputs.remainder = "";
      }
      return newInputs;
    });
  };

  const handleSubmit = () => {
    if (step === 1 || (step === 2 && isTransferComplete)) {
      // For type 2: first box = result, second box = box_count
      // For type 1: first box = box_count, second box = result
      const divisorCorrect =
        questionType === 2
          ? parseInt(divisionInputs.divisor) === result
          : parseInt(divisionInputs.divisor) === box_count;
      const quotientCorrect =
        questionType === 2
          ? parseInt(divisionInputs.quotient) === box_count
          : parseInt(divisionInputs.quotient) === result;
      const remainderCorrect = parseInt(divisionInputs.remainder) === remainder;

      const allCorrect = divisorCorrect && quotientCorrect && remainderCorrect;

      setInputValidation({
        divisor: divisorCorrect,
        quotient: quotientCorrect,
        remainder: remainderCorrect,
      });

      if (allCorrect) {
        playSound("correct");
        if (onAnswerSubmit) onAnswerSubmit(true);
      } else {
        playSound("wrong");
        if (onAnswerSubmit) onAnswerSubmit(false);

        // Make the first wrong box active
        if (!divisorCorrect) {
          setActiveInputBox("divisor");
        } else if (!quotientCorrect) {
          setActiveInputBox("quotient");
        } else if (!remainderCorrect) {
          setActiveInputBox("remainder");
        }
      }
    }
  };

  // Handle box click to make it active
  const handleBoxClick = (boxType) => {
    const canClick =
      (step === 1 && !isAnswerCorrect) ||
      (step === 2 && isTransferComplete && !isAnswerCorrect);

    if (!canClick) return;

    // Don't allow clicking if box is correct
    if (boxType === "divisor" && inputValidation.divisor === true) return;
    if (boxType === "quotient" && inputValidation.quotient === true) return;
    if (boxType === "remainder" && inputValidation.remainder === true) return;

    setActiveInputBox(boxType);

    // Remove wrong highlight when clicking
    setInputValidation((prev) => {
      const newValidation = { ...prev };
      if (boxType === "divisor" && prev.divisor === false) {
        newValidation.divisor = null;
      } else if (boxType === "quotient" && prev.quotient === false) {
        newValidation.quotient = null;
      } else if (boxType === "remainder" && prev.remainder === false) {
        newValidation.remainder = null;
      }
      return newValidation;
    });
  };

  // Calculate how many coins are left in pyramid
  const getRemainingCoins = () => {
    if (questionType === 2) {
      // For type 2: transfersDone represents number of boxes filled
      return total - transfersDone * result;
    }
    return total - transfersDone * box_count;
  };

  // Check if more transfers are possible
  const canTransferMore = () => {
    if (questionType === 2) {
      // For type 2: need at least "result" coins to fill one box
      return getRemainingCoins() >= result;
    }
    return getRemainingCoins() >= box_count;
  };

  // Handle transfer coins button click
  const handleTransferCoins = () => {
    if (step === 2 && !isTransferring && canTransferMore()) {
      playSound("click");
      setIsTransferring(true);

      const coinsToTransfer = questionType === 2 ? result : box_count;

      // Find top coins from pyramid (from bottom, filled ones)
      const filledCoins = [];
      for (let i = pyramidCoinsState.length - 1; i >= 0; i--) {
        if (pyramidCoinsState[i].filled) {
          filledCoins.push(i);
          if (filledCoins.length >= coinsToTransfer) break;
        }
      }

      if (filledCoins.length < coinsToTransfer) {
        setIsTransferring(false);
        return;
      }

      const pyramidContainer = pyramidRef.current;
      if (!pyramidContainer) {
        setIsTransferring(false);
        return;
      }

      // Get pyramid coin elements
      const pyramidCoinElements =
        pyramidContainer.querySelectorAll(".pyramid-coin");
      const coinElementsArray = Array.from(pyramidCoinElements);

      // Get source coin elements
      const sourceCoins = filledCoins
        .map((idx) => coinElementsArray[idx])
        .filter(Boolean);

      if (sourceCoins.length < coinsToTransfer) {
        setIsTransferring(false);
        return;
      }

      // Get target boxes
      const targetBoxes = boxRefs.current
        .map((ref) => ref.current)
        .filter(Boolean);

      if (questionType === 2) {
        // Type 2: Fill one box completely with "result" coins
        const currentBoxIndex = transfersDone; // Which box we're filling
        if (currentBoxIndex >= visibleBoxes) {
          // Need to show next box
          setVisibleBoxes(currentBoxIndex + 1);
        }

        const targetBox = targetBoxes[currentBoxIndex];
        if (!targetBox) {
          setIsTransferring(false);
          return;
        }

        const boxRow = targetBox.querySelector(".box-row");
        if (!boxRow) {
          setIsTransferring(false);
          return;
        }

        // Get all empty positions in this box
        const allChildren = Array.from(boxRow.children);
        const targetPositions = [];
        for (let i = 0; i < result; i++) {
          if (allChildren[i]) {
            targetPositions.push({
              boxIdx: currentBoxIndex,
              coinIdx: i,
              element: allChildren[i],
            });
          }
        }

        if (targetPositions.length < coinsToTransfer) {
          setIsTransferring(false);
          return;
        }

        // Animate coins - all start together, no stagger
        let completedAnimations = 0;
        const updatedBoxes = [...boxes];

        // Calculate remaining coins after this transfer
        const remainingAfterTransfer = getRemainingCoins() - result;
        const willBeLastTransfer = remainingAfterTransfer < result;

        sourceCoins.forEach((sourceCoin, idx) => {
          const target = targetPositions[idx];
          if (!target) return;

          // Change source coin to outline before animation
          sourceCoin.src = "assets/outline.png";

          // Animate
          animateCoin(sourceCoin, target.element, () => {
            updatedBoxes[target.boxIdx][target.coinIdx] = true;

            completedAnimations++;
            if (completedAnimations === coinsToTransfer) {
              setBoxes(updatedBoxes);

              // Update pyramid coins state
              setPyramidCoinsState((prev) => {
                const newPyramid = [...prev];
                filledCoins.forEach((coinIdx) => {
                  newPyramid[coinIdx].filled = false;
                });
                return newPyramid;
              });

              setIsTransferring(false);

              // Update transfersDone AFTER animation completes
              setTimeout(() => {
                if (onTransferClick) onTransferClick();

                // Check if we need to show next box (if there are more coins)
                // Calculate remaining after this transfer (transfersDone will be updated)
                const remainingAfter = total - (transfersDone + 1) * result;
                if (
                  remainingAfter >= result &&
                  currentBoxIndex + 1 < box_count
                ) {
                  // Show next box if there are enough coins for another box
                  setVisibleBoxes(Math.min(currentBoxIndex + 2, box_count));
                }
              }, 100);

              // Check if transfers are complete
              if (willBeLastTransfer) {
                setShowLeftovers(true);
                setIsTransferComplete(true);
                if (onTransferComplete) onTransferComplete();

                // Validate all answers
                const divisorVal =
                  divisionInputs.divisor &&
                  parseInt(divisionInputs.divisor) === result;
                const quotientVal =
                  divisionInputs.quotient &&
                  parseInt(divisionInputs.quotient) === box_count;
                const remainderVal =
                  divisionInputs.remainder &&
                  parseInt(divisionInputs.remainder) === remainder;
                const allCorrect = divisorVal && quotientVal && remainderVal;

                setInputValidation({
                  divisor: divisorVal,
                  quotient: quotientVal,
                  remainder: remainderVal,
                });

                if (allCorrect) {
                  if (onAnswerSubmit) onAnswerSubmit(true);
                  setActiveInputBox(null);
                } else {
                  if (!divisorVal) {
                    setActiveInputBox("divisor");
                  } else if (!quotientVal) {
                    setActiveInputBox("quotient");
                  } else if (!remainderVal) {
                    setActiveInputBox("remainder");
                  }
                }
              }
            }
          });
        });
      } else {
        // Type 1: Original logic - distribute coins across all boxes
        if (targetBoxes.length < box_count) {
          setIsTransferring(false);
          return;
        }

        // Get target coin positions (next empty position in each box)
        const targetPositions = [];
        boxes.forEach((box, boxIdx) => {
          const nextEmptyIndex = box.findIndex((filled) => !filled);
          if (nextEmptyIndex !== -1) {
            const boxElement = targetBoxes[boxIdx];
            const boxRow = boxElement.querySelector(".box-row");
            if (boxRow) {
              const allChildren = Array.from(boxRow.children);
              if (allChildren[nextEmptyIndex]) {
                targetPositions.push({
                  boxIdx,
                  coinIdx: nextEmptyIndex,
                  element: allChildren[nextEmptyIndex],
                });
              }
            }
          }
        });

        if (targetPositions.length < box_count) {
          setIsTransferring(false);
          return;
        }

        // Animate coins - all start together, no stagger
        let completedAnimations = 0;
        const updatedBoxes = [...boxes];

        // Calculate remaining coins after this transfer (accounting for transfersDone increment)
        // After this transfer, transfersDone will be transfersDone + 1
        const remainingAfterTransfer = total - (transfersDone + 1) * box_count;
        const willBeLastTransfer = remainingAfterTransfer < box_count;

        sourceCoins.forEach((sourceCoin, idx) => {
          const target = targetPositions[idx];
          if (!target) return;

          // All animations start together - no setTimeout delay
          // Change source coin to outline before animation
          sourceCoin.src = "assets/outline.png";

          // Animate
          animateCoin(sourceCoin, target.element, () => {
            // Update box state for this coin AFTER animation completes
            updatedBoxes[target.boxIdx][target.coinIdx] = true;

            completedAnimations++;
            if (completedAnimations === box_count) {
              // Update boxes state to show coins only after all animations complete
              setBoxes(updatedBoxes);

              // Update pyramid coins state
              setPyramidCoinsState((prev) => {
                const newPyramid = [...prev];
                filledCoins.forEach((coinIdx) => {
                  newPyramid[coinIdx].filled = false;
                });
                return newPyramid;
              });

              setIsTransferring(false);

              // Update transfersDone AFTER animation completes (for type 1)
              setTimeout(() => {
                if (onTransferClick) onTransferClick();
              }, 100);

              // Check if transfers are complete (not enough coins for another full transfer)
              // Use the calculated value instead of canTransferMore() which relies on async prop updates
              if (willBeLastTransfer) {
                setShowLeftovers(true);
                setIsTransferComplete(true);
                if (onTransferComplete) onTransferComplete();

                // Validate all answers
                const divisorVal =
                  divisionInputs.divisor &&
                  parseInt(divisionInputs.divisor) === box_count;
                const quotientVal =
                  divisionInputs.quotient &&
                  parseInt(divisionInputs.quotient) === result;
                const remainderVal =
                  divisionInputs.remainder &&
                  parseInt(divisionInputs.remainder) === remainder;
                const allCorrect = divisorVal && quotientVal && remainderVal;

                // Update validation state
                setInputValidation({
                  divisor: divisorVal,
                  quotient: quotientVal,
                  remainder: remainderVal,
                });

                if (allCorrect) {
                  // All answers correct - enable next button, don't activate numpad
                  if (onAnswerSubmit) onAnswerSubmit(true);
                  setActiveInputBox(null); // Remove highlight
                } else {
                  // Not all correct - activate first incorrect box immediately
                  if (!divisorVal) {
                    setActiveInputBox("divisor");
                  } else if (!quotientVal) {
                    setActiveInputBox("quotient");
                  } else if (!remainderVal) {
                    setActiveInputBox("remainder");
                  }
                }
              }
            }
          });
        });
      }
    }
  };

  // Animate coin from source to destination
  const animateCoin = (sourceElement, destinationElement, callback) => {
    if (!sourceElement || !destinationElement) {
      if (callback) callback();
      return;
    }

    const sourceRect = sourceElement.getBoundingClientRect();
    const destRect = destinationElement.getBoundingClientRect();

    // Clone the source element
    const clone = sourceElement.cloneNode(true);
    clone.src = "assets/coin.png";
    clone.style.position = "fixed";
    clone.style.left = `${sourceRect.left}px`;
    clone.style.top = `${sourceRect.top}px`;
    clone.style.width = `${sourceRect.width}px`;
    clone.style.height = `${sourceRect.height}px`;
    clone.style.zIndex = "10000";
    clone.style.pointerEvents = "none";
    clone.style.margin = "0";
    clone.style.padding = "0";

    document.body.appendChild(clone);

    // Animate using GSAP
    gsap.to(clone, {
      x: destRect.left - sourceRect.left,
      y: destRect.top - sourceRect.top,
      duration: 0.8,
      ease: "none",
      onComplete: () => {
        clone.remove();
        if (callback) callback();
      },
    });
  };

  // Render numpad
  const renderNumpad = (disabled = false) => {
    const buttons = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

    return React.createElement(
      "div",
      { className: `numpad-container ${disabled ? "disabled" : ""}` },
      React.createElement(
        "div",
        { className: "numpad-grid" },
        buttons.map((num) =>
          React.createElement(
            "button",
            {
              key: num,
              className: "numpad-button",
              onClick: () => handleNumpadClick(num),
              disabled: disabled,
            },
            num
          )
        ),
        React.createElement(
          "button",
          {
            className: "numpad-button clear-button",
            onClick: handleClear,
            disabled: disabled,
          },
          "⌫"
        ),
        React.createElement(
          "button",
          {
            className: "numpad-button",
            onClick: () => handleNumpadClick("0"),
            disabled: disabled,
          },
          "0"
        ),
        React.createElement(
          "button",
          {
            className: `numpad-button submit-button ${
              isSubmitDisabled ? "disabled" : ""
            }`,
            onClick: handleSubmit,
            disabled: disabled || isSubmitDisabled,
          },
          "✓"
        )
      )
    );
  };

  // Render division sentence
  const renderDivisionSentence = () => {
    const isDisabled = step === 2 && !isTransferComplete;

    return React.createElement(
      "div",
      { className: "division-sentence-container" },
      React.createElement("div", { className: "division-box filled" }, total),
      React.createElement("div", { className: "division-operator" }, "÷"),
      React.createElement(
        "div",
        {
          className: `division-box ${
            activeInputBox === "divisor" ? "active" : ""
          } ${
            inputValidation.divisor === true
              ? "correct"
              : inputValidation.divisor === false
              ? "wrong"
              : ""
          } ${
            isDisabled || inputValidation.divisor === true ? "disabled" : ""
          }`,
          onClick: () => handleBoxClick("divisor"),
          style:
            inputValidation.divisor === true
              ? { cursor: "default", pointerEvents: "none" }
              : {},
        },
        divisionInputs.divisor || ""
      ),
      React.createElement("div", { className: "division-operator" }, "="),
      React.createElement(
        "div",
        {
          className: `division-box ${
            activeInputBox === "quotient" ? "active" : ""
          } ${
            inputValidation.quotient === true
              ? "correct"
              : inputValidation.quotient === false
              ? "wrong"
              : ""
          } ${
            isDisabled || inputValidation.quotient === true ? "disabled" : ""
          }`,
          onClick: () => handleBoxClick("quotient"),
          style:
            inputValidation.quotient === true
              ? { cursor: "default", pointerEvents: "none" }
              : {},
        },
        divisionInputs.quotient || ""
      ),
      React.createElement(
        "div",
        { className: "division-remainder-label" },
        APP_DATA.common.remainder
      ),
      React.createElement(
        "div",
        {
          className: `division-box ${
            activeInputBox === "remainder" ? "active" : ""
          } ${
            inputValidation.remainder === true
              ? "correct"
              : inputValidation.remainder === false
              ? "wrong"
              : ""
          } ${
            isDisabled || inputValidation.remainder === true ? "disabled" : ""
          }`,
          onClick: () => handleBoxClick("remainder"),
          style:
            inputValidation.remainder === true
              ? { cursor: "default", pointerEvents: "none" }
              : {},
        },
        divisionInputs.remainder || ""
      )
    );
  };

  // Render pyramid
  const renderPyramid = () => {
    if (step !== 2) return null;

    const rows = [];
    let coinIndex = 0;

    pyramidRows.forEach((rowCount, rowIdx) => {
      const row = [];
      for (let i = 0; i < rowCount; i++) {
        const coin = pyramidCoinsState[coinIndex];
        row.push(coin);
        coinIndex++;
      }
      rows.push(row);
    });

    return React.createElement(
      "div",
      { className: "pyramid-container", ref: pyramidRef },
      showLeftovers &&
        React.createElement(
          "div",
          { className: "leftovers-indicator" },
          React.createElement(
            "div",
            { className: "leftovers-label" },
            remainder === 0
              ? APP_DATA.common.noLeftovers
              : APP_DATA.common.leftovers
          ),
          remainder !== 0 &&
            React.createElement("div", { className: "leftovers-arrow" })
        ),
      rows.map((row, rowIdx) =>
        React.createElement(
          "div",
          { key: rowIdx, className: "pyramid-row" },
          row.map((coin) =>
            React.createElement("img", {
              key: coin.index,
              src: coin.filled ? "assets/coin.png" : "assets/outline.png",
              className: "pyramid-coin",
              alt: "coin",
            })
          )
        )
      )
    );
  };

  // Render boxes column
  const renderBoxesColumn = () => {
    if (step !== 2) return null;

    // For type 2, only show visible boxes
    const boxesToShow = questionType === 2 ? visibleBoxes : box_count;

    return boxes.slice(0, boxesToShow).map((boxCoins, boxIdx) =>
      React.createElement(
        "div",
        {
          key: boxIdx,
          className: "box-row-wrapper",
          ref: boxRefs.current[boxIdx],
        },
        React.createElement(
          "div",
          { className: "box-label" },
          APP_DATA.common.boxLabel(boxIdx + 1)
        ),
        React.createElement(
          "div",
          { className: "box-row" },
          boxCoins.map((filled, coinIdx) =>
            filled
              ? React.createElement("img", {
                  key: coinIdx,
                  src: "assets/coin.png",
                  className: "box-coin",
                  alt: "coin",
                })
              : React.createElement("div", {
                  key: coinIdx,
                  className: "box-coin-empty",
                })
          )
        )
      )
    );
  };

  // Render action button
  const renderActionButton = () => {
    if (step === 1) {
      return React.createElement(
        "button",
        {
          className: "action-button",
          onClick: onSolveVisually,
        },
        APP_DATA.buttons.solveVisually
      );
    } else if (step === 2) {
      const disabled = isTransferring || !canTransferMore();
      return React.createElement(
        "button",
        {
          className: `action-button ${disabled ? "disabled" : ""}`,
          onClick: handleTransferCoins,
          disabled: disabled,
        },
        APP_DATA.buttons.transferCoins
      );
    }
    return null;
  };

  // Main render
  return React.createElement(
    "div",
    { className: "main-canvas-container" },
    // Left column (80%)
    React.createElement(
      "div",
      { className: "main-canvas-left-column" },
      // Top row: Division sentence (15% height)
      React.createElement(
        "div",
        { className: "division-sentence-row" },
        renderDivisionSentence()
      ),
      // Bottom row: Visuals (rest of height)
      React.createElement(
        "div",
        {
          className: `visuals-row ${step === 2 ? "visible" : "hidden"}`,
        },
        // Left 50%: Pyramid
        React.createElement(
          "div",
          { className: "visuals-left-column" },
          renderPyramid()
        ),
        // Right 50%: Boxes
        React.createElement(
          "div",
          { className: "visuals-right-column" },
          renderBoxesColumn()
        )
      )
    ),
    // Right column (20%): Numpad and action button
    React.createElement(
      "div",
      { className: "main-canvas-right-column" },
      renderNumpad(
        (step === 1 && isAnswerCorrect) ||
          (step === 2 && (!isTransferComplete || isAnswerCorrect))
      ),
      React.createElement(
        "div",
        { className: "action-button-container" },
        renderActionButton()
      )
    )
  );
};
