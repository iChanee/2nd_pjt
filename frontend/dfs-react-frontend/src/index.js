import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import "tailwindcss";
// import App from './App';
import Header from './tiles/Header';
import MainTiles from './tiles/Main';
import reportWebVitals from './reportWebVitals';
import { SessionProvider } from './contexts/SessionContext';

const root = ReactDOM.createRoot( document.getElementById( 'root' ) );
root.render(
  <React.StrictMode>
    <SessionProvider>
      <div className="flex flex-col min-h-screen"></div>
      {/* <App /> */}
      <Header />
      <MainTiles />
    </SessionProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
