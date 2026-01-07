import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Header from './tiles/Header';
import { SessionProvider } from './contexts/SessionContext';
import OceanBackground from './components/OceanBackground';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <OceanBackground>

    <SessionProvider> 
      <div className="flex flex-col min-h-screen">
        <Header />
        <App />
      </div>
    </SessionProvider>
    </OceanBackground>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
