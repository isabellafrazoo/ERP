import React from 'react';
import { User, Bot } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ChatMessage({ message, isUser, timestamp }: ChatMessageProps) {
  return (
    <div className={`flex gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-6 max-w-4xl mx-auto w-full`}>
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
        isUser ? 'bg-primary-500' : 'bg-secondary-500 dark:bg-secondary-600'
      } transition-colors duration-200`}>
        {isUser ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
      </div>
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[80%]`}>
        <div className={`rounded-2xl px-6 py-3 ${
          isUser 
            ? 'bg-primary-500 text-white' 
            : 'bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100 shadow-soft dark:shadow-none'
        } transition-colors duration-200`}>
          {message}
        </div>
        <span className="text-xs text-secondary-500 dark:text-secondary-400 mt-2 px-2">
          {format(timestamp, "HH:mm", { locale: ptBR })}
        </span>
      </div>
    </div>
  );
}