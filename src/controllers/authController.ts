import type { FastifyRequest, FastifyReply } from "fastify";
import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";

export async function login(req: FastifyRequest, reply: FastifyReply) {
  const { name, password } = req.body as { name: string; password: string };

  const user = await prisma.user.findUnique({ where: { name } });

  if (!user) {
    return reply.status(401).send({ message: "Invalid credentials" });
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    return reply.status(401).send({ message: "Invalid credentials" });
  }

  // Sign a JWT with the user's id and name as the payload
  const token = await reply.jwtSign(
    { id: user.id, name: user.name },
    { expiresIn: "1d" }
  );

  return reply.send({ token });
}