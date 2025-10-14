import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { BotCRole } from "../../../../../jotai/botc-atom";

export interface RoleKey {
  [key: string]: boolean;
}

interface RoleSectionProps {
  gridSize: number;
  isText: boolean;
  roleKey: RoleKey;
  roles: BotCRole[];
  title: string;
  onRoleClick?: (role: BotCRole, selected: boolean) => () => void;
}

const staticButtonStyles: React.CSSProperties = {
  textTransform: "none",
  width: "100%",
  wordBreak: "break-word",
  paddingLeft: 0,
  paddingRight: 0,
};

/** CharacterSheet -> EmojiNotes
 *                 -> Roles -> RoleSelection */
const RoleSection = ({
  gridSize,
  isText,
  roleKey,
  roles,
  title,
  onRoleClick,
}: RoleSectionProps) => {
  const buttonStyles = { ...staticButtonStyles };
  if (isText && roles.length >= 18) {
    buttonStyles.fontSize = "0.7rem";
  } else {
    delete buttonStyles.fontSize;
  }

  return (
    <>
      <Grid size={12}>
        <hr aria-hidden />
        <Typography>{title}</Typography>
      </Grid>

      {roles.map((role: BotCRole) => {
        const selected = role.name in roleKey;
        return (
          <Grid key={role.name} size={gridSize} sx={{ textAlign: "center" }}>
            <Button
              variant={selected ? "contained" : "outlined"}
              color={role.alignment}
              sx={buttonStyles}
              onClick={onRoleClick && onRoleClick(role, selected)}
              title={role.name}
            >
              {isText ? role.name : role.icon}
            </Button>
          </Grid>
        );
      })}
    </>
  );
};

export default RoleSection;
