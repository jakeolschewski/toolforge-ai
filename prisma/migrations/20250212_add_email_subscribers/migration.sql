-- CreateTable
CREATE TABLE IF NOT EXISTS "email_subscribers" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "source" TEXT NOT NULL DEFAULT 'popup',
    "variant" TEXT,
    "ip_hash" TEXT,
    "user_agent" TEXT,
    "referrer" TEXT,
    "metadata" JSONB,
    "confirmed_at" TIMESTAMP(3),
    "unsubscribed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "email_subscribers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "email_subscribers_email_key" ON "email_subscribers"("email");

-- CreateIndex
CREATE INDEX "email_subscribers_status_idx" ON "email_subscribers"("status");

-- CreateIndex
CREATE INDEX "email_subscribers_source_idx" ON "email_subscribers"("source");

-- CreateIndex
CREATE INDEX "email_subscribers_created_at_idx" ON "email_subscribers"("created_at");

-- CreateTable for newsletter tracking
CREATE TABLE IF NOT EXISTS "newsletter_sends" (
    "id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "content_html" TEXT NOT NULL,
    "content_text" TEXT,
    "recipients_count" INTEGER NOT NULL DEFAULT 0,
    "sent_count" INTEGER NOT NULL DEFAULT 0,
    "failed_count" INTEGER NOT NULL DEFAULT 0,
    "opened_count" INTEGER NOT NULL DEFAULT 0,
    "clicked_count" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "scheduled_at" TIMESTAMP(3),
    "sent_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "newsletter_sends_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "newsletter_sends_status_idx" ON "newsletter_sends"("status");

-- CreateIndex
CREATE INDEX "newsletter_sends_sent_at_idx" ON "newsletter_sends"("sent_at");

-- CreateTable for email analytics
CREATE TABLE IF NOT EXISTS "email_analytics" (
    "id" TEXT NOT NULL,
    "subscriber_id" TEXT NOT NULL,
    "newsletter_id" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "ip_hash" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "email_analytics_subscriber_id_idx" ON "email_analytics"("subscriber_id");

-- CreateIndex
CREATE INDEX "email_analytics_newsletter_id_idx" ON "email_analytics"("newsletter_id");

-- CreateIndex
CREATE INDEX "email_analytics_event_type_idx" ON "email_analytics"("event_type");

-- CreateIndex
CREATE INDEX "email_analytics_created_at_idx" ON "email_analytics"("created_at");
