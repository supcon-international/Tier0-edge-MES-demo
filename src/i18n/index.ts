import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 导入翻译资源
import enTranslation from './locales/en/index.js';
import zhTranslation from './locales/zh/index.js';

// 配置i18n实例
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation,
      },
      zh: {
        translation: zhTranslation,
      },
    },
    // 从localStorage获取语言设置，默认为英文
    lng: (() => {
      const storedLang = localStorage.getItem('lang');
      // 处理zh-cn和en-us格式
      if (storedLang === 'zh-cn') return 'zh';
      if (storedLang === 'en-us') return 'en';
      return 'en'; // 默认语言
    })(),
    fallbackLng: 'en', // 回退语言
    interpolation: {
      escapeValue: false, // React已经安全地转义了
    },
    // 允许命名空间
    nsSeparator: '.',
    keySeparator: '.',
  });

export default i18n;