
import React, { useState } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ChatInterface } from './components/ChatInterface';
import { getFirstStep, getNextStep, explainStep } from './services/geminiService';
import { Message, Sender } from './types';

function App() {
  const [image, setImage] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const addMessage = (sender: Sender, text: string) => {
    setChatHistory(prev => [...prev, { id: Date.now().toString(), sender, text }]);
  };

  const handleImageUpload = async (imageData: string, fileType: string) => {
    setImage(imageData);
    setChatHistory([]);
    setError(null);
    setIsLoading(true);

    try {
      const firstStep = await getFirstStep(imageData, fileType);
      addMessage(Sender.AI, firstStep);
    } catch (e: any) {
      setError("Sorry, I couldn't analyze the image. Please try another one.");
      console.error(e);
      addMessage(Sender.AI, "I encountered an error. Please check the console and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextStep = async () => {
    addMessage(Sender.User, "What's the next step?");
    setIsLoading(true);
    setError(null);

    try {
      const nextStep = await getNextStep(chatHistory);
      addMessage(Sender.AI, nextStep);
    } catch (e: any) {
      setError("Sorry, I couldn't get the next step. Please try again.");
      console.error(e);
      addMessage(Sender.AI, "I encountered an error. Please check the console and try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleExplain = async () => {
    addMessage(Sender.User, "Why did we do that?");
    setIsLoading(true);
    setError(null);

    try {
      const explanation = await explainStep(chatHistory);
      addMessage(Sender.AI, explanation);
    } catch (e: any) {
      setError("Sorry, I couldn't generate an explanation. Please try again.");
      console.error(e);
      addMessage(Sender.AI, "I encountered an error while thinking. Please check the console and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-brand-text">Socratic Math Tutor <span className="text-brand-accent">AI</span></h1>
        <p className="mt-2 text-brand-text-dim">Your patient partner in problem-solving.</p>
      </header>

      <main className="w-full max-w-7xl flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="md:h-[calc(100vh-150px)]">
          <ImageUploader onImageUpload={handleImageUpload} image={image} isLoading={isLoading} />
        </div>
        <div className="md:h-[calc(100vh-150px)]">
          <ChatInterface 
            messages={chatHistory} 
            onNextStep={handleNextStep}
            onExplain={handleExplain}
            isLoading={isLoading}
            hasProblem={!!image}
          />
        </div>
      </main>

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}

export default App;
