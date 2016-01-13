let urlParser = require('url');

const sitesWithUsername = [
    'medium.com',
    'github.com'
];

/**
 * get author's site
 * @param {String} url
 * @returns {String}
 */
function getAuthorSite(url) {
    url = urlParser.parse(url);
    const hasUserName = sitesWithUsername.indexOf(url.host) !== -1;

    let authorSite = url.host;

    if (hasUserName && url.path && url.path.length > 1) {
        authorSite += '/' + url.path.split('/')[1];
    }

    return authorSite;
}

module.exports = getAuthorSite;