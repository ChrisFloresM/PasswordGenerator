/* Slider functionality */
const slider = document.getElementById('pass-length');
const output = document.querySelector('.slider-value');
const sliderWrapper = document.querySelector('.main-app_slider-container');

slider.addEventListener('input', sliderListener);

function sliderListener() {
	const maxValue = Number(this.max);
	output.textContent = this.value;

	const currentPercentage = (Number(this.value) / maxValue ) * 100;
	slider.style.background = `linear-gradient(90deg, var(--green-200) ${currentPercentage}%, var(--grey-850) ${currentPercentage}%)`;
}