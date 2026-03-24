import type { FastifyRequest, FastifyReply } from "fastify";
import prisma from "../lib/prisma.js";
import { toUserLearningSiteDto, type UserLearningSiteDto } from "../dtos/UserLearningSiteDto.js";

// GET /api/learningsite
export async function getLearningsiteById(req: FastifyRequest, reply: FastifyReply) {
  const userId = req.user.id;

  // Fetch the learning site for the user, including the related website information

  const learningsite = await prisma.userLearningSite.findUnique({
    where: {
      userId: Number(userId),
    },
    include: { website: true },
  });

  // If no learning site is found for the user, return a 404 error
  if (!learningsite) {
    return reply.status(404).send({ message: "Learning site not found" });
  }

  // sends the learning site as a DTO
  const dto: UserLearningSiteDto = toUserLearningSiteDto(learningsite);
  return reply.send(dto);
}



// POST /api/learningsite
export async function createLearningsite(req: FastifyRequest, reply: FastifyReply) {
  const { domain } = req.body as { domain: string };
  const userId = req.user.id;

  // Check if website exists, create if not
  const website = await prisma.website.upsert({
    where: { domain },
    update: {},
    create: { domain },
  });

  // Creates the learning site entry, linking the user and the website
  const learningsite = await prisma.userLearningSite.create({
    data: {
      userId: Number(userId),
      websiteId: website.id,
    },
    include: { website: true },
  });

  // return the created learning site as a DTO
  const dto: UserLearningSiteDto = toUserLearningSiteDto(learningsite);
  return reply.status(201).send(dto);
}