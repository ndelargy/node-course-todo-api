var express = require('express');
var bodyParser = require('body-parser');

var {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose.js');
var {User} = require('./model/user.js');
var {Todo} = require('./model/todo.js');

var app = express();

var port = process.env.PORT || 3000;

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

module.exports = {
  app
}
