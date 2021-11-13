import React from "react";
import { Provider } from "react-redux";
import throttle from "lodash/throttle";
import { Store } from "redux";
import WithTheme from "./WithTheme";
import { loadState, saveState, configureStore } from "../store/configureStore";
import LoadingSpinner from "../components/common/loading-spinner";

interface WithStoreState {
  store?: Store;
}

/** App class that wraps higher level components of the application */
class WithStore extends React.PureComponent<
  Record<string, unknown>,
  WithStoreState
> {
  constructor(props: Record<string, unknown>) {
    super(props);
    this.state = {};
  }

  componentDidMount(): void {
    loadState()
      .then(configureStore)
      .then((store) => {
        // eslint-disable-next-line @typescript-eslint/no-misused-promises, @typescript-eslint/no-unsafe-argument
        store.subscribe(throttle(() => saveState(store.getState()), 1000));
        this.setState({ store });
      })
      .catch(() => {
        // eslint-disable-next-line no-console
        console.error("loading state failed");
      });
  }

  render(): React.ReactNode {
    const { store } = this.state;
    return store ? (
      <Provider store={store}>
        <WithTheme />
      </Provider>
    ) : (
      <LoadingSpinner />
    );
  }
}

export default WithStore;
