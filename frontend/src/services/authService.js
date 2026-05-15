import { log } from "../utils/loggger";

class AuthService {
  constructor() {
    this.isAuthenticated = false;
    this.listeners = new Set();
  }

  login = log({ level: "INFO" })(async () => {
    this.isAuthenticated = true;
    this.emit();
    return { status: "logged_in" };
  });

  logout = log({ level: "INFO" })(async () => {
    this.isAuthenticated = false;
    this.emit();
    return { status: "logged_out" };
  });

  getAuth() {
    return this.isAuthenticated;
  }

  subscribe(callback) {
    this.listeners.add(callback);

    callback(this.isAuthenticated);
  }

  unsubscribe(callback) {
    this.listeners.delete(callback);
  }

  emit() {
    this.listeners.forEach((cb) => cb(this.isAuthenticated));
  }
}

export const authService = new AuthService();
