const express = require('express');
const app = express();
const db = require('./config/mongoose');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');

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