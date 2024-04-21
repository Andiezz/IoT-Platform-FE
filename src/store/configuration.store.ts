import { action, makeObservable, observable } from 'mobx';
import { CONFIG_KEY } from 'src/constants/app';
import { LANGUAGE } from 'src/constants/language';

export interface IConfiguration {
	lang: LANGUAGE;
  changeLanguage(lang: LANGUAGE): void;
}

export default class ConfigurationStore implements IConfiguration {
	@observable
	lang: LANGUAGE = LANGUAGE.EN;
	constructor() {
		const configs: string | null = localStorage.getItem(CONFIG_KEY);
		if (configs) {
			JSON.stringify(configs);
		}
		makeObservable(this);
	}

	@action.bound
	changeLanguage(lang: LANGUAGE): void {
		this.lang = lang;
	}
}
