const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/model/todo.js');
const {User} = require('./../server/model/user.js');

const id = "584e67a6f772e51b847559c7";

// Todo.remove({}).then((result) => {
//   console.log(result);
// });

// Todo.findOneAndRemove
// Todo.findByIdAndRemove

Todo.findByIdAndRemove("58678a1971e489b41e4eb323").then((todo) => {
  console.log(todo);
})
