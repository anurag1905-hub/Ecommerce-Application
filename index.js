const express = require('express');
const app = express();
const db = require('./config/mongoose');

require('dotenv').config();

app.use('/',require('./routes/index'));

const port = process.env.port || 8000;

app.listen(port,function(err){
    if(err){
        console.log('Error in starting the server');
    }
    else{
        console.log(`Server is running successfully at port ${port}`);
    }
});