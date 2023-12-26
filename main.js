
const huPlayer = "O";
const aiPlayer = "X";
const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2],
];

const cells = document.querySelectorAll(".cell");
starGame();

function starGame() {
  document.querySelector(".endgame").style.display = "none";
  origBoard = Array.from(Array(9).keys());
 // create 1 arr container number  and key 0 -> 8 ;
  for (let i = 0; i < cells.length; i++) {
    cells[i].innerHTML = "";
    cells[i].style.removeProperty("background-color");
    cells[i].addEventListener("click", turnClick, false);
  }
}

function turnClick(square) {
  if (typeof origBoard[square.target.id] == "number") {
    turn(square.target.id, huPlayer);
    if (!checkTie()) turn(bestSpot(), aiPlayer);
  }
}
function turn(squareId, player) {
  origBoard[squareId] = player;
  document.getElementById(squareId).innerText = player;
  let gameWon = checkWin(origBoard, player);
  if (gameWon) gameOver(gameWon);
}

function checkWin(board, player) {
  let plays = board.reduce((a, e, i) => (e === player ? a.concat(i) : a), []);
  let gameWon = null;
  for (let [index, win] of winCombos.entries()) {
    if (win.every((elem) => plays.indexOf(elem) > -1)) {
      gameWon = { index: index, player: player };
      break;
    }
  }
  return gameWon;
}
function declareWinner(who) {
  document.querySelector(".endgame").style.display = "block";
  document.querySelector(".endgame .text").innerText = who;
}

function gameOver(gameWon) {
  for (let index of winCombos[gameWon.index]) {
    document.getElementById(index).style.backgroundColor =
      gameWon.player == huPlayer ? "blue" : "red";
  }
  for (let i = 0; i < cells.length; i++) {
    cells[i].removeEventListener("click", turnClick, false);
  }
  declareWinner(gameWon.player == huPlayer ? "You win !" : "You lose");
}
function emptySquares() {
  return origBoard.filter((s) => typeof s == "number");
}
function bestSpot() {
  return minimax(origBoard, aiPlayer).index;
}

function checkTie() {
  if (emptySquares().length == 0) {
    for (let i = 0; i < cells.length; i++) {
      if (!cells[i].classList.contains('clicked')) {
        cells[i].style.backgroundColor = "green";
        cells[i].removeEventListener("click", turnClick, false);
      }
    }
    declareWinner("Tie game !");
    return true;
  }
  return false;
}

function minimax(newBoard, player, alpha = -Infinity, beta = Infinity) {
  var availSpot = emptySquares(newBoard);

  if (checkWin(newBoard, player)) {
    console.log(`Player ${player} wins!`);
    return { score: 10 };
  } else if (checkWin(newBoard, aiPlayer)) {
    console.log(`Player ${aiPlayer} wins!`);
    return { score: -10 };
  } else if (availSpot.length === 0) {
    console.log("It's a tie!");
    return { score: 0 };
  }

  var moves = [];

  for (let i = 0; i < availSpot.length; i++) {
    var move = {};
    move.index = newBoard[availSpot[i]];
    newBoard[availSpot[i]] = player;

    if (player === aiPlayer) {
      var result = minimax(newBoard, huPlayer, alpha, beta);
      move.score = result.score;
      alpha = Math.max(alpha, move.score);
    } else {
      var result = minimax(newBoard, aiPlayer, alpha, beta);
      move.score = result.score;
      beta = Math.min(beta, move.score);
    }

    newBoard[availSpot[i]] = move.index;
    moves.push(move);

    if (beta <= alpha) {
      console.log(`Pruning at ${player} - alpha: ${alpha}, beta: ${beta}`);
      break;
    }
  }

  var bestMove;
  if (player === aiPlayer) {
    var bestScore = -Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    var bestScore = Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  console.log(`Player ${player} chooses move ${availSpot[bestMove]} with score ${bestScore}`);
  return moves[bestMove];
}




