import { Badge } from "./Badge";
import { styles } from "../styles/styles";
import { formatInviteCodeDate } from "../utils/date";

export function InviteCodeTable({ loading, filteredCodes, search, onEdit, onDelete }) {
  const columns = [
    { label: "Code", align: "center" },
    { label: "Description", align: "center" },
    { label: "Status", align: "center" },
    { label: "Users", align: "center" },
    { label: "Created", align: "center" },
    { label: "Actions", align: "center" },
  ];

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
          {columns.map((column) => (
            <th key={column.label} style={{ ...styles.th, textAlign: column.align }}>{column.label}</th>
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
            <td style={{ ...styles.td, textAlign: "center" }}>
              <Badge active={code.isActive} />
            </td>
            <td style={{ ...styles.td, textAlign: "center" }}>
              <span style={styles.userCount}>{code.signedUpUsersCount}</span>
            </td>
            <td style={{ ...styles.td, color: "var(--text-secondary)", whiteSpace: "nowrap", textAlign: "center" }}>
              {formatInviteCodeDate(code.createdAt)}
            </td>
            <td style={{ ...styles.td, textAlign: "center" }}>
              <div style={{ ...styles.actions, justifyContent: "center" }}>
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
