const router = require('express').Router();
const User = require('../models/user.model');
const mainForum = require('../models/mainForum.model');
const subForum = require('../models/subForum.model');
const forumPost = require('../models/forumPost.model');

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

// SUBFORUMS --------------------------------------------------

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
// @desc    Delete a specific sub forum and remove it from subForum array in the main forum document and delete all posts
// @access  Private, only done by owner and web admins/moderators
router.route('/subForum/:subForumId').delete((req, res) => {
    subForum.findByIdAndDelete(req.params.subForumId)
      .then (sub => {
        mainForum.findById(sub.parentForum)
          .then (found => {
            found.subForums.pull(req.params.subForumId);
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

// FORUM POSTS ----------------------------------------------------

// @Route   GET /forums/posts/
// @desc    Get all forum psots
// @access  Public
router.route('/posts').get((req, res) => {
  forumPost.find({})
    .then( sub => res.send(sub));
})

// @Route   GET /forums/posts/:postID
// @desc    Get a specific post
// @access  Public
router.route('/posts/:postID').get((req, res) => {
  forumPost.findById(req.params.postID)
    .then(post => res.send(post))
    .catch(err => res.send(err));
})

// @Route   GET /forums/subForum/:subForumID/post
// @desc    Get all posts from a sub forum
// @access  Public
router.route('/subForum/:subForumId/post').get((req, res) => {
  subForum.findById(req.params.subForumId)
    .populate('forumPosts')
    .then (found => {
      res.send(found.forumPosts);
    })
})

// @Route   POST /forums/subForum/:subForumID/post
// @desc    Create a new forum post for a sub forum
// @access  Public
router.route('/subForum/:subForumID/post').post((req, res) => {
  const { forumPostTitle, forumPostBody, forumPostCategory, forumPostAuthor} = req.body;

  const newForumPost = new forumPost ({
    forumPostTitle,
    forumPostBody,
    forumPostCategory,
    forumPostAuthor,
    parentSubForum: req.params.subForumID
  })

  newForumPost.save()
    .then (newPost => {
      subForum.findByIdAndUpdate({"_id": req.params.subForumID},
      {$push: {'forumPosts': newPost._id}},
      {new: true},
      (err, updated) => {
        if (err) throw err;
        res.send(updated);
      })
    })
    .catch(err => res.status(400).json('Error: ' + err));
})

// @Route   DELETE /forums/subForum/posts/:subForumID
// @desc    Deletes all posts within a subforum
// @access  Private
router.route('/subForum/posts/:subForumId').delete((req, res) => {
  forumPost.deleteMany({parentSubForum: req.params.subForumId})
    .then (res.send('Deleted posts'))
    .catch (err => res.send(err));
})

// @Route   DELETE /forums/posts/:postId
// @desc    Delete a specific forum post and remove it from the subforum array
// @access  Private, only done by owner and web admins/moderators
router.route('/posts/:postId').delete((req, res) => {
  forumPost.findByIdAndDelete(req.params.postId)
    .then (post => {
      subForum.findById(post.parentSubForum)
        .then (found => {
          found.forumPosts.pull(req.params.postId);
          res.send(found);
          found.save();
        })
        .catch (err => res.send(err));
    })
    .catch (err => res.send(err));
})

// @Route   POST /forums/posts/:postId/upvote
// @desc    Increment upvote counter by 1
// @access  Public
router.route('/posts/:postId/upvote').post((req, res) => {

  const {userID} = req.body;

  // Increment upvote by one
  forumPost.findByIdAndUpdate(req.params.postId, 
    {$inc: {postUpVotes: 1}}, {new: true})
    .then (found => res.send(found))
    .catch (err => res.send(err));

  // Add post ID to user
  User.findByIdAndUpdate(userID,
    {$push: {'upvotedPosts': req.params.postId}},
    {new: true})
    .then(console.log('Added post ID to user'))
    .catch(err => res.send(err));
})

// @Route   DELETE /forums/posts/:postId/upvote
// @desc    Decrement upvote counter by 1
// @access  Public
router.route('/posts/:postId/upvote').delete((req, res) => {

  const {userID} = req.body;

  // Decrement upvote by 1
  forumPost.findByIdAndUpdate(req.params.postId, 
    {$inc: {postUpVotes: -1}}, {new: true})
    .then (found => res.send(found))
    .catch (err => res.send(err));

  // Remove post ID to user
  User.findByIdAndUpdate(userID,
    {$pull: {'upvotedPosts': req.params.postId}},
    {new: true})
    .then(console.log('Removed post ID from user'))
    .catch(err => res.send(err));
})

// @Route   POST /forums/posts/:postId/upvote
// @desc    Decrement downvote counter by -1
// @access  Public
router.route('/posts/:postId/downvote').post((req, res) => {

  const {userID} = req.body;

  // Decrement downvote by -1
  forumPost.findByIdAndUpdate(req.params.postId, 
    {$inc: {postDownVotes: -1}}, {new: true})
    .then (found => res.send(found))
    .catch (err => res.send(err));

  // Remove post ID to user
  User.findByIdAndUpdate(userID,
    {$push: {'downvotedPosts': req.params.postId}},
    {new: true})
    .then(console.log('Added post ID to user'))
    .catch(err => res.send(err));
})

// @Route   DELETE /forums/posts/:postId/upvote
// @desc    Increment downvote counter by 1
// @access  Public
router.route('/posts/:postId/downvote').delete((req, res) => {

  const {userID} = req.body;

  // Increment downvote by 1
  forumPost.findByIdAndUpdate(req.params.postId, 
    {$inc: {postDownVotes: 1}}, {new: true})
    .then (found => res.send(found))
    .catch (err => res.send(err));

  // Remove post ID to user
  User.findByIdAndUpdate(userID,
    {$pull: {'downvotedPosts': req.params.postId}},
    {new: true})
    .then(console.log('Removed post ID from user'))
    .catch(err => res.send(err));
})

module.exports = router;