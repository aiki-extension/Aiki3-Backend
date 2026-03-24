import type { FastifyRequest, FastifyReply } from "fastify";
import prisma from "../lib/prisma.js";
import { toUserLearningSiteDto, type UserLearningSiteDto } from "../dtos/UserLearningSiteDto.js";

// GET /api/learningsites/:userId/:websiteId
export async function getLearningsiteById(req: FastifyRequest, reply: FastifyReply) {
  const { userId, websiteId } = req.params as { userId: string; websiteId: string };

  const learningsite = await prisma.userLearningSite.findUnique({
    where: {
      userId_websiteId: {
        userId: Number(userId),
        websiteId: Number(websiteId),
      },
    },
    include: { website: true },
  });

  if (!learningsite) {
    return reply.status(404).send({ message: "Learning site not found" });
  }

  const dto: UserLearningSiteDto = toUserLearningSiteDto(learningsite);
  return reply.send(dto);
}



// POST /api/learningsites
export async function createLearningsite(req: FastifyRequest, reply: FastifyReply) {
  const { userId, domain } = req.body as { userId: number; domain: string };

  // Check if website exists, create if not
  const website = await prisma.website.upsert({
    where: { domain },
    update: {},
    create: { domain },
  });

  // Creates the learning site entry, linking the user and the website
  const learningsite = await prisma.userLearningSite.create({
    data: {
      userId,
      websiteId: website.id,
    },
    include: { website: true },
  });

  // return the created learning site as a DTO
  const dto: UserLearningSiteDto = toUserLearningSiteDto(learningsite);
  return reply.status(201).send(dto);
}