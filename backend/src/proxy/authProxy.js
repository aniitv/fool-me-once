export const authProxy = async (url, options = {}, retries = 3) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const urlWithKey = `${url}${url.includes("?") ? "&" : "?"}key=${apiKey}`;

  try {
    const response = await fetch(urlWithKey, options);

    if (response.status === 429) {
      if (retries > 0) {
        console.warn(`Rate limit hit, retrying...`);

        const retryAfter = response.headers.get("Retry-After") || 5;
        await new Promise((r) => setTimeout(r, retryAfter * 1000));
        return authProxy(url, options, retries - 1);
      }
      throw new Error("Rate limit exceeded, no retries left");
    }

    if (!response.ok) {
      const text = await response.text();
      console.error(`API Error ${response.status}:`, text);
      throw new Error(`Request failed ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Auth Proxy Error:", error.message);
    throw error;
  }
};
