const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  username: { type: String, required: true }, // Auteur du post
  text: { type: String, required: true }, // Contenu du post
  createdAt: { type: Date, default: Date.now } // Date de création
});

module.exports = mongoose.model('Post', PostSchema);
