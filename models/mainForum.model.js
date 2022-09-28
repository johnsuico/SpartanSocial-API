const mongoose = require('mongoose');

const mainForumSchema = new mongoose.Schema ({
  mainForumTitle: {
    type: String,
    required: true
  },
  mainForumDesc: {
    type: String,
    required: true
  },
  mainForumAuthor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author'
  },
  mainForumDate: {
    type: Date,
    default: Date.now
  },
  subForums: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'subForum'
  }]
})

const mainForum = mongoose.model('mainForum', mainForumSchema);

module.exports = mainForum;