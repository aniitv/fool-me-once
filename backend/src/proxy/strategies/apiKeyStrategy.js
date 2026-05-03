export class ApiKeyStrategy {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async apply(options) {
    return {
      ...options,
      headers: {
        ...options.headers,
        "Content-Type": "application/json",
      },
    };
  }
}
