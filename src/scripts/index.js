import detectAudioContext from './detectAudioContext';

const audioCtx = detectAudioContext();

if (audioCtx) {
	console.log('Your browser support Audio Context');
} else {
	console.log('Your browser does not support Audio Context');
}
