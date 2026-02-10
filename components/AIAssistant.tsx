import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, BrainCircuit } from 'lucide-react';
import { generateAIResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

interface AIAssistantProps {
  mode?: 'student' | 'teacher';
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ mode = 'student' }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: mode === 'teacher' 
        ? 'Olá, colega professor! Como posso ajudar a preparar suas aulas, criar avaliações ou analisar o desempenho dos alunos hoje?' 
        : 'Olá! Sou seu assistente NeuroEdu+. Como posso ajudar nos seus estudos hoje?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const context = mode === 'teacher'
        ? "Você é um consultor pedagógico sênior especialista em neuroeducação e metodologias ativas. Ajude o professor a criar planos de aula, avaliações, rubricas e estratégias inclusivas."
        : "Você é um assistente educacional gentil, inclusivo e especialista para alunos.";

      const responseText = await generateAIResponse(input, context);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className={`p-4 text-white flex items-center gap-2 ${mode === 'teacher' ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : 'bg-gradient-to-r from-primary-600 to-secondary-600'}`}>
        {mode === 'teacher' ? <BrainCircuit className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
        <h3 className="font-bold">{mode === 'teacher' ? 'Assistente Pedagógico IA' : 'NeuroIA Mentor'}</h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.role === 'model' 
                ? (mode === 'teacher' ? 'bg-indigo-100 text-indigo-600' : 'bg-primary-100 text-primary-600') 
                : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
            }`}>
              {msg.role === 'model' ? <Bot size={18} /> : <User size={18} />}
            </div>
            <div className={`max-w-[80%] rounded-lg p-3 text-sm ${
              msg.role === 'user' 
                ? (mode === 'teacher' ? 'bg-indigo-600 text-white' : 'bg-primary-600 text-white')
                : 'bg-gray-100 dark:bg-gray-700 dark:text-gray-200'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${mode === 'teacher' ? 'bg-indigo-100 text-indigo-600' : 'bg-primary-100 text-primary-600'}`}>
              <Bot size={18} />
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
              <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={mode === 'teacher' ? "Ex: Crie um plano de aula sobre..." : "Pergunte sobre matemática, história..."}
            className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className={`${mode === 'teacher' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-primary-600 hover:bg-primary-700'} disabled:opacity-50 text-white rounded-full p-2 w-10 h-10 flex items-center justify-center transition-colors`}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};