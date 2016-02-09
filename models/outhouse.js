var mongoose = require('mongoose');

var OuthouseSchema = mongoose.Schema({
  state: {type: String},
  city: {type:String},
  address: {type: String},
  position: {lat: {type: Number}, lng: {type :Number}},
  poster: {type: String},
  title: {type: String},
  description: {type: String},
  rating: {type: Number}
});


module.exports = mongoose.model('Outhouse', OuthouseSchema);
