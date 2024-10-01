// Data manage class
class Data {
  constructor() {
    if (this.exists()) this.load();
    this.update();
  }
  update() {
    const levelKeys = Object.keys(LEVELS);
    this.levels = {};
    levelKeys.forEach(key => {
      const levelObj = { stars: LEVELS[key].stars, locked: LEVELS[key].locked };
      this.levels[key] = levelObj;
    });
    this.seenTutorials = TUTORIALS.map(tuto => tuto.seen);
    this.options = {...options};
    this.actualLevel = actualLevel;
  }
  save() {
    localStorage.setItem('CElevelData', JSON.stringify(this.levels));
    localStorage.setItem('CEtutorials', JSON.stringify(this.seenTutorials));
    localStorage.setItem('CEoptionsData', JSON.stringify(this.options));
    localStorage.setItem('CEactualLevel', actualLevel.toString());
  }
  load() {
    const levelData = JSON.parse(localStorage.getItem('CElevelData'));
    Object.keys(levelData).forEach(key => {
      LEVELS[key].stars = levelData[key].stars;
      LEVELS[key].locked = levelData[key].locked;
    });
    const seenTutorialData = JSON.parse(localStorage.getItem('CEtutorials'));
    TUTORIALS.forEach((tuto, i) => tuto.seen = seenTutorialData[i]);
    const optionsData = JSON.parse(localStorage.getItem('CEoptionsData'));
    Object.keys(optionsData).forEach(key => {
      options[key] = optionsData[key];
    });
    actualLevel = parseInt(localStorage.getItem('CEactualLevel'));
  }
  exists() {
    return (localStorage.getItem('CElevelData') !== null);
  }
  reset() {
    window.removeEventListener('beforeunload', saveData);
    localStorage.removeItem('CElevelData');
    localStorage.removeItem('CEtutorials');
    localStorage.removeItem('CEoptionsData');
    localStorage.removeItem('CEactualLevel');
    location.reload();
  }
}

const GAME_DATA = new Data();
window.addEventListener('beforeunload', saveData);
function saveData(ev) {
  ev.preventDefault();
  GAME_DATA.update();
  GAME_DATA.save();
}