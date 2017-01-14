const expect = require('expect');
const request = require('supertest');

const {app} = require('../server/server');
const {Todo} = require('../server/model/todo');
const {ObjectID} = require('mongodb');

const {users, populateUsers, todos, populateTodos} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

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

describe('PATCH /todos:/id', () => {
  it('should update the todo', (done) => {
    var hexId = todos[1]._id.toHexString();
    request(app).patch('/todos/' + hexId)
    .send({text: "new text for test", completed: true})
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe("new text for test");
      expect(res.body.todo.completed).toBe(true);
      expect(res.body.todo.completedAt).toBeA('number');
    })
    .end(done);
  });
  it('should clear completedAt when todo is not completed', (done) => {
    var hexId = todos[2]._id.toHexString();
    request(app).patch('/todos/' + hexId)
    .send({completed: false})
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe("spank the monkey");
      expect(res.body.todo.completed).toBe(false);
      expect(res.body.todo.completedAt).toNotExist();
    })
    .end(done);
  });
});
