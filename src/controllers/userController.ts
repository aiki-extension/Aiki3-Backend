import type { FastifyRequest, FastifyReply } from "fastify";
import bcrypt from "bcrypt";
import { hashEmail } from "../lib/hashEmail.js";
import prisma from "../lib/prisma.js";
import { toUserDto, type UserDto } from "../dtos/UserDto.js";

const SALT_ROUNDS = 10;

const IS_RESEARCH_PARTICIPANT_DEFAULT = false;
const DAILY_LEARNING_GOAL_DEFAULT = 30;
const REWARD_TIME_MINUTES_DEFAULT = 5;
const SESSION_DURATION_MINUTES_DEFAULT = 2;
const OPERATING_HOURS_START_DEFAULT = new Date(2026, 0, 1, 8, 0, 0); // 08:00 (date is discarded)
const OPERATING_HOURS_END_DEFAULT = new Date(2026, 0, 1, 18, 0, 0); // 18:00 (date is discarded)

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
      operatingHoursStart: OPERATING_HOURS_START_DEFAULT,
      operatingHoursEnd: OPERATING_HOURS_END_DEFAULT,
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
