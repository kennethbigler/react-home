import { useMemo } from "react";
import { Autocomplete, TextField } from "@mui/material";
import {
  getAllScriptOptions,
  BUILTIN_SCRIPT_OPTIONS,
  ScriptOption,
  CommunityScriptOption,
} from "../../../../../utils/botc-script-utils";
import { CustomScript } from "../../../../../jotai/botc-atom";

interface ScriptSearchProps {
  script: number;
  customScript: CustomScript | null;
  onBuiltinChange: (scriptIndex: number) => void;
  onCommunityChange: (option: CommunityScriptOption) => void;
}

/** Derive the currently-selected autocomplete value from state */
const getSelectedOption = (
  script: number,
  customScript: CustomScript | null,
  allOptions: ScriptOption[],
): ScriptOption | null => {
  if (script === 5 && customScript !== null) {
    return (
      (allOptions.find(
        (o) => o.type === "community" && o.pk === customScript.pk,
      ) as CommunityScriptOption | undefined) ?? null
    );
  }
  return (
    (BUILTIN_SCRIPT_OPTIONS.find((o) => o.scriptIndex === script) as
      | ScriptOption
      | undefined) ?? null
  );
};

/** EditPlayers → ScriptSearch (replaces ScriptSelect) */
const ScriptSearch = ({
  script,
  customScript,
  onBuiltinChange,
  onCommunityChange,
}: ScriptSearchProps) => {
  const allOptions = useMemo(() => getAllScriptOptions(), []);
  const selectedOption = getSelectedOption(script, customScript, allOptions);

  const handleChange = (
    _: React.SyntheticEvent,
    value: ScriptOption | null,
  ) => {
    if (!value) return;
    if (value.type === "builtin") {
      onBuiltinChange(value.scriptIndex);
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
        return option.scriptIndex === value.scriptIndex;
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
          key={option.type === "community" ? option.pk : option.scriptIndex}
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
