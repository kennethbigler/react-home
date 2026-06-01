import { useMemo } from "react";
import { BotCRole } from "../../../../../jotai/botc-atom";
import { Grid, Typography, Button } from "@mui/material";

export type RoleKey = Record<string, boolean>;

interface RoleSectionProps {
  gridSize: number;
  isText: boolean;
  roleKey: RoleKey;
  roles: BotCRole[];
  title: string;
  onRoleClick?: (role: BotCRole, selected: boolean) => () => void;
}

const BASE_BUTTON_STYLES: React.CSSProperties = {
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
  const buttonStyles = useMemo<React.CSSProperties>(
    () =>
      isText && roles.length >= 18
        ? { ...BASE_BUTTON_STYLES, fontSize: "0.7rem" }
        : BASE_BUTTON_STYLES,
    [isText, roles.length],
  );

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
              // onRoleClick is curried: calling it during render returns the click handler
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
