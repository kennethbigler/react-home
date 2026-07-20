import {
  useState,
  type KeyboardEvent,
  type ChangeEvent,
  type MouseEvent,
  type FocusEvent,
  type CSSProperties,
  useRef,
  useEffect,
} from "react";

const getId = (str: string) => str.replace(/\s+/g, "").toLowerCase();

const srOnly: CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0,
};

const optionStyle: CSSProperties = {
  cursor: "pointer",
  border: "1px solid orange",
  width: 300,
  padding: 10,
};

const popupId = "popup-id";

// --------------------     Component     -------------------- //
interface ComboboxProps {
  options: string[];
}
const Combobox = ({ options }: ComboboxProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [selectedId, setSelectedId] = useState<undefined | string>(undefined);
  const [focusedId, setFocusedId] = useState<undefined | string>(undefined);
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const filteredOptions = options.filter((str) =>
    getId(str).includes(getId(text)),
  );

  const handleClose = () => {
    setOpen(false);
    setFocusedId(undefined);
  };

  const onSelect = (opt: string) => {
    setSelectedId(getId(opt));
    setText(opt);
    handleClose();
  };

  // --------------------     input handlers     -------------------- //
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setText(newText);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      const count = options.filter((str) =>
        getId(str).includes(getId(newText)),
      ).length;
      const message = `${count} of ${options.length} options available`;
      setAnnouncement("");
      setTimeout(() => setAnnouncement(message), 100);
    }, 500);
  };
  const handleFocus = (_e: FocusEvent<HTMLInputElement>) => setOpen(true);
  const handleBlur = (_e: FocusEvent<HTMLInputElement>) => handleClose();
  const handleComboKeyboard = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
        debounceTimer.current = null;
        setAnnouncement("");
      }
      if (!open) {
        // if closed, do nothing
        return;
      } else if (!focusedId || focusedId === getId(filteredOptions[0])) {
        setFocusedId(undefined);
        // if at the beginning, focus the input
        inputRef.current?.focus();
        return;
      } else {
        // find current index
        const currIdx = filteredOptions.findIndex(
          (opt) => getId(opt) === focusedId,
        );
        // send focus to previous element
        setFocusedId(getId(filteredOptions[currIdx - 1]));
        return;
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
        debounceTimer.current = null;
        setAnnouncement("");
      }
      if (!open) {
        setOpen(true);
        // send focus to first element
        if (filteredOptions.length > 0) {
          setFocusedId(getId(filteredOptions[0]));
        }
        return;
      } else if (filteredOptions.length === 0) {
        return;
      } else if (
        focusedId === getId(filteredOptions[filteredOptions.length - 1])
      ) {
        setFocusedId(undefined);
        // if at the end, focus the input
        inputRef.current?.focus();
        return;
      } else {
        // find current index
        const currIdx = filteredOptions.findIndex(
          (opt) => getId(opt) === focusedId,
        );
        // send focus to next element
        setFocusedId(getId(filteredOptions[currIdx + 1]));
        return;
      }
    } else if (e.key === "Home") {
      if (!open) {
        return;
      }
      e.preventDefault();
      if (filteredOptions.length > 0) {
        setFocusedId(getId(filteredOptions[0]));
        return;
      } else {
        setFocusedId(undefined);
        // if at the end, focus the input
        inputRef.current?.focus();
        return;
      }
      return;
    } else if (e.key === "End") {
      if (!open) {
        return;
      }
      e.preventDefault();
      if (filteredOptions.length > 0) {
        setFocusedId(getId(filteredOptions[filteredOptions.length - 1]));
        return;
      } else {
        setFocusedId(undefined);
        // if at the end, focus the input
        inputRef.current?.focus();
        return;
      }
      return;
    } else if (e.key === "Escape") {
      e.preventDefault();
      if (open) {
        handleClose();
        return;
      } else {
        setText("");
        return;
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      // find current index
      const currIdx = filteredOptions.findIndex(
        (opt) => getId(opt) === focusedId,
      );
      if (currIdx >= 0) {
        onSelect(filteredOptions[currIdx]);
      }
    }
  };

  // --------------------     option handlers     -------------------- //
  const handleSelect = (opt: string) => (e: MouseEvent<HTMLLIElement>) => {
    e.preventDefault();
    onSelect(opt);
  };

  // --------------------     render     -------------------- //
  return (
    <div>
      <label>
        Select a city:&nbsp;
        <input
          ref={inputRef}
          value={text}
          role="combobox"
          aria-expanded={open}
          aria-controls={open ? popupId : undefined}
          aria-activedescendant={!open ? undefined : focusedId}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleComboKeyboard}
        />
      </label>
      <span style={srOnly} role="status" aria-atomic="true">
        {announcement}
      </span>
      {open && (
        <ul role="listbox" id={popupId}>
          {filteredOptions.map((opt) => {
            const id = getId(opt);
            return (
              <li
                role="option"
                aria-selected={selectedId === id}
                id={id}
                key={id}
                onMouseDown={handleSelect(opt)}
                style={{
                  ...optionStyle,
                  listStyle: focusedId === id ? "inherit" : "none",
                }}
              >
                {selectedId !== id ? opt : `--- ${opt} ---`}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

// --------------------     Wrapper     -------------------- //

const cities = [
  "San Francisco",
  "San Diego",
  "Santa Fe",
  "Berkeley",
  "Oakland",
  "Fresno",
  "Sacramento",
  "Napa",
  "Sonoma",
  "Marin",
  "Mountain View",
  "Los Altos",
  "Monterey",
];

const App = () => <Combobox options={cities} />;

export default App;
