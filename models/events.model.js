const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema ({
  eventTitle: {
    type: String,
    required: true
  },
  eventDesc: {
    type: String,
    required: true
  },
  eventCreator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Creator'
  },
  eventDate : {
    type: String,
    required: true
  },
  going: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'going'
  }],
  notGoing: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'notGoing'
  }]
})

const event = mongoose.model('event', eventSchema);

module.exports = event;