import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from "./locales/en/translation.json";
import frTranslation from "./locales/fr/translation.json";
import faTranslation from "./locales/fa/translation.json";

const localStorageKey = "appLanguage";

const resources = {
  en: {
    translation: enTranslation,
  },
  fr: {
    translation: frTranslation,
  },
  fa: {
    translation: faTranslation,
    direction: "rtl",
  },
};

// Retrieve the language choice from local storage
const storedLanguage = localStorage.getItem(localStorageKey);

i18n.use(initReactI18next).init({
  resources,
  lng: storedLanguage || "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

export const setLanguage = (language) => {
  localStorage.setItem(localStorageKey, language);
};
