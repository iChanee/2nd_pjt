import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { FishProvider } from './contexts/FishContext';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Register from './pages/Register';
import MyPage from './pages/MyPage';

function App() {
  return (
    <AuthProvider>
      <FishProvider>
        <Router>
          <Routes>
            {/* 메인 레이아웃 (헤더 포함) */}
            <Route path="/" element={
              <MainLayout>
                <Home />
              </MainLayout>
            } />
            <Route path="/mypage" element={
              <MainLayout>
                <MyPage />
              </MainLayout>
            } />

            {/* 회원가입은 별도 페이지 유지 */}
            <Route path="/register" element={<Register />} />
          </Routes>
        </Router>
      </FishProvider>
    </AuthProvider>
  );
}

export default App;