import type { SiteSession, Website } from "../generated/prisma/client.js";

export interface SiteSessionDto {
  id: number;
  userId: number;
  domain: string;
  triggeredByDomain: string | null;
  sessionStart: Date;
  sessionEnd: Date;
}

export function toSiteSessionDto(
  session: SiteSession & {
    website: Website;
    triggeredBySite: Website | null;
  }
): SiteSessionDto {
  return {
    id: session.id,
    userId: session.userId,
    domain: session.website.domain,
    triggeredByDomain: session.triggeredBySite?.domain ?? null,
    sessionStart: session.sessionStart,
    sessionEnd: session.sessionEnd,
  };
}