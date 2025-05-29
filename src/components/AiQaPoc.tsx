"use client";

import React, { useState, FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label"; // For better accessibility

const AiQaPoc: React.FC = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!prompt.trim()) {
      setError("Please enter a question.");
      return;
    }

    setIsLoading(true);
    setResponse("");
    setError(null);

    try {
      const res = await fetch('/api/ai/qa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `API request failed with status ${res.status}`);
      }

      const data = await res.json();
      setResponse(data.response);

    } catch (err: any) {
      console.error("Error fetching AI response:", err);
      setError(err.message || "Failed to get a response from the AI.");
      setResponse(""); // Clear any previous successful response
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm max-w-md mx-auto space-y-4">
      <h2 className="text-xl font-semibold text-center">AI Q&A (Proof of Concept)</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="ai-prompt" className="block text-sm font-medium text-gray-700 mb-1">
            Ask a question about doors or windows:
          </Label>
          <Input
            id="ai-prompt"
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., What are the benefits of triple-pane windows?"
            disabled={isLoading}
            className="w-full"
          />
        </div>
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? 'Getting Answer...' : 'Ask AI'}
        </Button>
      </form>

      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {response && !error && (
        <div className="space-y-2 mt-4">
          <Label htmlFor="ai-response" className="block text-sm font-medium text-gray-700">
            AI Answer:
          </Label>
          <Textarea
            id="ai-response"
            value={response}
            readOnly
            rows={6}
            className="w-full bg-gray-50"
            placeholder="AI's answer will appear here..."
          />
        </div>
      )}
       {isLoading && !response && !error && (
        <div className="text-center py-4">
          <p>Loading...</p>
          {/* You could add a spinner here */}
        </div>
      )}
    </div>
  );
};

export default AiQaPoc;
