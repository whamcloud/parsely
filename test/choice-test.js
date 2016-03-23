import choice from '../source/choice.js';
import {beforeEach, describe, expect, it, jasmine} from './jasmine.js';
import {__, curry} from 'intel-fp';

describe('parser choice', () => {
  it('should return a function', () => {
    expect(choice).toEqual(jasmine.any(Function));
  });

  it('should be curried', () => {
    expect(choice(__)).toEqual(jasmine.any(Function));
  });

  describe('finding choices', () => {
    var chooser, matcher;

    beforeEach(() => {

      matcher = curry(2, (name, tokens) => {

        const [t, ...restTokens] = tokens;

        if (name === t.name)
          return {
            tokens: restTokens,
            consumed: 1,
            result: t.content
          };

        return {
          tokens,
          consumed: 1,
          result: new Error('boom!')
        };
      });


      chooser = choice([
        matcher('a'),
        matcher('b')
      ]);
    });

    it('should match a', () => {
      expect(chooser([{
        name: 'a',
        content: 'eeey'
      }])).toEqual({
        tokens: [],
        consumed: 1,
        result: 'eeey'
      });
    });

    it('should match b', () => {
      expect(chooser([{
        name: 'b',
        content: 'beee'
      }])).toEqual({
        tokens: [],
        consumed: 1,
        result: 'beee'
      });
    });

    it('should return an error', () => {
      expect(chooser([{
        name: 'c',
        content: 'seee'
      }])).toEqual({
        tokens: [
          {
            name: 'c',
            content: 'seee'
          }
        ],
        consumed: 1,
        result: new Error('boom!')
      });
    });
  });

  it('should return the most specific error', () => {
    var takeN = curry(2,  (n, tokens) => {
      return {
        tokens,
        consumed: n,
        result: new Error(`took ${n} tokens`)
      };
    });

    var result = choice([
      takeN(2),
      takeN(1)
    ], [
      {},
      {}
    ]);

    expect(result).toEqual({
      tokens: [{}, {}],
      consumed: 2,
      result: new Error('took 2 tokens')
    });
  });
});