var mongoose = require('mongoose');

var Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true,
    minLength: 1,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  }
});

module.exports.Todo = Todo;
// var newTodo = new Todo({
//   text: "Catch bus"
// });
//
// newTodo.save().then((document) => {
//   console.log("saved to do", document);
// },
// (err) => {
//   console.log('unable to save todo:' , err);
// });
