
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NewCase from './pages/NewCase';
import CaseList from './pages/CaseList';
import CaseDetail from './pages/CaseDetail';
import Register from './pages/Register';
import Profile from './pages/Profile';
import HospitalList from './pages/HospitalList';
import UserList from './pages/UserList';
import AccessRequest from './pages/AccessRequest';
import DevToolbar from './components/DevToolbar';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state } = useApp();
  
  if (!state.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Handle User Status Rules
  if (state.user?.status === 'unregistered') {
     return <Register />;
  }

  if (state.user?.status === 'pending') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4 text-center">
         <div className="bg-orange-100 p-4 rounded-full mb-4 animate-pulse">
            <svg className="w-8 h-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
         </div>
         <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">حساب در انتظار تایید</h2>
         <p className="text-gray-600 dark:text-gray-400 max-w-md">
           اطلاعات شما ثبت شده و در حال بررسی توسط مدیر سیستم است. لطفاً شکیبا باشید.
         </p>
      </div>
    );
  }
  
  if (state.user?.status === 'not_whitelisted') {
    return <AccessRequest />;
  }

  return <Layout>{children}</Layout>;
};

const AppRoutes = () => {
  const { state } = useApp();
  return (
    <Routes>
        <Route path="/login" element={state.isAuthenticated ? <Navigate to="/" /> : <Login />} />
        
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/cases" element={<ProtectedRoute><CaseList /></ProtectedRoute>} />
        <Route path="/cases/:id" element={<ProtectedRoute><CaseDetail /></ProtectedRoute>} />
        <Route path="/new-case" element={<ProtectedRoute><NewCase /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        
        {/* Admin/Inspector Routes */}
        <Route path="/hospitals" element={<ProtectedRoute><HospitalList /></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute><UserList /></ProtectedRoute>} />
        
        <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
         <AppRoutes />
         <DevToolbar />
      </HashRouter>
    </AppProvider>
  );
};

export default App;
