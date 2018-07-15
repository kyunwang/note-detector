const detectAudioContext = function() {
	// Safari still needs a prefix for this feature
	window.AudioContext = window.AudioContext || window.webkitAudioContext;

	if (window.AudioContext) return new window.AudioContext();

	return false;
};

export default detectAudioContext;
