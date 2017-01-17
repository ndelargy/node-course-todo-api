require('./config.js');

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

var {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose.js');
var {User} = require('./model/user.js');
var {Todo} = require('./model/todo.js');
var {authenticate} = require('./middleware/authenticate');

var app = express();

var port = process.env.PORT;

app.use(bodyParser.json());

app.listen(port, () => {
  console.log('Started listening on port ' + port);
})

app.post('/todos', (req, res) =>{
  var todo = new Todo({text: req.body.text});
  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos/:id', (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(404).send();;
  }
  var todo = Todo.findById(req.params.id).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    return res.send({todo});
  }).catch((e) => {
    return res.status(404).send();
  });
});

app.delete('/todos/:id', (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(404).send();;
  }
  var todo = Todo.findByIdAndRemove(req.params.id).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    else {
      return res.status(200).send({todo});
    }
  }).catch((e) => {
    return res.status(400);
  });
});

app.patch('/todos/:id', (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(404).send();;
  }
  var body = _.pick(req.body, ['text', 'completed']);
  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completedAt = null;
    body.completed = false;
  }

  Todo.findByIdAndUpdate(req.params.id, {$set: body}, {new: true}).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    return res.send({todo});
  }).catch((err) => {
    res.status(400).send();
  });
});

// POST /users
app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send();
  })
});

app.get('/users/me', authenticate, (req, res) => {
    res.send({user: req.user});
});

module.exports = {
  app
}
