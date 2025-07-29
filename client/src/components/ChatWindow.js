import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiMenu, FiUser, FiCpu } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './ChatWindow.css';

const ChatWindow = ({ chat, onSendMessage, onToggleSidebar }) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [message]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || isTyping) return;

    const userMessage = message.trim();
    setMessage('');
    setIsTyping(true);

    try {
      await onSendMessage(userMessage);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="chat-window">
      {/* Header */}
      <header className="chat-header">
        <button
          className="mobile-menu-btn"
          onClick={onToggleSidebar}
        >
          <FiMenu />
        </button>
        <div className="chat-info">
          <h1>{chat?.title || 'Murphy Chat'}</h1>
          <span className="chat-subtitle">
            Murphy - Your AI Assistant powered by Google Gemini
          </span>
        </div>
      </header>

      {/* Messages */}
      <div className="messages-container">
        {!chat || chat.messages.length === 0 ? (
          <div className="welcome-message">
            <div className="welcome-icon">
              <FiCpu />
            </div>
            <h2>Hi there! I'm Murphy 👋</h2>
            <p>I'm your AI assistant powered by Google Gemini API Key. Ask me anything, and I'll help you out!</p>
            <div className="example-prompts">
              <button 
                className="example-prompt"
                onClick={() => setMessage("What can you help me with?")}
              >
                What can you help me with?
              </button>
              <button 
                className="example-prompt"
                onClick={() => setMessage("Explain quantum computing")}
              >
                Explain quantum computing
              </button>
              <button 
                className="example-prompt"
                onClick={() => setMessage("Write a Python function")}
              >
                Write a Python function
              </button>
            </div>
          </div>
        ) : (
          <div className="messages">
            {chat.messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.role === 'user' ? 'user-message' : 'ai-message'}`}
              >
                <div className="message-avatar">
                  {msg.role === 'user' ? <FiUser /> : <FiCpu />}
                </div>
                <div className="message-content">
                  <div className="message-text">
                    {msg.role === 'assistant' ? (
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                          code: ({node, inline, className, children, ...props}) => {
                            return !inline ? (
                              <pre className="code-block">
                                <code className={className} {...props}>
                                  {children}
                                </code>
                              </pre>
                            ) : (
                              <code className="inline-code" {...props}>
                                {children}
                              </code>
                            );
                          },
                          p: ({children}) => <p style={{marginBottom: '0.5rem'}}>{children}</p>,
                          ul: ({children}) => <ul style={{marginLeft: '1rem', marginBottom: '0.5rem'}}>{children}</ul>,
                          ol: ({children}) => <ol style={{marginLeft: '1rem', marginBottom: '0.5rem'}}>{children}</ol>,
                          li: ({children}) => <li style={{marginBottom: '0.25rem'}}>{children}</li>,
                          h1: ({children}) => <h1 style={{fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem'}}>{children}</h1>,
                          h2: ({children}) => <h2 style={{fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem'}}>{children}</h2>,
                          h3: ({children}) => <h3 style={{fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.5rem'}}>{children}</h3>,
                          strong: ({children}) => <strong style={{fontWeight: 'bold'}}>{children}</strong>,
                          em: ({children}) => <em style={{fontStyle: 'italic'}}>{children}</em>
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    ) : (
                      msg.content
                    )}
                  </div>
                  <div className="message-time">
                    {formatTime(msg.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="message ai-message">
                <div className="message-avatar">
                  <FiCpu />
                </div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="chat-input-container">
        <form onSubmit={handleSubmit} className="chat-input-form">
          <div className="input-wrapper">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="message-input"
              rows={1}
              disabled={isTyping}
            />
            <button
              type="submit"
              className="send-button"
              disabled={!message.trim() || isTyping}
            >
              <FiSend />
            </button>
          </div>
        </form>
        <div className="input-footer">
          <small>Press Enter to send, Shift+Enter for new line</small>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
