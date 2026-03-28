import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAdminUsers } from '../../hooks/useAdmin';
import { Search, Filter, Plus, User, Shield, Briefcase, ChevronRight } from 'lucide-react';

const UsersList = () => {
  const { users: usersList, loading } = useAdminUsers();
  const [activeTab, setActiveTab] = useState('Tous'); // Tous, Citoyens, Agents, RH
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = usersList.filter(user => {
    // Role filter
    if (activeTab === 'Citoyens' && user.role !== 'CITOYEN') return false;
    if (activeTab === 'Personnel' && user.role === 'CITOYEN') return false; // Inclut Agents, RH, etc.

    // Search filter
    const searchTarget = `${user.name} ${user.matricule} ${user.email} ${user.phone}`.toLowerCase();
    if (searchQuery && !searchTarget.includes(searchQuery.toLowerCase())) return false;

    return true;
  });

  const getRoleBadge = (role) => {
    if (role === 'CITOYEN') {
      return (
        <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-md bg-blue-50 border border-blue-200 text-blue-700">
          <User size={12} /> Citoyen
        </span>
      );
    }
    if (role?.startsWith('AGENT')) {
      return (
        <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700">
          <Briefcase size={12} /> Agent {role.split('_')[1] ? `(${role.split('_')[1]})` : ''}
        </span>
      );
    }
    // RH ou autres staffs
    return (
      <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-md bg-purple-50 border border-purple-200 text-purple-700">
        <Shield size={12} /> {role}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    if (status === 'ACTIF') {
      return <span className="inline-flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div><span className="text-xs font-bold text-gray-700">{status}</span></span>;
    }
    return <span className="inline-flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-red-500"></div><span className="text-xs font-bold text-gray-500">{status}</span></span>;
  };

  return (
    <div className="font-sans">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#1A237E] uppercase tracking-tight">Registre des Utilisateurs</h1>
          <p className="text-sm font-medium text-gray-500 mt-1">Gestion administrative des citoyens et du personnel habilité.</p>
        </div>
        <NavLink to="/admin/users/add" className="bg-[#1A237E] text-white px-5 py-2.5 rounded shadow-sm flex items-center gap-2 hover:bg-[#093d60] transition-colors font-bold text-sm">
          <Plus size={18} />
          <span>Nouveau Personnel</span>
        </NavLink>
      </div>

      {/* ── FILTERS & SEARCH (Institutionnel) ── */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-6">
        
        {/* Tabs */}
        <div className="flex items-center border-b border-gray-200 bg-gray-50/50 px-2">
          {['Tous', 'Citoyens', 'Personnel'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3.5 text-sm font-bold uppercase tracking-wide border-b-2 transition-colors ${
                activeTab === tab 
                ? 'border-[#1A237E] text-[#1A237E]' 
                : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="p-4 flex flex-col sm:flex-row gap-4 items-center bg-white">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher par identité, téléphone ou matricule..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#1A237E] focus:ring-1 focus:ring-[#1A237E] text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="ml-auto flex items-center text-sm font-semibold text-gray-400">
            {filteredUsers.length} résultat{filteredUsers.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* ── TABLE ── */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200 text-gray-700 text-[11px] uppercase tracking-widest font-black">
                <th className="px-5 py-4">Utilisateur</th>
                <th className="px-5 py-4">Contacts</th>
                <th className="px-5 py-4">Service</th>
                <th className="px-5 py-4">Rôle / Accès</th>
                <th className="px-5 py-4">Date d'inscription</th>
                <th className="px-5 py-4">Statut</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-400 font-semibold animate-pulse">Recherche dans les registres...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500 font-medium">Aucun utilisateur trouvé pour ces critères d'habilitation.</td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-blue-50/50 transition-colors group">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <img 
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=EEF2F5&color=1A237E&bold=true`} 
                          alt="Avatar" 
                          className="w-9 h-9 rounded bg-gray-100 border border-gray-200 p-0.5 shadow-sm"
                        />
                        <div>
                          <p className="font-bold text-gray-900">{user.name}</p>
                          <p className="text-[10px] text-gray-500 font-mono tracking-widest">{user.matricule}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-600 font-semibold">{user.phone}</td>
                    <td className="px-5 py-3 text-gray-600 font-medium">{user.role === 'CITOYEN' ? '--' : user.service}</td>
                    <td className="px-5 py-3">{getRoleBadge(user.role)}</td>
                    <td className="px-5 py-3 text-gray-500 font-medium">{user.date}</td>
                    <td className="px-5 py-3">{getStatusBadge(user.status)}</td>
                    <td className="px-5 py-3 text-right">
                      <NavLink to={`/admin/users/${user.id}`} className="inline-flex items-center gap-1 text-[#1A237E] font-bold text-xs hover:underline bg-[#1A237E]/5 px-3 py-1.5 rounded">
                        Dossier <ChevronRight size={14} />
                      </NavLink>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
};

export default UsersList;
