import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertMoodEntrySchema, type MoodEntry } from "@shared/schema";
import { ThemeToggle } from "@/components/theme-toggle";
import { AIMoodAnalyzer } from "@/components/ai-mood-analyzer";
import { AIInsights } from "@/components/ai-insights";
import { AIRecommendations } from "@/components/ai-recommendations";
import { Heart, Calendar, Clock, Brain, Lightbulb, RefreshCw } from "lucide-react";

const moods = [
  { id: "happy", emoji: "😊", name: "Happy" },
  { id: "excited", emoji: "🤩", name: "Excited" },
  { id: "calm", emoji: "😌", name: "Calm" },
  { id: "love", emoji: "🥰", name: "Love" },
  { id: "sad", emoji: "😢", name: "Sad" },
  { id: "tired", emoji: "😴", name: "Tired" },
  { id: "angry", emoji: "😤", name: "Angry" },
  { id: "anxious", emoji: "😰", name: "Anxious" },
  { id: "grateful", emoji: "🙏", name: "Grateful" },
  { id: "energetic", emoji: "⚡", name: "Energetic" },
  { id: "confused", emoji: "😕", name: "Confused" },
  { id: "peaceful", emoji: "☮️", name: "Peaceful" },
];

const formSchema = insertMoodEntrySchema.extend({
  mood: z.string().min(1, "Please select a mood"),
  name: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState<string>("");
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mood: "",
      emoji: "",
      note: "",
      name: "",
    },
  });

  const { data: moodEntries = [], isLoading } = useQuery<MoodEntry[]>({
    queryKey: ["/api/mood-entries"],
  });

  const createMoodMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiRequest("POST", "/api/mood-entries", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mood-entries"] });
      form.reset({ mood: "", emoji: "", note: "", name: "" });
      setSelectedMood("");
      toast({
        title: "Mood saved!",
        description: "Your vibe has been recorded successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save your mood. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleMoodSelect = (mood: { id: string; emoji: string; name: string }) => {
    setSelectedMood(mood.id);
    form.setValue("mood", mood.name);
    form.setValue("emoji", mood.emoji);
  };

  const onSubmit = (data: FormData) => {
    createMoodMutation.mutate(data);
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return format(d, "MMM d, yyyy");
    }
  };

  const getMoodGradient = (mood: string) => {
    const gradientMap: Record<string, string> = {
      Happy: "from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-yellow-100 dark:border-yellow-800/30",
      Excited: "from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-100 dark:border-orange-800/30",
      Calm: "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-100 dark:border-green-800/30",
      Love: "from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 border-pink-100 dark:border-pink-800/30",
      Sad: "from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-100 dark:border-blue-800/30",
      Tired: "from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-purple-100 dark:border-purple-800/30",
      Angry: "from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-red-100 dark:border-red-800/30",
      Anxious: "from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border-purple-100 dark:border-purple-800/30",
      Grateful: "from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 border-pink-100 dark:border-pink-800/30",
      Energetic: "from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border-cyan-100 dark:border-cyan-800/30",
      Confused: "from-gray-50 to-slate-50 dark:from-gray-800/30 dark:to-slate-800/30 border-gray-100 dark:border-gray-700/30",
      Peaceful: "from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 border-green-100 dark:border-green-800/30",
    };
    return gradientMap[mood] || "from-gray-50 to-slate-50 dark:from-gray-800/30 dark:to-slate-800/30 border-gray-100 dark:border-gray-700/30";
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 min-h-screen transition-colors duration-300">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header with Theme Toggle */}
        <header className="text-center mb-12 relative">
          <div className="absolute top-0 right-0">
            <ThemeToggle />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4 tracking-tight">Daily Vibes</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Track your daily moods and reflect on your emotional journey. Select your current vibe and optionally add a note.
          </p>
        </header>

        {/* AI Features Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6 text-center">AI-Powered Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AIMoodAnalyzer onMoodSuggested={handleMoodSelect} />
            <AIInsights />
            <AIRecommendations 
              currentMood={selectedMood ? moods.find(m => m.id === selectedMood)?.name : undefined}
              currentNote={form.watch("note")}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Mood Tracker Form */}
          <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">How are you feeling today?</h2>

              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Name Input */}
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Your name (optional):
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-800 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Enter your name"
                    {...form.register("name")}
                    data-testid="name-input"
                  />
                </div>

                {/* Emoji Selector */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 block">Select your mood:</Label>
                  <div className="grid grid-cols-4 gap-3">
                    {moods.map((mood) => (
                      <button
                        key={mood.id}
                        type="button"
                        className={`mood-emoji w-16 h-16 rounded-xl border-2 flex items-center justify-center text-2xl hover:border-indigo-300 dark:hover:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-800 transition-all duration-200 ${
                          selectedMood === mood.id
                            ? "selected border-indigo-500 bg-gradient-to-br from-indigo-500 to-purple-600 text-white transform scale-110"
                            : "border-gray-200 dark:border-gray-600 hover:scale-105 bg-white dark:bg-gray-700"
                        }`}
                        onClick={() => handleMoodSelect(mood)}
                        data-testid={`mood-${mood.id}`}
                      >
                        {mood.emoji}
                      </button>
                    ))}
                  </div>
                  {selectedMood && (
                    <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-3" data-testid="selected-mood-text">
                      Mood selected: {moods.find(m => m.id === selectedMood)?.name}
                    </p>
                  )}
                  {form.formState.errors.mood && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-2">{form.formState.errors.mood.message}</p>
                  )}
                </div>

                {/* Note Input */}
                <div>
                  <Label htmlFor="note" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Add a note (optional):
                  </Label>
                  <Textarea
                    id="note"
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-800 focus:border-indigo-500 dark:focus:border-indigo-400 resize-none transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="How are you feeling? What's on your mind today?"
                    {...form.register("note")}
                    data-testid="note-input"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-indigo-600 dark:bg-indigo-500 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                  disabled={createMoodMutation.isPending}
                  data-testid="submit-button"
                >
                  {createMoodMutation.isPending ? "Saving..." : "Save My Vibe"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Mood History */}
          <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Your Vibe History</h2>

              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse bg-gray-100 dark:bg-gray-700 rounded-xl p-4 h-24" />
                  ))}
                </div>
              ) : moodEntries.length === 0 ? (
                <div className="text-center py-12" data-testid="empty-state">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">No mood entries yet</h3>
                  <p className="text-gray-500 dark:text-gray-400">Start tracking your daily vibes above!</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar" data-testid="mood-history">
                  {moodEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className={`mood-card bg-gradient-to-r ${getMoodGradient(entry.mood)} rounded-xl p-4 border fade-in transition-all duration-300 hover:transform hover:-translate-y-1`}
                      data-testid={`mood-entry-${entry.id}`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-3xl">{entry.emoji}</div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              {entry.name && (
                                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">{entry.name}</div>
                              )}
                              <span className="font-medium text-gray-800 dark:text-gray-200 capitalize">{entry.mood}</span>
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{formatDate(entry.createdAt)}</span>
                          </div>
                          {entry.note && (
                            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{entry.note}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center">
          <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400" data-testid="total-entries">
                    {moodEntries.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Entries</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400" data-testid="current-streak">
                    {moodEntries.length > 0 ? Math.min(moodEntries.length, 7) : 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Day Streak</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-amber-600 dark:text-amber-400" data-testid="most-common-mood">
                    {moodEntries.length > 0 ? moodEntries[0]?.emoji || "😊" : "😊"}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Most Recent</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <p className="text-gray-500 dark:text-gray-400 mt-6 text-sm">
            Track your emotional journey one day at a time. Your data is stored securely.
          </p>
        </footer>
      </div>
    </div>
  );
}