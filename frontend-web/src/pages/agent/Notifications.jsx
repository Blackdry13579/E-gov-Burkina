import React, { useEffect, useState } from 'react';
import { getAgentNotifications } from '../../services/api';
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
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAgentNotifications().then(d => { setNotifs(d); setLoading(false); });
  }, []);

  const unreadCount = notifs.filter(n => !n.read).length;

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Centre de Notifications</h1>
          <p className="text-sm text-gray-500 mt-0.5">{unreadCount} non lue{unreadCount > 1 ? 's' : ''}</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => setNotifs(n => n.map(x => ({ ...x, read: true })))}
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
                className={`bg-white rounded-2xl border shadow-sm p-4 flex items-start gap-4 transition-all ${
                  !notif.read ? 'border-[#1A237E]/20 ring-1 ring-[#1A237E]/10' : 'border-gray-100'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.color}`}>
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-bold ${!notif.read ? 'text-gray-900' : 'text-gray-700'}`}>{notif.title}</p>
                    {!notif.read && <span className="w-2 h-2 rounded-full bg-[#1A237E] flex-shrink-0 mt-1.5"></span>}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{notif.body}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${channelColors[notif.channel] || 'bg-gray-100 text-gray-500'}`}>
                      {notif.channel}
                    </span>
                    <span className="text-xs text-gray-400">{notif.time}</span>
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
