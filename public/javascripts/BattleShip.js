var socket = new WebSocket("ws://localhost:3000");

data = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    shipsSunk: 0,
    playerName: '',
    playerShips: [
        { id: 01, locations: [0, 0, 0], hits: ["", "", ""], _iname: 'first'},
        { id: 02, locations: [0, 0, 0], hits: ["", "", ""], _iname: 'second'},
        { id: 03, locations: [0, 0, 0], hits: ["", "", ""], _iname: 'third'}
    ], 
    opponentShips: [
        { id: 01, locations: [0, 0, 0], hits: ["", "", ""], _iname: 'first'},
        { id: 02, locations: [0, 0, 0], hits: ["", "", ""], _iname: 'second'},
        { id: 03, locations: [0, 0, 0], hits: ["", "", ""], _iname: 'third'}
    ]
};

var model = {
    fire: function (guess) {
        for (var i = 0; i < data.numShips; i++) {
            var ship = data.opponentShips[i];
            var index = ship.locations.indexOf(guess);

            if (ship.hits[index] === "hit") {
                view.z("You have already hit this location!");
                return true;
            } else if (index >= 0) {
                ship.hits[index] = "hit";
                view.displayHit(guess);
                view.displayMessage("HIT!");

                if (this.isSunk(ship)) {
                    view.displayMessage("You sunk my battleship!");
                    data.shipsSunk++;
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage("You missed!");
        return false;
    },

    isSunk: function (ship) {
        for (var i = 0; i < data.shipLength; i++) {
            if (ship.hits[i] !== "hit") {
                return false;
            }
        }
        return true;
    },

    generateShipLocations: function (currentPlayerShips) {
        var locations;
        for (var i = 0; i < data.numShips; i++) {
            do {
                locations = this.generateShip();
            } while (this.collision(locations));
            currentPlayerShips[i].locations = locations;
        }
    },

    generateShip: function () {
        var direction = Math.floor(Math.random() * 2);
        var row, col;

        if (direction === 1) {
            row = Math.floor(Math.random() * data.boardSize);
            col = Math.floor(Math.random() * (data.boardSize - data.shipLength + 1));
        } else {
            col = Math.floor(Math.random() * data.boardSize);
            row = Math.floor(Math.random() * (data.boardSize - data.shipLength + 1));
        }

        var newShipLocations = [];
        for (var i = 0; i < data.shipLength; i++) {
            if (direction === 1) {
                newShipLocations.push(row + "" + (col + i));
            } else {
                newShipLocations.push((row + i) + "" + col);
            }
        }
        return newShipLocations;
    },

    collision: function (locations) {
        for (var i = 0; i < data.numShips; i++) {
            var ship = data.playerShips[i];
            for (var j = 0; j < locations.length; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true;
                }
            }
        }
        return false;
    }, 

    showPlayerShips: function() {
        for (var i = 0; i < data.numShips; i++) {
            locs = data.playerShips[i].locations;
            for (var j=0; j < locs.length; j++) {
               view.displayOwnShip(locs[j]); 
            }
        }
    } 
};

var view = {
    displayMessage: function (msg) {
        var messageArea = document.getElementById("MessageArea");
        messageArea.innerHTML = data.playerName + ": " + msg;
    },

    displayOwnShip: function (location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "showShip");
    },

    displayHit: function (location) {
        iloc = location.toString()
        var cell = document.getElementById('second').rows[iloc[0]].cells[iloc[1]]
        cell.setAttribute("class", "hit");
    },

    displayMiss: function (location) {
        iloc = location.toString()
        var cell = document.getElementById('second').rows[iloc[0]].cells[iloc[1]]
        cell.setAttribute("class", "miss");
    }


};

var guesses = 0
// Set onclick function for each table cell
var table = document.getElementById("second");
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
        if (hit && data.shipsSunk === data.numShips) {
            // view.displayMessage("You sank all the battleships in " + this.guesses + " guesses!")
            alert("You sank all the battleships in " + this.guesses + " guesses!")
        }
    }
}



window.onload = function init() {
    model.generateShipLocations(data.playerShips);
    model.showPlayerShips();
    model.generateShipLocations(data.opponentShips);
};

// Handle incoming messages
socket.onmessage = function(event){
    msg = JSON.parse(event.data);
    if (msg.type === 'PLAYER-TYPE') {
        data.playerName = "Player " + msg.data
    }
    // console.log("Received message: " + event.data);
}