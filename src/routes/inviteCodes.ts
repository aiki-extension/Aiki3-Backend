import type { FastifyInstance } from "fastify";
import type { FastifyReply, FastifyRequest } from "fastify";
import {
  createInviteCode,
  deleteInviteCode,
  getInviteCodeById,
  listInviteCodes,
  updateInviteCode,
} from "../controllers/inviteCodeController.js";
import { hashEmail } from "../lib/hashEmail.js";

const INVITE_MANAGER_ADMIN_EMAIL_HASH = hashEmail("admin@aiki.com");

async function requireInviteManagerAdmin(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  if (req.user.name !== INVITE_MANAGER_ADMIN_EMAIL_HASH) {
    reply.status(403).send({ message: "Forbidden" });
  }
}

export default async function inviteCodeRoutes(app: FastifyInstance) {
  app.get(
    "/",
    {
      preHandler: [app.authenticate, requireInviteManagerAdmin],
      schema: {
        security: [{ bearerAuth: [] }],
      },
    },
    listInviteCodes
  );

  app.get(
    "/:id",
    {
      preHandler: [app.authenticate, requireInviteManagerAdmin],
      schema: {
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "string", pattern: "^[0-9]+$" },
          },
        },
      },
    },
    getInviteCodeById
  );

  app.post(
    "/",
    {
      preHandler: [app.authenticate, requireInviteManagerAdmin],
      schema: {
        security: [{ bearerAuth: [] }],
        body: {
          type: "object",
          required: ["code"],
          additionalProperties: false,
          properties: {
            code: { type: "string", minLength: 1 },
            isActive: { type: "boolean" },
            description: { anyOf: [{ type: "string" }, { type: "null" }] },
          },
        },
      },
    },
    createInviteCode
  );

  app.patch(
    "/:id",
    {
      preHandler: [app.authenticate, requireInviteManagerAdmin],
      schema: {
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "string", pattern: "^[0-9]+$" },
          },
        },
        body: {
          type: "object",
          minProperties: 1,
          additionalProperties: false,
          properties: {
            code: { type: "string", minLength: 1 },
            isActive: { type: "boolean" },
            description: { anyOf: [{ type: "string" }, { type: "null" }] },
          },
        },
      },
    },
    updateInviteCode
  );

  app.delete(
    "/:id",
    {
      preHandler: [app.authenticate, requireInviteManagerAdmin],
      schema: {
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "string", pattern: "^[0-9]+$" },
          },
        },
      },
    },
    deleteInviteCode
  );
}
