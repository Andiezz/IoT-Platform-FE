import { useContext } from 'react';
import { RootStoreContext } from 'src/context/store.context';
import { RootStore, StoreChildKeyType } from 'src/store/root.store';
/**
 * This function will get mobx store from the context.
 *
 * @param storeKey RootStoreChildType must be defined in IRootStore
 * @returns store: Mobx store in react context
 * @throw Exception if store not defined.
 */
const useStore = <T>(storeKey: StoreChildKeyType): T => {
	const context = useContext(RootStoreContext);
	const store = context[storeKey];
	if (!store) {
		throw new Error('Store is not defined ');
	}
	return store as T;
};

export const useRootStore = (): RootStore => {
	return useContext(RootStoreContext);
};
export default useStore;
