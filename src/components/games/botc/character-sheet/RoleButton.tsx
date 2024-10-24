import Button from "@mui/material/Button";
import { BotCRole } from "../../../../recoil/botc-atom";

interface RoleButtonProps {
  isText: boolean;
  role: BotCRole;
  selected: boolean;
  updateRoles?: (role: BotCRole, selected: boolean) => () => void;
}

const RoleButton = ({
  role,
  selected,
  updateRoles,
  isText,
}: RoleButtonProps) => (
  <Button
    variant={selected ? "contained" : "outlined"}
    color={role.alignment}
    sx={{ textTransform: "none", width: "100%" }}
    onClick={updateRoles && updateRoles(role, selected)}
    title={role.name}
  >
    {isText ? role.name : role.icon}
  </Button>
);

export default RoleButton;
