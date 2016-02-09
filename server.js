var express       = require('express'),
    bodyParser    = require('body-parser'),
    mongoose      = require('mongoose');


var app = express();
app.use(express.static('./public'));
app.use( bodyParser.urlencoded({extended: true}) );
app.use( bodyParser.json() );
var mongoPath = 'mongodb://localhost/outhouse-app-03';
mongoose.connect(process.env.MONGOLAB_URI||mongoPath);



var users = require('./routers/users');
app.use('/api/users', users);
var outhouses = require('./routers/outhouses');
app.use('/api/outhouses', outhouses);

app.get('/', function(req, res){
 res.sendFile( __dirname + '/views/index.html');
})

var port = 8080;
app.listen(process.env.PORT || port, function(){
  console.log('...listening on ' + port);
});
