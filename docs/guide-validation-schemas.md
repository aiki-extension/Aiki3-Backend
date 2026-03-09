# Guide: Validation Schemas

Fastify uses JSON Schema to validate requests before they reach the controller. This means bad input is rejected automatically.
Schemas are defined inside the schema option of a route. 

> See [guide-create-endpoint](guide-create-endpoint.md) for how routes are structured.

## Schema Types
`params` - validates URL parameters (e.g. `/api/books/:id`):

```ts
params: {
  type: "object",
  required: ["id"],
  properties: {
    id: { type: "string", pattern: "^[0-9]+$" },
  },
},
```

`body` - validates the request body (useful for POST/PUT):

```ts
body: {
  type: "object",
  required: ["title", "author"],
  properties: {
    title: { type: "string", minLength: 1 },
    author: { type: "string", minLength: 1 },
    year: { type: "number" },
  },
},
```

`querystring` - validates query parameters (e.g. `?page=2&limit=10`):

```ts
querystring: {
  type: "object",
  properties: {
    page: { type: "number", default: 1 },
    limit: { type: "number", default: 20 },
  },
},
```

`response` - defines the shape of the response. Fastify uses this to serialize output faster and strip any fields not listed:

```ts
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
```