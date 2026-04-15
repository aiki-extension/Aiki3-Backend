import { useCallback, useMemo, useState } from "react";
import { login } from "./invite-manager/api/auth";
import { ConfirmDialog } from "./invite-manager/components/ConfirmDialog";
import { InviteCodeTable } from "./invite-manager/components/InviteCodeTable";
import { InviteForm } from "./invite-manager/components/InviteForm";
import { LoginScreen } from "./invite-manager/components/LoginScreen";
import { Modal } from "./invite-manager/components/Modal";
import { Toast } from "./invite-manager/components/Toast";
import { useInviteCodes } from "./invite-manager/hooks/useInviteCodes";
import { useToasts } from "./invite-manager/hooks/useToasts";
import { styles } from "./invite-manager/styles/styles";

export default function InviteCodeManager() {
  const [token, setToken] = useState(() => sessionStorage.getItem("inv_token") ?? "");
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState("");
  const { toasts, toast } = useToasts();

  const handleSuccess = useCallback((message) => {
    toast(message);
  }, [toast]);

  const handleError = useCallback((message) => {
    toast(message, "error");
  }, [toast]);

  const { codes, loading, saving, createCode, editCode, removeCode, clearCodes } = useInviteCodes(token, {
    onSuccess: handleSuccess,
    onError: handleError,
  });

  const filteredCodes = useMemo(
    () =>
      codes.filter(
        (code) =>
          code.code.toLowerCase().includes(search.toLowerCase()) ||
          (code.description ?? "").toLowerCase().includes(search.toLowerCase())
      ),
    [codes, search]
  );

  const handleLogin = async (email, password) => {
    const data = await login(email, password);
    sessionStorage.setItem("inv_token", data.token);
    setToken(data.token);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("inv_token");
    setToken("");
    clearCodes();
  };

  const handleCreate = async (body) => {
    const result = await createCode(body);
    if (result.ok) {
      setModal(null);
    }
  };

  const handleEdit = async (body) => {
    if (modal?.type !== "edit") {
      return;
    }

    const result = await editCode(modal.item.id, body);
    if (result.ok) {
      setModal(null);
    }
  };

  const handleDelete = async () => {
    if (modal?.type !== "delete") {
      return;
    }

    const result = await removeCode(modal.item.id);
    if (result.ok) {
      setModal(null);
    }
  };

  if (!token) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div style={styles.root}>
      <Toast toasts={toasts} />

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

      <div style={styles.toolbar}>
        <input
          style={{ ...styles.input, maxWidth: 280, margin: 0 }}
          placeholder="Search codes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button style={styles.btnPrimary} onClick={() => setModal("create")}>+ New code</button>
      </div>

      <div style={styles.tableWrapper}>
        <InviteCodeTable
          loading={loading}
          filteredCodes={filteredCodes}
          search={search}
          onEdit={(item) => setModal({ type: "edit", item })}
          onDelete={(item) => setModal({ type: "delete", item })}
        />
      </div>

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
