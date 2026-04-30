export class ApiKeyStrategy {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async apply(options) {
    return {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Api-Key ${this.apiKey}`,
      },
    };
  }
}
