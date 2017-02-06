const expect = require('expect');
const request = require('supertest');

const {app} = require('../server/server');
const {Todo} = require('../server/model/todo');
const {User} = require('../server/model/user');
const {ObjectID} = require('mongodb');

const {users, populateUsers, todos, populateTodos} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST todos', () => {
  it('should create a new todo', (done) => {
     var text = 'testing adding a new todo';
     request(app).post('/todos')
     .set('x-auth', users[0].tokens[0].token)
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
    .set('x-auth', users[0].tokens[0].token)
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
  it('should get all my todos', (done) => {
    request(app).get('/todos')
    .set('x-auth', users[0].tokens[0].token)
    .send()
    .expect(200)
    .expect((res) => {
      expect(res.body.todos.length).toBe(2)
    })
    .end(done);
  });
});

describe('GET todos/:id', () => {
  it('should return 404 for invalid ObjectID', (done) => {
    request(app).get('/todos/1234512345')
    .set('x-auth', users[0].tokens[0].token)
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
    .set('x-auth', users[0].tokens[0].token)
    .send()
    .expect(404)
    .expect((res) => {
      expect(res.body).toEqual({});
    })
    .end(done);
  });
  it('should return the correct response for known valid ObjectID', (done) => {
    request(app).get('/todos/' + todos[0]._id.toHexString())
    .set('x-auth', users[0].tokens[0].token)
    .send()
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(todos[0].text);
    })
    .end(done);
  });
  it('should not return a todo created by another user', (done) => {
    request(app).get('/todos/' + todos[2]._id.toHexString())
    .set('x-auth', users[0].tokens[0].token)
    .send()
    .expect(404)
    .expect((res) => {
      expect(res.body.todo).toNotExist();
    })
    .end(done);
  });
});

describe('DELETE todos/:id', () => {
  it('should delete a todo', (done) => {
    var hexId = todos[1]._id.toHexString();
    request(app).delete('/todos/' + hexId)
    .set('x-auth', users[0].tokens[0].token)
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

  it('should not delete another user\'s todo', (done) => {
    var hexId = todos[1]._id.toHexString();
    request(app).delete('/todos/' + hexId)
    .set('x-auth', users[1].tokens[0].token)
    .expect(404)
    .expect((res) => {
      expect(res.body.todo).toNotExist();
    })
    .end((err, res) => {
      if (err) {
        return done(err);
      }
      Todo.findById(hexId).then((notDeletedTodo) => {
        expect(notDeletedTodo).toExist();
        done();
      }).catch((e) => done(e));
    });
  });

  it('should return a 404 if todo not found', (done) => {
    var hexId = new ObjectID();
    request(app).delete('/todos/' + hexId)
    .set('x-auth', users[0].tokens[0].token)
    .send()
    .expect(404)
    .expect((res) => {
      expect(res.body).toEqual({});
    })
    .end(done);
  });

  it('should return a 404 if todo id not valid', (done) => {
    request(app).delete('/todos/1234512345')
    .set('x-auth', users[0].tokens[0].token)
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
    .set('x-auth', users[0].tokens[0].token)
    .send({text: "new text for test", completed: true})
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe("new text for test");
      expect(res.body.todo.completed).toBe(true);
      expect(res.body.todo.completedAt).toBeA('number');
    })
    .end(done);
  });
  it('should not update the todo as another user', (done) => {
    var hexId = todos[1]._id.toHexString();
    request(app).patch('/todos/' + hexId)
    .set('x-auth', users[1].tokens[0].token)
    .send({text: "new text for test", completed: true})
    .expect(404)
    .expect((res) => {
      expect(res.body.todo).toNotExist();
    })
    .end(done);
  });
  it('should clear completedAt when todo is not completed', (done) => {
    var hexId = todos[2]._id.toHexString();
    request(app).patch('/todos/' + hexId)
    .set('x-auth', users[1].tokens[0].token)
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


describe('GET /users/me', () => {
  it('should return the user if authenticated.', (done) => {
     request(app).get('/users/me')
     .set('x-auth', users[0].tokens[0].token)
     .expect(200)
     .expect((res) => {
       expect(res.body.user._id).toBe(users[0]._id.toString());
       expect(res.body.user.email).toBe(users[0].email);
     })
     .end(done);
  });

  it('should return 401 if the user is not authenticated.', (done) => {
    request(app).get('/users/me')
    .expect(401)
    .expect((res) => {
      expect(res.body).toEqual({});
    })
    .end(done);
  });

});

describe('POST /users', () => {
  it('should create new user', (done) => {
    var email = 'example@example.com';
    var password = 'password123';
    request(app)
    .post('/users')
    .send({email, password})
    .expect(200)
    .expect((res) => {
      expect(res.headers['x-auth']).toExist();
      expect(res.body._id).toExist();
      expect(res.body.email).toBe(email);
    })
    .end((err) => {
      if (err) {
        done(err);
      }
      User.findOne({email}).then((user) => {
        expect(user).toExist();
        expect(user.password).toNotBe(users[0].password);
        done();
      }).catch((e) => done(e));
    });
  });

  it('should not create new user if duplicate email', (done) => {
    var email = 'notanemail';
    var password = '';
    request(app)
    .post('/users')
    .send({email, password})
    .expect(400)
    .expect((res) => {
      expect(res.body).toEqual({});
      done();
    }).catch((e) => done(e));
  });

  it('should return validation errors if invalid request', (done) => {
    var email = 'sammy@wuut.com';
    var password = 'testpassword23';
    request(app)
    .post('/users')
    .send({email, password})
    .expect(400)
    .expect((res) => {
      expect(res.body).toEqual({});
      done();
    }).catch((e) => done(e));
  });

});

describe('POST /users/login', () => {
  it('should login user and return auth token', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        User.findById(users[1]._id).then((user) => {
          expect(user.tokens[1]).toInclude({
            access: 'auth',
            token: res.headers['x-auth']
          });
          done();
        }).catch((e) => done(e));
      });
  });

  it('should reject invalid login', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: "not the right password"
      })
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toNotExist();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        User.findById(users[1]._id).then((user) => {
          expect(user.tokens.length).toBe(1);
          done();
        }).catch((e) => done(e));
      });
    });

});

describe('DELETE /users/me/token', () => {
  it('should remove auth token on logout', (done) =>{
    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        User.findById(users[0]._id).then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((e) => done(e));
      });
  });
});
