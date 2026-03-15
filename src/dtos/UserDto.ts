import type { User } from "../generated/prisma/client.js";

export interface UserDto {
  createdAt: Date;
  isResearchParticipant: boolean;
  dailyLearningGoalMinutes: number | null;
  rewardTimeMinutes: number | null;
  sessionDurationMinutes: number | null;
  lastActive: Date | null;
  operatingHoursStart: Date | null;
  operatingHoursEnd: Date | null;
}

export function toUserDto(user: User): UserDto {
  return {
    createdAt: user.createdAt,
    isResearchParticipant: user.isResearchParticipant,
    dailyLearningGoalMinutes: user.dailyLearningGoalMinutes,
    rewardTimeMinutes: user.rewardTimeMinutes,
    sessionDurationMinutes: user.sessionDurationMinutes,
    lastActive: user.lastActive,
    operatingHoursStart: user.operatingHoursStart,
    operatingHoursEnd: user.operatingHoursEnd,
  };
}