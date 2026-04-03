import type { User } from "../generated/prisma/client.js";
import type { UserTimeWastingSite, Website } from "../generated/prisma/client.js";

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
  timeWastingSites: string[];
  learningSiteDomain?: string;
}

export interface UpdateUserSettingsDto {
  dailyLearningGoalMinutes?: number;
  rewardTimeMinutes?: number;
  sessionDurationMinutes?: number;
  lastActive?: Date;
  operatingStartMinutes?: number;
  operatingEndMinutes?: number;
  timeWastingSite?: string;
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
  timeWastingSites: (UserTimeWastingSite & { website: Website})[] 
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
    timeWastingSites: user.timeWastingSites.map((s) => s.website.domain),
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