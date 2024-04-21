import { ConfigProvider } from 'antd';
import React, { FC } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from './locales/i18n';
import { RootStoreProvider } from './context/store.context';
import rootStore from './store/root.store';
import { IocProvider } from './context/service.context';
import ioc from './services/container';
import AppRouters from './routes/app-router';
import theme from './theme/overriding';
const ExroApp: FC = () => {
	return (
		<React.StrictMode>
			<I18nextProvider i18n={i18n}>
				<RootStoreProvider store={rootStore}>
					<IocProvider container={ioc}>
						<ConfigProvider theme={theme}>
							<AppRouters />
						</ConfigProvider>
					</IocProvider>
				</RootStoreProvider>
			</I18nextProvider>
		</React.StrictMode>
	);
};

export default ExroApp;
