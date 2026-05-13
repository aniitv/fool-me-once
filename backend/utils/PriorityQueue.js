export class BiPriorityQueue {
  constructor() {
    this.elements = [];
  }

  enqueue(item, priority) {
    this.elements.push({ item, priority });

    this.elements.sort((a, b) => b.priority - a.priority);

    if (this.elements.length > 10) {
      this.elements.pop();
    }
  }

  dequeueHighest() {
    return this.elements.shift();
  }

  dequeueLowest() {
    return this.elements.pop();
  }
}
