var express = require('express');
var router = express.Router();
var Outhouse = require('../models/outhouse')

router.post('/', function (req, res) {
  var outhouseData = req.body.outhouse;
  var newOuthouse = new Outhouse(outhouseData)
  newOuthouse.save(function (err, dbOutHouse) {
    res.json( dbOutHouse );
  })
})
router.get('/', function (req, res) {
  dbOutHouses = Outhouse.all;
  Outhouse.find({}, function(err, dbOutHouses){
      res.json( {outhouses: dbOutHouses} );
    });
})

module.exports = router;
