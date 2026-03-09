import type { FastifyInstance } from "fastify";
import {
  createUser,
  getAllUsers,
  getUserByIdOrName,
} from "../controllers/userController.js";

export default async function userRoutes(app: FastifyInstance) {
  // Schema validation for creating a user
  const createUserSchema = {
    schema: {
      body: {
        type: "object",
        required: ["name", "password"],
        properties: {
          name: { type: "string", minLength: 2 },
          password: { type: "string", minLength: 6 },
        },
      },
    },
  };

  app.post("/", createUserSchema, createUser);
  app.get("/", { preHandler: [app.authenticate] }, getAllUsers);
  app.get("/:identifier", getUserByIdOrName);
}