const router = require('express').Router();
const User = require('../models/user.model');
const bcrypt = require('bcrypt');

// @Route   GET /users/
// @desc    Returns all users
// @access  Public
router.route('/').get((req, res) => {
  User.find({})
      .select('-hashedPassword')
      .then( users => res.send(users));
})

// @Route   GET /users/:id
// @desc    Return a specific user
// @access  Public
router.route('/:id').get((req, res) => {
  User.findById(req.params.id)
      .select('-hashedPassword')
      .then( user => res.json(user));
})

// @Route   DELETE /users/:id
// @desc    Delete a specific user
// @access  TEMP
router.route('/:id').delete((req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then(user => {
      res.json(`User: ${user.firstName} ${user.lastName} ${user._id} has been deleted.`)
    })
    .catch(err => {
      res.json(err);
    });
})

router.route('/register').post((req, res) => {
  const BCRYPT_SALT_ROUNDS = 12;
  const {firstName, lastName, userName, email, password } = req.body;

  // Validation
  if (!firstName || !lastName || !userName || !email || !password) {
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
      const newUser = new User({firstName, lastName, userName, hashedPassword, email});

      // Save the new user into the database
      newUser.save()
        .then( newRegUser => {
          res.json({
            newRegUser: {
              user_id: newRegUser.id,
              firstName: newRegUser.firstName,
              lastName: newRegUser.lastName,
              userName: newRegUser.userName,
              email: newRegUser.email
            }
          })
        })
        .catch (err => res.status(400).json('Error: ' + err));
    })
})

module.exports = router;