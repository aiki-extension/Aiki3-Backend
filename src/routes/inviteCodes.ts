import type { FastifyInstance } from "fastify";
import {
  createInviteCode,
  deleteInviteCode,
  getInviteCodeById,
  listInviteCodes,
  updateInviteCode,
} from "../controllers/inviteCodeController.js";

export default async function inviteCodeRoutes(app: FastifyInstance) {
  app.get(
    "/",
    {
      preHandler: [app.authenticate],
      schema: {
        security: [{ bearerAuth: [] }],
      },
    },
    listInviteCodes
  );

  app.get(
    "/:id",
    {
      preHandler: [app.authenticate],
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
      preHandler: [app.authenticate],
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
      preHandler: [app.authenticate],
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
      preHandler: [app.authenticate],
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
