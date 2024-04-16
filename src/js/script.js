// ELEMENTS

const submitFormBtnEl = document.getElementById("submitFormBtn");
const formEl = document.getElementById("form");
const stpesListEl = document.getElementById("stepsList");

// FUNCTIONS

class App {
  step = 1;

  constructor() {
    // ATTACH EVENT HANDLERS
    submitFormBtnEl.addEventListener(
      "click",
      function () {
        const inputEls = [...formEl.querySelectorAll("input")];
        const inputVals = inputEls.map((inp) => inp.value);
        let isFromValid = true;

        // Clear all input errors
        inputEls.forEach((inp) => this.removeErrorInput(inp));

        // Check if the inputs value are formatted or not
        if (!this.checkEmail(inputVals[1])) {
          this.rederErrorInput(inputEls[1], "Invalid email");
          isFromValid = false;
        }

        // Check if it is number
        if (!this.checkPhone(inputVals[2])) {
          this.rederErrorInput(inputEls[2], "Should only contain number");
          isFromValid = false;
        }

        // Check if inputs are empty or not
        inputVals.forEach((val, i) => {
          if (val === "") {
            this.rederErrorInput(inputEls[i], "This field is required");
            isFromValid = false;
          }
        });

        if (isFromValid) {
          // Go to next step
          this.GoToNextStep();
        }
      }.bind(this)
    );
  }

  rederErrorInput(input, msg) {
    input.style.borderColor = "hsl(354, 84%, 57%)";
    const errorEl = input
      .closest("div")
      .querySelector("span")
      .querySelector("span");
    errorEl.textContent = msg;
  }

  removeErrorInput(input) {
    input.style.borderColor = "hsl(229, 24%, 87%)";
    const errorEl = input
      .closest("div")
      .querySelector("span")
      .querySelector("span");
    errorEl.textContent = "";
  }

  // It needs to be improved later, for now it just checks if the string is seperated by @
  checkEmail(str) {
    // example@email.com

    const [prefix, domain] = str.split("@");
    if (!prefix || !domain) return false;
    return true;
  }
  // It needs to be improved later, for now it just check if the input is a positive number
  checkPhone(num) {
    if (!Number.isFinite(+num) || !(+num > -1)) return false;
    return true;
  }

  GoToNextStep() {
    const prevStepNumEl = stpesListEl.querySelector(
      `[data-step="${this.step}"]`
    );
    prevStepNumEl.classList.remove("step-item-active");

    const prevStepSecEl = document.querySelector(`section[data-step="${this.step}"]`);
    prevStepSecEl.classList.add("hidden");
    console.log(prevStepSecEl)


    this.step++;


    const nextStepSecEl = document.querySelector(`section[data-step="${this.step}"]`);
    nextStepSecEl.classList.remove("hidden");
    console.log(nextStepSecEl)


    const nextStepNumEl = stpesListEl.querySelector(
      `[data-step="${this.step}"]`
    );
    nextStepNumEl.classList.add("step-item-active");
  }
}

const app = new App();
