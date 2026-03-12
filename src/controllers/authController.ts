import type { FastifyRequest, FastifyReply } from "fastify";
import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";

export async function login(req: FastifyRequest, reply: FastifyReply) {
  const { email_hashed, password } = req.body as { email_hashed: string; password: string };

  const user = await prisma.user.findUnique({ where: { email_hashed } });

  if (!user) {
    return reply.status(401).send({ message: "Invalid credentials" });
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    return reply.status(401).send({ message: "Invalid credentials" });
  }

  // Sign a JWT with the user's id and name as the payload
  const token = await reply.jwtSign({ id: user.id, name: user.email_hashed });

  return reply.send({ token });
}