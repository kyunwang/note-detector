// import noteDetector from './noteDetector';
var buflen = 1024;
var buf = new Float32Array(buflen);
// noteDetector.init();
if (navigator.mediaDevices) {
	console.log('Media Deviced is supported');

	const audioCtx = new AudioContext();
	const audioAnalyser = audioCtx.createAnalyser();
	audioAnalyser.fftSize = 2048;

	// const bufferLength = audioAnalyser.fftSize;
	const bufferLength = audioAnalyser.frequencyBinCount;
	// const bufferLength = audioAnalyser.frequencyBinCount;
	const dataArray = new Uint8Array(bufferLength);

	// get Canvas
	const canvas = document.getElementById('note-canvas');
	const canvasCtx = canvas.getContext('2d');

	navigator.mediaDevices
		// .getUserMedia({ audio: true, video: false })
		.getUserMedia({ audio: true })
		.then(stream => {
			// Create an audio stream source
			let streamSource = audioCtx.createMediaStreamSource(stream);

			// Create a biquadfilter
			// const biquadFilter = audioCtx.createBiquadFilter();
			// biquadFilter.type = 'lowshelf';
			// biquadFilter.frequency.value = 1000;

			// biquadFilter.gain.value = range.value;
			// connect the AudioBufferSourceNode to the gainNode
			// and the gainNode to the destination, so we can play the
			// music and adjust the volume using the mouse cursor

			streamSource.connect(audioAnalyser);
			// streamSource.connect(biquadFilter);
			// streamSource.connect(audioCtx.destination);
			// biquadFilter.connect(audioCtx.destination);

			updatePitch();
			// startOscillator();
		});

	function updatePitch(time) {
		console.log('update');

		audioAnalyser.getFloatTimeDomainData(buf);

		// audioAnalyser.get;
	}

	function startOscillator() {
		const sourceNode = audioCtx.createOscillator();

		sourceNode.connect(audioAnalyser);
		audioAnalyser.connect(audioCtx.destination);

		sourceNode.start(0);
	}

	function draw() {
		requestAnimationFrame(draw);

		// audioAnalyser.getByteTimeDomainData(dataArray);
		audioAnalyser.getByteFrequencyData(dataArray);

		canvasCtx.fillStyle = 'rgb(200, 200, 200';
		canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

		canvasCtx.lineWidth = 2;
		canvasCtx.strokeWidth = 'rgba(0,0,0)';

		canvasCtx.beginPath();

		var sliceWidth = (canvas.width * 1) / bufferLength;
		var x = 0;

		for (var i = 0; i < bufferLength; i++) {
			var v = dataArray[i] / 128.0;
			var y = (v * canvas.height) / 2;

			if (i === 0) {
				canvasCtx.moveTo(x, y);
			} else {
				canvasCtx.lineTo(x, y);
			}

			x += sliceWidth;
		}

		canvasCtx.lineTo(canvas.width, canvas.height / 2);
		canvasCtx.stroke();
	}

	draw();
} else {
	console.log('Media Deviced is not supported in your browser');
}
