# Guide: Create a New Endpoint

This guide goes through every step of creating a new REST endpoint in Fastify. 

This guide will use a concrete example of fetching a book by its ID.

> See [guide-create-data-model](guide-create-data-model.md) for how to set up a Prisma model and DTO.

---

## Steps

### 1) Create the Controller

The controller contains the actual logic for your endpoint: querying the database, handling edge cases, and returning the response.

Create `src/controllers/bookController.ts`:
```ts
import type { FastifyRequest, FastifyReply } from "fastify";
import prisma from "../lib/prisma.js";
import { toBookDto, type BookDto } from "../dtos/BookDto.js";

// GET /api/books/:id
export async function getBookById(req: FastifyRequest, reply: FastifyReply) {
  const { id } = req.params as { id: string };

  const book = await prisma.book.findUnique({
    where: { id: Number(id) },
  });

  if (!book) {
    return reply.status(404).send({ message: "Book not found" });
  }

  const dto: BookDto = toBookDto(book);
  return reply.send(dto);
}
```

**What is happening:**
- `req.params` gives the URL parameters (e.g. the `:id` from `/api/books/:id`).
- `prisma.book.findUnique` queries the database for a single record.
- If nothing is found, we return a `404` with a descriptive message.
- The result is mapped through a DTO before being sent. The DTO controls exactly what fields the client receives.

---

### 2) Create the Route File

The route file connects a URL pattern (like `/api/books/:id`) to a controller. It's also where input validation and authentication is defined.

Create `src/routes/books.ts`:
```ts
import type { FastifyInstance } from "fastify";
import { getBookById } from "../controllers/bookController.js";

export default async function bookRoutes(app: FastifyInstance) {
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
    getBookById
  );
}
```
> See [guide-validation-schemas](guide-validation-schemas.md) for a full reference on params, body, querystring, and response schemas.

#### Understanding the Validation Schema

Fastify uses JSON Schema to validate requests before they even reach the controller. This means bad input is rejected early.

**`params`** - validates URL parameters:
```ts
params: {
  type: "object",
  required: ["id"],
  properties: {
    id: { type: "string", pattern: "^[0-9]+$" }, // must be a numeric string
  },
},
```
If someone calls `/api/books/abc`, Fastify rejects the request automatically with a `400` error.

**`body`** - validates the request body (useful for POST/PUT):
```ts
body: {
  type: "object",
  required: ["title", "author"],
  properties: {
    title: { type: "string", minLength: 1 },
    author: { type: "string" },
    year: { type: "number" },
  },
},
```
This ensures that when creating a new book, the client must provide a non-empty title and author, and an optional year.

**`querystring`** - validates query parameters (e.g. `?page=2&limit=10`):
```ts
querystring: {
  type: "object",
  properties: {
    page: { type: "number", default: 1 },
    limit: { type: "number", default: 20 },
  },
},
```
This allows to easily implement pagination or filtering.

**`response`** - defines what the response looks like. Fastify uses this to serialize the output faster and strip any fields not listed:
```ts
response: {
  200: {
    type: "object",
    properties: {
      id: { type: "number" },
      title: { type: "string" },
    },
  },
},
```

#### Authentication

Use `preHandler` to protect an endpoint. `app.authenticate` runs before the controller and rejects unauthenticated requests:
```ts
preHandler: [app.authenticate]
```

For public endpoints, simply omit the `preHandler` option entirely.

---

### 3) Register the Route in `app.ts`

Fastify uses a plugin system where routes must be registered with a prefix before they're active.

In `src/app.ts`:
```ts
import bookRoutes from "./routes/books.ts";

...

app.register(bookRoutes, { prefix: "/api/books" });
```

The `prefix` is prepended to all routes defined inside `bookRoutes`. So `/:id` becomes `/api/books/:id`.

---

### 4) Test the Endpoint

With your server running, you can try out the new endpoint via. either Curl or the Swagger UI.

---

## Quick Checklist

- [ ] Controller created in `src/controllers/`
- [ ] Route file created in `src/routes/`
- [ ] Validation schema defined for params / body / query as needed
- [ ] Authentication added via `preHandler` (or intentionally omitted for public routes)
- [ ] Route registered with a prefix in `src/app.ts`
- [ ] Response mapped through a DTO
- [ ] All cases tested: success, not found, invalid input