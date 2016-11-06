const { combination } = require('../utils');
const { deepEqual } = require('assert');

describe('utils', () => {
  describe('combination', () => {
    it('should return seq', () => {
      deepEqual(combination([1, 2, 3]), [[1], [2], [3]]);
    });
    it('should return combined of two', () => {
      deepEqual(combination([1, 2], ['a', 'b']),
        [
          [1, 'a'],
          [1, 'b'],
          [2, 'a'],
          [2, 'b']
        ]);
    });
    it('should return combined of three', () => {
      deepEqual(combination([1, 2, 3], ['a', 'b'], [true, false]),
        [
          [1, 'a', true],
          [1, 'a', false],
          [1, 'b', true],
          [1, 'b', false],

          [2, 'a', true],
          [2, 'a', false],
          [2, 'b', true],
          [2, 'b', false],
          
          [3, 'a', true],
          [3, 'a', false],
          [3, 'b', true],
          [3, 'b', false]
        ]);
    });

  });
});
