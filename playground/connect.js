// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID();
console.log(obj);

// var user = {
//   name: 'Neil',
//   age: 42
// }
//
// var {name, age} = user;
//
// console.log(name);
// console.log(age);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    console.log('unable to connect to mongodb');
    console.log(err);
    return;
  }
  console.log('Connected to mongodb');

  db.collection('Todos').insertOne({
    text: "Book shoulder appointment with specialist",
    completed: false
  }, (err, result) => {
    if (err) {
      console.log('unable to add todo');
      console.log(JSON.stringify(err, undefined, 2));
      return;
    }

    console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
  });
  db.close();
});
