import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FiX, FiUser, FiMoon, FiSun } from 'react-icons/fi';
import './Settings.css';

const Settings = ({ onClose }) => {
  const { user, updateSettings } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleThemeToggle = async () => {
    toggleTheme();
    setLoading(true);
    
    try {
      const newTheme = theme === 'light' ? 'dark' : 'light';
      const result = await updateSettings({ 
        theme: newTheme, 
        language: user?.settings?.language || 'en' 
      });
      
      if (result.success) {
        setMessage('Settings updated successfully!');
      }
    } catch (error) {
      setMessage('Failed to update settings');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="settings-overlay">
      <div className="settings-modal">
        <div className="settings-header">
          <h2>Settings</h2>
          <button 
            className="close-button"
            onClick={onClose}
          >
            <FiX />
          </button>
        </div>

        <div className="settings-content">
          {message && (
            <div className={`settings-message ${message.includes('success') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          {/* User Information */}
          <div className="settings-section">
            <h3>
              <FiUser />
              User Information
            </h3>
            <div className="user-info-display">
              <div className="info-item">
                <label>Name</label>
                <span>{user?.name}</span>
              </div>
              <div className="info-item">
                <label>Email</label>
                <span>{user?.email}</span>
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className="settings-section">
            <h3>
              {theme === 'light' ? <FiSun /> : <FiMoon />}
              Appearance
            </h3>
            <div className="setting-item">
              <div className="setting-info">
                <label>Theme</label>
                <span>Choose between light and dark mode</span>
              </div>
              <button
                className={`theme-toggle ${theme}`}
                onClick={handleThemeToggle}
                disabled={loading}
              >
                <div className="toggle-slider">
                  {theme === 'light' ? <FiSun /> : <FiMoon />}
                </div>
                <span>{theme === 'light' ? 'Light' : 'Dark'}</span>
              </button>
            </div>
          </div>

          {/* About */}
          <div className="settings-section">
            <h3>About</h3>
            <div className="about-info">
              <p>
                <strong>Murphy Chat</strong> - AI-powered chatbot built with MERN stack
              </p>
              <p>
                Meet Murphy, your intelligent AI assistant powered by Google Gemini
              </p>
              <p className="version">Version 1.0.0</p>
            </div>
          </div>
        </div>

        <div className="settings-footer">
          <button 
            className="btn btn-secondary"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
