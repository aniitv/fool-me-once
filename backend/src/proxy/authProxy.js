import fetch from "node-fetch";

export const authProxy = async (url, options = {}, strategy) => {
  const modifiedOptions = await strategy.apply(options);
  const response = await fetch(url, modifiedOptions);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Request failed with status ${response.status} - ${text}`);
  }
  return response.json();
};
