import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, BarChart3, Settings, Search, Bell, Sun, Moon } from 'lucide-react';

export function Layout({ children, searchTerm, setSearchTerm }) {
  const [darkMode, setDarkMode] = useState(false);

  // Esta función añade o quita la clase "dark" del HTML principal
  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    // bg-white para modo claro, dark:bg-slate-950 para modo oscuro
    <div className="flex h-screen bg-white dark:bg-slate-950 transition-colors duration-500">
      
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-slate-900 text-white">
        <div className="p-6 text-2xl font-bold text-indigo-400">NEXUS PRO</div>
        <nav className="flex-1 px-4 space-y-2">
          <div className="flex items-center gap-3 p-3 bg-indigo-600 rounded-lg cursor-pointer"><LayoutDashboard size={20} /> Dashboard</div>
          <div className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg cursor-pointer text-slate-400"><Users size={20} /> Usuarios</div>
          <div className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg cursor-pointer text-slate-400"><BarChart3 size={20} /> Reportes</div>
          <div className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg cursor-pointer text-slate-400"><Settings size={20} /> Ajustes</div>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 transition-colors">
          <div className="relative w-96 text-left">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar operaciones..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-xl dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4">
            {/* BOTÓN DE MODO OSCURO */}
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
            >
              {darkMode ? <Sun size={22} className="text-amber-400" /> : <Moon size={22} />}
            </button>
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">AD</div>
          </div>
        </header>

        {/* Contenido Principal con fondo dinámico */}
        <main className="flex-1 overflow-y-auto p-8 bg-slate-50 dark:bg-slate-950 transition-colors">
          {children}
        </main>
      </div>
    </div>
  );
}

// Sub-componente para los items del menú lateral
const NavItem = ({ icon: Icon, label, active = false }) => (
  <div className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
    active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
  }`}>
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </div>
);