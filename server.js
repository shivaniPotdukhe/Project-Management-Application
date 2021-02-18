const express = require("express");
const bodyParser = require("body-parser");
const index = require("./routes/index");
// const apiRouter = require('./routes');
const apiResponse = require('./helper/apiResponse');

var app = express();

app.use(bodyParser.json());

//Route Prefixes
app.use("/api", index);

// throw 404 if URL not found
app.all('*', function (req, res) {
    return apiResponse.notFoundResponse(res, 'Not found');
  });

app.listen(4001);