var mongoose = require('mongoose');
Schema = mongoose.Schema;


var OuthouseSchema = new Schema({
  state: {type: String},
  city: {type:String},
  address: {type: String},
  position: {lat: {type: Number}, lng: {type :Number}},
  poster: {type: String},
  title: {type: String},
  description: {type: String},
  ratings: [ { username: {type: String}, value: {type: Number}  } ]
});

// OuthouseSchema.methods.average = function () {
//   var total=0;
//   for (var i = 0; i < this.ratings.length; i++) {
//     total+=this.ratings[i].value
//   }
//   var averageRating = total/this.ratings.length;
//   return averageRating;
// }

module.exports = mongoose.model('Outhouse', OuthouseSchema);
