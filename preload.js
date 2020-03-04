// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { name, version } = require("./package.json");
window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };
  replaceText("app-name", name);
  replaceText("app-version", version);
});
