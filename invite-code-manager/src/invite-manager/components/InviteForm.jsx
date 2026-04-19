import { useState } from "react";
import { styles } from "../styles/styles";

export function InviteForm({ initial, onSubmit, onCancel, loading }) {
  const [code, setCode] = useState(initial?.code ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);

  const handle = (e) => {
    e.preventDefault();
    onSubmit({
      code: code.trim(),
      description: description.trim() || null,
      isActive,
    });
  };

  return (
    <form onSubmit={handle} style={styles.form}>
      <label style={styles.label}>
        Code *
        <input
          style={styles.input}
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="e.g. LAUNCH2026"
          required
        />
      </label>
      <label style={styles.label}>
        Description
        <input
          style={styles.input}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional note..."
        />
      </label>
      <label style={{ ...styles.label, flexDirection: "row", alignItems: "center", gap: 10 }}>
        <span>Active</span>
        <div
          style={{ ...styles.toggle, background: isActive ? "var(--accent)" : "var(--muted)" }}
          onClick={() => setIsActive(!isActive)}
        >
          <div
            style={{
              ...styles.toggleThumb,
              transform: isActive ? "translateX(18px)" : "translateX(2px)",
            }}
          />
        </div>
      </label>
      <div style={styles.formActions}>
        <button type="button" style={styles.btnSecondary} onClick={onCancel}>Cancel</button>
        <button type="submit" style={styles.btnPrimary} disabled={loading}>
          {loading ? "Saving..." : initial ? "Save changes" : "Create code"}
        </button>
      </div>
    </form>
  );
}
