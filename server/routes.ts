import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMoodEntrySchema } from "@shared/schema";
import { aiService } from "./ai-service";

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

  // AI mood analysis from text
  app.post("/api/ai/analyze-mood", async (req, res) => {
    try {
      const { note } = req.body;
      if (!note || typeof note !== 'string') {
        return res.status(400).json({ message: "Note text is required" });
      }
      
      const analysis = await aiService.analyzeMoodFromText(note);
      res.json(analysis);
    } catch (error) {
      res.status(500).json({ message: "Failed to analyze mood" });
    }
  });

  // AI mood insights
  app.get("/api/ai/insights", async (req, res) => {
    try {
      const entries = await storage.getMoodEntries();
      const insights = await aiService.generateMoodInsights(entries);
      res.json({ insights });
    } catch (error) {
      res.status(500).json({ message: "Failed to generate insights" });
    }
  });

  // AI mood recommendations
  app.post("/api/ai/recommendations", async (req, res) => {
    try {
      const { mood, note } = req.body;
      if (!mood || typeof mood !== 'string') {
        return res.status(400).json({ message: "Mood is required" });
      }
      
      const recommendations = await aiService.generateMoodRecommendations(mood, note);
      res.json({ recommendations });
    } catch (error) {
      res.status(500).json({ message: "Failed to generate recommendations" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
