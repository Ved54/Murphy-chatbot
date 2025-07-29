const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getChats,
  getChat,
  createChat,
  sendMessage,
  updateChatTitle,
  deleteChat
} = require('../controllers/chatController');

// @route   GET /api/chat
// @desc    Get all chats for user
// @access  Private
router.get('/', auth, getChats);

// @route   GET /api/chat/:chatId
// @desc    Get specific chat
// @access  Private
router.get('/:chatId', auth, getChat);

// @route   POST /api/chat
// @desc    Create new chat
// @access  Private
router.post('/', auth, createChat);

// @route   POST /api/chat/message
// @desc    Send message and get AI response
// @access  Private
router.post('/message', auth, sendMessage);

// @route   PUT /api/chat/:chatId/title
// @desc    Update chat title
// @access  Private
router.put('/:chatId/title', auth, updateChatTitle);

// @route   DELETE /api/chat/:chatId
// @desc    Delete chat
// @access  Private
router.delete('/:chatId', auth, deleteChat);

module.exports = router;
