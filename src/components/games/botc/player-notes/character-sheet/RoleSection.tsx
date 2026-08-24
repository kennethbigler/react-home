import type { CSSProperties } from "react";
import type { BotCRole } from "../../../../../jotai/botc-atom";
import type { MuiColors } from "../../../../common/types";
import { outlinedContrastSx } from "../../../../../apis/outlinedButtonSx";
import { Grid, Typography, Button } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { splitScriptColumns } from "../../botcHelpers";

export type RoleKey = Record<string, boolean>;

interface RoleSectionProps {
  gridSize: number;
  isText: boolean;
  roleKey: RoleKey;
  roles: BotCRole[];
  title: string;
  onRoleClick?: (role: BotCRole, selected: boolean) => () => void;
}

const BASE_BUTTON_STYLES: CSSProperties = {
  textTransform: "none",
  width: "100%",
  wordBreak: "break-word",
  paddingLeft: 0,
  paddingRight: 0,
  marginBottom: 1,
};

const COMPACT_BUTTON_STYLES: CSSProperties = {
  ...BASE_BUTTON_STYLES,
  fontSize: "0.7rem",
};

const EMPTY_COLUMNS: [BotCRole[], BotCRole[]] = [[], []];

const getRoleButtonSx = (
  buttonStyles: CSSProperties,
  selected: boolean,
  alignment: MuiColors,
): SxProps<Theme> =>
  selected
    ? buttonStyles
    : ([buttonStyles, outlinedContrastSx(alignment)] as SxProps<Theme>);

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
  const buttonStyles =
    isText && roles.length >= 18 ? COMPACT_BUTTON_STYLES : BASE_BUTTON_STYLES;
  const [leftColumn, rightColumn] =
    gridSize === 6 ? splitScriptColumns(roles) : EMPTY_COLUMNS;

  const renderRoleButton = (role: BotCRole) => {
    const selected = role.name in roleKey;
    return (
      <Grid key={role.name} size={12} sx={{ textAlign: "center" }}>
        <Button
          variant={selected ? "contained" : "outlined"}
          color={role.alignment}
          sx={getRoleButtonSx(buttonStyles, selected, role.alignment)}
          aria-label={role.name}
          // onRoleClick is curried: calling it during render returns the click handler
          onClick={onRoleClick && onRoleClick(role, selected)}
          title={role.name}
        >
          {isText ? role.name : role.icon}
        </Button>
      </Grid>
    );
  };

  return (
    <>
      <Grid size={12}>
        <hr aria-hidden />
        <Typography>{title}</Typography>
      </Grid>

      {gridSize === 6 ? (
        <>
          <Grid size={6}>{leftColumn.map(renderRoleButton)}</Grid>
          <Grid size={6}>{rightColumn.map(renderRoleButton)}</Grid>
        </>
      ) : (
        roles.map((role: BotCRole) => {
          const selected = role.name in roleKey;
          return (
            <Grid key={role.name} size={gridSize} sx={{ textAlign: "center" }}>
              <Button
                variant={selected ? "contained" : "outlined"}
                color={role.alignment}
                sx={getRoleButtonSx(buttonStyles, selected, role.alignment)}
                aria-label={role.name}
                onClick={onRoleClick && onRoleClick(role, selected)}
                title={role.name}
              >
                {isText ? role.name : role.icon}
              </Button>
            </Grid>
          );
        })
      )}
    </>
  );
};

export default RoleSection;
