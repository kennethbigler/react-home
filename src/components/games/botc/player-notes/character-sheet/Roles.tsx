import { BotCRole } from "../../../../../jotai/botc-atom";
import {
  tb,
  snv,
  bmr,
  swpm,
  other,
  BotCScript,
} from "../../../../../constants/botc";
import RoleSection, { RoleKey } from "./RoleSection";

interface RolesProps {
  isText: boolean;
  script: number;
  roleKey: RoleKey;
  onRoleClick?: (role: BotCRole, selected: boolean) => () => void;
}
interface ActiveBotCScript {
  active: BotCScript;
  travelers: BotCRole[];
}

/** CharacterSheet -> EmojiNotes
 *                 -> Roles -> RoleSelection */
const Roles = ({ isText, script, roleKey, onRoleClick }: RolesProps) => {
  let scripts: ActiveBotCScript = { active: other, travelers: [] };
  let isOtherScript = false;
  switch (script) {
    case 0:
      scripts = { active: tb, travelers: [...snv.travelers, ...bmr.travelers] };
      break;
    case 1:
      scripts = { active: snv, travelers: [...tb.travelers, ...bmr.travelers] };
      break;
    case 2:
      scripts = { active: bmr, travelers: [...tb.travelers, ...snv.travelers] };
      break;
    case 3:
      scripts = { active: swpm, travelers: [...other.travelers] };
      break;
    case 4:
    default: // keep initial assignment
      isOtherScript = true;
  }

  let gridSize = 3;
  // if text version, then grid size should be 6, or 4 for other script
  if (isText) {
    gridSize = isOtherScript ? 4 : 6;
  }
  // townsfolk grid size should be 6, except for other script, then it matches above (3 or 4)
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
