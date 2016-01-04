let mongoose = require('mongoose');
import postSchema from './schema';

export default mongoose.model('Post', postSchema);
