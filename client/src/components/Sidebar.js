import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  FiPlus, 
  FiMessageSquare, 
  FiSettings, 
  FiLogOut, 
  FiTrash2, 
  FiEdit3,
  FiMenu,
  FiX,
  FiUser,
  FiMoon,
  FiSun
} from 'react-icons/fi';
import './Sidebar.css';

const Sidebar = ({
  chats,
  currentChat,
  onChatSelect,
  onNewChat,
  onDeleteChat,
  onUpdateChatTitle,
  onShowSettings,
  collapsed,
  onToggleCollapse
}) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [editingChat, setEditingChat] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const handleStartEdit = (chat) => {
    setEditingChat(chat._id);
    setEditTitle(chat.title);
  };

  const handleSaveEdit = () => {
    if (editTitle.trim() && editingChat) {
      onUpdateChatTitle(editingChat, editTitle.trim());
    }
    setEditingChat(null);
    setEditTitle('');
  };

  const handleCancelEdit = () => {
    setEditingChat(null);
    setEditTitle('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Today';
    } else if (diffDays === 2) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {!collapsed && (
        <div 
          className="sidebar-overlay"
          onClick={onToggleCollapse}
        />
      )}
      
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        {/* Header */}
        <div className="sidebar-header">
          <div className="sidebar-title">
            <FiMessageSquare className="sidebar-logo" />
            {!collapsed && <h2>Murphy Chat</h2>}
          </div>
        </div>

        {/* New Chat Button */}
        <button
          className="new-chat-btn"
          onClick={onNewChat}
          title={collapsed ? 'New Chat' : ''}
        >
          <FiPlus />
          {!collapsed && <span>New Chat</span>}
        </button>

        {/* Chat List */}
        <div className="chat-list">
          {chats.length === 0 ? (
            !collapsed && (
              <div className="empty-chats">
                <p>No chats yet</p>
                <small>Start a new conversation</small>
              </div>
            )
          ) : (
            chats.map((chat) => (
              <div
                key={chat._id}
                className={`chat-item ${currentChat?._id === chat._id ? 'active' : ''}`}
                onClick={() => onChatSelect(chat._id)}
              >
                <div className="chat-item-content">
                  <FiMessageSquare className="chat-icon" />
                  {!collapsed && (
                    <div className="chat-details">
                      {editingChat === chat._id ? (
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onBlur={handleSaveEdit}
                          onKeyPress={handleKeyPress}
                          className="chat-title-input"
                          autoFocus
                        />
                      ) : (
                        <>
                          <span className="chat-title">{chat.title}</span>
                          <span className="chat-date">
                            {formatDate(chat.updatedAt)}
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </div>
                
                {!collapsed && currentChat?._id === chat._id && (
                  <div className="chat-actions">
                    <button
                      className="action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartEdit(chat);
                      }}
                      title="Edit title"
                    >
                      <FiEdit3 />
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteChat(chat._id);
                      }}
                      title="Delete chat"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* User Section */}
        <div className="sidebar-footer">
          <div className="user-section">
            <div className="user-info">
              <div className="user-avatar">
                <FiUser />
              </div>
              {!collapsed && (
                <div className="user-details">
                  <span className="user-name">{user?.name}</span>
                  <span className="user-email">{user?.email}</span>
                </div>
              )}
            </div>
            
            <div className="user-actions">
              <button
                className="action-btn"
                onClick={toggleTheme}
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? <FiMoon /> : <FiSun />}
              </button>
              
              {!collapsed && (
                <>
                  <button
                    className="action-btn"
                    onClick={onShowSettings}
                    title="Settings"
                  >
                    <FiSettings />
                  </button>
                  
                  <button
                    className="action-btn logout-btn"
                    onClick={logout}
                    title="Logout"
                  >
                    <FiLogOut />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
