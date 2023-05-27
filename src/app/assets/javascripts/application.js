import flash from "./flash";

const $ = document.querySelector.bind(document);
window.$ = $;

document.addEventListener("readystatechange", () => {
  if (document.readyState === "complete") {
    flash();
  }
});
