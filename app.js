// Initialize server. Code snippet from assignment
var express = require("express");
var http = require("http");
var path = require("path");
var websocket = require("ws");

var Game = require("./game");
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

// Keep track of all client connected: sessionID -> GameObject
var websockets = {}; 

/*
 * Regularly clean up the websockets object
 */ 
setInterval(function() {
    for(let i in websockets){
        if(websockets.hasOwnProperty(i)){
            let gameObj = websockets[i];
            // If the gameObj has a final status, the game is complete/aborted
            if(gameObj.finalStatus!=null){
                console.log("\tDeleting element "+i);
                delete websockets[i];
            }
        }
    }
}, 50000);

var currentGame = new Game(gameStatus.gamesInitialized++);
// Assign each new client an unique ID
var connectionID = 0;

wss.on("connection", function (ws) {
  /*
   * two-player game: every two players are added to the same game
  //  */
  let con = ws;
  con.id = connectionID++;
  let playerType = currentGame.addPlayer(con);
  websockets[con.id] = currentGame;

  console.log("Player %s placed in game %s as %s", con.id, currentGame.id, playerType);

  ws.on("message", function incoming(message) {
    console.log("[LOG] " + message);
  });
});


server.listen(port)