const express = require("express");
const mongoose = require('mongoose');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const app = express();


//Database Connection
mongoose.connect('mongodb://localhost/vidly', {useNewUrlParser: true})
    .then( () => console.log('Connected to MongoDB..'))
    .catch(error => console.log('Could not Connect to MongoDB...'));

//Express Middlwware Function
app.use(express.json());
app.use('/api/genres/',genres);
app.use('/api/customers/', customers);


const port = process.env.port || 3000;
app.listen(port, () => {console.log(`Listening on port ${port}....`)});