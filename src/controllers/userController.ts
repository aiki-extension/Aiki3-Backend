import type { FastifyRequest, FastifyReply } from "fastify";
import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import { toUserDto, toUserDtoArray, type UserDto } from "../dtos/UserDto.js";

const SALT_ROUNDS = 10;

// POST /api/users
export async function createUser(req: FastifyRequest, reply: FastifyReply) {
  const { name, password } = req.body as { name: string; password: string };

  // Hash the password before storing
  const hashed = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: { name, password: hashed },
  });

  const userDto: UserDto = toUserDto(user);
  return reply.status(201).send(userDto);
}

// GET /api/users
export async function getAllUsers(req: FastifyRequest, reply: FastifyReply) {
  const users = await prisma.user.findMany();

  const userDtos: UserDto[] = toUserDtoArray(users);
  return reply.send(userDtos);
}

// GET /api/users/:identifier
// Accepts either a numeric id or a name string
export async function getUserByIdOrName(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const { identifier } = req.params as { identifier: string };
  const asNumber = Number(identifier);

  const user = await prisma.user.findFirst({
    where: isNaN(asNumber)
      ? { name: identifier }
      : { id: asNumber },
  });

  if (!user) {
    return reply.status(404).send({ message: "User not found" });
  }

  const userDto: UserDto = toUserDto(user);
  return reply.send(userDto);
}