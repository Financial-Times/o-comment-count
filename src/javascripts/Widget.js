const envConfig = require('./config.js');
const oCommentUtilities = require('o-comment-utilities');
const oCommentApi = require('o-comment-api');

const Widget = function (rootEl, config) {
	let widgetEl;

	try {
		if (!rootEl) {
			rootEl = document.body;
		} else if (!(rootEl instanceof HTMLElement)) { // could throw exception in IE
			rootEl = document.querySelector(rootEl);
		}
	} catch (e) {
		let el;
		if (typeof rootEl === 'string') {
			el = document.querySelector(rootEl);
		}

		if (el) {
			rootEl = el;
		} else {
			rootEl = document.body;
		}
	}

	rootEl.setAttribute('data-o-comment-count-js', '');

	widgetEl = rootEl;


	/**
	 * Validation of the initial configuration object.
	 */
	if (!config) {
		throw new Error("No configuration is provided.");
	}

	if (!config.articleId) {
		if (!config.articleid) {
			throw new Error("Article ID is missing.");
		} else {
			config.articleId = config.articleid;
		}
	}

	let template = envConfig.get('template');
	if (config.template) {
		template = config.template;
	}


	function render () {
		getCommentCount(function (err, count) {
			if (err) {
				return;
			}

			widgetEl.innerHTML = template.replace('{count}', count).replace('{plural}', (count > 1 ? 's' : ''));
		});
	}

	function getCommentCount (callback) {
		oCommentApi.api.getCommentCount(config.articleId, function (err, count) {
			if (err) {
				callback(err);

				oCommentUtilities.logger.error('Error fetching the comment count', err);
				return;
			}

			callback(null, count);
		});
	}

	let refreshInitialized = false;
	function init () {
		render();

		if ((config.autoRefresh === true || config.autoRefresh === 'true') && !refreshInitialized) {
			refreshInitialized = true;

			setInterval(function () {
				render();
			}, 60 * 1000); // update every minute
		}
	}

	if (config.autoInit !== false) {
		init();
	}

	return {
		init: init,
		getCommentCount: getCommentCount
	};
};

module.exports = Widget;
