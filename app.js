// Initialize server. Code snippet from assignment
var express = require("express");
var http = require("http");
var path = require("path");
var websocket = require("ws");

var messages = require("./public/javascripts/messages");
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

// Keep track of all client connected: sessionID (client) -> GameObject
var websockets = {};

/*
 * Regularly clean up the websockets object
 */
setInterval(function () {
  for (let i in websockets) {
    if (websockets.hasOwnProperty(i)) {
      let gameObj = websockets[i];
      // If the gameObj has a final status, the game is complete/aborted
      if (gameObj.finalStatus != null) {
        console.log("\tDeleting element " + i);
        delete websockets[i];
      }
    }
  }
}, 50000);

var currentGame = new Game(gameStatus.gamesInitialized++);
// Assign each new client an unique ID
var connectionID = 0;

wss.on("connection", function (ws) {
  // two-player game: every two players are added to the same game
  let con = ws;
  con.id = connectionID++;
  let playerType = currentGame.addPlayer(con);
  websockets[con.id] = currentGame;

  console.log("Player %s placed in game %s as %s", con.id, currentGame.id, playerType);

  // inform the client about its assigned player type
  con.send((playerType == "A") ? messages.S_PLAYER_A : messages.S_PLAYER_B);


//   if(playerType == "B" && currentGame.getWord()!=null){
//     let msg = messages.;
//     msg.data = currentGame.getWord();
//     con.send(JSON.stringify(msg));
// }
  /*
  #############################################
  ########### Receiving Messages ##############
  #############################################
  */
  ws.on("message", function incoming(message) {
    console.log("[LOG] " + message);
  });

  con.on("close", function (code) {

    // code 1001 means almost always closing initiated by the client;
    console.log(con.id + " disconnected ...");

    if (code == "1001") {
      // if possible, abort the game; if not, the game is already completed
      let gameObj = websockets[con.id];

      if (gameObj.isValidTransition(gameObj.gameState, "ABORTED")) {
        gameObj.setStatus("ABORTED");
        gameStatus.gamesAborted++;

        // determine whose connection remains open; close it
        try {
          gameObj.playerA.close();
          gameObj.playerA = null;
        }
        catch (e) {
          console.log("Player A closing: " + e);
        }

        try {
          gameObj.playerB.close();
          gameObj.playerB = null;
        }
        catch (e) {
          console.log("Player B closing: " + e);
        }
      }

    }
  });
});


server.listen(port)