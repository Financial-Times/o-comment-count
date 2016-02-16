const oCommentCount = require('../../main');

document.addEventListener('DOMContentLoaded', function() {
	document.dispatchEvent(new CustomEvent('o.DOMContentLoaded'));
});

window.oCommentCount = oCommentCount;
