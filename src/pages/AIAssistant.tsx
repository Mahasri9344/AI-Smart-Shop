import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { voiceService, type VoiceState } from '../services/voiceService';
import { AIService } from '../services/aiService';
import { Mic, Send, Sparkles, Volume2, AlertCircle, StopCircle } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  time: string;
}

export const AIAssistant: React.FC = () => {
  const { products, sales, purchases } = useShop();
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: '🤖 Hello! I am your AI Smart Shop Assistant. Ask me about stock status, low stock items, or today\'s sales.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const suggestedCommands = [
    'Check Stock',
    'Which products are critical?',
    'Show low stock',
    'What should I restock?',
    'How many almonds are available?',
    'Show today\'s sales'
  ];

  // Stop speech synthesis if component unmounts
  useEffect(() => {
    return () => {
      voiceService.stopListening();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSpeakText = (textToSpeak: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleStopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Toggle REAL microphone-based speech recognition
  const handleMicToggle = () => {
    setErrorMessage(null);

    voiceService.toggleListening({
      onStateChange: (state) => {
        setVoiceState(state);
      },
      onResult: (recognizedSpeech) => {
        // Requirement 7 & 8: Put ONLY recognized real speech into input box. Do NOT auto-submit.
        if (recognizedSpeech && recognizedSpeech.trim().length > 0) {
          setInputQuery(recognizedSpeech.trim());
        }
      },
      onError: (err) => {
        setErrorMessage(err);
        setVoiceState('idle');
      }
    });
  };

  const handleSendQuery = (textQuery?: string) => {
    const queryToProcess = (textQuery !== undefined ? textQuery : inputQuery).trim();
    if (!queryToProcess) return;

    // 1. Append User Message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: queryToProcess,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // 2. Process query via AIService
    const aiResult = AIService.processQuery(queryToProcess, products, sales, purchases);

    const aiMsg: ChatMessage = {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text: aiResult.text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg, aiMsg]);
    setInputQuery('');

    // Automatically speak AI short response for accessibility
    handleSpeakText(aiResult.text);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: 'calc(100vh - 120px)' }}>
      {/* Header Title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Sparkles style={{ color: 'var(--accent-primary)' }} />
            AI Smart Assistant & Voice Interface
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Ask questions using natural language or real voice commands
          </p>
        </div>

        {isSpeaking && (
          <button 
            onClick={handleStopSpeaking}
            className="btn btn-secondary btn-sm"
            style={{ color: 'var(--status-critical)', borderColor: 'var(--status-critical-border)' }}
          >
            <StopCircle size={16} />
            <span>Stop Audio Output</span>
          </button>
        )}
      </div>

      {/* Main Chat Container */}
      <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1.25rem', overflow: 'hidden' }}>
        
        {/* Suggested Command Chips */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 700, alignSelf: 'center' }}>
            Suggested:
          </span>
          {suggestedCommands.map((cmd, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputQuery(cmd);
              }}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.78rem', padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-full)' }}
            >
              {cmd}
            </button>
          ))}
        </div>

        {/* Error / Warning Notice Bar */}
        {errorMessage && (
          <div style={{
            padding: '0.75rem 1rem',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid var(--status-critical-border)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--status-critical)',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1rem'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span style={{ flex: 1 }}>{errorMessage}</span>
            <button 
              onClick={() => setErrorMessage(null)} 
              style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontWeight: 700 }}
            >
              ×
            </button>
          </div>
        )}

        {/* Messages Stream */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.5rem' }}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '80%',
                backgroundColor: msg.sender === 'user' ? 'var(--accent-primary)' : '#F0FDFA',
                color: msg.sender === 'user' ? '#ffffff' : '#172033',
                padding: '0.85rem 1.15rem',
                borderRadius: 'var(--radius-lg)',
                border: msg.sender === 'ai' ? '1px solid #CCFBF1' : 'none',
                boxShadow: msg.sender === 'user' ? '0 2px 6px rgba(15, 118, 110, 0.25)' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                <div style={{ fontSize: '0.92rem', fontWeight: 500 }}>{msg.text}</div>
                {msg.sender === 'ai' && (
                  <button 
                    onClick={() => handleSpeakText(msg.text)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '2px' }}
                    title="Speak response"
                  >
                    <Volume2 size={15} />
                  </button>
                )}
              </div>
              <div style={{ fontSize: '0.7rem', opacity: 0.7, marginTop: '0.35rem', textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
                {msg.time}
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Voice Status Indicator Bar */}
        {voiceState === 'listening' && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.65rem 1rem',
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid var(--status-critical-border)',
            borderRadius: 'var(--radius-md)',
            marginTop: '0.75rem',
            color: 'var(--status-critical)',
            fontSize: '0.88rem',
            fontWeight: 700,
            animation: 'pulseRed 1.5s infinite'
          }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: 'var(--status-critical)',
              animation: 'pulseRed 1s infinite'
            }} />
            <span>Listening to your voice... Speak your question now.</span>
          </div>
        )}

        {/* Input Bar with REAL Voice Mic Toggle */}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
          <button 
            onClick={handleMicToggle}
            className={`btn ${voiceState === 'listening' ? 'btn-danger' : 'btn-secondary'}`}
            style={{ 
              borderRadius: '50%', 
              width: '46px', 
              height: '46px', 
              padding: 0,
              flexShrink: 0,
              boxShadow: voiceState === 'listening' ? 'var(--shadow-glow-red)' : 'none'
            }}
            title={voiceState === 'listening' ? "Click to stop listening" : "Click to start real voice input"}
          >
            <Mic size={20} style={{ color: voiceState === 'listening' ? '#ffffff' : 'var(--accent-primary)' }} />
          </button>

          <input
            type="text"
            className="form-input"
            placeholder={voiceState === 'listening' ? "Listening... your speech will appear here..." : "Type your natural language query or click microphone..."}
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendQuery()}
            style={{ flex: 1 }}
          />

          <button 
            onClick={() => handleSendQuery()}
            className="btn btn-primary"
            style={{ padding: '0 1.25rem', flexShrink: 0 }}
          >
            <Send size={18} />
          </button>
        </div>

      </div>
    </div>
  );
};
