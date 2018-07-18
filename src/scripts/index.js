import '../styles/index.css';

import { detectAudioContext, detectGetUserMedia } from './detectWebAudio';
import {
	findFundamentalFrequency,
	findClosestNote,
	findCentsOffPitch,
} from './autoCorrelate';
import notes from '../assets/notes.json';

// Feature detect and pass AudioContext to audioCtx
const audioCtx = detectAudioContext();
const getUserMedia = detectGetUserMedia();

const frequencyTable = notes;
let baseFrequency = 440; // A default frequency ot start with
let currentNoteIndex = 57; // 57 is the A4 in the notes array
let notesArray = frequencyTable[baseFrequency]; // Select a frequency table based on the frequency

// Predefine variables
let audioSource;
let audioAnalyser;
let microphoneStream;

// Get elements from page
const aNote = document.getElementById('a-note');
const aFrequency = document.getElementById('a-frequency');

// Check whether the browser does support the feature. audioCtx = false or window.AudioContext
if (audioCtx) {
	console.log('Your browser supports Audio Context');

	// getUserMedia = window.getUserMedia(went through feature detects) or false
	if (getUserMedia) {
		console.log('Your brower supports getUserMedia');
		getUserMedia({ audio: true })
			.then(streamReceived)
			.catch(handleError);
	} else {
		console.log('Your brower does not support getUserMedia');
	}
} else {
	console.log('Your browser does not support Audio Context');
}

//
function detectNote() {
	const buffer = new Uint8Array(audioAnalyser.fftSize); //
	audioAnalyser.getByteTimeDomainData(buffer);

	const fundamentalFrequency = findFundamentalFrequency(
		buffer,
		audioCtx.sampleRate
	);

	if (fundamentalFrequency !== -1) {
		const note = findClosestNote(fundamentalFrequency, notesArray);
		const cents = findCentsOffPitch(fundamentalFrequency, note.frequency);

		updateNote(note.note);
		updateFrequency(note.frequency);
		console.log(note.note, note.frequency, cents);
	}

	window.requestAnimationFrame(detectNote); // Tells the browser we wish to perform a animation. Call callback before repaint
}

// This function is called passing either a +2 or a -2 to increase or decrease
// the A4 frequency we are using as a reference
function changeBaseFrequency(delta) {
	const newBaseFrequency = baseFrequency + delta;
	if (newBaseFrequency >= 432 && newBaseFrequency <= 446) {
		baseFrequency = newBaseFrequency;
		notesArray = frequencyTable[newBaseFrequency];
		// updatePitch(newBaseFrequency);
	}
}

// Call when the stream has connected
function streamReceived(stream) {
	microphoneStream = stream; // Set the stream to microphoneStream

	// Initialize and assign a audio analyser
	audioAnalyser = audioCtx.createAnalyser();
	audioAnalyser.fftSize = 2048;

	audioSource = audioCtx.createMediaStreamSource(microphoneStream); // Assign a stream source as main source
	audioSource.connect(audioAnalyser); // Connect the analyser to our audio stream

	// Start note detection
	detectNote();
}

// Create a oscillator: oscillatory/voltage electric currents by non-mechanical means
function audioOscillator() {
	audioSource = audioCtx.createOscillator();
	audioSource.frequency.value = notesArray[currentNoteIndex].frequency; // Set default frequency
	audioSource.connect(audioCtx.destination); // Connect to the audiocontext desitnation
	audioSource.start(); // Start playing the Oscillator
}

// Update the note on the page
function updateNote(note) {
	aNote.innerText = note;
}

// Update the frequency on the page
function updateFrequency(frequency) {
	aFrequency.innerText = `${frequency}--Hz`;
}

// Handle error
function handleError(err) {
	console.error(`Opps something went wrong: ${err}`);
}
