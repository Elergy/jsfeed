let coreHelpers = require('./../../node_modules/ghost/core/server/helpers');

const startPostTag = '<!-- post ';
const endPostTag = ' post -->';
coreHelpers.jsFeedItem = function(options) {
    let txt = this.html;
    let isPost = txt.indexOf(startPostTag) >= 0;

    if (isPost) {
        let postInfo = txt.substring(txt.indexOf(startPostTag) + startPostTag.length, txt.indexOf(endPostTag));
        postInfo = JSON.parse(postInfo);
        this.postInfo = postInfo;

        return options.fn(this);
    } else {
        return options.inverse(this);
    }
};

coreHelpers.registerThemeHelper('jsfeed_item', coreHelpers.jsFeedItem);