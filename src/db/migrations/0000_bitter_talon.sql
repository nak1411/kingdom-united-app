CREATE TABLE "data" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"zip" integer NOT NULL,
	"prayer" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
