# Aiki3 Backend

> [!NOTE]
> The npm audit report will show high/moderate severity vulnerabilities related to hono and lodash. These exist solely within @prisma/dev, an internal Prisma CLI tooling package used for commands like prisma migrate and prisma studio. They are not part of the production runtime and pose no risk to the running server. Run npm list --omit=dev to confirm. This is a Prisma upstream issue and will be resolved in a future Prisma release.

## How to run backend locally
1. Start the PostgreSQL database container with `docker compose up -d` (use `docker compose down -v` to stop and remove volume)
2. Install dependencies: `npm install`
3. Rename `.env.template` to `.env` and check the necessary fields is filled out. For local development, see the `docker-compose.yml` for the default database credentials.
4. Run database migrations: `npx prisma migrate deploy`
5. Generate the Prisma client: `npx prisma generate`
6. Start the development server: `npm run dev`
7. Access the API at `http://localhost:<port>` and the Swagger UI documentation at `http://localhost:<port>/docs`, where `<port>` is the port set in your `.env` file.

### Note:
You may also find the `quick-setup.sh` script to be useful when having to quickly setup the backend for local testing. (Currently targets shells for Linux systems)
- To run execute `./quick-setup.sh`from a shell in the root directory of the project

## Technologies
| Technology | Role |
|---|---|
| **Fastify** | HTTP API framework |
| **Prisma 7** | ORM - database queries and migrations |
| **PostgreSQL** | Database |
| **pg** | PostgreSQL driver (used by Prisma's adapter) |
| **@fastify/jwt** | JWT authentication plugin |
| **bcrypt** | Password hashing |
| **@fastify/swagger + swagger-ui** | Auto-generated API documentation |

---

## Useful Commands
### Node.js
```bash
# Install dependencies
npm install

# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server (after build)
npm start
```

### Prisma
```bash
# Create and apply a new database migration
npx prisma migrate dev --name <migration-name>

# Regenerate the Prisma client after schema changes
npx prisma generate

# Apply pending migrations to the database
npx prisma migrate deploy

# Apply pending migrations and reset the database (will delete all data)
npx prisma migrate dev

# Open a visual database browser in the browser
npx prisma studio
```
