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
  operatingHoursStart: Time;
  operatingHoursEnd: Time;
}


// Used to fetch and update user settings
export interface UserSettingsDto {
  dailyLearningGoalMinutes: number;
  rewardTimeMinutes: number;
  sessionDurationMinutes: number;
  lastActive: Date;
  operatingHoursStart: Time;
  operatingHoursEnd: Time;
}

export interface UpdateUserSettingsDto {
  dailyLearningGoalMinutes?: number;
  rewardTimeMinutes?: number;
  sessionDurationMinutes?: number;
  lastActive?: Date;
  operatingHoursStart?: Time;
  operatingHoursEnd?: Time;
}

// Helper function to convert Date to Time object
function dateToTimeObj(date: Date): Time {
  return {
    hours: date.getUTCHours(),
    minutes: date.getUTCMinutes(),
  };
}

// Helper function to convert Time object to Date (using a fixed date since we only care about time)
function timeToDateObj(time: Time): Date {
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
    operatingHoursStart: dateToTimeObj(user.operatingHoursStart),
    operatingHoursEnd: dateToTimeObj(user.operatingHoursEnd),
  };
}

export function toUserSettingsDto(user: User): UserSettingsDto {
  return {
    dailyLearningGoalMinutes: user.dailyLearningGoalMinutes,
    rewardTimeMinutes: user.rewardTimeMinutes,
    sessionDurationMinutes: user.sessionDurationMinutes,
    lastActive: user.lastActive,
    operatingHoursStart: dateToTimeObj(user.operatingHoursStart),
    operatingHoursEnd: dateToTimeObj(user.operatingHoursEnd),
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
    ...(input.operatingHoursStart !== undefined && {
      operatingHoursStart: timeToDateObj(input.operatingHoursStart),
    }),
    ...(input.operatingHoursEnd !== undefined && {
      operatingHoursEnd: timeToDateObj(input.operatingHoursEnd),
    }),
  };
}