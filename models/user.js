var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var crypto = require('crypto');

var UserSchema = mongoose.Schema({
  username: {type: String},
  password: {type: String},
  token: {type: String}
});

UserSchema.pre('save', function (next) {
  if( this.isModified('password')){
    this.password = bcrypt.hashSync(this.password, 10);
  }
  next();
})

UserSchema.methods.authenticate = function (passwordTry, callback) {
  bcrypt.compare(passwordTry, this.password, function (err, isMatch) {
    if (err) {return callback(err)}
    callback(null, isMatch);
  });
};

UserSchema.methods.setToken = function (callback) {
  var scope = this;
  crypto.randomBytes(256, function (err, rawToken) {
    scope.token = rawToken;
    scope.save(function () {
      callback();
    });
  });
};

module.exports = mongoose.model('User', UserSchema);
