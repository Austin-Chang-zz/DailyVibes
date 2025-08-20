import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMoodEntrySchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all mood entries
  app.get("/api/mood-entries", async (req, res) => {
    try {
      const entries = await storage.getMoodEntries();
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch mood entries" });
    }
  });

  // Create a new mood entry
  app.post("/api/mood-entries", async (req, res) => {
    try {
      const validatedData = insertMoodEntrySchema.parse(req.body);
      const entry = await storage.createMoodEntry(validatedData);
      res.status(201).json(entry);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to create mood entry" });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
