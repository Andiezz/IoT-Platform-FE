import React, { createContext, FC } from 'react';
import ioc, { IServiceContainer } from '../services/container';

const IoCContext = createContext<IServiceContainer>(ioc);

interface IIoCProvider {
	container: IServiceContainer;
	children: React.ReactNode;
}

const IocProvider: FC<IIoCProvider> = ({ container, children }) => {
	return <IoCContext.Provider value={container}>{children}</IoCContext.Provider>;
};

export { IoCContext, IocProvider };
