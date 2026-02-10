import React, { useState, useEffect } from 'react';
import { User, AccessibilitySettings, UserRole } from './types';
import { AccessibilityMenu } from './components/AccessibilityMenu';
import { StudentDashboard } from './components/StudentDashboard';
import { TeacherDashboard } from './components/TeacherDashboard';
import { Brain, LayoutDashboard, LogOut, Gem, ChevronRight, Check, Users, MessageCircle, Mail, Sparkles, ArrowRight, Play, Star, Moon, Sun, User as UserIcon, Lock, Smartphone, Monitor, Rocket, BrainCircuit } from 'lucide-react';
import { Modal } from './components/Modal';
import { VLibrasWidget } from './components/VLibrasWidget';

const App: React.FC = () => {
  // --- STATE ---
  const [currentPage, setCurrentPage] = useState<'home' | 'auth' | 'student' | 'teacher' | 'vip'>('home');
  const [user, setUser] = useState<User | null>(null);
  
  // Auth State
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');

  // Device Simulation State
  const [isMobileView, setIsMobileView] = useState(false);

  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
             (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  const [accessibility, setAccessibility] = useState<AccessibilitySettings>({
    highContrast: false,
    fontSize: 1,
    dyslexicFont: false,
    signLanguageAvatar: false,
    reduceMotion: false,
    calmPalette: false,
  });

  // Modal States
  const [vipModalOpen, setVipModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [contactModalOpen, setContactModalOpen] = useState(false);

  // --- EFFECTS ---
  
  // Dark Mode Effect
  useEffect(() => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Accessibility Effect
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    
    // Font Size
    html.style.fontSize = `${16 * accessibility.fontSize}px`;
    
    // High Contrast
    if (accessibility.highContrast) {
        body.classList.add('contrast-more');
        html.style.filter = 'contrast(125%)';
    } else {
        body.classList.remove('contrast-more');
        html.style.filter = 'none';
    }

    // Dyslexic Font
    if (accessibility.dyslexicFont) {
        body.classList.add('dyslexic-font');
    } else {
        body.classList.remove('dyslexic-font');
    }

    // Reduce Motion
    if (accessibility.reduceMotion) {
      body.classList.add('reduce-motion');
    } else {
      body.classList.remove('reduce-motion');
    }

    // Calm Palette
    if (accessibility.calmPalette) {
      body.classList.add('calm-palette');
    } else {
      body.classList.remove('calm-palette');
    }

  }, [accessibility]);

  // --- HANDLERS ---
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleDeviceView = () => {
    setIsMobileView(!isMobileView);
  };

  const handleNavigateAuth = (role: UserRole = 'student') => {
      setSelectedRole(role);
      setCurrentPage('auth');
  };

  const handleLoginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;

    if (!name) {
        alert("Por favor, preencha o seu nome.");
        return;
    }

    // Gera um email fictício baseado no nome para manter a compatibilidade com a tipagem
    const generatedEmail = `${name.toLowerCase().replace(/\s+/g, '.')}@neuroedu.ai`;

    // Simulate login logic
    const newUser: User = {
        id: Date.now().toString(),
        name: name,
        email: generatedEmail,
        role: selectedRole,
        points: selectedRole === 'student' ? 0 : 0, // New users start with 0
        level: 1,
        vipPlan: 'basic'
    };

    // Simulate restoring previous progress for demo purposes if specific names are used
    if (name.toLowerCase().includes('joão') || name.toLowerCase().includes('joao')) {
        newUser.points = 1250;
        newUser.level = 5;
    }

    setUser(newUser);
    setCurrentPage(selectedRole === 'student' ? 'student' : 'teacher');
  };

  const logout = () => {
    setUser(null);
    setCurrentPage('home');
  };

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => prev ? ({ ...prev, ...updates }) : null);
  };

  const updateAccessibility = (newSettings: Partial<AccessibilitySettings>) => {
    setAccessibility(prev => ({ ...prev, ...newSettings }));
  };

  const handleSelectPlan = (planName: string) => {
    setSelectedPlan(planName);
    setVipModalOpen(true);
  };

  const confirmSubscription = () => {
      setVipModalOpen(false);
      alert(`Obrigado! Sua assinatura ${selectedPlan} foi confirmada.`);
      if (user) {
          updateUser({ vipPlan: 'premium' }); 
      }
      setCurrentPage('student'); // Go back to dashboard
  };

  // --- SUB-COMPONENTS ---
  const NavBar = () => (
    <nav className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${currentPage === 'home' ? 'bg-transparent' : 'glass-panel border-b border-white/20'}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between h-24 items-center">
          <div className="flex items-center cursor-pointer group" onClick={() => setCurrentPage('home')}>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2.5 rounded-2xl mr-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
               <Brain className="text-primary-600 dark:text-white w-8 h-8" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-gray-900 dark:text-white">
              NeuroEdu<span className="text-primary-600">+</span>
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button 
                onClick={toggleDarkMode}
                className="p-3 rounded-full bg-white/50 hover:bg-white/80 dark:bg-black/20 dark:hover:bg-black/40 backdrop-blur-sm transition-all shadow-sm"
                aria-label="Alternar tema"
            >
                {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
            </button>

            {user ? (
               <div className="flex items-center gap-4 bg-white/50 dark:bg-black/20 backdrop-blur-md p-1.5 pr-6 pl-2 rounded-full border border-white/20 shadow-sm">
                 <div className="w-10 h-10 bg-gradient-to-tr from-primary-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    {user.name.charAt(0)}
                 </div>
                 <div className="hidden md:flex flex-col">
                    <span className="text-sm font-bold text-gray-900 dark:text-white leading-tight">{user.name}</span>
                    <span className="text-[10px] text-primary-600 dark:text-primary-400 font-bold uppercase tracking-wider">{user.role}</span>
                 </div>
                 <button onClick={logout} className="ml-2 p-2 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                   <LogOut size={18} />
                 </button>
               </div>
            ) : (
                <div className="hidden md:flex items-center gap-4">
                    <button onClick={() => setCurrentPage('home')} className="text-gray-600 hover:text-gray-900 font-bold px-4 py-2 transition-colors dark:text-gray-300 dark:hover:text-white">Início</button>
                    <button onClick={() => handleNavigateAuth('student')} className="bg-gray-900 text-white dark:bg-white dark:text-gray-900 px-8 py-3 rounded-full font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center gap-2">
                        Entrar <ArrowRight size={18}/>
                    </button>
                </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );

  const AuthPage = () => (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-full -z-10 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-black"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-400/20 rounded-full blur-[100px] animate-blob"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-400/20 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>

          <div className="bg-white/70 dark:bg-gray-800/60 backdrop-blur-2xl border border-white/50 dark:border-gray-700 shadow-2xl rounded-[40px] p-8 md:p-14 w-full max-w-lg relative z-10 animate-in zoom-in duration-500">
              <div className="text-center mb-10">
                  <div className="w-20 h-20 bg-gradient-to-tr from-primary-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary-500/30 transform rotate-3 hover:rotate-0 transition-all duration-500">
                      <Brain className="text-white w-10 h-10" />
                  </div>
                  <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">Bem-vindo(a)</h2>
                  <p className="text-gray-500 dark:text-gray-400 text-lg">Acesse sua conta para continuar.</p>
              </div>

              {/* Role Switcher */}
              <div className="flex bg-gray-100/50 dark:bg-gray-700/50 p-1.5 rounded-2xl mb-8 border border-gray-200 dark:border-gray-600">
                  <button 
                    onClick={() => setSelectedRole('student')}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${selectedRole === 'student' ? 'bg-white dark:bg-gray-600 text-primary-600 shadow-md transform scale-105' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
                  >
                      Aluno
                  </button>
                  <button 
                    onClick={() => setSelectedRole('teacher')}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${selectedRole === 'teacher' ? 'bg-white dark:bg-gray-600 text-primary-600 shadow-md transform scale-105' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
                  >
                      Professor
                  </button>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-6">
                  <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-2">Nome Completo</label>
                      <input 
                        name="name" 
                        type="text" 
                        placeholder="Ex: Maria Silva" 
                        required
                        className="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900 focus:border-primary-500 outline-none transition-all font-medium"
                      />
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-gray-900 text-white dark:bg-white dark:text-gray-900 font-bold py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3 text-lg"
                  >
                      {authMode === 'login' ? 'Entrar' : 'Criar Conta'} <ArrowRight size={22} />
                  </button>
              </form>

              <div className="mt-8 text-center">
                  <button onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} className="text-gray-500 hover:text-primary-600 font-bold text-sm transition-colors">
                      {authMode === 'login' ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Fazer Login'}
                  </button>
              </div>
          </div>
      </div>
  );

  const LandingPage = () => (
    <div className="animate-fade-in relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 via-white to-purple-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 -z-20"></div>
      
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-32 lg:pt-48 pb-32 relative">
        <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-1/2 text-center lg:text-left z-10">
                <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white dark:bg-white/5 border border-primary-200 dark:border-white/10 shadow-lg mb-8 animate-in slide-in-from-bottom-4 fade-in duration-700">
                    <Rocket className="w-5 h-5 text-primary-500" />
                    <span className="text-sm font-bold uppercase tracking-widest text-primary-600 dark:text-primary-300">Educação 4.0</span>
                </div>
                
                <h1 className="text-6xl lg:text-8xl font-black text-gray-900 dark:text-white leading-[0.95] tracking-tight mb-8">
                    Aprenda <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-purple-600 to-pink-500">
                        Sem Limites.
                    </span>
                </h1>
                
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium mb-10">
                    Uma plataforma adaptativa que usa IA para personalizar seu ensino, conectar você a mentores universitários e eliminar barreiras de aprendizado.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                    <button 
                        onClick={() => handleNavigateAuth('student')}
                        className="px-10 py-5 bg-gray-900 text-white dark:bg-white dark:text-gray-900 text-xl font-bold rounded-full shadow-2xl hover:shadow-primary-500/20 hover:scale-105 transition-all flex items-center justify-center gap-3"
                    >
                        Começar Agora <ArrowRight size={22}/>
                    </button>
                    <button 
                        onClick={() => setContactModalOpen(true)}
                        className="px-10 py-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-100 dark:border-gray-700 text-xl font-bold rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center justify-center gap-3"
                    >
                        Saiba Mais
                    </button>
                </div>
            </div>
            
            <div className="lg:w-1/2 relative z-10">
                {/* Abstract 3D Representation */}
               <div className="relative rounded-[40px] overflow-hidden shadow-2xl border-8 border-white dark:border-gray-700/50 bg-gray-900 rotate-3 hover:rotate-0 transition-transform duration-700 group">
                   <img 
                     src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80" 
                     alt="Students Learning" 
                     className="w-full h-auto object-cover opacity-80 group-hover:scale-110 transition-transform duration-1000"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                   
                   {/* Floating UI Cards */}
                   <div className="absolute bottom-10 left-10 right-10">
                       <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl">
                           <div className="flex items-center gap-4 mb-4">
                               <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold">
                                   <BrainCircuit />
                               </div>
                               <div>
                                   <h3 className="text-white font-bold text-lg">Análise de IA</h3>
                                   <p className="text-gray-300 text-sm">Personalizando trilha...</p>
                               </div>
                           </div>
                           <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                               <div className="bg-primary-400 h-full w-3/4"></div>
                           </div>
                       </div>
                   </div>
               </div>
            </div>
        </div>
      </div>
    </div>
  );

  const VipPage = () => {
    // Reuse existing VipPage logic or improve if desired.
    // For brevity, keeping it simple as dashboard was the focus.
    return (
        <div className="py-32 px-6 max-w-7xl mx-auto animate-fade-in text-center">
            <h1 className="text-5xl font-black mb-6 dark:text-white">Planos que cabem no seu bolso</h1>
            <p className="text-xl text-gray-500 mb-16">Escolha a melhor opção para acelerar seu aprendizado.</p>
            {/* ... Plan cards similar to previous ... */}
            <div className="grid md:grid-cols-3 gap-8 text-left">
                 {/* Basic */}
                 <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl hover:-translate-y-2 transition-transform">
                     <h3 className="text-2xl font-bold dark:text-white">Básico</h3>
                     <div className="text-4xl font-black mt-4 mb-8">R$ 19<span className="text-lg font-medium text-gray-400">/mês</span></div>
                     <button onClick={() => handleSelectPlan('Básico')} className="w-full py-4 rounded-xl bg-gray-100 dark:bg-gray-700 font-bold hover:bg-gray-200 transition-colors">Escolher</button>
                 </div>
                 {/* Pro */}
                 <div className="bg-gray-900 text-white p-8 rounded-3xl shadow-2xl transform scale-105 relative">
                     <div className="absolute top-0 right-0 bg-primary-500 text-white text-xs font-bold px-4 py-2 rounded-bl-2xl rounded-tr-2xl">POPULAR</div>
                     <h3 className="text-2xl font-bold">Pro</h3>
                     <div className="text-4xl font-black mt-4 mb-8">R$ 29<span className="text-lg font-medium text-gray-400">/mês</span></div>
                     <button onClick={() => handleSelectPlan('Pro')} className="w-full py-4 rounded-xl bg-primary-600 font-bold hover:bg-primary-700 transition-colors">Escolher</button>
                 </div>
                 {/* Premium */}
                 <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl hover:-translate-y-2 transition-transform">
                     <h3 className="text-2xl font-bold dark:text-white">Premium</h3>
                     <div className="text-4xl font-black mt-4 mb-8">R$ 39<span className="text-lg font-medium text-gray-400">/mês</span></div>
                     <button onClick={() => handleSelectPlan('Premium')} className="w-full py-4 rounded-xl bg-gray-100 dark:bg-gray-700 font-bold hover:bg-gray-200 transition-colors">Escolher</button>
                 </div>
            </div>
        </div>
    )
  }

  // --- DEVICE SIMULATOR CONTAINER ---
  const containerClass = isMobileView 
    ? "max-w-[375px] mx-auto border-[12px] border-gray-900 rounded-[50px] shadow-2xl overflow-hidden h-[812px] relative mt-10 bg-white dark:bg-gray-900" 
    : "w-full min-h-screen";

  const innerClass = isMobileView 
    ? "h-full overflow-y-auto custom-scrollbar relative bg-gray-50 dark:bg-gray-900"
    : "min-h-screen flex flex-col";

  // --- RENDER ---
  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${accessibility.highContrast ? 'bg-white' : 'bg-gray-50 dark:bg-gray-900'}`}>
        {/* Device Switcher Toggle (Bottom Left) */}
        <button 
            onClick={toggleDeviceView}
            className="fixed bottom-6 left-6 z-[99999] bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform border border-gray-100 dark:border-gray-700"
            title={isMobileView ? "Alternar para Desktop" : "Alternar para Mobile"}
        >
            {isMobileView ? <Monitor size={24} /> : <Smartphone size={24} />}
        </button>

      <div className={containerClass}>
         <div className={innerClass}>
            <NavBar />

            <Modal isOpen={vipModalOpen} onClose={() => setVipModalOpen(false)} title="Confirmar Assinatura">
                <div className="space-y-6 text-center p-4">
                    <div className="w-24 h-24 bg-gradient-to-tr from-primary-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                        <Gem size={48} className="text-primary-600" />
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold dark:text-white">Assinar {selectedPlan}</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Invista no seu futuro hoje.</p>
                    </div>
                    
                    <button onClick={confirmSubscription} className="w-full bg-gray-900 text-white dark:bg-white dark:text-gray-900 font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all text-lg">
                        Confirmar
                    </button>
                </div>
            </Modal>

            <Modal isOpen={contactModalOpen} onClose={() => setContactModalOpen(false)} title="Fale Conosco">
                <div className="space-y-6 p-2">
                    <p className="text-center text-gray-500 mb-4">Estamos aqui para ajudar você.</p>
                    <form onSubmit={(e) => {e.preventDefault(); alert("Mensagem enviada!"); setContactModalOpen(false);}} className="space-y-4">
                        <input type="text" placeholder="Nome" className="w-full border border-gray-200 dark:border-gray-600 p-4 rounded-xl dark:bg-gray-700 dark:text-white outline-none" required />
                        <textarea placeholder="Como podemos ajudar?" className="w-full border border-gray-200 dark:border-gray-600 p-4 rounded-xl dark:bg-gray-700 dark:text-white h-32 outline-none resize-none" required></textarea>
                        <button type="submit" className="w-full bg-primary-600 text-white py-4 rounded-xl font-bold hover:bg-primary-700 shadow-lg">Enviar</button>
                    </form>
                </div>
            </Modal>
            
            <main className="flex-grow w-full">
                {currentPage === 'home' && <LandingPage />}
                {currentPage === 'auth' && <AuthPage />}
                {currentPage === 'vip' && <VipPage />}
                {currentPage === 'student' && user && <StudentDashboard user={user} updateUser={updateUser} onLogout={logout} />}
                {currentPage === 'teacher' && user && <TeacherDashboard />}
            </main>

            {/* Global Accessibility Menu */}
            <div className={isMobileView ? "absolute bottom-0 right-0 p-4" : ""}>
                 <AccessibilityMenu settings={accessibility} updateSettings={updateAccessibility} />
            </div>

             <div className={isMobileView ? "absolute bottom-0 right-0" : ""}>
                <VLibrasWidget />
            </div>

            {/* Footer only on home/vip */}
            {(currentPage === 'home' || currentPage === 'vip') && (
                <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 py-12 relative z-10">
                    <div className="max-w-7xl mx-auto px-6 text-center">
                        <div className="flex justify-center items-center gap-2 mb-6 opacity-50 grayscale hover:grayscale-0 transition-all">
                            <Brain size={24}/>
                            <span className="font-bold text-xl">NeuroEdu+</span>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">&copy; 2024 NeuroEdu+. Tecnologia para humanos.</p>
                    </div>
                </footer>
            )}
         </div>
      </div>
    </div>
  );
};

export default App;