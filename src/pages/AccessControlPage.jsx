import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { 
  ShieldCheck, 
  Building2, 
  GitMerge, 
  MessageSquare, 
  Users, 
  Check, 
  X 
} from 'lucide-react';

export default function AccessControlPage() {
  const { isAdmin } = useAuth();
  const { organizations, subOrganizations, accessControl, toggleAccessControl } = useData();

  if (!isAdmin) {
    return (
      <div className="p-12 text-center text-gray-500">
        <p className="font-bold">Restricted Access</p>
        <p className="text-xs text-gray-400 mt-1">Super Admin credentials required to configure access matrix.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Access Control Matrix</h1>
        <p className="text-gray-500 text-sm mt-1.5 font-medium">Fine-grained permission gates for Organizations & Sub-Units.</p>
      </div>

      {/* Parent Organizations Permissions Table */}
      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-brand-blue" />
            <span>Parent Organization Privileges</span>
          </h2>
          <span className="text-xs text-gray-400 font-semibold">{organizations.length} Organizations Registered</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50/80 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase">
              <tr>
                <th className="px-6 py-4">Organization</th>
                <th className="px-6 py-4 text-center">Broadcast SMS Advisory</th>
                <th className="px-6 py-4 text-center">Onboard Farmers</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {organizations.map((org) => {
                const canSend = accessControl.sendMessage[org.id] ?? false;
                const canAdd = accessControl.addFarmers[org.id] ?? false;

                return (
                  <tr key={org.id} className="hover:bg-blue-50/20 transition">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-800">{org.name}</p>
                      <p className="text-xs text-gray-400 font-mono">{org.code || org.skAdminId}</p>
                    </td>

                    {/* Broadcast SMS Toggle */}
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => toggleAccessControl(org.id, 'sendMessage')}
                        className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 mx-auto ${
                          canSend ? 'bg-brand-blue' : 'bg-gray-200'
                        }`}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center ${
                            canSend ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        >
                          {canSend ? <Check className="w-2.5 h-2.5 text-brand-blue" /> : <X className="w-2.5 h-2.5 text-gray-400" />}
                        </div>
                      </button>
                    </td>

                    {/* Onboard Farmers Toggle */}
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => toggleAccessControl(org.id, 'addFarmers')}
                        className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 mx-auto ${
                          canAdd ? 'bg-brand-green' : 'bg-gray-200'
                        }`}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center ${
                            canAdd ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        >
                          {canAdd ? <Check className="w-2.5 h-2.5 text-brand-green" /> : <X className="w-2.5 h-2.5 text-gray-400" />}
                        </div>
                      </button>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <span className="px-2.5 py-1 bg-green-50 text-brand-green rounded-lg text-xs font-bold">
                        Synchronized
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sub-Organizations Permissions Table */}
      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <GitMerge className="w-5 h-5 text-purple-600" />
            <span>Sub-Organization / Ward Privileges</span>
          </h2>
          <span className="text-xs text-gray-400 font-semibold">{subOrganizations.length} Sub-Units Mapped</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50/80 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase">
              <tr>
                <th className="px-6 py-4">Sub-Organization</th>
                <th className="px-6 py-4 text-center">Broadcast SMS Advisory</th>
                <th className="px-6 py-4 text-center">Onboard Farmers</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {subOrganizations.map((sub) => {
                const canSend = accessControl.sendMessage[sub.id] ?? false;
                const canAdd = accessControl.addFarmers[sub.id] ?? false;

                return (
                  <tr key={sub.id} className="hover:bg-purple-50/20 transition">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-800">{sub.name}</p>
                      <p className="text-xs text-gray-400 font-mono">Code: {sub.code}</p>
                    </td>

                    {/* Broadcast SMS Toggle */}
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => toggleAccessControl(sub.id, 'sendMessage')}
                        className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 mx-auto ${
                          canSend ? 'bg-brand-blue' : 'bg-gray-200'
                        }`}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center ${
                            canSend ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        >
                          {canSend ? <Check className="w-2.5 h-2.5 text-brand-blue" /> : <X className="w-2.5 h-2.5 text-gray-400" />}
                        </div>
                      </button>
                    </td>

                    {/* Onboard Farmers Toggle */}
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => toggleAccessControl(sub.id, 'addFarmers')}
                        className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 mx-auto ${
                          canAdd ? 'bg-brand-green' : 'bg-gray-200'
                        }`}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center ${
                            canAdd ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        >
                          {canAdd ? <Check className="w-2.5 h-2.5 text-brand-green" /> : <X className="w-2.5 h-2.5 text-gray-400" />}
                        </div>
                      </button>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-bold">
                        Scoped
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
