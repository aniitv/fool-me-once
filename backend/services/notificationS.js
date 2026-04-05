class NotificationService {
  constructor(limit = 100) {
    this.queue = [];
    this.limit = limit;
  }

  add(message, type = "info", priority = 1) {
    const notification = { id: Date.now(), message, type };

    this.queue.enqueue(notification, priority);
    if (this.queue.size() > this.limit) {
      this.queue.dequeue("oldest");
    }
    return notification;
  }

  get(type = "newest") {
    return this.queue.peek(type);
  }
  remove(type = "newest") {
    return this.queue.dequeue(type);
  }
  getAll() {
    return this.queue.getAll();
  }
  clearAll() {
    this.queue.clear();
  }
}

export const notificationS = new NotificationService();
