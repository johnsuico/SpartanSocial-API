const router = require('express').Router();
const User = require('../models/user.model');
const mainForum = require('../models/mainForum.model');
const subForum = require('../models/subForum.model');

// @Route   GET /forums/mainForum
// @desc    Get all main forums
// @access  Public
router.route('/mainForum').get((req, res) => {
  mainForum.find({})
    .then( forums => res.send(forums));
})


// @Route   POST /forums/mainForum
// @desc    Create a new main forum
// @access  Private, only accessible with admin accounts
router.route('/mainForum').post((req, res) => {
  const {mainForumTitle, mainForumDesc, mainForumAuthor} = req.body;

  if (!mainForumTitle || !mainForumDesc || !mainForumAuthor) {
    return res.status(400).json({msg: 'Please enter all fields'});
  }

  mainForum.findOne( {mainForumTitle} )
    .then(forum => {
      if(forum) return res.status(400).json({msg: "Forum already exists"});

      const newMainForum = new mainForum({
        mainForumTitle,
        mainForumDesc,
        mainForumAuthor
      });

      newMainForum.save()
        .then (newForum => {
          res.json({
            newForum: {
              forumTitle: newForum.mainForumTitle,
              forumDesc: newForum.mainForumDesc,
              forumAuthor: newForum.mainForumAuthor
            }
          })
        })
       .catch (err => res.status(400).json('Error: ' + err));
    })
})

// @Route   GET /forums/mainForum/:id
// @desc    Get a specific main forum
// @access  Public
router.route('/mainForum/:id').get((req, res) => {
  mainForum.findById(req.params.id)
    .then (forum => res.json(forum));
})

// @Route   DELETE /forums/mainForum/:id
// @desc    Delete a specific main forum
// @access  Private, only accesible with admin accounts
router.route('/mainForum/:id').delete((req, res) => {
  mainForum.findByIdAndDelete(req.params.id)
    .then(forum => {
      res.json(`Forum ID: ${forum._id} Successfully deleted`);
    })
    .catch(err => {
      res.json(err);
    })
})

// SUBFORUMS BELOW --------------------------------------------------

// @Route   GET /forums/mainForum/:mainForumId/subForum
// @desc    Get a main forum's subforum data
// @access  Private, only moderators
router.route('/mainForum/:mainForumId/subForum').get((req, res) => {
  mainForum.findById(req.params.mainForumId)
    .populate('subForums')
    .then (found => {
      res.send(found.subForums);
    })
})

// @Route   GET /forums/subForum/
// @desc    Get all sub forums
// @access  Public
router.route('/subForum').get((req, res) => {
  subForum.find({})
    .then( sub => res.send(sub));
})

// @Route   DELETE /forums/subForum/
// @desc    Delete all subforums
// @access  Private
router.route('/subForum').delete((req, res) => {
  subForum.deleteMany({}, (err, result) => {
    if (err) res.send(err);
    else res.send('Successfully deleted all subforums');
  })
})

// @Route   GET /forums/subForum/:subForumID
// @desc    Get a specific sub forum
// @access  Public
router.route('/subForum/:subForumID').get((req, res) => {
  subForum.findById(req.params.subForumID)
    .then (sub => res.json(sub));
})

// @Route   DELETE /forums/subForum/:subForumID
// @desc    Delete a specific sub forum
// @access  Private, only done by owner and web admins/moderators
router.route('/subForum/:subForumID').delete((req, res) => {
    subForum.findByIdAndDelete(req.params.subForumID)
      .then (sub => {
        mainForum.findById(sub.parentForum)
          .then (found => {
            found.subForums.pull(req.params.subForumID);
            res.send(found);
            found.save();
          })
          .catch (err => res.send(err));
      })
      .catch (err => res.send(err));

})

// @Route   POST /forums/mainForum/:mainForumID/subForum
// @desc    Create a new subforum for a mainforum
// @access  Private, only accessible by moderators
router.route('/mainForum/:mainForumID/subForum').post((req, res) => {
  const { subForumTitle, subForumDesc, subForumAuthor} = req.body;

  const newSubForum = new subForum ({
    subForumTitle,
    subForumDesc,
    subForumAuthor,
    parentForum: req.params.mainForumID
  })

  newSubForum.save()
    .then (newSub => {
      mainForum.findByIdAndUpdate({"_id": req.params.mainForumID},
      {$push: {'subForums': newSub._id}},
      {new: true},
      (err, updated) => {
        if (err) throw err;
        res.send(updated);
      })
    })
    .catch(err => res.status(400).json('Error: ' + err));
})

// @Route   POST /forums/subForum/:subForumID/upvote
// @desc    Increment upvote counter by 1
// @access  Public


module.exports = router;