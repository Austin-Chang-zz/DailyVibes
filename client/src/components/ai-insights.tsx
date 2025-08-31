
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Refresh, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export function AIInsights() {
  const [refreshKey, setRefreshKey] = useState(0);

  const { data: insights, isLoading, refetch } = useQuery({
    queryKey: ["/api/ai/insights", refreshKey],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/ai/insights");
      const data = await response.json();
      return data.insights;
    },
  });

  const refreshInsights = () => {
    setRefreshKey(prev => prev + 1);
    refetch();
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-100 dark:border-blue-800/30">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Brain className="w-5 h-5 text-blue-600" />
            AI Insights
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={refreshInsights}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Refresh className="w-4 h-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-pulse bg-gray-100 dark:bg-gray-700 rounded-lg h-24 w-full" />
          </div>
        ) : (
          <div className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300">
            <p className="leading-relaxed">{insights}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
