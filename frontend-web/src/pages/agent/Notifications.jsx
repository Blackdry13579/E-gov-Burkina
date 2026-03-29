import React from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import { Bell, Mail, ShieldAlert, RefreshCw, Megaphone, Clock } from 'lucide-react';

const typeConfig = {
  SOUMISSION: { icon: Bell,         color: 'bg-blue-100 text-[#1A237E]',   label: 'Demande Soumise' },
  PAIEMENT:   { icon: Mail,         color: 'bg-green-100 text-[#00875A]',  label: 'Paiement Confirmé' },
  SECURITE:   { icon: ShieldAlert,  color: 'bg-red-100 text-[#E52E2E]',    label: 'Alerte Sécurité' },
  VALIDATION: { icon: RefreshCw,    color: 'bg-purple-100 text-purple-600', label: 'Validation' },
  RAPPEL:     { icon: Megaphone,    color: 'bg-amber-100 text-amber-600',  label: 'Rappel' },
};

const channelColors = {
  'In-App': 'bg-blue-50 text-[#1A237E]',
  'Email':  'bg-green-50 text-green-600',
  'SMS':    'bg-purple-50 text-purple-600',
};

const Notifications = () => {
  const { notifications: notifs, loading, markAllRead } = useNotifications();

  // Adaptation aux noms de variables du service (lu au lieu de read)
  const unreadCount = notifs.filter(n => !n.lu).length;

  return (
    <div className="space-y-4 max-w-2xl mx-auto font-sans">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Centre de Notifications</h1>
          <p className="text-xs font-medium text-gray-400 mt-0.5">
            {unreadCount} notification{unreadCount > 1 ? 's' : ''} non lue{unreadCount > 1 ? 's' : ''}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="px-4 py-2 bg-[#1A237E] text-white rounded-xl text-xs font-bold hover:bg-[#0D145A] transition-all shadow-md active:scale-95"
          >
            Tout marquer lu
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-[#1A237E]/20 border-t-[#1A237E] rounded-full animate-spin"></div>
        </div>
      ) : notifs.length === 0 ? (
        <div className="py-20 text-center bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200">
          <Bell size={32} className="mx-auto text-gray-200 mb-3" />
          <p className="text-lg font-black text-gray-400">Aucune notification</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifs.map((notif) => {
            const cfg = typeConfig[notif.type] || { icon: Bell, color: 'bg-gray-100 text-gray-600' };
            const Icon = cfg.icon;
            return (
              <div
                key={notif.id}
                className={`group bg-white rounded-[2rem] border p-5 flex items-start gap-5 transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/5 ${
                  !notif.lu 
                    ? 'border-[#1A237E]/20 ring-4 ring-[#1A237E]/5 bg-slate-50/50' 
                    : 'border-gray-50 hover:border-[#1A237E]/10'
                }`}
              >
                <div className={`w-12 h-12 rounded-[1.2rem] flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 duration-500 ${cfg.color} shadow-sm`}>
                  <Icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <h3 className={`text-base font-black tracking-tight leading-tight ${!notif.lu ? 'text-gray-900' : 'text-gray-700'}`}>
                      {notif.titre || "Notification"}
                    </h3>
                    {!notif.lu && (
                      <span className="flex items-center gap-1 px-2.5 py-1 bg-[#1A237E] text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-blue-900/20 shrink-0">
                        NOUVEAU
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-gray-500 leading-snug">
                    {notif.message}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mt-4">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
                      <Clock size={12} className="text-gray-300" />
                      <span>{notif.created_at}</span>
                    </div>
                    {notif.badge_statut && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-lg text-[9px] font-black uppercase tracking-widest border border-gray-100">
                        {notif.badge_statut}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Notifications;
