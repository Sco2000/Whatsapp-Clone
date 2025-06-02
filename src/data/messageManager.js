import { DEFAULT_USER, getNextMessageId } from "../consts.js";

let CONVERSATIONS = {};

export function generateConversationId(item, type) {
  if (type === 'contact') {
    return `contact_${item.telephone}`;
  } else {
    return `group_${item.name}`;
  }
}

export function createMessage(content, sender, receiver, conversationId) {
  const now = new Date();
  const time = now.toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  return {
    id: getNextMessageId(),
    content: content,
    sender: sender,
    receiver: receiver,
    timestamp: now,
    time: time,
    conversationId: conversationId
  };
}

export function saveMessage(message, conversationId) {
  if (!CONVERSATIONS[conversationId]) {
    CONVERSATIONS[conversationId] = [];
  }
  CONVERSATIONS[conversationId].push(message);
}

export function loadMessages(conversationId) {
  return CONVERSATIONS[conversationId] || [];
}

export function getContactsWithConversations(contacts) {
  return contacts.filter(contact => {
    const conversationId = generateConversationId(contact, 'contact');
    return CONVERSATIONS[conversationId] && CONVERSATIONS[conversationId].length > 0;
  });
}

export function getGroupsWithConversations(groups) {
  return groups.filter(group => {
    const conversationId = generateConversationId(group, 'group');
    return CONVERSATIONS[conversationId] && CONVERSATIONS[conversationId].length > 0;
  });
}

export function getLastMessage(conversationId) {
  const messages = loadMessages(conversationId);
  if (messages.length === 0) return "Aucun message";
  
  const lastMessage = messages[messages.length - 1];
  return lastMessage.content.length > 30 
    ? lastMessage.content.substring(0, 30) + "..." 
    : lastMessage.content;
}

export function getLastMessageTime(conversationId) {
  const messages = loadMessages(conversationId);
  if (messages.length === 0) return "";
  
  const lastMessage = messages[messages.length - 1];
  return lastMessage.time;
}

export { CONVERSATIONS };