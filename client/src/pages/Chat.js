import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import Settings from '../components/Settings';
import { chatAPI } from '../services/api';
import './Chat.css';

const Chat = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      const response = await chatAPI.getChats();
      setChats(response.data.chats);
    } catch (error) {
      console.error('Failed to load chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChatSelect = async (chatId) => {
    try {
      const response = await chatAPI.getChat(chatId);
      setCurrentChat(response.data.chat);
    } catch (error) {
      console.error('Failed to load chat:', error);
    }
  };

  const handleNewChat = async () => {
    try {
      const response = await chatAPI.createChat();
      const newChat = response.data.chat;
      setChats(prev => [newChat, ...prev]);
      setCurrentChat(newChat);
    } catch (error) {
      console.error('Failed to create new chat:', error);
    }
  };

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    const userMessage = {
      role: 'user',
      content: message.trim(),
      timestamp: new Date()
    };

    // If no current chat, create a temporary one
    let tempChat = currentChat;
    if (!tempChat) {
      tempChat = {
        _id: 'temp',
        title: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setCurrentChat(tempChat);
    }
    
    // Immediately add user message to UI
    const updatedTempChat = {
      ...tempChat,
      messages: [...tempChat.messages, userMessage]
    };
    setCurrentChat(updatedTempChat);

    try {
      const response = await chatAPI.sendMessage(currentChat?._id === 'temp' ? null : currentChat?._id, message);
      const finalChat = response.data.chat;
      
      // Update current chat with server response
      setCurrentChat(finalChat);
      
      // Update chats list
      setChats(prev => {
        const updatedChats = prev.map(chat => 
          chat._id === finalChat._id ? finalChat : chat
        );
        
        // If it's a new chat, add it to the list
        if (!prev.find(chat => chat._id === finalChat._id)) {
          return [finalChat, ...prev];
        }
        
        return updatedChats;
      });
      
    } catch (error) {
      console.error('Failed to send message:', error);
      
      // Add error message to chat
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      
      setCurrentChat(prev => ({
        ...prev,
        messages: [...prev.messages, errorMessage]
      }));
    }
  };

  const handleDeleteChat = async (chatId) => {
    try {
      await chatAPI.deleteChat(chatId);
      setChats(prev => prev.filter(chat => chat._id !== chatId));
      
      if (currentChat?._id === chatId) {
        setCurrentChat(null);
      }
    } catch (error) {
      console.error('Failed to delete chat:', error);
    }
  };

  const handleUpdateChatTitle = async (chatId, title) => {
    try {
      await chatAPI.updateChatTitle(chatId, title);
      setChats(prev => prev.map(chat => 
        chat._id === chatId ? { ...chat, title } : chat
      ));
      
      if (currentChat?._id === chatId) {
        setCurrentChat(prev => ({ ...prev, title }));
      }
    } catch (error) {
      console.error('Failed to update chat title:', error);
    }
  };

  if (loading) {
    return (
      <div className="chat-loading">
        <div className="spinner" />
        <p>Loading your chats...</p>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <Sidebar
        chats={chats}
        currentChat={currentChat}
        onChatSelect={handleChatSelect}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        onUpdateChatTitle={handleUpdateChatTitle}
        onShowSettings={() => setShowSettings(true)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <main className={`chat-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <ChatWindow
          chat={currentChat}
          onSendMessage={handleSendMessage}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </main>

      {showSettings && (
        <Settings
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
};

export default Chat;
