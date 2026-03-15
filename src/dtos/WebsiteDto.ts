import type { Website } from "../generated/prisma/client.js";

export interface WebsiteDto {
  id: number;
  domain: string;
}

export function toWebsiteDto(website: Website): WebsiteDto {
  return {
    id: website.id,
    domain: website.domain,
  };
}