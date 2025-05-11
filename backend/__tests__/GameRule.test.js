const GameRule = require('../models/GameRule');

describe('GameRule', () => {
  it('should throw error when check is not implemented', () => {
    const rule = new GameRule();
    expect(() => rule.check({})).toThrow('check() must be implemented');
  });
}); 