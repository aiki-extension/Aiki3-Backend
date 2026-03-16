import type { User } from "../generated/prisma/client.js";

export type Time = {
  hours: number;
  minutes: number;
};

export interface UserDto {
  createdAt: Date;
  isResearchParticipant: boolean;
  dailyLearningGoalMinutes: number;
  rewardTimeMinutes: number;
  sessionDurationMinutes: number;
  lastActive: Date;
  operatingHoursStart: Date;
  operatingHoursEnd: Date;
}


// Used to fetch and update user settings
export interface UserSettingsDto {
  dailyLearningGoalMinutes: number;
  rewardTimeMinutes: number;
  sessionDurationMinutes: number;
  lastActive: Date;
  operatingHoursStart: Date;
  operatingHoursEnd: Date;
}

// Helper function to convert Date to Time object
function dateToTimeObj(date: Date) {
  return {
    hours: date.getUTCHours(),
    minutes: date.getUTCMinutes(),
  };
}

// Helper function to convert Time object to Date (using a fixed date since we only care about time)
function timeToDateObj(time: Time) {
  return new Date(Date.UTC(1970, 0, 1, time.hours, time.minutes));
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

export function toUserSettingsDto(user: User): UserSettingsDto {
  return {
    dailyLearningGoalMinutes: user.dailyLearningGoalMinutes,
    rewardTimeMinutes: user.rewardTimeMinutes,
    sessionDurationMinutes: user.sessionDurationMinutes,
    lastActive: user.lastActive,
    operatingHoursStart: user.operatingHoursStart,
    operatingHoursEnd: user.operatingHoursEnd,
  };
}