import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Sparkles, Send, Bot, Trash2, Minimize2 } from 'lucide-react';
import { chatWithAI, buildUserContextMessage } from '../utils/openRouterClient';
import { useAgentMemory } from '../hooks/useAgentMemory';

// Step labels for context-aware greeting
const STEP_LABELS = {
  1: 'selecting state',
  2: 'entering biometrics',
  3: 'completing medical screening',
  4: 'reviewing products',
  5: 'reviewing order',
};

function getGreeting(activeStep, eligibleProducts, selectedState, bmi) {
  const bmiVal = parseFloat(bmi);
  const hasBmi = bmiVal > 0;
  const hasState = !!selectedState;

  if (activeStep <= 1) {
    return `👋 Hi! I'm your Dharma Wellness Protocol Advisor.\n\nI'll give you personalized product recommendations once we collect a bit of info. Start by selecting the patient's state on the left, and I'll be here when you're ready!`;
  }
  if (activeStep === 2) {
    return `Great — state is set to **${selectedState}**! 🗺️\n\nNow enter the patient's biometrics (height & weight) and I'll be able to calculate their BMI and start narrowing down eligible products.`;
  }
  if (activeStep === 3) {
    return `Almost there! BMI is ${hasBmi ? `**${bmi}**` : 'calculated'} ✅\n\nComplete the medical screening so I can finalize which products are safe and eligible for this patient.`;
  }
  if (activeStep >= 4) {
    const count = eligibleProducts?.length || 0;
    if (count === 0) {
      return `I've reviewed this patient's full profile. Unfortunately, no prescription medications are currently eligible based on their location or medical history.\n\nHowever, I can still recommend **supplements and nutrition consultations** that are always available. What are their main health goals?`;
    }
    return `✅ Profile complete! I can see **${count} eligible product${count !== 1 ? 's' : ''}** for this patient.\n\nWhat are their primary health goals? (e.g., *lose weight, more energy, better sleep, build muscle*) — I'll build a tailored protocol from what's available to them.`;
  }
  return `Hi! I'm your Protocol Advisor. Complete the workflow steps and I'll provide personalized recommendations.`;
}

const RecommendationAgent = ({
  eligibleProducts,
  userState,
  bmi,
  isAsianDescent,
  selectedConditions,
  userId,
  activeStep,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState(null);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [lastStep, setLastStep] = useState(activeStep);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const {
    conversationHistory,
    addMessage,
    clearMemory,
    getMessagesForAPI,
    hasMemory,
  } = useAgentMemory(userId);

  const userProfile = {
    state: userState,
    bmi,
    isAsianDescent,
    selectedConditions,
    eligibleProducts: eligibleProducts || [],
    activeStep,
  };

  // Drag state
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef(null);
  const hasDragged = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) setTimeout(scrollToBottom, 100);
  }, [isOpen, conversationHistory]);

  // Auto-greet when opened fresh, or when step changes significantly
  useEffect(() => {
    if (isOpen && !hasGreeted && conversationHistory.length === 0) {
      const greeting = getGreeting(activeStep, eligibleProducts, userState, bmi);
      addMessage('assistant', greeting);
      setHasGreeted(true);
    }
  }, [isOpen, hasGreeted, conversationHistory.length]);

  // When step advances, add a smart context update message if chat is open
  useEffect(() => {
    if (activeStep !== lastStep) {
      setLastStep(activeStep);
      if (isOpen && hasGreeted && activeStep >= 4 && lastStep < 4) {
        const count = eligibleProducts?.length || 0;
        const updateMsg = count > 0
          ? `🎉 Profile complete! I can now see **${count} eligible product${count !== 1 ? 's' : ''}** for this patient. What are their health goals?`
          : `✅ Screening complete. No prescription medications are currently eligible, but supplements and nutrition consultations are still available. What goals does the patient have?`;
        addMessage('assistant', updateMsg);
      }
    }
  }, [activeStep]);

  const sendMessage = async (messageText) => {
    if (!messageText.trim() || isThinking) return;

    const userMessage = messageText.trim();
    setInputValue('');
    setError(null);
    setIsThinking(true);

    // ✅ Capture EXISTING history BEFORE addMessage so the user turn isn't doubled in the API call
    const existingHistory = getMessagesForAPI();

    // Add to display history
    addMessage('user', userMessage);

    try {
      const contextBlock = buildUserContextMessage(userProfile);

      // Build API payload: prior history + new user message with context prepended
      const messagesWithContext = [
        ...existingHistory,
        {
          role: 'user',
          content: `[PATIENT CONTEXT]\n${contextBlock}\n\n[QUESTION]\n${userMessage}`,
        },
      ];

      const response = await chatWithAI(messagesWithContext);
      addMessage('assistant', response);
    } catch (err) {
      console.error('AI chat error:', err);
      setError(err.message);
      addMessage('assistant', `Sorry, I ran into an issue: ${err.message}\n\nPlease try again.`);
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const handleClearMemory = () => {
    clearMemory();
    setHasGreeted(false);
  };

  // ── Drag Logic ──
  const startDrag = (clientX, clientY) => {
    setIsDragging(true);
    hasDragged.current = false;
    dragRef.current = {
      startX: clientX - position.x,
      startY: clientY - position.y,
      initX: clientX,
      initY: clientY,
    };
  };

  const onMouseDown = (e) => { e.preventDefault(); startDrag(e.clientX, e.clientY); };
  const onTouchStart = (e) => { if (e.touches.length === 1) startDrag(e.touches[0].clientX, e.touches[0].clientY); };

  const handleButtonClick = (e) => {
    if (hasDragged.current) {
      e.preventDefault();
      e.stopPropagation();
      setTimeout(() => hasDragged.current = false, 100);
      return;
    }
    if (isOpen) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
      setIsMinimized(false);
    }
  };

  useEffect(() => {
    if (!isDragging) return;
    const handleMouseMove = (e) => {
      if (!dragRef.current) return;
      const dx = Math.abs(e.clientX - dragRef.current.initX);
      const dy = Math.abs(e.clientY - dragRef.current.initY);
      if (dx > 3 || dy > 3) hasDragged.current = true;
      if (hasDragged.current) {
        setPosition({ x: e.clientX - dragRef.current.startX, y: e.clientY - dragRef.current.startY });
      }
    };
    const handleTouchMove = (e) => {
      if (!dragRef.current || e.touches.length !== 1) return;
      const dx = Math.abs(e.touches[0].clientX - dragRef.current.initX);
      const dy = Math.abs(e.touches[0].clientY - dragRef.current.initY);
      if (dx > 3 || dy > 3) hasDragged.current = true;
      if (hasDragged.current) {
        setPosition({ x: e.touches[0].clientX - dragRef.current.startX, y: e.touches[0].clientY - dragRef.current.startY });
      }
    };
    const handleMouseUp = () => { setIsDragging(false); dragRef.current = null; };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  // ── Render helpers ──
  const renderThinkingIndicator = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '12px 16px' }}>
      <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
        {[0, 0.16, 0.32].map((delay, i) => (
          <span key={i} style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #14532d, #22c55e)',
            animation: `bounce 1.4s infinite ease-in-out both ${delay}s`
          }} />
        ))}
      </div>
      <span style={{ fontSize: '0.83rem', marginLeft: '8px', color: 'var(--text-muted)' }}>Thinking...</span>
      <style>{`@keyframes bounce { 0%,80%,100%{transform:scale(0)} 40%{transform:scale(1)} }`}</style>
    </div>
  );

  // Format message with basic markdown-like rendering
  const renderMessageContent = (content) => {
    const parts = content.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      // Handle newlines
      return part.split('\n').map((line, j, arr) => (
        <React.Fragment key={`${i}-${j}`}>
          {line}
          {j < arr.length - 1 && <br />}
        </React.Fragment>
      ));
    });
  };

  // Unread badge — track if there's been a new assistant message while closed
  const [unreadCount, setUnreadCount] = useState(0);
  const prevHistoryLen = useRef(conversationHistory.length);
  useEffect(() => {
    if (!isOpen && conversationHistory.length > prevHistoryLen.current) {
      const newMsgs = conversationHistory.slice(prevHistoryLen.current);
      const newAssistant = newMsgs.filter(m => m.role === 'assistant').length;
      if (newAssistant > 0) setUnreadCount(c => c + newAssistant);
    }
    if (isOpen) setUnreadCount(0);
    prevHistoryLen.current = conversationHistory.length;
  }, [conversationHistory, isOpen]);

  const stepLabel = STEP_LABELS[activeStep] || 'workflow';

  return (
    <div style={{
      position: 'fixed',
      bottom: '2rem',
      right: '2rem',
      zIndex: 9999,
      transform: `translate(${position.x}px, ${position.y}px)`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      pointerEvents: 'none',
    }}>
      {/* Chat Panel */}
      {isOpen && (
        <div style={{
          pointerEvents: 'auto',
          width: '390px',
          height: isMinimized ? '0' : '560px',
          maxHeight: isMinimized ? '0' : 'calc(100vh - 130px)',
          overflow: isMinimized ? 'hidden' : 'hidden',
          background: 'rgba(255, 255, 255, 0.97)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          boxShadow: isDragging ? '0 30px 60px rgba(0,0,0,0.25)' : '0 20px 50px rgba(0,0,0,0.18)',
          border: '1px solid rgba(20,83,45,0.12)',
          display: 'flex',
          flexDirection: 'column',
          marginBottom: '1rem',
          transition: isDragging ? 'none' : 'box-shadow 0.2s, height 0.3s ease',
        }}>

          {/* Header */}
          <div
            onMouseDown={onMouseDown}
            onTouchStart={onTouchStart}
            style={{
              background: 'linear-gradient(135deg, #14532d 0%, #166534 60%, #15803d 100%)',
              color: 'white',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: isDragging ? 'grabbing' : 'grab',
              userSelect: 'none',
              touchAction: 'none',
              flexShrink: 0,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                background: 'rgba(255,255,255,0.15)',
                padding: '8px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Sparkles size={22} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', letterSpacing: '-0.01em' }}>Protocol Advisor</h3>
                <p style={{ margin: 0, fontSize: '0.72rem', opacity: 0.75 }}>
                  Step {activeStep}/5 — {stepLabel}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {hasMemory && (
                <button
                  onClick={(e) => { e.stopPropagation(); handleClearMemory(); }}
                  style={headerBtnStyle}
                  title="Clear Chat"
                >
                  <Trash2 size={16} />
                </button>
              )}
              <button
                onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}
                style={headerBtnStyle}
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                <Minimize2 size={16} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                style={headerBtnStyle}
                title="Close"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Messages */}
          {!isMinimized && (
            <>
              <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {conversationHistory.length === 0 && !isThinking && (
                  <div style={assistantBubbleStyle}>
                    <p style={{ margin: 0, fontSize: '0.92rem', color: '#374151', lineHeight: 1.55 }}>
                      {getGreeting(activeStep, eligibleProducts, userState, bmi).split('\n').map((l, i, a) => (
                        <React.Fragment key={i}>{l}{i < a.length - 1 && <br />}</React.Fragment>
                      ))}
                    </p>
                  </div>
                )}

                {conversationHistory.map((msg, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  }}>
                    <div style={msg.role === 'user' ? userBubbleStyle : assistantBubbleStyle}>
                      <p style={{ margin: 0, fontSize: '0.92rem', lineHeight: 1.55, color: msg.role === 'user' ? 'white' : '#1f2937' }}>
                        {renderMessageContent(msg.content)}
                      </p>
                    </div>
                  </div>
                ))}

                {isThinking && renderThinkingIndicator()}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Suggestion Chips — shown only when no conversation yet */}
              {conversationHistory.length <= 1 && activeStep >= 4 && (
                <div style={{ padding: '0 1rem 0.75rem', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {['Lose Weight', 'More Energy', 'Build Muscle', 'Better Sleep', 'Improve Hair & Skin'].map((goal) => (
                    <button
                      key={goal}
                      onClick={() => sendMessage(`What do you recommend for: ${goal}?`)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        border: '1px solid rgba(20,83,45,0.25)',
                        background: 'rgba(20,83,45,0.06)',
                        color: '#14532d',
                        fontSize: '0.78rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        fontFamily: 'inherit',
                        whiteSpace: 'nowrap',
                      }}
                      onMouseEnter={e => { e.target.style.background = 'rgba(20,83,45,0.12)'; e.target.style.borderColor = 'rgba(20,83,45,0.4)'; }}
                      onMouseLeave={e => { e.target.style.background = 'rgba(20,83,45,0.06)'; e.target.style.borderColor = 'rgba(20,83,45,0.25)'; }}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <div style={{
                padding: '0.875rem 1rem',
                borderTop: '1px solid rgba(0,0,0,0.07)',
                display: 'flex',
                gap: '8px',
                flexShrink: 0,
                background: 'rgba(249,250,251,0.8)',
              }}>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={activeStep < 3 ? "Ask anything while we gather info..." : "Ask about goals, eligibility..."}
                  disabled={isThinking}
                  style={{
                    flex: 1,
                    padding: '11px 16px',
                    borderRadius: '24px',
                    border: '1.5px solid rgba(20,83,45,0.2)',
                    fontSize: '0.9rem',
                    outline: 'none',
                    fontFamily: 'inherit',
                    background: 'white',
                    color: '#1f2937',
                    transition: 'border-color 0.15s',
                  }}
                  onFocus={e => e.target.style.borderColor = '#14532d'}
                  onBlur={e => e.target.style.borderColor = 'rgba(20,83,45,0.2)'}
                />
                <button
                  onClick={() => sendMessage(inputValue)}
                  disabled={isThinking || !inputValue.trim()}
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: inputValue.trim() && !isThinking
                      ? 'linear-gradient(135deg, #14532d, #15803d)'
                      : 'rgba(0,0,0,0.08)',
                    color: inputValue.trim() && !isThinking ? 'white' : 'rgba(0,0,0,0.3)',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: inputValue.trim() && !isThinking ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s',
                    flexShrink: 0,
                    boxShadow: inputValue.trim() && !isThinking ? '0 4px 12px rgba(20,83,45,0.3)' : 'none',
                  }}
                >
                  <Send size={18} />
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={handleButtonClick}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        style={{
          pointerEvents: 'auto',
          position: 'relative',
          width: '62px',
          height: '62px',
          borderRadius: '50%',
          background: isOpen
            ? 'linear-gradient(135deg, #1e3a2f, #14532d)'
            : 'linear-gradient(135deg, #14532d, #166534)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isOpen
            ? '0 6px 20px rgba(20,83,45,0.35)'
            : '0 10px 30px rgba(20,83,45,0.45)',
          border: '2.5px solid rgba(255,255,255,0.25)',
          cursor: isDragging ? 'grabbing' : 'pointer',
          transition: isDragging ? 'none' : 'all 0.3s ease',
          transform: isOpen ? 'scale(0.9)' : 'scale(1)',
          touchAction: 'none',
        }}
        title="Protocol Advisor"
      >
        {isOpen ? <X size={26} /> : <MessageCircle size={26} />}

        {/* Unread badge */}
        {!isOpen && unreadCount > 0 && (
          <div style={{
            position: 'absolute',
            top: '-2px',
            right: '-2px',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: '#ef4444',
            color: 'white',
            fontSize: '0.7rem',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid white',
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}

        {/* Pulse ring when not open */}
        {!isOpen && (
          <div style={{
            position: 'absolute',
            inset: '-6px',
            borderRadius: '50%',
            border: '2px solid rgba(20,83,45,0.3)',
            animation: 'pulse-ring 2.5s ease-out infinite',
            pointerEvents: 'none',
          }} />
        )}
        <style>{`
          @keyframes pulse-ring {
            0% { transform: scale(0.95); opacity: 0.8; }
            70% { transform: scale(1.15); opacity: 0; }
            100% { transform: scale(1.15); opacity: 0; }
          }
        `}</style>
      </button>
    </div>
  );
};

// Style constants
const headerBtnStyle = {
  background: 'rgba(255,255,255,0.15)',
  border: 'none',
  borderRadius: '8px',
  padding: '7px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  transition: 'background 0.15s',
};

const assistantBubbleStyle = {
  maxWidth: '88%',
  padding: '12px 15px',
  borderRadius: '18px 18px 18px 4px',
  background: 'rgba(20,83,45,0.06)',
  border: '1px solid rgba(20,83,45,0.1)',
};

const userBubbleStyle = {
  maxWidth: '80%',
  padding: '12px 15px',
  borderRadius: '18px 18px 4px 18px',
  background: 'linear-gradient(135deg, #14532d, #166534)',
};

export default RecommendationAgent;