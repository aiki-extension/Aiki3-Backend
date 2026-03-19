import type { FastifyRequest, FastifyReply } from "fastify";
import bcrypt from "bcrypt";
import { hashEmail } from "../lib/hashEmail.js";
import prisma from "../lib/prisma.js";
import { signToken } from "../lib/signToken.js";

export async function login(req: FastifyRequest, reply: FastifyReply) {
  const { email, password } = req.body as { email: string; password: string };

  const email_hashed = hashEmail(email);

  const user = await prisma.user.findUnique({ where: { email_hashed } });

  if (!user) {
    return reply.status(401).send({ message: "Invalid credentials" });
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    return reply.status(401).send({ message: "Invalid credentials" });
  }

  // Sign a JWT with the user's id and name as the payload
  const token = await signToken(reply, user);

  return reply.send({ token });
}