const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    console.log('unable to connect to mongodb');
    console.log(err);
    return;
  }
  //
  // db.collection('Todos').find({"_id": ObjectID("5847c3dba1a787aab9726ca3")}).toArray().then((docs) => {
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }, (err) => {
  //   console.log("Unable to fetch todos");
  //   console.log(JSON.stringify(err, undefined, 2));
  // });


    db.collection('Users').findOneAndUpdate({_id: new ObjectID("584dc59477846702487034a7")}, {
      $set : {
        name: "Neil"
      },
      $inc: {
        age: 1
      }
    }).then((result) => {
      console.log(result);
    }, (err) => {
      console.log("Unable to update todos.");
      console.log(JSON.stringify(err, undefined, 2));
    });

  // db.close();
});
