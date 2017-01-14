const {ObjectID} = require('mongodb');

const {Todo} = require('../../server/model/todo');

const todos = [
  {
    _id: new ObjectID(),
    "text": "spank your monkey",
  },
  {
    _id: new ObjectID(),
    "text": "spank my monkey",
  },
  {
    _id: new ObjectID(),
    "text": "spank the monkey",
    "completed": true,
    "completedAt": 333333,
  }
];

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    Todo.insertMany(todos);
  }).then(() => done());
};

module.exports = {
  todos,
  populateTodos
}
