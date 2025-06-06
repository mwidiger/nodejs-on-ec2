class InvalidBaseError extends Error {
  constructor(base, type) {
    super(`Invalid ${type}: ${base}`);
    this.name = 'InvalidBaseError';
  }
}

class OccupiedBaseError extends Error {
  constructor(base) {
    super(`Cannot advance through occupied base ${base}`);
    this.name = 'OccupiedBaseError';
  }
}

class NoRunnerError extends Error {
  constructor(base) {
    super(`No runner found at base ${base}`);
    this.name = 'NoRunnerError';
  }
}

class InvalidAdvanceError extends Error {
  constructor() {
    super('Cannot advance to same or earlier base');
    this.name = 'InvalidAdvanceError';
  }
}

module.exports = {
  InvalidBaseError,
  OccupiedBaseError,
  NoRunnerError,
  InvalidAdvanceError
}; 