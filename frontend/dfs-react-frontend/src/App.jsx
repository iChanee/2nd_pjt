import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { FishProvider } from './contexts/FishContext';
import { ChatProvider } from './contexts/ChatContext';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MyPage from './pages/MyPage';

function App() {
  return (
    <AuthProvider>
      <FishProvider>
        <ChatProvider>
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

              {/* 로그인 및 회원가입은 별도 페이지 */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </Router>
        </ChatProvider>
      </FishProvider>
    </AuthProvider>
  );
}

export default App;