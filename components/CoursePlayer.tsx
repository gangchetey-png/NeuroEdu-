import React, { useState } from 'react';
import { Course } from '../types';
import { Play, CheckCircle, BrainCircuit } from 'lucide-react';
import { generateAIResponse } from '../services/geminiService';

interface CoursePlayerProps {
  course: Course;
  onClose: () => void;
  onComplete: () => void;
}

export const CoursePlayer: React.FC<CoursePlayerProps> = ({ course, onClose, onComplete }) => {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerateSummary = async () => {
    setLoading(true);
    const text = await generateAIResponse(`Resuma o tópico: ${course.title} para um estudante.`, "Você é um professor explicativo.");
    setSummary(text);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="aspect-video bg-gray-900 rounded-xl flex items-center justify-center relative overflow-hidden group shadow-inner">
         {course.videoUrl ? (
           <iframe 
             width="100%" 
             height="100%" 
             src={course.videoUrl} 
             title={course.title} 
             frameBorder="0" 
             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
             allowFullScreen
             className="w-full h-full rounded-xl"
           ></iframe>
         ) : (
           <>
             <img src={course.imageUrl} className="w-full h-full object-cover opacity-50" alt="Aula" />
             <div className="absolute inset-0 flex items-center justify-center">
                 <p className="text-white font-bold bg-black/50 px-4 py-2 rounded-lg">Vídeo não disponível</p>
             </div>
           </>
         )}
      </div>

      <div>
        <h2 className="text-2xl font-bold dark:text-white mb-2">{course.title}</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Nesta aula, vamos explorar os conceitos fundamentais de {course.category}. O conteúdo foi adaptado para seu ritmo de aprendizado.
        </p>
      </div>

      {!summary && (
          <button 
            onClick={handleGenerateSummary}
            disabled={loading}
            className="w-full py-3 rounded-lg border-2 border-dashed border-primary-300 dark:border-primary-700 text-primary-600 dark:text-primary-400 font-medium hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors flex items-center justify-center gap-2"
          >
            <BrainCircuit size={20} />
            {loading ? 'Gerando resumo com IA...' : 'Gerar resumo da aula com IA'}
          </button>
      )}

      {summary && (
        <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-xl border border-primary-100 dark:border-primary-800 text-sm dark:text-gray-200 animate-fade-in">
            <h4 className="font-bold mb-2 flex items-center gap-2 text-primary-700 dark:text-primary-300 border-b border-primary-200 dark:border-primary-800 pb-2">
                <BrainCircuit size={16}/> Resumo Inteligente
            </h4>
            <div className="leading-relaxed whitespace-pre-line">{summary}</div>
        </div>
      )}

      <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
        <button onClick={onClose} className="flex-1 py-3 px-4 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Fechar
        </button>
        <button onClick={onComplete} className="flex-1 py-3 px-4 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95">
            <CheckCircle size={20} /> Concluir Aula (+50 XP)
        </button>
      </div>
    </div>
  );
};