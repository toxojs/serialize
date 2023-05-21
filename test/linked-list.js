const LinkedListNode = require('./linked-list-node');

class LinkedList {
  constructor(...args) {
    this.size = 0;
    this.head = null;
    this.tail = null;
    for (let i = 0; i < args.length; i += 1) {
      this.append(args[i]);
    }
  }

  static from(iterable) {
    return new LinkedList(...iterable);
  }

  get length() {
    return this.size;
  }

  clear() {
    this.head = null;
    this.tail = null;
    this.size = 0;
    return this;
  }

  append(...args) {
    for (let i = 0; i < args.length; i += 1) {
      const data = args[i];
      const node = new LinkedListNode(data, this.tail);
      if (this.head === null) {
        this.head = node;
      }
      if (this.tail !== null) {
        this.tail.next = node;
      }
      this.tail = node;
      this.size += 1;
    }
    return this;
  }

  prepend(...args) {
    for (let i = args.length - 1; i >= 0; i -= 1) {
      const data = args[i];
      const node = new LinkedListNode(data, null, this.head);
      if (this.tail === null) {
        this.tail = node;
      }
      if (this.head !== null) {
        this.head.prev = node;
      }
      this.head = node;
      this.size += 1;
    }
    return this;
  }

  removeNode(srcNode) {
    const node = srcNode;
    if (!node) {
      return undefined;
    }
    if (node.prev !== null) {
      node.prev.next = node.next;
    }
    if (node.next !== null) {
      node.next.prev = node.prev;
    }
    if (this.head === node) {
      this.head = node.next;
    }
    if (this.tail === node) {
      this.tail = node.prev;
    }
    this.size -= 1;
    node.next = null;
    node.prev = null;
    return node;
  }

  push(...args) {
    this.append(...args);
    return this.size;
  }

  unshift(...args) {
    this.prepend(...args);
    return this.size;
  }

  shift() {
    const result = this.removeNode(this.head);
    return result ? result.data : undefined;
  }

  pop() {
    const result = this.removeNode(this.tail);
    return result ? result.data : undefined;
  }

  getNode(index) {
    if (this.head === null || index < 0 || index >= this.length) {
      return undefined;
    }
    let node = this.head;
    for (let i = 0; i < index; i += 1) {
      node = node.next;
    }
    return node;
  }

  get(index) {
    return this.getNode(index)?.data;
  }

  insertAfter(srcRef, data) {
    const ref = srcRef;
    const node = new LinkedListNode(data, ref, ref.next);
    if (ref.next === null) {
      this.tail = node;
    } else {
      ref.next.prev = node;
    }
    ref.next = node;
    this.size += 1;
    return this;
  }

  insertBefore(srcRef, data) {
    const ref = srcRef;
    const node = new LinkedListNode(data, ref.prev, ref);
    if (ref.prev === null) {
      this.head = node;
    } else {
      ref.prev.next = node;
    }
    ref.prev = node;
    this.size += 1;
    return this;
  }

  insertAt(index, data) {
    if (this.head === null) {
      return this.append(data);
    }
    if (index <= 0) {
      return this.prepend(data);
    }
    let node = this.head;
    let currentIndex = 0;
    while (currentIndex < index - 1 && node.next !== null) {
      currentIndex += 1;
      node = node.next;
    }
    return this.insertAfter(node, data);
  }

  removeAt(index) {
    return this.removeNode(this.getNode(index));
  }

  reverse() {
    let node = this.head;
    while (node) {
      const { next } = node;
      node.next = node.prev;
      node.prev = next;
      node = next;
    }
    [this.tail, this.head] = [this.head, this.tail];
    return this;
  }

  merge(srcList) {
    const list = srcList;
    if (this.tail) {
      this.tail.next = list.head;
    }
    if (list.head) {
      list.head.prev = this.tail;
    }
    this.head = this.head || list.head;
    this.tail = list.tail || this.tail;
    this.size += list.size;
    list.size = this.size;
    list.head = this.head;
    list.tail = this.tail;
  }

  *[Symbol.iterator]() {
    let node = this.head;
    while (node) {
      yield node.data;
      node = node.next;
    }
  }

  toArray() {
    return [...this];
  }

  toString(separator = ' ') {
    return this.reduce((s, data) => `${s}${separator}${data}`);
  }

  findNodeAndIndex(fn) {
    let index = 0;
    let node = this.head;
    while (node) {
      if (fn(node.data, index, this)) {
        return { index, node };
      }
      node = node.next;
      index += 1;
    }
    return undefined;
  }

  findIndex(fn) {
    const result = this.findNodeAndIndex(fn);
    return result ? result.index : -1;
  }

  find(fn) {
    const result = this.findNodeAndIndex(fn);
    return result?.node?.data;
  }

  findNode(fn) {
    const result = this.findNodeAndIndex(fn);
    return result?.node;
  }

  sort(fn) {
    const array = this.toArray();
    array.sort(fn);
    this.clear();
    this.append(...array);
    return this;
  }

  forEach(fn, reverse = false) {
    let index = reverse ? this.length - 1 : 0;
    let node = reverse ? this.tail : this.head;
    const increment = reverse ? -1 : 1;
    while (node) {
      fn(node.data, index, this);
      node = reverse ? node.prev : node.next;
      index += increment;
    }
  }

  map(fn, reverse = false) {
    const result = new LinkedList();
    this.forEach(
      (data, index) => result.append(fn(data, index, this)),
      reverse
    );
    return result;
  }

  filter(fn, reverse = false) {
    const result = new LinkedList();
    this.forEach((data, index) => {
      if (fn(data, index, this)) {
        result.append(data);
      }
    }, reverse);
    return result;
  }

  reduce(fn, start, reverse = false) {
    if (this.length === 0) {
      return start;
    }
    let index = reverse ? this.length - 1 : 0;
    const increment = reverse ? -1 : 1;
    let current = reverse ? this.tail : this.head;
    let result = start !== undefined ? start : current.data;
    if (start === undefined) {
      current = current.next;
    }
    while (current) {
      result = fn(result, current.data, index, this);
      current = current[reverse ? 'prev' : 'next'];
      index += increment;
    }
    return result;
  }

  slice(start, end) {
    const result = new LinkedList();
    const finish = end === undefined || end < start ? this.length : end;
    if (!this.head) {
      return result;
    }
    let node = this.getNode(start);
    for (let i = 0; i < finish - start && node; i += 1) {
      result.append(node.data);
      node = node.next;
    }
    return result;
  }
}

module.exports = LinkedList;
