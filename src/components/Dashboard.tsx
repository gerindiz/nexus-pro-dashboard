import React, { useState, useMemo, useEffect } from 'react'; // Agregamos useEffect
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, TrendingDown, DollarSign, Users, ShoppingBag, 
  Activity, BarChart3, Settings, Trash2, X, Plus
} from 'lucide-react';

// IMPORTANTE: Importamos la conexión que creamos antes
import { supabase } from '../lib/supabaseClient';

// --- Types ---
interface Transaction {
  id: string | number; // Cambiamos a string | number por el ID de Supabase
  user_name: string;   // Cambiado para coincidir con tu tabla de Supabase
  email: string;
  amount: number;
  status: string;
  created_at?: string; 
}

interface DashboardProps {
  searchTerm: string;
}

const REVENUE_HISTORY = [
  { name: 'Ene', value: 4000 }, { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 }, { name: 'Abr', value: 2780 },
  { name: 'May', value: 1890 }, { name: 'Jun', value: 2390 },
  { name: 'Jul', value: 3490 },
];

export const Dashboard: React.FC<DashboardProps> = ({ searchTerm }) => {
  // Empezamos con la lista vacía hasta que carguen los datos de Supabase
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', amount: '' });
  const [loading, setLoading] = useState(true);

  // --- 1. FUNCIÓN PARA TRAER DATOS (FETCH) ---
  const fetchTransactions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('id', { ascending: false }); // Los más nuevos arriba

    if (error) {
      console.error('Error al traer datos:', error.message);
    } else {
      setTransactions(data || []);
    }
    setLoading(false);
  };

  // Ejecutamos fetchTransactions al cargar el componente
  useEffect(() => {
    fetchTransactions();
  }, []);

  // --- 2. FUNCIÓN PARA CREAR (INSERT) ---
  const handleCreateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.amount) return;

    const newEntry = {
      user_name: formData.name,
      email: `${formData.name.toLowerCase().replace(/\s/g, '')}@custom.com`,
      amount: parseFloat(formData.amount),
      status: 'Success',
    };

    const { error } = await supabase.from('transactions').insert([newEntry]);

    if (error) {
      alert("Error al guardar: " + error.message);
    } else {
      fetchTransactions(); // Recargamos la lista
      setFormData({ name: '', amount: '' });
      setIsModalOpen(false);
    }
  };

  // --- 3. FUNCIÓN PARA ELIMINAR (DELETE) ---
  const handleDelete = async (id: string | number) => {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) {
      alert("Error al eliminar: " + error.message);
    } else {
      // Actualizamos el estado local para que desaparezca rápido
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  const filteredTransactions = useMemo(() => {
    const query = searchTerm.toLowerCase();
    return transactions.filter(t => 
      t.user_name.toLowerCase().includes(query) ||
      t.email.toLowerCase().includes(query)
    );
  }, [searchTerm, transactions]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Panel de Control</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Conectado a Base de Datos Real.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-all flex items-center justify-center gap-2 group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform" /> 
          Nueva Operación
        </button>
      </div>

      {/* Stats (Mantenemos tus componentes visuales) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Ingresos" value={`$${transactions.reduce((acc, t) => acc + t.amount, 0).toLocaleString()}`} trend="+12%" isPositive icon={DollarSign} color="text-emerald-500" bg="bg-emerald-500/10" />
        <StatCard title="Usuarios" value={transactions.length.toString()} trend="+8%" isPositive icon={Users} color="text-blue-500" bg="bg-blue-500/10" />
        <StatCard title="Ventas" value={transactions.length.toString()} trend="-2%" isPositive={false} icon={ShoppingBag} color="text-indigo-500" bg="bg-indigo-500/10" />
        <StatCard title="Estado DB" value={loading ? "..." : "Online"} trend="OK" isPositive icon={Activity} color="text-rose-500" bg="bg-rose-500/10" />
      </div>

      {/* Gráfico y Acciones Rápidas (Igual que antes) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors text-left">
          <h3 className="text-lg font-bold mb-6 dark:text-white">Flujo de Caja</h3>
          <div className="h-75 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_HISTORY}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-700" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', backgroundColor: '#1e293b', color: '#fff'}} />
                <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fill="url(#colorVal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors text-left">
          <h3 className="text-lg font-bold mb-6 dark:text-white">Acciones Rápidas</h3>
          <div className="space-y-4">
            <ActionItem title="Invitar Miembros" desc="Gestión de equipo" icon={Users} />
            <ActionItem title="Exportar Datos" desc="Formato CSV/PDF" icon={BarChart3} />
            <ActionItem title="API Keys" desc="Configuración técnica" icon={Settings} />
          </div>
        </div>
      </div>

      {/* Tabla con datos de Supabase */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors text-left">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-bold dark:text-white">Operaciones Recientes</h3>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-10 text-center text-slate-500">Cargando base de datos...</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase">
                  <th className="px-6 py-4 text-left">Usuario</th>
                  <th className="px-6 py-4 text-left">Monto</th>
                  <th className="px-6 py-4 text-left">Estado</th>
                  <th className="px-6 py-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredTransactions.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                          {t.user_name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-bold dark:text-white">{t.user_name}</p>
                          <p className="text-xs text-slate-400">{t.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold dark:text-white">${t.amount.toFixed(2)}</td>
                    <td className="px-6 py-4"><Badge status={t.status} /></td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleDelete(t.id)} className="text-slate-300 hover:text-rose-500 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal (Igual que antes) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold dark:text-white">Nueva Operación</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white"><X /></button>
            </div>
            <form onSubmit={handleCreateTransaction} className="space-y-4 text-left">
              <div>
                <label className="block text-sm font-bold mb-2 dark:text-slate-300">Nombre del Cliente</label>
                <input 
                  type="text" required 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-4 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 dark:text-white outline-none" 
                  placeholder="Ej. Lionel Messi"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 dark:text-slate-300">Monto ($)</label>
                <input 
                  type="number" required 
                  value={formData.amount} 
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  className="w-full p-4 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 dark:text-white outline-none" 
                  placeholder="0.00"
                />
              </div>
              <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-lg transition-all mt-4">
                Confirmar Registro
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Sub-componentes (Mantenemos tus componentes visuales) ---

interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  isPositive: boolean;
  icon: React.ElementType;
  color: string;
  bg: string;
}

const StatCard = ({ title, value, trend, isPositive, icon: Icon, color, bg }: StatCardProps) => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md text-left">
    <div className="flex justify-between items-start mb-4">
      <div className={`${bg} p-3 rounded-xl`}><Icon className={`${color} w-6 h-6`} /></div>
      <span className={`text-xs font-bold px-2 py-1 rounded-lg ${isPositive ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10' : 'text-rose-600 bg-rose-50 dark:bg-rose-500/10'}`}>
        {trend}
      </span>
    </div>
    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{title}</p>
    <p className="text-2xl font-bold mt-1 text-slate-900 dark:text-white transition-colors">{value}</p>
  </div>
);

const Badge = ({ status }: { status: string }) => {
  const styles: any = {
    Success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
    Warning: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
    Danger: "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400",
  };
  const currentStyle = styles[status] || styles.Success;
  return <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${currentStyle}`}>{status}</span>;
};

const ActionItem = ({ title, desc, icon: Icon }: { title: string, desc: string, icon: React.ElementType }) => (
  <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors group">
    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-all text-slate-600 dark:text-slate-400">
      <Icon size={18} />
    </div>
    <div>
      <h4 className="text-sm font-bold dark:text-white">{title}</h4>
      <p className="text-xs text-slate-500 dark:text-slate-400">{desc}</p>
    </div>
  </div>
);