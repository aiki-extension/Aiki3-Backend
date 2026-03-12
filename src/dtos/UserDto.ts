import type { User } from "../generated/prisma/client.js";

export interface UserDto {
  id: number;
  createdAt: Date;
  isResearchParticipant: boolean;
  dailyLearningGoal: number | null;
  rewardTimeMinutes: number | null;
  sessionDurationMinutes: number | null;
  lastActive: Date | null;
  operatingHoursStart: Date | null;
  operatingHoursEnd: Date | null;
}

export function toUserDto(user: User): UserDto {
  return {
    id: user.id,
    createdAt: user.createdAt,
    isResearchParticipant: user.isResearchParticipant,
    dailyLearningGoal: user.dailyLearningGoal,
    rewardTimeMinutes: user.rewardTimeMinutes,
    sessionDurationMinutes: user.sessionDurationMinutes,
    lastActive: user.lastActive,
    operatingHoursStart: user.operatingHoursStart,
    operatingHoursEnd: user.operatingHoursEnd,
  };
}