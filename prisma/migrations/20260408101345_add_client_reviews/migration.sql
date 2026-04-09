-- CreateTable
CREATE TABLE "client_reviews" (
    "id" SERIAL NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "client_name" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "message" TEXT NOT NULL,
    "avatar_url" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "client_reviews_pkey" PRIMARY KEY ("id")
);
