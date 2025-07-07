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

// POST new prayer
app.post("/data", async (req, res) => {
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
    console.log("Error adding prayer", error);
    res.status(500).json({ error: "Failed to create prayer" });
  }
});

// GET all prayers
app.get("/data", async (req, res) => {
  try {
    const userData = await db
      .select()
      .from(dataTable)
      .orderBy(desc(dataTable.createdAt));
    res.json(userData);
  } catch (error) {
    console.error("Error fetching prayers", error);
    res.status(500).json({ error: "Failed to fetch prayers" });
  }
});

// GET prayer by userID
app.get("/data/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const userPrayers = await db
      .select()
      .from(prayers)
      .where(eq(prayers.userId, userId))
      .orderBy(desc(prayers.createdAt));
    res.json(userPrayers);
  } catch (error) {
    console.error("Error fetching user prayers:", error);
    res.status(500).json({ error: "Failed to fetch user prayers" });
  }
});

app.delete("/data/:userId/:zip", async (req, res) => {
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

// Get health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log("Server Running on PORT:", PORT);
});
