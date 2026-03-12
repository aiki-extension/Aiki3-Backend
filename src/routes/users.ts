import type { FastifyInstance } from "fastify";
import {
  createUser,
  getCurrentUser
} from "../controllers/userController.js";

export default async function userRoutes(app: FastifyInstance) {
  // Schema validation for creating a user
  const createUserSchema = {
    schema: {
      body: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string", minLength: 6 },
        },
      },
    },
  };

  app.post("/", createUserSchema, createUser);
  app.get("/me", { preHandler: [app.authenticate], schema: { security: [{ bearerAuth: [] }] } }, getCurrentUser);
}