// Initialize server. Code snippet from assignment
var express = require("express");
var http = require("http");
var path = require("path");
var websocket = require("ws");

var gameStatus = require("./statTracker");
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

var connectionID = 0;//each websocket receives a unique ID
wss.on("connection", function (ws) {
  /*
   * two-player game: every two players are added to the same game
  //  */
  let con = ws;
  con.id = connectionID++;
  // let playerType = currentGame.addPlayer(con);
  // websockets[con.id] = currentGame;

  console.log("Player %s placed in game", con.id);

  ws.on("message", function incoming(message) {
    console.log("[LOG] " + message);
  });
});


server.listen(port)