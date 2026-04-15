import { styles } from "../styles/styles";

export function Toast({ toasts }) {
  return (
    <div style={styles.toastContainer}>
      {toasts.map((t) => (
        <div
          key={t.id}
          style={{
            ...styles.toast,
            ...(t.type === "error" ? styles.toastError : styles.toastSuccess),
          }}
        >
          {t.msg}
        </div>
      ))}
    </div>
  );
}
