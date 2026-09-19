// Переключение языка сайта: русский, английский, испанский.
// Порядок выбора: ?lang= в адресе → сохранённый выбор → язык браузера → английский.

const supportedLanguages = ["ru", "en", "es"];

function readSavedLanguage() {
  // localStorage может быть недоступен (приватный режим) — тогда просто нет сохранённого
  try {
    return localStorage.getItem("lang");
  } catch (error) {
    return null;
  }
}

function saveLanguage(language) {
  try {
    localStorage.setItem("lang", language);
  } catch (error) {
    // Не сохранилось — не страшно, при следующем визите выберем по браузеру
  }
}

function pickLanguage() {
  const fromAddress = new URLSearchParams(window.location.search).get("lang");
  if (supportedLanguages.includes(fromAddress)) return fromAddress;

  const saved = readSavedLanguage();
  if (supportedLanguages.includes(saved)) return saved;

  const fromBrowser = (navigator.language || "en").slice(0, 2).toLowerCase();
  return supportedLanguages.includes(fromBrowser) ? fromBrowser : "en";
}

function setLanguage(language) {
  document.documentElement.dataset.lang = language;
  document.documentElement.lang = language;

  // Подсвечиваем нажатую кнопку
  document.querySelectorAll(".lang-switch button").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.set === language));
  });

  // Заголовок вкладки браузера тоже на выбранном языке.
  // Атрибут data-title-ru в JavaScript читается как dataset.titleRu
  const key = "title" + language[0].toUpperCase() + language.slice(1);
  const title = document.documentElement.dataset[key];
  if (title) document.title = title;

  saveLanguage(language);
}

document.querySelectorAll(".lang-switch button").forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.set));
});

setLanguage(pickLanguage());
