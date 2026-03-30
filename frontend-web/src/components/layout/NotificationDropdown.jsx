import React, { useState, useRef, useEffect } from 'react';
import { Bell, Clock, CheckCircle2, AlertCircle, X, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { getLogs } from '../../services/adminService';

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const logs = await getLogs();
      // Map logs to notification format
      const mapped = logs.map(log => ({
        id: log.id,
        title: log.text || 'Action Système',
        description: `Action effectuée le ${log.time}`,
        time: 'Récent',
        type: log.type?.includes('error') ? 'warning' : (log.type?.includes('valid') ? 'success' : 'info'),
        unread: false
      }));
      setNotifications(mapped);
    } catch (e) {
      console.error("Failed to fetch logs:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchNotifications();
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle2 size={16} className="text-green-500" />;
      case 'warning': return <AlertCircle size={16} className="text-orange-500" />;
      default: return <Clock size={16} className="text-blue-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all group"
      >
        <Bell size={20} className="text-gray-400 group-hover:text-[#1A237E]" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="px-6 py-5 bg-[#1A237E] text-white flex items-center justify-between">
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest">Notifications</h3>
              <p className="text-[10px] text-blue-200 font-bold uppercase mt-0.5 tracking-widest">{unreadCount} non lues</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1.5 rounded-lg transition-colors">
              <X size={18} />
            </button>
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {loading ? (
              <div className="py-12 text-center animate-pulse">
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Mise à jour...</p>
              </div>
            ) : notifications.length > 0 ? (
              notifications.map((n) => (
                <div 
                  key={n.id} 
                  className="px-6 py-5 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer group flex gap-4"
                >
                  <div className="mt-1 shrink-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      n.type === 'success' ? 'bg-green-50 text-green-600' : 
                      n.type === 'warning' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {getIcon(n.type)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-black text-gray-900 line-clamp-1">{n.title}</h4>
                    </div>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed line-clamp-2">{n.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-gray-300 italic font-medium text-sm">
                Aucune activité récente.
              </div>
            )}
          </div>

          <Link 
            to="/admin/notifications" 
            className="block py-4 text-center text-[10px] font-black uppercase tracking-widest text-[#1A237E] hover:bg-gray-50 transition-colors border-t border-gray-50"
            onClick={() => setIsOpen(false)}
          >
            Voir tout l'historique
            <ChevronRight size={12} className="inline ml-1" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
