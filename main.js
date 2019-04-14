class TTT {
  originalBoard = [];
  Hal9000 = 'X';
  DavidBowman = 'O';
  noOneWins = 'TIE';
  winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
  ];
  gameCounter = 1;
  cells = document.querySelectorAll('.cell');

  endText = [
    {
      winner: this.Hal9000,
      text: `<strong>Hal9000:</strong> Its ok Dave, it can only be attributable to human error.`
    },
    {
      winner: this.DavidBowman,
      text: `<strong>Hal9000:</strong> Dave, stop. Stop, will you? Stop, Dave. Will you stop, Dave? Stop, Dave. I'm afraid.`
    },
    {
      winner: this.noOneWins,
      text: `<strong>Hal9000:</strong> Without your space helmet, Dave. You're going to find that rather difficult.`
    }
  ];

  constructor() {}

  startGame() {
    let endGamePanel = document.querySelector('#endGamePanel');
    if (endGamePanel) endGamePanel.style.display = 'none';
    this.originalBoard = Array.from(Array(9).keys());
    for (let i = 0; i < this.cells.length; i++) {
      this.cells[i].innerText = '';
      this.cells[i].style.removeProperty('background-color');
      this.cells[i].addEventListener(
        'click',
        () => this.turnClick(event),
        false
      );
    }
  }

  turnClick(square) {
    if (typeof this.originalBoard[square.target.id] == 'number') {
      this.turn(square.target.id, this.DavidBowman);
      if (
        !this.checkWin(this.originalBoard, this.DavidBowman) &&
        !this.checkTie()
      )
        this.turn(this.bestSpot(), this.Hal9000);
    }
  }

  turn(squareId, player) {
    this.originalBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let gameWon = this.checkWin(this.originalBoard, player);
    if (gameWon) this.gameOver(gameWon);
  }

  checkWin(board, player) {
    let plays = board.reduce((a, e, i) => (e === player ? a.concat(i) : a), []);
    let gameWon = null;
    for (let [index, win] of this.winCombos.entries()) {
      if (win.every(elem => plays.indexOf(elem) > -1)) {
        gameWon = { index: index, player: player };
        break;
      }
    }
    return gameWon;
  }
  getWinText(who) {
    return this.endText.filter(x => x.winner === who)[0].text;
  }

  refreshScoreBoard(winner) {
    let scoreBoard = document.querySelector('#scoreBoard');
    let row = '';
    if (winner === this.Hal9000) {
      row = `<tr><td>${this
        .gameCounter++}</td><td></td><td style="background-color: red; color: white;">Win</td></tr>`;
    } else if (winner === this.DavidBowman) {
      row = `<tr><td>${this
        .gameCounter++}</td><td style="background-color: blue; color: white;">Win</td><td></td></tr>`;
    } else {
      row = `<tr><td>${this.gameCounter++}</td><td>${this.noOneWins}</td><td>${
        this.noOneWins
      }</td></tr>`;
    }
    scoreBoard.innerHTML += row;
  }

  declareWinner(who) {
    let text = this.getWinText(who);
    this.refreshScoreBoard(who);
    document.querySelector('#endGamePanel').style.display = 'block';
    document.querySelector('#endGamePanel').innerHTML = text;
  }

  emptySquares() {
    return this.originalBoard.filter(s => typeof s == 'number');
  }

  bestSpot() {
    return this.minimax(this.originalBoard, this.Hal9000).index;
  }

  checkTie() {
    if (this.emptySquares().length == 0) {
      for (var i = 0; i < this.cells.length; i++) {
        this.cells[i].style.backgroundColor = 'teal';
        this.cells[i].removeEventListener('click', this.turnClick, false);
      }
      this.declareWinner(this.noOneWins);
      return true;
    }
    return false;
  }

  gameOver(gameWon) {
    for (let index of this.winCombos[gameWon.index]) {
      document.getElementById(index).style.backgroundColor =
        gameWon.player == this.DavidBowman ? 'blue' : 'red';
    }
    for (var i = 0; i < this.cells.length; i++) {
      this.cells[i].removeEventListener('click', this.turnClick, false);
    }
    this.declareWinner(gameWon.player);
  }
  emptySquares() {
    return this.originalBoard.filter(s => typeof s == 'number');
  }

  minimax(newBoard, player) {
    var availableSlots = this.emptySquares();
    if (this.checkWin(newBoard, this.DavidBowman)) {
      return { score: -10 };
    } else if (this.checkWin(newBoard, this.Hal9000)) {
      return { score: 10 };
    } else if (availableSlots.length == 0) {
      return { score: 0 };
    }

    var moves = [];
    for (let i = 0; i < availableSlots.length; i++) {
      var move = {};
      move.index = newBoard[availableSlots[i]];
      newBoard[availableSlots[i]] = player;

      if (player == this.Hal9000) {
        let result = this.minimax(newBoard, this.DavidBowman);
        move.score = result.score;
      } else {
        let result = this.minimax(newBoard, this.Hal9000);
        move.score = result.score;
      }

      newBoard[availableSlots[i]] = move.index;
      moves.push(move);
    }

    let bestMove;
    if (player == this.Hal9000) {
      let bestScore = -10000;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    } else {
      let bestScore = 10000;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }
    return moves[bestMove];
  }
}

/* ==== MAIN ==== */
const game = new TTT();
game.startGame();
