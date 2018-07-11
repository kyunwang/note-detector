export default (text = 'hello world') => {
	const el = document.createElement('div');

	el.textContent = text;

	return el;
};
