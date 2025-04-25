const express = require('express');
const auth_routes = require('./auth/urls');
const { formResponse, sendRestResponse } = require('./auth/utils');
const { STATUS_OK } = require('./auth/const');
const spotiyou = require('./spotiyou/spotiyou');

const port = 5500;
const app = express();

app.use('/auth', auth_routes);
app.use('/spotiyou', spotiyou);
app.use(express.json());

app.post('/', (req, res) => {
    sendRestResponse(res, STATUS_OK, formResponse(STATUS_OK, "Server is running"));
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
    // Call the authenticate function to start the OAuth2 flow
});