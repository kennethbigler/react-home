import { useMemo } from "react";
import { Autocomplete, TextField } from "@mui/material";
import {
  getAllScriptOptions,
  BUILTIN_SCRIPT_OPTIONS,
  ScriptOption,
  CommunityScriptOption,
} from "../../../../../utils/botc-script-utils";
import { ActiveScript } from "../../../../../jotai/botc-atom";

interface ScriptSearchProps {
  activeScript: ActiveScript;
  onBuiltinChange: (
    index: import("../../../../../jotai/botc-atom").BuiltinScriptIndex,
  ) => void;
  onCommunityChange: (option: CommunityScriptOption) => void;
}

/** Derive the currently-selected autocomplete value from state */
const getSelectedOption = (
  activeScript: ActiveScript,
  allOptions: ScriptOption[],
): ScriptOption | null => {
  if (activeScript.type === "community") {
    return (
      (allOptions.find(
        (o) => o.type === "community" && o.pk === activeScript.pk,
      ) as CommunityScriptOption | undefined) ?? null
    );
  }
  return (
    (BUILTIN_SCRIPT_OPTIONS.find((o) => o.index === activeScript.index) as
      | ScriptOption
      | undefined) ?? null
  );
};

/** EditPlayers → ScriptSearch (replaces ScriptSelect) */
const ScriptSearch = ({
  activeScript,
  onBuiltinChange,
  onCommunityChange,
}: ScriptSearchProps) => {
  const allOptions = useMemo(() => getAllScriptOptions(), []);
  const selectedOption = getSelectedOption(activeScript, allOptions);

  const handleChange = (
    _: React.SyntheticEvent,
    value: ScriptOption | null,
  ) => {
    if (!value) return;
    if (value.type === "builtin") {
      onBuiltinChange(value.index);
    } else {
      onCommunityChange(value);
    }
  };

  return (
    <Autocomplete<ScriptOption>
      options={allOptions}
      value={selectedOption}
      onChange={handleChange}
      groupBy={(option) =>
        option.type === "builtin" ? "Official Scripts" : "Community Scripts"
      }
      getOptionLabel={(option) =>
        option.type === "community"
          ? `${option.label} — ${option.author}`
          : option.label
      }
      isOptionEqualToValue={(option, value) => {
        if (option.type !== value.type) return false;
        if (option.type === "community" && value.type === "community") {
          return option.pk === value.pk;
        }
        if (option.type === "builtin" && value.type === "builtin") {
          return option.index === value.index;
        }
        return false;
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Script"
          size="small"
          sx={{ marginTop: "5px", marginRight: "10px" }}
        />
      )}
      renderOption={(props, option) => (
        <li
          {...props}
          key={option.type === "community" ? option.pk : option.index}
        >
          <span>
            <strong>{option.label}</strong>
            {option.type === "community" && (
              <span style={{ color: "text.secondary", fontSize: "0.85em" }}>
                {" "}
                — {option.author}
              </span>
            )}
          </span>
        </li>
      )}
      fullWidth
      size="small"
    />
  );
};

export default ScriptSearch;
