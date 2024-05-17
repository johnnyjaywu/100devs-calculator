document
  .querySelectorAll("button")
  .forEach((button) => button.addEventListener("click", onButton));

document.addEventListener("keydown", onKey);

const inputField = document.querySelector("input");
inputField.addEventListener("input", onInput);

const h2 = document.querySelector("h2");

function onButton(event) {
  let button = event.target.id;
  inputField.value += button;
  inputField.dispatchEvent(new Event("input"));

  if (button === "=") {
    onEqualOrEnter();
  }
}

function onKey(event) {
  document.querySelector("input").focus();
  if (event.key === "Enter") {
    onEqualOrEnter();
  }
}

function onInput(event) {
  event.target.value = calculator.processInput(event.target.value);
  h2.innerHTML = !isNaN(calculator.result) ? calculator.result : "";
}

function onEqualOrEnter() {
  h2.innerHTML = "";
  inputField.value = calculator.evaluate();
}

// ====================================================================================================
// CALCULATOR
// ====================================================================================================
let calculator = new Calculator();

function Calculator() {
  this.result;
  this.entries = [];

  this.processInput = function (input) {
    let filtered = filter(input);
    console.log(this.entries);
    this.result = _evaluate();
    return filtered;
  };

  this.evaluate = function () {
    let result = _evaluate();
    
    // TODO: handle consecutive evaluation

    this.entries = [];
    this.result = undefined;

    return result;
  };

  this.reset = function () {
    this.entries = [];
    this.result = undefined;
  };

  this.operators = {
    "+": function (a, b) {
      return a + b;
    },
    "-": function (a, b) {
      return a - b;
    },
    "*": function (a, b) {
      return a * b;
    },
    "/": function (a, b) {
      return a / b;
    },
  };

  hasOperator = (str) => {
    return str.split("").some((char) => isOperator(char));
  };

  isOperator = (op) => {
    return Object.keys(this.operators).includes(op);
  };

  _evaluate = () => {
    let operator;
    return this.entries.reduce((accumulator, currentValue) => {
      // keep track of the last operator
      if (isOperator(currentValue)) {
        operator = currentValue;
      }
      // try to operate if there is an operator
      else {
        accumulator = operator
          ? this.operators[operator](accumulator, parseFloat(currentValue))
          : parseFloat(currentValue);
      }
      return accumulator;
    }, 0);
  };

  filter = (input) => {
    
    let lastChar = input.slice(-1);
    let lastEntry = this.entries.at(-1);
    
    // if input length is less than entry (i.e. 'backspace' was pressed)
    if (input.length < this.entries.join('').length) {
      // if last entry is an operator, remove the last entry
      if (isOperator(lastEntry)) {
        this.entries.pop();
      }
      // if not, just remove the last character of the entry
      else {
        this.entries[this.entries.length - 1] = lastEntry.slice(0, -1);
        if (this.entries.at(-1) === '') {
          this.entries.pop();
        }
      }
      return this.entries.join("");
    }
    
    // check if the last character is an operator
    if (isOperator(lastChar)) {
      // check if current entries is not empty
      if (this.entries.length > 0) {
        // check if last entry is an operator
        if (isOperator(lastEntry)) {
          // replace it
          this.entries[this.entries.length - 1] = lastChar;
        }
        // if not, add the operator as a new entry
        else {
          this.entries.push(lastChar);
        }
      }
      else {
        // check if the input has a number (i.e. after = has been pressed)
        if (!isNaN(input.slice(0, -1))) {
          this.entries.push(input.slice(0, -1));
          this.entries.push(lastChar);
        }
      }
    }
    // check if it's a decimal
    else if (lastChar === ".") {
      // check if last current entry is empty or my last entry is an operator
      if (this.entries.length == 0 || isOperator(lastEntry)) {
        // add 0.
        this.entries.push("0.");
      }
      // check if my last entry has NO decimal (i.e. this is the first decimal)
      // *at this point, we know the last entry is a number
      else if (!lastEntry.includes(".")) {
        // add the decimal
        this.entries[this.entries.length - 1] += lastChar;
      }
    }
    // check if it's a number
    else if (!isNaN(lastChar)) {
      // if entries empty
      if (this.entries.length == 0) {
        this.entries.push(lastChar);
      } else {
        // check if last entry is an operator
        if (isOperator(lastEntry)) {
          // add new entry
          this.entries.push(lastChar);
        }
        // otherwise, append to the last entry
        else {
          // if the last entry is a 0, replace it
          if (lastEntry === '0') {
            this.entries.splice(-1, lastChar);
          } else {
            this.entries[this.entries.length - 1] += lastChar;
          }
        }
      }
    }

    return this.entries.join("");
  };
}
