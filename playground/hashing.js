const {SHA256} = require('crypto-js');

const jwt = require('jsonwebtoken');

const salt = 'murScrcre';

var data = {id: 77};


var token = jwt.sign(data, salt);

console.log(token);


var decoded = jwt.verify(token, salt);

console.log(decoded);
// var message = 'I am prisoner number six';
//
// var hash = SHA256(message).toString();
//
// console.log(message);
// console.log(hash);
//
//
//
// var data = {
//   id: 4
// };
//
// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + salt).toString(),
// };
//
// token.data.id = 7;
// token.hash = SHA256(JSON.stringify(token.data));
//
// var resultHash = SHA256(JSON.stringify(token.data) + salt).toString();
//
// if (resultHash === token.hash) {
//   console.log('good, trust dis schizzle');
// }
// else {
//   console.log('bad do not trust');
// }
