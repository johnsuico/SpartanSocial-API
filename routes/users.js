const router = require('express').Router();
const User = require('../models/user.model');
const bcrypt = require('bcrypt');

// @Route   GET /users/
// @desc    Returns all users
// @access  Public
router.route('/').get((req, res) => {
  User.find({})
      .select('-hashedPassword')  // Do not send the hashed password in the API response.
      .then( users => res.send(users));
})

// @Route   GET /users/:id
// @desc    Return a specific user
// @access  Public
router.route('/:id').get((req, res) => {
  User.findById(req.params.id)
      .select('-hashedPassword')      // Do not send the hashed password in the API response.
      .then( user => res.json(user));
})

// @Route   DELETE /users/:id
// @desc    Delete a specific user
// @access  TEMP
router.route('/:id').delete((req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then(user => {
      res.json(`User ID: ${user._id} Successfully deleted.`)
    })
    .catch(err => {
      res.json(err);
    });
})

// @Route   POST /users/register
// @desc    Register a new user
// @access  Public
router.route('/register').post((req, res) => {
  const BCRYPT_SALT_ROUNDS = 12;
  // const {userEmail, password } = req.body;
  // const userEmail = req.body.email.toLowerCase(0);
  let {email, password } = req.body;
  email = email.toLowerCase();

  // Validation
  if (!email || !password) {
    return res.status(400).json({msg: 'Please enter all fields'});
  }

  // Check for existing user
  User.findOne( {email} )
    .then(user => {

      // If a user already exist with the same email address, return 400 status
      // 400 = Bad request
      if(user) return res.status(400).json({msg: "User already exists"});

      // Generate encrypted password
      // Passwords will never be stored in the database as plain text. Security reasons.
      // Only the user will ever know what their password is. It'll be encrypted even for the admins and developers for security.
      let hashedPassword = bcrypt.hashSync(password, BCRYPT_SALT_ROUNDS);

      // Create newUser variable to hold all the user information needed for account creation.
      const newUser = new User({hashedPassword, email});

      // Save the new user into the database
      newUser.save()
        .then( newRegUser => {
          res.json({
            newRegUser: {
              user_id: newRegUser.id,
              email: newRegUser.email
            }
          })
        })
        .catch (err => res.status(400).json('Error: ' + err));
    })
})

// @route   POST /users/:id/register/cp2
// @desc    Send form from createprofile2 and update user
// @access  PRIVATE
router.route('/:id/register/cp2').post((req, res) => {
  const { firstName, lastName, userName, useDisplayName, major, isStudent } = req.body;
  const id = req.params.id;

  User.findOneAndUpdate({"_id": id}, {
    $set: {
      firstName,
      lastName,
      userName,
      useDisplayName,
      major,
      isStudent
    }
  }, {new: true}, (err, updated) => {
    if (err) throw err;
    res.send(updated);
  })

});

// @route   POST /users/:id/register/cp2
// @desc    Send form from createprofile3 and update user
// @access  PRIVATE
router.route('/:id/register/cp3').post((req, res) => {
  const { gradDate, birthDate, pronouns, gender, bio } = req.body;
  const id = req.params.id;

  User.findOneAndUpdate({"_id": id}, {
      $set: {
          gradDate,
          birthDate,
          pronouns,
          gender,
          bio
      }
  }, {new: true}, (err, updated) => {
      if (err) throw err;
      res.send(updated);
  })
});

// @Route   POST /users/auth
// @desc    Authenticate User for login
// @access  Public
router.route('/auth').post((req, res) => {
  const { password } = req.body;
  const email = req.body.email.toLowerCase();

  // Validation
  if (!email || !password) {
    return res.status(400).json({msg: 'Please enter all fields.'});
  }

  // Check for existing user
  User.findOne( {email} )
    .then (user => {
      // If user is NOT found in the database, send 400 status
      // 400 = Bad request
      if (!user) return res.status(400).json({msg: 'User does not exist.'});

      // Validate password
      bcrypt.compare(password, user.hashedPassword)
        .then (isMatch => {
          if (!isMatch) return res.status(400).json({msg: 'Invalid credentials.'});
          res.json({
            user: {
              user_id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              userName: user.userName,
              email: user.email
            }
          })
        })
    })
})

// @Route   GET /users/:userID/posts
// @desc    Get all posts from a uer
// @access  Public
router.route('/:userID/posts').get((req, res) => {
  User.findById(req.params.userID)
    .populate('forumPosts')
    .then (found => {
      res.send(found.forumPosts);
    })
    .catch (err => {
      res.send(err);
    })
})

module.exports = router;