export class BiQueue {
  constructor() {
    this.items = [];
  }

  enqueue(item, priority) {
    const element = { ...item, priority, timestamp: Date.now() };
    this.items.push(element);
  }

  dequeue(type = "newest") {
    if (this.items.length === 0) return null;

    let index = 0;

    switch (type) {
      case "newest":
        index = this.items.length - 1;
        break;
      case "oldest":
        index = 0;
        break;
      case "highest":
        index = this.findHighestPriorityIndex();
        break;
      case "lowest":
        index = this.findLowestPriorityIndex();
        break;
      default:
        return null;
    }
    return this.items.splice(index, 1)[0];
  }

  peek(type) {
    if (this.items.length === 0) return null;

    switch (type) {
      case "newest":
        return this.items[this.items.length - 1];
      case "oldest":
        return this.items[0];
      case "highest":
        return this.items[this_.findHighestPriorityIndex()];
      case "lowest":
        return this.items[this.findLowestPriorityIndex()];
      default:
        return null;
    }
  }

  getAll() {
    return [...this.items];
  }
  size() {
    return this.items.length;
  }
  clear() {
    this.items = [];
  }

  _findHighestPriorityIndex() {
    let maxIndex = 0;
    for (let i = 1; i < this.items.length; i++) {
      if (this.items[i].priority > this.items[maxIndex].priority) {
        maxIndex = i;
      }
    }
    return maxIndex;
  }
  _findLowestPriorityIndex() {
    let minIndex = 0;
    for (let i = 1; i < this.items.length; i++) {
      if (this.items[i].priority < this.items[minIndex].priority) {
        minIndex = i;
      }
    }
    return minIndex;
  }
}
