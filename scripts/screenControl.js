"use strict";

// CONSTANTS
const GAME_TITLE = 'Chess Escape';
const CREDITS = 'Game made by Manuel Crocco';

const APP = document.getElementById('app');

const SCREENS = {
  TITLE: 'title',
  LEVEL_SELECT: 'levelselect',
  LEVEL: 'level'
}

class Screen {
  constructor(screenType) {
    this.type = screenType;
    this.screenElements = {};

    function create(type, className, content = '') {
      const el = document.createElement(type);
      el.classList.add(className);
      el.innerText = content;
      return el;
    }

    // Main Title
    const titleScreen = create('div', 'title-screen');
    const titleElement = create('h1', 'title', GAME_TITLE);
    const titleButtons = create('div', 'title-buttons');
    ['Play', 'Guide', 'Options'].forEach(buttonTitle => {
      const titleButton = create('button', 'title-button', buttonTitle);
      titleButton.type = 'button';
      titleButton.addEventListener('click', () => {
        this.changeScreen(SCREENS.LEVEL_SELECT);
      });
      titleButtons.appendChild(titleButton);
    });
    const credits = create('footer', 'credits');
    credits.innerHTML = CREDITS;
    titleScreen.appendChild(titleElement);
    titleScreen.appendChild(titleButtons);
    titleScreen.appendChild(credits);
    Object.defineProperty(this.screenElements, SCREENS.TITLE, { value: titleScreen });

    // Level Select
    const levelSelectBox = create('div', 'level-select');
    Object.keys(LEVELS).forEach((levelName, i) => {
      const levelElement = create('div', 'level');
      levelElement.innerText = i + 1;
      levelElement.addEventListener('click', () => {
        this.changeScreen(SCREENS.LEVEL);
        this.startLevel(LEVELS[levelName]);
      });
      levelSelectBox.appendChild(levelElement);
    });
    Object.defineProperty(this.screenElements, SCREENS.LEVEL_SELECT, { value: levelSelectBox });

    // Level
    const boardElement = create('div', 'board');
    const appendBoardElement = (type, id) => {
      const el = document.createElement(type);
      el.id = id;
      boardElement.appendChild(el);
    }
    appendBoardElement('canvas', 'board-canvas');
    appendBoardElement('div', 'objects-box');
    appendBoardElement('canvas', 'canvas-mask');
    appendBoardElement('canvas', 'mouse-canvas');
    appendBoardElement('div', 'pieces-box');
    Object.defineProperty(this.screenElements, SCREENS.LEVEL, { value: boardElement });

    // Appends the screen type of the constructor
    APP.appendChild(this.screenElements[screenType]);
  }

  changeScreen(newScreen) {
    this.screenElements[this.type].remove();
    this.type = newScreen;
    APP.appendChild(this.screenElements[newScreen]);
  }

  startLevel(level) {
    BOARD_ELEMENT = document.querySelector('.board');
    BOARD_CANVAS = document.getElementById('board-canvas');
    CANVAS_MASK = document.getElementById('canvas-mask');
    MOUSE_CANVAS = document.getElementById('mouse-canvas');
    OBJECTS_BOX = document.getElementById('objects-box');
    PIECES_BOX = document.getElementById('pieces-box');
    createLevel(level);
  }
}

const game = new Screen(SCREENS.TITLE);