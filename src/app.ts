import Fastify from "fastify";
import jwt from "@fastify/jwt";
import rateLimit from "@fastify/rate-limit";
import type { FastifyRequest, FastifyReply } from "fastify";
import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";
import inviteCodeRoutes from "./routes/inviteCodes.js";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";

export async function buildApp() {
  const isProduction = process.env.NODE_ENV === "production";

  const maxRequests = 100;
  const timeWindow = "1 minute";

  // Create Fastify instance
  const app = Fastify({
    logger: true,
    trustProxy: true,
    ajv: {
      customOptions: {
        removeAdditional: false,
      },
    },
  });

  if (!isProduction) {
    // Register Swagger only in non-production environments.
    await app.register(swagger, {
      openapi: {
        info: { title: "Aiki3 API Documentation", version: "1.1.0" },
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

    await app.register(swaggerUi, { routePrefix: "/docs" });
  }

  await app.register(rateLimit, {
    global: true,
    max: maxRequests,
    timeWindow: timeWindow,
    allowList: (request) =>
      request.url === "/health" || (!isProduction && request.url.startsWith("/docs")),
  });

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
  app.register(inviteCodeRoutes, { prefix: "/api/invite-codes" });

  app.get("/health", async () => ({ status: "ok" }));

  app.get("/", async (_req, reply) => {
    return reply
      .header("Content-Type", "text/html")
      .send("<html><body><h1>Aiki3 API</h1></body></html>");
  });

  return app;
}