const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/model/todo.js');
const {User} = require('./../server/model/user.js');

const id = "584e67a6f772e51b847559c7";

if (!ObjectID.isValid(id)) {
  console.log('id not valid');
  return;
}
// Todo.find({_id: id}).then((todos) => {
//   console.log(todos);
// });
//
// Todo.findOne({_id: id}).then((todo) => {
//   console.log(todo);
// });
//
// Todo.findById(id).then((todo) => {
//   if (!todo) {
//     console.log('id not found');
//     return;
//   }
//   console.log(todo);
// }).catch((e) => {
//   console.log(e);
// });
// new User({email:'n.delargy@ctidigital.com'}).save();

User.findById(id).then((user) => {
  if (!user) {
    console.log('id not found');
    return;
  }
  console.log(user);
}).catch((e) => {
  console.log(e);
});
