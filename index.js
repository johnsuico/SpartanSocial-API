const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

let User = require('./models/user.model');

require('dotenv').config();

// To use the built in body parser
app.use(express.json());

app.use(cors());

// Database connection
const source = process.env.MONGOOSE_URI; // You need to install dotenv for this to work. Contact John if you are having trouble.
mongoose.connect( source, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Successful database connection message. Check for this inside the console.
mongoose.connection.on('connected', () => {
  console.log('Successfully connected to MongoDB')
});

// Unsuccessful database connection message. Chekc for this inside the console.
mongoose.connection.on('error', console.error.bind(console, 'Connection error: '));

// User routes
// Routes are used in URL path like spartansocialapi.com/users
const userRouter = require('./routes/users');
app.use('/users', userRouter);


// app        : The application we are using (SpartanSocialAPI)
// get        : HTTP method. GETs data
// '/'        : URL path
// 'req, res' : request and response. Shorthand variables for the different API communications.
// res.send   : response will send
// This method is just used to test if the API can be connected using POSTMAN or web browser through web hosting.
app.get('/', (req, res) => {
  res.send("You made it to the API!");
})

// Message to console to indicate that starting the API was successful.
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Successfully served on port: ${PORT}.`)
})