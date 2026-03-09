# Guide: Create a New Data Model

This guide walks you through the steps of creating a new data model in Prisma, applying the migration, and setting up a corresponding DTO (Data Transfer Object) for API responses.

> See [guide-create-endpoint](guide-create-endpoint.md) for how to create REST endpoints that utilize the data model in this guide.

---

## Steps

1. **Define the model** in `prisma/schema.prisma`
   ```prisma
   model Book {
     id        Int      @id @default(autoincrement())
     title     String
     author    String
     year      Int?
     createdAt DateTime @default(now())
   }
   ```

2. **Create and apply migration**
   ```bash
   npx prisma migrate dev --name <migration-name>
   ```
   This command will generate a new migration file and apply it to the database.

3. **Verify**
   - Check `prisma/migrations/` for the new migration folder
   - Check `src/generated/prisma/` for the generated TypeScript types

4. **Create a DTO (Data Transfer Object)**
   
   Create `src/dtos/BookDto.ts` to define what data is exposed via API:
   
   ```typescript
   /**
    * Data Transfer Object for Book
    * Excludes sensitive fields and controls what's returned to clients
    */
   export interface BookDto {
     id: number;
     title: string;
     author: string;
     year: number | null;
     createdAt: Date;
   }
   /**
    * Maps from Prisma entity to BookDto
    */
   export function toBookDto(model: {
     id: number;
     title: string;
     author: string;
     year: number | null;
     createdAt: Date;
   }): BookDto {
     return {
       id: model.id,
       title: model.title,
       author: model.author,
       year: model.year,
       createdAt: model.createdAt,
     };
   }
   /**
    * Maps an array of Prisma entities to DTO array
    */
   export function toBookDtoArray(models: Array<{
     id: number;
     title: string;
     author: string;
     year: number | null;
     createdAt: Date;
   }>): BookDto[] {
     return models.map(toBookDto);
   }
   ```

## Common Fields & Types
- `String` - text
- `Int` - integer
- `Boolean` - true/false
- `DateTime` - timestamp
- `String?` - optional field (add `?`)
- `@default(value)` - set default value
- `@unique` - enforce uniqueness
- `@id` - primary key

More field and types are available [here](https://www.prisma.io/docs/orm/prisma-client/special-fields-and-types).


## Relations
- One-to-many: Add array on "one" side: `posts Post[]`
- Many-to-one: Add single reference: `user User @relation(fields: [userId], references: [id])`
- Many-to-many: Use implicit relation or explicit join table

More on relations are available [here](https://www.prisma.io/docs/orm/prisma-schema/data-model/relations).

## Next Steps
- Create controller functions in `src/controllers/`
- Define routes in `src/routes/`
- See `guide-create-endpoint` for details

See more in the guide on [setting up endpoints](guide-create-endpoint.md)