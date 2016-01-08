let coreHelpers = require('./../../node_modules/ghost/core/server/helpers');

coreHelpers.link = function(options) {
    let txt = this.html;
    let hasLink = txt.indexOf('<!-- link[') >= 0;
    if (hasLink) {
        this.theLink = txt.substring(txt.indexOf('<!-- link[') + 10, txt.indexOf('] -->', txt.indexOf('<!-- link[')));
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
};

coreHelpers.registerThemeHelper('link', coreHelpers.link);