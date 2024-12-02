import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Paperclip, Smile } from 'lucide-react';
import ChatMessage from './ChatMessage';
import { sendMessage } from '../../services/chatApi';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    setMessages((prev) => [
      ...prev,
      {
        text: userMessage,
        isUser: true,
        timestamp: new Date(),
      },
    ]);

    try {
      const response = await sendMessage(userMessage);

      setMessages((prev) => [
        ...prev,
        {
          text:
            response.success && response.data
              ? response.data.answer
              : response.error ||
                'Algo deu errado. Por favor, tente novamente.',
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          text: 'Falha ao enviar mensagem. Por favor, tente novamente.',
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-secondary-50 dark:bg-secondary-900 transition-colors duration-200">
      {/* Header */}
      <div className="flex-none p-6 border-b border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 transition-colors duration-200">
        <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100">
          OS⁸
        </h2>
        <p className="text-sm text-secondary-500 dark:text-secondary-400">
          Seu sistema ERP personalizado
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-secondary-500 dark:text-secondary-400">
            <p className="text-lg font-medium mb-2">Bem-vindo ao OS⁸!</p>
            <p className="text-sm">O que vamos fazer hoje?</p>
          </div>
        )}
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message.text}
            isUser={message.isUser}
            timestamp={message.timestamp}
          />
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-primary-500 dark:text-primary-400 p-4">
            <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
            <div
              className="w-2 h-2 bg-current rounded-full animate-bounce"
              style={{ animationDelay: '0.2s' }}
            />
            <div
              className="w-2 h-2 bg-current rounded-full animate-bounce"
              style={{ animationDelay: '0.4s' }}
            />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="flex-none p-4 bg-white dark:bg-secondary-800 border-t border-secondary-200 dark:border-secondary-700 transition-colors duration-200">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex gap-3 items-center">
            <button
              type="button"
              className="p-2.5 text-secondary-500 dark:text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-full transition-colors"
              title="Anexar arquivo"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="p-2.5 text-secondary-500 dark:text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-full transition-colors"
              title="Inserir emoji"
            >
              <Smile className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="w-full px-4 py-3 bg-secondary-100 dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100 placeholder-secondary-500 dark:placeholder-secondary-400 border border-secondary-200 dark:border-secondary-600 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent transition-colors duration-200"
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-3 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-400 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-secondary-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              title="Enviar mensagem"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
