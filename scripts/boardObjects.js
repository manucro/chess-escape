"use strict";

class BoardObject {
  constructor(type, position) {
    // Creates the HTML element
    const element = document.createElement('img');
    element.classList.add('object');
    element.id = type;
    element.src = `objects/${type}.svg`;
    element.style.width = `${squareSize}px`;
    element.style.height = `${squareSize}px`;
    element.style.transform = `translate(${position.x * squareSize}px, ${position.y * squareSize}px)`;
    this.element = element;

    // Sets the other attributes
    this.type = type;
    this.position = position;

    // Appends the element to the board
    OBJECTS_BOX.appendChild(element)
  }

  checkCollision(position) {
    if (position.x === this.position.x && position.y === this.position.y) this.collectObject();
  }

  collectObject() {
    // todo there's no other way to do this?
    const collectKey = () => {
      changeBoard([5], position => {
        if (options.soundEffects) AUDIO.lock.play();
        board[position.y][position.x] = 0;
        this.element.remove();
        const index = inBoardObjects.list.indexOf(this);
        inBoardObjects.list.splice(index, 1);
      });
    }
    const collectButton = () => {
      changeBoard([2, 3], position => {
        if (options.soundEffects) AUDIO.button.play();
        const prevValue = board[position.y][position.x];
        board[position.y][position.x] = 2;
        inBoardPieces.list.forEach(piece => {
          if (piece.position.x !== this.position.x || piece.position.y !== this.position.y) return;
          board[position.y][position.x] = 3;
        });
        if (board[position.y][position.x] === 3 || prevValue === 2) return;
        // Checks if there's a piece in the lock position when the status changes
        inBoardPieces.list.forEach(piece => {
          if (piece.position.x.toString() === position.x && piece.position.y.toString() === position.y) piece.destroyPiece();
        });
      });
    }
    const collectStar = () => {
      if (options.soundEffects) AUDIO.star.play();
      this.element.remove();
      const index = inBoardObjects.list.indexOf(this);
      inBoardObjects.list.splice(index, 1);
    }

    function changeBoard(checkValues, action) {
      for (let i in board) {
        for (let j in board[i]) {
          if (!checkValues.includes(board[i][j])) continue;
          action({ x: j, y: i });
          drawBoard();
        }
      }
    }

    switch (this.type) {
      case OBJECTS.KEY: collectKey(); break;
      case OBJECTS.BUTTON: collectButton(); break;
      case OBJECTS.STAR: collectStar(); break;
    }
  }
}