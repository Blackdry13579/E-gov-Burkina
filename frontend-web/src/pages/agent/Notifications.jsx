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
  const { notifications: notifs, loading, markAllRead, markRead } = useNotifications();

  // Correction : Utilisation de "lu" au lieu de "read" pour correspondre au service
  const unreadCount = notifs.filter(n => !n.lu).length;

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Centre de Notifications</h1>
          <p className="text-sm text-gray-500 mt-0.5">{unreadCount} non lue{unreadCount > 1 ? 's' : ''}</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="text-xs font-semibold text-[#1A237E] hover:underline"
          >
            Tout marquer lu
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-[#1A237E]/30 border-t-[#1A237E] rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-3">
          {notifs.map((notif) => {
            const cfg = typeConfig[notif.type] || { icon: Bell, color: 'bg-gray-100 text-gray-600' };
            const Icon = cfg.icon;
            return (
              <div
                key={notif.id}
                tabIndex="0"
                onClick={() => !notif.lu && markRead(notif.id)}
                className={`rounded-2xl border shadow-sm p-4 flex items-start gap-4 transition-all outline-none cursor-pointer focus:bg-white active:bg-white ${
                  !notif.lu 
                    ? 'bg-blue-50/50 border-blue-200 ring-1 ring-blue-100' 
                    : 'bg-white border-gray-100'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.color}`}>
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    {/* Correction : Utilisation de "titre" et "lu" selon le service */}
                    <p className={`text-sm font-bold ${!notif.lu ? 'text-gray-900' : 'text-gray-700'}`}>{notif.titre}</p>
                    {!notif.lu && <span className="w-2 h-2 rounded-full bg-[#1A237E] flex-shrink-0 mt-1.5"></span>}
                  </div>
                  {/* Correction : Utilisation de "message" au lieu de "body" */}
                  <p className="text-xs text-gray-500 mt-0.5">{notif.message}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${channelColors[notif._raw?.canal] || 'bg-gray-100 text-gray-500'}`}>
                      {notif._raw?.canal || 'In-App'}
                    </span>
                    {/* Correction : Utilisation de "created_at" au lieu de "time" */}
                    <span className="text-xs text-gray-400">{notif.created_at}</span>
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
