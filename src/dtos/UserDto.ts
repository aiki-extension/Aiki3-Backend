/**
 * Data Transfer Object for User responses
 * Excludes sensitive fields like password
 */
export interface UserDto {
  id: number;
  name: string;
  createdAt: Date;
}

/**
 * Maps a User entity from Prisma to a UserDto
 * @param user - User object from database (with password field)
 * @returns UserDto without sensitive fields
 */
export function toUserDto(user: {
  id: number;
  name: string;
  createdAt: Date;
  password?: string;
}): UserDto {
  return {
    id: user.id,
    name: user.name,
    createdAt: user.createdAt,
  };
}

/**
 * Maps an array of User entities to UserDto array
 */
export function toUserDtoArray(users: Array<{
  id: number;
  name: string;
  createdAt: Date;
  password?: string;
}>): UserDto[] {
  return users.map(toUserDto);
}
