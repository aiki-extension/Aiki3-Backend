import { Badge } from "./Badge";
import { styles } from "../styles/styles";
import { formatInviteCodeDate } from "../utils/date";

export function InviteCodeTable({ loading, filteredCodes, search, onEdit, onDelete }) {
  if (loading) {
    return <div style={styles.emptyState}>Loading...</div>;
  }

  if (filteredCodes.length === 0) {
    return (
      <div style={styles.emptyState}>
        {search ? "No codes match your search." : "No invite codes yet. Create one!"}
      </div>
    );
  }

  return (
    <table style={styles.table}>
      <thead>
        <tr>
          {["Code", "Description", "Status", "Signed-up users", "Created", "Actions"].map((heading) => (
            <th key={heading} style={styles.th}>{heading}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {filteredCodes.map((code, index) => (
          <tr key={code.id} style={{ ...styles.tr, animationDelay: `${index * 30}ms` }}>
            <td style={styles.td}>
              <span style={styles.codeChip}>{code.code}</span>
            </td>
            <td style={{ ...styles.td, color: "var(--text-secondary)", maxWidth: 220 }}>
              {code.description ?? <span style={{ opacity: 0.35 }}>-</span>}
            </td>
            <td style={styles.td}>
              <Badge active={code.isActive} />
            </td>
            <td style={{ ...styles.td, textAlign: "center" }}>
              <span style={styles.userCount}>{code.signedUpUsersCount}</span>
            </td>
            <td style={{ ...styles.td, color: "var(--text-secondary)", whiteSpace: "nowrap" }}>
              {formatInviteCodeDate(code.createdAt)}
            </td>
            <td style={styles.td}>
              <div style={styles.actions}>
                <button style={styles.btnAction} onClick={() => onEdit(code)} title="Edit">Edit</button>
                <button
                  style={{ ...styles.btnAction, color: "var(--danger)" }}
                  onClick={() => onDelete(code)}
                  title="Delete"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
