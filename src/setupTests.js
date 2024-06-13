// src/setupTests.js
import "@testing-library/jest-dom";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",
  resources: {
    en: {
      translation: {
        // Your translation strings go here
        login: "login",
        // Add other necessary translations
      },
    },
  },
});
