import PostModel from './../model';

/**
 * get post with specified url
 * @param {String} url
 * @returns {Promise}
 */
export default function getPostByUrl(url) {
    return PostModel.findOne({url});
}