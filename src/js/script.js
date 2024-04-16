// ELEMENTS

const submitFormBtnEl = document.getElementById("submitFormBtn");
const formEl = document.getElementById("form");
const stpesListEl = document.getElementById("stepsList");
const changePlanTermBtnEl = document.getElementById("changePlanTermBtn");
const planListEl = document.getElementById("planList");
const planNextStepBtnEl = document.getElementById("planNextStepBtn");
// FUNCTIONS

class App {
  step = 1;
  planTerm = "yearly";
  constructor() {
    // ATTACH EVENT HANDLERS
    // Submit Form
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
          this.GoToStep(2);
        }
      }.bind(this)
    );

    // Change Plan Time
    changePlanTermBtnEl.addEventListener(
      "click",
      function () {
        const cricle = document.getElementById("circle");
        const [monthlyTextEl, yearlyTextEl] = changePlanTermBtnEl
          .closest("div")
          .querySelectorAll("small");
        const planListItemInfoEls = [...planListEl.querySelectorAll("li div")];

        console.log(monthlyTextEl, yearlyTextEl);

        // Switch to other term option
        this.planTerm = this.planTerm === "yearly" ? "monthly" : "yearly";

        if (this.planTerm === "yearly") {
          cricle.classList.remove("translate-x-[-.53rem]");
          cricle.classList.add("translate-x-[.53rem]");

          monthlyTextEl.classList.remove("text-marineBlue");
          yearlyTextEl.classList.add("text-marineBlue");

          planListItemInfoEls.forEach((item) => {
            item.querySelector("span:nth-child(3)").style.display = "inline";
            item
              .querySelector("span:nth-child(2)")
              .querySelector("span").textContent =
              +item.querySelector("span:nth-child(2)").querySelector("span")
                .textContent * 10;
          });
        }
        if (this.planTerm === "monthly") {
          cricle.classList.remove("translate-x-[.53rem]");
          cricle.classList.add("translate-x-[-.53rem]");

          monthlyTextEl.classList.add("text-marineBlue");
          yearlyTextEl.classList.remove("text-marineBlue");

          planListItemInfoEls.forEach((item) => {
            item.querySelector("span:nth-child(3)").style.display = "none";
            item
              .querySelector("span:nth-child(2)")
              .querySelector("span").textContent =
              +item.querySelector("span:nth-child(2)").querySelector("span")
                .textContent / 10;
          });
        }
      }.bind(this)
    );

    // Selecet Plan
    planListEl.addEventListener("click", function (e) {
      const planEl = e.target.closest("li");
      const planListItemEls = planListEl.querySelectorAll("li");
      if (!planEl) return;
      planListItemEls.forEach((plan) =>
        plan.classList.remove("plan-item-active")
      );
      planEl.classList.add("plan-item-active");
    });

    // Go to 3rd step
    planNextStepBtnEl.addEventListener("click" , function(){
      this.GoToStep(3)
    }.bind(this))

    

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

  GoToStep(step) {
    const prevStepNumEl = stpesListEl.querySelector(
      `[data-step="${this.step}"]`
    );
    prevStepNumEl.classList.remove("step-item-active");

    const prevStepSecEl = document.querySelector(
      `section[data-step="${this.step}"]`
    );
    prevStepSecEl.classList.add("hidden");
    console.log(prevStepSecEl);

    this.step = step;

    const nextStepSecEl = document.querySelector(
      `section[data-step="${this.step}"]`
    );
    nextStepSecEl.classList.remove("hidden");
    console.log(nextStepSecEl);

    const nextStepNumEl = stpesListEl.querySelector(
      `[data-step="${this.step}"]`
    );
    nextStepNumEl.classList.add("step-item-active");
  }
}

const app = new App();
