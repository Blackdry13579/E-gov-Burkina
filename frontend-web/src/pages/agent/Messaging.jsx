import React, { useEffect, useState } from 'react';
import { getAgentMessages } from '../../services/api';
import { Send, Phone, Shield } from 'lucide-react';

const Messaging = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState('');

  useEffect(() => {
    getAgentMessages().then(d => { setMessages(d); setLoading(false); });
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg = { id: Date.now(), from: 'Moi', avatar: 'S', content: input, time: 'À l\'instant', isMe: true };
    setMessages(m => [...m, newMsg]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] max-w-3xl space-y-0">
      {/* Header */}
      <div className="bg-white rounded-t-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#1A237E] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          A
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900">Admin Central</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            <p className="text-xs text-green-600 font-medium">En ligne</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={(e) => { e.preventDefault(); alert('Fonctionnalité en cours de développement'); }} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-50 text-gray-400 transition-colors"><Phone size={15} /></button>
          <button onClick={(e) => { e.preventDefault(); alert('Fonctionnalité en cours de développement'); }} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-50 text-gray-400 transition-colors"><Shield size={15} /></button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-gray-50 border-x border-gray-100 px-4 py-4 space-y-3">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-4 border-[#1A237E]/30 border-t-[#1A237E] rounded-full animate-spin"></div>
          </div>
        ) : messages.map((msg) => (
          <div key={msg.id} className={`flex items-end gap-2 ${msg.isMe ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${msg.isMe ? 'bg-[#1A237E] text-white' : 'bg-gray-200 text-gray-600'}`}>
              {msg.avatar}
            </div>
            <div className={`max-w-xs lg:max-w-md ${msg.isMe ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
              <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                msg.isMe
                  ? 'bg-[#1A237E] text-white rounded-br-sm'
                  : 'bg-white text-gray-800 border border-gray-100 shadow-sm rounded-bl-sm'
              }`}>
                {msg.content}
              </div>
              <span className="text-xs text-gray-400 mx-1">{msg.time}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="bg-white rounded-b-2xl border border-t-0 border-gray-100 shadow-sm px-4 py-3 flex items-center gap-3">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Écrire un message à l'Admin Central..."
          className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1A237E]/20 focus:border-[#1A237E]"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#1A237E] text-white hover:bg-institutional transition-colors disabled:opacity-40 active:scale-95"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};

export default Messaging;
