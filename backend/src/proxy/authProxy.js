export const authProxy = async (url, options = {}) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const urlWithKey = `${url}${url.includes("?") ? "&" : "?"}key=${apiKey}`;

  const response = await fetch(urlWithKey, options);

  if (!response.ok) {
    const text = await response.text();
    console.error(`API Error ${response.status}:`, text);
    throw new Error(`Request failed ${response.status}`);
  }

  return response.json();
};
