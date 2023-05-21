class LinkedListNode {
  constructor(data, prev, next) {
    this.data = data;
    this.prev = prev || null;
    this.next = next || null;
  }

  get value() {
    return this.data;
  }
}

module.exports = LinkedListNode;
