export class BiPriorityQueue {
  constructor() {
    this.elements = []; //{ item, priority, timestamp }
  }

  enqueue(item, priority) {
    const newNode = {
      item,
      priority,
      timestamp: Date.now(),
    };

    this.elements.push(newNode);

    this.elements.sort((a, b) => b.priority - a.priority);

    if (this.elements.length > 10) {
      this.elements.pop();
    }
  }

  //FIFO
  dequeueHighest() {
    return this.elements.shift();
  }

  //LIFO
  dequeueLowest() {
    return this.elements.pop();
  }

  isEmpty() {
    return this.elements.length === 0;
  }

  peekFront() {
    return this.elements[0];
  }

  peekBack() {
    return this.elements[this.elements.length - 1];
  }
}
