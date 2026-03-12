import type { UserTimeWastingSite, Website } from "../generated/prisma/client.js";

export interface UserTimeWastingSiteDto {
  userId: number;
  websiteId: number;
  domain: string;
}

export function toUserTimeWastingSiteDto(
  entry: UserTimeWastingSite & { website: Website }
): UserTimeWastingSiteDto {
  return {
    userId: entry.userId,
    websiteId: entry.websiteId,
    domain: entry.website.domain,
  };
}