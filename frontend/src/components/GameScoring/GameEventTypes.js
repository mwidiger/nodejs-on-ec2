export const GameEventType = {
  BALL: 'BALL',
  STRIKE: 'STRIKE',
  OUT: 'OUT',
  HIT: 'HIT',
  ERROR: 'ERROR',
  STRIKEOUT: 'STRIKEOUT',
  STOLEN_BASE: 'STOLEN_BASE',
  CAUGHT_STEALING: 'CAUGHT_STEALING',
  WALK: 'WALK',
  RUNNER_ADVANCE: 'RUNNER_ADVANCE',
  FIELDERS_CHOICE: 'FIELDERS_CHOICE',
  SACRIFICE: 'SACRIFICE',
  THROW: 'THROW',
  PICKOFF: 'PICKOFF',
  WILD_PITCH: 'WILD_PITCH',
  PASSED_BALL: 'PASSED_BALL',
  BALK: 'BALK',
  INTERFERENCE: 'INTERFERENCE'
};

export class GameEvent {
  constructor(type, player, inning, isTopInning) {
    this.type = type;
    this.player = player;
    this.inning = inning;
    this.isTopInning = isTopInning;
    this.timestamp = new Date();
    this.childEvents = [];
    this.parentEvent = null;
    this.fielders = [];
    this.runnerMovements = [];
  }

  addChildEvent(event) {
    event.parentEvent = this;
    this.childEvents.push(event);
  }

  addFielder(fielder, action) {
    this.fielders.push({ player: fielder, action });
  }

  addRunnerMovement(runner, fromBase, toBase, reason) {
    this.runnerMovements.push({
      runner,
      fromBase,
      toBase,
      reason
    });
  }
}

export class BallEvent extends GameEvent {
  constructor(player, inning, isTopInning) {
    super(GameEventType.BALL, player, inning, isTopInning);
  }
}

export class StrikeEvent extends GameEvent {
  constructor(player, inning, isTopInning, type = 'swinging') {
    super(GameEventType.STRIKE, player, inning, isTopInning);
    this.strikeType = type; // 'swinging' or 'looking'
  }
}

export class OutEvent extends GameEvent {
  constructor(player, inning, isTopInning, outType) {
    super(GameEventType.OUT, player, inning, isTopInning);
    this.outType = outType; // 'fielders_choice', 'force', 'tag', etc.
  }
}

export class HitEvent extends GameEvent {
  constructor(player, inning, isTopInning, hitType) {
    super(GameEventType.HIT, player, inning, isTopInning);
    this.hitType = hitType; // 'single', 'double', 'triple', 'home_run'
    this.fieldLocation = null; // e.g., 'LF', 'CF', 'RF', etc.
  }

  setFieldLocation(location) {
    this.fieldLocation = location;
  }
}

export class ErrorEvent extends GameEvent {
  constructor(player, inning, isTopInning, fielder) {
    super(GameEventType.ERROR, player, inning, isTopInning);
    this.fielder = fielder;
    this.errorType = null; // 'fielding', 'throwing', etc.
  }
}

export class StrikeoutEvent extends GameEvent {
  constructor(player, inning, isTopInning, type = 'swinging') {
    super(GameEventType.STRIKEOUT, player, inning, isTopInning);
    this.strikeoutType = type; // 'swinging' or 'looking'
  }
}

export class StolenBaseEvent extends GameEvent {
  constructor(player, inning, isTopInning, fromBase, toBase) {
    super(GameEventType.STOLEN_BASE, player, inning, isTopInning);
    this.fromBase = fromBase;
    this.toBase = toBase;
    this.defensivePlay = null; // e.g., 'throw_and_slide', 'no_throw', etc.
  }
}

export class CaughtStealingEvent extends GameEvent {
  constructor(player, inning, isTopInning, base) {
    super(GameEventType.CAUGHT_STEALING, player, inning, isTopInning);
    this.base = base;
    this.defensivePlay = null; // e.g., 'throw_and_tag', 'pickoff', etc.
  }
}

export class WalkEvent extends GameEvent {
  constructor(player, inning, isTopInning, type = 'regular') {
    super(GameEventType.WALK, player, inning, isTopInning);
    this.walkType = type; // 'regular', 'intentional', 'hit_by_pitch'
  }
}

export class RunnerAdvanceEvent extends GameEvent {
  constructor(runner, inning, isTopInning, fromBase, toBase, reason) {
    super(GameEventType.RUNNER_ADVANCE, runner, inning, isTopInning);
    this.fromBase = fromBase;
    this.toBase = toBase;
    this.reason = reason; // 'hit', 'error', 'wild_pitch', etc.
  }
}

export class FieldersChoiceEvent extends GameEvent {
  constructor(batter, inning, isTopInning, fielder) {
    super(GameEventType.FIELDERS_CHOICE, batter, inning, isTopInning);
    this.fielder = fielder;
    this.outAtBase = null; // which base the out was recorded at
  }
}

export class SacrificeEvent extends GameEvent {
  constructor(batter, inning, isTopInning, type) {
    super(GameEventType.SACRIFICE, batter, inning, isTopInning);
    this.sacrificeType = type; // 'bunt', 'fly', etc.
  }
}

export class ThrowEvent extends GameEvent {
  constructor(fielder, inning, isTopInning, fromBase, toBase) {
    super(GameEventType.THROW, fielder, inning, isTopInning);
    this.fromBase = fromBase;
    this.toBase = toBase;
    this.throwType = null; // 'on_line', 'off_line', etc.
  }
}

export class PickoffEvent extends GameEvent {
  constructor(pitcher, runner, inning, isTopInning, base) {
    super(GameEventType.PICKOFF, pitcher, inning, isTopInning);
    this.runner = runner;
    this.base = base;
    this.result = null; // 'success', 'error', 'no_throw'
  }
}

export class WildPitchEvent extends GameEvent {
  constructor(pitcher, inning, isTopInning) {
    super(GameEventType.WILD_PITCH, pitcher, inning, isTopInning);
    this.runnerAdvancements = [];
  }
}

export class PassedBallEvent extends GameEvent {
  constructor(catcher, inning, isTopInning) {
    super(GameEventType.PASSED_BALL, catcher, inning, isTopInning);
    this.runnerAdvancements = [];
  }
}

export class BalkEvent extends GameEvent {
  constructor(pitcher, inning, isTopInning) {
    super(GameEventType.BALK, pitcher, inning, isTopInning);
    this.runnerAdvancements = [];
  }
}

export class InterferenceEvent extends GameEvent {
  constructor(player, inning, isTopInning, type) {
    super(GameEventType.INTERFERENCE, player, inning, isTopInning);
    this.interferenceType = type; // 'offensive', 'defensive', 'catcher', etc.
  }
} 