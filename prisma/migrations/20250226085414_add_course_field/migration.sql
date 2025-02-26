/*
  Warnings:

  - You are about to drop the column `createdAt` on the `referrer` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Referrer_email_key` ON `referrer`;

-- AlterTable
ALTER TABLE `referred` ADD COLUMN `course` VARCHAR(191) NOT NULL DEFAULT 'No Course',
    ADD COLUMN `phone` VARCHAR(191) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `referrer` DROP COLUMN `createdAt`,
    ADD COLUMN `phone` VARCHAR(191) NOT NULL DEFAULT '';
