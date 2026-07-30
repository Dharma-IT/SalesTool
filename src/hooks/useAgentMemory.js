import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'dharma_agent_memory';
const MAX_HISTORY = 20;

export function useAgentMemory(userId) {
  const [conversationHistory, setConversationHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_${userId}`);
      if (stored) {
        const data = JSON.parse(stored);
        setConversationHistory(data.conversationHistory || []);
      }
    } catch (e) {
      console.warn('Failed to load agent memory:', e);
    }
    setIsLoading(false);
  }, [userId]);

  const saveToStorage = useCallback((history) => {
    if (!userId) return;
    try {
      localStorage.setItem(`${STORAGE_KEY}_${userId}`, JSON.stringify({
        userId,
        conversationHistory: history,
        lastUpdated: Date.now()
      }));
    } catch (e) {
      console.warn('Failed to save agent memory:', e);
    }
  }, [userId]);

  const addMessage = useCallback((role, content) => {
    setConversationHistory(prev => {
      const newHistory = [
        ...prev,
        { role, content, timestamp: Date.now() }
      ];
      if (newHistory.length > MAX_HISTORY * 2) {
        return newHistory.slice(-MAX_HISTORY * 2);
      }
      saveToStorage(newHistory);
      return newHistory;
    });
  }, [saveToStorage]);

  const clearMemory = useCallback(() => {
    setConversationHistory([]);
    if (userId) {
      localStorage.removeItem(`${STORAGE_KEY}_${userId}`);
    }
  }, [userId]);

  const getMessagesForAPI = useCallback(() => {
    return conversationHistory.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
  }, [conversationHistory]);

  return {
    conversationHistory,
    isLoading,
    addMessage,
    clearMemory,
    getMessagesForAPI,
    hasMemory: conversationHistory.length > 0
  };
}