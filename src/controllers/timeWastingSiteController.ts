import type { FastifyRequest, FastifyReply } from "fastify";
import prisma from "../lib/prisma.js";
import { toUserTimeWastingSiteDto, type UserTimeWastingSiteDto } from "../dtos/UserTimeWastingSiteDto.js"

export async function deleteUserTimeWastingSite(req: FastifyRequest, reply: FastifyReply) {
    const userId = req.user.id;
    const { domain } = req.params as { domain: string };

    try {
        // Find the website by domain
        const website = await prisma.website.findUnique({
            where: { domain },
        });

        if (!website) {
            return reply.status(404).send({ message: "Time-wasting site not found" });
        }
        // Delete association between the user and the website
        const site = await prisma.userTimeWastingSite.delete({
            where: {
                userId_websiteId: {
                    userId,
                    websiteId: website.id,
                }
            }
        });

        return reply.status(200).send(); 
    } catch (error) {
        console.error("Error deleting time-wasting site:", error);
        return reply.status(500).send({ message: "Failed to delete time-wasting site" });
    }
    
}

// GET /api/time-wasting-sites
export async function getUserTimeWastingSites(req: FastifyRequest, reply: FastifyReply) {
    const userId = req.user.id;

    const sites = await prisma.userTimeWastingSite.findMany({
        where: { userId },
        include: { website: true },
    });

    const dtos: UserTimeWastingSiteDto[] = sites.map(toUserTimeWastingSiteDto);
    return reply.send(dtos);
}

// POST /api/time-wasting-sites
export async function addUserTimeWastingSite(req: FastifyRequest, reply: FastifyReply) {
    const userId = req.user.id;
    const { domain } = req.body as { domain: string };

    if (!domain  || typeof domain !== "string" || domain.trim() === "") {
        return reply.status(400).send({ message: "Domain can't be an empty string" });
    }

    try {
        // Check if the website exists globally, if it does use that, otherwise add it
        const website = await prisma.website.upsert({
            where: { domain },
            update: {},
            create: { domain },
        });

        // Add this website to the current user's timeWasting sites list
        const site = await prisma.userTimeWastingSite.upsert({
            where: { userId_websiteId: { userId, websiteId: website.id } },
            update: {},
            create: {
                userId,
                websiteId: website.id,
            },
            include: { website: true},
        });

        const dto = toUserTimeWastingSiteDto(site);
        return reply.status(201).send(dto);
    } catch (error) {
        console.error("Error adding time-wasting site:", error);
        return reply.status(500).send({ message: "Failed to add time-wasting site" });
    }
    
}
