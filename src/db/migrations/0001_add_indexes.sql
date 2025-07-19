-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS "idx_data_user_id" ON "data" ("user_id");
CREATE INDEX IF NOT EXISTS "idx_data_zip" ON "data" ("zip");
CREATE INDEX IF NOT EXISTS "idx_data_created_at" ON "data" ("created_at");