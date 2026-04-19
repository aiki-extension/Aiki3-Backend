export interface InviteCodeDto {
  id: number;
  code: string;
  isActive: boolean;
  description: string | null;
  createdAt: Date;
  signedUpUsersCount: number;
}

export function toInviteCodeDto(inviteCode: {
  id: number;
  code: string;
  isActive: boolean;
  description: string | null;
  createdAt: Date;
  _count: { users: number };
}): InviteCodeDto {
  return {
    id: inviteCode.id,
    code: inviteCode.code,
    isActive: inviteCode.isActive,
    description: inviteCode.description,
    createdAt: inviteCode.createdAt,
    signedUpUsersCount: inviteCode._count.users,
  };
}
