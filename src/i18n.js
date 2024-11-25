import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from "./locales/en/translation.json";
import frTranslation from "./locales/fr/translation.json";
import faTranslation from "./locales/fa/translation.json";
import esTranslation from "./locales/es/translation.json";
import trTranslation from "./locales/tr/translation.json";
import { SettingsController } from "./controllers";

const settingsController = new SettingsController();
const settingsLanguageKey = "language";

const resources = {
  en: {
    translation: enTranslation,
  },
  fr: {
    translation: frTranslation,
  },
  fa: {
    translation: faTranslation,
  },
  es: {
    translation: esTranslation,
  },
  tr: {
    translation: trTranslation,
  },
};

const setDirection = (language) => {
  const direction = language === "fa" ? "rtl" : "ltr";
  document.documentElement.setAttribute("dir", direction);
};

// Initialize i18n with async settings retrieval
(async () => {
  const storedLanguage = await settingsController.getData(settingsLanguageKey);

  i18n
    .use(initReactI18next)
    .init(
      {
        resources,
        lng: storedLanguage || "en",
        fallbackLng: "en",
        interpolation: {
          escapeValue: false,
        },
        react: {
          useSuspense: false,
        },
        initImmediate: false,
      },
      () => {
        setDirection(i18n.language);
      }
    );

  i18n.on("languageChanged", (lng) => {
    setDirection(lng);
  });
})();

export default i18n;

// Set language and save it in the database
export const setLanguage = async (language) => {
  await i18n.changeLanguage(language);
  await settingsController.setData(settingsLanguageKey, language);
};
