import type { FastifyInstance } from "fastify";
import { getLearningsiteById, upsertLearningsite } from "../controllers/learningController.js";

export default async function learningsiteRoutes(app: FastifyInstance) {
  app.get(
    "/",
    {
      preHandler: [app.authenticate],
      schema: {
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            type: "object",
            properties: {
              userId: { type: "number" },
              websiteId: { type: "number" },
              domain: { type: "string" },
            },
          },
        },
      },
    },
    getLearningsiteById
  );

  app.patch(
    "/",
    {
      preHandler: [app.authenticate],
      schema: {
        security: [{ bearerAuth: [] }],
        body: {
          type: "object",
          required: ["domain"],
          properties: {
            domain: { type: "string" },
          },
        },
        response: {
          201: {
            type: "object",
            properties: {
              userId: { type: "number" },
              websiteId: { type: "number" },
              domain: { type: "string" },
            },
          },
        },
      },
    },
    upsertLearningsite
  );
}