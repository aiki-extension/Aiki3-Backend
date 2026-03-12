import type { FastifyRequest, FastifyReply } from "fastify";
import bcrypt from "bcrypt";
import { hashEmail } from "../lib/hashEmail.js";
import prisma from "../lib/prisma.js";
import { toUserDto, type UserDto } from "../dtos/UserDto.js";

const SALT_ROUNDS = 10;

// POST /api/users
export async function createUser(req: FastifyRequest, reply: FastifyReply) {
  const { email, password } = req.body as { email: string; password: string };

  // note: email hash is vulnerable to rainbow table. consider hmac in future if this becomes a concern.
  const email_hashed = hashEmail(email);

  const password_hashed = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      email_hashed,
      password: password_hashed,
      isResearchParticipant: false, // todo: determine this based on a flag in the request body or some other logic
    },
  });

  const userDto: UserDto = toUserDto(user);
  return reply.status(201).send(userDto);
}

// GET /api/users/me
export async function getCurrentUser(req: FastifyRequest, reply: FastifyReply) {
  const userId = (req.user as { id : number }).id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return reply.status(404).send({ message: "User not found" });
  }

  const userDto: UserDto = toUserDto(user);
  return reply.send(userDto);
}
