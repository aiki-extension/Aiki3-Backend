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
  inviteCode?: { code: string; isActive: boolean };
  rewardTimeMinutes: number;
  sessionDurationMinutes: number;
  lastActive: Date;
  operatingStartMinutes: number;
  operatingEndMinutes: number;
  learningSiteDomain?: string;
}

export interface UpdateUserSettingsDto {
  dailyLearningGoalMinutes?: number;
  rewardTimeMinutes?: number;
  sessionDurationMinutes?: number;
  lastActive?: Date;
  operatingStartMinutes?: number;
  operatingEndMinutes?: number;
  learningSiteDomain?: string;
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

export function toUserSettingsDto(user: User & { 
  learningSiteDomain?: string; 
  inviteCode: { code: string; isActive: boolean } | null 
}): UserSettingsDto {
  return {
    ...(user.learningSiteDomain && { learningSiteDomain: user.learningSiteDomain }),
    ...(user.inviteCode && {
      inviteCode: { code: user.inviteCode.code, isActive: user.inviteCode.isActive },
    }),
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