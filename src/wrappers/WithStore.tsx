import React from "react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import throttle from "lodash/throttle";
import { Store } from "redux";
import localForage from "localforage";
import WithTheme from "./WithTheme";
import LoadingSpinner from "../components/common/loading-spinner";
// stores
import reducer from "../store";
import { RootState } from "../store/store";

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
    localForage
      .getItem("state")
      .then((state) =>
        state
          ? configureStore({ reducer, preloadedState: state as RootState })
          : configureStore({ reducer })
      )
      .then((store) => {
        store.subscribe(
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          throttle(() => localForage.setItem("state", store.getState()), 1000)
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
