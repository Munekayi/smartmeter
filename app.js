//importing modules
require("./config/config");
require('./config/passportConfig');
require("./models/db");


var express = require('express');

var bodyparser = require('body-parser');
var cors = require('cors');
var path = require('path');


var app = express();

const passport = require('passport');
const route = require('./routes/route');
//const ipAddress = '34.133.79.24';
//port no
const port = process.env.PORT || 3000;

//body - parser
app.use(bodyparser.json());

//adding middleware - cors
app.use(cors());

app.use(passport.initialize());



//static files
app.use(express.static(path.join(__dirname,'public')));

//routes
app.use('/api', route);


//testing
app.get('/',(req, res)=>{
    res.send('foobar');
});

if (process.env.NODE_ENV === 'production'){
    app.use(express.static('client/dist/client'));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'dist', 'client', 'index.html'));
    });
}

app.listen(port,()=>{
    console.log('Server started at port:'+port);
});