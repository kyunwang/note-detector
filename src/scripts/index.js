import '../styles/index.css';

import pitchAnalyser from 'pitch-analyser';

// Get elements from page
const aNote = document.getElementById('a-note');
const aFrequency = document.getElementById('a-frequency');
const aCents = document.getElementById('a-cents');

// Analyser options
const analyserOptions = {
	callback: analyserCallback,
	returnNote: true,
	returnCents: true,
	decimals: 2,
};

// Initialize the analyser
const analyser = new pitchAnalyser(analyserOptions);

// What to do with the audio payload
function analyserCallback(payload) {
	updateNote(payload.note);
	updateFrequency(payload.frequency);
	updateCents(payload.cents);
}

// Update the note on the page
function updateNote(note) {
	aNote.innerText = note;
}

// Update the frequency on the page
function updateFrequency(frequency) {
	aFrequency.innerText = frequency;
}

// Update the cents on the page (Not sure about the accuracy)
function updateCents(cents) {
	aCents.innerText = cents;
}

// Handle error
function handleError(err) {
	throw new Error(`Opps something went wrong: ${err}`);
}
