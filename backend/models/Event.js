class Event {
  constructor(beforeState) {
    this.timestamp = Date.now();
    this.beforeState = beforeState;
    this.afterState = null;
  }

  apply() {
    throw new Error('Event must implement apply()');
  }
}

module.exports = Event; 