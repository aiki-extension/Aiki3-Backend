import { styles } from "../styles/styles";
import { Modal } from "./Modal";

export function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <Modal title="Confirm deletion" onClose={onCancel}>
      <p style={{ color: "var(--text-secondary)", padding: "0 0 20px" }}>{message}</p>
      <div style={styles.formActions}>
        <button style={styles.btnSecondary} onClick={onCancel}>Cancel</button>
        <button style={{ ...styles.btnPrimary, background: "var(--danger)" }} onClick={onConfirm}>
          Delete
        </button>
      </div>
    </Modal>
  );
}
