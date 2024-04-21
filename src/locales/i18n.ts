import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en';
import { LANGUAGE } from 'src/constants/language';
import rootStore from 'src/store/root.store';
const resources = { en };

i18n.use(initReactI18next).init({
	initImmediate: false,
	debug: false,
	resources: resources,
	lng: LANGUAGE.EN,
	react: {
		useSuspense: false
	},
	interpolation: {
		escapeValue: false
	}
});

export let i18nKey = resources[i18n.language as LANGUAGE];
i18n.on('languageChanged', (lng: LANGUAGE) => {
	rootStore.configuration.changeLanguage(lng);
	i18nKey = resources[lng];
});

export type I18nKeyType = keyof typeof i18nKey;
export default i18n;
