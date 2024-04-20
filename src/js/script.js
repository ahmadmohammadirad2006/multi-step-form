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
const labelCheckboxEls = addOnsListEl.querySelectorAll("label");
const addOnsItemEls = [...addOnsListEl.querySelectorAll("li")];
const addOnsNextStepBtnEl = document.getElementById("addOnsNextStepBtn");

const finalPlanNameEl = document.getElementById("finalPlanName");
const finalPlanPriceEl = document.getElementById("finalPlanPrice");
const finalAddOnsListEl = document.getElementById("finalAddOnsList");
const finalTotalInfoEl = document.getElementById("finalTotalInfo");
const finalTotalPriceEL = document.getElementById("finalTotalPrice");
const changeBtnEl = document.getElementById("changeBtn");
const confirmBtnEl = document.getElementById("confirmBtn");

const toggleTermBtnEl = document.getElementById("toggleTermBtn");
const [monthlyTextEl, yearlyTextEl] = toggleTermBtnEl
  .closest("div")
  .querySelectorAll(".term-option");
const cricleEl = document.getElementById("circle");
const goBackBtnEls = document.querySelectorAll(".go-back-btn");

// FUNCTIONS

const capitalize = function (str) {
  const lowerCase = str.toLowerCase();
  const firstLetterUpperCase = lowerCase[0].toUpperCase();
  const capitalized = firstLetterUpperCase + lowerCase.slice(1);
  return capitalized;
};
const camelCaseToLowerCase = function (str) {
  return str.split("").reduce((result, char, i) => {
    if (char === char.toUpperCase() && i !== 0)
      return result + " " + char.toLowerCase();
    else return result + char;
  });
};

// DATA
const plansPrice = {
  arcade: {
    mo: 9,
    yr: 90,
  },
  advanced: {
    mo: 12,
    yr: 120,
  },
  pro: {
    mo: 15,
    yr: 150,
  },
};

const addOnsPrice = {
  onlineService: {
    mo: 1,
    yr: 10,
  },
  largerStorage: {
    mo: 2,
    yr: 20,
  },
  customizableProfile: {
    mo: 2,
    yr: 20,
  },
};

class App {
  step = 1;
  term = "yr";
  selectedPlan = {
    type: "",
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

    // Prevent default behavior of checkbox labels when clicked
    labelCheckboxEls.forEach((el) => {
      el.addEventListener("click", function (e) {
        e.preventDefault();
      });
    });

    // Select add-ons
    addOnsListEl.addEventListener("click", this.selectAddOns);

    // Submit add-ons
    addOnsNextStepBtnEl.addEventListener("click", this.submitAddOns.bind(this));

    // Go Previous Step
    goBackBtnEls.forEach((el) =>
      el.addEventListener("click", this.goToPrevStep.bind(this))
    );

    // Go back to change selections
    changeBtnEl.addEventListener("click", this.goBackToChange.bind(this));

    // Confirm finishing up section
    confirmBtnEl.addEventListener("click", this.confirmFinishingUp.bind(this));
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
    this.term = this.term === "yr" ? "mo" : "yr";

    this.switchCirclePosition();
    this.activateTermOptionText();
    this.changeEachPlanInfo();
    this.changeEachAddOnsInfo();
  }

  // Switch circle position based on plan term
  switchCirclePosition() {
    cricleEl.classList.remove(
      `${this.term === "yr" ? "monthly-side" : "yearly-side"}`
    );
    cricleEl.classList.add(
      `${this.term === "yr" ? "yearly-side" : "monthly-side"}`
    );
  }
  // Activate term option text based on plan term
  activateTermOptionText() {
    if (this.term === "mo") {
      monthlyTextEl.classList.add("text-marineBlue");
      yearlyTextEl.classList.remove("text-marineBlue");
    }
    if (this.term === "yr") {
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
        this.term === "yr" ? "inline" : "none";

      planInfo.querySelector(".plan-price-info").innerHTML = `$${
        plansPrice[`${planType}`][`${this.term}`]
      }/${this.term}`;
    });
  }

  changeEachAddOnsInfo() {
    addOnsItemEls.forEach((el) => {
      const addOnsType = el.dataset.type;
      const addOnsPriceInfoEl = el.querySelector(".add-ons-price-info");
      addOnsPriceInfoEl.innerHTML = `+$${
        addOnsPrice[`${addOnsType}`][`${this.term}`]
      }/${this.term}`;
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
    const selectedAddOnsEls = [
      ...addOnsListEl.querySelectorAll(".ons-item-active"),
    ];

    this.selectedAddOns = selectedAddOnsEls.map((el) => {
      const selectedAddOnsType = el.dataset.type;
      const selectedAddOnsPrice =
        addOnsPrice[`${selectedAddOnsType}`][`${this.term}`];

      return {
        type: selectedAddOnsType,
        price: selectedAddOnsPrice,
      };
    });

    this.updateFinishingUpSection();
    this.goToStep(4);
    console.log(this.selectedAddOns);
  }

  updateFinishingUpSection() {
    // Update final plan
    finalPlanNameEl.textContent = `${capitalize(this.selectedPlan.type)} (${
      this.term === "yr" ? "Yearly" : "Monthly"
    })`;
    finalPlanPriceEl.textContent = `$${this.selectedPlan.price}/${this.term}`;

    // Update final add-ons list
    const addOnsListMarkup = this.generateAddOnsListMarkup();
    finalAddOnsListEl.innerHTML = addOnsListMarkup;
    // Calculate and Update total
    const total =
      this.selectedPlan.price +
      this.selectedAddOns.reduce((acc, entry) => entry.price + acc, 0);

    finalTotalInfoEl.textContent = `Total (per ${
      this.term === "yr" ? "year" : "month"
    })`;
    finalTotalPriceEL.textContent = `$${total}/${this.term}`;
  }

  generateAddOnsListMarkup() {
    return this.selectedAddOns
      .map((entry) => this.generateAddOnsItemMarkup(entry))
      .join("");
  }

  generateAddOnsItemMarkup(addOns) {
    return `
<li class="flex justify-between">
  <!-- NAME -->
  <span>${capitalize(camelCaseToLowerCase(addOns.type))}</span>
  <!-- PRICE -->
  <span class="text-marineBlue">+$${addOns.price}/${this.term}</span>
</li>`;
  }

  goBackToChange() {
    this.goToStep(2);
  }

  confirmFinishingUp() {
    this.goToStep(5);
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

    if (step === 5) return;

    const nextStepNumEl = stpesListEl.querySelector(
      `[data-step="${this.step}"]`
    );
    nextStepNumEl.classList.add("step-item-active");
  }
}

const app = new App();
