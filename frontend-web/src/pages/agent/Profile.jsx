import React from 'react';
import { useAgentProfile } from '../../hooks/useAgent';
import { UserCircle, Mail, Phone, Building2, Calendar, Star, CheckCircle, XCircle, Award } from 'lucide-react';

const AgentProfile = () => {
  const { profile, loading } = useAgentProfile();

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-4 border-[#1A237E]/30 border-t-[#1A237E] rounded-full animate-spin"></div>
    </div>
  );

  // Fallback to avoid white screen if profile is null or properties are missing
  const safeProfile = profile || {
    name: 'Agent',
    role: 'Agent de service',
    department: 'Administration',
    matricule: '—',
    email: '—',
    phone: '—',
    since: '—',
    stats: {
      processed: 0,
      validated: 0,
      rejected: 0,
      validationRate: '0%'
    }
  };

  const initial = safeProfile.name ? safeProfile.name.charAt(0).toUpperCase() : 'A';

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900">Mon Profil</h1>

      {/* Profile card */}
      <div className="bg-gradient-to-br from-[#1A237E] to-[#0e3960] rounded-2xl p-6 text-white shadow-lg shadow-blue-900/10">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center text-3xl font-extrabold flex-shrink-0">
            {initial}
          </div>
          <div>
            <p className="text-xs text-blue-200 font-medium uppercase tracking-wide">{safeProfile.role}</p>
            <h2 className="text-xl font-extrabold mt-0.5">{safeProfile.name}</h2>
            <div className="flex items-center gap-2 mt-2">
              <Building2 size={14} className="text-blue-300" />
              <span className="text-sm text-blue-200">{safeProfile.department}</span>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-xs text-blue-300">Identifiant Agent</p>
          <p className="text-sm font-mono font-bold mt-0.5">{safeProfile.matricule}</p>
        </div>
      </div>

      {/* Contact info */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">Informations de Contact</h3>
        <div className="space-y-3">
          {[
            { icon: Mail,      label: 'Email',     value: safeProfile.email },
            { icon: Phone,     label: 'Téléphone', value: safeProfile.phone },
            { icon: Calendar,  label: 'En service depuis', value: safeProfile.since },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <Icon size={14} className="text-[#1A237E]" />
              </div>
              <div>
                <p className="text-xs text-gray-400">{label}</p>
                <p className="text-sm font-semibold text-gray-800">{value || '—'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">Statistiques</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Traitées', value: safeProfile.stats?.processed ?? 0, icon: Star, color: 'bg-blue-100 text-[#1A237E]' },
            { label: 'Validées', value: safeProfile.stats?.validated ?? 0, icon: CheckCircle, color: 'bg-green-100 text-[#00875A]' },
            { label: 'Rejetées', value: safeProfile.stats?.rejected ?? 0, icon: XCircle, color: 'bg-red-100 text-[#E52E2E]' },
            { label: 'Taux valid.', value: safeProfile.stats?.validationRate ?? '0%', icon: Award, color: 'bg-purple-100 text-purple-600' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="text-center p-3 rounded-xl bg-gray-50">
              <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center mx-auto mb-2`}>
                <Icon size={16} />
              </div>
              <p className="text-xl font-extrabold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgentProfile;
