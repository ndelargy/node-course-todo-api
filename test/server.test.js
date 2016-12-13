const expect = require('expect');
const request = require('supertest');

const {app} = require('../server/server.js');
const {Todo} = require('../server/model/todo.js');

beforeEach((done) => {
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
       Todo.find().then((todos) => {
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
        expect(todos.length).toBe(0);
        done();
      }).catch((e) => done());
    });
  })
});
