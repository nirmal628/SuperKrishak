import React, { createContext, useContext, useState } from 'react';
import { 
  INITIAL_ORGANIZATIONS, 
  INITIAL_ORG_USERS,
  INITIAL_SUB_ORGANIZATIONS, 
  INITIAL_FARMERS, 
  INITIAL_GPKM, 
  INITIAL_FIELDS, 
  INITIAL_MESSAGES, 
  INITIAL_WARNINGS, 
  INITIAL_ACCESS_CONTROL 
} from '../data/initialData';
import { useAuth } from './AuthContext';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const { role, entityId, isAdmin, isOrg, isSubOrg } = useAuth();

  const [organizations, setOrganizations] = useState(INITIAL_ORGANIZATIONS);
  const [orgUsers, setOrgUsers] = useState(INITIAL_ORG_USERS);
  const [subOrganizations, setSubOrganizations] = useState(INITIAL_SUB_ORGANIZATIONS);
  const [farmers, setFarmers] = useState(INITIAL_FARMERS);
  const [gpkm, setGpkm] = useState(INITIAL_GPKM);
  const [fields, setFields] = useState(INITIAL_FIELDS);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [warnings, setWarnings] = useState(INITIAL_WARNINGS);
  const [accessControl, setAccessControl] = useState(INITIAL_ACCESS_CONTROL);
  const [toasts, setToasts] = useState([]);

  // Toast feedback dispatcher
  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Role-Based Data Access Filter
  const getScopedData = (datasetName) => {
    if (isAdmin || role === 'ADMIN') {
      switch (datasetName) {
        case 'organizations': return organizations;
        case 'subOrganizations': return subOrganizations;
        case 'farmers': return farmers;
        case 'gpkm': return gpkm;
        case 'fields': return fields;
        case 'messages': return messages;
        case 'warnings': return warnings;
        default: return [];
      }
    }

    if (isOrg || role === 'ORG') {
      switch (datasetName) {
        case 'organizations': return organizations.filter(o => o.id === entityId);
        case 'subOrganizations': return subOrganizations.filter(s => s.orgId === entityId);
        case 'farmers': return farmers.filter(f => f.orgId === entityId);
        case 'gpkm': return gpkm.filter(m => m.orgId === entityId);
        case 'fields': return fields.filter(f => f.orgId === entityId);
        case 'messages': return messages.filter(m => m.orgId === entityId || m.target === 'All Organizations');
        case 'warnings': return warnings.filter(w => w.orgId === entityId);
        default: return [];
      }
    }

    if (isSubOrg || role === 'SUBORG') {
      switch (datasetName) {
        case 'organizations': return [];
        case 'subOrganizations': return subOrganizations.filter(s => s.id === entityId);
        case 'farmers': return farmers.filter(f => f.subOrgId === entityId);
        case 'gpkm': return gpkm.filter(m => m.subOrgId === entityId);
        case 'fields': return fields.filter(f => f.subOrgId === entityId);
        case 'messages': return messages.filter(m => m.target.includes('Ward') || m.target === 'All Organizations');
        case 'warnings': return warnings.filter(w => w.subOrgId === entityId);
        default: return [];
      }
    }

    return [];
  };

  // CRUD for Organizations
  const addOrganization = (org) => {
    const newId = 'org_' + Date.now().toString(36);
    const newOrg = {
      id: newId,
      name: org.name,
      shortName: org.shortName || org.name,
      code: org.code || Math.floor(1000 + Math.random() * 9000).toString(),
      skAdminId: org.skAdminId || 'SK-ORG-' + Math.floor(1000 + Math.random() * 9000),
      address: org.address,
      status: org.status || 'Active',
      parentOrgNum: organizations.length + 1
    };
    setOrganizations(prev => [newOrg, ...prev]);
    showToast(`Organization "${newOrg.name}" successfully linked.`);
    return newOrg;
  };

  const updateOrganization = (id, updatedData) => {
    setOrganizations(prev => prev.map(o => o.id === id ? { ...o, ...updatedData } : o));
    showToast('Organization details updated.');
  };

  const deleteOrganization = (id) => {
    const orgToDelete = organizations.find(o => o.id === id);
    setOrganizations(prev => prev.filter(o => o.id !== id));
    showToast(`Organization "${orgToDelete?.name || ''}" deleted.`, 'info');
  };

  // CRUD for Org Users
  const addOrgUser = (user) => {
    const newId = 'ou_' + Date.now().toString(36);
    const newUser = {
      id: newId,
      orgId: user.orgId,
      name: user.name,
      email: user.email || '',
      phone: user.phone,
      subOrgId: user.subOrgId || 'None'
    };
    setOrgUsers(prev => [newUser, ...prev]);
    showToast(`User "${newUser.name}" added to organization.`);
    return newUser;
  };

  const removeOrgUser = (id) => {
    const userToRemove = orgUsers.find(u => u.id === id);
    setOrgUsers(prev => prev.filter(u => u.id !== id));
    showToast(`User "${userToRemove?.name || ''}" removed from organization.`, 'info');
  };

  const updateOrgUser = (id, updated) => {
    setOrgUsers(prev => prev.map(u => u.id === id ? { ...u, ...updated } : u));
    showToast('User assignment updated.');
  };

  // CRUD for Sub-Organizations
  const addSubOrganization = (sub) => {
    const newId = 'sub_' + Date.now().toString(36);
    const parentIdx = organizations.findIndex(o => o.id === sub.orgId);
    const newSub = {
      id: newId,
      orgId: sub.orgId,
      parentOrgNum: parentIdx >= 0 ? parentIdx + 1 : (sub.parentOrgNum || 1),
      name: sub.name,
      shortName: sub.shortName || sub.name,
      code: sub.code || Math.floor(1000 + Math.random() * 9000).toString(),
      skAdminId: sub.skAdminId || 'SK-SUB-' + (sub.code || Math.floor(1000 + Math.random() * 9000)),
      address: sub.address,
      status: sub.status || 'Active'
    };
    setSubOrganizations(prev => [newSub, ...prev]);
    showToast(`Sub-Organization "${newSub.name}" successfully mapped.`);
    return newSub;
  };

  const updateSubOrganization = (id, updatedData) => {
    setSubOrganizations(prev => prev.map(s => {
      if (s.id === id) {
        let parentOrgNum = s.parentOrgNum;
        if (updatedData.orgId) {
          const pIdx = organizations.findIndex(o => o.id === updatedData.orgId);
          if (pIdx >= 0) parentOrgNum = pIdx + 1;
        }
        return { ...s, ...updatedData, parentOrgNum };
      }
      return s;
    }));
    showToast('Sub-Organization updated.');
  };

  const deleteSubOrganization = (id) => {
    const subToDelete = subOrganizations.find(s => s.id === id);
    setSubOrganizations(prev => prev.filter(s => s.id !== id));
    showToast(`Sub-Organization "${subToDelete?.name || ''}" deleted.`, 'info');
  };

  // CRUD for Farmers
  const addFarmer = (farmer) => {
    const newId = 'f' + Date.now().toString(36);
    const newFarmer = {
      id: newId,
      name: farmer.name,
      mobile: farmer.mobile,
      ageGroup: farmer.ageGroup || '30-40',
      email: farmer.email || '',
      occupation: farmer.occupation || 'Commercial Farmer',
      location: farmer.location || 'Kathmandu',
      coords: farmer.coords || [27.7172 + (Math.random() * 0.08 - 0.04), 85.3240 + (Math.random() * 0.08 - 0.04)],
      orgId: farmer.orgId || (isOrg ? entityId : organizations[0]?.id),
      subOrgId: farmer.subOrgId || null,
      gender: farmer.gender || 'Male',
      coins: 0,
      rating: 50,
      farmingType: farmer.farmingType || 'Crops',
      status: 'Active'
    };
    setFarmers(prev => [newFarmer, ...prev]);
    showToast(`Beneficiary "${newFarmer.name}" onboarded successfully.`);
    return newFarmer;
  };

  // CRUD for GPKM Meters
  const addMeter = (meter) => {
    const newId = 'MTR-' + Math.floor(100 + Math.random() * 900);
    const newMeter = {
      id: newId,
      name: meter.name || `Synced Sensor ${meter.aepcId}`,
      aepcId: meter.aepcId,
      orgId: meter.orgId,
      subOrgId: meter.subOrgId,
      status: 'Active',
      location: [27.67 + (Math.random() * 0.1 - 0.05), 85.3 + (Math.random() * 0.1 - 0.05)],
      installedDate: new Date().toISOString().split('T')[0]
    };
    setGpkm(prev => [newMeter, ...prev]);
    showToast(`Meter ${newMeter.aepcId} synced to network.`);
    return newMeter;
  };

  // Messages Broadcast
  const addMessage = (msg) => {
    const newMsg = {
      id: 'msg_' + Date.now().toString(36),
      datetime: msg.datetime || new Date().toISOString().slice(0, 16),
      message: msg.message,
      status: 'Scheduled',
      target: msg.target || 'All Organizations',
      orgId: msg.orgId || (isAdmin ? 'GLOBAL' : entityId)
    };
    setMessages(prev => [newMsg, ...prev]);
    showToast('Broadcast advisory scheduled successfully!');
    return newMsg;
  };

  // Access Control Toggles
  const toggleAccessControl = (entId, feature) => {
    setAccessControl(prev => ({
      ...prev,
      [feature]: {
        ...prev[feature],
        [entId]: !prev[feature]?.[entId]
      }
    }));
    showToast(`Access ${!accessControl[feature]?.[entId] ? 'Granted' : 'Revoked'}.`);
  };

  const value = {
    organizations,
    orgUsers,
    subOrganizations,
    farmers,
    gpkm,
    fields,
    messages,
    warnings,
    accessControl,
    toasts,
    showToast,
    removeToast,
    getScopedData,
    addOrganization,
    updateOrganization,
    deleteOrganization,
    addOrgUser,
    removeOrgUser,
    updateOrgUser,
    addSubOrganization,
    updateSubOrganization,
    deleteSubOrganization,
    addFarmer,
    addMeter,
    addMessage,
    toggleAccessControl
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
