import type { User } from "../generated/prisma/client.js";

export interface UserDto {
  createdAt: Date;
  isResearchParticipant: boolean;
  dailyLearningGoalMinutes: number;
  rewardTimeMinutes: number;
  sessionDurationMinutes: number;
  lastActive: Date;
  operatingStartMinutes: number;
  operatingEndMinutes: number;
}


// Used to fetch and update user settings
export interface UserSettingsDto {
  dailyLearningGoalMinutes: number;
  inviteCode?: string;
  rewardTimeMinutes: number;
  sessionDurationMinutes: number;
  lastActive: Date;
  operatingStartMinutes: number;
  operatingEndMinutes: number;
}

export interface UpdateUserSettingsDto {
  dailyLearningGoalMinutes?: number;
  rewardTimeMinutes?: number;
  sessionDurationMinutes?: number;
  lastActive?: Date;
  operatingStartMinutes?: number;
  operatingEndMinutes?: number;
  inviteCode?: string;
}

export function toUserDto(user: User): UserDto {
  return {
    createdAt: user.createdAt,
    isResearchParticipant: user.isResearchParticipant,
    dailyLearningGoalMinutes: user.dailyLearningGoalMinutes,
    rewardTimeMinutes: user.rewardTimeMinutes,
    sessionDurationMinutes: user.sessionDurationMinutes,
    lastActive: user.lastActive,
    operatingStartMinutes: user.operatingStartMinutes,
    operatingEndMinutes: user.operatingEndMinutes,
  };
}

export function toUserSettingsDto(user: User & { inviteCode: { code: string } | null }): UserSettingsDto {
  return {
    ...(user.inviteCode && { inviteCode: user.inviteCode.code }), // Omit inviteCode if it's null
    dailyLearningGoalMinutes: user.dailyLearningGoalMinutes,
    rewardTimeMinutes: user.rewardTimeMinutes,
    sessionDurationMinutes: user.sessionDurationMinutes,
    lastActive: user.lastActive,
    operatingStartMinutes: user.operatingStartMinutes,
    operatingEndMinutes: user.operatingEndMinutes,
  };
}

export function toUserSettingsUpdateData(input: UpdateUserSettingsDto) {
  return {
    ...(input.dailyLearningGoalMinutes !== undefined && {
      dailyLearningGoalMinutes: input.dailyLearningGoalMinutes,
    }),
    ...(input.rewardTimeMinutes !== undefined && {
      rewardTimeMinutes: input.rewardTimeMinutes,
    }),
    ...(input.sessionDurationMinutes !== undefined && {
      sessionDurationMinutes: input.sessionDurationMinutes,
    }),
    ...(input.lastActive !== undefined && { lastActive: input.lastActive }),
    ...(input.operatingStartMinutes !== undefined && {
      operatingStartMinutes: input.operatingStartMinutes,
    }),
    ...(input.operatingEndMinutes !== undefined && {
      operatingEndMinutes: input.operatingEndMinutes,
    }),
    ...(input.inviteCode !== undefined && {
      inviteCode: { connect: { code: input.inviteCode } },
    }),
  };
}