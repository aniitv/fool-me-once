class NotificationService {
  constructor(limit = 100) {
    this.queue = [];
    this.limit = limit;
  }

  add(message, type = "info", priority = 1) {
    const notification = { id: Date.now(), message, type, priority };

    this.queue.push(notification);

    if (this.queue.length > this.limit) {
      this.queue.shift();
    }

    return notification;
  }

  get() {
    return this.queue[this.queue.length - 1];
  }

  remove() {
    return this.queue.pop();
  }

  getAll() {
    return this.queue;
  }

  clearAll() {
    this.queue = [];
  }
}

export const notificationS = new NotificationService();
