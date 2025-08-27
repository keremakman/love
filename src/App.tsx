import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminPanel } from './components/admin/AdminPanel';
import { StoryPage } from './components/story/StoryPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/story/:slug" element={<StoryPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;