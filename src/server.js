import express from "express";
import { db } from "./config/db.js";
import { ENV } from "./config/env.js";
import { dataTable } from "./db/schema.js";
import { and, eq, desc } from "drizzle-orm";
import job from "./config/cron.js";

const app = express();
const PORT = ENV.PORT;

if (ENV.NODE_ENV === "production") job.start();

app.use(express.json());

// POST new prayer
app.post("/data", async (req, res) => {
  try {
    const { userId, zip, prayerText } = req.body;

    if (!userId || !zip || !prayerText) {
      return res.status(400).json({ error: "Missing Required Fields" });
    }
    const newPrayer = await db
      .insert(dataTable)
      .values({
        userId,
        zip,
        prayerText,
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
app.get("/data/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const userData = await db
      .select()
      .from(dataTable)
      .where(eq(dataTable.userId, userId))
      .orderBy(desc(dataTable.createdAt));
    res.json(userData);
  } catch (error) {
    console.error("Error fetching user prayers:", error);
    res.status(500).json({ error: "Failed to fetch user prayers" });
  }
});

// GET prayers by zip code
app.get("/data/zip/:zip", async (req, res) => {
  try {
    const { zip } = req.params;
    const zipData = await db
      .select()
      .from(dataTable)
      .where(eq(dataTable.zip, zip))
      .orderBy(desc(dataTable.createdAt));
    res.json(zipData);
  } catch (error) {
    console.error("Error fetching prayers by zip:", error);
    res.status(500).json({ error: "Failed to fetch prayers by zip code" });
  }
});

// GET single prayer by ID
app.get("/data/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const prayer = await db
      .select()
      .from(dataTable)
      .where(eq(dataTable.id, parseInt(id)))
      .limit(1);

    if (prayer.length === 0) {
      return res.status(404).json({ error: "Prayer not found" });
    }

    res.json(prayer[0]);
  } catch (error) {
    console.error("Error fetching prayer:", error);
    res.status(500).json({ error: "Failed to fetch prayer" });
  }
});

// PUT update prayer all fields
app.put("/data/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, zip, prayerText } = req.body;

    // Check if prayer exists
    const existingPrayer = await db
      .select()
      .from(dataTable)
      .where(eq(dataTable.id, parseInt(id)))
      .limit(1);

    if (existingPrayer.length === 0) {
      return res.status(404).json({ error: "Prayer not found" });
    }

    const updatedPrayer = await db
      .update(dataTable)
      .set({
        userId: userId || existingPrayer[0].userId,
        zip: zip || existingPrayer[0].zip,
        prayerText: prayerText || existingPrayer[0].prayerText,
      })
      .where(eq(dataTable.id, parseInt(id)))
      .returning();

    res.json(updatedPrayer[0]);
  } catch (error) {
    console.error("Error updating prayer:", error);
    res.status(500).json({ error: "Failed to update prayer" });
  }
});

// PUT update prayer text only
app.put("/data/:id/text", async (req, res) => {
  try {
    const { id } = req.params;
    const { prayerText } = req.body;

    // Validation
    if (!prayerText) {
      return res.status(400).json({ error: "prayerText is required" });
    }

    // Check if prayer exists
    const existingPrayer = await db
      .select()
      .from(dataTable)
      .where(eq(dataTable.id, parseInt(id)))
      .limit(1);

    if (existingPrayer.length === 0) {
      return res.status(404).json({ error: "Prayer not found" });
    }

    const updatedPrayer = await db
      .update(dataTable)
      .set({
        prayerText,
      })
      .where(eq(dataTable.id, parseInt(id)))
      .returning();

    res.json(updatedPrayer[0]);
  } catch (error) {
    console.error("Error updating prayer text:", error);
    res.status(500).json({ error: "Failed to update prayer text" });
  }
});

// PUT update zip only
app.put("/data/:id/zip", async (req, res) => {
  try {
    const { id } = req.params;
    const { zip } = req.body;

    // Validation
    if (!zip) {
      return res.status(400).json({ error: "zip is required" });
    }

    // Check if prayer exists
    const existingPrayer = await db
      .select()
      .from(dataTable)
      .where(eq(dataTable.id, parseInt(id)))
      .limit(1);

    if (existingPrayer.length === 0) {
      return res.status(404).json({ error: "Prayer not found" });
    }

    const updatedPrayer = await db
      .update(dataTable)
      .set({
        zip,
      })
      .where(eq(dataTable.id, parseInt(id)))
      .returning();

    res.json(updatedPrayer[0]);
  } catch (error) {
    console.error("Error updating zip:", error);
    res.status(500).json({ error: "Failed to update zip" });
  }
});

// DELETE prayer
app.delete("/data/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPrayer = await db
      .delete(dataTable)
      .where(eq(dataTable.id, parseInt(id)))
      .returning();

    if (deletedPrayer.length === 0) {
      return res.status(404).json({ error: "Prayer not found" });
    }

    res.json({
      message: "Prayer deleted successfully",
      prayer: deletedPrayer[0],
    });
  } catch (error) {
    console.error("Error deleting prayer:", error);
    res.status(500).json({ error: "Failed to delete prayer" });
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
