import { atomWithStorage } from "jotai/utils";

/**
 * Shared wrapper for all persisted atoms: `getOnInit` reads localStorage at
 * atom creation so the first render never flashes the default value, and the
 * debugLabel mirrors the storage key for devtools.
 */
const persistentAtom = <T>(key: string, initialValue: T) => {
  const anAtom = atomWithStorage<T>(key, initialValue, undefined, {
    getOnInit: true,
  });
  anAtom.debugLabel = key;
  return anAtom;
};

export default persistentAtom;
