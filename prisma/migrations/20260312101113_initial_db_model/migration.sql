-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email_hashed" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isResearchParticipant" BOOLEAN NOT NULL,
    "dailyLearningGoal" INTEGER,
    "rewardTimeMinutes" INTEGER,
    "sessionDurationMinutes" INTEGER,
    "lastActive" TIMESTAMP(3),
    "operatingHoursStart" TIME,
    "operatingHoursEnd" TIME,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Website" (
    "id" SERIAL NOT NULL,
    "domain" TEXT NOT NULL,

    CONSTRAINT "Website_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserTimeWastingSite" (
    "userId" INTEGER NOT NULL,
    "websiteId" INTEGER NOT NULL,

    CONSTRAINT "UserTimeWastingSite_pkey" PRIMARY KEY ("userId","websiteId")
);

-- CreateTable
CREATE TABLE "UserLearningSite" (
    "userId" INTEGER NOT NULL,
    "websiteId" INTEGER NOT NULL,

    CONSTRAINT "UserLearningSite_pkey" PRIMARY KEY ("userId","websiteId")
);

-- CreateTable
CREATE TABLE "SiteSession" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "websiteId" INTEGER NOT NULL,
    "triggeredBySiteId" INTEGER,
    "sessionStart" TIMESTAMP(3) NOT NULL,
    "sessionEnd" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserBehaviorLog" (
    "id" BIGSERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "category" TEXT NOT NULL,
    "action" TEXT NOT NULL,

    CONSTRAINT "UserBehaviorLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_hashed_key" ON "User"("email_hashed");

-- CreateIndex
CREATE UNIQUE INDEX "Website_domain_key" ON "Website"("domain");

-- AddForeignKey
ALTER TABLE "UserTimeWastingSite" ADD CONSTRAINT "UserTimeWastingSite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTimeWastingSite" ADD CONSTRAINT "UserTimeWastingSite_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLearningSite" ADD CONSTRAINT "UserLearningSite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLearningSite" ADD CONSTRAINT "UserLearningSite_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SiteSession" ADD CONSTRAINT "SiteSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SiteSession" ADD CONSTRAINT "SiteSession_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SiteSession" ADD CONSTRAINT "SiteSession_triggeredBySiteId_fkey" FOREIGN KEY ("triggeredBySiteId") REFERENCES "Website"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBehaviorLog" ADD CONSTRAINT "UserBehaviorLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
