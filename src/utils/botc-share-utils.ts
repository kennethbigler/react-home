/**
 * Utilities for encoding/decoding BotC game state as URL search parameters.
 *
 * URL format:
 *   ?script=base:0            (base script by index)
 *   ?script=community:12345   (community script by pk)
 *   &players=8
 *   &names=Alice|Bob|Carol    (pipe-separated; numTravelers = names.length - players)
 */
import { ActiveScript, BotCPlayer, BaseScriptIndex } from "../jotai/botc-atom";
import {
  CommunityScriptOption,
  loadAllScriptOptions,
} from "./botc-script-utils";

const BASE_URL = "https://www.kennethbigler.com/games/botc";
const NAMES_DELIMITER = "_";

export interface SharedState {
  script: ActiveScript;
  numPlayers: number;
  numTravelers: number;
  names: string[];
}

/** Build a shareable URL from the current game state */
export const buildShareUrl = (
  script: ActiveScript,
  numPlayers: number,
  numTravelers: number,
  botcPlayers: BotCPlayer[],
): string => {
  const params = new URLSearchParams();

  if (script.type === "base") {
    params.set("script", `base:${script.index}`);
  } else {
    params.set("script", `community:${script.pk}`);
  }

  params.set("players", String(numPlayers));

  const totalSlots = numPlayers + numTravelers;
  const names = botcPlayers.slice(0, totalSlots).map((p) => p.name);
  params.set("names", names.join(NAMES_DELIMITER));

  return `${BASE_URL}?${params.toString()}`;
};

/** Parse URL search params into SharedState, returns null if no share params present */
export const parseShareParams = async (
  search: string,
): Promise<SharedState | null> => {
  const params = new URLSearchParams(search);

  const scriptParam = params.get("script");
  const playersParam = params.get("players");
  const namesParam = params.get("names");

  if (!scriptParam || !playersParam || !namesParam) {
    return null;
  }

  const numPlayers = parseInt(playersParam, 10);
  if (isNaN(numPlayers)) return null;

  const names = namesParam.split(NAMES_DELIMITER);
  const numTravelers = names.length - numPlayers;

  let script: ActiveScript;

  if (scriptParam.startsWith("base:")) {
    const index = parseInt(scriptParam.slice(5), 10) as BaseScriptIndex;
    script = { type: "base", index };
  } else if (scriptParam.startsWith("community:")) {
    const pk = parseInt(scriptParam.slice(10), 10);
    const allOptions = await loadAllScriptOptions();
    const found = allOptions.find(
      (o): o is CommunityScriptOption => o.type === "community" && o.pk === pk,
    );
    if (!found) return null;
    script = {
      type: "community",
      pk: found.pk,
      title: found.label,
      author: found.author,
      characters: found.characters,
    };
  } else {
    return null;
  }

  return { script, numPlayers, numTravelers, names };
};
