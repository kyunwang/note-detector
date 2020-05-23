import '../styles/index.css';

import PitchAnalyser from 'pitch-analyser';

window.onload = function() {
	// Get elements from page
	const aNote = document.getElementById('a-note');
	const aFrequency = document.getElementById('a-frequency');
	const aCents = document.getElementById('a-cents');
	const controlPlay = document.getElementById('control-play');
	const controlPause = document.getElementById('control-pause');
	const startButton = document.querySelector('main > div:first-of-type button');

	// Analyser options
	const analyserOptions = {
		callback: analyserCallback,
		returnNote: true,
		returnCents: true,
		decimals: 2,
	};

	// Initialize the analyser
	const analyser = new PitchAnalyser(analyserOptions);

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

	// Button to initialise and start the analyser
	startButton.addEventListener('click', function() {
		// Required to init the analyser first
		// It will create an AudioContext instance under 'analyser.audioContext'
		// It returns no value
		analyser.initAnalyser().then(() => {
			// Start the analyser after initialisation
			analyser.startAnalyser();
		});

		startButton.classList.add('hidden');
	});

	controlPlay.addEventListener('click', function() {
		if (analyser.audioContext.state === 'suspended') {
			analyser.resumeAnalyser();
		}
	});

	controlPause.addEventListener('click', function() {
		if (analyser.audioContext.state === 'running') {
			analyser.pauseAnalyser();
		}
	});
};

/*
// Quick documentation of the package (pitch-analyser)
*/

// Available methods
// All methods below including analyser.initAnalyser() & analyser.startAnalyser()
// Can take an optional callback as argument

// - analyser.initAnalyser()
// Initialises the analyser and audio context
// Returns: A promise

// - analyser.startAnalyser()
// Start the analyser. After initialising

// - analyser.resumeAnalyser()
// Resumes a paused audio context
// ISSUE: Chrome does not resume correctly at the moment after pausing

// - analyser.pauseAnalyser()
// Pauses a running audio context

// - analyser.closeContext()
// Closes the audio context. This instance cannot be used anymore
// A new instance has to be created
