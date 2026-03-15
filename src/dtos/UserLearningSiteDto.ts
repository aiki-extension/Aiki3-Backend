import type { UserLearningSite, Website } from "../generated/prisma/client.js";

export interface UserLearningSiteDto {
  userId: number;
  websiteId: number;
  domain: string;
}

export function toUserLearningSiteDto(
  entry: UserLearningSite & { website: Website }
): UserLearningSiteDto {
  return {
    userId: entry.userId,
    websiteId: entry.websiteId,
    domain: entry.website.domain,
  };
}