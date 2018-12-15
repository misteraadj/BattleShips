



var board1, board2;
var boards = [board1, board2];



//maak een bord en zet waardes standaard op false
board1 = board2 = new Array(8);
function fillBoard(board){
	for(var i = 0; i < 7; i++){
		board[i] = new Array(8);

		for (var j = 0; j < 7; j++){
			board[i][j] = false;
		}
	}
}

//doe fillboard voor beide boards
for( var i = 0; i < 2; i++){
	fillBoard(boards[i]);
}


//object van player en computer. object van elke schip. 
//zet geplaatst op false en geef schepen een lengte.
var players = {
  "you":{
  	"numShips": 4,
  	"shipsSunk": 0,
    "ships":{
      "carrier":{
        "length": 5,
        "isPlaced": false,
        "name":"shipfive",
        "location": [0,0,0,0,0],
        "hits": ["","","","",""]
      },
      "battleship":{
        "length": 4,
        "isPlaced": false,
        "name":"shipfour"
        "location": [0,0,0,0],
        "hits": ["","","",""]
      },
      "submarine":{
        "length": 3,
        "isPlaced": false,
        "name":"shipthree"
        "location": [0,0,0],
        "hits": ["","",""]
      },
      "destroyer":{
        "length": 2,
        "isPlaced": false,
        "name":"shiptwo"
        "location": [0,0],
        "hits": ["",""]
      }
    }
  },
  "other":{
  	"numShips": 4,
  	"shipsSunk": 0,
    "ships":{
      "carrier":{
        "length": 5,
        "isPlaced": false,
        "name":"shipfive"
        "location": [0,0,0,0,0],
        "hits": ["","","","",""]
      },
      "battleship":{
        "length": 4,
        "isPlaced": false,
        "name":"shipfour"
        "location": [0,0,0,0],
        "hits": ["","","",""]
      },
      "submarine":{
        "length": 3,
        "isPlaced": false,
        "name":"shipthree"
        "location": [0,0,0],
        "hits": ["","",""]
      },
      "destroyer":{
        "length": 2,
        "isPlaced": false,
        "name":"shiptwo"
         "location": [0,0],
        "hits": ["",""]
      }
    }
  }
}


//moet nog geschreven worden
function placeShip(name, coordinates, canplace){

}




function fire(guess){
	for(var i = 0; i < this.other.numShips; i++ ){
		var ship = this.other.ships[i];
		var index = ship.location.indexof(guess);

		if (ship.hits[index] === "hit"){
			view.displayMessage("You've allready hit this location!")
			return true;
		} else if (index >= 0){
			ship.hits[index] = "hit";
			view.displayHit(guess);
			view.displayMessage("HIT!");

			if (this.isSunk(ship)){
				view.displayMessage("you sank my battleship");
				this.other.shipSunk++;
			}
			return true;
		}
	}
	view.displayMiss(guess);
	view.displayMessage("you missed!");
	return false;
}


function isSunk(ship){
	for(var i = 0; i < this.length; i++){
		if (ships.hits[i] !== "hit"){
			return false;
		}
	} return true;
}


//ga naar console zodat je array kan zien.
//volgens mij is deze functie nog beetje bullshit
function generateShipLocations(){
	var locations;
	for( va i = 0; i > this.numShips; i++){
		do {
			locations = this.generateShip();
		} while (this.collision(location));
		this.ships[i].location = location;
	}
	console.log("ships array: ");
	console.log(this.ships);
}
