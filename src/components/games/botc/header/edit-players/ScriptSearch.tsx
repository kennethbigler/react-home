import { useState, useEffect } from "react";
import { Autocomplete, TextField } from "@mui/material";
import {
  loadAllScriptOptions,
  BASE_SCRIPT_OPTIONS,
  ScriptOption,
  CommunityScriptOption,
} from "../../../../../utils/botc-script-utils";
import { ActiveScript, BaseScriptIndex } from "../../../../../jotai/botc-atom";

interface ScriptSearchProps {
  script: ActiveScript;
  onBaseScriptChange: (index: BaseScriptIndex) => void;
  onCommunityChange: (option: CommunityScriptOption) => void;
}

/** Derive the currently-selected autocomplete value from state.
 *
 * For community scripts we construct the option directly from the stored script
 * data so the input shows the correct label even before the async options load
 * completes. */
const getSelectedOption = (
  script: ActiveScript,
  allOptions: ScriptOption[],
): ScriptOption | null => {
  if (script.type === "community") {
    // Prefer the loaded option (has the full list entry) but fall back to
    // synthesising one from the stored script so the label is never blank.
    const found = allOptions.find(
      (o) => o.type === "community" && o.pk === script.pk,
    ) as CommunityScriptOption | undefined;
    return (
      found ?? {
        type: "community",
        label: script.title,
        pk: script.pk,
        author: script.author,
        characters: script.characters,
      }
    );
  }
  return (
    (BASE_SCRIPT_OPTIONS.find((o) => o.index === script.index) as
      | ScriptOption
      | undefined) ?? null
  );
};

/** EditPlayers → ScriptSearch (replaces ScriptSelect) */
const ScriptSearch = ({
  script,
  onBaseScriptChange,
  onCommunityChange,
}: ScriptSearchProps) => {
  // Start with just the 4 base options; community scripts load asynchronously
  const [allOptions, setAllOptions] = useState<ScriptOption[]>([
    ...BASE_SCRIPT_OPTIONS,
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void loadAllScriptOptions().then((options) => {
      setAllOptions(options);
      setLoading(false);
    });
  }, []);

  const selectedOption = getSelectedOption(script, allOptions);

  const handleChange = (
    _: React.SyntheticEvent,
    value: ScriptOption | null,
  ) => {
    if (!value) return;
    if (value.type === "base") {
      onBaseScriptChange(value.index);
    } else {
      onCommunityChange(value);
    }
  };

  return (
    <Autocomplete<ScriptOption>
      options={allOptions}
      value={selectedOption}
      onChange={handleChange}
      loading={loading}
      groupBy={(option) =>
        option.type === "base" ? "Official Scripts" : "Community Scripts"
      }
      getOptionLabel={(option) =>
        option.type === "community"
          ? `${option.label} — ${option.author}`
          : option.label
      }
      isOptionEqualToValue={(option, value) => {
        if (option.type !== value.type) return false;
        if (option.type === "community" && value.type === "community")
          return option.pk === value.pk;
        if (option.type === "base" && value.type === "base")
          return option.index === value.index;
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
