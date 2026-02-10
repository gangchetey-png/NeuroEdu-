
import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, GraduationCap, FileText, BarChart2, 
  Bot, FolderOpen, Calendar, MessageSquare, Menu, X, 
  Plus, Search, MoreVertical, Download, Upload, Check, 
  BrainCircuit, Sparkles, Gem, AlertTriangle, ChevronRight,
  LogOut, Bell, Settings, Trash2, Edit, File, Video, Image as ImageIcon, Send, User
} from 'lucide-react';
import { AIAssistant } from './AIAssistant';
import { generateTeacherResource } from '../services/geminiService';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Modal } from './Modal';

// --- Types & Mock Data ---
type TeacherSection = 'dashboard' | 'classes' | 'students' | 'activities' | 'reports' | 'ai' | 'library' | 'agenda' | 'communication' | 'vip' | 'settings';

const mockClasses = [
  { id: 1, name: '9º Ano A - Matemática', students: 32, average: 7.8 },
  { id: 2, name: '1º Ano EM - Física', students: 28, average: 6.5 },
  { id: 3, name: '3º Ano EM - Revisão', students: 40, average: 8.2 },
];

const mockStudents = [
  { id: 1, name: 'Ana Silva', class: '9º Ano A', performance: 9.5, status: 'Excelente', email: 'ana.silva@escola.com' },
  { id: 2, name: 'Bruno Santos', class: '9º Ano A', performance: 5.2, status: 'Atenção', email: 'bruno.santos@escola.com' },
  { id: 3, name: 'Carla Dias', class: '1º Ano EM', performance: 7.0, status: 'Bom', email: 'carla.dias@escola.com' },
  { id: 4, name: 'Daniel Costa', class: '1º Ano EM', performance: 4.8, status: 'Crítico', email: 'daniel.costa@escola.com' },
  { id: 5, name: 'Eduardo Lima', class: '3º Ano EM', performance: 8.8, status: 'Excelente', email: 'eduardo.lima@escola.com' },
];

const mockPerformanceData = [
  { name: '9º A', average: 78 },
  { name: '1º EM', average: 65 },
  { name: '2º EM', average: 72 },
  { name: '3º EM', average: 82 },
];

const mockAttendanceData = [
  { name: 'Presentes', value: 85 },
  { name: 'Ausentes', value: 15 },
];

const mockFiles = [
  { id: 1, name: 'Plano de Ensino 2024.pdf', type: 'pdf', date: '10/02/2024', size: '2.4 MB' },
  { id: 2, name: 'Lista de Exercícios - Álgebra.docx', type: 'doc', date: '15/02/2024', size: '1.1 MB' },
  { id: 3, name: 'Aula 03 - Leis de Newton.pptx', type: 'ppt', date: '20/02/2024', size: '5.6 MB' },
  { id: 4, name: 'Experimento Prático.mp4', type: 'video', date: '22/02/2024', size: '45 MB' },
];

const mockAgenda = [
  { id: 1, title: 'Conselho de Classe', date: '2024-10-25', time: '14:00', type: 'meeting' },
  { id: 2, title: 'Prova 9º Ano A', date: '2024-10-27', time: '08:00', type: 'exam' },
  { id: 3, title: 'Reunião de Pais', date: '2024-10-30', time: '18:30', type: 'meeting' },
];

const mockChats = [
  { id: 1, name: 'Mãe da Ana Silva', lastMessage: 'Ela vai faltar amanhã por motivo médico.', time: '10:30', unread: 2 },
  { id: 2, name: 'Coordenação', lastMessage: 'Precisamos entregar as notas até sexta.', time: 'Ontem', unread: 0 },
  { id: 3, name: 'Bruno Santos (Aluno)', lastMessage: 'Professor, não entendi a questão 4.', time: 'Ontem', unread: 0 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const ATTENDANCE_COLORS = ['#10b981', '#ef4444'];

export const TeacherDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<TeacherSection>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [topic, setTopic] = useState('');
  
  // Library State
  const [libraryFiles, setLibraryFiles] = useState(mockFiles);
  const [fileFilter, setFileFilter] = useState<'Todos' | 'PDFs' | 'Vídeos'>('Todos');
  
  // Chat State
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [chatHistory, setChatHistory] = useState([
     { id: 1, sender: 'them', text: 'Olá professor, bom dia!' },
     { id: 2, sender: 'me', text: 'Bom dia! Em que posso ajudar?' }
  ]);

  // Modals & Interactive States
  const [viewingStudent, setViewingStudent] = useState<any>(null);
  const [editingClass, setEditingClass] = useState<any>(null);

  // Settings State
  const [profile, setProfile] = useState({
      name: 'Ricardo Silva',
      email: 'ricardo.silva@neuroedu.ai',
      school: 'Colégio Futuro',
      subject: 'Física e Matemática',
      notifications: true,
      darkMode: false
  });

  // --- Handlers ---
  const handleGenerateActivity = async (type: 'quiz' | 'lesson_plan') => {
    if (!topic) return;
    setLoadingAI(true);
    const result = await generateTeacherResource(topic, type);
    setGeneratedContent(result);
    setLoadingAI(false);
  };

  const handleDownloadContent = () => {
      const element = document.createElement("a");
      const file = new Blob([generatedContent], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `Atividade-${topic.replace(/\s+/g, '-')}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
  };

  const handleUpload = () => {
      const newFile = {
          id: Date.now(),
          name: 'Novo Material Enviado.pdf',
          type: 'pdf',
          date: new Date().toLocaleDateString(),
          size: '1.5 MB'
      };
      setLibraryFiles([newFile, ...libraryFiles]);
      alert("Arquivo enviado com sucesso!");
  };

  const handleSendMessage = () => {
      if(!messageInput.trim()) return;
      setChatHistory([...chatHistory, { id: Date.now(), sender: 'me', text: messageInput }]);
      setMessageInput('');
  };

  const handleOpenStudentProfile = (student: any) => {
      setViewingStudent(student);
  };

  const handleEditClass = (cls: any) => {
      setEditingClass(cls);
  };

  const filteredFiles = libraryFiles.filter(file => {
      if (fileFilter === 'Todos') return true;
      if (fileFilter === 'PDFs') return file.type === 'pdf' || file.type === 'doc';
      if (fileFilter === 'Vídeos') return file.type === 'video';
      return true;
  });

  // --- Render Sections ---
  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-2xl font-bold dark:text-white">Visão Geral</h1>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div onClick={() => setActiveSection('students')} className="cursor-pointer hover:scale-105 transition-transform bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Total de Alunos</p>
                    <h3 className="text-3xl font-bold dark:text-white mt-2">156</h3>
                  </div>
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600">
                    <Users size={24} />
                  </div>
                </div>
                <p className="text-xs text-green-500 mt-4 flex items-center gap-1"><ChevronRight size={12}/> +12 novos este mês</p>
              </div>

              <div onClick={() => setActiveSection('classes')} className="cursor-pointer hover:scale-105 transition-transform bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Turmas Ativas</p>
                    <h3 className="text-3xl font-bold dark:text-white mt-2">5</h3>
                  </div>
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600">
                    <GraduationCap size={24} />
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-4">2 Matérias diferentes</p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Pendências</p>
                    <h3 className="text-3xl font-bold dark:text-white mt-2">18</h3>
                  </div>
                  <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-orange-600">
                    <FileText size={24} />
                  </div>
                </div>
                <p className="text-xs text-orange-500 mt-4">Trabalhos para corrigir</p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Alunos em Risco</p>
                    <h3 className="text-3xl font-bold dark:text-white mt-2">7</h3>
                  </div>
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600">
                    <AlertTriangle size={24} />
                  </div>
                </div>
                <p className="text-xs text-red-500 mt-4 font-bold cursor-pointer hover:underline" onClick={() => setActiveSection('students')}>Ver detalhes</p>
              </div>
            </div>

            {/* Recent Activity & Alerts */}
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
                <h3 className="font-bold mb-4 dark:text-white">Desempenho por Turma</h3>
                <div className="h-64">
                   <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={mockPerformanceData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis dataKey="name" stroke="#9ca3af" tick={{fontSize: 12}} axisLine={false} tickLine={false}/>
                        <YAxis stroke="#9ca3af" tick={{fontSize: 12}} axisLine={false} tickLine={false}/>
                        <Tooltip contentStyle={{borderRadius: '8px', border: 'none'}} cursor={{fill: 'transparent'}}/>
                        <Bar dataKey="average" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
                      </BarChart>
                   </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
                <h3 className="font-bold mb-4 dark:text-white flex items-center gap-2">
                  <Bell className="w-4 h-4 text-primary-500" /> Avisos Importantes
                </h3>
                <div className="space-y-4">
                  {[
                    { title: 'Reunião Pedagógica', date: 'Hoje, 14:00', type: 'meeting' },
                    { title: 'Prazo de Notas', date: 'Sexta-feira', type: 'alert' },
                    { title: 'Novo aluno na 9º A', date: 'Ontem', type: 'info' }
                  ].map((notice, i) => (
                    <div key={i} className="flex gap-3 items-start p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                       <div className={`w-2 h-2 mt-1.5 rounded-full ${notice.type === 'alert' ? 'bg-red-500' : notice.type === 'meeting' ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                       <div>
                         <p className="text-sm font-semibold dark:text-gray-200">{notice.title}</p>
                         <p className="text-xs text-gray-500">{notice.date}</p>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'reports':
          return (
              <div className="space-y-6 animate-fade-in">
                  <h1 className="text-2xl font-bold dark:text-white">Relatórios e Análises</h1>
                  
                  <div className="grid lg:grid-cols-2 gap-6">
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
                          <h3 className="font-bold mb-4 dark:text-white">Frequência Geral</h3>
                          <div className="h-64">
                             <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={mockAttendanceData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {mockAttendanceData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={ATTENDANCE_COLORS[index % ATTENDANCE_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                             </ResponsiveContainer>
                          </div>
                          <div className="flex justify-center gap-4 text-sm">
                              <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-500 rounded-full"></div> Presentes (85%)</div>
                              <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500 rounded-full"></div> Ausentes (15%)</div>
                          </div>
                      </div>

                      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
                          <h3 className="font-bold mb-4 dark:text-white">Média de Notas (Semestral)</h3>
                          <div className="h-64">
                              <ResponsiveContainer width="100%" height="100%">
                                  <LineChart data={mockPerformanceData}>
                                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                      <XAxis dataKey="name" />
                                      <YAxis domain={[0, 100]} />
                                      <Tooltip />
                                      <Line type="monotone" dataKey="average" stroke="#8884d8" strokeWidth={3} />
                                  </LineChart>
                              </ResponsiveContainer>
                          </div>
                      </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
                      <div className="flex justify-between items-center mb-4">
                          <h3 className="font-bold dark:text-white">Alunos em Destaque</h3>
                          <button onClick={() => setActiveSection('students')} className="text-sm text-primary-600 hover:underline">Ver ranking completo</button>
                      </div>
                      <div className="grid md:grid-cols-3 gap-4">
                          {[1, 2, 3].map((i) => (
                              <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                  <div className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center font-bold">#{i}</div>
                                  <div>
                                      <p className="font-bold text-sm dark:text-white">Aluno Exemplo {i}</p>
                                      <p className="text-xs text-gray-500">Média: 9.{8-i}</p>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          );

      case 'library':
          return (
              <div className="space-y-6 animate-fade-in">
                  <div className="flex justify-between items-center">
                      <h1 className="text-2xl font-bold dark:text-white">Biblioteca de Conteúdos</h1>
                      <div className="flex gap-2">
                          <button onClick={handleUpload} className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-700">
                              <Upload size={18}/> Enviar Arquivo
                          </button>
                      </div>
                  </div>

                  {/* Filter/Search Bar */}
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 flex flex-wrap gap-4 items-center">
                      <div className="relative flex-1 min-w-[200px]">
                          <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4"/>
                          <input type="text" placeholder="Buscar materiais..." className="w-full pl-9 pr-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none"/>
                      </div>
                      <div className="flex gap-2">
                          <button onClick={() => setFileFilter('Todos')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${fileFilter === 'Todos' ? 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-200'}`}>Todos</button>
                          <button onClick={() => setFileFilter('PDFs')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${fileFilter === 'PDFs' ? 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>PDFs</button>
                          <button onClick={() => setFileFilter('Vídeos')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${fileFilter === 'Vídeos' ? 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>Vídeos</button>
                      </div>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {filteredFiles.map(file => (
                          <div key={file.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow group relative">
                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"><MoreVertical size={16}/></button>
                              </div>
                              <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-3 text-gray-500 dark:text-gray-300">
                                  {file.type === 'pdf' || file.type === 'doc' ? <FileText size={24}/> : file.type === 'video' ? <Video size={24}/> : <File size={24}/>}
                              </div>
                              <h4 className="font-bold text-sm dark:text-white line-clamp-1" title={file.name}>{file.name}</h4>
                              <p className="text-xs text-gray-500 mt-1">{file.date} • {file.size}</p>
                          </div>
                      ))}
                      {filteredFiles.length === 0 && (
                          <div className="col-span-full py-10 text-center text-gray-400">
                              <FolderOpen size={40} className="mx-auto mb-2 opacity-50"/>
                              <p>Nenhum arquivo encontrado.</p>
                          </div>
                      )}
                  </div>
              </div>
          );

      case 'agenda':
          return (
              <div className="space-y-6 animate-fade-in">
                  <div className="flex justify-between items-center">
                      <h1 className="text-2xl font-bold dark:text-white">Agenda do Professor</h1>
                      <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700">
                          <Plus size={18}/> Novo Evento
                      </button>
                  </div>

                  <div className="grid lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2 space-y-4">
                          {mockAgenda.map(item => (
                              <div key={item.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 flex items-center gap-4 hover:translate-x-1 transition-transform">
                                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-center min-w-[60px]">
                                      <span className="block text-xs font-bold text-gray-500 uppercase">{new Date(item.date).toLocaleString('default', { month: 'short' })}</span>
                                      <span className="block text-xl font-bold text-gray-900 dark:text-white">{new Date(item.date).getDate()}</span>
                                  </div>
                                  <div className="flex-1">
                                      <h3 className="font-bold text-lg dark:text-white">{item.title}</h3>
                                      <p className="text-sm text-gray-500 flex items-center gap-2"><Calendar size={14}/> {item.time}</p>
                                  </div>
                                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                      item.type === 'exam' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                                  }`}>
                                      {item.type === 'exam' ? 'Prova' : 'Reunião'}
                                  </span>
                              </div>
                          ))}
                      </div>

                      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 h-fit">
                          <h3 className="font-bold mb-4 dark:text-white">Lembretes Rápidos</h3>
                          <ul className="space-y-3">
                              <li className="flex gap-2 items-start text-sm text-gray-600 dark:text-gray-300">
                                  <input type="checkbox" className="mt-1"/>
                                  <span>Enviar notas da 8ª B até sexta</span>
                              </li>
                              <li className="flex gap-2 items-start text-sm text-gray-600 dark:text-gray-300">
                                  <input type="checkbox" className="mt-1"/>
                                  <span>Preparar slides da Revolução Industrial</span>
                              </li>
                              <li className="flex gap-2 items-start text-sm text-gray-600 dark:text-gray-300">
                                  <input type="checkbox" className="mt-1"/>
                                  <span>Responder e-mail da coordenação</span>
                              </li>
                          </ul>
                      </div>
                  </div>
              </div>
          );

      case 'communication':
          return (
              <div className="h-[calc(100vh-140px)] flex gap-6 animate-fade-in">
                  {/* Chat List */}
                  <div className={`w-full md:w-1/3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 flex flex-col ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
                      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                          <h2 className="font-bold text-lg dark:text-white">Mensagens</h2>
                          <div className="mt-2 relative">
                              <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4"/>
                              <input type="text" placeholder="Buscar conversa..." className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm outline-none dark:text-white"/>
                          </div>
                      </div>
                      <div className="flex-1 overflow-y-auto">
                          {mockChats.map(chat => (
                              <div 
                                key={chat.id} 
                                onClick={() => setSelectedChat(chat.id)}
                                className={`p-4 border-b border-gray-50 dark:border-gray-700/50 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${selectedChat === chat.id ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''}`}
                              >
                                  <div className="flex justify-between items-start mb-1">
                                      <h4 className="font-bold text-sm dark:text-white">{chat.name}</h4>
                                      <span className="text-xs text-gray-400">{chat.time}</span>
                                  </div>
                                  <p className="text-xs text-gray-500 line-clamp-1">{chat.lastMessage}</p>
                                  {chat.unread > 0 && (
                                      <span className="inline-block mt-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{chat.unread}</span>
                                  )}
                              </div>
                          ))}
                      </div>
                  </div>

                  {/* Active Chat */}
                  <div className={`w-full md:w-2/3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 flex flex-col ${selectedChat ? 'flex' : 'hidden md:flex'}`}>
                      {selectedChat ? (
                          <>
                              <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                                  <div className="flex items-center gap-3">
                                      <button onClick={() => setSelectedChat(null)} className="md:hidden p-1 hover:bg-gray-100 rounded"><ChevronRight className="rotate-180"/></button>
                                      <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">
                                          {mockChats.find(c => c.id === selectedChat)?.name.charAt(0)}
                                      </div>
                                      <div>
                                          <h3 className="font-bold dark:text-white">{mockChats.find(c => c.id === selectedChat)?.name}</h3>
                                          <p className="text-xs text-green-500 flex items-center gap-1"><div className="w-2 h-2 bg-green-500 rounded-full"></div> Online</p>
                                      </div>
                                  </div>
                                  <button className="text-gray-400 hover:text-gray-600"><MoreVertical/></button>
                              </div>
                              
                              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50 dark:bg-gray-900/50">
                                  {chatHistory.map(msg => (
                                      <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                          <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${
                                              msg.sender === 'me' 
                                              ? 'bg-indigo-600 text-white rounded-tr-none' 
                                              : 'bg-white dark:bg-gray-700 dark:text-white rounded-tl-none shadow-sm'
                                          }`}>
                                              {msg.text}
                                          </div>
                                      </div>
                                  ))}
                              </div>

                              <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex gap-2">
                                  <input 
                                    type="text" 
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Digite sua mensagem..." 
                                    className="flex-1 border rounded-full px-4 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                                  />
                                  <button onClick={handleSendMessage} className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors">
                                      <Send size={20}/>
                                  </button>
                              </div>
                          </>
                      ) : (
                          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                              <MessageSquare size={48} className="mb-4 opacity-20"/>
                              <p>Selecione uma conversa para iniciar</p>
                          </div>
                      )}
                  </div>
              </div>
          );

      case 'settings':
          return (
              <div className="space-y-6 animate-fade-in max-w-4xl">
                  <h1 className="text-2xl font-bold dark:text-white">Configurações do Professor</h1>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                          <h2 className="font-bold text-lg dark:text-white mb-4">Perfil</h2>
                          <div className="flex items-center gap-6">
                              <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-2xl font-bold">
                                  RS
                              </div>
                              <div className="space-y-2 flex-1">
                                  <div>
                                      <label className="text-xs font-bold text-gray-500 uppercase">Nome</label>
                                      <input type="text" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} className="w-full bg-transparent border-b border-gray-200 dark:border-gray-700 py-1 font-medium dark:text-white focus:outline-none focus:border-indigo-500"/>
                                  </div>
                                  <div>
                                      <label className="text-xs font-bold text-gray-500 uppercase">Email</label>
                                      <input type="text" value={profile.email} readOnly className="w-full bg-transparent border-b border-gray-200 dark:border-gray-700 py-1 font-medium text-gray-500"/>
                                  </div>
                              </div>
                          </div>
                      </div>

                      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                           <h2 className="font-bold text-lg dark:text-white mb-4">Profissional</h2>
                           <div className="grid md:grid-cols-2 gap-4">
                               <div>
                                  <label className="text-sm font-bold text-gray-600 dark:text-gray-300">Escola</label>
                                  <input type="text" value={profile.school} onChange={(e) => setProfile({...profile, school: e.target.value})} className="w-full mt-1 p-2 rounded border dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
                               </div>
                               <div>
                                  <label className="text-sm font-bold text-gray-600 dark:text-gray-300">Disciplinas</label>
                                  <input type="text" value={profile.subject} onChange={(e) => setProfile({...profile, subject: e.target.value})} className="w-full mt-1 p-2 rounded border dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
                               </div>
                           </div>
                      </div>

                      <div className="p-6">
                           <h2 className="font-bold text-lg dark:text-white mb-4">Preferências</h2>
                           <div className="space-y-4">
                               <div className="flex items-center justify-between">
                                   <span className="text-gray-700 dark:text-gray-300">Receber notificações por email</span>
                                   <label className="relative inline-flex items-center cursor-pointer">
                                      <input type="checkbox" checked={profile.notifications} onChange={() => setProfile({...profile, notifications: !profile.notifications})} className="sr-only peer"/>
                                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                                   </label>
                               </div>
                           </div>
                      </div>
                      
                      <div className="p-6 bg-gray-50 dark:bg-gray-900/50 flex justify-end gap-3">
                          <button className="px-4 py-2 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">Cancelar</button>
                          <button onClick={() => alert("Configurações salvas!")} className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30">Salvar Alterações</button>
                      </div>
                  </div>
              </div>
          );

      case 'vip':
        return (
          <div className="space-y-8 animate-fade-in p-2">
            <div className="text-center max-w-2xl mx-auto">
               <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Área VIP Professor</span>
               <h1 className="text-3xl font-bold mt-4 dark:text-white">Potencialize seu ensino com IA</h1>
               <p className="text-gray-500 dark:text-gray-400 mt-2">Ferramentas avançadas para economizar tempo e personalizar o aprendizado.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
               {/* Basic */}
               <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all">
                  <h3 className="font-bold text-gray-500 dark:text-gray-400">Básico</h3>
                  <div className="my-4"><span className="text-3xl font-bold dark:text-white">R$ 19,90</span>/mês</div>
                  <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300 mb-6">
                    <li className="flex gap-2"><Check size={16} className="text-green-500"/> Criação ilimitada de atividades</li>
                    <li className="flex gap-2"><Check size={16} className="text-green-500"/> Relatórios básicos</li>
                    <li className="flex gap-2"><Check size={16} className="text-green-500"/> Assistente IA Básico</li>
                  </ul>
                  <button className="w-full py-2 border border-gray-300 dark:border-gray-600 rounded-lg font-bold hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white">Escolher Básico</button>
               </div>

               {/* Pro */}
               <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-primary-500 shadow-xl relative transform md:-translate-y-2">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary-600 text-white px-3 py-1 text-xs font-bold rounded-full">Recomendado</div>
                  <h3 className="font-bold text-primary-600">Pro</h3>
                  <div className="my-4"><span className="text-3xl font-bold dark:text-white">R$ 29,90</span>/mês</div>
                  <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300 mb-6">
                    <li className="flex gap-2"><Check size={16} className="text-primary-500"/> Tudo do Básico</li>
                    <li className="flex gap-2"><Check size={16} className="text-primary-500"/> Relatórios Avançados</li>
                    <li className="flex gap-2"><Check size={16} className="text-primary-500"/> IA Criação Automática de Aulas</li>
                    <li className="flex gap-2"><Check size={16} className="text-primary-500"/> Análise detalhada de desempenho</li>
                  </ul>
                  <button className="w-full py-2 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-700 shadow-lg">Escolher Pro</button>
               </div>

               {/* Premium */}
               <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white rounded-2xl p-6 border border-gray-700 shadow-lg">
                  <h3 className="font-bold text-amber-400 flex items-center gap-2"><Gem size={16}/> Premium</h3>
                  <div className="my-4"><span className="text-3xl font-bold">R$ 39,90</span>/mês</div>
                  <ul className="space-y-3 text-sm text-gray-300 mb-6">
                    <li className="flex gap-2"><Check size={16} className="text-amber-400"/> IA Pedagógica Avançada</li>
                    <li className="flex gap-2"><Check size={16} className="text-amber-400"/> Planejamento Automático</li>
                    <li className="flex gap-2"><Check size={16} className="text-amber-400"/> Monitoramento Inteligente</li>
                    <li className="flex gap-2"><Check size={16} className="text-amber-400"/> Atendimento Prioritário</li>
                  </ul>
                  <button className="w-full py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-bold hover:opacity-90 shadow-lg">Ser Premium</button>
               </div>
            </div>
          </div>
        );

      case 'ai':
        return (
          <div className="h-full flex flex-col animate-fade-in">
             <h1 className="text-2xl font-bold dark:text-white mb-4 flex items-center gap-2">
               <BrainCircuit className="text-indigo-600"/> Assistente Pedagógico
             </h1>
             <div className="flex-1">
                <AIAssistant mode="teacher" />
             </div>
          </div>
        );

      case 'activities':
        return (
          <div className="space-y-6 animate-fade-in">
             <h1 className="text-2xl font-bold dark:text-white">Criar Atividades</h1>
             <div className="grid lg:grid-cols-2 gap-8">
                {/* Form */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                   <h3 className="font-bold mb-4 dark:text-white">Gerador Inteligente</h3>
                   <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Tema da Aula / Atividade</label>
                        <input 
                          type="text" 
                          value={topic}
                          onChange={(e) => setTopic(e.target.value)}
                          placeholder="Ex: Revolução Francesa, Equações de 2º Grau..."
                          className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                         <button 
                            onClick={() => handleGenerateActivity('quiz')}
                            disabled={loadingAI || !topic}
                            className="p-4 border rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:border-indigo-300 transition-all flex flex-col items-center gap-2 group"
                         >
                            <FileText className="text-indigo-500 group-hover:scale-110 transition-transform"/>
                            <span className="font-bold text-sm dark:text-gray-200">Gerar Quiz</span>
                         </button>
                         <button 
                            onClick={() => handleGenerateActivity('lesson_plan')}
                            disabled={loadingAI || !topic}
                            className="p-4 border rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-300 transition-all flex flex-col items-center gap-2 group"
                         >
                            <Calendar className="text-purple-500 group-hover:scale-110 transition-transform"/>
                            <span className="font-bold text-sm dark:text-gray-200">Plano de Aula</span>
                         </button>
                      </div>
                   </div>
                </div>

                {/* Result */}
                <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700 min-h-[400px] flex flex-col">
                   <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold dark:text-white">Resultado</h3>
                      {generatedContent && (
                        <button 
                            onClick={handleDownloadContent}
                            className="text-xs flex items-center gap-1 bg-white dark:bg-gray-800 px-3 py-1 rounded shadow-sm hover:shadow dark:text-white hover:text-indigo-600 transition-colors"
                        >
                          <Download size={14}/> Baixar PDF
                        </button>
                      )}
                   </div>
                   
                   {loadingAI ? (
                     <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                        <Sparkles className="w-8 h-8 animate-spin mb-2 text-indigo-500"/>
                        <p>A IA está criando seu material...</p>
                     </div>
                   ) : generatedContent ? (
                     <div className="flex-1 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm whitespace-pre-wrap text-sm dark:text-gray-300 overflow-y-auto max-h-[500px]">
                        {generatedContent}
                     </div>
                   ) : (
                     <div className="flex-1 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                        <Bot size={32} className="mb-2 opacity-50"/>
                        <p className="text-sm">O conteúdo gerado aparecerá aqui.</p>
                     </div>
                   )}
                </div>
             </div>
          </div>
        );
      
      case 'classes':
        return (
           <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center">
                 <h1 className="text-2xl font-bold dark:text-white">Gerenciar Turmas</h1>
                 <button onClick={() => alert('Feature em breve')} className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors">
                    <Plus size={18}/> Nova Turma
                 </button>
              </div>
              
              <div className="grid gap-4">
                 {mockClasses.map(cls => (
                   <div key={cls.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex justify-between items-center hover:shadow-md transition-shadow">
                      <div>
                         <h3 className="font-bold text-lg dark:text-white">{cls.name}</h3>
                         <p className="text-gray-500 text-sm">{cls.students} Alunos • Média: <span className={cls.average > 7 ? 'text-green-500 font-bold' : 'text-yellow-500 font-bold'}>{cls.average}</span></p>
                      </div>
                      <div className="flex items-center gap-2">
                         <button onClick={() => setActiveSection('communication')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500" title="Mensagens"><MessageSquare size={18}/></button>
                         <button onClick={() => handleEditClass(cls)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500" title="Editar"><Settings size={18}/></button>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        );

      case 'students':
        return (
          <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center flex-wrap gap-4">
                 <h1 className="text-2xl font-bold dark:text-white">Lista de Alunos</h1>
                 <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4"/>
                    <input type="text" placeholder="Buscar aluno..." className="pl-9 pr-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"/>
                 </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                 <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                       <tr>
                          <th className="p-4">Nome</th>
                          <th className="p-4">Turma</th>
                          <th className="p-4">Desempenho</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Ações</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-sm">
                       {mockStudents.map(student => (
                          <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 dark:text-gray-300">
                             <td className="p-4 font-bold">{student.name}</td>
                             <td className="p-4">{student.class}</td>
                             <td className="p-4">
                                <div className="flex items-center gap-2">
                                   <div className="w-16 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                                      <div className={`h-full ${student.performance >= 7 ? 'bg-green-500' : student.performance >= 5 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{width: `${student.performance * 10}%`}}></div>
                                   </div>
                                   <span>{student.performance}</span>
                                </div>
                             </td>
                             <td className="p-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                  student.status === 'Excelente' ? 'bg-green-100 text-green-700' :
                                  student.status === 'Crítico' ? 'bg-red-100 text-red-700' :
                                  'bg-blue-100 text-blue-700'
                                }`}>
                                   {student.status}
                                </span>
                             </td>
                             <td className="p-4">
                                <button onClick={() => handleOpenStudentProfile(student)} className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline">Ver Perfil</button>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
             <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-4">
                <Settings size={40} className="animate-spin-slow"/>
             </div>
             <h2 className="text-xl font-bold dark:text-gray-300">Em Desenvolvimento</h2>
             <p>A seção <b>{activeSection}</b> estará disponível em breve.</p>
          </div>
        );
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20}/> },
    { id: 'classes', label: 'Minhas Turmas', icon: <GraduationCap size={20}/> },
    { id: 'students', label: 'Gerenciar Alunos', icon: <Users size={20}/> },
    { id: 'activities', label: 'Criar Atividades', icon: <FileText size={20}/> },
    { id: 'reports', label: 'Relatórios', icon: <BarChart2 size={20}/> },
    { id: 'ai', label: 'Assistente IA', icon: <Bot size={20}/> },
    { id: 'library', label: 'Biblioteca', icon: <FolderOpen size={20}/> },
    { id: 'agenda', label: 'Agenda', icon: <Calendar size={20}/> },
    { id: 'communication', label: 'Comunicação', icon: <MessageSquare size={20}/> },
    { id: 'settings', label: 'Configurações', icon: <Settings size={20}/> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
       {/* Mobile Overlay */}
       {mobileMenuOpen && (
          <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setMobileMenuOpen(false)}></div>
       )}

       {/* Sidebar */}
       <aside className={`fixed lg:sticky top-20 left-0 h-[calc(100vh-5rem)] w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-40 transform transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} overflow-y-auto`}>
          <div className="p-4 space-y-1">
             <div className="px-4 mb-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Menu Principal</p>
             </div>
             {navItems.map(item => (
               <button 
                  key={item.id}
                  onClick={() => { setActiveSection(item.id as TeacherSection); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                    activeSection === item.id 
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
               >
                  {item.icon}
                  {item.label}
               </button>
             ))}
             
             <div className="border-t border-gray-100 dark:border-gray-700 my-4 pt-4">
                <button 
                  onClick={() => { setActiveSection('vip'); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 text-amber-600 dark:text-amber-500 border border-amber-100 dark:border-amber-800/30`}
                >
                   <Gem size={20}/> Área VIP
                </button>
             </div>
          </div>
       </aside>

       {/* Main Content */}
       <main className="flex-1 w-full min-w-0 pt-20 lg:pt-4">
          <div className="lg:hidden p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between sticky top-20 z-20">
             <span className="font-bold text-gray-700 dark:text-white capitalize">{navItems.find(i => i.id === activeSection)?.label || 'Menu'}</span>
             <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-gray-600 dark:text-gray-300">
                {mobileMenuOpen ? <X/> : <Menu/>}
             </button>
          </div>
          
          <div className="p-4 lg:p-8 h-full">
             {renderContent()}
          </div>
       </main>

       {/* --- Modals for Interactions --- */}
       
       <Modal
         isOpen={!!viewingStudent}
         onClose={() => setViewingStudent(null)}
         title={viewingStudent?.name || 'Perfil do Aluno'}
         size="lg"
       >
          {viewingStudent && (
              <div className="space-y-6">
                  <div className="flex items-center gap-4 border-b border-gray-100 dark:border-gray-700 pb-6">
                      <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-xl">
                          {viewingStudent.name.charAt(0)}
                      </div>
                      <div>
                          <h3 className="font-bold text-xl dark:text-white">{viewingStudent.name}</h3>
                          <p className="text-gray-500">{viewingStudent.class} • {viewingStudent.email}</p>
                      </div>
                      <div className="ml-auto">
                          <span className={`px-3 py-1 rounded-full font-bold text-sm ${viewingStudent.status === 'Excelente' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                              {viewingStudent.status}
                          </span>
                      </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                      <div>
                          <h4 className="font-bold dark:text-white mb-2">Desempenho Recente</h4>
                          <div className="h-48 border border-gray-100 dark:border-gray-700 rounded-lg p-2">
                              <ResponsiveContainer width="100%" height="100%">
                                  <LineChart data={[
                                      {name: 'Sem 1', val: 6}, 
                                      {name: 'Sem 2', val: viewingStudent.performance}, 
                                      {name: 'Sem 3', val: Math.min(10, viewingStudent.performance + 1)}
                                  ]}>
                                      <Line type="monotone" dataKey="val" stroke="#4f46e5" strokeWidth={3} />
                                      <XAxis dataKey="name" hide/>
                                      <Tooltip/>
                                  </LineChart>
                              </ResponsiveContainer>
                          </div>
                      </div>
                      <div className="space-y-3">
                          <h4 className="font-bold dark:text-white mb-2">Ações Rápidas</h4>
                          <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-100 dark:border-gray-700 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                              <MessageSquare size={16}/> Enviar Mensagem
                          </button>
                          <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-100 dark:border-gray-700 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                              <FileText size={16}/> Ver Histórico de Notas
                          </button>
                          <button className="w-full text-left p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-100 dark:border-red-900 flex items-center gap-2 text-sm text-red-600">
                              <AlertTriangle size={16}/> Reportar Ocorrência
                          </button>
                      </div>
                  </div>
              </div>
          )}
       </Modal>

       <Modal
         isOpen={!!editingClass}
         onClose={() => setEditingClass(null)}
         title={`Editar Turma: ${editingClass?.name}`}
         size="md"
       >
           <div className="space-y-4">
               <div>
                   <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Nome da Turma</label>
                   <input type="text" defaultValue={editingClass?.name} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
               </div>
               <div className="flex justify-end gap-2 mt-4">
                   <button onClick={() => setEditingClass(null)} className="px-4 py-2 text-gray-600 dark:text-gray-400">Cancelar</button>
                   <button onClick={() => { alert('Alterações salvas!'); setEditingClass(null); }} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Salvar</button>
               </div>
           </div>
       </Modal>

    </div>
  );
};
