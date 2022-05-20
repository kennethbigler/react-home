import React from "react";
import { Provider } from "react-redux";
import throttle from "lodash/throttle";
import { Store } from "redux";
import WithTheme from "./WithTheme";
import { loadState, saveState, configureStore } from "../store/configureStore";
import LoadingSpinner from "../components/common/loading-spinner";
import { DBRootState } from "../store/types";

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
        store.subscribe(
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          throttle(() => saveState(store.getState() as DBRootState), 1000)
        );
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
