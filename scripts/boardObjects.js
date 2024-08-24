"use strict";

class BoardObject {
  constructor(type, position) {
    // Creates the HTML element
    const element = document.createElement('img');
    element.classList.add('object');
    element.src = `objects/${type}.png`;
    element.style.width = `${squareSize}px`;
    element.style.height = `${squareSize}px`;
    element.style.transform = `translate(${position.x * squareSize}px, ${position.y * squareSize}px)`
    this.element = element;

    // Sets the other attributes
    this.type = type;
    this.position = position;

    // Appends the element to the board
    BOARD_ELEMENT.appendChild(element)
  }

  checkCollision(position) {
    if (position.x === this.position.x && position.y === this.position.y) this.collectObject();
  }

  collectObject() {
    // todo there's no other way to do this?
    const collectKey = () => {
      for (let i in board) {
        for (let j in board[i]) {
          if (board[i][j] !== 5) continue;
          board[i][j] = 0;
          this.element.remove();
          const index = inBoardObjects.list.indexOf(this);
          inBoardObjects.list.splice(index, 1);
          drawBoard();
          break;
        }
      }
    }
    switch (this.type) {
      case OBJECTS.KEY: collectKey(); break;
    }
  }
}