"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "../../../public/locales/en/common.json";
import pt from "../../../public/locales/pt/common.json";
import es from "../../../public/locales/es/common.json";

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { common: en },
            pt: { common: pt },
            es: { common: es },
        },
        fallbackLng: "en",
        ns: ["common"],
        defaultNS: "common",
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ["querystring", "cookie", "localStorage", "navigator", "path", "subdomain"],
            caches: ["localStorage", "cookie"],
        },
    });

export default i18n;
