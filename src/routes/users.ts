import type { FastifyInstance } from "fastify";
import {
  createUser,
  getCurrentUser,
  getUserSettings,
  updateUserSettings,
  deleteUserTimeWastingSite
} from "../controllers/userController.js";
import { time } from "node:console";

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
          inviteCode: { type: "string" },
        },
      },
    },
  };

  const updateUserSettingsSchema = {
    preHandler: [app.authenticate],
    schema: {
      security: [{ bearerAuth: [] }],
      body: {
        type: "object",
        minProperties: 1,
        additionalProperties: false,
        properties: {
          learningSiteDomain: { type: "string" },
          inviteCode: { type: "string" },
          dailyLearningGoalMinutes: { type: "number" },
          rewardTimeMinutes: { type: "number" },
          sessionDurationMinutes: { type: "number" },
          lastActive: { type: "string", format: "date-time" },
          operatingStartMinutes: { type: "number" },
          operatingEndMinutes: { type: "number" },
          timeWastingSite: { type: "string" },
        },
      },
    },
  };

  app.post("/", createUserSchema, createUser);
  app.get("/me", { preHandler: [app.authenticate], schema: { security: [{ bearerAuth: [] }] } }, getCurrentUser);
  app.get("/settings", { preHandler: [app.authenticate], schema: { security: [{ bearerAuth: [] }] } }, getUserSettings);
  app.patch("/settings", updateUserSettingsSchema, updateUserSettings);
  app.delete("/settings/time-wasting-sites/:domain", { preHandler: [app.authenticate], schema: { security: [{ bearerAuth: [] }] } },
  deleteUserTimeWastingSite
  );
}