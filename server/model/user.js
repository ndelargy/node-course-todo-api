var mongoose = require('mongoose');

var User = mongoose.model('User',{
  email: {
    type: String,
    required: true,
    minLength: 1,
    trim: true
  }
});

module.exports.User = User

// var newUser = new User({
//   email: 'n.delargy@ctidigital.com'
// });
// newUser.save().then((document) => {
//   console.log("saved new user", document);
// },
// (err) => {
//   console.log('unable to save todo:' , err);
// });
