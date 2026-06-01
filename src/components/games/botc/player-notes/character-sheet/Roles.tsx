import { useMemo } from "react";
import {
  ActiveScript,
  BotCRole,
  BaseScript,
} from "../../../../../jotai/botc-atom";
import { tb, snv, bmr, other, BotCScript } from "../../../../../constants/botc";
import { buildScriptFromCharacters } from "../../../../../utils/botc-script-utils";
import RoleSection, { RoleKey } from "./RoleSection";

interface RolesProps {
  isText: boolean;
  script: ActiveScript;
  roleKey: RoleKey;
  onRoleClick?: (role: BotCRole, selected: boolean) => () => void;
}
interface ActiveBotCScript {
  active: BotCScript;
  travelers: BotCRole[];
}

/** Extra travelers from `other` that are not already in `scriptTravelers` */
const extraTravelers = (scriptTravelers: BotCRole[]): BotCRole[] =>
  other.travelers.filter((x) => !scriptTravelers.includes(x));

/** CharacterSheet -> EmojiNotes
 *                 -> Roles -> RoleSelection */
const Roles = ({ isText, script, roleKey, onRoleClick }: RolesProps) => {
  const scripts = useMemo<ActiveBotCScript>(() => {
    if (script.type === "community") {
      return script.characters.length > 0
        ? {
            active: buildScriptFromCharacters(script.characters),
            travelers: [...other.travelers],
          }
        : { active: other, travelers: [] };
    }
    switch (script.index) {
      case BaseScript.TB:
        return { active: tb, travelers: extraTravelers(tb.travelers) };
      case BaseScript.SNV:
        return { active: snv, travelers: extraTravelers(snv.travelers) };
      case BaseScript.BMR:
        return { active: bmr, travelers: extraTravelers(bmr.travelers) };
      default:
        return { active: other, travelers: [] };
    }
  }, [script]);

  const isOtherScript =
    script.type === "community"
      ? script.characters.length === 0
      : script.index === BaseScript.Other;

  // icon mode → 3 cols; text + other → 4 cols; text + named script → 6 cols
  const gridSize = isText ? (isOtherScript ? 4 : 6) : 3;
  // townsfolk always 6 cols on named scripts (more room for long names)
  const tfGridSize = isOtherScript ? gridSize : 6;

  return (
    <>
      <RoleSection
        title="Townsfolk"
        gridSize={tfGridSize}
        isText={isText}
        roleKey={roleKey}
        roles={scripts.active.townsfolk}
        onRoleClick={onRoleClick}
      />
      <RoleSection
        title="Outsiders"
        gridSize={gridSize}
        isText={isText}
        roleKey={roleKey}
        roles={scripts.active.outsiders}
        onRoleClick={onRoleClick}
      />
      <RoleSection
        title="Minions"
        gridSize={gridSize}
        isText={isText}
        roleKey={roleKey}
        roles={scripts.active.minions}
        onRoleClick={onRoleClick}
      />
      <RoleSection
        title="Demons"
        gridSize={gridSize}
        isText={isText}
        roleKey={roleKey}
        roles={scripts.active.demons}
        onRoleClick={onRoleClick}
      />
      {scripts.active.travelers.length > 0 && (
        <RoleSection
          title="Travelers"
          gridSize={gridSize}
          isText={isText}
          roleKey={roleKey}
          roles={scripts.active.travelers}
          onRoleClick={onRoleClick}
        />
      )}
      {scripts.travelers.length > 0 && (
        <RoleSection
          title="Other Travelers"
          gridSize={gridSize}
          isText={isText}
          roleKey={roleKey}
          roles={scripts.travelers}
          onRoleClick={onRoleClick}
        />
      )}
    </>
  );
};

export default Roles;
