import React from 'react';
import { Provider } from 'react-redux';
import throttle from 'lodash/throttle';
import { Store } from 'redux';
import WithTheme from './WithTheme';
import { loadState, saveState, configureStore } from './store/configureStore';
import LoadingSpinner from './components/common/loading-spinner';

interface WithStoreState {
  store?: Store;
}

/** App class that wraps higher level components of the application */
class WithStore extends React.PureComponent<{}, WithStoreState> {
  constructor(props: {}) {
    super(props);
    this.state = {};
  }

  componentDidMount(): void {
    loadState()
      .then(configureStore)
      .then((store) => {
        store.subscribe(throttle(() => saveState(store.getState()), 1000));
        this.setState({ store });
      });
  }

  render(): React.ReactNode {
    const { store } = this.state;
    return store ? (
      <Provider store={store}>
        <WithTheme />
      </Provider>
    ) : <LoadingSpinner />;
  }
}

export default WithStore;
