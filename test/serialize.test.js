const { serialize } = require('../src');
const LinkedList = require('./linked-list');

function getlist() {
  return new LinkedList(1, 2, 3);
}

describe('serialize', () => {
  it('Should serialize a non object', () => {
    const input = 7;
    const actual = serialize(input);
    expect(actual).toEqual({ refs: [], value: 7 });
  });
  it('Should serialize a complex object', () => {
    const input = getlist();
    const actual = serialize(input);
    expect(actual).toEqual({
      refs: [
        {
          className: 'LinkedList',
          value: {
            head: '@@ref:1',
            size: 3,
            tail: '@@ref:3',
          },
        },
        {
          className: 'LinkedListNode',
          value: {
            data: 1,
            next: '@@ref:2',
            prev: null,
          },
        },
        {
          className: 'LinkedListNode',
          value: {
            data: 2,
            next: '@@ref:3',
            prev: '@@ref:1',
          },
        },
        {
          className: 'LinkedListNode',
          value: {
            data: 3,
            next: null,
            prev: '@@ref:2',
          },
        },
      ],
      value: '@@ref:0',
    });
  });
});
