// DOM Element Selectors
const billInput = document.getElementById('bill');
const peopleInput = document.getElementById('people');
const customTipInput = document.getElementById('custom-tip');
const tipButtons = document.querySelectorAll('.calculator__tip-btn');
const resetBtn = document.getElementById('reset-btn');

const tipAmountOutput = document.getElementById('tip-amount');
const totalAmountOutput = document.getElementById('total-amount');
const peopleError = document.getElementById('people-error');
const peopleInputContainer = peopleInput ? peopleInput.closest('.calculator__input-container') : null;

let selectedTipPercent = 0;

// Prevent form submission and trigger validation on Enter key
const calculatorForm = document.querySelector('form.calculator__card');
if (calculatorForm) {
  calculatorForm.addEventListener('submit', (e) => {
    e.preventDefault();
    calculateTip();
  });
}

// Update the RESET button state (Disabled vs Enabled)
function updateResetButtonState() {
  const hasBill = billInput.value.trim() !== '';
  const hasPeople = peopleInput.value.trim() !== '';
  const hasCustomTip = customTipInput.value.trim() !== '';
  const hasActiveTipBtn = selectedTipPercent > 0;

  resetBtn.disabled = !(hasBill || hasPeople || hasCustomTip || hasActiveTipBtn);
}

// Main calculation logic
function calculateTip() {
  const billValue = parseFloat(billInput.value) || 0;
  const rawPeople = peopleInput.value.trim();
  const peopleValue = parseInt(rawPeople, 10) || 0;

  // Validation conditions
  const isZero = rawPeople === '0';
  const startsWithZero = /^0\d+/.test(rawPeople);
  const isEmpty = rawPeople === '';

  // Trigger error state on empty input, literal 0, or leading zeroes (e.g. 05)
  if (isZero || startsWithZero || isEmpty) {
    if (peopleError) {
      peopleError.textContent = isEmpty ? "Can't be blank" : "Can't be zero";
    }
    if (peopleInputContainer) {
      peopleInputContainer.classList.add('calculator__input-container--error');
    }
    tipAmountOutput.textContent = '$0.00';
    totalAmountOutput.textContent = '$0.00';
    return;
  } else {
    if (peopleError) peopleError.textContent = '';
    if (peopleInputContainer) {
      peopleInputContainer.classList.remove('calculator__input-container--error');
    }
  }

  // Calculate if valid inputs exist
  if (billValue > 0 && peopleValue > 0) {
    const tipTotal = billValue * (selectedTipPercent / 100);
    const tipPerPerson = tipTotal / peopleValue;
    const totalPerPerson = (billValue + tipTotal) / peopleValue;

    tipAmountOutput.textContent = `$${tipPerPerson.toFixed(2)}`;
    totalAmountOutput.textContent = `$${totalPerPerson.toFixed(2)}`;
  } else {
    tipAmountOutput.textContent = '$0.00';
    totalAmountOutput.textContent = '$0.00';
  }
}

// Event Listeners for Preset Tip Buttons
tipButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    tipButtons.forEach(btn => btn.classList.remove('calculator__tip-btn--active'));
    e.target.classList.add('calculator__tip-btn--active');
    
    selectedTipPercent = parseFloat(e.target.dataset.tip);
    customTipInput.value = '';

    updateResetButtonState();
    calculateTip();
  });
});

// Event Listener for Custom Tip Input
customTipInput.addEventListener('input', () => {
  tipButtons.forEach(btn => btn.classList.remove('calculator__tip-btn--active'));
  selectedTipPercent = parseFloat(customTipInput.value) || 0;
  
  updateResetButtonState();
  calculateTip();
});

// Event Listeners for Bill & People Inputs
[billInput, peopleInput].forEach(input => {
  input.addEventListener('input', () => {
    updateResetButtonState();
    calculateTip();
  });
});

// Reset Calculator Functionality
resetBtn.addEventListener('click', () => {
  billInput.value = '';
  peopleInput.value = '';
  customTipInput.value = '';
  selectedTipPercent = 0;

  tipButtons.forEach(btn => btn.classList.remove('calculator__tip-btn--active'));
  if (peopleError) peopleError.textContent = '';
  if (peopleInputContainer) peopleInputContainer.classList.remove('calculator__input-container--error');

  tipAmountOutput.textContent = '$0.00';
  totalAmountOutput.textContent = '$0.00';

  updateResetButtonState();
});
