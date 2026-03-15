import type { UserBehaviorLog } from "../generated/prisma/client.js";

export interface UserBehaviorLogDto {
  id: string;
  userId: number;
  occurredAt: Date;
  category: string;
  action: string;
}

export function toUserBehaviorLogDto(log: UserBehaviorLog): UserBehaviorLogDto {
  return {
    id: log.id.toString(),
    userId: log.userId,
    occurredAt: log.occurredAt,
    category: log.category,
    action: log.action,
  };
}