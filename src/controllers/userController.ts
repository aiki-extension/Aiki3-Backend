import type { FastifyRequest, FastifyReply } from "fastify";
import bcrypt from "bcrypt";
import { hashEmail } from "../lib/hashEmail.js";
import prisma from "../lib/prisma.js";
import { toUserDto, toUserSettingsDto, toUserSettingsUpdateData, type UpdateUserSettingsDto, type UserDto, type UserSettingsDto } from "../dtos/UserDto.js";
import { signToken } from "../lib/signToken.js";
import { validateInviteCode } from "../lib/validateInviteCode.js";

const SALT_ROUNDS = 10;

const IS_RESEARCH_PARTICIPANT_DEFAULT = false;
const DAILY_LEARNING_GOAL_DEFAULT = 30;
const REWARD_TIME_MINUTES_DEFAULT = 2;
const SESSION_DURATION_MINUTES_DEFAULT = 5;
const OPERATING_START_MINUTES_DEFAULT = 480; // 08:00 (8 * 60)
const OPERATING_END_MINUTES_DEFAULT = 1020; // 17:00 (17 * 60)

// POST /api/users
export async function createUser(req: FastifyRequest, reply: FastifyReply) {
  const { email, password, inviteCode } = req.body as { email: string; password: string; inviteCode?: string };

  if (inviteCode !== undefined) {
    const valid = await validateInviteCode(inviteCode, reply);
    if (!valid) return;
  }
 
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
      ...(inviteCode !== undefined && {
        inviteCode: { connect: { code: inviteCode } },
      }),
    },
  });

  // login the user immediately after registration
  const token = await signToken(reply, user);
  return reply.status(201).send({ token });
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
    include: {
      timeWastingSites: {
        include: { website: true }
      },
      learningSite: {
        include: {
          website: true,
        },
      },
      inviteCode: true,
    },
  });

  if (!user) {
    return reply.status(404).send({ message: "User not found" });
  }

  const learningSiteDomain = user.learningSite?.website.domain;
  return reply.send(toUserSettingsDto(
    learningSiteDomain !== undefined
      ? { ...user, learningSiteDomain }
      : user
  ));
}

// PATCH /api/users/settings
export async function updateUserSettings(req: FastifyRequest, reply: FastifyReply) {
  const userId = req.user.id;
  const payload = req.body as UpdateUserSettingsDto;

  if (payload.timeWastingSite !== undefined){
    // Check if website exists, if not create it
    const website = await prisma.website.upsert({
      where: { domain: payload.timeWastingSite },
      update: {},
      create: { domain: payload.timeWastingSite },
    });

    await prisma.userTimeWastingSite.upsert({
      where: { userId_websiteId: { userId, websiteId: website.id } },
      update: {},
      create: { userId, websiteId: website.id },
    });
  }
  if (payload.learningSiteDomain !== undefined) {
    const website = await prisma.website.upsert({
      where: { domain: payload.learningSiteDomain },
      update: {},
      create: { domain: payload.learningSiteDomain },
    });
    await prisma.userLearningSite.upsert({
      where: { userId: userId },
      update: { websiteId: website.id },
      create: {
        userId: userId,
        websiteId: website.id,
      },
    });
  }

  if (payload.inviteCode !== undefined) {

    // If the inviteCode is an empty string, remove the existing invite code
    if (payload.inviteCode === "") {
      const user = await prisma.user.update({
        where: { id: userId },
        data: { inviteCode: { disconnect: true } },
        include: { 
          timeWastingSites: { include: { website: true} },
          inviteCode: true 
        },
      });
      return reply.send(toUserSettingsDto(user));
    }
    const valid = await validateInviteCode(payload.inviteCode, reply);
    if (!valid) return;
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: toUserSettingsUpdateData(payload), 
    include: {
      timeWastingSites: { include: { website: true } },
      inviteCode: true,
    },
  });

  return reply.send(toUserSettingsDto(user));
}

// DELETE /api/users/settings/time-wasting-sites/:domain
export async function deleteUserTimeWastingSite(req: FastifyRequest, reply: FastifyReply) {
  const userId = req.user.id;
  const { domain } = req.params as { domain: string };

  try {
    const website = await prisma.website.findUnique({
      where: { domain },
    });

    if (!website) {
      return reply.status(404).send({ message: "Time-wasting site not found" });
    }

    await prisma.userTimeWastingSite.delete({
      where: {
        userId_websiteId: {
          userId,
          websiteId: website.id,
        }
      }
    });

    return reply.status(200).send({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Error deleting time-wasting site:", error);
    return reply.status(500).send({ message: "Failed to delete time-wasting site" });
  }
}