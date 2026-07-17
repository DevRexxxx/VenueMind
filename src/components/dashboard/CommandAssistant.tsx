"use client";

import { useState } from "react";
import { Send, Sparkles } from "lucide-react";

export function CommandAssistant() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/agent-query/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.response); // Simple for now
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch {
      alert("Failed to connect to AI Orchestrator.");
    } finally {
      setIsLoading(false);
      setQuery("");
    }
  };

  return (
    <div className="relative h-full w-full flex items-center">
      <div className="glass-card w-full flex items-center gap-2 px-3 py-2 relative">
        <Sparkles size={14} className="text-[#3b82f6] shrink-0" />
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="Ask AI Copilot..."
          className="flex-1 bg-transparent text-[11px] focus:outline-none placeholder:text-white/25 text-white/80"
        />
        <button 
          onClick={handleSubmit}
          disabled={isLoading}
          className="p-1.5 bg-[#3b82f6] hover:bg-[#3b82f6]/80 disabled:opacity-50 text-white rounded-lg transition-colors shadow-[0_0_10px_rgba(59,130,246,0.3)] shrink-0"
        >
          <Send size={12} />
        </button>
      </div>
    </div>
  );
}

