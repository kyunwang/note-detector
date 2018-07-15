import detectWebAudio, { detectGetUserMedia } from './detectWebAudio';
import {
	findFundamentalFrequency,
	findClosestNote,
	findCentsOffPitch,
} from './autoCorrelate';
import notes from '../assets/notes.json';

// Feature detect and pass AudioContext to audioCtx
const audioCtx = detectWebAudio();
const getUserMedia = detectGetUserMedia();

const frequencyTable = notes;
let baseFrequency = 440; // A default frequency ot start with
let currentNoteIndex = 57; // 57 is the A4 in the notes array
let notesArray = frequencyTable[baseFrequency]; // Select a frequency table based on the frequency

let audioSource;
let audioAnalyser;
let microphoneStream;

if (audioCtx) {
	console.log('Your browser support Audio Context');
	// audioOscillator();

	if (getUserMedia) {
		getUserMedia({ audio: true })
			.then(streamReceived)
			.catch(handleError);
	}
} else {
	console.log('Your browser does not support Audio Context');
}

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

		console.log(note.note, cents);
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

function handleError(err) {
	console.log(`Opps something went wrong: ${err}`);
}
