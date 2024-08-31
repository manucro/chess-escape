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
    const titleElementBox = create('div', 'title-box');
    const titleAnimation = create('div', 'title-animation');
    const titleElement = create('h1', 'title', GAME_TITLE);
    titleElementBox.appendChild(titleAnimation);
    titleElementBox.appendChild(titleElement);
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
    titleScreen.appendChild(titleElementBox);
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
        this.startLevel(levelName);
      });
      levelSelectBox.appendChild(levelElement);
    });
    Object.defineProperty(this.screenElements, SCREENS.LEVEL_SELECT, { value: levelSelectBox });

    // Level
    const levelElement = create('div', 'level-screen');
    const levelInfo = create('div', 'level-info');
    const levelNumberSpan = create('span', 'level-info-span', 'Level 0');
    levelNumberSpan.id = 'level-number';
    const movementsSpan = create('span', 'level-info-span', 'Movements: 0 / 0');
    movementsSpan.id = 'movements';
    levelInfo.appendChild(levelNumberSpan);
    levelInfo.appendChild(movementsSpan);
    const boardBox = create('div', 'board-box');
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
    boardBox.appendChild(boardElement);
    levelElement.appendChild(levelInfo);
    levelElement.appendChild(boardBox);
    Object.defineProperty(this.screenElements, SCREENS.LEVEL, { value: levelElement });

    // Appends the screen type of the constructor
    APP.appendChild(this.screenElements[screenType]);
  }

  changeScreen(newScreen) {
    this.screenElements[this.type].remove();
    this.type = newScreen;
    if (newScreen === SCREENS.LEVEL_SELECT) this.updateLevelSelect();
    APP.appendChild(this.screenElements[newScreen]);
  }

  createModal(text, buttons, actions, video = null) {
    function create(type, className, content = '') {
      const el = document.createElement(type);
      el.classList.add(className);
      el.innerText = content;
      return el;
    }
    // Modal
    const modal = create('div', 'modal');
    const modalBox = create('div', (video) ? 'modal-box-video' : 'modal-box');
    const modalText = create('div', 'modal-text', text);
    const modalButtons = create('div','modal-buttons');
    buttons.forEach((button, i) => {
      const modalButton = create('button', 'modal-button', button);
      modalButton.type = 'button';
      modalButton.addEventListener('click', actions[i]);
      modalButtons.appendChild(modalButton);
    });
    modalBox.appendChild(modalText);
    if (video) {
      const tutorial = create('video', 'modal-video');
      tutorial.src = video;
      tutorial.muted = 'true';
      tutorial.autoplay = 'true';
      tutorial.loop = 'true';
      modalBox.appendChild(tutorial);
    }
    modalBox.appendChild(modalButtons);
    modal.appendChild(modalBox);

    APP.appendChild(modal);
  }

  startLevel(level) {
    BOARD_ELEMENT = document.querySelector('.board');
    BOARD_CANVAS = document.getElementById('board-canvas');
    CANVAS_MASK = document.getElementById('canvas-mask');
    MOUSE_CANVAS = document.getElementById('mouse-canvas');
    OBJECTS_BOX = document.getElementById('objects-box');
    PIECES_BOX = document.getElementById('pieces-box');
    document.addEventListener('mousemove', canvasMousePointer);
    createLevel(LEVELS[level], Object.keys(LEVELS).indexOf(level));
    // TUTORIAL VIDEOS todo improve this
    if (level == 'THREE') {
      this.createModal(
        'You can push pieces by moving one towards another',
        ['Continue'],
        [() => document.querySelector('.modal').remove()],
        'tutorials/1.mp4'
      )
    } else if (level == 'EIGHT') {
      this.createModal(
        "You can't move over platforms, but you can push pieces onto them",
        ['Continue'],
        [() => document.querySelector('.modal').remove()],
        'tutorials/2.mp4'
      )
    } else if (level == 'ELEVEN') {
      this.createModal(
        "You can push two pieces at the same time",
        ['Continue'],
        [() => document.querySelector('.modal').remove()],
        'tutorials/3.mp4'
      )
    }
  }

  updateLevelSelect() {
    const levels = this.screenElements[SCREENS.LEVEL_SELECT].children;
    const levelsArray = Object.values(LEVELS)
    for (let i in levels) {
      if (typeof levels[i] !== 'object') return;
      if (levelsArray[i].locked) levels[i].classList.add('blocked');
      else levels[i].classList.remove('blocked');
    }
  }

  updateLevelUI() {
    const levelNumberElement = document.getElementById('level-number');
    levelNumberElement.innerText = `Level ${actualLevelData.levelNumber}`;
    const movementsElement = document.getElementById('movements');
    movementsElement.innerText = `Max movements: ${movements} / ${actualLevelData.movements}`;
  }

  cleanLevelValues() {
    const piecesBox = document.getElementById('pieces-box');
    inBoardPieces.list.forEach(piece => piecesBox.removeChild(piece.element) );
    const objectsBox = document.getElementById('objects-box');
    inBoardObjects.list.forEach(object => objectsBox.removeChild(object.element) );
    inBoardPieces.list = [];
    inBoardObjects.list = [];
    movements = 0;
  }

  winLevel() {
    actualLevel++;
    const levelKeys = Object.keys(LEVELS);
    const key = levelKeys[actualLevel];
    LEVELS[key].locked = false;
    this.createModal(
      'The level has been beaten!',
      ['Go back', 'continue'],
      [() => {
        this.cleanLevelValues();
        this.changeScreen(SCREENS.LEVEL_SELECT);
        document.removeEventListener('click', canvasMousePointer);
        document.querySelector('.modal').remove();
      }, () => {
        this.cleanLevelValues();
        this.startLevel(key);
        document.querySelector('.modal').remove();
      }]
    )
  }
}

const game = new Screen(SCREENS.TITLE);