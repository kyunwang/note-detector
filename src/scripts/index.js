import detectWebAudio, { detectGetUserMedia } from './detectWebAudio';
import notes from '../assets/notes.json';

// Feature detect and pass AudioContext to audioCtx
const audioCtx = detectWebAudio();
const getUserMedia = detectGetUserMedia();

const frequencyTable = notes;
let baseFrequency = 440;
let currentNoteIndex = 57; // 57 is the A4 in the notes array
let notesArray = frequencyTable[baseFrequency];

let audioSource;
let audioAnalyser;
let microphoneStream;

if (audioCtx) {
	console.log('Your browser support Audio Context');
	audioOscillator();
	// changeBaseFrequency();
} else {
	console.log('Your browser does not support Audio Context');
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

// navigator.getUserMedia({audio: true}, streamReceived);

// Create a oscillator: oscillatory/voltage electric currents by non-mechanical means
function audioOscillator() {
	audioSource = audioCtx.createOscillator();
	audioSource.frequency.value = notesArray[currentNoteIndex].frequency; // Set default frequency
	audioSource.connect(audioCtx.destination); // Connect to the audiocontext desitnation
	audioSource.start(); // Start playing the Oscillator
	console.log(111);
}

function handleError(err) {
	console.log(`Opps something went wrong: ${err}`);
}
