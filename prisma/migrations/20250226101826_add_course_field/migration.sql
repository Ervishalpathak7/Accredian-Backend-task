/*
  Warnings:

  - You are about to drop the column `phone` on the `referred` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `referrer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `referred` DROP COLUMN `phone`;

-- AlterTable
ALTER TABLE `referrer` DROP COLUMN `phone`;
