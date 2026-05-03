class NotificationService {
  constructor(limit = 100) {
    this.queue = [];
    this.limit = limit;
  }

  add(message, type = "info", priority = 1) {
    if (!message) return null;

    const notification = { id: Date.now(), message, type, priority };

    this.queue.push(notification);

    if (this.queue.length > this.limit) {
      this.queue.shift();
    }

    return notification;
  }

  getAll() {
    return this.queue;
  }

  getByType(type) {
    return this.queue.filter((n) => n.type === type);
  }

  remove() {
    return this.queue.pop();
  }

  removeByType(type) {
    const index = this.queue.findIndex((n) => n.type === type);
    if (index !== -1) {
      return this.queue.splice(index, 1);
    }
    return null;
  }

  clearAll() {
    this.queue = [];
  }
}

export const notificationS = new NotificationService();
