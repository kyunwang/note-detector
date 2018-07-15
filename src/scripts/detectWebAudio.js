const detectAudioContext = function() {
	// Safari still needs a prefix for this feature
	window.AudioContext = window.AudioContext || window.webkitAudioContext;

	if (window.AudioContext) return new window.AudioContext();

	return false;
};

const detectGetUserMedia = function() {
	navigator.getUserMedia =
		navigator.getUserMedia ||
		navigator.webkitGetUserMedia ||
		navigator.mozGetUserMedia;

	if (
		(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) ||
		navigator.getUserMedia
	)
		return navigator.mediaDevices && navigator.mediaDevices.getUserMedia
			? navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices)
			: function(constraints) {
					return new Promise(function(resolve, reject) {
						navigator.getUserMedia(constraints, resolve, reject);
					});
			  };
	return false;
};

const WebAudio = {
	detectAudioContext,
	detectGetUserMedia,
};

// Export individualy
export { detectAudioContext, detectGetUserMedia };

// Export for default import
export default {
	detectAudioContext,
	detectGetUserMedia,
};
