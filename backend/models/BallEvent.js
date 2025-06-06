const GameEvent = require('./GameEvent');
const WalkEvent = require('./WalkEvent');

class BallEvent extends GameEvent {
  constructor(beforeState, config) {
    super(beforeState, config);
  }

  validate() {
    return true;
  }

  apply() {
    // Increment balls
    this.afterState.balls += 1;

    // If reached walk threshold, create and apply WalkEvent
    if (this.afterState.balls === this.config.ballsPerWalk) {
      const walkEvent = new WalkEvent(this.afterState, this.config);
      walkEvent.apply();
      this.childEvents.push(walkEvent);
      this.afterState = walkEvent.afterState;
    }
  }
}

module.exports = BallEvent; 