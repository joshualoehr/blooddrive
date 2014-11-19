var express = require('express');
var router = express.Router();

var auth = require('http-auth');

var basic = auth.basic({
        realm: "Protected Information"
    }, function (username, password, callback) { // Custom authentication method.
        callback(username === "admin" && password === "admin1");
    }
);

/* GET home page. */
router.get('/blooddrive', function(req, res) {
  res.render('index', {  });

});

router.post('/blooddrive/addUser', function(req, res) {
  var db = req.db;
  var collection = db.get('users');

  var first = req.body.first;
  var last = req.body.last;
  var email = req.body.email;
  var phone = req.body.phone;
  var firstClass = req.body.firstClass;
  var time = req.body.time;
  var blockMissed = req.body.blockMissed;

  collection.insert({
    "first": first,
    "last": last,
    "email": email,
    "phone": phone,
    "firstClass": firstClass,
    "time": time,
    "blockMissed": blockMissed
  }, function(err, doc) {
    if (err) {
      res.send("An error occurred submitting your information to the server.");
    } else {
      res.location('confirm');
      res.redirect('confirm');
    }
  });
});

router.get('/blooddrive/confirm', function(req, res) {
  res.render('confirm', {  });
});

router.get('/blooddrive/results', auth.connect(basic), function(req, res) {
  var db = req.db;
  var collection = db.get('users');
  collection.find({},{},function (err, docs) {
    res.render('results', { rows: docs });
  });
});

module.exports = router;
