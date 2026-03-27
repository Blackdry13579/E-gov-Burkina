import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, CheckCircle2, Info, Mail, 
  XCircle, AlertCircle, ArrowLeft,
  CheckCheck
} from 'lucide-react';
import Emblem from '../../components/common/Emblem';

import { getCitizenNotifications } from '../../services/api';


const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('Tout');
  
  const filters = ['Tout', 'Demandes', 'Services'];

  useEffect(() => {
    getCitizenNotifications().then(data => setNotifications(data));
  }, []);

  const getIcon = (type, lu) => {
    const iconSize = 20;
    switch(type) {
      case 'DOSSIER_VALIDE': 
        return <div className={`w-10 h-10 ${lu ? 'bg-gray-100 text-gray-400' : 'bg-green-100 text-green-600'} rounded-xl flex items-center justify-center`}>
          <CheckCircle2 size={iconSize} />
        </div>;
      case 'ACTION_REQUISE': 
        return <div className={`w-10 h-10 ${lu ? 'bg-gray-100 text-gray-400' : 'bg-amber-100 text-amber-600'} rounded-xl flex items-center justify-center`}>
          <AlertCircle size={iconSize} />
        </div>;
      case 'MESSAGE': 
        return <div className={`w-10 h-10 ${lu ? 'bg-gray-100 text-gray-400' : 'bg-blue-100 text-blue-600'} rounded-xl flex items-center justify-center`}>
          <Mail size={iconSize} />
        </div>;
      case 'PAIEMENT_ECHOUE': 
        return <div className={`w-10 h-10 ${lu ? 'bg-gray-100 text-gray-400' : 'bg-red-100 text-red-600'} rounded-xl flex items-center justify-center`}>
          <XCircle size={iconSize} />
        </div>;
      default: 
        return <div className={`w-10 h-10 ${lu ? 'bg-gray-100 text-gray-400' : 'bg-gray-100 text-gray-400'} rounded-xl flex items-center justify-center`}>
          <Bell size={iconSize} />
        </div>;
    }
  };


  return (
    <div className="flex flex-col min-h-full bg-gray-50">
      <header className="bg-white border-b border-gray-100 flex items-center justify-between px-6 py-6 sticky top-0 z-10 shadow-sm lg:px-8">
        <div className="flex items-center space-x-3 lg:hidden">
          <Emblem className="w-9 h-9" />
          <div className="flex flex-col">
            <span className="font-extrabold text-sm text-[#1A3A5C] leading-tight tracking-tight uppercase">Burkina Faso</span>
            <span className="text-[10px] tracking-[0.15em] text-gray-400 font-bold uppercase">E-Services Officiels</span>
          </div>
        </div>
        <div className="hidden lg:block">
          <h1 className="text-2xl font-extrabold text-[#1A3A5C]">Notifications</h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-institutional">
          <Bell size={20} />
        </div>
      </header>



      <div className="h-1 flex w-full lg:hidden">
        <div className="h-full bg-[#EF3340] w-1/2"></div>
        <div className="h-full bg-[#009739] w-1/2"></div>
      </div>



      <div className="p-4 flex-1">
        <div className="flex items-center justify-between mb-6 mt-4 lg:mt-8">
          <div className="flex items-center lg:hidden">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-white rounded-full transition-colors mr-2">
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <h1 className="text-xl font-extrabold text-[#1A3A5C]">Notifications</h1>
          </div>

          <button 
            onClick={() => alert('Option de marquage comme lu')}
            className="text-[10px] font-bold text-institutional uppercase tracking-widest flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <CheckCheck size={14} />
            Tout marquer comme lu
          </button>
        </div>


        {/* Filtres */}
        <div className="flex space-x-2 mb-6">
          {filters.map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${filter === f ? 'bg-institutional text-white shadow-md border-institutional border' : 'bg-transparent text-gray-600 border border-gray-300 hover:bg-gray-100'}`}
            >
              {f}
            </button>
          ))}
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4 opacity-20">📭</div>
            <p className="text-gray-500 font-medium">Vous n'avez pas encore de notifications.</p>
          </div>
        ) : (
          <>
            <section className="mb-6">
              <h2 className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-3">Aujourd'hui</h2>
              <div className="space-y-3">
                {notifications.slice(0, 2).map((notif) => (
                  <div key={notif.id} className={`bg-white p-4 rounded-2xl border transition-all relative overflow-hidden ${!notif.lu ? 'border-institutional/20 shadow-sm bg-blue-50/30' : 'border-gray-100 shadow-none'}`}>
                    {!notif.lu && <div className="absolute top-0 left-0 w-1 h-full bg-institutional"></div>}
                    <div className="flex items-start space-x-4">
                      <div className="shrink-0 pt-0.5">
                        {getIcon(notif.type, notif.lu)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className={`text-sm ${!notif.lu ? 'font-bold text-[#1A3A5C]' : 'font-medium text-gray-600'}`}>
                            {notif.titre}
                            {!notif.lu && <span className="ml-2 inline-block w-2 h-2 rounded-full bg-institutional animate-pulse"></span>}
                          </h3>

                        <span className="text-[10px] text-gray-400 font-medium">{notif.created_at?.replace('Aujourd\'hui ', '')}</span>
                      </div>
                      <p className={`text-xs ${!notif.lu ? 'text-gray-800' : 'text-gray-500'} mb-2 leading-relaxed`}>{notif.message}</p>
                      {notif.badge_statut && (
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wide inline-block ${notif.badge_statut === 'DÉLIVRÉ' ? 'bg-green-100 text-green-700' : notif.badge_statut === 'EN ATTENTE' ? 'bg-white border border-gray-300 text-gray-600' : 'bg-gray-100 text-gray-700'}`}>
                          {notif.badge_statut}
                        </span>
                      )}
                      </div>
                    </div>
                  </div>

                ))}
              </div>
            </section>

            <section className="mb-6">
              <h2 className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-3">Hier</h2>
              <div className="space-y-3">
                {notifications.slice(2).map((notif) => (
                  <div key={notif.id} className={`bg-white p-4 rounded-2xl border transition-all relative overflow-hidden ${!notif.lu ? 'border-institutional/20 shadow-sm bg-blue-50/30' : 'border-gray-100 shadow-none opacity-80'}`}>
                     {!notif.lu && <div className="absolute top-0 left-0 w-1 h-full bg-institutional"></div>}
                    <div className="flex items-start space-x-4">
                      <div className="shrink-0 pt-0.5">
                        {getIcon(notif.type, notif.lu)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className={`text-sm ${!notif.lu ? 'font-bold text-[#1A3A5C]' : 'font-medium text-gray-600'}`}>
                            {notif.titre}
                            {!notif.lu && <span className="ml-2 inline-block w-2 h-2 rounded-full bg-institutional"></span>}
                          </h3>

                        <span className="text-[10px] text-gray-400 font-medium">{notif.created_at?.replace('Hier ', '')}</span>
                      </div>
                      <p className={`text-xs ${!notif.lu ? 'text-gray-800' : 'text-gray-500'} mb-2 leading-relaxed`}>{notif.message}</p>
                      {notif.badge_statut && (
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wide inline-block ${notif.badge_statut === 'REJETÉ' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-700'}`}>
                          {notif.badge_statut}
                        </span>
                      )}
                      </div>
                    </div>
                  </div>

                ))}
              </div>
            </section>
          </>
        )}

      </div>
    </div>
  );
};

export default Notifications;
