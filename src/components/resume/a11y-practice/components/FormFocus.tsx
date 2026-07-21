// The form has 3 steps, each with at least one input field
// There's a "Next" button to advance and a "Back" button to go to the previous step
// When the user advances to a new step, focus should be managed appropriately
// The current step should be communicated to screen reader users
// Keyboard navigation should work throughout
// When the form is submitted on the final step, show a success message and manage focus appropriately

import { useEffect, useRef, useState, type ChangeEvent } from "react";

// --------------------     Input     -------------------- //
interface InputProps {
  label: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}
const Input = ({ label, name, type, value, onChange }: InputProps) => (
  <div style={{ marginBottom: 10 }}>
    <label>
      {label}:&nbsp;
      <input
        type={type}
        name={name}
        required
        value={value}
        onChange={onChange}
      />
    </label>
  </div>
);

// --------------------     Page     -------------------- //
interface PageProps {
  input: InputOptions;
  index: number;
  numPages: number;
  defaultValue: string;
  incrIdx: (
    key: "first_name" | "last_name" | "pref_name",
    value: string,
  ) => void;
  decrIdx: () => void;
}

const Page = ({
  input,
  index,
  numPages,
  defaultValue,
  incrIdx,
  decrIdx,
}: PageProps) => {
  const headerRef = useRef<HTMLHeadingElement>(null);
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    headerRef.current?.focus();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setValue(e.target.value);

  const handleNext = () => {
    setValue("");
    incrIdx(input.key, value);
  };

  return (
    <div
      style={{
        width: 300,
        border: "1px solid orange",
        padding: 20,
        paddingTop: 0,
      }}
    >
      <h3 tabIndex={-1} ref={headerRef}>
        {`Step ${index + 1} of ${numPages}`}
      </h3>
      {/* Form Content */}
      <Input
        name={input.key}
        label={input.label}
        type={input.type}
        value={value}
        onChange={handleChange}
      />

      {/* Prev/Next UI */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {index !== 0 && <button onClick={decrIdx}>Previous</button>}
        <button onClick={handleNext}>
          {index === numPages - 1 ? "Submit" : "Next"}
        </button>
      </div>
    </div>
  );
};

// --------------------     Forms     -------------------- //
const SuccessPage = () => {
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    textRef.current?.focus();
  }, []);

  return (
    <p ref={textRef} tabIndex={-1}>
      Form complete, thank you!
    </p>
  );
};

interface InputOptions {
  label: string;
  type: string;
  key: "first_name" | "last_name" | "pref_name";
}

const inputs: InputOptions[] = [
  { label: "First Name", key: "first_name", type: "text" },
  { label: "Last Name", key: "last_name", type: "text" },
  { label: "Preferred Name", key: "pref_name", type: "text" },
];

const FormFocus = () => {
  const [idx, setIdx] = useState(0);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    pref_name: "",
  });

  const incrIdx = (
    key: "first_name" | "last_name" | "pref_name",
    value: string,
  ) => {
    setFormData((cur) => ({ ...cur, [key]: value }));
    setIdx((cur) => (cur === inputs.length + 1 ? cur : cur + 1));
  };
  const decrIdx = () => setIdx((cur) => (cur === 0 ? cur : cur - 1));

  const submit = (
    key: "first_name" | "last_name" | "pref_name",
    value: string,
  ) => {
    incrIdx(key, value);
    console.log(formData.first_name, formData.last_name, value);
  };

  return (
    <div>
      <h2>What is your name?</h2>
      {idx === inputs.length ? (
        <SuccessPage />
      ) : (
        <Page
          key={idx}
          index={idx}
          input={inputs[idx]}
          numPages={inputs.length}
          defaultValue={formData[inputs[idx].key]}
          incrIdx={idx === inputs.length - 1 ? submit : incrIdx}
          decrIdx={decrIdx}
        />
      )}
    </div>
  );
};

export default FormFocus;
