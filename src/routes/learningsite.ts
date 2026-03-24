import type { FastifyInstance } from "fastify";
import { getLearningsiteById } from "../controllers/learningController.js";

export default async function learningsiteRoutes(app: FastifyInstance) {
  app.get(
    "/:id",
    {
      schema: {
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "string", pattern: "^[0-9]+$" },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              id: { type: "number" },
              title: { type: "string" },
              author: { type: "string" },
            },
          },
        },
      },
      preHandler: [app.authenticate],
    },
    getLearningsiteById
  );
}