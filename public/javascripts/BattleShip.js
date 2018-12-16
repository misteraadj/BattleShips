var socket = new WebSocket("ws://localhost:3000");

var model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    shipsSunk: 0,

    ships: [
        { locations: [0, 0, 0], hits: ["", "", ""] },
        { locations: [0, 0, 0], hits: ["", "", ""] },
        { locations: [0, 0, 0], hits: ["", "", ""] }
    ],

    fire: function (guess) {
        for (var i = 0; i < this.numShips; i++) {
            var ship = this.ships[i];
            var index = ship.locations.indexOf(guess);

            if (ship.hits[index] === "hit") {
                view.displayMessage("You have already hit this location!");
                return true;
            } else if (index >= 0) {
                ship.hits[index] = "hit";
                view.displayHit(guess);
                view.displayMessage("HIT!");

                if (this.isSunk(ship)) {
                    view.displayMessage("You sunk my battleship!");
                    this.shipsSunk++;
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage("You missed!");
        return false;
    },

    isSunk: function (ship) {
        for (var i = 0; i < this.shipLength; i++) {
            if (ship.hits[i] !== "hit") {
                return false;
            }
        }
        return true;
    },

    generateShipLocations: function () {
        var locations;
        for (var i = 0; i < this.numShips; i++) {
            do {
                locations = this.generateShip();
            } while (this.collision(locations));
            this.ships[i].locations = locations;
        }
    },

    generateShip: function () {
        var direction = Math.floor(Math.random() * 2);
        var row, col;

        if (direction === 1) {
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
        } else {
            col = Math.floor(Math.random() * this.boardSize);
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
        }

        var newShipLocations = [];
        for (var i = 0; i < this.shipLength; i++) {
            if (direction === 1) {
                newShipLocations.push(row + "" + (col + i));
            } else {
                newShipLocations.push((row + i) + "" + col);
            }
        }
        return newShipLocations;
    },

    collision: function (locations) {
        for (var i = 0; i < this.numShips; i++) {
            var ship = this.ships[i];
            for (var j = 0; j < locations.length; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true;
                }
            }
        }
        return false;
    }
};

var view = {
    displayMessage: function (msg) {
        var messageArea = document.getElementById("MessageArea");
        messageArea.innerHTML = msg;
    },

    displayHit: function (location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
    },

    displayMiss: function (location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    }
};

var guesses =  0
// Set onclick function for each table cell
var table = document.getElementById("first");
if (table != null) {
    for (var i = 0; i < table.rows.length; i++) {
        for (var j = 0; j < table.rows[i].cells.length; j++)
            table.rows[i].cells[j].onclick = function () {
                handleCellClick(this)
            };
    }
}

function handleCellClick(tableCell) {
    var location = tableCell.id
    if (location) {
        guesses++;
        var hit = model.fire(location);
        if (hit && model.shipsSunk === model.numShips) {
            // view.displayMessage("You sank all the battleships in " + this.guesses + " guesses!")
            alert("You sank all the battleships in " + this.guesses + " guesses!")
        }
    }
}



window.onload = function init() {
    model.generateShipLocations();
};

// Siraadj code. To be used..

// var board1, board2;
// var boards = [board1, board2];



// //maak een bord en zet waardes standaard op false
// board1 = board2 = new Array(8);
// function fillBoard(board){
// 	for(var i = 0; i < 7; i++){
// 		board[i] = new Array(8);

// 		for (var j = 0; j < 7; j++){
// 			board[i][j] = false;
// 		}
// 	}
// }

// //doe fillboard voor beide boards
// for( var i = 0; i < 2; i++){
// 	fillBoard(boards[i]);
// }


// //object van player en computer. object van elke schip. 
// //zet geplaatst op false en geef schepen een lengte.
// var players = {
//   "you":{
//   	"numShips": 4,
//   	"shipsSunk": 0,
//     "ships":{
//       "carrier":{
//         "length": 5,
//         "isPlaced": false,
//         "name":"shipfive",
//         "location": [0,0,0,0,0],
//         "hits": ["","","","",""]
//       },
//       "battleship":{
//         "length": 4,
//         "isPlaced": false,
//         "name":"shipfour"
//         "location": [0,0,0,0],
//         "hits": ["","","",""]
//       },
//       "submarine":{
//         "length": 3,
//         "isPlaced": false,
//         "name":"shipthree"
//         "location": [0,0,0],
//         "hits": ["","",""]
//       },
//       "destroyer":{
//         "length": 2,
//         "isPlaced": false,
//         "name":"shiptwo"
//         "location": [0,0],
//         "hits": ["",""]
//       }
//     }
//   },
//   "other":{
//   	"numShips": 4,
//   	"shipsSunk": 0,
//     "ships":{
//       "carrier":{
//         "length": 5,
//         "isPlaced": false,
//         "name":"shipfive"
//         "location": [0,0,0,0,0],
//         "hits": ["","","","",""]
//       },
//       "battleship":{
//         "length": 4,
//         "isPlaced": false,
//         "name":"shipfour"
//         "location": [0,0,0,0],
//         "hits": ["","","",""]
//       },
//       "submarine":{
//         "length": 3,
//         "isPlaced": false,
//         "name":"shipthree"
//         "location": [0,0,0],
//         "hits": ["","",""]
//       },
//       "destroyer":{
//         "length": 2,
//         "isPlaced": false,
//         "name":"shiptwo"
//          "location": [0,0],
//         "hits": ["",""]
//       }
//     }
//   }
// }


// //moet nog geschreven worden
// function placeShip(name, coordinates, canplace){

// }