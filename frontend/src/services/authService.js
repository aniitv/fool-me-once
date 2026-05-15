class AuthService {
  constructor() {
    this.isAuthenticated = false;
    this.listeners = new Set();
  }

  login() {
    this.isAuthenticated = true;
    this.emit();
  }

  logout() {
    this.isAuthenticated = false;
    this.emit();
  }

  getAuth() {
    return this.isAuthenticated;
  }

  subscribe(callback) {
    this.listeners.add(callback);

    return () => {
      this.listeners.delete(callback);
    };
  }

  emit() {
    this.listeners.forEach((cb) => cb(this.isAuthenticated));
  }
}

export const authService = new AuthService();
