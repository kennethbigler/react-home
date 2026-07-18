import { useEffect, useRef, useState, type CSSProperties } from "react";

const modalStyles: CSSProperties = {
  background: "white",
  padding: 32,
  width: 400,
  color: "black",
};

interface ModalProps {
  onClose: () => void;
}
const Modal = ({ onClose }: ModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  const handleDelete = () => {
    console.log("Successfully deleted");
    onClose();
  };
  const handleEscape = (e: React.KeyboardEvent<HTMLDialogElement>) => {
    e.preventDefault();
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      style={modalStyles}
      aria-labelledby="delete-modal-heading"
      onCancel={handleEscape}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h3 id="delete-modal-heading">Delete Account</h3>
        <button onClick={onClose} aria-label="close">
          X
        </button>
      </div>
      <p>
        Are you sure you want to delete your account? This action cannot be
        undone.
      </p>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={onClose}>Cancel</button>
        <button style={{ color: "red" }} onClick={handleDelete}>
          Delete
        </button>
      </div>
    </dialog>
  );
};

const App = () => {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    queueMicrotask(() => triggerRef.current?.focus());
  };

  return (
    <div>
      <h2>Account Settings</h2>
      <button onClick={handleOpen} ref={triggerRef}>
        Delete Account
      </button>
      {open && <Modal onClose={handleClose} />}
    </div>
  );
};

export default App;
