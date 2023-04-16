const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const port = 3000;
const cors = require('cors');

app.use(cors());
// Configure bodyParser to handle JSON data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Connect to the MongoDB database
mongoose.connect('mongodb://127.0.0.1:27017/database-dxc', { useNewUrlParser: true, useUnifiedTopology: true });

// Define the User schema and model
const userSchema = new mongoose.Schema({
    name: String,
    lastname: String,
    id: String,
    email: String
});
const User = mongoose.model('User', userSchema);

// GET all users
app.get('/users', async (req, res) => {
  try {
      const users = await User.find();
      res.json(users);
  } catch (err) {
      res.status(500).send(err);
  }
});

// GET a specific user by ID
app.get('/users/:id', async (req, res) => {
  try {
      const user = await User.findById(req.params.id);
      res.json(user);
  } catch (err) {
      res.status(500).send(err);
  }
});

// POST a new user
app.post('/users', async (req, res) => {
  const user = new User({
      name: req.body.name,
      lastname: req.body.lastname,
      id: req.body.id,
      email: req.body.email
  });
  try {
      const newUser = await user.save();
      res.json(newUser);
  } catch (err) {
      res.status(500).send(err);
  }
});

// PUT (update) a specific user by ID
app.put('/users/:id', async (req, res) => {
  try {
      const user = await User.findById(req.params.id);
      user.name = req.body.name;
      user.lastname = req.body.lastname;
      user.id = req.body.id;
      user.email = req.body.email;
      const updatedUser = await user.save();
      res.json(updatedUser);
  } catch (err) {
      res.status(500).send(err);
  }
});

// DELETE a specific user by ID
app.delete('/users/:id', async (req, res) => {
  try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.json(user);
  } catch (err) {
      res.status(500).send(err);
  }
});

// Catch all undefined routes and send error response
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
