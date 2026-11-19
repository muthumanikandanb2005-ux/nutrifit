import React, { useState, useRef, useEffect } from 'react';
import type { UserProfile, MacroGoals, ChatMessage } from '../types';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  RotateCcw
} from 'lucide-react';
import { haptic } from '../utils/haptics';

interface AICoachProps {
  profile: UserProfile;
  macroGoals: MacroGoals;
}

const generateMessageId = (prefix: string) => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
const formatMessageTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export const AICoach: React.FC<AICoachProps> = ({ profile, macroGoals }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('nutrifit_coach_chat');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* fallback */ }
    }
    return [
      {
        id: 'msg_init',
        sender: 'coach',
        text: `Namaste ${profile.name || 'Champion'}! I am your NutriFit AI Personal Indian Fitness & Nutrition Coach.\n\nI have calibrated your plan:\n- Body Type: ${(profile.bodyType || 'mesomorph').toUpperCase()}\n- Target: ${macroGoals.calories} kcal/day (${macroGoals.proteinGrams}g Protein)\n- Diet: ${profile.dietType.replace('_', ' ').toUpperCase()}\n\nWhat fitness or Indian food question can I help you with today?`,
        timestamp: formatMessageTime(),
        suggestedActions: [
          'How to hit 120g protein on pure veg Indian diet?',
          'Suggest high protein Indian evening snacks',
          'Is Sattu better than Whey protein?',
          'Roti vs Rice for fat loss?'
        ]
      }
    ];
  });

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('nutrifit_coach_chat', JSON.stringify(messages));
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const speakText = (msgId: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    if (speakingMsgId === msgId) {
      setSpeakingMsgId(null);
      return;
    }

    const cleanText = text.replace(/[*#_]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onstart = () => setSpeakingMsgId(msgId);
    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);

    window.speechSynthesis.speak(utterance);
    haptic.light();
  };

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  const generateCoachResponse = (userText: string): { response: string; suggestions?: string[] } => {
    const query = userText.toLowerCase();

    if (query.includes('protein') && (query.includes('veg') || query.includes('vegetarian'))) {
      return {
        response: `Hitting ${macroGoals.proteinGrams}g protein purely vegetarian in India is straightforward with smart combinations:\n\n1. **Roasted Chana Sattu (Desi Whey):** 20.6g protein per 100g. 1 glass in the morning gives 8-10g clean protein.\n2. **Low-Fat Paneer / Tofu:** 100g paneer provides ~18g protein. Grill with chaat masala.\n3. **Sprouted Moong & Kala Chana:** Sprouting unlocks active B-vitamins and improves amino acid absorption.\n4. **Curd / Hung Curd:** 100g contains ~8-10g protein.\n5. **Soya Chunks (in moderation):** 52g protein per 100g.\n\nSplit your ${macroGoals.proteinGrams}g target into 4 thalis of ~${Math.round(macroGoals.proteinGrams / 4)}g each to maximize muscle protein synthesis!`,
        suggestions: ['Sattu vs Whey comparison', 'Show high-protein thali recipes', 'Best post-workout meal']
      };
    }

    if (query.includes('sattu') || query.includes('whey')) {
      return {
        response: `**Sattu vs Whey Protein Breakdown:**\n\n- **Roasted Chana Sattu:** Unrefined whole food. Provides 20.6g protein, 10g prebiotic fiber, iron, and magnesium per 100g. It is naturally cooling and easy on digestion.\n- **Whey Protein:** Fast-digesting isolated dairy protein (24-27g pure protein per 30g scoop). Higher leucine for rapid post-workout muscle synthesis.\n\n**Verdict:** Whey is ideal immediately post-resistance training, while Sattu is the ultimate natural daytime beverage for sustained satiety and gut health!`,
        suggestions: ['How to prepare Sattu drink', 'Pre-workout Indian meal', 'Tell me about creatine']
      };
    }

    if (query.includes('rice') || query.includes('roti') || query.includes('carb')) {
      return {
        response: `**Roti vs Rice for Weight Management:**\n\n- **1 Medium Phulka Roti (30g flour):** ~85-90 kcal, 3g protein, 2g fiber. Digested slower due to fiber.\n- **1 Katori Cooked White Rice (150g):** ~180 kcal, 4g protein, 0.5g fiber. Higher Glycemic Index (faster insulin response).\n\n**Pro-Tip for Indian Diets:** You don't have to quit rice! Switch to Brown/Parboiled Basmati rice, and always eat your dal, sabzi, or paneer **first**, then eat the rice. This blunts the blood sugar spike by up to 35%!`,
        suggestions: ['Can I eat rice at dinner?', 'Best low-calorie snacks', 'Daily calorie deficit tip']
      };
    }

    if (query.includes('snack') || query.includes('evening') || query.includes('craving')) {
      return {
        response: `**Top 4 Clean Indian Fitness Snacks (Under 200 kcal):**\n\n1. **Roasted Phool Makhana:** 1 cup roasted in 1/2 tsp ghee with rock salt & turmeric (~110 kcal, 3g protein).\n2. **Boiled Sprouted Chana Chaat:** With chopped onion, tomato, lemon, and chaat masala (~140 kcal, 7g protein, high fiber).\n3. **Masala Buttermilk (Chaas):** 250ml curd with ginger, mint, jeera (~60 kcal, 4g protein, super refreshing).\n4. **Roasted Peanuts with Jaggery (Gur):** 20g portion for clean healthy fats and magnesium (~115 kcal).`,
        suggestions: ['How to stop night cravings', 'Is fruit good at night?', 'Weekly meal plan']
      };
    }

    // Default intelligent coach response
    return {
      response: `Excellent question! For your **${(profile.bodyType || 'mesomorph').toUpperCase()}** body type with a goal of **${profile.goal.replace('_', ' ').toUpperCase()}**, consistency is key.\n\nYour calculated target is **${macroGoals.calories} kcal** with **${macroGoals.proteinGrams}g protein**. Ensure your meals prioritize whole lentils, fiber-rich vegetables, and clean hydration.\n\nWould you like me to tailor a specific dish or swap one of your meals today?`,
      suggestions: ['Swap today lunch thali', 'Explain my body type macros', 'Tips for workout recovery']
    };
  };

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    haptic.light();
    const userMsg: ChatMessage = {
      id: generateMessageId('usr'),
      sender: 'user',
      text: query,
      timestamp: formatMessageTime()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const { response, suggestions } = generateCoachResponse(query);
      const botMsg: ChatMessage = {
        id: generateMessageId('bot'),
        sender: 'coach',
        text: response,
        timestamp: formatMessageTime(),
        suggestedActions: suggestions
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
      haptic.success();
    }, 600);
  };

  const resetChat = () => {
    localStorage.removeItem('nutrifit_coach_chat');
    window.location.reload();
  };

  return (
    <div className="flex flex-col h-[75vh] max-h-[750px] bg-white dark:bg-[#1C1511] rounded-3xl border border-[#EEDEC1] dark:border-[#3A291E] shadow-xs overflow-hidden">
      
      {/* Coach Header */}
      <div className="p-4 border-b border-[#EEDEC1] dark:border-[#3A291E] flex items-center justify-between bg-[#f8faf8] dark:bg-[#19120E]">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-[#EA580C] text-white flex items-center justify-center shadow-xs">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="w-3 h-3 rounded-full bg-amber-500 border-2 border-white dark:border-[#19120E] absolute -bottom-0.5 -right-0.5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center space-x-1.5">
              <span>NutriFit AI Coach</span>
              <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-[#FEF3C7] dark:bg-[#261B14] text-[#9A3412] dark:text-[#FED7AA] font-bold">
                Desi Nutritionist
              </span>
            </h3>
            <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
              Calibrated for {macroGoals.calories} kcal • {macroGoals.proteinGrams}g Protein
            </p>
          </div>
        </div>

        <button
          onClick={resetChat}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
          title="Reset Chat"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const isSpeakingThis = speakingMsgId === msg.id;

          return (
            <div 
              key={msg.id} 
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5 max-w-[90%] sm:max-w-[80%] ${isUser ? 'ml-auto' : 'mr-auto'}`}
            >
              <div 
                className={`p-4 rounded-3xl text-sm leading-relaxed ${
                  isUser 
                    ? 'bg-[#EA580C] text-white rounded-tr-sm shadow-xs' 
                    : 'bg-[#FFFBF5] dark:bg-[#261B14] text-slate-800 dark:text-slate-200 border border-[#FED7AA] dark:border-[#293d2e] rounded-tl-sm shadow-xs'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {/* Voice speech toggle for bot responses */}
                {!isUser && (
                  <div className="mt-2.5 pt-2 border-t border-[#FED7AA]/60 dark:border-[#293d2e] flex items-center justify-between text-xs">
                    <span className="text-[10px] text-slate-700 dark:text-slate-300 font-medium">{msg.timestamp}</span>
                    <button
                      onClick={() => speakText(msg.id, msg.text)}
                      className="flex items-center space-x-1 text-[#9A3412] dark:text-[#FED7AA] font-bold font-bold text-[11px] hover:underline cursor-pointer"
                    >
                      {isSpeakingThis ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                          <span className="text-rose-500">Mute Voice</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Listen (Audio)</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Action Chips */}
              {!isUser && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {msg.suggestedActions.map((action, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(action)}
                      className="px-2.5 py-1 rounded-full bg-white dark:bg-[#231811] border border-[#EEDEC1] dark:border-[#3A291E] text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:border-[#EA580C] hover:text-[#EA580C] transition cursor-pointer shadow-2xs"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center space-x-2 text-xs text-slate-700 dark:text-slate-300 font-medium p-2 bg-[#FFFBF5] dark:bg-[#261B14] rounded-2xl w-fit">
            <Sparkles className="w-3.5 h-3.5 text-[#EA580C] animate-spin" />
            <span>AI Coach is thinking...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Dock */}
      <form 
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        className="p-3 border-t border-[#EEDEC1] dark:border-[#3A291E] bg-[#f8faf8] dark:bg-[#19120E] flex items-center space-x-2"
      >
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything (e.g. 50g protein dinner, sattu, weight loss)..."
          className="flex-1 bg-white dark:bg-[#231811] border border-[#EEDEC1] dark:border-[#3A291E] text-slate-900 dark:text-white rounded-2xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-[#EA580C]"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="w-10 h-10 rounded-2xl bg-[#EA580C] hover:bg-[#C2410C] disabled:opacity-40 text-white flex items-center justify-center transition shadow-xs cursor-pointer active:scale-95"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};
