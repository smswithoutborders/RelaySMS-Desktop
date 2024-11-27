import React, { createContext, useContext, useEffect, useState } from "react";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from "../locales/en/translation.json";
import frTranslation from "../locales/fr/translation.json";
import faTranslation from "../locales/fa/translation.json";
import esTranslation from "../locales/es/translation.json";
import trTranslation from "../locales/tr/translation.json";
import { SettingsController } from "../controllers";

const settingsController = new SettingsController();
const settingsLanguageKey = "preferences.language";

const resources = {
  en: { translation: enTranslation },
  fr: { translation: frTranslation },
  fa: { translation: faTranslation },
  es: { translation: esTranslation },
  tr: { translation: trTranslation },
};

const languages = ["en", "fr", "fa", "es", "tr"];

const setDirection = (language) => {
  const direction = language === "fa" ? "rtl" : "ltr";
  document.documentElement.setAttribute("dir", direction);
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const initializeLanguage = async () => {
      const storedLanguage = await settingsController.getData(
        settingsLanguageKey
      );
      const initialLanguage = storedLanguage || language;

      i18n.use(initReactI18next).init({
        resources,
        lng: initialLanguage,
        fallbackLng: "en",
        interpolation: {
          escapeValue: false,
        },
        react: {
          useSuspense: false,
        },
        initImmediate: false,
      });

      setDirection(initialLanguage);
      setLanguage(initialLanguage);

      i18n.on("languageChanged", (lng) => {
        setDirection(lng);
        setLanguage(lng);
      });
    };

    initializeLanguage();
  }, []);

  const changeLanguage = async (newLanguage) => {
    await i18n.changeLanguage(newLanguage);
    await settingsController.setData(settingsLanguageKey, newLanguage);
    setLanguage(newLanguage);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, languages }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  return useContext(LanguageContext);
};
