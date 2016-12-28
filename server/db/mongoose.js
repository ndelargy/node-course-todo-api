var mongoose = require('mongoose');

ds133378.mlab.com:33378/node-course-todos -u chim -p freaklechic

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodosApp');

module.exports.mongoose = mongoose
