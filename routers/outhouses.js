var express = require('express');
var router = express.Router();
var Outhouse = require('../models/outhouse')

router.post('/', function (req, res) {
  console.log(req.body.outhouse);
  var outhouseData = req.body.outhouse;
  var newOuthouse = new Outhouse(outhouseData)
  newOuthouse.save(function (err, dbOutHouse) {
    console.log(err);
    console.log(dbOutHouse);
    res.json( dbOutHouse );
  })
})
router.get('/', function (req, res) {
  dbOutHouses = Outhouse.all;
  Outhouse.find({}, function(err, dbOutHouses){
      res.json( {outhouses: dbOutHouses} );
    });
  })

  router.patch('/:id', function (req, res) {
    var updateOuthouse = req.body.outhouse;
    var id = req.params.id;
    Outhouse.findByIdAndUpdate(id, updateOuthouse, {new: true}, function(err, dbOutHouse) {
      console.log(req.body);
      // console.log(updateOuthouse);
      res.json(dbOutHouse)
    });

  });

module.exports = router;
