const router = require('express').Router();
const User = require('../models/user.model');
const forumPost = require('../models/forumPost.model');
const postComment = require('../models/postComment.model');

// @Route   GET /comments/
// @desc    Get all comments
// @access  Public
router.route('/').get((req, res) => {
  postComment.find({})
    .then(comments => res.send(comments));
})

// @Route   Get /comments/:postID
// @desc    Get all comments in a specific post
// @access  Public
router.route('/:postID').get((req, res) => {
  forumPost.findById(req.params.postID)
    .populate('forumComments')
    .then (found => {
      res.send(found.forumComments)
    })
    .catch (err => {
      res.send(err);
    })
})

// @Route   post /comments/:postID
// @desc    Post a comment to a post and add it to forumComments array in both user and parent post
// @access  Private
router.route('/:postID').post((req, res) => {
  const { commentAuthor, commentBody } = req.body;

  if (!commentAuthor || !commentBody) {
    return res.status(400).json({msg: 'Missing information'});
  } else {

    const newComment = new postComment({
      commentAuthor,
      commentBody,
      'parentPost': req.params.postID 
    })

    newComment.save()
      .then (comment => {
        res.json({
          comment: {
            commentAuthor: comment.commentAuthor,
            commentBody: comment.commentBody,
            commentDate: comment.commentDate,
            parentPost: comment.parentPost,
            commentUpvotes: comment.commentUpvotes,
            commentDownvotes: comment.commentDownvotes,
            commentID: comment._id
          }
        })

        User.findByIdAndUpdate(comment.commentAuthor,
          {$push: {'forumComments': comment._id}},
          (err => {
            if (err) throw err;
          }));

        forumPost.findByIdAndUpdate(comment.parentPost,
          {$push: {'forumComments': comment._id}},
          (err => {
            if (err) throw err;
          }))
      })
      .catch (err => {
        res.status(400).json('Error: ' + err);
      })
  }
})

// @Route   GET /comments/:postID/:commentID
// @dec     Get a specific comment from a post
// @access  Public
router.route('/:postID/:commentID').get((req, res) => {
  postComment.findById(req.params.commentID)
    .then(comment => {
      res.send(comment);
    })
    .catch (err => {
      res.send(err);
    })
})

// @Route   DELETE /comments/:postID/:commentID
// @desc    Delete a comment from a post and remove it from post array and user
// @access  Private
router.route('/:postID/:commentID').delete((req, res) => {

    postComment.findByIdAndDelete(req.params.commentID)
      .then(comment => {
        User.findOneAndUpdate(comment.commentAuthor,
          {$pull: {'forumComments': comment._id}},
          (err => {
            if (err) throw err;
          }));

        forumPost.findByIdAndUpdate(comment.parentPost,
          {$pull: {'forumComments': comment._id}},
          (err => {
            if (err) throw err;
          }));

        res.send(`Comment: ${comment._id} has been deleted`);
      })
      .catch (err => {
        res.status(400).json('Error ' + err);
      })
})

// @Route   POST /comments/:postID/:commentID/upvote
// @desc    Increment upvote counter by 1
// @access  Public
router.route('/:postID/:commentID/upvote').post((req, res) => {

  const {userID} = req.body;

  postComment.findByIdAndUpdate(req.params.commentID,
    {$inc: {commentUpvotes: 1}},
    {new: true})
    .then (comment => {
    res.send(`Comment upvotes: ${comment.commentUpvotes}`)
    })
    .catch (err => {
      res.send(err);
    })

  User.findByIdAndUpdate(userID,
    {$push: {'upvotedComments': req.params.commentID}})
    .then (console.log('Added to upvotedComments array'))
    .catch (err => res.send(err));
})

// @Route   DELETE /comments/:postID/:commentID/upvote
// @desc    Decrement upvote counter by 1
// @access  Public
router.route('/:postID/:commentID/upvote').delete((req, res) => {

  const {userID} = req.body;

  postComment.findByIdAndUpdate(req.params.commentID,
    {$inc: {commentUpvotes: -1}},
    {new: true})
    .then (comment => {
    res.send(`Comment upvotes: ${comment.commentUpvotes}`)
    })
    .catch (err => {
      res.send(err);
    })

  User.findByIdAndUpdate(userID,
    {$pull: {'upvotedComments': req.params.commentID}})
    .then (console.log('Removed from upvotedComments array'))
    .catch (err => res.send(err));
})

// @Route   POST /comments/:postID/:commentID/downvote
// @desc    Decrement downvote counter by -1
// @access  Public
router.route('/:postID/:commentID/downvote').post((req, res) => {

  const {userID} = req.body;

  postComment.findByIdAndUpdate(req.params.commentID,
    {$inc: {commentDownvotes: -1}},
    {new: true})
    .then (comment => {
    res.send(`Comment downvotes: ${comment.commentDownvotes}`)
    })
    .catch (err => {
      res.send(err);
    })

  User.findByIdAndUpdate(userID,
    {$push: {'downvotedComments': req.params.commentID}})
    .then (console.log('Added to downvotedComments array'))
    .catch (err => res.send(err));
})

// @Route   DELETE /comments/:postID/:commentID/downvote
// @desc    Increment downvote counter by 1
// @access  Public
router.route('/:postID/:commentID/downvote').delete((req, res) => {

  const {userID} = req.body;

  postComment.findByIdAndUpdate(req.params.commentID,
    {$inc: {commentDownvotes: 1}},
    {new: true})
    .then (comment => {
    res.send(`Comment downvotes: ${comment.commentDownvotes}`)
    })
    .catch (err => {
      res.send(err);
    })

  User.findByIdAndUpdate(userID,
    {$pull: {'downvotedComments': req.params.commentID}})
    .then (console.log('Removed from downvotedComments array'))
    .catch (err => res.send(err));
})

module.exports = router;