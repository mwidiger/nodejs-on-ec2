class Game {
  constructor() {
    this.balls = 0;
    this.events = [];
  }

  addEvent(event) {
    this.events.push(event);
    Object.assign(this, event.apply(this));
  }
}

module.exports = Game; 