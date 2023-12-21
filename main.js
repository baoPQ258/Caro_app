
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
  // Lấy danh sách các ô trống trên bảng
  var availSpot = emptySquares(newBoard);

  // Kiểm tra chiến thắng, thua, hoặc hòa và trả về điểm số tương ứng
  if (checkWin(newBoard, player)) {
    return { score: 10 }; 
  } else if (checkWin(newBoard, aiPlayer)) {
    return { score: -10 };
  } else if (availSpot.length === 0) {
    return { score: 0 };
  }

  // Mảng chứa thông tin về các nước đi và điểm số tương ứng
  var moves = [];
  // Duyệt qua tất cả các ô trống
  for (let i = 0; i < availSpot.length; i++) {
    // Lưu trạng thái hiện tại của ô trống
    var move = {};
    move.index = newBoard[availSpot[i]];

    // Đánh dấu ô trống với người chơi hiện tại
    newBoard[availSpot[i]] = player;

    // Gọi đệ quy minimax cho người chơi đối phương và cập nhật Alpha hoặc Beta
    if (player === aiPlayer) {
      var result = minimax(newBoard, huPlayer, alpha, beta);
      move.score = result.score;
      alpha = Math.max(alpha, move.score);
    } else {
      var result = minimax(newBoard, aiPlayer, alpha, beta);
      move.score = result.score;
      beta = Math.min(beta, move.score);
    }

    // Đặt lại trạng thái của ô trống
    newBoard[availSpot[i]] = move.index;

    // Thêm thông tin về nước đi và điểm số vào mảng moves
    moves.push(move);
    // Alpha-Beta Pruning: Nếu Beta nhỏ hơn hoặc bằng Alpha, thoát khỏi vòng lặp
    if (beta <= alpha) {
      break
    };
  }

  // Tìm nước đi tốt nhất từ mảng moves
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

  // Trả về thông tin về nước đi tốt nhất
  return moves[bestMove];
}
