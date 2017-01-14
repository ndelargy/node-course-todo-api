const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');
const {Todo} = require('../../server/model/todo');
const {User} = require('../../server/model/user');


const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [
  {
    _id: userOneId,
    email: 'sammy@wuut.com',
    password: 'wassword',
    tokens: [
      {
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
      }
    ]
  },
  {
    _id: userTwoId,
    email: 'annie@wuut.com',
    password: 'wassword'
  }
]

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

const populateUsers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo]);
  }).then(() => done());

};
module.exports = {
  todos,
  populateTodos,
  users,
  populateUsers
}
