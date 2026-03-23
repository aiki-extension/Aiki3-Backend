import Fastify from "fastify";
import jwt from "@fastify/jwt";
import type { FastifyRequest, FastifyReply } from "fastify";
import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import timeWastingSiteRoutes from "./routes/timeWastingSites.js";

export async function buildApp() {

  // Create Fastify instance
  const app = Fastify({
    logger: true,
    ajv: {
      customOptions: {
        removeAdditional: false,
      },
    },
  });

  // Register Swagger for API documentation
  await app.register(swagger, {
    openapi: {
      info: { title: "Aiki3 API Documentation", version: "1.0.0" },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
    },
  });

  // Register Swagger UI to serve the documentation at /docs
  await app.register(swaggerUi, { routePrefix: "/docs" });

  // Ensure JWT_SECRET is set before registering the JWT plugin
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not set");
  }
  await app.register(jwt, { secret: process.env.JWT_SECRET });

  // Reusable preHandler (add to any route that needs protection)
  app.decorate(
    "authenticate",
    async function (req: FastifyRequest, reply: FastifyReply) {
      try {
        await req.jwtVerify();

        // Check the JWT payload
        const user = req.user;
        if (typeof user?.id !== "number" || typeof user?.name !== "string") {
          return reply.status(401).send({ message: "Invalid token payload" });
        }
      } catch {
        return reply.status(401).send({ message: "Unauthorized" });
      }
    }
  );

  // Register route modules
  app.register(authRoutes, { prefix: "/api/auth" });
  app.register(userRoutes, { prefix: "/api/users" });
  app.register(timeWastingSiteRoutes, { prefix: "/api/time-wasting-sites" });

  return app;
}