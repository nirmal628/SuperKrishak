import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import ToastContainer from './components/common/ToastContainer';

// Page Components
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import OrganizationsPage from './pages/OrganizationsPage';
import OrganizationDetailPage from './pages/OrganizationDetailPage';
import SubOrganizationsPage from './pages/SubOrganizationsPage';
import FarmersNetworkPage from './pages/FarmersNetworkPage';
import FarmerDetailPage from './pages/FarmerDetailPage';
import FieldInsightsPage from './pages/FieldInsightsPage';
import FieldMonitorPage from './pages/FieldMonitorPage';
import IoTTelemetryPage from './pages/IoTTelemetryPage';
import IoTDetailPage from './pages/IoTDetailPage';
import CommunicationPage from './pages/CommunicationPage';
import AccessControlPage from './pages/AccessControlPage';
import FieldDataPage from './pages/FeildDataPage';

function MainApp() {
  const { isLoggedIn, role } = useAuth();
  const [currentRoute, setCurrentRoute] = useState('dashboard');
  const [selectedOrgId, setSelectedOrgId] = useState(null);
  const [selectedFarmerId, setSelectedFarmerId] = useState(null);
  const [selectedFieldId, setSelectedFieldId] = useState(null);
  const [selectedMeterId, setSelectedMeterId] = useState(null);

  if (!isLoggedIn) {
    return <LoginPage />;
  }

  const navigate = (route) => {
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderActivePage = () => {
    switch (currentRoute) {
      case 'dashboard':
        return <DashboardPage onNavigate={navigate} />;
      case 'organizations':
        return (
          <OrganizationsPage 
            onNavigate={navigate} 
            onSelectOrg={(id) => setSelectedOrgId(id)} 
          />
        );
      case 'organization_detail':
        return (
          <OrganizationDetailPage 
            orgId={selectedOrgId} 
            onNavigate={navigate} 
          />
        );
      case 'sub-organizations':
        return <SubOrganizationsPage onNavigate={navigate} />;
      case 'farmers':
        return (
          <FarmersNetworkPage 
            onNavigate={navigate} 
            onSelectFarmer={(id) => setSelectedFarmerId(id)} 
          />
        );
      case 'farmer_detail':
        return (
          <FarmerDetailPage 
            farmerId={selectedFarmerId} 
            onNavigate={navigate}
            onSelectField={(id) => setSelectedFieldId(id)}
          />
        );
      case 'fields':
        return (
          <FieldInsightsPage 
            onNavigate={navigate}
            onSelectField={(id) => setSelectedFieldId(id)}
          />
        );
      case 'field_monitor':
        return (
          <FieldMonitorPage 
            fieldId={selectedFieldId} 
            onNavigate={navigate} 
          />
        );
      case 'field_data': // ADD THIS CASE
  return (
    <FieldDataPage 
      fieldId={selectedFieldId} 
      onNavigate={navigate} 
    />
  );
      case 'gpkm':
        return (
          <IoTTelemetryPage 
            onNavigate={navigate}
            onSelectMeter={(id) => setSelectedMeterId(id)}
          />
        );
      case 'gpkm_detail':
        return (
          <IoTDetailPage 
            meterId={selectedMeterId} 
            onNavigate={navigate} 
          />
        );
      case 'messages':
        return <CommunicationPage onNavigate={navigate} />;
      case 'access':
        return <AccessControlPage onNavigate={navigate} />;
      default:
        return <DashboardPage onNavigate={navigate} />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8FAFC]">
      {/* Dynamic Sidebar */}
      <Sidebar currentRoute={currentRoute} onNavigate={navigate} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Sticky Header */}
        <Header 
          currentRoute={currentRoute} 
          onNavigate={navigate} 
        />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {renderActivePage()}
        </main>
      </div>

      {/* Global Toast Feedback Container */}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <MainApp />
      </DataProvider>
    </AuthProvider>
  );
}
