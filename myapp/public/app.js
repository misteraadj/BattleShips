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
    "ships":{
      "carrier":{
        "length": 5,
        "isPlaced": false,
        "name":"shipfive"
      },
      "battleship":{
        "length": 4,
        "isPlaced": false,
        "name":"shipfour"
      },
      "submarine":{
        "length": 3,
        "isPlaced": false,
        "name":"shipthree"
      },
      "cruiser":{
        "length": 3,
        "isPlaced": false,
        "name":"shiptreee"
      },
      "destroyer":{
        "length": 2,
        "isPlaced": false,
        "name":"shiptwo"
      }
    }
  },
  "other":{
    "ships":{
      "carrier":{
        "length": 5,
        "isPlaced": false,
        "name":"shipfive"
      },
      "battleship":{
        "length": 4,
        "isPlaced": false,
        "name":"shipfour"
      },
      "submarine":{
        "length": 3,
        "isPlaced": false,
        "name":"shipthree"
      },
      "cruiser":{
        "length": 3,
        "isPlaced": false,
        "name":"shiptreee"
      },
      "destroyer":{
        "length": 2,
        "isPlaced": false,
        "name":"shiptwo"
      }
    }
  }
}