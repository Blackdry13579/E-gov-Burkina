import React from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import { Bell, Mail, MessageSquare, ShieldAlert, RefreshCw, Megaphone } from 'lucide-react';

const typeConfig = {
  SOUMISSION: { icon: Bell,         color: 'bg-blue-100 text-[#1A237E]',   label: 'Demande Soumise' },
  PAIEMENT:   { icon: Mail,         color: 'bg-green-100 text-[#00875A]',  label: 'Paiement Confirmé' },
  SECURITE:   { icon: ShieldAlert,  color: 'bg-red-100 text-[#E52E2E]',    label: 'Alerte Sécurité' },
  VALIDATION: { icon: RefreshCw,    color: 'bg-purple-100 text-purple-600', label: 'Validation' },
  RAPPEL:     { icon: Megaphone,    color: 'bg-amber-100 text-amber-600',  label: 'Rappel' },
};

const channelColors = {
  'In-App': 'bg-blue-50 text-institutional',
  'Email':  'bg-green-50 text-green-600',
  'SMS':    'bg-purple-50 text-purple-600',
};

const Notifications = () => {
  const { notifications: notifs, loading, markAllRead } = useNotifications();

  const unreadCount = notifs.filter(n => !n.read).length;

  return (
    <div className="space-y-6 max-w-full">
      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Centre de Notifications</h1>
          <p className="text-sm font-medium text-gray-400 mt-1">{unreadCount} notification{unreadCount > 1 ? 's' : ''} non lue{unreadCount > 1 ? 's' : ''}</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="px-4 py-2 bg-[#1A237E]/5 text-[#1A237E] rounded-xl text-sm font-bold hover:bg-[#1A237E] hover:text-white transition-all shadow-sm"
          >
            Tout marquer comme lu
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-[#1A237E]/20 border-t-[#1A237E] rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {notifs.map((notif) => {
            const cfg = typeConfig[notif.type] || { icon: Bell, color: 'bg-gray-100 text-gray-600' };
            const Icon = cfg.icon;
            return (
              <div
                key={notif.id}
                className={`group bg-white rounded-[2rem] border p-6 flex items-start gap-6 transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/5 ${
                  !notif.read 
                    ? 'border-[#1A237E]/20 ring-4 ring-[#1A237E]/5 bg-slate-50/50' 
                    : 'border-gray-100 hover:border-[#1A237E]/10'
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 duration-300 ${cfg.color} shadow-sm`}>
                  <Icon size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-1">
                    <h3 className={`text-lg font-black tracking-tight ${!notif.read ? 'text-gray-900' : 'text-gray-700'}`}>
                      {notif.title}
                    </h3>
                    {!notif.read && (
                      <span className="flex items-center gap-1.5 px-3 py-1 bg-[#1A237E] text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-blue-900/20">
                        Nouveau
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-gray-500 leading-relaxed max-w-4xl">
                    {notif.body}
                  </p>
                  <div className="flex items-center gap-4 mt-4 text-xs font-bold">
                    <span className={`px-3 py-1 rounded-lg ${channelColors[notif.channel] || 'bg-gray-100 text-gray-500'} border border-black/5`}>
                      {notif.channel.toUpperCase()}
                    </span>
                    <span className="text-gray-400 flex items-center gap-1.5">
                      <Clock size={12} /> {notif.time}
                    </span>
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
