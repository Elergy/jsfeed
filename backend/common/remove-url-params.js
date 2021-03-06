let url = require('url');

const lastSlashRe = /\/$/;

/**
 * return valid url without #hashes and tracking variables if they exists
 * @param {String} postUrl
 * @returns {String, null}
 */
function removeUrlParams(postUrl) {
    if (!postUrl) {
        return null;
    }
    let parsedUrl = url.parse(postUrl, true);

    if (!parsedUrl.protocol || !parsedUrl.host) {
        return null;
    }

    delete parsedUrl.hash;
    delete parsedUrl.search;

    Object.keys(parsedUrl.query).forEach((queryName) => {
        if (queryName.indexOf('utm') === 0 || queryName.indexOf('_') === 0) {
            delete parsedUrl.query[queryName];
        }
    });

    return url
        .format(parsedUrl)
        .replace(lastSlashRe, '');
}

module.exports = removeUrlParams;