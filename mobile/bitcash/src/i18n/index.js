// src/i18n/index.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from './translations/en.json';
import ar from './translations/ar.json';

const LANGUAGES = {
  en: 'English',
  ar: 'العربية'
};

const LANG_CODES = Object.keys(LANGUAGES);

const STORAGE_KEY = '@adfaly_language';

const resources = {
  en: {
    translation: en
  },
  ar: {
    translation: ar
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    compatibilityJSON: 'v3',
    lng: Localization.locale,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  });

export const getCurrentLanguage = async () => {
  try {
    const language = await AsyncStorage.getItem(STORAGE_KEY);
    return language || Localization.locale;
  } catch {
    return Localization.locale;
  }
};

export const setLanguage = async (language) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, language);
    await i18n.changeLanguage(language);
    return true;
  } catch {
    return false;
  }
};

export { LANGUAGES, LANG_CODES };
export default i18n;
