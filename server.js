const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Person = require('./models.js');

const port = process.env.PORT || 3000;

const app = express();

// error status code constants
const STATUS_SERVER_ERROR = 500;
const STATUS_USER_ERROR = 422;

app.use(bodyParser.json());

// Your API will be built out here.
app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  Person.findById(id, (err, user) =>{
    if(err) {
      res.status(STATUS_SERVER_ERROR);
      res.json({error:err});
    } else {
      res.json(user.friends);
    }
  });
});

app.get('/users', (req, res) => {
  Person.find({}, (err, people) =>{
    if(err) {
      res.status(STATUS_SERVER_ERROR);
      res.json({error:err});
    } else {
      res.json(people);
    }
  });
});

app.get('/users/:direction', (req, res) => {
  const { direction } = req.params;
  let order = direction;

  // console.log("Direction to sort by: ", direction);
  if (direction != 'asc' && direction != 'desc') {
    order = 'asc';
    console.log("in loop" + order);

  }
  console.log(order);
  Person.find({})
  .sort({ firstName: order })
  .exec((err, users) => {
    if (err) {
      res.status(STATUS_USER_ERROR);
      res.json({ error: err });
    } else {
      res.json(users);
    }
  });
});

app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { firstName, lastName } = req.body;
  const updates = { firstName, lastName };
  if (!firstName) {
    res.status(STATUS_USER_ERROR);
    res.json({ error: 'Please modify the FIRST NAME.' });
    return;
  }
  if (!lastName) {
    res.status(STATUS_USER_ERROR);
    res.json({ error: 'Please modify the LAST NAME.' });
    return;
  }
  Person.updateOne({ _id: id }, updates, (err) => {
    if (err) {
      res.status(STATUS_SERVER_ERROR);
      res.json(`There is no: ${err.value}`);
    } else {
      res.json(updates);
    }
  });
});



mongoose.Promise = global.Promise;
const connect = mongoose.connect(
  'mongodb://localhost/people',
  { useMongoClient: true }
);
/* eslint no-console: 0 */
connect.then(() => {
  app.listen(port);
  console.log(`Server Listening on ${port}`);
}, (err) => {
  console.log('\n************************');
  console.log("ERROR: Couldn't connect to MongoDB. Do you have it running?");
  console.log('************************\n');
});
