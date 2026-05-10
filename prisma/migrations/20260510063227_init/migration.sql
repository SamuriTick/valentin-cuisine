/*
  Warnings:

  - You are about to drop the column `optimized_path` on the `media_library` table. All the data in the column will be lost.
  - You are about to drop the column `optimized_size` on the `media_library` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnail_path` on the `media_library` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnail_size` on the `media_library` table. All the data in the column will be lost.
  - You are about to drop the `booking_availability` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `bookings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `community_groups` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `contact_info` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `facilities` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `facility_gallery` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `facility_services` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `faq_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `news_posts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `opening_hours` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `program_schedules` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `programs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `site_settings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `testimonials` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."booking_availability" DROP CONSTRAINT "booking_availability_facility_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."bookings" DROP CONSTRAINT "bookings_facility_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."program_schedules" DROP CONSTRAINT "program_schedules_program_id_fkey";

-- AlterTable
ALTER TABLE "public"."media_library" DROP COLUMN "optimized_path",
DROP COLUMN "optimized_size",
DROP COLUMN "thumbnail_path",
DROP COLUMN "thumbnail_size",
ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tags" TEXT;

-- DropTable
DROP TABLE "public"."booking_availability";

-- DropTable
DROP TABLE "public"."bookings";

-- DropTable
DROP TABLE "public"."community_groups";

-- DropTable
DROP TABLE "public"."contact_info";

-- DropTable
DROP TABLE "public"."facilities";

-- DropTable
DROP TABLE "public"."facility_gallery";

-- DropTable
DROP TABLE "public"."facility_services";

-- DropTable
DROP TABLE "public"."faq_items";

-- DropTable
DROP TABLE "public"."news_posts";

-- DropTable
DROP TABLE "public"."opening_hours";

-- DropTable
DROP TABLE "public"."program_schedules";

-- DropTable
DROP TABLE "public"."programs";

-- DropTable
DROP TABLE "public"."site_settings";

-- DropTable
DROP TABLE "public"."testimonials";

-- CreateTable
CREATE TABLE "public"."posts" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "image_url" TEXT,
    "category" TEXT NOT NULL DEFAULT 'news',
    "tags" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "published_at" TIMESTAMP(3),
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."products" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" TEXT,
    "image_url" TEXT,
    "category" TEXT NOT NULL DEFAULT 'cake',
    "available" BOOLEAN NOT NULL DEFAULT true,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "order_note" TEXT,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."references" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT,
    "company" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "quote" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "references_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "posts_slug_key" ON "public"."posts"("slug");
