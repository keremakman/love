import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LoginForm } from './LoginForm';
import { Dashboard } from './Dashboard';
import { CreateStoryForm } from './CreateStoryForm';

type AdminView = 'dashboard' | 'create';

export function AdminPanel() {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState<AdminView>('dashboard');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  if (currentView === 'create') {
    return (
      <CreateStoryForm
        onBack={() => setCurrentView('dashboard')}
        onSuccess={() => setCurrentView('dashboard')}
      />
    );
  }

  return (
    <Dashboard
      onCreateNew={() => setCurrentView('create')}
    />
  );
}