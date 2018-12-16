// Initialize server. Code snippet from assignment
var express = require("express");
var http = require("http");
var path = require("path");

var port = process.argv[2];
var app = express();

var indexRouter = require("./routes/index");
app.get("/", indexRouter);
app.get("/play", indexRouter);

app.use(express.static(__dirname + "/public"));

http.createServer(app).listen(port);
