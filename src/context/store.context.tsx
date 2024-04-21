import React, { createContext, FC } from 'react';
import rootStore, { IRootStore } from '../store/root.store';

const RootStoreContext = createContext<IRootStore>(rootStore);

interface IRootStoreProvider {
  store: IRootStore;
  children: React.ReactNode;
}

const RootStoreProvider: FC<IRootStoreProvider> = ({ store, children }) => {
  return (
    <RootStoreContext.Provider value={store}>
      {children}
    </RootStoreContext.Provider>
  );
};

export { RootStoreContext, RootStoreProvider };
