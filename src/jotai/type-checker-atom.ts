import persistentAtom from "./storage";
import { DEFAULT_GENERATION } from "@/constants/type-checker";

/** pokemon generation shown in the type checker grid */
const generationAtom = persistentAtom(
  "typeCheckerGenerationAtom",
  DEFAULT_GENERATION,
);

export default generationAtom;
