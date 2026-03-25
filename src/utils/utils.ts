export const toTwemojiUrl = (emoji: string): string => {
  const codePoint = [...emoji]
    .map((char) => char.codePointAt(0)?.toString(16))
    .filter((hex) => hex !== "fe0f") // remove variation selector
    .join("-");

  return `https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/${codePoint}.svg`;
};

export const getCurrentUser = () => {
  if (typeof window === "undefined") return null;

  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};
