import express from "express";
import { db } from "./config/db.js";
import { ENV } from "./config/env.js";
import { dataTable } from "./db/schema.js";
import { and, eq } from "drizzle-orm";
import job from "./config/cron.js";

const app = express();
const PORT = ENV.PORT;

if (ENV.NODE_ENV === "production") job.start();

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true });
});

app.post("/api/data", async (req, res) => {
  try {
    const { userId, zip, prayer } = req.body;

    if (!userId || !zip || !prayer) {
      return res.status(400).json({ error: "Missing Required Fields" });
    }
    const newPrayer = await db
      .insert(dataTable)
      .values({
        userId,
        zip,
        prayer,
      })
      .returning();

    res.status(201).json(newPrayer[0]);
  } catch (error) {
    console.log("Error adding prayer");
    res.status(500).json({ error: "Something Went Wrong" });
  }
});

app.get("/api/data/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const userData = await db
      .select()
      .from(dataTable)
      .where(eq(dataTable.userId, userId));

    res.status(200).json(userData);
  } catch (error) {
    console.log("Error fetching data", error);
    res.status(500).json({ error: "Something Went Wrong" });
  }
});

app.delete("/api/data/:userId/:zip", async (req, res) => {
  try {
    const { userId, zip } = req.params;

    await db
      .delete(dataTable)
      .where(
        and(eq(dataTable.userId, userId), eq(dataTable.zip, parseInt(zip)))
      );

    res.status(200).json({ message: "Zip Removed" });
  } catch (error) {
    console.log("Error removing zip", error);
    res.status(500).json({ error: "Something Went Wrong" });
  }
});

app.listen(PORT, () => {
  console.log("Server Running on PORT:", PORT);
});
