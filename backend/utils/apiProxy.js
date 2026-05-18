import { withLogging } from "./logger.js";

const baseRequest = async (url, options = {}) => {
  const authenticatedOptions = {
    ...options,
    headers: {
      ...options.headers,
      Authorization: "Bearer YOUR_SECRET_TOKEN",
      "Content-Type": "application/json",
    },
  };

  const response = await fetch(url, authenticatedOptions);

  if (!response.ok) {
    if (response.status === 401) {
      console.error("[Proxy] Unauthorized: Token expired.");
    }
    throw new Error(`Status: ${response.status}`);
  }

  return await response.json();
};

export const apiProxy = withLogging(baseRequest, "INFO");
