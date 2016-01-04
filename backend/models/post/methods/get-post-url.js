let url = require('url');

/**
 * return valid url without #hashes and tracking variables if they exists
 * @param {String} postUrl
 * @returns {String, null}
 */
export default function getPostUrl(postUrl) {
    let parsedUrl = url.parse(postUrl, true);

    if (!parsedUrl.protocol || !parsedUrl.host) {
        return null;
    }

    delete parsedUrl.hash;

    return url.format(parsedUrl);
}