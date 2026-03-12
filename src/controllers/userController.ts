import type { FastifyRequest, FastifyReply } from "fastify";
import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import { toUserDto, type UserDto } from "../dtos/UserDto.js";

const SALT_ROUNDS = 10;

// POST /api/users
export async function createUser(req: FastifyRequest, reply: FastifyReply) {
  const { email_hashed, password } = req.body as { email_hashed: string; password: string };

  // Hash the password before storing
  const hashed_password = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      email_hashed,
      password: hashed_password,
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
