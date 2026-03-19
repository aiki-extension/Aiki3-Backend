import type { FastifyReply } from "fastify";
import type { User } from "../generated/prisma/client.js";

export async function signToken(reply: FastifyReply, user: User): Promise<string> {
  return reply.jwtSign({ id: user.id, name: user.email_hashed });
}