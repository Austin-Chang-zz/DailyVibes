
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface AIRecommendationsProps {
  currentMood?: string;
  currentNote?: string;
}

export function AIRecommendations({ currentMood, currentNote }: AIRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getRecommendations = async () => {
    if (!currentMood) return;

    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/ai/recommendations", {
        mood: currentMood,
        note: currentNote
      });
      const data = await response.json();
      setRecommendations(data.recommendations);
    } catch (error) {
      console.error("Failed to get recommendations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentMood) {
    return (
      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-100 dark:border-amber-800/30">
        <CardContent className="p-6 text-center">
          <Lightbulb className="w-8 h-8 text-amber-600 mx-auto mb-2" />
          <p className="text-gray-600 dark:text-gray-400">Select a mood to get AI-powered wellness recommendations</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-100 dark:border-amber-800/30">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Lightbulb className="w-5 h-5 text-amber-600" />
          Wellness Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.length === 0 ? (
          <Button 
            onClick={getRecommendations}
            disabled={isLoading}
            className="w-full bg-amber-600 hover:bg-amber-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Getting suggestions...
              </>
            ) : (
              <>
                <Lightbulb className="w-4 h-4 mr-2" />
                Get AI Recommendations
              </>
            )}
          </Button>
        ) : (
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <Badge 
                key={index}
                variant="secondary"
                className="w-full justify-start p-3 text-sm bg-white dark:bg-gray-800 border border-amber-200 dark:border-amber-700"
              >
                {rec}
              </Badge>
            ))}
            <Button 
              onClick={getRecommendations}
              variant="outline"
              size="sm"
              className="w-full mt-2"
            >
              Get new suggestions
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
