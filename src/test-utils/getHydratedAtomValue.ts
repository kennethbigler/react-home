import { createStore, type Atom } from "jotai";

/**
 * Read an atomWithStorage-backed atom the way a fresh page load would:
 * subscribing mounts the atom so it syncs from localStorage before the read.
 * A plain `createStore().get(anAtom)` skips that sync and returns the value
 * captured at atom creation.
 */
const getHydratedAtomValue = <Value>(anAtom: Atom<Value>): Value => {
  const store = createStore();
  const unsub = store.sub(anAtom, () => {});
  try {
    return store.get(anAtom);
  } finally {
    unsub();
  }
};

export default getHydratedAtomValue;
