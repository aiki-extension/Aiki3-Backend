import Fastify from "fastify";
import jwt from "@fastify/jwt";
import type { FastifyRequest, FastifyReply } from "fastify";
import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";

export async function buildApp() {
  const app = Fastify({ logger: true });

  await app.register(swagger, {
    openapi: { info: { title: "Fastify API Documentation", version: "1.0.0" } },
  });
  await app.register(swaggerUi, { routePrefix: "/docs" });

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not set");
  }

  await app.register(jwt, { secret: process.env.JWT_SECRET });

  // Reusable preHandler — add to any route you want to protect
  app.decorate(
    "authenticate",
    async function (req: FastifyRequest, reply: FastifyReply) {
      try {
        await req.jwtVerify();
      } catch {
        return reply.status(401).send({ message: "Unauthorized" });
      }
    }
  );

  app.register(authRoutes, { prefix: "/api/auth" });
  app.register(userRoutes, { prefix: "/api/users" });

  return app;
}