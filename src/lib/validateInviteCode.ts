import prisma from "../lib/prisma.js";
import type { FastifyReply } from "fastify";

/**
 * Looks up an invite code and sends an error response if it's invalid.
 * Returns the invite code record if valid, or null if a reply was already sent.
 */
export async function validateInviteCode(code: string, reply: FastifyReply) {
  const inviteCode = await prisma.inviteCode.findUnique({ where: { code } });
  if (!inviteCode) {
    reply.status(404).send({ error: "Invite code not found" });
    return null;
  }
  return inviteCode;
}