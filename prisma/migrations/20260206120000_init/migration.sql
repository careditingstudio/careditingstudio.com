-- CreateTable
CREATE TABLE "site_settings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "business_name" TEXT NOT NULL,
    "domain_label" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "whatsapp_dial" TEXT NOT NULL,
    "whatsapp_display" TEXT NOT NULL,
    "floating_car" TEXT NOT NULL DEFAULT '',
    "updated_at" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hero_banners" (
    "id" SERIAL NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "hero_banners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "before_after_posts" (
    "id" SERIAL NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "before_url" TEXT NOT NULL,
    "after_url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "intro" TEXT NOT NULL,
    "price_note" TEXT NOT NULL,
    "list_title" TEXT NOT NULL,
    "includes_json" TEXT NOT NULL,
    "before_alt" TEXT NOT NULL,
    "after_alt" TEXT NOT NULL,
    "image_first" BOOLEAN NOT NULL DEFAULT false,
    "show_dual_ctas" BOOLEAN NOT NULL DEFAULT true,
    "primary_cta_label" TEXT NOT NULL DEFAULT '',
    "primary_cta_href" TEXT NOT NULL DEFAULT '',
    "secondary_cta_label" TEXT NOT NULL DEFAULT '',
    "secondary_cta_href" TEXT NOT NULL DEFAULT '',
    "solo_cta_label" TEXT NOT NULL DEFAULT '',
    "solo_cta_href" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "before_after_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services" (
    "id" SERIAL NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portfolio_items" (
    "id" SERIAL NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "service_id" INTEGER,
    "before_url" TEXT NOT NULL,
    "after_url" TEXT NOT NULL,
    "before_alt" TEXT NOT NULL,
    "after_alt" TEXT NOT NULL,

    CONSTRAINT "portfolio_items_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "portfolio_items" ADD CONSTRAINT "portfolio_items_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE SET NULL ON UPDATE CASCADE;
