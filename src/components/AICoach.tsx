import React, { useState, useRef, useEffect } from 'react';
import type { UserProfile, MacroGoals, ChatMessage } from '../types';
import { Bot, Send, Sparkles, User, Zap } from 'lucide-react';

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
        text: `Namaste ${profile.name || 'Fitness Enthusiast'}! 🙏 I am your NutriFit AI Personal Fitness & Nutrition Coach.\n\nI have analyzed your profile:\n• Goal: ${profile.goal.replace('_', ' ').toUpperCase()}\n• Daily Calorie Target: ${macroGoals.calories} kcal (${macroGoals.proteinGrams}g Protein)\n• Diet Type: ${profile.dietType.replace('_', ' ').toUpperCase()}\n\nHow can I help you crush your fitness goals today?`,
        timestamp: formatMessageTime(),
        suggestedActions: [
          'How can I get more protein on a veg diet?',
          'Suggest high protein Indian evening snacks',
          'Is Sattu better than Whey protein?',
          'How to reduce belly fat while building muscle?'
        ]
      }
    ];
  });

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('nutrifit_coach_chat', JSON.stringify(messages));
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const generateCoachResponse = (userText: string): { response: string; suggestions?: string[] } => {
    const query = userText.toLowerCase();

    if (query.includes('protein') && (query.includes('veg') || query.includes('vegetarian'))) {
      return {
        response: `Great question! Getting high protein on an Indian vegetarian diet is completely achievable. Here are top natural sources:\n\n1. 🥣 **Roasted Chana Sattu (Desi Whey):** 20.6g protein per 100g. Have 40g sattu drink daily for ~8g clean protein.\n2. 🧀 **Low-Fat Paneer / Tofu:** 100g paneer gives ~18g protein.\n3. 🌱 **Sprouted Moong & Black Chana:** Sprouting increases bioavailable amino acids and digestibility.\n4. 🥛 **Greek Yogurt / Hung Curd:** 100g contains ~10g protein.\n5. 🥛 **Amul High Protein Lassi/Milk:** Quick 15g-25g protein boost.\n\nYour target is **${macroGoals.proteinGrams}g protein/day**. Splitting it into 4 thali meals of ~${Math.round(macroGoals.proteinGrams / 4)}g each will maximize muscle protein synthesis!`,
        suggestions: ['Tell me about Sattu vs Whey', 'Show 7-day high protein thali plan', 'Best post-workout meal']
      };
    }

    if (query.includes('sattu') || query.includes('whey')) {
      return {
        response: ` Here is the direct comparison between **Desi Chana Sattu** and **Whey Protein**:\n\n• **Chana Sattu:** 100% natural, rich in complex carbs, dietary fiber (great for gut health), cooling for stomach, and budget-friendly. Gives ~20.6g protein per 100g.\n• **Whey Protein:** Fast-digesting isolated milk protein (~24g protein per 30g scoop), ultra-high leucine for fast post-gym recovery.\n\n💡 **Coach Recommendation:** Take Whey or Sattu post-workout, and drink Sattu salted sharbat during mid-morning for sustained energy!`,
        suggestions: ['Recommend supplements', 'How many calories should I eat?', 'Suggest fat loss tips']
      };
    }

    if (query.includes('belly fat') || query.includes('fat loss') || query.includes('lose weight')) {
      return {
        response: `To lose belly fat while retaining muscle mass, follow this **3-Step NutriFit Rule**:\n\n1. 🔥 **Calorie Deficit:** Stick strictly to your calculated target of **${macroGoals.calories} kcal/day** (a 20% deficit from maintenance).\n2. 🏋️ **High Protein:** Hit **${macroGoals.proteinGrams}g protein daily** to prevent muscle breakdown during weight loss.\n3. 👟 **10,000 Daily Steps:** Track your steps in our Strava Steps tab. Walking 10k steps burns 350-450 extra calories without spiking cortisol!`,
        suggestions: ['Start Strava steps tracker', 'Show my thali meal plan', 'Best evening snacks for weight loss']
      };
    }

    if (query.includes('snack') || query.includes('evening')) {
      return {
        response: `Here are 4 healthy, high-protein Indian evening snacks (~200 kcal):\n\n1. 🌰 **Roasted Makhana + 10 Almonds:** High fiber, crunchy & low calorie.\n2. 🥗 **Sprouted Moong Chaat:** 1 cup sprouted moong + lemon + chaat masala (~12g protein).\n3. 🍵 **High Protein Besan Chilla:** 1 besan chilla filled with 30g paneer (~14g protein).\n4. 🥚 **Boiled Egg Whites (3) / Grilled Paneer Tikka (100g).**`,
        suggestions: ['How to track steps?', 'What is intermittent fasting?', 'Calculate my BMI']
      };
    }

    if (query.includes('fasting') || query.includes('intermittent')) {
      return {
        response: `Intermittent Fasting (16:8 protocol) is fantastic for insulin sensitivity and fat oxidation!\n\n• **Eating Window:** 12:00 PM to 8:00 PM (Lunch, Snack, Dinner).\n• **Fasting Window:** 8:00 PM to 12:00 PM next day (Black coffee, green tea, water allowed).\n\nYou can use our built-in **Fasting Timer** tab to start your live fasting clock right now!`,
        suggestions: ['Open Fasting Timer', 'High protein lunch thali', 'How much water to drink?']
      };
    }

    // Default intelligent fallback based on user profile
    return {
      response: `I hear you! For your specific goal of **${profile.goal.replace('_', ' ').toUpperCase()}**, consistency with your thali macros is key.\n\nYour profile highlights:\n• Weight: ${profile.weightKg} kg | Height: ${profile.heightCm} cm\n• Calculated Target: **${macroGoals.calories} kcal** with **${macroGoals.proteinGrams}g Protein**\n\nMake sure to log your thali meals, drink at least ${Math.round(profile.weightKg * 45 / 1000)}L of water daily, and track your daily 10,000 steps!`,
      suggestions: ['Suggest high protein Indian snacks', 'How can I get more protein on a veg diet?', 'Is Sattu better than Whey protein?']
    };
  };

  const handleSendMessage = (textToSend?: string) => {
    const queryText = textToSend || input;
    if (!queryText.trim()) return;

    const userMsg: ChatMessage = {
      id: generateMessageId('user'),
      sender: 'user',
      text: queryText,
      timestamp: formatMessageTime()
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const botResult = generateCoachResponse(queryText);
      const coachMsg: ChatMessage = {
        id: generateMessageId('coach'),
        sender: 'coach',
        text: botResult.response,
        timestamp: formatMessageTime(),
        suggestedActions: botResult.suggestions
      };
      setMessages((prev) => [...prev, coachMsg]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-600 rounded-3xl p-6 text-white shadow-xl flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 flex items-center justify-center shrink-0 shadow-inner">
            <Bot className="w-8 h-8 text-amber-300 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">NutriFit AI Personal Coach</h1>
              <span className="px-2 py-0.5 bg-amber-400 text-slate-950 font-bold text-[10px] rounded-full">
                24/7 ONLINE 🇮🇳
              </span>
            </div>
            <p className="text-xs text-emerald-100 mt-0.5">
              Personalized Indian Diet, Macro Tuning, Workout & Fat Loss Advisor
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-2 bg-slate-950/30 px-3 py-1.5 rounded-xl border border-white/10 text-xs">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Calorie Target: <strong>{macroGoals.calories} kcal</strong></span>
        </div>
      </div>

      {/* Chat Messages Box */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4 min-h-[460px] max-h-[550px] flex flex-col justify-between">
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 text-white font-bold text-xs ${
                  msg.sender === 'user' ? 'bg-orange-500' : 'bg-emerald-600 border border-emerald-400/40'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>

              <div className="space-y-2 max-w-[82%]">
                <div
                  className={`p-4 rounded-3xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.sender === 'user'
                      ? 'bg-orange-600 text-white rounded-tr-none shadow-md'
                      : 'bg-slate-900 border border-slate-700/80 text-slate-100 rounded-tl-none shadow-md'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Suggested Action Pills */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {msg.suggestedActions.map((action, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(action)}
                        className="text-[11px] bg-slate-900/90 hover:bg-emerald-950 border border-emerald-500/40 text-emerald-300 hover:text-white px-3 py-1.5 rounded-full transition cursor-pointer flex items-center gap-1"
                      >
                        <Zap className="w-3 h-3 text-amber-400" /> {action}
                      </button>
                    ))}
                  </div>
                )}

                <span className="text-[10px] text-slate-400 block px-1">{msg.timestamp}</span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center space-x-2 text-slate-400 text-xs italic bg-slate-900/60 p-3 rounded-2xl w-fit border border-slate-800">
              <Bot className="w-4 h-4 text-emerald-400 animate-spin" />
              <span>NutriFit Coach is typing...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <div className="pt-3 border-t border-slate-700/80">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask coach anything (e.g. How to hit protein target on veg diet?)"
              className="flex-1 bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-2xl font-bold transition shadow-lg disabled:opacity-40 cursor-pointer"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
