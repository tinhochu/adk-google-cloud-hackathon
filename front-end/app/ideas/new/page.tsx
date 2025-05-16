"use client";

import type React from "react";

import { useState } from "react";
import { ArrowLeft, Mic, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { VoiceRecorder } from "@/components/voice-recorder";

export default function NewIdeaPage() {
  const [inputMethod, setInputMethod] = useState<"voice" | "text">("voice");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agentStatus, setAgentStatus] = useState<{
    transcription: "pending" | "complete" | "error";
    scriptAgent: "pending" | "running" | "complete" | "error";
  }>({
    transcription: "pending",
    scriptAgent: "pending",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate agent processing
    setTimeout(() => {
      setAgentStatus((prev) => ({ ...prev, transcription: "complete" }));

      setTimeout(() => {
        setAgentStatus((prev) => ({ ...prev, scriptAgent: "running" }));
      }, 1000);
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-xl font-medium flex items-center gap-2">
          <span className="text-2xl">🎙️</span> New Content Idea
        </h1>
        <div className="w-20"></div> {/* Spacer for centering */}
      </header>

      <form onSubmit={handleSubmit}>
        {/* Step Indicator */}
        <div className="mb-6">
          <h2 className="text-lg font-medium">Step 1: Record or paste your idea</h2>
        </div>

        {/* Input Methods */}
        <div className="mb-8">
          <div className="flex gap-4 mb-4">
            <Button
              type="button"
              variant={inputMethod === "voice" ? "default" : "outline"}
              onClick={() => setInputMethod("voice")}
              className="flex-1"
            >
              <Mic className="mr-2 h-4 w-4" />
              Voice Recorder
            </Button>
            <Button
              type="button"
              variant={inputMethod === "text" ? "default" : "outline"}
              onClick={() => setInputMethod("text")}
              className="flex-1"
            >
              Text Input
            </Button>
          </div>

          {inputMethod === "voice" ? (
            <Card>
              <CardContent className="p-6">
                <VoiceRecorder />
              </CardContent>
            </Card>
          ) : (
            <Textarea placeholder="Paste your content idea here..." className="min-h-[150px]" />
          )}
        </div>

        {/* Optional Settings */}
        <div className="mb-8">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Optional:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="youtube">YouTube Shorts</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="funny">Funny, Gen Z</SelectItem>
                  <SelectItem value="motivational">Motivational</SelectItem>
                  <SelectItem value="educational">Educational</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <Button type="submit" size="lg" className="w-full mb-8" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Submit Idea"
          )}
        </Button>

        {/* Agent Status */}
        {isSubmitting && (
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <span>⏳</span> Agent Status:
            </h3>
            <div className="space-y-2">
              <div className="flex items-center">
                {agentStatus.transcription === "complete" ? (
                  <Badge variant="success" className="mr-2">
                    ✅
                  </Badge>
                ) : (
                  <Badge variant="outline" className="mr-2">
                    ⏳
                  </Badge>
                )}
                <span>Transcription {agentStatus.transcription === "complete" ? "complete" : "pending"}</span>
              </div>
              <div className="flex items-center">
                {agentStatus.scriptAgent === "running" ? (
                  <Badge variant="outline" className="mr-2 flex items-center">
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  </Badge>
                ) : (
                  <Badge variant="outline" className="mr-2">
                    ⏳
                  </Badge>
                )}
                <span>ScriptAgent {agentStatus.scriptAgent === "running" ? "running..." : "pending"}</span>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
