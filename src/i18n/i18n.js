import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import hrTranslations from "./locales/hr.json";
import enTranslations from "./locales/en.json";

i18n.use(initReactI18next).init({
  resources: {
    hr: { translation: hrTranslations },
    en: { translation: enTranslations },
  },
  lng: localStorage.getItem("i18nextLng") || "hr", // Default to Croatian or stored preference
  fallbackLng: "hr",
  interpolation: {
    escapeValue: false, // React already escapes values safely
  },
});

export default i18n;
