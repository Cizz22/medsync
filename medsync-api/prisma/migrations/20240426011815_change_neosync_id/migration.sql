/*
  Warnings:

  - Made the column `neosync_account_id` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "neosync_account_id" SET NOT NULL;
