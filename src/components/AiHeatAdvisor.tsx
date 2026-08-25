import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Trash2, 
  Copy, 
  Check, 
  User, 
  Cpu, 
  Flame, 
  ShieldAlert, 
  AlertCircle, 
  MessageSquare,
  HelpCircle
} from 'lucide-react';
import { CityData, ChatMessage } from '../types';
import { generateClientAdvisorReply } from '../utils/clientFallbackAi';

interface AiHeatAdvisorProps {
  city: CityData;
}

export const AiHeatAdvisor: React.FC<AiHeatAdvisorProps> = ({ city }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: `Hello! I am your **HeatShield Climate Intelligence Advisor** for **${city.name}**.\n\nCurrent Thermal Telemetry:\n- **Ambient Temperature (2m)**: ${city.temperature}°C (Heat Index: **${city.heatIndex}°C**)\n- **AI Risk Level**: **${city.riskLevel}** (${city.riskScore}/100 score)\n- **Thermal Trend**: ${city.trend.explanation}\n\nHow can I assist your team with urban heat risk mitigation, cooling shelter deployment, energy grid load management, or public safety protocols?`,
      timestamp: 'Live',
      isAi: true,
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const presetQuestions = [
    `What should ${city.name} do if temperatures reach 45°C?`,
    `Which urban areas in ${city.name} need priority cooling?`,
    `How can we reduce heat-related power grid stress?`,
    `What urgent actions should the city take for outdoor workers?`,
    `How should schools prepare for an afternoon heatwave?`,
  ];

  // Scroll to bottom on message updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputValue.trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Build urban context payload
      const contextPayload = {
        cityName: city.name,
        country: city.country,
        temperature: city.temperature,
        humidity: city.humidity,
        heatIndex: city.heatIndex,
        riskLevel: city.riskLevel,
        riskScore: city.riskScore,
        trend: city.trend.direction,
        topZones: city.zones.map((z) => `${z.name} (${z.temp}°C - ${z.riskLevel})`),
        peakForecast: `${city.hourlyForecast[4]?.temp || 44}°C at 03:00 PM`,
      };

      // Extract conversation history
      const historyPayload = messages
        .filter((m) => m.id !== 'init-1' && !m.id.startsWith('init-'))
        .map((m) => ({
          sender: m.sender,
          text: m.text,
        }));

      let replyText = '';
      let sourceName = 'Gemini AI';
      let isAi = true;

      try {
        const res = await fetch('/api/gemini/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: query,
            history: historyPayload,
            context: contextPayload,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          replyText = data.reply || '';
          sourceName = data.source || 'Gemini 3.6 Flash';
          isAi = data.isAiConfigured !== false;
        } else {
          replyText = generateClientAdvisorReply(query, city);
          sourceName = 'HeatShield AI Engine (Client Offline/Static Mode)';
        }
      } catch (fetchErr) {
        console.warn('Backend API unreachable, using client AI intelligence engine:', fetchErr);
        replyText = generateClientAdvisorReply(query, city);
        sourceName = 'HeatShield AI Engine (Client Offline/Static Mode)';
      }

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: replyText || generateClientAdvisorReply(query, city),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: sourceName,
        isAi,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const fallbackReply = generateClientAdvisorReply(query, city);
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'HeatShield AI Engine (Client Fallback)',
        isAi: true,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    setMessages([
      {
        id: `init-${Date.now()}`,
        sender: 'assistant',
        text: `Chat reset. I am ready to provide fresh heat intelligence for **${city.name}** (${city.temperature}°C).`,
        timestamp: 'Live',
        isAi: true,
      },
    ]);
  };

  // Simple Markdown renderer helper for clean display
  const renderFormattedText = (text: string) => {
    return text.split('\n').map((line, idx) => {
      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} className="text-sm font-bold text-cyan-300 mt-2 mb-1">
            {line.replace('### ', '')}
          </h4>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h3 key={idx} className="text-base font-extrabold text-white mt-3 mb-1">
            {line.replace('## ', '')}
          </h3>
        );
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const item = line.substring(2);
        return (
          <li key={idx} className="ml-4 list-disc text-slate-200 my-0.5 leading-relaxed">
            {renderBoldTags(item)}
          </li>
        );
      }
      if (/^\d+\.\s/.test(line)) {
        return (
          <div key={idx} className="flex items-start space-x-2 my-1 text-slate-200">
            <span className="font-bold text-cyan-400 shrink-0">{line.match(/^\d+\./)?.[0]}</span>
            <span className="leading-relaxed">{renderBoldTags(line.replace(/^\d+\.\s*/, ''))}</span>
          </div>
        );
      }
      if (line.trim() === '') {
        return <div key={idx} className="h-1.5" />;
      }
      return (
        <p key={idx} className="text-slate-200 my-1 leading-relaxed">
          {renderBoldTags(line)}
        </p>
      );
    });
  };

  const renderBoldTags = (str: string) => {
    const parts = str.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="text-white font-semibold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <section id="ai-advisor" className="py-8 scroll-mt-20">
      <div className="rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border border-slate-800 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-5 bg-slate-900/90 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  HeatShield AI Advisor
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-700/60 flex items-center gap-1">
                  <Cpu className="w-3 h-3" />
                  Gemini 3.7 Flash
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Ask our AI about heat conditions, risks and possible responses for <span className="text-cyan-300 font-semibold">{city.name}</span>.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-end sm:self-auto">
            <button
              onClick={handleClear}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 text-xs transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Preset Prompt Chips */}
        <div className="px-6 py-3 bg-slate-950/60 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] font-bold text-slate-400 shrink-0 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            Suggested Inquiries:
          </span>
          {presetQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/20 hover:border-cyan-500/50 whitespace-nowrap transition-all shrink-0 shadow-sm"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Messages Feed */}
        <div className="p-6 h-[440px] overflow-y-auto space-y-4 bg-slate-950/40">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                    isUser
                      ? 'bg-blue-600 text-white'
                      : 'bg-cyan-950 border border-cyan-700/60 text-cyan-400'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-2xl rounded-2xl p-4 text-xs sm:text-sm shadow-md relative group ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-slate-900/90 border border-slate-800 text-slate-100 rounded-tl-none'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1 font-mono">
                    <div className="flex items-center space-x-1.5">
                      <span>{isUser ? 'You' : 'HeatShield AI Advisor'}</span>
                      {!isUser && msg.source && (
                        <span className="px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60 text-[9px]">
                          {msg.source}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>{msg.timestamp}</span>
                      {!isUser && (
                        <button
                          onClick={() => handleCopy(msg.id, msg.text)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:text-white"
                          title="Copy response"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="prose prose-invert max-w-none text-xs sm:text-sm">
                    {renderFormattedText(msg.text)}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-700/60 flex items-center justify-center text-cyan-400 shrink-0">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-none p-4 max-w-sm">
                <div className="flex items-center space-x-2 text-xs text-cyan-400 font-medium">
                  <div className="flex space-x-1">
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"></span>
                  </div>
                  <span>Reasoning over {city.name} temperature & microclimate telemetry...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-900/90 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-2"
          >
            <input
              id="ai-advisor-input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`Ask anything about heatwaves, risk management, schools or cooling in ${city.name}...`}
              disabled={isLoading}
              className="flex-1 bg-slate-950 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-all"
            />
            <button
              id="ai-advisor-send-btn"
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="px-5 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold rounded-xl shadow-md shadow-cyan-500/20 flex items-center space-x-1.5 transition-all text-xs sm:text-sm shrink-0"
            >
              <span>Ask AI</span>
              <Send className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 px-1">
            <span className="flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-slate-400" />
              General urban resilience advisory. Not for medical diagnosis.
            </span>
            <span className="font-mono text-[10px]">
              Active: {city.name} ({city.temperature}°C)
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
