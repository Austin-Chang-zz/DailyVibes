import { type MoodEntry, type InsertMoodEntry } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getMoodEntries(): Promise<MoodEntry[]>;
  createMoodEntry(entry: InsertMoodEntry): Promise<MoodEntry>;
}

export class MemStorage implements IStorage {
  private moodEntries: Map<string, MoodEntry>;

  constructor() {
    this.moodEntries = new Map();
  }

  async getMoodEntries(): Promise<MoodEntry[]> {
    const entries = Array.from(this.moodEntries.values());
    return entries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createMoodEntry(insertEntry: InsertMoodEntry): Promise<MoodEntry> {
    const id = randomUUID();
    const entry: MoodEntry = {
      ...insertEntry,
      id,
      createdAt: new Date(),
    };
    this.moodEntries.set(id, entry);
    return entry;
  }
}

export const storage = new MemStorage();
