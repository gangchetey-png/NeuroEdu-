
import React, { useState, useEffect } from 'react';
import { 
  PlayCircle, Trophy, BarChart2, BookOpen, Clock, Target, Zap, 
  StickyNote, Award, Plus, Trash2, RefreshCw, LayoutDashboard, 
  Gem, Check, Crown, Calendar, FolderOpen, PenTool, Bot, 
  Settings, Bell, Search, Menu, X, ChevronRight, Star, LogOut,
  BrainCircuit, Download, Upload, AlertTriangle, ArrowUpRight, GraduationCap,
  CheckCircle, XCircle, FileText, Video, ArrowLeft, Timer, Pause, Play, Lock, Book, User as UserIcon,
  School, Handshake, Heart, MapPin, Mail, Phone, Sparkles, Filter
} from 'lucide-react';
import { Course, User, UpdateUserFn, Flashcard, Note, Badge, UniversityMentor } from '../types';
import { AIAssistant } from './AIAssistant';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from 'recharts';
import { Modal } from './Modal';
import { CoursePlayer } from './CoursePlayer';
import { generateStudyFlashcards, generateAIResponse } from '../services/geminiService';

// --- MOCK DATA ---
const mockCourses: Course[] = [
  { 
    id: '1', 
    title: 'Matemática: Álgebra Básica', 
    progress: 75, 
    category: 'Exatas', 
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80',
    videoUrl: 'https://www.youtube.com/embed/NybHckSEQBI'
  },
  { 
    id: '2', 
    title: 'História do Brasil: Descobrimento', 
    progress: 30, 
    category: 'Humanas', 
    imageUrl: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=600&q=80',
    videoUrl: 'https://www.youtube.com/embed/8XkH1NydrMc'
  },
  { 
    id: '3', 
    title: 'Física: Leis de Newton', 
    progress: 10, 
    category: 'Exatas', 
    imageUrl: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=600&q=80',
    videoUrl: 'https://www.youtube.com/embed/kKKM8Y-u7ds'
  },
  { 
    id: '4', 
    title: 'Química Orgânica: Introdução', 
    progress: 0, 
    category: 'Exatas', 
    imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80',
    videoUrl: 'https://www.youtube.com/embed/UloIw7dhnlQ'
  },
];

const mockQuizzes = [
  {
    id: 1,
    title: 'Geografia: Capitais do Brasil',
    level: 'Fácil',
    questions: [
      { id: 1, text: 'Qual a capital da Bahia?', options: ['Recife', 'Salvador', 'Fortaleza', 'Maceió'], correct: 1 },
      { id: 2, text: 'Qual a capital do Amazonas?', options: ['Belém', 'Rio Branco', 'Manaus', 'Macapá'], correct: 2 },
      { id: 3, text: 'Qual a capital do Paraná?', options: ['Curitiba', 'Florianópolis', 'Porto Alegre', 'Londrina'], correct: 0 },
    ],
    xp: 50
  },
  {
    id: 2,
    title: 'Ciências: O Corpo Humano',
    level: 'Fácil',
    questions: [
      { id: 1, text: 'Qual órgão bombeia o sangue?', options: ['Fígado', 'Pulmão', 'Coração', 'Estômago'], correct: 2 },
      { id: 2, text: 'Quantos dentes tem um adulto (normalmente)?', options: ['28', '30', '32', '34'], correct: 2 },
      { id: 3, text: 'Qual o maior órgão do corpo humano?', options: ['Intestino', 'Pele', 'Cérebro', 'Fêmur'], correct: 1 },
    ],
    xp: 75
  },
  {
    id: 3,
    title: 'História: Revolução Francesa',
    level: 'Médio',
    questions: [
      { id: 1, text: 'Em que ano iniciou a Revolução Francesa?', options: ['1789', '1500', '1945', '1822'], correct: 0 },
      { id: 2, text: 'Qual era o lema da revolução?', options: ['Deus, Pátria e Família', 'Liberdade, Igualdade e Fraternidade', 'Ordem e Progresso', 'Paz e Amor'], correct: 1 },
      { id: 3, text: 'Qual rei foi guilhotinado?', options: ['Luis XIV', 'Luis XV', 'Luis XVI', 'Napoleão'], correct: 2 },
    ],
    xp: 150
  },
  {
    id: 4,
    title: 'Matemática: Geometria Plana',
    level: 'Médio',
    questions: [
      { id: 1, text: 'Qual a soma dos ângulos internos de um triângulo?', options: ['180°', '360°', '90°', '270°'], correct: 0 },
      { id: 2, text: 'Como se calcula a área de um quadrado de lado L?', options: ['2L', 'L + L', 'L²', '4L'], correct: 2 },
      { id: 3, text: 'O que é um triângulo isósceles?', options: ['3 lados iguais', '2 lados iguais', 'Nenhum lado igual', 'Tem um ângulo reto'], correct: 1 },
    ],
    xp: 200
  },
  {
    id: 5,
    title: 'Química: Tabela Periódica',
    level: 'Médio',
    questions: [
      { id: 1, text: 'Qual o símbolo do Ouro?', options: ['Ou', 'Ag', 'Fe', 'Au'], correct: 3 },
      { id: 2, text: 'O elemento "O" corresponde a:', options: ['Osmio', 'Oxigênio', 'Ouro', 'Óleo'], correct: 1 },
      { id: 3, text: 'Qual é o número atômico do Hidrogênio?', options: ['1', '2', '10', '12'], correct: 0 },
    ],
    xp: 220
  },
  {
    id: 6,
    title: 'Física: Termodinâmica',
    level: 'Difícil',
    questions: [
      { id: 1, text: 'A Primeira Lei da Termodinâmica trata da conservação de:', options: ['Massa', 'Energia', 'Momento', 'Carga'], correct: 1 },
      { id: 2, text: 'O zero absoluto corresponde a aproximadamente:', options: ['0°C', '-100°C', '-273,15°C', '-400°F'], correct: 2 },
      { id: 3, text: 'Em uma expansão adiabática, o que acontece?', options: ['Troca calor constante', 'Não há troca de calor', 'Temperatura constante', 'Volume constante'], correct: 1 },
    ],
    xp: 400
  },
  {
    id: 7,
    title: 'Literatura: Modernismo',
    level: 'Difícil',
    questions: [
      { id: 1, text: 'Qual evento marcou o início do Modernismo no Brasil?', options: ['Semana de 22', 'Independência', 'Descobrimento', 'Guerra do Paraguai'], correct: 0 },
      { id: 2, text: 'Quem escreveu "Macunaíma"?', options: ['Machado de Assis', 'Mário de Andrade', 'Oswald de Andrade', 'Clarice Lispector'], correct: 1 },
      { id: 3, text: 'Qual característica NÃO pertence ao Modernismo?', options: ['Verso livre', 'Linguagem coloquial', 'Rigor métrico parnasiano', 'Nacionalismo crítico'], correct: 2 },
    ],
    xp: 450
  },
  {
    id: 8,
    title: 'Matemática: Logaritmos',
    level: 'Difícil',
    questions: [
      { id: 1, text: 'Qual o valor de log de 1000 na base 10?', options: ['10', '100', '3', '4'], correct: 2 },
      { id: 2, text: 'Se log2(x) = 5, qual o valor de x?', options: ['10', '25', '32', '64'], correct: 2 },
      { id: 3, text: 'Logaritmo de 1 em qualquer base é:', options: ['1', '0', 'A base', 'Indefinido'], correct: 1 },
    ],
    xp: 500
  }
];

const mockMaterials = [
  { 
    id: 1, 
    name: 'Apostila Completa de História.pdf', 
    type: 'PDF', 
    content: `Conteúdo de exemplo do PDF...` 
  },
  { 
    id: 2, 
    name: 'Resumão Leis de Newton.pdf', 
    type: 'PDF', 
    content: `Conteúdo de Física...` 
  },
  { 
    id: 3, 
    name: 'Aula Extra: Geometria Espacial', 
    type: 'Video', 
    url: 'https://www.youtube.com/embed/CMwQe8jYpXs'
  },
  { 
    id: 4, 
    name: 'Documentário: O Universo', 
    type: 'Video', 
    url: 'https://www.youtube.com/embed/libKVRa01L8'
  }
];

const mockMentors: UniversityMentor[] = [
  {
    id: '1',
    name: 'Lucas Ferreira',
    university: 'USP',
    course: 'Licenciatura em Física',
    subjects: ['Física', 'Matemática'],
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
    rating: 4.9,
    availableSlots: ['Hoje, 14:00', 'Amanhã, 10:00']
  },
  {
    id: '2',
    name: 'Mariana Costa',
    university: 'Unicamp',
    course: 'Pedagogia',
    subjects: ['Alfabetização', 'História'],
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    rating: 5.0,
    availableSlots: ['Hoje, 16:00', 'Sexta, 14:00']
  },
  {
    id: '3',
    name: 'Gabriel Souza',
    university: 'UFRJ',
    course: 'Letras - Inglês',
    subjects: ['Inglês', 'Português'],
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    rating: 4.8,
    availableSlots: ['Amanhã, 19:00']
  }
];

const allUniversities = ['USP', 'UNICAMP', 'UFRJ', 'UNESP', 'PUC', 'UFMG', 'UFRGS', 'UNB', 'UFBA', 'UFC'];

const mockMentorshipSessions = [
    { id: 1, title: 'Técnicas de Estudo Avançado', mentor: 'Dr. Roberto Alves', date: 'Terça, 19:00', slots: 5 },
    { id: 2, title: 'Matemática para o ENEM', mentor: 'Prof. Julia Ramos', date: 'Quarta, 18:30', slots: 12 },
    { id: 3, title: 'Redação Nota 1000', mentor: 'Prof. Carlos Drummond', date: 'Sexta, 20:00', slots: 2 },
];

const mockCertificates = [
    { id: 1, course: 'Matemática Básica', date: '12/08/2024', status: 'issued', url: '#' },
    { id: 2, course: 'História do Brasil', date: '-', status: 'progress', url: '#' },
    { id: 3, course: 'Física Clássica', date: '-', status: 'locked', url: '#' },
];

const weeklyStats = [
  { name: 'Seg', hours: 2, xp: 150 },
  { name: 'Ter', hours: 3.5, xp: 300 },
  { name: 'Qua', hours: 1.5, xp: 100 },
  { name: 'Qui', hours: 4, xp: 450 },
  { name: 'Sex', hours: 3, xp: 200 },
  { name: 'Sab', hours: 1, xp: 50 },
  { name: 'Dom', hours: 0.5, xp: 20 },
];

const monthlyStats = [
  { name: 'Sem 1', hours: 12, xp: 1250 },
  { name: 'Sem 2', hours: 15, xp: 1600 },
  { name: 'Sem 3', hours: 10, xp: 900 },
  { name: 'Sem 4', hours: 18, xp: 2100 },
];

const initialAgenda = [
  { id: 1, title: 'Prova de Matemática', date: '15/10', type: 'exam' },
  { id: 2, title: 'Trabalho de História', date: '18/10', type: 'task' },
  { id: 3, title: 'Revisão Física', date: 'Hoje', type: 'study' },
];

// --- Sub-components ---
const PomodoroTimer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      alert(mode === 'work' ? "Hora do intervalo!" : "Hora de focar!");
      setMode(mode === 'work' ? 'break' : 'work');
      setTimeLeft(mode === 'work' ? 5 * 60 : 25 * 60);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(25 * 60);
    setMode('work');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 dark:border-gray-700/50">
       <div className="flex items-center justify-between mb-4">
         <h4 className="font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2">
           <Timer className="w-5 h-5 text-primary-500" /> Modo Foco
         </h4>
         <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${mode === 'work' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
           {mode === 'work' ? 'Trabalho' : 'Descanso'}
         </span>
       </div>
       <div className="text-4xl font-mono font-bold text-center text-gray-900 dark:text-white my-4 tracking-wider">
         {formatTime(timeLeft)}
       </div>
       <div className="flex justify-center gap-3">
         <button onClick={toggleTimer} className="p-3 rounded-full bg-primary-600 text-white hover:bg-primary-700 shadow-lg hover:shadow-primary-500/30 transition-all hover:scale-105">
           {isActive ? <Pause size={20} /> : <Play size={20} />}
         </button>
         <button onClick={resetTimer} className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 transition-colors">
           <RefreshCw size={20} />
         </button>
       </div>
    </div>
  );
}

interface StudentDashboardProps {
  user: User;
  updateUser: UpdateUserFn;
  onLogout: () => void;
}

type MenuSection = 'dashboard' | 'paths' | 'exercises' | 'ai' | 'performance' | 'gamification' | 'agenda' | 'materials' | 'vip' | 'settings' | 'partnerships';

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, updateUser, onLogout }) => {
  const [activeSection, setActiveSection] = useState<MenuSection>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [difficultyFilter, setDifficultyFilter] = useState<'Todos' | 'Fácil' | 'Médio' | 'Difícil'>('Todos');
  
  // Flashcards & Notes States
  const [flashcardsTopic, setFlashcardsTopic] = useState('');
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [fcLoading, setFcLoading] = useState(false);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  
  // Quiz States
  const [activeQuiz, setActiveQuiz] = useState<any>(null);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizResult, setQuizResult] = useState<{score: number, total: number} | null>(null);
  const [customQuizLoading, setCustomQuizLoading] = useState(false);
  const [customQuizTopic, setCustomQuizTopic] = useState('');

  // Material Viewer States
  const [viewingMaterial, setViewingMaterial] = useState<any>(null);

  // VIP Interactive States
  const [showMentorshipModal, setShowMentorshipModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [viewingCertificate, setViewingCertificate] = useState<any>(null);

  // Partnerships & University States
  const [showAllUniversities, setShowAllUniversities] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<UniversityMentor | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [showVolunteerModal, setShowVolunteerModal] = useState(false);

  // Performance State
  const [perfPeriod, setPerfPeriod] = useState<'week' | 'month'>('week');

  // Permissions
  const canAccessPro = user.vipPlan === 'pro' || user.vipPlan === 'premium';
  const canAccessPremium = user.vipPlan === 'premium';

  // Navigation Items
  const menuItems = [
    { id: 'dashboard', label: 'Início', icon: <LayoutDashboard size={20} /> },
    { id: 'paths', label: 'Trilhas', icon: <BookOpen size={20} /> },
    { id: 'exercises', label: 'Exercícios', icon: <PenTool size={20} /> },
    { id: 'ai', label: 'Assistente IA', icon: <Bot size={20} /> },
    { id: 'partnerships', label: 'Universitários', icon: <Handshake size={20} /> },
    { id: 'performance', label: 'Desempenho', icon: <BarChart2 size={20} /> },
    { id: 'agenda', label: 'Agenda', icon: <Calendar size={20} /> },
    { id: 'materials', label: 'Materiais', icon: <FolderOpen size={20} /> },
    { id: 'vip', label: 'Área VIP', icon: <Gem size={20} />, special: true },
  ];

  // --- LOGIC HANDLERS ---
  const handleCourseClick = (course: Course, index: number) => {
    // Basic plan limited to 2 courses
    if (user.vipPlan === 'basic' && index >= 2) {
        if(confirm("🔒 Conteúdo Bloqueado\n\nEste curso é exclusivo para assinantes Pro e Premium. Deseja ver os planos?")) {
            setActiveSection('vip');
        }
        return;
    }
    setSelectedCourse(course);
  }

  const handlePeriodChange = (period: 'week' | 'month') => {
      if (period === 'month' && !canAccessPro) {
        if(confirm("🔒 A análise mensal é exclusiva para planos Pro. Deseja fazer upgrade?")) {
            setActiveSection('vip');
        }
        return;
      }
      setPerfPeriod(period);
  }

  const handleCompleteLesson = () => {
    updateUser({ 
      points: user.points + 50,
      level: Math.floor((user.points + 50) / 1000) + 1
    });
    setSelectedCourse(null);
    setTimeout(() => alert(`Aula concluída! +50 XP 🚀`), 100);
  };

  const handleOpenBooking = (mentor: UniversityMentor) => {
      setSelectedMentor(mentor);
      setSelectedSlot(null);
  };

  const handleConfirmBooking = () => {
      if (!selectedSlot || !selectedMentor) return;

      if (user.points < 50) {
          alert("Você precisa de 50 XP para agendar uma aula! Continue estudando para ganhar pontos.");
          return;
      }

      updateUser({ points: user.points - 50 });
      alert(`✅ Aula confirmada com ${selectedMentor.name} para ${selectedSlot}!\n\nLink enviado para seu e-mail. (-50 XP)`);
      setSelectedMentor(null);
      setSelectedSlot(null);
  };

  const handleVolunteerSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      alert("🎓 Inscrição enviada com sucesso!\n\nNossa equipe entrará em contato em breve para validar seus dados universitários.");
      setShowVolunteerModal(false);
  };

  // VIP Feature Handlers
  const handleOpenMentorships = () => {
      setShowMentorshipModal(true);
  };

  const handleReserveMentorship = (sessionTitle: string) => {
      setShowMentorshipModal(false);
      alert(`✅ Presença confirmada na mentoria: "${sessionTitle}"! O link foi enviado para seu e-mail.`);
  };

  const handleBookClubAccess = () => {
      setViewingMaterial({
          type: 'PDF',
          name: 'Resumo VIP: Hábitos Atômicos',
          content: `
            CLUBE DO LIVRO VIP - RESUMO EXCLUSIVO
            Livro: Hábitos Atômicos (James Clear)

            ---
            
            1. O Poder dos Pequenos Hábitos
            Mudanças reais vêm do efeito composto de centenas de pequenas decisões. Melhorar 1% todos os dias leva a um crescimento exponencial.

            2. As Quatro Leis da Mudança de Comportamento
            - Torne-o óbvio.
            - Torne-o atraente.
            - Torne-o fácil.
            - Torne-o satisfatório.

            3. Foco no Sistema, não na Meta
            Metas são sobre os resultados que você quer alcançar. Sistemas são sobre os processos que levam a esses resultados.

            4. Identidade
            A maneira mais eficaz de mudar seus hábitos é focar não no que você quer alcançar, mas em quem você quer se tornar.

            --- FIM DO RESUMO ---
          `
      });
  };

  const handleOpenCertificates = () => {
      setShowCertificateModal(true);
  };

  const handleViewCertificate = (cert: any) => {
      if (cert.status !== 'issued') {
          alert("Este certificado ainda não foi emitido. Conclua o curso para liberar!");
          return;
      }
      setViewingCertificate(cert);
  };

  const handleGenerateFlashcards = async () => {
      if (!flashcardsTopic) return;
      setFcLoading(true);
      setFlashcards([]);
      const cards = await generateStudyFlashcards(flashcardsTopic);
      setFlashcards(cards);
      setFcLoading(false);
  };

  const handleGenerateCustomQuiz = async () => {
    if(!canAccessPro) {
        if(confirm("🔒 O Gerador de Exercícios Infinitos é exclusivo do plano Pro. Deseja assinar?")) {
            setActiveSection('vip');
        }
        return;
    }
    if (!customQuizTopic) return;
    
    setCustomQuizLoading(true);
    try {
        const response = await generateAIResponse(
            `Gere um quiz JSON sobre ${customQuizTopic} com 3 perguntas. 
            Formato estrito:
            {
                "title": "Quiz de ${customQuizTopic}",
                "questions": [
                    {"id": 1, "text": "Pergunta?", "options": ["A", "B", "C", "D"], "correct": 0}
                ],
                "xp": 300
            }
            Retorne APENAS o JSON.`, 
            "Você é um gerador de API."
        );
        
        // Simple sanitization to extract JSON if markdown is present
        const jsonString = response.replace(/```json|```/g, '').trim();
        const quizData = JSON.parse(jsonString);
        
        startQuiz(quizData);
    } catch (e) {
        alert("Erro ao gerar quiz. Tente novamente.");
        console.error(e);
    } finally {
        setCustomQuizLoading(false);
    }
  };

  const toggleCard = (id: string) => {
      setFlippedCards(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  // Quiz Logic
  const startQuiz = (quiz: any) => {
    setActiveQuiz(quiz);
    setQuizAnswers(new Array(quiz.questions.length).fill(-1));
    setQuizResult(null);
  };

  const selectAnswer = (questionIndex: number, optionIndex: number) => {
    const newAnswers = [...quizAnswers];
    newAnswers[questionIndex] = optionIndex;
    setQuizAnswers(newAnswers);
  };

  const submitQuiz = () => {
    let score = 0;
    activeQuiz.questions.forEach((q: any, i: number) => {
      if (q.correct === quizAnswers[i]) score++;
    });
    
    setQuizResult({ score, total: activeQuiz.questions.length });
    
    // Award XP based on score
    if (score > 0) {
      const xpGained = Math.round((score / activeQuiz.questions.length) * activeQuiz.xp);
      updateUser({ points: user.points + xpGained });
    }
  };

  const closeQuiz = () => {
    setActiveQuiz(null);
    setQuizResult(null);
    setQuizAnswers([]);
  };

  const filteredQuizzes = mockQuizzes.filter(q => {
      if (difficultyFilter === 'Todos') return true;
      return q.level === difficultyFilter;
  });

  const renderContent = () => {
    switch(activeSection) {
        case 'ai':
            return (
                <div className="p-6 h-full flex flex-col">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 dark:text-white"><Bot className="text-primary-600"/> Assistente Pessoal</h2>
                    <div className="flex-1 glass-panel rounded-2xl shadow-lg border-0 overflow-hidden">
                        <AIAssistant mode="student" />
                    </div>
                </div>
            )
        case 'partnerships':
            const displayedUniversities = showAllUniversities ? allUniversities : allUniversities.slice(0, 5);

            return (
                <div className="p-6 animate-fade-in space-y-8">
                    {/* Header Banner */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-10 text-white relative overflow-hidden shadow-2xl shadow-blue-500/20">
                        <div className="relative z-10">
                            <h1 className="text-4xl font-extrabold mb-4 flex items-center gap-3">
                                <Handshake size={40}/> Parcerias Universitárias
                            </h1>
                            <p className="text-blue-50 text-xl max-w-2xl font-medium leading-relaxed">
                                Conecte-se com o futuro. Aprenda diretamente com quem já está na universidade e receba mentorias personalizadas.
                            </p>
                        </div>
                        <School className="absolute right-0 bottom-0 text-white opacity-10 w-64 h-64 -mr-12 -mb-12 rotate-12"/>
                    </div>

                    {/* Universities Logos */}
                    <div className="glass-panel p-6 rounded-2xl border border-white/50 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-6 flex items-center gap-2">
                            <GraduationCap size={20} className="text-primary-500"/> Universidades Parceiras
                        </h2>
                        <div className="flex flex-wrap gap-4 items-center">
                            {displayedUniversities.map((uni, i) => (
                                <div key={i} className="bg-white/80 dark:bg-gray-800/80 px-8 py-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 font-black text-gray-400 text-2xl grayscale hover:grayscale-0 hover:text-blue-600 hover:shadow-md transition-all cursor-pointer transform hover:-translate-y-1">
                                    {uni}
                                </div>
                            ))}
                            <button 
                                onClick={() => setShowAllUniversities(!showAllUniversities)} 
                                className="text-sm text-primary-600 font-bold hover:underline ml-4 bg-primary-50 dark:bg-primary-900/20 px-5 py-2.5 rounded-xl transition-colors"
                            >
                                {showAllUniversities ? 'Ver menos' : 'Ver todas'}
                            </button>
                        </div>
                    </div>

                    {/* Mentors Grid */}
                    <div>
                         <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                             <UserIcon size={24} className="text-primary-500"/> Mentores Disponíveis
                         </h2>
                         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                             {mockMentors.map(mentor => (
                                 <div key={mentor.id} className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all flex flex-col group relative overflow-hidden">
                                     <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100 dark:bg-primary-900/20 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                                     
                                     <div className="flex items-start justify-between mb-6 relative z-10">
                                         <div className="flex gap-4">
                                             <div className="relative">
                                                 <img src={mentor.avatar} alt={mentor.name} className="w-16 h-16 rounded-2xl object-cover shadow-md group-hover:scale-105 transition-transform"/>
                                                 <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800"></div>
                                             </div>
                                             <div>
                                                 <h3 className="font-bold text-lg dark:text-white leading-tight">{mentor.name}</h3>
                                                 <p className="text-xs text-primary-600 font-bold uppercase tracking-wider mt-1">{mentor.university}</p>
                                                 <p className="text-sm text-gray-500">{mentor.course}</p>
                                             </div>
                                         </div>
                                     </div>

                                     <div className="mb-6 relative z-10">
                                         <p className="text-xs text-gray-400 uppercase font-bold mb-3">Matérias:</p>
                                         <div className="flex flex-wrap gap-2">
                                             {mentor.subjects.map(subj => (
                                                 <span key={subj} className="bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-600">
                                                     {subj}
                                                 </span>
                                             ))}
                                         </div>
                                     </div>

                                     <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 relative z-10">
                                         <div className="flex justify-between items-center mb-4">
                                             <div className="flex items-center gap-1 text-yellow-500 font-bold text-sm">
                                                 <Star size={16} fill="currentColor"/> {mentor.rating}
                                             </div>
                                             <span className="text-xs text-gray-400">50+ aulas dadas</span>
                                         </div>
                                         <button 
                                            onClick={() => handleOpenBooking(mentor)}
                                            className="w-full py-3 bg-gray-900 text-white dark:bg-white dark:text-gray-900 rounded-xl font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                                         >
                                             <Handshake size={18}/> Agendar (50 XP)
                                         </button>
                                     </div>
                                 </div>
                             ))}
                         </div>
                    </div>

                    {/* Call to Action for University Students */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 rounded-3xl p-8 text-center border border-purple-100 dark:border-purple-800/30">
                        <div className="bg-white dark:bg-gray-800 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <GraduationCap className="text-purple-500" size={32}/>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Você é universitário?</h3>
                        <p className="text-gray-500 mb-6 max-w-md mx-auto mt-2">Ganhe horas complementares, desenvolva sua didática e ajude a transformar a educação de jovens em todo o Brasil.</p>
                        <button 
                            onClick={() => setShowVolunteerModal(true)}
                            className="text-purple-600 font-bold hover:text-purple-700 bg-white dark:bg-gray-800 px-8 py-3 rounded-xl shadow-sm hover:shadow-md transition-all border border-purple-100 dark:border-purple-800"
                        >
                            Seja um Mentor Voluntário
                        </button>
                    </div>
                </div>
            );
        case 'paths':
            return (
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-6 dark:text-white">Suas Trilhas de Aprendizagem</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {mockCourses.map((course, index) => {
                            const isLocked = user.vipPlan === 'basic' && index >= 2;
                            return (
                                <div key={course.id} onClick={() => handleCourseClick(course, index)} className={`bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 group cursor-pointer card-hover ${isLocked ? 'opacity-80' : ''}`}>
                                    <div className="h-48 bg-gray-200 relative overflow-hidden">
                                        <img src={course.imageUrl} className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${isLocked ? 'grayscale' : ''}`} alt={course.title} />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                        
                                        {isLocked ? (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-sm bg-black/30">
                                                <div className="bg-white/20 p-3 rounded-full mb-2 backdrop-blur-md border border-white/30">
                                                    <Lock className="text-white" size={24} />
                                                </div>
                                                <span className="text-white font-bold text-sm bg-black/50 px-3 py-1 rounded-full border border-white/20">Exclusivo VIP</span>
                                            </div>
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="bg-white/20 p-4 rounded-full backdrop-blur-md border border-white/30 transform scale-0 group-hover:scale-100 transition-transform">
                                                    <PlayCircle className="text-white w-10 h-10" />
                                                </div>
                                            </div>
                                        )}
                                        
                                        <div className="absolute bottom-4 left-4 right-4">
                                            <div className="flex justify-between items-end">
                                                <span className="text-xs font-bold text-white bg-primary-600/90 px-2 py-1 rounded-lg backdrop-blur-sm">{course.category}</span>
                                                {course.videoUrl && !isLocked && (
                                                    <span className="text-xs text-white bg-red-600/90 px-2 py-1 rounded-lg flex items-center gap-1 backdrop-blur-sm"><PlayCircle size={10} /> Vídeo</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-bold text-lg mb-3 dark:text-white line-clamp-1 group-hover:text-primary-600 transition-colors">{course.title}</h3>
                                        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 mb-3 overflow-hidden">
                                            <div className="bg-gradient-to-r from-primary-500 to-purple-500 h-2 rounded-full transition-all duration-1000" style={{width: `${course.progress}%`}}></div>
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 font-medium">
                                            <span>{course.progress}% concluído</span>
                                            <span>4h restantes</span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )
        case 'exercises':
            // Keeping functional logic but improving container UI
            if (activeQuiz) {
              return (
                <div className="p-6 max-w-3xl mx-auto animate-fade-in">
                  <div className="mb-6 flex items-center justify-between">
                    <button onClick={closeQuiz} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 bg-white dark:bg-gray-800 px-4 py-2 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                      <ArrowLeft size={20} /> Voltar
                    </button>
                    <span className="bg-purple-100 text-purple-700 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">Valendo {activeQuiz.xp} XP</span>
                  </div>
                  
                  {/* Quiz UI (Reusing logic, better UI) */}
                  {quizResult ? (
                    <div className="bg-white dark:bg-gray-800 rounded-3xl p-10 text-center shadow-xl border border-gray-100 dark:border-gray-700">
                       <div className="w-24 h-24 mx-auto bg-gradient-to-tr from-yellow-400 to-orange-500 text-white rounded-full flex items-center justify-center mb-6 shadow-lg animate-bounce">
                         <Trophy size={48} />
                       </div>
                       <h3 className="text-3xl font-bold dark:text-white mb-2">Quiz Finalizado!</h3>
                       <p className="text-gray-500 mb-8 text-lg">Você acertou <span className="font-bold text-primary-600">{quizResult.score}</span> de <span className="font-bold">{quizResult.total}</span> questões.</p>
                       
                       {/* Questions Review */}
                       <div className="space-y-4 text-left">
                          {activeQuiz.questions.map((q:any, i:number) => (
                             <div key={i} className={`p-5 rounded-2xl border-l-4 ${q.correct === quizAnswers[i] ? 'border-green-500 bg-green-50 dark:bg-green-900/10' : 'border-red-500 bg-red-50 dark:bg-red-900/10'}`}>
                                <p className="font-bold mb-2 dark:text-white text-lg">{i+1}. {q.text}</p>
                                <div className="flex justify-between items-center text-sm">
                                   <span className={q.correct === quizAnswers[i] ? 'text-green-700 dark:text-green-400 font-medium' : 'text-red-700 dark:text-red-400 font-medium'}>
                                      Sua resposta: {q.options[quizAnswers[i]]}
                                   </span>
                                   {q.correct !== quizAnswers[i] && (
                                     <span className="text-green-600 dark:text-green-400 font-bold">Correto: {q.options[q.correct]}</span>
                                   )}
                                </div>
                             </div>
                          ))}
                       </div>

                       <button onClick={closeQuiz} className="mt-10 bg-gray-900 text-white px-10 py-4 rounded-2xl font-bold hover:scale-105 transition-transform shadow-xl">
                          Concluir
                       </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 mb-6">
                          <h2 className="text-2xl font-bold dark:text-white mb-2">{activeQuiz.title}</h2>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full">
                              <div className="bg-purple-600 h-2 rounded-full transition-all" style={{width: `${(quizAnswers.filter(a => a !== -1).length / activeQuiz.questions.length) * 100}%`}}></div>
                          </div>
                      </div>

                      {activeQuiz.questions.map((q: any, qIdx: number) => (
                        <div key={q.id} className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                           <h3 className="font-bold text-xl mb-6 dark:text-white flex gap-3"><span className="text-gray-300">{qIdx + 1}.</span> {q.text}</h3>
                           <div className="space-y-3">
                             {q.options.map((opt: string, oIdx: number) => (
                               <button 
                                 key={oIdx}
                                 onClick={() => selectAnswer(qIdx, oIdx)}
                                 className={`w-full text-left p-5 rounded-2xl border-2 transition-all font-medium ${
                                   quizAnswers[qIdx] === oIdx 
                                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 shadow-md' 
                                    : 'border-transparent bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-300'
                                }`}
                               >
                                 <span className="mr-3 font-bold opacity-50">{String.fromCharCode(65+oIdx)}.</span> {opt}
                               </button>
                             ))}
                           </div>
                        </div>
                      ))}
                      <button 
                        onClick={submitQuiz}
                        disabled={quizAnswers.includes(-1)}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-lg hover:shadow-green-500/30 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        Enviar Respostas
                      </button>
                    </div>
                  )}
                </div>
              );
            }
            // Standard Exercises View
            return (
                <div className="p-6 animate-fade-in space-y-12">
                    {/* AI Generator */}
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-3xl shadow-2xl shadow-indigo-500/30 text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-3xl font-extrabold flex items-center gap-3">
                                        <BrainCircuit size={32} className="text-indigo-200"/> Gerador Infinito
                                    </h2>
                                    <p className="text-indigo-100 mt-2 text-lg">Crie exercícios personalizados sobre qualquer assunto em segundos.</p>
                                </div>
                                {!canAccessPro && <span className="bg-white/20 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-2 border border-white/20"><Lock size={12}/> PRO</span>}
                            </div>
                            
                            <div className="flex gap-3 bg-white/10 p-2 rounded-2xl backdrop-blur-sm border border-white/20">
                                <input 
                                    type="text" 
                                    value={customQuizTopic}
                                    onChange={(e) => setCustomQuizTopic(e.target.value)}
                                    placeholder="Ex: Tabela Periódica, Verbos Irregulares..."
                                    className="flex-1 p-4 rounded-xl bg-transparent text-white placeholder-indigo-200 outline-none font-medium"
                                />
                                <button 
                                    onClick={handleGenerateCustomQuiz}
                                    disabled={customQuizLoading || !customQuizTopic}
                                    className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors flex items-center gap-2 shadow-lg"
                                >
                                    {customQuizLoading ? <RefreshCw className="animate-spin"/> : <Zap fill="currentColor"/>}
                                    Gerar
                                </button>
                            </div>
                        </div>
                        <Sparkles className="absolute -top-10 -right-10 text-white opacity-10 w-64 h-64 rotate-45"/>
                    </div>

                    {/* Standard Quizzes Grid */}
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold dark:text-white flex items-center gap-2">
                          <CheckCircle className="text-green-500"/> Simulados Disponíveis
                        </h2>
                        
                        {/* Difficulty Filter */}
                        <div className="flex gap-2 bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-100 dark:border-gray-700">
                           {['Todos', 'Fácil', 'Médio', 'Difícil'].map(diff => (
                               <button 
                                 key={diff}
                                 onClick={() => setDifficultyFilter(diff as any)}
                                 className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                                    difficultyFilter === diff 
                                    ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-sm' 
                                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                 }`}
                               >
                                   {diff}
                               </button>
                           ))}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        {filteredQuizzes.map(quiz => (
                          <div key={quiz.id} className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 group">
                             <div className="flex justify-between items-start mb-6">
                               <div className="w-14 h-14 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                 <PenTool size={28}/>
                               </div>
                               <span className="bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 border border-yellow-100">
                                 <Zap size={14} fill="currentColor"/> {quiz.xp} XP
                               </span>
                             </div>
                             <h3 className="font-bold text-xl dark:text-white mb-2">{quiz.title}</h3>
                             <p className="text-gray-500 mb-6 flex items-center gap-2">
                                 {quiz.questions.length} questões • 
                                 <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                                     quiz.level === 'Fácil' ? 'bg-green-100 text-green-700' : 
                                     quiz.level === 'Médio' ? 'bg-orange-100 text-orange-700' : 
                                     'bg-red-100 text-red-700'
                                 }`}>
                                     {quiz.level}
                                 </span>
                             </p>
                             <button onClick={() => startQuiz(quiz)} className="w-full py-3.5 bg-gray-900 text-white dark:bg-white dark:text-gray-900 rounded-xl font-bold hover:opacity-90 transition-opacity shadow-lg">
                               Começar Agora
                             </button>
                          </div>
                        ))}
                      </div>
                      {filteredQuizzes.length === 0 && (
                          <div className="text-center py-10 text-gray-400">
                              <Filter size={40} className="mx-auto mb-2 opacity-50"/>
                              <p>Nenhum exercício encontrado para este nível.</p>
                          </div>
                      )}
                    </div>
                </div>
            );
        
        // --- RESTORED MISSING SECTIONS ---
        
        case 'performance':
             return (
                 <div className="p-6 space-y-8 animate-fade-in">
                     <div className="flex justify-between items-center flex-wrap gap-4">
                        <h2 className="text-2xl font-bold dark:text-white flex items-center gap-2">
                            <BarChart2 className="text-purple-500"/> Seu Desempenho
                        </h2>
                        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-md rounded-xl p-1 border border-white/20 dark:border-gray-700 flex">
                            <button onClick={() => handlePeriodChange('week')} className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${perfPeriod === 'week' ? 'bg-white dark:bg-gray-700 text-primary-600 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}>Semana</button>
                            <button onClick={() => handlePeriodChange('month')} className={`px-4 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-1 ${perfPeriod === 'month' ? 'bg-white dark:bg-gray-700 text-primary-600 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}>
                                Mês {!canAccessPro && <Lock size={12}/>}
                            </button>
                        </div>
                     </div>

                     <div className="grid lg:grid-cols-2 gap-6">
                        <div className="glass-panel p-6 rounded-3xl border border-white/50 dark:border-gray-700/50 shadow-sm">
                            <h3 className="font-bold mb-6 dark:text-white flex items-center gap-2"><Clock size={20} className="text-primary-500"/> Tempo de Estudo (horas)</h3>
                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={perfPeriod === 'week' ? weeklyStats : monthlyStats}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-gray-200 dark:text-gray-700 opacity-50" />
                                        <XAxis dataKey="name" tick={{fontSize: 12}} stroke="currentColor" className="text-gray-400" axisLine={false} tickLine={false} />
                                        <YAxis tick={{fontSize: 12}} stroke="currentColor" className="text-gray-400" axisLine={false} tickLine={false} />
                                        <Tooltip 
                                            contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', backgroundColor: 'rgba(255, 255, 255, 0.9)'}} 
                                            cursor={{fill: 'rgba(139, 92, 246, 0.1)'}} 
                                        />
                                        <Bar dataKey="hours" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="glass-panel p-6 rounded-3xl border border-white/50 dark:border-gray-700/50 shadow-sm">
                            <h3 className="font-bold mb-6 dark:text-white flex items-center gap-2"><Trophy size={20} className="text-yellow-500"/> XP Acumulado</h3>
                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={perfPeriod === 'week' ? weeklyStats : monthlyStats}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-gray-200 dark:text-gray-700 opacity-50" />
                                        <XAxis dataKey="name" tick={{fontSize: 12}} stroke="currentColor" className="text-gray-400" axisLine={false} tickLine={false} />
                                        <YAxis tick={{fontSize: 12}} stroke="currentColor" className="text-gray-400" axisLine={false} tickLine={false} />
                                        <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', backgroundColor: 'rgba(255, 255, 255, 0.9)'}} />
                                        <Line type="monotone" dataKey="xp" stroke="#f43f5e" strokeWidth={4} dot={{r: 4, fill: '#f43f5e', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 8}} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                     </div>
                 </div>
             );

        case 'agenda':
            return (
                <div className="p-6 animate-fade-in">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold dark:text-white flex items-center gap-2"><Calendar className="text-primary-500"/> Agenda de Estudos</h2>
                        <button className="text-sm bg-white dark:bg-gray-800 px-4 py-2 rounded-xl hover:shadow-md transition-all dark:text-white font-bold flex items-center gap-2 border border-gray-100 dark:border-gray-700 text-primary-600">
                            <Plus size={16}/> Adicionar Evento
                        </button>
                    </div>
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            {initialAgenda.map(item => (
                                <div key={item.id} className="group flex items-center p-5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/50 dark:border-gray-700/50 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
                                    <div className={`w-1.5 h-12 rounded-full mr-5 ${item.type === 'exam' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : item.type === 'task' ? 'bg-orange-500' : 'bg-green-500'}`}></div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-800 dark:text-white text-lg group-hover:text-primary-600 transition-colors">{item.title}</h4>
                                        <div className="flex gap-3 text-sm text-gray-500 mt-1">
                                            <span className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-xs font-medium"><Clock size={12}/> {item.date}</span>
                                            <span className="capitalize bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1">
                                                {item.type === 'exam' ? <AlertTriangle size={10}/> : item.type === 'task' ? <FileText size={10}/> : <Book size={10}/>}
                                                {item.type}
                                            </span>
                                        </div>
                                    </div>
                                    <button className="w-10 h-10 rounded-full flex items-center justify-center text-gray-300 hover:bg-green-100 hover:text-green-600 transition-all">
                                        <Check size={20}/>
                                    </button>
                                </div>
                            ))}
                        </div>
                        
                        <div className="lg:col-span-1 space-y-6">
                            <PomodoroTimer />
                            <div className="glass-panel p-6 rounded-2xl border border-white/50 dark:border-gray-700/50">
                                <h4 className="font-bold dark:text-white mb-4">Próximos Dias</h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-sm p-2 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-lg transition-colors cursor-pointer">
                                        <span className="text-gray-500 dark:text-gray-400">16 Out</span>
                                        <span className="font-bold dark:text-gray-200">Simulado ENEM</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm p-2 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-lg transition-colors cursor-pointer">
                                        <span className="text-gray-500 dark:text-gray-400">18 Out</span>
                                        <span className="font-bold dark:text-gray-200">Entrega Redação</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );

        case 'materials':
            return (
                <div className="p-6 animate-fade-in">
                     <h2 className="text-2xl font-bold mb-8 dark:text-white flex items-center gap-2"><FolderOpen className="text-yellow-500"/> Materiais Complementares</h2>
                     <div className="grid md:grid-cols-2 gap-5">
                        {mockMaterials.map((mat, i) => (
                            <div key={i} onClick={() => setViewingMaterial(mat)} className="group flex items-center p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:border-primary-200 transition-all cursor-pointer">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mr-4 shadow-sm group-hover:scale-110 transition-transform ${mat.type === 'PDF' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                                    {mat.type === 'PDF' ? <FileText size={24}/> : <Video size={24}/>}
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-gray-800 dark:text-white text-lg group-hover:text-primary-600 transition-colors">{mat.name}</p>
                                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mt-1">{mat.type}</p>
                                </div>
                                <button className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-gray-400 group-hover:bg-primary-600 group-hover:text-white transition-all">
                                    <ArrowUpRight size={20}/>
                                </button>
                            </div>
                        ))}
                     </div>
                </div>
            )

        case 'vip':
            if (canAccessPremium) {
                return (
                    <div className="p-6 animate-fade-in space-y-8">
                        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden">
                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="bg-white/20 p-3 rounded-xl backdrop-blur-md shadow-inner"><Crown size={36} /></div>
                                    <h1 className="text-4xl font-black tracking-tight">Área Premium</h1>
                                </div>
                                <p className="text-amber-100 max-w-xl text-lg font-medium">Você tem acesso ilimitado a todos os recursos exclusivos da NeuroEdu+.</p>
                            </div>
                            <Gem className="absolute right-0 top-0 opacity-20 w-80 h-80 -mr-20 -mt-20 rotate-12 animate-pulse-slow" />
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Card 1: Mentorias */}
                            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-amber-100 dark:border-amber-900/30 shadow-lg hover:shadow-xl transition-all group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 dark:bg-amber-900/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                                <h3 className="text-2xl font-bold dark:text-white mb-3 relative z-10 flex items-center gap-3">
                                    <div className="p-2 bg-amber-100 text-amber-600 rounded-lg"><UserIcon size={24}/></div>
                                    Mentorias
                                </h3>
                                <p className="text-gray-500 mb-8 relative z-10">Agende sessões exclusivas com especialistas.</p>
                                <button onClick={handleOpenMentorships} className="w-full bg-gray-900 text-white dark:bg-white dark:text-gray-900 py-4 rounded-xl font-bold hover:shadow-lg transition-all relative z-10">
                                    Ver Agenda
                                </button>
                            </div>

                            {/* Card 2: Clube do Livro */}
                            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-blue-100 dark:border-blue-900/30 shadow-lg hover:shadow-xl transition-all group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 dark:bg-blue-900/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                                <h3 className="text-2xl font-bold dark:text-white mb-3 relative z-10 flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><BookOpen size={24}/></div>
                                    Clube do Livro
                                </h3>
                                <p className="text-gray-500 mb-8 relative z-10">Resumos e discussões de livros essenciais.</p>
                                <button onClick={handleBookClubAccess} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all relative z-10 shadow-lg shadow-blue-500/30">
                                    Acessar Agora
                                </button>
                            </div>

                            {/* Card 3: Certificados */}
                            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-green-100 dark:border-green-900/30 shadow-lg hover:shadow-xl transition-all group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 dark:bg-green-900/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                                <h3 className="text-2xl font-bold dark:text-white mb-3 relative z-10 flex items-center gap-3">
                                    <div className="p-2 bg-green-100 text-green-600 rounded-lg"><Award size={24}/></div>
                                    Certificados
                                </h3>
                                <p className="text-gray-500 mb-8 relative z-10">Gerencie e emita seus certificados.</p>
                                <button onClick={handleOpenCertificates} className="w-full bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 transition-all relative z-10 shadow-lg shadow-green-500/30">
                                    Meus Certificados
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            // SALES PAGE
            return (
                <div className="p-6 animate-fade-in">
                    <div className="text-center mb-12 pt-8">
                        <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full font-bold text-sm mb-4 uppercase tracking-wider">
                            <Gem size={14}/> Seja Membro
                        </div>
                        <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-6">
                            Desbloqueie seu Potencial Máximo
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Acesso a mentores de elite, ferramentas de IA ilimitadas e conteúdos exclusivos.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
                        {/* Basic Plan */}
                        <div className={`glass-panel p-8 rounded-3xl border border-white/50 dark:border-gray-700/50 shadow-lg flex flex-col hover:-translate-y-2 transition-transform relative ${user.vipPlan === 'basic' ? 'ring-2 ring-gray-400' : ''}`}>
                            {user.vipPlan === 'basic' && <div className="absolute top-4 right-4 bg-gray-200 text-gray-700 text-xs font-bold px-3 py-1 rounded-lg">Atual</div>}
                            <h3 className="text-xl font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Básico</h3>
                            <div className="flex items-baseline mb-8">
                                <span className="text-5xl font-black text-gray-900 dark:text-white tracking-tight">R$19</span>
                                <span className="text-gray-500 font-medium ml-2">/mês</span>
                            </div>
                            <ul className="space-y-4 mb-8 flex-1">
                                {['Acesso a 2 Trilhas', 'IA Educacional Básica', 'Sem anúncios', 'Suporte por Email'].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                        <div className="bg-gray-200 dark:bg-gray-700 p-1 rounded-full"><Check size={12}/></div>
                                        {feat}
                                    </li>
                                ))}
                            </ul>
                            <button disabled={user.vipPlan === 'basic'} className="w-full py-4 rounded-xl font-bold bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50">
                                {user.vipPlan === 'basic' ? 'Seu Plano' : 'Começar Basic'}
                            </button>
                        </div>

                        {/* Pro Plan */}
                        <div className={`bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8 rounded-3xl shadow-2xl flex flex-col transform md:-translate-y-6 relative border border-gray-700 ${user.vipPlan === 'pro' ? 'ring-2 ring-primary-500' : ''}`}>
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-primary-500 to-purple-600 px-6 py-2 rounded-full text-sm font-bold shadow-lg">RECOMENDADO</div>
                            {user.vipPlan === 'pro' && <div className="absolute top-4 right-4 bg-primary-900/50 text-primary-300 text-xs font-bold px-3 py-1 rounded-lg border border-primary-500">Atual</div>}
                            
                            <h3 className="text-xl font-bold text-primary-300 uppercase tracking-wide mb-2">Pro</h3>
                            <div className="flex items-baseline mb-8">
                                <span className="text-5xl font-black tracking-tight">R$29</span>
                                <span className="text-gray-400 font-medium ml-2">/mês</span>
                            </div>
                            <ul className="space-y-4 mb-8 flex-1">
                                {['Trilhas Ilimitadas', 'IA GPT-4 Tutor', 'Exercícios Personalizados', 'Gamificação Completa', 'Relatórios de Desempenho'].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-gray-300">
                                        <div className="bg-primary-500/20 p-1 rounded-full text-primary-400"><Check size={12}/></div>
                                        {feat}
                                    </li>
                                ))}
                            </ul>
                            <button 
                                onClick={() => { if(user.vipPlan !== 'pro') { updateUser({ vipPlan: 'pro' }); alert("Plano atualizado para Pro! Aproveite os novos recursos."); } }}
                                disabled={user.vipPlan === 'pro'}
                                className="w-full py-4 rounded-xl font-bold bg-white text-gray-900 hover:bg-gray-100 transition-colors shadow-lg disabled:opacity-80"
                            >
                                {user.vipPlan === 'pro' ? 'Plano Ativo' : 'Assinar Pro'}
                            </button>
                        </div>

                        {/* Premium Plan */}
                        <div className={`glass-panel p-8 rounded-3xl border border-amber-200 dark:border-amber-800/30 shadow-xl flex flex-col hover:-translate-y-2 transition-transform relative ${user.vipPlan === 'premium' ? 'ring-2 ring-amber-500' : ''}`}>
                            {user.vipPlan === 'premium' && <div className="absolute top-4 right-4 bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-lg">Atual</div>}
                            <h3 className="text-xl font-bold text-amber-600 uppercase tracking-wide mb-2">Premium</h3>
                            <div className="flex items-baseline mb-8">
                                <span className="text-5xl font-black text-gray-900 dark:text-white tracking-tight">R$39</span>
                                <span className="text-gray-500 font-medium ml-2">/mês</span>
                            </div>
                            <ul className="space-y-4 mb-8 flex-1">
                                {['Tudo do Pro', 'Mentorias ao Vivo (1x/mês)', 'Clube do Livro', 'Certificados Verificados', 'Prioridade no Suporte'].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                        <div className="bg-amber-100 dark:bg-amber-900/30 p-1 rounded-full text-amber-600"><Check size={12}/></div>
                                        {feat}
                                    </li>
                                ))}
                            </ul>
                            <button 
                                onClick={() => { if(user.vipPlan !== 'premium') { updateUser({ vipPlan: 'premium' }); alert("Bem-vindo ao Premium! Você desbloqueou tudo."); } }}
                                disabled={user.vipPlan === 'premium'}
                                className="w-full py-4 rounded-xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:opacity-90 transition-opacity shadow-lg shadow-amber-500/20 disabled:opacity-50"
                            >
                                {user.vipPlan === 'premium' ? 'Plano Ativo' : 'Assinar Premium'}
                            </button>
                        </div>
                    </div>
                </div>
            );
        default:
            return (
                <div className="p-6 space-y-8 animate-fade-in">
                    {/* New Premium Welcome Banner */}
                    <div className="relative rounded-3xl p-10 overflow-hidden shadow-2xl shadow-primary-500/20 text-white group">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-purple-700 z-0"></div>
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                        
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="text-left max-w-lg">
                                <h1 className="text-4xl font-extrabold mb-3 leading-tight">Olá, {user.name.split(' ')[0]}! 👋</h1>
                                <p className="text-primary-100 text-lg mb-8 leading-relaxed">Sua jornada de aprendizado está apenas começando. Continue focado e alcance novos níveis.</p>
                                <div className="flex gap-4">
                                    <button onClick={() => setActiveSection('paths')} className="bg-white text-primary-600 px-8 py-3.5 rounded-xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2">
                                        <PlayCircle size={20} fill="currentColor" /> Continuar
                                    </button>
                                </div>
                            </div>
                            <div className="hidden md:block relative">
                                <div className="absolute inset-0 bg-white/20 blur-xl rounded-full"></div>
                                <GraduationCap size={140} className="relative z-10 text-white drop-shadow-lg transform -rotate-12 group-hover:rotate-0 transition-transform duration-700"/>
                            </div>
                        </div>
                    </div>

                    {/* Stats & Quick Access */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <div className="lg:col-span-2 space-y-8">
                          {/* Modern Stats Row */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                               {[
                                   { label: 'Nível', val: user.level, icon: Trophy, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
                                   { label: 'XP Total', val: user.points, icon: Star, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                                   { label: 'Ofensiva', val: '5 dias', icon: Zap, color: 'text-green-500', bg: 'bg-green-500/10' },
                                   { label: 'Precisão', val: '85%', icon: Target, color: 'text-purple-500', bg: 'bg-purple-500/10' },
                               ].map((stat, i) => (
                                   <div key={i} className="glass-panel p-5 rounded-2xl shadow-sm border border-white/50 dark:border-gray-700/50 flex flex-col items-center justify-center text-center hover:scale-105 transition-transform">
                                       <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-3 shadow-inner`}>
                                           <stat.icon size={22} fill="currentColor" className="opacity-80"/>
                                       </div>
                                       <span className="text-2xl font-black dark:text-white tracking-tight">{stat.val}</span>
                                       <span className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">{stat.label}</span>
                                   </div>
                               ))}
                          </div>

                          {/* Recent Courses List */}
                          <div className="bg-white/50 dark:bg-gray-800/50 p-6 rounded-3xl border border-white/50 dark:border-gray-700/50">
                              <div className="flex justify-between items-center mb-6">
                                  <h3 className="text-xl font-bold dark:text-white flex items-center gap-2">
                                      <Clock size={20} className="text-gray-400"/> Recentes
                                  </h3>
                                  <button onClick={() => setActiveSection('paths')} className="text-primary-600 hover:text-primary-700 font-bold text-sm bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm transition-colors">Ver todos</button>
                              </div>
                              <div className="space-y-4">
                                   {mockCourses.slice(0, 2).map((course, idx) => (
                                      <div key={course.id} onClick={() => handleCourseClick(course, idx)} className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex gap-5 cursor-pointer hover:shadow-md transition-all hover:translate-x-1 group">
                                          <div className="w-20 h-20 bg-gray-200 rounded-xl flex-shrink-0 relative overflow-hidden">
                                              <img src={course.imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={course.title} />
                                              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                                                  <PlayCircle className="text-white w-8 h-8 drop-shadow-md" />
                                              </div>
                                          </div>
                                          <div className="flex-1 flex flex-col justify-center">
                                              <h4 className="font-bold text-lg dark:text-white mb-1">{course.title}</h4>
                                              <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                                                  <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-xs">{course.category}</span>
                                                  <span>{course.progress}%</span>
                                              </div>
                                              <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                                                  <div className="bg-primary-600 h-2 rounded-full" style={{width: `${course.progress}%`}}></div>
                                              </div>
                                          </div>
                                      </div>
                                   ))}
                              </div>
                          </div>
                      </div>

                      {/* Side Widgets */}
                      <div className="space-y-6">
                          <PomodoroTimer />
                          
                          <div className="bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                               <div className="relative z-10">
                                   <div className="flex items-center gap-2 mb-3">
                                       <Award size={20} className="text-yellow-300" />
                                       <h4 className="font-bold text-lg">Desafio do Dia</h4>
                                   </div>
                                   <p className="text-orange-50 text-sm mb-4 leading-relaxed font-medium">Complete 3 exercícios de Matemática para ganhar uma insígnia exclusiva!</p>
                                   <button className="w-full bg-white text-orange-600 font-bold px-4 py-3 rounded-xl hover:bg-orange-50 transition-colors shadow-lg">
                                       Aceitar Desafio
                                   </button>
                               </div>
                               <Target className="absolute -bottom-4 -right-4 text-white opacity-20 w-32 h-32"/>
                          </div>
                      </div>
                    </div>
                </div>
            )
    }
  };

  return (
    <div className="flex min-h-screen bg-transparent pt-24 pb-12 transition-colors duration-300">
      <div className="fixed inset-0 aurora-bg -z-10"></div>
      
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden animate-fade-in" onClick={() => setMobileMenuOpen(false)}></div>
      )}

      {/* Floating Sidebar Navigation */}
      <aside className={`fixed lg:sticky top-24 left-4 h-[calc(100vh-8rem)] w-72 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-white/50 dark:border-gray-700/50 z-50 transform transition-transform duration-300 ease-in-out rounded-3xl shadow-2xl lg:shadow-none ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-[120%] lg:translate-x-0'} overflow-y-auto custom-scrollbar flex flex-col`}>
         <div className="p-6 space-y-1 flex-1">
             <div className="mb-6 px-2">
                 <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 ml-2">Menu Principal</p>
                 {menuItems.filter(i => !i.special).map(item => (
                     <button 
                        key={item.id}
                        onClick={() => { setActiveSection(item.id as MenuSection); setMobileMenuOpen(false); }}
                        className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all mb-2 group ${activeSection === item.id 
                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' 
                            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-primary-600 dark:hover:text-primary-400'}`}
                     >
                         <span className={`p-1 rounded-lg transition-colors ${activeSection === item.id ? 'bg-white/20' : 'bg-transparent group-hover:bg-primary-50 dark:group-hover:bg-gray-700'}`}>
                            {React.cloneElement(item.icon as any, { size: 18 })}
                         </span>
                         {item.label}
                     </button>
                 ))}
             </div>
             
             <div className="px-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/50">
                 <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 ml-2">Especial</p>
                 {menuItems.filter(i => i.special).map(item => (
                     <button 
                        key={item.id}
                        onClick={() => { setActiveSection(item.id as MenuSection); setMobileMenuOpen(false); }}
                        className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all mb-2 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 text-amber-700 dark:text-amber-500 hover:shadow-md border border-amber-200 dark:border-amber-800/30`}
                     >
                         <span className="bg-white/50 dark:bg-black/20 p-1 rounded-lg">{item.icon}</span>
                         {item.label}
                     </button>
                 ))}
             </div>
         </div>

         {/* Logout Button Mobile Only */}
         <div className="lg:hidden p-6 border-t border-gray-100 dark:border-gray-700">
             <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors font-bold">
                 <LogOut size={20} /> Sair
             </button>
         </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden min-w-0 px-4 lg:px-8">
          {/* Mobile Header Trigger */}
          <div className="lg:hidden mb-6 flex items-center justify-between bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <span className="font-bold text-gray-800 dark:text-white capitalize text-lg">{menuItems.find(i => i.id === activeSection)?.label}</span>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  {mobileMenuOpen ? <X /> : <Menu />}
              </button>
          </div>

          <div className="h-full max-w-7xl mx-auto">
              {renderContent()}
          </div>
      </main>

      {/* Modals - Keeping Logic, improving UI wrappers if needed inside Modal component */}
      <Modal 
        isOpen={!!selectedCourse} 
        onClose={() => setSelectedCourse(null)} 
        title={selectedCourse?.title || ''}
        size="2xl"
      >
          {selectedCourse && (
            <CoursePlayer 
                course={selectedCourse} 
                onClose={() => setSelectedCourse(null)}
                onComplete={handleCompleteLesson}
            />
          )}
      </Modal>

      <Modal
        isOpen={!!viewingMaterial}
        onClose={() => setViewingMaterial(null)}
        title={viewingMaterial?.name || 'Material'}
        size="xl"
      >
          {viewingMaterial && (
            <div className="space-y-4">
               {viewingMaterial.type === 'Video' ? (
                  <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-lg">
                     <iframe 
                        width="100%" 
                        height="100%" 
                        src={viewingMaterial.url} 
                        title={viewingMaterial.name} 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                     ></iframe>
                  </div>
               ) : (
                  <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-2xl text-sm font-mono dark:text-gray-300 max-h-[60vh] overflow-y-auto whitespace-pre-wrap border border-gray-200 dark:border-gray-700">
                      {viewingMaterial.content}
                  </div>
               )}
               <div className="flex justify-end pt-4">
                  <button onClick={() => setViewingMaterial(null)} className="px-8 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 shadow-lg">
                    Fechar
                  </button>
               </div>
            </div>
          )}
      </Modal>
      
      {/* University & VIP Modals with consistent styling */}
      <Modal
        isOpen={showMentorshipModal}
        onClose={() => setShowMentorshipModal(false)}
        title="Agenda de Mentorias VIP"
        size="lg"
      >
          {/* ... (Content same as before but inside Modal wrapper) ... */}
          <div className="space-y-6">
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-100 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-sm">
                  <p><strong>Atenção VIP:</strong> Você tem direito a reservar mentorias ilimitadas.</p>
              </div>
              <div className="grid gap-4">
                  {mockMentorshipSessions.map(session => (
                      <div key={session.id} className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 flex justify-between items-center shadow-sm">
                          <div>
                              <h4 className="font-bold text-lg dark:text-white">{session.title}</h4>
                              <p className="text-sm text-gray-500">{session.mentor} • {session.date}</p>
                          </div>
                          <div className="text-right">
                              <p className="text-xs text-gray-400 mb-2">{session.slots} vagas restantes</p>
                              <button onClick={() => handleReserveMentorship(session.title)} className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-6 rounded-lg text-sm transition-colors shadow-md">Reservar</button>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </Modal>

      <Modal
        isOpen={!!selectedMentor}
        onClose={() => { setSelectedMentor(null); setSelectedSlot(null); }}
        title={selectedMentor ? `Agendar com ${selectedMentor.name}` : 'Agendar Mentoria'}
        size="lg"
      >
          {selectedMentor && (
              <div className="space-y-8 p-2">
                  <div className="flex items-center gap-6">
                      <img src={selectedMentor.avatar} alt={selectedMentor.name} className="w-28 h-28 rounded-3xl object-cover border-4 border-white shadow-lg"/>
                      <div>
                          <h3 className="text-3xl font-bold dark:text-white">{selectedMentor.name}</h3>
                          <p className="text-gray-500 text-lg">{selectedMentor.course}</p>
                          <div className="flex gap-1 mt-2 items-center">
                              <Star className="text-yellow-400 fill-yellow-400" size={20}/>
                              <span className="font-bold text-gray-700 dark:text-gray-300 ml-1">{selectedMentor.rating}</span>
                          </div>
                      </div>
                  </div>

                  <div>
                      <h4 className="font-bold dark:text-white mb-4 text-lg">Escolha um horário</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {selectedMentor.availableSlots.map(slot => (
                              <button 
                                key={slot}
                                onClick={() => setSelectedSlot(slot)}
                                className={`py-4 px-4 rounded-2xl text-sm font-bold transition-all border-2 ${
                                    selectedSlot === slot 
                                    ? 'bg-gray-900 text-white border-gray-900 shadow-xl scale-105' 
                                    : 'bg-white border-gray-100 text-gray-600 hover:border-gray-300'
                                }`}
                              >
                                  {slot}
                              </button>
                          ))}
                      </div>
                  </div>

                  <div className="flex justify-between items-center pt-6 border-t border-gray-100 dark:border-gray-700">
                      <div className="text-sm text-gray-500 font-medium">
                          Custo: <span className="font-bold text-gray-900 dark:text-white text-lg">50 XP</span>
                      </div>
                      <button 
                        onClick={handleConfirmBooking}
                        disabled={!selectedSlot}
                        className="bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-10 py-4 rounded-xl font-bold hover:bg-green-700 shadow-xl transition-all hover:-translate-y-1"
                      >
                          Confirmar
                      </button>
                  </div>
              </div>
          )}
      </Modal>

      <Modal
        isOpen={showVolunteerModal}
        onClose={() => setShowVolunteerModal(false)}
        title="Junte-se ao time de Mentores"
        size="lg"
      >
          <form onSubmit={handleVolunteerSubmit} className="space-y-6 p-2">
              <div className="grid md:grid-cols-2 gap-6">
                  <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Universidade</label>
                      <input type="text" placeholder="Ex: USP, UNICAMP..." required className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all"/>
                  </div>
                  <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Curso</label>
                      <input type="text" placeholder="Ex: Engenharia Civil" required className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all"/>
                  </div>
              </div>
              <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Matérias</label>
                  <input type="text" placeholder="O que você ensina bem?" required className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all"/>
              </div>
              <div className="flex justify-end pt-4">
                  <button type="submit" className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-10 py-4 rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all">
                      Enviar Inscrição
                  </button>
              </div>
          </form>
      </Modal>

      <Modal
        isOpen={showCertificateModal}
        onClose={() => { setShowCertificateModal(false); setViewingCertificate(null); }}
        title="Meus Certificados"
        size="lg"
      >
          {viewingCertificate ? (
              <div className="space-y-8 text-center py-4">
                  <div className="relative border-[10px] border-double border-gray-200 p-12 rounded-lg bg-[#fffdf5] text-gray-900 font-serif shadow-2xl mx-auto max-w-2xl transform hover:scale-[1.01] transition-transform">
                       <div className="absolute top-6 right-6">
                           <Award size={48} className="text-yellow-500 drop-shadow-md"/>
                       </div>
                       <h2 className="text-5xl font-bold mb-4 tracking-widest text-gray-800 uppercase">Certificado</h2>
                       <p className="text-2xl italic text-gray-500 mb-10">de Conclusão</p>
                       <p className="text-lg mb-2">Concedido a</p>
                       <h3 className="text-4xl font-bold border-b-2 border-gray-300 inline-block pb-4 px-12 mb-8">{user.name}</h3>
                       <p className="text-xl mb-12">Pela conclusão do curso de <br/><span className="font-bold text-gray-800">{viewingCertificate.course}</span></p>
                       <div className="flex justify-between items-end mt-12 text-sm text-gray-500 font-sans">
                           <div className="border-t border-gray-300 pt-2 px-8">Data: {viewingCertificate.date}</div>
                           <div className="border-t border-gray-300 pt-2 px-8">NeuroEdu+ AI Verified</div>
                       </div>
                  </div>
                  <div className="flex gap-4 justify-center">
                      <button onClick={() => setViewingCertificate(null)} className="text-gray-500 hover:text-gray-800 font-bold px-6 py-3">Voltar</button>
                      <button className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black shadow-lg flex items-center gap-2">
                          <Download size={20}/> Baixar PDF
                      </button>
                  </div>
              </div>
          ) : (
              <div className="grid gap-4 p-2">
                  {mockCertificates.map(cert => (
                      <div key={cert.id} className={`p-6 rounded-2xl border flex justify-between items-center transition-all ${
                          cert.status === 'issued' 
                            ? 'bg-white border-green-100 hover:border-green-300 hover:shadow-lg cursor-pointer' 
                            : 'bg-gray-50 border-gray-100 opacity-60'
                      }`} onClick={() => handleViewCertificate(cert)}>
                          <div className="flex items-center gap-6">
                              <div className={`p-4 rounded-2xl ${
                                  cert.status === 'issued' ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'
                              }`}>
                                  {cert.status === 'issued' ? <CheckCircle size={28}/> : <Lock size={28}/>}
                              </div>
                              <div>
                                  <h4 className="font-bold text-lg text-gray-800">{cert.course}</h4>
                                  <p className="text-sm text-gray-500 font-medium">{cert.status === 'issued' ? `Emitido em ${cert.date}` : 'Não disponível'}</p>
                              </div>
                          </div>
                          {cert.status === 'issued' && <ChevronRight className="text-gray-400"/>}
                      </div>
                  ))}
              </div>
          )}
      </Modal>

    </div>
  );
};
