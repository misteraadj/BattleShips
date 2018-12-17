// Mostly copied from assignment file.
/* every game has two players, identified by their WebSocket */
var game = function (gameID) {
    this.playerA = null;
    this.playerB = null;
    this.id = gameID;
    this.shipLocationsPlayerA = null; //first player to join the game, can set the word
    this.shipLocationsPlayerB = null; //first player to join the game, can set the word
    this.gameState = "0 JOINT"; //"A" means A won, "B" means B won, "ABORTED" means the game was aborted
};

/*
 * The game can be in a number of different states.
 */
game.prototype.transitionStates = {};
game.prototype.transitionStates["0 JOINT"] = 0;
game.prototype.transitionStates["1 JOINT"] = 1;
game.prototype.transitionStates["2 JOINT"] = 2;
game.prototype.transitionStates["LOCATION GUESSED"] = 3;
game.prototype.transitionStates["A"] = 4; //A won
game.prototype.transitionStates["B"] = 5; //B won
game.prototype.transitionStates["ABORTED"] = 6;

/*
 * Not all game states can be transformed into each other;
 * the matrix contains the valid transitions.
 * They are checked each time a state change is attempted.
 */ 
game.prototype.transitionMatrix = [
    [0, 1, 0, 0, 0, 0, 0],   //0 JOINT
    [1, 0, 1, 0, 0, 0, 0],   //1 JOINT
    [0, 0, 0, 1, 0, 0, 1],   //2 JOINT (note: once we have two players, there is no way back!)
    [0, 0, 0, 1, 1, 1, 1],   //LOCATION GUESSED
    [0, 0, 0, 0, 0, 0, 0],   //A WON
    [0, 0, 0, 0, 0, 0, 0],   //B WON
    [0, 0, 0, 0, 0, 0, 0]    //ABORTED
];

game.prototype.isValidTransition = function (from, to) {
    
    console.assert(typeof from == "string", "%s: Expecting a string, got a %s", arguments.callee.name, typeof from);
    console.assert(typeof to == "string", "%s: Expecting a string, got a %s", arguments.callee.name, typeof to);
    console.assert( from in game.prototype.transitionStates == true, "%s: Expecting %s to be a valid transition state", arguments.callee.name, from);
    console.assert( to in game.prototype.transitionStates == true, "%s: Expecting %s to be a valid transition state", arguments.callee.name, to);


    let i, j;
    if (! (from in game.prototype.transitionStates)) {
        return false;
    }
    else {
        i = game.prototype.transitionStates[from];
    }

    if (!(to in game.prototype.transitionStates)) {
        return false;
    }
    else {
        j = game.prototype.transitionStates[to];
    }

    return (game.prototype.transitionMatrix[i][j] > 0);
};

game.prototype.isValidState = function (s) {
    return (s in game.prototype.transitionStates);
};

game.prototype.setStatus = function (newState) {

    console.assert(typeof newState == "string", "%s: Expecting a string, got a %s", arguments.callee.name, typeof newState);

    if (game.prototype.isValidState(newState) && game.prototype.isValidTransition(this.gameState, newState)) {
        this.gameState = newState;
        console.log("[STATUS] %s", this.gameState);
    }
    else {
        return new Error("Impossible status change from %s to %s", this.gameState, newState);
    }
};

game.prototype.setPlayerAShips = function (locations) {

    console.assert(typeof locations == "string", "%s: Expecting a string, got a %s", arguments.callee.name, typeof locations);

    //two possible options for the current game state:
    //1 JOINT, 2 JOINT
    if (this.gameState != "1 JOINT" && this.gameState != "2 JOINT") {
        return new Error("Trying to set word, but game status is %s", this.gameState);
    }
    this.wordToGuess = locations;
};

game.prototype.setPlayerBShips = function (locations) {

    console.assert(typeof locations == "string", "%s: Expecting a string, got a %s", arguments.callee.name, typeof locations);

    //two possible options for the current game state:
    //1 JOINT, 2 JOINT
    if (this.gameState != "1 JOINT" && this.gameState != "2 JOINT") {
        return new Error("Trying to set word, but game status is %s", this.gameState);
    }
    this.shipLocationsPlayerB = locations;
};

game.prototype.getLocationsA = function(){
    return this.wordToGuess;
};

game.prototype.getLocationsB = function(){
    return this.wordToGuess;
};

game.prototype.hasTwoConnectedPlayers = function () {
    return (this.gameState == "2 JOINT");
};

game.prototype.addPlayer = function (newPlayer) {

    console.assert(newPlayer instanceof Object, "%s: Expecting an object (WebSocket), got a %s", arguments.callee.name, typeof newPlayer);

    if (this.gameState != "0 JOINT" && this.gameState != "1 JOINT") {
        return new Error("Invalid call to addPlayer, current state is %s", this.gameState);
    }

    /*
     * revise the game state
     */ 
    var error = this.setStatus("1 JOINT");
    if(error instanceof Error){
        this.setStatus("2 JOINT");
    }

    if (this.playerA == null) {
        this.playerA = newPlayer;
        return "A";
    }
    else {
        this.playerB = newPlayer;
        return "B";
    }
};

module.exports = game;