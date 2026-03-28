import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Layouts
import AdminLayout from './components/layout/AdminLayout';
import AgentLayout from './components/layout/AgentLayout';

// ─── CITIZEN PAGES ────────────────────────────────────────────────────────────
import Landing from './pages/citizen/Landing';
import CitizenDashboard from './pages/citizen/Dashboard';
import Login from './pages/citizen/Login';
import Register from './pages/citizen/Register';
import ServicesCatalog from './pages/citizen/ServicesCatalog';
import ServiceDetail from './pages/citizen/ServiceDetail';
import FormStep1 from './pages/citizen/FormStep1';
import FormStep2 from './pages/citizen/FormStep2';
import FormStep3 from './pages/citizen/FormStep3';
import Confirmation from './pages/citizen/Confirmation';
import MyRequests from './pages/citizen/MyRequests';
import RequestTracking from './pages/citizen/RequestTracking';
import Notifications from './pages/citizen/Notifications';
import Profile from './pages/citizen/Profile';
import EditProfile from './pages/citizen/EditProfile';
import CitizenLayout from './components/layout/CitizenLayout';

// ─── ADMIN PAGES ──────────────────────────────────────────────────────────────
import LoginAdmin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import RecentActivities from './pages/admin/RecentActivities';
import UsersList from './pages/admin/UsersList';
import AddAgent from './pages/admin/AddAgent';
import AgentProfile from './pages/admin/AgentProfile';
import Requests from './pages/admin/Requests';
import RolePermissions from './pages/admin/RolePermissions';
import ServicesConfig from './pages/admin/ServicesConfig';
import DocumentsConfig from './pages/admin/DocumentsConfig';
import SecurityLogs from './pages/admin/SecurityLogs';
import AdminLogs from './pages/admin/AdminLogs';
import AdminProfile from './pages/admin/Profile';

// ─── AGENT PAGES ──────────────────────────────────────────────────────────────
import AgentLogin from './pages/agent/Login';
import AgentDashboard from './pages/agent/Dashboard';
import RequestsList from './pages/agent/RequestsList';
import RequestDetail from './pages/agent/RequestDetail';
import RequestDecision from './pages/agent/RequestDecision';
import DocumentViewer from './pages/agent/DocumentViewer';
import AgentProfilePage from './pages/agent/Profile';
import DigitalSignature from './pages/agent/DigitalSignature';
import ActionHistory from './pages/agent/ActionHistory';
import AgentNotifications from './pages/agent/Notifications';
import Messaging from './pages/agent/Messaging';
import AgentSecurity from './pages/agent/Security';

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Citizen (Public & Protected) ────────────────────────── */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Citizen Routes in Layout */}
        <Route element={<CitizenLayout />}>
          <Route path="/accueil" element={<CitizenDashboard />} />
          <Route path="/services" element={<ServicesCatalog />} />
          <Route path="/services/:id" element={<ServiceDetail />} />
          <Route path="/demande/etape1" element={<FormStep1 />} />
          <Route path="/demande/etape2" element={<FormStep2 />} />
          <Route path="/demande/etape3" element={<FormStep3 />} />
          <Route path="/demande/confirmation" element={<Confirmation />} />
          <Route path="/demandes" element={<MyRequests />} />
          <Route path="/suivi/:id" element={<RequestTracking />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profil" element={<Profile />} />
          <Route path="/profil/modifier" element={<EditProfile />} />
        </Route>

        {/* ── Admin ─────────────────────────────────────────── */}
        <Route path="/admin/login" element={<LoginAdmin />} />
        <Route element={<PrivateRoute requiredRole="admin" redirectTo="/admin/login" />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard"       element={<AdminDashboard />} />
            <Route path="activities"      element={<RecentActivities />} />
            <Route path="users"           element={<UsersList />} />
            <Route path="users/add"       element={<AddAgent />} />
            <Route path="users/:id"       element={<AgentProfile />} />
            <Route path="requests"        element={<Requests />} />
            <Route path="roles"           element={<RolePermissions />} />
            <Route path="services"        element={<ServicesConfig />} />
            <Route path="documents"       element={<DocumentsConfig />} />
            <Route path="security"        element={<SecurityLogs />} />
            <Route path="logs"            element={<AdminLogs />} />
            <Route path="profile"         element={<AdminProfile />} />
          </Route>
        </Route>

        {/* ── Agent ─────────────────────────────────────────── */}
        <Route path="/agent/login" element={<AgentLogin />} />
        <Route element={<PrivateRoute requiredRole="agent" redirectTo="/agent/login" />}>
          <Route path="/agent" element={<AgentLayout />}>
            <Route path="dashboard"                            element={<AgentDashboard />} />
            <Route path="requests"                             element={<RequestsList />} />
            <Route path="requests/:id/detail"                  element={<RequestDetail />} />
            <Route path="requests/:id/decision"                element={<RequestDecision />} />
            <Route path="requests/:id/document/:docIndex"      element={<DocumentViewer />} />
            <Route path="notifications"                        element={<AgentNotifications />} />
            <Route path="messaging"                            element={<Messaging />} />
            <Route path="profile"                              element={<AgentProfilePage />} />
            <Route path="signature"                            element={<DigitalSignature />} />
            <Route path="history"                              element={<ActionHistory />} />
            <Route path="security"                             element={<AgentSecurity />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
