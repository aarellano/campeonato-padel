import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { configureAmplify, useRealAmplifyBackend } from './services/AmplifyConfig'
import { toggleDataSource } from './services/dataService'

// Configure Amplify with your backend settings
configureAmplify();

// Set data source based on configuration
// This allows us to switch between mock data and real Amplify backend
if (useRealAmplifyBackend) {
  toggleDataSource(false); // Use real Amplify API
} else {
  toggleDataSource(true); // Use mock data
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)