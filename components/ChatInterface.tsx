import React, { useRef, useEffect } from 'react';
import { Message, Sender } from '../types';
import { ArrowRightIcon, LightbulbIcon } from './icons';

interface ChatInterfaceProps {
  messages: Message[];
  onNextStep: () => void;
  onExplain: () => void;
  isLoading: boolean;
  hasProblem: boolean;
}

const LoadingIndicator: React.FC = () => (
    <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-brand-accent rounded-full animate-pulse [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-brand-accent rounded-full animate-pulse [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-brand-accent rounded-full animate-pulse"></div>
    </div>
);

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onNextStep, onExplain, isLoading, hasProblem }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="w-full h-full flex flex-col bg-brand-surface rounded-lg">
      <div className="flex-1 p-4 md:p-6 overflow-y-auto">
        {messages.length === 0 && !isLoading && !hasProblem ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <LightbulbIcon className="w-16 h-16 mb-4 text-brand-secondary" />
            <h3 className="text-xl font-semibold text-brand-text">Your Socratic Math Tutor</h3>
            <p className="mt-2 text-brand-text-dim">
              Hello! I'm here to help you understand math, one step at a time. Please upload a photo of a calculus or algebra problem to get started.
            </p>
          </div>
        ) : (
          <div className="flex flex-col space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === Sender.User ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg ${msg.sender === Sender.User ? 'bg-brand-accent text-white' : 'bg-brand-primary text-brand-text'}`}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                 <div className="max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg bg-brand-primary text-brand-text">
                  <LoadingIndicator />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      {hasProblem && (
        <div className="p-4 border-t border-brand-primary">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <button
              onClick={onNextStep}
              disabled={isLoading}
              className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-accent hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent disabled:bg-brand-primary disabled:cursor-not-allowed transition-colors"
            >
              <ArrowRightIcon className="h-5 w-5 mr-2" />
              What's the next step?
            </button>
            <button
              onClick={onExplain}
              disabled={isLoading}
              className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-brand-secondary text-sm font-medium rounded-md text-brand-text bg-brand-primary hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <LightbulbIcon className="h-5 w-5 mr-2" />
              Why did we do that?
            </button>
          </div>
        </div>
      )}
    </div>
  );
};