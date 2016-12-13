var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose.js');
var {User} = require('./model/user.js');
var {Todo} = require('./model/todo.js');

var app = express();

app.use(bodyParser.json());

app.listen(3000, () => {
  console.log('Started listening on port 3000');
})

app.post('/todos', (req, res) =>{
  var todo = new Todo({text: req.body.text});
  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

module.exports = {
  app
}
