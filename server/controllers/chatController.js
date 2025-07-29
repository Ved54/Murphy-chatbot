const { GoogleGenerativeAI } = require('@google/generative-ai');
const Chat = require('../models/Chat');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Get all chats for a user
const getChats = async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.user._id, isActive: true })
      .select('title createdAt updatedAt')
      .sort({ updatedAt: -1 });

    res.json({ chats });
  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a specific chat with messages
const getChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    
    const chat = await Chat.findOne({
      _id: chatId,
      userId: req.user._id,
      isActive: true
    });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    res.json({ chat });
  } catch (error) {
    console.error('Get chat error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new chat
const createChat = async (req, res) => {
  try {
    const { title = 'New Chat' } = req.body;
    
    const chat = new Chat({
      userId: req.user._id,
      title,
      messages: []
    });

    await chat.save();
    res.status(201).json({ chat });
  } catch (error) {
    console.error('Create chat error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Send a message and get AI response
const sendMessage = async (req, res) => {
  try {
    const { chatId, message } = req.body;

    // Find or create chat
    let chat;
    if (chatId) {
      chat = await Chat.findOne({
        _id: chatId,
        userId: req.user._id,
        isActive: true
      });
      
      if (!chat) {
        return res.status(404).json({ message: 'Chat not found' });
      }
    } else {
      // Create new chat
      chat = new Chat({
        userId: req.user._id,
        title: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
        messages: []
      });
    }

    // Add user message
    chat.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date()
    });

    // Prepare conversation history for Gemini
    const conversationHistory = chat.messages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    try {
      // Get AI response from Gemini
      const geminiChat = model.startChat({
        history: conversationHistory.slice(0, -1) // Exclude the current message
      });

      const result = await geminiChat.sendMessage(message);
      const aiResponse = result.response.text();

      // Add AI response to chat
      chat.messages.push({
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      });

      // Save chat
      await chat.save();

      res.json({
        chat,
        newMessage: {
          role: 'assistant',
          content: aiResponse,
          timestamp: new Date()
        }
      });

    } catch (aiError) {
      console.error('Gemini AI error:', aiError);
      
      // Add error message to chat
      const errorMessage = 'Sorry, I encountered an error while processing your request. Please try again.';
      chat.messages.push({
        role: 'assistant',
        content: errorMessage,
        timestamp: new Date()
      });

      await chat.save();

      res.json({
        chat,
        newMessage: {
          role: 'assistant',
          content: errorMessage,
          timestamp: new Date()
        }
      });
    }

  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update chat title
const updateChatTitle = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { title } = req.body;

    const chat = await Chat.findOneAndUpdate(
      { _id: chatId, userId: req.user._id, isActive: true },
      { title },
      { new: true }
    ).select('title createdAt updatedAt');

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    res.json({ chat });
  } catch (error) {
    console.error('Update chat title error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a chat
const deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findOneAndUpdate(
      { _id: chatId, userId: req.user._id },
      { isActive: false },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    res.json({ message: 'Chat deleted successfully' });
  } catch (error) {
    console.error('Delete chat error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getChats,
  getChat,
  createChat,
  sendMessage,
  updateChatTitle,
  deleteChat
};
