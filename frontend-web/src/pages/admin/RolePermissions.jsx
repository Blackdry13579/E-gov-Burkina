import React, { useState, useEffect } from 'react';
import { useAdminRoles } from '../../hooks/useAdmin';
import { updatePermissions } from '../../services/adminService';
import { Save, AlertTriangle } from 'lucide-react';

const RolePermissions = () => {
  const { roles: fetchedRoles, loading } = useAdminRoles();
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [permissions, setPermissions] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (fetchedRoles && fetchedRoles.length > 0) {
      setRoles(fetchedRoles);
      setSelectedRole(fetchedRoles[0]);
      setPermissions(fetchedRoles[0].permissions || {});
    }
  }, [fetchedRoles]);

  const handleRoleChange = (roleId) => {
    const role = roles.find(r => r.id === roleId);
    setSelectedRole(role);
    setPermissions(role.permissions);
  };

  const handleToggle = (permKey) => {
    setPermissions(prev => ({ ...prev, [permKey]: !prev[permKey] }));
  };

  const handleSave = async () => {
    setSaving(true);
    await updatePermissions(selectedRole.id, permissions);
    setSaving(false);
    alert('Permissions mises à jour avec succès');
  };

  if (!selectedRole) return <div>Chargement...</div>;

  return (
    <div className="font-sans max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Édition des Rôles et Permissions</h1>

      <div className="flex gap-6">
        <div className="w-1/3 space-y-2">
          {roles.map(role => (
            <button
              key={role.id}
              onClick={() => handleRoleChange(role.id)}
              className={`w-full text-left px-4 py-3 rounded-xl border font-medium transition-colors ${
                selectedRole.id === role.id 
                  ? 'bg-[#1A237E] text-white border-[#1A237E]' 
                  : 'bg-white text-gray-700 border-[#E2E8F0] hover:bg-gray-50'
              }`}
            >
              {role.name}
            </button>
          ))}
        </div>

        <div className="w-2/3">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[#E2E8F0] flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-bold text-gray-800">
                {selectedRole.name} <span className="text-sm font-normal text-gray-500 ml-2">(ID: {selectedRole.id})</span>
              </h2>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-[#E2E8F0]">
                  <div>
                    <p className="font-semibold text-gray-800">Voir les demandes</p>
                    <p className="text-sm text-gray-500">Accès en lecture à la liste des demandes citoyennes</p>
                  </div>
                  <Toggle active={permissions.viewRequests} onClick={() => handleToggle('viewRequests')} />
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-[#E2E8F0]">
                  <div>
                    <p className="font-semibold text-gray-800">Valider les dossiers</p>
                    <p className="text-sm text-gray-500">Droit d'approuver ou rejeter les pièces justificatives</p>
                  </div>
                  <Toggle active={permissions.validateFiles} onClick={() => handleToggle('validateFiles')} />
                </div>

                <div className="flex items-center justify-between py-3 border-b border-[#E2E8F0]">
                  <div>
                    <p className="font-semibold text-gray-800">Gérer les utilisateurs</p>
                    <p className="text-sm text-gray-500">Création et modification des comptes agents</p>
                  </div>
                  <Toggle active={permissions.manageUsers} onClick={() => handleToggle('manageUsers')} />
                </div>
              </div>

              <div className="mt-8 p-4 bg-red-50 rounded-xl border border-red-100">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="text-[#E52E2E]" size={20} />
                  <h3 className="font-bold text-[#E52E2E]">Zone critique</h3>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-red-900">Configuration Système</p>
                    <p className="text-sm text-red-700">Accès aux paramètres globaux (Risque élevé)</p>
                  </div>
                  <Toggle active={permissions.config} onClick={() => handleToggle('config')} danger />
                </div>
              </div>

              <div className="pt-6 flex justify-end">
                <button 
                  onClick={handleSave} 
                  disabled={saving}
                  className="bg-[#00875A] text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Save size={18} />
                  {saving ? 'Enregistrement...' : 'Enregistrer les permissions'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Toggle = ({ active, onClick, danger = false }) => (
  <button 
    onClick={onClick}
    className={`w-12 h-6 rounded-full relative transition-colors ${
      active ? (danger ? 'bg-[#E52E2E]' : 'bg-[#00875A]') : 'bg-gray-300'
    }`}
  >
    <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
      active ? 'translate-x-7' : 'translate-x-1'
    }`} />
  </button>
);

export default RolePermissions;
