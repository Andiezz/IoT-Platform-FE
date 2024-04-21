import { useContext } from 'react';
import { IoCContext } from 'src/context/service.context';
import { IServiceContainer, IoCServiceKeyType } from 'src/services/container';
/**
 * This function will get application service from the context.
 *
 * @param serviceKey IoCServiceKeyType must be defined in IServiceContainer
 * @returns ioc: Application service provider store in react context
 * @throw Exception if service was not defined.
 */
const useService = <T>(serviceKey: IoCServiceKeyType): T => {
	const context = useContext(IoCContext);
	const store = context[serviceKey];
	if (!store) {
		throw new Error('Store is not defined ');
	}
	return store as T;
};

export const useRootStore = (): IServiceContainer => {
	return useContext(IoCContext);
};
export default useService;
