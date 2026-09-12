import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Mic, Send, Sparkles } from 'lucide-react';

export const AIAssistant: React.FC = () => {
  const { products, criticalStockCount, lowStockCount, todaySalesAmount } = useShop();
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: '🤖 Hello! I am your AI Smart Shop Assistant. Ask me about stock status, low stock items, or today\'s sales.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');

  const suggestedCommands = [
    'Check Stock',
    'Which products are critical?',
    'Show low stock',
    'How many almonds are available?',
    'What should I restock?',
    'Show today\'s sales'
  ];

  const handleSendQuery = (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text: queryText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    let aiReplyText = '';
    const q = queryText.toLowerCase();

    if (q.includes('critical')) {
      const criticalNames = products.filter(p => p.status === 'CRITICAL').map(p => p.name).join(', ');
      aiReplyText = criticalStockCount > 0 
        ? `${criticalStockCount} products need urgent restocking: ${criticalNames}.`
        : 'All product stock levels are currently normal! No critical stock detected.';
    } else if (q.includes('low')) {
      const lowNames = products.filter(p => p.status === 'LOW').map(p => p.name).join(', ');
      aiReplyText = lowStockCount > 0
        ? `${lowStockCount} products are near low threshold: ${lowNames}.`
        : 'No products are currently in LOW stock state.';
    } else if (q.includes('almonds') || q.includes('badam')) {
      const almond = products.find(p => p.name.toLowerCase().includes('almond'));
      aiReplyText = almond ? `${almond.name}: ${almond.quantity} ${almond.unit} remaining (${almond.status} stock).` : 'Almonds product not found in inventory.';
    } else if (q.includes('sales') || q.includes('today')) {
      aiReplyText = `Today's sales total: ₹${todaySalesAmount.toLocaleString('en-IN')}.`;
    } else {
      aiReplyText = `${criticalStockCount} products are critical, ${lowStockCount} are low. Total inventory tracked: ${products.length} products.`;
    }

    const aiMsg = {
      sender: 'ai' as const,
      text: aiReplyText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg, aiMsg]);
    setInputQuery('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: 'calc(100vh - 120px)' }}>
      <div>
        <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Sparkles style={{ color: 'var(--accent-primary)' }} />
          AI Smart Assistant & Voice Query
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
          Ask natural-language inventory queries or use voice commands
        </p>
      </div>

      <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1.25rem' }}>
        
        {/* Suggested Quick Commands */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 700, alignSelf: 'center' }}>
            Suggested:
          </span>
          {suggestedCommands.map((cmd, idx) => (
            <button
              key={idx}
              onClick={() => handleSendQuery(cmd)}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.78rem', padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-full)' }}
            >
              {cmd}
            </button>
          ))}
        </div>

        {/* Chat Messages Stream */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.5rem' }}>
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '80%',
                backgroundColor: msg.sender === 'user' ? 'var(--accent-primary)' : 'var(--bg-sidebar)',
                color: '#ffffff',
                padding: '0.85rem 1.15rem',
                borderRadius: 'var(--radius-lg)',
                border: msg.sender === 'ai' ? '1px solid var(--border-color)' : 'none',
                boxShadow: msg.sender === 'user' ? 'var(--shadow-glow-indigo)' : 'none'
              }}
            >
              <div style={{ fontSize: '0.92rem', fontWeight: 500 }}>{msg.text}</div>
              <div style={{ fontSize: '0.7rem', opacity: 0.7, marginTop: '0.3rem', textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
                {msg.time}
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar with Voice Mic Button */}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
          <button 
            className="btn btn-danger"
            style={{ borderRadius: '50%', width: '46px', height: '46px', padding: 0 }}
            title="Press to speak (Voice command)"
            onClick={() => handleSendQuery('Which products are critical?')}
          >
            <Mic size={20} />
          </button>

          <input
            type="text"
            className="form-input"
            placeholder="Type your natural language inventory query (e.g. 'Show low stock')..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendQuery(inputQuery)}
            style={{ flex: 1 }}
          />

          <button 
            onClick={() => handleSendQuery(inputQuery)}
            className="btn btn-primary"
            style={{ padding: '0 1.25rem' }}
          >
            <Send size={18} />
          </button>
        </div>

      </div>
    </div>
  );
};
