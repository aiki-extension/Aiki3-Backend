import type { FastifyInstance } from "fastify";
import { login } from "../controllers/authController.js";

export default async function authRoutes(app: FastifyInstance) {
  // Schema validation for user login
  const loginSchema = {
    schema: {
      body: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string" },
          password: { type: "string" },
        },
      },
    },
  };

  app.post("/login", loginSchema, login);
}