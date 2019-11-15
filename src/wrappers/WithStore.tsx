import React from 'react';
import { Provider } from 'react-redux';
import throttle from 'lodash/throttle';
import { Store, AnyAction } from 'redux';
import WithTheme from './WithTheme';
import { loadState, saveState, configureStore } from '../store/configureStore';
import LoadingSpinner from '../components/common/loading-spinner';
import { DBRootState } from '../store/types';

/** App class that wraps higher level components of the application */
const WithStore: React.FC<{}> = React.memo(() => {
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  const storeRef: React.MutableRefObject<Store<DBRootState, AnyAction> | undefined> = React.useRef(undefined);

  React.useEffect(() => {
    loadState()
      .then(configureStore)
      .then((store) => {
        store.subscribe(throttle(() => saveState(store.getState()), 1000));
        storeRef.current = store;
        forceUpdate();
      });
  });

  return storeRef.current ? (
    <Provider store={storeRef.current}>
      <WithTheme />
    </Provider>
  ) : <LoadingSpinner />;
});

export default WithStore;
