const express = require('express');
const app = express();
const board = require("./boards");
const list = require("./lists");
const card = require("./cards");
const user = require("./users");

app.use('/board/', board);
app.use('/list/', list);
app.use('/card/', card);
app.use('/user/', user);

module.exports = app;
