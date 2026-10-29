// Get the elements we need to update
const display = document.getElementById("display");
const history = document.getElementById("history");

// Calculator memory
let currentNumber = "";   // the number being typed
let previousNumber = "";  // the number typed before the operator
let operator = "";        // + - * / %

// Show the current number on the screen
function updateDisplay() {
  if (currentNumber === "") {
    display.textContent = "0";
  } else {
    display.textContent = currentNumber;
  }

  if (operator !== "") {
    history.textContent = previousNumber + " " + operator;
  } else {
    history.textContent = "";
  }
}

// Called when a number or the dot is pressed
function addNumber(value) {
  // Only allow one dot in a number
  if (value === "." && currentNumber.includes(".")) {
    return;
  }
  if (value === "." && currentNumber === "") {
    currentNumber = "0";
  }
  currentNumber = currentNumber + value;
  updateDisplay();
}

// Called when + - * / % is pressed
function chooseOperator(op) {
  if (currentNumber === "" && previousNumber === "") {
    return;
  }

  // If there is already a pending calculation, finish it first
  if (previousNumber !== "" && currentNumber !== "") {
    calculate();
  }

  // Allow changing the operator before typing the second number
  if (currentNumber !== "") {
    previousNumber = currentNumber;
    currentNumber = "";
  }
  operator = op;
  updateDisplay();
}

// Do the math
function calculate() {
  if (previousNumber === "" || currentNumber === "" || operator === "") {
    return;
  }

  const a = parseFloat(previousNumber);
  const b = parseFloat(currentNumber);
  let result;

  if (operator === "+") {
    result = a + b;
  } else if (operator === "-") {
    result = a - b;
  } else if (operator === "*") {
    result = a * b;
  } else if (operator === "/") {
    if (b === 0) {
      showError("Cannot divide by 0");
      return;
    }
    result = a / b;
  } else if (operator === "%") {
    result = a % b;
  }

  // Round to avoid results like 0.30000000000000004
  result = Math.round(result * 10000000000) / 10000000000;

  history.textContent = previousNumber + " " + operator + " " + currentNumber + " =";
  currentNumber = String(result);
  previousNumber = "";
  operator = "";
  display.textContent = currentNumber;
}

function showError(message) {
  clearAll();
  display.textContent = message;
}

// Remove the last digit
function deleteLast() {
  currentNumber = currentNumber.slice(0, -1);
  updateDisplay();
}

// Reset everything
function clearAll() {
  currentNumber = "";
  previousNumber = "";
  operator = "";
  updateDisplay();
}

// Keyboard support
document.addEventListener("keydown", function (event) {
  const key = event.key;

  if (key >= "0" && key <= "9") {
    addNumber(key);
  } else if (key === ".") {
    addNumber(".");
  } else if (key === "+" || key === "-" || key === "*" || key === "/" || key === "%") {
    chooseOperator(key);
  } else if (key === "Enter" || key === "=") {
    calculate();
  } else if (key === "Backspace") {
    deleteLast();
  } else if (key === "Escape") {
    clearAll();
  }
});
