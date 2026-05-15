import { log } from "../utils/loggger";

class AuthService {
  constructor() {
    this.isAuthenticated = false;
    this.listeners = new Set();
  }

  login = log({ level: "INFO" })(async (user = "guest") => {
    this.isAuthenticated = true;
    this.emit();

    return {
      status: "logged_in",
      user,
    };
  });

  logout = log({ level: "INFO" })(async () => {
    this.isAuthenticated = false;
    this.emit();

    return {
      status: "logged_out",
    };
  });

  getAuth() {
    return this.isAuthenticated;
  }

  subscribe(callback) {
    this.listeners.add(callback);
  }

  unsubscribe(callback) {
    this.listeners.delete(callback);
  }

  emit() {
    this.listeners.forEach((cb) => cb(this.isAuthenticated));
  }
}

export const authService = new AuthService();
