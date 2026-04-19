import { styles } from "../styles/styles";

export function Badge({ active }) {
  return (
    <span style={{ ...styles.badge, ...(active ? styles.badgeActive : styles.badgeInactive) }}>
      {active ? "Active" : "Inactive"}
    </span>
  );
}
