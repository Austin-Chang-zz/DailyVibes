
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface MoodAnalysis {
  suggestedMood: string;
  confidence: number;
  emoji: string;
}

interface AIAnalyzerProps {
  onMoodSuggested: (mood: { id: string; emoji: string; name: string }) => void;
}

export function AIMoodAnalyzer({ onMoodSuggested }: AIAnalyzerProps) {
  const [text, setText] = useState("");
  const [analysis, setAnalysis] = useState<MoodAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeMood = async () => {
    if (!text.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const response = await apiRequest("POST", "/api/ai/analyze-mood", { note: text });
      const result = await response.json();
      setAnalysis(result);
    } catch (error) {
      console.error("Failed to analyze mood:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const acceptSuggestion = () => {
    if (analysis) {
      onMoodSuggested({
        id: analysis.suggestedMood.toLowerCase(),
        emoji: analysis.emoji,
        name: analysis.suggestedMood
      });
      setText("");
      setAnalysis(null);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-100 dark:border-purple-800/30">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="w-5 h-5 text-purple-600" />
          AI Mood Analyzer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Describe how you're feeling and I'll suggest a mood..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-[80px]"
        />
        
        <Button 
          onClick={analyzeMood}
          disabled={!text.trim() || isAnalyzing}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Analyze Mood
            </>
          )}
        </Button>

        {analysis && (
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-purple-200 dark:border-purple-700">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{analysis.emoji}</span>
                <span className="font-semibold">{analysis.suggestedMood}</span>
              </div>
              <Badge variant="secondary">
                {Math.round(analysis.confidence * 100)}% confident
              </Badge>
            </div>
            <Button 
              onClick={acceptSuggestion}
              size="sm"
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              Use This Mood
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
