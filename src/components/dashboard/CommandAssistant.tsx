"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Sparkles, X, CheckCircle2 } from "lucide-react";
import useWebSocket from "react-use-websocket";
import { apiFetch } from "@/lib/api";
import { WS_BASE_URL } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function CommandAssistant() {
  const [query, setQuery] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  // Listen for WebSocket updates
  const { lastJsonMessage } = useWebSocket(`${WS_BASE_URL}/dashboard/`, {
    share: true,
    shouldReconnect: () => true,
  });

  useEffect(() => {
    if (lastJsonMessage) {
      const data = lastJsonMessage as any;
      if (data.type === 'ai_response') {
        setAiResponse(data.message);
        setIsThinking(false);
      } else if (data.type === 'ai_error') {
        setAiResponse(`Error: ${data.message}`);
        setIsThinking(false);
      }
    }
  }, [lastJsonMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsThinking(true);
    setAiResponse(null);
    try {
      await apiFetch<any>('/agent-query/', {
        method: "POST",
        body: JSON.stringify({ query }),
      });
      // The backend returns 202 instantly, and processes in the background.
    } catch (err: any) {
      setAiResponse(`Error: ${err.message || "Failed to connect to AI Orchestrator."}`);
      setIsThinking(false);
    } finally {
      setQuery("");
    }
  };

  return (
    <div className="relative h-full w-full flex items-center">
      <div role="search" aria-label="AI Copilot query" className="glass-card w-full flex items-center gap-2 px-3 py-2 relative">
        <form onSubmit={handleSubmit} className="relative flex items-center group w-full">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Command Orchestrator (e.g. 'Evacuate Sector N1')"
          disabled={isThinking}
          className="w-full h-10 bg-black/40 border border-white/10 rounded-full pl-4 pr-12 text-sm text-white/90 placeholder-white/30 outline-none focus:border-purple-500/50 focus-visible:ring-2 focus-visible:ring-purple-500 transition-colors shadow-inner disabled:opacity-50"
        />
        <button 
          type="submit"
          disabled={!query.trim() || isThinking}
          aria-label="Send query to Orchestrator"
          className="absolute right-1 w-8 h-8 flex items-center justify-center rounded-full bg-purple-600 hover:bg-purple-500 text-white transition-colors disabled:opacity-50 disabled:hover:bg-purple-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
        >
          <Send size={14} className="ml-0.5" aria-hidden="true" />
        </button>
      </form>

      {/* Thinking state / Response Modal */}
      <AnimatePresence>
        {(isThinking || aiResponse) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute bottom-full left-0 right-0 mb-4 bg-[#0a0a10] border border-purple-500/30 rounded-xl p-4 shadow-[0_0_20px_rgba(168,85,247,0.15)] z-50 max-h-[300px] overflow-y-auto"
          >
            {isThinking ? (
              <div className="flex items-center gap-3 text-purple-400">
                <Sparkles size={16} className="animate-pulse" />
                <span className="text-sm font-mono tracking-wider animate-pulse">Orchestrator is thinking...</span>
              </div>
            ) : (
              <div className="relative">
                <button 
                  onClick={() => setAiResponse(null)}
                  aria-label="Close response"
                  className="absolute -top-1 -right-1 text-white/40 hover:text-white/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-sm"
                >
                  <X size={16} aria-hidden="true" />
                </button>
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-purple-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-white/90 leading-relaxed whitespace-pre-wrap">{aiResponse}</p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}
