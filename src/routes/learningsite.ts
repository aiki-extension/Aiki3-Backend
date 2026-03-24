import type { FastifyInstance } from "fastify";
import { getLearningsiteById, createLearningsite } from "../controllers/learningController.js";

export default async function learningsiteRoutes(app: FastifyInstance) {
  app.get(
    "/learningsite",
    {
      schema: {
        response: {
          200: {
            type: "object",
            properties: {
              userId: { type: "number" },
              websiteId: { type: "string" },
              domain: { type: "string" },
            },
          },
        },
      },
      preHandler: [app.authenticate],
    },
    getLearningsiteById
  );

  app.post(
    "/learningsite",
    {
      schema: {
        body: {
          type: "object",
          required: ["domain"],
          properties: {
            domain: { type: "string", format: "domain" },
          },
        },
        response: {
          201: {
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
    createLearningsite
  );
}