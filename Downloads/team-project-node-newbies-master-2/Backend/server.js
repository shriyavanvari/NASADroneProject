var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
const mongoose = require('mongoose');
const moment = require('moment');
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
const {uri} = require("./config/constants");
mongoose.connect(uri,{useNewUrlParser:true,useUnifiedTopology:true,poolSize:100});
const connection=mongoose.connection;
connection.once('open',()=>{
    console.log('Mongo DB Connected successfully!');
})
app.use('/bhumika',require('./routes/bhumika.js'));
app.use('/jyotsna',require('./routes/jyotsna.js'));
app.use('/mitra', require('./routes/mitra.js'));
app.use('/shriya', require('./routes/shriya.js'));
app.listen(3001);
console.log("Server Listening on port 3001");
