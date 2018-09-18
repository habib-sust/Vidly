
const winston = require('winston');
const express = require('express');
const app = express();

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();


//port connection
const port = process.env.PORT || 3000;
// let server;
// if (process.env.NODE_ENV !== 'test') {
//     server = app.listen(port, () => winston.info(`Listening on port ${port}...`));
// }
    const server = app.listen(port, () => winston.info(`Listening on port ${port}...`));

module.exports = server;