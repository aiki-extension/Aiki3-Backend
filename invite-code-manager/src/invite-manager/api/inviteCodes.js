import { apiFetch } from "./client";

export async function listInviteCodes(token) {
  return apiFetch("/api/invite-codes", {}, token);
}

export async function createInviteCode(body, token) {
  return apiFetch("/api/invite-codes", {
    method: "POST",
    body: JSON.stringify(body),
  }, token);
}

export async function updateInviteCode(id, body, token) {
  return apiFetch(`/api/invite-codes/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  }, token);
}

export async function deleteInviteCode(id, token) {
  return apiFetch(`/api/invite-codes/${id}`, {
    method: "DELETE",
  }, token);
}
