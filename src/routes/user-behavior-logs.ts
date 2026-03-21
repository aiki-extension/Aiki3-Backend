import type { FastifyInstance } from "fastify";
import { createUserBehaviorLog } from "../controllers/userBehaviorLogsController.js";

export default async function userBehaviorLogsRoutes(app: FastifyInstance) {
  // Schema validation for user behavior logs
  const userBehaviorLogsSchema = {
    preHandler: [app.authenticate],
    schema: {
      security: [{ bearerAuth: [] }],
      body: {
        type: "object",
        minProperties: 1,
        additionalProperties: false,
        properties: {
          category: { type: "string" },
          action: { type: "string" },
        },
      },
    },
  };

  app.post("/", userBehaviorLogsSchema, createUserBehaviorLog);
}