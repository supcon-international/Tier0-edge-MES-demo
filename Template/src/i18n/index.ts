import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import enTranslation from "./locales/en/index"
import zhTranslation from "./locales/zh/index"

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: enTranslation,
    },
    zh: {
      translation: zhTranslation,
    },
  },
  lng: (() => {
    const storedLang = localStorage.getItem("lang")
    if (storedLang === "zh-cn") return "zh"
    if (storedLang === "en-us") return "en"
    return "en"
  })(),
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  nsSeparator: ".",
  keySeparator: ".",
})

export default i18n

