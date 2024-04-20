// ELEMENTS

const stpesListEl = document.getElementById("stepsList");

const formEl = document.getElementById("form");
const formInputEls = [...formEl.querySelectorAll("input")];

const submitFormBtnEl = document.getElementById("submitFormBtn");

const planListEl = document.getElementById("planList");
const planItemEls = [...planListEl.querySelectorAll("li")];
const planNextStepBtnEl = document.getElementById("planNextStepBtn");
const planInfoEls = [...document.querySelectorAll(".plan-info")];

const addOnsListEl = document.getElementById("addOnsList");
const labelCheckboxEls = addOnsListEl.querySelectorAll("label")
const addOnsItemEls = [...addOnsListEl.querySelectorAll("li")];
const addOnsNextStepBtnEl = document.getElementById("addOnsNextStepBtn");


const toggleTermBtnEl = document.getElementById("toggleTermBtn");
const [monthlyTextEl, yearlyTextEl] = toggleTermBtnEl
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

const addOnsPrice = {
  onlineService: {
    monthly: 1,
    yearly: 10,
  },
  largerStorage: {
    monthly: 2,
    yearly: 20,
  },
  customizableProfile: {
    monthly: 2,
    yearly: 20,
  },
};

class App {
  step = 1;
  term = "yearly";
  selectedPlan = {
    type: "",
    term: "",
    price: "",
  };
  selectedAddOns = [];
  constructor() {
    // ATTACH EVENT HANDLERS

    // Submit Form
    submitFormBtnEl.addEventListener("click", this.submitForm.bind(this));

    // Change Term
    toggleTermBtnEl.addEventListener("click", this.toggleTerm.bind(this));

    // Selecet Plan
    planListEl.addEventListener("click", this.selectPlan);

    // Submit Plan
    planNextStepBtnEl.addEventListener("click", this.submitPlan.bind(this));

    // Select add-ons
    labelCheckboxEls.forEach(el => {
        el.addEventListener("click", function(e){
          e.preventDefault()
        })
    })

    addOnsListEl.addEventListener("click", this.selectAddOns);
    
    // Submit add-ons
    addOnsNextStepBtnEl.addEventListener("click" , this.submitAddOns.bind(this))

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

  toggleTerm() {
    // Switch to other term option
    this.term = this.term === "yearly" ? "monthly" : "yearly";

    this.switchCirclePosition();
    this.activateTermOptionText();
    this.changeEachPlanInfo();
    this.changeEachAddOnsInfo();
  }

  // Switch circle position based on plan term
  switchCirclePosition() {
    cricleEl.classList.remove(
      `${this.term === "yearly" ? "monthly-side" : "yearly-side"}`
    );
    cricleEl.classList.add(
      `${this.term === "yearly" ? "yearly-side" : "monthly-side"}`
    );
  }
  // Activate term option text based on plan term
  activateTermOptionText() {
    if (this.term === "monthly") {
      monthlyTextEl.classList.add("text-marineBlue");
      yearlyTextEl.classList.remove("text-marineBlue");
    }
    if (this.term === "yearly") {
      monthlyTextEl.classList.remove("text-marineBlue");
      yearlyTextEl.classList.add("text-marineBlue");
    }
  }
  // Change each plan info based on plan term
  changeEachPlanInfo() {
    planItemEls.forEach((item) => {
      const planType = item.dataset.type;
      const planInfo = item.querySelector(".plan-info");

      planInfo.querySelector("span:nth-child(3)").style.display =
        this.term === "yearly" ? "inline" : "none";

      planInfo.querySelector(".plan-price-info").innerHTML = `$${
        plansPrice[`${planType}`][`${this.term}`]
      }/${this.term === "yearly" ? "yr" : "mo"}`;
    });
  }

  changeEachAddOnsInfo() {
    addOnsItemEls.forEach((el) => {
      const addOnsType = el.dataset.type;
      const addOnsPriceInfoEl = el.querySelector(".add-ons-price-info");
      addOnsPriceInfoEl.innerHTML = `+$${
        addOnsPrice[`${addOnsType}`][`${this.term}`]
      }/${this.term === "yearly" ? "yr" : "mo"}`;
    });
  }

  selectPlan(e) {
    const planEl = e.target.closest("li");

    if (!planEl) return;
    planItemEls.forEach((plan) => plan.classList.remove("plan-item-active"));
    planEl.classList.add("plan-item-active");
  }

  submitPlan() {
    const selectedPlanEl = document.querySelector(".plan-item-active");
    const selectedPlanType = selectedPlanEl.dataset.type;
    const selectedPlanPrice = plansPrice[`${selectedPlanType}`][`${this.term}`];

    this.selectedPlan = {
      type: selectedPlanType,
      term: this.term,
      price: selectedPlanPrice,
    };

    console.log(this.selectedPlan);
    this.goToStep(3);
  }

  selectAddOns(e) {
    const addOnsEl = e.target.closest("li");
    if (!addOnsEl) return;
    addOnsEl.classList.toggle("ons-item-active");
    const checkboxEl = addOnsEl.querySelector("input");
    checkboxEl.checked = !checkboxEl.checked;
  }

  submitAddOns() {
    const selectedAddOnsEls = [...addOnsListEl.querySelectorAll(".ons-item-active")];

    this.selectedAddOns = selectedAddOnsEls.map((el) => {
      const selectedAddOnsType = el.dataset.type;
      const selectedAddOnsPrice =
        addOnsPrice[`${selectedAddOnsType}`][`${this.term}`];

      return {
        type: selectedAddOnsType,
        price: selectedAddOnsPrice,
        term: this.term,
      };
    });

    this.goToStep(4);
    console.log(this.selectedAddOns);
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
