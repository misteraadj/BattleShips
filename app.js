// Initialize server. Code snippet from assignment
var express = require("express");
var http = require("http");
var path = require("path");
var websocket = require("ws");

var port = process.argv[2];
var app = express();

var indexRouter = require("./routes/index");
app.get("/", indexRouter);
app.get("/play", indexRouter);

app.use(express.static(__dirname + "/public"));

var server = http.createServer(app);

// console.log("Server is created!!");
const wss = new websocket.Server({ server });
console.log("Websocket is created!!");

wss.on("connection", function(ws) {
  ws.on("message", function incoming(message) {
    console.log("[LOG] " + message);
  });
});

server.listen(port)