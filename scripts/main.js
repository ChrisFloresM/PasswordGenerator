/* Slider functionality */
const slider = document.getElementById('pass-length');
const sliderValue = document.querySelector('.slider-value');

slider.addEventListener('input', sliderListener);

const passwordAttributes = {
	passwordLen: 0,
	includeUppercase: false,
	includeLowercase: false,
	includeNumbers: false,
	includeSymbols: false
}

/* ================= Slider functionality ================= */
function sliderListener() {
	updateSliderUI(this);
	passwordAttributes.passwordLen = Number(this.value);
}

function updateSliderUI(sliderEl) {
	const value = sliderEl.value;
	const maxValue = Number(sliderEl.max);
	const currentPercentage = (Number(value) / maxValue ) * 100;

	sliderValue.textContent = value;
	slider.style.background = `linear-gradient(90deg, var(--green-200) ${currentPercentage}%, var(--grey-850) ${currentPercentage}%)`;
}

/* Testing crypto.getRandomValues */
const buffer = new Uint32Array(1)
console.log(window.crypto.getRandomValues(buffer));