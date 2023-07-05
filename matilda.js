const express = require('express');
const bodyParser = require('body-parse');
const session = require('express-session');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

