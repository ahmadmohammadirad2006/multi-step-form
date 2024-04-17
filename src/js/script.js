// ELEMENTS

const stpesListEl = document.getElementById("stepsList");

const formEl = document.getElementById("form");
const formInputEls = [...formEl.querySelectorAll("input")];

const submitFormBtnEl = document.getElementById("submitFormBtn");

const planListEl = document.getElementById("planList");
const planNextStepBtnEl = document.getElementById("planNextStepBtn");
const planListItemEls = [...planListEl.querySelectorAll("li")];
const planListItemInfoEls = [...document.querySelectorAll(".plan-info")];
const togglePlanTermBtnEl = document.getElementById("togglePlanTermBtn");
const [monthlyTextEl, yearlyTextEl] = togglePlanTermBtnEl
  .closest("div")
  .querySelectorAll(".term-option");
const cricleEl = document.getElementById("circle");

const goBackBtnEls = document.querySelectorAll(".go-back-btn");

// FUNCTIONS

// DATA
const plansPrice = {
  arcade: {
    monthly: 9,
    yearly: 90,
  },
  advanced: {
    monthly: 12,
    yearly: 120,
  },
  pro: {
    monthly: 15,
    yearly: 150,
  },
};

class App {
  step = 1;
  planTerm = "yearly";
  selectedPlan = {
    type: "",
    term: "",
    price: "",
  };
  constructor() {
    // ATTACH EVENT HANDLERS

    // Submit Form
    submitFormBtnEl.addEventListener("click", this.submitForm.bind(this));

    // Change Plan Term
    togglePlanTermBtnEl.addEventListener(
      "click",
      this.togglePlanTerm.bind(this)
    );

    // Selecet Plan
    planListEl.addEventListener("click", this.selectPlan);

    // Submit Plan
    planNextStepBtnEl.addEventListener("click", this.submitPlan.bind(this));

    // Go Previous Step
    goBackBtnEls.forEach((el) =>
      el.addEventListener("click", this.goToPrevStep.bind(this))
    );
  }

  submitForm() {
    const inputVals = formInputEls.map((inp) => inp.value);
    let isFromValid = true;

    // Clear all input errors
    this.clearInputErrors(formInputEls);

    // Check if the email input value is formatted or not
    if (!this.checkEmail(inputVals[1])) {
      this.rederErrorInput(formInputEls[1], "Invalid email");
      isFromValid = false;
    }

    // Check if it is number
    if (!this.checkPhone(inputVals[2])) {
      this.rederErrorInput(formInputEls[2], "Should only contain number");
      isFromValid = false;
    }

    // Check if inputs are empty or not
    inputVals.forEach((val, i) => {
      if (val === "") {
        this.rederErrorInput(formInputEls[i], "This field is required");
        isFromValid = false;
      }
    });

    if (isFromValid) {
      // Go to next step
      this.goToStep(2);
    }
  }

  clearInputErrors(inputs) {
    inputs.forEach((inp) => this.removeErrorInput(inp));
  }

  togglePlanTerm() {
    // Switch to other term option
    this.planTerm = this.planTerm === "yearly" ? "monthly" : "yearly";

    this.switchCirclePosition();
    this.activateTermOptionText();
    this.changeEachPlanInfo();
  }

  // Switch circle position based on plan term
  switchCirclePosition() {
    cricleEl.classList.remove(
      `translate-x-[${this.planTerm === "yearly" ? "-" : ""}.53rem]`
    );
    cricleEl.classList.add(
      `translate-x-[${this.planTerm === "yearly" ? "" : "-"}.53rem]`
    );
  }
  // Activate term option text based on plan term
  activateTermOptionText() {
    if (this.planTerm === "monthly") {
      monthlyTextEl.classList.add("text-marineBlue");
      yearlyTextEl.classList.remove("text-marineBlue");
    }
    if (this.planTerm === "yearly") {
      monthlyTextEl.classList.remove("text-marineBlue");
      yearlyTextEl.classList.add("text-marineBlue");
    }
  }
  // Change each plan info based on plan term
  changeEachPlanInfo() {
    planListItemInfoEls.forEach((item) => {
      item.querySelector("span:nth-child(3)").style.display =
        this.planTerm === "yearly" ? "inline" : "none";
      item.querySelector("span:nth-child(2)").innerHTML = `
        $<span>${
          this.planTerm === "yearly"
            ? +item.querySelector("span:nth-child(2)").querySelector("span")
                .textContent * 10
            : +item.querySelector("span:nth-child(2)").querySelector("span")
                .textContent / 10
        }</span>/${this.planTerm === "yearly" ? "yr" : "mo"}
        `;
    });
  }

  selectPlan(e) {
    const planEl = e.target.closest("li");

    if (!planEl) return;
    planListItemEls.forEach((plan) =>
      plan.classList.remove("plan-item-active")
    );
    planEl.classList.add("plan-item-active");
  }

  submitPlan() {
    const selectedPlanEl = document.querySelector(".plan-item-active");
    const selectedPlanType = selectedPlanEl.dataset.type;
    const selectedPlanPrice =
      plansPrice[`${selectedPlanType}`][`${this.planTerm}`];

    this.selectedPlan = {
      type: selectedPlanType,
      term: this.planTerm,
      price: selectedPlanPrice,
    };

    console.log(this.selectedPlan);
    this.goToStep(3);
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

  goToPrevStep() {
    this.goToStep(this.step - 1);
  }

  goToStep(step) {
    const prevStepNumEl = stpesListEl.querySelector(
      `[data-step="${this.step}"]`
    );
    prevStepNumEl.classList.remove("step-item-active");

    const prevStepSecEl = document.querySelector(
      `section[data-step="${this.step}"]`
    );
    prevStepSecEl.classList.add("hidden");

    this.step = step;

    const nextStepSecEl = document.querySelector(
      `section[data-step="${this.step}"]`
    );
    nextStepSecEl.classList.remove("hidden");

    const nextStepNumEl = stpesListEl.querySelector(
      `[data-step="${this.step}"]`
    );
    nextStepNumEl.classList.add("step-item-active");
  }
}

const app = new App();
