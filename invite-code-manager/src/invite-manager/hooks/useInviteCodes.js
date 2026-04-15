import { useCallback, useEffect, useState } from "react";
import {
  createInviteCode,
  deleteInviteCode,
  listInviteCodes,
  updateInviteCode,
} from "../api/inviteCodes";

export function useInviteCodes(token, { onSuccess, onError }) {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    try {
      const data = await listInviteCodes(token);
      setCodes(data);
    } catch (err) {
      onError(err.message);
    } finally {
      setLoading(false);
    }
  }, [onError, token]);

  useEffect(() => {
    if (!token) {
      setCodes([]);
      return;
    }

    load();
  }, [load, token]);

  const createCode = useCallback(async (body) => {
    setSaving(true);
    try {
      const created = await createInviteCode(body, token);
      setCodes((prev) => [created, ...prev]);
      onSuccess("Invite code created");
      return { ok: true };
    } catch (err) {
      onError(err.status === 409 ? "Code already exists" : err.message);
      return { ok: false };
    } finally {
      setSaving(false);
    }
  }, [onError, onSuccess, token]);

  const editCode = useCallback(async (id, body) => {
    setSaving(true);
    try {
      const updated = await updateInviteCode(id, body, token);
      setCodes((prev) => prev.map((item) => (item.id === id ? updated : item)));
      onSuccess("Invite code updated");
      return { ok: true };
    } catch (err) {
      onError(err.status === 409 ? "Code already exists" : err.message);
      return { ok: false };
    } finally {
      setSaving(false);
    }
  }, [onError, onSuccess, token]);

  const removeCode = useCallback(async (id) => {
    setSaving(true);
    try {
      await deleteInviteCode(id, token);
      setCodes((prev) => prev.filter((item) => item.id !== id));
      onSuccess("Invite code deleted");
      return { ok: true };
    } catch (err) {
      onError(err.message);
      return { ok: false };
    } finally {
      setSaving(false);
    }
  }, [onError, onSuccess, token]);

  return {
    codes,
    loading,
    saving,
    createCode,
    editCode,
    removeCode,
    clearCodes: () => setCodes([]),
  };
}
