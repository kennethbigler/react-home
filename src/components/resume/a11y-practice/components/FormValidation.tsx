import { ChangeEvent, SubmitEvent, useEffect, useRef, useState } from "react";

const validate = (name: string, value: string) => {
  if (!value) return "This field is required";
  if (name === "email" && !value.includes("@")) return "Invalid email address";
  if (name === "password" && value.length < 8)
    return "Password must be at least 8 characters";
  return null;
};

interface FieldType {
  name: string;
  label: string;
  type?: HTMLInputElement["type"];
}

interface FieldProps extends FieldType {
  value: string;
  error: string | null;
  onBlur: () => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}
const Field = ({
  name,
  label,
  value,
  error,
  onBlur,
  onChange,
  type = "text",
}: FieldProps) => (
  <div style={{ marginBottom: 16 }}>
    <label htmlFor={`${name}-input`}>{label}</label>
    <input
      id={`${name}-input`}
      type={type}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      style={{ border: error ? "2px solid red" : "1px solid gray" }}
      aria-invalid={error !== null}
      required
      aria-describedby={error ? `${name}-error-msg` : undefined}
    />
    {error && (
      <div style={{ color: "red", fontSize: 12 }} id={`${name}-error-msg`}>
        {`Error: ${error}`}
      </div>
    )}
  </div>
);

interface ErrorMessageProps {
  errors: Record<FieldName, string | null>;
}
const ErrorMessage = ({ errors }: ErrorMessageProps) => {
  const parRef = useRef<HTMLParagraphElement>(null);

  const errorSummary = Object.keys(errors).reduce(
    (acc, key) => acc + (errors[key] ? `${key}: ${errors[key]}\n` : ""),
    "",
  );
  const errorMessage = `Errors:\n${errorSummary}`;

  useEffect(() => {
    const timer = setTimeout(() => {
      parRef.current?.focus();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <p
      role="status"
      aria-atomic="true"
      style={{ whiteSpace: "pre-line" }}
      ref={parRef}
      tabIndex={-1}
    >
      {errorMessage}
    </p>
  );
};

const fields: FieldType[] = [
  { name: "username", label: "Username" },
  { name: "email", label: "Email", type: "email" },
  { name: "password", label: "Password", type: "password" },
] as const;
type FieldName = (typeof fields)[number]["name"];

const App = () => {
  const [values, setValues] = useState<Record<FieldName, string>>(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {}),
  );
  const [errors, setErrors] = useState<Record<FieldName, string | null>>(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: null }), {}),
  );
  const [showErrSumary, setShowErrSummary] = useState(false);

  const handleBlur = (name: FieldName) => () => {
    setShowErrSummary(false);
    setErrors((cur) => ({ ...cur, [name]: validate(name, values[name]) }));
  };

  const handleChange =
    (name: FieldName) => (e: ChangeEvent<HTMLInputElement>) => {
      setShowErrSummary(false);
      setValues((cur) => ({ ...cur, [name]: e.target.value }));
    };

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    let hasError = false;
    fields.forEach(({ name }) => {
      const err = validate(name, values[name]);
      setErrors((cur) => ({ ...cur, [name]: err }));
      if (err !== null) {
        hasError = true;
      }
    });
    if (!hasError) {
      setShowErrSummary(false);
      console.log(Object.keys(values).map((key) => `${key}: ${values[key]}`));
    } else {
      setShowErrSummary(true);
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit}>
      <h2>Create Account</h2>
      {showErrSumary && <ErrorMessage errors={errors} />}
      {fields.map(({ name, label, type }) => (
        <Field
          key={name}
          name={name}
          label={label}
          type={type}
          value={values[name]}
          error={errors[name]}
          onBlur={handleBlur(name)}
          onChange={handleChange(name)}
        />
      ))}
      <button type="submit">Create Account</button>
    </form>
  );
};

export default App;
