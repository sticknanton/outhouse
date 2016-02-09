var express =   require('express');
var router  =   express.Router();
var User    =   require('../models/user');


router.post('/', function (req, res) {
  var userData = req.body.user;
  var user = new User(userData);
  user.save(function (err, dbUser) {
    res.json({user: dbUser});
  });
});


router.post('/authenticate', function (req, res) {
  var usernameTry = req.body.username;
  var passwordTry = req.body.password;

  User.findOne({username: usernameTry}, function (err, dbUser) {
    dbUser.authenticate(passwordTry, function (err, isMatch) {
      if (isMatch) {
        dbUser.setToken(function () {
          res.json({description: 'password is accepted', token: dbUser.token});
        });
      }else {
          res.json({description: 'your password is not correct'});
      }
    });
  });
});

module.exports = router;
