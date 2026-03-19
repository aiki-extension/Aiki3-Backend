import type { FastifyRequest, FastifyReply } from "fastify";
import bcrypt from "bcrypt";
import { hashEmail } from "../lib/hashEmail.js";
import prisma from "../lib/prisma.js";
import { toUserDto, toUserSettingsDto, toUserSettingsUpdateData, type UpdateUserSettingsDto, type UserDto, type UserSettingsDto } from "../dtos/UserDto.js";

const SALT_ROUNDS = 10;

const IS_RESEARCH_PARTICIPANT_DEFAULT = false;
const DAILY_LEARNING_GOAL_DEFAULT = 30;
const REWARD_TIME_MINUTES_DEFAULT = 5;
const SESSION_DURATION_MINUTES_DEFAULT = 2;
const OPERATING_START_MINUTES_DEFAULT = 480; // 08:00 (8 * 60)
const OPERATING_END_MINUTES_DEFAULT = 1080; // 18:00 (18 * 60)

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
      isResearchParticipant: IS_RESEARCH_PARTICIPANT_DEFAULT, // todo: determine this based on a flag in the request body or some other logic
      dailyLearningGoalMinutes: DAILY_LEARNING_GOAL_DEFAULT,
      rewardTimeMinutes: REWARD_TIME_MINUTES_DEFAULT,
      sessionDurationMinutes: SESSION_DURATION_MINUTES_DEFAULT,
      lastActive: new Date(),
      operatingStartMinutes: OPERATING_START_MINUTES_DEFAULT,
      operatingEndMinutes: OPERATING_END_MINUTES_DEFAULT,
    },
  });

  const userDto: UserDto = toUserDto(user);
  return reply.status(201).send(userDto);
}

// GET /api/users/me
export async function getCurrentUser(req: FastifyRequest, reply: FastifyReply) {
  const userId = req.user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return reply.status(404).send({ message: "User not found" });
  }

  const userDto: UserDto = toUserDto(user);
  return reply.send(userDto);
}

// GET /api/users/settings
export async function getUserSettings(req: FastifyRequest, reply: FastifyReply) {
  const userId = req.user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return reply.status(404).send({ message: "User not found" });
  }

  const userSettingsDto: UserSettingsDto = toUserSettingsDto(user);
  return reply.send(userSettingsDto);
}

// PATCH /api/users/settings
export async function updateUserSettings(req: FastifyRequest, reply: FastifyReply) {
  const userId = req.user.id;
  const payload = req.body as UpdateUserSettingsDto;

  const user = await prisma.user.update({
    where: { id: userId },
    data: toUserSettingsUpdateData(payload),
  });

  const userSettingsDto: UserSettingsDto = toUserSettingsDto(user);
  return reply.send(userSettingsDto);
}