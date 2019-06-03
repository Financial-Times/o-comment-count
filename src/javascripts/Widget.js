const deprecatedMessage = () => {
	throw new Error('o-comment-count has been deprecated. Please see o-comments for more information');
};

const Widget = function () {
	return {
		init: deprecatedMessage,
		getCommentCount: deprecatedMessage
	};
};

module.exports = Widget;
