import type { FastifyRequest, FastifyReply } from "fastify";
import prisma from "../lib/prisma.js";

export async function createUserBehaviorLog(req: FastifyRequest, reply: FastifyReply) {
  const userId = req.user.id;
  const { category, action } = req.body as { category: string; action: string };

  try {
    await prisma.userBehaviorLog.create({
      data: { userId, category, action },
    });
    return reply.status(204).send();
  } catch (error) {
    return reply.status(500).send({ error: "Internal server error" });
  }
}