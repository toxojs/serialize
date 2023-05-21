const { factory } = require('@toxo/ioc');
const { deserialize } = require('../src');
const LinkedList = require('./linked-list');
const LinkedListNode = require('./linked-list-node');

describe('deserialize', () => {
  it('Should deserialize a non object', () => {
    const input = { refs: [], value: 7 };
    const actual = deserialize(input);
    expect(actual).toEqual(7);
  });
  it('Should deserialize a complex object', () => {
    factory.register(LinkedList);
    factory.register(LinkedListNode);
    const input = {
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
    };
    const actual = deserialize(input);
    expect(actual).toBeInstanceOf(LinkedList);
    expect(actual).toHaveLength(3);
    expect(actual.head).toBeInstanceOf(LinkedListNode);
    expect(actual.head.data).toBe(1);
    expect(actual.head.prev).toBeNull();
    expect(actual.head.next).toBeInstanceOf(LinkedListNode);
    expect(actual.head.next.data).toBe(2);
    expect(actual.head.next.prev).toBe(actual.head);
    expect(actual.head.next.next).toBe(actual.tail);
    expect(actual.tail).toBeInstanceOf(LinkedListNode);
  });
});
