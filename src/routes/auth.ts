import type { FastifyInstance } from "fastify";
import { login } from "../controllers/authController.js";

export default async function authRoutes(app: FastifyInstance) {
  const loginSchema = {
    schema: {
      body: {
        type: "object",
        required: ["name", "password"],
        properties: {
          name: { type: "string" },
          password: { type: "string" },
        },
      },
    },
  };

  app.post("/login", loginSchema, login);
}