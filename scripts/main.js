/* Slider functionality */
const slider = document.getElementById('pass-length');
const sliderValue = document.querySelector('.slider-value');

/* Checkboxes */
const checkboxes = document.querySelectorAll('.main-app__input-checkbox');

/* Generate button */
const generateButton = document.querySelector('.main-app__generate-button');

/* Password UI */
const passwordEl = document.querySelector('.main-app__gen-pass');

/* Copy to clipboard button */
const copyClipboardButton = document.querySelector('.main-app__copy-btn');


const passwordAttributes = {
	passwordLen: 0,
	includeUppercase: false,
	includeLowercase: false,
	includeNumbers: false,
	includeSymbols: false
}

const optionCharacters = {
	lowercase: "abcdefghijklmnopqrstuvwxyz",
	uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
	numbers: "0123456789",
	symbols: "!@#$%^&*()_+-=[]{}|;:',.<>?/`~"
}

document.addEventListener('DOMContentLoaded', init)

function init() {
	/* Event listeners */
	slider.addEventListener('input', sliderListener);
	checkboxes.forEach(checkbox => checkbox.addEventListener('change', checkboxListener));
	generateButton.addEventListener('click', generatePassword);
	copyClipboardButton.addEventListener('click', copyButtonListener);

	/* Call for initial setup of password */
	sliderListener.call(slider);
	checkboxes.forEach(checkbox => checkboxListener.call(checkbox));
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

/* ================= Checkboxes functionality ================= */
function checkboxListener() {
	passwordAttributes[this.dataset.attribute] = this.checked;
}

function generatePassword() {
	let validCharacters = "";
	let generatedPass = "";

	const checkedInputs = document.querySelectorAll('.main-app__input-checkbox:checked');

	/* Validate the user inputs: at least one checkbox is selected and the len is enought for all the type of characters */
	if (!checkedInputs.length || passwordAttributes.passwordLen < checkedInputs.length) {
		alert("Input length is incompatible with requested password attributes")
		return;
	}

	if (passwordAttributes.includeLowercase) {
		generatedPass += getRandomCharacter(optionCharacters.lowercase);
		validCharacters += optionCharacters.lowercase;
	}

	if (passwordAttributes.includeUppercase) {
		generatedPass += getRandomCharacter(optionCharacters.uppercase);
		validCharacters += optionCharacters.uppercase;
	}

	if (passwordAttributes.includeNumbers) {
		generatedPass += getRandomCharacter(optionCharacters.numbers);
		validCharacters += optionCharacters.numbers;
	}

	if (passwordAttributes.includeSymbols) {
		generatedPass += getRandomCharacter(optionCharacters.symbols);
		validCharacters += optionCharacters.symbols;
	}

	while(generatedPass.length < passwordAttributes.passwordLen) {
		generatedPass += getRandomCharacter(validCharacters);
	}

	updatePasswordUI(shuffleCharacters(generatedPass));
	calculateStrength(validCharacters.length);
	resetCopyUI();
}

function updatePasswordUI(password) {
	passwordEl.textContent = password;
	passwordEl.classList.remove('placeholder');
}


function getRandomNumber(maxLen) {
	const buffer = new Uint32Array(1);
	return window.crypto.getRandomValues(buffer)[0] % (maxLen);
}

function getRandomCharacter(sourceString) {
	return sourceString[getRandomNumber(sourceString.length)];
}

/* Shuffle using Fisher-Yates shuffle algorithm */
function shuffleCharacters(inputSequence) {
	let i = inputSequence.length;

	while(i > 0) {
		const j = getRandomNumber(i);
		[inputSequence[j], inputSequence[i]] = [inputSequence[i], inputSequence[j]];
		i--;
	}
	return inputSequence;
}

function calculateStrength(totalPossibleChars) {
	/* Calculate entropy E = L * log2(R)
		L: password length
		R: Amount of possible characters
	*/
	const passwordEntropy = passwordAttributes.passwordLen * Math.log2(totalPossibleChars);
	console.log(passwordEntropy);

	if (passwordEntropy < 40) {
		updateStrengthUI('too-weak');
		return;
	}

	if (passwordEntropy < 60) {
		updateStrengthUI('weak');
		return;
	}

	if (passwordEntropy < 80) {
		updateStrengthUI('medium');
		return;
	}

	updateStrengthUI('strong');
}

function updateStrengthUI(strength) {
	const passwordStrengthUI = document.querySelector('.strength__current-rating');
	const ratingBars = document.querySelector('.strength__rating-bars');
	const ratingClasses = [
		'rated-too-weak',
		'rated-weak',
		'rated-medium',
		'rated-strong'
	]

	/* Display the strength text in the UI */
	if (passwordStrengthUI.classList.contains('rating-hidden')) {
		passwordStrengthUI.classList.remove('rating-hidden');
	}
	passwordStrengthUI.textContent = strength.toUpperCase();

	/* Set the appropiate class to the rating bars */
	ratingBars.classList.remove(...ratingClasses);
	ratingBars.classList.add(`rated-${strength}`);
}

function copyButtonListener() {
	if (copyClipboardButton.classList.contains('copied')) return;

	copyPassword();
}

/* Copy functionality */
async function copyPassword() {
	/* Do not copy if it is the placeholder (no password generated yet) */
	if (passwordEl.classList.contains('placeholder')) {
		alert('Please, generate a password first!');
		return;
	}

	/* Asynchronous wirteText() method */
	try {
		await navigator.clipboard.writeText(passwordEl.textContent);
		updateCopyUI();
	} catch {
		alert('An error occured when trying to copy');
	}
}

function updateCopyUI() {
	if (copyClipboardButton.classList.contains('copied')) return;
	copyClipboardButton.classList.add('copied');
}

function resetCopyUI() {
	if (copyClipboardButton.classList.contains('copied')) {
		copyClipboardButton.classList.remove('copied');
	}
}
