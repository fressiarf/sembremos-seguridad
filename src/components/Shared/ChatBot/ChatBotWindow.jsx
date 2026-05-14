import React, { useState } from 'react';
import { Bot, X, Send } from 'lucide-react';
import './ChatBotWindow.css';

const ChatBotWindow = ({ onClose, user }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: `Hola ${user?.nombre || 'Usuario Sembremos'}, soy el asistente de Sembremos Seguridad. ¿En qué puedo ayudarte hoy?`, isBot: true }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const userMessage = { id: Date.now(), text: inputMsg, isBot: false };
    setMessages(prev => [...prev, userMessage]);
    setInputMsg('');
    setIsTyping(true);

    // Lógica Simple de Bot
    setTimeout(() => {
      let botResponse = "Recibido. Consultaré con el personal central y te responderé en breve.";
      
      const text = inputMsg.toLowerCase();
      if (text.includes('acceso') || text.includes('usuario')) {
        botResponse = "Los accesos son gestionados en el módulo 'Gestión de Usuarios'. Si eres personal operativo, contacta a tu enlace institucional.";
      } else if (text.includes('ayuda') || text.includes('soporte')) {
        botResponse = "Puedes usar el canal oficial de 'Soporte y Comentarios' para registrar una incidencia técnica.";
      } else if (text.includes('hola')) {
        botResponse = `¡Hola ${user?.nombre}! Estoy aquí para ayudarte con la navegación y consultas técnicas.`;
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, text: botResponse, isBot: true }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="chatbot-window animacion-entrada">
      <div className="chatbot-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="bot-avatar-header">
            <Bot size={16} color="#fff" />
          </div>
          <div>
            <h3>Asistente Virtual</h3>
            <span className="online-indicator">Online</span>
          </div>
        </div>
        <button className="btn-close-chat" onClick={onClose}><X size={16} /></button>
      </div>

      <div className="chatbot-body">
        {messages.map(m => (
          <div key={m.id} className={`message-bubble ${m.isBot ? 'bot' : 'user'}`}>
            {m.isBot && <Bot size={12} style={{ marginBottom: '4px' }} />}
            <p>{m.text}</p>
          </div>
        ))}
        {isTyping && <div className="typing-dot">...</div>}
      </div>

      <form className="chatbot-footer" onSubmit={sendMessage}>
        <input 
          type="text" 
          placeholder="Escribre un mensaje..." 
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
        />
        <button type="submit" disabled={!inputMsg.trim()}>
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};

export default ChatBotWindow;
