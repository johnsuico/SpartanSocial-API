const router = require('express').Router();
const event = require('../models/events.model');
const User = require('../models/user.model');

// @Route   GET /events
// @desc    Get all events
// @access  Public
router.route('/').get((req, res) => {
  event.find({})
    .then(events => res.send(events));
})

// @Route   POST /events
// @desc    Create a new event
// @access  Private, can only access with an account
router.route('/').post((req, res) => {
  const {eventTitle, eventDesc, eventDate, eventCreator} = req.body;

  if (!eventTitle || !eventDesc || !eventDate || !eventCreator) {
    return res.status(400).json({msg: 'Please enter in all fields'});
  }

  const newEvent = new event({
    eventTitle,
    eventDesc,
    eventDate,
    eventCreator
  })

  newEvent.save()
    .then (newEv => {
      res.json({
        newEv: {
          eventTitle: newEvent.eventTitle,
          eventDesc: newEvent.eventDesc,
          eventDate: newEvent.eventDate,
          eventCreator: newEvent.eventCreator
        }
      })

      User.findByIdAndUpdate(eventCreator,
        {$push: {'createdEvents': newEv._id}}
        )
    })
    .catch (err => res.status(400).json('Error: ' + err));
})

// @Route   DELETE /events
// @desc    Delete all events in database
// @access  Private, just used by admins for debugging or if something happened to the events
router.route('/').delete((req, res) => {
  event.deleteMany({})
    .then (res.send('Successfully deleted all events'))
    .catch (err => res.send(err));
})

// @Route   GET /events/:eventID
// @desc    Get a specific event
// @access  Public
router.route('/:eventID').get((req, res) => {
  mainForum.findById(req.params.eventID)
    .then (ev => res.json(ev));
})

// @Route   DELETE /events/:eventID
// @desc    Delete a specific event
// @access  Private, only creator and admins can delete
router.route('/:eventID').delete((req, res) => {
  event.findByIdAndDelete(req.params.eventID)
    .then(ev => {
      res.json(`Event ID: ${ev._id} Sucessfully deleted`);
    })
    .catch(err => {
      res.json(err);
    })
})

// @Route   POST /events/:eventID/going
// @desc    Update event and add user to 'going' array
// @access  Private
router.route('/:eventID/going').post((req, res) => {
  const {userID} = req.body;
  
  event.findByIdAndUpdate(req.params.eventID,
  {$push: {'going': userID}},
  {new: true},
  (err, updated) => {
    if (err) throw err;
    res.send(updated);
  });

  User.findByIdAndUpdate(userID,
  {$push: {'goingEvents': req.params.eventID}},
  (err => {
    if (err) throw err;
  }));
})

// @Route   POST /events/:eventID/notGoing
// @desc    Update event and add user to 'notGoing' array
// @access  Private
router.route('/:eventID/notGoing').post((req, res) => {
  const {userID} = req.body;

  event.findByIdAndUpdate(req.params.eventID,
  {$push: {'notGoing': userID}},
  {new: true},
  (err, updated) => {
    if (err) throw err;
    res.send(updated);
  });

  User.findByIdAndUpdate(userID,
    {$push: {'notGoingEvents': req.params.eventID}},
    (err => {
      if (err) throw err;
    }));
})

// @Route   DELETE /events/:eventID/going
// @desc    Remove user from 'going' array
// @access  Private
router.route('/:eventID/going').delete((req, res) => {
  const {userID} = req.body;

  event.findByIdAndUpdate(req.params.eventID,
    {$pull: {'going': userID}},
    {new: true},
    (err, updated) => {
      if (err) throw err;
      res.send(updated);
    })

  User.findByIdAndUpdate(userID,
    {$pull: {'goingEvents': req.params.eventID}},
    (err => {
      if (err) throw err;
    }));
})

// @Route   DELETE /events/:eventID/notGoing
// @desc    Remove user from 'notGoing' array
// @access  Private
router.route('/:eventID/notGoing').delete((req, res) => {
  const {userID} = req.body;

  event.findByIdAndUpdate(req.params.eventID,
    {$pull: {'notGoing': userID}},
    {new: true},
    (err, updated) => {
      if (err) throw err;
      res.send(updated);
    })

  User.findByIdAndUpdate(userID,
    {$pull: {'notGoingEvents': req.params.eventID}},
    (err => {
      if (err) throw err;
    }));
})

module.exports = router;