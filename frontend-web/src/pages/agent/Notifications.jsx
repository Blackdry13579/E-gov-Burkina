import React from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import { Bell, Mail, ShieldAlert, RefreshCw, Megaphone, Clock, CheckCircle2 } from 'lucide-react';

const typeConfig = {
  SOUMISSION: { icon: Bell,         color: 'bg-indigo-50 text-indigo-700',   label: 'Demande Soumise' },
  PAIEMENT:   { icon: Mail,         color: 'bg-emerald-50 text-emerald-700',  label: 'Paiement Confirmé' },
  SECURITE:   { icon: ShieldAlert,  color: 'bg-rose-50 text-rose-700',    label: 'Alerte Sécurité' },
  VALIDATION: { icon: RefreshCw,    color: 'bg-violet-50 text-violet-700', label: 'Validation' },
  RAPPEL:     { icon: Megaphone,    color: 'bg-amber-50 text-amber-700',  label: 'Rappel' },
};

const channelColors = {
  'In-App': 'bg-slate-100 text-slate-700',
  'Email':  'bg-slate-100 text-slate-700',
  'SMS':    'bg-slate-100 text-slate-700',
};

const Notifications = () => {
  const { notifications: notifs, loading, markAllRead } = useNotifications();
  const unreadCount = notifs.filter(n => !n.lu).length;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 font-sans antialiased">
      {/* Header épuré et professionnel */}
      <div className="flex items-end justify-between mb-10 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Notifications</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            {unreadCount > 0 
              ? `Vous avez ${unreadCount} nouveau${unreadCount > 1 ? 'x' : ''} message${unreadCount > 1 ? 's' : ''}`
              : 'Tous vos messages sont à jour'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-all shadow-sm active:scale-95"
          >
            <CheckCircle2 size={14} />
            Tout marquer comme lu
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
        </div>
      ) : notifs.length === 0 ? (
        <div className="py-20 text-center bg-slate-50/50 rounded-2xl border border-slate-100">
          <Bell size={32} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500 font-semibold">Aucune notification</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifs.map((notif) => {
            const cfg = typeConfig[notif.type] || { icon: Bell, color: 'bg-slate-100 text-slate-600' };
            const Icon = cfg.icon;
            return (
              <div
                key={notif.id}
                className={`group relative bg-white rounded-xl border p-5 flex items-start gap-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md ${
                  !notif.lu ? 'border-slate-200 bg-slate-50/30' : 'border-slate-100'
                }`}
              >
                {!notif.lu && (
                  <div className="absolute -left-1 top-6 w-2 h-6 bg-slate-900 rounded-full shadow-sm" />
                )}
                
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${cfg.color} transition-transform group-hover:scale-105`}>
                  <Icon size={18} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className={`text-sm font-bold leading-tight truncate ${!notif.lu ? 'text-slate-900' : 'text-slate-600'}`}>
                      {notif.titre || "Information système"}
                    </h3>
                    <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap flex items-center gap-1">
                      <Clock size={10} />
                      {notif.created_at}
                    </span>
                  </div>
                  
                  <p className="text-sm font-medium text-slate-500 mt-1 lines-clamp-2 leading-relaxed">
                    {notif.message}
                  </p>

                  <div className="flex items-center gap-2 mt-3">
                    {notif.badge_statut && (
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase tracking-wider">
                        {notif.badge_statut}
                      </span>
                    )}
                    {notif._raw?.canal && (
                      <span className="text-[10px] font-semibold text-slate-400 italic">
                        via {notif._raw.canal}
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
