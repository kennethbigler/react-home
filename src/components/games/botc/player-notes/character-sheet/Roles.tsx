import { BotCRole } from "../../../../../recoil/botc-atom";
import {
  tb,
  snv,
  bmr,
  dtb,
  swpm,
  other,
  BotCScript,
} from "../../../../../constants/botc";
import RoleSection, { RoleKey } from "./RoleSection";

interface RolesProps {
  isText: boolean;
  script: number;
  roleKey: RoleKey;
  updateRoles?: (role: BotCRole, selected: boolean) => () => void;
}
interface ActiveBotCScript {
  active: BotCScript;
  travelers: BotCRole[];
}

const Roles = ({ isText, script, roleKey, updateRoles }: RolesProps) => {
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
      scripts = { active: dtb, travelers: [...other.travelers] };
      break;
    case 4:
      scripts = { active: swpm, travelers: [...other.travelers] };
      break;
    case 5:
    default: // keep initial assignment
      isOtherScript = true;
  }

  let gridSize = 3;
  // if text version, then grid size should be 6, or 4 for other script
  isText && (gridSize = isOtherScript ? 4 : 6);
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
        updateRoles={updateRoles}
      />
      <RoleSection
        title="Outsiders"
        gridSize={gridSize}
        isText={isText}
        roleKey={roleKey}
        roles={scripts.active.outsiders}
        updateRoles={updateRoles}
      />
      <RoleSection
        title="Minions"
        gridSize={gridSize}
        isText={isText}
        roleKey={roleKey}
        roles={scripts.active.minions}
        updateRoles={updateRoles}
      />
      <RoleSection
        title="Demons"
        gridSize={gridSize}
        isText={isText}
        roleKey={roleKey}
        roles={scripts.active.demons}
        updateRoles={updateRoles}
      />
      {scripts.active.travelers.length > 0 && (
        <RoleSection
          title="Travelers"
          gridSize={gridSize}
          isText={isText}
          roleKey={roleKey}
          roles={scripts.active.travelers}
          updateRoles={updateRoles}
        />
      )}
      {scripts.travelers.length > 0 && (
        <RoleSection
          title="Other Travelers"
          gridSize={gridSize}
          isText={isText}
          roleKey={roleKey}
          roles={scripts.travelers}
          updateRoles={updateRoles}
        />
      )}
    </>
  );
};

export default Roles;
