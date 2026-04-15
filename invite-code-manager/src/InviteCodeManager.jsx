import { useState, useEffect, useCallback } from "react";

const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

// ── tiny helpers ──────────────────────────────────────────────────────────────
const apiFetch = async (path, options = {}, token) => {
  const hasBody = options.body !== undefined;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(hasBody ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw { status: res.status, message: data.message || "Error" };
  return data;
};

const fmt = (iso) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

// ── sub-components ────────────────────────────────────────────────────────────

function Toast({ toasts }) {
  return (
    <div style={styles.toastContainer}>
      {toasts.map((t) => (
        <div key={t.id} style={{ ...styles.toast, ...(t.type === "error" ? styles.toastError : styles.toastSuccess) }}>
          {t.msg}
        </div>
      ))}
    </div>
  );
}

function Badge({ active }) {
  return (
    <span style={{ ...styles.badge, ...(active ? styles.badgeActive : styles.badgeInactive) }}>
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <span style={styles.modalTitle}>{title}</span>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function InviteForm({ initial, onSubmit, onCancel, loading }) {
  const [code, setCode] = useState(initial?.code ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);

  const handle = (e) => {
    e.preventDefault();
    onSubmit({ code: code.trim(), description: description.trim() || null, isActive });
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
          placeholder="Optional note…"
        />
      </label>
      <label style={{ ...styles.label, flexDirection: "row", alignItems: "center", gap: 10 }}>
        <span>Active</span>
        <div
          style={{ ...styles.toggle, background: isActive ? "var(--accent)" : "var(--muted)" }}
          onClick={() => setIsActive(!isActive)}
        >
          <div style={{ ...styles.toggleThumb, transform: isActive ? "translateX(18px)" : "translateX(2px)" }} />
        </div>
      </label>
      <div style={styles.formActions}>
        <button type="button" style={styles.btnSecondary} onClick={onCancel}>Cancel</button>
        <button type="submit" style={styles.btnPrimary} disabled={loading}>
          {loading ? "Saving…" : initial ? "Save changes" : "Create code"}
        </button>
      </div>
    </form>
  );
}

function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <Modal title="Confirm deletion" onClose={onCancel}>
      <p style={{ color: "var(--text-secondary)", padding: "0 0 20px" }}>{message}</p>
      <div style={styles.formActions}>
        <button style={styles.btnSecondary} onClick={onCancel}>Cancel</button>
        <button style={{ ...styles.btnPrimary, background: "var(--danger)" }} onClick={onConfirm}>Delete</button>
      </div>
    </Modal>
  );
}

// ── Login screen ──────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      onLogin(data.token);
    } catch (err) {
      setError(err.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.loginWrapper}>
      <div style={styles.loginCard}>
        <div style={styles.loginLogo}>
          <div style={styles.logoMark} />
          <span style={styles.logoText}>Invite Manager</span>
        </div>
        <p style={styles.loginSub}>Sign in to manage invite codes</p>
        <form onSubmit={handle} style={styles.form}>
          <label style={styles.label}>
            Email
            <input
              style={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </label>
          <label style={styles.label}>
            Password
            <input
              style={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {error && <p style={styles.errorMsg}>{error}</p>}
          <button type="submit" style={{ ...styles.btnPrimary, width: "100%", marginTop: 8 }} disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Main app ──────────────────────────────────────────────────────────────────
export default function App() {
  const [token, setToken] = useState(() => sessionStorage.getItem("inv_token") ?? "");
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(null); // null | "create" | { type:"edit", item } | { type:"delete", item }
  const [saving, setSaving] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [search, setSearch] = useState("");

  const toast = useCallback((msg, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await apiFetch("/api/invite-codes", {}, token);
      setCodes(data);
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }, [token, toast]);

  useEffect(() => { load(); }, [load]);

  const handleLogin = (tok) => {
    sessionStorage.setItem("inv_token", tok);
    setToken(tok);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("inv_token");
    setToken("");
    setCodes([]);
  };

  const handleCreate = async (body) => {
    setSaving(true);
    try {
      const created = await apiFetch("/api/invite-codes", { method: "POST", body: JSON.stringify(body) }, token);
      setCodes((prev) => [created, ...prev]);
      setModal(null);
      toast("Invite code created");
    } catch (err) {
      toast(err.status === 409 ? "Code already exists" : err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (body) => {
    const id = modal.item.id;
    setSaving(true);
    try {
      const updated = await apiFetch(`/api/invite-codes/${id}`, { method: "PATCH", body: JSON.stringify(body) }, token);
      setCodes((prev) => prev.map((c) => (c.id === id ? updated : c)));
      setModal(null);
      toast("Invite code updated");
    } catch (err) {
      toast(err.status === 409 ? "Code already exists" : err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const id = modal.item.id;
    setSaving(true);
    try {
      await apiFetch(`/api/invite-codes/${id}`, { method: "DELETE" }, token);
      setCodes((prev) => prev.filter((c) => c.id !== id));
      setModal(null);
      toast("Invite code deleted");
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  if (!token) return <LoginScreen onLogin={handleLogin} />;

  const filtered = codes.filter(
    (c) =>
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      (c.description ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.root}>
      <Toast toasts={toasts} />

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.logoMark} />
          <span style={styles.headerTitle}>Invite Manager</span>
        </div>
        <div style={styles.headerRight}>
          <span style={styles.codesCount}>{codes.length} codes</span>
          <button style={styles.btnGhost} onClick={handleLogout}>Sign out</button>
        </div>
      </header>

      {/* Toolbar */}
      <div style={styles.toolbar}>
        <input
          style={{ ...styles.input, maxWidth: 280, margin: 0 }}
          placeholder="Search codes…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button style={styles.btnPrimary} onClick={() => setModal("create")}>+ New code</button>
      </div>

      {/* Table */}
      <div style={styles.tableWrapper}>
        {loading ? (
          <div style={styles.emptyState}>Loading…</div>
        ) : filtered.length === 0 ? (
          <div style={styles.emptyState}>
            {search ? "No codes match your search." : "No invite codes yet. Create one!"}
          </div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                {["Code", "Description", "Status", "Signed-up users", "Created", "Actions"].map((h) => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={c.id} style={{ ...styles.tr, animationDelay: `${i * 30}ms` }}>
                  <td style={styles.td}>
                    <span style={styles.codeChip}>{c.code}</span>
                  </td>
                  <td style={{ ...styles.td, color: "var(--text-secondary)", maxWidth: 220 }}>
                    {c.description ?? <span style={{ opacity: 0.35 }}>—</span>}
                  </td>
                  <td style={styles.td}><Badge active={c.isActive} /></td>
                  <td style={{ ...styles.td, textAlign: "center" }}>
                    <span style={styles.userCount}>{c.signedUpUsersCount}</span>
                  </td>
                  <td style={{ ...styles.td, color: "var(--text-secondary)", whiteSpace: "nowrap" }}>
                    {fmt(c.createdAt)}
                  </td>
                  <td style={styles.td}>
                    <div style={styles.actions}>
                      <button
                        style={styles.btnAction}
                        onClick={() => setModal({ type: "edit", item: c })}
                        title="Edit"
                      >Edit</button>
                      <button
                        style={{ ...styles.btnAction, color: "var(--danger)" }}
                        onClick={() => setModal({ type: "delete", item: c })}
                        title="Delete"
                      >Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modals */}
      {modal === "create" && (
        <Modal title="New invite code" onClose={() => setModal(null)}>
          <InviteForm onSubmit={handleCreate} onCancel={() => setModal(null)} loading={saving} />
        </Modal>
      )}
      {modal?.type === "edit" && (
        <Modal title="Edit invite code" onClose={() => setModal(null)}>
          <InviteForm initial={modal.item} onSubmit={handleEdit} onCancel={() => setModal(null)} loading={saving} />
        </Modal>
      )}
      {modal?.type === "delete" && (
        <ConfirmDialog
          message={`Are you sure you want to delete "${modal.item.code}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setModal(null)}
        />
      )}
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = {
  root: {
    "--bg": "#0d0f14",
    "--surface": "#161921",
    "--border": "#252934",
    "--accent": "#4f8ef7",
    "--accent-dim": "#1e2d4d",
    "--text": "#e8eaf0",
    "--text-secondary": "#7a8099",
    "--muted": "#2d3040",
    "--success": "#2eb87a",
    "--danger": "#e05c5c",
    minHeight: "100vh",
    background: "var(--bg)",
    color: "var(--text)",
    fontFamily: "'DM Mono', 'Fira Mono', 'Courier New', monospace",
    fontSize: 14,
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 32px",
    borderBottom: "1px solid var(--border)",
    background: "var(--surface)",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  headerLeft: { display: "flex", alignItems: "center", gap: 12 },
  headerRight: { display: "flex", alignItems: "center", gap: 16 },
  headerTitle: { fontWeight: 700, fontSize: 16, letterSpacing: "0.02em" },
  logoMark: {
    width: 28,
    height: 28,
    borderRadius: 6,
    background: "linear-gradient(135deg, #4f8ef7, #9b6df7)",
    flexShrink: 0,
  },
  codesCount: { color: "var(--text-secondary)", fontSize: 13 },

  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: "20px 32px",
  },

  tableWrapper: {
    padding: "0 32px 40px",
    overflowX: "auto",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    textAlign: "left",
    padding: "10px 14px",
    color: "var(--text-secondary)",
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    borderBottom: "1px solid var(--border)",
    whiteSpace: "nowrap",
  },
  tr: {
    borderBottom: "1px solid var(--border)",
    transition: "background 0.15s",
  },
  td: { padding: "13px 14px", verticalAlign: "middle" },

  codeChip: {
    background: "var(--accent-dim)",
    color: "var(--accent)",
    borderRadius: 4,
    padding: "3px 8px",
    fontWeight: 700,
    fontSize: 12,
    letterSpacing: "0.05em",
  },
  badge: {
    display: "inline-block",
    borderRadius: 99,
    padding: "3px 10px",
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.04em",
  },
  badgeActive: { background: "rgba(46,184,122,0.15)", color: "var(--success)" },
  badgeInactive: { background: "rgba(122,128,153,0.12)", color: "var(--text-secondary)" },
  userCount: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 28,
    height: 24,
    borderRadius: 4,
    background: "var(--muted)",
    color: "var(--text)",
    fontWeight: 600,
    fontSize: 13,
    padding: "0 8px",
  },
  actions: { display: "flex", gap: 6 },
  btnAction: {
    background: "none",
    border: "1px solid var(--border)",
    borderRadius: 5,
    color: "var(--text-secondary)",
    padding: "4px 10px",
    cursor: "pointer",
    fontSize: 12,
    fontFamily: "inherit",
    transition: "color 0.15s, border-color 0.15s",
  },

  emptyState: {
    textAlign: "center",
    padding: "60px 0",
    color: "var(--text-secondary)",
  },

  // Forms
  form: { display: "flex", flexDirection: "column", gap: 16 },
  label: { display: "flex", flexDirection: "column", gap: 6, fontSize: 13, color: "var(--text-secondary)" },
  input: {
    background: "var(--bg)",
    border: "1px solid var(--border)",
    borderRadius: 6,
    color: "var(--text)",
    fontFamily: "inherit",
    fontSize: 14,
    padding: "9px 12px",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    transition: "border-color 0.15s",
  },
  formActions: { display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 4 },
  errorMsg: { color: "var(--danger)", fontSize: 13, margin: 0 },

  // Toggle
  toggle: {
    width: 38,
    height: 22,
    borderRadius: 99,
    cursor: "pointer",
    position: "relative",
    flexShrink: 0,
    transition: "background 0.2s",
  },
  toggleThumb: {
    position: "absolute",
    top: 2,
    width: 18,
    height: 18,
    borderRadius: "50%",
    background: "#fff",
    transition: "transform 0.2s",
  },

  // Buttons
  btnPrimary: {
    background: "var(--accent)",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    padding: "9px 18px",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: 13,
    fontWeight: 600,
    whiteSpace: "nowrap",
    transition: "opacity 0.15s",
  },
  btnSecondary: {
    background: "none",
    border: "1px solid var(--border)",
    borderRadius: 6,
    color: "var(--text-secondary)",
    padding: "9px 18px",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: 13,
    transition: "color 0.15s",
  },
  btnGhost: {
    background: "none",
    border: "none",
    color: "var(--text-secondary)",
    cursor: "pointer",
    fontSize: 13,
    fontFamily: "inherit",
    padding: "4px 8px",
  },

  // Modal
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
  modal: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 10,
    padding: 28,
    width: "100%",
    maxWidth: 440,
    boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
  },
  modalHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  modalTitle: { fontWeight: 700, fontSize: 16 },
  closeBtn: {
    background: "none",
    border: "none",
    color: "var(--text-secondary)",
    cursor: "pointer",
    fontSize: 16,
    padding: 4,
    lineHeight: 1,
    fontFamily: "inherit",
  },

  // Login
  loginWrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "var(--bg)",
  },
  loginCard: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    padding: 36,
    width: "100%",
    maxWidth: 380,
    boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
  },
  loginLogo: { display: "flex", alignItems: "center", gap: 12, marginBottom: 6 },
  logoText: { fontWeight: 700, fontSize: 17 },
  loginSub: { color: "var(--text-secondary)", margin: "0 0 24px", fontSize: 13 },

  // Toasts
  toastContainer: {
    position: "fixed",
    bottom: 24,
    right: 24,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    zIndex: 200,
  },
  toast: {
    padding: "12px 18px",
    borderRadius: 7,
    fontSize: 13,
    fontWeight: 600,
    boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
    animation: "fadeIn 0.2s ease",
  },
  toastSuccess: { background: "#1a3a2a", color: "var(--success)", border: "1px solid rgba(46,184,122,0.3)" },
  toastError: { background: "#3a1a1a", color: "var(--danger)", border: "1px solid rgba(224,92,92,0.3)" },
};
