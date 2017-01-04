const expect = require('expect');
const request = require('supertest');

const {app} = require('../server/server.js');
const {Todo} = require('../server/model/todo.js');
const {ObjectID} = require('mongodb');
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
    "text": "spank the monkey",
  }
];

beforeEach((done) => {
  Todo.insertMany(todos);
  Todo.remove({}).then(() => done());
});

describe('POST todos', () => {
  it('should create a new todo', (done) => {
     var text = 'testing adding a new todo';
     request(app).post('/todos')
     .send({text})
     .expect(200)
     .expect((res) => {
       expect(res.body.text).toBe(text);
     })
     .end((err, res) => {
       if (err) {
         return done(err);
       }
       Todo.find({text}).then((todos) => {
         expect(todos.length).toBe(1);
         expect(todos[0].text).toBe(text);
         done();
       }).catch((e) => done());
     });
  });

  it('should not create a new todo with invalid data', (done) => {
    request(app).post('/todos')
    .send({})
    .expect(400)
    .end((err, res) => {
      if (err) {
        return done(err);
      }
      Todo.find().then((todos) => {
        expect(todos.length).toBe(3);
        done();
      }).catch((e) => done(e));
    });
  })
});

describe('GET todos', () => {
  it('should get all todos', (done) => {
    request(app).get('/todos')
    .send()
    .expect(200)
    .expect((res) => {
      expect(res.body.todos.length).toBe(3)
    })
    .end(done);
  });
});

describe('GET todos/:id', () => {
  it('should return 404 for invalid ObjectID', (done) => {
    request(app).get('/todos/1234512345')
    .send()
    .expect(404)
    .expect((res) => {
      expect(res.body).toEqual({});
    })
    .end(done);
  });
  it('should return 404 for unknown valid ObjectID', (done) => {
    var hexId = new ObjectID();
    request(app).get('/todos/' + hexId)
    .send()
    .expect(404)
    .expect((res) => {
      expect(res.body).toEqual({});
    })
    .end(done);
  });
  it('should return the correct response for known valid ObjectID', (done) => {
    request(app).get('/todos/' + todos[0]._id.toHexString())
    .send()
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(todos[0].text);
    })
    .end(done);
  });
});

describe('DELETE todos/:id', () => {
  it('should delete a todo', (done) => {
    var hexId = todos[1]._id.toHexString();
    request(app).delete('/todos/' + hexId)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(todos[1].text);
    })
    .end((err, res) => {
      if (err) {
        return done(err);
      }
      Todo.findById(hexId).then((deletedTodo) => {
        expect(deletedTodo).toNotExist();
        done();
      }).catch((e) => done(e));
    });
  });

  it('should return a 404 if todo not found', (done) => {
    var hexId = new ObjectID();
    request(app).delete('/todos/' + hexId)
    .send()
    .expect(404)
    .expect((res) => {
      expect(res.body).toEqual({});
    })
    .end(done);
  });

  it('should return a 404 if todo id not valid', (done) => {
    request(app).delete('/todos/1234512345')
    .send()
    .expect(404)
    .expect((res) => {
      expect(res.body).toEqual({});
    })
    .end(done);
  });
});
