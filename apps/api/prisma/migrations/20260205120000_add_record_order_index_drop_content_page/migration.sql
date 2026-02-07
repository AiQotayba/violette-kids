-- DropTable: ContentPage (remove FK first)
ALTER TABLE "ContentPage" DROP CONSTRAINT "ContentPage_contentId_fkey";
DROP TABLE "ContentPage";

-- AlterTable: add orderIndex to Category
ALTER TABLE "Category" ADD COLUMN "orderIndex" INTEGER NOT NULL DEFAULT 0;

-- AlterTable: add orderIndex to AgeGroup
ALTER TABLE "AgeGroup" ADD COLUMN "orderIndex" INTEGER NOT NULL DEFAULT 0;

-- AlterTable: add orderIndex to Admin
ALTER TABLE "Admin" ADD COLUMN "orderIndex" INTEGER NOT NULL DEFAULT 0;

-- AlterTable: add orderIndex to AppSetting
ALTER TABLE "AppSetting" ADD COLUMN "orderIndex" INTEGER NOT NULL DEFAULT 0;
