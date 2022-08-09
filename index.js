const express = require('express');
const cookieParser = require('cookie-parser');
const db = require('./config/mongoose');
const morgan = require('morgan');
const expressValidator = require('express-validator');
const bodyParser = require('body-parser');

const app = express();

app.use(express.urlencoded({extended:false}));
app.use(cookieParser());


require('dotenv').config();

const port = process.env.port || 8000;

app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(expressValidator());

app.use('/',require('./routes/index'));

app.listen(port,function(err){
    if(err){
        console.log('Error in starting the server');
    }
    else{
        console.log(`Server is running successfully at port ${port}`);
    }
});