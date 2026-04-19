import type { FastifyReply, FastifyRequest } from "fastify";
import { Prisma } from "../generated/prisma/client.js";
import prisma from "../lib/prisma.js";
import { toInviteCodeDto } from "../dtos/InviteCodeDto.js";

interface InviteCodeIdParams {
  id: string;
}

interface CreateInviteCodeBody {
  code: string;
  isActive?: boolean;
  description?: string | null;
}

interface UpdateInviteCodeBody {
  code?: string;
  isActive?: boolean;
  description?: string | null;
}

// GET /api/invite-codes
export async function listInviteCodes(_req: FastifyRequest, reply: FastifyReply) {
  const inviteCodes = await prisma.inviteCode.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { users: true },
      },
    },
  });

  return reply.send(inviteCodes.map(toInviteCodeDto));
}

// GET /api/invite-codes/:id
export async function getInviteCodeById(req: FastifyRequest, reply: FastifyReply) {
  const { id } = req.params as InviteCodeIdParams;

  const inviteCode = await prisma.inviteCode.findUnique({
    where: { id: Number(id) },
    include: {
      _count: {
        select: { users: true },
      },
    },
  });

  if (!inviteCode) {
    return reply.status(404).send({ message: "Invite code not found" });
  }

  return reply.send(toInviteCodeDto(inviteCode));
}

// POST /api/invite-codes
export async function createInviteCode(req: FastifyRequest, reply: FastifyReply) {
  const body = req.body as CreateInviteCodeBody;
  const code = body.code.trim();

  try {
    const inviteCode = await prisma.inviteCode.create({
      data: {
        code,
        isActive: body.isActive ?? true,
        description: body.description ?? null,
      },
      include: {
        _count: {
          select: { users: true },
        },
      },
    });

    return reply.status(201).send(toInviteCodeDto(inviteCode));
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return reply.status(409).send({ message: "Invite code already exists" });
    }

    throw error;
  }
}

// PATCH /api/invite-codes/:id
export async function updateInviteCode(req: FastifyRequest, reply: FastifyReply) {
  const { id } = req.params as InviteCodeIdParams;
  const body = req.body as UpdateInviteCodeBody;

  const updateData: UpdateInviteCodeBody = {
    ...(body.code !== undefined && { code: body.code.trim() }),
    ...(body.isActive !== undefined && { isActive: body.isActive }),
    ...(body.description !== undefined && { description: body.description }),
  };

  try {
    const inviteCode = await prisma.inviteCode.update({
      where: { id: Number(id) },
      data: updateData,
      include: {
        _count: {
          select: { users: true },
        },
      },
    });

    return reply.send(toInviteCodeDto(inviteCode));
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return reply.status(404).send({ message: "Invite code not found" });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return reply.status(409).send({ message: "Invite code already exists" });
    }

    throw error;
  }
}

// DELETE /api/invite-codes/:id
export async function deleteInviteCode(req: FastifyRequest, reply: FastifyReply) {
  const { id } = req.params as InviteCodeIdParams;

  try {
    await prisma.inviteCode.delete({
      where: { id: Number(id) },
    });

    return reply.status(204).send();
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return reply.status(404).send({ message: "Invite code not found" });
    }

    throw error;
  }
}
